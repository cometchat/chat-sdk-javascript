"use strict";
/**
 * Constants + naming for the offline persistence layer.
 *
 * @module offline/OfflineConstants
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FORCE_SYNC_COOLDOWN_MS = exports.OFFLINE_SYNC_ERROR = exports.OFFLINE_MESSAGE_ERROR = exports.SYNC_REQUEST_TIMEOUT_MS = exports.OUTBOX_LATE_ANSWER_HOLD_MS = exports.OUTBOX_MEDIA_FLOOR_BYTES_PER_S = exports.OUTBOX_MEDIA_SEND_TIMEOUT_MS = exports.OUTBOX_SEND_TIMEOUT_MS = exports.OUTBOX_UNANSWERED_META_PREFIX = exports.OUTBOX_ATTEMPTS_META_PREFIX = exports.SYNC_META_KEYS = exports.uploadBatchKey = exports.STORES = exports.offlineLegacyMediaNamespace = exports.offlineMediaNamespace = exports.offlineDbName = exports.isLargeGroup = exports.GROUP_SIZE_LARGE = exports.SNAPSHOT_READ_TYPE = exports.BLOCKED_USERS_PAGE_SIZE = exports.BLOCKED_USERS_REFRESH_MS = exports.AGENTIC_USER_ROLE = exports.OFFLINE_START_TIMEOUT_MS = exports.OFFLINE_OPEN_TIMEOUT_MS = exports.OFFLINE_SCHEMA_VERSION = void 0;
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
exports.OFFLINE_SCHEMA_VERSION = 5;
/**
 * Upper bound on opening or deleting one IndexedDB database. Another tab holding an older connection
 * can block an open (or a delete) indefinitely, so the wait is bounded rather than left to hang a login.
 */
exports.OFFLINE_OPEN_TIMEOUT_MS = 5000;
/**
 * Upper bound on one whole offline start (queue wait + open + startup recovery). A start that has not
 * settled by then is cancelled and the session continues online-only; the next start tries again.
 */
exports.OFFLINE_START_TIMEOUT_MS = 8000;
/**
 * The peer user role that marks an AGENTIC conversation (Offline Read Coverage §4.2, §11 "Confirmed").
 *
 * A conversation is agentic **iff** it is 1:1 AND the peer user's `role` equals this — a group is
 * never agentic. Note this is a USER ROLE and is unrelated to `MessageCategory.AGENTIC` ("agentic"),
 * which classifies a message; they are different axes that happen to share a word.
 */
exports.AGENTIC_USER_ROLE = "@agentic";
/**
 * How stale the blocked-users set may get before a settled reconnect sweep refetches it (BEH-CONV-15:
 * "more than 12 h old"). There is no timer: the fetch runs at session start, and after a sweep only
 * once the last successful fetch is older than this.
 */
exports.BLOCKED_USERS_REFRESH_MS = 12 * 60 * 60 * 1000;
/**
 * Page size of the ONE blocked-users request (BEH-CONV-15, BEH-SYNC-35:
 * `GET /blockedusers?per_page=1000&direction=both`, first page only). Sent straight to the API: the
 * public request builder's 100-row cap must never block or change it.
 */
exports.BLOCKED_USERS_PAGE_SIZE = 1000;
/** Entity-list read types — the `(readType, scope)` key for snapshot invalidation (§6.3). */
exports.SNAPSHOT_READ_TYPE = {
    users: "users",
    groups: "groups",
    groupMembers: "groupMembers",
    bannedMembers: "bannedMembers",
    reactions: "reactions",
    notificationFeed: "notificationFeed",
    threads: "threads",
};
/**
 * A group at/above this membership size is "large" — a realtime receive does NOT bump its cached
 * unread count (mirrors the server's `GROUP_SIZE_LARGE`).
 */
exports.GROUP_SIZE_LARGE = 300;
/**
 * Is a cached group at/above the "large" membership threshold? Unknown/zero membership → NOT large.
 * `conversationWith` is an object on an IndexedDb row and a JSON string on a SQLite row.
 */
function isLargeGroup(conversationWith, threshold) {
    var _a, _b;
    try {
        const cw = typeof conversationWith === "string" ? JSON.parse(conversationWith) : conversationWith;
        const count = Number((_b = (_a = cw === null || cw === void 0 ? void 0 : cw.membersCount) !== null && _a !== void 0 ? _a : cw === null || cw === void 0 ? void 0 : cw.members_count) !== null && _b !== void 0 ? _b : 0);
        // Strictly GREATER than the threshold (Android UnreadCountWriter.java:177 `> GROUP_SIZE_LARGE`):
        // the server skips AddToConversation only for groups LARGER than GROUP_SIZE_LARGE, so a group of
        // exactly `threshold` members must still count unread. `>=` wrongly suppressed the boundary case.
        return count > 0 && count > threshold;
    }
    catch {
        return false; // unknown → not large → count anyway
    }
}
exports.isLargeGroup = isLargeGroup;
const OFFLINE_DB_PREFIX = "cometchat_offline";
const OFFLINE_MEDIA_PREFIX = "cometchat_media";
/** Per-(app, user) database name. One DB per user → leak-proof wipe on auth change. */
function offlineDbName(appId, uid) {
    return `${OFFLINE_DB_PREFIX}_${appId}_${uid}`;
}
exports.offlineDbName = offlineDbName;
/**
 * Namespace for the media byte store (OPFS dir / node:fs dir). Per `(app, user)`, like the database,
 * so two apps on one origin with the same uid never share or wipe each other's media.
 */
function offlineMediaNamespace(appId, uid) {
    return `${OFFLINE_MEDIA_PREFIX}_${appId}_${uid}`;
}
exports.offlineMediaNamespace = offlineMediaNamespace;
/**
 * The per-user namespace earlier builds wrote media under. Read as a fallback so cached bytes and
 * pending outgoing copies survive the upgrade; deleted by every wipe.
 */
function offlineLegacyMediaNamespace(uid) {
    return `${OFFLINE_MEDIA_PREFIX}_${uid}`;
}
exports.offlineLegacyMediaNamespace = offlineLegacyMediaNamespace;
/** Object store names (native IndexedDB). */
exports.STORES = {
    messages: "messages",
    conversations: "conversations",
    attachments: "attachments",
    syncMeta: "sync_meta",
    uploadBatches: "upload_batches",
    uploadFiles: "upload_files",
    cryptoKeys: "crypto_keys",
    blockedUsers: "blocked_users",
    entitySnapshots: "entity_snapshots",
    listRows: "list_rows",
    listMeta: "list_meta",
};
/**
 * Canonical key for an upload batch — the `(receiverType, receiverId, parentMessageId)` triple
 * (OU-2). One durable batch per triple; `create` and `getExisting` resolve to the same key. A
 * main-conversation batch (no parent) uses the `main` sentinel so it never collides with a thread
 * batch. `receiverType` is ASCII-lowercased for stability; `receiverId` is kept verbatim.
 */
function uploadBatchKey(receiverType, receiverId, parentMessageId) {
    const type = (receiverType || "").replace(/[A-Z]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 32));
    const parent = parentMessageId === undefined || parentMessageId === null || String(parentMessageId) === ""
        ? "main"
        : String(parentMessageId);
    return `up_${type}_${receiverId}_${parent}`;
}
exports.uploadBatchKey = uploadBatchKey;
/** `sync_meta` keys. */
exports.SYNC_META_KEYS = {
    watermark: "lastSyncedUpdatedAt",
    lastSyncTimestamp: "lastSyncTimestamp",
    schemaVersion: "schemaVersion",
    configSnapshot: "offlineConfigSnapshot",
    /**
     * Which at-rest mode the CURRENTLY STORED rows were written under ("NONE" | "FIELD_AES_GCM").
     *
     * Without this, turning `encryption` on over a store written by an earlier build makes every row
     * fail to decrypt and self-heal individually — refetch-thrash across the whole cache instead of one
     * clean wipe. Checked at open; a mismatch is a whole-store rebuild.
     */
    encryptionMode: "offlineEncryptionMode",
    /**
     * The id half of the reconnect changelog cursor `(updatedAt, id)` (BEH-SYNC-09). The updatedAt half
     * is `watermark`; both are written in one transaction (BEH-SYNC-21).
     */
    watermarkId: "lastSyncedId",
    /** When the blocked-users set was last replaced from the server, ms (BEH-CONV-15). */
    blockedUsersFetchedAt: "blockedUsersFetchedAt",
    /**
     * Browser encrypted store: a known value sealed under the store's key. At open it tells a key that
     * opens this store from one that does not (WRONG_KEY), apart from damaged rows (CORRUPTED).
     */
    keyCheck: "offlineKeyCheck",
};
/**
 * `sync_meta` key prefix for an outbox row's count of dispatched-but-unanswered sends (BEH-SEND-10).
 * Persisted so the 5-reconnect cap survives a restart.
 */
exports.OUTBOX_ATTEMPTS_META_PREFIX = "outboxAttempts:";
/**
 * `sync_meta` key prefix marking an outbox row whose last attempt got no answer: it now waits for the
 * reconnect flush (R94, R107). Persisted so a drain the app starts after a restart still leaves it.
 */
exports.OUTBOX_UNANSWERED_META_PREFIX = "outboxUnanswered:";
/**
 * How long one outbox send waits for the server's answer before it counts as no answer (BEH-SEND-10
 * lists a timeout as NOT_CONNECTED). The SDK's REST transport has no timeout of its own, so a request
 * caught by a network drop can stay unanswered for minutes, holding its chat and the reconnect sweep
 * that waits for the flush. Android's JSON client times out at 15 s (text, custom and interactive
 * sends); React Native uses the same. A request timeout, not a retry timer (R73, R94): the message is
 * retried only by the next reconnect flush.
 */
exports.OUTBOX_SEND_TIMEOUT_MS = 15000;
/**
 * The base of a media send's limit: Android's file client, 40 s. Android's 15 / 40 s are inactivity
 * timeouts (no call timeout), so a large upload on a slow link still finishes there; a fetch here has
 * no progress signal, so the limit grows with the upload instead: 40 s plus the upload's bytes at
 * {@link OUTBOX_MEDIA_FLOOR_BYTES_PER_S}.
 */
exports.OUTBOX_MEDIA_SEND_TIMEOUT_MS = 40000;
/** The floor upload rate a media send's limit allows for: 16 KiB/s (≈ 128 kbit/s, a poor mobile link). */
exports.OUTBOX_MEDIA_FLOOR_BYTES_PER_S = 16384;
/**
 * How long a timed-out send's request is still treated as its attempt. Until it answers — or this
 * passes — a reconnect flush does not post the message again, so a late acceptance cannot become a
 * second copy on the server. Past it the attempt counts as lost (BEH-SEND-23: an acceptance after that
 * can leave a duplicate).
 */
exports.OUTBOX_LATE_ANSWER_HOLD_MS = 120000;
/**
 * How long one request of the reconnect sweep (conversations, changelog page, my threads, blocked
 * users) waits for its answer before it fails as no answer — Android's JSON REST timeout, 15 s. Without
 * it a request caught by a network drop holds the sweep, and its single-flight latch, for as long as
 * the request hangs, and every reconnect meanwhile only queues behind it. Not a retry timer: the
 * failed phase is reported (BEH-SYNC-29) and the next reconnect sweeps again.
 */
exports.SYNC_REQUEST_TIMEOUT_MS = 15000;
/** Public per-call error code of a send removed before it could go (reason `DISCARDED`, §10.2). */
exports.OFFLINE_MESSAGE_ERROR = {
    DISCARDED: "ERROR_OFFLINE_MESSAGE_DISCARDED",
    /**
     * The local store could not be read just now (busy, locked, full, closing): `getPendingMessages`
     * rejects with it instead of answering an empty list (BEH-SEND-25, R118). Android's code for it.
     */
    STORE_UNAVAILABLE: "ERROR_OFFLINE_MESSAGE_PERSIST_FAILED",
    /**
     * R160 (BEH-SEND-36 / BEH-SEND-20): `discardLocalMessage` / `retryMessage` was called for a message
     * whose send has already started (`SENDING`, or a timed-out request still awaiting its answer) — it
     * is in flight and cannot be removed or re-attempted. Band-1 string, identical across SDKs.
     */
    IN_FLIGHT: "ERROR_OFFLINE_MESSAGE_IN_FLIGHT",
    /**
     * R160 (BEH-SEND-36 / BEH-SEND-20): `discardLocalMessage` / `retryMessage` named an unknown
     * localMessageId, or one whose message has already been sent (it is no longer in the outbox). Band-1
     * string, identical across SDKs.
     */
    NOT_FOUND: "ERROR_OFFLINE_MESSAGE_NOT_FOUND",
};
/** Public reject codes for `forceSyncNow(callback)`. */
exports.OFFLINE_SYNC_ERROR = {
    /** A sweep is already running. */
    IN_PROGRESS: "ERROR_OFFLINE_SYNC_IN_PROGRESS",
    /** Called again within the cooldown window; the error carries `retryAfterMs`. */
    COOLDOWN: "ERROR_OFFLINE_SYNC_COOLDOWN",
    /** Offline is disabled — there is no sync engine to drive. */
    DISABLED: "ERROR_OFFLINE_DISABLED",
};
/** Minimum gap between two forced syncs; a `forceSyncNow(callback)` inside this window rejects COOLDOWN. */
exports.FORCE_SYNC_COOLDOWN_MS = 10000;
