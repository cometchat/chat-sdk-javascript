/**
 * Main-process media byte store over node:fs — one real file per attachment under the app's
 * private user-data dir: `app.getPath('userData')/cometchat-media/<appId>_<uid>/<attachmentId>`. App-
 * private, never a public folder. Bytes cross IPC as `ArrayBuffer`. Atomic temp→rename write so a
 * crash mid-write never leaves a partial file.
 *
 * NOT part of the renderer SDK bundle — imported only by the host app's main process.
 *
 * @module offline/electron/main/NodeFsMediaEngine
 */
export declare class NodeFsMediaEngine {
    private root;
    /** Read-only fallback: files an earlier build cached under the per-user folder. */
    private legacyRoot;
    /** Resolve + create the per-(app, user) media root, cache it, and return it to the renderer. */
    openMedia(appId: string, uid: string): string;
    /**
     * The file a key is stored under: `mediaFileName(key)` (verbatim for an already-safe key, a sha256
     * name otherwise), resolved and proven to lie strictly inside the open media root. Throws when no
     * root is open — a relative path would otherwise land in the process's working directory.
     */
    private filePath;
    /** Read-only legacy lookup — same mapping and containment, inside the legacy per-user folder. */
    private legacyPath;
    put(key: string, bytes: ArrayBuffer, _opts?: {
        protected?: boolean;
    }): string;
    get(key: string): ArrayBuffer | null;
    has(key: string): boolean;
    remove(key: string): void;
    totalBytes(): number;
    wipe(): void;
    /** Delete an `(app, user)`'s media without opening it: the new folder, then the legacy one. */
    wipeMediaByName(appId: string, uid: string): void;
}
