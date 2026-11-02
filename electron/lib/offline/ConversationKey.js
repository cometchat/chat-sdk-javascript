"use strict";
/**
 * Canonical conversationId construction that mirrors the server: 1:1 → "<min>_user_<max>"
 * (uids ASCII-lowercased, sorted by UTF-8 byte order); group → "group_<lowercased guid>".
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.canonicalGroupConversationId = exports.canonicalUserConversationId = exports.asciiLower = void 0;
/** ASCII-only lowercase (A–Z → a–z), matching the server rather than locale-aware toLowerCase. */
function asciiLower(s) {
    return (s || "").replace(/[A-Z]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 32));
}
exports.asciiLower = asciiLower;
/** UTF-8 bytes of a string (TextEncoder where available; percent-encode fallback). */
function utf8Bytes(s) {
    if (typeof TextEncoder !== "undefined")
        return new TextEncoder().encode(s);
    const out = [];
    const esc = encodeURIComponent(s);
    for (let i = 0; i < esc.length; i++) {
        if (esc[i] === "%") {
            out.push(parseInt(esc.substr(i + 1, 2), 16));
            i += 2;
        }
        else {
            out.push(esc.charCodeAt(i));
        }
    }
    return Uint8Array.from(out);
}
/** true if `a` sorts before `b` in UTF-8 byte order (the server's ordering). */
function utf8Less(a, b) {
    const ea = utf8Bytes(a);
    const eb = utf8Bytes(b);
    const n = Math.min(ea.length, eb.length);
    for (let i = 0; i < n; i++)
        if (ea[i] !== eb[i])
            return ea[i] < eb[i];
    return ea.length < eb.length;
}
/** 1:1 canonical conversationId: `"<min>_user_<max>"`. Order-independent in its two args. */
function canonicalUserConversationId(a, b) {
    const x = asciiLower(a);
    const y = asciiLower(b);
    return utf8Less(x, y) ? `${x}_user_${y}` : `${y}_user_${x}`;
}
exports.canonicalUserConversationId = canonicalUserConversationId;
/** Group canonical conversationId: `"group_<lc guid>"`. */
function canonicalGroupConversationId(guid) {
    return "group_" + asciiLower(guid);
}
exports.canonicalGroupConversationId = canonicalGroupConversationId;
