# 【How to add short-term memory to your AI agent (Sessions & State Explained)】

**講者｜Google Cloud Tech（Google 官方 AI/ML YouTube 頻道，ADK 系列主講人 Annie）**
**影片連結｜https://www.youtube.com/watch?v=vfVcDUCucSs**
**影片長度**｜6:03（363s）
**發布日期｜2026-03-26**
**Module｜D Agent Memory (Ep.1)**
**類型｜教學影片（Agent Memory 系列 Ep.1）**
**主題｜Google Agent Development Kit (ADK) — AI agent short-term memory：Session + Event + State**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Google Cloud Tech 推出 Agent Memory 系列教學影片，這是系列第一集。影片用 6 分多鐘從「Session 是什麼」到「Event 和 State 兩個關鍵元件」到「Agent 之間怎麼透過 session state 溝通」完整說明 short-term memory。

影片的核心架構分為三大部分。第一部分說明 Session 概念：一次連續對話像手機上一個 chat thread，ADK Web UI 預設用 in-memory session service，問題是如果每次 turn 都開新 session agent 會完全忘記之前對話。第二部分說明 Session 裡的兩個關鍵元件：event（像逐字稿記錄每則 user message 和 agent reply）和 state（像結構化小便利貼存快速存取的值）。第三部分說明 Agent 之間怎麼透過 session state 溝通，以及使用 state 的重要原則（不要直接修改 session object，要用 ADK 給的 context）。

整支影片的關鍵洞察：Short-term memory 的核心是 Session 機制，透過 event 保留完整對話歷史、透過 state 提供快速存取的結構化資料；Agent 之間能透過 state 自動傳遞變數不需 scrape 整個 transcript；寫 state 要用 context 而不是直接改 session object，這樣 ADK 才能把變更記錄到 event，未來才能 sync 到 database 和 long-term memory。

---

## 章節脈絡

| 段落 | 時間 | 標題 | 一句話摘要 |
|------|------|------|----------|
| Section 1 | 00:00 - 02:00 | Session 概念 | 一次連續對話、in-memory service、新 session 會失憶 |
| Section 2 | 02:00 - 04:00 | Event 與 State | Event = 逐字稿、State = 結構化便利貼 |
| Section 3 | 04:00 - 05:48 | Agent 透過 state 溝通 + 寫 state 原則 | 跨 agent 傳變數、context.state 用法 |

> 時間軸是根據 883-word 逐字稿內容比例估算。

---

## 關鍵概念定義

| 概念 | 定義 | 角色 / 應用 |
|------|------|------------|
| **Session** | 一次連續對話，像手機上一個 chat thread | ADK short-term memory 的基礎單位 |
| **In-memory session service** | ADK Web UI 預設的 session storage（記憶體）| 重啟 app 後 session 消失 |
| **Event** | 像逐字稿記錄每則 user message 和 agent reply | 提供 agent context 讀早期訊息 |
| **State** | 像結構化小便利貼存快速存取的值（如餐廳名字、確認號碼）| 避免 model 重讀 15 則訊息找一個值 |
| **Short-term memory** | Session 層級的記憶，跨多個 turn 但不持久化 | 快速但暫時 |
| **Context (ADK)** | ADK 給 tool code 的介面，用 context.state 寫入 state | 確保 ADK 記錄變更到 event |
| **Session state handoff** | Agent A 把結果 map 到 key，Agent B 自動收到該變數 | 多 agent 協作不需 scrape 整個 transcript |
| **Event log** | ADK 自動記錄所有 session 變更 | 是 persistent service 保存的基礎 |
| **Memory loss problem** | 每次開新 session agent 都像第一次見面 | 用同一個 session 跨多個 turn 解決 |
| **Persistence (next Ep)** | 把 session 存到 database 而非記憶體 | 跨 app restart 還記得 user |

---

## 人物 / 角色分析

### Google Cloud Tech（講者 Annie）
- **背景**：Google 官方 AI/ML YouTube 頻道 ADK 系列主講人（從逐字稿口氣推斷，可能是 Developer Advocate）
- **關鍵角色**：本影片（Agent Memory 系列 Ep.1）講者，開啟「AI agent memory」新主題
- **代表觀點**：Short-term memory 核心是 Session 機制，寫 state 要用 context 才能 sync 到未來 persistent service

---

## 核心主旨

> **AI agent short-term memory 的核心是 Session 機制：Session 是一次連續對話，ADK Web UI 預設用 in-memory service 每次開新 session agent 就失憶；解法是用同一個 session 跨多個 turn。Session 裡有兩個關鍵元件：event（像逐字稿記錄每則 message 提供 context）和 state（像結構化便利貼存快速存取的值，避免重讀整個 transcript）。Agent 之間透過 session state 自動傳遞變數（如 destination key），不用 scrape 整個對話歷史。重要原則是不要直接修改 session object，要用 ADK 給的 context 或 callback，寫到 context.state ADK 才會記錄變更到 event，未來才能 sync 到 database 和 long-term memory——short-term memory 快速但暫時，下一集會加 persistence 讓 agent 跨 app restart 還記得 user。**

---

## 金句摘錄

1. > "A session is one continuous conversation, like one chat thread on your phone."
   > —— Session 的基本定義

2. > "Because you don't want your model to re-read 15 messages just to find one value. Instead, you can store it once and reuse it."
   > —— State 存在的理由

3. > "You should never modify the session object directly in your tool code. So if you do that, the change will not be recorded in the event log and the persistent service won't save it later."
   > —— 寫 state 的重要原則

4. > "When you write to context.state, ADK records the change with the event. So it can be stored and recovered when we move to database and long-term memory."
   > —— context.state 的設計哲學

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
  - #10 How to add persistent memory to your AI agent (2026-04-08)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 1 分 57 秒
> 口播稿原文：transcripts/20260326_GoogleCloudTech_HowToAddShortTermMemory_口播稿.txt

- [opus 0.5 MB](../audio/20260326_GoogleCloudTech_HowToAddShortTermMemory_口播稿.opus)（Telegram 友善）
- [m4a 1.4 MB](../audio/20260326_GoogleCloudTech_HowToAddShortTermMemory_口播稿.m4a)（iOS 友善）
- [mp3 1.8 MB](../audio/20260326_GoogleCloudTech_HowToAddShortTermMemory_口播稿.mp3）（通用格式）
