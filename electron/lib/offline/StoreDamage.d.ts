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
/** A stored value that should open and does not: a row that will not decrypt under the store's key. */
export declare class OfflineStoreCorruptError extends Error {
    constructor(message: string);
}
/**
 * The SQLite result code a store error carries: the driver's `code` (better-sqlite3 `SqliteError`), or,
 * for an error relayed over Electron IPC (which keeps only `name: message`), the `[SQLITE_…]` tag the
 * main process puts at the front of the message (`tagStoreError`), matched only there. `null` when it
 * carries none.
 */
export declare function storeErrorCode(e: any): string | null;
/**
 * Does `e` say the store's contents are damaged? Decided by the error's TYPE or CODE, never by its text:
 * an `OfflineStoreCorruptError` (a sealed row that will not open under the store's live key), or a
 * SQLite `SQLITE_CORRUPT` / `SQLITE_NOTADB` result (also as the IPC tag). Busy, locked, full and I/O
 * results are not corruption, and an error from app code (a callback, a parser) never carries either.
 */
export declare function isStoreCorruption(e: any): boolean;
/**
 * For the Electron main process: an engine error as it must cross IPC. Electron relays only
 * `name: message`, so a SQLite result code is put at the front of the message as `[SQLITE_…]`, where
 * `storeErrorCode` finds it in the renderer. Other errors are returned unchanged.
 */
export declare function tagStoreError(e: any): any;
declare type DamageHandler = (error: any, store?: any) => void;
/** @internal The offline runtime installs the rebuild here. */
export declare function setStoreDamageHandler(h: DamageHandler | null): void;
/**
 * Report a store error. Corruption goes to the runtime's rebuild (which ignores a store that is not the
 * one open now, and one already being rebuilt); anything else is ignored. `store` names the store the
 * error came from, when the caller knows it. Never throws.
 */
export declare function reportStoreDamage(error: any, store?: any): boolean;
export {};
