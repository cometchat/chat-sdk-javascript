/**
 * Electron preload — installs the SDK-owned bridge on the renderer.
 *
 * The host app calls `installCometChatBridge()` from its preload script (the one referenced by
 * `webPreferences.preload`). It exposes `cometchatDb` + `cometchatNative` via `contextBridge`,
 * each method forwarding to `ipcRenderer.invoke` on a fixed channel. The host never types the
 * exposed names — that contract is owned here.
 *
 * Requires `contextIsolation: true` / `nodeIntegration: false`; sandbox-compatible (uses only
 * `contextBridge` + `ipcRenderer`). NOT part of the renderer SDK bundle — imported directly by
 * the host's preload, where `electron` is available.
 *
 * @module offline/electron/preload
 */
/**
 * Expose the CometChat offline bridge on `window`. Call once from the host app's preload script.
 * Safe to call more than once (later calls are ignored by contextBridge).
 */
export declare function installCometChatBridge(): void;
