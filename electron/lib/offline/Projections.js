"use strict";
/**
 * Pure helpers: write-time tag/mention projections and the column-backed read
 * predicate that evaluates a LocalQuery against a row without parsing the payload.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchesMessage = exports.inScope = exports.extractHasReactions = exports.extractAttachmentTypes = exports.extractHasAttachments = exports.extractMentions = exports.extractTags = void 0;
const ConversationKey_1 = require("./ConversationKey");
/** Tags projected off the payload. Rebuilt in the same transaction as the row upsert. */
function extractTags(payload) {
    return Array.isArray(payload === null || payload === void 0 ? void 0 : payload.tags) ? payload.tags.filter((t) => typeof t === "string") : [];
}
exports.extractTags = extractTags;
/** Mentioned uids projected off the payload. */
function extractMentions(payload) {
    var _a, _b, _c;
    // Array form: `mentionedUsers` on the model or `data.mentionedUsers` from some server paths.
    const users = (_a = payload === null || payload === void 0 ? void 0 : payload.mentionedUsers) !== null && _a !== void 0 ? _a : (_b = payload === null || payload === void 0 ? void 0 : payload.data) === null || _b === void 0 ? void 0 : _b.mentionedUsers;
    if (Array.isArray(users)) {
        return users.map((u) => (typeof u === "string" ? u : u === null || u === void 0 ? void 0 : u.uid)).filter(Boolean);
    }
    // Object form: `data.mentions: { uid: {uid, name, ...} }` — the realtime wire shape (BEH-FLAG-08).
    const mentionsMap = (_c = payload === null || payload === void 0 ? void 0 : payload.data) === null || _c === void 0 ? void 0 : _c.mentions;
    if (mentionsMap && typeof mentionsMap === "object" && !Array.isArray(mentionsMap)) {
        return Object.keys(mentionsMap).filter(Boolean);
    }
    return [];
}
exports.extractMentions = extractMentions;
/**
 * The attachment list on a message payload, in the two shapes the server uses: the modern
 * `data.attachments` array and the legacy singular `data.attachment`. Same accessor the media
 * caching path already relies on (`OfflineRuntime.cacheMediaForMessages`).
 */
function payloadAttachments(payload) {
    const data = payload === null || payload === void 0 ? void 0 : payload.data;
    if (!data)
        return [];
    if (Array.isArray(data.attachments))
        return data.attachments.filter(Boolean);
    return data.attachment ? [data.attachment] : [];
}
/** Does this payload carry at least one attachment? Write-time projection for `hasAttachments`. */
function extractHasAttachments(payload) {
    return payloadAttachments(payload).length > 0;
}
exports.extractHasAttachments = extractHasAttachments;
/**
 * Map one attachment's mime type onto the SDK's public `AttachmentType` vocabulary — the same four
 * values `MessagesRequestBuilder.setAttachmentTypes` puts on the wire (`image` / `video` / `audio` /
 * `file`). Anything that is not an image/video/audio mime type is a `file`, which is why e.g.
 * `application/pdf` projects to `file`.
 *
 * Deliberately duplicated as string literals rather than importing `AttachmentType` from
 * `../Constants`: this module is imported by the storage backends, which must stay free of SDK-model
 * imports (and unit-testable without them). The four values are Band-1 wire vocabulary, not internal.
 */
function attachmentTypeOf(att) {
    const mime = String((att && att.mimeType) || "").toLowerCase();
    if (mime.indexOf("image/") === 0)
        return "image";
    if (mime.indexOf("video/") === 0)
        return "video";
    if (mime.indexOf("audio/") === 0)
        return "audio";
    return "file";
}
/** Distinct `AttachmentType` values on this payload. Write-time projection for `attachmentTypes`. */
function extractAttachmentTypes(payload) {
    const out = [];
    for (const att of payloadAttachments(payload)) {
        const t = attachmentTypeOf(att);
        if (out.indexOf(t) === -1)
            out.push(t);
    }
    return out;
}
exports.extractAttachmentTypes = extractAttachmentTypes;
/** Does this payload carry at least one reaction? Write-time projection for `hasReactions`. */
function extractHasReactions(payload) {
    var _a;
    const reactions = (_a = payload === null || payload === void 0 ? void 0 : payload.data) === null || _a === void 0 ? void 0 : _a.reactions;
    return Array.isArray(reactions) && reactions.length > 0;
}
exports.extractHasReactions = extractHasReactions;
/**
 * Scope predicate — restricts a message read to one conversation. Group: receiver is the guid.
 * 1:1: when the self uid is known, the canonical pair id is authoritative. A reconciled row is keyed
 * under its canonical pair id (`conversationId !== receiverId`); only PROVISIONAL rows — a pending
 * outbox message keyed by the raw `receiverId` — fall through to sender/receiver matching. So a
 * canonically-keyed row under a different pair (e.g. a system-authored action, sender = actor) is
 * never re-matched by its sender on an actor-scoped read (F-02), while a pending message stays visible.
 * The structural `conversationId === receiverId` test needs no id parsing, so a uid that itself
 * contains "_user_" is handled correctly. With self unknown, the legacy sender/receiver fallback runs.
 */
function inScope(r, q) {
    if (q.guid)
        return r.receiverType === "group" && r.receiverId === q.guid;
    if (q.uid) {
        if (r.receiverType !== "user")
            return false;
        if (q.selfUid) {
            // `scopeConversationId` is the encrypted path's pre-built (and pre-hashed) canonical id — see
            // LocalQuery. Everywhere else it is absent and the pair id is derived here exactly as before.
            const pairId = q.scopeConversationId || ConversationKey_1.canonicalUserConversationId(q.selfUid, q.uid);
            if (r.conversationId === pairId)
                return true;
            // Reconciled (canonically-keyed) row that isn't this pair → out of scope; never fall through to
            // the sender match. Only provisional rows (keyed by the raw receiverId) use the fallback below.
            if (r.conversationId !== r.receiverId)
                return false;
        }
        return r.senderUid === q.uid || r.receiverId === q.uid;
    }
    return true;
}
exports.inScope = inScope;
/**
 * Column-backed predicate for a cached message read. Never inspects `payload`;
 * only evaluates the locally-computable filters.
 *
 * "Never inspects `payload`" is load-bearing, not stylistic: under cache encryption this predicate
 * runs against the STORED row, whose `payload` is `null` (the real one is sealed in `__enc`). Any
 * filter that needs payload data must therefore arrive as a write-time projection column — which is
 * exactly what `hasAttachments` / `attachmentTypes` / `hasReactions` are.
 */
function matchesMessage(r, q) {
    if (q.categories && !q.categories.includes(r.category))
        return false;
    if (q.types && !q.types.includes(r.type))
        return false;
    if (q.hideDeleted && r.deletedAt)
        return false;
    if (q.hideReplies && r.parentMessageId != null)
        return false;
    if (q.parentMessageId != null && r.parentMessageId !== q.parentMessageId)
        return false;
    if (q.tags && q.tags.length > 0 && !q.tags.some((t) => r.tags.includes(t)))
        return false;
    if (q.hasMentions && r.mentions.length === 0)
        return false;
    if (q.mentionedUIDs && !q.mentionedUIDs.some((u) => r.mentions.includes(u)))
        return false;
    // --- Offline Read Coverage §5 -----------------------------------------------------------------
    // Outbox isolation (§7): a pending/sending/failed message belongs to the canonical conversation
    // view and the outbox observer — never to a FILTERED message view.
    if (q.sentOnly && r.sendState !== "SENT")
        return false;
    // `unread` — strictly newer than the conversation's read marker (§11-confirmed definition). A row
    // with no server id yet (unsent) can never satisfy it.
    if (q.unreadAfterMessageId != null) {
        if (r.id == null || Number(r.id) <= q.unreadAfterMessageId)
            return false;
    }
    // Cross-conversation `unread` (BEH-READ-36/39): each message against its own conversation's marker.
    if (q.unreadMarkers) {
        if (r.id == null)
            return false;
        const marker = Object.prototype.hasOwnProperty.call(q.unreadMarkers, r.conversationId) ? q.unreadMarkers[r.conversationId] : 0;
        if (marker < 0 || Number(r.id) <= marker)
            return false;
    }
    if (q.hasAttachments && !r.hasAttachments)
        return false;
    if (q.hasReactions && !r.hasReactions)
        return false;
    if (q.attachmentTypes && q.attachmentTypes.length > 0) {
        const have = r.attachmentTypes || [];
        if (!q.attachmentTypes.some((t) => have.indexOf(t) !== -1))
            return false;
    }
    // `hideMessagesFromBlockedUsers` — matches the senderUid COLUMN (blind-indexed under encryption,
    // with the query's uid set hashed the same way), so it never needs the payload.
    // BEH-READ-37: the blocked-users store keeps ASCII-lowercased uids, so the sender is lowercased the
    // same way (Android BlockedUserRecord.key). A sealed row's sender is a blind index of the uid as the
    // server cased it, compared as is.
    if (q.excludeSenderUids && q.excludeSenderUids.length > 0) {
        const sender = r.senderUid && !r.__enc ? ConversationKey_1.asciiLower(r.senderUid) : r.senderUid;
        if (sender && q.excludeSenderUids.indexOf(sender) !== -1)
            return false;
    }
    return true;
}
exports.matchesMessage = matchesMessage;
