"use strict";
/**
 * Main-process media byte store over node:fs — one real file per attachment under the app's
 * private user-data dir: `app.getPath('userData')/cometchat-media/<appId>_<uid>/<attachmentId>`. App-
 * private, never a public folder. Bytes cross IPC as `ArrayBuffer`. Atomic temp→rename write so a
 * crash mid-write never leaves a partial file.
 *
 * NOT part of the renderer SDK bundle — imported only by the host app's main process.
 *
 * @module offline/electron/main/NodeFsMediaEngine
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeFsMediaEngine = void 0;
const PathSafety_1 = require("./PathSafety");
/**
 * The per-(app, user) media root, and the legacy per-user root earlier builds wrote to. `appId` and
 * `uid` are validated and both roots are proven to be direct children of `<userData>/cometchat-media`
 * (see PathSafety) — these are the only directories a recursive wipe may ever target.
 */
function mediaRoots(appId, uid) {
    const { app } = require("electron");
    const r = PathSafety_1.mediaRootPaths(app.getPath("userData"), appId, uid);
    return { root: r.root, legacy: r.legacy };
}
function removeDir(dir) {
    const fs = require("node:fs");
    try {
        fs.rmSync(dir, { recursive: true, force: true });
    }
    catch {
        /* nothing to wipe */
    }
}
class NodeFsMediaEngine {
    constructor() {
        this.root = "";
        /** Read-only fallback: files an earlier build cached under the per-user folder. */
        this.legacyRoot = "";
    }
    /** Resolve + create the per-(app, user) media root, cache it, and return it to the renderer. */
    openMedia(appId, uid) {
        // Forget any previous root first: a rejected (invalid) appId/uid must not leave the engine
        // writing into the previous user's folder.
        this.root = "";
        this.legacyRoot = "";
        const roots = mediaRoots(appId, uid); // throws on an invalid appId/uid — nothing is created
        this.root = roots.root;
        this.legacyRoot = roots.legacy || "";
        // The root is created lazily by the first `put()`, not eagerly here: a store that holds no media
        // (none copied yet, or the only copied media was discarded, BEH-SEND-36) must leave NO
        // `cometchat-media/<app>_<uid>/` directory on disk — otherwise a restart would recreate the empty
        // folder that a discard had just removed. `ref()` only needs the root PATH (a string), which is set
        // above; reads tolerate a missing file, `put()` recreates the folder, and `remove()` drops it once
        // it is empty.
        return this.root;
    }
    /**
     * The file a key is stored under: `mediaFileName(key)` (verbatim for an already-safe key, a sha256
     * name otherwise), resolved and proven to lie strictly inside the open media root. Throws when no
     * root is open — a relative path would otherwise land in the process's working directory.
     */
    filePath(key) {
        if (!this.root)
            throw new Error("CometChat offline: media store is not open");
        return PathSafety_1.resolveInside(this.root, PathSafety_1.mediaFileName(key));
    }
    /** Read-only legacy lookup — same mapping and containment, inside the legacy per-user folder. */
    legacyPath(key) {
        if (!this.legacyRoot)
            return null;
        return PathSafety_1.resolveInside(this.legacyRoot, PathSafety_1.mediaFileName(key));
    }
    put(key, bytes, _opts) {
        const fs = require("node:fs");
        const file = this.filePath(key);
        // The media root may have been removed by a `remove()` that emptied it (e.g. discarding the only
        // copied-outgoing media, BEH-SEND-36) — recreate it so a later copy never writes into a missing dir.
        try {
            fs.mkdirSync(this.root, { recursive: true });
        }
        catch {
            /* already present */
        }
        const tmp = `${file}.tmp`;
        fs.writeFileSync(tmp, Buffer.from(bytes));
        fs.renameSync(tmp, file); // atomic on the same filesystem
        return file;
    }
    get(key) {
        const fs = require("node:fs");
        for (const file of [this.filePath(key), this.legacyPath(key)]) {
            if (!file)
                continue;
            try {
                const buf = fs.readFileSync(file);
                return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
            }
            catch {
                /* ENOENT — try the legacy folder */
            }
        }
        return null;
    }
    has(key) {
        const fs = require("node:fs");
        for (const file of [this.filePath(key), this.legacyPath(key)]) {
            if (!file)
                continue;
            try {
                if (fs.statSync(file).isFile())
                    return true;
            }
            catch {
                /* missing — try the legacy folder */
            }
        }
        return false;
    }
    remove(key) {
        const fs = require("node:fs");
        for (const file of [this.filePath(key), this.legacyPath(key)]) {
            if (!file)
                continue;
            try {
                fs.rmSync(file, { force: true });
            }
            catch {
                /* already gone */
            }
        }
        // When a removal empties a media root, drop the now-empty per-(app, user) directory too, so that
        // discarding the only copied media leaves NO `cometchat-media/<app>_<uid>/` behind (BEH-SEND-36 —
        // a discard must leave nothing of the message on disk). `rmdirSync` only removes an empty directory
        // (it throws ENOTEMPTY otherwise), so a root that still holds other media is untouched; `put()`
        // recreates the root before the next copy.
        for (const dir of [this.root, this.legacyRoot]) {
            if (!dir)
                continue;
            try {
                fs.rmdirSync(dir);
            }
            catch {
                /* not empty, or already gone */
            }
        }
    }
    totalBytes() {
        const fs = require("node:fs");
        const path = require("node:path");
        let sum = 0;
        for (const dir of [this.root, this.legacyRoot]) {
            if (!dir)
                continue;
            try {
                for (const name of fs.readdirSync(dir)) {
                    try {
                        const st = fs.statSync(path.join(dir, name));
                        if (st.isFile())
                            sum += st.size;
                    }
                    catch {
                        /* skip */
                    }
                }
            }
            catch {
                /* dir missing → 0 */
            }
        }
        return sum;
    }
    wipe() {
        if (this.root)
            removeDir(this.root);
        if (this.legacyRoot)
            removeDir(this.legacyRoot);
    }
    /** Delete an `(app, user)`'s media without opening it: the new folder, then the legacy one. */
    wipeMediaByName(appId, uid) {
        const roots = mediaRoots(appId, uid);
        removeDir(roots.root);
        if (roots.legacy)
            removeDir(roots.legacy);
    }
}
exports.NodeFsMediaEngine = NodeFsMediaEngine;
