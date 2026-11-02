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
     * Extra trust check run for every invocation, AFTER the default top-level-frame check. Return
     * `false` to reject the call (e.g. allow only your own `file://` or `app://` origin via
     * `event.senderFrame.url`, or only specific `event.sender` WebContents).
     */
    isTrustedSender?: (event: any) => boolean;
}
/**
 * Register the offline IPC handlers. Idempotent — subsequent calls are ignored (including their
 * options). Every handler first applies the sender policy: top-level frames only, plus
 * `options.isTrustedSender` when supplied; a rejected call throws (the renderer's invoke rejects)
 * without reaching the engines. `appId`/`uid` arguments are validated by the engines themselves.
 * Main keeps one `(app, user)` at rest: opening another pair wipes the previous one first (`ActivePair`).
 */
export declare function registerOfflineIpc(options?: RegisterOfflineIpcOptions): void;
