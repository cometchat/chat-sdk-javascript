/**
 * Public enums for Offline Messaging.
 *
 * String-valued so the stored/wire form stays stable and human-readable, and so
 * these are never hard-coded as string literals across the engine.
 *
 * @module offline/OfflineEnums
 */
/** At-cap behaviour for the durable send outbox. */
export declare enum PendingMessageOverflowPolicy {
    /** Evict the oldest PENDING message to admit the new one. */
    DROP_OLDEST = "DROP_OLDEST",
    /** Refuse the new send when the queue is full. */
    REJECT_NEWEST = "REJECT_NEWEST"
}
/**
 * Per-user media caching mode (offline). Governs the RECEIVE side only; sending media
 * works in both modes.
 *
 *  - `AUTO` (default): incoming media is auto-downloaded + cached on receipt (any network),
 *    so it is available offline.
 *  - `OFF`: incoming media is NOT downloaded or cached. The message and its attachment
 *    metadata are still cached (the message renders offline); the UI loads the media live
 *    from the remote URL when online.
 */
export declare enum MediaCachingMode {
    AUTO = "AUTO",
    OFF = "OFF"
}
/**
 * What the SDK does when offline encryption **cannot be applied at all** — the BUILD/LINK failure
 * class: the cipher engine is missing on this build/device, or secure key storage is
 * unavailable. In the browser that is an insecure origin (no `crypto.subtle`); in Electron it is a
 * plain `better-sqlite3` in place of the cipher build, or a Linux box with no keyring.
 *
 * Key-for-key identical across every CometChat SDK.
 *
 * Scope: this governs ONLY "encryption is impossible here". A momentary vault failure still retries
 * (TRANSIENT) and a lost key still self-heals by wiping and rebuilding ENCRYPTED (PERMANENT) — neither
 * is affected by this setting, and neither can be downgraded to plaintext by it.
 */
export declare enum EncryptionFailureBehavior {
    /**
     * Default. Do not open a local cache at all; run server-only. Never writes plaintext.
     *
     * The safe default: it protects a compliance customer from a silent downgrade and makes a setup
     * mistake visible, because offline simply stops working until it is fixed.
     */
    ONLINE_ONLY = "ONLINE_ONLY",
    /**
     * Opt-in. Open an UNENCRYPTED local cache so offline keeps working.
     *
     * Logs at error level and reports `atRest: "NONE"` from the status API, so the downgrade is both
     * visible and queryable. An availability-over-guarantee trade — wrong for compliance use.
     */
    PLAINTEXT_FALLBACK = "PLAINTEXT_FALLBACK"
}
/** How a message reached the client — SYNC = delivered by a catch-up sweep. */
export declare enum MessageSource {
    REALTIME = "REALTIME",
    SYNC = "SYNC"
}
/** Public, derived message status (from send-state + receipt timestamps). */
export declare enum MessageStatus {
    PENDING = "PENDING",
    SENDING = "SENDING",
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    READ = "READ",
    FAILED = "FAILED"
}
/** Why a send failed. */
export declare enum MessageFailureReason {
    TRANSIENT = "TRANSIENT",
    PERMANENT = "PERMANENT",
    QUEUE_OVERFLOW = "QUEUE_OVERFLOW",
    QUEUE_FULL = "QUEUE_FULL",
    BYTE_OVERFLOW = "BYTE_OVERFLOW",
    /**
     * The message was removed before it could send: `clearOfflineCache()`, the user's own leave or
     * delete of the group, or any purge of its conversation. Fired only for a message still trying to
     * send (`PENDING` / `SENDING`); an already-`FAILED` one is removed silently (BEH-SEND-01, §10.2).
     */
    DISCARDED = "DISCARDED"
}
/**
 * Why the offline cache was wiped and rebuilt underneath the app, losing the unsent outbox
 * (`onOfflineCacheReset`, BEH-ENC-15 / BEH-ENC-16). A logout never fires it.
 */
export declare enum OfflineCacheResetReason {
    /** The encryption key could not be found any more (key store entry gone, blob unreadable). */
    KEY_LOST = "KEY_LOST",
    /** The stored key does not open the cache. */
    WRONG_KEY = "WRONG_KEY",
    /** The cache file is corrupt. */
    CORRUPTED = "CORRUPTED",
    /** An unclassifiable open failure repeated on three consecutive launches (BEH-ENC-12). */
    ESCALATED = "ESCALATED",
    /** The `encryption` setting no longer matches the cache on disk (BEH-ENC-16). */
    ENCRYPTION_CHANGED = "ENCRYPTION_CHANGED"
}
/** Catch-up sync state. */
export declare enum SyncState {
    IDLE = "IDLE",
    SYNCING = "SYNCING"
}
/**
 * Result of a completed message-sync sweep. Exactly two values.
 *  - `CAUGHT_UP`: the changelog fully drained — the cache is current with the server.
 *  - `PARTIAL`: one changelog page was ingested and more changes remain on the server; the next
 *    sweep resumes from the page's server cursor (BEH-SYNC-22a / BEH-SYNC-23a).
 */
export declare enum SyncOutcome {
    CAUGHT_UP = "CAUGHT_UP",
    PARTIAL = "PARTIAL"
}
