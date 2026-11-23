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
/** Options for `registerOfflineIpc`. */
export interface RegisterOfflineIpcOptions {
    /**
     * Your own trust check, run for every invocation AFTER the top-level-frame check. Return `false` to
     * reject the call (e.g. allow only your own `file://` or `app://` origin via
     * `event.senderFrame.url`, or only specific `event.sender` WebContents). When you pass it, it decides
     * the origin question: the bridge no longer holds to the first origin that opened a store, and
     * `allowedOrigins` is ignored.
     */
    isTrustedSender?: (event: any) => boolean;
    /**
     * An explicit allow-list of the origins your app serves its renderer from, e.g. `["file://"]`,
     * `["app://bundle"]` or `["https://app.example"]` (as {@link senderOrigin} names them: every
     * `file://` page is the single origin `"file://"`; a custom scheme is its scheme-and-host). When set,
     * it is the WHOLE origin policy and governs EVERY call — including the ones allowed before a store has
     * opened (`open`, `probeCipher`, the two wipes). This closes the window in which any page loaded
     * before your first `open` could open a store (unsealing a key), pin its own origin, or name another
     * `(app, user)` and so wipe the recorded pair at rest. Prefer it to the default first-open pinning
     * whenever you know your origins up front. Ignored when `isTrustedSender` is given.
     *
     * Each entry is compared with the caller's origin as an exact string, with no normalising: write it as
     * the origin is named, with no path or trailing slash and in lower case for `http(s)` (`URL.origin`).
     * `"https://app.example"` matches a page on `https://app.example/`; `"https://App.example/"` does not.
     */
    allowedOrigins?: string[];
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
export declare function registerOfflineIpc(options?: RegisterOfflineIpcOptions): void;
