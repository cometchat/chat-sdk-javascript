/**
 * Small pure helpers shared by BOTH storage backends, so a rule is written once and cannot drift
 * between IndexedDB and SQLite. Same reason `Projections` and `ConversationFilters` exist.
 *
 * @module offline/read/StoreShared
 */
import { ConversationRow, LocalQuery, MessageRow, SnapshotMeta } from "../OfflineTypes";
/**
 * What a served message whose `data.localMessageId` (BEH-SEND-21) matched a cached row by that key is to
 * that row. Only for a row found BY localMessageId; the send's own ack (`reconcileOnAck`) never comes
 * here. Both rows are plaintext (a stored row's `id` and `sendState` are never sealed, so a stored row
 * with an id compares as it is).
 *  - `FOREIGN`: not that message. Against an acked row, any other server id (a crafted or colliding
 *    key, or a second server copy of a lost-ack send); against a row never acked, another sender or
 *    another conversation. It must neither overwrite the row nor settle it: it is stored under its own
 *    key (`foreignRowKey`) or dropped.
 *  - `OUTBOX`: the server's copy of a message still in the outbox (PENDING / SENDING). It is not written
 *    over it; the outbox settles it as sent once (BEH-SEND-01).
 *  - `null`: the same message (an edit, a re-fetch, the echo of an acked or FAILED send): written as usual.
 */
export declare function matchByLocalId(existing: {
    id?: number | string | null;
    sendState?: string;
    senderUid?: string | null;
    conversationId?: string | null;
} | null | undefined, incoming: {
    id?: number | string | null;
    sendState?: string;
    senderUid?: string | null;
    conversationId?: string | null;
}): "OUTBOX" | "FOREIGN" | null;
/** The key a FOREIGN served message is stored under (its server id's, as any fetched message), or null to drop it. */
export declare function foreignRowKey(incoming: {
    id?: number | string | null;
}): string | null;
/** Hand the served copies an upsert left to the outbox to its listener, after the commit. Never throws. */
export declare function notifyServedOutbox(listener: ((rows: MessageRow[]) => void) | null | undefined, rows: MessageRow[]): void;
/**
 * The conversation's read marker after a local read (§4.5).
 *
 * `advanceReadMarkerTo` is `undefined` for callers that only clear unread (the pre-existing
 * behaviour), a specific message id for the message-level `markAsRead(...)`, or `"latest"` for a
 * conversation-level read — which advances the marker to the conversation's own cached last message,
 * the deterministic "everything here is read" answer §4.5 asks for.
 *
 * Always monotonic: a marker never regresses, so an out-of-order read of an older message cannot
 * make already-read messages unread again. Ids are compared NUMERICALLY — `lastReadMessageId` is a
 * string on the model (and TEXT in SQLite), and a lexical compare would rank "9" above "40".
 */
export declare function nextReadMarker(existing: ConversationRow, advanceReadMarkerTo?: number | "latest"): string | undefined;
/** The row shape `rollupSnapshotMeta` needs — readable columns only, so no decryption is required. */
export interface SnapshotMetaSource {
    signature: string;
    recordedAt: number;
    lastAccessedTs: number;
    response?: string;
    /** Sealed bundle, when encryption is on — the bytes that actually occupy the quota. */
    __enc?: string;
}
/**
 * Roll individual snapshot PAGES up into one entry per signature — what LRU/TTL eviction (§6.4) and
 * the storage-budget accounting (§3) operate on. Eviction is per-signature, never per-page: half a
 * recorded read would replay as a list that silently stops mid-way.
 *
 * `recordedAt` takes the OLDEST page (the TTL clock starts when the read was first recorded) and
 * `lastAccessedTs` the NEWEST (any page's replay keeps the whole read hot).
 */
export declare function rollupSnapshotMeta(rows: SnapshotMetaSource[]): SnapshotMeta[];
/**
 * Snapshot LRU order (BEH-SNAP-10): least recently replayed first, ties broken by signature so the
 * victim is the same on every run and backend (Android SnapshotDao: `lastAccessedTs ASC, signature ASC`).
 */
export declare function compareSnapshotLru(a: SnapshotMeta, b: SnapshotMeta): number;
/**
 * BEH-READ-41 (R81): a message write keeps the stored tags unless its request applied `withTags`
 * (`row.tagsAuthoritative`) — keyed on the request, never on whether the payload carries `tags`. Returns
 * the row to write — its payload's tags replaced by the stored payload's (so the projection and the
 * rehydrated model keep them) unless the write is authoritative — and never with the write-only
 * `tagsAuthoritative` key. `existing` is the stored row, decoded (plaintext payload), or null for a
 * first insert, which takes the payload as it is.
 *
 * R133: the same for the embedded quoted message of a write whose request set `hideQuotedMessages`
 * (`row.keepStoredQuote`), present or absent (Android FlagMerge.merge, QUOTE_KEYS).
 */
export declare function keepStoredMessageTags(row: MessageRow, existing: MessageRow | null | undefined): MessageRow;
/**
 * BEH-EVICT-08 (updated 2026-11-09, ENG-41324): a conversation's device-local recency on an upsert
 * (Android ConversationMergePolicy.resolveOnUpsert). A cached row keeps its own value: no server
 * write moves it (re-saving never changes the time; listing/scrolling/syncing is not an access).
 *
 * A NEW row seeds from its SORT time — the last message's sent time, else `updatedAt`, carried on the
 * row as `localSortTs` — capped at now, NOT the device's `now`. Seeding every first insert with `now`
 * is the bug: when the user scrolls their whole list the oldest conversations are saved LAST, so they
 * look the most recently used, and the next cleanup keeps those and evicts the conversations actually
 * in use. A locally created row (own send / realtime receive) carries a `localSortTs` ≈ now, so it
 * still seeds at ~now; an explicit `lastAccessedTs` from such a seam wins, capped at now. A new row
 * with no sort time at all seeds at 0 (the rule's floor — Android ConversationMergePolicy), so an
 * unsortable row is treated as least-recently-used, never as "just now".
 */
export declare function seedRecency(existing: any, incoming: any): number;
/**
 * BEH-CONV-12: a conversation write that did not apply `withUserAndGroupTags` (no `peerTags` key) keeps
 * the stored peer's `conversationWith.tags`, so the rehydrated model never loses them either.
 */
export declare function keepStoredPeerTags(merged: any, existing: any, incoming: any): void;
/**
 * BEH-CONV-06: a conversation-list ingest is advance-only on the sort key and the preview, so a
 * snapshot older than local state (taken before an in-flight send committed, carrying an EQUAL
 * `updatedAt` that passes LWW) never demotes the row or reverts its last message. A genuinely newer
 * row still applies in full. Ported from Android ConversationMergePolicy.resolveOnUpsert /
 * isIngestPreviewNewer (ConversationMergePolicy.java:91-112, 227-240). Mutates `merged` in place;
 * a first insert (`existing` null) takes the incoming row as-is.
 */
export declare function keepAdvanceOnly(merged: any, existing: any, incoming: any): void;
/**
 * BEH-CONV-12/16: a row of a page's leading pinned block (or of a `pinnedBy` page) is the server's
 * pinned set, whose rows carry no includes — so it is written pin-only for tags and blocked info:
 * the conversation's tags, the peer's tags and `hasBlockedMe` are omitted and the stored values
 * survive the field-merge. Android ConversationTagScope.pinnedRow() (OfflineReadCache.java:744,
 * SyncEngine.java:514).
 */
export declare function asPinnedBlockRow<T>(row: T): T;
/** The derived `pinnedBy` column of a row whose shown pin is the user's own (reported as the uid at read). */
export declare const OWN_PINNER = "me";
/**
 * BEH-CPIN-01: a cached conversation's two pins — the admin pin and the user's own pin — read from the
 * `systemPinnedAt` / `ownPinnedAt` columns (Android ConversationRecord.java:39-40). A row written
 * before the two columns existed carries only the single `pinnedAt`/`pinnedBy` pair, which is read
 * as the one pin it names; that is the additive upgrade, no migration step. `null` = no pin.
 */
export declare function pinsOf(r: any): {
    system: number | null;
    own: number | null;
};
/**
 * BEH-CPIN-01: resolve the pin columns of a conversation write. A pin column the incoming row omits is
 * kept from the stored row (so each source changes only the pins it proves — the pin mode is which
 * columns the writer put on the row); then the shown `pinnedAt`/`pinnedBy` are derived: the admin pin
 * if there is one, else the own pin (Android ConversationMergePolicy.withPins :130, putDerivedPin).
 * Mutates `merged`. Only when either side has ever carried a pin; a row with no pin knowledge is
 * left as it was.
 */
export declare function resolvePins(merged: any, existing: any, incoming: any): void;
/**
 * Set the shown `pinnedAt`/`pinnedBy` from the two pin columns. An own pin shows its pinner (the uid)
 * when known, else {@link OWN_PINNER}; the delivered model always reports the current uid.
 */
export declare function derivePin(r: any, ownPinner?: string | null): void;
/** The message record's receipt state for a conversation preview (BEH-CONV-07). */
export interface PreviewReceipt {
    senderUid?: string;
    deliveredAt?: number;
    readAt?: number;
}
/**
 * BEH-CONV-07: the receipt state of each own-sent preview still missing a tick — one record read per
 * candidate, keyed by `lastMessageId` (Android OfflineModelMapper.receiptOverlayCandidates :649).
 */
export declare function previewReceipts(store: {
    getMessageById(id: number | string): Promise<any>;
}, rows: any[], selfUid: string | null): Promise<{
    [id: string]: PreviewReceipt;
}>;
/**
 * The cached preview as delivered — a copy, never written back (read-only, self-heals every read):
 *  - BEH-CONV-07: an own-sent preview takes the message record's deliveredAt/readAt where they are
 *    strictly ahead (identity + own-sent + advance-only; OfflineModelMapper.applyReceiptOverlay :775);
 *  - BEH-CONV-08: a preview with no sentAt (an un-acked send) takes the row's sort key, already epoch
 *    SECONDS, as-is (fill-only, needs a basis; applyPendingSentAtProjection :811).
 */
export declare function previewForDelivery(row: any, receipts?: {
    [id: string]: PreviewReceipt;
}): any;
/**
 * BEH-SEND-30 / D19: `localMessageId → send-state` for every own unsent outbox row (PENDING / SENDING /
 * FAILED), read once per conversation read from the sendState index. The values are exactly the
 * `MessageStatus` strings, so a conversation whose preview is one of these rows reports that state.
 */
export declare function unsentPreviewStatuses(store: {
    pending(conversationId?: string): Promise<MessageRow[]>;
}): Promise<{
    [lid: string]: string;
}>;
/**
 * BEH-SEND-30 / D19: an own unsent/failed conversation preview must report its send-state
 * (`PENDING` / `SENDING` or `FAILED`), never `SENT` or null. The preview is parsed straight from the
 * stored payload (not through `rowToMessage`, which derives status), so the status is applied here from
 * the live unsent row matched by the preview's `localMessageId` — it tracks a later `FAILED`. No-op for a
 * server-sourced (SENT) preview, which has no unsent row.
 */
export declare function applyPreviewSendState(model: any, preview: any, statuses?: {
    [lid: string]: string;
}): void;
/**
 * BEH-CONV-17: put a cached 1:1's delivered peer flags on its model, recomputed per read and never taken
 * from the stored peer JSON — with `withBlockedInfo`, `blockedByMe` from the blocked-users store (the
 * ASCII-lowercased uid set) and `hasBlockedMe` from the protected column; without it both false, as the
 * server (Android LocalConversationQuery.java:407, OfflineReadCache.java:588).
 */
export declare function decorateBlockedFlags(model: any, row: any, withBlockedInfo: boolean, blockedByMe: {
    [uid: string]: true;
}): any;
/**
 * The two halves of a `pendingLast` message read (BEH-READ-10 / BEH-READ-31), shared by both backends so
 * the window rule is written once. `sentQuery` is the plain keyset read of the SENT rows (null when the
 * page needs none); `assemble` joins its rows (in the backend's scan order: newest-first for the newest
 * and older pages, oldest-first for an after-cursor page) with the matching queued rows (`queuedAsc`,
 * oldest compose time first) into the page, in that same scan order.
 *
 * Android LocalMessageQuery.paginate (updated, BEH-READ-31): the newest page is EVERY queued row plus
 * the newest sent rows up to `limit` — it may exceed `limit` only when the queued rows alone do, and the
 * queued count is itself capped by `maxPendingMessages`. An anchored newer page is the first `limit` rows
 * past the anchor, so queued rows come only once the sent rows are used up; an older page never holds a
 * queued row.
 */
export declare function pendingLastPlan<T extends MessageRow>(q: LocalQuery, queuedAsc: T[], defaultLimit: number): {
    sentQuery: LocalQuery | null;
    assemble: (sent: T[]) => T[];
};
/**
 * The list-preview newer-guard:
 * does a message with server id `incomingId` (or none, a fresh compose) replace the stored preview? No
 * preview, or one with no server id (an un-acked or failed own send), gives way to anything. Two server ids
 * compare as ids, so clock skew in `localSortTs` decides nothing. `sortTs` 0 is the store's own refresh of a
 * preview (an edit, or a fallback after a delete), which is not an arrival and always applies. The one case
 * "gives way to anything" is too broad — an EARLIER own send's ack must not hijack a newer unsent send's
 * preview (Item 1) — is handled at the ack seam (cacheConversationFromAckedSend) via {@link ackHijacksUnsentPreview},
 * the only JS path that writes an own server-confirmed message over an unsent preview.
 */
export declare function isPreviewNewer(existing: {
    lastMessage?: unknown;
    lastMessageId?: number | string | null;
    localSortTs?: number | null;
}, incomingId: number | string | null | undefined, sortTs: number): boolean;
/**
 * BEH-CONV-01/06 · BEH-SEND-30 (Item 1): would acking THIS own send hijack a DIFFERENT, newer unsent send's
 * preview? True when the cached preview is an own unsent send (no server id) whose `data.localMessageId`
 * differs from this ack's. The preview is the latest-composed unsent send, so a different own send being
 * acked is necessarily an earlier one — judged by identity, not time, because an offline send's ack carries
 * the server's (reconnect) sentAt. Call it ONLY on the own-send ack seam (so a peer's receive, which can also
 * carry a localMessageId, is never mistaken for an own send). The send's own ack matches the id and refreshes.
 */
export declare function ackHijacksUnsentPreview(existing: {
    lastMessage?: unknown;
    lastMessageId?: number | string | null;
}, ackLocalMessageId: string | null | undefined): boolean;
/** The `localMessageId` a stored preview payload carries (`data.localMessageId`, else `localMessageId`), or
 *  null. Accepts a decoded object (IndexedDB) or a JSON string (the SQLite column). */
export declare function previewLocalId(payload: unknown): string | null;
/**
 * Delete-by-omission's interior test (BEH-READ-20/22): strictly between the page's oldest and newest row
 * in reading order, `localSortTs` then server id, so a row sharing a boundary's second is still placed
 * (Android MessageOmissionReconciler:137-141, LocalMessageQuery.compareReadingOrder). With no bound ids
 * the test is on time alone.
 */
export declare function strictlyInterior(ts: number, id: number | null | undefined, minTs: number, maxTs: number, minId?: number, maxId?: number): boolean;
