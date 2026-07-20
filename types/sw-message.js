/**
 * Video Notes PWA — Shared SW Message Type Definitions
 *
 * Shared type definitions between Service Worker (sw.js) and Frontend (app.js).
 * JSDoc @typedef syntax provides IDE autocomplete + type checking.
 * Zero build cost (no TypeScript toolchain required — per plan v3.1 P1-T7).
 *
 * Reference: docs/superpowers/specs/2026-07-20-offline-mode-design.md §5.3
 * Plan:       docs/plan/2026-07-20-offline-mode-impl-plan.md §Phase 1 P1-T7
 */

// ════════════════════════════════════════════════════════════════════════════
// Message type constants (Frontend ↔ Service Worker)
// ════════════════════════════════════════════════════════════════════════════

const SW_MESSAGES = {
  // Frontend → SW (request messages)
  SEED_INDEXEDDB:    'SEED_INDEXEDDB',     // Initial video metadata write
  CACHE_VIDEO:       'CACHE_VIDEO',        // Single video cache (markdown + thumbnail)
  CACHE_BATCH:       'CACHE_BATCH',        // Batch download (with concurrency + abort support)
  CANCEL_BATCH:      'CANCEL_BATCH',       // Cancel in-progress batch
  UNCACHE_VIDEO:     'UNCACHE_VIDEO',      // Remove single video cache
  GET_CACHE_STATUS:  'GET_CACHE_STATUS',   // Query cache status
  CLEAR_ALL_CACHE:   'CLEAR_ALL_CACHE',    // Clear markdown + thumbnails (keep json)

  // Phase 5 P5-T5c Storage Management — per-bucket buttons
  WIPE_MARKDOWN:     'WIPE_MARKDOWN',      // Clear markdown cache (keep thumbnails)
  WIPE_THUMBNAILS:   'WIPE_THUMBNAILS',    // Clear thumbnails cache (keep markdown)
  WIPE_ALL_CACHE:    'WIPE_ALL_CACHE',     // Clear all cache buckets (keep json)
  WIPE_INDEXEDDB:    'WIPE_INDEXEDDB',     // Full reset (re-trigger SEED after)

  // SW → Frontend (event messages)
  CACHE_PROGRESS:    'CACHE_PROGRESS',     // Stage event: markdown/thumbnail start|done|failed
  CACHE_DONE:        'CACHE_DONE',         // Single video complete (with partial flag)
  BATCH_DONE:        'BATCH_DONE',         // Batch complete (with cancelled count)
  AUTO_CACHE_DONE:   'AUTO_CACHE_DONE',    // Background auto-cache complete (with dedupe flag)
  LRU_EVICTED:       'LRU_EVICTED',        // LRU eviction event (storage pressure)
};

// ════════════════════════════════════════════════════════════════════════════
// JSDoc typedefs — IDE autocomplete + type checking without TS build
// ════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} VideoMetadata
 * @property {string}  id                       - YouTube video ID (primary key)
 * @property {string}  upload_date              - ISO date string
 * @property {string}  last_accessed            - ISO timestamp
 * @property {number}  access_count             - view count (≥1 means user viewed)
 * @property {boolean} auto_cached              - auto-cache eligible (recently viewed/auto)
 * @property {boolean} manual_cached            - user explicitly ⬇️
 * @property {string|null} last_verified_cache_state - 'verified' | 'evicted' | null
 * @property {string|null} first_cached_at        - ISO timestamp
 * @property {number}  size_bytes                - markdown + thumbnail 合計
 */

/**
 * @typedef {Object} CacheProgressEvent
 * @property {'CACHE_PROGRESS'} type
 * @property {string}  id        - video ID
 * @property {'markdown'|'thumbnail'} stage
 * @property {'start'|'done'|'failed'} status
 */

/**
 * @typedef {Object} CacheDoneEvent
 * @property {'CACHE_DONE'} type
 * @property {string}  id
 * @property {boolean} success
 * @property {boolean} partial   - markdown OK but thumbnail 404
 * @property {string}  [error]
 */

/**
 * @typedef {Object} BatchDoneEvent
 * @property {'BATCH_DONE'} type
 * @property {string}  batchId
 * @property {number}  done       - count of successful
 * @property {string[]} failed    - failed video IDs
 * @property {number}  cancelled  - count cancelled
 */

/**
 * @typedef {Object} AutoCacheDoneEvent
 * @property {'AUTO_CACHE_DONE'} type
 * @property {number}  count         - total auto-cached count
 * @property {boolean} shouldNotify  - 24h dedupe + newVideos > 0 check
 * @property {number}  newVideos     - count of newly cached (not in previous notify)
 */

/**
 * @typedef {Object} LRUEvictedEvent
 * @property {'LRU_EVICTED'} type
 * @property {number} count
 * @property {number} freed_bytes
 */

