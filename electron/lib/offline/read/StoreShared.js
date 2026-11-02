"use strict";
/**
 * Small pure helpers shared by BOTH storage backends, so a rule is written once and cannot drift
 * between IndexedDB and SQLite. Same reason `Projections` and `ConversationFilters` exist.
 *
 * @module offline/read/StoreShared
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.pendingLastPlan = exports.decorateBlockedFlags = exports.previewForDelivery = exports.previewReceipts = exports.derivePin = exports.resolvePins = exports.pinsOf = exports.OWN_PINNER = exports.asPinnedBlockRow = exports.keepAdvanceOnly = exports.keepStoredPeerTags = exports.keepStoredMessageTags = exports.compareSnapshotLru = exports.rollupSnapshotMeta = exports.nextReadMarker = exports.notifyServedOutbox = exports.foreignRowKey = exports.matchByLocalId = void 0;
/** Two uids / conversation ids, ASCII case-insensitively (the server may echo another casing). */
function sameKey(a, b) {
    return !!a && !!b && String(a).toLowerCase() === String(b).toLowerCase();
}
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
function matchByLocalId(existing, incoming) {
    if (!existing || incoming.sendState !== "SENT")
        return null;
    if (existing.id != null)
        return incoming.id != null && String(incoming.id) === String(existing.id) ? null : "FOREIGN";
    if (!sameKey(existing.senderUid, incoming.senderUid) || !sameKey(existing.conversationId, incoming.conversationId))
        return "FOREIGN";
    return existing.sendState === "PENDING" || existing.sendState === "SENDING" ? "OUTBOX" : null;
}
exports.matchByLocalId = matchByLocalId;
/** The key a FOREIGN served message is stored under (its server id's, as any fetched message), or null to drop it. */
function foreignRowKey(incoming) {
    return incoming.id != null ? "s_" + incoming.id : null;
}
exports.foreignRowKey = foreignRowKey;
/** Hand the served copies an upsert left to the outbox to its listener, after the commit. Never throws. */
function notifyServedOutbox(listener, rows) {
    if (!listener || !rows.length)
        return;
    try {
        listener(rows);
    }
    catch {
        /* the listener's own error is not the write's */
    }
}
exports.notifyServedOutbox = notifyServedOutbox;
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
function nextReadMarker(existing, advanceReadMarkerTo) {
    if (advanceReadMarkerTo === undefined)
        return existing.lastReadMessageId;
    const candidate = advanceReadMarkerTo === "latest" ? existing.lastMessageId : advanceReadMarkerTo;
    const wanted = Number(candidate);
    if (!candidate || isNaN(wanted) || wanted <= 0)
        return existing.lastReadMessageId;
    const current = Number(existing.lastReadMessageId || 0) || 0;
    return wanted > current ? String(wanted) : existing.lastReadMessageId;
}
exports.nextReadMarker = nextReadMarker;
/**
 * Roll individual snapshot PAGES up into one entry per signature — what LRU/TTL eviction (§6.4) and
 * the storage-budget accounting (§3) operate on. Eviction is per-signature, never per-page: half a
 * recorded read would replay as a list that silently stops mid-way.
 *
 * `recordedAt` takes the OLDEST page (the TTL clock starts when the read was first recorded) and
 * `lastAccessedTs` the NEWEST (any page's replay keeps the whole read hot).
 */
function rollupSnapshotMeta(rows) {
    const bySig = {};
    for (const r of rows) {
        const bytes = (r.__enc !== undefined ? r.__enc : r.response || "").length;
        const m = bySig[r.signature];
        if (!m) {
            bySig[r.signature] = {
                signature: r.signature,
                recordedAt: r.recordedAt || 0,
                lastAccessedTs: r.lastAccessedTs || 0,
                pages: 1,
                bytes: bytes,
            };
            continue;
        }
        m.pages++;
        m.bytes += bytes;
        if ((r.recordedAt || 0) < m.recordedAt)
            m.recordedAt = r.recordedAt || 0;
        if ((r.lastAccessedTs || 0) > m.lastAccessedTs)
            m.lastAccessedTs = r.lastAccessedTs || 0;
    }
    const out = [];
    for (const sig in bySig)
        out.push(bySig[sig]);
    return out;
}
exports.rollupSnapshotMeta = rollupSnapshotMeta;
/**
 * Snapshot LRU order (BEH-SNAP-10): least recently replayed first, ties broken by signature so the
 * victim is the same on every run and backend (Android SnapshotDao: `lastAccessedTs ASC, signature ASC`).
 */
function compareSnapshotLru(a, b) {
    const d = (a.lastAccessedTs || 0) - (b.lastAccessedTs || 0);
    if (d !== 0)
        return d;
    return a.signature < b.signature ? -1 : a.signature > b.signature ? 1 : 0;
}
exports.compareSnapshotLru = compareSnapshotLru;
/**
 * BEH-READ-41 (R81): a message write keeps the stored tags unless its request applied `withTags`
 * (`row.tagsAuthoritative`) — keyed on the request, never on whether the payload carries `tags`. Returns
 * the row to write — its payload's tags replaced by the stored payload's (so the projection and the
 * rehydrated model keep them) unless the write is authoritative — and never with the write-only
 * `tagsAuthoritative` key. `existing` is the stored row, decoded (plaintext payload), or null for a
 * first insert, which takes the payload as it is.
 */
function keepStoredMessageTags(row, existing) {
    const { tagsAuthoritative, ...out } = row;
    try {
        const p = row.payload;
        if (tagsAuthoritative === true || !existing || !p || typeof p !== "object")
            return out;
        const prev = existing.payload;
        const kept = prev && typeof prev === "object" && Array.isArray(prev.tags) ? prev.tags.slice() : undefined;
        const payload = { ...p };
        if (kept)
            payload.tags = kept;
        else
            delete payload.tags;
        return { ...out, payload };
    }
    catch {
        return out; // best-effort: never break a write
    }
}
exports.keepStoredMessageTags = keepStoredMessageTags;
/**
 * BEH-CONV-12: a conversation write that did not apply `withUserAndGroupTags` (no `peerTags` key) keeps
 * the stored peer's `conversationWith.tags`, so the rehydrated model never loses them either.
 */
function keepStoredPeerTags(merged, existing, incoming) {
    try {
        if (!existing || !incoming || Object.prototype.hasOwnProperty.call(incoming, "peerTags"))
            return;
        const parse = (v) => (typeof v === "string" ? JSON.parse(v) : v);
        const prev = parse(existing.conversationWith);
        const next = parse(merged.conversationWith);
        if (!prev || !next || typeof next !== "object" || !Object.prototype.hasOwnProperty.call(prev, "tags"))
            return;
        const fixed = { ...next, tags: prev.tags };
        merged.conversationWith = typeof merged.conversationWith === "string" ? JSON.stringify(fixed) : fixed;
    }
    catch {
        /* best-effort */
    }
}
exports.keepStoredPeerTags = keepStoredPeerTags;
/**
 * BEH-CONV-06: a conversation-list ingest is advance-only on the sort key and the preview, so a
 * snapshot older than local state (taken before an in-flight send committed, carrying an EQUAL
 * `updatedAt` that passes LWW) never demotes the row or reverts its last message. A genuinely newer
 * row still applies in full. Ported from Android ConversationMergePolicy.resolveOnUpsert /
 * isIngestPreviewNewer (ConversationMergePolicy.java:91-112, 227-240). Mutates `merged` in place;
 * a first insert (`existing` null) takes the incoming row as-is.
 */
function keepAdvanceOnly(merged, existing, incoming) {
    if (!existing || !incoming)
        return;
    const exSort = Number(existing.localSortTs) || 0;
    const inSort = Number(incoming.localSortTs) || 0;
    if ("localSortTs" in incoming)
        merged.localSortTs = Math.max(exSort, inSort);
    if ("lastMessage" in incoming && !isIngestPreviewNewer(existing, incoming, exSort, inSort)) {
        merged.lastMessage = existing.lastMessage;
        merged.lastMessageId = existing.lastMessageId;
    }
}
exports.keepAdvanceOnly = keepAdvanceOnly;
/**
 * The ingest preview guard. An EQUAL message id refreshes (an edit / delete / reaction keeps the id,
 * and the list ingest is what refreshes those previews); a side without a server id (an un-acked
 * local send, or a server row with no last message) is compared by the sort key instead.
 */
function isIngestPreviewNewer(existing, incoming, exSort, inSort) {
    if (existing.lastMessage == null)
        return true; // nothing cached worth protecting
    const inId = incoming.lastMessageId != null ? Number(incoming.lastMessageId) : NaN;
    const exId = existing.lastMessageId != null ? Number(existing.lastMessageId) : NaN;
    if (isFinite(inId) && inId > 0 && isFinite(exId) && exId > 0)
        return inId >= exId;
    return inSort >= exSort;
}
/**
 * BEH-CONV-12/16: a row of a page's leading pinned block (or of a `pinnedBy` page) is the server's
 * pinned set, whose rows carry no includes — so it is written pin-only for tags and blocked info:
 * the conversation's tags, the peer's tags and `hasBlockedMe` are omitted and the stored values
 * survive the field-merge. Android ConversationTagScope.pinnedRow() (OfflineReadCache.java:744,
 * SyncEngine.java:514).
 */
function asPinnedBlockRow(row) {
    const out = { ...row };
    delete out.tags;
    delete out.peerTags;
    delete out.hasBlockedMe;
    return out;
}
exports.asPinnedBlockRow = asPinnedBlockRow;
/** `pinnedBy` of an admin (app-wide) pin. */
const SYSTEM_PINNER = "app_system";
/** The derived `pinnedBy` column of a row whose shown pin is the user's own (reported as the uid at read). */
exports.OWN_PINNER = "me";
/**
 * BEH-CPIN-01: a cached conversation's two pins — the admin pin and the user's own pin — read from the
 * `systemPinnedAt` / `ownPinnedAt` columns (Android ConversationRecord.java:39-40). A row written
 * before the two columns existed carries only the single `pinnedAt`/`pinnedBy` pair, which is read
 * as the one pin it names; that is the additive upgrade, no migration step. `null` = no pin.
 */
function pinsOf(r) {
    if (!r)
        return { system: null, own: null };
    if (r.systemPinnedAt !== undefined || r.ownPinnedAt !== undefined) {
        return { system: r.systemPinnedAt ? Number(r.systemPinnedAt) : null, own: r.ownPinnedAt ? Number(r.ownPinnedAt) : null };
    }
    if (!r.pinnedAt)
        return { system: null, own: null };
    return r.pinnedBy === SYSTEM_PINNER
        ? { system: Number(r.pinnedAt), own: null }
        : { system: null, own: Number(r.pinnedAt) };
}
exports.pinsOf = pinsOf;
/**
 * BEH-CPIN-01: resolve the pin columns of a conversation write. A pin column the incoming row omits is
 * kept from the stored row (so each source changes only the pins it proves — the pin mode is which
 * columns the writer put on the row); then the shown `pinnedAt`/`pinnedBy` are derived: the admin pin
 * if there is one, else the own pin (Android ConversationMergePolicy.withPins :130, putDerivedPin).
 * Mutates `merged`. Only when either side has ever carried a pin; a row with no pin knowledge is
 * left as it was.
 */
function resolvePins(merged, existing, incoming) {
    const ex = pinsOf(existing);
    const has = (k) => !!incoming && Object.prototype.hasOwnProperty.call(incoming, k);
    const legacyIncoming = !has("systemPinnedAt") && !has("ownPinnedAt") && (has("pinnedAt") || has("pinnedBy"));
    if (!has("systemPinnedAt") && !has("ownPinnedAt") && !legacyIncoming) {
        if (!existing || (existing.systemPinnedAt === undefined && existing.ownPinnedAt === undefined && existing.pinnedAt === undefined))
            return;
        merged.systemPinnedAt = ex.system;
        merged.ownPinnedAt = ex.own;
    }
    else if (legacyIncoming) {
        // A writer that still speaks the single pair: the pin it names, in its own column (admin-wins).
        const p = pinsOf({ pinnedAt: incoming.pinnedAt, pinnedBy: incoming.pinnedBy });
        merged.systemPinnedAt = p.system;
        merged.ownPinnedAt = p.system != null ? ex.own : p.own;
    }
    else {
        merged.systemPinnedAt = has("systemPinnedAt") ? (incoming.systemPinnedAt ? Number(incoming.systemPinnedAt) : null) : ex.system;
        merged.ownPinnedAt = has("ownPinnedAt") ? (incoming.ownPinnedAt ? Number(incoming.ownPinnedAt) : null) : ex.own;
    }
    // The own pinner as the server named it (the user's uid), from this write or the stored row.
    const named = (v) => (typeof v === "string" && v && v !== SYSTEM_PINNER && v !== exports.OWN_PINNER ? v : null);
    derivePin(merged, (has("pinnedBy") && named(incoming.pinnedBy)) || (existing && named(existing.pinnedBy)) || null);
}
exports.resolvePins = resolvePins;
/**
 * Set the shown `pinnedAt`/`pinnedBy` from the two pin columns. An own pin shows its pinner (the uid)
 * when known, else {@link OWN_PINNER}; the delivered model always reports the current uid.
 */
function derivePin(r, ownPinner) {
    const sys = r.systemPinnedAt ? Number(r.systemPinnedAt) : null;
    const own = r.ownPinnedAt ? Number(r.ownPinnedAt) : null;
    r.pinnedAt = sys != null ? sys : own;
    r.pinnedBy = sys != null ? SYSTEM_PINNER : own != null ? ownPinner || exports.OWN_PINNER : null;
}
exports.derivePin = derivePin;
/**
 * BEH-CONV-07: the receipt state of each own-sent preview still missing a tick — one record read per
 * candidate, keyed by `lastMessageId` (Android OfflineModelMapper.receiptOverlayCandidates :649).
 */
async function previewReceipts(store, rows, selfUid) {
    const out = {};
    if (!selfUid)
        return out;
    for (const r of rows || []) {
        try {
            const lm = r && r.lastMessage;
            if (!lm || r.lastMessageId == null)
                continue;
            if (senderOf(lm) !== selfUid)
                continue; // not own-sent
            if (Number(lm.deliveredAt) > 0 && Number(lm.readAt) > 0)
                continue; // both ticks already on the blob
            const rec = await store.getMessageById(r.lastMessageId);
            if (rec)
                out[String(r.lastMessageId)] = { senderUid: rec.senderUid, deliveredAt: rec.deliveredAt, readAt: rec.readAt };
        }
        catch {
            /* a row without a readable record is delivered as cached */
        }
    }
    return out;
}
exports.previewReceipts = previewReceipts;
function senderOf(lm) {
    const s = lm && lm.sender;
    return s && typeof s === "object" ? String(s.uid || "") : String(s || "");
}
/**
 * The cached preview as delivered — a copy, never written back (read-only, self-heals every read):
 *  - BEH-CONV-07: an own-sent preview takes the message record's deliveredAt/readAt where they are
 *    strictly ahead (identity + own-sent + advance-only; OfflineModelMapper.applyReceiptOverlay :775);
 *  - BEH-CONV-08: a preview with no sentAt (an un-acked send) takes the row's sort key, already epoch
 *    SECONDS, as-is (fill-only, needs a basis; applyPendingSentAtProjection :811).
 */
function previewForDelivery(row, receipts) {
    const src = row && row.lastMessage;
    if (!src || typeof src !== "object")
        return src;
    const lm = { ...src };
    const rc = receipts && row.lastMessageId != null ? receipts[String(row.lastMessageId)] : undefined;
    if (rc && rc.senderUid != null && senderOf(lm) === String(rc.senderUid)) {
        if (Number(rc.deliveredAt) > (Number(lm.deliveredAt) || 0))
            lm.deliveredAt = Number(rc.deliveredAt);
        if (Number(rc.readAt) > (Number(lm.readAt) || 0))
            lm.readAt = Number(rc.readAt);
    }
    if (!(Number(lm.sentAt) > 0) && Number(row.localSortTs) > 0)
        lm.sentAt = Number(row.localSortTs);
    return lm;
}
exports.previewForDelivery = previewForDelivery;
/**
 * BEH-CONV-17: put a cached 1:1's delivered peer flags on its model, recomputed per read and never taken
 * from the stored peer JSON — with `withBlockedInfo`, `blockedByMe` from the blocked-users store (the
 * ASCII-lowercased uid set) and `hasBlockedMe` from the protected column; without it both false, as the
 * server (Android LocalConversationQuery.java:407, OfflineReadCache.java:588).
 */
function decorateBlockedFlags(model, row, withBlockedInfo, blockedByMe) {
    try {
        if (!model || !row || row.conversationType !== "user")
            return model;
        const peer = typeof model.getConversationWith === "function" ? model.getConversationWith() : null;
        if (!peer || typeof peer.setBlockedByMe !== "function")
            return model;
        const uid = typeof peer.getUid === "function" ? peer.getUid() : peer.uid;
        const lower = String(uid || "").replace(/[A-Z]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 32));
        peer.setBlockedByMe(withBlockedInfo ? blockedByMe[lower] === true : false);
        if (typeof peer.setHasBlockedMe === "function")
            peer.setHasBlockedMe(withBlockedInfo ? row.hasBlockedMe === true : false);
    }
    catch {
        /* decoration is best-effort */
    }
    return model;
}
exports.decorateBlockedFlags = decorateBlockedFlags;
/**
 * The two halves of a `pendingLast` message read (BEH-READ-10 / BEH-READ-31), shared by both backends so
 * the window rule is written once. `sentQuery` is the plain keyset read of the SENT rows (null when the
 * page needs none); `assemble` joins its rows (in the backend's scan order: newest-first for the newest
 * and older pages, oldest-first for an after-cursor page) with the matching queued rows (`queuedAsc`,
 * oldest compose time first) into the page, in that same scan order.
 *
 * Android LocalMessageQuery.paginate: the newest page is the last `limit` of sent-then-queued; an
 * anchored newer page is the first `limit` rows past the anchor, so queued rows come only once the sent
 * rows are used up; an older page never holds a queued row.
 */
function pendingLastPlan(q, queuedAsc, defaultLimit) {
    var _a;
    const limit = (_a = q.limit) !== null && _a !== void 0 ? _a : defaultLimit;
    const sentQuery = { ...q, sentOnly: true, pendingLast: undefined, pendingAfterSortTs: undefined };
    if (q.afterSortTs != null) {
        const floor = q.pendingAfterSortTs;
        const queued = queuedAsc.filter((r) => floor == null || r.localSortTs > floor);
        return {
            sentQuery,
            assemble: (sent) => (sent.length >= limit ? sent : sent.concat(queued.slice(0, limit - sent.length))),
        };
    }
    if (q.beforeSortTs != null)
        return { sentQuery, assemble: (sent) => sent };
    if (queuedAsc.length >= limit) {
        const tail = queuedAsc.slice(queuedAsc.length - limit).reverse();
        return { sentQuery: null, assemble: () => tail };
    }
    const queuedDesc = queuedAsc.slice().reverse();
    return {
        sentQuery: { ...sentQuery, limit: limit - queuedAsc.length },
        assemble: (sent) => queuedDesc.concat(sent),
    };
}
exports.pendingLastPlan = pendingLastPlan;
