# 【Don't waste time on specs: /prototype instead — 高保真度原型設計如何取代詳細規格】
## 影片基本資訊

> **影片連結：** https://youtu.be/n0VhIVtviC0
> **影片長度：** 10:59（659 秒）
> **上傳日期：** 2026 年 7 月 23 日

**主講｜Matt Pocock（AI Hero 創辦人 / Sandcastle 作者） ／ 2026 年 7 月 23 日**

> 本影片使用 YouTube 繁體中文自動字幕（zh-Hant auto-generated VTT），經清除時間碼、HTML 標籤後得到逐字稿，再由後端整理為結構化筆記。

---

## 一、主題與背景

本影片為 Matt Pocock 的 AI Hero 技能庫系列的延伸 — 繼 2026-07-13 的 `/wayfinder` skill 之後，本集介紹另一個核心技能 `/prototype`。Matt 在影片中反對「spec-driven development」（規範驅動開發）的直覺，認為隨著 LLM 編碼成本大幅下降，**原型設計已成為比詳細規範更便宜、更有效的設計討論工具**。

影片涵蓋三大主軸：

1. **概念基礎**：高保真度 vs 低保真度在設計討論中的邊界 — 簡單問題可由討論解決，複雜問題只能透過原型回答；
2. **工具整合**：`/prototype` 與 `/wayfinder` 的協作 — Wayfinder 的預設是 grill（透過問答界定範圍），但當「看起來怎樣」「如何表現」成為關鍵問題時，切換到 prototype 票種；
3. **實戰 demo**：Matt 在自己的 TLDraw 圖表繪製 app 加搜尋欄時，迭代 4 個版本（A → B → C → D），每版約 10 萬 token，最終合併最佳設計決策成可交接給生產 agent 的高保真資產。

影片核心論點：**討論與規範到可量產程式碼之間的鴻溝，比大多數人以為的更大；而原型，正是縮短這段距離的關鍵工具 — 它不僅是 UI 工具，對純邏輯與狀態機建模同樣不可或缺**。

---

## 二、章節脈絡

### Section 1｜The problem with spec-driven development（00:00 ~ 01:29）

**重點摘要：** 直擊 LLM 編碼時代最常見的反模式 — 把所有精力投入撰寫極詳細規範，卻忘記自己其實可以同時寫程式。

**內容：**
- Matt 對「我需要先寫規範」這件事一直強烈反對
- spec-driven 的衝動：先寫極詳細計畫，期望 LLM 輸出與規範一致
- 但這忽略了：**寫規範的過程中，可以同時寫程式**
- 呼應敏捷開發時代的原型設計 / 探索性開發概念
- 「現在人們都不做原型了」 — Matt 想扭轉這種局面

### Section 2｜Understanding fidelity in design（01:29 ~ 02:55）

**重點摘要：** 設計討論的保真度分級 — 簡單問題（如 modal 應有取消/確認按鈕）透過討論解決；展示資料的方式這類問題，則需要更高保真度（半工作程式碼測試）。

**內容：**
- **低保真度**：基本框架問題，例如「模態框開啟時該有取消/確認按鈕」
- **中保真度**：需要展示資料的情境
- **高保真度**：難以純粹透過規範確定的事物外觀 + 在特定情境的行為方式
- 必須在「半工作程式碼」中測試所有想法 → 需要原型
- 隨著原型生產成本下降，討論可以更精準

### Section 3｜Prototyping in Wayfinder（02:55 ~ 03:57）

**重點摘要：** `/prototype` 是 Wayfinder skill 的一部分，處理「規劃大量工作並拆分成不同規劃會議」的情境；票種預設是 grill（對話界定範圍），需要時切換到 prototype（用工件回答）。

**內容：**
- Wayfinder 處理大批工作，拆分成不同規劃會議（票）
- **兩種票種**：
  - **Grill 票（預設）**：與 agent 對話釐清基本範圍
  - **Prototype 票**：製作廉價、粗糙、具體的工件來回答問題
- 切換條件：「它應該看起來怎麼樣」「它應該如何表現」成為關鍵問題時
- 即使不用 Wayfinder，prototype skill 仍是清楚的標準告訴你何時該做原型

### Section 4｜Building a search bar prototype（03:57 ~ 06:15）

**重點摘要：** 實戰 demo — Matt 為 TLDraw 圖表繪製 app 加搜尋欄，資料模型複雜（圖表 + 時間快照），所以做 prototype：生成 A/B/C 三個版本，包含不同設計決策的 UI 邏輯代碼。

**內容：**
- 應用情境：為複雜資料模型（圖表 + 時間快照）加搜尋欄
- 不確定 UI 外觀和功能 → 啟動 prototype
- 底部小選擇器切換 A/B/C 三個版本
- **A 版本**：搜尋框置中，按圖表名稱分組快照（原地重排）
- **B 版本**：左側分組可向下篩選；搜尋不同關鍵字時篩選自動重置
- **C 版本**：頂部搜尋圖表，但 Matt 不太喜歡這個設計
- 本次 prototype 使用約 **10 萬 token**
- 關鍵原則：**保留所有版本的所有設計決策**，只給反饋，不丟棄任何東西

> 「本次會議的目的是要對這個原型進行迭代⋯⋯所有這些設計決策都將被編碼到原型中，我可能會將原型保存在一個臨時分支上。」

### Section 5｜Iterating on the prototype（06:15 ~ 08:00）

**重點摘要：** 從 A/B/C 收斂到 D — 給出口頭反饋，prototype 自動產出 D 版本，繼承 A 的搜尋框 + C 的佈局；prototype 與即時頁面整合，給予「實時運作」的真實感。

**內容：**
- **精簡（compact）時機**：原型已建立所有設計決策，下一步是給反饋 + 做 QA
- 反饋：「非常喜歡 A 的搜尋框，也很喜歡 C 的佈局」
- D 版本：A 搜尋框 + C 佈局合併 = A 的盒子 + 搜尋結果顯示完整功能
- **關鍵設計**：prototype 不是隨意丟棄的，而是與即時頁面整合（live routing）
  - 給予實際程式碼運作方式的真實寫照
  - 更大的靈活性

### Section 6｜From prototype to production（08:00 ~ 08:53）

**重點摘要：** prototype 完成後交給掛機 agent — 連接所有東西、刪除舊 prototype code、確認符合原始規範；由於討論已經高保真度，反饋已寫入臨時分支，實作者可直接參考。

**內容：**
- prototype 完成後的標準流程：
  - 把工作交給掛機 agent
  - 連接所有東西
  - 刪除舊的 prototype code
  - 確認符合原始規範
- 「結果令人難以置信 — 因為討論如此高保真度，因為能看到即時運行版本」

### Section 7｜Prototyping beyond frontend（08:53 ~ 10:03）

**重點摘要：** 原型不限於 UI — 對複雜後端邏輯（狀態機、模型）同樣有效；Matt 展示一個小型互動終端 app 處理難以紙上推理的狀態機情境（純邏輯 prototype）。

**內容：**
- 反對「prototype 只跟 UI/前端有關」的刻板印象
- 複雜後端工作面臨的問題：「這種邏輯、這種狀態模型感覺對嗎？」
- **純邏輯 prototype**：建立小型互動終端應用程式，讓狀態機能處理紙面上難以推理的情境
- 兩個分支各自有 reference 文件：
  - 邏輯 prototype → 終端應用
  - UI prototype → 介面草圖
- 隨著 agent 越來越擅長使用畫布與設計工具，**wireframe 一定會重新流行**

### Section 8｜Why higher fidelity matters（10:03 ~ 10:59）

**重點摘要：** 總結 — 從討論/規範到可量產程式碼的鴻溝比想像中大，但有可用原型後，轉化為量產產品就相當簡單；推薦 Ryan Singer 的《Shape Up》作為原型驅動開發的思想基礎。

**內容：**
- **核心命題**：討論和規範 → 可用於生產的程式碼，這之間的差距非常大
- 但如果有可用原型 → 轉化為量產產品相當簡單
- **推薦閱讀**：Ryan Singer《Shape Up》（2019 年讀過，徹底改變 Matt 為人們建立應用程式的方式，完全免費，描述中有連結）
- 結尾：呼籲觀眾「請進行更深入的討論」

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處/應用 |
|------|------|-----------|
| Spec-driven development | 投入大量精力撰寫極詳細規範，期望 LLM 輸出與規範一致 | Matt 強烈反對的反模式 |
| 保真度（Fidelity） | 設計討論中表達設計意圖的精確程度；低保真是討論可解決，高保真需原型 | Section 2 |
| 規範驅動 vs 原型驅動 | 規範驅動：先寫文件；原型驅動：寫程式回答設計問題 | Matt 主張原型驅動在 LLM 時代更便宜有效 |
| Grill 票 vs Prototype 票 | Wayfinder 的兩種票種 — Grill 是問答界定範圍，Prototype 是用工件回答 | Section 3 |
| 精簡（Compact） | prototype 已建立所有設計決策後，給反饋而非重建的階段 | Section 5 |
| 即時頁面整合（Live Routing） | prototype 連接到真實路由而非隨意丟棄，給予實際程式碼運作的真實寫照 | Section 5 |
| 純邏輯原型 | 為複雜狀態機 / 後端邏輯建立的小型互動終端應用，非 UI 原型 | Section 7 |

---

## 四、人物/角色分析

### Matt Pocock（AI Hero 創辦人 / Sandcastle 作者）
- 背景：知名 TypeScript 教育者，2024 起轉向 AI 編碼工具開發；創建 AI Hero 課程平台與 Sandcastle 多代理編碼框架
- 關鍵轉折：意識到 LLM 編碼成本下降讓「生產廉價原型」從未如此便宜與有效
- 代表觀點：「從討論和規範到可用於生產的程式碼，這之間的差距非常大；有可用原型後，轉化為量產產品相當簡單」
- 思想根源：受 Ryan Singer《Shape Up》（2019）影響深遠

### Ryan Singer（Basecamp，前 Shape Up 作者）
- 背景：Basecamp 產品負責人，《Shape Up: Stop Running in Circles and Ship Work that Matters》作者
- 影響：Matt 認為《Shape Up》徹底改變他為人們建立應用程式的方式
- 核心思想：原型驅動開發（shape up = 設定上限 + 範圍 + 拉力）

---

## 五、核心主旨

> **在 LLM 編碼成本大幅下降的時代，「生產廉價原型」已成為比「撰寫詳細規範」更便宜、更有效的設計討論工具 — 原型不僅適用於 UI，對純邏輯與狀態機建模同樣不可或缺；當討論與規範到量產程式碼之間的鴻溝過大時，原型正是縮短這段距離的關鍵技術。**

---

## 六、金句摘錄

1. 「我需要製定一個計劃，對吧？計劃模式，規範驅動開發。我需要投入所有精力來製定這個極其詳細的規範⋯⋯而在這種衝動之下，他們忘了自己其實可以寫程式。」 — Matt Pocock
2. 「真正便宜的是，程式碼編寫成本已經大幅下降了。因此，生產原型、快速生產一次性尖頭產品從未如此便宜，也從未如此有效。」 — Matt Pocock
3. 「無論你是否使用 Wayfinder，這都能為你提供非常清晰的標準，告訴你何時應該製作原型。」 — Matt Pocock
4. 「本次會議的目的是要對這個原型進行迭代⋯⋯所有這些設計決策都將被編碼到原型中，我可能會將原型保存在一個臨時分支上。這意味著，當實際實施時，它不僅有規範，而且通常還有可以從中複製貼上的真實前端程式碼。」 — Matt Pocock
5. 「原型不是隨意丟棄的⋯⋯我更喜歡看到它實際連接到即時路由中，因為這樣可以給你更大的靈活性。它更像是對程式碼實際運作方式的真實寫照。」 — Matt Pocock
6. 「當你在做更複雜的事情時，特別是後端工作時，就會出現這樣的問題：這種邏輯、這種狀態模型感覺對嗎？」 — Matt Pocock
7. 「從討論和規範到可用於生產的程式碼，這之間的差距非常大。然而，如果你有一個可用的原型，將其轉化為量產產品就相當簡單了。」 — Matt Pocock
8. 「隨著代理商們越來越擅長使用畫布和設計工具，我相信線框圖也一定會重新流行起來。」 — Matt Pocock

---

## 七、延伸閱讀/參考

- **Ryan Singer**：《Shape Up: Stop Running in Circles and Ship Work that Matters》（2019，Basecamp，免費）— Matt 推薦的思想基礎書
- **Matt Pocock 2026-07-13**：`/wayfinder` skill demo — 本片的互補影片
- **TLDraw**：Matt 用於 demo 的圖表繪製開源框架

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone `xiaotian_clone_v1`, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260723_MattPocock_PrototypeSkill_口播稿.txt

- [opus X.X MB](../audio/20260723_MattPocock_PrototypeSkill_口播稿.opus)（Telegram 友善）
- [m4a X.X MB](../audio/20260723_MattPocock_PrototypeSkill_口播稿.m4a)（iOS 友善）
- [mp3 X.X MB](../audio/20260723_MattPocock_PrototypeSkill_口播稿.mp3)（通用格式）