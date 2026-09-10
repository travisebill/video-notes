# 【The agent evaluation revolution】

**講者｜Google Cloud Tech（Google 官方 AI/ML YouTube 頻道，ADK 系列主講人 Annie）**
**影片連結｜https://www.youtube.com/watch?v=WZZLtwnZ4w0**
**影片長度**｜8:31（511s）
**發布日期｜2025-12-03**
**Module｜C Agent Evaluation (Ep.1)**
**類型｜教學影片（Agent Evaluation 系列 Ep.1）**
**主題｜Google Agent Development Kit (ADK) — Agent Evaluation 革命：為什麼傳統測試對 AI agent 不夠用、什麼是 system-level testing、多 agent 評估的陷阱**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Google Cloud Tech 推出 AI Agent Evaluation 系列教學影片，這是系列第一集。影片用 8 分多鐘從「為什麼 agent 評估跟傳統測試不同」到「agent 評估到底是什麼」到「multi-agent 評估的實際案例」完整說明。

影片的核心架構分為三大部分。第一部分說明為什麼 agent 評估不同：傳統軟體是確定性的（相同輸入永遠相同輸出），但 AI agent 是機率性的且自主的（會計畫、調適、使用工具，每次可能走不同路徑）。第二部分解釋 agent 評估是系統層級測試，不是只測 LM model，而是測整個 stack（LM brain、prompt、tools、memory、orchestration），包含四個檢查維度：最終輸出、planning/reasoning、tool use、memory/context。第三部分用 customer service 雙 agent handoff 案例展示多 agent 評估的陷阱：單獨測每個 agent 會錯過系統層級的失敗。

整支影片的關鍵洞察：agent 評估不是「did final answer equal x」這種二元測試，而是觀察整個 trajectory（計畫形成、工具使用、資訊傳遞、使用者是否得到想要的結果）；多 agent 系統尤其需要 system-level testing，因為 handoff 失敗可能在個體 agent 看起來都成功但整體失敗。

---

## 章節脈絡

| 段落 | 時間 | 標題 | 一句話摘要 |
|------|------|------|----------|
| Section 1 | 00:00 - 02:00 | 為什麼 agent 評估不同 | 傳統軟體確定性 vs AI agent 機率性 |
| Section 2 | 02:00 - 06:00 | Agent 評估到底是什麼 | System-level testing + 4 個檢查維度 |
| Section 3 | 06:00 - 08:31 | Multi-agent 評估案例 | Customer service 雙 agent handoff 的陷阱 |

> 時間軸是根據 1132-word 逐字稿內容比例估算。

---

## 關鍵概念定義

| 概念 | 定義 | 角色 / 應用 |
|------|------|------------|
| **Agent evaluation** | 測試 AI agent 是否可靠達成任務的系統化方法 | 跟傳統 unit test 不同 |
| **Deterministic vs probabilistic** | 傳統軟體確定性（相同輸入→相同輸出）vs AI agent 機率性（每次可能不同）| 評估策略必須不同 |
| **System-level testing** | 測試整個 stack（LM + prompt + tools + memory + orchestration）| 而非只測 LM model |
| **Final output check** | 檢查 task success rate、stepwise progress、output quality、safety | 第一個檢查維度 |
| **Planning and reasoning** | 檢查模型如何拆解目標、justify 每步、保持 coherence | 第二個檢查維度 |
| **Tool use evaluation** | 檢查選對工具、傳對參數、處理輸出、避免冗余成本 | 第三個檢查維度 |
| **Memory and context** | 檢查記得重點、準確檢索、處理長距離 context 和衝突 | 第四個檢查維度 |
| **RAG precision/recall** | Retrieval Augmented Generation 的檢索精確度和召回率 | Memory 評估的關鍵指標 |
| **Multi-agent handoff** | Agent A 把任務交給 Agent B 的過程 | Multi-agent 系統的關鍵風險點 |
| **Three-tier test pyramid** | 三層測試金字塔（unit / integration / system）| 下集會介紹 + ADK 實作 |
| **Trajectory** | Agent 從輸入到輸出的完整路徑（含中間步驟）| Agent 評估的觀察對象 |

---

## 人物 / 角色分析

### Google Cloud Tech（講者 Annie）
- **背景**：Google 官方 AI/ML YouTube 頻道 ADK 系列主講人（從逐字稿口氣推斷，可能是 Developer Advocate）
- **關鍵角色**：本影片（Agent Evaluation 系列 Ep.1）講者，開啟「如何評估 AI agent」的新主題
- **代表觀點**：傳統測試方法不適用於 AI agent；必須用 system-level testing 觀察整個 trajectory；多 agent 系統需要特別注意 handoff 失敗

---

## 核心主旨

> **Agent 評估跟傳統軟體測試完全不同——傳統軟體是確定性的，AI agent 是機率性且自主的，每次執行可能走不同路徑，所以不能只看最終答案對不對；Agent 評估是 system-level testing，測試整個 stack（LM + prompt + tools + memory + orchestration），包含四個檢查維度：最終輸出、planning/reasoning、tool use、memory/context；多 agent 系統尤其容易出現「個體成功但整體失敗」的情境（A 成功轉交但傳錯 order ID，B 成功退款但用戶拿到的不是自己的訂單），所以必須看整個 network 是否達成目標、共用 context 是否安全傳遞、整體成本和延遲是否合理。**

---

## 金句摘錄

1. > "Traditional software is deterministic. With same input, you almost always get the same output. But AI agents are probabilistic and autonomous."
   > —— 傳統軟體 vs AI agent 的本質差異

2. > "Agent evaluation isn't just testing this model. It is a whole stack that includes the LM brain, the prompts that's guiding it, the external tools and APIs, the memory system carrying the information forward, and also the orchestration logic trying it all together."
   > —— System-level testing 的範疇

3. > "When evaluating the agent, a bad answer might come from a tool issue, or a reasoning gap, or a memory failure. So it is very important to measure each layer to help you debug."
   > —— 分層量測的 debug 價值

4. > "If it tests agent A alone for refunding, it may look like 0% success, because agent A doesn't do refund. But in reality, agent A succeeds because its job was to hand off the information, not to refund."
   > —— Multi-agent 評估的個體 vs 整體陷阱

---

## 延伸閱讀 / 參考

- **Google Agent Development Kit (ADK) 官方文件** — https://google.github.io/adk-docs/
- **Google Cloud Tech YouTube 頻道** — https://www.youtube.com/@googlecloudtech
- ADK 系列影片（按日期排序）：
  - #1 Foundations of multi-agent systems with ADK (2025-10-01)
  - #2 Workflow agents and communication in ADK (2025-10-08)
  - #3 Connecting ADK Agents to MCP Servers (2025-11-07)
  - #4 Building your own MCP server with ADK (2025-11-17)
  - #6 How to evaluate agents in practice (2025-12-12)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 2 分 47 秒
> 口播稿原文：transcripts/20251203_GoogleCloudTech_TheAgentEvaluationRevolution_口播稿.txt

- [opus 0.6 MB](../audio/20251203_GoogleCloudTech_TheAgentEvaluationRevolution_口播稿.opus)（Telegram 友善）
- [m4a 2.0 MB](../audio/20251203_GoogleCloudTech_TheAgentEvaluationRevolution_口播稿.m4a)（iOS 友善）
- [mp3 2.6 MB](../audio/20251203_GoogleCloudTech_TheAgentEvaluationRevolution_口播稿.mp3）（通用格式）
