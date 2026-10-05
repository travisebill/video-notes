---
講者: Paul Ehrlich（DeepLearning.AI × JetBrains）
影片連結: https://youtu.be/hy8UstR2NEg
影片長度: 61:33（3693s）
發布日期: 2026-09-22
主題: 🛠️ 編碼工具 / Agent 工程實踐
---

# 【DeepLearning.AI × JetBrains — Spec-Driven Development with Coding Agents】

> **講者｜** Paul Ehrlich（JetBrains 開發者倡導者 Developer Advocate；課程由 DeepLearning.AI 與 JetBrains 合作，Andrew Ng 開場介紹）
> **影片長度｜** 61:33（3693s）
> **主題｜** 🛠️ 編碼工具 / Agent 工程實踐

> **課程連結：** https://youtu.be/hy8UstR2NEg
> **課程長度：** 61:33（3693 秒）
> **講師：** Paul Ehrlich（JetBrains 開發者倡導者 Developer Advocate）
> **製作單位：** DeepLearning.AI 與 JetBrains 合作課程；開場由 Andrew Ng 介紹
> **性質：** 完整 specification-driven development（SDD）實戰課程
> **課程範例專案：** Agent Clinic（Next.js + React 全端 web app，AI 代理人向人類求救的趣味 parody）
> **課程使用工具：** WebStorm IDE + Claude Code（亦示範 ACP Registry 跨 IDE 切換）
> **錄製時間：** 2026 年；上傳日期 2026-09-22
> **逐字稿來源：** YouTube 自動英文字幕（en VTT，自動累積已清除），原文 `transcripts/20260922_DeepLearningAI_SpecDrivenDevelopment_逐字稿.txt`

## 🎬 解說動畫

<video controls preload="metadata" playsinline
       poster="https://pub-8c6a0a19b73242aca31442f82f8ccd77.r2.dev/20261006_DeepLearningAI_SpecDrivenDevelopment_explainer_poster.jpg"
       style="width:100%;max-width:960px;border-radius:8px;background:#000">
  <source src="https://pub-8c6a0a19b73242aca31442f82f8ccd77.r2.dev/20261006_DeepLearningAI_SpecDrivenDevelopment_explainer.mp4" type="video/mp4">
  你的瀏覽器不支援 HTML5 影片，請改用下方連結。
</video>

**[▶ 觀看解說動畫（10:13 · 1920×1080 · 12 場景）](https://pub-8c6a0a19b73242aca31442f82f8ccd77.r2.dev/20261006_DeepLearningAI_SpecDrivenDevelopment_explainer.mp4)**

> 這支動畫把本文 20 個章節全部收進 12 個場景，旁白逐章覆蓋、不省略任何一條重點（約 10 分鐘）。手繪舞台動畫，非逐字稿轉圖。

---

## 零、本課程一句話總覽

課程主張：目前若要用 coding agent 建構「production-grade」嚴謹應用，**specification-driven development（SDD）** 是最佳工作流程。它的核心精神是「**agent is the muscle, specification is the brain**」——讓人類回到 senior architect 的位置，把設計、驗收、規格演進的責任扛起來；agent 負責把腦袋設計的內容產成 production-ready 程式碼。整個 workflow 圍繞一份活的 **constitution（章程）** 與一份份 **feature spec（特性規格）**，搭配 branch 隔離、human-in-the-loop 驗收、skill 自動化三件武器，在 vibe coding 的混沌中重新拉回工程紀律。

---

## 一、為什麼需要 Specification-Driven Development

### 1.1 三個立刻有感的優點

課程一開始就點出 SDD 三大優點，這是接下來所有工具、流程、術語的根：

**第一，改 spec 一句話就能大規模改動程式碼。** 講者舉例：spec 裡寫一句「Use SQLite with Prisma ORM」，可能就影響數百行程式；若改成 MongoDB，又會換掉另一批——這就是 spec 的槓桿。寫 spec 的效率遠高於直接寫 code，因為一份成熟 spec 同時也是給人看的設計文件。

**第二，spec 解決 session 之間 context loss 的問題。** Agent 是無狀態的（stateless），每次重開 session 都要重新建立 context。把最高品質的 context 在開工當下就交給 agent，是避免 context window overflow、context loss 的根本作法；也是防止 long conversation 後產生「cognitive debt」的關鍵。

**第三，spec 提升意圖（intent）的準確度。** 先定義 problem、success criteria、constraints，再請 agent 往下鑽細節，能讓最終程式更貼近原意，避免「想到什麼寫什麼」的浪費。

### 1.2 寫 spec 不是偷懶

講者特別提醒：**spec 是要動腦的，不是 prompt 的同義詞**。沒有 spec 時，等於把產品方向、技術架構、功能取捨全丟給 agent——短期內可以快速前進，但程式碼會變得難以維護，產品甚至會出現詭異的樣貌。講者舉例見過複雜產品完全沒有 spec，結果不同 agent 在不同工程師帶領下產生衝突解法。

> 對於任何有複雜度的專案，那些厲害的開發者幾乎都會寫詳細 spec；如果 coding agent 要寫 20-30 分鐘的程式碼（等於好幾小時的人工作業），那先花 3-4 分鐘把指令寫清楚絕對划算。

### 1.3 Vibe coding vs SDD

第二堂課明確對比 vibe coding 與 SDD：

| 維度 | Vibe coding | SDD |
|------|-------------|-----|
| 輸入 | 短 prompt：「幫我做一個按鈕」 | 完整 spec：mission / tech stack / feature 三件式 Markdown |
| 輸出 | 「大概對但細節錯」的一次性程式 | 可維護、可演進、可交接的工程產物 |
| Context | 存在聊天記錄裡，session 結束就消失 | 跨 session、跨 agent、跨 IDE 永久保存 |
| 心智負擔 | 每次迭代都要重新對齊 | spec 即記憶，人類只負責驗收 |
| 適用範圍 | 單一按鈕、單一檔案的快速實驗 | greenfield / brownfield 都可的正式開發 |
| 角色分工 | 人當 prompter、agent 當打字機 | 人當 architect、agent 當 builder |

SDD 的本質是**重新把「what 與 why」獨立出來成為 spec，把「how」留給 implementation**，這是軟體工程一直想做但工具不夠強做不到的事；現在 agent 到位了，這層分工可以真正落地。

---

## 二、Specification 的寫法

### 2.1 Specification 三大區塊

每一份有意義的 spec 都包含三件事：

1. **Problem（問題）**：要做什麼？為什麼做？服務誰？
2. **Success criteria（成功條件）**：怎麼算完成？要測什麼？
3. **Constraints（限制）**：技術棧、相依性、合規、效能、可維護依團隊規範。

課程強調 spec 是寫給「agent + 人類」共看的契約；constitution 偏組織級，feature spec 偏任務級，兩者都遵守這個三段結構。

### 2.2 細節的顆粒度

SDD 最難的功夫不是寫 spec，而是**抓對細節的顆粒度**。課程用建築師類比：你可以把建築的每一塊磚、每一根管線都規定好，但那是浪費——好的建築師只給出結構、用途、限制，讓工班自己決定細工。套到 agent 也是一樣：

- **多講**：目標、使命、目標客群、限制、重要的技術約束
- **少講**：變數命名、套件版本號以下的小事、agent 自己會找到的低階細節

判斷原則：把 agent 當**極有經驗的 pair programmer**，它會自己決定的就不要囉嗦；只有當你對結果有強烈偏好、且 agent 猜不到的才寫。

### 2.3 範例 spec 模板（Agent Clinic 的 mission）

以下是課程範例「Agent Clinic」這份 parody 專案的 mission spec，示範一份 charter-level spec 應該長什麼樣子：

```markdown
# Mission — Agent Clinic

## Project idea
一個全端 web 應用（Next.js 後端 + React 前端），讓 AI 代理人能向人類求救。
靈感回放自經典教材 Pet Clinic，是一個開玩笑的 parody 專案。

## 觀眾
Coding agents 本身——它們會有 hallucination、context loss、記憶問題、
跨 agent 協調壓力等症狀，本專案提供「掛號、看診、治療」流程。

## 主要 features
- 預約掛號（Appointments）
- 症狀管理（Ailments），例如 hallucination、context loss
- 治療處置（Treatments），例如重新注入 context

## 風格
Playful tone——這是課程 demo，不需要嚴肅企業語氣。
```

講者示範與 agent 對話產出這份 spec 時，agent 反問了「tone 要哪種」「target audience 是誰」「roadmap 要多細」三類問題；這就是「好的 spec 是兩方對話產物」的具體展現。

### 2.4 範例 feature spec 模板（Hello Hono 第一個 feature）

```markdown
# Feature: Hello Hono

## Plan
- 建立 Next.js + Hono 的最小可運行骨架
- 在首頁顯示「Hello Hono」字樣
- 採用嚴格 TypeScript 設定

## Requirements
- Hono 鎖定到指定版本
- TypeScript strict 模式開啟
- 不要引入額外 UI framework（保留極簡首頁）

## Verification
- `pnpm dev` 啟動後瀏覽器可看到 Hello Hono
- `pnpm typecheck` 通過
```

注意：spec 裡的 verification 不是隨口說說，而是之後拿來跑驗收的對帳單。Agent 做完之後，人類就照著 verification 一條一條打勾。

---

## 三、Constitution（章程）：專案級的不可變標準

### 3.1 什麼是 constitution

課程把 constitution 定義為「**專案層級的不可變標準**」，通常以多份 Markdown 檔案形式存放於 `specs/` 目錄下，最少三件：

1. **mission.md**：為什麼做、誰用、範圍到哪
2. **techstack.md**：用什麼技術、為什麼用、相依限制
3. **roadmap.md**：分階段的 feature 排序，每階段由獨立 feature spec 流程執行

進階團隊還會加 `constitution.md`、`coding-standards.md`、`verification-checklist.md`、`glossary.md` 等。

### 3.2 為什麼需要 constitution

- **Constitution 是 agent 與人類的共同契約**：agent 開工時讀這份 charter，就能進入「對齊狀態」；新人類工程師 onboarding 也靠它。
- **Constitution 把不可變的決定沉澱下來**：mission 通常不會每週改；techstack 可能半年才動一次；roadmap 動得較頻繁，但要標記哪些是已完成的、哪些是進行中。
- **Constitution 是版本化策略的一部分**：當 charter 更新時要 commit、要有 message；constitution 變更的版本與 feature 變更的版本最好分開 branch 追蹤（後述）。

### 3.3 Constitution 的位置

Constitution 通常放在 `specs/` 目錄，例如：

```
specs/
  ├─ mission.md
  ├─ techstack.md
  ├─ roadmap.md
  ├─ constitution.md
  └─ features/
       ├─ hello-hono/
       │    ├─ plan.md
       │    ├─ requirements.md
       │    └─ verification.md
       └─ ...
```

講者在 Agent Clinic demo 中，把這套結構完整建起來，並在每個 feature 完成時都用 branch merge 進 master。

### 3.4 Constitution 與 agents.md 的差別

`agents.md` 是針對「這個專案對 coding agent 的規則」最上層的單一檔案（與 `README.md` 同層級），可以放 coding style、PR 流程、commit message 規範等。Constitution 比 `agents.md` 更結構化、agent-independent——換不同 agent 仍然讀同一份 constitution。兩者可以並存：constitution 是「為什麼與做什麼」、`agents.md` 是「怎麼溝通」。

---

## 四、Feature Branch 隔離：planning / implementation / testing

### 4.1 Feature 為什麼要切 branch

每個 feature 都要有自己的 branch，理由：

- **Clean slate 思維**：上一個 feature 留下的測試、log、暫存程式都會污染下一個 feature 的 context；切 branch 等於重置工作空間。
- **降低 context switching 成本**：人類從 review 一個 feature 到接手下個 feature 時，可以讀 spec 摘要，不必讀全部對話歷史。
- **支援並行**：不同工程師（甚至不同 agent）可以同時在不同 feature branch 推進，merge 時再解衝突。
- **強制 frequent commit**：小步快跑，每個 commit 都是可回滾的最小單位。

### 4.2 Feature 的三階段循環

每個 feature 走完三個階段才算完成：

1. **Planning（規劃）**
   - 與 agent 對齊：要做什麼、驗收條件、技術選擇
   - 產出 `plan.md`、`requirements.md`、`verification.md`
   - 寫到對為止才 commit

2. **Implementation（實作）**
   - 給 agent 完整 spec，下 `clear` 重置 context
   - 一次執行所有 task group，或分小批（高風險任務如 security、DB migration 建議分批）
   - 監看 console 與 commit window 變化

3. **Verification（驗證）**
   - 從 commit diff 看大局，不要只看 CSS class
   - 確認符合 spec 的 verification 條目
   - 用 `git diff` + debugger + subagent review 雙重確認
   - 確認 cognitive debt 是否過高（不理解的地方就停下來研究）

### 4.3 Refactoring（重規劃）階段

兩個 feature 之間一定要留 **refactoring** 緩衝，常見任務：

- 更新 constitution（例如補上 testing framework 設定）
- 更新 roadmap（合併或拆解階段）
- 清理 context、關掉前一輪 feature branch
- 補 changelog、跑 lint、跑測試套件
- 把重複查詢包成 skill（後述）

講者反覆強調：**「要慢下來，才能走得更快」（slow down to move faster）**。AI fatigue 是真的，當 agent 一次產出幾百行 code，人類 review 的注意力很快就耗盡；切小 feature、留重規劃緩衝，是對抗疲勞的核心紀律。

### 4.4 Refactoring branch 與 feature branch 分離

課程特別提醒：當 constitution 變更幅度大時（例如新增測試框架、改 techstack 結構），建議單獨開 refactoring branch；當只是小補充（例如新增驗證 checklist），可以併入同一 feature branch。重點是要能在 git history 看到「charter 改版 vs feature 改版」的對應關係。

---

## 五、Greenfield vs Brownfield

### 5.1 Greenfield（從零開始）

從零開始的專案（greenfield）走法：

1. 建空白 repo，初始化 IDE 與 agent 環境
2. 與 agent 對話，產出 mission / techstack / roadmap 三件式 charter
3. 寫進 `specs/` 目錄
4. 開始第一個 feature branch

課程 demo 就是 greenfield：建 `agent clinic` TypeScript 專案 + Git repo，產出 charter 後立刻進入第一個 feature「Hello Hono」。

### 5.2 Brownfield（既有程式碼）

既有程式碼（brownfield）走法：

1. 從 master（無 specs/ 資料夾的版本）開始新的 agent session
2. 把既有 readme、todo、commit 紀錄交給 agent
3. 請 agent 從這些 artifact 反推出 mission / techstack / roadmap charter
4. Commit charter
5. 接下來的 feature workflow 與 greenfield 完全相同

課程用 Agent Clinic MVP 當 brownfield 範例，從 master branch 重新打 charter，並進行第一個 feature「feedback form」。

### 5.3 為什麼 brownfield 也要 SDD

常見誤解是「SDD 只適合新專案」。課程反駁：

- 既有專案累積了大量歷史決策，這些決策若沒有 spec 形式記錄，未來新工程師與新 agent 都得從 code 反推，耗時又容易誤判。
- SDD 提供**可版本化、可交接**的專案記憶，brownfield 套上之後正好補上這一塊。
- 從既有 artifact 反推 charter 的過程，本身就是一次「legacy documentation 現代化」。

---

## 六、agents.md / Standards / Skills

### 6.1 agents.md

`agents.md` 是放在 repo 根目錄的單一 Markdown 檔，告訴 coding agent：

- **Coding style**：命名、註解、commit message 格式
- **PR / branch 流程**：怎麼命名 branch、怎麼寫 PR 描述
- **禁止事項**：哪些套件不能用、哪些 API 不能 call
- **協作慣例**：誰負責 review、誰負責 merge

它不是 spec，是「**與 agent 溝通的固定開場白**」。Constitution 是組織級的「做什麼」，agents.md 是專案級的「怎麼合作」。

### 6.2 Skills（技能）

Skill 是**agent 呼叫的指令集 + 資源包**，讓 agent 多一項可重複使用的能力。Skill 的特性：

- 寫在 `~/.claude/skills/`（global）或專案內 `.claude/skills/`（local）
- 結構上類似輕量 plugin：SKILL.md + 必要資源檔
- 用「gradual disclosure」機制：agent 根據描述判斷何時呼叫
- 可從另一個 skill 內部呼叫 skill，組成複合工作流

**Skill 適合什麼情境**：定義良好、可重複、需要專案或組織專屬 context 的工作流。例如：

- 自動更新 changelog（merge branch 時觸發）
- 跑測試 + lint + format 完整驗證
- 自動產生 feature spec 草稿
- 自動 commit、PR 描述生成

**Skill 不適合**：一次性任務、需要人類判斷的創意工作、需要大量外部 context 注入的任務。

課程 demo：請 agent 用「skill builder」協助寫一個 changelog skill，過程中 agent 反問「這個 skill 要放在 global 還是 project local」、「要做什麼程度的自動化」、「與既有 changelog 格式是否相容」等好問題。最後選擇放在 global，並實際讓 agent 在 merge 前呼叫自己更新 changelog。

### 6.3 Skill 呼叫的三種方式

1. **明確指名**：在 prompt 開頭寫「用 X skill 做 Y」，省 agent 的判斷成本。
2. **Gradual disclosure**：讓 agent 讀 skill 描述，自行決定是否呼叫。當 context 太大時，agent 的判斷會失準，所以「知道要用什麼 skill 時就寫出來」是個好習慣。
3. **Skill-to-skill**：skill 內部呼叫另一個 skill，組合出更複雜的工作流。

### 6.4 與內建 slash command 的關係

Claude Code 等 agent 早期靠 `/clear`、`/commit` 之類的 slash command；現在許多 agent 正在把這類命令轉成 skill。原因：skill 更靈活、可分享、可版本化、能跨 IDE 運作。

---

## 七、ACP（Agent Client Protocol）與 IDE 整合

### 7.1 為什麼需要 ACP

Coding agent 與 IDE 之間的整合長期缺乏標準，導致：

- 同一個 agent 在不同 IDE 要重做一次整合
- 換 IDE 就得換整合方式
- Plugin 開發者得為每個 IDE 寫適配

ACP 借鏡 LSP（Language Server Protocol）的成功經驗：定義一個通用的 protocol，讓任何支援 ACP 的 agent 都能插入任何支援 ACP 的 client（IDE、terminal app、桌面 app）。

### 7.2 ACP 涵蓋哪些能力

ACP 不只是聊天介面，還包含：

- **Next-edit 預測**：編輯器中下一個修改的建議
- **Plan / diff 檢視**：顯示 agent 的計劃與差異
- **Context 注入**：把檔案、目錄、terminal 輸出送進 agent
- **Tool 呼叫**：agent 呼叫 IDE 內部工具（如檔案操作、search、refactor）
- **Session 管理**：開始 / 暫停 / 恢復 agent session

### 7.3 ACP Registry

ACP Registry 是 ACP 的「npm registry」，提供：

- **自動發現**：IDE 列出所有可用 agent
- **一鍵安裝**：按鈕即可下載、設定、整合
- **生命週期管理**：升級、解除安裝、版本控管

課程 demo 中，在 JetBrains AI Chat 視窗直接透過 ACP Registry 安裝 open source agent，IDE 自動新增該 agent 入口，整個過程不需要手動改 config。

### 7.4 跨 IDE、跨 Agent 切換

ACP + Registry 讓 SDD workflow **不綁死在單一 agent 或 IDE**。課程示範：

- 在 Claude Code 寫的 feature spec skill 搬到 Codex，調整 skill 路徑後仍然能跑
- 同一個專案可以在 JetBrains IDE 跑 Claude Code、在 VS Code 跑 Codex、在 Zed 跑本地模型
- 整個 SDD workflow 不需要重寫，只是底層 agent 換掉

這呼應課程核心精神：agent 可替換、spec 不可丟。

---

## 八、Agent 選擇與 Benchmark

### 8.1 為什麼 benchmark 不該當唯一標準

不同 benchmark / leaderboard 對 agent 的評比變動非常快，今天第一名下個月可能就掉到三名外。課程提醒：

- Benchmark 量的是「這個題庫答對率」，不是你團隊的真實工作流
- 不同工作流適合不同 agent：有的擅長 web app、有的擅長 data pipeline、有的擅長 refactor
- 評估應回到自己團隊的 domain 任務上：拿自己 5-10 個典型 ticket 讓 agent 跑，看哪個真的好用

### 8.2 評估面向

講者建議從五個面向評估 coding agent：

1. **能力**：能否完成你團隊的主要工作？擅長的程式語言 / 框架？
2. **速度**：本地延遲、batch 處理、context 大小限制
3. **可控性**：是否能精細控制 tool 呼叫、是否容易中斷 / 修正
4. **整合**：支援哪些 IDE / 編輯器 / 終端？支援 ACP / plugins / skills？
5. **成本**：API 價格、context window 計價方式、是否有 self-host 選項

### 8.3 跨模型策略

不要把整個 workflow 綁在單一模型。建議：

- 主力模型 + 次要模型：主力做重點任務、次要模型跑平行檢查
- 模型路由：依任務類型自動選模型（簡單任務用小模型、複雜任務用大模型）
- 隨時準備好切換：透過 ACP、agents.md、skill 等標準化降低切換成本

---

## 九、從 Vibe Coding 到 SDD 的演進

### 9.1 演進地圖

```
Vibe Coding（無 spec、無 charter）
  → Prompt Engineering（寫更好 prompt，但仍無 spec）
    → Specification-Driven Development（spec 與 charter 化）
      → SDD + Skills（重複工作自動化）
        → SDD + Skills + Standards（ACP / agents.md / plugins）
          → SDD at Scale（跨團隊、跨組織、跨工具）
```

### 9.2 每次演進解決什麼問題

- **Vibe → Prompt**：人類 prompt 不夠好，浪費 agent 算力
- **Prompt → Spec**：單次 prompt 無法承載完整 intent，spec 保留 context
- **Spec → SDD**：spec 不結構化就會失序，constitution 強制組織化
- **SDD → Skills**：重複 prompt 浪費時間，skill 自動化
- **Skills → Standards**：skill 各做各的就亂，標準讓 skill 可分享
- **Standards → Scale**：有了標準才能跨團隊、跨組織複用整個 workflow

### 9.3 SDD 不只是 buzzword

課程特別澄清 SDD 不是行銷話術，而是**軟體工程紀律的回歸**。對比 compiler 把 source code 編譯成機械碼：

| 角色 | Compiler | SDD |
|------|----------|-----|
| 輸入 | source code | spec（Markdown） |
| 輸出 | 機械碼 | application code |
| 中介 | 編譯器 | coding agent |
| 中介特性 | deterministic、可驗證 | non-deterministic、需要驗收 |
| 契約 | 語言語法 | spec（人類可讀） |

SDD 把 spec 變成人類與 agent 之間的「合約」，比 compiler 對人類開發者更友善（spec 用自然語言寫），但同時也保留了 compiler 對應的「自動化產出」這層意義。

---

## 十、課程範例專案：Agent Clinic 細節

### 10.1 專案概述

Agent Clinic 是課程 demo 的全端 web 應用（Next.js + React + SQLite + Prisma），AI 代理人可以「掛號、看診、治療」。Parody 自經典教材 Pet Clinic。

### 10.2 範例 charter 結構

```
agent-clinic/
  ├─ README.md
  ├─ package.json
  ├─ specs/
  │    ├─ mission.md          ← 為什麼、對誰、tone
  │    ├─ techstack.md        ← Next.js + React + TypeScript + SQLite + Prisma
  │    ├─ roadmap.md          ← 5 個階段
  │    ├─ constitution.md     ← 不可變標準
  │    └─ features/
  │         ├─ hello-hono/
  │         │    ├─ plan.md
  │         │    ├─ requirements.md
  │         │    └─ verification.md
  │         ├─ agents-and-diseases/
  │         ├─ treatments/
  │         ├─ appointments/
  │         └─ feedback-form/
  └─ ...
```

### 10.3 五個階段對應

| 階段 | feature | 重點 |
|------|---------|------|
| 1 | Hello Hono | 骨架、可運行 |
| 2 | Agents & Diseases | CRUD + DB schema |
| 3 | Treatments | 治療流程 |
| 4 | Appointments | 排程邏輯 |
| 5 | Feedback Form | 表單驗證 |

課程從第 1 階段 demo 到第 5 階段，再展示 brownfield 從既有 MVP 套上 SDD 並實作「feedback form」。MVP 階段是一次「極端壓力測試」：把所有剩下的 roadmap 一次丟給 agent，看 constitution 與既有 spec 是否足夠強健。

### 10.4 Demo 中的小細節

- **Hello Hano typo**：spec 裡誤打成 Hano，agent 老實做出「Hano」首頁；講者要求更正，順手示範了 spec 與 code 同步更新的紀律。
- **Components 應拆分**：agent 把 header / main / footer 寫在同一檔案；講者要求分成獨立檔，並用 IDE 工具搬（而非直接改 code）——理由：搬檔後 spec 與 readme 的對應也要同步，否則會失同步。
- **Prop types 應抽離**：用 built-in typing 不夠 strict，講者請 agent 在每個 component 抽出獨立 TypeScript type。
- **Subagent review**：懷疑 agent 漏了什麼時，請 agent 建立多個 subagent 對全專案做 deep review，subagent 的問題與建議回傳主 agent，**避免污染主 context**。

---

## 十一、Cognitive Debt 與 AI Fatigue

### 11.1 什麼是 cognitive debt

課程中 Paul 引用業界近期討論的 **cognitive debt**：當 agent 一次產出幾百行 code，工程師為了「跟上到底改了什麼」而付出的 mental load。當 cognitive debt 累積到一定程度，工程師會開始：

- 不想 review（逃避債務）
- 失去對 code 的 sense of ownership
- 對未來的改動感到恐懼（怕再次欠債）

### 11.2 對抗方法

- **小 feature**：每個 branch 只做一件可驗收的事
- **Frequent commit**：每完成一個 task group 就 commit，不要累積到最後
- **Spec 是 single source of truth**：review 時對 spec 對帳，不必逐行讀 code
- **Subagent for deep review**：需要時請 agent 開 subagent 檢查，避免污染主 context
- **刻意 refactoring**：每個 feature 結束後留時間清債

### 11.3 課程金句

> 「AI 寫 code 太快，反而讓開發者談 cognitive debt。」
> 「要慢下來，才能走得更快。」
> 「Spec 是專案的記憶，不是聊天的 transcript。」

---

## 十二、Spec Kit / Open Spec 兩個開源框架

### 12.1 GitHub Spec Kit

GitHub 推出的 **Spec Kit** 把 spec-driven 流程做成 CLI 工具與 agent slash commands，提供：

- `/speckit.constitution`：產生 constitution
- `/speckit.plan`：規劃 feature
- `/speckit.tasks`：拆任務
- `/speckit.implement`：執行實作

適合想在既有 agent 之上快速套上 SDD 結構的團隊。

### 12.2 Fission AI 的 Open Spec

Open Spec 走類似的路，提供：

- **Proposal**：提案階段
- **Research**：研究、探索、決策記錄
- **Archiving**：歸檔、版本管理
- **Implementation**：實作

有 canonical templates 與 branch 管理工具，適合需要 formal 提案流程的組織。

### 12.3 兩個框架的共通點

- 都把 spec-driven 流程做成「可裝、可卸」的 CLI + templates
- 都強調 branch 管理與 validation script
- 都鼓勵把重複查詢包成可重用 artifact
- 都不是唯一解，團隊可以混搭自製

---

## 十三、Research Journal：研究紀錄

### 13.1 什麼是 research journal

當 feature 進行中遇到需要先研究的問題（例如選哪個 database、哪個 UI framework），又不想打斷當前 branch，可以請 agent：

1. 開一個獨立對話，研究主線內容
2. 產出 `research/YYY-MM-DD-topic.md` 報告放在 known location
3. 保留這份研究連結，未來併入 roadmap 時可直接引用

### 13.2 為什麼重要

- 決策有依據：未來 review 可追溯為什麼選 A 不選 B
- 對話不丟失：研究結論不會隨 session 結束消失
- 可演化為 skill：當同一類研究反覆做時，把 journal 流程包成 skill 即可

### 13.3 與 spec 的關係

Research journal 是「spec 的上游」——研究的結論會回灌到 constitution 與 feature spec。spec 是「已決定」的文件，journal 是「尚未決定、需要探索」的文件。

---

## 十四、從 SDD 到組織級落地

### 14.1 把 SDD 推到整個組織

課程鼓勵把 SDD 從個人 workflow 推到組織級：

- **跨專案共享 charter**：constitution template 標準化
- **跨專案共享 skills**：把 changelog、test、lint 等通用 skill 放進 global
- **跨專案共享 agents.md**：coding style、PR 規範統一
- **Cross-team review**：sprint demo 時不只看成品，也看 spec 演進

### 14.2 與現有 SDLC 的整合

SDD 不該取代 SDLC，而是疊加上去：

| 階段 | 傳統 SDLC | 加上 SDD 後 |
|------|-----------|-------------|
| Requirement | BRD / PRD | BRD / PRD + spec mission / roadmap |
| Design | UML / 系統設計 | UML + constitution / feature spec |
| Implementation | 工程師寫 code | Agent 依 spec 寫 code，工程師 review |
| Verification | QA / UAT | Agent verification + human-in-loop review |
| Maintenance | 工程師改 code | spec 更新 → agent 改 code → 工程師 review |

### 14.3 給 stakeholder 的價值

課程強調 spec 同時是給 stakeholder 看的：

- 進度可見：roadmap 公開
- 決策可見：journal、constitution 公開
- 變更可追蹤：每個 spec 改動都有 commit
- 非技術 stakeholder 也能讀：Markdown 比 code 友善

---

## 十五、二十個關鍵 takeaway

1. **SDD 是 production-grade agent workflow 的當前最佳實踐**。
2. **三大優點**：spec 一句話改大規模 code、跨 session 保留 context、提升 intent 準確度。
3. **Spec 三段式**：problem + success criteria + constraints。
4. **Constitution 是組織級**；feature spec 是任務級；兩者都版本化。
5. **每個 feature 三階段**：planning → implementation → verification，外加 refactoring 緩衝。
6. **Feature 必須切 branch**，並對應 spec 檔案群。
7. **Greenfield 從空白產 charter**；brownfield 從既有 artifact 反推 charter。
8. **agents.md 是「怎麼合作」、constitution 是「做什麼」**，兩者可並存。
9. **Skill 把重複查詢自動化**，分 global 與 local。
10. **Gradual disclosure 是 skill 呼叫機制**；明確指名比讓 agent 猜更省 token。
11. **ACP 把 IDE 與 agent 解耦**，跨工具切換成本降低。
12. **ACP Registry 讓 agent 安裝像裝 extension 一樣簡單**。
13. **Benchmark 變動快**，不要把 workflow 綁在單一 agent。
14. **Cognitive debt 是真實成本**，用小 feature + frequent commit 對抗。
15. **AI fatigue 要靠 refactoring 緩衝** 來消化。
16. **Subagent review 可避免污染主 context**。
17. **Research journal 把決策有形化**，spec 是結果、journal 是過程。
18. **Spec Kit / Open Spec 是 framework 不是唯一解**，可自製。
19. **Vibe coding 不會消失**，但只在「一次按鈕」這種小範圍合理。
20. **Agent is the muscle, specification is the brain**——這句話是整門課的標語。

---

## 十六、適合誰、什麼時候用

### 16.1 適合的場景

- 多人協作的 web / mobile / SaaS 專案
- 跨月、跨季的長週期產品
- brownfield 需要 modern 化 documentation 的 legacy 系統
- 團隊想建立可交接、可 audit 的工程紀律

### 16.2 不一定適合的場景

- 一次性 hackathon prototype
- 純粹個人週末 side project
- 已經有完善 SDD 框架的團隊（再疊一層會冗餘）

### 16.3 入門建議

1. 先把現有 side project 套上 constitution + 1 個 feature spec
2. 用 Claude Code 或 Codex 跑一個 feature cycle（planning → implementation → verification）
3. 把重複 prompt 包成 1 個 skill
4. 觀察 cognitive debt 是否下降、進度是否變快
5. 若有效，開始推到團隊其他專案

---

## 十七、與其他 SDLC / 流程的關係

### 17.1 與 BDD（Behavior-Driven Development）

BDD 強調 Given / When / Then 的 executable specification；SDD 強調 Markdown / 自然語言 specification。兩者精神相近：

- BDD 把 spec 變成可執行測試
- SDD 把 spec 變成 agent 輸入

可結合：spec 寫完後，請 agent 把 verification 段落轉成 BDD test，雙重驗證。

### 17.2 與 TDD（Test-Driven Development）

TDD 強調 red-green-refactor；SDD 在 verification 階段強調 spec-fulfillment。結合方式：

- 寫 spec → 寫對應 test → agent 實作 → 跑 test

### 17.3 與 Harness Engineering

Harness Engineering（李宏毅、Martin Fowler 等講者）強調 agent 執行的環境設計；SDD 是 harness 中「spec 與 constitution」那一塊。兩者互補。

### 17.4 與 Agent Skills

Agent skills 是 SDD 自動化的執行單位；SDD 是 skills 設計出來要服務的流程。

---

## 十八、給讀者的下一步建議

- **立刻可做**：把你最近一個 side project 的 README 改成 SDD 風格，加上 mission / techstack / roadmap。
- **本週可做**：在現有專案上跑一個 feature cycle（plan → implement → verify），體驗 charter 的威力。
- **這個月可做**：把重複 prompt 包成 1-2 個 skill，觀察 cognitive debt 是否下降。
- **這個季度可做**：把 SDD 推到團隊，建立團隊級 constitution template。

---

## 十九、課程原始逐字稿索引

- 英文逐字稿：`transcripts/20260922_DeepLearningAI_SpecDrivenDevelopment_逐字稿.txt`
- 中文口播稿（純文字）：`transcripts/20260922_DeepLearningAI_SpecDrivenDevelopment_口播稿.txt`
- 中文口播稿（驗證用 markdown）：`transcripts/20260922_DeepLearningAI_SpecDrivenDevelopment_口播稿_zh_TW.md`
- 簡體 TTS 版：`transcripts/20260922_DeepLearningAI_SpecDrivenDevelopment_口播稿_TTS_zh_CN.txt`

---

## 二十、參考資源

- **GitHub Spec Kit**：github.com/github/spec-kit（constitution / plan / tasks / implement slash commands）
- **Open Spec（Fission AI）**：open-spec documentation
- **ACP（Agent Client Protocol）**：agentclientprotocol.com（agent 與 IDE 通訊標準）
- **Claude Code Skills**：code.claude.com/docs/skills
- **Context 7**（套件文件 MCP / skill）：context7.com
- **JetBrains AI Chat**：支援 ACP Registry 安裝
- **WebStorm + Claude Code**：課程 demo IDE + agent 組合

---

## 結語

Specification-driven development 不是要把 vibe coding 消滅掉，而是給它**該出現的位置**——一次性、小範圍、無長期維護的場景。對於要 scale、要交接、要 maintain 的 production 專案，spec 是把 agent 的速度（muscle）與人類的判斷（brain）妥善分工的橋梁。課程最後一句話送給所有開發者：

> 「Don't tense up. Create something cool.」
> 別繃得太緊，去做點酷的東西。

把 spec 寫好，剩下的交給 agent；把設計想清楚，剩下的交給程式碼；把紀律養起來，剩下的交給流程。SDD 的本質，是把工程紀律還給軟體開發。