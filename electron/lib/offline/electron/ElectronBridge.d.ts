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
import { AttachmentRow, BlockedUserRow, ConversationRow, LocalQuery, MessageRow, SendState, SnapshotMeta, SnapshotPageRow, UploadBatchRow, UploadFileRow, WriteResult, ListKind, ListOps, ListScope, MessageFlagUpdate } from "../OfflineTypes";
/**
 * What the main process reports back from an `open`.
 *
 * `open` used to return `void`. It has to say more now: the renderer owns the public status API and
 * the encryption-failure policy, but only main can see whether the cipher engine is linked or the OS
 * secret store answered — so the outcome travels back over the bridge instead of being guessed.
 *
 * Carries no key material of any kind. That is not incidental: `safeStorage` is a main-process API,
 * the DEK is unsealed and used entirely in main, and nothing about it crosses IPC.
 */
export interface OfflineOpenResult {
    /** Did a usable store open? `false` means the caller must apply `encryptionFailureBehavior`. */
    ok: boolean;
    /** Is the cipher engine actually present and linked? */
    cipherAvailable: boolean;
    /** The coverage tier actually achieved. */
    atRest: "NONE" | "SQLCIPHER";
    /** The key tier actually achieved. */
    keyStorage: "KEYSTORE" | "NONE";
    cipher: string | null;
    /** Whole-file encryption leaks nothing at the database level, so this is always null here. */
    leakage: string | null;
    /** How to handle a failed open. Absent when `ok`. */
    failure?: "BUILD_LINK" | "TRANSIENT" | "PERMANENT" | "UNCLASSIFIED";
    failureReason?: string;
    /**
     * Set when this open wiped and rebuilt the database, losing its outbox (BEH-ENC-15/16): the reason
     * (`ENCRYPTION_CHANGED` / `WRONG_KEY` / `CORRUPTED`) and how many unsent messages were lost, or
     * `null` when they could not be counted.
     */
    reset?: {
        reason: string;
        pendingLost: number | null;
        unsent?: MessageRow[];
    };
}
/** Global key the preload exposes the metadata bridge under. */
export declare const COMETCHAT_DB_BRIDGE = "cometchatDb";
/** Global key the preload exposes the media bridge under. */
export declare const COMETCHAT_NATIVE_BRIDGE = "cometchatNative";
/**
 * Metadata store over IPC → main-process better-sqlite3. Mirrors `OfflineStore` (minus the
 * synchronous `MediaFileStore` concerns), one channel per method. The main process holds the
 * open DB for the current (appId, uid); `open` (re)opens it, `wipe` deletes it.
 */
export interface CometChatDbBridge {
    open(appId: string, uid: string, options?: {
        encryption?: boolean;
    }): Promise<OfflineOpenResult>;
    upsertMessages(rows: MessageRow[]): Promise<WriteResult[]>;
    listMessages(q: LocalQuery): Promise<MessageRow[]>;
    pending(conversationId?: string): Promise<MessageRow[]>;
    reconcileOnAck(localMessageId: string, serverRow: MessageRow): Promise<void>;
    setSendState(localMessageId: string, state: SendState, failureReason?: string): Promise<void>;
    /** `"OUTBOX_ROW"`: not written — the server's copy of a message still in the outbox (BEH-SEND-01). */
    replaceIfPresent(row: MessageRow): Promise<boolean | "OUTBOX_ROW">;
    mergeReaction(messageId: number | string, emoji: string, reactorUid: string | undefined, added: boolean, selfUid: string): Promise<boolean>;
    bumpReplyCountIfPresent(parentMessageId: number | string): Promise<boolean>;
    decrementReplyCountIfPresent(parentMessageId: number | string): Promise<boolean>;
    purgeConversation(conversationId: string): Promise<void>;
    applyMessageFlags(updates: MessageFlagUpdate[]): Promise<number[]>;
    clearPerUserFlags(conversationId: string): Promise<void>;
    setThreadSubscribed(rootId: number | string, value: boolean): Promise<void>;
    getListScope(kind: ListKind, scopeKey: string): Promise<ListScope>;
    applyListOps(kind: ListKind, scopeKey: string, ops: ListOps, expectRev: number): Promise<boolean>;
    deleteListItems(kinds: ListKind[], itemIds: string[]): Promise<void>;
    deleteListRowsByConversation(conversationId: string, kinds: ListKind[]): Promise<void>;
    refreshListCopies(items: {
        itemId: string;
        updatedAt?: number;
        payload: unknown;
    }[]): Promise<void>;
    purgeConversationFootprint(conversationId: string): Promise<{
        mediaKeys: string[];
        outboxKeys: string[];
        outboxRows?: MessageRow[];
    }>;
    purgeAbsentInInterior(conversationId: string, presentServerIds: number[], minLocalSortTs: number, maxLocalSortTs: number, topLevelOnly: boolean): Promise<{
        mediaKeys: string[];
    }>;
    advanceReceipts(conversationId: string, selfUid: string, uptoMessageId: number, deliveredAt?: number, readAt?: number): Promise<boolean>;
    existingMessageIds(ids: number[]): Promise<number[]>;
    deleteMessages(localMessageIds: string[]): Promise<void>;
    discardOutboxMessage(localMessageId: string): Promise<{
        removed: boolean;
        sendState?: SendState;
        mediaKeys: string[];
        conversationRemoved: boolean;
    }>;
    upsertConversations(rows: ConversationRow[]): Promise<WriteResult[]>;
    listConversations(q: LocalQuery): Promise<ConversationRow[]>;
    deleteConversations(ids: string[]): Promise<void>;
    touchConversationRecency(conversationId: string, ts: number): Promise<void>;
    incrementUnreadIfPresent(conversationId: string, largeGroupThreshold: number): Promise<void>;
    clearUnreadIfPresent(conversationId: string, advanceReadMarkerTo?: number | "latest"): Promise<void>;
    mergeConversationTagsIfPresent(conversationId: string, tags: string[], updatedAt: number): Promise<boolean>;
    replaceConversationPreviewIfLast(conversationId: string, messageId: number, payload: unknown): Promise<boolean>;
    mergeConversationLastMessageIfPresent(conversationId: string, lastMessage: unknown, lastMessageId: number | undefined, sortTs: number, createIfAbsent?: {
        conversationType: "user" | "group";
        conversationWith: unknown;
    } | null): Promise<boolean>;
    currentConversationWriteSeq(): Promise<number>;
    readWatermark(): Promise<number>;
    advanceWatermark(ts: number): Promise<void>;
    readLastSyncTimestamp(): Promise<number>;
    setLastSyncTimestamp(ts: number): Promise<void>;
    upsertAttachment(row: AttachmentRow): Promise<void>;
    getAttachment(attachmentId: string): Promise<AttachmentRow | null>;
    listAttachments(): Promise<AttachmentRow[]>;
    setAttachmentAccessed(attachmentId: string, ts: number): Promise<void>;
    deleteAttachment(attachmentId: string): Promise<void>;
    upsertUploadBatch(row: UploadBatchRow): Promise<void>;
    getUploadBatch(batchKey: string): Promise<UploadBatchRow | null>;
    deleteUploadBatch(batchKey: string): Promise<void>;
    upsertUploadFile(row: UploadFileRow): Promise<void>;
    listUploadFiles(batchKey: string): Promise<UploadFileRow[]>;
    listAllUploadFiles(): Promise<UploadFileRow[]>;
    deleteUploadFile(batchKey: string, fileId: string): Promise<void>;
    getConversationById(conversationId: string): Promise<ConversationRow | null>;
    getMessageById(messageId: number | string): Promise<MessageRow | null>;
    setConversationsBlockedByMe(uids: string[], blocked: boolean, selfUid: string): Promise<string[]>;
    replaceBlockedUsers(rows: BlockedUserRow[], fetchedAt?: number): Promise<void>;
    upsertBlockedUsers(rows: BlockedUserRow[]): Promise<void>;
    listBlockedUsers(): Promise<BlockedUserRow[]>;
    putSnapshotPage(row: SnapshotPageRow): Promise<void>;
    getSnapshotPage(signature: string, pageIndex: number): Promise<SnapshotPageRow | null>;
    deleteSnapshotsByScope(readType: string, scope: string): Promise<void>;
    deleteSnapshotsBySignature(signature: string): Promise<void>;
    listSnapshotMeta(): Promise<SnapshotMeta[]>;
    touchSnapshot(signature: string, ts: number): Promise<void>;
    logicalByteSize(): Promise<number>;
    transitionSendState(localMessageId: string, from: SendState[], to: SendState, failureReason?: string): Promise<boolean>;
    readMeta(key: string): Promise<string | null>;
    writeMeta(entries: {
        [key: string]: string | number | null;
    }): Promise<void>;
    clearInPlace(): Promise<MessageRow[]>;
    /** Is the cipher build present? Opens nothing (BEH-ENC-14). */
    probeCipher(): Promise<boolean>;
    wipe(): Promise<void>;
    /**
     * Delete an `(app, user)` database WITHOUT opening it: the sealed key sidecar first, then the
     * database and its WAL files. Idempotent; creates nothing.
     */
    wipeByName(appId: string, uid: string): Promise<void>;
}
/**
 * Media byte store over IPC → main-process node:fs. Blobs cross IPC as `ArrayBuffer`. `openMedia`
 * returns the absolute per-user media root so the renderer can compute `ref()` synchronously
 * (the value stored in `attachment.localPath`, kept opaque).
 */
export interface CometChatNativeBridge {
    openMedia(appId: string, uid: string): Promise<string>;
    put(key: string, bytes: ArrayBuffer, opts?: {
        protected?: boolean;
    }): Promise<string>;
    get(key: string): Promise<ArrayBuffer | null>;
    has(key: string): Promise<boolean>;
    remove(key: string): Promise<void>;
    totalBytes(): Promise<number>;
    wipe(): Promise<void>;
    /** Delete an `(app, user)`'s media folder (and the legacy per-user one) without opening it. */
    wipeMediaByName(appId: string, uid: string): Promise<void>;
}
/** IPC channel names — one per bridge method. Shared by the preload and the main handlers. */
export declare const DB_CHANNEL: (method: keyof CometChatDbBridge) => string;
export declare const MEDIA_CHANNEL: (method: keyof CometChatNativeBridge) => string;
/** Every method the preload forwards and the main process handles — the wiring source of truth. */
export declare const DB_METHODS: (keyof CometChatDbBridge)[];
export declare const MEDIA_METHODS: (keyof CometChatNativeBridge)[];
/** The renderer-visible global scope augmented with the bridge (populated by the preload). */
export interface CometChatBridgeGlobals {
    [COMETCHAT_DB_BRIDGE]?: CometChatDbBridge;
    [COMETCHAT_NATIVE_BRIDGE]?: CometChatNativeBridge;
}
