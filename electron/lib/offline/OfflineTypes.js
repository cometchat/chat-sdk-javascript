"use strict";
/**
 * Core seams + row/query types for the offline engine. Runtime-specific classes
 * (IndexedDB, OPFS, Electron) implement these interfaces.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGE_FLAG_KEYS = void 0;
/** The message flag columns, in one place for carry-forward and clearing. */
exports.MESSAGE_FLAG_KEYS = [
    "pinnedAt",
    "pinnedBy",
    "savedAt",
    "threadSubscribed",
];
