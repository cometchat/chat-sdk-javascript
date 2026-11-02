/**
 * Path safety for the Electron main-process offline engines.
 *
 * Every `appId`, `uid` and media `key` reaching the engines arrives over IPC from a renderer, so it is
 * untrusted input: a renderer XSS must never turn into main-process file access outside the SDK's own
 * folders. Two independent defences are applied to every path the engines build:
 *
 *   1. Identifier mapping. An `appId` / `uid` pair whose parts are both safe filenames (`isSafeId`) is
 *      used verbatim (`<appId>_<uid>`); any other pair — a uid may hold any character the platform
 *      allows, e.g. the non-ASCII uids of BEH-READ-17 — is named `h_<sha256(appId NUL uid) hex>`, which
 *      can never contain a separator or a `..` segment (`safeStem`).
 *   2. Containment. Every final path is `path.resolve`d and must lie STRICTLY inside its intended
 *      base directory (`<userData>/cometchat-offline` or `<userData>/cometchat-media[/<app>_<uid>]`).
 *      A path equal to the base, or outside it, is refused.
 *
 * Media keys are not identifiers — today they are `m_<hash>` / `u_<hash>` byte-store keys or local
 * attachment ids — so they are not restricted to the id charset. A key that is already a safe filename
 * is used verbatim (unchanged on-disk names, so files cached by earlier builds and the renderer's
 * synchronous `ref()` path stay valid). Any other key is mapped to `h_<sha256(key) hex>`, which can
 * never contain a separator or a `..` segment.
 *
 * NOT part of the renderer SDK bundle — imported only by the host app's main process.
 *
 * @module offline/electron/main/PathSafety
 */
import { MAX_SAFE_ID_LENGTH, isIdentity, isSafeId, mediaFileName } from "../MediaFileName";
export { MAX_SAFE_ID_LENGTH, isIdentity, isSafeId, mediaFileName };
/** Throw unless `value` satisfies `isSafeId`. `label` names the argument in the message. */
export declare function assertSafeId(value: unknown, label: string): string;
/**
 * Resolve `name` against `base` and return it only if it lies STRICTLY inside `base`. Throws on a
 * path that equals or escapes the base (via `..`, an absolute component, a drive letter, ...).
 */
export declare function resolveInside(base: string, name: string): string;
/**
 * The stem shared by the database, key sidecar and media folder: `<appId>_<uid>` when both are safe
 * filenames (the names earlier builds used, so existing stores keep their files), else
 * `h_<sha256(utf8(appId NUL uid)) hex>`. Throws on an id that is not usable at all (`isIdentity`).
 */
export declare function safeStem(appId: unknown, uid: unknown): string;
/** `<userData>/cometchat-offline` paths for one (app, user): the folder, `.db` and `.key`. */
export declare function offlineDbPaths(userData: string, appId: unknown, uid: unknown): {
    dir: string;
    dbFile: string;
    keyFile: string;
};
/**
 * `<userData>/cometchat-media` roots for one (app, user): the current per-(app, user) folder and the
 * legacy per-user folder earlier builds wrote to. Both are validated, contained, direct children of
 * the media base — the only directories a recursive media wipe may ever target.
 */
export declare function mediaRootPaths(userData: string, appId: unknown, uid: unknown): {
    base: string;
    root: string;
    legacy: string | null;
};
