/**
 * Core seams + row/query types for the offline engine. Runtime-specific classes
 * (IndexedDB, OPFS, Electron) implement these interfaces.
 */
import { MessageSource } from "./OfflineEnums";
/** Opaque handle persisted as `attachment.localPath` — never assume a real FS path. */
export declare type MediaRef = string;
/**
 * Per-row write outcome from an LWW upsert. `OUTBOX_ROW`: the row is the server's copy of a message
 * still in the outbox (PENDING / SENDING, matched by its echoed `localMessageId`, same sender and
 * conversation) and was not written; the outbox settles it (BEH-SEND-01). Another message carrying that
 * key is not written either, and reads `SKIPPED_STALE`.
 */
export declare type WriteResult = "OK" | "SKIPPED_STALE" | "FAILED" | "OUTBOX_ROW";
/** Send-side state of a message row (public `status` is derived from this + receipts). */
export declare type SendState = "PENDING" | "SENDING" | "SENT" | "FAILED";
/**
 * Canonical message row — the flat columns are extracted copies of `payload`
 * (the rendering source of truth). `id` is omitted while pending (sparse index).
 */
export interface MessageRow {
    localMessageId: string;
    id?: number;
    conversationId: string;
    senderUid: string;
    receiverType: "user" | "group";
    receiverId: string;
    type: string;
    category: string;
    parentMessageId?: number;
    quotedMessageId?: number;
    sentAt?: number;
    updatedAt?: number;
    deletedAt?: number;
    deliveredAt?: number;
    readAt?: number;
    sendState: SendState;
    failureReason?: string;
    localSortTs: number;
    source?: MessageSource;
    payload: unknown;
    tags: string[];
    /**
     * BEH-READ-41 (R81): this write's request applied `withTags`, so a payload without `tags` CLEARS the
     * stored ones. Absent, a payload without `tags` says nothing about them and the stored tags are kept.
     * Write-only: never stored.
     */
    tagsAuthoritative?: boolean;
    mentions: string[];
    /**
     * Write-time projection: does the payload carry at least one attachment? (Offline Read Coverage §5
     * `hasAttachments`.) A PROJECTION, not a read-time payload check, deliberately: under cache
     * encryption the payload is sealed inside `__enc` and is `null` on the row the index scan sees, so
     * a payload-reading predicate would silently match nothing. Rebuilt on every write, like `tags`.
     */
    hasAttachments?: boolean;
    /**
     * Write-time projection: the distinct `AttachmentType` values of this message's attachments
     * (`image` | `video` | `audio` | `file`), derived from each attachment's mime type — the same
     * vocabulary `MessagesRequestBuilder.setAttachmentTypes` sends on the wire (§5 `attachmentTypes`).
     */
    attachmentTypes?: string[];
    /** Write-time projection: does the payload carry at least one reaction? (§5 `hasReactions`.) */
    hasReactions?: boolean;
    /** When the message was pinned (seconds), or `null` when it is known not to be pinned. */
    pinnedAt?: number | null;
    /** Who pinned it — a uid, or `app_system` for an admin pin. */
    pinnedBy?: string | null;
    /** When the logged-in user saved it (seconds), or `null` when known not to be saved. */
    savedAt?: number | null;
    /** Whether the logged-in user follows this message's thread (the value belongs to the thread root). */
    threadSubscribed?: boolean | null;
}
/** The message flag columns, in one place for carry-forward and clearing. */
export declare const MESSAGE_FLAG_KEYS: ReadonlyArray<"pinnedAt" | "pinnedBy" | "savedAt" | "threadSubscribed">;
/** A flag-only update for one cached message, applied update-if-cached (BEH-FLAG-01). */
export interface MessageFlagUpdate {
    /** Server message id. */
    id: number;
    pinnedAt?: number | null;
    pinnedBy?: string | null;
    savedAt?: number | null;
    threadSubscribed?: boolean | null;
}
/** Per-user conversation snapshot — NOT derivable from messages. */
export interface ConversationRow {
    conversationId: string;
    conversationType: "user" | "group";
    conversationWith: unknown;
    lastMessage?: unknown;
    lastMessageId?: number;
    unreadCount: number;
    updatedAt?: number;
    localSortTs: number;
    lastAccessedTs: number;
    tags: string[];
    newestCachedMessageId?: number;
    oldestCachedMessageId?: number;
    /**
     * I blocked the peer (§4.4). Driven by the cached blocked-users store + block/unblock self-ops,
     * NOT by a conversation read. Queryable: the default conversation list filters these OUT and the
     * `includeBlockedUsers` view includes them, both locally.
     *
     * **Field-protected.** Both backends upsert with `{ ...existing, ...row }`, so a writer that did
     * not learn the blocked state must OMIT this key entirely (never set it to `undefined`) — that is
     * what stops a plain read or a realtime update from clobbering it.
     */
    blockedByMe?: boolean;
    /**
     * The peer blocked me (§4.4). Sourced from `withBlockedInfo` on the reconnect sweep. Same
     * field-protection rule as {@link blockedByMe}.
     */
    hasBlockedMe?: boolean;
    /**
     * Write-time projection: is this an agentic conversation (§4.2)? True **iff** the conversation is
     * 1:1 AND the peer user's role is `@agentic`. A group is never agentic.
     */
    isAgentic?: boolean | null;
    /**
     * Write-time projection of the PEER entity's tags — `conversationWith.tags` for a user or a group
     * (§4.2 `userTags` / `groupTags`). Distinct from {@link tags}, which is the conversation's OWN
     * tags. Blind-indexed under encryption exactly like `tags`, so the filter stays a mid-scan column
     * match in both tiers.
     */
    peerTags?: string[];
    /**
     * The conversation's read marker — the newest message id the current user has read (§4.5). Drives
     * the message `unread` filter (`id > lastReadMessageId`, §11-confirmed). Advanced by the offline
     * read hook and refreshed by the `markAsUnread` conversation write-back.
     */
    lastReadMessageId?: string;
    /** Carried for model fidelity — `rowToConversation` previously hard-coded 0. */
    unreadMentionsCount?: number;
    /** Carried for model fidelity — `rowToConversation` previously hard-coded "". */
    latestMessageId?: string;
    /**
     * The conversation's pin (BEH-CPIN-01): when it was pinned (seconds) and by whom (`app_system` for
     * an admin pin). Field-protected like the blocked flags: a writer that is not authoritative for the
     * pin omits both keys, and `null` means "known not pinned".
     */
    pinnedAt?: number | null;
    pinnedBy?: string | null;
    /**
     * BEH-CPIN-01: the admin pin and the user's own pin, kept apart (Android ConversationRecord.java:39-40).
     * `pinnedAt`/`pinnedBy` above are DERIVED from these by the store on every write (the admin pin wins).
     * A writer puts only the column(s) its source proves; an absent key keeps the stored pin; `null`
     * means "known not pinned" by that source. Rows from before the split read through `pinsOf`.
     */
    systemPinnedAt?: number | null;
    ownPinnedAt?: number | null;
    /**
     * R156 / BEH-SYNC-15 (Android ConversationRecord.serverReturned): has any server conversation answer
     * ever returned this conversation? Set `true` ONLY by the server-row mappers (the sweep page, the
     * list-page read, `getConversation` write-back); a local send that synthesizes a brand-new row leaves
     * it unset. STICKY — the `{...existing, ...row}` upsert carries it forward (a local bump omits the
     * key; a server answer over a local-only row ORs it to `true`), and only a per-user wipe or a purge
     * drops it with the row. Delete-by-omission NEVER purges a row that is not `serverReturned` (absence
     * proves deletion only for a conversation the server has returned before) — this closes the data loss
     * where a first send to a new peer, absent from a complete page, was purged and its message discarded.
     */
    serverReturned?: boolean;
    /**
     * R156 / BEH-SYNC-15 (Android ConversationRecord.writeSeq): a monotonic stamp the STORE assigns on
     * every conversation-row write, seeded from `MAX(writeSeq)` on disk. Compared against the
     * `dispatchSeq` captured when a conversation fetch is dispatched: a row with `writeSeq > dispatchSeq`
     * was written after the request went out (a realtime receive or an own send landing in the request
     * window), so the server answer could not have known about it and its absence proves nothing — it is
     * spared by-omission regardless of the floor. Device-local; never sourced from the server.
     */
    writeSeq?: number;
}
/** Which list store a row belongs to. */
export declare type ListKind = "PINNED" | "SAVED" | "THREADS";
/**
 * One entry in a list store — a gap-free slice from the top of a server list, kept in the server's
 * order (BEH-THR-04 / BEH-THR-07).
 */
export interface ListRow {
    kind: ListKind;
    /** The store's scope: the conversationId for `PINNED`, `""` for the global stores. */
    scopeKey: string;
    /** The entry's identity: the message id (`PINNED` / `SAVED`) or the thread root id (`THREADS`). */
    itemId: string;
    /** The conversation the entry belongs to — scoped removal and uid/guid filtering. */
    conversationId: string;
    /** Primary server sort key: `pinnedAt` / `sentAt` / thread `updatedAt`; `null` while provisional. */
    serverK1: number | null;
    /** Tie-break server key: the message id / thread root id. */
    serverK2: number | null;
    /** Display order key: `serverK1`, or a provisional key until a server page carries the row. */
    sortK1: number;
    /** The held copy's `updatedAt` — refreshes are last-write-wins on it. */
    updatedAt?: number;
    /** The store `rev` at this row's last local change (exempts it from an older page's omission). */
    localRev: number;
    /** The full server JSON (message, or thread) this entry renders from. */
    payload: unknown;
}
/** Per-store bookkeeping. A store with no meta row has not started (its cache phase is empty). */
export interface ListMeta {
    kind: ListKind;
    scopeKey: string;
    /** The oldest server key the store holds — the slice's floor. `null` while empty. */
    floorK1: number | null;
    floorK2: number | null;
    /** True once the whole server list is held (BEH-FLAG-07). */
    complete: boolean;
    /** Monotonic; bumped on every local change. */
    rev: number;
}
/** One store's rows and meta, read together. */
export interface ListScope {
    rows: ListRow[];
    meta: ListMeta | null;
}
/** An atomic change to one list store, applied only if its `rev` is still `expectRev`. */
export interface ListOps {
    put: ListRow[];
    delete: string[];
    /** The store's new meta, or `null` to remove the store entirely. */
    meta: ListMeta | null;
}
/**
 * One entry in the canonical blocked-users store (§3.1 / §4.4).
 *
 * The COMPLETE list of the current user's blocking relationships, refreshed periodically and by
 * block/unblock self-ops. Canonical, NOT a snapshot: it is updated in place, and it serves three
 * separate consumers — `BlockedUsersRequest` offline, the conversation `blockedByMe` flag, and the
 * message `hideMessagesFromBlockedUsers` filter.
 */
export interface BlockedUserRow {
    uid: string;
    /** I blocked them. */
    blockedByMe: boolean;
    /** They blocked me. */
    hasBlockedMe: boolean;
    /** Verbatim User JSON, so the offline `BlockedUsersRequest` replays real User models. */
    user: unknown;
    updatedAt: number;
}
/**
 * One recorded page of an entity-list read (§6 snapshot / record-replay).
 *
 * Keyed by `(signature, pageIndex)`. The `response` is the server's body **verbatim** — replay parses
 * it with the type's own normal parser, so the offline list is byte-for-byte what the online list was.
 * Storage is isolated from the canonical stores: the reconnect sweep never touches it (§7).
 */
export interface SnapshotPageRow {
    /** Canonical predicate string (§6.1) — excludes the pagination cursor and excluded predicates. */
    signature: string;
    /** 0-based page index within this signature; the replay index counts up from 0. */
    pageIndex: number;
    /** Read type for `(readType, scope)` self-op invalidation (§6.3). */
    readType: string;
    /** Invalidation scope — "" for global reads, else the guid / message id the read is scoped to. */
    scope: string;
    /** The verbatim server response body, JSON-stringified. */
    response: string;
    hasNext: boolean;
    /** Record time — TTL eviction (`snapshotTtlDays`). */
    recordedAt: number;
    /** Last replay/record touch — LRU eviction (`maxSnapshotQueries`). */
    lastAccessedTs: number;
}
/** Per-signature rollup used by the snapshot eviction pass (§6.4). */
export interface SnapshotMeta {
    signature: string;
    recordedAt: number;
    lastAccessedTs: number;
    pages: number;
    bytes: number;
}
/** Attachment metadata row (bytes live in the MediaFileStore, never here). */
export interface AttachmentRow {
    attachmentId: string;
    localMessageId: string;
    fileUrl?: string;
    localPath?: MediaRef;
    mimeType?: string;
    name?: string;
    size?: number;
    width?: number;
    height?: number;
    isExternalUrl?: boolean;
    lastAccessedTs?: number;
    pendingProtected?: boolean;
}
/**
 * Durable upload-batch config row (offline direct-to-storage media uploads, OU-2/OU-4/OU-13a).
 * Keyed by the canonical triple key (`uploadBatchKey`). Holds only batch-level config; the per-file
 * rows live in {@link UploadFileRow}. Bytes live in the MediaFileStore, never here.
 */
export interface UploadBatchRow {
    batchKey: string;
    batchId: string;
    receiverType: string;
    receiverId: string;
    parentMessageId?: string;
    concurrency: number;
    updatedAt: number;
}
/**
 * Durable per-file row within an upload batch (OU-4/OU-13a). One row per added file, restored in
 * `orderIndex` (insertion) order. The copied bytes live in the MediaFileStore under `localKey`
 * (pre-upload) and are re-keyed to the hosted URL on success (OU-8); `mediaRef` is the opaque handle.
 */
export interface UploadFileRow {
    batchKey: string;
    fileId: string;
    orderIndex: number;
    name: string;
    size: number;
    mimeType: string;
    state: string;
    localKey?: string;
    mediaRef?: MediaRef;
    attachmentJson?: string;
    failureCode?: string;
    failureMessage?: string;
    updatedAt: number;
}
/**
 * The cache-side translation of a fetch request — ONLY the locally-computable
 * predicates. Server-only filters never reach here.
 */
export interface LocalQuery {
    kind: "messages" | "conversations";
    conversationId?: string;
    /** Scope a message read to a 1:1 peer (matches sender/receiver, either direction). */
    uid?: string;
    /** Scope a message read to a group. */
    guid?: string;
    selfUid?: string;
    /**
     * Pre-built canonical 1:1 conversationId for the `(selfUid, uid)` pair, used by `inScope` INSTEAD of
     * deriving one. Set only by the encrypted browser path, where `selfUid`/`uid` have been replaced by
     * blind indexes and the canonical id can no longer be built from them (`RowCodec.encodeQuery`
     * derives it from the plaintext first, then hashes it). Absent everywhere else, so the plaintext and
     * Electron paths derive it exactly as before.
     */
    scopeConversationId?: string;
    categories?: string[];
    types?: string[];
    tags?: string[];
    hasMentions?: boolean;
    mentionedUIDs?: string[];
    hideDeleted?: boolean;
    hideReplies?: boolean;
    parentMessageId?: number;
    conversationType?: "user" | "group";
    onlyUnread?: boolean;
    limit?: number;
    /**
     * Message `unread` filter (§5, §11-confirmed): keep messages whose server `id` is strictly greater
     * than the conversation's read marker. Resolved from the cached conversation's `lastReadMessageId`
     * by the read wiring, so the predicate itself stays a pure column comparison.
     */
    unreadAfterMessageId?: number;
    /**
     * Message `unread` on a cross-conversation read (no uid/guid, BEH-READ-36/39): each message against
     * its OWN conversation, keyed by conversationId → that conversation's stored `lastReadMessageId`
     * (0 when it has none), or -1 when its cached `unreadCount` is 0 (nothing matches). A conversation
     * not in the map reads as pointer 0. A row with no server id never matches.
     */
    unreadMarkers?: {
        [conversationId: string]: number;
    };
    /** Keep only messages carrying at least one attachment (§5 `hasAttachments`). */
    hasAttachments?: boolean;
    /** Keep only messages with an attachment of one of these `AttachmentType`s (§5, OR-of-types). */
    attachmentTypes?: string[];
    /** Keep only messages carrying at least one reaction (§5 `hasReactions`). */
    hasReactions?: boolean;
    /**
     * Drop messages whose sender is in this set — `hideMessagesFromBlockedUsers` (§5), fed from the
     * complete blocked-users store. Matches the `senderUid` COLUMN, so it survives blind indexing.
     */
    excludeSenderUids?: string[];
    /**
     * Outbox isolation (§7): drop pending/sending/failed rows. Set by the read wiring whenever ANY
     * content filter is active, so a pending message shows in the canonical conversation view but
     * never in a filtered message view.
     */
    sentOnly?: boolean;
    /**
     * BEH-READ-10 / BEH-READ-31: page the SENT rows by the keyset and place the queued rows (PENDING /
     * SENDING / FAILED) after every sent row, as the message-list cache phase reads. With no cursor (the
     * newest page) the page is the newest `limit` of sent-then-queued; an after-cursor page reaches the
     * queued rows only once the sent rows newer than the cursor are used up, and then only those composed
     * after `pendingAfterSortTs`; a before-cursor (older) page never holds a queued row. Without the flag
     * the read is the plain `(localSortTs, id)` keyset, unchanged for every other caller.
     */
    pendingLast?: boolean;
    /** With `pendingLast` on an after-cursor read: the newest queued row's `localSortTs` already delivered. */
    pendingAfterSortTs?: number;
    /** Match the PEER user's tags (`userTags`) — OR across the requested tags. */
    userTags?: string[];
    /** Match the PEER group's tags (`groupTags`) — OR across the requested tags. */
    groupTags?: string[];
    /** Keep only agentic conversations (§4.2 `onlyAgentic`). */
    onlyAgentic?: boolean;
    /** Drop agentic conversations (§4.2 `hideAgentic`). */
    hideAgentic?: boolean;
    /**
     * Include `blockedByMe` conversations (§4.2 `includeBlockedUsers`). The default list EXCLUDES
     * them; this opts them back in, interleaved by the normal recency sort.
     */
    includeBlockedUsers?: boolean;
    /**
     * BEH-CONV-17: the ASCII-lowercased uids the blocked-users store marks `blockedByMe`. The store fills
     * it on a default (non-`includeBlockedUsers`) conversation read, so the exclusion follows the store
     * (Android LocalConversationQuery.java:104), never the row's own column.
     */
    blockedByMeUids?: string[];
    beforeSortTs?: number;
    beforeSortId?: number;
    afterSortTs?: number;
    afterSortId?: number;
    beforeConversationId?: string;
}
/** Persistence contract — one canonical, UNFILTERED store. All writes LWW by updatedAt. */
export interface OfflineStore {
    /**
     * LWW upsert. A served copy (`SENT`) of a row still in the outbox (`PENDING` / `SENDING`) is never
     * written over it: its result is `OUTBOX_ROW`, and the committed batch's such rows go to the
     * served-outbox listener, so the send reaches its one final outcome (BEH-SEND-01).
     */
    upsertMessages(rows: MessageRow[]): Promise<WriteResult[]>;
    /**
     * Who hears about served copies of outbox rows that an upsert left to the outbox (the runtime wires
     * the live outbox; `null` clears it). Called after the write commits, with plaintext rows.
     */
    setServedOutboxListener?(listener: ((rows: MessageRow[]) => void) | null): void;
    listMessages(q: LocalQuery): Promise<MessageRow[]>;
    pending(conversationId?: string): Promise<MessageRow[]>;
    reconcileOnAck(localMessageId: string, serverRow: MessageRow): Promise<void>;
    /** Transition an outbox row's send-state (PENDING/SENDING/SENT/FAILED). */
    setSendState(localMessageId: string, state: SendState, failureReason?: string): Promise<void>;
    /**
     * Atomic check-and-set of an outbox row's send state (BEH-SEND-03): moves the row to `to` only if
     * it exists and is currently in one of `from`, and says whether it did. A failed flip never
     * dispatches, so neither a second tab nor a retry can send the same row twice.
     */
    transitionSendState(localMessageId: string, from: SendState[], to: SendState, failureReason?: string): Promise<boolean>;
    /** One `sync_meta` value as a string, or `null` when absent. */
    readMeta(key: string): Promise<string | null>;
    /** Write several `sync_meta` values in one transaction; `null` deletes a key. */
    writeMeta(entries: {
        [key: string]: string | number | null;
    }): Promise<void>;
    /**
     * Empty the store in place (`clearOfflineCache`, BEH-AUTH-14): rows, outbox, cursors, blocked
     * users, snapshots and list stores go; the store stays open and the encryption key is kept.
     * Resolves with the unsent (PENDING / SENDING / FAILED) rows the clear deleted — read in the same
     * transaction, so a send enqueued just before is announced and one enqueued after is untouched.
     */
    clearInPlace(): Promise<MessageRow[]>;
    /**
     * Replace an already-cached message with an authoritative server copy (edit / delete /
     * moderation). Cache-only — NEVER inserts; returns `false` (no-op) if the message isn't
     * cached. LWW by the message's bumped server `updatedAt`. Watermark untouched.
     */
    replaceIfPresent(row: MessageRow): Promise<boolean>;
    /**
     * Merge an others' real-time reaction delta into a cached message's `payload.data.reactions`.
     * Cache-only (no-op if absent), `updatedAt` preserved. Add bumps/inserts; remove lowers and
     * drops at 0; `reactedByMe` set only when `reactorUid === selfUid`.
     */
    mergeReaction(messageId: number | string, emoji: string, reactorUid: string | undefined, added: boolean, selfUid: string): Promise<boolean>;
    /**
     * Bump a cached parent message's `replyCount` by +1 when a reply is cached. Cache-only — match the
     * parent by server `id`; if absent return `false` and **never insert**. A leaf write: mutate only
     * `payload.replyCount`, preserving `updatedAt`/`localSortTs` so a later real parent refresh still
     * wins by LWW. Caller fires it once per reply, never on a re-upsert of an already-cached reply id.
     */
    bumpReplyCountIfPresent(parentMessageId: number | string): Promise<boolean>;
    /**
     * Decrement a cached parent message's `replyCount` by 1 (clamped >= 0) when a reply is deleted.
     * Same contract as {@link bumpReplyCountIfPresent} but −1. The CALLER gates this on the
     * `core.threads.decrementReplyCountOnDelete` login flag (default off).
     */
    decrementReplyCountIfPresent(parentMessageId: number | string): Promise<boolean>;
    /**
     * Purge a conversation from the cache on `deleteConversation` success: delete its
     * SENT messages **and** the conversation row by one composite `conversationId`; KEEP
     * outbox (PENDING/SENDING/FAILED) rows. Watermark untouched.
     */
    purgeConversation(conversationId: string): Promise<void>;
    /**
     * Delete a conversation's ENTIRE footprint on delete-by-omission: ALL its messages
     * (SENT **and** pending/sending/failed outbox rows — matched by the row's conversationId OR the
     * canonical id derived from a provisional row) + their attachment rows + the conversation row, in
     * one transaction. Returns the media byte keys to reclaim and the distinct outbox keys (provisional
     * conversationIds) of the deleted pending rows, so the caller can reclaim bytes and dequeue the live
     * outbox, and the unsent rows themselves (`outboxRows`, read in the deleting transaction) so the
     * caller announces exactly those. Watermark untouched. Unlike `purgeConversation`, this does NOT
     * keep the outbox.
     */
    purgeConversationFootprint(conversationId: string): Promise<{
        mediaKeys: string[];
        outboxKeys: string[];
        outboxRows?: MessageRow[];
    }>;
    /**
     * Read-time delete-by-omission: purge cached **SENT** messages in `conversationId`
     * whose `localSortTs` lies **strictly between** `minLocalSortTs` and `maxLocalSortTs` (the page's
     * oldest/newest) and whose server `id` is **absent** from `presentServerIds` — the server dropped
     * them. Interior-only (never the boundary rows, never above-newest/below-oldest), SENT-only (never
     * the outbox), whole-footprint (message row + attachment rows). When `topLevelOnly`, purge only rows
     * with no `parentMessageId` (replies exempt — a `hideReplies`-only read). Returns media byte keys to
     * reclaim. No-op if there is no interior.
     */
    purgeAbsentInInterior(conversationId: string, presentServerIds: number[], minLocalSortTs: number, maxLocalSortTs: number, topLevelOnly: boolean): Promise<{
        mediaKeys: string[];
    }>;
    /**
     * Advance cached receipt columns for the current user's OWN-SENT messages in a
     * conversation, cumulatively up to `uptoMessageId`. Monotonic (never regress), cache-only
     * (no-op if absent, never inserts), `read` ⇒ also `delivered`, `updatedAt` untouched. Writes
     * both the flat columns AND `payload.deliveredAt`/`payload.readAt` so a rehydrate (which
     * rebuilds from the payload) reflects the receipt.
     */
    advanceReceipts(conversationId: string, selfUid: string, uptoMessageId: number, deliveredAt?: number, readAt?: number): Promise<boolean>;
    /**
     * Return which of `ids` (server ids) are already cached — the sync new-vs-update split
     * keys on cache presence by server id so a cached realtime message re-fetched by the
     * sweep classifies as an update (upsert-by-id, no duplicate).
     */
    existingMessageIds(ids: number[]): Promise<number[]>;
    deleteMessages(localMessageIds: string[]): Promise<void>;
    /**
     * R160 (BEH-SEND-36): durably and device-only remove ONE unsent outbox message by its
     * `localMessageId`, in one transaction. Removes ONLY when the row is still `PENDING` or `FAILED`
     * (a `SENDING`, `SENT`, or absent row is a no-op → `removed: false` with the state it found, so the
     * caller decides the rejection). When it removes, it deletes the message row (and its tags +
     * attachment rows), and in the same transaction:
     *  - resets the conversation's last-message preview to the newest remaining cached message of that
     *    conversation (or clears it when none remain), but ONLY when the removed message WAS the preview;
     *  - removes the conversation row entirely (with its list-store rows) when the conversation is
     *    LOCAL-ONLY — it was synthesized by a local send and never returned by the server, so its
     *    `updatedAt` is still unset (R156) — and now has no messages left.
     * Returns the removed message's media byte keys to reclaim (its copied-outgoing / attachment bytes),
     * whether a row was removed and its `sendState`, and whether the conversation was removed.
     */
    discardOutboxMessage(localMessageId: string): Promise<{
        removed: boolean;
        sendState?: SendState;
        mediaKeys: string[];
        conversationRemoved: boolean;
    }>;
    upsertConversations(rows: ConversationRow[]): Promise<WriteResult[]>;
    listConversations(q: LocalQuery): Promise<ConversationRow[]>;
    deleteConversations(ids: string[]): Promise<void>;
    /**
     * R156 / BEH-SYNC-15 (Android OfflineStore.currentConversationWriteSeq): the store's current monotonic
     * conversation-write stamp — the max `writeSeq` assigned so far. Captured the moment a conversation
     * fetch is dispatched and threaded into delete-by-omission as `dispatchSeq`, so a row written after
     * dispatch (`writeSeq > dispatchSeq`) is spared. Best-effort: an implementation may return 0 if it
     * cannot read the counter (the `serverReturned` marker still protects every local-only row).
     */
    currentConversationWriteSeq(): Promise<number>;
    /**
     * Read ONE cached conversation by its canonical id — the cache phase of the two-phase
     * `getConversation` (§2) and the source of the read marker for the message `unread` filter (§5).
     * Returns `null` when the conversation isn't cached (offline → empty, never a guess).
     */
    getConversationById(conversationId: string): Promise<ConversationRow | null>;
    /**
     * Read ONE cached message by its server id — the cache phase of the two-phase `getMessageDetails`
     * (§2). Returns `null` when the message isn't cached.
     */
    getMessageById(messageId: number | string): Promise<MessageRow | null>;
    /**
     * Set/clear the `blockedByMe` flag on cached 1:1 conversations whose peer is in `uids` (§4.4
     * block/unblock self-op). **Keep-and-flag** — the conversation row is never purged, so the
     * `includeBlockedUsers` view can still serve it from cache. Cache-only: never inserts. Preserves
     * `updatedAt` (this is not a server mutation of the last message) and every other field.
     * Returns the conversationIds actually touched.
     */
    setConversationsBlockedByMe(uids: string[], blocked: boolean, selfUid: string): Promise<string[]>;
    /**
     * Bump a cached conversation's device-local "last relevant" recency (`lastAccessedTs`)
     * monotonically forward to `ts` — the timestamp retention + whole-conversation LRU rank on. Cache-only:
     * a no-op if the conversation isn't cached (never inserts). Never lowers an existing value. Called
     * ONLY on a genuine new-message arrival or a genuine user open — NEVER from a server sync/`updatedAt`.
     */
    touchConversationRecency(conversationId: string, ts: number): Promise<void>;
    /**
     * Bump a cached conversation's `unreadCount` by +1 on a qualifying realtime receive. A cache-only
     * leaf write that PRESERVES `updatedAt`, is a no-op if the conversation isn't cached, and SKIPS the
     * bump for a known-large group — one whose cached membership is >= `largeGroupThreshold` (unknown or
     * zero membership counts anyway; the next getConversations corrects via LWW).
     */
    incrementUnreadIfPresent(conversationId: string, largeGroupThreshold: number): Promise<void>;
    /**
     * Set a cached conversation's `unreadCount` to 0 on any local read
     * (markAsRead / markConversationAsRead). A cache-only leaf write that PRESERVES `updatedAt`, is a
     * no-op if the conversation isn't cached, and fires independent of the read's network call (offline too).
     *
     * `advanceReadMarkerTo` (ADDITIVE, optional — omitting it keeps the exact previous behaviour) also
     * advances `lastReadMessageId`, monotonically, so the new message-`unread` filter stays correct
     * after the user's own read (§4.5). Pass a specific id for the message-level `markAsRead`; pass
     * `"latest"` for a conversation-level read, which advances the marker to the conversation's own
     * cached last message. Never regresses an existing marker.
     */
    clearUnreadIfPresent(conversationId: string, advanceReadMarkerTo?: number | "latest"): Promise<void>;
    /**
     * Merge tags into an already-cached conversation (tags-only field-merge, on tagConversation
     * success). Cache-only — NEVER inserts (returns `false` if the conversation isn't cached) and
     * preserves every local-only field (lastMessage/unreadCount/LRU last-accessed/window
     * watermarks). LWW: a positive `updatedAt` older than the cached row's is skipped; `updatedAt`
     * never regresses. Atomic get→merge→put so it is race-free.
     */
    mergeConversationTagsIfPresent(conversationId: string, tags: string[], updatedAt: number): Promise<boolean>;
    /**
     * BEH-CONV-09: replace a cached conversation's preview (`lastMessage`) with `payload` iff its
     * `lastMessageId` is still `messageId` — atomically, preview only: never the sort key, `updatedAt`,
     * the last-message id, unread, tags or recency, and never an insert (Android
     * OfflineStore.replacePreviewIfLastMessage). Returns whether it wrote.
     */
    replaceConversationPreviewIfLast(conversationId: string, messageId: number, payload: unknown): Promise<boolean>;
    /**
     * Reflect a locally-composed (offline) SEND into an already-cached conversation as a field-merge:
     * override `lastMessage`/`lastMessageId` and forward-bump the sort/version stamps
     * (`localSortTs`/`updatedAt`) + LRU recency so the conversation re-sorts to the top on the next
     * cache read (e.g. a Conversations-tab remount). Cache-only — NEVER inserts (returns `false` if the
     * conversation isn't cached) and preserves every other field (unreadCount / conversationWith /
     * tags / window watermarks). LWW: a `sortTs` strictly older than the cached `localSortTs` is
     * skipped; stamps never regress. Atomic get→merge→put so it is race-free. The pending value is
     * transient — the reconnect conversation-sync replaces it with the server-acked lastMessage.
     *
     * Create-if-absent: when the conversation is NOT cached and `createIfAbsent` is provided, synthesize
     * a new row from that identity so a brand-new chat appears at the top immediately. The synthesized row
     * starts `unreadCount: 0` and leaves `updatedAt` unset (the next getConversations fills the
     * authoritative peer + `updatedAt` via LWW). Omit `createIfAbsent` to keep the strict never-insert
     * behaviour.
     */
    mergeConversationLastMessageIfPresent(conversationId: string, lastMessage: unknown, lastMessageId: number | undefined, sortTs: number, createIfAbsent?: {
        conversationType: "user" | "group";
        conversationWith: unknown;
    } | null): Promise<boolean>;
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
    /** Every upload file row of every batch (the orphan upload-copy reclaim, BEH-UPLOAD-12). */
    listAllUploadFiles(): Promise<UploadFileRow[]>;
    deleteUploadFile(batchKey: string, fileId: string): Promise<void>;
    /**
     * Replace the ENTIRE blocked-users store with `rows` — the periodic `GET /blockedusers` reconcile
     * is authoritative (it is the multi-device source of truth), so a stale local entry must not
     * survive it. Atomic: the store is never observed half-written.
     */
    replaceBlockedUsers(rows: BlockedUserRow[], fetchedAt?: number): Promise<void>;
    /**
     * Merge block/unblock self-op deltas in place (§4.4, §6.3 — "updated in place, not a snapshot").
     * Inserts a row that isn't there yet; a row left with neither flag set is deleted.
     */
    upsertBlockedUsers(rows: BlockedUserRow[]): Promise<void>;
    /** The whole store, insertion-independent. Callers filter by direction and page in memory. */
    listBlockedUsers(): Promise<BlockedUserRow[]>;
    /** Record one page of an entity read: `(signature, pageIndex)` → verbatim response. */
    putSnapshotPage(row: SnapshotPageRow): Promise<void>;
    /** Replay one page. `null` on a miss → the read is empty offline, never a guess. */
    getSnapshotPage(signature: string, pageIndex: number): Promise<SnapshotPageRow | null>;
    /** Self-op invalidation (§6.3): drop every snapshot for a `(readType, scope)` pair. */
    deleteSnapshotsByScope(readType: string, scope: string): Promise<void>;
    /** Drop one signature's pages (LRU/TTL eviction). */
    deleteSnapshotsBySignature(signature: string): Promise<void>;
    /** Per-signature rollup for the eviction pass (§6.4). */
    listSnapshotMeta(): Promise<SnapshotMeta[]>;
    /** Bump a signature's LRU recency on replay. Monotonic; no-op when the signature is absent. */
    touchSnapshot(signature: string, ts: number): Promise<void>;
    /**
     * Apply flag-only updates to cached messages by server id. Update-if-cached: never inserts, never
     * changes `updatedAt` or `localSortTs`, and never sets a flag on a message that has `deletedAt`
     * (BEH-FLAG-03). Returns the ids that were updated.
     */
    applyMessageFlags(updates: MessageFlagUpdate[]): Promise<number[]>;
    /**
     * Clear the per-user flags (`savedAt`, `threadSubscribed`) on every cached message of one
     * conversation (BEH-FLAG-06). Pins are untouched.
     */
    clearPerUserFlags(conversationId: string): Promise<void>;
    /**
     * Set `threadSubscribed` on a thread root and every cached reply to it together (BEH-SUB-01): the
     * value belongs to the root. Update-if-cached; never moves `updatedAt`.
     */
    setThreadSubscribed(rootId: number | string, value: boolean): Promise<void>;
    /** One store's rows (in no particular order) and meta. */
    getListScope(kind: ListKind, scopeKey: string): Promise<ListScope>;
    /**
     * Apply `ops` to one store atomically, only if its current `rev` equals `expectRev` (`0` for a store
     * that has not started). Returns `false` on a conflict, and the caller re-reads and retries.
     */
    applyListOps(kind: ListKind, scopeKey: string, ops: ListOps, expectRev: number): Promise<boolean>;
    /** Remove entries by id from every store of `kinds`, in every scope (deletes, unpins, unsaves). */
    deleteListItems(kinds: ListKind[], itemIds: string[]): Promise<void>;
    /**
     * Remove every entry of one conversation from `kinds`. A `PINNED` store scoped to it is removed
     * whole, meta included.
     */
    deleteListRowsByConversation(conversationId: string, kinds: ListKind[]): Promise<void>;
    /**
     * Refresh the held copy of each message in the `PINNED` and `SAVED` stores, last-write-wins on
     * `updatedAt` (BEH-THR-04 (h)). Never inserts.
     */
    refreshListCopies(items: {
        itemId: string;
        updatedAt?: number;
        payload: unknown;
    }[]): Promise<void>;
    logicalByteSize(): Promise<number>;
    wipe(): Promise<void>;
}
/** Media-byte tier. bytes on OPFS (web) / node:fs (Electron), keyed independently of the DB. */
export interface MediaFileStore {
    put(key: string, bytes: Blob, opts?: {
        protected?: boolean;
    }): Promise<MediaRef>;
    get(key: string): Promise<Blob | null>;
    has(key: string): Promise<boolean>;
    remove(key: string): Promise<void>;
    ref(key: string): MediaRef;
    totalBytes(): Promise<number>;
    wipe(): Promise<void>;
}
/** What the engine is handed at login — one bundle per runtime. */
export interface StorageAdapter {
    store: OfflineStore;
    media: MediaFileStore | null;
    /**
     * The outbox rows the open read to prove the store (StorageAdapterFactory), handed once to startup
     * recovery so a start reads the outbox once. Absent on a store that was already open.
     */
    openOutbox?: MessageRow[];
}
