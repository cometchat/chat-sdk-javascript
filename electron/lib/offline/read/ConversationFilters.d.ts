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
import { ConversationRow, LocalQuery } from "../OfflineTypes";
/**
 * Evaluate a cached conversation against the locally-computable filters.
 *
 * Note the default-list rule (§4.2): a `blockedByMe` conversation is EXCLUDED unless the request
 * asked for `includeBlockedUsers`. The row itself is always kept in the cache — "keep and flag,
 * don't purge" (§4.4) — so the `includeBlockedUsers` view can serve it without a separate fetch.
 */
export declare function matchesConversation(r: ConversationRow, q: LocalQuery): boolean;
/** BEH-CONV-17: the store's blockedByMe uids, ASCII-lowercased, for {@link LocalQuery.blockedByMeUids}. */
export declare function blockedByMeUidsOf(rows: {
    uid: string;
    blockedByMe: boolean;
}[]): string[];
