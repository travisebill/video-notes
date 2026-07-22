// Video Notes GitHub Pages - Alpine.js App Logic
// Author: Ryo 🐱
// Created: 2026-06-28

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/travisebill/video-notes@main';
// Raw GitHub 作為 fallback (jsDelivr 隱藏 cache 延遲 24h 問題)
const RAW_BASE = 'https://raw.githubusercontent.com/travisebill/video-notes/main';
const JSON_URL = `${CDN_BASE}/data/video-notes.json`;
const RAW_JSON_URL = `${RAW_BASE}/data/video-notes.json`;
// 本地 docs/data/ 優先，避免 raw GitHub 5min cache 延遲
const LOCAL_JSON_URL = `./data/video-notes.json`;

document.addEventListener('alpine:init', () => {
  Alpine.data('videoApp', () => ({
    // ===== State =====
    meta: { total_videos: 0, speakers_count: 0, topics_count: 0, last_updated: '', speakers: [], categories: [], topics: [], courses: [] },
    videos: [],
    filteredVideos: [],
    searchQuery: '',
    filters: {
      category: '',
      speaker: '',
      topic: '',
      course: '',
      dateRange: 'all',
      linkStatus: 'all',  // v1.8 2026-07-14: 'all' | 'with_link' | 'no_link'
    },
    sort: 'date_desc',
    theme: localStorage.getItem('theme') || 'auto',
    fuse: null,
    // Inline expand state
    expanded: {},  // { videoId: bool }
    activeTabs: {},  // { videoId: 'note' | 'transcript' | 'spoken' }
    contentCache: {},  // { 'videoId_type': raw text }
    renderedContent: {},  // { 'videoId_type': rendered HTML (for markdown) }
    loadingContent: {},  // { videoId: bool }
    videoCollapsed: {},  // { videoId: bool } 影片收合狀態（桌面上讓右欄 notes 佔滿寬度）

    // ===== Phase 3 P3-T1+P3-T2 state — SW ready + SEED retry banner =====
    initProgress: 'idle',    // 'idle' | 'registering_sw' | 'seeding' | 'done' | 'error'
    initAttempt: 0,          // current retry attempt (1..3)
    seedBanner: null,        // string|null — current banner message (idempotent render)
    seedError: null,         // string|null — hard fail after 3 attempts; triggers retry button
    swReady: false,          // boolean — SW controller active AND SEED done (gates ⬇ button in P3-T3)
    navigatorOnline: navigator.onLine,  // P3-T4: navigator.onLine mirror; updated by online/offline events
    downloadEnabled: false,  // P3-T3: gates ⬇ button; mirrors swReady but separate for future granular control
    autoCacheBanner: null,    // P4-T6: {message, count, bytes}|null — AUTO_CACHE_DONE notif banner UX (24h-deduped via P2-T4)
    autoCacheLastDoneAt: null, // ISO timestamp of last AUTO_CACHE_DONE (debug)

    // ===== Computed =====
    get sortedSpeakers() {
      return [...this.meta.speakers].sort((a, b) => a.localeCompare(b, 'zh-TW'));
    },
    get sortedTopics() {
      return [...this.meta.topics].sort((a, b) => a.localeCompare(b, 'zh-TW'));
    },

    // ===== Phase 3 P3-T3: download gating computed =====
    // Per plan P3-T3: gates ⬇ button until SW + SEED ready. Mirrors swReady now
    // but kept as a separate getter so future spec changes (e.g., user-toggled
    // offline-mode) can decouple without affecting SW lifecycle state.
    get downloadEnabled() {
      return this.swReady;
    },

    // ===== Init =====
    async init() {
      // Phase 3 P3-T1: await navigator.serviceWorker.ready before posting SEED
      // (must wait for active controller so SEED_INDEXEDDB postMessage targets a real SW)
      await this.registerServiceWorkerAsync();

      // Phase 3 P3-T4: online/offline detection (per spec §7.4) — updates navigatorOnline state
      // which gates the red offline banner in index.html
      this.navigatorOnline = navigator.onLine;
      window.addEventListener('online', () => {
        this.navigatorOnline = true;
        console.log('✅ Network online');
      });
      window.addEventListener('offline', () => {
        this.navigatorOnline = false;
        console.warn('⚠️ Network offline — 部分功能可能受限');
      });
      // SW controllerchange (per spec §7.4 SW update 期間的 controller 切換)
      // Gate swReady during SW update to avoid races with new controller
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          console.log('🔄 SW controller changing — gating interactions');
          this.swReady = false;
        });
      }

      // Phase 4 P4-T6: AUTO_CACHE_DONE inbound listener (consumes P2-T4 ShouldNotify banner UX)
      // SW emits this via emitAutoCacheDone(cached_count, total_bytes, duration_ms, dedup_skipped, should_notify).
      // Frontend listens and shows banner only if should_notify === true (24h-deduped + newVideos>0 rule).
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          const data = event.data || {};
          if (data.type === 'AUTO_CACHE_DONE') {
            this.handleAutoCacheDone(data);
          } else if (data.type === 'LRU_EVICTED') {
            console.log(`[LRU_EVICTED] ${data.count} evicted (~${data.freed_bytes}B freed)`);
          } else if (data.type === 'CACHE_PROGRESS') {
            // Future: drive progress bar UI in Phase 5 toolbar
            // console.log('[CACHE_PROGRESS]', data.id, data.stage, data.status);
          }
        });
      }

      // 註冊 marked 章節時間戳 extension（MM:SS → chapter-link）
      this.registerChapterLinkExtension();

      this.applyTheme();
      await this.loadData();

      // Phase 3 P3-T2: SEED with retry policy (3 attempts + 1s/3s/9s exp backoff)
      // Per plan P3-T2 (M-5 fixed): UI banner shows "正在初始化離線功能... (第 N/3 次)" each retry
      await this.seedIndexedDB(this.videos);

      this.applyFilters();

      // ESC 鍵關閉所有展開面板
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeAllExpands();
        }
      });

      // 章節時間戳點擊 → seek YouTube iframe
      document.addEventListener('click', (e) => {
        const link = e.target.closest('.chapter-link');
        if (!link) return;
        e.preventDefault();
        // chapter-link 沒 data-video，要從最近的 markdown-body 拿 videoId
        let videoId = link.dataset.video;
        if (!videoId) {
          const body = link.closest('.markdown-body');
          if (body) videoId = body.dataset.video;
        }
        const time = parseInt(link.dataset.time, 10);
        if (videoId && !isNaN(time)) {
          this.seekYouTube(videoId, time);
          this.hideChapterPreview();
        } else {
          console.warn('chapter-link click failed: videoId=', videoId, 'time=', time);
        }
      });

      // ===== v0.5 章節 hover preview popup =====
      this.setupChapterPreview();
    },

    // ===== Phase 3 P3-T1: Service Worker 註冊 + await ready =====
    // Per spec §5.3 + plan P3-T1: frontend must await navigator.serviceWorker.ready
    // before posting SEED_INDEXEDDB (avoid race with SW first activation).
    // Returns Promise that resolves when SW controller is ready.
    async registerServiceWorkerAsync() {
      if (!('serviceWorker' in navigator)) return null;
      // 只在 HTTPS 或 localhost 註冊（GitHub Pages 是 HTTPS）
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') return null;
      try {
        this.initProgress = 'registering_sw';
        const reg = await navigator.serviceWorker.register('./sw.js');
        // Wait for active controller (handles SW install + activate lifecycle)
        await navigator.serviceWorker.ready;
        console.log('✅ SW registered and ready:', reg.scope);
        return reg;
      } catch (err) {
        console.warn('⚠️ SW registration failed:', err);
        throw err;
      }
    },

    // ===== Phase 3 P3-T2: SEED with retry policy =====
    // Per plan P3-T2 (M-5 fixed) + spec §5.3:
    //   - 3 attempts with exponential backoff (1s / 3s / 9s)
    //   - UI banner shows "正在初始化離線功能... (第 N/3 次)" each retry
    //   - Hard fail after 3 attempts → persistent error banner with "重試" button
    //   - Times out each individual attempt at 15s
    //   - Resolves with {written, updated} on success; throws on hard fail
    async seedIndexedDB(videos) {
      const MAX_ATTEMPTS = 3;
      const BACKOFF_MS = [1000, 3000, 9000]; // exponential
      const ATTEMPT_TIMEOUT_MS = 15000;

      this.initProgress = 'seeding';
      let lastErr = null;

      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        this.initAttempt = attempt;
        this.seedBanner = `正在初始化離線功能...（第 ${attempt}/${MAX_ATTEMPTS} 次）`;

        try {
          const controller = navigator.serviceWorker.controller;
          if (!controller) {
            throw new Error('SW controller 還沒 ready（serviceWorker.ready 尚未 resolve）');
          }
          const result = await this.sendSWMessage(
            controller,
            { type: 'SEED_INDEXEDDB', videos: videos || [] },
            ATTEMPT_TIMEOUT_MS
          );
          // Success — clear banner + set state
          this.seedBanner = null;
          this.seedError = null;
          this.swReady = true;
          this.initProgress = 'done';
          console.log(`✅ SEED success (attempt ${attempt}): written=${result.written}, updated=${result.updated}`);
          return result;
        } catch (err) {
          lastErr = err;
          console.warn(`⚠️ SEED attempt ${attempt}/${MAX_ATTEMPTS} failed:`, err.message || err);
          if (attempt < MAX_ATTEMPTS) {
            await new Promise((r) => setTimeout(r, BACKOFF_MS[attempt - 1]));
          }
        }
      }

      // Hard fail after 3 attempts
      this.seedBanner = `❌ 離線功能初始化失敗（已嘗試 ${MAX_ATTEMPTS} 次）`;
      this.seedError = lastErr?.message || String(lastErr) || 'unknown error';
      this.initProgress = 'error';
      throw lastErr;
    },

    // ===== Phase 3 helper: send SW message with reply (MessageChannel correlation) =====
    // Per spec §5.3: SW responds with 'SEED_INDEXEDDB_DONE' (success) or 'SEED_INDEXEDDB_ERROR' (fail).
    //
    // @param {ServiceWorker} controller
    // @param {Object} payload — {type, ...data}
    // @param {number} timeoutMs
    // @returns {Promise<{written:number, updated:number}>}
    sendSWMessage(controller, payload, timeoutMs = 15000) {
      return new Promise((resolve, reject) => {
        const channel = new MessageChannel();
        const tmo = setTimeout(() => {
          reject(new Error(`SW message timeout after ${timeoutMs}ms`));
        }, timeoutMs);

        channel.port1.onmessage = (e) => {
          clearTimeout(tmo);
          const data = e.data || {};
          if (data.type === 'SEED_INDEXEDDB_DONE') {
            resolve({ written: data.written, updated: data.updated });
          } else if (data.type === 'SEED_INDEXEDDB_ERROR') {
            reject(new Error(data.error || 'SEED unknown error'));
          } else {
            reject(new Error(`Unexpected SW reply type: ${data.type}`));
          }
        };

        try {
          // Phase 3 P3-T2 fix: deep clone payload before postMessage.
          // Alpine.data() wraps videos[] in reactive Proxy; postMessage throws
          // DataCloneError when traversing Proxy traps that hold functions,
          // undefined values, or getter-only properties (禮士 18:44 console).
          // structuredClone preserves Date/Map/Set; JSON fallback handles any
          // remaining Alpine Proxy objects. Our payload is plain JSON, so
          // JSON fallback is the common path.
          let safePayload;
          try {
            safePayload = structuredClone(payload);
          } catch (cloneErr) {
            console.warn('[sendSWMessage] structuredClone failed, falling back to JSON:', cloneErr?.message || cloneErr);
            safePayload = JSON.parse(JSON.stringify(payload));
          }
          controller.postMessage(safePayload, [channel.port2]);
        } catch (err) {
          clearTimeout(tmo);
          reject(err);
        }
      });
    },

    // ===== Phase 3 helper: getInitMessage for banner UI =====
    getInitMessage() {
      if (this.initProgress === 'registering_sw') return '⏳ 註冊 Service Worker...';
      if (this.initProgress === 'seeding' && this.seedBanner) return this.seedBanner;
      if (this.initProgress === 'seeding') return '⏳ 初始化離線功能...';
      if (this.initProgress === 'error') return this.seedBanner || '❌ 初始化失敗';
      return '';
    },

    // ===== Phase 3 helper: retrySeed — user-triggered retry on hard fail =====
    async retrySeed() {
      this.seedError = null;
      this.seedBanner = null;
      try {
        await this.seedIndexedDB(this.videos);
      } catch (err) {
        // seedIndexedDB already updated state to error
        console.warn('retrySeed failed:', err);
      }
    },

    // ===== Phase 4 P4-T6: AUTO_CACHE_DONE notif handler =====
    // Per plan P4-T6 (C-4 fixed) + spec §7.6: receive AUTO_CACHE_DONE broadcast from SW.
    // Banner "✨ 自動下載 N 支新影片" only shows if should_notify === true (per P2-T4 dedupe rule).
    // Silent log only when should_notify=false (24h dedup window OR newVideos=0).
    // Banner auto-dismisses after 8s; user can click to dismiss earlier.
    //
    // @param {Object} data - {cached_count, total_bytes, duration_ms, dedup_skipped, should_notify}
    handleAutoCacheDone(data) {
      this.autoCacheLastDoneAt = new Date().toISOString();
      if (data.should_notify) {
        const count = data.cached_count || 0;
        const bytes = data.total_bytes || 0;
        const kb = (bytes / 1024).toFixed(1);
        this.autoCacheBanner = {
          message: `✨ 自動下載 ${count} 支新影片（約 ${kb} KB）`,
          count,
          bytes,
        };
        // Auto-dismiss after 8s (capture current count to avoid stale dismissal)
        setTimeout(() => {
          if (this.autoCacheBanner && this.autoCacheBanner.count === count) {
            this.autoCacheBanner = null;
          }
        }, 8000);
        console.log(`✅ [AUTO_CACHE_DONE] banner shown: ${count} 新影片`);
      } else {
        // Dedup window (24h since last_auto_cache_notification) or newVideos === 0
        console.log(`🔕 [AUTO_CACHE_DONE] silent (should_notify=false): ${data.cached_count} cached, dedupe=${data.dedup_skipped}`);
      }
    },

    dismissAutoCacheBanner() {
      this.autoCacheBanner = null;
    },

    // ===== Phase 3 P3-T3: downloadVideo — fires SW CACHE_VIDEO handler (P1-T2) =====
    // Per plan P3-T3 + spec §7.1: ⬇ button enable gating until SW + SEED ready.
    // Called from future button (P5 Toolbar) via @click="downloadVideo(video.id)"
    // and gated via :disabled="!downloadEnabled".
    // Uses MessageChannel correlation via sendSWMessage (Phase 3 helper, see above).
    async downloadVideo(id) {
      if (!this.swReady) {
        console.warn('Download disabled: SW not ready yet');
        return;
      }
      if (!id) {
        console.warn('downloadVideo: id required');
        return;
      }
      try {
        const controller = navigator.serviceWorker.controller;
        if (!controller) throw new Error('SW controller not ready');
        const result = await this.sendSWMessage(
          controller,
          { type: 'CACHE_VIDEO', id },
          60000  // 60s for markdown + thumbnail fetch (per handleCacheVideo 13-step)
        );
        if (result.ok) {
          console.log(`✅ Downloaded ${id}: markdownOk=${result.markdownOk}, thumbnailOk=${result.thumbnailOk}`);
        } else {
          console.warn(`⚠️ Partial download for ${id}:`, result);
        }
      } catch (err) {
        console.error(`❌ Download ${id} failed:`, err);
      }
    },

    // ===== Marked extension: 章節時間戳 MM:SS → chapter-link =====
    registerChapterLinkExtension() {
      if (!window.marked) return;
      // marked v12 沒有 getExtensions() API，用 flag 避免重複註冊
      if (window._chapterLinkRegistered) return;
      window._chapterLinkRegistered = true;

      window.marked.use({
        extensions: [{
          name: 'chapterLink',
          level: 'inline',
          // 找 src 中「前一個字元不是 : / 數字 / 表格分隔」+ MM:SS + word boundary
          start(src) {
            const m = src.match(/(^|[^:\/\d|])\b(\d{1,2}):(\d{2})\b/);
            return m ? m.index + m[1].length : undefined;
          },
          tokenizer(src) {
            // marked v12 inline tokenizer 的 src 是從 start() 回傳位置開始的子字串
            // src[0] 應該是 MM:SS 的 M → 加 ^ 錨點避免 match 後面的 MM:SS
            const m = /^(\d{1,2}):(\d{2})(?!\d|:)/.exec(src);
            if (!m) return undefined;
            // 後一個字元不能是英文字母或 | (markdown table cell)
            const next = src[m[0].length];
            if (next && /[a-zA-Z|]/.test(next)) return undefined;
            // 合理性檢查：分秒必須 < 60
            const minutes = parseInt(m[1], 10);
            const seconds = parseInt(m[2], 10);
            if (minutes > 59 || seconds > 59) return undefined;
            return {
              type: 'chapterLink',
              raw: m[0],
              minutes,
              seconds,
            };
          },
          renderer(token) {
            const totalSeconds = token.minutes * 60 + token.seconds;
            return `<a href="#" class="chapter-link" data-time="${totalSeconds}">${token.raw}</a>`;
          },
        }],
      });
    },

    // ===== Body scroll lock（fullscreen modal 開啟時鎖背景滾動）=====
    setBodyOverflow(locked) {
      // 用 class 控制，避免 inline style 在 SPA-like 操作時殘留
      if (locked) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    },

    async loadData() {
      // 優先 raw GitHub（永遠是最新），jsDelivr 為 fallback (避免 cache 延遲問題)
      let data = null;
      let lastErr = null;
      for (const url of [LOCAL_JSON_URL, RAW_JSON_URL, JSON_URL]) {
        try {
          const resp = await fetch(url, { cache: 'no-cache' });
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          data = await resp.json();
          console.log(`✅ Loaded from ${url}`);
          break;
        } catch (e) {
          lastErr = e;
          console.warn(`Failed ${url}: ${e.message}`);
        }
      }
      if (!data) {
        document.querySelector('main').innerHTML = `
          <article>
            <h3>⚠️ 無法載入影片 metadata</h3>
            <p>錯誤：${lastErr?.message || 'unknown'}</p>
            <p>請確認 <a href="${JSON_URL}" target="_blank">${JSON_URL}</a> 可訪問</p>
          </article>
        `;
        return;
      }
      this.meta = data.meta;
      // 為每個 video 預先抽出 YouTube ID（hover preview 縮圖 URL 用）
      this.videos = data.videos.map(v => ({
        ...v,
        yt_id: this.extractYouTubeId(v.video_url),
      }));
      // 初始化 Fuse.js（fuzzy search）
      this.fuse = new Fuse(this.videos, {
        keys: [
          { name: 'title', weight: 0.5 },
          { name: 'speaker', weight: 0.3 },
          { name: 'primary_topic', weight: 0.2 },
          { name: 'course_slug', weight: 0.1 },
        ],
        threshold: 0.5,
        ignoreLocation: true,
        minMatchCharLength: 1,
      });
      console.log(`✅ 載入 ${this.videos.length} 支影片 metadata`);
    },

    // ===== Filters =====
    applyFilters() {
      let result = [...this.videos];

      // 1. Search (Fuse.js fuzzy)
      if (this.searchQuery.trim()) {
        const fuseResults = this.fuse.search(this.searchQuery.trim());
        result = fuseResults.map(r => r.item);
      }

      // 2. Category
      if (this.filters.category) {
        result = result.filter(v => v.category === this.filters.category);
      }

      // 3. Speaker
      if (this.filters.speaker) {
        result = result.filter(v => v.speaker === this.filters.speaker);
      }

      // 4. Topic
      if (this.filters.topic) {
        result = result.filter(v => v.primary_topic === this.filters.topic);
      }

      // 4b. Course (B3 scheme 2026-07-05: course_slug filter for Harvard CS224 / Stanford CS336)
      if (this.filters.course) {
        result = result.filter(v => v.course_slug === this.filters.course);
      }

      // 5. Date Range
      if (this.filters.dateRange !== 'all') {
        const now = new Date();
        const days = { '30d': 30, '90d': 90, '6m': 180, '1y': 365 }[this.filters.dateRange];
        const cutoff = new Date(now.getTime() - days * 86400 * 1000);
        result = result.filter(v => new Date(v.date) >= cutoff);
      }

      // 5b. Link Status (v1.8 2026-07-14) — filter 有/無 YouTube URL 的影片
      if (this.filters.linkStatus === 'with_link') {
        result = result.filter(v => !!v.video_url);
      } else if (this.filters.linkStatus === 'no_link') {
        result = result.filter(v => !v.video_url);
      }

      // 6. Sort
      result.sort((a, b) => {
        switch (this.sort) {
          case 'date_desc':
          case 'date_asc': {
            // 對同 date 影片（CS224 系列：同 2016-07-11 上傳），優先按 Lecture 編號 asc
            // 用 note_date 優先（frontmatter 整理日期權威），fallback 到 date（filename 抽的）
            // 修 2026-07-03：Lecture 23-26 filename 用 20160712_ prefix，但實際 frontmatter 寫 2016-07-11
            // 如果用 date 會把 Lecture 23-26 排在 Lecture 1-22 前面（錯誤）
            const dateA = a.note_date || a.date;
            const dateB = b.note_date || b.date;
            if (dateA === dateB) {
              if (a.lec_num != null && b.lec_num != null) return a.lec_num - b.lec_num;
              if (a.lec_num != null) return -1;
              if (b.lec_num != null) return 1;
            }
            return this.sort === 'date_desc'
              ? dateB.localeCompare(dateA)
              : dateA.localeCompare(dateB);
          }
          case 'duration_desc': return (b.duration_seconds || 0) - (a.duration_seconds || 0);
          case 'duration_asc': return (a.duration_seconds || 0) - (b.duration_seconds || 0);
          case 'lec_num_asc': {
            // Lecture 編號 asc（沒 lec_num 的排最後，如 guest lecture 或非課程影片）
            const lecA = a.lec_num ?? 9999;
            const lecB = b.lec_num ?? 9999;
            if (lecA !== lecB) return lecA - lecB;
            // tiebreaker: 用 date asc（同 lec_num 時舊的優先）
            const dateA = a.note_date || a.date;
            const dateB = b.note_date || b.date;
            return dateA.localeCompare(dateB);
          }
          default: return 0;
        }
      });

      this.filteredVideos = result;
    },

    resetFilters() {
      this.searchQuery = '';
      this.filters = { category: '', speaker: '', topic: '', course: '', dateRange: 'all' };
      this.sort = 'date_desc';
      this.applyFilters();
    },

    setSort(s) {
      this.sort = s;
      this.applyFilters();
    },

    // Course filter 變動時自動切 sort
    // 選 CS224 / CS336 / NTU FAI → sort = lec_num_asc（Lecture/FAI 順序）
    // 切回「全部課程」→ sort 不變（保留 user 自己的選擇）
    onCourseChange() {
      const c = this.filters.course;
      if (c === 'Stanford CS336' || c === 'Harvard CS224' || c === 'NTU 人工智慧導論') {
        this.sort = 'lec_num_asc';
      }
      this.applyFilters();
    },

    // ===== URL Helpers =====
    // 對中文檔名做 URL 編碼（保留 / 不被編碼）
    encodePath(p) {
      return p.split('/').map(encodeURIComponent).join('/');
    },

    getAudioUrl(video, format) {
      const path = video.audio[format];
      if (!path) return '';
      // 從 data/video-notes.json 的 audio 欄位（"audio/xxx.m4a"）轉 jsDelivr URL
      return `${CDN_BASE}/${this.encodePath(path)}`;
    },

    getTranscriptUrl(video) {
      if (!video.transcripts.transcript) return '';
      return `${CDN_BASE}/${this.encodePath(video.transcripts.transcript)}`;
    },

    getSpokenScriptUrl(video) {
      if (!video.transcripts.spoken_script) return '';
      return `${CDN_BASE}/${this.encodePath(video.transcripts.spoken_script)}`;
    },

    // 主题樣式顯示（去除 ** markdown 強調跟 zero-width space）
    // 不去除 emoji：保留 🌍 🚀 🧠 等讓使用者一眼看出分類
    // 不寫 ^\W+ 跟因為 JavaScript \w 不包含中文 / emoji，會把全部內容砍掉
    cleanTopic(t) {
      if (!t) return null;
      return t.replace(/\*\*|\u200b/g, '').trim();
    },

    // 講者顯示（將 slug 中的底線轉空格）
    // 2026-07-06：speaker 已經是 clean name（不再含括號描述），所以直接回傳
    // 但如果有 speaker_description（如 "Google 軟體工程師"），用 title 顯示為 tooltip
    formatSpeaker(slug, full, description) {
      let name;
      if (full) {
        name = full;
      } else {
        name = (slug || '').replace(/_/g, ' ');
      }
      if (description && description.length > 2 && description.length < 100) {
        const escaped = description.replace(/"/g, '&quot;').replace(/</g, '&lt;');
        return `<span title="${escaped}">${name}</span>`;
      }
      return name;
    },

    // ===== Inline Expand =====
    async toggleExpand(videoId) {
      if (this.expanded[videoId]) {
        this.closeExpand(videoId);
        return;
      }
      this.expanded[videoId] = true;
      // fullscreen modal 開啟時鎖背景滾動（避免主頁在背後滾動）
      this.setBodyOverflow(true);
      // 預設顯示筆記 tab
      if (!this.activeTabs[videoId]) {
        this.activeTabs[videoId] = 'note';
      }
      // lazy load 該 tab 的內容
      await this.loadContent(videoId, this.activeTabs[videoId]);
    },

    // 收合 / 展開影片（左欄 → 右欄 notes 自動撐滿寬度）
    toggleCollapse(videoId) {
      this.videoCollapsed[videoId] = !this.videoCollapsed[videoId];
    },

    async switchTab(videoId, tabType) {
      this.activeTabs[videoId] = tabType;
      await this.loadContent(videoId, tabType);
    },

    getTabClass(videoId, tabType) {
      const active = this.activeTabs[videoId] === tabType;
      return active ? 'active' : 'secondary outline';
    },

    hasContent(videoId, tabType) {
      return !!this.contentCache[`${videoId}_${tabType}`];
    },

    async loadContent(videoId, type) {
      const cacheKey = `${videoId}_${type}`;
      if (this.contentCache[cacheKey]) return; // 已載入過

      const video = this.videos.find(v => v.id === videoId);
      if (!video) return;

      let url = '';
      if (type === 'note') url = video.note_path;
      else if (type === 'transcript') url = video.transcripts.transcript;
      else if (type === 'spoken') url = video.transcripts.spoken_script;

      if (!url) return;

      this.loadingContent[videoId] = true;
      try {
        const fullUrl = `${CDN_BASE}/${this.encodePath(url)}`;
        const resp = await fetch(fullUrl);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const text = await resp.text();

        // raw text 存 cache
        this.contentCache[cacheKey] = text;

        // markdown 才 render
        if (type === 'note') {
          const html = window.marked.parse(text);
          this.renderedContent[cacheKey] = window.DOMPurify.sanitize(html);
        }
      } catch (e) {
        console.error(`Failed to load ${type} for ${videoId}:`, e);
        this.contentCache[cacheKey] = `⚠️ 載入失敗：${e.message}`;
      } finally {
        this.loadingContent[videoId] = false;
      }
    },

    closeExpand(videoId) {
      this.expanded[videoId] = false;
      // 收合影片狀態也一併清掉（下次開啟是預設展開）
      this.videoCollapsed[videoId] = false;
      // 關閉 modal → 解除背景滾動鎖
      this.setBodyOverflow(false);
      // 關閉 modal → 隱藏 hover preview popup
      this.hideChapterPreview();
    },

    closeAllExpands() {
      this.expanded = {};
      this.videoCollapsed = {};
      this.setBodyOverflow(false);
    },

    // YouTube embed URL 抽取
    // 支援 youtu.be/xxx、youtube.com/watch?v=xxx、youtube.com/live/xxx
    // 加 enablejsapi=1 啟用 IFrame Player API（章節時間戳跳轉用 seekTo）
    getYouTubeEmbedUrl(video) {
      if (!video || !video.video_url) return null;
      const url = video.video_url;
      let videoId = null;
      let m;

      // youtu.be/{id}
      m = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (m) videoId = m[1];

      // youtube.com/watch?v={id}
      if (!videoId) {
        m = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
        if (m) videoId = m[1];
      }

      // youtube.com/live/{id} (livestream)
      if (!videoId) {
        m = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/);
        if (m) videoId = m[1];
      }

      if (!videoId) return null;
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1`;
    },

    // 透過 YouTube IFrame Player API seek 跳到指定秒數
    // 章節時間戳 link 點擊時呼叫
    seekYouTube(videoId, seconds) {
      const iframe = document.getElementById(`youtube-iframe-${videoId}`);
      if (!iframe || !iframe.contentWindow) return;
      try {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds] }),
          '*'
        );
      } catch (e) {
        console.warn('YouTube seekTo failed:', e);
      }
    },

    // 從 video_url 抽出真實 YouTube video ID（給 hover preview 組縮圖 URL）
    extractYouTubeId(url) {
      if (!url) return null;
      let m = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (m) return m[1];
      m = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
      if (m) return m[1];
      m = url.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/);
      if (m) return m[1];
      return null;
    },

    // ===== Thumbnail fallback (v1.7 2026-07-14) =====
    // 對於 article / podcast / 暫缺 YouTube URL 的影片，產生 inline SVG 縮圖，
    // 用 category 對應 emoji + speaker 名字，避免 404 request + 純黑卡片
    _thumbnailPlaceholderCache: new Map(),
    thumbnailUrl(video) {
      const ytId = video?.yt_id;
      if (ytId) {
        return `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
      }
      // SVG fallback — 區分 category 給不同 icon & 背景
      const cat = video?.category || '';
      const speaker = (video?.speaker || '').substring(0, 14);
      const date = video?.date || '';
      let bgGrad = '#1f2937';
      let icon = '🎬';
      let label = cat || '文章 / 訪談';
      if (cat.includes('訪談')) {
        bgGrad = '#312e81';
        icon = '🎙';
        label = 'Podcast / 訪談';
      } else if (cat.includes('財經')) {
        bgGrad = '#7c2d12';
        icon = '📰';
        label = '財經分析';
      } else if (cat.includes('國際') || cat.includes('歷史') || cat.includes('政治')) {
        bgGrad = '#0c4a6e';
        icon = '🌐';
        label = cat;
      } else if (cat.includes('技術')) {
        bgGrad = '#064e3b';
        icon = '⚙️';
        label = '技術筆記';
      }
      // cache: key by category+speaker+date (避免每次 render 重算 SVG)
      const cacheKey = `${bgGrad}|${icon}|${label}|${speaker}|${date}`;
      if (this._thumbnailPlaceholderCache.has(cacheKey)) {
        return this._thumbnailPlaceholderCache.get(cacheKey);
      }
      const safeSpeaker = speaker.replace(/[<>&"']/g, c =>
        ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
      const safeLabel = label.replace(/[<>&"']/g, c =>
        ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&#39;'}[c]));
      const svg =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">` +
        `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
        `<stop offset="0%" stop-color="${bgGrad}"/>` +
        `<stop offset="100%" stop-color="#0f172a"/>` +
        `</linearGradient></defs>` +
        `<rect width="320" height="180" fill="url(#g)"/>` +
        `<text x="160" y="80" text-anchor="middle" font-size="56" fill="#fff" opacity="0.85">${icon}</text>` +
        `<text x="160" y="125" text-anchor="middle" font-size="16" fill="#cbd5e1" font-family="sans-serif">${safeLabel}</text>` +
        `<text x="160" y="148" text-anchor="middle" font-size="13" fill="#94a3b8" font-family="sans-serif">${safeSpeaker}</text>` +
        (date ? `<text x="160" y="167" text-anchor="middle" font-size="11" fill="#64748b" font-family="sans-serif">${date}</text>` : '') +
        `</svg>`;
      const dataUri = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
      this._thumbnailPlaceholderCache.set(cacheKey, dataUri);
      return dataUri;
    },

    onThumbnailError(event, video) {
      // 當 YouTube maxresdefault/hqdefault 都 404（例如 video 已被刪），
      // fallback 到 inline SVG placeholder，避免 console 紅字 + 黑卡
      try {
        event.target.src = this.thumbnailUrl(video);
        event.onerror = null;
      } catch (e) {
        // silent fail
      }
    },

    // ===== 章節 hover preview popup（v0.5 2026-06-29）=====
    _chapterPreviewEl: null,  // singleton popup element

    setupChapterPreview() {
      // 建立 popup element（一次性）
      if (this._chapterPreviewEl) return;
      const popup = document.createElement('div');
      popup.className = 'chapter-preview-popup';
      popup.innerHTML = '<img class="chapter-preview-img" alt="" referrerpolicy="no-referrer"><div class="chapter-preview-caption"></div>';
      document.body.appendChild(popup);
      this._chapterPreviewEl = popup;

      // mouseover：顯示 popup
      document.addEventListener('mouseover', (e) => {
        const link = e.target.closest('.chapter-link');
        if (!link) return;
        this.showChapterPreview(link);
      });

      // mouseout：隱藏 popup
      document.addEventListener('mouseout', (e) => {
        const link = e.target.closest('.chapter-link');
        if (!link) return;
        // 檢查 relatedTarget（滑鼠移到的下一個元素）是否還在 chapter-link 內
        const related = e.relatedTarget;
        if (related && link.contains(related)) return;
        this.hideChapterPreview();
      });
    },

    showChapterPreview(link) {
      const popup = this._chapterPreviewEl;
      if (!popup) return;
      // 從 markdown-body 拿真實 YouTube ID（hover preview 縮圖 URL 用）
      const body = link.closest('.markdown-body');
      const ytId = body?.dataset.ytId;
      const time = parseInt(link.dataset.time, 10);
      if (!ytId || isNaN(time)) return;

      // 設 YouTube 縮圖（先試 maxres，失敗 fallback hqdefault）
      const img = popup.querySelector('.chapter-preview-img');
      const imgUrl = `https://i.ytimg.com/vi/${ytId}/maxresdefault.jpg`;
      if (img.src !== imgUrl) {
        img.onerror = () => {
          img.onerror = null;
          img.src = `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`;
        };
        img.src = imgUrl;
      }

      // 設 caption
      popup.querySelector('.chapter-preview-caption').textContent = `${this.formatTime(time)}`;

      // 定位（hover 元素正上方）
      const rect = link.getBoundingClientRect();
      popup.style.display = 'block';
      popup.style.left = `${rect.left + rect.width / 2}px`;
      // popup 高度 = img 135 + caption ~38 + gap 8 = 181
      popup.style.top = `${rect.top - 181}px`;

      // 邊界檢查：popup 不能超出視窗頂部
      const popupRect = popup.getBoundingClientRect();
      if (popupRect.top < 8) {
        // 改為顯示在 hover 元素下方
        popup.style.top = `${rect.bottom + 8}px`;
      }
    },

    hideChapterPreview() {
      if (this._chapterPreviewEl) {
        this._chapterPreviewEl.style.display = 'none';
      }
    },

    // 秒數 → MM:SS 或 HH:MM:SS
    formatTime(seconds) {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      return `${m}:${s.toString().padStart(2, '0')}`;
    },

    // ===== Theme =====
    applyTheme() {
      const html = document.documentElement;
      if (this.theme === 'dark') {
        html.setAttribute('data-theme', 'dark');
      } else if (this.theme === 'light') {
        html.setAttribute('data-theme', 'light');
      } else {
        // auto: 跟系統
        html.setAttribute('data-theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      }
    },

    toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      this.theme = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', this.theme);
      this.applyTheme();
    },
  }));
});