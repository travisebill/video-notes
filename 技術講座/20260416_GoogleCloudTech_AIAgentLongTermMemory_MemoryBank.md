# 【AI agent long-term memory with memory bank】

**講者｜Google Cloud Tech（Google 官方 AI/ML YouTube 頻道，ADK 系列主講人 Annie）**
**影片連結｜https://www.youtube.com/watch?v=KZPo15M2DbM**
**影片長度**｜6:43（403s）
**發布日期｜2026-04-16**
**Module｜D Agent Memory (Ep.3)**
**類型｜教學影片（Agent Memory 系列 Ep.3 完結篇）**
**主題｜Google Agent Development Kit (ADK) — AI agent long-term memory：Memory bank + Vertex AI memory bank service + preload memory tool + multi-modal recall**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Google Cloud Tech 推出 Agent Memory 系列教學影片，這是系列第三集也是完結篇。影片用 6 分多鐘從「Session service vs Memory service 差異」到「Memory bank 設定」到「preload memory tool 自動撈回」完整說明 long-term memory 的全貌。

影片的核心架構分為三大部分。第一部分釐清概念：session service 管 active chat 跟即時對話，memory service 管 long-term archive 像檔案櫃；ADK 提供 in-memory（簡單本機測試）跟 Vertex AI memory bank（production 雲端 semantic search）兩種 memory service 選項。第二部分說明設定：用 agent engine 設定 memory bank，選兩個 model（事實抽取 + embedding）跟 topics（user preference、travel experience）；memory bank 支援 add session to memory（archive 整個對話）跟 preload from file（直接上傳媒體）兩種存入方式。第三部分說明檢索：preload memory tool 在每個 turn 開始時自動跑，語意搜尋 memory bank 注入相關事實到 prompt。

整支影片的關鍵洞察：Long-term memory 的本質是 long-term archive + semantic search，能跨多對話、跨多模態（text/image/audio/video）存取事實；preload memory tool 把 retrieval 自動化，agent 不需要特殊邏輯就能 enriched context；三層 memory 架構（session + state / persistent + profile / memory bank）組合起來就能建構跨天跨週一致且 context-aware 的個人化 agent。

---

## 章節脈絡

| 段落 | 時間 | 標題 | 一句話摘要 |
|------|------|------|----------|
| Section 1 | 00:00 - 02:00 | Session vs Memory service 差異 | 兩個 service 角色：active chat vs long-term archive |
| Section 2 | 02:00 - 04:00 | Memory bank 設定 | Agent engine + 兩個 model + topics |
| Section 3 | 04:00 - 06:43 | 存入 + 檢索 demo | add_session_to_memory + preload_memory_tool |

> 時間軸是根據 911-word 逐字稿內容比例估算。

---

## 關鍵概念定義

| 概念 | 定義 | 角色 / 應用 |
|------|------|------------|
| **Memory service** | 管 long-term archive 的 service（像檔案櫃）| 跟 session service 分工合作 |
| **Session service** | 管 active chat 跟即時對話的 service | 即時 context |
| **In-memory memory service** | 簡單的 memory service，本機測試用 | 不跨重啟、basic keyword search |
| **Vertex AI memory bank service** | Production 等級的 memory service，存雲端 | 支援 semantic search、safe storage |
| **Memory bank** | 用 Agent Engine 驅動的 long-term archive 服務 | 不只是 table，是 process content、找事實、做語意搜尋的 service |
| **Agent Engine** | 驅動 memory bank 的服務 | 提供 embedding 生成 + Gemini fact extraction |
| **Fact extraction model** | 從對話跟媒體抽取 key facts 的 model | 例如 Gemini |
| **Embedding model** | 把 facts embed 起來做語意搜尋的 model | 例如 text-embedding-005 |
| **Topics** | 組織 memory bank 儲存內容的分類（user preference、travel experience）| 結構化檢索 |
| **Semantic search** | 用 embedding 找語意相似的事實 | 例如搜尋 two-wheeled vehicle 找到 bicycle |
| **add_session_to_memory** | 會話結束時 archive 整個對話到 memory bank | 包含 message、reply、media reference |
| **preload_from_file** | 直接上傳 image、video、audio 檔加文字 context | 不需要對話就能生成事實 |
| **preload_memory_tool** | 每個 turn 開始自動跑的 tool，語意搜尋 memory bank | 注入相關事實到 prompt，自動 enriched context |
| **Multi-modal recall** | 同時從 text + image + audio + video 抽取事實並檢索 | 跨模態的 long-term memory |
| **Three-layer memory** | session+state / persistent+profile / memory bank | 從 working memory 到 long-term archive 完整覆蓋 |

---

## 人物 / 角色分析

### Google Cloud Tech（講者 Annie）
- **背景**：Google 官方 AI/ML YouTube 頻道 ADK 系列主講人（從逐字稿口氣推斷，可能是 Developer Advocate）
- **關鍵角色**：本影片（Agent Memory 系列 Ep.3 完結篇）講者，把 memory 系列收尾
- **代表觀點**：三層 memory 架構（session+state / persistent+profile / memory bank）組合建構跨天跨週一致且 context-aware 的個人化 agent

---

## 核心主旨

> **AI agent long-term memory 用 Memory bank 實現：Session service 管 active chat、Memory service 管 long-term archive 兩者分工，ADK 提供 in-memory（本機測試）和 Vertex AI memory bank（production 雲端 semantic search）兩種 Memory service 選項；Memory bank 用 Agent Engine 驅動，選兩個 model（fact extraction + embedding）和 topics（user preference、travel experience）做結構化組織，支援兩種存入方式（add session to memory archive 整個對話或 preload from file 直接上傳媒體），preload memory tool 在每個 turn 開始時自動語意搜尋並注入相關事實到 prompt，agent 不需特殊邏輯就能自動 enriched context；Demo 展示 long-term multi-modal recall（用戶分享歷史建築照片/海邊影片/城鎮音檔 → memory bank 抽取事實 → 重啟 → 新對話 preload tool 撈回 → agent 推薦符合的歷史建築景點），三層 memory 架構組合就能建構跨天跨週一致且 context-aware 的個人化 agent。**

---

## 金句摘錄

1. > "The first is session service that manage active chats and let you resume a live conversation. And second is memory service that manage a long-term archive. It is the filing cabinet."
   > —— Session vs Memory service 的角色定義

2. > "It is important to remember that this is not just a table. It is a service that process content, finds useful facts, and makes them searchable."
   > —— Memory bank 的本質（不只是 table）

3. > "The tool enriches the context automatically. And the agent doesn't need special logic."
   > —— preload memory tool 的自動化設計

4. > "With these episodes, now you can build your personalized agent that is consistent, context-aware over days and weeks."
   > —— 三層 memory 架構的價值

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
  - #10 How to add persistent memory to your AI agent (2026-04-08)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 2 分 35 秒
> 口播稿原文：transcripts/20260416_GoogleCloudTech_AIAgentLongTermMemory_MemoryBank_口播稿.txt

- [opus 0.6 MB](../audio/20260416_GoogleCloudTech_AIAgentLongTermMemory_MemoryBank_口播稿.opus)（Telegram 友善）
- [m4a 1.9 MB](../audio/20260416_GoogleCloudTech_AIAgentLongTermMemory_MemoryBank_口播稿.m4a)（iOS 友善）
- [mp3 2.4 MB](../audio/20260416_GoogleCloudTech_AIAgentLongTermMemory_MemoryBank_口播稿.mp3）（通用格式）
