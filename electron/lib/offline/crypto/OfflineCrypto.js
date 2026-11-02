"use strict";
/**
 * The offline-encryption seam: the ONLY surface the storage backends talk to.
 *
 * There is deliberately no "null object" implementation. When `encryption` is off the stores hold a
 * `null` crypto and keep their existing synchronous code paths untouched — that is what makes
 * "off is byte-identical to today" structurally true rather than merely intended. An
 * identity implementation would still cost a call and, worse, an `await` — and an `await` inside an
 * IndexedDB transaction auto-commits it.
 *
 * @module offline/crypto/OfflineCrypto
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DISABLED_ENCRYPTION_STATUS = exports.MEDIA_LEAKAGE = exports.OfflineKeyUnreadableError = exports.OfflineEncryptionUnavailableError = void 0;
/**
 * Encryption was requested but cannot run on this build/device — the BUILD/LINK failure class
 *. In the browser that means no `crypto.subtle`, i.e. an insecure origin.
 *
 * The caller MUST resolve this through `encryptionFailureBehavior` and must never respond by opening
 * a plaintext cache on its own initiative.
 */
class OfflineEncryptionUnavailableError extends Error {
    constructor(message) {
        super(message);
        // ES5 target: restore the prototype chain so `instanceof` survives downlevelling.
        Object.setPrototypeOf(this, OfflineEncryptionUnavailableError.prototype);
        this.name = "OfflineEncryptionUnavailableError";
    }
}
exports.OfflineEncryptionUnavailableError = OfflineEncryptionUnavailableError;
/**
 * The stored key exists but cannot be opened: the wrapped data key fails authentication under its
 * wrapping key, or the record is not one this build wrote (missing fields, unknown version). That is a
 * lost key — the PERMANENT class (BEH-ENC-11), handled on the first occurrence by a wipe that rotates
 * to a fresh key. Android `OfflineEncryptionFailureClassifier` :113-120 (`AEADBadTagException`,
 * `OfflineKeyUnreadableException`).
 *
 * A failure READING the record (the key store itself erroring) is never this: it cannot tell a locked
 * store from a lost key, so it stays unclassified (BEH-ENC-12).
 */
class OfflineKeyUnreadableError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, OfflineKeyUnreadableError.prototype);
        this.name = "OfflineKeyUnreadableError";
    }
}
exports.OfflineKeyUnreadableError = OfflineKeyUnreadableError;
/**
 * What is never encrypted, on every tier (BEH-ENC-14: `leakage` is always filled in). Downloaded media
 * files stay ordinary files on disk because platform media loaders read them by path.
 */
exports.MEDIA_LEAKAGE = "cached media bytes, which are stored unencrypted outside the database";
/** The status reported when encryption was never switched on. */
exports.DISABLED_ENCRYPTION_STATUS = {
    enabled: false,
    atRest: "NONE",
    keyStorage: "NONE",
    cipherAvailable: false,
    cipher: null,
    leakage: exports.MEDIA_LEAKAGE,
};
