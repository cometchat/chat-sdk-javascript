"use strict";
/**
 * The SDK-owned Electron bridge contract.
 *
 * The preload exposes two objects on the renderer's global scope via `contextBridge`:
 *   - `cometchatDb`     — the metadata store (main-process better-sqlite3)
 *   - `cometchatNative` — the media byte store (main-process node:fs)
 *
 * Both the renderer stores (SqliteOfflineStore / NodeFsMediaStore) and the preload import
 * these types, so the exposed keys are a fixed, SDK-owned contract the host app never types.
 * This module is type-only + browser-safe (no electron / node imports), so it bundles into the
 * renderer SDK cleanly.
 *
 * @module offline/electron/ElectronBridge
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEDIA_METHODS = exports.DB_METHODS = exports.MEDIA_CHANNEL = exports.DB_CHANNEL = exports.COMETCHAT_NATIVE_BRIDGE = exports.COMETCHAT_DB_BRIDGE = void 0;
/** Global key the preload exposes the metadata bridge under. */
exports.COMETCHAT_DB_BRIDGE = "cometchatDb";
/** Global key the preload exposes the media bridge under. */
exports.COMETCHAT_NATIVE_BRIDGE = "cometchatNative";
/** IPC channel names — one per bridge method. Shared by the preload and the main handlers. */
exports.DB_CHANNEL = (method) => `cometchat:db:${method}`;
exports.MEDIA_CHANNEL = (method) => `cometchat:media:${method}`;
/** Every method the preload forwards and the main process handles — the wiring source of truth. */
exports.DB_METHODS = [
    "open", "upsertMessages", "listMessages", "pending", "reconcileOnAck", "setSendState",
    "replaceIfPresent", "mergeReaction", "bumpReplyCountIfPresent", "decrementReplyCountIfPresent",
    "purgeConversation", "purgeConversationFootprint",
    "purgeAbsentInInterior", "advanceReceipts", "existingMessageIds",
    "deleteMessages", "discardOutboxMessage", "upsertConversations", "listConversations", "deleteConversations",
    "touchConversationRecency", "incrementUnreadIfPresent", "clearUnreadIfPresent",
    "mergeConversationTagsIfPresent", "mergeConversationLastMessageIfPresent", "replaceConversationPreviewIfLast",
    "currentConversationWriteSeq",
    "readWatermark", "advanceWatermark", "readLastSyncTimestamp", "setLastSyncTimestamp",
    "upsertAttachment", "getAttachment", "listAttachments", "setAttachmentAccessed", "deleteAttachment",
    "upsertUploadBatch", "getUploadBatch", "deleteUploadBatch",
    "upsertUploadFile", "listUploadFiles", "listAllUploadFiles", "deleteUploadFile",
    // Offline Read Coverage: single reads, the canonical blocked-users store, and entity snapshots.
    "getConversationById", "getMessageById", "setConversationsBlockedByMe",
    "replaceBlockedUsers", "upsertBlockedUsers", "listBlockedUsers",
    "putSnapshotPage", "getSnapshotPage", "deleteSnapshotsByScope",
    "deleteSnapshotsBySignature", "listSnapshotMeta", "touchSnapshot",
    // Pin / save / follow flags and the pinned / saved / my-threads list stores.
    "applyMessageFlags", "clearPerUserFlags", "setThreadSubscribed", "getListScope", "applyListOps",
    "deleteListItems", "deleteListRowsByConversation", "refreshListCopies",
    "logicalByteSize", "wipe", "wipeByName",
    "transitionSendState", "readMeta", "writeMeta", "clearInPlace", "probeCipher",
];
exports.MEDIA_METHODS = [
    "openMedia", "put", "get", "has", "remove", "totalBytes", "wipe", "wipeMediaByName",
];
