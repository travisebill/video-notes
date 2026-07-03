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
    meta: { total_videos: 0, speakers_count: 0, topics_count: 0, last_updated: '', speakers: [], categories: [], topics: [] },
    videos: [],
    filteredVideos: [],
    searchQuery: '',
    filters: {
      category: '',
      speaker: '',
      topic: '',
      dateRange: 'all',
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

    // ===== Computed =====
    get sortedSpeakers() {
      return [...this.meta.speakers].sort((a, b) => a.localeCompare(b, 'zh-TW'));
    },
    get sortedTopics() {
      return [...this.meta.topics].sort((a, b) => a.localeCompare(b, 'zh-TW'));
    },

    // ===== Init =====
    async init() {
      // 註冊 Service Worker（PWA 安裝 + 離線快取）
      this.registerServiceWorker();

      // 註冊 marked 章節時間戳 extension（MM:SS → chapter-link）
      this.registerChapterLinkExtension();

      this.applyTheme();
      await this.loadData();
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

    // ===== Service Worker 註冊（PWA 2026-06-29）=====
    registerServiceWorker() {
      if (!('serviceWorker' in navigator)) return;
      // 只在 HTTPS 或 localhost 註冊（GitHub Pages 是 HTTPS）
      if (location.protocol !== 'https:' && location.hostname !== 'localhost') return;
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
          .then((reg) => {
            console.log('✅ SW registered:', reg.scope);
          })
          .catch((err) => {
            console.warn('SW registration failed:', err);
          });
      });
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

      // 5. Date Range
      if (this.filters.dateRange !== 'all') {
        const now = new Date();
        const days = { '30d': 30, '90d': 90, '6m': 180, '1y': 365 }[this.filters.dateRange];
        const cutoff = new Date(now.getTime() - days * 86400 * 1000);
        result = result.filter(v => new Date(v.date) >= cutoff);
      }

      // 6. Sort
      result.sort((a, b) => {
        switch (this.sort) {
          case 'date_desc':
            // 對同 date 影片（CS224 系列：同 2016-07-11 上傳），優先按 Lecture 編號 asc
            if (a.date === b.date) {
              if (a.lec_num != null && b.lec_num != null) return a.lec_num - b.lec_num;
              if (a.lec_num != null) return -1;
              if (b.lec_num != null) return 1;
            }
            return b.date.localeCompare(a.date);
          case 'date_asc':
            if (a.date === b.date) {
              if (a.lec_num != null && b.lec_num != null) return a.lec_num - b.lec_num;
              if (a.lec_num != null) return -1;
              if (b.lec_num != null) return 1;
            }
            return a.date.localeCompare(b.date);
          case 'duration_desc': return (b.duration_seconds || 0) - (a.duration_seconds || 0);
          case 'duration_asc': return (a.duration_seconds || 0) - (b.duration_seconds || 0);
          default: return 0;
        }
      });

      this.filteredVideos = result;
    },

    resetFilters() {
      this.searchQuery = '';
      this.filters = { category: '', speaker: '', topic: '', dateRange: 'all' };
      this.sort = 'date_desc';
      this.applyFilters();
    },

    setSort(s) {
      this.sort = s;
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
    formatSpeaker(slug, full) {
      if (full && full.length < 60) return full;
      return (slug || '').replace(/_/g, ' ');
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