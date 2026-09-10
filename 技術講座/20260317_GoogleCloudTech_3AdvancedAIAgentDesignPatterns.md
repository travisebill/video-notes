# 【3 Advanced AI agent design patterns】

**講者｜Google Cloud Tech（Google 官方 AI/ML YouTube 頻道，ADK 系列主講人 Annie）**
**影片連結｜https://www.youtube.com/watch?v=89KKm_a4M7A**
**影片長度**｜8:00（480s）
**發布日期｜2026-03-17**
**Module｜E Design Patterns（跨系列） (Ep.2)**
**類型｜教學影片（Agents Pattern 系列 Ep.2）**
**主題｜Google Agent Development Kit (ADK) — 3 個進階 Agent design patterns：Loop review & critique / Coordinator router / Agent as tool**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Google Cloud Tech 推出 Agentic Pattern 系列教學影片，這是系列第二集。影片用 8 分鐘展示三個進階 pattern：loop review & critique、coordinator router、agent as tool，每個都搭配 coding 範例和 live demo。

影片的核心架構分為三大部分。第一部分介紹 loop review & critique pattern：用 generator agent 加 critique agent 形成迴圈，generator 產生初步結果、critique 檢查是否符合條件，不符合就把結果和反饋送回 generator 修改，重複直到通過或達到最大迭代次數。第二部分介紹 coordinator router pattern：top-level coordinator 像聰明的 project manager，分析用戶需求後把大任務拆成子任務委派給專門 sub-agents。第三部分介紹 agent as tool pattern：跟 coordinator 表面相似但關鍵差異在控制權和狀態管理。

整支影片的關鍵洞察：選對 pattern 取決於需求特性，每個 design 在 control、flexibility、cost、complexity 之間都有 trade-off。Loop 確保品質和約束、coordinator 提供動態靈活 routing、agent as tool 保留主要 agent 完整控制權。

---

## 章節脈絡

| 段落 | 時間 | 標題 | 一句話摘要 |
|------|------|------|----------|
| Section 1 | 00:00 - 03:30 | Loop, review, and critique pattern | Generator + critique 迴圈直到符合條件 |
| Section 2 | 03:30 - 06:00 | Coordinator router pattern | Top-level coordinator 拆任務委派給 specialized agents |
| Section 3 | 06:00 - 08:00 | Agent as tool pattern | Primary agent 保留控制權，sub-agents 當無狀態工具 |

> 時間軸是根據 1150-word 逐字稿內容比例估算。

---

## 關鍵概念定義

| 概念 | 定義 | 角色 / 應用 |
|------|------|------------|
| **Loop review & critique** | Generator + critique 形成的迭代迴圈，直到結果符合條件 | 確保輸出符合特定品質標準和約束 |
| **Generator agent** | 在 loop pattern 中負責產生初步結果的 agent | 每次迭代嘗試新的輸出 |
| **Critique agent** | 在 loop pattern 中負責檢查結果是否符合條件的 agent | 不符合就把結果和反饋送回 generator |
| **Iterative refinement** | 迴圈重複改善輸出的過程 | 確保品質但增加 latency 和成本 |
| **Exit condition** | 迴圈終止的條件 | 設計不當會造成無限迴圈或過早停止 |
| **Coordinator router** | Top-level agent 像 PM，分析需求後委派給 specialized agents | 動態靈活 routing 解決複雜問題 |
| **Hierarchical task decomposition** | Coordinator 把大任務拆成子任務的過程 | 多層結構：coordinator → sub-agents |
| **Agent as tool** | Primary agent 把 sub-agents 當無狀態工具呼叫 | 保留完整控制權和狀態管理 |
| **Stateless tool** | Agent as tool 中 sub-agents 的特性：執行一個函式就回傳 | 不保留狀態給 primary agent |
| **Control and state management** | Coordinator vs agent-as-tool 的關鍵差異 | Coordinator 委派後放棄控制，agent-as-tool 保留 |
| **Pattern tradeoffs** | 每個 pattern 在 control / flexibility / cost / complexity 間的取捨 | 依任務特性選對 pattern |

---

## 人物 / 角色分析

### Google Cloud Tech（講者 Annie）
- **背景**：Google 官方 AI/ML YouTube 頻道 ADK 系列主講人（從逐字稿口氣推斷，可能是 Developer Advocate）
- **關鍵角色**：本影片（Agents Pattern 系列 Ep.2）講者，展示三個進階 pattern 的程式碼和 live demo
- **代表觀點**：每個 pattern 在 control / flexibility / cost / complexity 間都有 trade-off，選對 pattern 取決於任務特性

---

## 核心主旨

> **三個進階 agent design pattern 各有定位：Loop review & critique pattern（generator + critique 迴圈直到符合條件，確保品質約束但增加 latency 成本）、Coordinator router pattern（top-level 像 PM 拆任務委派給 specialized agents，動態靈活 routing 但多層結構複雜）、Agent as tool pattern（primary agent 保留控制權，sub-agents 當無狀態工具，類似工匠拿起工具做一步再換下一步）；選對 pattern 取決於需求特性——simple prototype 用 single agent、reliable structured workflow 用 sequential 或 parallel agent、要符合特定條件用 loop、要動態靈活 routing 解複雜問題用 coordinator 或 agent as tool，每個 design 在 control、flexibility、cost、complexity 之間都有 trade-off。**

---

## 金句摘錄

1. > "This loop will continue until the plan is approved or we hit a maximum number of iterations to prevent infinite loops. And this is a form of iterative refinement."
   > —— Loop pattern 的終止機制

2. > "You can think of this coordinator agent as a smart project manager. It analyzes users' requests and then delegates to the correct specialized agent from a team of experts."
   > —— Coordinator 的 PM 比喻

3. > "In a coordinator pattern, the main agent delegates the task, the sub-agent take full control and solve its piece of puzzle. But in the agent as tool pattern, the primary agent treats the sub-agent like simple stateless tool."
   > —— Coordinator vs Agent-as-tool 的控制權差異

4. > "You can think of it like a coordinator is a manager who gives a project to an employee, and an agent as a tool is a craftsman who pick up a specific tool and to do one part of the job before picking up the next tool."
   > —— Manager vs Craftsman 比喻

---

## 延伸閱讀 / 參考

- **Google Agent Development Kit (ADK) 官方文件** — https://google.github.io/adk-docs/
- **Google Cloud Tech YouTube 頻道** — https://www.youtube.com/@googlecloudtech
- ADK 系列影片（按日期排序）：
  - #1 Foundations of multi-agent systems with ADK (2025-10-01)
  - #2 Workflow agents and communication in ADK (2025-10-08)
  - #3 Connecting ADK Agents to MCP Servers (2025-11-07)
  - #4 Building your own MCP server with ADK (2025-11-17)
  - #5 The agent evaluation revolution (2025-12-03)
  - #6 How to evaluate agents in practice (2025-12-12)
  - #7 AI agent design patterns (2026-02-27)
  - #9 How to add short-term memory to your AI agent (2026-03-26)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 2 分 39 秒
> 口播稿原文：transcripts/20260317_GoogleCloudTech_3AdvancedAIAgentDesignPatterns_口播稿.txt

- [opus 0.6 MB](../audio/20260317_GoogleCloudTech_3AdvancedAIAgentDesignPatterns_口播稿.opus)（Telegram 友善）
- [m4a 1.9 MB](../audio/20260317_GoogleCloudTech_3AdvancedAIAgentDesignPatterns_口播稿.m4a)（iOS 友善）
- [mp3 2.4 MB](../audio/20260317_GoogleCloudTech_3AdvancedAIAgentDesignPatterns_口播稿.mp3）（通用格式）
