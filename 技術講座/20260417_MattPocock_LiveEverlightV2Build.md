# 【LIVE: Watch me build a brand-new project from scratch — Matt Pocock 從零 vibe coding 一個 coding agent observability 平台】
## 影片基本資訊

> **影片連結：** https://www.youtube.com/live/K-mA3MZ_EzU
> **影片長度：** 107:30（6450 秒）
> **上傳日期：** 2026 年 4 月 17 日（live stream replay）

**主講｜Matt Pocock（AI Hero 創辦人 / Sandcastle 作者） ／ 2026 年 4 月 17 日 live stream**

> 本影片無章節、無字幕（YouTube live 通常不自動生成字幕），透過 Whisper base 模型 CPU 聽寫繁體中文混英文逐字稿（73k 字，ASR 雜訊較多），再由後端整理為結構化筆記。

---

## 一、主題與背景

本影片為 Matt Pocock 的 AI Hero 平台 live coding 直播，核心主題為**「vibe coding 從零打造 coding agent observability 平台」**。Matt 在直播中與觀眾共同探討三個層次：

1. **概念定義**：什麼是「vibe coding」？它跟規範驅動開發（spec-driven）、context-driven、Harness Engineering 的差異為何？
2. **選題決策**：為何選擇 coding agent observability（而非 bookmark manager、Obsidian vault 整合、coding agent skills 評估平台等）？
3. **實戰落地**：在直播當下用 AI SDK v6 + Next.js + Sandcastle 沙盒等技術，從零開始 scaffold 一個可運作的雛形，邊做邊決定技術細節（Rust vs TypeScript、Svelte vs React、Hooks model vs always-on daemon、DDD 語言定義 Session / Turn / Branch / Subagent 等）。

影片核心論點：**當 coding agents 在組織內普及後，「如何觀察它們」（tokens 花費、skill 命中率、session 分支結構）將成為下一個基礎設施需求** — 而 vibe coding 正是快速驗證這類基礎設施需求的最佳方法。

---

## 二、章節脈絡

### Section 1｜開場 — 定義 vibe coding 與直播範疇（00:00 ~ 15:00）

**重點摘要：** 直播開始，Matt 解釋什麼是「vibe coding」 — 跟規範驅動相對，強調 coding agent 即時產生程式碼、人工只需引導方向。

**內容：**
- 250+ 觀眾參與，Matt 感謝大家
- 「vibe coding」這個詞的定義 — 不是 spec-driven、不是 context-driven，是讓 agent 即時跑、即時改
- 直播任務：今天要 vibe coding 一個新 project from scratch
- Matt 提到工具偏好：VS Code 為主，會用到 Next.js、Claude、Cursor、GitHub Copilot 等
- Chat 建議題目：interview tasks、bookmarks manager、Obsidian vault integration、AI coding agent observability platform 等

### Section 2｜選題決策 — 為何是 coding agent observability（15:00 ~ 30:00）

**重點摘要：** Matt 從多個候選項目中挑選 coding agent observability platform — 因為這是他觀察到組織內最迫切的需求：觀察 coding agents 的 token 花費、skill 使用、session 結構。

**內容：**
- 候選題目比較：
  - Interview-level coding tasks（demo 用）
  - Bookmarks manager（太簡單）
  - Obsidian vault integration（有趣但 niche）
  - **Coding agent observability platform ← 最終選擇**
- 為何選 observability：Matt 注意到所有跑 coding agents 的團隊都需要「看見 token 花費」「看見 skill 命中率」「看見 session 結構」 — 這是普遍需求
- 命名：「Everlight V2」 — 從零開始、greenfield
- 拒絕 open-claw（雖被建議）：「I've never used open-claw, I've never tried open-claw」 — Matt 想自己 platform
- 提醒觀眾：今天展示的程式碼都會 push 到 public repo

### Section 3｜技術選型 — Next.js + AI SDK v6 + Sandcastle（30:00 ~ 45:00）

**重點摘要：** 開始 scaffold — 從 Next.js 起手，結合 Vercel AI SDK v6 + Sandcastle 沙盒架構，Matt 邊做邊決定技術細節。

**內容：**
- **Next.js** 起手 — 最熟悉的 React 全端框架
- **Vercel AI SDK v6** — Matt 的 AI SDK v6 Crash Course 是這次直播的主推產品
- **Sandcastle** — coding agent orchestrator，可在 sandbox 跑 agents
  - Sandcastle 的核心價值：「run some agent inside some sandbox」
  - 沙盒對於 coding agent 觀察至關重要（控制環境、蒐集訊號）
- 討論 Vercel AI SDK v6 vs Anthropic SDK vs OpenAI SDK
- 4.6x vs 4.7x model 版本差異 — Matt 認為人們過度 anthropomorphize LLMs（「4.6x feels different to 4.7」是 noise）

### Section 4｜資料模型 — Session / Turn / Branch / Subagent（45:00 ~ 65:00）

**重點摘要：** 進入 DDD（Domain-Driven Design）語言定義環節，Matt 與觀眾透過具體 scenario 釐清「Session 是什麼」、「Turn 是什麼」、「Branch / Fork 怎麼處理」。

**內容：**
- **核心問題**：coding agent 觀察需要怎樣的資料模型？
- **DDD 引入**：Matt 明確說「DDD is a fantastic match for AI coding」 — 因為 agent 系統的語言容易分歧，先用具體 scenario 對齊
- **Scenario A — The Explorer**：
  - Alice 正在 refactor auth module，跑到第 10 turns 遇到決策點
  - 嘗試 middleware 寫法 8 turns，不喜歡 → branch back
  - 改試 in-place refactor 12 turns → ship
  - 中間放棄的 branch 要不要算 session？
- **核心問題演變**：「這是 3 個 sessions 還是 1 個 session 配 DAG？」
- **結論雛型**：需要「New session with parent ID」 — 父子關係支援分支
- **Subagent 問題**：每個 subagent 寫自己的 JSONL，是 child session 還是 parent 的一部分？
- **可選實作**：TypeScript wizard — 用 AgentVersion 標記 session 樹狀結構

### Section 5｜Hooks model vs Always-on Daemon（65:00 ~ 80:00）

**重點摘要：** Matt 比較兩種蒐集 agent 訊號的架構 — 純 Hooks（fire-and-forget）vs Always-on Daemon（背景 process），最終觀眾的 insight 讓他接受 Hooks 為主要機制。

**內容：**
- **Daemon 方案**：long-running process，watch 所有 configured agents、FS watches on `.git/`
  - 缺點：使用者會忘記啟動 → 資料漏失
- **Hooks 方案**：透過 agent 的 hook 配置觸發，fire curl to backend 後退出
  - 優點：hook configuration = install，使用者不會忘記
  - 優點：process running delegated to downstream agent
- **Matt 起初推薦 Daemon，但被觀眾挑戰**：hook fires curl → backend exits，不需要 always-on daemon
- **Matt 接受修正**：「You're right, my recommendation was wrong, let me refactor」
- **結論**：hooks 是 trigger，daemon 在 backend 處理 → 解開「忘記啟動」問題

### Section 6｜實戰細節 — 程式碼片段與技術決策（80:00 ~ 95:00）

**重點摘要：** 進入實際寫程式階段，Matt 對每一個技術決策都即時與觀眾討論，並在「永遠 live coding」原則下不修補、不重來。

**內容：**
- **永遠 vibe coding**：不 commit 中間狀態、永久 keep alive（Matt 自嘲「is this engineering now?」）
- **架構原則**：domain model → ubiquitous language → concrete scenarios 對齊
- **Live 問答**：
  - Sandcastle 的挑戰：language / API / 理解需求（typical software development challenges）
  - Docker SBX provider（GitHub issue 剛被開）
  - Hooks 是否足夠 vs Daemon（前面已討論）

### Section 7｜技術選型辯論 — Rust vs TypeScript、Svelte vs React（95:00 ~ 105:00）

**重點摘要：** 直播尾聲，Matt 透過觀眾問答決定 binary 語言與 frontend framework — Rust binary 是「honest」選擇，但 Matt 承認他不會 Rust。

**內容：**
- **Rust vs TypeScript binary**：
  - Rust binary「genuine」 — 系統語言
  - Matt：「I've never written Rust before, I'm really intrigued by it」
  - Matt 對 Rust 陌生但想嘗試（vibe coding 哲學延伸：連不懂的語言都敢 vibe）
- **Svelte vs React**：
  - 兩者都 mature，「doesn't matter too much」
  - Matt 有 React 經驗
- **SlotWatch 靈感**：觀眾 Eddie 提出的 idea（細節未展開）

### Section 8｜結尾 — 拍板決定與後續計畫（105:00 ~ 107:30）

**重點摘要：** Matt 收尾，宣布 demo 新 Domain Model skill，並對「vibe coding 的本質」做最後反思 — engineering = tons of grilling、alignment、然後 let it rip。

**內容：**
- 決定事項：binary 用 Rust、frontend 選 React（他熟）
- 之後會 demo 新 Domain Model skill（另一支影片）
- 反思：「Is this engineering now?」 — yes, 但包含大量對齊
- **核心方法論**：a ton of grilling、a ton of figuring out、a ton of alignment、then let it rip
- Matt 對未來計劃：嘗試 Pi Agent（一直想轉移但有 inertia）

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處/應用 |
|------|------|-----------|
| Vibe coding | 讓 AI coding agent 即時產生程式碼，人工僅引導方向；不寫規格、不逐步審查 | Section 1 |
| Coding agent observability | 觀察 coding agents 的 token 花費、skill 命中率、session 分支結構、tool call 模式 | Section 2-5 |
| Hooks model | 透過 agent hook 配置觸發，fire curl to backend，process 由下游 agent delegate | Section 5 |
| Always-on daemon | 長駐背景 process，watch 所有 configured agents + FS watches | Section 5 |
| Sandcastle | Coding agent orchestrator，可在 sandbox 跑 agents — 提供可控環境與訊號蒐集 | Section 3 |
| Session / Turn / Branch / Subagent | coding agent 觀察的 DDD 語言：Session = 工作單元；Turn = 單次互動；Branch = 分支；Subagent = 子任務 | Section 4 |
| DDD（Domain-Driven Design） | 透過具體 scenario 對齊領域語言，特別適合 AI coding 系統（agent 語言容易分歧） | Section 4 |

---

## 四、人物/角色分析

### Matt Pocock（AI Hero 創辦人 / Sandcastle 作者）
- 背景：知名 TypeScript 教育者，2024 起轉向 AI 編碼工具開發；創建 AI Hero 課程平台、Sandcastle 多代理編碼框架、AI SDK v6 Crash Course
- 關鍵轉折：在 107 分鐘 live 內從零打造一個 coding agent observability 平台，邊做邊決定技術細節
- 代表觀點：「DDD is a fantastic match for AI coding」 — DDD 語言對齊特別適合 agent 系統
- 反思：「Is this engineering now? — yes, but tons of alignment before let it rip」

### Alice（虛構角色，DDD scenario A）
- 背景：正在 refactor auth module 的開發者
- 關鍵決策：嘗試 middleware 失敗 → branch back → 改試 in-place refactor 成功
- 角色功能：用來釐清「branch / abandon / ship」在 session 模型中如何表達

### Eddie（觀眾）
- 提出 SlotWatch idea（最終細節未展開，但啟發了結尾討論）
- 代表直播中「觀眾參與 vibe coding」的協作模式

---

## 五、核心主旨

> **當 coding agents 在組織內普及，「觀察它們」（token 花費、skill 命中率、session 分支結構）將成為下一個基礎設施需求；vibe coding 是快速驗證這類需求的最佳方法 — 但工程本質不變：大量對齊 + 大量釐清語言 + 然後放手讓 agent 跑。**

---

## 六、金句摘錄

1. 「Coding agent observability — teams need this all the time, they want to see how many tokens people are spending, they want to see skill 命中率.」 — Matt Pocock
2. 「Everlight V2 — from nothing, greenfield.」 — Matt Pocock
3. 「DDD is a fantastic match for AI coding.」 — Matt Pocock
4. 「Is this engineering now? Yeah — a ton of grilling, a ton of figuring out, a ton of alignment, then let it rip.」 — Matt Pocock
5. 「You're right, my recommendation was wrong, let me refactor — the hook is the trigger that starts a process, we don't need an always-on daemon.」 — Matt Pocock（接受觀眾修正）
6. 「I think people over-characterise LLMs and anthropomorphize LLMs too much.」 — Matt Pocock（對 4.6x vs 4.7x 爭論的回應）
7. 「I've never written Rust before, I'm really intrigued by it.」 — Matt Pocock（vibe coding 哲學延伸）
8. 「We don't need to run a separate process — we can totally delegate the process running down to the agent that's downstream.」 — Matt Pocock

---

## 七、延伸閱讀/參考

- **Vercel AI SDK v6 Crash Course**：https://www.aihero.dev/workshops/ai-sdk-v6-crash-course（Matt 主推）
- **Sandcastle**：coding agent orchestrator，可在 sandbox 跑 agents
- **Matt Pocock Twitter**：https://twitter.com/mattpocockuk
- **Discord**：https://aihero.dev/discord
- **DDD（Domain-Driven Design）**：Eric Evans 原著，Matt 推薦搭配 AI coding 使用

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone `xiaotian_clone_v1`, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260417_MattPocock_LiveEverlightV2Build_口播稿.txt

- [opus X.X MB](../audio/20260417_MattPocock_LiveEverlightV2Build_口播稿.opus)（Telegram 友善）
- [m4a X.X MB](../audio/20260417_MattPocock_LiveEverlightV2Build_口播稿.m4a)（iOS 友善）
- [mp3 X.X MB](../audio/20260417_MattPocock_LiveEverlightV2Build_口播稿.mp3)（通用格式）