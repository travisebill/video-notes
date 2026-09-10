# 【How to evaluate agents in practice】

**講者｜Google Cloud Tech（Google 官方 AI/ML YouTube 頻道，ADK 系列主講人 Annie）**
**影片連結｜https://www.youtube.com/watch?v=vuBvf7ZRKTA**
**影片長度**｜10:53（653s）
**發布日期｜2025-12-12**
**Module｜C Agent Evaluation (Ep.2)**
**類型｜教學影片（Agent Evaluation 系列 Ep.2 完結篇）**
**主題｜Google Agent Development Kit (ADK) — 三層測試金字塔 + ADK eval 實作：trajectory 概念、tool_trajectory_average_score、response_match_score**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Google Cloud Tech 推出 AI Agent Evaluation 系列教學影片，這是系列第二集也是完結篇。影片用 10 分多鐘從「三層測試金字塔」到「ADK 實際落地」到「hands-on demo」完整說明如何用 ADK 實際評估 AI agent。

影片的核心架構分為三大部分。第一部分介紹三層測試金字塔：Tier 1 component unit test（測 tool 選擇、參數格式）、Tier 2 trajectory integration test（測完整多步任務 end to end）、Tier 3 end-to-end human review（測整體體驗）。第二部分說明 ADK 怎麼落地這套框架，用 book finder agent 範例展示 trajectory 概念和 ADK 的兩個 built-in metrics（tool_trajectory_average_score 和 response_match_score）。第三部分 demo 實際寫 test。

整支影片的關鍵洞察：agent evaluation 不是「我覺得這個 agent 可以用」這種主觀判斷，而是「我知道這個 agent 可靠」這種可重複執行的自動化檢查；三層金字塔 + ADK built-in tools 提供了這套 from-theory-to-practice 的完整路徑。

---

## 章節脈絡

| 段落 | 時間 | 標題 | 一句話摘要 |
|------|------|------|----------|
| Section 1 | 00:00 - 04:00 | 三層測試金字塔 | Tier 1 unit / Tier 2 trajectory / Tier 3 human review |
| Section 2 | 04:00 - 07:30 | ADK in action | Book finder agent 範例 + trajectory 概念 + 兩個 built-in metrics |
| Section 3 | 07:30 - 10:53 | ADK eval demo | Tier 1 tool correctness + Tier 2 trajectory test 實際程式碼 |

> 時間軸是根據 1421-word 逐字稿內容比例估算。

---

## 關鍵概念定義

| 概念 | 定義 | 角色 / 應用 |
|------|------|------------|
| **Three tier testing pyramid** | Agent 評估的三層架構：unit / integration / human review | 從快到慢、從便宜到貴、從自動化到人工 |
| **Tier 1: Component unit test** | 測試最小建構塊：tool 選對、參數格式對、JSON 欄位正確 | Fast / cheap / automated / 適合 CI 抓 regression |
| **Tier 2: Trajectory integration test** | 測試完整多步任務 end to end：計畫合不合理、工具順序、調適能力、記憶、達成目標 | ADK eval 工具，檢查 capability + reasoning |
| **Tier 3: End-to-end human review** | 人進 loop 檢查整體體驗：helpfulness / safety / common sense | Slow / expensive / final quality gate |
| **Trajectory** | Agent 從輸入到輸出的完整旅程：tool call 序列 + 參數、中間步驟與推理、最終回應 | Tier 2 的核心評估對象 |
| **tool_trajectory_average_score** | ADK built-in metric：實際 tool call 跟預期序列的吻合度（0-1）| 設 0.8 嚴格 / 0.5 寬鬆 |
| **response_match_score** | ADK built-in metric：最終答案跟預期答案的相似度（底層用 ROUGE，0-1）| 設 0.5 允許自然語言變化 |
| **Book finder agent** | ADK 範例 agent：Gemini 2.5 Pro + search local library + find local bookstore + order online | 展示 trajectory 評估 |
| **ADK eval** | ADK 提供的評估工具，支援 multi-step task 和 expected tool sequence | 搭配 tool_trajectory_average_score 和 response_match_score |
| **Non-deterministic** | Agent 每次執行可能走不同路徑的特性 | 設 threshold 要避免 1.0（除非 temperature≈0）|

---

## 人物 / 角色分析

### Google Cloud Tech（講者 Annie）
- **背景**：Google 官方 AI/ML YouTube 頻道 ADK 系列主講人（從逐字稿口氣推斷，可能是 Developer Advocate）
- **關鍵角色**：本影片（Agent Evaluation 系列 Ep.2 完結篇）講者，把 Ep.1 的理論轉化為 ADK 實作
- **代表觀點**：三層測試金字塔 + ADK built-in tools = 從「我覺得」到「我知道」的可重複自動化檢查

---

## 核心主旨

> **Agent 評估的實作路徑是三層測試金字塔：Tier 1 component unit test 測 tool 選擇跟參數格式（fast/cheap/automated）、Tier 2 trajectory integration test 測完整多步任務的計畫、工具使用、調適、記憶、目標達成（ADK eval + tool_trajectory_average_score + response_match_score）、Tier 3 end-to-end human review 測整體體驗（slow/expensive 但 final quality gate）；三層互補形成從「我覺得這個 agent 可以用」升級到「我知道這個 agent 可靠」的完整路徑，把 agent evaluation 從理論變成可重複執行的自動化檢查。**

---

## 金句摘錄

1. > "So for the first tier, tier one, it covers component level unit tests, which is also the foundation of agent testing."
   > —— Tier 1 component unit test 的定位

2. > "And the trajectory is the entire journey your agent takes to solve a task."
   > —— Trajectory 的核心定義

3. > "Note that agents are non-deterministic, so we should avoid demanding one unless you use temperature approximate to zero."
   > —— response_match_score threshold 設計原則

4. > "With this three tier approach and ADK built-in tools, you can go from, I think this agent works to I know this agent is very reliable."
   > —— 三層測試的核心價值

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
  - #7 AI agent design patterns (2026-02-27)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 2 分 42 秒
> 口播稿原文：transcripts/20251212_GoogleCloudTech_HowToEvaluateAgentsInPractice_口播稿.txt

- [opus 0.6 MB](../audio/20251212_GoogleCloudTech_HowToEvaluateAgentsInPractice_口播稿.opus)（Telegram 友善）
- [m4a 2.0 MB](../audio/20251212_GoogleCloudTech_HowToEvaluateAgentsInPractice_口播稿.m4a)（iOS 友善）
- [mp3 2.5 MB](../audio/20251212_GoogleCloudTech_HowToEvaluateAgentsInPractice_口播稿.mp3）（通用格式）
