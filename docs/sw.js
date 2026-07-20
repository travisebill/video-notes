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

    // TODO next turn (P1-T2): case SW_MESSAGES.CACHE_VIDEO
    // TODO next turn (P1-T3): case SW_MESSAGES.CACHE_BATCH + CANCEL_BATCH
    // TODO next turn (P1-T4): case SW_MESSAGES.UNCACHE_VIDEO + GET_CACHE_STATUS + CLEAR_ALL_CACHE
    // TODO next turn (P1-T5): emit AUTO_CACHE_DONE event
    // TODO next turn (P1-T6): emit LRU_EVICTED event

    default:
      console.warn('[SW] Unknown message type:', type);
  }
});
