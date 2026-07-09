// Video Notes PWA Service Worker
// 策略：app shell (HTML/CSS/JS/icons) cache-first；JSON 資料 network-first 帶 fallback cache
//
// v1.3-pwa: bump cache version to flush stale video-notes.json after adding Harari EZ Show
//           — 2026-07-08: 新增 Yuval Noah Harari × Ezra Klein (1h55m, Trumpian vision × cooperation × AI intimacy)
//             + SW bump to force reload new JSON
//           — 詳見 AGENTS.md「speaker 選項整理」章節
const CACHE_VERSION = 'v1.5-pwa';
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;

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
    }).then(() => self.clients.claim())
  );
});

// Fetch 處理
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. JSON metadata（video-notes.json）：network-first，失敗 fallback cache
  if (url.pathname.endsWith('/data/video-notes.json')) {
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