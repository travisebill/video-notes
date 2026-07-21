// Video Notes PWA Service Worker
// 策略：app shell (HTML/CSS/JS/icons) cache-first；JSON 資料 network-first 帶 fallback cache
//
// v1.6-pwa: bump cache version to flush stale app shell after fixing Telegram WebView crash
//           — 2026-07-14: 修 YouTube iframe 預載導致 145 個 WebGL context 超過 mobile 上限
//             + Telegram WebView 崩潰重整 → 改 lazy binding `:src="expanded[video.id] ? getYouTubeEmbedUrl(video) : ''"`
//             + 加 `loading="lazy"` 確保 scroll 內才 load iframe
//             + SW bump 強制所有使用者重抓新 index.html
//           — 詳見 AGENTS.md「Telegram WebView 崩潰」章節
const CACHE_VERSION = 'v1.8-pwa';
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

// Phase 1 P1-T7: Import shared SW message type constants + JSDoc typedef companion file
// importScripts loads synchronously and exposes SW_MESSAGES as global var in SW scope
importScripts('./types/sw-message.js');

// ════════════════════════════════════════════════════════════════════════════
// IDB helpers (Phase 1) — cached DB instance + meta key-value access
// ════════════════════════════════════════════════════════════════════════════

let _dbInstance = null;
async function getDB() {
  if (!_dbInstance) _dbInstance = await openVideoNotesDB();
  return _dbInstance;
}

async function getMetaValue(key) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('meta', 'readonly');
    const req = tx.objectStore('meta').get(key);
    req.onsuccess = () => resolve(req.result?.value ?? null);
    req.onerror = () => reject(req.error);
  });
}

async function setMetaValue(key, value) {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('meta', 'readwrite');
    tx.objectStore('meta').put({ key, value, updated_at: new Date().toISOString() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ════════════════════════════════════════════════════════════════════════════
// Phase 2 P2-T5: shouldSkipSeed() 1h dedupe
// ════════════════════════════════════════════════════════════════════════════

/**
 * Returns true if meta.last_seeded_at exists and is < 1h old.
 * Per spec §5.3 + plan P2-T1b — 1h dedupe for auto-cache trigger.
 * Used by Phase 2 P2-T1 to avoid re-seeding on every json fetch.
 *
 * @returns {Promise<boolean>}
 */
async function shouldSkipSeed() {
  const last = await getMetaValue('last_seeded_at');
  if (!last) return false;
  const ageMs = Date.now() - new Date(last).getTime();
  return ageMs < 60 * 60 * 1000; // 1 hour
}

// Phase 0 P0-T1: IndexedDB schema v2 (initial setup — pre-existing sw.js had no IDB code)
const DB_NAME = 'video-notes';
const DB_VERSION = 2;
const LOCAL_JSON_URL = './data/video-notes.json';

function openVideoNotesDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (event) => {
      const db = req.result;
      const oldVersion = event.oldVersion;
      // v0 → v2: initial schema setup
      if (oldVersion < 1) {
        // meta store (key-value) — Phase 1 SEED_INDEXEDDB + SW activate sentinel (P1-T8)
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
        // settings store (key-value) — Phase 5 Settings Panel persistence (T5e)
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        // videos store — Phase 1 SEED_INDEXEDDB upserts here
        if (!db.objectStoreNames.contains('videos')) {
          const videosStore = db.createObjectStore('videos', { keyPath: 'id' });
          videosStore.createIndex('upload_date', 'upload_date', { unique: false });
          videosStore.createIndex('last_accessed', 'last_accessed', { unique: false });
        }
        // cache_status store — Phase 1 CACHE_VIDEO updates
        if (!db.objectStoreNames.contains('cache_status')) {
          db.createObjectStore('cache_status', { keyPath: 'id' });
        }
        // sync_queue store — Phase 1 CACHE_BATCH + CANCEL_BATCH scheduler
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncQueue = db.createObjectStore('sync_queue', { keyPath: 'id' });
          syncQueue.createIndex('batch_id', 'batch_id', { unique: false });
        }
      }
      // v1 → v2 migration reserved for future v1.0 → v2 schema upgrade
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const APP_SHELL_URLS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/favicon-32.png',
  './icons/favicon-64.png',
  './icons/favicon-128.png',
  './icons/apple-touch-icon.png',
  // CDN dependencies (Alpine.js / Fuse.js / marked.js / DOMPurify / Pico.css)
  'https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css',
  'https://cdn.jsdelivr.net/npm/alpinejs@3.14.1/dist/cdn.min.js',
  'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0',
  'https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js',
  'https://cdn.jsdelivr.net/npm/dompurify@3.0.8/dist/purify.min.js',
];

// 安裝：precache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) => {
      return cache.addAll(APP_SHELL_URLS.map((url) => new Request(url, { cache: 'reload' })))
        .catch((err) => {
          console.warn('[SW] 部分 app shell 快取失敗（可能 CDN 問題）:', err);
        });
    }).then(() => self.skipWaiting())
  );
});

// 啟用：清掉舊版 cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== APP_SHELL_CACHE && name !== RUNTIME_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => openVideoNotesDB())
     .then(async () => {
       // Phase 1 P1-T9: SW activate sentinel check (per M-11, moved from P6)
       // First activation (previousVersion === null): skip mismatch check
       // Mismatch (previousVersion !== SENTINEL_VERSION): clear cache buckets
       // (Phase 6 recoverFromStaleState() will own IDB reset + re-SEED)
       const SENTINEL_VERSION = 'v2.0-offline';
       const previousVersion = await getMetaValue('sw_version');
       if (previousVersion !== null && previousVersion !== SENTINEL_VERSION) {
         console.warn('[SW P1-T9] sw_version mismatch detected, clearing cache buckets');
         for (const name of await caches.keys()) {
           if (name === 'markdown-v1' || name === 'thumbnails-v1') {
             await caches.delete(name);
           }
         }
       }
     })

     .then(() => setMetaValue('sw_version', 'v2.0-offline'))  // P1-T8
     .then(() => self.clients.claim())
  );
});

// Fetch 處理
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. JSON metadata：network-first，只 cache LOCAL_JSON_URL（避免 canonicalization — P0-T2 + P0-T3 fix）
  const localJsonAbsolute = new URL(LOCAL_JSON_URL, self.location.href).href;
  if (url.href === localJsonAbsolute ||
      (url.pathname.endsWith('/data/video-notes.json') && url.hostname === self.location.hostname)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || new Response('{}', {
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        })))
    );
    return;
  }

  // 2. CDN 資源（Alpine.js / Fuse.js / marked.js / DOMPurify / Pico.css）：cache-first
  if (url.hostname === 'cdn.jsdelivr.net') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // 3. YouTube 縮圖（i.ytimg.com）：cache-first（節省流量）
  if (url.hostname === 'i.ytimg.com') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            // 只快取成功回應（避免 cache 404）
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => new Response('', { status: 504 }));
      })
    );
    return;
  }

  // 4. App shell（HTML/CSS/JS/icons）：cache-first，背景更新
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request).then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(APP_SHELL_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);  // 離線 fallback cache

      return cached || networkFetch;
    })
  );
});

// ════════════════════════════════════════════════════════════════════════════
// Message handlers — Phase 1 P1-T1 (SEED_INDEXEDDB)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Phase 1 P1-T1: SEED_INDEXEDDB handler
 * Spec §5.3 — 7-step SOP:
 *   1. Frontend init() loads video-notes.json + postMessage SEED_INDEXEDDB(videos[])
 *   2. SW: upsert videos[] to IDB videos store (id as primary key)
 *   3. SW: backfill cache_status for new entries (status: 'pending')
 *   4. SW: update meta.last_seeded_at = now
 *   5. SW: respond with {written, updated}
 *   6. SW: if videos non-empty → trigger auto cache (Phase 2 follow-up)
 *   7. Frontend: ⬇️ button enable only after SEED_DONE response
 *
 * @param {Object} payload
 * @param {Array<VideoMetadata>} payload.videos
 * @returns {Promise<{written: number, updated: number}>}
 */
async function handleSeedIndexedDB({ videos }) {
  if (!Array.isArray(videos)) {
    throw new Error('handleSeedIndexedDB: videos must be an array');
  }

  const db = await getDB();
  let written = 0;
  let updated = 0;

  // 7-step SOP as a single readwrite transaction (atomic)
  await new Promise((resolve, reject) => {
    const tx = db.transaction(['videos', 'cache_status', 'meta'], 'readwrite');
    const videosStore = tx.objectStore('videos');
    const cacheStatusStore = tx.objectStore('cache_status');
    const metaStore = tx.objectStore('meta');

    for (const video of videos) {
      // Normalize: ensure last_verified_cache_state defaults to null
      const videoRecord = { ...video, last_verified_cache_state: null };

      // Step 2+3: upsert videos + backfill cache_status
      const getReq = videosStore.get(video.id);
      getReq.onsuccess = () => {
        if (getReq.result) {
          // Existing video — update (preserve last_verified_cache_state if not provided)
          const existing = getReq.result;
          const merged = {
            ...existing,
            ...videoRecord,
            last_verified_cache_state: videoRecord.last_verified_cache_state ?? existing.last_verified_cache_state,
          };
          videosStore.put(merged);
          updated++;
        } else {
          // New video — insert + create pending cache_status
          videosStore.put(videoRecord);
          cacheStatusStore.put({
            id: video.id,
            status: 'pending',
            markdown_status: 'pending',
            thumbnail_status: 'pending',
          });
          written++;
        }
      };
    }

    // Step 4: update meta.last_seeded_at
    metaStore.put({
      key: 'last_seeded_at',
      value: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(new Error('Transaction aborted'));
  });

  // Step 5: respond (caller postMessage)
  // Step 6: trigger auto-cache (Phase 2 follow-up — for now just log)
  // Step 7: ⬇️ button enable handled by frontend upon SEED_DONE
  if ((written + updated) > 0) {
    console.log(`[SW] SEED_INDEXEDDB: ${written} written, ${updated} updated — auto-cache trigger will follow in Phase 2`);
  }

  return { written, updated };
}

/**
 * Phase 1 P1-T4: UNCACHE_VIDEO handler
 * @param {Object} payload
 * @param {string} payload.id - video ID to remove from cache
 */
async function handleUncacheVideo({ id }) {
  if (!id) throw new Error('UNCACHE_VIDEO: id required');
  const db = await getDB();

  // Find video record (for cache URLs)
  const video = await new Promise((resolve, reject) => {
    const tx = db.transaction('videos', 'readonly');
    const req = tx.objectStore('videos').get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });

  // Compute exact cache URLs (markdown from note_path, thumbnail from YouTube ID)
  // — thumbnail URL uses YouTube ID, NOT the video record ID, so url.includes(id)
  //   would never match. Use exact URL lookup instead.
  const targetUrls = [];
  if (video?.note_path) {
    targetUrls.push(new URL(video.note_path, self.location.href).href);
  }
  const ytId = extractYouTubeId(video?.video_url);
  if (ytId) {
    targetUrls.push(`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`);
  }

  // Delete from cache buckets (markdown-v1 + thumbnails-v1 — created by P1-T2)
  const cacheNames = await caches.keys();
  const targetBuckets = ['markdown-v1', 'thumbnails-v1'];
  await Promise.all(
    targetBuckets
      .filter((name) => cacheNames.includes(name))
      .map((name) => caches.open(name).then((cache) =>
        Promise.all(targetUrls.map((url) => cache.delete(url)))
      ))
  );

  // Update videos store (reset cache_status fields to 'pending')
  if (video) {
    video.markdown_status = 'pending';
    video.thumbnail_status = 'pending';
    await new Promise((resolve, reject) => {
      const tx = db.transaction('videos', 'readwrite');
      tx.objectStore('videos').put(video);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // Remove cache_status entry (so it doesn't appear in GET_CACHE_STATUS)
  await new Promise((resolve, reject) => {
    const tx = db.transaction('cache_status', 'readwrite');
    tx.objectStore('cache_status').delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  return { ok: true, id };
}

/**
 * Phase 1 P1-T4: GET_CACHE_STATUS handler
 * @returns {Promise<{videos: Array<Object>}>}
 */
async function handleGetCacheStatus() {
  const db = await getDB();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction('cache_status', 'readonly');
    const req = tx.objectStore('cache_status').getAll();
    req.onsuccess = () => resolve({ videos: req.result || [] });
    req.onerror = () => reject(req.error);
  });
}

/**
 * Phase 1 P1-T4: CLEAR_ALL_CACHE handler
 * Clears markdown + thumbnails cache buckets (keep json cache).
 * Marks all cache_status entries back to 'pending'.
 * @returns {Promise<{ok: boolean, clearedBuckets: string[]}>}
 */
async function handleClearAllCache() {
  // Delete only markdown + thumbnails cache buckets (keep json-v1)
  const cacheNames = await caches.keys();
  const targetBuckets = ['markdown-v1', 'thumbnails-v1'];
  const cleared = targetBuckets.filter((name) => cacheNames.includes(name));
  await Promise.all(cleared.map((name) => caches.delete(name)));

  // Mark all cache_status entries back to 'pending'
  const db = await getDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction('cache_status', 'readwrite');
    const store = tx.objectStore('cache_status');
    const getAllReq = store.getAll();
    getAllReq.onsuccess = () => {
      for (const entry of getAllReq.result) {
        entry.status = 'pending';
        entry.markdown_status = 'pending';
        entry.thumbnail_status = 'pending';
        store.put(entry);
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  return { ok: true, clearedBuckets: cleared };
}

/**
 * Phase 1 P1-T5: AUTO_CACHE_DONE event emit helper
 * Actual auto cache logic (running AUTO_CACHE + video scoring) is in Phase 2.
 * This helper defines how SW broadcasts the event to all clients.
 *
 * @param {number} cached_count - number of videos cached in this run
 * @param {number} total_bytes - total bytes cached (markdown + thumbnails)
 * @param {number} duration_ms - how long the auto cache took (wall-clock)
 * @param {boolean} dedup_skipped - whether some videos were skipped due to dedupe
 */
async function emitAutoCacheDone(cached_count, total_bytes, duration_ms, dedup_skipped) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of clients) {
    client.postMessage({
      type: SW_MESSAGES.AUTO_CACHE_DONE,
      cached_count,
      total_bytes,
      duration_ms,
      dedup_skipped,
    });
  }
}

/**
 * Phase 1 P1-T6: LRU_EVICTED event emit helper
 * Actual LRU eviction logic (running LRU + clearing caches) is in Phase 2.
 * This helper defines how SW broadcasts the event to all clients.
 *
 * @param {number} count - number of videos evicted
 * @param {number} freed_bytes - bytes freed from cache storage
 */
async function emitLRUEvicted(count, freed_bytes) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of clients) {
    client.postMessage({
      type: SW_MESSAGES.LRU_EVICTED,
      count,
      freed_bytes,
    });
  }
}

// ════════════════════════════════════════════════════════════════════════════
// Phase 1 P1-T2: CACHE_VIDEO 13-step refactor (stage events)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Look up video record by ID in IDB videos store.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
async function getVideo(id) {
  const db = await getDB();
  return await new Promise((resolve, reject) => {
    const tx = db.transaction('videos', 'readonly');
    const req = tx.objectStore('videos').get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

/**
 * Extract YouTube video ID from various URL formats.
 * Supports: youtu.be/{id}, youtube.com/watch?v={id}, youtube.com/live/{id},
 *           youtube.com/embed/{id}, youtube.com/shorts/{id}
 * @param {string} videoUrl
 * @returns {string|null}
 */
function extractYouTubeId(videoUrl) {
  if (!videoUrl || typeof videoUrl !== 'string') return null;
  try {
    const u = new URL(videoUrl);
    if (u.hostname === 'youtu.be') {
      return u.pathname.replace(/^\//, '').split('/')[0] || null;
    }
    if (u.hostname === 'www.youtube.com' || u.hostname === 'youtube.com' || u.hostname === 'm.youtube.com') {
      if (u.searchParams.has('v')) return u.searchParams.get('v');
      const m = u.pathname.match(/^\/(?:live|embed|shorts)\/([^/?]+)/);
      if (m) return m[1];
    }
  } catch (_) {
    // fallthrough
  }
  return null;
}

/**
 * Phase 1 P1-T2: CACHE_PROGRESS event emit helper.
 * Broadcasts per-stage progress (markdown/thumbnail × start/done/failed).
 */
async function emitCacheProgress(id, stage, status) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of clients) {
    client.postMessage({
      type: SW_MESSAGES.CACHE_PROGRESS,
      id, stage, status,
    });
  }
}

/**
 * Phase 1 P1-T2: CACHE_DONE event emit helper.
 * Broadcasts single-video completion (success + partial flag if thumbnail 404).
 */
async function emitCacheDone(id, success, partial, error) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of clients) {
    client.postMessage({
      type: SW_MESSAGES.CACHE_DONE,
      id, success, partial,
      error: error || undefined,
    });
  }
}

/**
 * Phase 1 P1-T2: CACHE_VIDEO handler — 13-step flow with stage events.
 *
 * Steps:
 *   1. fetch markdown via fetch(markdownUrl)
 *   2. validate markdown response (status 200)
 *   3. open markdown-v1 cache
 *   4. cache.put(markdownUrl, response.clone())
 *   5. fetch thumbnail via fetch(thumbnailUrl)
 *   6. validate thumbnail response
 *   7. open thumbnails-v1 cache
 *   8. cache.put(thumbnailUrl, response.clone())
 *   9. update cache_status[id].markdown_status = 'cached' | 'failed'
 *  10. update cache_status[id].thumbnail_status = 'cached' | 'failed' | 'skipped'
 *  11. update cache_status[id].cached_at = now + status = 'cached' | 'partial' | 'failed'
 *  12. emit CACHE_PROGRESS × 4 events (markdown start/done, thumbnail start/done)
 *  13. emit CACHE_DONE (success | partial if thumbnail 404)
 *
 * @param {Object} payload
 * @param {string} payload.id
 * @param {AbortSignal} [payload.signal] - optional abort signal (P1-T3 batch integration)
 */
async function handleCacheVideo(payload) {
  const { id, signal } = payload;
  if (!id) throw new Error('CACHE_VIDEO: id required');

  if (signal?.aborted) {
    const err = new Error('cancelled');
    err.name = 'AbortError';
    throw err;
  }

  // Look up video metadata for URL construction
  const video = await getVideo(id);
  if (!video) throw new Error(`CACHE_VIDEO: video ${id} not found in IDB`);

  // Build markdown + thumbnail URLs
  const markdownUrl = video.note_path
    ? new URL(video.note_path, self.location.href).href
    : null;
  const ytId = extractYouTubeId(video.video_url);
  const thumbnailUrl = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : null;

  if (!markdownUrl) {
    throw new Error(`CACHE_VIDEO: video ${id} has no note_path`);
  }

  let markdownOk = false;
  let thumbnailOk = false;
  let thumbnailError = null;

  // Step 1-4: fetch + cache markdown
  try {
    await emitCacheProgress(id, 'markdown', 'start');
    const resp = await fetch(markdownUrl);
    if (!resp.ok) throw new Error(`markdown HTTP ${resp.status}`);
    const cache = await caches.open('markdown-v1');
    await cache.put(markdownUrl, resp.clone());
    markdownOk = true;
    await emitCacheProgress(id, 'markdown', 'done');
  } catch (err) {
    console.warn(`[SW] CACHE_VIDEO ${id} markdown failed:`, err);
    await emitCacheProgress(id, 'markdown', 'failed');
  }

  // Step 5-8: fetch + cache thumbnail
  if (thumbnailUrl) {
    try {
      await emitCacheProgress(id, 'thumbnail', 'start');
      const resp = await fetch(thumbnailUrl);
      if (!resp.ok) throw new Error(`thumbnail HTTP ${resp.status}`);
      const cache = await caches.open('thumbnails-v1');
      await cache.put(thumbnailUrl, resp.clone());
      thumbnailOk = true;
      await emitCacheProgress(id, 'thumbnail', 'done');
    } catch (err) {
      console.warn(`[SW] CACHE_VIDEO ${id} thumbnail failed:`, err);
      thumbnailError = err.message || String(err);
      await emitCacheProgress(id, 'thumbnail', 'failed');
    }
  } else {
    // No video_url → skip thumbnail (not a failure, just unsupported)
    await emitCacheProgress(id, 'thumbnail', 'failed');
  }

  // Step 9-11: update cache_status[id]
  const db = await getDB();
  await new Promise((resolve, reject) => {
    const tx = db.transaction('cache_status', 'readwrite');
    const store = tx.objectStore('cache_status');
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const entry = getReq.result || { id };
      entry.id = id;
      entry.markdown_status = markdownOk ? 'cached' : 'failed';
      entry.thumbnail_status = thumbnailOk ? 'cached' : (thumbnailUrl ? 'failed' : 'skipped');
      entry.status = markdownOk && thumbnailOk ? 'cached'
                   : markdownOk ? 'partial'
                   : 'failed';
      entry.cached_at = new Date().toISOString();
      store.put(entry);
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });

  // Step 13: emit CACHE_DONE (Step 12 covered by 4× emitCacheProgress above)
  const success = markdownOk;
  const partial = markdownOk && !thumbnailOk;
  await emitCacheDone(id, success, partial, partial ? (thumbnailError || 'thumbnail fetch failed') : null);

  return { ok: success, id, markdownOk, thumbnailOk, partial };
}

// ════════════════════════════════════════════════════════════════════════════
// Phase 1 P1-T3: CACHE_BATCH + CANCEL_BATCH (AbortController race protection)
// ════════════════════════════════════════════════════════════════════════════

// Map<batchId, { controller, startedAt, total, status }>
// Per spec §5.3 + plan P1-T3 — AbortController race protection.
const _batchRegistry = new Map();

/**
 * Phase 1 P1-T3: per-video work inside batch (TEMPORARY STUB — replaced by P1-T2).
 *
 * P1-T2 will refactor this into the full 13-step handleCacheVideo flow
 * (markdown fetch → thumbnail fetch → IDB cache_status update → cache buckets → events).
 * For now P1-T3 only exercises the AbortController + IDB plumbing path.
 *
 * @param {string} id - video ID
 * @param {AbortSignal} signal
 * @returns {Promise<{ok: boolean, cached: boolean}>}
 */
async function cacheOneVideoInBatch(id, signal) {
  // P1-T3 batch worker delegates to P1-T2's 13-step handleCacheVideo.
  // Per-video IDB writes + cache bucket fills + stage events all happen inside handleCacheVideo.
  if (signal?.aborted) {
    const err = new Error('cancelled');
    err.name = 'AbortError';
    throw err;
  }
  return await handleCacheVideo({ id }, signal);
}

/**
 * Phase 1 P1-T3: CACHE_BATCH handler.
 *
 * Runs cacheOneVideoInBatch for each video with concurrency limit + abort support.
 * Frontend sends batchId (crypto.randomUUID()) so CANCEL_BATCH can target this run.
 *
 * @param {Object} payload
 * @param {string} payload.batchId - unique batch ID
 * @param {string[]} payload.videoIds
 * @param {number} [payload.concurrency=3] - max concurrent fetches
 */
async function handleCacheBatch(payload) {
  const { batchId, videoIds, concurrency = 3 } = payload;

  if (!batchId || typeof batchId !== 'string') {
    throw new Error('CACHE_BATCH: batchId required (string)');
  }
  if (!Array.isArray(videoIds) || videoIds.length === 0) {
    throw new Error('CACHE_BATCH: videoIds required (non-empty array)');
  }
  if (_batchRegistry.has(batchId)) {
    throw new Error(`CACHE_BATCH: batchId ${batchId} already running`);
  }

  const controller = new AbortController();
  const startedAt = Date.now();
  _batchRegistry.set(batchId, {
    controller,
    startedAt,
    total: videoIds.length,
    status: 'running',
  });

  // Worker pool — concurrency-limited iterator pattern
  let cursor = 0;
  let done = 0;
  let cancelled = 0;
  const failed = [];

  async function worker() {
    while (cursor < videoIds.length) {
      if (controller.signal.aborted) return;
      const idx = cursor++;
      const id = videoIds[idx];
      try {
        await cacheOneVideoInBatch(id, controller.signal);
        done++;
      } catch (err) {
        if (err.name === 'AbortError' || controller.signal.aborted) {
          // Count remaining videos as cancelled (worker stopped early)
          cancelled = videoIds.length - idx;
          return;
        }
        console.warn(`[SW] CACHE_BATCH video ${id} failed:`, err);
        failed.push(id);
      }
    }
  }

  const workerCount = Math.min(concurrency, videoIds.length);
  const workers = Array.from({ length: workerCount }, () => worker());
  await Promise.all(workers);

  // Cleanup registry + broadcast BATCH_DONE to clients
  _batchRegistry.delete(batchId);
  await emitBatchDone(batchId, done, failed, cancelled);

  return {
    ok: true,
    batchId,
    done,
    failed,
    cancelled,
    duration_ms: Date.now() - startedAt,
  };
}

/**
 * Phase 1 P1-T3: CANCEL_BATCH handler.
 * Aborts an in-progress batch via AbortController.
 *
 * @param {Object} payload
 * @param {string} payload.batchId
 * @returns {Promise<{ok: boolean, batchId: string, wasRunning: boolean}>}
 */
async function handleCancelBatch(payload) {
  const { batchId } = payload;
  if (!batchId) {
    throw new Error('CANCEL_BATCH: batchId required');
  }
  const entry = _batchRegistry.get(batchId);
  if (!entry) {
    return { ok: true, batchId, wasRunning: false };
  }
  entry.controller.abort();
  entry.status = 'cancelling';
  return { ok: true, batchId, wasRunning: true };
}

/**
 * Phase 1 P1-T3: BATCH_DONE event emit helper.
 * Broadcasts batch completion to all clients.
 */
async function emitBatchDone(batchId, done, failed, cancelled) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of clients) {
    client.postMessage({
      type: SW_MESSAGES.BATCH_DONE,
      batchId,
      done,
      failed,
      cancelled,
    });
  }
}

self.addEventListener('message', (event) => {
  const data = event.data || {};
  const { type, ...payload } = data;

  if (!type) {
    console.warn('[SW] Message missing type:', data);
    return;
  }

  switch (type) {
    case SW_MESSAGES.SEED_INDEXEDDB:
      handleSeedIndexedDB(payload)
        .then((result) => {
          event.source.postMessage({
            type: 'SEED_INDEXEDDB_DONE',
            written: result.written,
            updated: result.updated,
          });
        })
        .catch((err) => {
          console.error('[SW] SEED_INDEXEDDB failed:', err);
          event.source.postMessage({
            type: 'SEED_INDEXEDDB_ERROR',
            error: err.message || String(err),
          });
        });
      break;

    case SW_MESSAGES.UNCACHE_VIDEO:
      handleUncacheVideo(payload)
        .then((result) => {
          event.source.postMessage({ type: 'UNCACHE_VIDEO_DONE', ...result });
        })
        .catch((err) => event.source.postMessage({
          type: 'UNCACHE_VIDEO_ERROR', error: err.message || String(err),
        }));
      break;

    case SW_MESSAGES.GET_CACHE_STATUS:
      handleGetCacheStatus()
        .then((result) => {
          event.source.postMessage({ type: 'GET_CACHE_STATUS_DONE', videos: result.videos });
        })
        .catch((err) => event.source.postMessage({
          type: 'GET_CACHE_STATUS_ERROR', error: err.message || String(err),
        }));
      break;

    case SW_MESSAGES.CLEAR_ALL_CACHE:
      handleClearAllCache()
        .then((result) => {
          event.source.postMessage({ type: 'CLEAR_ALL_CACHE_DONE', ...result });
        })
        .catch((err) => event.source.postMessage({
          type: 'CLEAR_ALL_CACHE_ERROR', error: err.message || String(err),
        }));
      break;

    case SW_MESSAGES.CACHE_BATCH:
      handleCacheBatch(payload)
        .then((result) => {
          event.source.postMessage({
            type: 'CACHE_BATCH_DONE',
            batchId: result.batchId,
            done: result.done,
            failed: result.failed,
            cancelled: result.cancelled,
            duration_ms: result.duration_ms,
          });
        })
        .catch((err) => event.source.postMessage({
          type: 'CACHE_BATCH_ERROR',
          error: err.message || String(err),
        }));
      break;

    case SW_MESSAGES.CANCEL_BATCH:
      handleCancelBatch(payload)
        .then((result) => {
          event.source.postMessage({ type: 'CANCEL_BATCH_DONE', ...result });
        })
        .catch((err) => event.source.postMessage({
          type: 'CANCEL_BATCH_ERROR',
          error: err.message || String(err),
        }));
      break;

    case SW_MESSAGES.CACHE_VIDEO:
      handleCacheVideo(payload)
        .then((result) => {
          event.source.postMessage({
            type: 'CACHE_VIDEO_DONE',
            id: result.id,
            ok: result.ok,
            markdownOk: result.markdownOk,
            thumbnailOk: result.thumbnailOk,
            partial: result.partial,
          });
        })
        .catch((err) => event.source.postMessage({
          type: 'CACHE_VIDEO_ERROR',
          error: err.message || String(err),
        }));
      break;

    // Phase 1 P1-T6: emit LRU_EVICTED event (helper at top of file)

    default:
      console.warn('[SW] Unknown message type:', type);
  }
});
