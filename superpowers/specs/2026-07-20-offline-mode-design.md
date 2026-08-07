# Video Notes PWA — Offline Mode Design

**Date**: 2026-07-20
**Author**: Ryo ⚙️🐱（Founder 禮士 brainstorming session）
**Status**: Draft（待 Mame review + 禮士 review）
**Repo**: travisebill/video-notes
**Live**: https://travisebill.github.io/video-notes/

---

## 1. 背景與動機

### 1.1 現狀

| 類型 | 數量 | 大小 | 平均 |
|---|---|---|---|
| 影片 | 384 支 | — | — |
| 音檔（opus/m4a/mp3） | 384 × 3 = 1,152 檔 | **1.5 GB** | ~4 MB / 支 |
| 結構化筆記 (.md) | 374 個 | ~7.5 MB | ~20 KB / 支 |
| 逐字稿 (.txt) | 374 個 | ~8 MB | ~22 KB / 支 |
| 口播稿 (.txt) | 374 個 | ~2 MB | ~5 KB / 支 |
| `video-notes.json` | 1 | ~200 KB | — |
| **文字合計** | — | **~18 MB** | — |

**比例：文字 : 音檔 ≈ 1 : 85**

### 1.2 動機

Founder 禮士提出：把「文字的部分」做成離線版，「口說音檔」維持線上版。

理由：
- 文字總計 18 MB 適合整包 cache
- 音檔 1.5 GB 不適合整包 cache（手機空間 + 流量成本）
- 文字 : 音檔 = 1:85 的差距，呼應「離線文字 / 線上音檔」的設計哲學
- 想 cover 通用 use case（長途 / 通勤 / 空間 / 多裝置 / 省流量）

---

## 2. 目標 / 非目標

### 2.1 目標（v1）

- ✅ 文字資料（`video-notes.json` + 結構化筆記 + YouTube 縮圖）**完整離線可用**
- ✅ 音檔 / 逐字稿 / 口播稿 **完全線上**（無 cache）
- ✅ **自動 + 手動混合** cache 策略
- ✅ 跨裝置一致（iOS Safari PWA + Android Chrome PWA）
- ✅ 離線狀態 UI 提示（哪些可用 / 哪些不可用）

### 2.2 非目標（v1 不做）

- ❌ 音檔離線（v2+ 再考慮）
- ❌ 主題訂閱自動 cache（v2+）
- ❌ Background Sync API（Android Chrome 有，iOS Safari 無 — 用 fetch handler 觸發 sync 替代）
- ❌ 多語系 / i18n
- ❌ Push notification 通知新影片

---

## 3. 設計決策摘要

| 面向 | 決策 | 來源 |
|---|---|---|
| 離線範圍 | `video-notes.json` + 結構化筆記 .md + YouTube 縮圖 | Q2 → C + 縮圖 |
| 觸發時機 | 自動「最近 30 支 + 看過的」+ 手動按鈕 | Q3 → E |
| 手動 UX | 卡片 ⬇️ + 全域「分類 / 主題 / 全部」按鈕 | Q4 → E |
| 架構 | Approach A：SW 管背景 + 前端管互動 + IndexedDB 共用 | Approach 階段 → A |
| Review 模式 | B（全部看完後 Mame review 一次） | Review 模式 → B |

---

## 4. 架構總覽

### 4.1 核心概念

**Service Worker 是「cache 後台」**（自動 cache + LRU + background sync）
**前端是「cache 前台」**（UI 互動 + 顯示狀態）
**IndexedDB 是「兩邊共享的 metadata」**

### 4.2 系統架構圖

```
┌────────────────────────────────────────────────────────────────┐
│                  Browser (PWA)                                  │
│                                                                 │
│  ┌──────────────────────────┐  ┌──────────────────────────┐    │
│  │  Frontend (Alpine.js)    │  │   Service Worker         │    │
│  │                          │  │                          │    │
│  │  - ⬇️ 按鈕 (卡片)        │◄─┤  - Fetch handler         │    │
│  │  - ⬇️ 分類/主題按鈕       │  │    (cache-first策略)      │    │
│  │  - ✅ 離線徽章            │  │  - Message API           │    │
│  │  - 進度條                │  │    (CACHE_VIDEO/BATCH)   │    │
│  │  - 狀態指示器            │  │  - Background tasks      │    │
│  │         │                │  │    (auto cache + LRU)    │    │
│  └─────────┼────────────────┘  └─────────────┬────────────┘    │
│            │ postMessage / IndexedDB read      │                │
│            └──────────────────┬────────────────┘                │
│                               │                                 │
│  ┌────────────────────────────▼────────────────────────────┐   │
│  │  IndexedDB（metadata）                                  │   │
│  │  - videos: 影片狀態 + LRU access_count                   │   │
│  │  - cache_status: markdown/thumbnail cached?             │   │
│  │  - sync_queue: pending downloads                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Cache Storage（資源本體）                              │   │
│  │  - app-shell-v1.x-pwa    ← HTML/CSS/JS/icons + CDN deps │   │
│  │  - markdown-v1           ← 結構化筆記 .md               │   │
│  │  - thumbnails-v1         ← YouTube 縮圖                 │   │
│  │  - json-v1               ← video-notes.json             │   │
│  │  - ❌ 不 cache: 音檔 / 逐字稿 / 口播稿 / mp4            │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
            │                                       │
            │ jsDelivr CDN / raw.githubusercontent    │ i.ytimg.com
            ▼                                       ▼
    ┌──────────────────┐                  ┌──────────────────┐
    │  GitHub Pages    │                  │  YouTube CDN     │
    │  video-notes repo│                  │  hqdefault.jpg   │
    └──────────────────┘                  └──────────────────┘
```

### 4.3 訊息流向

| 來源 | 目標 | 通訊方式 | 用途 |
|---|---|---|---|
| Frontend → SW | `SW.postMessage()` | UI 觸發 cache / 清 cache / 查狀態 |
| SW → Frontend | `client.postMessage()` | 回報進度 / 推送更新通知 |
| Frontend ↔ IndexedDB | 直接讀寫 | 讀 `cache_status` 顯示徽章 |

### 4.4 Cache Storage 4 桶

| Cache name | 內容 | 策略 |
|---|---|---|
| `app-shell-v1.x-pwa` | HTML/CSS/JS/icons + 5 CDN deps | cache-first（precache 安裝時） |
| `markdown-v1` | 結構化筆記 .md | cache-first（手動或自動觸發後） |
| `thumbnails-v1` | YouTube 縮圖 | cache-first（已有，lazy 加） |
| `json-v1` | `video-notes.json` | network-first + fallback cache |

---

## 5. Service Worker 設計

### 5.1 Lifecycle

| Event | 動作 |
|---|---|
| `install` | `caches.open('app-shell-v1.x-pwa')` + `cache.addAll(APP_SHELL_URLS)`（**不變**）|
| `activate` | 刪掉非 `app-shell-v1.x / markdown-v1 / thumbnails-v1 / json-v1` 的舊 cache；`self.clients.claim()` |

### 5.2 Fetch Handler（資源分流）

```javascript
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // 1. 結構化筆記 .md
  if (url.pathname.match(/\.md$/)) {
    event.respondWith(cacheFirst(event.request, 'markdown-v1'));
    return;
  }

  // 2. YouTube 縮圖
  if (url.hostname === 'i.ytimg.com') {
    event.respondWith(cacheFirst(event.request, 'thumbnails-v1'));
    return;
  }

  // 3. video-notes.json — **只 cache LOCAL_JSON_URL**（避免 canonicalization 衝突）
  //    RAW / jsDelivr fallback URL 一律 pass-through，不 cache
  //    Frontend 應該透過 SW 拿 json（GET_CACHE_STATUS 或新 FETCH_JSON message）
  //    不要前端自己 fetch 三次
  const localJsonAbsolute = new URL(LOCAL_JSON_URL, self.location.href).href;
  if (url.href === localJsonAbsolute ||
      (url.pathname.endsWith('/data/video-notes.json') && url.hostname === self.location.hostname)) {
    event.respondWith(networkFirst(event.request, 'json-v1'));
    return;
  }

  // 4. 音檔 / 逐字稿 / 口播稿 — 完全不 cache
  if (url.pathname.match(/\.(opus|m4a|mp3|txt)$/)) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 5. 其他 = app shell
  event.respondWith(appShellCacheFirst(event.request));
});
```

### 5.3 Message API

| Message type | 用途 | 回應 |
|---|---|---|
| `SEED_INDEXEDDB(videos[])` | Frontend → SW：寫入影片 metadata | `{written: N, updated: N}` |
| `CACHE_VIDEO(id)` | 單支影片下載（markdown + 縮圖） | stage events: `CACHE_PROGRESS` × 2 + `CACHE_DONE` |
| `CACHE_BATCH(ids[], options)` | 批次下載（分類 / 主題 / 全部），可取消 | 多次 `CACHE_PROGRESS` + `CACHE_DONE`（每支） + `BATCH_DONE` |
| `CANCEL_BATCH(batchId)` | 取消 in-progress 批次下載 | `{cancelled: N}` |
| `UNCACHE_VIDEO(id)` | 移除單支 | `{ok: true}` |
| `GET_CACHE_STATUS()` | 查詢當前 cache 狀態 | `{id: {markdown, thumbnail, size_bytes}[]}` |
| `CLEAR_ALL_CACHE()` | 清空 markdown + thumbnails（保留 json） | `{ok: true}` |

**`SEED_INDEXEDDB(videos[])` 內部流程**（critical path，沒這段 auto cache 不會跑）：
```
1. Frontend init() 在 loadData() 拿到 video-notes.json videos[] 後呼叫
2. SW: 對每個 video upsert 到 IndexedDB videos store（id 為 primary key）
3. SW: 對 cache_status 補齊缺失的 entries（status: 'pending'）
4. SW: 更新 meta.last_seeded_at = now
5. SW: 回應 {written: N, updated: N}
6. SW: 檢查 IndexedDB videos 不為空 → 觸發 auto cache（見 5.4）
7. Frontend 收到回應後才啟用 ⬇️ 按鈕（見 7.1 的 "initializing" 狀態）
```

**`CACHE_VIDEO(id)` 內部流程**（stage-based progress）：
```
1. IndexedDB: lookup video metadata（id → markdown_url, thumbnail_url）
2. IndexedDB: 寫 sync_queue {id, type: 'markdown', status: 'pending'}
3. client.postMessage({type: 'CACHE_PROGRESS', id, stage: 'markdown', status: 'start'})
4. fetch markdown_url → caches.open('markdown-v1').put()
   ├─ 成功 → step 5
   └─ 失敗 → step 5（markdown_status: 'failed'，但繼續 thumbnail）
5. client.postMessage({type: 'CACHE_PROGRESS', id, stage: 'markdown', status: 'done'|'failed'})
6. IndexedDB: 更新 videos.markdown_status = 'cached'|'failed'
7. client.postMessage({type: 'CACHE_PROGRESS', id, stage: 'thumbnail', status: 'start'})
8. fetch thumbnail_url → caches.open('thumbnails-v1').put()
9. client.postMessage({type: 'CACHE_PROGRESS', id, stage: 'thumbnail', status: 'done'|'failed'})
10. IndexedDB: 更新 videos.thumbnail_status = 'cached'|'failed'
11. IndexedDB: 更新 cache_status（'ready' | 'partial' | 'failed'）
12. IndexedDB: 刪 sync_queue entry
13. client.postMessage({type: 'CACHE_DONE', id, success: true|false, partial: bool})
```

**`CACHE_BATCH(ids[], options)` 內部流程**：
```
1. SW 內部維護 `current_batch = {id, ids[], cancel_token, abort_controller}` map
2. 對每支 video 用 CACHE_VIDEO 邏輯，併發限制 3 個（Promise pool）
3. 每 fetch 完一支檢查 cancel_token → 已 cancel 就 abort 剩餘的 + 清 sync_queue
4. options.batch_id 由前端產生（UUID），用於後續 CANCEL_BATCH
5. 全部完成（或 cancel）→ postMessage {type: 'BATCH_DONE', batchId, done, failed[], cancelled}
```

**`CANCEL_BATCH(batchId)` 內部流程**（race condition 處理）：
```
1. SW: 設 current_batch[batchId].cancel_token = true
2. SW: 對 in-flight fetch 用 AbortController.abort()（per-video AbortController）
3. SW: sync_queue 內 batch_id 屬於此 batch 的 entries 標記 status='cancelled'
4. SW: postMessage {type: 'BATCH_DONE', batchId, cancelled: N}
```

**Frontend 收到 SW message 格式**（統一 schema）：
```typescript
// 進度事件（單支）
{type: 'CACHE_PROGRESS', id: string, stage: 'markdown'|'thumbnail', status: 'start'|'done'|'failed'}
// 單支完成
{type: 'CACHE_DONE', id: string, success: boolean, partial: boolean, error?: string}
// 批次完成
{type: 'BATCH_DONE', batchId: string, done: number, failed: string[], cancelled: number}
// 自動 cache 完成（帶 dedupe）
{type: 'AUTO_CACHE_DONE', count: number, shouldNotify: boolean, newVideos: number}
// LRU 觸發
{type: 'LRU_EVICTED', count: number, freed_bytes: number}
```

### 5.4 Background Tasks（auto cache + LRU）

**觸發時機**：
- `SEED_INDEXEDDB` 完成後（critical path，沒這段不會跑）
- `video-notes.json` fetch 完成後（每次 user 打開 PWA，meta.last_seeded_at < now-1h 才重 seed）
- SW `activate` 後第一次 idle

**Auto cache 邏輯**：
```
Pre-condition: IndexedDB videos 表不為空（由 SEED_INDEXEDDB 完成）

1. 從 IndexedDB videos 拿「最近 30 支」by upload_date
2. 對 cache_status.status == 'pending' 的 → 自動 cache（mark auto_cached: true）
3. 對「user 看過的」(access_count >= 1) → 自動 cache（同上）
4. （可選，user 在設定面板開啟後）對「user 看過分類的所有影片」→ 自動 cache
5. 併發限制 3 個（避免一次打太多 connection）
6. 全部完成 → postMessage {type: 'AUTO_CACHE_DONE', count, shouldNotify, newVideos}

ShouldNotify 規則（dedupe，防止通知疲勞）：
- IndexedDB meta.last_auto_cache_notification 紀錄上次通知 timestamp
- 距離上次通知 < 24h → shouldNotify = false
- 距離上次通知 >= 24h 且 newVideos > 0 → shouldNotify = true
- 沒新增影片（newVideos = 0）→ shouldNotify = false（不管多久沒通知）
- 觸發通知後 → 更新 meta.last_auto_cache_notification = now
```

**LRU 淘汰**（**永遠啟用，不可關**，iOS 50MB 滿了就壞）：
```
Pre-condition 1：無 in-progress batch（LRU mutex，避免 race 刪掉正在下載的）
Pre-condition 2：usage > 80% quota

LRU rule（明確）：
- 只刪 auto_cached=true 且 status in ('ready', 'partial') 的影片
- manual_cached=true 的影片神聖不可侵犯（user 手動 ⬇️ 的要保留）
- auto_cached=true 但 status == 'pending'（下載中）也保留

演算法：
1. 檢查 current_batch → 若有任何 in-flight batch → skip LRU（mutex）
2. navigator.storage.estimate() → usage / quota
3. 若 usage < 80% quota → 不觸發
4. 若 usage >= 80% quota → 觸發：
   a. 從 IndexedDB 拿 videos where auto_cached=true AND status in ('ready', 'partial')
   b. 按 last_accessed 升冪排序
   c. 從最舊的開始 cache.delete(markdown + thumbnail) + IndexedDB 更新
   d. 直到 usage < 60% quota
5. 完成 → postMessage {type: 'LRU_EVICTED', count, freed_bytes}
```

---

## 6. Data Layer

### 6.1 IndexedDB Schema

#### `videos` object store（主表，key = video id）

```javascript
{
  // Identity
  id: 'mpFFy_W6IWY',
  title: '人類並不孤單...',
  upload_date: '2026-07-18',

  // URLs
  markdown_url: 'https://cdn.jsdelivr.net/gh/.../xxx.md',
  thumbnail_url: 'https://i.ytimg.com/vi/xxx/hqdefault.jpg',

  // Cache state
  markdown_status: 'cached',           // 'cached' | 'pending' | 'failed' | null
  thumbnail_status: 'cached',

  // LRU fields
  auto_cached: true,                  // 自動入 cache（最近 30 / 看過的）
  manual_cached: false,               // 手動 ⬇️ 入 cache（LRU 不刪）
  access_count: 5,                    // 看過幾次（用於「看過的」判定）
  last_accessed: '2026-07-20T03:30:00Z',

  // Eviction detection
  last_verified_cache_state: 'verified',  // 'verified' | 'evicted' | null（見 Section 8）

  // Audit
  first_cached_at: '2026-07-19T00:15:00Z',
  size_bytes: 28672                   // markdown + thumbnail 合計
}
```

#### `cache_status` object store（denormalized 索引，給前端快速查詢）

```javascript
{
  id: 'mpFFy_W6IWY',
  status: 'ready',                    // 'ready' | 'partial' | 'pending'
  has_markdown: true,
  has_thumbnail: true,
  size_bytes: 28672,
  updated_at: '2026-07-19T00:15:00Z'
}
```

#### `sync_queue` object store（pending downloads）

```javascript
{
  id: 'mpFFy_W6IWY',
  type: 'markdown',                   // 'markdown' | 'thumbnail'
  status: 'pending',                  // 'pending' | 'in_progress' | 'done' | 'failed' | 'cancelled'
  attempts: 0,
  max_attempts: 3,
  next_retry_at: null,
  error_message: null,
  batch_id: 'uuid-string'             // 屬於哪個 CACHE_BATCH（用於 CANCEL_BATCH）
}
```

#### `meta` object store（key-value 單例，給 SW 用來記狀態）

```javascript
{
  key: 'last_auto_cache_notification',  // primary key
  value: '2026-07-20T03:30:00Z',        // ISO timestamp
  updated_at: '2026-07-20T03:30:00Z'
}
// 其他可能的 key：
// - 'last_seeded_at': 上次 SEED_INDEXEDDB 時間
// - 'sw_version': 當前 SW 版本（用於 rollback detection，見 10.1）
// - 'last_lru_at': 上次 LRU 觸發時間（debug 用）
```

### 6.2 Cache Storage Key Rules

| Cache bucket | Key | 範例 |
|---|---|---|
| `app-shell-v1.x-pwa` | URL path | `./index.html` |
| `markdown-v1` | 完整 jsDelivr URL | `https://cdn.jsdelivr.net/gh/.../xxx.md` |
| `thumbnails-v1` | 完整 i.ytimg.com URL | `https://i.ytimg.com/vi/xxx/hqdefault.jpg` |
| `json-v1` | **只有 LOCAL_JSON_URL**（避免 canonicalization） | `./data/video-notes.json`（相對路徑 → 絕對 URL） |

⚠️ Cache API key 必須是完整 URL（含 protocol + hostname + path）。

### 6.3 Data Flow（按 ⬇️ 按鈕）

```
User 按 ⬇️ (卡片)
   ↓ Alpine.js @click handler（需先確認 SW ready，見 7.1）
Frontend
   ├─ SW.postMessage({type: 'CACHE_VIDEO', id: 'mpFFy_W6IWY'})
   └─ Optimistic UI: 立即顯示「⏳ 下載中...」
   ↓ postMessage
SW 收到 message
   ├─ IndexedDB: 寫 sync_queue {id, type: 'markdown', status: 'pending'}
   ├─ client.postMessage({type: 'CACHE_PROGRESS', id, stage: 'markdown', status: 'start'})
   ├─ fetch markdown_url → caches.open('markdown-v1').put()
   ├─ client.postMessage({type: 'CACHE_PROGRESS', id, stage: 'markdown', status: 'done'|'failed'})
   ├─ IndexedDB: 更新 videos.markdown_status
   ├─ client.postMessage({type: 'CACHE_PROGRESS', id, stage: 'thumbnail', status: 'start'})
   ├─ fetch thumbnail_url → caches.open('thumbnails-v1').put()
   ├─ client.postMessage({type: 'CACHE_PROGRESS', id, stage: 'thumbnail', status: 'done'|'failed'})
   ├─ IndexedDB: 更新 videos.thumbnail_status
   ├─ IndexedDB: 更新 cache_status (status: 'ready' | 'partial' | 'failed')
   ├─ IndexedDB: 刪 sync_queue entry
   └─ client.postMessage({type: 'CACHE_DONE', id, success, partial}
   ↓ postMessage back
Frontend Alpine 收到
   ├─ 移除「⏳ 下載中」標籤
   ├─ 顯示「✅ 已離線」徽章（status === 'ready'）
   ├─ 顯示「⚠️ 部分離線」（status === 'partial'，markdown OK 但 thumbnail 404）
   └─ (failed) 顯示「❌ 下載失敗，點重試」
```

---

## 7. Frontend UI

### 7.1 影片卡片 ⬇️ 按鈕（單支）

位置：影片卡片 expand 面板的 header 區，跟現有 metadata（影片連結 / 講者 / 日期）並列

| 狀態 | 顯示 | 觸發條件 |
|---|---|---|
| **初始中** | `[⏳ 初始化中...]` 灰色 disabled | frontend `SEED_INDEXEDDB` 還沒完成 / SW controller 還沒 ready |
| 未離線 | `[⬇️ 下載離線]` 文字按鈕 | SEED 完成 + cache_status.status === 'pending' |
| 下載中 | `[⏳ 下載中 XX%]` + 進度條（mini） | 收到 `CACHE_PROGRESS` stage event → markdown done = 50%, thumbnail done = 100% |
| 已離線 | `[✅ 已離線]` 標籤（hover 顯示 `[🔄 移除]`） | cache_status.status === 'ready' |
| **部分離線** | `[⚠️ 部分離線]` 黃色標籤（hover 顯示 `[🔄 重試縮圖]`） | cache_status.status === 'partial'（markdown OK 但 thumbnail 404） |
| 失敗 | `[❌ 下載失敗 — 重試]` 橘色 | cache_status.status === 'failed' 或 `CACHE_DONE.success === false` |

**Frontend 啟用 ⬇️ 按鈕的 SOP**：
```javascript
// app.js init()：
await navigator.serviceWorker.ready;  // 等 SW controller ready
await seedIndexedDB(videos);          // SEED_INDEXEDDB + 等回應
// 完成後才啟用 ⬇️ 按鈕（從 disabled 變 active）
```

**Progress 計算規則**（基於 stage events）：
```
markdown start  → 0%
markdown done   → 50%
thumbnail start → 50%
thumbnail done  → 100%（成功）
thumbnail failed → 100%（但 partial 狀態）
```

### 7.2 全域 ⬇️ 按鈕（頂部 toolbar）

```
[🔍 搜尋] [📂 類別 ▼] [🎙️ 講者 ▼] [🏷️ 主題 ▼] [📅 日期 ▼] │ [📥 下載離線 ▼] [📊 12.3 MB]
```

`📥 下載離線` 下拉：

```
┌─────────────────────────────────────┐
│ 📂 依分類下載                       │
│  ├─ 🎤 人物訪談 (128 支, ~2.5 MB)  │
│  ├─ 💼 財經分析 (45 支, ~900 KB)   │
│  ├─ 🌍 國際局勢 (32 支, ~640 KB)   │
│  └─ 🎓 技術講座 (179 支, ~3.6 MB)  │
│                                     │
│ 🏷️ 依主題下載                       │
│  ├─ 🧠 AI / LLM (87 支, ~1.7 MB)  │
│  ├─ 💻 軟體工程 (54 支, ~1.1 MB)   │
│  └─ ...                            │
│                                     │
│ ─────────────────────────           │
│ 📦 下載最近 30 支（自動）           │
│ 📦 下載全部剩餘（~10 MB）           │
│ 🗑️ 清空離線 cache                  │
└─────────────────────────────────────┘
```

### 7.3 儲存空間指示器（toolbar 角落）

```
📊 12.3 MB / 已離線 72 支
```

點擊展開：
```
📦 離線儲存空間
已使用：12.3 MB
配額：~50 MB (iOS Safari 估計)
[████████████░░░░░░░░] 25%
📊 已離線：72 / 384 支
├─ markdown：72 (~7.5 MB)
└─ 縮圖：72 (~4.8 MB)
⚙️ 設定
[✓] 自動 cache 最近 30 支
[✓] 自動 cache 看過的
(LRU 永遠啟用，不可關閉 — 見 Section 5.4)
```

### 7.4 離線狀態 banner

```javascript
window.addEventListener('online',  () => hideOfflineBanner());
window.addEventListener('offline', () => showOfflineBanner());
```

當 `navigator.onLine === false`：
```
┌─────────────────────────────────────────────────┐
│ ✈️ 離線模式 — 列表 / 結構化筆記 / 縮圖可用     │
│    逐字稿 / 口播稿 / 音檔需要網路                │
└─────────────────────────────────────────────────┘
```

### 7.5 批次下載進度條

當 `CACHE_BATCH` 進行中：
```
[████████████████░░░░░░░░] 60% — 下載 42 / 70 支（主題：AI / LLM）
                              ⏱️ 預估剩餘 30 秒      [取消]
```

**[取消] 按鈕行為**：
```
1. User 按 [取消]
2. Frontend → SW.postMessage({type: 'CANCEL_BATCH', batchId})
3. SW: 設 cancel_token = true + abort in-flight fetches（AbortController）
4. SW: sync_queue 內屬於此 batch 的 entries 標記 'cancelled'
5. SW → client.postMessage({type: 'BATCH_DONE', batchId, cancelled: N})
6. Frontend 收到 BATCH_DONE → 移除進度條 + 顯示「已取消 N 支」
```

### 7.6 Auto cache 完成通知

當 SW 發 `AUTO_CACHE_DONE {shouldNotify: true, newVideos: N}`：
```
✨ 自動下載 12 支新影片供離線使用
                [查看] [關閉]
```

**Dedupe 規則**（見 Section 5.4）：
- 距離上次通知 < 24h → 不顯示（避免通知疲勞）
- 沒新增影片（newVideos = 0）→ 不顯示
- 24h cooldown + 有新增 → 顯示（並更新 IndexedDB meta.last_auto_cache_notification）

### 7.7 設定面板

```
⚙️ 離線設定
[✓] 啟用離線模式（SEED_INDEXEDDB 自動跑）
[✓] 自動 cache 最近 30 支（依上傳日期）
[✓] 自動 cache 看過的影片
[ ] 自動 cache 整個分類（看過分類後自動）
[ ] Auto cache 通知（24h cooldown，不可關但可調頻率）

Notification cooldown：[24h ▼]  （選項：6h / 12h / 24h / 48h）
LRU 淘汰：永遠啟用（不可關，iOS 50MB limit 必要保護）

Storage 管理
├─ [🗑️ 清空 markdown cache]
├─ [🗑️ 清空縮圖 cache]
└─ [🗑️ 清空全部離線資料]

進階
└─ [🔍 診斷：SW 狀態 / IndexedDB / Cache Storage]
```

---

## 8. Error Handling

| 失敗情境 | 觸發條件 | 處理方式 |
|---|---|---|
| **網路斷線時按 ⬇️** | `fetch` reject | Queue 到 `sync_queue`，online 時 retry |
| **jsDelivr CDN 5xx** | HTTP 5xx | Exponential backoff（3 attempts），失敗 → `cache_status: 'failed'` |
| **YouTube 縮圖 404** | HTTP 404 | `thumbnail_status: 'failed'`，markdown 仍可 cache（partial）|
| **Storage quota exceeded** | `QuotaExceededError` | 觸發 LRU 淘汰；若仍超限 → 顯示「空間不足」banner |
| **iOS 7-day eviction** | SW 啟動時 IndexedDB 跟 Cache Storage 整包被清掉 | SW activate 時檢查 `meta.last_verified_cache_state`：若 IndexedDB 還在但 cache 不見，或 IndexedDB 本身被清 → 視為 evicted 整包：1) 清 IndexedDB videos + cache_status + sync_queue 2) 重新 trigger frontend SEED_INDEXEDDB 3) 重新 auto cache 最近 30 支。**已知取捨：需重新花流量下載，但比讓 user 看到假 ✅ 還好** |
| **IndexedDB schema 升級** | version 變動 | `onupgradeneeded` migration（v1 → v2）|
| **SW 還沒 ready 時 postMessage** | page load 1 秒內 user 按 ⬇️ | frontend 必須 await `navigator.serviceWorker.ready` 才啟用 ⬇️ 按鈕（見 7.1）。`controllerchange` event 也要 listen 以處理 SW update 期間的 controller 切換 |
| **YouTube CORS 失敗** | `fetch().blob()` fail | 改用 `<img>` 載入，cache 仍 work |

---

## 9. Testing 策略

### 9.1 Layer 1：Unit tests（JS 邏輯）

- IndexedDB CRUD（videos / cache_status / sync_queue）
- LRU 排序邏輯
- 「最近 30 支」計算（by upload_date）
- Size 加總（markdown + thumbnail）

### 9.2 Layer 2：SW integration tests（Playwright）

- `install` → precache app shell ✅
- Fetch 路由分流（5 種資源類型）
- `CACHE_VIDEO` message → cache + IndexedDB 寫入
- LRU 觸發（mock `navigator.storage.estimate()`）
- iOS eviction 模擬（`caches.delete` + IndexedDB 對齊）

### 9.3 Layer 3：E2E tests（Playwright headless）

- 首次打開 → 自動 cache「最近 30」完成
- 按 ⬇️ → cache 完成 → UI 顯示 ✅
- 離線模式（network throttle offline）→ 讀 cache 內容
- 批次下載主題 → 進度條 → 完成
- 離線後影片 metadata 更新 → 重新打開 sync 流程

### 9.4 Layer 4：Manual + Lighthouse

- iOS Safari PWA 安裝 + 離線測試
- Android Chrome PWA 安裝 + 離線測試
- Lighthouse PWA audit（目標 ≥ 90 分）
- 跨瀏覽器 smoke test（Safari / Chrome / Edge）

---

## 10. Rollout Plan

| Phase | 動作 | 驗收 |
|---|---|---|
| **1. Dev** | 本地 sw.js 改寫 + IndexedDB module + Unit/Integration test | Playwright test 全綠 |
| **2. Staging** | Deploy 到 `gh-pages-staging` branch | Lighthouse ≥ 90、跨瀏覽器 smoke pass |
| **3. Production** | CACHE_VERSION bump（`v1.8-pwa` → `v2.0-offline`）+ deploy main + Pages build | Health check 確認 build 成功、線上實際 fetch 驗證 |
| **4. Monitor（1 週）** | 觀察 cache hit rate / download 失敗率 / iOS eviction 率 | 收集使用數據 |
| **5. Iterate** | 依使用體驗調整 UX、加新功能（主題訂閱、bg sync 通知）| Mame UX review |

### 10.1 Rollback Plan

**v2.0-offline SW 有 bug** → bump 回 `v1.8-pwa` CACHE_VERSION + 重新 deploy

**IndexedDB 一致性處理**（critical，沒做會造成 user 看到假 ✅）：
```
v2.0 SW 的 activate / SEED_INDEXEDDB 完成時：
- IndexedDB meta['sw_version'] = 'v2.0-offline'

v2.0 → v1.8-pwa rollback 後：
- 舊 SW (v1.8-pwa) activate → cache 白名單是 `app-shell-v1.8-pwa` + `runtime-v1.8-pwa`
- v2.0 引進的 `markdown-v1` / `thumbnails-v1` / `json-v1` 全部被刪
- 但 IndexedDB 內 videos.markdown_status 仍是 'cached' → UI 顯示假 ✅

修法（任選一）：
  (a) v2.0 SW 的 activate 寫 sentinel：IndexedDB meta['sw_version'] = 'v2.0-offline'
      → v1.8-pwa SW 不認識這個 meta（schema 沒這個 key）
      → v1.8-pwa SW 的 activate 檢查到 IndexedDB 內有未知 meta → 視為不相容 → 清掉整個 IndexedDB
  (b) frontend 偵測 SW 版本變化（compare meta['sw_version']） → 主動 reset cache_status UI + IndexedDB

方案 (a) 是 SW 端處理，較乾淨。
```

---

## 11. 已知風險 / 限制

| 風險 | 影響 | 緩解 |
|---|---|---|
| iOS Safari 50MB storage limit | 接近上限 | LRU 淘汰 + UI 警告 |
| iOS 7-day eviction | IndexedDB + Cache Storage **整包清掉**（不是 cache 單獨清）| SW activate 偵測 + 重新 SEED_INDEXEDDB + 重新 auto cache（已知取捨：需重新流量下載）|
| YouTube CORS | 縮圖 `fetch().blob()` 可能 fail | 改用 `<img>` 載入 |
| Pages build 卡住 | deploy 延遲 | Health check workflow（已部分實作）|
| jsDelivr 24h cache 延遲 | 新 push 內容 fetch 有延遲 | 已用 RAW fallback |

---

## 12. 開放問題（待 implementation 階段決定）

1. 「最近 30 支」by `upload_date` 或 by `note_date`？（CS224 26 集有排序問題見 AGENTS.md）
2. LRU 閾值 80% → 60% 是否合理？（iOS 50MB limit 下，60% = 30MB 可能不夠放 374 支）
3. Auto cache「看過的」`access_count` 閾值？（建議 ≥ 1 = 看過就自動 cache）
4. 「下載整個分類」要 sync 進度嗎？（批次下載要 progress bar）
5. IndexedDB schema 升級策略：v1 → v2 用 `onupgradeneeded` 還是直接刪掉重來？
6. 批次下載併發數：3 個還是更多？（jsDelivr rate limit 風險）
7. CACHE_VERSION bump 機制：`v1.8-pwa` → `v2.0-offline` 還是 `v1.9-pwa`？（breaking change 應 bump 主版）
8. CANCEL_BATCH 用 AbortController 還是 flag polling？（AbortController 較乾淨但需要每個 fetch 傳 signal）
9. SEED_INDEXEDDB 失敗時 frontend 怎麼 retry？（3 attempts + UI banner 提示？）
10. LRU 80% → 60% 緩衝區在 iOS 50MB quota 下太小（60% = 30MB 可能不夠 374 支 markdown），是否要 adaptive 動態算？

---

## 13. 變更歷史

| 日期 | 作者 | 變更 |
|---|---|---|
| 2026-07-20 | Ryo ⚙️🐱 | 初版（brainstorming 5 sections 整合 + 設計決策摘要）|
| 2026-07-20 | Ryo ⚙️🐱 | Mame design review 修訂：5 critical + 6 major issues 全部修復（SEED_INDEXEDDB / CANCEL_BATCH / rollback IndexedDB 一致性 / progress events / iOS eviction 整包 / LRU 規則一致 / LRU mutex / json-v1 cache key 限定 / notification dedupe / SW ready / partial 狀態） |

---

## 14. 參考

- [brainstorming skill](../../../.openclaw/skills/superpowers-brainstorming/SKILL.md)
- [AGENTS.md permanent lessons](../../../.openclaw/workspace/agents/ryo/AGENTS.md)
- [GitHub Pages deploy 踩坑](../../../.openclaw/workspace/agents/ryo/AGENTS.md)（搜「永久教訓 GitHub Pages deployment 失敗」）
- [PWA Service Worker pattern](https://web.dev/articles/service-worker-lifecycle)
- [iOS Safari Storage Limit](https://webkit.org/blog/14404/responsive-design-for-iphones-15-pro-max-and-other-large-devices/)

---

🎯 **下一步**：Mame design review → 修問題 → superpowers-writing-plans 寫 implementation plan
