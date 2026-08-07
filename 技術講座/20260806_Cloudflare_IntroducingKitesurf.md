# Introducing Kitesurf: The agent-first browser that runs in V8 isolates on Cloudflare Workers

**講者｜Cloudflare team（Celso Martinho + Ruskin Constant）**
**影片連結｜https://blog.cloudflare.com/kitesurf/**
**影片長度**｜4:14（254s）
**發布日期｜2026-08-06**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

> Kitesurf 是 Cloudflare 全新發布的 **agent-first browser**，整套系統完全跑在 Cloudflare Workers 之上，專為 AI 代理人設計。本文從動機、設計決策、核心元件、測試覆蓋率、效能數據五個面向，深度剖析這套專為 AI 而生的瀏覽器如何兼顧極低成本與極高擴展性。

> **路徑說明**：本文為 Article 路徑（無影片，僅完整文章來源），章節以 `## Section N｜標題` 編號，不附時間碼。

---

## Section 1｜主題與背景 — Cloudflare 為什麼要做 agent-first browser

Cloudflare 內部每隔幾個月就會重新討論「要不要自己寫一個瀏覽器」這個問題，因為瀏覽器本質上是網際網路的作業系統，重要性無可取代。然而這個構想在過去一直擱置，主要原因在於工程難度過高，且 Cloudflare 找不到獨特的價值主張能讓這個投資值得啟動。

直到兩個變數同時抵達臨界點，事情才徹底翻轉：

- **Workers 平台成熟**：WebAssembly 支援、Dynamic Workers、SQLite-based Durable Objects、Worker-to-worker RPC、Service Bindings、Node.js 相容性與更高的限制，讓過去不可能的複雜應用變得可行。
- **AI 代理人時代來臨**：Browser Run（Cloudflare 的 headless 瀏覽器自動化 API）營收爆發，AI 代理人對瀏覽器的需求成為關鍵瓶頸。

> 12 weeks ago we asked the question again: Should we build our own browser? This time the answer was unanimous: **Yes!**

> 中文翻譯：十二週前 Cloudflare 再次問了同樣的問題：「要不要自己寫一個瀏覽器？」這次答案空前一致：「**要！**」

### 為什麼 Browser Run 不夠？

Browser Run 雖然解決了 AI 代理人需要瀏覽器的問題，卻暴露了更根本的難題：**Chromium 是為人類設計的**，內建的分頁、佈景主題、擴充功能、跨裝置同步，對 AI 毫無意義；然而記憶體與運算消耗卻高得離譜。若每位 AI 代理人都要配備一個 Chromium 實例，雲端成本將高不可攀，導致只有少數頂級模型才能負擔，絕大多數代理應用被拒於門外。

---

## Section 2｜動機與問題 — Chromium 對 agent 太重、token 浪費

Cloudflare 團隊點出三個 Chromium 與 AI 代理人之間的核心矛盾：

| 維度 | 人類需要 | AI 代理人需要 |
|------|----------|---------------|
| 視覺呈現 | 60fps 流暢、像素完美、CSS 解析精準 | 不必要，內容能被解析就夠 |
| 功能配件 | 分頁、佈景主題、擴充套件、跨裝置同步 | 不需要 |
| 威脅模型 | 來自可信來源網站 | 不可信、任意來源、任意程式碼 |
| 重要指標 | 視覺體驗、操作便利性 | token 數量、上下文視窗、擴展性、效能、成本 |

> We should be giving _all_ agents a browser that excels at what's important for an AI model, even if that means being light on what's only useful for humans.

> 中文翻譯：應該給**所有**代理人一個在 AI 模型在乎的維度上表現優異的瀏覽器，即使這意味著在只對人類有用的功能上必須精簡。

新型態的瀏覽器必須以「token 數量、上下文視窗、擴展性、效能、成本」為核心設計，視覺完美不再是目標。同時，威脅模型也徹底改變——prompt injection、工具安全、任意來源程式碼成為新的攻擊面，無法再用「人類不會點這個」的心態處理。

---

## Section 3｜設計決策 — Tests / Rust / Exception / Isolation / Stateless

在進入實作前，Cloudflare 團隊先確立了五大設計原則，這些原則直接決定了 Kitesurf 的架構選擇。

### 3.1 Tests, tests, tests

**測試是 AI 輔助開發的命脈。** Cloudflare 採用 Web Platform Tests（WPT）這套 W3C 標準測試套件作為 agent 的目標基準，讓 AI 代理人在迭代時有明確的對齊標準。然而 WPT 只能驗證標準符合度，無法驗證真實網站的渲染品質，因此團隊再補上 **Puppeteer 整合測試 + 視覺回歸測試**，對 Chromium 與 Kitesurf 並行跑同一批真實網站工作流，比對斷言與每一步的渲染輸出。

### 3.2 Use Rust when possible

**能 Rust 就 Rust。** Workers 對 WebAssembly 的支援已經成熟，但 Emscripten 的多層依賴模擬會讓編譯產物肥大且緩慢。Kitesurf 選擇直接用 `wasm-bindgen` 將 Rust 編譯成 WebAssembly，跳過模擬層，盡可能貼近底層執行，同時兼顧可靠性。

### 3.3 Exception handling

**任何失敗都退化成空白框架，絕不讓 session 整個死亡。** 瀏覽器必須能夠渲染整個不可靠、有時甚至惡意的網路，例外處理不是衛生習慣，而是應用程式能否存活的核心能力。規則是：在每個邊界捕捉錯誤，預設回傳安全且空白的結果，並留下足夠的診斷紀錄。

### 3.4 Isolation

**每個頁面載入都視為不可信輸入。** 與一般筆電瀏覽器（人類造訪的網站通常可信任、資源可共享）不同，AI 代理人的任務需求指向任意來源的任意程式碼。Kitesurf 假設每個 session 從乾淨的環境開始，每個元件都被隔離、只能存取嚴格必要的資源。

> This seems like a perfect fit for Cloudflare Workers, whose security model is built around isolation by design. But the platform only gets us the boundary between isolates. We still have to enforce the same principle at the application level.

> 中文翻譯：這看起來是 Cloudflare Workers 的完美舞台，因為 Workers 的安全模型本身就是圍繞隔離設計的。但平台只給了 isolate 之間的界線，應用層面還必須自己強制執行相同的原則。

### 3.5 Stateless whenever possible

**只要能無狀態就無狀態。** 狀態是讓失敗變貴的根源——若沒有狀態需要重建，從 crash 恢復就只是開一個新的、重發請求而已。無狀態元件本質上就是可拋棄、可平行的：卡住就殺、需要時一次跑一千個、依需求規模調整大小。

> **wherever a component can be stateless, it should be.**

> 中文翻譯：**只要一個元件可以無狀態，它就應該無狀態。**

---

## Section 4｜核心元件 — SandboxOutbound / Engine / PageScript / PageRenderer

Kitesurf 的四大元件各司其職，共同構成一個 request 的生命週期。

### 4.1 SandboxOutbound — 唯一對外發起網路請求的元件

**只有 SandboxOutbound 這個 worker 能接觸網路，其餘元件全部由 Dynamic Workers 強制禁止。** Engine 透過它拉取主文件與腳本，PageScript 透過它拉取 CSS、圖片、字型、頁面內的 `fetch()` 呼叫。SandboxOutbound 負責強制 CORS、注入瀏覽器型態的 header、篩選 response、隔離每頁的 cookie jar。任何違反政策的請求都回 403。

### 4.2 Engine — 唯一對外公開的元件

Engine 處理 Chrome DevTools Protocol（CDP）的 WebSocket 與 HTTP REST API、儲存每個 session 的狀態，所有其他元件都是無狀態的。**採用 CDP 的最大好處是客戶端相容性**：Puppeteer、Playwright、chrome-remote-interface、Chrome DevTools 前端，全部開箱即用。

### 4.3 PageScript — 頁面 JavaScript 與 DOM 執行環境

每個頁面或跨程 iframe（OOPIF）透過 Dynamic Workers 啟動一個長生命週期的 isolate，內含乾淨的 `globalThis` 與 DOM 物件。HTML 與 CSS 解析採用 Blitz 與 Firefox 的 Stylo（兩者皆為 Rust 寫成），JavaScript 與 WebAssembly 在同一個 isolate 內執行。

> **eval 怎麼辦？** Workers 仍不原生支援 eval（基於安全考量），且無法再開新 isolate 處理（會失去 `globalThis` 存取權）。解法是用 Rust 寫的 ECMAScript 引擎 **Boa JS** 在 Workers 中編譯並執行——基本上是在 runtime 上跑 runtime，不算最佳解但堪用，未來 Workers 支援原生 eval 後會遷移。

### 4.4 PageRenderer — 像素產生器

PageRenderer 與 Engine 透過 **loop 協作**：Engine 需要一幀時，PageRenderer 從 PageScript 取得 page object（scene）、從 Static Assets 拉取內部字型與圖片、將全部光柵化為圖片緩衝區，再以 JPEG / PNG / PDF 格式回傳給 Engine。文字排版交給 blitz-paint，其內部使用 Parley 處理字符分佈、字型選擇、斷行。

**Workers 內建 RPC 系統**讓 Engine 透過單次 RPC 呼叫 PageRenderer 的 `renderFrame()`，可直接拿到 PNG。Renderer 不保存任何狀態（僅有可拋棄的快取），因此 Engine 可以安全地殺死並重啟任何卡住或失敗的 RPC 呼叫——每次 render 都是自包含、可重試、isolate cheap and throwaway。

---

## Section 5｜測試覆蓋率 — WPT 215,000+ tests

Kitesurf 已通過超過 **215,000 個 WPT 測試**，且每週還在持續增加。對 AI 代理人特別重要的領域（CSS、DOM、HTML、selection、SVG、XHR）已達到良好覆蓋率；連看似對 agent 不太重要的 Streams 也都有 decent 支援。

下圖展示從專案啟動以來 WPT 通過率的演進曲線（最新版持續上升中）。對重視程式碼品質的工程師而言，這是「讓 AI 代理人大量產出程式碼也能維持品質」的最佳實證——沒有這套測試基礎設施，AI 寫瀏覽器根本不可能。

### 5.1 The most important test of all — Doom 跑得起來

> no matter how many tests you have, a project isn't truly complete until Doom runs on it.

> 中文翻譯：不論有多少測試，一個專案真正完成的標誌是 Doom 跑得起來。

Kitesurf 已經能跑 Cloudflare 之前釋出的 Doom multiplayer Workers 實驗中的 <https://silentspacemarine.com/>，這是工程團隊內部對「瀏覽器真的能跑複雜遊戲」的最終驗證。

---

## Section 6｜效能數據 — CPU / Memory / Wall time 對比表格

以下是 Kitesurf 與 Chromium 在 Browser Run Quick Actions 上，跑同一個 14 個 URL 語料庫五次的中位數比較：

| **指標** | **Kitesurf** | **Chromium（warm pool）** | **Kitesurf 相對優勢** |
|----------|--------------|--------------------------|----------------------|
| CPU：screenshot | 380 ms | 1,173 ms | 比 Chromium 少 3.1× CPU |
| CPU：HTML 抽取 | 229 ms | 877 ms | 比 Chromium 少 3.8× |
| 記憶體：screenshot | 57.8 MiB | 271.0 MiB | 比 Chromium 少 4.7× |
| 記憶體：HTML 抽取 | 39.4 MiB | 273.7 MiB | 比 Chromium 少 7.0× |
| Wall time：screenshot | 1,148 ms | 637 ms | 比 Chromium 慢 1.8× |
| Wall time：HTML 抽取 | 820 ms | 472 ms | 比 Chromium 慢 1.7× |

**Chromium 在 stopwatch 上贏——因為有 JIT 預熱的網頁永遠比冷啟動的軟體渲染器快，目前贏約 1.7 倍**，差距主要來自光柵化與 JPEG/PNG 編碼，團隊會持續優化。

**但 Kitesurf 在記憶體與 CPU（真正影響帳單成本的指標）上贏 3-7 倍。** 較低的記憶體意味著能跑更多 session、擴展性更好，從根本上降低 Cloudflare 與客戶的成本。

> The best way to know if a specific site is compatible with Kitesurf is to try it.

> 中文翻譯：要判斷某個特定網站是否與 Kitesurf 相容，最快的方法就是試試看。

---

## Section 7｜總結 — 給 AI agent 用的瀏覽器設計哲學

Kitesurf 的定位不是要取代 Chromium，而是開闢一個全新的類別：**為 AI 代理人量身打造的 ephemeral、fully-isolated、stateless 引擎，只在任務期間存在，專為突發、AI 驅動的工作負載而生**。

### 7.1 什麼時候該用 Kitesurf？

- AI 代理人需要渲染頁面，且能接受不用完整功能、像素級完美的 Chromium
- 自動化任務與應用，依賴一次性 Quick Actions（從頁面抽取內容、產生 PDF、screenshot）
- 目標是相容網站（TodoMVC、Wikipedia、Hacker News、Cloudflare Blog、Cloudflare Dashboard 等）

### 7.2 什麼時候不該用 Kitesurf？

- 需要播放影片、渲染 WebGL、與真實 TLS fingerprint 進行 bot-challenge 握手
- 需要啟動十分鐘的認證 session 且要求持久狀態
- 上述場景請改用 Browser Run 的預設路徑（Chromium 驅動）

### 7.3 未來路線圖

Kitesurf 僅 12 週大、首個 commit 在 5 月，正在積極發展的方向：

- **更完整的 CDP 覆蓋率**（目前是子集合）
- **渲染 fidelity**（screenshot 與 PDF 品質，LLM 從圖讀比從文字讀更準確）
- **WPT 覆蓋率**（持續迭代，朝 production-ready 邁進）
- **效率**（CPU、記憶體、wall time 持續 benchmark 與優化）

### 7.4 開源承諾

Cloudflare 承諾在準備就緒後將 Kitesurf 開源，讓任何客戶都能在自己的帳號部署自己的版本。

> Think of Kitesurf as an ephemeral, fully-isolated, stateless engine designed to exist only for the duration of a task, that scales well for bursty, AI-driven workloads.

> 中文翻譯：把 Kitesurf 想像成一個 ephemeral、完全隔離、無狀態的引擎，只在任務執行期間存在，並能為突發的 AI 驅動工作負載良好擴展。

---

## Section 8｜金句摘錄

以下五句話最能代表 Kitesurf 的設計哲學，適合獨立引用：

> **1.** Should we build our own browser? This time the answer was unanimous: **Yes!**
> （十二週前 Cloudflare 再次問了同樣的問題，這次答案空前一致：要！）

> **2.** We should be giving _all_ agents a browser that excels at what's important for an AI model, even if that means being light on what's only useful for humans.
> （應該給所有代理人一個在 AI 模型在乎的維度上表現優異的瀏覽器，即使這意味著在只對人類有用的功能上必須精簡。）

> **3.** **wherever a component can be stateless, it should be.**
> （只要一個元件可以無狀態，它就應該無狀態。）

> **4.** any failure degrades to a blank frame or a missing element, never a dead session.
> （任何失敗都退化成空白框架或遺失元素，絕不讓整個 session 直接死亡。）

> **5.** Kitesurf wins on memory and CPU, the things that actually drive your bill, by 3-7x compared to what Chromium uses.
> （Kitesurf 在記憶體與 CPU——真正影響帳單成本的指標——上，比 Chromium 少用 3-7 倍。）

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 4 分 14 秒
> 口播稿原文：transcripts/20260806_Cloudflare_IntroducingKitesurf_口播稿.txt

- [opus 1.0 MB](../audio/20260806_Cloudflare_IntroducingKitesurf_口播稿.opus)（Telegram 友善）
- [m4a 4.0 MB](../audio/20260806_Cloudflare_IntroducingKitesurf_口播稿.m4a)（iOS 友善）
- [mp3 3.9 MB](../audio/20260806_Cloudflare_IntroducingKitesurf_口播稿.mp3)（通用格式）

---

## 參考資料

- **原文連結**：https://blog.cloudflare.com/kitesurf/
- **瀏覽器遊樂場**：https://kitesurf.cloudflare.app/
- **Browser Run 文件**：https://developers.cloudflare.com/browser-run/
- **CDP 端點**：https://developers.cloudflare.com/browser-run/cdp/
- **Web Platform Tests**：https://github.com/web-platform-tests/wpt
- **obscura（啟發 Kitesurf 的 Rust headless 引擎）**：https://github.com/h4ckf0r0day/obscura
- **Blitz（HTML/CSS 解析器）**：https://github.com/DioxusLabs/blitz
- **Boa JS（Rust 寫的 ECMAScript 引擎）**：https://boajs.dev/

---

**中文摘要者**：Ryo（Backend Engineer Agent）
**整理日期**：2026-08-07
**SOP 路徑**：Article（無影片，僅完整文章來源，無時間碼）
