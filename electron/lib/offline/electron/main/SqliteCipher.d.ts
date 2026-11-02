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
/** Bytes in the raw database key. SQLCipher's raw-key form is exactly this, hex-encoded. */
export declare const DB_KEY_BYTES = 32;
/** Reported by the status API for this tier. */
export declare const ELECTRON_CIPHER = "AES-256-CBC/HMAC-SHA512 (SQLCipher scheme via SQLite3 Multiple Ciphers, whole file)";
/**
 * The cipher scheme to select.
 *
 * SQLite3 Multiple Ciphers supports several schemes and defaults to **chacha20**, not SQLCipher. It
 * must therefore be chosen explicitly: every other CometChat SDK writes SQLCipher-format databases,
 * and silently using a different scheme here would leave Electron the odd one out while the status
 * API still claimed SQLCipher.
 */
export declare const CIPHER_SCHEME = "sqlcipher";
/** A momentary vault/disk problem. Retry next open; NEVER wipe over one. */
export declare class KeyVaultTransientError extends Error {
    constructor(message: string);
}
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
export declare class KeyUnsealError extends Error {
    readonly failureClass: "TRANSIENT" | "UNCLASSIFIED";
    constructor(message: string, failureClass: "TRANSIENT" | "UNCLASSIFIED");
}
/** The `safeStorage` surface actually used. Injected so it can be faked in tests. */
export interface SafeStorageLike {
    isEncryptionAvailable(): boolean;
    encryptString(plainText: string): any;
    decryptString(encrypted: any): string;
    /**
     * Linux only, newer Electron: the backend `safeStorage` picked (`gnome_libsecret`, `kwallet*`, …
     * or `basic_text`). Optional — absent on other platforms and older Electron.
     */
    getSelectedStorageBackend?(): string;
}
/**
 * Does `safeStorage` hold its key in a real OS secret store?
 *
 * On Linux, when no keyring is reachable, Electron can fall back to the `basic_text` backend. It
 * still reports `isEncryptionAvailable() === true`, but the "sealing" key is a hard-coded constant —
 * anyone who can read the sidecar can unseal it. That is not a secret (BEH-ENC-07 / BEH-ENC-14), so it
 * is treated exactly like "encryption unavailable": the store is never keyed with it and the status
 * API can never report `keyStorage: "KEYSTORE"` for it.
 */
export declare function isWeakSafeStorageBackend(ss: SafeStorageLike, platform?: string): boolean;
/** The `node:fs` surface actually used. */
export interface FsLike {
    existsSync(p: string): boolean;
    readFileSync(p: string): any;
    writeFileSync(p: string, data: any, opts?: any): void;
    rmSync(p: string, opts?: any): void;
}
/** Everything the key store needs from its host, injected rather than `require`d. */
export interface KeyStoreDeps {
    fs: FsLike;
    safeStorage: SafeStorageLike | null;
    randomBytes(n: number): any;
    /** Absolute path of the sidecar holding the sealed key. */
    keyFile: string;
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
export declare function toHexKeyPragma(keyHex: string): string;
/**
 * Read the sealed key, or mint one on first use.
 *
 * Throws `OfflineEncryptionUnavailableError` when there is no usable OS secret store (BUILD/LINK — a
 * Linux box with no keyring, typically), `KeyVaultTransientError` when the vault or the disk fails in a
 * way that may well work next time, and `KeyUnsealError` when the sealed key exists but will not unseal.
 * The distinction decides whether the caller retries or self-heals, so it is never guessed.
 */
export declare function loadOrCreateDbKey(deps: KeyStoreDeps): string;
/** Delete the sealed key. Runs BEFORE the data files on logout / user switch. */
export declare function destroyDbKey(deps: KeyStoreDeps): void;
/** The minimum of better-sqlite3 used here, so tests can supply a stand-in. */
export interface DatabaseLike {
    pragma(sql: string, opts?: any): any;
    prepare(sql: string): {
        get(...args: any[]): any;
    };
}
/** Why an open could not be completed. Mirrors the three handling classes. */
export declare type OpenFailureClass = "BUILD_LINK" | "TRANSIENT" | "PERMANENT";
/** Raised when the key does not open the file — a wrong key, or a corrupt/tampered database. */
export declare class DatabaseUnreadableError extends Error {
    constructor(message: string);
}
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
export declare function engineVersion(Driver: any): string;
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
export declare function applyKeyAndProve(db: DatabaseLike, keyHex: string): void;
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
export declare function probeReadable(db: DatabaseLike): void;
/**
 * Classify a main-process open / key-store failure: busy, locked and disk full are TRANSIENT (never
 * counted), and so are a locked secret store and the `safeStorage` decrypt error; a sealed key file that
 * does not unseal under a working store is UNCLASSIFIED (see KeyUnsealError); everything else, I/O errors
 * included, is UNCLASSIFIED and counts toward escalation.
 */
export declare function classifyMainOpenFailure(e: any): "TRANSIENT" | "UNCLASSIFIED";
