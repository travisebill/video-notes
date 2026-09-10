# 【How to add persistent memory to your AI agent】

**講者｜Google Cloud Tech（Google 官方 AI/ML YouTube 頻道，ADK 系列主講人 Annie）**
**影片連結｜https://www.youtube.com/watch?v=HDqzJJhZsxw**
**影片長度**｜7:24（444s）
**發布日期｜2026-04-08**
**Course｜Google ADK 完整教學**
**Module｜D Agent Memory (Ep.2)**
**類型｜教學影片（Agent Memory 系列 Ep.2）**
**主題｜Google Agent Development Kit (ADK) — AI agent persistent memory：Database session service + User profile store**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Google Cloud Tech 推出 Agent Memory 系列教學影片，這是系列第二集。影片用 7 分多鐘從「把 chat 變 persistent」到「加 user profile store」完整說明 persistent memory 的兩個核心機制。

影片的核心架構分為兩大部分。第一部分解決「同一個對話跨重啟」的問題：把 in-memory session service 切換成 database session service，每則 user message、agent reply、state change 都存到磁碟，app restart 後用同一個 session ID 就能回復對話歷史。第二部分解決「跨對話跨日期的個人化」問題：加一個 user profile store，存 user ID 對應的 preference key，agent 透過 Recall User Preference 和 Save User Preference 兩個 tools 存取。

整支影片的關鍵洞察：persistent sessions 跟 user profile store 互補——前者延續同一個對話，後者跨對話個人化；ADK 提供三種 session service（in-memory / database / Vertex AI）可插拔切換，不用改 agent logic；user profile store 透過 user ID 跟 tools 對應，寫入要 context.state 讓 ADK 記錄到 event log。

---

## 章節脈絡

| 段落 | 時間 | 標題 | 一句話摘要 |
|------|------|------|----------|
| Section 1 | 00:00 - 04:00 | Persistent session service | 切換到 database session，app restart 對話不丟 |
| Section 2 | 04:00 - 07:06 | User profile store | 跨對話個人化：Recall + Save 兩個 tools |

> 時間軸是根據 1023-word 逐字稿內容比例估算。

---

## 關鍵概念定義

| 概念 | 定義 | 角色 / 應用 |
|------|------|------------|
| **Database session service** | 把每則 message、reply、state change 存到磁碟的 session service | 解決 in-memory 重啟丟失問題 |
| **User profile store** | 一個 user ID 對應多個 preference key 的結構化小資料表 | 跨對話跨日期個人化 |
| **In-memory session service** | 預設的 session storage，存 RAM | 快速但 app restart 就清空 |
| **Vertex AI session service** | Google Cloud 管理的 session service | 下一集 memory bank 會 deep dive |
| **get_or_create_session** | ADK helper function：先 get 找不到就 create | 不用改 agent logic 切換 storage |
| **User ID** | 識別用戶的 ID，context 提供給 tools | 確保讀寫都對應到正確的人 |
| **Preference key** | 結構化小資料表的欄位名（如 dietary、transport mode）| 重要事實的結構化儲存 |
| **Recall User Preference** | 讀所有存過偏好的 tool | Agent 開始對話時先 recall |
| **Save User Preference** | 插入新 key 或更新現有 key 的 tool | Agent 學到新事實時存 |
| **Long-term personalization** | 跨對話跨日期個人化 | persistent session 解決不了的問題 |
| **Restart-safe chat** | app restart 後用同一個 session ID 回復對話 | database session service 提供的特性 |

---

## 人物 / 角色分析

### Google Cloud Tech（講者 Annie）
- **背景**：Google 官方 AI/ML YouTube 頻道 ADK 系列主講人（從逐字稿口氣推斷，可能是 Developer Advocate）
- **關鍵角色**：本影片（Agent Memory 系列 Ep.2）講者，從短語記憶延伸到 persistent memory
- **代表觀點**：persistent sessions 跟 user profile store 互補，分別解決「同一對話跨重啟」跟「跨對話個人化」問題

---

## 核心主旨

> **要讓 AI agent 不只 session 內記得還要跨 session 個人化，需要兩個互補機制：Database session service 把每則 message、reply、state change 存到磁碟，app restart 後用同一個 session ID 回復完整對話歷史（解決同一對話跨重啟問題），ADK 提供三種 session service（in-memory / database / Vertex AI）可插拔切換不用改 agent logic；User profile store 用結構化小資料表（一個 user ID 對應多個 preference key 如 dietary、transport mode）存重要事實，agent 透過 Recall User Preference 讀 + Save User Preference 寫兩個 tools 存取，兩個 tools 都從 context 拿到當前 user ID 確保讀寫對應到正確的人；Agent 指令四步（先 recall 然後 personalize 跟 plan、present 跟 learn、save last）讓 user profile store 順暢整合進對話流程。**

---

## 金句摘錄

1. > "From now on, every user message, every agent reply, and every state change is saved to disk."
   > —— Database session service 的核心特性

2. > "The session service is pluggable. And your agent logic can stay the same."
   > —— Session service 插拔設計

3. > "Persistent sessions helps you resume the same conversation. But when the user opens a new chat with a new session ID, next week, there is no transcript to read."
   > —— Persistent session 的限制

4. > "And this proves two behaviors. Persistent sessions let us continue an existing chat after a restart. The user profile stores let us personalize a brand new chat for the same person."
   > —— 兩種機制互補

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
  - #8 3 Advanced AI agent design patterns (2026-03-17)
  - #9 How to add short-term memory to your AI agent (2026-03-26)
  - #11 AI agent long-term memory with memory bank (2026-04-16)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 2 分 21 秒
> 口播稿原文：transcripts/20260408_GoogleCloudTech_HowToAddPersistentMemory_口播稿.txt

- [opus 0.6 MB](../audio/20260408_GoogleCloudTech_HowToAddPersistentMemory_口播稿.opus)（Telegram 友善）
- [m4a 1.7 MB](../audio/20260408_GoogleCloudTech_HowToAddPersistentMemory_口播稿.m4a)（iOS 友善）
- [mp3 2.2 MB](../audio/20260408_GoogleCloudTech_HowToAddPersistentMemory_口播稿.mp3）（通用格式）
