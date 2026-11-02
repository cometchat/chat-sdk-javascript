"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaRootPaths = exports.offlineDbPaths = exports.safeStem = exports.resolveInside = exports.assertSafeId = exports.mediaFileName = exports.isSafeId = exports.isIdentity = exports.MAX_SAFE_ID_LENGTH = void 0;
// The id rule and the media filename mapping live in a browser-safe module shared with the renderer,
// so the renderer's synchronous `ref()` names exactly the file the engine wrote.
const MediaFileName_1 = require("../MediaFileName");
Object.defineProperty(exports, "MAX_SAFE_ID_LENGTH", { enumerable: true, get: function () { return MediaFileName_1.MAX_SAFE_ID_LENGTH; } });
Object.defineProperty(exports, "isIdentity", { enumerable: true, get: function () { return MediaFileName_1.isIdentity; } });
Object.defineProperty(exports, "isSafeId", { enumerable: true, get: function () { return MediaFileName_1.isSafeId; } });
Object.defineProperty(exports, "mediaFileName", { enumerable: true, get: function () { return MediaFileName_1.mediaFileName; } });
function assertIdentity(value, label) {
    if (!MediaFileName_1.isIdentity(value)) {
        throw new Error(`CometChat offline: invalid ${label} - it must be 1-${MediaFileName_1.MAX_SAFE_ID_LENGTH} characters with no path ` +
            "separator, control character or '..'");
    }
    return value;
}
/** Throw unless `value` satisfies `isSafeId`. `label` names the argument in the message. */
function assertSafeId(value, label) {
    if (!MediaFileName_1.isSafeId(value)) {
        throw new Error(`CometChat offline: invalid ${label} - it must be 1-${MediaFileName_1.MAX_SAFE_ID_LENGTH} characters of ` +
            "[A-Za-z0-9_-@.+] and must not be '.' or contain '..'");
    }
    return value;
}
exports.assertSafeId = assertSafeId;
/**
 * Resolve `name` against `base` and return it only if it lies STRICTLY inside `base`. Throws on a
 * path that equals or escapes the base (via `..`, an absolute component, a drive letter, ...).
 */
function resolveInside(base, name) {
    const path = require("node:path");
    if (typeof name !== "string" || name.length === 0 || name.indexOf("\0") !== -1) {
        throw new Error("CometChat offline: refusing an empty or NUL-containing path component");
    }
    const root = path.resolve(base);
    const full = path.resolve(root, name);
    const rel = path.relative(root, full);
    if (!rel || rel === ".." || rel.startsWith(".." + path.sep) || path.isAbsolute(rel)) {
        throw new Error("CometChat offline: refusing a path outside the SDK's storage folder");
    }
    return full;
}
exports.resolveInside = resolveInside;
/**
 * The stem shared by the database, key sidecar and media folder: `<appId>_<uid>` when both are safe
 * filenames (the names earlier builds used, so existing stores keep their files), else
 * `h_<sha256(utf8(appId NUL uid)) hex>`. Throws on an id that is not usable at all (`isIdentity`).
 */
function safeStem(appId, uid) {
    const a = assertIdentity(appId, "appId");
    const u = assertIdentity(uid, "uid");
    if (MediaFileName_1.isSafeId(a) && MediaFileName_1.isSafeId(u))
        return `${a}_${u}`;
    return "h_" + MediaFileName_1.sha256Hex(a + "\0" + u);
}
exports.safeStem = safeStem;
/** `<userData>/cometchat-offline` paths for one (app, user): the folder, `.db` and `.key`. */
function offlineDbPaths(userData, appId, uid) {
    const stem = safeStem(appId, uid);
    const dir = resolveInside(userData, "cometchat-offline");
    return {
        dir: dir,
        dbFile: resolveInside(dir, `${stem}.db`),
        keyFile: resolveInside(dir, `${stem}.key`),
    };
}
exports.offlineDbPaths = offlineDbPaths;
/**
 * `<userData>/cometchat-media` roots for one (app, user): the current per-(app, user) folder and the
 * legacy per-user folder earlier builds wrote to. Both are validated, contained, direct children of
 * the media base — the only directories a recursive media wipe may ever target.
 */
function mediaRootPaths(userData, appId, uid) {
    const stem = safeStem(appId, uid);
    const base = resolveInside(userData, "cometchat-media");
    return {
        base: base,
        root: resolveInside(base, stem),
        // Earlier builds kept media per uid, and only for a pair of safe ids; a hashed pair never had a
        // legacy folder (and must not alias its own root as one).
        legacy: MediaFileName_1.isSafeId(appId) && MediaFileName_1.isSafeId(uid) ? resolveInside(base, uid) : null,
    };
}
exports.mediaRootPaths = mediaRootPaths;
