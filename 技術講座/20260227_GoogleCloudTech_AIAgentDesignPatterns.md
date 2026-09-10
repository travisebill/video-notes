# 【AI agent design patterns】

**講者｜Google Cloud Tech（Google 官方 AI/ML YouTube 頻道，ADK 系列主講人 Annie）**
**影片連結｜https://www.youtube.com/watch?v=GDm_uH6VxPY**
**影片長度**｜8:21（501s）
**發布日期｜2026-02-27**
**類型｜教學影片（Agents Pattern 系列 Ep.1）**
**主題｜Google Agent Development Kit (ADK) — AI agent design patterns：Single agent / Sequential agent / Parallel agent**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Google Cloud Tech 推出 Agents Pattern 系列教學影片，這是系列第一集。影片用 8 分多鐘從「最基礎的 single agent」到「多 agent 的 sequential 與 parallel pattern」完整展示三個基本 design pattern。

影片的核心架構分為三大部分。第一部分介紹 single agent：最基礎的 pattern，用一個 agent 加一組 tools 處理任務，好處是簡單靈活，壞處是對複雜 workflow 控制力不夠。第二部分介紹 sequential agent：多 agent pattern 之一，適合高度結構化可重複的任務，運作方式像組裝線，subagent 之間透過 shared session state 溝通。第三部分介紹 parallel agent：當任務不需要按順序時就能用，多個專門 agent 同時跑，大幅降低 latency。

整支影片的關鍵洞察：選對 design pattern 取決於任務特性——straightforward multi-step 用 single agent、fixed order 結構化任務用 sequential agent、independent tasks 用 parallel agent；三個 pattern 組合就能建構強大 workflow，下一集會介紹更進階的 pattern。

---

## 章節脈絡

| 段落 | 時間 | 標題 | 一句話摘要 |
|------|------|------|----------|
| Section 1 | 00:00 - 03:00 | Single agent pattern | 最基礎的 pattern：簡單靈活但複雜任務控制力不夠 |
| Section 2 | 03:00 - 05:30 | Sequential agent pattern | 組裝線式多 agent：subagent A output → B input，shared session state 溝通 |
| Section 3 | 05:30 - 08:21 | Parallel agent pattern | 多 agent 同時跑：降低 latency 但需 gather/synthesize 整合 |

> 時間軸是根據 1265-word 逐字稿內容比例估算。

---

## 關鍵概念定義

| 概念 | 定義 | 角色 / 應用 |
|------|------|------------|
| **Single agent** | 一個 agent + 一組 tools 處理任務 | 最基礎 pattern，簡單靈活但複雜 workflow 控制力不夠 |
| **Sequential agent** | 多 agent pattern 之一，像組裝線，subagent A output → B input | 適合高度結構化可重複的任務 |
| **Parallel agent** | 多 agent pattern 之一，多個專門 agent 同時跑 | 適合 independent tasks，大幅降低 latency |
| **Shared session state** | Sequential agent 的溝通機制，subagent 之間共享的「白板」/短期記憶 | 前一個 agent 寫結果，下一個 agent 讀 |
| **Subagent handoff** | 組裝線式的任務傳遞：output 直接成為 next subagent 的 input | Sequential agent 的核心機制 |
| **Assembly line pattern** | Sequential agent 的運作比喻：固定順序、可預測、每步有專門 agent | 高控制 + 高可靠但缺靈活 |
| **Aggregator agent** | 平行搜尋後的整合 agent：synthesize 多個 parallel agent 的結果 | 與 parallel agent 組合使用 |
| **Non-deterministic** | AI 每次執行可能走不同路徑的特性 | single agent 對複雜 workflow 不可靠的主因 |
| **Pattern pros/cons trade-off** | 選 pattern 的權衡：simple vs control, sequential vs flexible, parallel vs cost | 任務特性決定 pattern |

---

## 人物 / 角色分析

### Google Cloud Tech（講者 Annie）
- **背景**：Google 官方 AI/ML YouTube 頻道 ADK 系列主講人（從逐字稿口氣推斷，可能是 Developer Advocate）
- **關鍵角色**：本影片（Agents Pattern 系列 Ep.1）講者，開啟「AI agent design patterns」新主題
- **代表觀點**：選對 pattern 取決於任務特性；三個基本 pattern 可組合建構強大 workflow

---

## 核心主旨

> **AI agent design patterns 有三個基本選擇：Single agent（最簡單靈活但對複雜 workflow 控制力不夠，因為 AI non-deterministic 不能保證每次完美遵循多步邏輯）、Sequential agent（多 agent 組裝線 pattern，subagent A output 直接成為 B input，透過 shared session state 溝通，高度控制可靠但剛性結構難以調適動態情境）、Parallel agent（多 agent 同時跑大幅降低 latency，但需 gather/synthesize 步驟整合結果且初始成本較高）；選對 pattern 取決於任務特性——straightforward multi-step 用 single agent、fixed order 結構化任務用 sequential agent、independent tasks 用 parallel agent；三個 pattern 組合就能建構強大 workflow。**

---

## 金句摘錄

1. > "With single agent pattern, the benefit is it is very simple to implement and is great for straightforward multi-step tasks. However, it is less reliable for complex workflow."
   > —— Single agent 的優缺點

2. > "So the output of one subagent becomes the direct input for the next subagent. It's like an assembly line."
   > —— Sequential agent 的組裝線比喻

3. > "They share information through this shared session state, which acts like a shared scratchpad."
   > —— Shared session state 的白板比喻

4. > "This allows multiple specialized agents to run independently at the same time. We can have three agents... all searching concurrently."
   > —— Parallel agent 的並行特性

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
  - #8 3 Advanced AI agent design patterns (2026-03-17)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 2 分 39 秒
> 口播稿原文：transcripts/20260227_GoogleCloudTech_AIAgentDesignPatterns_口播稿.txt

- [opus 0.6 MB](../audio/20260227_GoogleCloudTech_AIAgentDesignPatterns_口播稿.opus)（Telegram 友善）
- [m4a 1.9 MB](../audio/20260227_GoogleCloudTech_AIAgentDesignPatterns_口播稿.m4a)（iOS 友善）
- [mp3 2.4 MB](../audio/20260227_GoogleCloudTech_AIAgentDesignPatterns_口播稿.mp3）（通用格式）
