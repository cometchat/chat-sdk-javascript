"use strict";
/**
 * Field authority for the message pin / save / follow flags (BEH-FLAG-02).
 *
 * Every cache write of a message names where its data came from. A write replaces a flag only when
 * that source is authoritative for it, and there a missing value means "cleared". Every other source
 * leaves the stored value alone. That is the whole difference between a REST list page (which knows
 * the message's pin, save and follow state) and, say, a realtime edit frame (which carries none of it).
 *
 * @module offline/flags/FlagAuthority
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearFlagsIfDeleted = exports.flagsFor = exports.FlagSource = void 0;
/** Where a message write came from. */
var FlagSource;
(function (FlagSource) {
    /** Not authoritative for any flag: the stored values are kept. The safe default. */
    FlagSource["NONE"] = "NONE";
    /** A REST message list page. Every list read sends `withThreadSubscribed`. */
    FlagSource["REST_LIST"] = "REST_LIST";
    /** The reconnect changelog, which sends `withThreadSubscribed`. */
    FlagSource["CHANGELOG"] = "CHANGELOG";
    /** `getMessageDetails`, which sends `withThreadSubscribed`. */
    FlagSource["DETAILS"] = "DETAILS";
    /** The pin / unpin response. */
    FlagSource["PIN_ACK"] = "PIN_ACK";
    /** A pin / unpin frame. Pin frames strip the actor's `savedAt`, so they never write it. */
    FlagSource["PIN_FRAME"] = "PIN_FRAME";
    /** The save / unsave response. */
    FlagSource["SAVE_ACK"] = "SAVE_ACK";
    /** A save / unsave frame. */
    FlagSource["SAVE_FRAME"] = "SAVE_FRAME";
})(FlagSource = exports.FlagSource || (exports.FlagSource = {}));
const AUTHORITY = {
    [FlagSource.NONE]: { pin: false, save: false, follow: false },
    [FlagSource.REST_LIST]: { pin: true, save: true, follow: true },
    [FlagSource.CHANGELOG]: { pin: true, save: true, follow: true },
    [FlagSource.DETAILS]: { pin: true, save: true, follow: true },
    [FlagSource.PIN_ACK]: { pin: true, save: false, follow: false },
    [FlagSource.PIN_FRAME]: { pin: true, save: false, follow: false },
    [FlagSource.SAVE_ACK]: { pin: false, save: true, follow: false },
    [FlagSource.SAVE_FRAME]: { pin: false, save: true, follow: false },
};
function call(msg, getter) {
    return msg && typeof msg[getter] === "function" ? msg[getter]() : undefined;
}
/**
 * The flag keys `source` may write for `msg`, read through the model's normalised getters. Keys the
 * source is not authoritative for are absent, so the store keeps its value. An authoritative source
 * whose message lacks the flag yields `null` (cleared).
 *
 * A deleted message always loses its pin and save, whatever the source (BEH-FLAG-03).
 */
function flagsFor(msg, source) {
    const a = AUTHORITY[source] || AUTHORITY[FlagSource.NONE];
    const out = {};
    if (a.pin) {
        const at = call(msg, "getPinnedAt");
        out.pinnedAt = at ? at : null;
        out.pinnedBy = at ? call(msg, "getPinnedBy") || null : null;
    }
    if (a.save) {
        const at = call(msg, "getSavedAt");
        out.savedAt = at ? at : null;
    }
    if (a.follow) {
        // BEH-FLAG-02: a REST message list is authoritative for threadSubscribed (every list read sends
        // withThreadSubscribed), so there an absent flag means not followed — like the changelog and details.
        out.threadSubscribed = call(msg, "isThreadSubscribed") === true;
    }
    const deletedAt = call(msg, "getDeletedAt");
    if (deletedAt) {
        out.pinnedAt = null;
        out.pinnedBy = null;
        out.savedAt = null;
    }
    return out;
}
exports.flagsFor = flagsFor;
/**
 * The store-side half of BEH-FLAG-03: once a row is deleted, nothing may leave a pin or a save on it.
 * Applied at every write choke point, after carry-forward, so the order events arrive in cannot matter.
 */
function clearFlagsIfDeleted(row) {
    if (row && row.deletedAt) {
        const r = row;
        r.pinnedAt = null;
        r.pinnedBy = null;
        r.savedAt = null;
    }
    return row;
}
exports.clearFlagsIfDeleted = clearFlagsIfDeleted;
