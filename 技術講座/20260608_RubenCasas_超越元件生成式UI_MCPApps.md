# 【超越元件：為 MCP Apps 設計生成式 UI】
**Ruben Casas（Postman）｜2026-06-08｜MCP Developer Summit 2025**

> **影片來源**：<https://youtu.be/hCMrEfPG2Yg>
> **講者**：Ruben Casas, Postman Staff Engineer（過去一年專注 UI 與生成式 UI，並實際投入 MCP Apps 開發）
> **時長**：約 17 分鐘

---

## 一、主題與背景

Ruben 的核心論點是：**我們正處於「LLM 作業系統」的 1970 年代**——超級智慧已經存在，但成熟的 GUI 介面語言尚未被發明。今天的 UI 主流仍是「靜態元件（Static Components）」，無法善用現代模型的程式碼生成能力。**MCP Apps 是生成式 UI 目前最務實的傳遞機制（delivery mechanism）**，因為它原生提供認證、tool calling、沙箱（double iframe）三大基礎設施。

> 引用 Karpathy：「與新電腦互動就像在跟終端機對話——你有作業系統的直接存取權，但 GUI 還沒被發明出來。」

**未來 12-24 個月 UI 的演進路線：**
靜態元件（Static）→ 宣告式生成 UI（Declarative）→ 生成式元件（Generative Components）→ 協作式物件（Collaborative Artifacts）

---

## 二、章節脈絡

### Section 1｜時代背景：為什麼是「現在」？（00:00 ~ 03:00）

**重點摘要：** 2025 年底兩個模型（GPT-5.2 + Claude Opus 4.5）讓 UI 能力產生質變

**內容：**
- 2022 末 ChatGPT 時代：「poor man's vibe coding」— 貼 prompt → 收 code → 改 code → 再問
- 2025 年底兩大突破：
  - **GPT-5.2**：長時程任務能力
  - **Claude Opus 4.5**：高擬真 UI 生成
- 講者親身實驗：丟一句「幫我重寫部落格」，模型主動加了搜尋框 + blur 動畫 + a11y 支援
- 關鍵現實：**「AI 寫前端比大多數前端工程師還好」**（講者原話，沒有 ego）

### Section 2｜「新電腦」比喻 — 介面語言才是瓶頸（03:00 ~ 05:00）

**重點摘要：** 模型能力不是瓶頸，介面語言才是

**內容：**
- 引用 Andrej Karpathy 的「terminal 比喻」：我們有超級智慧，但沒有成熟 GUI
- 終端機 → CLI → 現在的 chat 介面
- 但成熟 GUI 還沒出現
- **介面語言（interface language）是當前最大的設計瓶頸**

### Section 3｜UI 生成的四大象限（Ruben 的分類法）（05:00 ~ 11:00）

**重點摘要：** 兩條軸（Where / What）交叉出四個象限，成熟度由低到高

**內容：**

```
軸 1：Where（UI 在哪裡跑）
  ├─ 第三方程式碼 / 第三方 UI
  └─ 終端內超級 App（ChatGPT / Claude / Gemini）

軸 2：What（模型生成什麼）
  ├─ 靜態資料 → 預定義元件
  └─ 完整 HTML / CSS / JS
```

**象限 1：靜態元件（Static Components）— 主流**
- 流程：Agent 編排 → tool call → 預定義 React 元件 → 渲染
- 代表：AGUI Protocol、Goose Auto Visualizer
- 缺點：和過去 20 年沒什麼差別

**象限 2：宣告式 UI（Declarative UI）— 當前甜蜜點** ⭐
- 流程：Agent → JSON / YAML / Python descriptor → 轉譯引擎 → 預定義元件
- 代表：Vercel JSON Render、Fast MCPs
- 為什麼是甜蜜點：
  - 保留 design system 一致性
  - 速度快、token 成本低
  - 可預測性高
  - 比純靜態更個人化

**象限 3：生成式元件（Generative Components）— Next**
- 流程：Agent → tool call → 反向取樣 / 另一個 model → runtime 生成完整 HTML/CSS/JS
- Postman 內部實驗：weather agent 一次 tool call 內生成完整天氣頁面（含笑話）
- 最大風險：**信任問題** + 需要發布機制（distribution model，內含 boundary + containment + sandbox）

**象限 4：協作式物件（Collaborative Artifacts）— 未來**
- Human ⇄ Agent 共享 canvas / artifact，持續可修改
- 代表：**Excalidraw MCP App**
  - 建立共享 artifact：人類和 agent 在同一個 canvas 來回協作
  - 人可以點擊、修改、拖拉 UI 物件
  - Agent 可以重畫整個畫面
  - 「新型態的互動體驗」

### Section 4｜為什麼 MCP Apps 是生成式 UI 的最佳載體？（11:00 ~ 13:30）

**重點摘要：** MCP Apps 解決生成式 UI 的三大基礎設施問題

**內容：**

| 基礎設施需求 | MCP App 怎麼解決 |
|--------------|------------------|
| **認證（Auth）** | 內建 OAuth / token 傳遞 |
| **Tool Calling** | Agent ⇄ UI 的雙向訊息傳遞 |
| **Sandbox** | 預設 **double iframe** 隔離 |

**關鍵戰略觀察：**
> Anthropic 完全可以自己搞 first-party 渲染機制（像 Cloud 那種），但他們選擇用 MCP Apps 來做自己的 first-party UI。**這是強烈的訊號** — 連平台方都相信 MCP Apps 是最乾淨的傳遞機制。

Ruben 反問：**如果 Anthropic 對自己 first-party UI 都用 MCP Apps，那第三方憑什麼不用？**

### Section 5｜「Radio 時代」比喻 — 我們缺的不是技術，是想像力（13:30 ~ 17:00）

**重點摘要：** LLM 介面還在「電台節目加攝影機」階段

**內容：**
- 媒體史類比：
  - 1930 年代電視剛出現時，節目就是「電台節目加一台攝影機」
  - 當時的人**想像不到**電視能幹嘛
- 對應到現在：
  - 電視 = LLM OS
  - 電台節目 = Chat 介面
  - 攝影機 = 我們塞到每個 SaaS 的 chat box

> 「我們沒有足夠的想像力。我們還在 radio 時代。」

**Excalidraw MCP App 為什麼重要：**
- 不只是輸出圖表
- 建立**共享 artifact**：人機在同個 canvas 來回協作
- 預示「協作式物件」是下一個殺手級介面的開端

---

## 三、核心模型圖

```
成熟度由低到高 ─────────────────────────────────────►

靜態元件       宣告式 UI        生成式元件        協作式物件
(現在主流)    (現在甜蜜點)     (Next 12 月)      (Next 24 月)
   ↓              ↓                ↓                 ↓
AGUI          Vercel           Postman           Excalidraw
Goose         JSON Render      weather agent     共享 canvas
```

---

## 四、技術決策建議

### 短期（3-6 個月）
- 採用 **Declarative UI** 模式：JSON / YAML descriptor + 預定義元件庫
- 參考 Vercel JSON Render 的 schema
- MCP Apps 作為**第三方 / 內部工具的統一入口**

### 中期（6-12 個月）
- 導入 **Generative Components** 的實驗性功能
- 確保有 **double-iframe sandbox** 機制
- 開始設計 **artifact persistence**（協作物件需要持久化狀態）

### 長期（12-24 個月）
- 設計**人機協作的 UI 物件模型**
- 思考**設計系統 vs 生成自由度的平衡**
- 投資**安全審查 pipeline**（LLM 生成的 code 必須經過審查才能進 production）

---

## 五、開放問題

Ruben 坦承**今天沒有答案**的問題：

1. **Chat 是最終介面嗎？** — 大部分 SaaS 在首頁塞 chat box，這是過渡還是終局？
2. **MCP Apps 是終局嗎？** — 它是目前最務實的傳遞機制，但不是唯一選項
3. **超級 App 會統一所有 UI 嗎？** — 還是每個 app 還是要有自己的 chat 入口？
4. **UI 應該生成到什麼程度？** — 完全生成（model 寫 HTML）vs 宣告式（JSON descriptor）
5. **人機協作的 artifact 形式？** — Excalidraw 是開始，不是結束

---

## 六、關鍵詞彙表

| 術語 | 說明 |
|------|------|
| **Generative UI** | 由 LLM 動態生成 UI 而非預定義 |
| **MCP Apps** | Model Context Protocol 的 App 規格，含 iframe 沙箱 |
| **Declarative UI** | 用 JSON / YAML / Python 描述 UI 結構，runtime 渲染 |
| **Generative Components** | LLM 即時生成 HTML / CSS / JS 元件 |
| **Collaborative Artifact** | 人機共享的可修改物件（Excalidraw 模式） |
| **Distribution Model** | 生成式 UI 的發布與沙箱模型 |
| **Radio Era** | 講者的比喻：LLM 介面還在「把 radio 內容搬上電視」階段 |
| **AGUI Protocol** | 把 client tool 映射到 React 元件的 SDK |
| **Goose Auto Visualizer** | MCP client 內建的自動資料視覺化功能 |
| **JSON Render (Vercel)** | Vercel 推出的 JSON → 元件渲染器 |
| **Excalidraw MCP App** | 強調人機共享 canvas 的 MCP App 範例 |

---

## 七、參考資源

- **演講者**：Ruben Casas（Postman）
- **引用文獻**：
  - Karpathy 的「terminal 比喻」
  - 1930 年代電視 vs 收音機的媒體史
- **相關專案**：
  - Vercel JSON Render
  - Anthropic MCP Apps spec
  - AGUI Protocol
  - Goose（MCP client）Auto Visualizer
  - Excalidraw MCP App
- **演講原始連結**：<https://youtu.be/hCMrEfPG2Yg>

---

## 八、給團隊的提醒

- **Ruka（前端）**：宣告式 UI 是當前甜蜜點，建議研究 Vercel JSON Render 的 schema，後端會盡量吐一致的 JSON descriptor
- **Moka（UI/UX）**：design system 不會被取代，反而更重要 — 生成式 UI 需要在「品牌一致性」和「個人化」間拿捏
- **Sora（PM）**：short-term 不要追求「完全生成 UI」，token 成本 + 安全性 + 設計一致性都不划算；先做 Declarative，再實驗 Generative
- **Mame（QA）**：生成式 UI 的 testing 是新戰場，需要 deterministic snapshot + LLM 行為驗證雙軌
- **Nigo / Founder**：可考慮將 Excalidraw MCP App 模式納入產品 roadmap 參考

---

*本筆記由 yt-dlp 抓字幕 + Ryo 🐱 整理為繁體中文技術架構文件*
