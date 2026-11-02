/**
 * Canonical conversationId construction that mirrors the server: 1:1 → "<min>_user_<max>"
 * (uids ASCII-lowercased, sorted by UTF-8 byte order); group → "group_<lowercased guid>".
 */
/** ASCII-only lowercase (A–Z → a–z), matching the server rather than locale-aware toLowerCase. */
export declare function asciiLower(s: string): string;
/** 1:1 canonical conversationId: `"<min>_user_<max>"`. Order-independent in its two args. */
export declare function canonicalUserConversationId(a: string, b: string): string;
/** Group canonical conversationId: `"group_<lc guid>"`. */
export declare function canonicalGroupConversationId(guid: string): string;
