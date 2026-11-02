"use strict";
/**
 * Column-backed predicate for a cached CONVERSATION read — the conversation twin of
 * `Projections.matchesMessage`, and the single place all three storage paths
 * (IndexedDB plaintext, IndexedDB sealed, SQLite) evaluate a conversation filter.
 *
 * Offline Read Coverage §4: the whole conversation list is bounded and fully cached, so **every**
 * conversation filter except `searchKeyword` is computed locally. That is only true if the filters
 * run off stored columns, so each one here maps to a write-time projection on `ConversationRow`:
 *
 *   userTags / groupTags  → `peerTags`   (the PEER entity's tags; `tags` is the conversation's own)
 *   onlyAgentic / hideAgentic → `isAgentic`
 *   includeBlockedUsers   → `blockedByMe`
 *
 * Keeping this off `conversationWith` is what makes the encrypted tier work: the sealed row's
 * `conversationWith` is `null` mid-scan, so a predicate that reached into it would silently match
 * nothing. `peerTags` is blind-indexed alongside `tags`, and the three booleans stay readable.
 *
 * @module offline/read/ConversationFilters
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockedByMeUidsOf = exports.matchesConversation = void 0;
/** OR-of-tags, exact match. An absent/empty/malformed tag list never matches a non-empty request. */
function anyTagMatches(rowTags, wanted) {
    if (!Array.isArray(rowTags))
        return false;
    for (const t of wanted)
        if (rowTags.indexOf(t) !== -1)
            return true;
    return false;
}
/**
 * Evaluate a cached conversation against the locally-computable filters.
 *
 * Note the default-list rule (§4.2): a `blockedByMe` conversation is EXCLUDED unless the request
 * asked for `includeBlockedUsers`. The row itself is always kept in the cache — "keep and flag,
 * don't purge" (§4.4) — so the `includeBlockedUsers` view can serve it without a separate fetch.
 */
function matchesConversation(r, q) {
    if (q.conversationType && r.conversationType !== q.conversationType)
        return false;
    if (q.onlyUnread && !(r.unreadCount > 0))
        return false;
    // The conversation's OWN tags (`setTags`).
    if (q.tags && q.tags.length > 0 && !anyTagMatches(r.tags, q.tags))
        return false;
    // The PEER entity's tags. `userTags` applies to 1:1 peers, `groupTags` to groups — a group can
    // never satisfy `userTags` and a 1:1 can never satisfy `groupTags`, matching the server's split.
    if (q.userTags && q.userTags.length > 0) {
        if (r.conversationType !== "user" || !anyTagMatches(r.peerTags, q.userTags))
            return false;
    }
    if (q.groupTags && q.groupTags.length > 0) {
        if (r.conversationType !== "group" || !anyTagMatches(r.peerTags, q.groupTags))
            return false;
    }
    // Agentic (BEH-CONV-11): 1:1 with a peer whose role is `@agentic`, projected at write time. Both
    // filters are skipped when the read is scoped to groups, as the server does. A 1:1 whose peer role
    // the cache never received (`isAgentic` null/absent — a local stub, or a server user with no role)
    // is unknown and is in neither list (Android LocalConversationQuery.java:98-161, G1).
    const groupScoped = String(q.conversationType || "").toLowerCase() === "group";
    if (!groupScoped && (q.onlyAgentic || q.hideAgentic)) {
        if (r.conversationType === "user") {
            if (r.isAgentic !== true && r.isAgentic !== false)
                return false;
            if (q.onlyAgentic && !r.isAgentic)
                return false;
            if (q.hideAgentic && r.isAgentic)
                return false;
        }
        else if (q.onlyAgentic) {
            return false; // a group is never agentic
        }
    }
    // Blocked (BEH-CONV-17): excluded by default, included on request. With the blocked-users store's
    // set in hand the store decides (a 1:1 whose peer uid it marks blockedByMe; a peer whose uid this
    // row cannot show — a sealed row mid-scan — is kept here and judged after unsealing). Without it,
    // the row's own column is the fallback.
    if (!q.includeBlockedUsers) {
        if (q.blockedByMeUids) {
            if (r.conversationType === "user" && q.blockedByMeUids.length) {
                const uid = peerUid(r);
                if (uid && blockedSet(q.blockedByMeUids)[asciiLower(uid)] === true)
                    return false;
            }
        }
        else if (r.blockedByMe === true) {
            return false;
        }
    }
    return true;
}
exports.matchesConversation = matchesConversation;
/** ASCII-only lowercasing (the blocked-users store key, BEH-CONV-15). */
function asciiLower(v) {
    return String(v || "").replace(/[A-Z]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 32));
}
/** The peer uid of a 1:1 row, when the row shows it (IndexedDB object or SQLite JSON string). */
function peerUid(r) {
    try {
        const cw = typeof r.conversationWith === "string" ? JSON.parse(r.conversationWith) : r.conversationWith;
        return cw && cw.uid != null ? String(cw.uid) : "";
    }
    catch {
        return "";
    }
}
const blockedSets = new WeakMap();
function blockedSet(uids) {
    let set = blockedSets.get(uids);
    if (!set) {
        set = {};
        for (const u of uids)
            set[asciiLower(u)] = true;
        blockedSets.set(uids, set);
    }
    return set;
}
/** BEH-CONV-17: the store's blockedByMe uids, ASCII-lowercased, for {@link LocalQuery.blockedByMeUids}. */
function blockedByMeUidsOf(rows) {
    return rows.filter((b) => b && b.blockedByMe === true).map((b) => asciiLower(String(b.uid)));
}
exports.blockedByMeUidsOf = blockedByMeUidsOf;
