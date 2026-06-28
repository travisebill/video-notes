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

    // ===== Computed =====
    get sortedSpeakers() {
      return [...this.meta.speakers].sort((a, b) => a.localeCompare(b, 'zh-TW'));
    },
    get sortedTopics() {
      return [...this.meta.topics].sort((a, b) => a.localeCompare(b, 'zh-TW'));
    },

    // ===== Init =====
    async init() {
      this.applyTheme();
      await this.loadData();
      this.applyFilters();

      // ESC 鍵關閉所有展開面板
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeAllExpands();
        }
      });
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
      this.videos = data.videos;
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
          case 'date_desc': return b.date.localeCompare(a.date);
          case 'date_asc': return a.date.localeCompare(b.date);
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
        this.expanded[videoId] = false;
        return;
      }
      this.expanded[videoId] = true;
      // 預設顯示筆記 tab
      if (!this.activeTabs[videoId]) {
        this.activeTabs[videoId] = 'note';
      }
      // lazy load 該 tab 的內容
      await this.loadContent(videoId, this.activeTabs[videoId]);
    },

    async switchTab(videoId, tabType) {
      this.activeTabs[videoId] = tabType;
      await this.loadContent(videoId, tabType);
    },

    getTabClass(videoId, tabType) {
      const active = this.activeTabs[videoId] === tabType;
      const loaded = !!this.contentCache[`${videoId}_${tabType}`];
      return active ? (loaded ? '' : 'secondary outline') : 'secondary outline';
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
    },

    closeAllExpands() {
      this.expanded = {};
    },

    // YouTube embed URL 抽取
    // 支援 youtu.be/xxx、youtube.com/watch?v=xxx、youtube.com/live/xxx
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
      return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
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