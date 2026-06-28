# DAY 2 Livestream — 5-Days of AI Agents: Intensive Vibe Coding Course With Google

> **主題**：🛠️ 編碼工具 / Agent 工程實踐

**Smitha Ken + Anant Nawalgaria + Mike + Alan + Kanchana + Pierre + Fran（Google Cloud × Kaggle）｜2026-06-20**

> 影片連結：https://www.youtube.com/live/PGI_S59EoRA
> 影片時長：52:35（3155s）
> 語言：英文（YouTube 自動字幕 en-orig）
> 上傳者：Kaggle
> 來源：5-Day AI Agents Intensive Course Day 2 Livestream

## 一、主題與背景

本影片是 Kaggle 與 Google 共同舉辦的「5-Day AI Agents Intensive Course」第二天的直播內容。Day 1 建立 AI Agent 的個體基礎（建構、評估、部署）；Day 2 把視角拉到群體層次——探討 Agent 之間（A2A）、Agent 與工具（MCP）、Agent 與商業系統（UCP、AP2）、Agent 與使用者介面（A2UI）之間的 protocol 與互操作性。邀請 Mike（Agentic Data Cloud）、Alan（protocol 設計）、Kanchana（基礎設施）、Pierre（研究／產品）、Fran（code lab）共同參與。

## 二、章節脈絡

### Section 1｜開場與 Day 1 回顧（00:00 ~ 05:00）

**重點摘要**：歡迎回來，快速回顧 Day 1 並預告 Day 2 主題。

**內容：**
- Day 1 重點回顧：白皮書、Anti-gravity code lab、隨堂測驗
- Day 2 主軸：agents 之間的互連性
- Discord 與 kaggle 入口網站作為社群支援

### Section 2｜白皮書導讀：A2A 與 Agent Card（05:00 ~ 12:00）

**重點摘要**：深入介紹 A2A protocol 與 Agent Card 兩個關鍵新概念。

**內容：**
- **A2A（Agent-to-Agent）protocol** — agent 之間的通訊標準
- **Agent Card** — agent 的「自我介紹」，機器可讀格式
- 適用於 AI-assisted coding 場景的協議設計

> "tasks using machine-readable agent cards."
> （任務透過機器可讀的 agent card 來描述。）

### Section 3｜來賓 Q&A 1：UCP、AP2 與商業協議（12:00 ~ 25:00）

**重點摘要**：Alan 與 Pierre 討論 agent 之間的商業交易協議。

**內容：**
- **UCP（Universal Commerce Protocol）** — agent 商業交易標準化
- **AP2（Agent Payment Protocol）** — agent 支付端標準
- **A2UI（Agent-to-User Interface）** — 動態 UI 標準
- 重點：可設定（configurable）且可自訂（customizable）

> "configurable and customizable" — UCP 設計哲學。

### Section 4｜來賓 Q&A 2：Agentic Data Cloud（25:00 ~ 35:00）

**重點摘要**：Mike 提出「Agentic Data Cloud」概念，重新思考資料庫設計。

**內容：**
- 傳統資料庫假設「人類是主要消費者」
- Agent 作為主要使用者時，存取模式不同
- Schema 設計從「人類可讀」轉向「agent 可解析」
- **Agent-specific RBAC**（role-based access control）為基礎
- Service-sent events 為觀察性設計方向

> "the Agentic Data Cloud"
> （為 agent 設計的資料雲端。）

### Section 5｜來賓 Q&A 3：長跑 agent 的 FinOps 困境（35:00 ~ 45:00）

**重點摘要**：實務問題——長跑 agent 的成本控制與迴圈預防。

**內容：**
- **Infinite loop** 問題：agent 在長時運行時陷入迴圈
- Token budget 消耗失控
- **FinOps practice** 對 agent 的新需求
- Kill switch 與自動成本 skew 偵測

### Section 6｜程式碼實作：MCP + Antigravity CLI（45:00 ~ 50:00）

**重點摘要**：Fran 帶領設定 MCP server 與 Antigravity CLI。

**內容：**
- **MCP（Model Context Protocol）** — agent 與外部工具的標準介面
- Antigravity CLI 設定流程
- 從 terminal 直接執行 agentic workflow

> "Model Context Protocol" — 連接 agent 與外部 API 的標準。

### Section 7｜隨堂測驗與 Day 3 預告（50:00 ~ 52:35）

**重點摘要**：回顧重點概念，預告 Day 3 主題。

**內容：**
- N×M 整合複雜度問題（MCP 解法：O(N+M) 或更低）
- A2A、A2UI、UCP、AP2 概念回顧
- Day 3 主題：Agentic Skills

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 3 分 51 秒（silent ratio 7.18% ✅）
> 口播稿原文：transcripts/20260620_Kaggle_5DayAIAgents_Day2_口播稿.txt

- [opus 1.8 MB](../audio/20260620_Kaggle_5DayAIAgents_Day2.opus)（Telegram 友善）
- [m4a 3.7 MB](../audio/20260620_Kaggle_5DayAIAgents_Day2.m4a)（iOS 友善）
- [mp3 4.0 MB](../audio/20260620_Kaggle_5DayAIAgents_Day2.mp3)（通用格式）

## 三、人物/角色分析

### Smitha Ken
- **背景**：Google Cloud 資深開發者關係工程師
- **角色**：主持人，引導 Q&A 流程

### Anant Nawalgaria
- **背景**：Kaggle 共同主持人
- **角色**：議題引導、資源協調

### Mike（Agentic Data Cloud）
- **背景**：資料基礎設施專家
- **代表觀點**：資料庫需要從「人讀」轉向「agent 讀」，需要 Agentic Data Cloud

### Alan（Protocol 設計）
- **背景**：protocol 設計專家
- **代表觀點**：UCP / AP2 為 agent 商業交易建立標準，重視 configurable / customizable

### Kanchana（基礎設施）
- **背景**：Google-scale agent 部署專家
- **代表觀點**：protocol 需要大規模工程投入才能擴展

### Pierre（研究／產品）
- **背景**：研究 / 產品策略
- **代表觀點**：protocol 設計需要在不同層次做權衡

### Fran（Code Lab 講師）
- **背景**：hands-on 教學
- **代表觀點**：MCP 設定對實務開發者的具體意義

## 四、關鍵概念定義表

| 概念 | 定義 | 應用 |
|------|------|------|
| **A2A** | Agent-to-Agent，agent 之間的通訊 protocol | 群體 agent 協作 |
| **Agent Card** | agent 的自我描述卡片，機器可讀 | agent discovery |
| **MCP** | Model Context Protocol，agent 與外部工具的標準介面 | tool integration（O(N×M) → O(N+M)） |
| **UCP** | Universal Commerce Protocol，agent 商業交易標準 | e-commerce |
| **AP2** | Agent Payment Protocol，agent 支付標準 | payment processing |
| **A2UI** | Agent-to-User Interface，agent 動態 UI 標準 | dynamic UI |
| **Antigravity CLI** | Google 的 agentic 命令列環境 | terminal agent |
| **Agentic Data Cloud** | 為 agent 設計的資料雲端 | database design |
| **Agent-specific RBAC** | 為 agent 設計的角色存取控制 | security |
| **FinOps for Agents** | agent 成本管理實務 | cost control |
| **Infinite Loop Prevention** | 長跑 agent 的迴圈預防機制 | reliability |
| **Service-Sent Events** | 從服務端推送事件供 agent 觀察 | observability |
| **Abstraction Layer** | 抽象層，把 N×M 整合降為更低複雜度 | MCP design |

## 五、核心主旨

> Day 2 建立 AI Agent 的群體基礎：**protocol** 是 agent 之間、agent 與工具、agent 與商業系統對話的共同語言。沒有 protocol，agent 只是孤島；有了 protocol，agent 才能組成真正的「網路」。

## 六、金句摘錄

1. "tasks using machine-readable agent cards." — Agent discovery 的基礎
2. "the Agentic Data Cloud" — 為 agent 重新設計資料層
3. "configurable and customizable" — UCP 設計哲學
4. "agent-specific role-based access controls" — 為 agent 設計的權限模型
5. "agents autonomously developing their own tools" — agent 的下一步
6. "FinOps itself is a huge practice" — agent 成本管理是新興領域
7. "Model Context Protocol" — 把 N×M 整合降為 O(N+M) 的抽象層

## 七、延伸閱讀

- A2A Protocol（Google, 2026）— Agent-to-Agent 通訊標準
- MCP（Anthropic, 2024）— Model Context Protocol 規範
- UCP / AP2（Google, 2026）— Agent 商業交易與支付協議
- Antigravity CLI（Google, 2026）— Agentic 命令列環境
- Agentic Data Cloud（Google, 2026）— 為 agent 設計的資料雲端