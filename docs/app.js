// Video Notes GitHub Pages - Alpine.js App Logic
// Author: Ryo 🐱
// Created: 2026-06-28

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/travisebill/video-notes@main';
const JSON_URL = `${CDN_BASE}/data/video-notes.json`;

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
    },

    async loadData() {
      try {
        const resp = await fetch(JSON_URL);
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        const data = await resp.json();
        this.meta = data.meta;
        this.videos = data.videos;
        // 初始化 Fuse.js（fuzzy search）
        this.fuse = new Fuse(this.videos, {
          keys: [
            { name: 'title', weight: 0.5 },
            { name: 'speaker', weight: 0.3 },
            { name: 'primary_topic', weight: 0.2 },
          ],
          threshold: 0.4,  // 0 = 完全匹配, 1 = 任意匹配
          ignoreLocation: true,
        });
        console.log(`✅ 載入 ${this.videos.length} 支影片 metadata`);
      } catch (e) {
        console.error('Failed to load video-notes.json:', e);
        document.querySelector('main').innerHTML = `
          <article>
            <h3>⚠️ 無法載入影片 metadata</h3>
            <p>錯誤：${e.message}</p>
            <p>請確認 <a href="${JSON_URL}" target="_blank">${JSON_URL}</a> 可訪問</p>
          </article>
        `;
      }
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
    getAudioUrl(video, format) {
      const path = video.audio[format];
      if (!path) return '';
      // 從 data/video-notes.json 的 audio 欄位（"audio/xxx.m4a"）轉 jsDelivr URL
      return `${CDN_BASE}/${path}`;
    },

    getTranscriptUrl(video) {
      if (!video.transcripts.transcript) return '';
      return `${CDN_BASE}/${video.transcripts.transcript}`;
    },

    getSpokenScriptUrl(video) {
      if (!video.transcripts.spoken_script) return '';
      return `${CDN_BASE}/${video.transcripts.spoken_script}`;
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