# 【AI-Powered SDLC with Claude Code / Codex / Kiro on Amazon Bedrock AgentCore】

**AWS Show & Tell｜主講：Mark Roy、Isan (EK) Koshik、Evandro (Ivandro) Wendro｜主持：Anil Nadmini｜2026 年（直播存檔）**

> 影片連結：https://www.youtube.com/live/vmybpMc4GMY
> 影片時長：59 分 14 秒（3554s）
> 性質：AWS 直播技術 demo + 三段 live coding
> 來源：YouTube 自動英文字幕（en-orig VTT，自動滾動字幕累積已清除）
> 英文逐字稿：transcripts/20260619_AWSShowAndTell_AIPoweredSDLC_逐字稿.txt

---

## 一、主題與背景

AWS Bedrock AgentCore 團隊在「AWS Show & Tell」直播節目中,展示如何把 Claude Code、Codex、Kiro、Cursor、OpenCode 等多種 coding agent **從本地 laptop 搬到雲端 microVM** 託管,並透過 GitHub Actions + Step Functions + Lambda 串成一條「**從 issue 到 pull request 全自動**」的 SDLC pipeline。主持人 Anil Nadmini 開場,主講 Mark Roy（AgentCore SAS/data science lead）負責開場背景與痛點解說,Isan (EK) Koshik 與 Evandro Wendro 接力展示兩段 live demo:四個並行 coding agent 解同一個 bug,以及一條 production-grade SDLC pipeline（explore → implement → critique → push PR）。

核心議題一句話：**當 coding agent 走進雲端,SDLC 不再需要工程師盯著 laptop——GitHub issue 加 label,agent 就會自己跑完 explore → implement → critique 並送出 PR,且全程受限於 VPC、identity、image policy 等企業治理。**

---

## 二、章節脈絡

### Section 1｜開場與來賓介紹（00:00 ~ 02:30）

**重點摘要:** 主持人 Anil Nadmini 介紹 Mark Roy（New Hampshire）、Isan (EK) Koshik（LA, demo SDLC pipeline）、Evandro Wendro（demo agent core runtime）。

**內容:**
- Mark Roy:AgentCore 推出將近一年,團隊每週 release,一年內從 prototype/POC/pilot 階段轉入 production workload
- EK:即將 demo SDLC pipeline,「really excited」
- Ivandro:即將 demo 如何在 agent core runtime 託管 coding agent

> "It's been amazing. I get to lead a team of SAS and data scientists. We focus on agents and we work really closely with the agent core team and we've been listening uh pretty hard to all the feedback cranking out releases week after week."

---

### Section 2｜客戶痛點:為什麼 coding agent 不能只在 laptop 上跑（02:30 ~ 08:30）

**重點摘要:** Mark 秀出 EK 六個月前在紐約街頭騎車、開著 laptop 寫 demo 的照片,點出 laptop-only 模式四大問題:limited parallelism、no isolation、blast radius、credentials 風險。

**內容:**
- 痛點 1 — **Limited parallelism**:只能一次跑一個 agent;laptop 關閉就停擺
- 痛點 2 — **No isolation**:agent 彼此容易互相干擾,也容易存取不該存取的資源
- 痛點 3 — **Blast radius**:壞事一旦發生,loss 很大;agent 拿到越多 tool credentials,出事時 blast 半徑越大
- 痛點 4 — **浪費時間、跨團隊 drift、agent 做壞事的風險**
- 開發者要的:平行跑多個 agent、laptop crash 後仍能繼續、用自己喜歡的 coding agent（不被 AWS 綁）
- 管理員要的:限制 blast radius、用 VPC 與自家 identity provider、end-to-end observability、不暴露 credentials

> "Limited parallelism. You've got to keep your laptop open which can be a problem overnight. Doing real long-running workloads... also no isolation... limiting the blast radius... there's a lot of credentials lying around on your laptop."

---

### Section 3｜AgentCore 解法總覽(08:30 ~ 12:30)

**重點摘要:** AgentCore 提供 session management + session isolation + zero infra management + 雲端 terminal UI,開發者可以像在 laptop 上工作一樣但不被綁住。

**內容:**
- **Any coding assistant, any model** — Claude Code、Codex、Kiro、Cursor、OpenCode 都支援;模型可用 Bedrock、自家 LLM gateway、開源模型,或任何外部 provider
- **Built-in session management + isolation** — 每個 session 獨立 Firecracker microVM,session 之間不互相滲透
- **No infrastructure management** — 不需要自己管理 VM、container、auto-scaling
- **No more riding down New York streets with your laptop open** — 「It's safe to close your laptop now」
- **Terminal UI (近期新功能)** — 不只能 kick off job,還能 SSH 進 microVM 直接互動,像本機開發體驗

> "It's basically any model, any agent framework. We're extending that here to say any coding agent, bring your favorite. No more riding down New York streets uh on your bike with your laptop open. Uh close that lid. uh let agent core keep the work going."

---

### Section 4｜Use Cases 與核心能力拆解(12:30 ~ 22:30)

**重點摘要:** Mark 列舉四種典型使用情境,並詳解 AgentCore 的三大核心能力——多模型多 agent、persistent storage、terminal UI + governance。

**內容:**

**Use cases:**
- Long-running tasks — 過夜跑大規模 migration 或 refactor,白天接 terminal UI 看進度
- Parallel agents — 多個 agent 同時做同一份工作的不同部分
- AI-driven development — 企業想釋放 coding agent 生產力但要可治理
- Fully lights-out — 新 issue 進 GitHub,coding 就自動開始

**Core capabilities:**
- **Any coding assistant / any model** — 支援 Bedrock、自家 gateway、開源模型
- **Persistent storage 兩種:**
  1. **Managed session storage** — 每個 session 自動配一塊持久儲存(per session, 14 天);session crash 後可恢復
  2. **BYO storage** — S3 / EFS,跨 session 共享 skills、dependency caches
- **Terminal UI** — 從 AgentCore CLI 直接 SSH 進 microVM,可送單獨 shell command(不過 LLM)
- **AgentCore Gateway** — 鎖定可存取的 tool、VPC;支援 image policy(控管 container 下載來源與套件);**AgentCore Identity** 整合 Ping、Entra、Okta 等企業 IdP
- **Observability** — end-to-end trace,所有 action 都可 audit
- **Session isolation** — 底層用 Firecracker microVM
- **Memory** — short-term + long-term,可讓 agent 記住 user 偏好
- **End-to-end security / privacy** — Private Link、嚴格控制 resource access

> "We give you agent core gateway where you can lock down exactly what you're allowed to access which tools which VPCs... you can also have image policies... agent core identity as well where you plug in your own identity provider... you get to control all of the way that that access works."

---

### Section 5｜Demo Part 1:Ivandro 展示 AgentCore CLI + Terminal UI(22:30 ~ 32:00)

**重點摘要:** Ivandro 用 `agentcore create` + `agentcore deploy` 兩個指令把 coding agent 推到 AWS 帳號,並展示近期新功能——Terminal UI(SSH 進 microVM)與 S3 檔案掛載。

**內容:**
- `agentcore create` 建立新 agent(可指定 Python 直譯、deployment type、memory 是否啟用)
- `agentcore deploy` 把 agent push 到 AWS account
- `agentcore exec` — 在 microVM 裡跑單次 command(例如 `cat /etc/os-release`),不開 session
- **Terminal UI 新功能** — 用類似 `docker exec -it` 的指令 SSH 進 microVM,「I'm inside my microVM. I have, you know, all my stuff here」
- **S3 掛載** — microVM 可掛 S3 當 MCP 檔案與 skills 的共享目錄,ivandro 現場 create / upload 一個文字檔,另一個 session 立刻看到

> "We have this new feature which is very complex like you will see now. I just need to if you are familiar with Docker, you probably know this option... I'm inside my microVM. I have, you know, all my stuff here."

---

### Section 6｜Demo Part 2:四個並行 Coding Agent 解同一個 Bug(32:00 ~ 43:00)

**重點摘要:** Ivandro 把 Claude Code、Codex、Kiro、OpenCode 四個 coding agent 同時連到同一個 GitHub issue(描述一個 app.py bug),比較四者給出的 fix 與時間。

**內容:**
- 預先 deploy 一個 AgentCore Gateway + GitHub MCP,四個 agent 都透過同一個 MCP 存取 GitHub
- 每個 agent 給同一個 prompt:讀 issue、想解法、給 fix,**不要**直接 push PR(為了 demo 不一次送四個 PR)
- 四個 agent 同時連到 terminal UI,可即時看到進度
- 結果:
  - **Claude Code** — 最快給出 fix + 估計時間
  - **Kiro** — 給出 fix 但稍慢(需要 permissions)
  - **OpenCode** — 號稱「30 秒」,但 ivandro 提醒「他自己在說,不是我」
  - **Codex** — 最後完成(忘了給 permissions)
- 重點不是誰比較快,而是展示「不同 coding agent 可以在同一個 runtime 同時跑、共享同一個 MCP」

> "I have this fancy... I can disconnect all of them at the same time. I can ask them to fix and send the PR to fix my code. So this is what I want to show."

---

### Section 7｜Demo Part 3:EK SDLC Pipeline — Issue → PR 全自動(43:00 ~ 55:00)

**重點摘要:** EK 展示 production-grade SDLC pipeline:GitHub issue 加 label → GitHub Actions 觸發 Step Function → Lambda setup workspace → Lambda execute AgentCore runtime → Claude Code 跑 explore → implement → critique → push PR。

**內容:**
- **Step Function 內含兩個 Lambda:**
  1. **Setup workspace** — git clone repo,從 S3 複製 plugin(MCP config + skills + hooks)到 manage session storage,並 sync 與 main branch
  2. **Execute agent core runtime** — 啟動 Claude Code,把 issue + comments 餵進去
- **Plugin 結構:**
  - **MCP JSON** 連到 AgentCore Gateway
  - **Developer MCP servers** — 透過單一 gateway 整合 AWS docs MCP、CloudFormation MCP、Context7 MCP 等
  - **Project management MCP** — agent 可對 issue 留言(包含 clarifying questions)
  - **Source control MCP** — 寫完 code 後 push 到 branch、跑 CI、驗證 CIS
- **Skills + Hooks:**
  - **Hook** 阻擋 agent 對 `/mount/plugin` 寫入(防止 agent 改到跨 session 共享的 plugin)
  - **Skill** 提供 instructions,引導 agent 用 MCP servers
- **Explore → Implement → Critique 流程:**
  - **Explore stage** — agent 先讀 repo、列問題、必要時對 issue 留言 ask clarifying questions
  - **Implement stage** — 拿到回答後寫 code
  - **Critique stage** — 內部 Haiku agent 檢查自己的 code(npm pass、synth pass、CI pass)
  - **Push PR stage** — 開 PR、CIS 跑完、通知 reviewer
- **實際展示:** EK 開了一個 observability issue,8 小時前 trigger,昨天 explore、今天 implement + critique + PR 完成,「without my intervention」

> "One thing that I missed was agent core policy. And let me tell you, this was a game changer. The main issue with this SDLC pipeline when I was building it was it was actually pushing to my main branch, which I don't want... I added a policy to my gateway and said do not allow any pushes to the main branch."

---

### Section 8｜為什麼用 Step Functions 而不是純 Lambda(55:00 ~ 57:30)

**重點摘要:** EK 解釋:Lambda 15 分鐘 timeout 不夠跑完整 SDLC,所以需要 Step Functions 包 wait loop,讓 Claude Code 沒完成就一直 sleep 15 秒再 check。

**內容:**
- Lambda 的 15 分鐘 timeout 對一般 agent job 不夠(SDLC 可能跑數小時)
- Step Function 包 wait loop:「Is it completed? No → sleep 15 seconds → check again」
- Step Function 只在 Claude Code 真的成功時才結束
- 如果確定不需要這個特性,**純 Lambda 也可以**——只要 setup workspace + execute pipeline + forget about it

> "I see a future of this demo where I can essentially... use step function to continuously execute this command. And the step function only succeeds when my cloud code has succeeded."

---

### Section 9｜Observability + Hooks 與收尾(57:30 ~ 59:14)

**重點摘要:** EK 用 AgentCore Observability Dashboard 看 trace,意外發現 agent 想寫 S3 shared file,於是用 hook 阻擋——展示 observability + hook 組合的威力。

**內容:**
- AgentCore Observability Dashboard — 可看每個 tool execution、LLM request、Bedrock prompt caching 命中率
- 發現問題:某次 trace 中 agent 想編輯 `mount/plugin` 目錄(S3 shared file),會污染所有 session 的 skills
- 解法:加 hook ——「if path is mount/plugin, deny both read and write」
- 收尾:三人各自離場,主持人提醒觀眾「下週見」
- Resources:
  - AWS 部落格:https://aws.amazon.com/blogs/machine-learning/its-safe-to-close-your-laptop-now-hosting-coding-agents-on-amazon-bedrock-agentcore/
  - 範例 repo:https://github.com/awslabs/agentcore-samples/tree/main/01-features/02-host-your-agent/01-runtime/04-coding-agents
  - SDLC pipeline:https://github.com/aws-samples/sample-agent-assisted-sdlc
  - AgentCore:https://aws.amazon.com/bedrock/agentcore/

> "It's a total mess... I added a hook and in that hook I was able to say that if the path is mount plug-in deny any any other like deny both read and write."

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處 / 應用 |
|------|------|-----------|
| **Amazon Bedrock AgentCore** | AWS 託管 agent runtime 服務,用 Firecracker microVM 提供 session isolation | AWS,2025 推出 |
| **Session Isolation** | 每個 coding session 跑在獨立 microVM,session 之間資料、credential 不互相滲透 | AgentCore 底層設計 |
| **AgentCore CLI** | `agentcore create / deploy / exec` 三指令,本地開發 → 雲端託管的入口 | Ivandro demo |
| **Terminal UI (TUI)** | 近期新增功能,從 CLI SSH 進 microVM,像本機 shell 一樣互動 | Ivandro demo |
| **AgentCore Gateway** | 統一 MCP 入口,可鎖定 tool / VPC / image policy / push-to-main-block 等規則 | EK SDLC pipeline |
| **AgentCore Identity** | 整合 Ping / Entra / Okta 等企業 IdP,讓 agent 用企業身份存取資源 | Mark 開場 |
| **Managed Session Storage** | 自動配給每個 session 一塊持久儲存(per session, 14 天),session crash 後可恢復 | Ivandro 解釋 |
| **BYO Storage (S3 / EFS)** | 跨 session 共享 skills、dependency caches、artifact 的儲存方案 | Mark / Ivandro |
| **MCP (Model Context Protocol)** | 標準化 tool calling 介面;AgentCore Gateway 可 MCPify 任一 API | Ivandro / EK |
| **MCPify** | 把任意 REST API 包成 MCP server,讓 agent 用同一介面存取 | Ivandro 解釋 |
| **Image Policy** | AgentCore Gateway 的治理規則,控管 container 下載來源與套件白名單 | Mark 開場 |
| **Plugin / Skill / Hook** | Claude Code 的擴充機制:plugin 載 MCP config、skill 給 instructions、hook 在 tool call 前攔截 | EK demo |
| **Harness** | 抽象層,讓同一個 coding agent 在執行期動態切換模型 | Anil 提問時 Ivandro 回答 |
| **Explore → Implement → Critique** | SDLC pipeline 三階段:探索需求、寫 code、Haiku sub-agent 自我檢查 | EK SDLC pipeline |
| **SDLC Pipeline (sample-agent-assisted-sdlc)** | GitHub Actions + Step Functions + Lambda + AgentCore runtime 串成的 issue → PR 自動化 | EK demo |
| **AgentCore Policy** | 在 Gateway 層設「不允許 push main branch」之類硬規則,即使 agent 想做也會被擋下 | EK demo 關鍵發現 |

---

## 四、人物 / 角色分析

### Anil Nadmini — 主持人
- 背景:AWS Show & Tell 系列主持人(直播當天在新澤西)
- 角色:開場、串場、把關鍵問題(「不同模型可混用嗎?」「VM 關掉後資料還在嗎?」)拋給講者
- 關鍵貢獻:用問題幫觀眾抓重點

### Mark Roy — AgentCore SAS / Data Science Lead
- 背景:帶領 AgentCore 團隊,每週 release,「whirlwind year」
- 關鍵轉折:從 2025 prototype / POC 階段總結到 2026 production workload,點出 coding agent 是新焦點
- 代表觀點:「開發者要 any coding agent,管理員要 governance,AgentCore 兩全」

### Isan (EK) Koshik — SDLC Pipeline Demo 主講
- 背景:六個月前在紐約街頭騎車寫 demo 的工程師(被 Mark 拿出來當開場笑點)
- 關鍵貢獻:實際建出 production-grade SDLC pipeline,把 explore → implement → critique 跑成閉環
- 代表觀點:「20 分鐘內可在任何 GitHub repo 跑起這條 pipeline」

### Evandro (Ivandro) Wendro — AgentCore Runtime Demo 主講
- 背景:AgentCore runtime 端工程師
- 關鍵貢獻:展示 CLI 簡易部署、TUI 新功能、S3 掛載、四 agent 並行 demo
- 代表觀點:「AgentCore CLI 讓本機開發體驗跟雲端託管無縫接軌」

### EK 口中那位 mentor
- 角色:20 年前見證「git tracked itself」的人
- 影響:提醒 EK「現在 SDLC coding engine pipeline 在 build 自己」——「It's pretty cool」

---

## 五、核心主旨

> **當 coding agent 從 laptop 走進雲端 microVM 並透過 AgentCore Gateway 受企業治理,SDLC 可以從 GitHub issue 加 label 開始、由 agent 全自動跑完 explore → implement → critique 並送出 PR——同時保有 any coding assistant 的彈性,以及 VPC、identity、image policy 等企業級安全控制。**

---

## 六、金句摘錄

1. "It's safe to close your laptop now." — 整部影片的口號,AWS 部落格標題
2. "We're extending that here to say any coding agent, bring your favorite." — AgentCore 的核心承諾
3. "Limited parallelism... no isolation... limiting the blast radius... credentials lying around on your laptop." — Mark 列舉 laptop-only 模式的四大死罪
4. "It was funny enough one of my mentors mentioned that almost 20 years ago git there was the first day when git tracked itself and now we have a SDLC coding engine pipeline which is now building itself." — SDLC pipeline demo 的精神
5. "Agent core policy... do not allow any pushes to the main branch." — EK 用 12 個字改掉一個 architectural 風險
6. "You will have this SDLC pipeline running in no more than 20 minutes on any GitHub repository today." — 給觀眾的最後一句行動呼籲

---

## 七、延伸閱讀 / 參考

- AWS 部落格:https://aws.amazon.com/blogs/machine-learning/its-safe-to-close-your-laptop-now-hosting-coding-agents-on-amazon-bedrock-agentcore/
- AgentCore runtime 範例:https://github.com/awslabs/agentcore-samples/tree/main/01-features/02-host-your-agent/01-runtime/04-coding-agents
- SDLC pipeline 範例:https://github.com/aws-samples/sample-agent-assisted-sdlc
- AgentCore 產品頁:https://aws.amazon.com/bedrock/agentcore/
- Harness Engineering(上集,相關主題):https://openai.com/index/harness-engineering/

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd）,約 7 分 44 秒
> 口播稿原文:transcripts/20260619_AWSShowAndTell_AIPoweredSDLC_口播稿.txt

- [opus 3.7 MB](../audio/20260619_AWSShowAndTell_AIPoweredSDLC.opus)（Telegram 友善）
- [m4a 7.4 MB](../audio/20260619_AWSShowAndTell_AIPoweredSDLC.m4a)（iOS 友善）
- [mp3 7.1 MB](../audio/20260619_AWSShowAndTell_AIPoweredSDLC.mp3)（通用格式）
