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
/**
 * Encryption was requested but cannot run on this build/device — the BUILD/LINK failure class
 *. In the browser that means no `crypto.subtle`, i.e. an insecure origin.
 *
 * The caller MUST resolve this through `encryptionFailureBehavior` and must never respond by opening
 * a plaintext cache on its own initiative.
 */
export declare class OfflineEncryptionUnavailableError extends Error {
    constructor(message: string);
}
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
export declare class OfflineKeyUnreadableError extends Error {
    constructor(message: string);
}
/** Coverage tier actually achieved at rest — exactly these three values (BEH-ENC-14, R57). */
export declare type AtRestTier = "NONE" | "SQLCIPHER" | "FIELD_AES_GCM";
/** Key-protection tier actually achieved — exactly these three values (BEH-ENC-14, R57). */
export declare type KeyStorageTier = "KEYSTORE" | "SOFTWARE" | "NONE";
/**
 * What is never encrypted, on every tier (BEH-ENC-14: `leakage` is always filled in). Downloaded media
 * files stay ordinary files on disk because platform media loaders read them by path.
 */
export declare const MEDIA_LEAKAGE = "cached media bytes, which are stored unencrypted outside the database";
/**
 * The fixed cross-SDK introspection shape. Every SDK returns exactly these keys so an
 * integrator or auditor gets the same answer everywhere.
 *
 * NEVER carries the key, any prefix of it, or its length.
 */
export interface OfflineEncryptionStatus {
    /** What the developer configured. */
    enabled: boolean;
    /** The coverage tier actually achieved. */
    atRest: AtRestTier;
    /** The key tier actually achieved. */
    keyStorage: KeyStorageTier;
    /** Is the cipher engine actually present/linked? `enabled: true` + `false` here is the key support signal. */
    cipherAvailable: boolean;
    /** Human-readable cipher description, or null. */
    cipher: string | null;
    /** What is NOT encrypted — always filled in (media files everywhere; lookup metadata on browsers). */
    leakage: string;
}
/** The status reported when encryption was never switched on. */
export declare const DISABLED_ENCRYPTION_STATUS: OfflineEncryptionStatus;
/**
 * Field-level cipher + blind-index provider. One instance per open `(app, user)` store.
 *
 * Every method is async because WebCrypto is; callers MUST therefore complete all crypto BEFORE
 * opening an IndexedDB transaction (see `RowCodec`).
 */
export interface OfflineCrypto {
    /** Encrypt a UTF-8 string into a stored envelope. Fresh random IV per call. */
    encrypt(plaintext: string): Promise<string>;
    /** Decrypt a stored envelope. Throws `OfflineDecryptError` on a wrong key / tampered / malformed value. */
    decrypt(envelope: string): Promise<string>;
    /** JSON-serialize then encrypt. `undefined` round-trips as `null`. */
    encryptJson(value: unknown): Promise<string>;
    /** Decrypt then JSON-parse. Throws `OfflineDecryptError` on either failure. */
    decryptJson(envelope: string): Promise<unknown>;
    /**
     * Deterministic blind index over an identifier, so filter-before-decrypt still works.
     *
     * Field-AGNOSTIC by design — see `WebCryptoProvider` for why per-field domain separation would
     * silently break conversation scoping.
     */
    bi(value: string): Promise<string>;
    /** `bi` over a list, preserving order. */
    biAll(values: string[]): Promise<string[]>;
    /** This runtime's achieved tiers, for the public status API. */
    status(): OfflineEncryptionStatus;
    /** Drop in-memory key material. Called on logout and on same-user restart. */
    dispose(): void;
    /** True once `dispose()` ran (optional: a crypto without it is taken as live). */
    isDisposed?(): boolean;
}
