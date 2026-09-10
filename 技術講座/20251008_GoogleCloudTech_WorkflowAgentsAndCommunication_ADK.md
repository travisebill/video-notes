# 【Workflow agents and communication in ADK】

**講者｜Google Cloud Tech（Google 官方 AI/ML YouTube 頻道）**
**影片連結｜https://www.youtube.com/watch?v=WfJcCeLZD2I**
**影片長度**｜4:52（292s）
**發布日期｜2025-10-08**
**Module｜A Multi-agent 基礎 (Ep.2)**
**類型｜教學影片（ADK 系列 Ep.2 完結篇）**
**主題｜Google Agent Development Kit (ADK) 系列 Ep.2 — Workflow agents + Communication mechanisms**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Google Cloud Tech 推出 Google Agent Development Kit（ADK）系列教學影片，這是 Ep.2 完結篇。影片用 4 分鐘 52 秒介紹 ADK 的兩大進階主題：workflow agents（控制 agent 執行順序）與 communication mechanisms（agent 之間的通訊機制）。

影片的核心架構分為兩大部分。第一部分介紹三種 workflow agent：sequential agent（組裝線式執行）、parallel agent（並行派工）、loop agent（重複執行直到條件滿足）。第二部分介紹三種 communication mechanism：shared session state（共享白板）、LLM-driven delegation（LLM 決策派工）、explicit invocation - agent as a tool（明確呼叫其他 agent 當工具）。影片最後還對比 sub-agent 與 agent-as-tool 的差異，並總結這個 2 集 beginner series。

整支影片的關鍵洞察：multi-agent 系統不只需要 hierarchy 結構（Ep.1 主題），還需要 workflow agents 控制執行順序，加上 communication mechanisms 讓 agent 之間能傳遞資料。ADK 提供的 sub-agent（組織圖成員）vs agent-as-tool（外部顧問）的區別，是開發者設計多 agent 協作時的關鍵選擇點。

---

## 章節脈絡

| 段落 | 時間 | 標題 | 一句話摘要 |
|------|------|------|----------|
| Section 1 | 00:00 - 00:30 | 開場 + 上集回顧 | Ep.2 完結篇，回顧 Ep.1 的 hierarchy 概念 |
| Section 2 | 00:30 - 01:50 | 三種 Workflow Agents | Sequential / Parallel / Loop 三種 agent 執行模式 |
| Section 3 | 01:50 - 03:30 | 三種 Communication Mechanisms | Shared session state / LLM delegation / Agent as tool |
| Section 4 | 03:30 - 04:20 | Sub-agent vs Agent-as-tool | 組織圖成員 vs 外部顧問的差異 |
| Section 5 | 04:20 - 04:52 | 系列收尾 | 總結 2 集 beginner series |

> 時間軸是根據 675-word 逐字稿內容比例估算，非官方 timecode。

---

## 關鍵概念定義

| 概念 | 定義 | 角色 / 應用 |
|------|------|------------|
| **Workflow agent** | ADK 提供的 flow 控制 node，決定多個 agent 的執行順序 | 控制 multi-agent 協作流程 |
| **Sequential agent** | 像組裝線，每個 sub-agent 依固定順序執行、傳遞結果 | 適合有順序相依的任務（fetch → clean → analyze → summarize）|
| **Parallel agent** | 像 manager 同時派工給三個員工 | 適合獨立任務（多 API 並行呼叫）|
| **Loop agent** | 重複執行直到條件滿足或達 max iteration | 適合除錯、迭代改進 |
| **Shared session state** | 像共享白板，一個 agent 寫結果、下一個 agent 讀取 | ADK 通訊機制一：透過 state 傳遞 |
| **LLM-driven delegation** | Coordinator agent 像 CEO 看完需求後決定派給哪個 sub-agent | ADK 通訊機制二：靠 LLM 判斷 |
| **Explicit invocation (agent as tool)** | 把另一個 agent 包成 function-style tool，parent agent 決定何時呼叫 | ADK 通訊機制三：明確呼叫介面 |
| **Sub-agent** | 組織圖的一部分，永遠被 parent agent 管理 | hierarchy 結構中的下層節點 |
| **Agent as tool** | 像外部顧問，用才叫、不在 core hierarchy | 跨越 hierarchy 邊界的工具化呼叫 |
| **Orchestration pattern** | 多個 agent 協作完成任務的流程模式 | Sequential + Parallel + Loop 三種基本模式 |

---

## 人物 / 角色分析

### Google Cloud Tech（講者）
- **背景**：Google 官方 AI/ML YouTube 頻道，ADK 系列主講人（可能是 Developer Advocate）
- **關鍵角色**：本影片（Ep.2 完結篇）講者，延續 Ep.1 的概念深入 workflow 與 communication
- **代表觀點**：ADK 提供的三種 workflow agent + 三種 communication mechanism 是建構可運作 multi-agent 系統的必備框架

---

## 核心主旨

> **Multi-agent 系統不只需要 hierarchy 結構（Ep.1），還需要 workflow agents 控制執行順序（sequential / parallel / loop）以及 communication mechanisms 讓 agent 之間傳遞資料（shared session state / LLM-driven delegation / agent as tool）；ADK 提供的 sub-agent（組織圖成員）vs agent-as-tool（外部顧問）的區別，是開發者設計多 agent 協作的關鍵選擇。**

---

## 金句摘錄

1. > "We have three workflow agents, and the first type is sequential agent. They're like an sampling line."
   > —— Sequential agent 的組裝線比喻

2. > "The second type of workflow agent are parallel agent. They're like a manager assigning tasks to three employees all at once."
   > —— Parallel agent 的 manager 派工比喻

3. > "The third type of workflow agent are loop agent. They're like your debug again and again until it works."
   > —— Loop agent 的除錯比喻

4. > "Shared session state. You can think of it as a shared whiteboard. So one agent write its result and pass it to next agent."
   > —— Shared session state 的白板比喻

5. > "LLM driven delegation. That is where it gets smart. A coordinate agent as like a CEO, it will look at the request and decide, okay, which sub agent should I delegate to?"
   > —— LLM-driven delegation 的 CEO 比喻

6. > "A sub agent is part of an organizational chart and is always managed by its parent agent. An agent as a tool is like bringing a consultant."
   > —— Sub-agent vs Agent-as-tool 的精準比喻

---

## 延伸閱讀 / 參考

- **Google Agent Development Kit (ADK) 官方文件** — https://google.github.io/adk-docs/
- **Google Cloud Tech YouTube 頻道** — https://www.youtube.com/@googlecloudtech
- ADK 系列影片（按日期排序）：
  - #1 Foundations of multi-agent systems with ADK (2025-10-01)
  - #3 Connecting ADK Agents to MCP Servers (2025-11-07)
  - #4 Building your own MCP server with ADK (2025-11-17)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 1 分 48 秒
> 口播稿原文：transcripts/20251008_GoogleCloudTech_WorkflowAgentsAndCommunication_ADK_口播稿.txt

- [opus 0.4 MB](../audio/20251008_GoogleCloudTech_WorkflowAgentsAndCommunication_ADK_口播稿.opus)（Telegram 友善）
- [m4a 2.0 MB](../audio/20251008_GoogleCloudTech_WorkflowAgentsAndCommunication_ADK_口播稿.m4a)（iOS 友善）
- [mp3 1.7 MB](../audio/20251008_GoogleCloudTech_WorkflowAgentsAndCommunication_ADK_口播稿.mp3）（通用格式）
