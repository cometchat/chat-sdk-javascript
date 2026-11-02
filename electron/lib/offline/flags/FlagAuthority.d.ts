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
import { MessageRow } from "../OfflineTypes";
/** Where a message write came from. */
export declare enum FlagSource {
    /** Not authoritative for any flag: the stored values are kept. The safe default. */
    NONE = "NONE",
    /** A REST message list page. Every list read sends `withThreadSubscribed`. */
    REST_LIST = "REST_LIST",
    /** The reconnect changelog, which sends `withThreadSubscribed`. */
    CHANGELOG = "CHANGELOG",
    /** `getMessageDetails`, which sends `withThreadSubscribed`. */
    DETAILS = "DETAILS",
    /** The pin / unpin response. */
    PIN_ACK = "PIN_ACK",
    /** A pin / unpin frame. Pin frames strip the actor's `savedAt`, so they never write it. */
    PIN_FRAME = "PIN_FRAME",
    /** The save / unsave response. */
    SAVE_ACK = "SAVE_ACK",
    /** A save / unsave frame. */
    SAVE_FRAME = "SAVE_FRAME"
}
declare type Flags = Pick<MessageRow, "pinnedAt" | "pinnedBy" | "savedAt" | "threadSubscribed">;
/**
 * The flag keys `source` may write for `msg`, read through the model's normalised getters. Keys the
 * source is not authoritative for are absent, so the store keeps its value. An authoritative source
 * whose message lacks the flag yields `null` (cleared).
 *
 * A deleted message always loses its pin and save, whatever the source (BEH-FLAG-03).
 */
export declare function flagsFor(msg: any, source: FlagSource): Flags;
/**
 * The store-side half of BEH-FLAG-03: once a row is deleted, nothing may leave a pin or a save on it.
 * Applied at every write choke point, after carry-forward, so the order events arrive in cannot matter.
 */
export declare function clearFlagsIfDeleted<T extends {
    deletedAt?: number | null;
}>(row: T): T;
export {};
