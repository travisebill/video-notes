# Harness Engineering: How to Build Software When Humans Steer, Agents Execute

**講者：Ryan Lopopolo（OpenAI Member of Technical Staff）｜AI Engineer Summit London｜2026-04-17**

> 影片連結：https://youtu.be/am_oeAoUhew
> 影片時長：46 分 20 秒 ｜ 觀看次數：158k
> 性質：技術 keynote + 主持人 Vibhu Sapra（Latent Space）後段 Q&A
> 同名 OpenAI 文章：https://openai.com/index/harness-engineering/

---

## 一、主題與背景

Ryan Lopopolo 在 OpenAI 內部帶領一個全職員工團隊以「agent 為執行者、人類為指揮者」的模式開發產品。他自稱「token billionaire」，每日消耗逾 10 億顆 output token。本場演講把過去 6 個月 coding agent 的典範轉移，總結成一套他稱為 **harness engineering** 的工程方法論：把那些過去藏在資深工程師直覺裡的非功能性需求（non-functional requirements），轉寫成 lints、tests、reviewer agents、skills、文件等可被模型讀取的「約束與提示」。本影片核心議題：**當程式碼本身不再稀缺，工程師的價值正從「會寫程式碼」轉向「會設計讓代理寫出好程式碼的系統」**。

---

## 二、章節脈絡

### Section 1｜開場宣言：Code is free（00:00–04:30）

**重點摘要：** Ryan 宣告在 agent-first 的世界裡，程式碼已成為 free resource，工程師的稀缺資源變成 context、attention 與判斷。

**內容：**
- 過去 9 個月，他整個團隊被禁止手動打開編輯器，所有產出必須經由模型生成。
- 觸發點是 GPT-5.2，模型能力跨越「完整軟體工程師」的閾值。
- 程式碼現在 free 產出、free 重構、free 刪除，工程師團隊規模的唯一限制變成 GPU 與 token 預算。
- 「每個人都是 staff engineer」——每個工程師手上有 5,000 個 agent 級的產能可以驅動。

> "Code is free. Hiring the hands on the keyboards as part of our teams is only constrained by GPU capacity and token budgets."

---

### Section 2｜從 P-zero / P-two 變成「P3 全 kick off」（04:30–07:00）

**重點摘要：** 當程式碼無限供給，過去永遠排不到的 P3 也變得可平行化。

**內容：**
- 稀缺資源三件：human time、human & model attention、model context window。
- 過去 stack-rank 只挑 P0 / P2，P3 永遠不會被做。
- Code is free 的世界：所有 P3 都立即啟動，4 倍平行，pick the one that works。
- 內部工具案例：所有內部工具從 day 1 就有完整 i18n，London、Dublin、Paris、Zurich、Munich 的同事可直接用母語使用，不需 trade-off。

> "In a world where code is free and infinitely abundant, all those P3s get kicked off immediately. Maybe 4x in parallel. We pick one that solves the problem and in it goes."

---

### Section 3｜Breadcrumbs 與 Legible 系統（07:00–10:30）

**重點摘要：** 真正重要的不是 code 本身，而是「留下讓 agent 能讀懂系統的 breadcrumbs」。

**內容：**
- Ticket、code review、ADR、persona 文件，這些 process artifacts 是 prompt 的載體。
- 工程師的工作是建構「讓 agent 與人能在上面工作的系統」，而這個系統必須對 agent legible（可讀）。
- Context 是稀缺資源，所以文件的目標是「讓做工作所需 tokens 變得可預測」。
- 「make things the same」——Large-scale refactor 在 code-is-free 的世界也是 free，6 個月 migration 不再卡關，可以同時 fire 15 個 agent 收尾。

> "The important thing is not the code, but the prompt and the guardrails that got you there."

---

### Section 4｜非功能性需求的書寫（10:30–14:00）

**重點摘要：** 模型訓練時已看過所有可能的寫法選擇，所以工程師的任務是把「什麼叫做好程式碼」具體寫下來。

**內容：**
- 一個 patch 通常含 ~500 個 micro decisions，每個都是非功能性需求的 trade-off。
- 模型訓練 corpus 含數兆行程式碼，所以「哪種 trade-off 是好的」這件事，模型不是沒看過，是沒有被 prompt 提醒。
- 「Do not produce slop」——明確指令 + 短期 velocity hit 換長期 codebase 健康。
- Persona 文件化：front-end、後端 scalability、product-minded，每個 persona 寫下「該角色眼中好的 patch 長相」，reviewer agent 即可繼承。

> "If the agents aren't doing that, it's our job to figure out ways to refine and restrict their output such that the code they write is acceptable."

---

### Section 5｜Reviewer Agents 與 Continuous Check（14:00–17:00）

**重點摘要：** security 與 reliability 類的非功能性需求，由 reviewer agent 在每個 push 時檢查。

**內容：**
- GPT-5.4 / Codex 的 auto-compaction 極佳，Ryan 已不必再打 `/new`。
- 用例：把 laptop 綁在後座開手機 tether，30 分鐘通勤讓 agent cook。
- Reviewer agents 的設計：每次 push / CI 觸發，讀 docs + proposed patch，做「這個 network call 有沒有 retry + timeout？」「這個 interface 能不能被誤用？」這種可機器化的檢查。
- 案例：所有 fetch call 都會跑自製 lint，強制 retry + timeout，永遠不再 paged。

> "Taking the time to write some docs, write a lint that is bespoke to my code base... means I've durably solved this problem."

---

### Section 6｜把 Lint 變成 Prompt 注入器（17:00–22:30）

**重點摘要：** 自製 lint 不只能擋錯，還能把修復指引直接寫進錯誤訊息裡傳給模型。

**內容：**
- Lint 不只是「不允許 X」——錯誤訊息要寫「為什麼不行 + 應該怎麼做」。
- 「Tests about source code」：例如限制單檔 ≤350 行、限制 package 之間的依賴方向、限制 async helper 只有單一 canonical 實作。
- 這些限制本身是「給模型 context-efficient 的工程」，等於在 adapt codebase 給 harness。
- 把 lint error message 當 prompt 注入：例如「未知型別不該出現在這裡，因為我們 parse, don't validate at the edge，這個型別是 Zod-derived、load-bearing」。

> "Everything I've talked about here today is a prompt. You can do this without touching the model weights at all."

---

### Section 7｜Prompts Everywhere（22:30–25:30）

**重點摘要：** 進步同時來自模型能力提升、與越來越 niche 的 prompt 注入點。

**內容：**
- Cursor rules、agents.md、Claude skills、custom lint errors、reviewer agent comments、embedded agent SDK in tests——全部都是 prompt。
- Meta 案例：用 Codex 讀 OpenAI prompting cookbooks，自動合成「如何寫 prompt」的 skill；結果是「用 agent 寫的 prompt 來指揮 agent 寫 prompt」。
- 文件化的 leverage 會 stack，且對人類、agent 同時生效。

---

### Section 8｜QA Plan 與代理人信任鏈（25:30–28:00）

**重點摘要：** 寫下 QA 計畫後，reviewer agent 即可驗收、PR 上附媒體證據，人類可以退得更遠。

**內容：**
- 一位 product-minded engineer 寫下「QA 計畫應該長什麼樣」的文件，所有 user-facing PR 必須附 QA plan。
- Reviewer agent 依此文件驗收；agent 提交 PR 時一併附 screenshots / videos 等證據。
- 結果：人類可以更少 shoulder-surf，把同步監督成本降下來，讓更多 delegation 成為可能。

---

### Section 9｜Q&A — Codex Workflow Setup（28:30–32:30）

**重點摘要：** 整個 repo 的本地 devtool 都圍繞「Codex 是 entry point」設計，而不是反過來。

**內容：**
- Ticket → 給 agent + skill 啟動 app、掛 Chrome DevTools、起 observability stack。
- Custom ESLint 規則進駐每個 pnpm package；高階 source-level test 驗證跨 package 結構、async helper canonical、schema 去重複。
- Skills 集中 5–10 個而非鋪數千個——repo infra 變動頻繁，集中化降低人類 bandwidth 負擔。

---

### Section 10｜Q&A — 不要過度建構 Harness（32:30–36:30）

**重點摘要：** Harness 的價值在於「在對的時機給模型對的 text」，過度預載會 overwhelm agent。

**內容：**
- Bitter lesson 思維：做最少必要的 context management。
- Just-in-time 注入：讓 agent 先 prototype，再於 lint/test time 拋出「要把 component 拆小、要 stateless」等限制。
- 這種事不會被模型能力進步淘汰——它是 constraints，不是 scaffolding。

---

### Section 11｜Q&A — Codex vs Claude Code（36:30–39:00）

**重點摘要：** 用 first-party harness 享受 post-training 的 leverage。

**內容：**
- 模型是在「自己 harness 內」的 context 上做 post-training 的，所以 first-party harness（Codex）內建最多對齊細節。
- 透過 Codex SDK 或直接操控 app server 借力這層 leverage。
- 個人角色：focus 在「什麼叫 correct code」而非 harness 內部機制。

---

### Section 12｜Q&A — 協作與 Code Review 形態（39:00–42:30）

**重點摘要：** 以 PR 為 broadcast domain，agent / human 都能自由 ack、defer、reject，不要把模型關進盒子裡。

**內容：**
- 協作主軸回到 markdown + GitHub PR，像 Google Docs 一樣是 clean room for a work artifact。
- 不阻塞參與者，agent 對 review feedback 自由 judgement——「coding agent 被老 reviewer bully」的 catastrophic 模式要避免。
- 目標不是 perfect code，是 code that ships。

---

### Section 13｜Q&A — 起步方式（42:30–45:30）

**重點摘要：** 兩條路：讓 agent 寫 tests 提升信心、盤點自己時間花在哪、把低槓桿部分自動化。

**內容：**
- 路徑一：讓 agent 看現有程式碼生 tests，雙向提升 confidence。
- 路徑二：盤點時間——是盯 editor 寫 code？等 tests？等 review？CI 慢？flaky tests？——把這些交給 agent。
- 真正的 leverage 是定義該做的工作、排程、賦能團隊執行，自己 move toward sequencing + orchestration。

---

### Section 14｜Q&A — Scale：Knowledge Map 與 Progressive Disclosure（45:30–48:30）

**重點摘要：** Repo 結構要能讓 agent 把大部分改動局限在 subtree，並透過統一模式讓 transferable context 變高。

**內容：**
- 從 1 個 electron package 長成 750 個 pnpm packages，依 business logic / stack layer 切割。
- 「One way to do bounded concurrency」「one way to do instrumented side effect」——只留一條路，token 可預測性大幅上升。
- 允許 agent 平行 50 個 task 不需人類介入的關鍵：work definition 清楚 + 自動排程。

---

### Section 15｜Q&A — Code Review 與 Friday Garbage Collection（48:30–51:00）

**重點摘要：** 把 code review feedback 轉成 repository 文件，再用 reviewer agent 自我癒合同類問題。

**內容：**
- 當團隊每人每天 3–5 個 PR，merge conflict 成為瓶頸，先處理 PR 開放時間、再處理衝突來源。
- Friday「garbage collection day」：每週一次，把當週所有 PR feedback 系統化分類（前端、reliability、scalability 各一 persona），寫進 repo，再交給 persona-based reviewer agent 自動擋。
- Loop 閉合：人類 feedback → repo 文件 → reviewer agent prompt injection → 自我癒合。

---

### Section 16｜Q&A — Token 分配、Plan Mode 評論、LLM 當 Fuzzy Compiler（51:00–55:30）

**重點摘要：** Token 1/3–1/3–1/3 分配；plan mode 風險是 encode 未讀 instructions；模型可熱插拔所以 harness 結構比模型本身重要。

**內容：**
- Token 用量約 1/3 planning/ticket curation、1/3 documentation、1/3 implementation + CI。
- Plan mode 不建議跳過人審：沒讀就 approve = encode 不想要執行的指令。
- 「LLM as fuzzy compiler」：context 是 constraints、lint 是 optimization passes，換模型 = 換 code generation backend，harness 結構不變則 acceptable output 仍成立。

---

### Section 17｜Q&A — 願景：Token Budget × Quarter Goal（55:30–58:30）

**重點摘要：** 終局是丟進 token budget + quarter goal + success metrics，模型全自動推進產品。

**內容：**
- 從 zero 走到 deployed 過程中，每個維度（QA、smoke test、user feedback triage、incident response、PII 掃描、社群監控）的 agent 能力都要逐步長出來。
- 願景是：人類定義 ranking + metrics，agent 24/7 推進。
- Engineering 的下一階段是「把 process 與 acceptance criteria 寫下來」的 metaprogramming。

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone `xiaotian_clone_v1`，speech-2.8-hd）
> 口播稿原文：transcripts/20260617_RyanLopopolo_HarnessEngineering_口播稿.txt

- [opus](../audio/20260617_RyanLopopolo_HarnessEngineering.opus)（Telegram 友善）
- [m4a](../audio/20260617_RyanLopopolo_HarnessEngineering.m4a)（iOS 友善）
- [mp3](../audio/20260617_RyanLopopolo_HarnessEngineering.mp3)（通用格式）

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處/應用 |
|------|------|-----------|
| Harness Engineering | 設計 agent 與人類協作所需的約束與提示系統（lint、tests、reviewer agents、skills、文件），把「什麼叫做好程式碼」具體化並注入到模型 context 中 | Ryan Lopopolo 在 OpenAI 內部 9 個月實作總結 |
| Token Billionaire | 每天消耗大量（≥10 億顆）output token 的工程師；象徵 agent-first 工作模式成熟 | Ryan 自稱；象徵從「寫 code」轉向「駕馭 agent 寫 code」 |
| Non-functional Requirements | 不直接寫在 spec、但決定程式碼是否 production-ready 的細節：retry/timeout、interface 不可誤用、component stateless 等 | 估計一個 patch 含 ~500 個此類 micro decisions |
| Reviewer Agent | 對每個 PR / push 自動跑的 LLM-based reviewer，依 persona 文件檢查特定維度（security、reliability、frontend 等） | OpenAI 內部實作；Friday garbage collection 的下游產物 |
| Breadcrumbs | Tickets、code reviews、ADRs、persona 文件等 process artifacts，它們對人類是組織記憶、對 agent 是 prompt 來源 | Section 3 |
| LLM as Fuzzy Compiler | 把 LLM 視為可熱插拔的 code generation backend；harness 提供 constraints + optimization passes，模型可換、acceptable output 仍成立 | Q&A Section 16 |
| Persona Documentation | 把「某角色眼中好的 patch 長相」具體寫下的文件，使 reviewer agent 繼承該角色的判斷 | Section 4 |
| Friday Garbage Collection Day | 每週一次的全天工作：把當週 PR 觀察到的 slop 系統性消除，轉成文件 + lint + reviewer agent 自我癒合 | Section 15 |
| First-party Harness Leverage | 使用 Codex 等 first-party harness 可享有 post-training 已對齊的工具語意（apply patch、quoting 規則等） | Q&A Section 11 |
| Code is Free | 程式碼產出、重構、刪除的成本被模型降到近零；稀缺性從 code 轉向 context、attention、judgement | Section 1 核心主張 |

---

## 四、人物分析

### Ryan Lopopolo
- **背景：** OpenAI Member of Technical Staff，帶領團隊以 agent-first 模式開發內部產品，9 個月禁止人工直接寫 code。
- **關鍵轉折：** GPT-5.2 推出後判斷模型已可承擔完整軟體工程師角色，於是全面實驗 agent-only 工作流。
- **代表觀點：** 「Code is free」「prompts everywhere」「make things the same」「agents 渴望 tokens，把它們 tokenize 化就能推動它們」。具體技術策略是把 non-functional requirements 寫成 lint + tests + reviewer agents。
- **風格：** 樂觀、token-positivity、強調實驗與 iteration；以「不寫程式碼當 KPI」自我要求。

### Vibhu Sapra（主持人）
- **背景：** Latent Space podcast 共同主持人，與 Aravind 共同主持 AI 工程師社群內容。
- **角色：** 在 keynote 後主持 Q&A，問題來自現場 Slido 觀眾；聚焦「如何開始」「scale」「plan mode」「token 用量分配」等工程師實務面。
- **代表觀點：** 把 Ryan 的內部實作與一般開發者經驗做橋樑，問題設計上偏好可被多數工程師複製的具體策略。

---

## 五、核心主旨

> 軟體工程的稀缺資源正從「會寫程式碼」轉向「會設計讓代理寫出好程式碼的系統」；harness engineering 就是把資深工程師腦中的非功能性需求，外化成模型可讀的約束（lint、tests、reviewer agents、文件），並透過持續 feedback loop 自我癒合。

---

## 六、金句摘錄

1. "Code is free. Hiring the hands on the keyboards as part of our teams is only constrained by GPU capacity and token budgets."
2. "The important thing is not the code, but the prompt and the guardrails that got you there."
3. "Everything I've talked about here today is a prompt. You can do this without touching the model weights at all."
4. "The dream here is that I actually have 50 agents running 24/7 and I don't have to interact with them at all — every time I have to type 'continue' to the agent is a failure of the harness."
5. "We treat the PR as a broadcast domain, like Google Docs for a work artifact — and don't put the model in a box where it gets bullied by older reviewers."
6. "Use the LLM as a fuzzy compiler — harness is the constraints, swap models is swap code generation backend, the structure around the code stays."

---

## 七、延伸閱讀 / 參考

- **OpenAI Harness Engineering 文章**：https://openai.com/index/harness-engineering/
- **Latent Space podcast 訪談 Ryan Lopopolo**：https://latent.space/p/harness-eng
- **講者個人**：https://x.com/_lopopolo ｜ https://github.com/lopopolo
- **相關概念延伸**：Karpathy 的「Software 2.0」、Andrej Karpathy 對 vibe coding 的反思、Anthropic 的 effective harnesses for long-horizon agents

---

## 八、後記

本影片是 AI Engineer Summit London 現場錄製，觀眾反應在 Ryan 提到「migration 不再卡關」與「Laptop 綁後座跑 inference」時特別熱烈。Q&A 部分超過 18 分鐘，佔總時長約 40%，與多數 5–10 分鐘 Q&A 的產業 keynote 不同——顯示社群對 agent-first 實作細節的渴求。最具行動指引價值的三個段落：Section 4（persona 文件）、Section 15（Friday garbage collection）、Section 16（LLM as fuzzy compiler）。