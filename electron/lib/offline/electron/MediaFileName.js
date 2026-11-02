"use strict";
/**
 * The on-disk filename of an Electron media key — shared by the main-process engine (which stores the
 * file) and the renderer store (whose synchronous `ref()` must name the same file).
 *
 * A key that is already a safe filename (`isSafeId`) is used verbatim, as earlier builds did. Any other
 * key becomes `h_<sha256(utf8(key)) hex>`. The hash is a small pure implementation so the renderer can
 * compute it synchronously; it is byte-for-byte the standard SHA-256 (Node's `crypto` gives the same
 * digest, which the tests assert), so files the main process already named this way keep resolving.
 *
 * Browser-safe: no node / electron imports.
 *
 * @module offline/electron/MediaFileName
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256Hex = exports.mediaFileName = exports.isIdentity = exports.isSafeId = exports.MAX_SAFE_ID_LENGTH = void 0;
/** Longest accepted appId / uid / verbatim media filename. */
exports.MAX_SAFE_ID_LENGTH = 200;
const SAFE_ID_RE = /^[A-Za-z0-9_\-@.+]+$/;
/**
 * Is `value` safe to embed in a filename? A non-empty string of at most `MAX_SAFE_ID_LENGTH`
 * characters drawn only from `[A-Za-z0-9_-@.+]`, which is not `.` and does not contain `..`.
 */
function isSafeId(value) {
    return (typeof value === "string" &&
        value.length > 0 &&
        value.length <= exports.MAX_SAFE_ID_LENGTH &&
        SAFE_ID_RE.test(value) &&
        value !== "." &&
        value.indexOf("..") === -1);
}
exports.isSafeId = isSafeId;
/**
 * Is `value` a usable `appId` / `uid`: 1-`MAX_SAFE_ID_LENGTH` characters with no path separator
 * (`/`, `\\`, `:`), control character, `.` / `..` segment? Every safe id is one; so is a uid with
 * other characters — e.g. the non-ASCII uids BEH-READ-17 keys conversations by — which reaches a
 * filename only hashed (`safeStem`).
 */
function isIdentity(value) {
    return (typeof value === "string" &&
        value.length > 0 &&
        value.length <= exports.MAX_SAFE_ID_LENGTH &&
        value !== "." &&
        value.indexOf("..") === -1 &&
        !/[\/\\:\u0000-\u001f\u007f]/.test(value));
}
exports.isIdentity = isIdentity;
/** The filename a media key is stored under (verbatim if safe, else `h_<sha256 hex>`). */
function mediaFileName(key) {
    if (typeof key !== "string" || key.length === 0) {
        throw new Error("CometChat offline: a media key must be a non-empty string");
    }
    if (isSafeId(key))
        return key;
    return "h_" + sha256Hex(key);
}
exports.mediaFileName = mediaFileName;
function utf8Bytes(s) {
    const out = [];
    for (let i = 0; i < s.length; i++) {
        let c = s.charCodeAt(i);
        if (c >= 0xd800 && c <= 0xdbff && i + 1 < s.length) {
            const d = s.charCodeAt(i + 1);
            if (d >= 0xdc00 && d <= 0xdfff) {
                c = 0x10000 + ((c - 0xd800) << 10) + (d - 0xdc00);
                i++;
            }
        }
        else if (c >= 0xd800 && c <= 0xdfff) {
            c = 0xfffd; // lone surrogate → U+FFFD, as Node's utf8 encoder does
        }
        if (c < 0x80)
            out.push(c);
        else if (c < 0x800)
            out.push(0xc0 | (c >> 6), 0x80 | (c & 63));
        else if (c < 0x10000)
            out.push(0xe0 | (c >> 12), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
        else
            out.push(0xf0 | (c >> 18), 0x80 | ((c >> 12) & 63), 0x80 | ((c >> 6) & 63), 0x80 | (c & 63));
    }
    return out;
}
const K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
];
/** Standard SHA-256 of the UTF-8 bytes of `s`, as lowercase hex. */
function sha256Hex(s) {
    const bytes = utf8Bytes(s);
    const bitLen = bytes.length * 8;
    bytes.push(0x80);
    while (bytes.length % 64 !== 56)
        bytes.push(0);
    const hi = Math.floor(bitLen / 0x100000000);
    const lo = bitLen >>> 0;
    bytes.push((hi >>> 24) & 255, (hi >>> 16) & 255, (hi >>> 8) & 255, hi & 255);
    bytes.push((lo >>> 24) & 255, (lo >>> 16) & 255, (lo >>> 8) & 255, lo & 255);
    const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    const W = new Array(64);
    for (let off = 0; off < bytes.length; off += 64) {
        for (let i = 0; i < 16; i++) {
            const j = off + i * 4;
            W[i] = ((bytes[j] << 24) | (bytes[j + 1] << 16) | (bytes[j + 2] << 8) | bytes[j + 3]) >>> 0;
        }
        for (let i = 16; i < 64; i++) {
            const w15 = W[i - 15];
            const w2 = W[i - 2];
            const s0 = ((w15 >>> 7) | (w15 << 25)) ^ ((w15 >>> 18) | (w15 << 14)) ^ (w15 >>> 3);
            const s1 = ((w2 >>> 17) | (w2 << 15)) ^ ((w2 >>> 19) | (w2 << 13)) ^ (w2 >>> 10);
            W[i] = (W[i - 16] + s0 + W[i - 7] + s1) >>> 0;
        }
        let a = H[0], b = H[1], c = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
        for (let i = 0; i < 64; i++) {
            const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
            const ch = (e & f) ^ (~e & g);
            const t1 = (h + S1 + ch + K[i] + W[i]) >>> 0;
            const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
            const maj = (a & b) ^ (a & c) ^ (b & c);
            const t2 = (S0 + maj) >>> 0;
            h = g;
            g = f;
            f = e;
            e = (d + t1) >>> 0;
            d = c;
            c = b;
            b = a;
            a = (t1 + t2) >>> 0;
        }
        H[0] = (H[0] + a) >>> 0;
        H[1] = (H[1] + b) >>> 0;
        H[2] = (H[2] + c) >>> 0;
        H[3] = (H[3] + d) >>> 0;
        H[4] = (H[4] + e) >>> 0;
        H[5] = (H[5] + f) >>> 0;
        H[6] = (H[6] + g) >>> 0;
        H[7] = (H[7] + h) >>> 0;
    }
    let out = "";
    for (const v of H)
        out += ("00000000" + v.toString(16)).slice(-8);
    return out;
}
exports.sha256Hex = sha256Hex;
