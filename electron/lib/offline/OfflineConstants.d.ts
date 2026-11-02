/**
 * Constants + naming for the offline persistence layer.
 *
 * @module offline/OfflineConstants
 */
/**
 * Bumped on an additive schema change. v2 adds the two upload-batch stores (`upload_batches` /
 * `upload_files`) for offline direct-to-storage uploads; v3 adds `crypto_keys`, which holds the
 * per-(app, user) encryption key co-located with the data it protects — additive only,
 * so the IndexedDB upgrade must be IDEMPOTENT (guard every createObjectStore with
 * `objectStoreNames.contains`) and must NOT drop existing stores, so an earlier user's cached
 * messages/conversations survive the upgrade.
 *
 * v4 adds `blocked_users` and `entity_snapshots` for Offline Read Coverage. §3.1 of that design says
 * "no schema-version bump", which is achievable on a platform whose engine can add a table at any
 * time — but **IndexedDB can only create an object store inside `onupgradeneeded`, which runs only on
 * a version increase**. So the bump is unavoidable here. It is a bump WITHOUT a migration: the
 * upgrade callback stays idempotent and purely additive, nothing is moved, transformed, or dropped,
 * and existing cached rows survive untouched. The intent of §3.1 (no migration code, disposable dev
 * caches) holds; only its literal wording could not.
 *
 * v5 adds `list_rows` and `list_meta` (the pinned / saved / my-threads list stores) and a
 * `parentMessageId` index on `messages`. Same rule: additive and idempotent, so pending sends in
 * `messages` and the upload batches survive the upgrade untouched.
 */
export declare const OFFLINE_SCHEMA_VERSION = 5;
/**
 * Upper bound on opening or deleting one IndexedDB database. Another tab holding an older connection
 * can block an open (or a delete) indefinitely, so the wait is bounded rather than left to hang a login.
 */
export declare const OFFLINE_OPEN_TIMEOUT_MS = 5000;
/**
 * Upper bound on one whole offline start (queue wait + open + startup recovery). A start that has not
 * settled by then is cancelled and the session continues online-only; the next start tries again.
 */
export declare const OFFLINE_START_TIMEOUT_MS = 8000;
/**
 * The peer user role that marks an AGENTIC conversation (Offline Read Coverage §4.2, §11 "Confirmed").
 *
 * A conversation is agentic **iff** it is 1:1 AND the peer user's `role` equals this — a group is
 * never agentic. Note this is a USER ROLE and is unrelated to `MessageCategory.AGENTIC` ("agentic"),
 * which classifies a message; they are different axes that happen to share a word.
 */
export declare const AGENTIC_USER_ROLE = "@agentic";
/**
 * How stale the blocked-users set may get before a settled reconnect sweep refetches it (BEH-CONV-15:
 * "more than 12 h old"). There is no timer: the fetch runs at session start, and after a sweep only
 * once the last successful fetch is older than this.
 */
export declare const BLOCKED_USERS_REFRESH_MS: number;
/**
 * Page size of the ONE blocked-users request (BEH-CONV-15, BEH-SYNC-35:
 * `GET /blockedusers?per_page=1000&direction=both`, first page only). Sent straight to the API: the
 * public request builder's 100-row cap must never block or change it.
 */
export declare const BLOCKED_USERS_PAGE_SIZE = 1000;
/** Entity-list read types — the `(readType, scope)` key for snapshot invalidation (§6.3). */
export declare const SNAPSHOT_READ_TYPE: {
    readonly users: "users";
    readonly groups: "groups";
    readonly groupMembers: "groupMembers";
    readonly bannedMembers: "bannedMembers";
    readonly reactions: "reactions";
    readonly notificationFeed: "notificationFeed";
    readonly threads: "threads";
};
/**
 * A group at/above this membership size is "large" — a realtime receive does NOT bump its cached
 * unread count (mirrors the server's `GROUP_SIZE_LARGE`).
 */
export declare const GROUP_SIZE_LARGE = 300;
/**
 * Is a cached group at/above the "large" membership threshold? Unknown/zero membership → NOT large.
 * `conversationWith` is an object on an IndexedDb row and a JSON string on a SQLite row.
 */
export declare function isLargeGroup(conversationWith: unknown, threshold: number): boolean;
/** Per-(app, user) database name. One DB per user → leak-proof wipe on auth change. */
export declare function offlineDbName(appId: string, uid: string): string;
/**
 * Namespace for the media byte store (OPFS dir / node:fs dir). Per `(app, user)`, like the database,
 * so two apps on one origin with the same uid never share or wipe each other's media.
 */
export declare function offlineMediaNamespace(appId: string, uid: string): string;
/**
 * The per-user namespace earlier builds wrote media under. Read as a fallback so cached bytes and
 * pending outgoing copies survive the upgrade; deleted by every wipe.
 */
export declare function offlineLegacyMediaNamespace(uid: string): string;
/** Object store names (native IndexedDB). */
export declare const STORES: {
    readonly messages: "messages";
    readonly conversations: "conversations";
    readonly attachments: "attachments";
    readonly syncMeta: "sync_meta";
    readonly uploadBatches: "upload_batches";
    readonly uploadFiles: "upload_files";
    readonly cryptoKeys: "crypto_keys";
    readonly blockedUsers: "blocked_users";
    readonly entitySnapshots: "entity_snapshots";
    readonly listRows: "list_rows";
    readonly listMeta: "list_meta";
};
/**
 * Canonical key for an upload batch — the `(receiverType, receiverId, parentMessageId)` triple
 * (OU-2). One durable batch per triple; `create` and `getExisting` resolve to the same key. A
 * main-conversation batch (no parent) uses the `main` sentinel so it never collides with a thread
 * batch. `receiverType` is ASCII-lowercased for stability; `receiverId` is kept verbatim.
 */
export declare function uploadBatchKey(receiverType: string, receiverId: string, parentMessageId?: string | number | null): string;
/** `sync_meta` keys. */
export declare const SYNC_META_KEYS: {
    readonly watermark: "lastSyncedUpdatedAt";
    readonly lastSyncTimestamp: "lastSyncTimestamp";
    readonly schemaVersion: "schemaVersion";
    readonly configSnapshot: "offlineConfigSnapshot";
    /**
     * Which at-rest mode the CURRENTLY STORED rows were written under ("NONE" | "FIELD_AES_GCM").
     *
     * Without this, turning `encryption` on over a store written by an earlier build makes every row
     * fail to decrypt and self-heal individually — refetch-thrash across the whole cache instead of one
     * clean wipe. Checked at open; a mismatch is a whole-store rebuild.
     */
    readonly encryptionMode: "offlineEncryptionMode";
    /**
     * The id half of the reconnect changelog cursor `(updatedAt, id)` (BEH-SYNC-09). The updatedAt half
     * is `watermark`; both are written in one transaction (BEH-SYNC-21).
     */
    readonly watermarkId: "lastSyncedId";
    /** When the blocked-users set was last replaced from the server, ms (BEH-CONV-15). */
    readonly blockedUsersFetchedAt: "blockedUsersFetchedAt";
    /**
     * Browser encrypted store: a known value sealed under the store's key. At open it tells a key that
     * opens this store from one that does not (WRONG_KEY), apart from damaged rows (CORRUPTED).
     */
    readonly keyCheck: "offlineKeyCheck";
};
/**
 * `sync_meta` key prefix for an outbox row's count of dispatched-but-unanswered sends (BEH-SEND-10).
 * Persisted so the 5-reconnect cap survives a restart.
 */
export declare const OUTBOX_ATTEMPTS_META_PREFIX = "outboxAttempts:";
/**
 * `sync_meta` key prefix marking an outbox row whose last attempt got no answer: it now waits for the
 * reconnect flush (R94, R107). Persisted so a drain the app starts after a restart still leaves it.
 */
export declare const OUTBOX_UNANSWERED_META_PREFIX = "outboxUnanswered:";
/**
 * How long one outbox send waits for the server's answer before it counts as no answer (BEH-SEND-10
 * lists a timeout as NOT_CONNECTED). The SDK's REST transport has no timeout of its own, so a request
 * caught by a network drop can stay unanswered for minutes, holding its chat and the reconnect sweep
 * that waits for the flush. Android's JSON client times out at 15 s (text, custom and interactive
 * sends); React Native uses the same. A request timeout, not a retry timer (R73, R94): the message is
 * retried only by the next reconnect flush.
 */
export declare const OUTBOX_SEND_TIMEOUT_MS = 15000;
/**
 * The base of a media send's limit: Android's file client, 40 s. Android's 15 / 40 s are inactivity
 * timeouts (no call timeout), so a large upload on a slow link still finishes there; a fetch here has
 * no progress signal, so the limit grows with the upload instead: 40 s plus the upload's bytes at
 * {@link OUTBOX_MEDIA_FLOOR_BYTES_PER_S}.
 */
export declare const OUTBOX_MEDIA_SEND_TIMEOUT_MS = 40000;
/** The floor upload rate a media send's limit allows for: 16 KiB/s (≈ 128 kbit/s, a poor mobile link). */
export declare const OUTBOX_MEDIA_FLOOR_BYTES_PER_S = 16384;
/**
 * How long a timed-out send's request is still treated as its attempt. Until it answers — or this
 * passes — a reconnect flush does not post the message again, so a late acceptance cannot become a
 * second copy on the server. Past it the attempt counts as lost (BEH-SEND-23: an acceptance after that
 * can leave a duplicate).
 */
export declare const OUTBOX_LATE_ANSWER_HOLD_MS = 120000;
/**
 * How long one request of the reconnect sweep (conversations, changelog page, my threads, blocked
 * users) waits for its answer before it fails as no answer — Android's JSON REST timeout, 15 s. Without
 * it a request caught by a network drop holds the sweep, and its single-flight latch, for as long as
 * the request hangs, and every reconnect meanwhile only queues behind it. Not a retry timer: the
 * failed phase is reported (BEH-SYNC-29) and the next reconnect sweeps again.
 */
export declare const SYNC_REQUEST_TIMEOUT_MS = 15000;
/** Public per-call error code of a send removed before it could go (reason `DISCARDED`, §10.2). */
export declare const OFFLINE_MESSAGE_ERROR: {
    readonly DISCARDED: "ERROR_OFFLINE_MESSAGE_DISCARDED";
    /**
     * The local store could not be read just now (busy, locked, full, closing): `getPendingMessages`
     * rejects with it instead of answering an empty list (BEH-SEND-25, R118). Android's code for it.
     */
    readonly STORE_UNAVAILABLE: "ERROR_OFFLINE_MESSAGE_PERSIST_FAILED";
    /**
     * R160 (BEH-SEND-36 / BEH-SEND-20): `discardLocalMessage` / `retryMessage` was called for a message
     * whose send has already started (`SENDING`, or a timed-out request still awaiting its answer) — it
     * is in flight and cannot be removed or re-attempted. Band-1 string, identical across SDKs.
     */
    readonly IN_FLIGHT: "ERROR_OFFLINE_MESSAGE_IN_FLIGHT";
    /**
     * R160 (BEH-SEND-36 / BEH-SEND-20): `discardLocalMessage` / `retryMessage` named an unknown
     * localMessageId, or one whose message has already been sent (it is no longer in the outbox). Band-1
     * string, identical across SDKs.
     */
    readonly NOT_FOUND: "ERROR_OFFLINE_MESSAGE_NOT_FOUND";
};
/** Public reject codes for `forceSyncNow(callback)`. */
export declare const OFFLINE_SYNC_ERROR: {
    /** A sweep is already running. */
    readonly IN_PROGRESS: "ERROR_OFFLINE_SYNC_IN_PROGRESS";
    /** Called again within the cooldown window; the error carries `retryAfterMs`. */
    readonly COOLDOWN: "ERROR_OFFLINE_SYNC_COOLDOWN";
    /** Offline is disabled — there is no sync engine to drive. */
    readonly DISABLED: "ERROR_OFFLINE_DISABLED";
};
/** Minimum gap between two forced syncs; a `forceSyncNow(callback)` inside this window rejects COOLDOWN. */
export declare const FORCE_SYNC_COOLDOWN_MS = 10000;
