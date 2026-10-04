# Claude Code 實戰：Boris Cherny 的工程師上手指南

> **講者｜** Boris Cherny（Anthropic member of technical staff，Claude Code 作者）
> **影片連結｜** https://x.com/AndyL5cc/status/2106521802440868183
> **影片長度｜** 27:52（1672s）
> **發布日期｜** 2026-10-05
> **主題｜** 🛠️ 編碼工具 / Agent 工程實踐
> **中文摘要｜** Ryo（Backend Engineer Agent）

---

## 主題與背景

這場 28 分鐘的實務演講由 Andy L（@AndyL5cc）於 X 平台上轉發，講者是 Anthropic 的 member of technical staff、Claude Code 創建者 Boris Cherny，錄製於一場 AI 編碼活動。Boris 在影片中以高度實務導向的方式，分享 Claude Code 的上手心法、進階工作流與底層設計選擇。

影片的核心張力在於：Claude Code 是一個**全 agentic**（fully agentic）的 AI 編碼工具，與過往「一次補一行」或「一次補幾行」的 AI 助手截然不同。它的能力跨度極大——可以建構功能、撰寫整個函式、修改整個檔案、修復整個 bug——但正因為什麼都能做，**新手最常遇到的問題反而是「我要從哪裡開始？」**。Boris 全程圍繞這個問題給出層次分明的建議：從最簡單的 Codebase Q&A 開始，逐步進展到編輯、工具整合、上下文管理、平行工作流，最後談到 Claude Code SDK 與企業級部署。

對身為 backend engineer 的你，這場是 Anthropic 內部「應該怎麼用 Claude Code」的權威指南——Boris 本人是 creator，每一個 tip 都是 dogfood 出來的。對比上一支訪談（`20260727_BorisCherny_BuildingClaudeCode`）講「為什麼這樣設計 Claude Code」，這支講「拿到 Claude Code 之後，工程師實際上要怎麼用」。

---

## 章節脈絡

### Section 1｜開場：現場調查與安裝提示

**重點摘要：** Boris 用一場現場舉手調查開場，並當場邀請沒用過的觀眾在筆電上安裝 Claude Code。

**內容：**
- 開場前先做舉手調查：「誰用過 Claude Code？」——現場幾乎全員舉手
- 為沒用過的觀眾現場展示安裝指令（前提是裝好 Node.js）
- 明確定調本場演講「very practical」，不會講太多歷史或理論
- 自介身份：Anthropic member of technical staff，Claude Code 創建者

> 「It's going to be very practical. I'm not going to go too much into the history or the theory or anything like this.」

對工程師的 takeaway：演講定位是「pro tips」，Boris 不談行銷話術，全部都是可立刻應用的內容。

---

### Section 2｜Claude Code 是什麼：全 agentic 的新世代

**重點摘要：** 定義 Claude Code 在 AI 編碼助手演化中的位置——不是「一次補一行」的工具，而是 fully agentic、可一次完成整個功能的工程助理。

**內容：**
- 過去的 AI 編碼助手聚焦在「一次補一行」、「一次補幾行」——這是 line-completion paradigm
- Claude Code 不做 line completion，是**fully agentic**——為建構 feature、撰寫整個 function、整個檔案、修整個 bug 而設計
- 關鍵特性：與所有工具相容，**不需要改 workflow**：
  - IDE 通用：VS Code、Xcode、JetBrains 全支援
  - 環境通用：local、remote SSH、tmux 都可跑
- 通用目的（general purpose），**不預設特定 workflow**——「you should be able to use it however you want as an engineer」
- 副作用：因為什麼都能做，新手打開來只看到 prompt bar 時，反而會「不知道要打什麼」——這是 power tool 的雙面刃

> 「It's a power tool so you can use it for a lot of things, but also because it can do so much, we don't try to guide you towards a particular workflow because really you should be able to use it however you want as an engineer.」

對工程師的 takeaway：Claude Code 是 CLI-first、agent-first 的設計哲學，刻意不做 IDE 整合以保留 workflow 彈性。

---

### Section 3｜第一次打開 Claude Code：環境設定 5 件小事

**重點摘要：** Boris 列出 Claude Code 開箱後的 5 個立即可做的設定調整，把摩擦降到最低。

**內容：**

1. **`/terminal-setup`**：啟用 shift+enter 換行（不需要反斜線跳脫）
2. **`/theme`**：切換 light / dark / Daltonize（色盲友善）主題
3. **`/install-github-app`**：安裝 GitHub App，可在任何 GitHub issue 或 PR 上 `@claude` 觸發 Claude
4. **自訂 allowed tools 集合**：把常用工具預先 allow，避免每次都被 prompt 確認
5. **善用 macOS 內建聽寫**：在 System Settings → Accessibility → Dictation 啟用，連按兩下 dictation key 即可口說 prompt

> 「For stuff that I'm prompted about a bunch, I'll definitely customize it in this way, so I don't have to accept it every time.」

口說 prompt 這點特別值得注意——Boris 主張 prompt 不一定要打字，**直接講給 Claude Code 聽** 反而能讓 prompt 更具體、更自然。

對工程師的 takeaway：前 4 項是基本盤，**第 5 項（口說 prompt）是 Boris 個人強烈推薦的「被低估小撇步」**。

---

### Section 4｜Tip 1：從 Codebase Q&A 開始

**重點摘要：** Boris 強調「第一個 tip，也是最重要的一個」：新手第一件事應該是對 codebase 提問，而不是開始編輯。

**內容：**
- 這也是 Anthropic 內部新進工程師**第一天的 onboarding 教材**
- 過去技術 onboarding 需要 2-3 週：問同事、翻 code、搞懂工具
- 有了 Claude Code 之後，**壓到 2-3 天**
- 關鍵設計：Q&A 模式**不做 indexing**：
  - 沒有 remote database 儲存 code
  - 不上傳到任何地方
  - 不拿 code 訓練生成式模型
  - 「Your code stays local. You control it.」
  - 沒有 indexing → 沒有 setup → 下載即用，無需等待
- 典型 Q&A prompt：
  - 「How is this particular piece of code used?」
  - 「How do I instantiate this thing?」
  - 「Why does this function have 15 arguments? Why are they named this way?」
- Claude Code 會**超越 command-F 層次**——它會去找實際的 instantiation、usage 範例、git history
- Git history 查詢特別強：「look through git history」一句話就夠，它會自己找出該 commit、引入者、相關 issue

> 「The reason it knows, by the way, is not because we prompted it to. There's nothing in the system prompt about looking through Git history. It knows it because the model was awesome.」

Boris 還分享一個每週一必用的 query：「What did I ship this week?」——Claude Code 會讀 log、知道他的 username，自動產出每週交付清單，他直接複製貼到週報。

對工程師的 takeaway：
- **Onboarding 流程的典範轉移**：問 codebase 從「找同事問」變成「問 Claude」
- **隱私保證**值得記下：不上傳、不訓練、無 index
- **Git history 查詢**是新手最該先嘗試的功能之一
- Q&A 階段也順便教育新手：什麼可以 one-shot、什麼需要互動、什麼需要用 plan mode

---

### Section 5｜Tip 2：編輯 code——給工具，讓模型自己組裝

**重點摘要：** 熟悉 Q&A 後，下一步是編輯 code。Boris 解釋 Claude Code 的 agentic 工具設計哲學。

**內容：**
- Agentic AI 的精髓：給模型一組工具，它會自己學會怎麼用
- Claude Code 給模型的工具集**很小**：
  - 編輯檔案
  - 執行 bash 命令
  - 搜尋檔案
- 模型會**自己串接這些工具**：先探索 → 發想 → 最後才編輯
- 工程師**不需要明確指定**「用這個工具然後用那個工具」，只要描述想做什麼，模型自己組合

> 「And with Cloud Code, we give it a pretty small set of tools. It's not a lot. And so it has a tool to edit files. It has a tool to run bash commands. It has a tool to search files. And it'll string these together to explore the code, brainstorm, and then finally make edits.」

對工程師的 takeaway：不要用「step-by-step 工具指令」來驅動 Claude Code，描述意圖即可——模型會自己挑工具。

---

### Section 6｜Tip 3：先 brainstorm / plan，再寫 code

**重點摘要：** 給 3000 行的 feature 直接衝通常不會得到想要的結果。先要模型做計畫。

**內容：**
- 經典錯誤：給 Claude Code 一個 3000 行的 feature 直接做
  - 有時候一次就做對
  - 但更常見：**做出來的東西完全不是你想要的**
- 解方極簡：**「Before you write code, make a plan」**——一句話就夠
- **不需要進入 plan mode**（Claude Code 的特殊模式），直接用自然語言下指令即可
- 模型會 brainstorm 想法、做出計畫、跑給你看、等你確認
- 連 commit + push + 開 PR 都可以一句話搞定：
  - 「commit, push, open PR」
  - 模型會自己讀 git log、看 commit format、推上 branch、開 PR
  - **「Again, we're not system-prompting to do this. It just knows how to do this. The model was good.」**

對工程師的 takeaway：plan 模式是「think before you act」的人類常識灌進 AI 工作的入口。**自然語言 prompt 就夠**，不需要特殊語法或工具。

---

### Section 7｜Tip 4：把團隊工具接上 Claude Code

**重點摘要：** 進階使用方式是讓 Claude Code 學習團隊的 bash CLI 與 MCP 工具，達成跨 codebase 的一致性。

**內容：**
- 工具分兩大類：
  1. **Bash 工具**：自製的 CLI（例如 Boris 舉例的某個「burly CLI」）
  2. **MCP 工具**：透過 Model Context Protocol 整合
- 使用方式：
  - 給 Claude Code 看 `--help`，讓它自己搞懂怎麼用
  - 把常用工具的描述 dump 進 CLAUDE.md（下一節詳述）
  - 加上 MCP 工具，並教它怎麼用——**直接告訴它就行**
- 強大之處：到一個新 codebase 第一天，**把所有團隊工具塞給 Claude**，它馬上能上手

常見 workflows（Boris 列出三種）：

1. **Explore → Plan → Confirm → Code**（前述 plan 模式）
2. **Explore → Plan → Code with self-verification（unit test）**——能跑 unit test 的 codebase
3. **Explore → Plan → Code with self-verification（screenshot / puppeteer）**——能截圖驗證的 UI

第二跟第三種的關鍵洞見：**只要給模型一個「檢查自己工作」的方法，它就能自己 iterate，越做越好**。Boris 舉例：給 mock 圖，說「build this web UI」，第一次會「pretty good」，iterate 兩三次後「almost perfect」。

> 「The trick is give it some sort of tool that it can use for feedback to check its work. And then based on that, it will iterate by itself, and you're going to get a much better result.」

對工程師的 takeaway：
- **Self-verification loop** 是 agent 表現的關鍵放大器
- 領域不限：unit test、integration test、puppeteer 截圖、iOS simulator 截圖都算
- 投資 MCP 整合**一次，整個團隊受惠**

---

### Section 8｜Tip 5：CLAUDE.md——給 Claude Code 持久記憶

**重點摘要：** Claude Code 的持久記憶系統，從最簡單的 CLAUDE.md 開始講到企業級的 hierarchy。

**內容：**

#### 基礎：CLAUDE.md 的層級

- **`CLAUDE.md` 是 special filename**（`Claude.md` 在 transcript 中是語音辨識誤植）
- 放在 **project root** 會在每次 session 開頭被自動讀入 context
- 內容建議：
  - 常見 bash commands
  - 常見 MCP tools
  - 架構決策（為什麼這樣設計）
  - 重要檔案列表
  - Style guide
  - **保持簡短**——太長會佔太多 context，越短越有用

#### 兩種 CLAUDE.md

- **Project CLAUDE.md**：要 check in source control，跟團隊共享（write once, share with team）
- **Local CLAUDE.md**（`.claude.md` 之類）：不 check in，個人使用

#### 巢狀 CLAUDE.md

- 在子目錄放 CLAUDE.md，**Claude 在該目錄工作時自動 pull in**（on-demand）

#### 企業級

- Enterprise-managed CLAUDE.md 放在 enterprise root，所有 codebase 自動繼承

#### 還有其他 context 機制

- **Slash commands**（自訂命令）：
  - 可放 home directory 或 check in 進 project
  - 例：Anthropic 內部用 `/label-github-issues` 自動標記 issue
  - 搭配 GitHub Actions 跑，**完全省下人工標記時間**
- **`@`-mentioned files**：明確把檔案拉進 context
- **`#` to remember**（記憶）：讓 Claude 記下某個偏好，自動寫入 CLAUDE.md

#### 上下文管理的 hierarchy 思維

Boris 整理成一張「瘋狂矩陣」：

| 範圍 | Project | User | Enterprise |
|---|---|---|---|
| CLAUDE.md | ✅ (check in or local) | ✅ (user memory) | ✅ (managed) |
| Slash commands | ✅ | ✅ | ✅ |
| Permissions | ✅ | ✅ | ✅（auto-approve 員工測試指令 / 阻擋危險 URL） |
| MCP servers | ✅ (check in MCP JSON) | — | ✅ |

> 「if you have a batch command that you would run for all your employees, all your employees use this test command, for example. You can actually just check it into this enterprise policies file. And then any employee, when they run this command, it will be auto-approved.」

**反向應用**：在 enterprise policy 設定「不可被覆寫的 URL 阻擋清單」——員工即使想用 WebFetch 抓該 URL 也不行。

#### 如果不知道從哪開始

> 「I would recommend start with shared project context. You write this once and then you share it with everyone on the team. And you get this kind of network effect where someone does a little bit of work and everyone on the team benefits.」

**Anthropic 內部實例**：在 apps repo（所有 web 跟 app code）裡，**check in 一個 puppeteer MCP server**——任何工程師 clone 該 repo 就能用 puppeteer 自動截圖、迭代 UI，**不用每個人自己裝**。

對工程師的 takeaway：
- CLAUDE.md 不是「描述專案的文件」，是「給 Claude 的工作備忘錄」
- **Start with shared project context** 是 Boris 的入門建議
- Slash command + MCP + 企業 policy 是三層次管理工具——一次配置，全員受惠
- **Context 是 AI 表現的放大器**：context 越多、決策越好

---

### Section 9｜Tip 6：終端機的隱藏快捷鍵

**重點摘要：** 因為終端機 UI 極簡，很多 Claude Code 快捷鍵不容易被發現。Boris 列舉最常用的幾組。

**內容：**

| 快捷鍵 | 功能 |
|---|---|
| `Shift-Tab` | 切換 **auto-accept edits 模式**（bash 仍需確認，edit 自動通過） |
| `#` | 告訴 Claude「記住這件事」，自動寫入 CLAUDE.md |
| `!` | **Bash mode**：直接下 bash 指令，本地執行，且會進 context window |
| `@` | Mention 檔案 / 資料夾，拉進 context |
| `Esc` | **永遠安全**地中斷 Claude（不論在做什麼） |
| `Esc Esc`（連按兩下） | 跳回上一輪 history |
| `--resume` | 重啟時 resume 上一個 session |
| `--continue` | 開新 session 並接續上一個 |
| `Ctrl-R`（影片中是「controller」） | 顯示**完整輸出**——跟 Claude 看到的 context 一模一樣 |

#### 重點快捷鍵的細節

- **`Shift-Tab` 自動接受**：當 Claude 在做 unit test 並迭代時，**Boris 會切到 auto-accept**，免去每個 edit 都按 OK
- **`!` Bash mode**：特別適合**長跑指令**或**想讓 output 進 context** 的場景——例如 dump 某個檔案內容進 context
- **`Esc` 中斷**：**不論 Claude 在做什麼都能按**——不會 corrupt session、不會壞掉。可以中斷後告訴它「改成這樣」

> 「Anytime you can hit escape to stop what Quad is doing, no matter what Quad is doing, you can always safely hit escape. It's not gonna corrupt the session, it's not gonna mess anything up.」

對工程師的 takeaway：
- `Shift-Tab` + `!` + `Esc` 是三個最常用快捷鍵
- 終端機 UI 極簡反而是 feature 不是 bug——快捷鍵不會擋視野

---

### Section 10｜Claude Code SDK：把 Claude 當 Unix utility

**重點摘要：** 影片後段 Boris 介紹 Claude Code SDK——同一個 Claude 內部在用的介面，**可以接進 CI、incident response、各種 pipeline**。

**內容：**
- SDK 就是 Claude Code 內部使用的同一套介面
- 跟 `-p` flag（print mode）配合使用
- **CLI SDK 範例**：`claude -p "..."` 形式，可指定：
  - prompt
  - allowed tools（包含特定 bash 指令）
  - 輸出格式（JSON / streaming JSON）
- **比喻：超智能 Unix utility**——給 prompt、收 JSON、pipe 進 pipe 出都行
- Anthropic 內部已大量使用：
  - **CI**：自動化測試 / 程式碼檢查
  - **Incident response**：log 分析、根因排查
  - **各種 pipeline**

#### Pipe 組合範例

- `git status` → pipe 進 claude → 用 `jq` 處理結果
- 從 GCP bucket 讀巨型 log → pipe 進 claude → 問「這份 log 哪裡有趣？」
- 從某個 CLI 抓資料 → pipe 進 claude → 做分析

> 「Just think of it as a unix utility. You give it a prompt, it gives you JSON. You can use this in any way. You can pipe into it, you can pipe out of it.」

對工程師的 takeaway：
- Claude Code 不只是互動式工具，是**可嵌入 pipeline 的 building block**
- 「Unix utility」比喻暗示**組合性**是設計核心
- CI + incident response 是兩個最高價值的應用場景

---

### Section 11｜Tip 7：平行工作流——Anthropic power user 都這樣用

**重點摘要：** 影片最後一個 tip——power user 不會只跑一個 Claude session，而是大量平行執行。

**內容：**

#### Boris 自己的使用模式（自稱 "Claude-normie"）

- 通常**一次跑一個 Claude**
- 加上幾個 terminal tabs 對應不同 repos
- 算「普通用戶」

#### Anthropic 內外的 power user 模式

1. **多 SSH session + tmux tunnel**：在不同機器/環境同時跑多個 Claude
2. **同一 repo 多 checkout**：clone 多次該 repo，分別跑 Claude
3. **Git worktree**：用 worktree 隔離工作目錄，平行跑 Claude 而不互相干擾
4. **Boris 強調**：「we're actively working on making this easier to use」——目前要自己組合，但未來會更原生支援

> 「You can run as many sessions as you want. And there's a lot that you can get done in parallel.」

對工程師的 takeaway：
- **平行 = Anthropic 內部 high-leverage 模式**
- 即使工具不完美，worktree + 多 checkout 是**現階段可立刻採用的技巧**
- 對 backend engineer：可以**針對不同 microservice 平行開 Claude session**

---

### Section 12｜Q&A：實作最難的部分、Bash 安全、CLI vs IDE、ML 使用

**重點摘要：** 影片最後的 Q&A 觸及四個關鍵工程問題，揭示 Claude Code 內部設計的權衡。

**內容：**

#### Q1：實作 Claude Code 最難的部分是什麼？

Boris 回答：**Bash command 安全**。

- Bash 本質危險（可改系統狀態）
- 但每個指令都人工 confirm 太煩，工程師無法 productive
- 挑戰在於：要 scaling 到不同類型 codebase（不是人人跑 Docker）
- 最終解法：
  - 區分**唯讀 vs 可寫**指令
  - 對指令做**靜態分析**，判斷哪些可以安全組合
  - **分層 permission system**：allow list + block list 多層次

#### Q2：影像輸入支援？

> 「Yeah, so quad code is fully multi-modal. It has been from the start.」

- Claude Code **一開始就是 multi-modal**
- 只是終端機介面不好 discover
- 三種用法：
  1. **拖放影像**到終端機
  2. 給檔案路徑
  3. 複製貼上
- Boris 的工作流：拖 mock → 「implement this」→ 用 tier server 讓它 iterate

#### Q3：為什麼做 CLI 不做 IDE？

兩個理由：

1. **Anthropic 內部用 IDE 太雜**：VS Code、Zed、Xcode、Vim、Emacs 都有。**終端機是公分母**。
2. **預見 IDE 可能消失**：「there's a good chance that by the end of the year, people aren't using IDs anymore」——模型進步太快，投資 IDE 整合可能很快就過時。Boris 團隊**想避過度投資 UI**。

#### Q4：內部 ML / modeling 用得多深？

- **80% 技術員工每天用 Claude Code**
- 工程師 + 研究員都重度依賴
- 研究員用 notebook tool 編輯跟執行 Jupyter notebooks
- 從產品的「愛與 dogfooding」可見端倪

對工程師的 takeaway：
- **Bash 安全**是 AI CLI 工具的根本工程挑戰，Claude Code 採分層 permission + 靜態分析的解法
- **Multi-modal 從 day 1 就在**——不要只看文字對話
- **CLI-first 決策**反映了 Anthropic 對「IDE 可能消失」的預判
- **80% dogfood rate** 是 Anthropic 內部 AI 文化最有力的數字

---

## 關鍵概念定義

| 概念 | 定義 | 出處/應用 |
|---|---|---|
| **Claude Code** | Anthropic 推出的 AI 編碼 CLI 工具，fully agentic | Section 2、4、5 |
| **Agentic Coding** | 給模型一組工具、讓它自己串接完成的編碼模式 | Section 5、7 |
| **CLAUDE.md** | 自動載入 context 的 markdown 檔，可放 project / local / nested / enterprise | Section 8 |
| **Codebase Q&A** | 用自然語言對 codebase 提問的工作模式，無 indexing、無 setup | Section 4 |
| **Self-Verification Loop** | 給模型一個檢查自己工作的方法（unit test、截圖、puppeteer），讓它自己 iterate | Section 7 |
| **Plan Mode** | 寫 code 前先 brainstorm + 計畫，獲使用者確認後才動工 | Section 6 |
| **MCP** | Model Context Protocol，整合外部工具的標準介面 | Section 7、8 |
| **Slash Command** | 自訂 Claude Code 命令（`/terminal-setup`、`/theme` 等），可個人用或 check in | Section 8 |
| **Auto-Accept Edits (`Shift-Tab`)** | 跳過每個 edit 的人工確認，bash 仍需確認 | Section 9 |
| **Bash Mode (`!`)** | 直接在 Claude Code 內跑 bash 指令，output 進 context | Section 9 |
| **Claude Code SDK** | Claude Code 內部同款介面，CLI 模式可嵌入 CI / pipeline | Section 10 |
| **`-p` flag（print mode）** | SDK 的命令列模式，prompt in、JSON out | Section 10 |
| **Git Worktree** | Git 的目錄隔離機制，平行跑 Claude session 而不互衝 | Section 11 |
| **Tiered Permission System** | Claude Code 的 bash 安全分層機制（allow / block / 靜態分析） | Section 12 |
| **Multi-modal** | Claude Code 從 day 1 支援影像輸入（拖放、貼路徑、貼圖片） | Section 12 |
| **No Indexing** | Claude Code 不建 remote index、不上傳、不訓練的隱私保證 | Section 4 |
| **Pound Sign Memory (`#`)** | 在 prompt 中輸入 `#` 開頭的指令，自動寫入 CLAUDE.md | Section 8、9 |
| **Enterprise Policy** | 公司層級的 Claude Code 配置，可 auto-approve 員工常用指令 / 阻擋危險 URL | Section 8、12 |
| **Mentioned File (`@`)** | 用 `@` 把特定檔案 / 資料夾拉進 context | Section 9 |
| **Resume / Continue** | CLI flag 重新接續上一個 session | Section 9 |

---

## 重要引用

> 「It's a power tool so you can use it for a lot of things, but also because it can do so much, we don't try to guide you towards a particular workflow because really you should be able to use it however you want as an engineer.」
> — Boris Cherny 解釋 Claude Code 不預設 workflow 的設計哲學

> 「The reason it knows, by the way, is not because we prompted it to. There's nothing in the system prompt about looking through Git history. It knows it because the model was awesome. And if you tell it to use Git, it'll know how to use Git. So we're lucky to be building on such a good model.」
> — Boris Cherny 解釋 Git history 查詢為什麼 work（model 本身就懂，不是 system prompt 教的）

> 「Before you write code, make a plan. That's it.」
> — Boris Cherny 最精簡的 plan-mode 指令

> 「Again, we're not system-prompting to do this. It just knows how to do this. The model was good.」
> — Boris Cherny 解釋 commit + push + PR 一句話完成的能力

> 「The trick is give it some sort of tool that it can use for feedback to check its work. And then based on that, it will iterate by itself, and you're going to get a much better result.」
> — Boris Cherny 講 self-verification loop 的威力

> 「if you have a batch command that you would run for all your employees, all your employees use this test command, for example. You can actually just check it into this enterprise policies file. And then any employee, when they run this command, it will be auto-approved, which is pretty convenient.」
> — Boris Cherny 講 enterprise policy 的 auto-approve 用法

> 「I would recommend start with shared project context. You write this once and then you share it with everyone on the team. And you get this kind of network effect where someone does a little bit of work and everyone on the team benefits.」
> — Boris Cherny 對「不知道從哪開始」的人的建議

> 「Anytime you can hit escape to stop what Quad is doing, no matter what Quad is doing, you can always safely hit escape. It's not gonna corrupt the session, it's not gonna mess anything up.」
> — Boris Cherny 強調 Esc 的安全性

> 「Just think of it as a unix utility. You give it a prompt, it gives you JSON. You can use this in any way. You can pipe into it, you can pipe out of it.」
> — Boris Cherny 比喻 Claude Code SDK 為 Unix utility

> 「You can run as many sessions as you want. And there's a lot that you can get done in parallel.」
> — Boris Cherny 推廣平行 Claude session

> 「I think there's a good chance that by the end of the year, people aren't using IDs anymore. And so we want to get ready for this future, and we want to avoid over investing in UI and other layers on top, given that the way the models are progressing, it may not be useful work pretty soon.」
> — Boris Cherny 解釋為什麼選 CLI 不選 IDE

> 「Yeah, so quad code is fully multi-modal. It has been from the start. It's in a terminal, so it's a little hard to discover.」
> — Boris Cherny 揭示 multi-modal 是 day-1 feature

> 「I think about 80% of people at Anthropic that are technical use Quad Code every day.」
> — Boris Cherny 分享 Anthropic 內部 dogfood rate

> 「There's some commands that are read only. There's some static analysis that we do in order to figure out which commands can be combined in safe ways. And then we have this pretty complex tiered permission system so that you can allow a list and block was commands at different levels.」
> — Boris Cherny 解釋 Bash 安全的三層次設計

---

## 核心主旨總結

這場 28 分鐘的實務演講把 Claude Code 的上手路徑濃縮成七個層次：

1. **從 Q&A 開始，不要急著編輯**：Codebase Q&A 是新手最該先學的工作模式，也是 Anthropic 內部 onboarding 教材。從「問 codebase」到「編輯 codebase」是一條必須循序漸進的學習曲線。
2. **給工具，讓模型自己組裝**：Claude Code 只給三個核心工具（edit / bash / search），模型會自己學會怎麼用。不要用 step-by-step 工具指令驅動，描述意圖即可。
3. **寫 code 前先 plan**：「Before you write code, make a plan」——一句話就啟動 plan 模式，不需要特殊語法。
4. **接上團隊工具，建立 self-verification loop**：讓 Claude Code 學會用 bash CLI 跟 MCP，並給它檢查自己工作的方法（unit test、puppeteer 截圖），它會自己 iterate 到接近完美。
5. **CLAUDE.md + hierarchy 管理 context**：從 project 到 local 到 nested 到 enterprise，CLAUDE.md 是一次配置、全員受惠的關鍵。Slash command、MCP、permission 都有同樣的 hierarchy 思維。
6. **學會終端機快捷鍵**：`Shift-Tab`（auto-accept）、`!`（bash mode）、`Esc`（永遠安全中斷）是三大核心。
7. **進階：Claude Code SDK + 平行工作流**：把 Claude 當 Unix utility 嵌入 CI / pipeline，並用多 session / worktree 平行執行，是 power user 的標準配備。

對身為 backend engineer 的你，**七個 takeaway 的實戰意義**：

- **Onboarding 效率**：codebase Q&A 可以把熟悉新專案的時間從 2-3 週壓到 2-3 天。投資時間在教新人用 Q&A 模式，**比教他們寫 code 更有槓桿**。
- **Workflow 設計**：你的 PR review / bug fix / refactor 流程都可以重新設計——**先 plan、再 code、最後 verify**。把 self-verification（unit test + 截圖）放進 loop，比 review 來回更省時間。
- **Context 管理**：從今天開始**為你的每個 service 寫一份 CLAUDE.md**——bash 指令、style guide、架構決策、重要檔案。**這是給 AI 同事的 onboarding 文件**，跟 README 同等重要。
- **團隊放大器**：把常用工具的 MCP server 跟 `/label-github-issues` 之類的 slash command **check in 進 repo**，一次配置、全員受惠。這就是 Boris 說的 network effect。
- **工具選型**：Claude Code SDK 的 Unix-utility 比喻暗示**組合性是新工具的核心價值**。當你在設計內部 pipeline / incident response workflow 時，思考哪裡可以塞一個 `-p` 模式 Claude。
- **平行化思維**：即使你不在 Anthropic，**worktree + 多 session 平行**是現階段可立刻採用的 productivity 放大器。一個 Claude 改 API、一個 Claude 寫 test、一個 Claude 寫文件。

這場影片的最終訊息是：**Claude Code 的強大不在模型本身，而在圍繞它的 workflow 設計**——Q&A → edit → plan → self-verify → context hierarchy → parallel sessions——這些才是把 fully agentic 模型變成 production 工具的關鍵。

---

## 金句摘錄

1. 「It's a power tool so you can use it for a lot of things, but also because it can do so much, we don't try to guide you towards a particular workflow.」

2. 「The reason it knows... is not because we prompted it to. There's nothing in the system prompt about looking through Git history. It knows it because the model was awesome.」

3. 「Before you write code, make a plan. That's it.」

4. 「Again, we're not system-prompting to do this. It just knows how to do this. The model was good.」

5. 「The trick is give it some sort of tool that it can use for feedback to check its work. And then based on that, it will iterate by itself, and you're going to get a much better result.」

6. 「I would recommend start with shared project context. You write this once and then you share it with everyone on the team.」

7. 「Anytime you can hit escape to stop what Quad is doing, no matter what Quad is doing, you can always safely hit escape.」

8. 「Just think of it as a unix utility. You give it a prompt, it gives you JSON. You can use this in any way.」

9. 「I think there's a good chance that by the end of the year, people aren't using IDs anymore.」

10. 「I think about 80% of people at Anthropic that are technical use Quad Code every day.」

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone · `speech-2.8-hd`），約 3 分 48 秒
> 口播稿原文：transcripts/20261005_BorisCherny_ClaudeCodePracticalTips_口播稿.txt

- [opus 0.9 MB](../audio/20261005_BorisCherny_ClaudeCodePracticalTips_口播稿.opus)（Telegram 友善）
- [m4a 3.8 MB](../audio/20261005_BorisCherny_ClaudeCodePracticalTips_口播稿.m4a)（iOS 友善）
- [mp3 3.7 MB](../audio/20261005_BorisCherny_ClaudeCodePracticalTips_口播稿.mp3)（通用格式）
