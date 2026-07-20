# Offline Mode Implementation Plan (v2 — post Mame review pass 1 fixes)

> Plan for: [`../superpowers/specs/2026-07-20-offline-mode-design.md`](../superpowers/specs/2026-07-20-offline-mode-design.md)
> Generated: 2026-07-20 (original v1)
> Revised: 2026-07-20 (v2 — post Mame plan review pass 1)
> Revised by: Ryo ⚙️🐱 (Backend cat)
> Status: v2 ready for Mame plan review pass 2
> Audit JSON (pass 1): [`qa-offline-mode-impl-plan-2026-07-20.json`](./qa-offline-mode-impl-plan-2026-07-20.json) — 31 issues (5 critical / 12 major / 14 minor)

---

## Revision v1 → v2 (post audit pass 1)

This revision addresses the 5 critical + 12 major issues identified in Mame's first review pass. The 14 minor issues are tracked in the audit JSON and folded into Phase 8 (Open Questions + Spec Finalization).

**Critical fixes**:
- C-1: Phase 7/8 dependency graph reversed — Phase 7 split into 7a (Testing) and 7b (Deploy), with Phase 8 (Open Questions + Spec Finalization) inserted between them
- C-2: Duplicate task P0-T1 = P6-T1 resolved — P0-T1 retained (canonical), P6-T1 dropped (renumbered from T5 to T4)
- C-3: Spec §7.7 Settings Panel added as Phase 5 extension (P5-T5 to P5-T8)
- C-4: Spec §7.3 / §7.4 / §7.6 UIs assigned: §7.3 storage indicator → Phase 5 (P5-T9), §7.4 offline banner → Phase 3 (P3-T4), §7.6 auto cache notification → Phase 4 (P4-T6)
- C-5: P1-T7 switched from TypeScript to JSDoc typedef — zero build cost, IDE support works in vanilla JS

**Major fixes** (12):
- M-1/M-2: P6-T4+P6-T5 unified into "stale-state recovery routine" with SW-side primary (option a) + frontend-side secondary (option b)
- M-3: Phase 7 extended with §10.2 Staging (P7-T8) + §10.4 Monitor (P7-T9) — production rollout per spec §10
- M-4: P2-T1 updated to cover all 3 auto cache triggers from spec §5.4 (SEED completion + video-notes.json fetch dedupe + SW activate idle)
- M-5: P3-T2 SEED retry policy added (3 attempts + exponential backoff + UI banner)
- M-6: P7-T2 (SW integration tests) expanded from 0.5 hr → 2-3 hr with sub-tasks
- M-7: P7-T4 (E2E tests) expanded from 1 hr → 2-3 hr with 5 sub-scenarios
- M-8: Phase 8 expanded from 1-2 hr → 3-5 hr (10 open questions need time)
- M-9: P8-T3 added (spec version frontmatter)
- M-10: P1-T7 cross-ref with C-5 (TS → JSDoc)
- M-11: P6-T2+P6-T3 (SW lifecycle) moved to Phase 1 as P1-T8 (sw_version init) + P1-T9 (activate sentinel check)
- M-12: P1 risk rewrote — CACHE_VIDEO 9→13 is SW-internal, not breaking for frontend (frontend only sees stage events now)
- M-13: Risks Summary table extended with YouTube CORS / QuotaExceededError / jsDelivr 24h cache

**Re-reasoned time estimate**: 28-40 hr → **35-54 hr** (realistic per audit + missing UI features + underestimated testing).

---

## Phase Overview (v2 ordering)

```
Phase 0 (Foundation)
    ↓
Phase 1 (SW Message API + Lifecycle)
    ↓
Phase 2 (SW Background Tasks) ── parallel ──
    ↓                                ↓
Phase 3 (Frontend Init + Offline Banner)
    ↓                                ↓
Phase 4 (State Machine + Auto Cache Notification)  ← §7.6 UI here
    ↓                                ↓
Phase 5 (Toolbar + Settings Panel + Storage Indicator) ← §7.7 + §7.3 UI here
    ↓
Phase 6 (Migration Validation + Stale-State Recovery)
    ↓
Phase 7a (Testing — 4 layers per spec §9) — independent of Phase 8
    ↓                              ↓
Phase 8 (Open Q + Spec Finalization — 3-5 hr) ← can run parallel with 7a
    ↓                              ↓
Phase 7b (Staging + Production Deploy + Monitor)
```

| Phase | 範圍 | 估時 | 依賴前 phase |
|---|---|---|---|
| **0. Foundation** | IndexedDB schema v1→v2 + Cache Storage json-v1 key rename | 2-3 hr | — |
| **1. SW Message API + Lifecycle** | 7 message handlers + SW activate sentinel + shared JSDoc types | 9-13 hr | Phase 0 |
| **2. SW Background Tasks** | Auto cache (3 triggers) + LRU always-on + mutex + dedupe | 5-7 hr | Phase 1 |
| **3. Frontend Init + Offline Banner** | `await sw.ready` + SEED (with retry policy) + offline banner (§7.4) | 2-3 hr | Phase 1 |
| **4. ⬇️ State Machine + Notification UI** | 6 states + stage events + partial handling + auto cache notification (§7.6) | 4-5 hr | Phase 1 + 3 |
| **5. Toolbar + Settings Panel + Storage Indicator** | Toolbar 全域 ⬇️ + Settings Panel (§7.7) + Storage Indicator (§7.3) | 7-10 hr | Phase 1 + 3 |
| **6. Migration Validation + Recovery** | IndexedDB migration validation (delegated to P0-T1) + Stale-state recovery routine (M-1/M-2 unified) | 2-3 hr | Phase 0-5 |
| **7a. Testing (4 layers per §9)** | SW unit + integration + Frontend state machine unit + E2E Playwright + Manual + Lighthouse | 7-12 hr | Phase 1-6 |
| **8. Open Questions + Spec Finalization** | Resolve spec §12 (10 questions) + spec version frontmatter (P8-T3) | 3-5 hr | Phase 7a (can run parallel) |
| **7b. Deploy** | Staging deploy (gh-pages-staging) + Production deploy + Monitor | 3-4 hr | Phase 8 + 7a both done |

**Total**: **35-54 hours** pure implementation

---

## Phase 0: Foundation

### Why first

All downstream message handlers depend on new schema fields. Need schema baseline before any message logic.

### Tasks

| ID | Task | 估時 | Fixed in v2 |
|---|---|---|---|
| P0-T1 | IndexedDB schema migration v1→v2 in `onupgradeneeded`：<br>• 新增 `meta` object store (key-value: `last_seeded_at`, `last_auto_cache_notification`, `sw_version`, `last_lru_at`)<br>• 新增 `videos.last_verified_cache_state` field (init: `null`)<br>• 新增 `sync_queue.batch_id` field (init: `null`)<br>• **必須** data-preserving (既有 records 不能掉) | 1.5-2 hr | unchanged |
| P0-T2 | Cache Storage `json-v1` key rename — only `LOCAL_JSON_URL`, old key 自然 expire | 0.5 hr | unchanged |
| P0-T3 | Fetch handler route update (Section 5.2 strict hostname check) | 0.5 hr | unchanged |

### 驗收

- `npm run test:unit -- schema` passes (jsdom mock)
- Manual: install PWA fresh → IndexedDB created with new schema
- Manual: upgrade PWA from v1.x to v2.x → existing data preserved

---

## Phase 1: SW Message API + Lifecycle (expanded per C-5, M-11, M-12)

### Why after Foundation

7 message handlers depend on Phase 0 schema fields. SW lifecycle behavior (sw_version init + sentinel) needs JSDoc types shared between SW and frontend.

### Tasks

| ID | Task | 估時 | Fixed in v2 |
|---|---|---|---|
| P1-T1 | `SEED_INDEXEDDB(videos[])` handler — 7-step SOP | 1 hr | unchanged |
| P1-T2 | `CACHE_VIDEO(id)` refactor 9 → 13 step with stage events | 2 hr | unchanged |
| P1-T3 | `CACHE_BATCH(ids[], options)` + `CANCEL_BATCH(batchId)` — AbortController race | 3 hr | unchanged |
| P1-T4 | `UNCACHE_VIDEO(id)` / `GET_CACHE_STATUS()` / `CLEAR_ALL_CACHE()` — verify unchanged | 0.5 hr | unchanged |
| P1-T5 | `AUTO_CACHE_DONE` schema + `shouldNotify` + `newVideos` | 0.5 hr | unchanged |
| P1-T6 | `LRU_EVICTED` message schema | 0.5 hr | unchanged |
| P1-T7 | **Shared message types via JSDoc typedef** — `types/sw-message.js` exported `@typedef SWMessage union` + SW runtime imports for IDE support. **Zero build cost** — works in vanilla JS project. | 1 hr | **C-5 fixed**: TS → JSDoc |
| P1-T8 | **`meta.sw_version` initialization on SW install/activate** (moved from P6-T2 per M-11) — write `meta.sw_version = current_version` (e.g. `v2.0-offline`) | 0.5 hr | **M-11 fixed**: moved from Phase 6 |
| P1-T9 | **SW activate sentinel check** (moved from P6-T3 per M-11) — if `meta.sw_version` missing or mismatched → clear cache + trigger re-SEED via stale-state recovery (Phase 6 routine) | 1 hr | **M-11 fixed**: moved from Phase 6 |

### Risks (rewritten per M-12)

| Risk | Severity | Mitigation |
|---|---|---|
| CACHE_VIDEO stage events not backward-compat with pre-v2 frontend | high | (a) SW update waits for in-flight CACHE_VIDEO to complete via `event.waitUntil()` before activating new SW. (b) Frontend `app.js` upgrade coupled with SW upgrade — both versioned in same git commit. (c) Stage events emitted in addition to (not instead of) old `progress: 0..100` event for one release. |
| CACHE_BATCH AbortController race (cancel mid-flight) | medium | Unit test concurrent batch + CANCEL_BATCH + verify sync_queue 狀態 |
| Frontend JSDoc types drift from SW runtime message format | medium | `types/sw-message.js` shared file; SW imports via dynamic `import()` for IDE support; CI lint check |

### 驗收

- Unit test: 7 message handlers
- Integration test: SEED → CACHE_VIDEO roundtrip
- SW activate sentinel test: simulate v1 → v2 upgrade, verify re-SEED triggered

---

## Phase 2: SW Background Tasks (updated per M-4)

### Tasks

| ID | Task | 估時 | Fixed in v2 |
|---|---|---|---|
| P2-T1 | **Auto cache triggered by 3 sources** (M-4 fixed):<br>(a) SEED_INDEXEDDB completion<br>(b) `video-notes.json` fetch complete (with `meta.last_seeded_at` 1h dedupe — if last seed < 1h, skip re-seed)<br>(c) SW `activate` → first idle callback | 2 hr | **M-4 fixed**: added (b) and (c) |
| P2-T2 | LRU always-on + mutex (skip when batch in progress) | 2 hr | unchanged |
| P2-T3 | `manual_cached=true` 神聖不可侵犯 — LRU 規則驗證 | 0.5 hr | unchanged |
| P2-T4 | ShouldNotify 24h cooldown via `meta.last_auto_cache_notification` + `newVideos === 0` rule | 1 hr | unchanged |
| P2-T5 | `meta.last_seeded_at` 1h 去重邏輯 (P2-T1b 內) | 0.5 hr | unchanged |

**Total**: 5-7 hr (up from 4-6 hr due to P2-T1 expansion)

---

## Phase 3: Frontend Init + Offline Banner (updated per M-5, C-4)

### Tasks

| ID | Task | 估時 | Fixed in v2 |
|---|---|---|---|
| P3-T1 | `await navigator.serviceWorker.ready` in `app.js init()` | 0.5 hr | unchanged |
| P3-T2 | **`seedIndexedDB(videos)` call with retry policy** (M-5 fixed): 3 attempts + exponential backoff (1s/3s/9s) + UI banner `正在初始化離線功能... (第 N/3 次)` on each retry + hard fail after 3 with persistent error banner | 1.5 hr | **M-5 fixed**: retry policy |
| P3-T3 | ⬇️ button enable gating (disabled until SEED + SW ready) | 0.5 hr | unchanged |
| P3-T4 | **Offline status banner UI (§7.4)** (C-4 fixed): "online / offline" indicator driven by `navigator.onLine` + SW message channel events. Offline: red banner "你目前離線，部分功能可能受限". | 1 hr | **C-4 fixed**: §7.4 covered |

**Total**: 3-3.5 hr

---

## Phase 4: ⬇️ State Machine + Notification UI (updated per C-4)

### Tasks

| ID | Task | 估時 | Fixed in v2 |
|---|---|---|---|
| P4-T1 | 6 states UI table: initializing / pending / downloading / ready / partial / failed | 1 hr | unchanged |
| P4-T2 | Stage events listener (CACHE_PROGRESS × 2 + CACHE_DONE) | 1.5 hr | unchanged |
| P4-T3 | Progress 計算 (markdown=50%, thumbnail=100%) | 0.5 hr | unchanged |
| P4-T4 | Partial state handling (markdown OK + thumbnail 404 → ⚠️ badge) | 1 hr | unchanged |
| P4-T5 | State machine reducer — unit test 9 events → 6 states | 1 hr | unchanged |
| P4-T6 | **Auto cache complete notification UI (§7.6)** (C-4 fixed): receive `AUTO_CACHE_DONE` message, dispatch banner "✨ 自動下載 N 支新影片" (only if `shouldNotify === true` per P2-T4 dedupe logic) | 1 hr | **C-4 fixed**: §7.6 covered |

**Total**: 5-6 hr

---

## Phase 5: Toolbar + Settings Panel + Storage Indicator (expanded per C-3, C-4)

### Tasks

| ID | Task | 估時 | Fixed in v2 |
|---|---|---|---|
| P5-T1 | batch_id UUID generation | 0.5 hr | unchanged |
| P5-T2 | `CACHE_BATCH` message with options.batchId + concurrency: 3 (default) | 1 hr | unchanged |
| P5-T3 | `CANCEL_BATCH` button during batch in progress | 1 hr | unchanged |
| P5-T4 | `BATCH_DONE` handler + progress bar (Section 7.5) | 0.5 hr | unchanged |
| P5-T5 | **Settings Panel UI (§7.7)** (C-3 fixed) — 5 sub-tasks:<br>• P5-T5a: Toggles for offline mode / auto cache 30 / auto cache viewed / auto cache entire category / notification opt-in (4-5 toggles total)<br>• P5-T5b: Notification cooldown selector (6h/12h/24h/48h) wired to `meta.last_auto_cache_notification` reset<br>• P5-T5c: Storage management buttons (clear cache / clear IndexedDB) → call SW messages<br>• P5-T5d: Diagnostics pane (show IndexedDB size, cache size, last SW version, last sync timestamp)<br>• P5-T5e: Settings persistence (IndexedDB `settings` object store) | 3.5-5 hr | **C-3 fixed**: §7.7 fully covered |
| P5-T6 | **Storage Indicator (§7.3)** (C-4 fixed): toolbar corner indicator "📊 12.3 MB / 已離線 72 支" + click-expand panel showing IndexedDB size aggregation + Cache Storage per-bucket size | 2-3 hr | **C-4 fixed**: §7.3 covered |

**Total**: 8-10 hr (up from 2-3 hr)

---

## Phase 6: Migration Validation + Recovery (rebuilt per C-2, M-1, M-2, M-11)

### Why after Phase 0-5

Phase 6 is now **thin** — it depends on Phase 0 (migration done) + Phase 5 (recovery UI exists). Original Phase 6 had 5 tasks; after fixes:

- P6-T1 (was T2) moved to Phase 1 as P1-T8
- P6-T2 (was T3) moved to Phase 1 as P1-T9
- P6-T1 original (duplicate of P0-T1) DROPPED (C-2 fix)
- P6-T4 original + P6-T5 original UNIFIED (M-1/M-2 fix)

### Tasks

| ID | Task | 估時 | Fixed in v2 |
|---|---|---|---|
| (P0-T1 takes canonical role) | — | — | **C-2 fixed**: no P6-T1 |
| P6-T1 | **IndexedDB migration validation** (new, replaces dropped P6-T1) — on real test data (10-video fixture), verify P0-T1 migration data-preserves without loss or schema corruption. NOT a re-implementation of the migration logic — just validation. | 1 hr | **C-2 fixed**: renamed role |
| P6-T2 | **`recoverFromStaleState()` unified routine** (M-1/M-2 fixed) — single function callable from:<br>(a) SW `activate` event (covers iOS 7-day eviction + version rollback) — SW-side primary<br>(b) Frontend controller (after SEED failure + after explicit version mismatch detection) — defense-in-depth<br>Function: detect state mismatch (cache empty + IndexedDB present, OR version mismatch) → mark `last_verified_cache_state = 'evicted'` → clear cache + reset UI state → re-trigger SEED_INDEXEDDB | 1-1.5 hr | **M-1/M-2 fixed**: single routine + (a) primary + (b) secondary |
| P6-T3 | Integration test for stale-state recovery — simulate IndexedDB + cache mismatch (via Playwright network throttle + IndexedDB manipulation) | 0.5 hr | new |

**Total**: 2-3 hr (down from 4-6 hr due to de-duplication + unification)

---

## Phase 7a: Testing (4 layers per spec §9, updated per M-6, M-7)

### Tasks

| ID | Task | 估時 | Fixed in v2 |
|---|---|---|---|
| P7-T1 | SW unit tests (jsdom + SW mock) for 7 message handlers + Background Tasks LRU/auto cache | 1.5 hr | unchanged |
| P7-T2 | **SW integration tests (Playwright)** — 5 sub-tasks (M-6 expanded):<br>• P7-T2a: SEED_INDEXEDDB roundtrip (0.5 hr)<br>• P7-T2b: CACHE_VIDEO 13-step with partial failure (thumbnail 404) (0.5 hr)<br>• P7-T2c: CACHE_BATCH + CANCEL_BATCH race condition (0.5 hr)<br>• P7-T2d: LRU mutex skips during in-flight batch (0.5 hr)<br>• P7-T2e: AUTO_CACHE_DONE + LRU_EVICTED messages observed correctly (0.5 hr) | 2.5-3 hr | **M-6 fixed**: 0.5 → 2.5-3 hr |
| P7-T3 | Frontend state machine unit tests — 6 states × 9 events | 0.5 hr | unchanged |
| P7-T4 | **E2E (Playwright headless offline simulation)** — 5 sub-scenarios (M-7 expanded):<br>• P7-T4a: First open + auto cache 最近 30 complete (0.5 hr)<br>• P7-T4b: Single ⬇️ → ✅ ready UI (0.5 hr)<br>• P7-T4c: Offline read cache (network throttle disable) (0.5 hr)<br>• P7-T4d: Batch download theme → progress bar → complete (0.5 hr)<br>• P7-T4e: Offline + video metadata update → reopen sync flow (0.5 hr) | 2.5-3 hr | **M-7 fixed**: 1 → 2.5-3 hr |
| P7-T5 | Manual PWA install + offline + cache flow (per platform matrix: iOS Safari / Android Chrome / Desktop Chrome / Desktop Firefox) | 0.5 hr | unchanged |
| P7-T6 | Lighthouse check — perf ≥ 90, a11y ≥ 95, PWA badge | 0.5 hr | unchanged |
| P7-T7 | CACHE_VERSION bump (v1.9-pwa → v2.0-offline) + Pages deploy smoke test | 0.5 hr | unchanged (renamed scope) |

**Total**: 8.5-10 hr

---

## Phase 8: Open Questions + Spec Finalization (expanded per M-8, M-9)

### Tasks

| ID | Task | 估時 | Fixed in v2 |
|---|---|---|---|
| P8-T1 | **Resolve spec §12 open questions** (10 questions) — pre-classified:<br>(a) Already decided in plan (Q5 schema upgrade, Q7 CACHE_VERSION, Q8 AbortController race) — confirm in 5 min each (15 min total)<br>(b) Needs code investigation (Q1 upload_date vs note_date, Q2 LRU 80→60% adaptive, Q3 access_count threshold, Q6 batch concurrency 3 hardcoded value) — 30 min each (2 hr total)<br>(c) Needs product decision (Q4 classification download sync progress UI placement, Q9 SEED retry policy — addressed in P3-T2 already, Q10 next version (v2.0 vs v2.1) bump) — 20 min each (1 hr total) | 3-4 hr | **M-8 fixed**: 1-2 hr → 3-4 hr |
| P8-T2 | If any open question resolves to spec change, commit + push spec + re-run Mame spec review (sister step of plan review) | 0.5-1 hr | unchanged |
| P8-T3 | **Spec version frontmatter** (M-9 fixed, carry-over from spec audit gap #4) — add `version: v1.0` (current) → bump to `v1.1` on any breaking spec change. Update `meta.sw_version` (Phase 1 P1-T8) when version bumped. | 0.25 hr | **M-9 fixed**: explicit task |
| P8-T4 | (minor coverage) — fold 14 minor issues from plan audit into resolution steps where relevant | (rolled into P8-T1 pre-classification) | minor coverage |

**Total**: 3-5 hr (up from 1-2 hr)

---

## Phase 7b: Deploy (rebuilt per M-3)

### Why after Phase 7a + 8

Production deploy must wait for testing to pass (7a) + spec to be finalized (8). Spec changes during Phase 8 may change SW behavior — testing must validate against final spec.

### Tasks

| ID | Task | 估時 | Fixed in v2 |
|---|---|---|---|
| P7-T8 | **Staging deploy (§10.2)** (M-3 added):<br>(a) push to `gh-pages-staging` branch<br>(b) manual smoke test on staging URL (Chrome + Safari)<br>(c) Lighthouse on staging<br>(d) verify staging PWA install + offline flow | 1 hr | **M-3 fixed**: §10.2 staging |
| P7-T9 | **Production monitoring setup (§10.4)** (M-3 added):<br>(a) add `pages_builds` telemetry check (already in pages.yml workflow)<br>(b) add weekly Pages build status report (cron job?)<br>(c) document "1 週 monitor" plan + owner (禮士) — review Pages builds daily for 7 days post-deploy | 1 hr | **M-3 fixed**: §10.4 monitor |
| P7-T10 | Production deploy: `git subtree push --prefix=docs origin gh-pages` + post-deploy smoke test (curl 200, qa JSON reachable, navigation OK) | 0.5 hr | unchanged |
| P7-T11 | Rollout post-mortem — 1 週後回顧 logs + Pages builds status + any issues encountered | 0.5 hr | new |

**Total**: 3 hr

---

## Risks Summary (extended per M-13)

| Phase | Risk | Severity | Mitigation |
|---|---|---|---|
| 0 | IndexedDB migration data loss | high | jsdom mock + manual data preservation test |
| 1 | CACHE_VIDEO stage events not backward-compat | high | `event.waitUntil()` + coupled SW/frontend upgrade |
| 1 | SW activate sentinel falsely fires on benign version bump | medium | version compare uses semver, not string equality |
| 2 | LRU mutex race with batch | high | unit test concurrent scenario |
| 2 | manual_cached accidentally deleted | high (trust) | E2E test explicit case |
| 4 | Cross-platform UI inconsistency (Safari/iOS) | medium | Playwright multi-browser E2E |
| 5 | Settings Panel IndexedDB schema conflict with existing `meta` store | medium | new `settings` object store, separate from `meta` |
| 5 | Storage Indicator `navigator.storage.estimate()` Safari support | medium | fallback to IndexedDB cursor aggregation if estimate() unavailable |
| 6 | iOS 7-day detection manual test only | medium | fail-safe default to full reset |
| 7b | SW auto-update race with Pages deploy | high | cache-bust query params + SW activate order verification |
| All | **YouTube thumbnail CORS** (M-13) — fetch().blob() fail on cross-origin | medium | thumbnail load via `<img>` element + cache via Cache API on `load` event (no CORS call) |
| All | **QuotaExceededError post-LRU** (M-13) — LRU failing to free enough space | medium | unit test: simulate full quota scenario, verify LRU_EVICTED frees sufficient bytes |
| All | **jsDelivr 24h cache** (M-13) — fresh markdown not visible immediately | medium | add cache-bust param on fetch + UX hint "正在更新…" during transition |
| All | **CORS preflight on CACHE_BATCH POST** (M-13) | low | batch uses POST but preflight cached |
| All | IndexedDB quota exceeded on batch | medium | sync_queue.size check before batch start |

---

## Verification Gate

Phase 7a 完成後、進入 Phase 8 之前：
- Re-run Mame plan review (pass 2) per gap #2 spawn-report-then-fix workflow
- Confirm all 5 critical + 12 major fixed (audit JSON should show 0 critical + 0 major remaining)
- If pass 2 finds NEW issues, iterate

Phase 7b 完成後：
- All 4 testing layers pass + Pages smoke test
- Monitor period (7 days) — 禮士 review daily Pages build status

---

## Implementation Order (v2 final)

```
Phase 0
  ↓
Phase 1 (SW Message API + Lifecycle + P1-T8/P1-T9 sw_version)
  ↓
Phase 2 (3 auto cache triggers + LRU + dedupe)
  ↓
Phase 3 (Init SOP + SEED retry + Offline Banner §7.4)
  ↓
Phase 4 (State Machine + Auto Cache Notification §7.6)
  ↓
Phase 5 (Toolbar + Settings Panel §7.7 + Storage Indicator §7.3)
  ↓
Phase 6 (Migration validation + Stale-state recovery routine)
  ↓
Phase 7a (Testing 4 layers per §9)  ← parallel with ─→  Phase 8 (Open Q + spec v1.1)
  ↓                                                          ↓
  └──────────────── Phase 7b (Staging + Production + Monitor) ──┘
```

---

## Open Items — carry-overs tracked

From spec review audit (`qa-offline-mode-design-spec.json`):
- ✅ Gap #1: reviewer_subagent_session capture — **addressed in plan review (pass 1) audit JSON**
- ✅ Gap #2: spawn-report-then-fix two-phase workflow — **this is pass 2**
- ✅ Gap #3: minor issue explicit listing — **listed 14 minor in audit JSON; folded into Phase 8 (P8-T4)**
- ✅ Gap #4: spec version frontmatter — **P8-T3 explicit task added**

---

## Final time estimate: 35-54 hours

(Original 28-40 hr was optimistic; Mame audit identified 4-14 additional hours of unaccounted work in §7.3/7.4/7.6 UIs + §7.7 Settings Panel + underestimated testing sub-tasks + Phase 8 expanded for 10 open questions.)
