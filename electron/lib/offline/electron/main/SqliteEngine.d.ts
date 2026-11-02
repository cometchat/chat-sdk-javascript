/**
 * Main-process `OfflineStore` over better-sqlite3 — the real files-on-disk metadata backend for
 * Electron. Mirrors `IndexedDbOfflineStore` behaviourally and REUSES the shared `Projections`
 * predicates (`inScope` / `matchesMessage`) + `extractTags`/`extractMentions`, so the query
 * semantics are identical to the browser. better-sqlite3 is synchronous + transactional, so every
 * method is sync; the IPC layer turns the return value into the renderer's resolved Promise.
 *
 * DB file: `app.getPath('userData')/cometchat-offline/<appId>_<uid>.db`. One DB per user.
 *
 * NOT part of the renderer SDK bundle — imported only by the host app's main process, where
 * `electron`, `better-sqlite3` and `node:*` are available (resolved via runtime `require`).
 *
 * @module offline/electron/main/SqliteEngine
 */
import { AttachmentRow, BlockedUserRow, ConversationRow, LocalQuery, MessageRow, SendState, SnapshotMeta, SnapshotPageRow, UploadBatchRow, UploadFileRow, WriteResult, ListKind, ListOps, ListScope, MessageFlagUpdate } from "../../OfflineTypes";
import { OfflineOpenResult } from "../ElectronBridge";
/**
 * The oldest `electron` and `better-sqlite3-multiple-ciphers` offline supports (R65). Both are optional
 * peers declared with no version range, so an app on an older release still installs and builds; the
 * floors are checked here instead, in the main process when offline opens a store.
 */
export declare const MIN_ELECTRON_MAJOR = 20;
export declare const MIN_SQLITE_DRIVER_MAJOR = 9;
/**
 * Why the installed peers are too old for offline, or `null` when they are fine. A version that is
 * absent or unreadable is not a reason: an absent driver is reported by {@link resolveSqliteDriver},
 * and `electron` is always present in a real main process.
 */
export declare function peerVersionProblem(electronVersion: string | null | undefined, driverVersion: string | null | undefined): string | null;
export declare class SqliteEngine {
    private db;
    private dbFile;
    private keyFile;
    private encrypted;
    private cipher;
    /**
     * R156 / BEH-SYNC-15: the monotonic conversation-write stamp (Android SqliteOfflineStore.writeSeqCounter),
     * seeded lazily from `MAX(writeSeq)` on disk so it stays above everything persisted after a restart.
     */
    private writeSeqCounter;
    private writeSeqSeeded;
    private seedWriteSeqOnce;
    /** The next monotonic conversation-write stamp (seeds on first use). */
    private nextConvWriteSeq;
    currentConversationWriteSeq(): number;
    /** Everything the key store needs, resolved from the live main process. */
    private keyDeps;
    /**
     * Open (or reopen) the per-(app, user) database.
     *
     * Order is load-bearing when encrypting: `PRAGMA key` must be the FIRST statement on the connection
     * — before `journal_mode`, before the schema, before any read — and the proof that it took has to
     * come before anything is written. See `SqliteCipher.applyKeyAndProve`.
     *
     * Never throws for a storage problem: an open that cannot be completed comes back as a classified
     * failure so the renderer can apply `encryptionFailureBehavior` (BUILD/LINK) or decide to retry
     * (TRANSIENT). The one exception is an invalid `appId`/`uid` (see PathSafety), which is refused
     * with a thrown Error before any file or folder is touched.
     */
    /**
     * Is the cipher build installed and linked? Asked on a throwaway in-memory connection — no file,
     * no key store — so the status API can answer `cipherAvailable` before any store opens (BEH-ENC-14).
     */
    probeCipher(): boolean;
    open(appId: string, uid: string, options?: {
        encryption?: boolean;
    }): OfflineOpenResult;
    /**
     * Bring up a connection: key it, prove it, then configure and migrate.
     *
     * `journal_mode` and the schema deliberately come AFTER the proof — writing WAL frames or DDL to a
     * file we have not yet shown we can read is how a half-written, unreadable database gets made.
     */
    private attach;
    /**
     * Bring an already-created database up to the current column set. Idempotent: each column is added
     * only when `PRAGMA table_info` says it is absent, so this is a no-op on a freshly created file and
     * on every subsequent open.
     */
    private addMissingColumns;
    /** The tiers this connection actually achieved. */
    private openResult;
    /** A rebuild during the current open, reported once with its result (BEH-ENC-15/16). */
    private pendingReset;
    private close;
    /**
     * Delete an `(app, user)` database WITHOUT opening it — the server kill switch and the logout wipe
     * when no store is open. Opening would mint a new key, so this never opens, and it never creates a
     * directory or a file.
     *
     * Order: the sealed key sidecar FIRST (always, whatever tier the store was last opened at), then
     * the database and its WAL files. A crash in between leaves an unreadable file, never a readable
     * one. A failed key delete is logged and the database is still removed. Idempotent.
     */
    wipeByName(appId: string, uid: string): void;
    /** Remove the database and its WAL sidecars. Does NOT touch the key. */
    private removeDatabaseFiles;
    wipe(): void;
    private toDbMessage;
    private fromDbMessage;
    private readonly MSG_COLS;
    private readonly MSG_PLACEHOLDERS;
    /** Insert/replace a message + rebuild its message_tags projection in the SAME transaction. */
    private putMessage;
    private getByLocalId;
    private getByServerId;
    upsertMessages(rows: MessageRow[]): WriteResult[];
    listMessages(q: LocalQuery): MessageRow[];
    /** The queued rows (PENDING / SENDING / FAILED) a read matches, oldest compose time first. */
    private queuedMatching;
    private listMessagesKeyset;
    pending(conversationId?: string): MessageRow[];
    reconcileOnAck(localMessageId: string, serverRow: MessageRow): void;
    /** Atomic check-and-set of an outbox row's send state (BEH-SEND-03). One UPDATE, so it cannot interleave. */
    transitionSendState(localMessageId: string, from: SendState[], to: SendState, failureReason?: string): boolean;
    setSendState(localMessageId: string, state: SendState, failureReason?: string): void;
    replaceIfPresent(row: MessageRow): boolean | "OUTBOX_ROW";
    mergeReaction(messageId: number | string, emoji: string, reactorUid: string | undefined, added: boolean, selfUid: string): boolean;
    bumpReplyCountIfPresent(parentMessageId: number | string): boolean;
    decrementReplyCountIfPresent(parentMessageId: number | string): boolean;
    purgeConversation(conversationId: string): void;
    /**
     * Full-footprint purge: ALL messages (SENT + pending/sending/failed, matched by the
     * row's conversationId OR the canonical id derived from a provisional outbox row) + their tags +
     * attachment rows + the conversation row, in one tx. Returns the media byte keys to reclaim and the
     * distinct outbox keys of the deleted pending rows.
     */
    purgeConversationFootprint(conversationId: string): {
        mediaKeys: string[];
        outboxKeys: string[];
        outboxRows: MessageRow[];
    };
    /** Read-time delete-by-omission — SENT rows strictly interior to the page's bounds and absent from
     *  it, whole-footprint (message + tags + attachment rows). Interior/SENT-only; replies-exempt in
     *  top-level-only mode. See `OfflineStore.purgeAbsentInInterior`. */
    purgeAbsentInInterior(conversationId: string, presentServerIds: number[], minLocalSortTs: number, maxLocalSortTs: number, topLevelOnly: boolean): {
        mediaKeys: string[];
    };
    advanceReceipts(conversationId: string, selfUid: string, uptoMessageId: number, deliveredAt?: number, readAt?: number): boolean;
    existingMessageIds(ids: number[]): number[];
    deleteMessages(localMessageIds: string[]): void;
    /** R160 (BEH-SEND-36): durably remove ONE unsent outbox message (PENDING/FAILED). See OfflineStore. */
    discardOutboxMessage(localMessageId: string): {
        removed: boolean;
        sendState?: SendState;
        mediaKeys: string[];
        conversationRemoved: boolean;
    };
    private toDbConversation;
    private fromDbConversation;
    private readonly CONV_COLS;
    private readonly CONV_PLACEHOLDERS;
    upsertConversations(rows: ConversationRow[]): WriteResult[];
    touchConversationRecency(conversationId: string, ts: number): void;
    incrementUnreadIfPresent(conversationId: string, largeGroupThreshold: number): void;
    clearUnreadIfPresent(conversationId: string, advanceReadMarkerTo?: number | "latest"): void;
    mergeConversationTagsIfPresent(conversationId: string, tags: string[], updatedAt: number): boolean;
    /** BEH-CONV-09: the preview only, iff `messageId` is still the conversation's last message. */
    replaceConversationPreviewIfLast(conversationId: string, messageId: number, payload: unknown): boolean;
    mergeConversationLastMessageIfPresent(conversationId: string, lastMessage: unknown, lastMessageId: number | undefined, sortTs: number, createIfAbsent?: {
        conversationType: "user" | "group";
        conversationWith: unknown;
    } | null): boolean;
    listConversations(q: LocalQuery): ConversationRow[];
    deleteConversations(ids: string[]): void;
    private metaGet;
    private metaSet;
    readWatermark(): number;
    /** One `sync_meta` value as a string, or `null` when absent. */
    readMeta(key: string): string | null;
    /** Write several `sync_meta` values in one transaction; a `null` value deletes the key. */
    writeMeta(entries: {
        [key: string]: string | number | null;
    }): void;
    /**
     * Empty the store IN PLACE (`clearOfflineCache`, BEH-AUTH-14). The file, its key and the
     * encryption-mode / schema markers stay; every cached row, the outbox, the cursors and the blocked
     * set go, in one transaction. Returns the unsent rows the transaction actually deleted.
     */
    clearInPlace(): MessageRow[];
    advanceWatermark(ts: number): void;
    readLastSyncTimestamp(): number;
    setLastSyncTimestamp(ts: number): void;
    private readonly ATT_COLS;
    private readonly ATT_PLACEHOLDERS;
    upsertAttachment(row: AttachmentRow): void;
    getAttachment(attachmentId: string): AttachmentRow | null;
    listAttachments(): AttachmentRow[];
    setAttachmentAccessed(attachmentId: string, ts: number): void;
    deleteAttachment(attachmentId: string): void;
    private fromDbAttachment;
    upsertUploadBatch(row: UploadBatchRow): void;
    getUploadBatch(batchKey: string): UploadBatchRow | null;
    /** Cascade: delete the batch's file rows then the batch row, in one tx. */
    deleteUploadBatch(batchKey: string): void;
    upsertUploadFile(row: UploadFileRow): void;
    listUploadFiles(batchKey: string): UploadFileRow[];
    listAllUploadFiles(): UploadFileRow[];
    deleteUploadFile(batchKey: string, fileId: string): void;
    private fromDbUploadFile;
    getConversationById(conversationId: string): ConversationRow | null;
    getMessageById(messageId: number | string): MessageRow | null;
    setConversationsBlockedByMe(uids: string[], blocked: boolean, selfUid: string): string[];
    replaceBlockedUsers(rows: BlockedUserRow[], fetchedAt?: number): void;
    upsertBlockedUsers(rows: BlockedUserRow[]): void;
    listBlockedUsers(): BlockedUserRow[];
    putSnapshotPage(row: SnapshotPageRow): void;
    private putSnapshotPageRow;
    getSnapshotPage(signature: string, pageIndex: number): SnapshotPageRow | null;
    deleteSnapshotsByScope(readType: string, scope: string): void;
    deleteSnapshotsBySignature(signature: string): void;
    listSnapshotMeta(): SnapshotMeta[];
    touchSnapshot(signature: string, ts: number): void;
    logicalByteSize(): number;
    applyMessageFlags(updates: MessageFlagUpdate[]): number[];
    setThreadSubscribed(rootId: number | string, value: boolean): void;
    clearPerUserFlags(conversationId: string): void;
    private fromDbListRow;
    private fromDbListMeta;
    getListScope(kind: ListKind, scopeKey: string): ListScope;
    applyListOps(kind: ListKind, scopeKey: string, ops: ListOps, expectRev: number): boolean;
    /** Bump the `rev` of the stores a removal touched, so an in-flight page sees the local change. */
    private bumpListRevs;
    deleteListItems(kinds: ListKind[], itemIds: string[]): void;
    private deleteListRowsByConversationTx;
    deleteListRowsByConversation(conversationId: string, kinds: ListKind[]): void;
    refreshListCopies(items: {
        itemId: string;
        updatedAt?: number;
        payload: unknown;
    }[]): void;
}
/**
 * The on-disk format of a database file, from its 16-byte header (BEH-ENC-16; the detection is
 * Band 3). A plaintext SQLite file starts with `SQLite format 3\0`; an SQLCipher file's first page
 * is ciphertext. `NONE` when the file is absent or empty.
 */
export declare function sqliteFileFormat(fs: any, file: string): "NONE" | "PLAINTEXT" | "ENCRYPTED";
/**
 * The unsent rows of a database file about to be rebuilt (BEH-ENC-16), as safe report rows — opened
 * read-only, with `keyHex` when the file is encrypted. `null` when the file cannot be read. A file
 * that is busy or locked (another connection or process holds it) throws instead: it is not lost, and
 * the caller must not rebuild over it (TRANSIENT, BEH-ENC-11).
 */
export declare function readUnsentFromFile(Database: any, file: string, keyHex: string | null): any[] | null;
