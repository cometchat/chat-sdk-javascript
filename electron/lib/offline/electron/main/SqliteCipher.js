"use strict";
/**
 * Whole-file cache encryption for the Electron main process — the `COV-WHOLE` / `KEY-HW` tier.
 *
 * Two jobs, both deliberately kept out of `SqliteEngine` so they can be tested without an Electron
 * runtime: custody of the data key, and applying it to a database in a way that PROVES it took.
 *
 * ## Where the key lives
 *
 * 32 CSPRNG bytes, sealed by `safeStorage.encryptString()` — the OS secret store (Keychain on macOS,
 * DPAPI on Windows, libsecret on Linux) — and written beside the database as a sidecar file. It is
 * unsealed and used ENTIRELY in the main process; the renderer never receives key material and no key
 * ever crosses IPC. That is strictly stronger than the browser tier.
 *
 * `safeStorage` is a main-process API, so all of this is unavailable in a renderer by construction.
 *
 * ## Backups
 *
 * There is no portable "exclude from backup" flag for `userData`, and none is needed: every
 * `safeStorage` backend binds its ciphertext to this machine and login. A sidecar restored onto
 * another device fails to unseal, so the restored database stays closed and inert. Because the same
 * failure can also mean a locked secret store, the key is not deleted then: the open is counted once per
 * launch and the third launch wipes and rebuilds (see {@link KeyUnsealError}).
 *
 * @module offline/electron/main/SqliteCipher
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyMainOpenFailure = exports.probeReadable = exports.applyKeyAndProve = exports.engineVersion = exports.DatabaseUnreadableError = exports.destroyDbKey = exports.loadOrCreateDbKey = exports.toHexKeyPragma = exports.isWeakSafeStorageBackend = exports.KeyUnsealError = exports.KeyVaultTransientError = exports.CIPHER_SCHEME = exports.ELECTRON_CIPHER = exports.DB_KEY_BYTES = void 0;
const OfflineCrypto_1 = require("../../crypto/OfflineCrypto");
/** Bytes in the raw database key. SQLCipher's raw-key form is exactly this, hex-encoded. */
exports.DB_KEY_BYTES = 32;
/** Reported by the status API for this tier. */
exports.ELECTRON_CIPHER = "AES-256-CBC/HMAC-SHA512 (SQLCipher scheme via SQLite3 Multiple Ciphers, whole file)";
/**
 * The cipher scheme to select.
 *
 * SQLite3 Multiple Ciphers supports several schemes and defaults to **chacha20**, not SQLCipher. It
 * must therefore be chosen explicitly: every other CometChat SDK writes SQLCipher-format databases,
 * and silently using a different scheme here would leave Electron the odd one out while the status
 * API still claimed SQLCipher.
 */
exports.CIPHER_SCHEME = "sqlcipher";
/** A momentary vault/disk problem. Retry next open; NEVER wipe over one. */
class KeyVaultTransientError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, KeyVaultTransientError.prototype);
        this.name = "KeyVaultTransientError";
    }
}
exports.KeyVaultTransientError = KeyVaultTransientError;
/**
 * The sealed key file exists but did not unseal. Nothing was deleted, and no new key was minted: a locked
 * secret store and a lost key can throw the same error, and the key cannot be got back once deleted.
 *
 *  - `TRANSIENT`: the secret store is locked or not working. No store this launch, retried on the next
 *    open, never counted toward a wipe.
 *  - `UNCLASSIFIED`: the secret store works, yet this file does not unseal under it (a moved profile, a
 *    restored backup, a damaged file). Counted once per launch; the third launch wipes the store, key
 *    first, and rebuilds it under a fresh key, so a moved profile recovers.
 */
class KeyUnsealError extends Error {
    constructor(message, failureClass) {
        super(message);
        Object.setPrototypeOf(this, KeyUnsealError.prototype);
        this.name = "KeyUnsealError";
        this.failureClass = failureClass;
    }
}
exports.KeyUnsealError = KeyUnsealError;
/**
 * Does `safeStorage` hold its key in a real OS secret store?
 *
 * On Linux, when no keyring is reachable, Electron can fall back to the `basic_text` backend. It
 * still reports `isEncryptionAvailable() === true`, but the "sealing" key is a hard-coded constant —
 * anyone who can read the sidecar can unseal it. That is not a secret (BEH-ENC-07 / BEH-ENC-14), so it
 * is treated exactly like "encryption unavailable": the store is never keyed with it and the status
 * API can never report `keyStorage: "KEYSTORE"` for it.
 */
function isWeakSafeStorageBackend(ss, platform) {
    const plat = platform != null ? platform : typeof process !== "undefined" ? process.platform : "";
    // On Linux an Electron too old to report its backend (getSelectedStorageBackend arrived in
    // Electron 25) cannot prove it is not `basic_text`, so it is treated as weak — never KEYSTORE. On
    // macOS / Windows safeStorage is always the OS store (Keychain / DPAPI).
    if (typeof ss.getSelectedStorageBackend !== "function")
        return plat === "linux";
    let backend;
    try {
        backend = ss.getSelectedStorageBackend();
    }
    catch (e) {
        return plat === "linux"; // cannot tell on Linux → weak; elsewhere the OS store is the only backend
    }
    return backend === "basic_text";
}
exports.isWeakSafeStorageBackend = isWeakSafeStorageBackend;
/** Lowercase hex of a byte buffer. */
function toHex(bytes) {
    if (bytes && typeof bytes.toString === "function" && bytes.length !== undefined) {
        // Node Buffer takes the fast path; a plain Uint8Array falls through to the manual loop.
        try {
            const s = bytes.toString("hex");
            if (typeof s === "string" && s.length === bytes.length * 2)
                return s;
        }
        catch (e) {
            /* fall through */
        }
    }
    let out = "";
    for (let i = 0; i < bytes.length; i++) {
        const h = bytes[i].toString(16);
        out += h.length === 1 ? "0" + h : h;
    }
    return out;
}
/**
 * The RAW-key pragma for a hex key: `hexkey='<64 hex>'`.
 *
 * `hexkey` and `key` are NOT interchangeable, and picking the wrong one is invisible. `hexkey` takes
 * the 64 hex characters as 32 raw key bytes. `key` takes them as a **passphrase** and derives a key
 * from it — 256,000 rounds of PBKDF2 on EVERY open, forever, with no error and no warning. Same
 * characters, same apparent success, dramatically slower.
 *
 * The length/charset check exists for the same reason: anything that is not exactly 64 lowercase hex
 * characters cannot be raw key material, so it is refused rather than quietly reinterpreted. A
 * benchmark asserts the passphrase path really is orders of magnitude slower, so this stays
 * detectable.
 *
 * (SQLCipher's own CLI spells the raw form `x'<hex>'`; SQLite3 Multiple Ciphers spells it `hexkey`.
 * Same 32 bytes, same no-KDF guarantee .)
 */
function toHexKeyPragma(keyHex) {
    if (!/^[0-9a-f]{64}$/.test(keyHex)) {
        throw new Error("Offline encryption: the database key must be 64 lowercase hex characters");
    }
    return "hexkey='" + keyHex + "'";
}
exports.toHexKeyPragma = toHexKeyPragma;
/**
 * Read the sealed key, or mint one on first use.
 *
 * Throws `OfflineEncryptionUnavailableError` when there is no usable OS secret store (BUILD/LINK — a
 * Linux box with no keyring, typically), `KeyVaultTransientError` when the vault or the disk fails in a
 * way that may well work next time, and `KeyUnsealError` when the sealed key exists but will not unseal.
 * The distinction decides whether the caller retries or self-heals, so it is never guessed.
 */
function loadOrCreateDbKey(deps) {
    const ss = deps.safeStorage;
    if (!ss) {
        throw new OfflineCrypto_1.OfflineEncryptionUnavailableError("Offline encryption requires Electron safeStorage, which is not available in this process");
    }
    let available = false;
    try {
        available = ss.isEncryptionAvailable();
    }
    catch (e) {
        throw new KeyVaultTransientError("safeStorage.isEncryptionAvailable() threw: " + ((e && e.message) || String(e)));
    }
    if (!available) {
        // On Linux this is "no keyring / no desktop portal". It is a property of the environment, not a
        // blip, so it is BUILD/LINK and the caller resolves it via encryptionFailureBehavior.
        throw new OfflineCrypto_1.OfflineEncryptionUnavailableError("Offline encryption requires an OS secret store; safeStorage reports encryption unavailable " +
            "(on Linux this usually means no keyring is running)");
    }
    if (isWeakSafeStorageBackend(ss)) {
        // Checked BEFORE the sidecar is read or minted: a key sealed by basic_text is not a secret, so
        // it must neither be created nor used. BUILD/LINK, like the no-keyring case above.
        throw new OfflineCrypto_1.OfflineEncryptionUnavailableError("Offline encryption requires an OS secret store; safeStorage is using the 'basic_text' " +
            "backend, which does not protect the key (on Linux, run a keyring such as gnome-keyring or " +
            "KWallet, or pass --password-store to Electron)");
    }
    if (deps.fs.existsSync(deps.keyFile)) {
        let sealed;
        try {
            sealed = deps.fs.readFileSync(deps.keyFile);
        }
        catch (e) {
            throw new KeyVaultTransientError("could not read the offline key file: " + ((e && e.message) || String(e)));
        }
        let hex;
        try {
            hex = ss.decryptString(sealed);
        }
        catch (e) {
            throw new KeyUnsealError("could not unseal the offline key: " + ((e && e.message) || String(e)), unsealFailureClass(ss, e));
        }
        if (/^[0-9a-f]{64}$/.test(hex))
            return hex;
        // The store answered, and what it returned is not a key (a damaged file): counted, never deleted here.
        throw new KeyUnsealError("the offline key file does not hold a key", "UNCLASSIFIED");
    }
    const fresh = toHex(deps.randomBytes(exports.DB_KEY_BYTES));
    try {
        deps.fs.writeFileSync(deps.keyFile, ss.encryptString(fresh), { mode: 0o600 });
    }
    catch (e) {
        throw new KeyVaultTransientError("could not write the offline key file: " + ((e && e.message) || String(e)));
    }
    return fresh;
}
exports.loadOrCreateDbKey = loadOrCreateDbKey;
/**
 * Why a sealed key did not unseal. A locked-store error says so itself. The plain `safeStorage` decrypt
 * error does not, so the store is asked to seal and unseal something new: if that works, the store is
 * fine and this file is what cannot be read; if it does not, a new key could not be sealed either, so
 * wiping could not help and the failure is temporary.
 */
function unsealFailureClass(ss, e) {
    if (SECRET_STORE_LOCKED.test(String((e && e.message) || "").toLowerCase()))
        return "TRANSIENT";
    try {
        const probe = "cometchat-secret-store-probe";
        return ss.decryptString(ss.encryptString(probe)) === probe ? "UNCLASSIFIED" : "TRANSIENT";
    }
    catch (probeErr) {
        return "TRANSIENT";
    }
}
/** Delete the sealed key. Runs BEFORE the data files on logout / user switch. */
function destroyDbKey(deps) {
    try {
        deps.fs.rmSync(deps.keyFile, { force: true });
    }
    catch (e) {
        /* best-effort: a key that cannot be deleted still leaves an unreadable database */
    }
}
exports.destroyDbKey = destroyDbKey;
/** Raised when the key does not open the file — a wrong key, or a corrupt/tampered database. */
class DatabaseUnreadableError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, DatabaseUnreadableError.prototype);
        this.name = "DatabaseUnreadableError";
    }
}
exports.DatabaseUnreadableError = DatabaseUnreadableError;
/**
 * Is the cipher engine actually linked into this build?
 *
 * Answered on a THROWAWAY in-memory connection, deliberately, because the two things it must not
 * conflate look identical otherwise. Asking an already-encrypted FILE this question fails whenever the
 * key is wrong — so a wrong key would be reported as "no cipher engine", sending an integrator off to
 * reinstall a package that was never the problem, while the real answer (wipe and rebuild) went
 * unheard. An in-memory database has no key and no pages, so it answers about the BUILD alone.
 *
 * `sqlite3mc_version()` is the SQLite3 Multiple Ciphers marker; `PRAGMA cipher_version` is upstream
 * SQLCipher's. Either is sufficient. Empty means plain `better-sqlite3` — a build that accepts
 * key pragmas, silently ignores them, and writes plaintext.
 */
function engineVersion(Driver) {
    let probe = null;
    try {
        probe = new Driver(":memory:");
        try {
            const row = probe.prepare("SELECT sqlite3mc_version() AS v").get();
            if (row && row.v)
                return String(row.v).trim();
        }
        catch (e) {
            /* not a SQLite3MC build — try the upstream SQLCipher marker */
        }
        try {
            const p = probe.pragma("cipher_version", { simple: true });
            if (p)
                return String(p).trim();
        }
        catch (e) {
            /* neither marker: no cipher engine */
        }
        return "";
    }
    catch (e) {
        return "";
    }
    finally {
        try {
            if (probe)
                probe.close();
        }
        catch (e) {
            /* ignore */
        }
    }
}
exports.engineVersion = engineVersion;
/**
 * Key a database and PROVE the key took effect.
 *
 * An open that "succeeded" proves nothing on its own: the cipher keys lazily, so a wrong key surfaces
 * only when a page is first touched. Hence, strictly in this order, as the FIRST statements on the
 * connection:
 *
 *   1. `PRAGMA cipher` — choose SQLCipher. The default is chacha20, so skipping this writes a
 *      database no other CometChat SDK's format matches.
 *   2. `PRAGMA hexkey` — the raw 32 bytes, no KDF. (`key` would treat them as a passphrase.)
 *   3. A probe read, which forces a page access and is the only thing that actually surfaces a wrong
 *      or absent key.
 *
 * The engine check is NOT done here — see `engineVersion` for why it has to be independent of the
 * file. Throws `DatabaseUnreadableError` when the key does not open the file (PERMANENT → wipe and
 * rebuild); that covers a wrong key, a corrupt or tampered file, and a plaintext database from an
 * earlier build now being opened with a key. A busy or locked file is rethrown as it is (TRANSIENT,
 * see `probeReadable`).
 */
function applyKeyAndProve(db, keyHex) {
    db.pragma("cipher='" + exports.CIPHER_SCHEME + "'");
    db.pragma(toHexKeyPragma(keyHex));
    probeReadable(db);
}
exports.applyKeyAndProve = applyKeyAndProve;
/**
 * Force a page access so a wrong or absent key cannot pass unnoticed.
 *
 * Also run on UNENCRYPTED opens: it is the same cheap statement, and it turns a corrupt file into a
 * clean self-heal instead of a failure at the first real query.
 *
 * A file another connection or process holds locked (busy, locked) or a full disk is NOT unreadable:
 * that error is rethrown as it is, so the open classifies it TRANSIENT — no store this session,
 * nothing deleted, never counted (BEH-ENC-11/12). Wrapping it as unreadable wiped a store, and its
 * unsent outbox, that another process merely had open.
 */
function probeReadable(db) {
    try {
        db.prepare("SELECT count(*) AS n FROM sqlite_master").get();
    }
    catch (e) {
        if (classifyMainOpenFailure(e) === "TRANSIENT")
            throw e;
        throw new DatabaseUnreadableError("the local database could not be read: " + ((e && e.message) || String(e)));
    }
}
exports.probeReadable = probeReadable;
/** A locked OS secret store (macOS Keychain's errSecInteractionNotAllowed), lowercased. */
const SECRET_STORE_LOCKED = /user interaction is not allowed|errsecinteractionnotallowed|-25308/;
/**
 * Classify a main-process open / key-store failure: busy, locked and disk full are TRANSIENT (never
 * counted), and so are a locked secret store and the `safeStorage` decrypt error; a sealed key file that
 * does not unseal under a working store is UNCLASSIFIED (see KeyUnsealError); everything else, I/O errors
 * included, is UNCLASSIFIED and counts toward escalation.
 */
function classifyMainOpenFailure(e) {
    if (e instanceof KeyUnsealError)
        return e.failureClass;
    const code = String((e && e.code) || "");
    const msg = String((e && e.message) || "").toLowerCase();
    if (/^(EBUSY|EAGAIN|ENOSPC|SQLITE_BUSY|SQLITE_LOCKED|SQLITE_FULL)/.test(code))
        return "TRANSIENT";
    if (/busy|locked|disk full|no space|database or disk is full|enospc|ebusy/.test(msg))
        return "TRANSIENT";
    if (code === "-25308" || SECRET_STORE_LOCKED.test(msg) || /safestorage.*decrypt/.test(msg))
        return "TRANSIENT";
    return "UNCLASSIFIED";
}
exports.classifyMainOpenFailure = classifyMainOpenFailure;
