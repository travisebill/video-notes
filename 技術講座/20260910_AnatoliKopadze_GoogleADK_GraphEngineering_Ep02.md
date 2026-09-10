# 【Google ADK Graph Engineering Ep.02：Workflow Agents × Communication × GraphRank Lab】

**講者｜Annie（Google Developer Relations Engineer；前 software engineer 七年建構 production system，現專注於協助開發者建構 AI agent）**
**影片連結｜https://x.com/AnatoliKopadze/status/2097380989538591155**
**影片長度**｜60:22（3622s，1 小時 workshop 教學）
**發布日期｜2026-09-10**
**類型｜Workshop 教學（理論段 10 min + Hands-on Lab 50 min）**
**主題｜Google Agent Development Kit (ADK) Ep.02 — Graph Engineering 概念定義 + ADK × Spanner × GraphRAG 實作**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Anatoli Kopadze 在 X.com 推薦 Google 釋出的這支一小時 Graph Engineering 教學影片，由 Google Developer Relations 工程師 Annie 主講，內容分為兩段：前段用十分鐘釐清 Graph Engineering、Workflow Agents、Agent Communication 三層概念；後段用五十分鐘走完一個完整 Lab，展示如何用 Google Agent Development Kit（ADK）、Spanner、memory bank 蓋出一個具備 semantic / hybrid / keyword search 能力的 GraphRAG AI Agent。

理論段的核心張力在於把 Graph Engineering 從抽象術語落地成可操作的 pattern 對比——graph vs loop、graph vs agent swarm、sequential vs parallel vs loop agent、sub-agent vs agent-as-tool。實作段則用一個外行星求生者網絡（survivor / skill / need / match）的 graph dataset，把前述概念接到 Google Spanner（用 ML predict 把 embedding model 跟 Gemini Pro 直接放進 SQL）、Service Layer（query 邏輯）、Tool Layer（semantic_search tool）、Agent Layer（root agent），最後接上 FastAPI + React frontend 做出可互動的 3D 圖譜介面。

整支影片的關鍵洞察：把 embedding model 跟 LLM 直接掛進 Spanner 而不是放在 service layer，可省下「拉資料 → 外部模型推理 → 寫回」的 round-trip；GraphRAG 與傳統 RAG 的差別在於「embedding 相似度 + graph traversal」雙管齊下，能從 skill embedding 找到 medical training 之外，再沿 graph edge 找到 Dr. Frost 這位具備該技能的人。

---

## 章節脈絡

| 段落 | 大約時間 | 標題 | 一句話摘要 |
|------|---------|------|----------|
| Section A | 00:00 - 03:30 | 概念釐清：Harness / Loop / Graph | 把 Graph Engineering 拆成 model 周邊的 harness、agent 內部循環的 loop、organizational chart 形式的 graph |
| Section B | 03:30 - 09:00 | 實戰範例：PR Review Workflow | 用 fan-out → join → router 三段式 workflow 自動化 PR 審查，展示 graph engineering 的具體好處 |
| Section C | 09:00 - 15:00 | Graph vs Loop vs Knowledge Graph vs Agent Swarm | 釐清四個相似術語：graph 看行為、knowledge graph 看資料、loop 改進窄而深、agent swarm 處理模糊問題 |
| Section D | 15:00 - 20:00 | 三種 Workflow Agents | ADK 提供 sequential / parallel / loop 三種 workflow agent 控制 agent 之間的執行順序 |
| Section E | 20:00 - 28:00 | 三種 Communication Mechanisms | ADK 提供 shared session state / LLM-driven delegation / explicit invocation（agent as a tool）三種 agent 通訊機制 |
| Section F | 28:00 - 30:00 | Lab 介紹：GraphRank AI Agent | 切到實作，介紹最終目標：3D graph 渲染 + 搜尋的 AI agent |
| Section G | 30:00 - 37:00 | 環境設定與資料載入 | $5 credit + Cloud Shell editor + clone repo + 啟用 Spanner / Cloud Build / Storage API + 載入 survival 資料 |
| Section H | 37:00 - 45:00 | Spanner Studio 視覺化 Graph | 在 Spanner Studio 用 SQL 查 survivor、skill、need、match 關係並用圖形介面瀏覽 |
| Section I | 45:00 - 53:00 | Spanner 內建 Embedding 與 LLM | 用 ML predict 把 text-embedding model 跟 Gemini Pro 註冊到 Spanner，省去外部 API round-trip |
| Section J | 53:00 - 60:00 | Semantic Search 與 GraphRAG 實作 | 把 skill 轉成 embedding 跑 cosine 相似度搜尋，再沿 graph edge 抓出技能擁有者 |
| Section K | 60:00 - 75:00 | Hybrid Search + RRF Algorithm | 結合 keyword 跟 semantic 兩種搜尋結果，用 RRF（Reciprocal Rank Fusion）演算法做分數融合 |
| Section L | 75:00 - 82:00 | Service → Tool → Agent Layer | 從 SQL 邏輯 → ADK tool → root agent 三層架構組裝 |
| Section M | 82:00 - 87:00 | ADK Web 測試與除錯 | 用 adk web 開 UI 測試 agent，從 trace 觀察 tool 執行順序與 LLM latency |
| Section N | 87:00 - 95:00 | 完整應用：Runner + Session/Memory + Frontend | FastAPI chat.py 接 React frontend，runner 推動 agent event loop，in-memory session service 存對話歷史 |
| Section O | 95:00 - 100:00 | 完整流程展示與結論 | 3D 圖譜互動、查詢「skills similar to healing」回傳 Alina Frost 等技能擁有者 |

> 時間軸是根據 9795-word 逐字稿內容比例估算，非官方 timecode。原 X.com 推文附的官方 timecodes 為「00:00 / 09:16 / 21:15 / 41:03 / ...」對應到前段章節，但後段 lab 沒有官方 timecode。

---

## 關鍵概念定義

| 概念 | 定義 | 角色 / 應用 |
|------|------|------------|
| **Graph Engineering** | 把 AI agent 工作流設計成有向圖（node + edge）而非線性迴圈；強調行為（what goes in, what order, what next） | 適合流程明確、可拆解、可並行的任務 |
| **Harness（馬具）** | 包圍 model 的所有外部環境：tools、memory、guardrails | 負責「model 之外的整個運行空間」 |
| **Loop（迴圈）** | Agent 內部的循環：reasoning → 決策 → 選 tool → 直到達標 | 負責「單一 agent 的思考迭代」 |
| **Graph（圖）** | 多個 agent / function node 組成的 organizational chart | 負責「多 agent 之間的協作拓樸」 |
| **Workflow Agent** | ADK 提供的 flow 控制 node，分 sequential / parallel / loop 三種 | 控制 agent 執行順序 |
| **Sequential Agent** | 像組裝線，sub-agent 依固定順序執行、傳遞結果 | 適合資料 → 清洗 → 分析 → 摘要 |
| **Parallel Agent** | 像 manager 同時派工給三個員工，適合獨立任務 | 適合多 API 並行呼叫 |
| **Loop Agent** | 反覆執行直到條件滿足或達 max iteration | 適合 debug、迭代改進 |
| **Shared Session State** | 像共享白板，agent 寫結果、下一個 agent 讀取 | ADK 通訊機制一：透過 state 傳遞 |
| **LLM-driven Delegation** | Coordinator agent 像 CEO 看完需求決定派給哪個 sub-agent | ADK 通訊機制二：靠 LLM 判斷 |
| **Agent as a Tool** | 把 sub-agent 包成 function-style tool，由 parent agent 決定何時叫用 | ADK 通訊機制三：明確呼叫介面 |
| **Sub-agent vs Agent-as-Tool** | Sub-agent 是 hierarchy 的一部分、永遠被 parent 管；Agent-as-Tool 像外部顧問、用才叫 | ADK 重點：兩者用途不同 |
| **ML Predict (Spanner)** | Spanner 內建的 SQL function，可直接呼叫 Vertex AI 的 embedding / Gemini 模型 | 省去「拉資料 → 外部 API → 寫回」的 round-trip |
| **Virtual Model** | ML predict 註冊的「虛擬模型」，只是 reference，不存 model weights | Spanner 用來整合外部 AI 服務的設計 |
| **Text Embedding (768 dim)** | 把 skill / need 文字轉成 768 維向量表示 | 用 cosine 距離量語意相似度 |
| **Semantic Search** | 透過 embedding cosine 距離找語意相似的項目 | 不靠精確關鍵字，能找「magic → medical training」 |
| **Keyword Search** | 精確字串比對 | 找得到「mountain」但找不到「山」 |
| **Hybrid Search + RRF** | Reciprocal Rank Fusion 演算法把 keyword + semantic 兩種排名融合 | 兼顧精確與語意，最終排名 |
| **GraphRAG vs RAG** | RAG 只做語意搜尋；GraphRAG 加上 graph traversal，可沿 edge 抓 context | 「找相似技能 + 找擁有該技能的人」一站完成 |
| **Runner (ADK)** | 推動 agent event loop 的引擎，把 model 決策、tool 呼叫串成 event stream | 串接 frontend 與 backend 的核心 |
| **Session Service (ADK)** | 儲存對話歷史，分 in-memory / Vertex AI / database 三種 | 影響「重新整理會不會掉對話」 |
| **Memory Service (ADK)** | 與 session service 並行，存跨 session 的長期記憶 | 個人化體驗的關鍵（lab 用簡化版） |
| **Spanner Graph Database** | Google Cloud 的分散式關聯 + graph 統一資料庫 | 不需要 Postgres + Neo4j 雙資料源 |
| **Survival Network Challenge** | Lab 用的假想情境：倖存者散落在行星、技能、需要、配對關係 | GraphRAG 的 demo dataset |

---

## 人物 / 角色分析

### Annie（Google Developer Relations Engineer）
- **背景**：前 software engineer 7 年建構 production system，現專注於幫助開發者建構 AI agent
- **關鍵角色**：本影片唯一講者，從理論段一路演示到 lab 完整 build
- **代表觀點**：Agent 是「model 當腦、選 tools、解決使用者問題」的系統；GraphRAG = embedding 相似度 + graph traversal 雙引擎

### Anatoli Kopadze（推薦者）
- **背景**：X.com 上推薦本影片的科技 KOL，本身是 Graph Engineering 概念的早期倡導者（前次 video-notes 已收錄 20260817 版的純文字長文）
- **角色**：作為本影片的發現者與推薦者（不是講者）

### Tilder（虛構對話角色）
- **背景**：Annie 在理論段用來當「學生提問者」的虛構對象
- **用途**：用「你做過 PR review 嗎？」「自動化 PR review 怎麼做？」等具體問題帶出 workflow 範例

---

## 核心主旨

> **Graph Engineering 是把 AI agent 工作流從「線性 loop」升級為「可並行、可組合、可視覺化」的有向圖；Google ADK 用三種 workflow agent（sequential / parallel / loop）+ 三種 communication mechanism（shared state / LLM delegation / agent-as-tool）讓這件事可落地；實作上透過 Spanner 的 ML predict 把 embedding model 跟 LLM 內建進 SQL，省去 round-trip；GraphRAG 把語意搜尋跟 graph traversal 結合，是下一個 Retrieval-Augmented Generation 的標準形狀。**

---

## 金句摘錄

1. > "Graph engineering emphasizing on the behavior, basically what goes in, what order, and then what happens next."
   > —— Annie 區分 graph engineering 與 knowledge graph 的關鍵差異

2. > "If you already know the workflow ahead of time, like the PR review example, we can use graph workflow."
   > —— Graph vs Agent Swarm 的選擇原則

3. > "A sub-agent is part of an organizational chart and it's always managed by its parent agent. An agent as a tool is like bringing a consultant. You call them when you need it."
   > —— Sub-agent vs Agent-as-Tool 的精準比喻

4. > "We are using ML predict to directly use the Gemini model. Spanner's ML predict let you to generate the embedding directly in SQL. It's not creating the real model in Spanner. It's creating the virtual model."
   > —— Spanner 內建 AI 的設計哲學

5. > "We are searching the embedding space, and you're trying to find how close they are with the cosine. The smaller the distance, that means they're similar."
   > —— Semantic search 的數學基礎

6. > "The importance of GraphRAG, the difference between GraphRAG versus traditional RAG, is we actually do LLM context in the graph context so that you can traverse this graph to understand more information."
   > —— GraphRAG vs RAG 的核心差別

7. > "Runner basically it powers up agent. So for agent, we have model as a brain to choose the tools... each time when model is making a decision, they're all different events. And for those events to continue, we need an engine to power them up to have this event loop."
   > —— Runner 在 ADK 架構中的角色

---

## 延伸閱讀 / 參考

- **Google Agent Development Kit (ADK) 官方文件** — https://google.github.io/adk-docs/
- **Spanner ML Predict 文件** — Spanner 內建 AI 服務的 SQL function
- **Reciprocal Rank Fusion (RRF) 演算法** — Hybrid search 排名融合
- **Anatoli Kopadze 先前文章**（已收錄於本 repo）— `技術講座/20260817_AnatoliKopadze_GraphEngineering.md`
- **Best Partners TV Graph/Loop Engineering 教學**（已收錄）— `技術講座/20260802_BestPartnersTV_GraphAndLoopEngineering.md`
- **Stanford CS329A Self-Improving AI Agents 課程**（已收錄）— `技術講座/20260803_StanfordCS329A_*.md`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 3 分 53 秒
> 口播稿原文：transcripts/20260910_AnatoliKopadze_GoogleADK_GraphEngineering_Ep02_口播稿.txt

- [opus 0.9 MB](../audio/20260910_AnatoliKopadze_GoogleADK_GraphEngineering_Ep02_口播稿.opus)（Telegram 友善）
- [m4a 2.8 MB](../audio/20260910_AnatoliKopadze_GoogleADK_GraphEngineering_Ep02_口播稿.m4a)（iOS 友善）
- [mp3 3.6 MB](../audio/20260910_AnatoliKopadze_GoogleADK_GraphEngineering_Ep02_口播稿.mp3)（通用格式）
