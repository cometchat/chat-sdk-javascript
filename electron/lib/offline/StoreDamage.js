"use strict";
/**
 * Damage found at first use (BEH-ENC-11).
 *
 * An open proves only what it touches: the Electron probe reads the schema pages, the open's outbox
 * read the outbox, and IndexedDB opens without decrypting a row. Damage anywhere else surfaces at the
 * first query that reaches it — a read's cache phase, a write, a decrypt. That error is corruption on
 * its first occurrence (PERMANENT): the store is wiped and rebuilt, and the loss is announced once as
 * `CORRUPTED` (BEH-ENC-15), exactly as when the open finds it.
 *
 * The store layers report such an error here; the offline runtime registers the handler that runs the
 * rebuild. This module holds no state of its own beyond that handler, so the read and store layers can
 * report without depending on the runtime.
 *
 * @module offline/StoreDamage
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportStoreDamage = exports.setStoreDamageHandler = exports.tagStoreError = exports.isStoreCorruption = exports.storeErrorCode = exports.OfflineStoreCorruptError = void 0;
/** A stored value that should open and does not: a row that will not decrypt under the store's key. */
class OfflineStoreCorruptError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, OfflineStoreCorruptError.prototype);
        this.name = "OfflineStoreCorruptError";
    }
}
exports.OfflineStoreCorruptError = OfflineStoreCorruptError;
/**
 * The SQLite result code a store error carries: the driver's `code` (better-sqlite3 `SqliteError`), or,
 * for an error relayed over Electron IPC (which keeps only `name: message`), the `[SQLITE_…]` tag the
 * main process puts at the front of the message (`tagStoreError`), matched only there. `null` when it
 * carries none.
 */
function storeErrorCode(e) {
    if (!e)
        return null;
    if (typeof e.code === "string" && /^SQLITE_[A-Z_]+$/.test(e.code))
        return e.code;
    // Only at the START of the error's own message, as tagStoreError puts it — after Electron's
    // "Error invoking remote method '…': " and the error's name — never text found anywhere inside it.
    const m = /^(?:Error invoking remote method '[^']*': )?(?:[A-Za-z_$][\w$]*: )?\[(SQLITE_[A-Z_]+)\]/.exec(String(e.message || ""));
    return m ? m[1] : null;
}
exports.storeErrorCode = storeErrorCode;
/**
 * Does `e` say the store's contents are damaged? Decided by the error's TYPE or CODE, never by its text:
 * an `OfflineStoreCorruptError` (a sealed row that will not open under the store's live key), or a
 * SQLite `SQLITE_CORRUPT` / `SQLITE_NOTADB` result (also as the IPC tag). Busy, locked, full and I/O
 * results are not corruption, and an error from app code (a callback, a parser) never carries either.
 */
function isStoreCorruption(e) {
    if (!e)
        return false;
    if (e instanceof OfflineStoreCorruptError)
        return true;
    const code = storeErrorCode(e);
    return !!code && /^SQLITE_(CORRUPT|NOTADB)(_|$)/.test(code);
}
exports.isStoreCorruption = isStoreCorruption;
/**
 * For the Electron main process: an engine error as it must cross IPC. Electron relays only
 * `name: message`, so a SQLite result code is put at the front of the message as `[SQLITE_…]`, where
 * `storeErrorCode` finds it in the renderer. Other errors are returned unchanged.
 */
function tagStoreError(e) {
    const code = e && typeof e.code === "string" && /^SQLITE_[A-Z_]+$/.test(e.code) ? e.code : null;
    if (!code)
        return e;
    const msg = String(e.message || "");
    if (msg.indexOf("[" + code + "]") === 0)
        return e;
    const out = new Error("[" + code + "] " + msg);
    out.name = e.name || "SqliteError";
    out.code = code;
    return out;
}
exports.tagStoreError = tagStoreError;
let handler = null;
/** @internal The offline runtime installs the rebuild here. */
function setStoreDamageHandler(h) {
    handler = h;
}
exports.setStoreDamageHandler = setStoreDamageHandler;
/**
 * Report a store error. Corruption goes to the runtime's rebuild (which ignores a store that is not the
 * one open now, and one already being rebuilt); anything else is ignored. `store` names the store the
 * error came from, when the caller knows it. Never throws.
 */
function reportStoreDamage(error, store) {
    if (!isStoreCorruption(error))
        return false;
    const h = handler;
    if (h) {
        try {
            h(error, store);
        }
        catch {
            /* reporting never breaks the caller */
        }
    }
    return true;
}
exports.reportStoreDamage = reportStoreDamage;
