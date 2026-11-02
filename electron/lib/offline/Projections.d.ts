/**
 * Pure helpers: write-time tag/mention projections and the column-backed read
 * predicate that evaluates a LocalQuery against a row without parsing the payload.
 */
import { LocalQuery, MessageRow } from "./OfflineTypes";
/** Tags projected off the payload. Rebuilt in the same transaction as the row upsert. */
export declare function extractTags(payload: any): string[];
/** Mentioned uids projected off the payload. */
export declare function extractMentions(payload: any): string[];
/** Does this payload carry at least one attachment? Write-time projection for `hasAttachments`. */
export declare function extractHasAttachments(payload: any): boolean;
/** Distinct `AttachmentType` values on this payload. Write-time projection for `attachmentTypes`. */
export declare function extractAttachmentTypes(payload: any): string[];
/** Does this payload carry at least one reaction? Write-time projection for `hasReactions`. */
export declare function extractHasReactions(payload: any): boolean;
/**
 * Scope predicate — restricts a message read to one conversation. Group: receiver is the guid.
 * 1:1: when the self uid is known, the canonical pair id is authoritative. A reconciled row is keyed
 * under its canonical pair id (`conversationId !== receiverId`); only PROVISIONAL rows — a pending
 * outbox message keyed by the raw `receiverId` — fall through to sender/receiver matching. So a
 * canonically-keyed row under a different pair (e.g. a system-authored action, sender = actor) is
 * never re-matched by its sender on an actor-scoped read (F-02), while a pending message stays visible.
 * The structural `conversationId === receiverId` test needs no id parsing, so a uid that itself
 * contains "_user_" is handled correctly. With self unknown, the legacy sender/receiver fallback runs.
 */
export declare function inScope(r: MessageRow, q: LocalQuery): boolean;
/**
 * Column-backed predicate for a cached message read. Never inspects `payload`;
 * only evaluates the locally-computable filters.
 *
 * "Never inspects `payload`" is load-bearing, not stylistic: under cache encryption this predicate
 * runs against the STORED row, whose `payload` is `null` (the real one is sealed in `__enc`). Any
 * filter that needs payload data must therefore arrive as a write-time projection column — which is
 * exactly what `hasAttachments` / `attachmentTypes` / `hasReactions` are.
 */
export declare function matchesMessage(r: MessageRow, q: LocalQuery): boolean;
