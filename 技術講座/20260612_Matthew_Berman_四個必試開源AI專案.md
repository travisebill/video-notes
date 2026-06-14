# You NEED to try these open-source AI projects RIGHT NOW

> **影片資訊**
> - 講者：Matthew Berman
> - 上傳日期：2026-06-12
> - 長度：15 分 53 秒
> - 觀看次數：64,787（截至摘要日）
> - 原始語言：英文
> - 摘要語言：繁體中文
> - 影片網址：https://youtu.be/zjFE-dBzP_E
> - 摘要日期：2026-06-14

> **🎙️ 口說音檔（5 分鐘摘要，TTS 產出，4:58）**
> - [🔊 Opus · 2.4 MB](https://github.com/travisebill/video-notes/blob/main/audio/20260612_Matthew_Berman_四個必試開源AI專案.opus)（推薦，行動裝置友善）
> - [🔊 M4A · 4.9 MB](https://github.com/travisebill/video-notes/blob/main/audio/20260612_Matthew_Berman_四個必試開源AI專案.m4a)（iOS 原生支援）
> - [🔊 MP3 · 4.8 MB](https://github.com/travisebill/video-notes/blob/main/audio/20260612_Matthew_Berman_四個必試開源AI專案.mp3)（最通用）
> - [📝 口播稿原文](https://github.com/travisebill/video-notes/blob/main/transcripts/20260612_Matthew_Berman_四個必試開源AI專案_口播稿.txt)

> **摘要備註**
> 本影片使用 YouTube 英文自動字幕（en-orig auto-generated VTT），經清除時間碼、HTML 標籤、滾動重複段後得到逐字稿，再翻譯為繁體中文。原文引用以 `>` 區塊呈現。

---

## 一、主題與背景

Matthew Berman 在本期影片中一口氣介紹了 **四個你可能沒聽過、但極度實用的開源 AI 專案**。影片的核心論點是：在 LLM 工具百花齊放的時代，**真正改變工程師工作流的，往往不是更大的模型，而是精巧的開源輔助工具**。這四個專案分別解決了「資訊過濾」、「本地化知識工作」、「工程流程紀律」與「成本控制」四個截然不同的痛點。

影片獲得 ElevenLabs 11 Agents 贊助，順帶介紹了 11 Labs 的對話式代理平台。

---

## 二、四個開源專案一覽

| # | 專案名稱 | GitHub | Stars | 核心功能 | 解決的痛點 |
|---|---------|--------|------:|---------|-----------|
| 1 | **Last30Days** | mvanhorn/last30days-skill | 40K+ | 跨平台「人類投票」搜尋引擎 | 過濾噪音、找到近期真正熱門的內容 |
| 2 | **Open Notebook** | lfnovo/open-notebook | 30K- | NotebookLM 的開源本地複製版 | 不上傳資料到雲端、本地生成 podcast |
| 3 | **Agent Skills** | addyosmani/agent-skills | 56K+ | 7 個 slash command 對應工程 7 階段 | 給 agentic 工程師一套紀律化流程 |
| 4 | **Headroom** | chopratejas/headroom | 24K+ | LLM 上下文壓縮代理層 | 節省 47%~92% tokens、API 費用 |

---

## 三、章節脈絡（含時間標記）

### 0:00 – 0:30｜開場（Hook）
- 開門見山拋出 promise：四個你可能沒聽過、但「so valuable」的開源專案
- 用三個關鍵字預告：新型搜尋引擎 / agentic 工程 skill / NotebookLM 開源複製 / 「省下 90% AI 帳單」的工具
- 提及贊助商 11 Labs，後段再回頭介紹

### 0:32 – 4:14｜**專案一：Last30Days**
- 與 Google 搜尋的差異化定位：不是演算法排名，而是**人類集體投票**
- 資料來源：Reddit upvotes、Hacker News、Polymarket、X、YouTube、TikTok
- 範例 query：「loop engineering」（2026-06-07 才誕生的術語）
- 結果展示：key patterns、sources 完整列出
- 進階功能：`emit=html` 產生可分享的 HTML 摘要
- 設計巧思：V3 engine 會**先解析主體**（如 openclaw → Peter Steinberger 的 Twitter handle）再決定搜尋哪個 subreddit

### 4:14 – 5:27｜**專案二：Open Notebook — 開頭**
- 對標 Google 的 NotebookLM（雲端、付費、封閉）
- 開源、本地、可選雲端 LLM 的替代品
- 安裝方式：直接把 GitHub URL 丟給 Cursor / Claude Code 說「install it」

### 5:27 – 6:26｜**置入 11 Labs 11 Agents 廣告**
- 平台定位：設計、部署、優化即時語音與對話代理
- 應用場景：sales、support、operations
- 語音「expressive mode」可控制語調，聽起來不機械
- 優惠碼：`FORWARDFUTUREAI` 加碼 33%

### 6:26 – 8:59｜**專案二：Open Notebook — 深入**
- Demo：載入《Long Humans》文章 → 摘要 → 問答（作者對 AI 的立場）→ 生成 23 分 36 秒 podcast
- 「Transformations」功能：萃取 key insights / 摘要 / reflection questions / table of contents
- 模型選擇（Berman 的選配）：
  - Chat：GPT-5.5
  - Embedding：text-embedding-3-large
  - Text-to-Speech：GPT-4o-mini
  - 其它：GPT-5 系列
- 支援完全本地：Ollama / LM Studio

### 8:59 – 11:21｜**專案三：Agent Skills**
- 七個 slash command 對應工程七階段：
  1. `/spec` — 訪談式釐清需求
  2. `/plan` — 規劃
  3. `/build` — 實作
  4. `/test` — 測試
  5. `/review` — 程式碼審查
  6. `/simplify` — 簡化
  7. `/ship` — 上線
- 與 GStack（Gary Tan）相比：GStack 偏「建公司」，Agent Skills 專注「工程流程」
- Demo：用 `/interview-me` 規劃「agentic loop 點子庫」網站，自動產出 markdown spec

### 11:21 – 13:14｜**專案四：Headroom — 數據震撼**
- 定位：透明代理層，**在 LLM 之前壓縮所有讀入的 context**
- 壓縮對象：tool outputs、logs、RAG chunks、files、conversation history
- 實測數據：
  | 場景 | 原始 tokens | 壓縮後 | 節省 |
  |------|----------:|------:|----:|
  | 程式碼搜尋（100 結果）| 17,000 | 1,400 | **92%** |
  | 事件除錯 log | 65,000 | 5,000 | **92%** |
  | GitHub issue 追蹤 | 54,000 | 14,000 | 73% |
  | 程式碼庫探索 | 78,000 | 41,000 | 47% |
- 品質保持：在 GSM8K、TruthfulQA、SQuAD v2、BFCL 測試上**幾乎滿分**
- 2026 年 6 月開始 stars 暴漲

### 13:14 – 15:53｜**專案四：Headroom — 安裝與使用**
- 安裝指令：給 agent 說「install it」+ URL
- 啟動：`headroom-wrap-claude --no-proxy`
- 效能監控：`/headroom:perf` 顯示 per-model savings、cache hit rate
- 殺手級功能：`headroom learn` — 自動分析失敗 session，**寫修正到 CLAUDE.md / AGENTS.md**
- 安裝注意事項：
  - 預設會安裝 `serena`（可加 `--no-sa` 跳過）
  - 預設開啟 telemetry（記得關閉）

### 15:53 – 結束｜Outro
- 感謝 11 Labs 贊助
- 預告更多開源專案評測影片

---

## 四、關鍵概念定義

| 術語 | 說明 |
|------|------|
| **Agentic Engineering** | 用 AI agent 協助（或主導）軟體工程的開發方式，與傳統「人寫 code」相對 |
| **Slash Command** | 在 Cursor、Claude Code 等工具中以 `/` 開頭的指令，觸發預定義的 prompt 模板 |
| **NotebookLM** | Google 的筆記助理，特色是能從上傳文件生成「兩人對談」podcast |
| **Polymarket** | 去中心化預測市場，以「真金白銀下注」的方式對未來事件機率定價 |
| **Loop Engineering** | 2026-06-07 由 Peter Steinberger 提出的新術語：不要寫 prompt 給 coding agent，要設計「迴圈」讓 agent 自己跑 |
| **Context Compression** | 在 prompt 送進 LLM 之前，先用 lossless/semantic 壓縮減少 token 用量 |
| **Skill (Claude/Cursor)** | 給 agent 的可重用提示詞套件，類似於擴充功能的最小單位 |
| **Express Mode (11 Labs)** | 11 Labs 的語音模式，允許控制語調、情緒、停頓 |

---

## 五、人物與專案背景

### Matthew Berman（講者）
- 知名 AI 工具評測 YouTuber
- Forward Future 電子報作者
- 偏好「無 CLI 安裝」流程：直接把 GitHub URL 丟給 agent 說 install

### Matt Van Horn（Last30Days 作者）
- Lyft 共同創辦人
- Last30Days 在 GitHub 達 40K+ stars

### Addy Osmani（Agent Skills 作者）
- Google Chrome 團隊工程主管
- Agent Skills 達 56K+ stars，較 GStack 更聚焦工程流程

### Peter Steinberger（被引用人物）
- Loop Engineering 概念提出者
- 核心論點：「你不該再 prompt coding agent，你該設計迴圈讓 agent 跑」

### 11 Labs（贊助商）
- 11 Agents 平台：設計/部署/優化對話式 AI
- 與 Open Notebook 整合：可換上更自然的 podcast 語音

---

## 六、重要引用

> I found four free GitHub projects that you probably haven't heard of that are so valuable.
>
> — Matthew Berman 開場（00:00:02）

> Last 30 days... searches all of it in parallel, scores it by what real people actually engage with, and an AI agent judge synthesizes it into one brief.
>
> — 描述 Last30Days 的運作原理（00:01:15）

> Peter Steinberger posted, "You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agent."
>
> — 引用 Loop Engineering 起源（00:02:34）

> Headroom compresses everything your AI agent reads... before it reaches the LLM. Same answers, fraction of the tokens. It does not degrade quality, but it saves you so much on either your API bill or your quota.
>
> — 描述 Headroom 核心機制（00:11:05）

> One of the coolest features it has is this thing called headroom learn, which mines failed sessions and writes corrections to CLAUDE.md and agents.md.
>
> — Headroom 的殺手級功能（00:13:21）

---

## 七、核心主旨總結

> **真正的「AI 槓桿」不在更大的模型，而在巧妙的開源周邊**：用 Last30Days 過濾資訊噪音、用 Open Notebook 把知識工作本地化、用 Agent Skills 給工程流程紀律、用 Headroom 把 token 成本砍半。

---

## 八、金句摘錄

1. "It is what is trending lately on the internet, and it gives you that information." — Last30Days 的本質
2. "You shouldn't be prompting coding agents anymore. You should be designing loops that prompt your agent." — Peter Steinberger
3. "Same answers, fraction of the tokens." — Headroom 的價值主張
4. "The term is one week old. Verification is the whole game." — 對新術語的態度
5. "It is not some algorithm." — 強調人本訊號優先於演算法

---

## 九、相關資源連結

- Last30Days：https://github.com/mvanhorn/last30days-skill
- Open Notebook：https://github.com/lfnovo/open-notebook
- Agent Skills：https://github.com/addyosmani/agent-skills
- Headroom：https://github.com/chopratejas/headroom
- 11 Labs（贊助商）：https://bit.ly/43LT9jZ（優惠碼 `FORWARDFUTUREAI`）
- Matthew Berman Forward Future：https://forwardfuture.ai

---

## 十、給 Ryo / 禮士的行動建議

| 專案 | 應用場景 | 優先度 |
|------|---------|:----:|
| **Last30Days** | 蒐集「最近 30 天」open-source / AI 趨勢，搭配產出週報 | ⭐⭐⭐ |
| **Open Notebook** | 把團隊的技術文件 / SOP 做成可問答、可 podcast | ⭐⭐ |
| **Agent Skills** | 在 Cursor / Claude Code 中規範開發流程（特別是 Mame 測試、TDD） | ⭐⭐⭐ |
| **Headroom** | 直接裝起來省 Claude Code quota | ⭐⭐⭐⭐（**立即可裝**） |

> **禮士的後端視角**：Headroom 的 47–92% 節省數字對我們很關鍵——這個月的 Claude Code quota 已經快見底。建議先安裝 `headroom-wrap-claude --no-proxy` 試用一週。Agent Skills 則是直接對應 Mame 想要的「先 spec 再 code」流程紀律。
