"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.installCometChatBridge = void 0;
const ElectronBridge_1 = require("./ElectronBridge");
/**
 * Expose the CometChat offline bridge on `window`. Call once from the host app's preload script.
 * Safe to call more than once (later calls are ignored by contextBridge).
 */
function installCometChatBridge() {
    const { contextBridge, ipcRenderer } = require("electron");
    const db = {};
    for (const m of ElectronBridge_1.DB_METHODS) {
        const channel = ElectronBridge_1.DB_CHANNEL(m);
        db[m] = (...args) => ipcRenderer.invoke(channel, ...args);
    }
    const native = {};
    for (const m of ElectronBridge_1.MEDIA_METHODS) {
        const channel = ElectronBridge_1.MEDIA_CHANNEL(m);
        native[m] = (...args) => ipcRenderer.invoke(channel, ...args);
    }
    try {
        contextBridge.exposeInMainWorld(ElectronBridge_1.COMETCHAT_DB_BRIDGE, db);
        contextBridge.exposeInMainWorld(ElectronBridge_1.COMETCHAT_NATIVE_BRIDGE, native);
    }
    catch {
        /* already exposed (double install) — ignore */
    }
}
exports.installCometChatBridge = installCometChatBridge;
