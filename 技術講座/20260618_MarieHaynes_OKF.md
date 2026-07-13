# 【Google 推出 Open Knowledge Format — 結構化你的知識給 AI Agent】
## 影片基本資訊

> **影片連結：** https://youtu.be/MY9F9K7wWX4
> **影片長度：** 18:10

**Marie Haynes｜2026/06/16（影片發布日）｜約 18 分鐘**

> 本影片使用 YouTube 手動原始英文字幕（en-orig VTT），經清除時間碼與滾動字幕累積後得到逐字稿，再整理為繁體中文筆記。
> 英文逐字稿：transcripts/20260618_MarieHaynes_OKF_逐字稿.txt
> 繁中口播稿：transcripts/20260618_MarieHaynes_OKF_口播稿.txt

---

## 一、主題與背景

Marie Haynes 是知名的 SEO 顧問（Marie Haynes Consulting），長期追蹤 Google 搜尋演算法。2026 年 6 月 16 日，她發布影片拆解 Google 剛公告的 **Open Knowledge Format（OKF）** 標準。這是 Google 提出的一種用 Markdown 檔案承載企業或個人專業知識的開放格式，目標是讓 AI agent 可以結構化讀取，而非仰賴 RAG 從網頁爬文。

核心議題一句話：**OKF 把「人整理知識」標準化為 Markdown 知識套件（knowledge bundle），讓 agent 能像查 wiki 一樣讀懂企業知識**。Marie 認為這會改寫 SEO 與 GEO 的玩法，催生新的服務與知識變現模式。

---

## 二、章節脈絡

### Section 1｜OKF 公告與宏觀意義（0:00 ~ 1:00）

**重點摘要**：Google 公告 Open Knowledge Format，是 internet 的新一層。

- Google 公告 Open Knowledge Format（OKF）
- 這是 internet 的「全新一層」 — 讓你的（企業或個人）知識可以被 agent 結構化讀取
- 用 Markdown 檔案承載，技術上非常簡單
- 重點不是技術，而是「標準化」 — 我的 agent 訪問你的公開 OKF 時，雙方格式一致

> "Google just announced something called the Open Knowledge Format... a whole new layer for the internet. It's a way to take your knowledge, your business knowledge, your personal knowledge, whatever it is, and structure it so that agents can understand it."

---

### Section 2｜OKF 為何改變 SEO（1:00 ~ 2:00）

**重點摘要**：SEO 不再只是被找到，而是讓企業知識「對 agent 可用」。

- 過去的 SEO/GEO/agentic search optimization 框架都不完全適用
- OKF 不是「被找到」，而是讓你的企業對 agent 可「做事情」
- 懂 OKF 的人會是高需求人才，類似當年網站地圖（sitemap）服務的升級版

> "It's not SEO, it's not GEO, it's not even agentic search optimization. This isn't about getting found, rather it is a way to make your business accessible to agents."

---

### Section 3｜知識套件（Knowledge Bundle）商業模式（1:43 ~ 2:40）

**重點摘要**：OKF bundle 可買可賣，催生兩條新營收路徑。

- 第一條路徑：把 OKF 建置服務賣給企業（從 SEO 服務延伸）
- 第二條路徑：賣「OKF 知識套件」本身 — 律師、會計師、SEO 顧問可以把專業知識打包出售
- 別人的 OKF 可整合進自己的系統，不必再用 MCP 或 Web MCP 連到對方網站
- 隨著專業領域更新（例如法律變動），你的系統也會自動吸收新版本

> "I think you should be able to sell your OKF bundles... we'll probably buy OKF bundles from a lawyer, from an accountant, from an SEO."

---

### Section 4｜用 NotebookLM + Gemini 學習 OKF（2:21 ~ 3:00）

**重點摘要**：把 spec 文件丟給 LLM 讓它幫你摘要，是最快上手 OKF 的方法。

- 影片當下（2026 年 6 月中）是 OKF 第一版，未來會有更新
- Marie 把 Google 部落格、spec.md（GitHub）檔案全部丟進 NotebookLM
- 給 Gemini 一個 prompt：「給我 20 個在我的業務中使用 OKF 的點子」

---

### Section 5｜OKF 是什麼 — Markdown + LLM Wiki 模式（3:00 ~ 5:00）

**重點摘要**：OKF = 形式化 Andrej Karpathy 的 LLM Wiki 模式，僅此而已。

- 形式上：OKF 是一個目錄（含子目錄）裡面裝一堆 Markdown 檔案
- 觀念上：OKF 形式化了 Karpathy 提出的 LLM Wiki pattern
- Karpathy 主張：與其讓 LLM 在查詢時從大量文件中抓資料，不如讓它維護一份「持續更新的 wiki」

> "OKF is a specification that formalizes something called the LLM Wiki pattern. This pattern was described by Andre Karpathy."

---

### Section 6｜拆解 OKF Spec：YAML Front Matter（6:30 ~ 7:30）

**重點摘要**：每個 Markdown 檔案 = 一個概念 + YAML front matter + 內文。

- 每個 markdown 檔案代表一個「概念」（concept） — 不是網頁，是單一知識單位
- YAML front matter 必要欄位：
  - `type`：知識類型
  - `title`：標題
  - `description`：描述這個檔案裡有什麼
  - `tags`：主題分類
  - `resource`：資源
  - `timestamp`：時間戳
- YAML front matter 由 agent 生成 — 你只要把 spec.md 丟給 LLM，跟它說「幫我生成 front matter」
- 內文（body）：可放任何東西 — 指示、知識、資料表
- 可加超連結與引用（citations），建立跨檔案的知識圖譜

---

### Section 7｜檔案結構：index、log、子目錄（7:40 ~ 9:00）

**重點摘要**：bundle 內有 index、log 檔，可存放 GitHub 或 Obsidian。

- 每個 bundle 必須有 index 檔（總覽）
- log 檔讓 agent 記錄「今天更新了什麼」
- 概念可以是子目錄 — 例如「web MCP」是 MCP 的子集
- 存放位置：GitHub repo（免費）、Notion、Obsidian 都行

---

### Section 8｜實作範例：BigQuery 數據 vs. 觸發型 Playbook（9:11 ~ 11:00）

**重點摘要**：OKF 不是只有 Google 文件的 BigQuery 範例，更實用的是「觸發型 playbook」。

- Google 範例是用 OKF 承載 BigQuery 數據（特別是 GA4）— Marie 也想做但承認這對大多數人不實用
- Marie 偏好用法：**playbook type**（類似 SOP/流程），設定 trigger
- 範例：當有人談到「流量下滑」時，agent 自動觸發 Marie 的「診斷流量下滑 playbook」
- 這比 RAG 直接猜測組織方式更好 — 因為企業自己定義「我們怎麼組織客戶訂單」

> "When we look at customer orders, this is how we organize them... If you were just using RAG, your language model would guess how you organize things. This way you can say: this is our way."

---

### Section 9｜Andrej Karpathy LLM Wiki Pattern（11:12 ~ 14:30）

**重點摘要**：Karpathy 主張 LLM 應該主動建構並維護一份持續演化的 wiki。

- 傳統 RAG：把所有資料丟給 LLM，問問題時讓它自己抓重點
- Karpathy 模式：LLM 讀完資料後**主動把概念整合進 wiki**，更新 entity pages、修改主題摘要、標記矛盾點
- 用戶角色改變：你負責找新知識、寫下來、分享給 LLM；wiki 維護是 LLM 的工作
- 這個模式對 OKF 的威力：未來新增內容時，LLM 會自動檢查「這個概念已經討論過」，更新既有頁面而非新增重複檔案

> "The language model doesn't just index it for later retrieval. It reads it, extracts the key information, and integrates it into the existing Wiki, updating entity pages, revising topic summaries, noting where new data contradicts old claims."

---

### Section 10｜OKF 是新 Schema — 兩條營收路徑（14:34 ~ 17:00）

**重點摘要**：OKF 取代結構化資料的複雜 mapping，催生新服務 + 新知識商品。

- Marie 過去對 schema 很掙扎 — 把每個實體都 mapping 出來感覺不自然
- OKF 的「以概念為單位」更貼近人類組織知識的方式
- **兩條營收路徑**：
  1. 提供 OKF 建置服務（理解企業、幫忙組織概念）
  2. 銷售自己的 OKF bundle（律師、會計、SEO 等專業知識）
- 已有工具（如 Saganth Mahanadossan 開發的）可把網頁轉成 OKF，但目前只做「每個網頁一個檔」，還沒做到「每個概念一個檔」

---

### Section 11｜發現機制 — llms.txt 與結尾（17:15 ~ 18:08）

**重點摘要**：未來 llms.txt 會指向 OKF bundle；結尾點出「semantic unbaking」。

- 問題：agent 怎麼知道你有 OKF？
- 答案：寫在 `llms.txt` 裡 — 會有指向 agent 的「我有 OKF bundle」宣告
- Gemini 給 Marie 一個金句：「semantic unbaking」（語意反烘焙）
- 願景：未來人類可以過著「學習並分享」的生活，努力培養專業的人會被獎勵

> "Instead of having to work like machines and make it into something that is machine readable, we're actually just going to be able to have these lives where we learn stuff and we share stuff, and those who work hard to develop expertise will be able to be rewarded."

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處/應用 |
|------|------|-----------|
| **OKF**（Open Knowledge Format） | Google 提出的開放標準，用 Markdown 檔案結構化企業/個人知識給 AI agent | Google 部落格 2026/06 |
| **Knowledge Bundle** | OKF 的基本單位：一個目錄（含子目錄）內裝多個 Markdown 概念檔 | OKF spec |
| **Concept** | OKF 中的一個 Markdown 檔案 = 一個知識單位，不是網頁 | OKF spec |
| **YAML Front Matter** | 每個概念檔的開頭 metadata：type, title, description, tags, resource, timestamp | OKF spec |
| **LLM Wiki Pattern** | Andrej Karpathy 提出：讓 LLM 主動建構並維護一份持續演化的 wiki，而非查詢時 RAG | Karpathy gist |
| **Playbook** | 一種 OKF type：附帶 trigger 的流程/SOP，當特定事件發生時由 agent 觸發 | Marie 偏好的用法 |
| **Semantic Unbaking** | Gemini 給的金句：把「已被機器化烘焙的知識」還原成人類可讀的語意結構 | 影片結尾 |
| **llms.txt** | 網站的 LLM 索引檔，未來會擴充指向 OKF bundle | 大型語言模型社群共識 |

---

## 四、人物 / 角色分析

### Marie Haynes
- 背景：SEO 顧問，Marie Haynes Consulting 創辦人；長期追蹤 Google 演算法
- 關鍵轉折：理解 OKF 後，從「SEO/GEO」框架切換到「agent-readable knowledge」框架
- 代表觀點：「OKF 是新 schema」 — 結構化知識但用自然概念組織，比傳統 schema 友善

### Andrej Karpathy
- 背景：前 Tesla AI 總監、OpenAI 共同創辦人，現以其 LLM/教育內容聞名
- 關鍵貢獻：提出 LLM Wiki pattern — 讓 LLM 主動維護 wiki 而非 RAG 被動查詢
- 影響：OKF 是這個觀念的「標準化實現」

### Saganth Mahanadossan
- 背景：已開發把網頁轉成 OKF 的工具
- 現狀：把每個網頁轉成一個檔，還沒做到「以概念為單位」
- 意義：早期工具生態的訊號

### Gemini
- 角色：Marie 用來學習 OKF spec 的助手
- 關鍵產出：給出 "semantic unbaking" 金句

---

## 五、核心主旨

> **OKF 把人類組織知識的方式（以概念為單位）標準化為 Markdown bundle，讓 AI agent 可以像查 wiki 一樣讀懂企業知識——這同時催生了「建置服務」與「知識商品」兩條新營收路徑。**

---

## 六、金句摘錄

1. "OKF is a specification that formalizes something called the LLM Wiki pattern." — OKF 的本質定義
2. "The language model doesn't just index it for later retrieval. It reads it, extracts the key information, and integrates it into the existing Wiki." — Karpathy 模式的核心
3. "This isn't about getting found, rather it is a way to make your business accessible to agents." — 重新定義 SEO
4. "We're going to buy OKF bundles from a lawyer, from an accountant, from an SEO." — 知識變現的具體圖像
5. "Semantic unbaking." — 整部影片的口號

---

## 七、延伸閱讀 / 參考

- Google 部落格：[How the Open Knowledge Format can improve data sharing](https://cloud.google.com/blog/products/data-analytics/how-the-open-knowledge-format-can-improve-data-sharing/)
- OKF Spec：[SPEC.md on GitHub](https://github.com/GoogleCloudPlatform/knowledge-catalog/blob/main/okf/SPEC.md)
- Andrej Karpathy：[LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- Marie Haynes 社群：[community.mariehaynes.com](https://community.mariehaynes.com)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 5 分 23 秒
> 口播稿原文：transcripts/20260618_MarieHaynes_OKF_口播稿.txt

- [opus 2.5 MB](../audio/20260618_MarieHaynes_OKF.opus)（Telegram 友善）
- [m4a 5.1 MB](../audio/20260618_MarieHaynes_OKF.m4a)（iOS 友善）
- [mp3 4.9 MB](../audio/20260618_MarieHaynes_OKF.mp3)（通用格式）