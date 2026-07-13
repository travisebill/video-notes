# 【The agent-ready web: Simplify user actions with WebMCP】
## 影片基本資訊

> **影片連結：** https://youtu.be/ghJmWQCIHRM
> **影片長度：** 21:34

**Tara Agyemang（Google Chrome DevRel, AI Engineer）｜2026/06/11｜約 21 分 36 秒**

> 本影片使用 YouTube 手動原始英文字幕（en-orig VTT），經清除時間碼與滾動字幕累積後得到逐字稿，再整理為繁體中文筆記。
> 英文逐字稿：transcripts/20260618_TaraAgyemang_WebMCP_逐字稿.txt
> 繁中口播稿：transcripts/20260618_TaraAgyemang_WebMCP_口播稿.txt

---

## 一、主題與背景

Tara Agyemang 是 Google Chrome 團隊的 Developer Relations 工程師，與 DeepMind 團隊合作。2026 年 6 月 11 日，她在一場會議上演示 Chrome 團隊正在開發的新 web 標準 **WebMCP（Web Model Context Protocol）**。

核心議題一句話：**WebMCP 讓網站能向 AI agent 公開一組具名、具型別、具描述的工具（tool menu），讓 agent 直接呼叫完成任務，不再依賴 DOM 解析、accessibility tree、screenshot、pixel coordinate 猜測這些 token-heavy 又 brittle 的流程。**

Tara 把 WebMCP 定位為 MCP 的「client-side tools 實作」 — JavaScript 受 Java 啟發那種關係，名字相似但應用場景不同：MCP 連 server-side 應用，WebMCP 連 in-browser AI agent。

---

## 二、章節脈絡

### Section 1｜問題：Agent 用 web 太辛苦了（開場 ~ 1:30）

**重點摘要**：買兩張演唱會票，AI agent 要扛整個 DOM、accessibility tree、screenshot、pixel coordinate math，最後點擊還可能因為廣告載入而 miss。

- 過去幾十年 web 是為人類動作、人類眼睛設計的
- 現在 agent 也代表人在用 web，數量持續增加
- 但 agent 為了在網站上完成簡單動作要做大量工作
- 例子：買兩張演唱會票的成本

> "Buying two concert tickets costs an AI agent the entire DOM, the accessibility tree, a screenshot, pixel coordinate math, and then a click that might miss because an ad just loaded and shifted the layout."

---

### Section 2｜WebMCP 解方：工具選單（1:30 ~ 3:00）

**重點摘要**：不要讓 agent 猜測網站能做什麼，改給 agent 一個「具名、具型別、具描述」的工具選單。

- 與其讓 agent 猜測，不如給 agent 一組工具（tools）讓它呼叫
- WebMCP 顯著提升 agent 在網站上的 performance 與 reliability
- 工具是「具名 + 具型別 + 具描述」 — agent 拿到選單就能直接選擇用哪個

---

### Section 3｜Demo 1：Maze Escape Game（3:00 ~ 9:00）

**重點摘要**：Chrome DevRel 自製的迷宮遊戲，只能用 AI 工具玩 — 展示 WebMCP 在多步驟複雜 flow 中的應用。

- 工具：Chrome extension "Model Context Tool Inspector"（side panel 列出網站上所有 tool）
- 進入網頁後，inspector 自動偵測可用 tools
- 一開始迷宮首頁只有 `start_maze_game` 一個 tool
- 進入迷宮後，多了一組 `move / look / pickup / drop / use` 等 tools
- 範例 prompt："move down then right" → AI 對應到 move tool 的 north/south/east 方向
- AI agent 可以重複呼叫同一個 tool 直到任務完成
- "complete the maze" prompt 讓 agent 自己導航 + 撿 + 用道具

> "The AI agent should use my prompt, match it to the specific tools, so in this case, the move tool. It's taken my direction of down and right, matched that to the north, south, east direction, and sent that off to the tool that we have registered on this page."

---

### Section 4｜WebMCP vs MCP（9:00 ~ 11:00）

**重點摘要**：兩者互補 — MCP 連 server-side 應用，WebMCP 是 MCP 的 client-side tools 實作。

- MCP 讓 agent 連到 server-side 應用（需要自架 service）
- WebMCP 啟發自 MCP，但專注 client-side（瀏覽器內）功能
- 必須開著瀏覽器才能用 WebMCP
- 工具全部活在瀏覽器
- 比喻：「就像 JavaScript 啟發自 Java」

> "Whereas MCP enables AI agents to connect to applications on the server side, and you'd need to set up your own service... WebMCP is different in that it's kind of inspired by MCP. I like to think of it as how JavaScript is inspired by Java."

---

### Section 5｜兩條 API 路徑：Declarative vs Imperative（11:00 ~ 15:00）

**重點摘要**：Declarative 給 HTML form 加 attributes，瀏覽器自動生 schema；Imperative 給複雜多步驟流程用 JS 註冊自訂工具。

#### Declarative API
- 普通 HTML form 加幾個 attributes 就 work
- attributes：`toolname` + `tool description`
- 瀏覽器自動生成 JSON schema（form fields 作為 tool parameters）
- 還有 `agent-invoked` Boolean 屬性能區分「是 agent 還是人類填的」
- **適用場景**：標準 form 元素

#### Imperative API
- 在 JS 用 `registerTool({...})` 註冊自訂 tool
- 要手寫 schema（名稱、描述、參數）
- `execute` 區塊內跑一般 JS（可以呼叫現有 function）
- 回傳結果給 agent 知道下一步
- **適用場景**：複雜多步驟 UI flow（例如 add-to-do: validate → trim → create DOM → add）

> 實務上 Imperative API 用得最多，因為多數真實場景的 UI flow 比 form 複雜。

---

### Section 6｜Demo 2：演唱會購票（15:00 ~ 18:00）

**重點摘要**：Vibe-coded 演唱會網站，3 個 tool call 完成購票。

- Featured events 列出來，下面有所有 events
- 點進個別演唱會頁可買票
- prompt："buy 2 VIP tickets to Summer Vibes Festival"
- agent 執行 3 個 tool calls：
  1. `search_concerts`（找演唱會） → 回傳 concert ID
  2. `open_concert_page`（用 ID 開頁面） → 新頁面有新 tools
  3. `purchase_ticket`（買票，傳 quantity + section）
- UI 同步更新：VIP 已選、數量已選、顯示「你花了 £356」
- **重要**：實務上 checkout 步驟應讓使用者手動確認花錢

---

### Section 7｜現狀：Early Preview + 工具資源（18:00 ~ 21:00）

**重點摘要**：WebMCP 還在 early preview，Chrome 146+ 啟用，建議用 Chrome Canary 試。

- **狀態**：experimental，會變動，這週的 code 下週可能不同
- **啟用**：
  - Chrome 146 以上（含）原生支援
  - 建議用 Chrome Canary（可跟主瀏覽器分開）
  - 在 URL 加 flag 啟用 WebMCP testing
- **測試工具**：
  - Model Context Tool Inspector Chrome extension（從 Chrome Web Store 裝）
  - eval CLI tool（在自己的網站測 WebMCP tools）
- **資源**：
  - 官方 blog post + 早鳥預覽計畫（sign up 拿文件）
  - GitHub repo（含 6-7 個 demos 可玩 + maze 完整 source code）

---

### Section 8｜結尾邀請（21:00 ~ 21:36）

**重點摘要**：請大家試用並回饋，目標是把每個網站變成 agent-ready 的 high-performance API。

- AI agents 已經在用 web
- 不要滿足於現在 token-heavy、brittle 的 screen-scraping
- 用 WebMCP 把每個網站變成 agent 的 high-performance API
- 同時也能給真人使用者打造更好體驗

> "We don't have to settle for these token-heavy, brittle screen-scraping processes that we have today. Instead, we can use WebMCP tools to turn every website into a high-performance API for agents, and at the same time build incredible user experiences for the users of our sites."

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處/應用 |
|------|------|-----------|
| **WebMCP** | Google Chrome 提出的 web 標準，讓網站向 AI agent 公開具名工具選單 | Chrome 146+ early preview |
| **Tool** | WebMCP 的基本單位：`{name, description, schema, execute}` | 透過 declarative / imperative API 註冊 |
| **Declarative API** | HTML form 加 attributes（toolname、description）讓瀏覽器自動生成 JSON schema | 標準 form 場景 |
| **Imperative API** | JS 用 `registerTool({...})` 註冊自訂 tool + 手寫 schema + execute 區塊 | 複雜多步驟 UI flow |
| **JSON Schema** | 工具的參數規格描述，agent 讀這個來知道怎麼呼叫 | 兩種 API 都會用到 |
| **Model Context Tool Inspector** | Chrome extension（side panel），列出網站上所有 WebMCP tools | 測試 + 除錯工具 |
| **agent-invoked** | HTML Boolean 屬性，區分表單是 agent 還是真人填的 | Declarative API 用 |
| **eval CLI** | 命令列工具，用來在自己網站測 WebMCP tools | 早期測試用 |
| **MCP** | Model Context Protocol，server-side 應用與 agent 的標準 | 跟 WebMCP 互補 |

---

## 四、人物 / 角色分析

### Tara Agyemang
- 背景：Google Chrome 團隊 Developer Relations 工程師；與 DeepMind 合作
- 關鍵角色：WebMCP 標準的對外推廣者 + 技術演講者
- 代表觀點：「WebMCP 是把 MCP 的 client-side tools 標準化」

### Google Chrome DevRel 團隊
- 角色：建構 maze demo + Model Context Tool Inspector extension
- 訊號：Google 內部有專職團隊在推 WebMCP

### DeepMind 團隊
- 角色：與 Chrome 合作；會場設有 booth 蒐集開發者 feedback
- 訊號：WebMCP 不是 Chrome 單獨搞，而是 Google AI 整體策略一環

### Gemini
- 角色：demo 用的 AI agent（Gemini 1.5 / 3.1）
- 重要觀察：Tara 提到 WebMCP 在 Gemini 3.1 上「works much better」 — 暗示 WebMCP 的 reliability 跟底層 LLM 的 tool-use 能力密切相關

---

## 五、核心主旨

> **WebMCP 讓網站把 AI agent 從「DOM 解析 + screenshot 猜測」的 brittle 流程，換成「呼叫具名工具」的 deterministic 流程；它是 MCP 的 client-side 實作，把每個網站變成 agent 的 high-performance API。**

---

## 六、金句摘錄

1. "Buying two concert tickets costs an AI agent the entire DOM, the accessibility tree, a screenshot, pixel coordinate math, and then a click that might miss." — 問題的具體圖像
2. "JavaScript inspired by Java." — WebMCP 與 MCP 的關係比喻
3. "The more that you refine the prompt, the better the agent knows how to complete the maze in the most efficient way." — WebMCP 也受 prompt 品質影響
4. "We don't have to settle for these token-heavy, brittle screen-scraping processes." — 改革的呼籲
5. "Turn every website into a high-performance API for agents." — WebMCP 的願景

---

## 七、延伸閱讀 / 參考

- WebMCP early preview blog post（Chrome 官方）
- Chrome Web Store：Model Context Tool Inspector extension
- GitHub: WebMCP tools repo（含 maze demo source code）
- Tara Agyemang: [@tara_ojo](https://x.com/tara_ojo) · [LinkedIn](https://uk.linkedin.com/in/taraojo) · [GitHub](https://github.com/taraojo)
- 相關：Marie Haynes OKF 影片（提到 web MCP 在 OKF bundle 中的角色）

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 5 分 47 秒
> 口播稿原文：transcripts/20260618_TaraAgyemang_WebMCP_口播稿.txt

- [opus 2.7 MB](../audio/20260618_TaraAgyemang_WebMCP.opus)（Telegram 友善）
- [m4a 5.5 MB](../audio/20260618_TaraAgyemang_WebMCP.m4a)（iOS 友善）
- [mp3 5.3 MB](../audio/20260618_TaraAgyemang_WebMCP.mp3)（通用格式）