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