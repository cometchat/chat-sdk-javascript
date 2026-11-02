/**
 * The on-disk filename of an Electron media key — shared by the main-process engine (which stores the
 * file) and the renderer store (whose synchronous `ref()` must name the same file).
 *
 * A key that is already a safe filename (`isSafeId`) is used verbatim, as earlier builds did. Any other
 * key becomes `h_<sha256(utf8(key)) hex>`. The hash is a small pure implementation so the renderer can
 * compute it synchronously; it is byte-for-byte the standard SHA-256 (Node's `crypto` gives the same
 * digest, which the tests assert), so files the main process already named this way keep resolving.
 *
 * Browser-safe: no node / electron imports.
 *
 * @module offline/electron/MediaFileName
 */
/** Longest accepted appId / uid / verbatim media filename. */
export declare const MAX_SAFE_ID_LENGTH = 200;
/**
 * Is `value` safe to embed in a filename? A non-empty string of at most `MAX_SAFE_ID_LENGTH`
 * characters drawn only from `[A-Za-z0-9_-@.+]`, which is not `.` and does not contain `..`.
 */
export declare function isSafeId(value: unknown): value is string;
/**
 * Is `value` a usable `appId` / `uid`: 1-`MAX_SAFE_ID_LENGTH` characters with no path separator
 * (`/`, `\\`, `:`), control character, `.` / `..` segment? Every safe id is one; so is a uid with
 * other characters — e.g. the non-ASCII uids BEH-READ-17 keys conversations by — which reaches a
 * filename only hashed (`safeStem`).
 */
export declare function isIdentity(value: unknown): value is string;
/** The filename a media key is stored under (verbatim if safe, else `h_<sha256 hex>`). */
export declare function mediaFileName(key: unknown): string;
/** Standard SHA-256 of the UTF-8 bytes of `s`, as lowercase hex. */
export declare function sha256Hex(s: string): string;
