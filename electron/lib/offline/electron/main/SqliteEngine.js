"use strict";
/**
 * Main-process `OfflineStore` over better-sqlite3 — the real files-on-disk metadata backend for
 * Electron. Mirrors `IndexedDbOfflineStore` behaviourally and REUSES the shared `Projections`
 * predicates (`inScope` / `matchesMessage`) + `extractTags`/`extractMentions`, so the query
 * semantics are identical to the browser. better-sqlite3 is synchronous + transactional, so every
 * method is sync; the IPC layer turns the return value into the renderer's resolved Promise.
 *
 * DB file: `app.getPath('userData')/cometchat-offline/<appId>_<uid>.db`. One DB per user.
 *
 * NOT part of the renderer SDK bundle — imported only by the host app's main process, where
 * `electron`, `better-sqlite3` and `node:*` are available (resolved via runtime `require`).
 *
 * @module offline/electron/main/SqliteEngine
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.readUnsentFromFile = exports.sqliteFileFormat = exports.SqliteEngine = exports.peerVersionProblem = exports.MIN_SQLITE_DRIVER_MAJOR = exports.MIN_ELECTRON_MAJOR = void 0;
const FlagAuthority_1 = require("../../flags/FlagAuthority");
const Projections_1 = require("../../Projections");
const ConversationFilters_1 = require("../../read/ConversationFilters");
const StoreShared_1 = require("../../read/StoreShared");
const ConversationKey_1 = require("../../ConversationKey");
const OfflineConstants_1 = require("../../OfflineConstants");
const OfflineCrypto_1 = require("../../crypto/OfflineCrypto");
const PathSafety_1 = require("./PathSafety");
const SqliteCipher_1 = require("./SqliteCipher");
/** conversationIds a message row belongs to — its stored id plus, for a provisional outbox row, the
 *  canonical id derived from the row itself (so a footprint purge catches unreconciled pending sends). */
function sqliteRowConversationIds(r) {
    const ids = [r.conversationId];
    const derived = r.receiverType === "group"
        ? ConversationKey_1.canonicalGroupConversationId(r.receiverId)
        : ConversationKey_1.canonicalUserConversationId(r.senderUid, r.receiverId);
    if (derived !== r.conversationId)
        ids.push(derived);
    return ids;
}
const DEFAULT_PAGE = 30;
/** Numeric reading-order tiebreak (D-51): the server id, or MAX_SAFE_INTEGER for a not-yet-acked row
 *  (no id → sorts newest). Kept identical to the IndexedDB backend + `compareReadingOrder`. NOTE: the
 *  `id` column is TEXT (round-trips as a string here, unlike the numeric IndexedDB id), so coerce with
 *  Number(...) — a bare `<`/`>` on two numeric strings would compare lexically ("40" < "5"). */
const ID_SORT_MAX = Number.MAX_SAFE_INTEGER;
function idNum(r) {
    return r.id != null ? Number(r.id) : ID_SORT_MAX;
}
const SCHEMA = `
CREATE TABLE IF NOT EXISTS messages (
  localMessageId  TEXT PRIMARY KEY,
  id              TEXT,
  conversationId  TEXT NOT NULL,
  senderUid       TEXT,
  receiverType    TEXT,
  receiverId      TEXT,
  type            TEXT,
  category        TEXT,
  parentMessageId INTEGER,
  quotedMessageId INTEGER,
  sentAt          INTEGER,
  updatedAt       INTEGER,
  deletedAt       INTEGER,
  deliveredAt     INTEGER,
  readAt          INTEGER,
  sendState       TEXT NOT NULL,
  failureReason   TEXT,
  localSortTs     INTEGER NOT NULL,
  source          TEXT,
  payload         TEXT NOT NULL,
  tags            TEXT NOT NULL DEFAULT '[]',
  mentions        TEXT NOT NULL DEFAULT '[]',
  hasAttachments  INTEGER NOT NULL DEFAULT 0,
  attachmentTypes TEXT NOT NULL DEFAULT '[]',
  hasReactions    INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_messages_id         ON messages(id);
CREATE INDEX IF NOT EXISTS idx_messages_convo_sort ON messages(conversationId, localSortTs);
CREATE INDEX IF NOT EXISTS idx_messages_sortts     ON messages(localSortTs);
CREATE INDEX IF NOT EXISTS idx_messages_sendstate  ON messages(sendState);

CREATE TABLE IF NOT EXISTS message_tags (
  localMessageId TEXT NOT NULL,
  tag            TEXT NOT NULL,
  PRIMARY KEY (localMessageId, tag)
);
CREATE INDEX IF NOT EXISTS idx_message_tags_tag ON message_tags(tag);

CREATE TABLE IF NOT EXISTS conversations (
  conversationId       TEXT PRIMARY KEY,
  conversationType     TEXT,
  conversationWith     TEXT,
  lastMessage          TEXT,
  lastMessageId        INTEGER,
  unreadCount          INTEGER NOT NULL DEFAULT 0,
  updatedAt            INTEGER,
  localSortTs          INTEGER NOT NULL,
  lastAccessedTs       INTEGER NOT NULL,
  tags                 TEXT NOT NULL DEFAULT '[]',
  newestCachedMessageId INTEGER,
  oldestCachedMessageId INTEGER,
  blockedByMe          INTEGER,
  hasBlockedMe         INTEGER,
  isAgentic            INTEGER,
  peerTags             TEXT NOT NULL DEFAULT '[]',
  lastReadMessageId    TEXT,
  unreadMentionsCount  INTEGER,
  latestMessageId      TEXT,
  serverReturned       INTEGER,
  writeSeq             INTEGER
);
CREATE INDEX IF NOT EXISTS idx_conversations_sortts ON conversations(localSortTs);

CREATE TABLE IF NOT EXISTS attachments (
  attachmentId    TEXT PRIMARY KEY,
  localMessageId  TEXT,
  fileUrl         TEXT,
  localPath       TEXT,
  mimeType        TEXT,
  name            TEXT,
  size            INTEGER,
  width           INTEGER,
  height          INTEGER,
  isExternalUrl   INTEGER,
  lastAccessedTs  INTEGER,
  pendingProtected INTEGER
);

CREATE TABLE IF NOT EXISTS sync_meta (key TEXT PRIMARY KEY, value TEXT);

CREATE TABLE IF NOT EXISTS upload_batches (
  batchKey        TEXT PRIMARY KEY,
  batchId         TEXT,
  receiverType    TEXT,
  receiverId      TEXT,
  parentMessageId TEXT,
  concurrency     INTEGER,
  updatedAt       INTEGER
);

CREATE TABLE IF NOT EXISTS upload_files (
  batchKey        TEXT NOT NULL,
  fileId          TEXT NOT NULL,
  orderIndex      INTEGER,
  name            TEXT,
  size            INTEGER,
  mimeType        TEXT,
  state           TEXT,
  localKey        TEXT,
  mediaRef        TEXT,
  attachmentJson  TEXT,
  failureCode     TEXT,
  failureMessage  TEXT,
  updatedAt       INTEGER,
  PRIMARY KEY (batchKey, fileId)
);
CREATE INDEX IF NOT EXISTS idx_upload_files_batch ON upload_files(batchKey);

CREATE TABLE IF NOT EXISTS blocked_users (
  uid          TEXT PRIMARY KEY,
  blockedByMe  INTEGER NOT NULL DEFAULT 0,
  hasBlockedMe INTEGER NOT NULL DEFAULT 0,
  user         TEXT,
  updatedAt    INTEGER
);

CREATE TABLE IF NOT EXISTS entity_snapshots (
  signature      TEXT NOT NULL,
  pageIndex      INTEGER NOT NULL,
  readType       TEXT NOT NULL,
  scope          TEXT NOT NULL DEFAULT '',
  response       TEXT NOT NULL,
  hasNext        INTEGER NOT NULL DEFAULT 0,
  recordedAt     INTEGER NOT NULL DEFAULT 0,
  lastAccessedTs INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (signature, pageIndex)
);
CREATE INDEX IF NOT EXISTS idx_entity_snapshots_scope ON entity_snapshots(readType, scope);

CREATE INDEX IF NOT EXISTS idx_messages_parent ON messages(parentMessageId);

CREATE TABLE IF NOT EXISTS list_rows (
  kind           TEXT NOT NULL,
  scopeKey       TEXT NOT NULL,
  itemId         TEXT NOT NULL,
  conversationId TEXT NOT NULL,
  serverK1       INTEGER,
  serverK2       INTEGER,
  sortK1         INTEGER NOT NULL,
  updatedAt      INTEGER,
  localRev       INTEGER NOT NULL DEFAULT 0,
  payload        TEXT NOT NULL,
  PRIMARY KEY (kind, scopeKey, itemId)
);
CREATE INDEX IF NOT EXISTS idx_list_rows_conversation ON list_rows(conversationId);
CREATE INDEX IF NOT EXISTS idx_list_rows_item ON list_rows(itemId);

CREATE TABLE IF NOT EXISTS list_meta (
  kind     TEXT NOT NULL,
  scopeKey TEXT NOT NULL,
  floorK1  INTEGER,
  floorK2  INTEGER,
  complete INTEGER NOT NULL DEFAULT 0,
  rev      INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (kind, scopeKey)
);
`;
/**
 * Columns added to ALREADY-CREATED tables by Offline Read Coverage.
 *
 * `CREATE TABLE IF NOT EXISTS` is a no-op on a database an earlier build created, so the new columns
 * in SCHEMA above would never appear on a developer's existing `.db` — and a missing column is a hard
 * `SqliteError` on the very first read, not a disposable cache. These `ALTER TABLE` statements close
 * that gap. They are idempotent (guarded by `PRAGMA table_info` below), additive, and move no data:
 * this is the SQLite half of the "additive schema change, no migration" rule (§3.1).
 */
const ADDED_COLUMNS = [
    { table: "messages", column: "hasAttachments", ddl: "INTEGER NOT NULL DEFAULT 0" },
    { table: "messages", column: "attachmentTypes", ddl: "TEXT NOT NULL DEFAULT '[]'" },
    { table: "messages", column: "hasReactions", ddl: "INTEGER NOT NULL DEFAULT 0" },
    { table: "conversations", column: "blockedByMe", ddl: "INTEGER" },
    { table: "conversations", column: "hasBlockedMe", ddl: "INTEGER" },
    { table: "conversations", column: "isAgentic", ddl: "INTEGER" },
    { table: "conversations", column: "peerTags", ddl: "TEXT NOT NULL DEFAULT '[]'" },
    { table: "conversations", column: "lastReadMessageId", ddl: "TEXT" },
    { table: "conversations", column: "unreadMentionsCount", ddl: "INTEGER" },
    { table: "conversations", column: "latestMessageId", ddl: "TEXT" },
    // Pin / save / follow flags. NULL = never written; see the flag codec below for "cleared".
    { table: "messages", column: "pinnedAt", ddl: "INTEGER" },
    { table: "messages", column: "pinnedBy", ddl: "TEXT" },
    { table: "messages", column: "savedAt", ddl: "INTEGER" },
    { table: "messages", column: "threadSubscribed", ddl: "INTEGER" },
    { table: "conversations", column: "pinnedAt", ddl: "INTEGER" },
    { table: "conversations", column: "pinnedBy", ddl: "TEXT" },
    // BEH-CPIN-01: the admin pin and the user's own pin, kept apart. Same flag codec as pinnedAt.
    { table: "conversations", column: "systemPinnedAt", ddl: "INTEGER" },
    { table: "conversations", column: "ownPinnedAt", ddl: "INTEGER" },
    // R156 / BEH-SYNC-15: the sticky server-returned marker and the monotonic write stamp.
    { table: "conversations", column: "serverReturned", ddl: "INTEGER" },
    { table: "conversations", column: "writeSeq", ddl: "INTEGER" },
];
// --- flag codec --------------------------------------------------------------------------------
//
// A flag has three states — never written (keep), cleared, set — and SQLite has one NULL. NULL stays
// "never written", so a cleared timestamp is stored as 0, a cleared `pinnedBy` as "", and
// `threadSubscribed` as 0/1.
const encFlagNum = (v) => (v === undefined ? null : v === null ? 0 : v);
const decFlagNum = (d) => (d == null ? undefined : Number(d) === 0 ? null : Number(d));
const encFlagStr = (v) => (v === undefined ? null : v === null ? "" : v);
const decFlagStr = (d) => (d == null ? undefined : d === "" ? null : String(d));
const encFlagBool = (v) => (v === undefined ? null : v ? 1 : 0);
const decFlagBool = (d) => (d == null ? undefined : !!d);
const MESSAGE_FLAG_COLUMNS = ["pinnedAt", "pinnedBy", "savedAt", "threadSubscribed"];
/**
 * Resolve the SQLite driver.
 *
 * `better-sqlite3-multiple-ciphers` is the driver this SDK asks Electron integrators to install: it
 * is a drop-in for `better-sqlite3` that also links SQLCipher, and it opens an UNKEYED database as
 * ordinary SQLite — so `encryption: false` behaves exactly as before on it.
 *
 * When encryption is OFF, a host still on plain `better-sqlite3` keeps working; that swap is a
 * major-version note, not a reason to break an app that never asked for encryption. When encryption
 * is ON the cipher build is required outright, and its absence is BUILD/LINK — never a quiet fall
 * back to the plain driver, which would accept `PRAGMA key`, ignore it, and write plaintext.
 */
function resolveSqliteDriver(encryption) {
    try {
        return require("better-sqlite3-multiple-ciphers");
    }
    catch (e) {
        if (encryption) {
            // Report WHY it would not load, not merely that it did not. The two realistic causes need
            // completely different fixes and look identical from the outside: the package genuinely being
            // absent (install it), versus it being installed but compiled against the wrong Node ABI
            // (rebuild it for Electron — `@electron/rebuild`). Swallowing the cause sends people to
            // reinstall a package that is already there.
            const cause = (e && e.message) || String(e);
            const abiMismatch = /NODE_MODULE_VERSION|was compiled against a different/i.test(cause);
            throw new OfflineCrypto_1.OfflineEncryptionUnavailableError(abiMismatch
                ? "the 'better-sqlite3-multiple-ciphers' native module is installed but was built for a " +
                    "different Node ABI, so Electron cannot load it. Rebuild it for this Electron version: " +
                    "npx @electron/rebuild -f -w better-sqlite3-multiple-ciphers --build-from-source. " +
                    "Underlying error: " +
                    cause
                : "offline encryption requires the 'better-sqlite3-multiple-ciphers' package; install it " +
                    "in place of 'better-sqlite3' (it is a drop-in replacement). Underlying error: " +
                    cause);
        }
    }
    return require("better-sqlite3");
}
/**
 * The oldest `electron` and `better-sqlite3-multiple-ciphers` offline supports (R65). Both are optional
 * peers declared with no version range, so an app on an older release still installs and builds; the
 * floors are checked here instead, in the main process when offline opens a store.
 */
exports.MIN_ELECTRON_MAJOR = 20;
exports.MIN_SQLITE_DRIVER_MAJOR = 9;
function majorOf(version) {
    const m = /^v?(\d+)(\.|$)/.exec(String(version || "").trim());
    return m ? Number(m[1]) : NaN;
}
/**
 * Why the installed peers are too old for offline, or `null` when they are fine. A version that is
 * absent or unreadable is not a reason: an absent driver is reported by {@link resolveSqliteDriver},
 * and `electron` is always present in a real main process.
 */
function peerVersionProblem(electronVersion, driverVersion) {
    const e = majorOf(electronVersion);
    if (e < exports.MIN_ELECTRON_MAJOR) {
        return ("CometChat offline messaging needs Electron " + exports.MIN_ELECTRON_MAJOR + " or later in the main process " +
            "(found " + electronVersion + "). Offline stays off until Electron is upgraded.");
    }
    const d = majorOf(driverVersion);
    if (d < exports.MIN_SQLITE_DRIVER_MAJOR) {
        return ("CometChat offline messaging needs better-sqlite3-multiple-ciphers " + exports.MIN_SQLITE_DRIVER_MAJOR +
            ".0.0 or later (found " + driverVersion + "). Offline stays off until it is upgraded.");
    }
    return null;
}
exports.peerVersionProblem = peerVersionProblem;
/** The versions actually installed in this main process (`null` where one cannot be read). */
function installedPeerVersions() {
    const proc = globalThis.process;
    const electron = (proc && proc.versions && proc.versions.electron) || null;
    let driver = null;
    try {
        driver = require("better-sqlite3-multiple-ciphers/package.json").version || null;
    }
    catch {
        driver = null;
    }
    return { electron, driver };
}
function checkPeerVersions() {
    try {
        const v = installedPeerVersions();
        return peerVersionProblem(v.electron, v.driver);
    }
    catch {
        return null;
    }
}
/** Status shape for an open that never got as far as a database. */
function failedOpen(failure, reason, cipherAvailable) {
    return {
        ok: false,
        cipherAvailable: cipherAvailable,
        atRest: "NONE",
        keyStorage: "NONE",
        cipher: null,
        leakage: null,
        failure: failure,
        failureReason: reason,
    };
}
class SqliteEngine {
    constructor() {
        this.db = null;
        this.dbFile = "";
        this.keyFile = "";
        this.encrypted = false;
        this.cipher = null;
        /**
         * R156 / BEH-SYNC-15: the monotonic conversation-write stamp (Android SqliteOfflineStore.writeSeqCounter),
         * seeded lazily from `MAX(writeSeq)` on disk so it stays above everything persisted after a restart.
         */
        this.writeSeqCounter = 0;
        this.writeSeqSeeded = false;
        /** A rebuild during the current open, reported once with its result (BEH-ENC-15/16). */
        this.pendingReset = null;
        this.MSG_COLS = "localMessageId,id,conversationId,senderUid,receiverType,receiverId,type,category," +
            "parentMessageId,quotedMessageId,sentAt,updatedAt,deletedAt,deliveredAt,readAt,sendState," +
            "failureReason,localSortTs,source,payload,tags,mentions,hasAttachments,attachmentTypes,hasReactions," +
            "pinnedAt,pinnedBy,savedAt,threadSubscribed";
        this.MSG_PLACEHOLDERS = "@localMessageId,@id,@conversationId,@senderUid,@receiverType,@receiverId,@type,@category," +
            "@parentMessageId,@quotedMessageId,@sentAt,@updatedAt,@deletedAt,@deliveredAt,@readAt,@sendState," +
            "@failureReason,@localSortTs,@source,@payload,@tags,@mentions,@hasAttachments,@attachmentTypes,@hasReactions," +
            "@pinnedAt,@pinnedBy,@savedAt,@threadSubscribed";
        this.CONV_COLS = "conversationId,conversationType,conversationWith,lastMessage,lastMessageId,unreadCount," +
            "updatedAt,localSortTs,lastAccessedTs,tags,newestCachedMessageId,oldestCachedMessageId," +
            "blockedByMe,hasBlockedMe,isAgentic,peerTags,lastReadMessageId,unreadMentionsCount,latestMessageId," +
            "pinnedAt,pinnedBy,systemPinnedAt,ownPinnedAt,serverReturned,writeSeq";
        this.CONV_PLACEHOLDERS = "@conversationId,@conversationType,@conversationWith,@lastMessage,@lastMessageId,@unreadCount," +
            "@updatedAt,@localSortTs,@lastAccessedTs,@tags,@newestCachedMessageId,@oldestCachedMessageId," +
            "@blockedByMe,@hasBlockedMe,@isAgentic,@peerTags,@lastReadMessageId,@unreadMentionsCount,@latestMessageId," +
            "@pinnedAt,@pinnedBy,@systemPinnedAt,@ownPinnedAt,@serverReturned,@writeSeq";
        // --- attachments -------------------------------------------------------
        this.ATT_COLS = "attachmentId,localMessageId,fileUrl,localPath,mimeType,name,size,width,height,isExternalUrl,lastAccessedTs,pendingProtected";
        this.ATT_PLACEHOLDERS = "@attachmentId,@localMessageId,@fileUrl,@localPath,@mimeType,@name,@size,@width,@height,@isExternalUrl,@lastAccessedTs,@pendingProtected";
    }
    seedWriteSeqOnce() {
        if (this.writeSeqSeeded || !this.db)
            return;
        try {
            const r = this.db.prepare("SELECT MAX(writeSeq) AS m FROM conversations").get();
            const m = Number(r && r.m);
            if (isFinite(m) && m > this.writeSeqCounter)
                this.writeSeqCounter = m;
        }
        catch {
            /* best-effort: serverReturned still protects every local-only row */
        }
        this.writeSeqSeeded = true;
    }
    /** The next monotonic conversation-write stamp (seeds on first use). */
    nextConvWriteSeq() {
        this.seedWriteSeqOnce();
        return ++this.writeSeqCounter;
    }
    currentConversationWriteSeq() {
        this.seedWriteSeqOnce();
        return this.writeSeqCounter;
    }
    // --- lifecycle ---------------------------------------------------------
    /** Everything the key store needs, resolved from the live main process. */
    keyDeps() {
        const fs = require("node:fs");
        const nodeCrypto = require("node:crypto");
        let safeStorage = null;
        try {
            safeStorage = require("electron").safeStorage || null;
        }
        catch (e) {
            safeStorage = null;
        }
        return {
            fs: fs,
            safeStorage: safeStorage,
            randomBytes: (n) => nodeCrypto.randomBytes(n),
            keyFile: this.keyFile,
        };
    }
    /**
     * Open (or reopen) the per-(app, user) database.
     *
     * Order is load-bearing when encrypting: `PRAGMA key` must be the FIRST statement on the connection
     * — before `journal_mode`, before the schema, before any read — and the proof that it took has to
     * come before anything is written. See `SqliteCipher.applyKeyAndProve`.
     *
     * Never throws for a storage problem: an open that cannot be completed comes back as a classified
     * failure so the renderer can apply `encryptionFailureBehavior` (BUILD/LINK) or decide to retry
     * (TRANSIENT). The one exception is an invalid `appId`/`uid` (see PathSafety), which is refused
     * with a thrown Error before any file or folder is touched.
     */
    /**
     * Is the cipher build installed and linked? Asked on a throwaway in-memory connection — no file,
     * no key store — so the status API can answer `cipherAvailable` before any store opens (BEH-ENC-14).
     */
    probeCipher() {
        if (checkPeerVersions())
            return false;
        try {
            const driver = resolveSqliteDriver(true);
            return !!SqliteCipher_1.engineVersion(driver);
        }
        catch {
            return false;
        }
    }
    open(appId, uid, options) {
        const wantEncryption = !!(options && options.encryption);
        const fs = require("node:fs");
        const { app } = require("electron");
        // Validates appId/uid and proves every path lies inside `cometchat-offline` (PathSafety). Throws
        // on an invalid identifier BEFORE anything is created.
        const paths = PathSafety_1.offlineDbPaths(app.getPath("userData"), appId, uid);
        // R65: the peers carry no version floor in package.json, so it is enforced here, before any
        // folder, file or key is created. Too old is treated like absent (BUILD/LINK): with encryption
        // off the renderer falls back as it does without the driver; with it on, the failure policy runs.
        const tooOld = checkPeerVersions();
        if (tooOld)
            return failedOpen("BUILD_LINK", tooOld, false);
        const dir = paths.dir;
        fs.mkdirSync(dir, { recursive: true });
        const file = paths.dbFile;
        // Already open for this user AT THE SAME TIER. A tier change has to reopen — the key is applied
        // per connection, so an existing handle cannot acquire or shed encryption.
        if (this.db && this.dbFile === file && this.encrypted === wantEncryption) {
            return this.openResult();
        }
        if (this.db)
            this.close();
        this.dbFile = file;
        this.keyFile = paths.keyFile;
        // Resolve the driver BEFORE touching the key store. Minting a key first would write sealed key
        // material to disk only to discover the cipher engine is missing and abandon it — leaving a
        // stray sidecar next to a database that was never encrypted.
        let driver = null;
        try {
            driver = resolveSqliteDriver(wantEncryption);
        }
        catch (e) {
            return failedOpen("BUILD_LINK", (e && e.message) || String(e), false);
        }
        // Is the cipher engine actually linked? Asked on a throwaway in-memory connection, so it can
        // never be confused with a wrong key on the real file — and asked BEFORE the key store is
        // touched, so a build that cannot encrypt never mints a key it will not use.
        if (wantEncryption) {
            const engine = SqliteCipher_1.engineVersion(driver);
            if (!engine) {
                return failedOpen("BUILD_LINK", "the installed SQLite driver has no cipher support - " +
                    "better-sqlite3-multiple-ciphers is required when offline encryption is enabled", false);
            }
        }
        else {
            // Is the driver usable at all? A native addon built for another Node ABI can still `require`
            // and only throw when a connection is made. That is a missing engine (BUILD/LINK), not a fault
            // in the store file: asked on a throwaway in-memory connection, so the renderer falls back as
            // for an absent driver instead of counting it toward a wipe of a file it never reached.
            let probe = null;
            try {
                probe = new driver(":memory:");
            }
            catch (e) {
                return failedOpen("BUILD_LINK", "the SQLite driver cannot open a connection: " + ((e && e.message) || String(e)), false);
            }
            finally {
                try {
                    if (probe)
                        probe.close();
                }
                catch {
                    /* ignore */
                }
            }
        }
        // BEH-ENC-16: the format check comes first. A file whose format does not match the setting (a
        // plaintext file under `encryption: true`, or an encrypted one under `false`) is a setting change:
        // wipe it at rest and rebuild in the configured format, announced as ENCRYPTION_CHANGED — never
        // reported as WRONG_KEY and never left dormant.
        this.pendingReset = null;
        let format = sqliteFileFormat(fs, file);
        // A file without the plaintext header is an earlier ENCRYPTED store only if its sealed key is beside
        // it: an encrypted store is never created without one (the key is minted before the file), and the
        // key goes first on every wipe. Under `encryption: false` with no key, the header was destroyed —
        // a damaged plaintext store, not a setting change: the open below fails its probe and rebuilds it
        // as CORRUPTED (BEH-ENC-11), never as ENCRYPTION_CHANGED.
        if (!wantEncryption && format === "ENCRYPTED" && !fs.existsSync(paths.keyFile))
            format = "PLAINTEXT";
        if ((wantEncryption && format === "PLAINTEXT") || (!wantEncryption && format === "ENCRYPTED")) {
            // Read what the rebuild loses: the plaintext file directly; an encrypted file with its existing
            // key (never minting one). Unreadable → the count is unknown (null), never 0.
            let oldKey = null;
            if (format === "ENCRYPTED") {
                try {
                    if (fs.existsSync(paths.keyFile))
                        oldKey = SqliteCipher_1.loadOrCreateDbKey(this.keyDeps());
                }
                catch {
                    oldKey = null;
                }
            }
            // The messages still trying to send: each fails with DISCARDED, and they are the count (BEH-ENC-16).
            // A FAILED row already had its final outcome.
            // A file another process holds locked is not read as lost: TRANSIENT, nothing deleted (BEH-ENC-11).
            let unsentRows = null;
            try {
                unsentRows = format === "PLAINTEXT" || oldKey ? readUnsentFromFile(driver, file, oldKey) : null;
            }
            catch (e) {
                return failedOpen("TRANSIENT", (e && e.message) || String(e), wantEncryption);
            }
            const lostRows = unsentRows ? unsentRows.filter((r) => r.sendState === "PENDING" || r.sendState === "SENDING") : null;
            const pendingLost = lostRows ? lostRows.length : null;
            if (!wantEncryption) {
                // The rebuilt plaintext file must not leave a key for a database that no longer exists.
                try {
                    SqliteCipher_1.destroyDbKey(this.keyDeps());
                }
                catch {
                    /* best-effort; the next encrypted open self-heals a stray key */
                }
            }
            this.removeDatabaseFiles(file);
            this.pendingReset = { reason: "ENCRYPTION_CHANGED", pendingLost, unsent: lostRows || [] };
        }
        let keyHex = null;
        // The key is LOST when the sealed sidecar is gone (deleted, or never restored with the database):
        // loadOrCreateDbKey mints a fresh one. Remember the sealed bytes to tell that from a WRONG key — a
        // sidecar that still unseals but does not open this file (BEH-ENC-15).
        // A sidecar that does not unseal is neither: it is kept and the open fails below (KeyUnsealError).
        let sealedBefore = null;
        try {
            if (wantEncryption && fs.existsSync(paths.keyFile))
                sealedBefore = fs.readFileSync(paths.keyFile).toString("base64");
        }
        catch {
            sealedBefore = null;
        }
        if (wantEncryption) {
            try {
                keyHex = SqliteCipher_1.loadOrCreateDbKey(this.keyDeps());
            }
            catch (e) {
                if (e instanceof OfflineCrypto_1.OfflineEncryptionUnavailableError) {
                    return failedOpen("BUILD_LINK", (e && e.message) || String(e), false);
                }
                // Busy / locked / disk full / a locked or unworking secret store: TRANSIENT, never counted. A
                // sealed key that does not unseal under a working store, or a vault error that cannot tell a locked
                // vault from a lost key, is UNCLASSIFIED: the renderer counts it once per launch and escalates
                // on the 3rd launch (BEH-ENC-11/12) instead of staying closed forever.
                return failedOpen(SqliteCipher_1.classifyMainOpenFailure(e), (e && e.message) || String(e), true);
            }
        }
        try {
            this.attach(file, keyHex, driver);
        }
        catch (e) {
            if (e instanceof OfflineCrypto_1.OfflineEncryptionUnavailableError) {
                // Plain better-sqlite3 in place of the cipher build. Nothing was written, and nothing may be.
                this.close();
                return failedOpen("BUILD_LINK", (e && e.message) || String(e), false);
            }
            if (e instanceof SqliteCipher_1.DatabaseUnreadableError) {
                // Wrong key, tampered or corrupt file — including a plaintext database left by an earlier
                // build now being opened WITH a key. PERMANENT (BEH-ENC-11): wipe, ROTATE the key, rebuild
                // encrypted under the fresh key. Android rotates before every PERMANENT rebuild
                // (`OfflineSQLiteManager` :476): a key that failed to open the file is not trusted to key its
                // replacement.
                this.close();
                this.removeDatabaseFiles(file);
                // A wipe that loses the outbox is announced (BEH-ENC-15); the rows were inside the file that
                // could not be read, so the count is unknown.
                if (!this.pendingReset) {
                    let keyLost = false;
                    try {
                        keyLost = sealedBefore == null || fs.readFileSync(paths.keyFile).toString("base64") !== sealedBefore;
                    }
                    catch {
                        keyLost = false;
                    }
                    this.pendingReset = { reason: !keyHex ? "CORRUPTED" : keyLost ? "KEY_LOST" : "WRONG_KEY", pendingLost: null };
                }
                if (keyHex) {
                    try {
                        SqliteCipher_1.destroyDbKey(this.keyDeps());
                        keyHex = SqliteCipher_1.loadOrCreateDbKey(this.keyDeps());
                    }
                    catch (rotateErr) {
                        // A failed rotation opens NO store this session, under either encryptionFailureBehavior,
                        // and is never BUILD/LINK or plaintext; the next launch retries (BEH-ENC-11).
                        this.pendingReset = null;
                        return failedOpen("TRANSIENT", "offline key rotation failed: " + ((rotateErr && rotateErr.message) || String(rotateErr)), true);
                    }
                }
                try {
                    this.attach(file, keyHex, driver);
                }
                catch (again) {
                    // One rebuild attempt, never a loop.
                    this.close();
                    const cls = again instanceof OfflineCrypto_1.OfflineEncryptionUnavailableError ? "BUILD_LINK" : "PERMANENT";
                    return failedOpen(cls, (again && again.message) || String(again), cls !== "BUILD_LINK");
                }
            }
            else {
                this.close();
                return failedOpen(SqliteCipher_1.classifyMainOpenFailure(e), (e && e.message) || String(e), true);
            }
        }
        this.encrypted = wantEncryption;
        return this.openResult();
    }
    /**
     * Bring up a connection: key it, prove it, then configure and migrate.
     *
     * `journal_mode` and the schema deliberately come AFTER the proof — writing WAL frames or DDL to a
     * file we have not yet shown we can read is how a half-written, unreadable database gets made.
     */
    attach(file, keyHex, Database) {
        this.db = new Database(file);
        this.cipher = null;
        if (keyHex) {
            // PRAGMA cipher + PRAGMA hexkey as the FIRST statements, then a probe read that forces a page
            // access. Nothing below this line may run until the key is proven.
            SqliteCipher_1.applyKeyAndProve(this.db, keyHex);
            this.cipher = SqliteCipher_1.ELECTRON_CIPHER;
        }
        else {
            SqliteCipher_1.probeReadable(this.db); // same cheap proof: a corrupt plaintext file self-heals too
        }
        this.db.pragma("journal_mode = WAL");
        // Keep temp b-trees and sorter spill in memory: on an encrypted database a temp file on disk
        // would hold plaintext pages the cipher never sees.
        this.db.pragma("temp_store = MEMORY");
        this.db.exec(SCHEMA);
        this.addMissingColumns();
        // R156: a fresh connection re-seeds the write-seq counter from this database's MAX(writeSeq).
        this.writeSeqSeeded = false;
        this.writeSeqCounter = 0;
    }
    /**
     * Bring an already-created database up to the current column set. Idempotent: each column is added
     * only when `PRAGMA table_info` says it is absent, so this is a no-op on a freshly created file and
     * on every subsequent open.
     */
    addMissingColumns() {
        for (const c of ADDED_COLUMNS) {
            try {
                const cols = this.db.prepare(`PRAGMA table_info(${c.table})`).all();
                if (cols.some((col) => col && col.name === c.column))
                    continue;
                this.db.exec(`ALTER TABLE ${c.table} ADD COLUMN ${c.column} ${c.ddl}`);
            }
            catch {
                /* a concurrent open may have added it first — the next statement would fail loudly anyway */
            }
        }
    }
    /** The tiers this connection actually achieved. */
    openResult() {
        const res = {
            ok: true,
            cipherAvailable: this.encrypted,
            atRest: this.encrypted ? "SQLCIPHER" : "NONE",
            keyStorage: this.encrypted ? "KEYSTORE" : "NONE",
            cipher: this.cipher,
            leakage: null,
        };
        if (this.pendingReset) {
            res.reset = this.pendingReset;
            this.pendingReset = null;
        }
        return res;
    }
    close() {
        try {
            if (this.db)
                this.db.close();
        }
        catch {
            /* ignore */
        }
        this.db = null;
        this.cipher = null;
    }
    /**
     * Delete an `(app, user)` database WITHOUT opening it — the server kill switch and the logout wipe
     * when no store is open. Opening would mint a new key, so this never opens, and it never creates a
     * directory or a file.
     *
     * Order: the sealed key sidecar FIRST (always, whatever tier the store was last opened at), then
     * the database and its WAL files. A crash in between leaves an unreadable file, never a readable
     * one. A failed key delete is logged and the database is still removed. Idempotent.
     */
    wipeByName(appId, uid) {
        const { app } = require("electron");
        // Throws on an invalid appId/uid or an escaping path — nothing outside `cometchat-offline` is
        // ever deleted (PathSafety).
        const paths = PathSafety_1.offlineDbPaths(app.getPath("userData"), appId, uid);
        const file = paths.dbFile;
        const keyFile = paths.keyFile;
        if (this.db && this.dbFile === file) {
            this.close();
            this.dbFile = "";
            this.keyFile = "";
            this.encrypted = false;
        }
        try {
            SqliteCipher_1.destroyDbKey({ ...this.keyDeps(), keyFile: keyFile });
        }
        catch (e) {
            // A database without its key is unreadable; carry on and remove it.
        }
        this.removeDatabaseFiles(file);
    }
    /** Remove the database and its WAL sidecars. Does NOT touch the key. */
    removeDatabaseFiles(file) {
        try {
            const fs = require("node:fs");
            for (const suffix of ["", "-wal", "-shm"]) {
                try {
                    fs.rmSync(file + suffix, { force: true });
                }
                catch {
                    /* ignore */
                }
            }
        }
        catch {
            /* ignore */
        }
    }
    wipe() {
        const file = this.dbFile;
        const encrypted = this.encrypted;
        const deps = file && encrypted ? this.keyDeps() : null;
        this.close();
        if (!file)
            return;
        // Ordering: the KEY goes first, then the data. A crash in between leaves an
        // unreadable file — which the ordinary self-heal wipes — never a readable one.
        if (deps)
            SqliteCipher_1.destroyDbKey(deps);
        this.removeDatabaseFiles(file);
        this.dbFile = "";
        this.keyFile = "";
        this.encrypted = false;
    }
    // --- row (de)serialisation --------------------------------------------
    toDbMessage(row) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
        return {
            localMessageId: row.localMessageId,
            id: row.id != null ? String(row.id) : null,
            conversationId: row.conversationId,
            senderUid: (_a = row.senderUid) !== null && _a !== void 0 ? _a : null,
            receiverType: (_b = row.receiverType) !== null && _b !== void 0 ? _b : null,
            receiverId: (_c = row.receiverId) !== null && _c !== void 0 ? _c : null,
            type: (_d = row.type) !== null && _d !== void 0 ? _d : null,
            category: (_e = row.category) !== null && _e !== void 0 ? _e : null,
            parentMessageId: (_f = row.parentMessageId) !== null && _f !== void 0 ? _f : null,
            quotedMessageId: (_g = row.quotedMessageId) !== null && _g !== void 0 ? _g : null,
            sentAt: (_h = row.sentAt) !== null && _h !== void 0 ? _h : null,
            updatedAt: (_j = row.updatedAt) !== null && _j !== void 0 ? _j : null,
            deletedAt: (_k = row.deletedAt) !== null && _k !== void 0 ? _k : null,
            deliveredAt: (_l = row.deliveredAt) !== null && _l !== void 0 ? _l : null,
            readAt: (_m = row.readAt) !== null && _m !== void 0 ? _m : null,
            sendState: row.sendState,
            failureReason: (_o = row.failureReason) !== null && _o !== void 0 ? _o : null,
            localSortTs: row.localSortTs,
            source: (_p = row.source) !== null && _p !== void 0 ? _p : null,
            payload: JSON.stringify((_q = row.payload) !== null && _q !== void 0 ? _q : null),
            tags: JSON.stringify(Projections_1.extractTags(row.payload)),
            mentions: JSON.stringify(Projections_1.extractMentions(row.payload)),
            // Rebuilt from the payload on every write, exactly like tags/mentions above — so a row can
            // never carry a projection that disagrees with its own payload.
            hasAttachments: Projections_1.extractHasAttachments(row.payload) ? 1 : 0,
            attachmentTypes: JSON.stringify(Projections_1.extractAttachmentTypes(row.payload)),
            hasReactions: Projections_1.extractHasReactions(row.payload) ? 1 : 0,
            pinnedAt: encFlagNum(row.pinnedAt),
            pinnedBy: encFlagStr(row.pinnedBy),
            savedAt: encFlagNum(row.savedAt),
            threadSubscribed: encFlagBool(row.threadSubscribed),
        };
    }
    fromDbMessage(d) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        return {
            localMessageId: d.localMessageId,
            id: (d.id != null ? d.id : undefined),
            conversationId: d.conversationId,
            senderUid: d.senderUid,
            receiverType: d.receiverType,
            receiverId: d.receiverId,
            type: d.type,
            category: d.category,
            parentMessageId: (_a = d.parentMessageId) !== null && _a !== void 0 ? _a : undefined,
            quotedMessageId: (_b = d.quotedMessageId) !== null && _b !== void 0 ? _b : undefined,
            sentAt: (_c = d.sentAt) !== null && _c !== void 0 ? _c : undefined,
            updatedAt: (_d = d.updatedAt) !== null && _d !== void 0 ? _d : undefined,
            deletedAt: (_e = d.deletedAt) !== null && _e !== void 0 ? _e : undefined,
            deliveredAt: (_f = d.deliveredAt) !== null && _f !== void 0 ? _f : undefined,
            readAt: (_g = d.readAt) !== null && _g !== void 0 ? _g : undefined,
            sendState: d.sendState,
            failureReason: (_h = d.failureReason) !== null && _h !== void 0 ? _h : undefined,
            localSortTs: d.localSortTs,
            source: (_j = d.source) !== null && _j !== void 0 ? _j : undefined,
            payload: JSON.parse(d.payload),
            tags: JSON.parse(d.tags || "[]"),
            mentions: JSON.parse(d.mentions || "[]"),
            hasAttachments: !!d.hasAttachments,
            attachmentTypes: JSON.parse(d.attachmentTypes || "[]"),
            hasReactions: !!d.hasReactions,
            pinnedAt: decFlagNum(d.pinnedAt),
            pinnedBy: decFlagStr(d.pinnedBy),
            savedAt: decFlagNum(d.savedAt),
            threadSubscribed: decFlagBool(d.threadSubscribed),
        };
    }
    /** Insert/replace a message + rebuild its message_tags projection in the SAME transaction. */
    putMessage(dbRow) {
        this.db
            .prepare(`INSERT OR REPLACE INTO messages (${this.MSG_COLS}) VALUES (${this.MSG_PLACEHOLDERS})`)
            .run(dbRow);
        this.db.prepare("DELETE FROM message_tags WHERE localMessageId = ?").run(dbRow.localMessageId);
        const tags = JSON.parse(dbRow.tags || "[]");
        if (tags.length) {
            const ins = this.db.prepare("INSERT OR IGNORE INTO message_tags (localMessageId, tag) VALUES (?, ?)");
            for (const t of tags)
                ins.run(dbRow.localMessageId, String(t));
        }
    }
    getByLocalId(localMessageId) {
        return this.db.prepare("SELECT * FROM messages WHERE localMessageId = ?").get(localMessageId);
    }
    getByServerId(id) {
        return this.db.prepare("SELECT * FROM messages WHERE id = ?").get(String(id));
    }
    // --- messages ----------------------------------------------------------
    upsertMessages(rows) {
        const results = [];
        const tx = this.db.transaction((rs) => {
            var _a;
            for (const rowIn of rs) {
                let row0 = rowIn;
                let existing = this.getByLocalId(row0.localMessageId);
                const match = existing ? StoreShared_1.matchByLocalId(this.fromDbMessage(existing), row0) : null;
                if (match === "OUTBOX") {
                    // Never written over a message still in the outbox. The server's copy (OUTBOX_ROW) goes to
                    // the outbox, which settles it (BEH-SEND-01).
                    results.push("OUTBOX_ROW");
                    continue;
                }
                if (match === "FOREIGN") {
                    // Another message's key: stored under its own (its server id's), never over that message.
                    const key = StoreShared_1.foreignRowKey(row0);
                    if (!key) {
                        results.push("SKIPPED_STALE");
                        continue;
                    }
                    row0 = { ...row0, localMessageId: key };
                    existing = this.getByLocalId(key);
                }
                if (!existing && row0.id != null)
                    existing = this.getByServerId(row0.id);
                // BEH-READ-41: keep the stored tags unless this write's request applied withTags.
                const row = StoreShared_1.keepStoredMessageTags(row0, existing ? this.fromDbMessage(existing) : null);
                const incoming = this.toDbMessage(row);
                // LWW (SYNC-18/19): null on either side ⇒ overwrite (never coerce to 0); tie overwrites;
                // skip only when both stamps are present and the incoming is strictly older.
                if (existing &&
                    incoming.updatedAt != null &&
                    existing.updatedAt != null &&
                    incoming.updatedAt < existing.updatedAt) {
                    results.push("SKIPPED_STALE"); // LWW: strictly-older loses
                    continue;
                }
                if (existing) {
                    incoming.localMessageId = existing.localMessageId; // keep the stable handle
                    // Carry forward every flag this write does not own (BEH-FLAG-02).
                    for (const k of MESSAGE_FLAG_COLUMNS) {
                        if (row[k] === undefined)
                            incoming[k] = (_a = existing[k]) !== null && _a !== void 0 ? _a : null;
                    }
                }
                if (incoming.deletedAt) {
                    // BEH-FLAG-03: a deleted row never keeps a pin or a save.
                    incoming.pinnedAt = 0;
                    incoming.pinnedBy = "";
                    incoming.savedAt = 0;
                }
                this.putMessage(incoming);
                results.push("OK");
            }
        });
        tx(rows);
        return results;
    }
    listMessages(q) {
        if (!q.pendingLast)
            return this.listMessagesKeyset(q);
        // BEH-READ-10 / BEH-READ-31: the sent rows by the keyset, the queued rows after them.
        const plan = StoreShared_1.pendingLastPlan(q, this.queuedMatching(q), DEFAULT_PAGE);
        return plan.assemble(plan.sentQuery ? this.listMessagesKeyset(plan.sentQuery) : []);
    }
    /** The queued rows (PENDING / SENDING / FAILED) a read matches, oldest compose time first. */
    queuedMatching(q) {
        if (q.sentOnly)
            return [];
        const sql = "SELECT * FROM messages WHERE sendState != 'SENT'" +
            (q.conversationId ? " AND conversationId = ?" : "") +
            " ORDER BY localSortTs ASC, localMessageId ASC";
        const params = q.conversationId ? [q.conversationId] : [];
        const out = [];
        for (const d of this.db.prepare(sql).all(...params)) {
            const r = this.fromDbMessage(d);
            if ((q.conversationId || Projections_1.inScope(r, q)) && Projections_1.matchesMessage(r, q))
                out.push(r);
        }
        return out;
    }
    listMessagesKeyset(q) {
        var _a;
        const limit = (_a = q.limit) !== null && _a !== void 0 ? _a : DEFAULT_PAGE;
        // Independent "load newer" (append) read — ascending, rows STRICTLY newer than the
        // after-cursor. Additive: triggered only by q.afterSortTs, so the "load older" / initial path
        // below is unchanged.
        if (q.afterSortTs != null) {
            const after = q.afterSortTs;
            const afterId = q.afterSortId;
            // Keyset boundary on (localSortTs, numeric id) — D-51: match the display sort's numeric-id
            // tiebreak (not the localMessageId string). Pending rows (no id) sort newest via MAX sentinel.
            const aboveBoundary = (r) => r.localSortTs > after || (r.localSortTs === after && (afterId == null || idNum(r) > afterId));
            const aParams = [];
            const aWhere = [];
            if (q.conversationId) {
                aWhere.push("conversationId = ?");
                aParams.push(q.conversationId);
            }
            aWhere.push("localSortTs >= ?");
            aParams.push(after);
            const aSql = "SELECT * FROM messages WHERE " + aWhere.join(" AND ") +
                // CAST(id AS INTEGER): the id column is TEXT, so order it numerically (D-51), not lexically.
                " ORDER BY localSortTs ASC, COALESCE(CAST(id AS INTEGER), " + ID_SORT_MAX + ") ASC, localMessageId ASC";
            const aOut = [];
            for (const d of this.db.prepare(aSql).iterate(...aParams)) {
                const r = this.fromDbMessage(d);
                const ok = q.conversationId
                    ? aboveBoundary(r) && Projections_1.matchesMessage(r, q)
                    : aboveBoundary(r) && Projections_1.inScope(r, q) && Projections_1.matchesMessage(r, q);
                if (ok) {
                    aOut.push(r);
                    if (aOut.length >= limit)
                        break;
                }
            }
            return aOut;
        }
        const before = q.beforeSortTs;
        const beforeId = q.beforeSortId;
        const belowBoundary = (r) => before == null ||
            r.localSortTs < before ||
            (r.localSortTs === before && (beforeId == null || idNum(r) < beforeId));
        const params = [];
        let sql = "SELECT * FROM messages";
        const where = [];
        if (q.conversationId) {
            where.push("conversationId = ?");
            params.push(q.conversationId);
        }
        if (before != null) {
            where.push("localSortTs <= ?");
            params.push(before);
        }
        if (where.length)
            sql += " WHERE " + where.join(" AND ");
        // (localSortTs, numeric id) partition — D-51: same-second rows page in numeric-id order, so a
        // cluster split across a page seam stays id-ordered (parity with the IndexedDB backend).
        // CAST(id AS INTEGER): the id column is TEXT, so order it numerically, not lexically.
        sql += " ORDER BY localSortTs DESC, COALESCE(CAST(id AS INTEGER), " + ID_SORT_MAX + ") DESC, localMessageId DESC";
        const out = [];
        for (const d of this.db.prepare(sql).iterate(...params)) {
            const r = this.fromDbMessage(d);
            const ok = q.conversationId
                ? belowBoundary(r) && Projections_1.matchesMessage(r, q)
                : belowBoundary(r) && Projections_1.inScope(r, q) && Projections_1.matchesMessage(r, q);
            if (ok) {
                out.push(r);
                if (out.length >= limit)
                    break;
            }
        }
        return out;
    }
    pending(conversationId) {
        // Secondary key matches the browser's deterministic tie-break (stable-sort → localMessageId
        // asc), so the two backends drain the outbox FIFO in identical order on equal localSortTs.
        // `IN (…)` over the three unsent states, not `!= 'SENT'`: SQLite can serve it from
        // idx_messages_sendstate instead of scanning every cached message (every start, every drain pass).
        const rows = conversationId
            ? this.db
                .prepare("SELECT * FROM messages WHERE sendState IN ('PENDING','SENDING','FAILED') AND conversationId = ? ORDER BY localSortTs ASC, localMessageId ASC")
                .all(conversationId)
            : this.db
                .prepare("SELECT * FROM messages WHERE sendState IN ('PENDING','SENDING','FAILED') ORDER BY localSortTs ASC, localMessageId ASC")
                .all();
        return rows.map((d) => this.fromDbMessage(d));
    }
    reconcileOnAck(localMessageId, serverRow) {
        const tx = this.db.transaction(() => {
            var _a, _b;
            let existing = this.getByLocalId(localMessageId);
            if (!existing && serverRow.id != null)
                existing = this.getByServerId(serverRow.id);
            const existingRow = existing ? this.fromDbMessage(existing) : undefined;
            const merged = {
                ...(existingRow !== null && existingRow !== void 0 ? existingRow : {}),
                ...StoreShared_1.keepStoredMessageTags(serverRow, existingRow),
                localMessageId,
                sendState: "SENT",
                localSortTs: (_a = serverRow.localSortTs) !== null && _a !== void 0 ? _a : (serverRow.sentAt ? serverRow.sentAt * 1000 : (_b = existingRow === null || existingRow === void 0 ? void 0 : existingRow.localSortTs) !== null && _b !== void 0 ? _b : Date.now()),
            };
            FlagAuthority_1.clearFlagsIfDeleted(merged);
            this.putMessage(this.toDbMessage(merged));
        });
        tx();
    }
    /** Atomic check-and-set of an outbox row's send state (BEH-SEND-03). One UPDATE, so it cannot interleave. */
    transitionSendState(localMessageId, from, to, failureReason) {
        if (!from || !from.length)
            return false;
        const marks = from.map(() => "?").join(",");
        const res = this.db
            .prepare(`UPDATE messages SET sendState = ?, failureReason = ? WHERE localMessageId = ? AND sendState IN (${marks})`)
            .run(to, to === "FAILED" ? failureReason !== null && failureReason !== void 0 ? failureReason : null : null, localMessageId, ...from);
        return !!res && res.changes > 0;
    }
    setSendState(localMessageId, state, failureReason) {
        this.db
            .prepare("UPDATE messages SET sendState = ?, failureReason = ? WHERE localMessageId = ?")
            .run(state, state === "FAILED" ? failureReason !== null && failureReason !== void 0 ? failureReason : null : null, localMessageId);
    }
    replaceIfPresent(row) {
        const tx = this.db.transaction(() => {
            let existing = row.localMessageId ? this.getByLocalId(row.localMessageId) : undefined;
            const byLocalId = !!existing;
            if (!existing && row.id != null)
                existing = this.getByServerId(row.id);
            if (!existing)
                return false;
            // An edit / delete / moderation / details write-back of a message still in the outbox: never
            // written over it. The server's copy goes to the outbox (the renderer hands it on, BEH-SEND-01).
            if (byLocalId) {
                const match = StoreShared_1.matchByLocalId(this.fromDbMessage(existing), row);
                if (match === "OUTBOX")
                    return "OUTBOX_ROW";
                if (match === "FOREIGN") {
                    // Another message's key: replace only this message's own row, by its server id.
                    existing = row.id != null ? this.getByServerId(row.id) : undefined;
                    if (!existing)
                        return false;
                }
            }
            if (row.updatedAt != null && existing.updatedAt != null && row.updatedAt < existing.updatedAt) {
                return false; // LWW: older loses
            }
            const stored = this.fromDbMessage(existing);
            const merged = {
                ...stored,
                ...StoreShared_1.keepStoredMessageTags(row, stored),
                localMessageId: existing.localMessageId,
                localSortTs: existing.localSortTs,
            };
            // The spread keeps every flag `row` doesn't carry (BEH-FLAG-02).
            FlagAuthority_1.clearFlagsIfDeleted(merged);
            this.putMessage(this.toDbMessage(merged));
            return true;
        });
        return tx();
    }
    mergeReaction(messageId, emoji, reactorUid, added, selfUid) {
        const tx = this.db.transaction(() => {
            const existing = this.getByServerId(messageId);
            if (!existing)
                return false;
            const payload = JSON.parse(existing.payload || "{}") || {};
            const data = payload.data || (payload.data = {});
            const list = Array.isArray(data.reactions) ? data.reactions.slice() : [];
            const i = list.findIndex((r) => r && r.reaction === emoji);
            const mine = !!(reactorUid && reactorUid === selfUid);
            if (added) {
                if (i >= 0) {
                    list[i] = { ...list[i], count: (list[i].count || 0) + 1, ...(mine ? { reactedByMe: true } : {}) };
                }
                else {
                    list.push({ reaction: emoji, count: 1, reactedByMe: mine });
                }
            }
            else if (i >= 0) {
                const c = (list[i].count || 0) - 1;
                if (c <= 0)
                    list.splice(i, 1);
                else
                    list[i] = { ...list[i], count: c, ...(mine ? { reactedByMe: false } : {}) };
            }
            data.reactions = list;
            // updatedAt preserved — the reaction event carries no server time. `hasReactions` moves with
            // the payload in the SAME statement: the column is what the `hasReactions` filter reads, so
            // leaving it behind would make a just-reacted message invisible to that filter.
            this.db
                .prepare("UPDATE messages SET payload = ?, hasReactions = ? WHERE localMessageId = ?")
                .run(JSON.stringify({ ...payload, data }), list.length > 0 ? 1 : 0, existing.localMessageId);
            return true;
        });
        return tx();
    }
    bumpReplyCountIfPresent(parentMessageId) {
        const tx = this.db.transaction(() => {
            const existing = this.getByServerId(parentMessageId);
            if (!existing)
                return false; // cache-only: never fabricate the parent
            const payload = JSON.parse(existing.payload || "{}") || {};
            const next = (Number(payload.replyCount) || 0) + 1;
            // Leaf write: bump replyCount only; updatedAt/localSortTs preserved so a later parent refresh
            // still wins by LWW.
            this.db
                .prepare("UPDATE messages SET payload = ? WHERE localMessageId = ?")
                .run(JSON.stringify({ ...payload, replyCount: next }), existing.localMessageId);
            return true;
        });
        return tx();
    }
    decrementReplyCountIfPresent(parentMessageId) {
        const tx = this.db.transaction(() => {
            const existing = this.getByServerId(parentMessageId);
            if (!existing)
                return false; // cache-only: never fabricate the parent
            const payload = JSON.parse(existing.payload || "{}") || {};
            // Leaf write: −1 clamped >= 0; updatedAt/localSortTs preserved.
            const next = Math.max(0, (Number(payload.replyCount) || 0) - 1);
            this.db
                .prepare("UPDATE messages SET payload = ? WHERE localMessageId = ?")
                .run(JSON.stringify({ ...payload, replyCount: next }), existing.localMessageId);
            return true;
        });
        return tx();
    }
    purgeConversation(conversationId) {
        const tx = this.db.transaction(() => {
            const doomed = this.db
                .prepare("SELECT localMessageId FROM messages WHERE conversationId = ? AND sendState = 'SENT'")
                .all(conversationId);
            const delTags = this.db.prepare("DELETE FROM message_tags WHERE localMessageId = ?");
            for (const r of doomed)
                delTags.run(r.localMessageId);
            this.db.prepare("DELETE FROM messages WHERE conversationId = ? AND sendState = 'SENT'").run(conversationId);
            this.db.prepare("DELETE FROM conversations WHERE conversationId = ?").run(conversationId);
        });
        tx();
    }
    /**
     * Full-footprint purge: ALL messages (SENT + pending/sending/failed, matched by the
     * row's conversationId OR the canonical id derived from a provisional outbox row) + their tags +
     * attachment rows + the conversation row, in one tx. Returns the media byte keys to reclaim and the
     * distinct outbox keys of the deleted pending rows.
     */
    purgeConversationFootprint(conversationId) {
        const mediaKeys = [];
        const outboxSet = {};
        const outboxRows = [];
        const tx = this.db.transaction(() => {
            const rows = this.db
                .prepare("SELECT localMessageId, conversationId, receiverType, receiverId, senderUid, sendState FROM messages")
                .all();
            const victims = rows.filter((r) => sqliteRowConversationIds(r).indexOf(conversationId) !== -1);
            const getAtt = this.db.prepare("SELECT localPath FROM attachments WHERE localMessageId = ?");
            const delAtt = this.db.prepare("DELETE FROM attachments WHERE localMessageId = ?");
            const delTags = this.db.prepare("DELETE FROM message_tags WHERE localMessageId = ?");
            const delMsg = this.db.prepare("DELETE FROM messages WHERE localMessageId = ?");
            const getMsg = this.db.prepare("SELECT * FROM messages WHERE localMessageId = ?");
            for (const v of victims) {
                if (v.sendState !== "SENT") {
                    outboxSet[v.conversationId] = true;
                    const full = getMsg.get(v.localMessageId);
                    if (full)
                        outboxRows.push(this.fromDbMessage(full));
                }
                for (const a of getAtt.all(v.localMessageId))
                    if (a.localPath)
                        mediaKeys.push(a.localPath);
                delAtt.run(v.localMessageId);
                delTags.run(v.localMessageId);
                delMsg.run(v.localMessageId);
            }
            this.db.prepare("DELETE FROM conversations WHERE conversationId = ?").run(conversationId);
            // Its list-store entries go with it: its pinned store, and its saved and my-threads rows.
            this.deleteListRowsByConversationTx(conversationId, ["PINNED", "SAVED", "THREADS"]);
        });
        tx();
        return { mediaKeys, outboxKeys: Object.keys(outboxSet), outboxRows };
    }
    /** Read-time delete-by-omission — SENT rows strictly interior to the page's bounds and absent from
     *  it, whole-footprint (message + tags + attachment rows). Interior/SENT-only; replies-exempt in
     *  top-level-only mode. See `OfflineStore.purgeAbsentInInterior`. */
    purgeAbsentInInterior(conversationId, presentServerIds, minLocalSortTs, maxLocalSortTs, topLevelOnly) {
        const present = {};
        for (const id of presentServerIds)
            present[String(id)] = true;
        const mediaKeys = [];
        const tx = this.db.transaction(() => {
            const rows = this.db
                .prepare("SELECT localMessageId, id, localSortTs, sendState, parentMessageId FROM messages WHERE conversationId = ?")
                .all(conversationId);
            const getAtt = this.db.prepare("SELECT localPath FROM attachments WHERE localMessageId = ?");
            const delAtt = this.db.prepare("DELETE FROM attachments WHERE localMessageId = ?");
            const delTags = this.db.prepare("DELETE FROM message_tags WHERE localMessageId = ?");
            const delMsg = this.db.prepare("DELETE FROM messages WHERE localMessageId = ?");
            for (const r of rows) {
                const interior = r.localSortTs > minLocalSortTs && r.localSortTs < maxLocalSortTs;
                const absent = r.id != null && present[String(r.id)] !== true;
                const topOk = !topLevelOnly || r.parentMessageId == null;
                if (r.sendState === "SENT" && interior && absent && topOk) {
                    for (const a of getAtt.all(r.localMessageId))
                        if (a.localPath)
                            mediaKeys.push(a.localPath);
                    delAtt.run(r.localMessageId);
                    delTags.run(r.localMessageId);
                    delMsg.run(r.localMessageId);
                }
            }
        });
        tx();
        return { mediaKeys };
    }
    advanceReceipts(conversationId, selfUid, uptoMessageId, deliveredAt, readAt) {
        if (!conversationId || !selfUid || uptoMessageId == null)
            return false;
        const tx = this.db.transaction(() => {
            var _a, _b;
            const rows = this.db
                .prepare("SELECT * FROM messages WHERE conversationId = ? AND senderUid = ? AND id IS NOT NULL")
                .all(conversationId, selfUid);
            const upd = this.db.prepare("UPDATE messages SET deliveredAt = ?, readAt = ?, payload = ? WHERE localMessageId = ?");
            let touched = false;
            for (const d of rows) {
                if (Number(d.id) > uptoMessageId)
                    continue; // cumulative up to the receipt's id
                const payload = JSON.parse(d.payload || "{}") || {};
                let delivered = (_a = d.deliveredAt) !== null && _a !== void 0 ? _a : 0;
                let read = (_b = d.readAt) !== null && _b !== void 0 ? _b : 0;
                let changed = false;
                const nextDelivered = Math.max(deliveredAt !== null && deliveredAt !== void 0 ? deliveredAt : 0, readAt !== null && readAt !== void 0 ? readAt : 0);
                if (nextDelivered > delivered) {
                    delivered = nextDelivered;
                    payload.deliveredAt = nextDelivered;
                    changed = true;
                }
                if (readAt != null && readAt > read) {
                    read = readAt;
                    payload.readAt = readAt;
                    changed = true;
                }
                if (changed) {
                    upd.run(delivered, read || null, JSON.stringify(payload), d.localMessageId); // updatedAt untouched
                    touched = true;
                }
            }
            return touched;
        });
        return tx();
    }
    existingMessageIds(ids) {
        if (!ids || !ids.length)
            return [];
        const present = new Set();
        const stmt = this.db.prepare("SELECT 1 AS present FROM messages WHERE id = ?");
        for (const id of ids) {
            if (id == null)
                continue;
            if (stmt.get(String(id)))
                present.add(String(id));
        }
        return ids.filter((id) => present.has(String(id)));
    }
    deleteMessages(localMessageIds) {
        const tx = this.db.transaction(() => {
            const delMsg = this.db.prepare("DELETE FROM messages WHERE localMessageId = ?");
            const delTags = this.db.prepare("DELETE FROM message_tags WHERE localMessageId = ?");
            for (const id of localMessageIds) {
                delMsg.run(id);
                delTags.run(id);
            }
        });
        tx();
    }
    /** R160 (BEH-SEND-36): durably remove ONE unsent outbox message (PENDING/FAILED). See OfflineStore. */
    discardOutboxMessage(localMessageId) {
        const mediaKeys = [];
        let removed = false;
        let conversationRemoved = false;
        let sendState;
        const tx = this.db.transaction(() => {
            const row = this.db.prepare("SELECT * FROM messages WHERE localMessageId = ?").get(localMessageId);
            if (!row)
                return; // unknown id (or already SENT and reconciled out of the outbox) → caller: NOT_FOUND
            sendState = row.sendState;
            // Only an unsent row is discardable; SENDING is in flight, SENT is already delivered.
            if (sendState !== "PENDING" && sendState !== "FAILED")
                return;
            const cid = row.conversationId;
            const serverId = row.id; // TEXT, null while pending
            // The message's media bytes to reclaim (its copied-outgoing / attachment files).
            for (const a of this.db.prepare("SELECT localPath FROM attachments WHERE localMessageId = ?").all(localMessageId)) {
                if (a.localPath)
                    mediaKeys.push(a.localPath);
            }
            this.db.prepare("DELETE FROM attachments WHERE localMessageId = ?").run(localMessageId);
            this.db.prepare("DELETE FROM message_tags WHERE localMessageId = ?").run(localMessageId);
            this.db.prepare("DELETE FROM messages WHERE localMessageId = ?").run(localMessageId);
            removed = true;
            // The parent's reply-count "increase that queueing added" is, in JS, derived from the live unsent
            // reply rows (BEH-MUT-10) — never persisted at queue time (the parent's cached replyCount is only
            // bumped on ACK). Deleting this unsent reply row above is exactly what removes that increase; no
            // separate decrement is needed or correct here.
            const conv = this.db.prepare("SELECT * FROM conversations WHERE conversationId = ?").get(cid);
            if (!conv)
                return;
            const remaining = this.db
                .prepare("SELECT * FROM messages WHERE conversationId = ? ORDER BY localSortTs DESC, " +
                "COALESCE(CAST(id AS INTEGER), " + ID_SORT_MAX + ") DESC, localMessageId DESC")
                .all(cid);
            // Was the removed message the conversation's preview? Match by server id (sent rows) or, for an
            // unsent preview (no lastMessageId), by the payload's localMessageId.
            let lm = null;
            try {
                lm = conv.lastMessage ? JSON.parse(conv.lastMessage) : null;
            }
            catch {
                lm = null;
            }
            const lmLmid = lm && (lm.localMessageId || (lm.data && lm.data.localMessageId));
            const wasPreview = (conv.lastMessageId != null && serverId != null && String(conv.lastMessageId) === String(serverId)) ||
                (!!lmLmid && lmLmid === localMessageId);
            if (remaining.length === 0) {
                // Local-only (R156): synthesized by a local send, never returned by the server (`updatedAt`
                // unset). With nothing left, the conversation disappears with its last local message.
                if (conv.updatedAt == null) {
                    this.db.prepare("DELETE FROM conversations WHERE conversationId = ?").run(cid);
                    this.deleteListRowsByConversationTx(cid, ["PINNED", "SAVED", "THREADS"]);
                    conversationRemoved = true;
                }
                else if (wasPreview) {
                    // Server-known conversation with no cached messages left: just empty the preview slot.
                    this.db.prepare("UPDATE conversations SET lastMessage = NULL, lastMessageId = NULL WHERE conversationId = ?").run(cid);
                }
            }
            else if (wasPreview) {
                const newest = remaining[0];
                this.db
                    .prepare("UPDATE conversations SET lastMessage = ?, lastMessageId = ? WHERE conversationId = ?")
                    .run(newest.payload, newest.id != null ? Number(newest.id) : null, cid);
            }
        });
        tx();
        return { removed, sendState, mediaKeys, conversationRemoved };
    }
    // --- conversations -----------------------------------------------------
    toDbConversation(row) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return {
            conversationId: row.conversationId,
            conversationType: (_a = row.conversationType) !== null && _a !== void 0 ? _a : null,
            conversationWith: JSON.stringify((_b = row.conversationWith) !== null && _b !== void 0 ? _b : null),
            lastMessage: row.lastMessage != null ? JSON.stringify(row.lastMessage) : null,
            lastMessageId: (_c = row.lastMessageId) !== null && _c !== void 0 ? _c : null,
            unreadCount: (_d = row.unreadCount) !== null && _d !== void 0 ? _d : 0,
            updatedAt: (_e = row.updatedAt) !== null && _e !== void 0 ? _e : null,
            localSortTs: row.localSortTs,
            lastAccessedTs: row.lastAccessedTs,
            tags: JSON.stringify((_f = row.tags) !== null && _f !== void 0 ? _f : []),
            newestCachedMessageId: (_g = row.newestCachedMessageId) !== null && _g !== void 0 ? _g : null,
            oldestCachedMessageId: (_h = row.oldestCachedMessageId) !== null && _h !== void 0 ? _h : null,
            // `?? null` and NOT `?? 0`: null means "unknown", which is what field protection depends on.
            // The merge that produced `row` already carried any existing value forward, so a null here
            // genuinely means nobody has ever told us the blocked state for this conversation.
            blockedByMe: row.blockedByMe == null ? null : row.blockedByMe ? 1 : 0,
            hasBlockedMe: row.hasBlockedMe == null ? null : row.hasBlockedMe ? 1 : 0,
            isAgentic: row.isAgentic == null ? null : row.isAgentic ? 1 : 0,
            peerTags: JSON.stringify((_j = row.peerTags) !== null && _j !== void 0 ? _j : []),
            lastReadMessageId: (_k = row.lastReadMessageId) !== null && _k !== void 0 ? _k : null,
            unreadMentionsCount: (_l = row.unreadMentionsCount) !== null && _l !== void 0 ? _l : null,
            latestMessageId: (_m = row.latestMessageId) !== null && _m !== void 0 ? _m : null,
            pinnedAt: encFlagNum(row.pinnedAt),
            pinnedBy: encFlagStr(row.pinnedBy),
            systemPinnedAt: encFlagNum(row.systemPinnedAt),
            ownPinnedAt: encFlagNum(row.ownPinnedAt),
            // R156: `?? null` not `?? 0` — null means "never server-returned" (field protection: the sticky
            // marker is OR-ed by the plaintext merge, never clobbered by a write that did not learn it).
            serverReturned: row.serverReturned == null ? null : row.serverReturned ? 1 : 0,
            writeSeq: (_o = row.writeSeq) !== null && _o !== void 0 ? _o : null,
        };
    }
    fromDbConversation(d) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return {
            conversationId: d.conversationId,
            conversationType: d.conversationType,
            conversationWith: d.conversationWith ? JSON.parse(d.conversationWith) : null,
            lastMessage: d.lastMessage ? JSON.parse(d.lastMessage) : undefined,
            lastMessageId: (_a = d.lastMessageId) !== null && _a !== void 0 ? _a : undefined,
            unreadCount: (_b = d.unreadCount) !== null && _b !== void 0 ? _b : 0,
            updatedAt: (_c = d.updatedAt) !== null && _c !== void 0 ? _c : undefined,
            localSortTs: d.localSortTs,
            lastAccessedTs: d.lastAccessedTs,
            tags: JSON.parse(d.tags || "[]"),
            newestCachedMessageId: (_d = d.newestCachedMessageId) !== null && _d !== void 0 ? _d : undefined,
            oldestCachedMessageId: (_e = d.oldestCachedMessageId) !== null && _e !== void 0 ? _e : undefined,
            // A NULL column decodes to `undefined`, never `false` — "we were never told" must stay
            // distinguishable from "we were told: not blocked", or the first plain read would look like an
            // authoritative unblock.
            blockedByMe: d.blockedByMe == null ? undefined : !!d.blockedByMe,
            hasBlockedMe: d.hasBlockedMe == null ? undefined : !!d.hasBlockedMe,
            isAgentic: d.isAgentic == null ? undefined : !!d.isAgentic,
            peerTags: JSON.parse(d.peerTags || "[]"),
            lastReadMessageId: (_f = d.lastReadMessageId) !== null && _f !== void 0 ? _f : undefined,
            unreadMentionsCount: (_g = d.unreadMentionsCount) !== null && _g !== void 0 ? _g : undefined,
            latestMessageId: (_h = d.latestMessageId) !== null && _h !== void 0 ? _h : undefined,
            pinnedAt: decFlagNum(d.pinnedAt),
            pinnedBy: decFlagStr(d.pinnedBy),
            systemPinnedAt: decFlagNum(d.systemPinnedAt),
            ownPinnedAt: decFlagNum(d.ownPinnedAt),
            // R156: a NULL marker decodes to `undefined` ("never told"), never `false`, so a plain write that
            // omits it cannot look like an authoritative "this was never server-returned".
            serverReturned: d.serverReturned == null ? undefined : !!d.serverReturned,
            writeSeq: d.writeSeq == null ? undefined : Number(d.writeSeq),
        };
    }
    upsertConversations(rows) {
        const results = [];
        const tx = this.db.transaction((rs) => {
            const put = this.db.prepare(`INSERT OR REPLACE INTO conversations (${this.CONV_COLS}) VALUES (${this.CONV_PLACEHOLDERS})`);
            const get = this.db.prepare("SELECT * FROM conversations WHERE conversationId = ?");
            for (const row of rs) {
                const existing = get.get(row.conversationId);
                // LWW (SYNC-18/19): null on either side ⇒ overwrite; skip only when both present and strictly older.
                if (existing &&
                    row.updatedAt != null &&
                    existing.updatedAt != null &&
                    row.updatedAt < existing.updatedAt) {
                    results.push("SKIPPED_STALE");
                    continue;
                }
                // Merge onto the existing row so columns the incoming row OMITS (the per-conversation
                // window watermarks newest/oldestCachedMessageId, tags) are preserved rather than nulled
                // on every sweep — matching the browser's field-level `{...existing, ...row}` upsert.
                const prevRow = existing ? this.fromDbConversation(existing) : null;
                const merged = prevRow ? { ...prevRow, ...row } : row;
                if (prevRow)
                    StoreShared_1.keepStoredPeerTags(merged, prevRow, row);
                if (prevRow)
                    StoreShared_1.keepAdvanceOnly(merged, prevRow, row);
                StoreShared_1.resolvePins(merged, prevRow, row);
                // Recency is device-local + monotonic-forward — a server upsert must not lower it. Keep the max.
                if (existing) {
                    merged.lastAccessedTs = Math.max(this.fromDbConversation(existing).lastAccessedTs || 0, row.lastAccessedTs || 0);
                }
                // R156: every conversation-row write advances the monotonic write stamp (serverReturned rides
                // in `merged` from the plaintext `{...prevRow, ...row}` merge, so it stays sticky).
                merged.writeSeq = this.nextConvWriteSeq();
                put.run(this.toDbConversation(merged));
                results.push("OK");
            }
        });
        tx(rows);
        return results;
    }
    touchConversationRecency(conversationId, ts) {
        const row = this.db
            .prepare("SELECT lastAccessedTs FROM conversations WHERE conversationId = ?")
            .get(conversationId);
        if (!row)
            return; // cache-only: never fabricate a conversation
        const next = Math.max(row.lastAccessedTs || 0, ts || 0);
        if (next !== row.lastAccessedTs) {
            // R156: an own-send / realtime-receive recency bump advances the write stamp (spared by-omission
            // when it lands in a fetch's request window).
            this.db
                .prepare("UPDATE conversations SET lastAccessedTs = ?, writeSeq = ? WHERE conversationId = ?")
                .run(next, this.nextConvWriteSeq(), conversationId);
        }
    }
    incrementUnreadIfPresent(conversationId, largeGroupThreshold) {
        const row = this.db
            .prepare("SELECT unreadCount, conversationType, conversationWith FROM conversations WHERE conversationId = ?")
            .get(conversationId);
        if (!row)
            return; // cache-only: never fabricate a conversation
        // Skip a known-large group (membersCount >= threshold). Unknown/zero membership counts anyway.
        if (row.conversationType === "group" && OfflineConstants_1.isLargeGroup(row.conversationWith, largeGroupThreshold))
            return;
        // Leaf write: +1 unread only; `updatedAt` untouched (it is the server LWW cursor, never written locally).
        // R156: a realtime-receive unread bump advances the write stamp.
        this.db
            .prepare("UPDATE conversations SET unreadCount = ?, writeSeq = ? WHERE conversationId = ?")
            .run((row.unreadCount || 0) + 1, this.nextConvWriteSeq(), conversationId);
    }
    clearUnreadIfPresent(conversationId, advanceReadMarkerTo) {
        var _a;
        const row = this.db
            .prepare("SELECT unreadCount, lastMessageId, lastReadMessageId FROM conversations WHERE conversationId = ?")
            .get(conversationId);
        if (!row)
            return; // cache-only: never fabricate a conversation
        const marker = StoreShared_1.nextReadMarker(row, advanceReadMarkerTo);
        // Preserves the previous early-out exactly for callers that pass no marker.
        if ((row.unreadCount || 0) === 0 && marker === ((_a = row.lastReadMessageId) !== null && _a !== void 0 ? _a : undefined))
            return;
        // Leaf write: unread -> 0 (+ a monotonically advanced read marker); `updatedAt` untouched.
        this.db
            .prepare("UPDATE conversations SET unreadCount = 0, lastReadMessageId = ? WHERE conversationId = ?")
            .run(marker !== null && marker !== void 0 ? marker : null, conversationId);
    }
    mergeConversationTagsIfPresent(conversationId, tags, updatedAt) {
        // BEH-MUT-03: tags-only, never inserts, and NEVER writes updatedAt or the sort position — the
        // server does not bump updatedAt on tag, so the own write must not either. `updatedAt` is unused.
        void updatedAt;
        const res = this.db
            .prepare("UPDATE conversations SET tags = ? WHERE conversationId = ?")
            .run(JSON.stringify(tags || []), conversationId);
        return !!res && res.changes > 0;
    }
    /** BEH-CONV-09: the preview only, iff `messageId` is still the conversation's last message. */
    replaceConversationPreviewIfLast(conversationId, messageId, payload) {
        if (!conversationId || messageId == null || payload == null)
            return false;
        const res = this.db
            .prepare("UPDATE conversations SET lastMessage = ? WHERE conversationId = ? AND lastMessageId = ?")
            .run(JSON.stringify(payload), conversationId, Number(messageId));
        return !!res && res.changes > 0;
    }
    mergeConversationLastMessageIfPresent(conversationId, lastMessage, lastMessageId, sortTs, createIfAbsent) {
        var _a, _b, _c, _d;
        const existing = this.db
            .prepare("SELECT localSortTs, updatedAt, lastAccessedTs FROM conversations WHERE conversationId = ?")
            .get(conversationId);
        // Create-if-absent: synthesize a brand-new chat's row when it isn't cached and an identity was
        // supplied. `updatedAt` left NULL (server LWW fills it); unread starts at 0.
        if (!existing) {
            if (!createIfAbsent)
                return false; // strict never-insert
            // R156: `serverReturned` is deliberately NOT in this INSERT (defaults to NULL → "never
            // server-returned"), so delete-by-omission never purges a first-send-to-a-new-peer row. `writeSeq`
            // is stamped so the new row outranks a fetch dispatched before it.
            this.db
                .prepare("INSERT OR IGNORE INTO conversations (conversationId, conversationType, conversationWith, lastMessage, lastMessageId, unreadCount, updatedAt, localSortTs, lastAccessedTs, tags, newestCachedMessageId, oldestCachedMessageId, writeSeq) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)")
                .run(conversationId, createIfAbsent.conversationType, createIfAbsent.conversationWith != null ? JSON.stringify(createIfAbsent.conversationWith) : null, lastMessage != null ? JSON.stringify(lastMessage) : null, lastMessageId !== null && lastMessageId !== void 0 ? lastMessageId : null, 0, null, sortTs, sortTs * 1000, // lastAccessedTs: device-local ms (BEH-EVICT-08); sortTs is seconds
            JSON.stringify([]), null, null, this.nextConvWriteSeq());
            return true;
        }
        // LWW by the sort stamp — a strictly-older send loses (a newer received/synced state must not be clobbered).
        if (sortTs > 0 && sortTs < ((_a = existing.localSortTs) !== null && _a !== void 0 ? _a : 0))
            return false;
        // Field-merge: override last message + forward-bump the device-local sort/recency stamps only.
        // Never write `updatedAt` on a local preview/reorder — it is the server LWW cursor; preserving it
        // lets the next getConversations always win.
        const nextUpdatedAt = (_b = existing.updatedAt) !== null && _b !== void 0 ? _b : null;
        const nextSortTs = Math.max((_c = existing.localSortTs) !== null && _c !== void 0 ? _c : 0, sortTs);
        const nextAccessed = Math.max((_d = existing.lastAccessedTs) !== null && _d !== void 0 ? _d : 0, sortTs * 1000);
        // R156: a local bump of an existing row advances the write stamp (serverReturned untouched).
        this.db
            .prepare("UPDATE conversations SET lastMessage = ?, lastMessageId = ?, updatedAt = ?, localSortTs = ?, lastAccessedTs = ?, writeSeq = ? WHERE conversationId = ?")
            .run(lastMessage != null ? JSON.stringify(lastMessage) : null, lastMessageId !== null && lastMessageId !== void 0 ? lastMessageId : null, nextUpdatedAt, nextSortTs, nextAccessed, this.nextConvWriteSeq(), conversationId);
        return true;
    }
    listConversations(q) {
        var _a;
        // BEH-CONV-17: a default read excludes the peers the blocked-users store marks blockedByMe.
        if (!q.includeBlockedUsers && q.blockedByMeUids === undefined) {
            q = { ...q, blockedByMeUids: ConversationFilters_1.blockedByMeUidsOf(this.listBlockedUsers()) };
        }
        const limit = (_a = q.limit) !== null && _a !== void 0 ? _a : DEFAULT_PAGE;
        const out = [];
        // Keyset "load older" cursor on the compound (localSortTs, conversationId) — the same order this
        // query already sorts by. Without it every page re-served the newest `limit` rows, so paging past
        // page 1 offline yielded nothing new. Mirrors the IndexedDB backend.
        const before = q.beforeSortTs;
        const beforeId = q.beforeConversationId;
        const belowBoundary = (r) => before == null ||
            r.localSortTs < before ||
            (r.localSortTs === before && (beforeId == null || r.conversationId < beforeId));
        for (const d of this.db
            .prepare("SELECT * FROM conversations ORDER BY localSortTs DESC, conversationId DESC")
            .iterate()) {
            const r = this.fromDbConversation(d);
            // Same shared predicate the browser backend runs (setTags, peer userTags/groupTags, agentic,
            // blocked) — one definition, so the two backends cannot disagree about what a filter means.
            if (belowBoundary(r) && ConversationFilters_1.matchesConversation(r, q)) {
                out.push(r);
                if (out.length >= limit)
                    break;
            }
        }
        return out;
    }
    deleteConversations(ids) {
        const tx = this.db.transaction(() => {
            const del = this.db.prepare("DELETE FROM conversations WHERE conversationId = ?");
            for (const id of ids)
                del.run(id);
        });
        tx();
    }
    // --- sync meta ---------------------------------------------------------
    metaGet(key) {
        const row = this.db.prepare("SELECT value FROM sync_meta WHERE key = ?").get(key);
        return row ? Number(row.value) || 0 : 0;
    }
    metaSet(key, value) {
        this.db.prepare("INSERT OR REPLACE INTO sync_meta (key, value) VALUES (?, ?)").run(key, String(value));
    }
    readWatermark() {
        return this.metaGet(OfflineConstants_1.SYNC_META_KEYS.watermark);
    }
    /** One `sync_meta` value as a string, or `null` when absent. */
    readMeta(key) {
        const row = this.db.prepare("SELECT value FROM sync_meta WHERE key = ?").get(key);
        return row && row.value != null ? String(row.value) : null;
    }
    /** Write several `sync_meta` values in one transaction; a `null` value deletes the key. */
    writeMeta(entries) {
        const keys = Object.keys(entries || {});
        if (!keys.length)
            return;
        const put = this.db.prepare("INSERT OR REPLACE INTO sync_meta (key, value) VALUES (?, ?)");
        const del = this.db.prepare("DELETE FROM sync_meta WHERE key = ?");
        const tx = this.db.transaction(() => {
            for (const k of keys) {
                const v = entries[k];
                if (v == null)
                    del.run(k);
                else
                    put.run(k, String(v));
            }
        });
        tx();
    }
    /**
     * Empty the store IN PLACE (`clearOfflineCache`, BEH-AUTH-14). The file, its key and the
     * encryption-mode / schema markers stay; every cached row, the outbox, the cursors and the blocked
     * set go, in one transaction. Returns the unsent rows the transaction actually deleted.
     */
    clearInPlace() {
        const tables = [
            "messages", "message_tags", "conversations", "attachments", "upload_batches", "upload_files",
            "blocked_users", "entity_snapshots", "list_rows", "list_meta",
        ];
        const existing = this.db
            .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
            .all()
            .map((r) => r.name);
        let removed = [];
        const tx = this.db.transaction(() => {
            removed = this.db.prepare("SELECT * FROM messages WHERE sendState != 'SENT'").all().map((d) => this.fromDbMessage(d));
            for (const t of tables)
                if (existing.indexOf(t) !== -1)
                    this.db.prepare(`DELETE FROM ${t}`).run();
            this.db
                .prepare("DELETE FROM sync_meta WHERE key NOT IN (?, ?)")
                .run(OfflineConstants_1.SYNC_META_KEYS.encryptionMode, OfflineConstants_1.SYNC_META_KEYS.schemaVersion);
        });
        tx();
        return removed;
    }
    advanceWatermark(ts) {
        if (ts <= this.readWatermark())
            return; // monotonic, never rewind
        this.metaSet(OfflineConstants_1.SYNC_META_KEYS.watermark, ts);
    }
    readLastSyncTimestamp() {
        return this.metaGet(OfflineConstants_1.SYNC_META_KEYS.lastSyncTimestamp);
    }
    setLastSyncTimestamp(ts) {
        this.metaSet(OfflineConstants_1.SYNC_META_KEYS.lastSyncTimestamp, ts);
    }
    upsertAttachment(row) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        this.db.prepare(`INSERT OR REPLACE INTO attachments (${this.ATT_COLS}) VALUES (${this.ATT_PLACEHOLDERS})`).run({
            attachmentId: row.attachmentId,
            localMessageId: (_a = row.localMessageId) !== null && _a !== void 0 ? _a : null,
            fileUrl: (_b = row.fileUrl) !== null && _b !== void 0 ? _b : null,
            localPath: (_c = row.localPath) !== null && _c !== void 0 ? _c : null,
            mimeType: (_d = row.mimeType) !== null && _d !== void 0 ? _d : null,
            name: (_e = row.name) !== null && _e !== void 0 ? _e : null,
            size: (_f = row.size) !== null && _f !== void 0 ? _f : null,
            width: (_g = row.width) !== null && _g !== void 0 ? _g : null,
            height: (_h = row.height) !== null && _h !== void 0 ? _h : null,
            isExternalUrl: row.isExternalUrl ? 1 : 0,
            lastAccessedTs: (_j = row.lastAccessedTs) !== null && _j !== void 0 ? _j : null,
            pendingProtected: row.pendingProtected ? 1 : 0,
        });
    }
    getAttachment(attachmentId) {
        const d = this.db.prepare("SELECT * FROM attachments WHERE attachmentId = ?").get(attachmentId);
        return d ? this.fromDbAttachment(d) : null;
    }
    listAttachments() {
        return this.db.prepare("SELECT * FROM attachments").all().map((d) => this.fromDbAttachment(d));
    }
    setAttachmentAccessed(attachmentId, ts) {
        this.db.prepare("UPDATE attachments SET lastAccessedTs = ? WHERE attachmentId = ?").run(ts, attachmentId);
    }
    deleteAttachment(attachmentId) {
        this.db.prepare("DELETE FROM attachments WHERE attachmentId = ?").run(attachmentId);
    }
    fromDbAttachment(d) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return {
            attachmentId: d.attachmentId,
            localMessageId: d.localMessageId,
            fileUrl: (_a = d.fileUrl) !== null && _a !== void 0 ? _a : undefined,
            localPath: (_b = d.localPath) !== null && _b !== void 0 ? _b : undefined,
            mimeType: (_c = d.mimeType) !== null && _c !== void 0 ? _c : undefined,
            name: (_d = d.name) !== null && _d !== void 0 ? _d : undefined,
            size: (_e = d.size) !== null && _e !== void 0 ? _e : undefined,
            width: (_f = d.width) !== null && _f !== void 0 ? _f : undefined,
            height: (_g = d.height) !== null && _g !== void 0 ? _g : undefined,
            isExternalUrl: d.isExternalUrl ? true : undefined,
            lastAccessedTs: (_h = d.lastAccessedTs) !== null && _h !== void 0 ? _h : undefined,
            pendingProtected: d.pendingProtected ? true : undefined,
        };
    }
    // --- upload batches (offline direct-to-storage uploads, OU-2/OU-4/OU-13a) ----------------
    upsertUploadBatch(row) {
        var _a;
        // Map undefined optionals → null for binding (parentMessageId absent on a main-conversation batch).
        this.db
            .prepare("INSERT OR REPLACE INTO upload_batches (batchKey, batchId, receiverType, receiverId, parentMessageId, concurrency, updatedAt) VALUES (?,?,?,?,?,?,?)")
            .run(row.batchKey, row.batchId, row.receiverType, row.receiverId, (_a = row.parentMessageId) !== null && _a !== void 0 ? _a : null, row.concurrency, row.updatedAt);
    }
    getUploadBatch(batchKey) {
        var _a;
        const d = this.db.prepare("SELECT * FROM upload_batches WHERE batchKey = ?").get(batchKey);
        if (!d)
            return null;
        return {
            batchKey: d.batchKey,
            batchId: d.batchId,
            receiverType: d.receiverType,
            receiverId: d.receiverId,
            parentMessageId: (_a = d.parentMessageId) !== null && _a !== void 0 ? _a : undefined,
            concurrency: d.concurrency,
            updatedAt: d.updatedAt,
        };
    }
    /** Cascade: delete the batch's file rows then the batch row, in one tx. */
    deleteUploadBatch(batchKey) {
        const tx = this.db.transaction(() => {
            this.db.prepare("DELETE FROM upload_files WHERE batchKey = ?").run(batchKey);
            this.db.prepare("DELETE FROM upload_batches WHERE batchKey = ?").run(batchKey);
        });
        tx();
    }
    upsertUploadFile(row) {
        var _a, _b, _c, _d, _e;
        // Map undefined optionals → null for binding; read maps them back to undefined in fromDbUploadFile.
        this.db
            .prepare("INSERT OR REPLACE INTO upload_files (batchKey, fileId, orderIndex, name, size, mimeType, state, localKey, mediaRef, attachmentJson, failureCode, failureMessage, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)")
            .run(row.batchKey, row.fileId, row.orderIndex, row.name, row.size, row.mimeType, row.state, (_a = row.localKey) !== null && _a !== void 0 ? _a : null, (_b = row.mediaRef) !== null && _b !== void 0 ? _b : null, (_c = row.attachmentJson) !== null && _c !== void 0 ? _c : null, (_d = row.failureCode) !== null && _d !== void 0 ? _d : null, (_e = row.failureMessage) !== null && _e !== void 0 ? _e : null, row.updatedAt);
    }
    listUploadFiles(batchKey) {
        return this.db
            .prepare("SELECT * FROM upload_files WHERE batchKey = ? ORDER BY orderIndex ASC")
            .all(batchKey)
            .map((d) => this.fromDbUploadFile(d));
    }
    listAllUploadFiles() {
        return this.db.prepare("SELECT * FROM upload_files").all().map((d) => this.fromDbUploadFile(d));
    }
    deleteUploadFile(batchKey, fileId) {
        this.db.prepare("DELETE FROM upload_files WHERE batchKey = ? AND fileId = ?").run(batchKey, fileId);
    }
    fromDbUploadFile(d) {
        var _a, _b, _c, _d, _e;
        return {
            batchKey: d.batchKey,
            fileId: d.fileId,
            orderIndex: d.orderIndex,
            name: d.name,
            size: d.size,
            mimeType: d.mimeType,
            state: d.state,
            localKey: (_a = d.localKey) !== null && _a !== void 0 ? _a : undefined,
            mediaRef: (_b = d.mediaRef) !== null && _b !== void 0 ? _b : undefined,
            attachmentJson: (_c = d.attachmentJson) !== null && _c !== void 0 ? _c : undefined,
            failureCode: (_d = d.failureCode) !== null && _d !== void 0 ? _d : undefined,
            failureMessage: (_e = d.failureMessage) !== null && _e !== void 0 ? _e : undefined,
            updatedAt: d.updatedAt,
        };
    }
    // --- Offline Read Coverage: single reads + blocked flags ----------------
    getConversationById(conversationId) {
        const d = this.db
            .prepare("SELECT * FROM conversations WHERE conversationId = ?")
            .get(conversationId);
        return d ? this.fromDbConversation(d) : null;
    }
    getMessageById(messageId) {
        const d = this.getByServerId(messageId);
        return d ? this.fromDbMessage(d) : null;
    }
    setConversationsBlockedByMe(uids, blocked, selfUid) {
        if (!uids || !uids.length || !selfUid)
            return [];
        const touched = [];
        const tx = this.db.transaction(() => {
            const get = this.db.prepare("SELECT blockedByMe FROM conversations WHERE conversationId = ?");
            const upd = this.db.prepare("UPDATE conversations SET blockedByMe = ? WHERE conversationId = ?");
            for (const uid of uids) {
                const cid = ConversationKey_1.canonicalUserConversationId(selfUid, uid);
                const row = get.get(cid);
                if (!row)
                    continue; // cache-only: a conversation never cached here stays absent (§4.4)
                const current = row.blockedByMe == null ? undefined : !!row.blockedByMe;
                if (current === blocked)
                    continue;
                // KEEP AND FLAG (§4.4): never delete the row on block. `updatedAt` is untouched — this is a
                // local relationship change, not a server mutation of the conversation's last message.
                upd.run(blocked ? 1 : 0, cid);
                touched.push(cid);
            }
        });
        tx();
        return touched;
    }
    // --- blocked users (canonical, §4.4) ------------------------------------
    replaceBlockedUsers(rows, fetchedAt) {
        const tx = this.db.transaction(() => {
            var _a;
            // The fetch stamp lands in the same transaction as the rows (BEH-CONV-15).
            if (fetchedAt != null) {
                this.db
                    .prepare("INSERT OR REPLACE INTO sync_meta (key, value) VALUES (?, ?)")
                    .run(OfflineConstants_1.SYNC_META_KEYS.blockedUsersFetchedAt, String(fetchedAt));
            }
            // Clear + refill atomically: the periodic reconcile is authoritative, so a uid it no longer
            // lists must not survive, and the store is never observed half-written.
            this.db.prepare("DELETE FROM blocked_users").run();
            const put = this.db.prepare("INSERT OR REPLACE INTO blocked_users (uid, blockedByMe, hasBlockedMe, user, updatedAt) " +
                "VALUES (?, ?, ?, ?, ?)");
            for (const r of rows) {
                put.run(r.uid, r.blockedByMe ? 1 : 0, r.hasBlockedMe ? 1 : 0, JSON.stringify((_a = r.user) !== null && _a !== void 0 ? _a : null), r.updatedAt || 0);
            }
        });
        tx();
    }
    upsertBlockedUsers(rows) {
        const tx = this.db.transaction(() => {
            var _a;
            const put = this.db.prepare("INSERT OR REPLACE INTO blocked_users (uid, blockedByMe, hasBlockedMe, user, updatedAt) " +
                "VALUES (?, ?, ?, ?, ?)");
            const del = this.db.prepare("DELETE FROM blocked_users WHERE uid = ?");
            for (const r of rows) {
                // Neither direction set ⇒ no relationship left; drop the row instead of keeping a tombstone
                // the offline list would have to filter out on every read.
                if (!r.blockedByMe && !r.hasBlockedMe)
                    del.run(r.uid);
                else
                    put.run(r.uid, r.blockedByMe ? 1 : 0, r.hasBlockedMe ? 1 : 0, JSON.stringify((_a = r.user) !== null && _a !== void 0 ? _a : null), r.updatedAt || 0);
            }
        });
        tx();
    }
    listBlockedUsers() {
        const rows = this.db.prepare("SELECT * FROM blocked_users").all();
        return rows.map((d) => ({
            uid: d.uid,
            blockedByMe: !!d.blockedByMe,
            hasBlockedMe: !!d.hasBlockedMe,
            user: d.user ? JSON.parse(d.user) : null,
            updatedAt: d.updatedAt || 0,
        }));
    }
    // --- entity snapshots (§6) ----------------------------------------------
    putSnapshotPage(row) {
        // BEH-SNAP-02: a last page drops every later page of the signature in the same transaction
        // (Android SnapshotDao.deletePagesAfter).
        this.db.transaction(() => {
            this.putSnapshotPageRow(row);
            if (!row.hasNext) {
                this.db
                    .prepare("DELETE FROM entity_snapshots WHERE signature = ? AND pageIndex > ?")
                    .run(row.signature, row.pageIndex);
            }
        })();
    }
    putSnapshotPageRow(row) {
        this.db
            .prepare("INSERT OR REPLACE INTO entity_snapshots " +
            "(signature, pageIndex, readType, scope, response, hasNext, recordedAt, lastAccessedTs) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
            .run(row.signature, row.pageIndex, row.readType, row.scope || "", row.response, row.hasNext ? 1 : 0, row.recordedAt || 0, row.lastAccessedTs || 0);
    }
    getSnapshotPage(signature, pageIndex) {
        const d = this.db
            .prepare("SELECT * FROM entity_snapshots WHERE signature = ? AND pageIndex = ?")
            .get(signature, pageIndex);
        if (!d)
            return null;
        return {
            signature: d.signature,
            pageIndex: d.pageIndex,
            readType: d.readType,
            scope: d.scope || "",
            response: d.response,
            hasNext: !!d.hasNext,
            recordedAt: d.recordedAt || 0,
            lastAccessedTs: d.lastAccessedTs || 0,
        };
    }
    deleteSnapshotsByScope(readType, scope) {
        this.db
            .prepare("DELETE FROM entity_snapshots WHERE readType = ? AND scope = ?")
            .run(readType, scope || "");
    }
    deleteSnapshotsBySignature(signature) {
        this.db.prepare("DELETE FROM entity_snapshots WHERE signature = ?").run(signature);
    }
    listSnapshotMeta() {
        const rows = this.db
            .prepare("SELECT signature, recordedAt, lastAccessedTs, response FROM entity_snapshots")
            .all();
        return StoreShared_1.rollupSnapshotMeta(rows);
    }
    touchSnapshot(signature, ts) {
        // Monotonic: `MAX` in SQL, so an out-of-order touch can never lower the LRU stamp.
        this.db
            .prepare("UPDATE entity_snapshots SET lastAccessedTs = MAX(lastAccessedTs, ?) WHERE signature = ?")
            .run(ts, signature);
    }
    // --- misc --------------------------------------------------------------
    logicalByteSize() {
        // `maxStorageSize` (BEH-EVICT-09): UTF-8 bytes of cached (SENT) message payloads, snapshot pages and
        // stored lists; the outbox is excluded (Android `MessageDao` :636 `WHERE sendState = SENT`).
        // `CAST(… AS BLOB)` makes LENGTH count bytes — on TEXT it counts characters, which under-counts
        // non-ASCII text up to 3x. SQLCipher encrypts pages, so the column is plaintext here.
        const row = this.db
            .prepare("SELECT COALESCE(SUM(LENGTH(CAST(payload AS BLOB))), 0) AS bytes FROM messages WHERE sendState = 'SENT'")
            .get();
        const snap = this.db
            .prepare("SELECT COALESCE(SUM(LENGTH(CAST(response AS BLOB))), 0) AS bytes FROM entity_snapshots")
            .get();
        const listed = this.db
            .prepare("SELECT COALESCE(SUM(LENGTH(CAST(payload AS BLOB))), 0) AS bytes FROM list_rows")
            .get();
        return ((row ? Number(row.bytes) || 0 : 0) +
            (snap ? Number(snap.bytes) || 0 : 0) +
            (listed ? Number(listed.bytes) || 0 : 0));
    }
    // --- pin / save / follow flags ------------------------------------------------------------------
    applyMessageFlags(updates) {
        const done = [];
        if (!updates || !updates.length)
            return done;
        const tx = this.db.transaction(() => {
            for (const u of updates) {
                const existing = this.getByServerId(u.id);
                if (!existing || existing.deletedAt)
                    continue; // update-if-cached; never flag a deleted message
                const sets = [];
                const args = [];
                if (u.pinnedAt !== undefined) {
                    sets.push("pinnedAt = ?");
                    args.push(encFlagNum(u.pinnedAt));
                    if (u.pinnedAt === null && u.pinnedBy === undefined) {
                        sets.push("pinnedBy = ?"); // an unpin has no pinner
                        args.push(encFlagStr(null));
                    }
                }
                if (u.pinnedBy !== undefined) {
                    sets.push("pinnedBy = ?");
                    args.push(encFlagStr(u.pinnedBy));
                }
                if (u.savedAt !== undefined) {
                    sets.push("savedAt = ?");
                    args.push(encFlagNum(u.savedAt));
                }
                if (u.threadSubscribed !== undefined) {
                    sets.push("threadSubscribed = ?");
                    args.push(encFlagBool(u.threadSubscribed));
                }
                if (!sets.length)
                    continue;
                args.push(existing.localMessageId);
                this.db.prepare(`UPDATE messages SET ${sets.join(", ")} WHERE localMessageId = ?`).run(...args);
                done.push(u.id);
            }
        });
        tx();
        return done;
    }
    setThreadSubscribed(rootId, value) {
        if (rootId == null)
            return;
        this.db
            .prepare("UPDATE messages SET threadSubscribed = ? WHERE id = ? OR parentMessageId = ?")
            .run(value ? 1 : 0, String(rootId), Number(rootId));
    }
    clearPerUserFlags(conversationId) {
        this.db
            .prepare("UPDATE messages SET savedAt = 0, threadSubscribed = 0 WHERE conversationId = ?")
            .run(conversationId);
    }
    // --- list stores -------------------------------------------------------------------------------
    fromDbListRow(d) {
        return {
            kind: d.kind,
            scopeKey: d.scopeKey,
            itemId: d.itemId,
            conversationId: d.conversationId,
            serverK1: d.serverK1 == null ? null : Number(d.serverK1),
            serverK2: d.serverK2 == null ? null : Number(d.serverK2),
            sortK1: Number(d.sortK1),
            updatedAt: d.updatedAt == null ? undefined : Number(d.updatedAt),
            localRev: Number(d.localRev) || 0,
            payload: JSON.parse(d.payload),
        };
    }
    fromDbListMeta(d) {
        return {
            kind: d.kind,
            scopeKey: d.scopeKey,
            floorK1: d.floorK1 == null ? null : Number(d.floorK1),
            floorK2: d.floorK2 == null ? null : Number(d.floorK2),
            complete: !!d.complete,
            rev: Number(d.rev) || 0,
        };
    }
    getListScope(kind, scopeKey) {
        const rows = this.db.prepare("SELECT * FROM list_rows WHERE kind = ? AND scopeKey = ?").all(kind, scopeKey);
        const meta = this.db.prepare("SELECT * FROM list_meta WHERE kind = ? AND scopeKey = ?").get(kind, scopeKey);
        return { rows: rows.map((d) => this.fromDbListRow(d)), meta: meta ? this.fromDbListMeta(meta) : null };
    }
    applyListOps(kind, scopeKey, ops, expectRev) {
        const tx = this.db.transaction(() => {
            var _a, _b, _c, _d, _e, _f;
            const current = this.db.prepare("SELECT rev FROM list_meta WHERE kind = ? AND scopeKey = ?").get(kind, scopeKey);
            if ((current ? Number(current.rev) || 0 : 0) !== expectRev)
                return false; // changed since read
            if (ops.meta === null) {
                this.db.prepare("DELETE FROM list_rows WHERE kind = ? AND scopeKey = ?").run(kind, scopeKey);
                this.db.prepare("DELETE FROM list_meta WHERE kind = ? AND scopeKey = ?").run(kind, scopeKey);
                return true;
            }
            const del = this.db.prepare("DELETE FROM list_rows WHERE kind = ? AND scopeKey = ? AND itemId = ?");
            for (const id of ops.delete)
                del.run(kind, scopeKey, String(id));
            const put = this.db.prepare("INSERT OR REPLACE INTO list_rows (kind, scopeKey, itemId, conversationId, serverK1, serverK2, sortK1, updatedAt, localRev, payload) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            for (const r of ops.put) {
                put.run(kind, scopeKey, String(r.itemId), r.conversationId, (_a = r.serverK1) !== null && _a !== void 0 ? _a : null, (_b = r.serverK2) !== null && _b !== void 0 ? _b : null, r.sortK1, (_c = r.updatedAt) !== null && _c !== void 0 ? _c : null, r.localRev || 0, JSON.stringify((_d = r.payload) !== null && _d !== void 0 ? _d : null));
            }
            this.db
                .prepare("INSERT OR REPLACE INTO list_meta (kind, scopeKey, floorK1, floorK2, complete, rev) VALUES (?, ?, ?, ?, ?, ?)")
                .run(kind, scopeKey, (_e = ops.meta.floorK1) !== null && _e !== void 0 ? _e : null, (_f = ops.meta.floorK2) !== null && _f !== void 0 ? _f : null, ops.meta.complete ? 1 : 0, ops.meta.rev || 0);
            return true;
        });
        return tx();
    }
    /** Bump the `rev` of the stores a removal touched, so an in-flight page sees the local change. */
    bumpListRevs(touched) {
        const bump = this.db.prepare("UPDATE list_meta SET rev = rev + 1 WHERE kind = ? AND scopeKey = ?");
        const seen = {};
        for (const t of touched) {
            const k = t.kind + "|" + t.scopeKey;
            if (seen[k])
                continue;
            seen[k] = true;
            bump.run(t.kind, t.scopeKey);
        }
    }
    deleteListItems(kinds, itemIds) {
        if (!itemIds || !itemIds.length || !kinds || !kinds.length)
            return;
        const tx = this.db.transaction(() => {
            const find = this.db.prepare("SELECT kind, scopeKey FROM list_rows WHERE itemId = ?");
            const del = this.db.prepare("DELETE FROM list_rows WHERE kind = ? AND scopeKey = ? AND itemId = ?");
            const touched = [];
            for (const id of itemIds) {
                for (const r of find.all(String(id))) {
                    if (kinds.indexOf(r.kind) === -1)
                        continue;
                    del.run(r.kind, r.scopeKey, String(id));
                    touched.push(r);
                }
            }
            this.bumpListRevs(touched);
        });
        tx();
    }
    deleteListRowsByConversationTx(conversationId, kinds) {
        const rows = this.db.prepare("SELECT kind, scopeKey, itemId FROM list_rows WHERE conversationId = ?").all(conversationId);
        const del = this.db.prepare("DELETE FROM list_rows WHERE kind = ? AND scopeKey = ? AND itemId = ?");
        const touched = [];
        for (const r of rows) {
            if (kinds.indexOf(r.kind) === -1)
                continue;
            del.run(r.kind, r.scopeKey, r.itemId);
            touched.push(r);
        }
        if (kinds.indexOf("PINNED") !== -1) {
            // The conversation's own pinned store goes whole, meta included.
            this.db.prepare("DELETE FROM list_meta WHERE kind = 'PINNED' AND scopeKey = ?").run(conversationId);
        }
        this.bumpListRevs(touched.filter((t) => !(t.kind === "PINNED" && t.scopeKey === conversationId)));
    }
    deleteListRowsByConversation(conversationId, kinds) {
        if (!conversationId || !kinds || !kinds.length)
            return;
        const tx = this.db.transaction(() => this.deleteListRowsByConversationTx(conversationId, kinds));
        tx();
    }
    refreshListCopies(items) {
        if (!items || !items.length)
            return;
        const tx = this.db.transaction(() => {
            var _a, _b;
            const upd = this.db.prepare("UPDATE list_rows SET payload = ?, updatedAt = ? WHERE itemId = ? AND kind IN ('PINNED', 'SAVED') " +
                "AND (? IS NULL OR updatedAt IS NULL OR updatedAt <= ?)");
            for (const it of items) {
                const u = (_a = it.updatedAt) !== null && _a !== void 0 ? _a : null;
                upd.run(JSON.stringify((_b = it.payload) !== null && _b !== void 0 ? _b : null), u, String(it.itemId), u, u);
            }
        });
        tx();
    }
}
exports.SqliteEngine = SqliteEngine;
/**
 * The on-disk format of a database file, from its 16-byte header (BEH-ENC-16; the detection is
 * Band 3). A plaintext SQLite file starts with `SQLite format 3\0`; an SQLCipher file's first page
 * is ciphertext. `NONE` when the file is absent or empty.
 */
function sqliteFileFormat(fs, file) {
    try {
        if (!fs.existsSync(file))
            return "NONE";
        const st = fs.statSync(file);
        if (!st || st.size === 0)
            return "NONE";
        const fd = fs.openSync(file, "r");
        try {
            const buf = Buffer.alloc(16);
            const n = fs.readSync(fd, buf, 0, 16, 0);
            if (n < 16)
                return "ENCRYPTED";
            return buf.toString("latin1") === "SQLite format 3\u0000" ? "PLAINTEXT" : "ENCRYPTED";
        }
        finally {
            fs.closeSync(fd);
        }
    }
    catch {
        return "NONE";
    }
}
exports.sqliteFileFormat = sqliteFileFormat;
/**
 * The unsent rows of a database file about to be rebuilt (BEH-ENC-16), as safe report rows — opened
 * read-only, with `keyHex` when the file is encrypted. `null` when the file cannot be read. A file
 * that is busy or locked (another connection or process holds it) throws instead: it is not lost, and
 * the caller must not rebuild over it (TRANSIENT, BEH-ENC-11).
 */
function readUnsentFromFile(Database, file, keyHex) {
    let db = null;
    try {
        db = new Database(file, { readonly: true });
        if (keyHex)
            SqliteCipher_1.applyKeyAndProve(db, keyHex);
        const rows = db
            .prepare("SELECT localMessageId, conversationId, senderUid, receiverType, receiverId, type, category, " +
            "sendState, failureReason, localSortTs, parentMessageId FROM messages WHERE sendState != 'SENT'")
            .all();
        return (rows || []).map((r) => ({ ...r, payload: null, tags: [], mentions: [] }));
    }
    catch (e) {
        if (SqliteCipher_1.classifyMainOpenFailure(e) === "TRANSIENT")
            throw e;
        return null;
    }
    finally {
        try {
            if (db)
                db.close();
        }
        catch {
            /* ignore */
        }
    }
}
exports.readUnsentFromFile = readUnsentFromFile;
