"use strict";
/**
 * Main-process IPC registration. The host app calls `registerOfflineIpc()` once from its main
 * process (after `app` is ready). It stands up the SQLite + node:fs engines and registers one
 * `ipcMain.handle` per bridge channel, forwarding to the matching engine method. Sync engine
 * returns become the renderer's resolved Promise; thrown errors become invoke rejections.
 *
 * NOT part of the renderer SDK bundle — imported only by the host app's main process.
 *
 * @module offline/electron/main/registerOfflineIpc
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOfflineIpc = void 0;
const ElectronBridge_1 = require("../ElectronBridge");
const StoreDamage_1 = require("../../StoreDamage");
const SqliteEngine_1 = require("./SqliteEngine");
const NodeFsMediaEngine_1 = require("./NodeFsMediaEngine");
const PathSafety_1 = require("./PathSafety");
let registered = false;
/**
 * The default sender policy: the invocation must carry a `senderFrame`, and that frame must be the
 * top-level frame of its WebContents. Subframes / iframes (which may host third-party content) are
 * refused. The SDK cannot know which origins the host app considers its own, so origin checks are
 * left to `options.isTrustedSender`.
 */
function isTopLevelSender(event) {
    if (!event)
        return false;
    const frame = event.senderFrame;
    if (!frame)
        return false; // missing (or already destroyed) frame: cannot attribute the call
    const mainFrame = event.sender && event.sender.mainFrame;
    if (mainFrame && frame !== mainFrame)
        return false;
    return true;
}
/** The file, inside the SDK's own folder, where main records the one `(app, user)` it serves. */
const ACTIVE_PAIR_FILE = "active-user.json";
/**
 * The one `(app, user)` pair whose data main keeps at rest — recorded by MAIN, not taken on trust.
 *
 * A renderer names the pair on `open` / `openMedia`, so a script running in it could name ANOTHER
 * user and have main unseal that user's key (F-6). Main therefore keeps at most one pair on disk: the
 * pair it last opened, persisted across restarts. Opening a different pair first wipes the recorded
 * one at rest — key, database and media — exactly as a user switch must (BEH-AUTH-13: "any other
 * previous (appId, uid) pair is wiped at rest like a logout"; Android `CometChat.java:5280`). So a
 * renderer can only ever reach the data of the pair it is currently using: naming another user opens
 * an empty store and costs the current user nothing it could not already delete with `wipe`.
 */
class ActivePair {
    constructor(file) {
        this.file = file;
        this.pair = null;
        this.loaded = false;
    }
    load() {
        if (this.loaded)
            return;
        this.loaded = true;
        try {
            const f = this.file();
            if (!f)
                return;
            const fs = require("node:fs");
            if (!fs.existsSync(f))
                return;
            const v = JSON.parse(fs.readFileSync(f, "utf8"));
            if (v && PathSafety_1.isIdentity(v.appId) && PathSafety_1.isIdentity(v.uid))
                this.pair = { appId: v.appId, uid: v.uid };
        }
        catch {
            this.pair = null; // unreadable record: nothing to wipe, the next open records afresh
        }
    }
    /**
     * Make `(appId, uid)` the active pair before it is opened. Returns the previous pair when it differs
     * (the caller wipes it at rest first), or `null`. An invalid pair records nothing — the engine
     * refuses it anyway.
     */
    switchTo(appId, uid) {
        if (!PathSafety_1.isIdentity(appId) || !PathSafety_1.isIdentity(uid))
            return null;
        this.load();
        const prev = this.pair;
        if (prev && prev.appId === appId && prev.uid === uid)
            return null;
        this.pair = { appId: appId, uid: uid };
        try {
            const f = this.file();
            if (f) {
                const fs = require("node:fs");
                const path = require("node:path");
                fs.mkdirSync(path.dirname(f), { recursive: true });
                fs.writeFileSync(f, JSON.stringify(this.pair));
            }
        }
        catch {
            /* in-memory for this process; the switch-time wipe below still runs */
        }
        return prev;
    }
}
/** Wrap an engine call so it only runs for a trusted sender; otherwise the invoke rejects. */
function guarded(channel, isTrusted, call) {
    return (event, ...args) => {
        let ok = false;
        try {
            ok = isTrusted(event) === true;
        }
        catch (e) {
            ok = false;
        }
        if (!ok) {
            throw new Error(`CometChat offline: rejected ${channel} from an untrusted sender`);
        }
        // A SQLite result code would not survive IPC (only `name: message` does): carry it in the message,
        // so the renderer can tell a damaged store from any other failure by code (StoreDamage).
        let res;
        try {
            res = call(...args);
        }
        catch (e) {
            throw StoreDamage_1.tagStoreError(e);
        }
        return res && typeof res.then === "function"
            ? res.then(undefined, (e) => {
                throw StoreDamage_1.tagStoreError(e);
            })
            : res;
    };
}
/**
 * Register the offline IPC handlers. Idempotent — subsequent calls are ignored (including their
 * options). Every handler first applies the sender policy: top-level frames only, plus
 * `options.isTrustedSender` when supplied; a rejected call throws (the renderer's invoke rejects)
 * without reaching the engines. `appId`/`uid` arguments are validated by the engines themselves.
 * Main keeps one `(app, user)` at rest: opening another pair wipes the previous one first (`ActivePair`).
 */
function registerOfflineIpc(options) {
    if (registered)
        return;
    const { ipcMain } = require("electron");
    const custom = options && typeof options.isTrustedSender === "function" ? options.isTrustedSender : null;
    const isTrusted = (event) => isTopLevelSender(event) && (!custom || custom(event) === true);
    const db = new SqliteEngine_1.SqliteEngine();
    const media = new NodeFsMediaEngine_1.NodeFsMediaEngine();
    const active = new ActivePair(() => {
        try {
            const { app } = require("electron");
            return PathSafety_1.resolveInside(PathSafety_1.resolveInside(app.getPath("userData"), "cometchat-offline"), ACTIVE_PAIR_FILE);
        }
        catch {
            return null;
        }
    });
    /** Before `open` / `openMedia` of a pair: a different recorded pair is wiped at rest first (F-6). */
    const bindPair = (appId, uid) => {
        const prev = active.switchTo(appId, uid);
        if (!prev)
            return;
        // Key first, then the database (one engine call keeps that order), then media — as logout. A
        // failure is not fatal to the new open; the old pair is simply no longer reachable from the
        // renderer, and the next switch retries nothing (its record is gone), so log it loudly.
        try {
            db.wipeByName(prev.appId, prev.uid);
        }
        catch (e) {
            console.error("CometChat offline: could not wipe the previous user's store at rest", e);
        }
        try {
            media.wipeMediaByName(prev.appId, prev.uid);
        }
        catch (e) {
            console.error("CometChat offline: could not wipe the previous user's media at rest", e);
        }
    };
    for (const m of ElectronBridge_1.DB_METHODS) {
        const ch = ElectronBridge_1.DB_CHANNEL(m);
        const call = m === "open"
            ? (...args) => (bindPair(args[0], args[1]), db.open(...args))
            : (...args) => db[m](...args);
        ipcMain.handle(ch, guarded(ch, isTrusted, call));
    }
    for (const m of ElectronBridge_1.MEDIA_METHODS) {
        const ch = ElectronBridge_1.MEDIA_CHANNEL(m);
        const call = m === "openMedia"
            ? (...args) => (bindPair(args[0], args[1]), media.openMedia(...args))
            : (...args) => media[m](...args);
        ipcMain.handle(ch, guarded(ch, isTrusted, call));
    }
    registered = true;
}
exports.registerOfflineIpc = registerOfflineIpc;
