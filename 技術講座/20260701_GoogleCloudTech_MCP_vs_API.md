# 【MCP vs API — 為什麼傳統 API 在 AI agent 時代不夠用？】
## 影片基本資訊

> **影片連結：** https://youtu.be/185XGEMefgc?si=-jXndcSG4FubTQtN
> **影片長度：** 12:25

**主講：Google Cloud Tech｜AI 架構入門教學**
**影片時長：12:25**

---

## 一、主題與背景

- **講者：** Google Cloud Tech（@googlecloudtech），講者是 Smitha Kolan（Google Cloud AI/ML Developer Advocate）
- **場合：** Google Cloud Tech 官方 YouTube 頻道 12 分鐘概念教學
- **影片類型：** AI 架構入門／概念框架（不是 hands-on 教學）
- **核心議題：** 為什麼 AI agent 時代需要 Model Context Protocol (MCP)，以及它跟傳統 API 在架構設計上的根本差異

---

## 二、章節脈絡

影片有 8 個官方章節（yt-dlp 從 video chapter 自動抽），時間碼全部完整可考。

### Section 1｜開場：AI 的大轉折（00:00 ~ 00:45）

**重點摘要：** 影片一開頭就拋出論點——過去十年 API 是軟體對接的萬用膠水，但 AI agent 時代這個設計開始不夠用。Model Context Protocol（MCP）正快速成為新標準，被稱為「自 API 以來的最大轉折」。

**內容：**
- 開發者建 app 跟 AI 模型對話的方式正在被徹底重寫
- API 曾經是萬用介面，現在有個新標準在崛起，就是 MCP
- 影片定位：讓觀眾理解 MCP 實際是什麼、跟 API 差在哪、為什麼會改變建 agent 的方式

> 「If you've ever built an app that talks to an AI model, MCP changes everything because the way AI connects to your tools, data, and systems is being completely rewritten.」

### Section 2｜API 為什麼不夠 LLM 用（00:45 ~ 02:48）

**重點摘要：** API 是「程式對程式」的設計，假設兩邊都知道彼此要什麼——這對傳統軟體完美，對 LLM 不夠。

**內容：**
- API 走過幾十年：「你定 endpoint、送 request、回 response」乾淨又可預測
- LLM 一來什麼都變了：模型可能同時 call 10 個 endpoint、要 chain 結果、解讀非結構化資料、追問 context
- 影片關鍵比喻：**API 像上了鎖的櫃子——你必須知道開哪個抽屜、用什麼形狀的鑰匙**（影片原話：「An API is like a locked cabinet.」）
- 模型想知道櫃子裡有什麼卻沒有清楚標籤，於是你得一直 hardcode、一直 prompt engineering 解釋
- MCP 設計的目標：讓模型能自主發現、呼叫工具，不再需要每次手把手教

### Section 3｜MCP 怎麼運作：context 而不是 hardcode（02:48 ~ 04:52）

**重點摘要：** MCP 把 API 設計方向反過來——給模型一份「即時、機器可讀的地圖」（透過 JSON schema），讓它自己發現工具。

**內容：**
- API 走「code-level contract」路線：兩邊都明確知道格式、input/output、版本
- MCP 走「semantic protocol」路線：給模型結構化描述工具能做什麼、需要什麼、回什麼
- 影片關鍵比喻：**把 API 的死板手冊換成即時可讀的地圖**

實際例子：建一個自動處理 support ticket 的 AI agent，接 Gmail、Notion、Jira。
- 用 API：要寫三套客製整合，每次都要處理 auth、pagination、error cases，還要寫「when you want to create a Jira ticket, call this endpoint with these fields」這種長 prompt
- 用 MCP：每個服務 expose MCP 相容介面，模型 plug-in 就能用；不教它怎麼做，給它 context 讓它自己想

> 「It's like giving the model a toolbox instead of forcing it to memorize how each tool works.」

> 「You're no longer teaching the model which endpoint to hit, but you're giving it a structured description of what's available.」

### Section 4｜實戰案例：建一個通用 AI agent（04:52 ~ 06:49）

**重點摘要：** MCP 真正的威力在於通用性——就像 HTTP 統一了網際網路，MCP 想統一 AI 環境。

**內容：**
- 用 API 模式：「what to call and when to call it」這些邏輯全部活在你 app code 裡
- 用 MCP 模式：「that logic can actually move into the model's reasoning layer itself」
- 一個通用 agent 可以 plug 進任何支援協定的工具，不用對每個整合重寫 code
- **這就是「magic」——也是「standardization」**（影片強調）
- 100 個客製整合換成 1 個 MCP 介面：「MCP abstracts that away」

> 「The same way HTTP made websites interoperable ... MCP is trying to make AI environments interoperable.」

### Section 5｜底層：MCP server 與 metadata（06:49 ~ 08:58）

**重點摘要：** MCP 怎麼實際運作——server 是個輕量 process，metadata 是 self-describing。

**內容：**
- MCP server 是一個跑在你服務或資料源旁邊的輕量 process
- 它用 **JSON schemas** 描述能做什麼、expose 哪些函式
- 模型透過 WebSocket 或 HTTP 連到 server，**收到可用資源的 metadata**
- 一旦連上，模型就能直接呼叫這些函式——不是靠猜，而是靠 metadata
- 全部 self-describing：不用 prompt engineer schema、不用 reformat response
- 對比 API：每個整合都是客製的，要工程師讀文件、手動 wrap endpoint
- 結果：「instead of building 100 custom integrations, you build one MCP interface」

### Section 6｜MCP 在 API 之上：新 middleware（08:58 ~ 10:16）

**重點摘要：** 影片最重要的辨識——**MCP 不取代 API，而是新的 middleware**。

**內容：**
- API 不會消失——它們是系統實際在跑的東西
- MCP 改變的是「模型如何 access 那些 API」
- **MCP 不取代你的 backend，它取代 model 跟 API 之間的 middleware**（影片原句）
- MCP server 像翻譯機，把現有 API 翻成模型能自動理解的格式
- 區別是 client：API 的 client 是另一支程式或人；**MCP 的 client 是模型本身**
- 「這個差異看似細微，但實際上徹底改變 integration 設計的方式」
- 更大的框架：「model-native software architecture」——不再為人與程式設計，開始為模型設計

> 「MCP doesn't replace your backend. It replaces the middleware between the model and the API.」

### Section 7｜三大挑戰：採用 / 安全 / 思維（10:16 ~ 11:29）

**重點摘要：** MCP 還很新，三個主要挑戰擺在前面。

**內容：**
- **採用率（adoption）**：ecosystem（servers、clients、tools）要同意同一個標準
- **安全與控制（security and control）**：
  - 模型能直接打工具，要明確的 permission layers
  - 不能讓模型誤寄信、誤刪檔、誤改 DB
  - API 透過 auth keys 和 rate limits 處理這些，MCP 要把同樣的 guardrails 帶到 protocol layer
  - **spec 已定義 capabilities、scopes、authentication methods**
- **開發者思維（developer mindset）**：
  - 大多數人從 API 時代長大，習慣想 endpoint 跟 route
  - MCP 要求你換成「capabilities 和 context」
  - 影片自嘲：most of us grew up in an API world
  - 但影片結論：**「worth learning early」**

### Section 8｜結語：AI agent 時代的 HTTP（11:29 ~ 12:25）

**重點摘要：** 用 HTTP 統一網路做類比——MCP 是 AI agent 時代的開放協議標準。

**內容：**
- HTTP 出現前，每個服務自搞 protocol（FTP、Gopher、Telnet）
- 標準化後，什麼都互通
- MCP 對 AI agent 做同樣的事
- 未來：**只要有 1 個 MCP server，Gemini、Claude、GPT 任何合規模型都能立刻用**
- 「models, not just humans, become first-class users of software」
- 結語金句：「APIs are not dead, they are just evolving」
- 影片最終定義：「**MCP sits one layer above APIs ... turning them from static routes into living interfaces that models can actually reason about**」

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處／應用 |
|------|------|-----------|
| **API（Application Programming Interface）** | 軟體對軟體的萬用介面——定 endpoint、送 request、回 response，契約明確 | 傳統程式對接，1980s 起 |
| **MCP（Model Context Protocol）** | 一個開放協議——模型透過 JSON schema 自主發現、呼叫工具，client 是 LLM | 2024-2025 由 Anthropic 主推，2026 成 AI agent 生態主流 |
| **MCP server** | 跑在服務/資料源旁的輕量 process，用 JSON schemas 描述能做什麼 | MCP 架構的 server side |
| **Context vs. Hardcoding** | API 模式要求事先寫死哪些 endpoint、prompt 模型怎麼 call；MCP 提供即時 machine-readable 地圖讓模型自己發現 | MCP 的核心設計價值 |
| **Middleware** | 在 backend API 之上、模型之下的翻譯層——MCP 不取代 backend，只取代這層 | 影片最關鍵的辨識（Section 6） |
| **Capability / Scope** | MCP spec 定義的權限模型——決定模型能 call 哪些 tool、能做什麼 action | MCP 安全模型（Section 7） |
| **Model-native architecture** | 從「為人與程式設計」轉向「為模型設計」的軟體架構——MCP 是這個轉折的基礎建設 | 影片更大的框架（Section 6 結尾） |

---

## 四、核心主旨

> **MCP 不取代 API——它是模型能 reasoning 的中介層，讓 API 從死的路由（static routes）變成活的介面（living interfaces）。**

未來十年，AI agent 會是軟體的主要使用者（first-class user），就像 HTTP 讓 web 互通一樣，MCP 會讓 AI agent 互通。

---

## 五、金句摘錄

1. 「If you've ever built an app that talks to an AI model, MCP changes everything because the way AI connects to your tools, data, and systems is being completely rewritten.」——講者（Section 1）

2. 「APIs are like a locked cabinet. You need to know exactly what drawer to open and what shape the key is.」——講者（Section 2，影片關鍵比喻）

3. 「It's like giving the model a toolbox instead of forcing it to memorize how each tool works.」——講者（Section 3）

4. 「MCP doesn't replace your backend. It replaces the middleware between the model and the API.」——講者（Section 6）

5. 「The same way HTTP made websites interoperable ... MCP is trying to make AI environments interoperable.」——講者（Section 4）

6. 「Most of us grew up in an API world. MCP asks us to think in terms of capabilities and context. ... worth learning early.」——講者（Section 7）

7. 「Models, not just humans, become first-class users of software.」——講者（Section 8）

8. 「APIs are not dead, they are just evolving.」 / 「MCP sits one layer above APIs ... turning them from static routes into living interfaces that models can actually reason about.」——講者（Section 8 結語）

---

## 六、延伸閱讀／參考

### Model Context Protocol（MCP）

- **MCP 官方網站：** https://modelcontextprotocol.io/
- **Anthropic MCP Announcement（2024-11）：** MCP 起源——Anthropic 開源這個協議的原始動機
- **MCP vs RAG：** 常被混淆，但 MCP 是給 agent 使用的工具呼叫層，RAG 是給 model 用的檢索層，兩者互補

### 影片提及 / 影片補充

- **Google Cloud MCP repo：** https://goo.gle/4aeGUA5（影片描述裡）
- **MCPs explained：** https://goo.gle/4wjeLka（影片描述裡）
- **Smitha Kolan（講者）：** Google Cloud AI/ML Developer Advocate，技術背景在 Google Cloud AI 平台

### 應用場景

- **企業 AI agent 整合：** 用 MCP 把內部 API（CRM、ERP、support）對接給 LLM，不需寫 prompt per tool
- **Multi-agent 編排：** 不同 MCP server 之間的串接（給支援 agent + 銷售 agent 各自 MCP，相互呼叫）

---

## 七、口說稿（繁中，逐句記錄）

> 各位，今天聊一部 Google Cloud Tech 的 12 分鐘短片——MCP 跟 API 到底差在哪、為什麼整個業界突然都在談 MCP 這個新標準。
>
> 過去十幾年，API 是軟體對軟體的萬用接頭。你定 endpoint、送 request、回 response，又乾淨又穩定，對傳統程式堪稱完美。但 AI agent 不是這樣工作——它可能同時打 10 個 endpoint、自己串結果、讀非結構化資料、還會追問 context。API 假設兩邊都知道彼此要什麼；模型不是。
>
> 影片有個好比喻：API 像上了鎖的櫃子。你得知道開哪個抽屜、用什麼形狀的鑰匙。每次新工具都要重寫 prompt 教模型怎麼用，hardcode 又累又沒彈性。
>
> MCP 把這個翻過來：給模型一份即時、機器可讀的地圖，用 JSON schema 描述每個工具能做什麼、要什麼 input、回什麼 output。模型自己看、自己理解、自己選。邏輯從 app code 搬到 model 的 reasoning layer，這是根本性的轉移。
>
> 實戰差距更明顯。假設要建一個 AI agent 自動處理客服票——接 Gmail、Notion、Jira。傳統 API 要寫三套客製整合，每個都要處理認證、分頁、錯誤、重寫 prompt，整個禮拜寫完也只能讓模型會三個工具。MCP 的世界裡，每個服務 expose 一個相容介面，模型 plug-in 就能用，跨服務的串接、判斷什麼時候打哪個，全部交給 reasoning layer。就像 HTTP 統一網際網路，MCP 想統一 AI 環境——100 個客製整合換成 1 個 MCP 介面，這就是所謂 AI 系統的 plug-and-play 層。
>
> 但有個關鍵辨識一定要講清楚：**MCP 不取代你的 API**。MCP server 跑在你服務旁邊，把現有 API 翻譯成 model 看得懂的格式——它取代的是 model 跟 API 中間的 middleware。原本 API 的 client 是另一支程式或人；MCP 的 client 是模型本身。這差異看似細微，實際上決定 integration 設計的整套思維，標誌著我們從為人與程式設計走向為模型設計的轉折——這是更大的典範轉移。
>
> 當然 MCP 還很新，三個挑戰擺在前面：
>
> 第一是**採用率**——要 ecosystem 同意同一個標準，否則就是又一個每家公司自搞一套 plugin 格式的死局。第二是**安全**——模型能直接打工具，要明確的 permission、scope、auth、rate limit，不能讓模型誤刪檔、誤寄信、誤改 DB。spec 已經定義 capability、scope、authentication，但實戰 guardrail 還在演進。第三是**開發者心態**——從 endpoint/route 的 API 思維換成 capability/context 的 MCP 思維。影片自己吐槽：most of us grew up in an API world，換腦袋不容易，但 worth learning early。
>
> 影片最後的類比很到位——HTTP 之前每個服務自搞 protocol，FTP、Gopher、Telnet，之後什麼都互通。MCP 就是 AI agent 時代的 HTTP。以後只要有 1 個 MCP server，Gemini、Claude、GPT 任何合規模型都能馬上用——models, not just humans, become first-class users of software。
>
> 一句話總結整部影片：MCP 不取代 API，它是模型能 reasoning 的中介層，讓 API 從死的路由（static routes）變成活的介面（living interfaces）。

---

## 八、音檔

- [opus 2.9 MB](../audio/20260701_GoogleCloudTech_MCP_vs_API.opus)（Telegram 友善）
- [m4a 3.8 MB](../audio/20260701_GoogleCloudTech_MCP_vs_API.m4a)（iOS 友善）
- [mp3 3.7 MB](../audio/20260701_GoogleCloudTech_MCP_vs_API.mp3)（通用格式）
