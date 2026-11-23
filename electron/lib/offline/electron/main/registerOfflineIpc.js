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
 * The sender policy every invocation meets first: it must carry a `senderFrame`, and that frame must be
 * the top-level frame of its WebContents. Subframes / iframes (which may host third-party content) are
 * refused. The origin check comes after it (see `senderOrigin`).
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
/**
 * The origin of the frame making a call, or `null` when it has none that can be named (`about:blank`,
 * `data:`). Every `file://` page counts as one origin, so a host loading local files keeps working. A
 * custom scheme (`app://bundle`) has no origin in the URL parser, so it is scheme and host, or the scheme
 * alone when it has no host (`app:///index.html`).
 */
function senderOrigin(event) {
    const url = event && event.senderFrame && event.senderFrame.url;
    if (typeof url !== "string" || !url)
        return null;
    try {
        const u = new URL(url);
        if (u.protocol === "file:")
            return "file://";
        if (u.origin && u.origin !== "null")
            return u.origin;
        if (u.protocol === "about:" || u.protocol === "data:" || u.href.indexOf(u.protocol + "//") !== 0)
            return null;
        return u.host ? u.protocol + "//" + u.host : u.protocol;
    }
    catch {
        return null;
    }
}
/**
 * The channels a page may call before a store has opened. `open` is how one opens. The rest have callers that
 * run with none open: `probeCipher` answers the status API before the first open; the two wipes run for a logout
 * or the server switch reading off when offline never started this launch, for the stale pairs at the top of every
 * start, and for the escalation that a store which will not open needs (StorageAdapterFactory.wipeOfflineDataAtRest,
 * createStorageAdapter). Refused, their data would stay on disk.
 */
const CHANNELS_BEFORE_OPEN = ["open", "probeCipher", "wipeByName", "wipeMediaByName"];
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
function guarded(channel, isTrusted, beforeOpen, call) {
    return (event, ...args) => {
        let ok = false;
        try {
            ok = isTrusted(event, beforeOpen) === true;
        }
        catch (e) {
            ok = false;
        }
        if (!ok) {
            // A distinct name so the renderer can tell a trust rejection from an absent engine across IPC
            // (only name+message survive): the factory then stays online-only instead of switching sideways
            // to the weaker browser store (StoreDamage.isSenderRejectedError).
            const err = new Error(`CometChat offline: rejected ${channel} from an untrusted sender`);
            err.name = StoreDamage_1.OFFLINE_SENDER_REJECTED_NAME;
            throw err;
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
 * options). Every handler first applies the sender policy: top-level frames only, then the origin check,
 * which is, in order of precedence:
 *   1. `options.isTrustedSender` when supplied — it decides every call and nothing is pinned;
 *   2. otherwise `options.allowedOrigins` when supplied — every call, pre-open ones included, must come
 *      from a listed origin, and nothing is pinned;
 *   3. otherwise the origin of the first `open` that succeeded: the bridge holds to that origin until
 *      the process ends, so a page the window later navigated to cannot read the cache. A logout does
 *      not release it, so the next login in the same run must come from the same origin.
 *
 * Under (3) ONLY, a narrow window exists before the first store opens: `open`, `probeCipher` and the two
 * wipes by name are answered for any top-level origin (the wipes must run with no store open — a logout
 * reading off, the stale-pair sweep at the start of a launch, the self-heal escalation). So a page
 * loaded before your first `open` can open a store (which unseals a key and pins that page's origin) or
 * name another `(app, user)` and wipe the recorded pair at rest. Pass `allowedOrigins` (or
 * `isTrustedSender`) to close that window; with neither, the bridge warns once that it is relying on
 * first-open pinning. A rejected call throws (the renderer's invoke rejects) without reaching the
 * engines. `appId`/`uid` arguments are validated by the engines themselves. Main keeps one `(app, user)`
 * at rest: opening another pair wipes the previous one first (`ActivePair`).
 *
 * This does not replace navigation hardening in the host app: load your own page before the first
 * open, and refuse navigation to other origins (`will-navigate`, `setWindowOpenHandler`).
 */
function registerOfflineIpc(options) {
    if (registered)
        return;
    const { ipcMain } = require("electron");
    const custom = options && typeof options.isTrustedSender === "function" ? options.isTrustedSender : null;
    // An explicit allow-list (when there is no custom check): the whole origin policy, governing pre-open
    // calls too. `null` when none was given, so the first-open pin applies.
    const allowed = !custom && options && Array.isArray(options.allowedOrigins) && options.allowedOrigins.length
        ? options.allowedOrigins.filter((o) => typeof o === "string" && o.length > 0)
        : null;
    const allowedSet = allowed && allowed.length ? new Set(allowed) : null;
    if (!custom && !allowedSet) {
        // No origin was declared up front: the bridge will trust the first top-level origin that opens a
        // store and hold to it. Say so once, so a host that never meant to rely on that (and skipped
        // navigation hardening) is not silently exposed in the pre-open window.
        console.warn("CometChat offline: registerOfflineIpc was given neither `allowedOrigins` nor `isTrustedSender`. " +
            "The bridge will trust the first top-level origin that opens a store and hold to it for the rest " +
            "of the process; until that first open, any top-level page can open a store or wipe a pair at rest. " +
            "Pass `allowedOrigins` to lock this down, and harden navigation in your main process " +
            "(will-navigate / setWindowOpenHandler).");
    }
    let pinnedOrigin = null;
    // The `open`s still waiting on the asynchronous key store. Each may yet pin, so another origin waits as if one
    // had. A count, because overlapping opens from one origin settle one at a time.
    let openingOrigin = null;
    let opening = 0;
    const originAllowed = (event, beforeOpen) => {
        const origin = senderOrigin(event);
        if (origin === null)
            return false;
        // An explicit allow-list is the whole policy: it governs the pre-open channels too, so nothing is
        // pinned and no first page can grab the bridge or wipe a pair.
        if (allowedSet)
            return allowedSet.has(origin);
        if (pinnedOrigin !== null)
            return origin === pinnedOrigin;
        if (opening > 0 && origin !== openingOrigin)
            return false;
        return beforeOpen;
    };
    const isTrusted = (event, beforeOpen) => isTopLevelSender(event) && (custom ? custom(event) === true : originAllowed(event, beforeOpen));
    /** The `open` handler: its origin is pinned once the engine says the store opened, not before. */
    const pinOnOpen = (handler) => (event, ...args) => {
        const res = handler(event, ...args);
        const origin = senderOrigin(event);
        const pinIfOpened = (r) => {
            if (r && r.ok === true && pinnedOrigin === null)
                pinnedOrigin = origin;
            return r;
        };
        if (!res || typeof res.then !== "function")
            return pinIfOpened(res);
        openingOrigin = origin;
        opening++;
        const settled = (r) => {
            opening--;
            return pinIfOpened(r);
        };
        return res.then(settled, (e) => {
            settled(null);
            throw e;
        });
    };
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
        const handler = guarded(ch, isTrusted, CHANNELS_BEFORE_OPEN.indexOf(m) !== -1, call);
        ipcMain.handle(ch, m === "open" ? pinOnOpen(handler) : handler);
    }
    for (const m of ElectronBridge_1.MEDIA_METHODS) {
        const ch = ElectronBridge_1.MEDIA_CHANNEL(m);
        const call = m === "openMedia"
            ? (...args) => (bindPair(args[0], args[1]), media.openMedia(...args))
            : (...args) => media[m](...args);
        ipcMain.handle(ch, guarded(ch, isTrusted, CHANNELS_BEFORE_OPEN.indexOf(m) !== -1, call));
    }
    registered = true;
}
exports.registerOfflineIpc = registerOfflineIpc;
