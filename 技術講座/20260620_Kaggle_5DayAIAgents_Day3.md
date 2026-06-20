# DAY 3 Livestream — 5-Days of AI Agents: Intensive Vibe Coding Course With Google

**Smitha Ken + Anant Nawalgaria + Alan + Julia + Hmi + Gabriella + Devanch + Paulong（Google Cloud × Kaggle）｜2026-06-20**

> 影片連結：https://www.youtube.com/live/1T2mxYZkqL0
> 影片時長：57:29（3449s）
> 語言：英文（YouTube 自動字幕 en-orig）
> 上傳者：Kaggle
> 來源：5-Day AI Agents Intensive Course Day 3 Livestream

## 一、主題與背景

本影片是 Kaggle 與 Google 共同舉辦的「5-Day AI Agents Intensive Course」第三天的直播內容。Day 1 建立個體基礎、Day 2 建立 protocol 群體基礎（MCP、A2A、UCP、AP2），Day 3 聚焦 **Agent Skills**——agent 的 playbook 系統。多位來賓（Alan、Julia、Hmi、Gabriella、Devanch、Paulong）共同參與 Q&A 與 code lab。

## 二、章節脈絡

### Section 1｜開場與 Day 2 回顧（00:00 ~ 05:00）

**重點摘要**：歡迎回來，回顧 Day 2 內容並預告 Day 3 主題。

**內容：**
- Day 2 重點：MCP、managed MCP servers
- Day 3 主軸：**Agent Skills**——agent 的 playbook 系統
- Discord 與 kaggle 入口網站作為支援

### Section 2｜白皮書導讀：Agent Skills 概念（05:00 ~ 12:00）

**重點摘要**：介紹 Agent Skills 作為「playbook」的核心概念。

**內容：**
- **Agent Skills** — agent 的戰術手冊（vs MCP 的「手」）
- 解決「越加越多 instruction」的 prompt 膨脹問題
- 適用於複雜 multi-agent 設定的可維護性

> "If MCP is the hands of your agent, agent skills are the playbooks."
> （如果 MCP 是 agent 的雙手，Agent Skills 就是 playbook。）

### Section 3｜來賓 Q&A 1：Safety in Agentic Systems（12:00 ~ 20:00）

**重點摘要**：Alan 與 Julia 討論 agentic safety 的多層防禦。

**內容：**
- Safety 不能只依賴 model 或 skill 集合
- **Defense-in-depth** 原則：多層安全防禦
- **Adversary red teaming** 與 sustained access 評估
- 從 runs everywhere 到 runs safely anywhere 的演進

> "don't ever let safety fully depend on the model or on the set of skills."
> （不要讓 safety 完全依賴 model 或 skill 集合。）

### Section 4｜來賓 Q&A 2：Multi-turn Runbooks 與 File Bus（20:00 ~ 35:00）

**重點摘要**：探討 multi-turn runbooks 與 file bus 設計模式。

**內容：**
- 新版 model 對 runbook 的 native training
- **File bus 取代 context window** 作為 message bus
- 傳遞 **pointers**（不是 data），降低 context 負擔
- 觀察 successful workflows 自動生成新 runbook
- Risk：用了錯誤的 metrics 反而讓 library 變差

> "not data, not context, just pass pointers."
> （不是 data，不是 context，傳 pointers。）

### Section 5｜來賓 Q&A 3：Tool 設計與 Architecture（35:00 ~ 50:00）

**重點摘要**：single action 原則與 simple vs complex 取捨。

**內容：**
- **Single action per tool** — 單一職責原則
- Skill vs MCP tool 的分界
- Architecture：先簡單，撞到 boundary 再複雜化
- Latency 與 scalability 的權衡
- 每個 boundary 都增加 context handoff

### Section 6｜Q&A 4：DAG Orchestration（50:00 ~ 55:00）

**重點摘要**：state 管理的反 reconciliation 設計。

**內容：**
- **Reconciliation 是 architectural anti-pattern**
- 容易累積 hallucination 與 rot
- **DAG orchestration** 透過 file message bus + structured schema references
- 每個 node 有明確的 skill / tool / boundary
- Antigravity 主動避免 reconciliation，採用 decoupled state 設計

### Section 7｜程式碼實作 + 隨堂測驗 + Day 4 預告（55:00 ~ 57:29）

**重點摘要**：Antigravity 設定 Agent Skills 與隨堂測驗。

**內容：**
- Paulong 帶領 Antigravity Agent Skills 設定
- 隨堂測驗：Agent Skills manifest 結構（正解：**skills.md**）
- Day 4 主題：Quality / Evaluation

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 3 分 06 秒（silent ratio 8.54% ✅）
> 口播稿原文：transcripts/20260620_Kaggle_5DayAIAgents_Day3_口播稿.txt

- [opus 1.4 MB](../audio/20260620_Kaggle_5DayAIAgents_Day3.opus)（Telegram 友善）
- [m4a 3.0 MB](../audio/20260620_Kaggle_5DayAIAgents_Day3.m4a)（iOS 友善）
- [mp3 2.7 MB](../audio/20260620_Kaggle_5DayAIAgents_Day3.mp3)（通用格式）

## 三、人物/角色分析

### Smitha Ken
- **背景**：Google Cloud 資深開發者關係工程師
- **角色**：主持人，引導 Q&A

### Anant Nawalgaria
- **背景**：Kaggle evangelist + 產品經理
- **角色**：議題引導

### Alan（Safety）
- **背景**：safety / security 專家
- **代表觀點**：safety 多層防禦，不只靠 model

### Julia（Agent Architecture）
- **背景**：agent 架構設計專家
- **代表觀點**：single action per tool、file bus 設計

### Hmi（Skill Discovery）
- **背景**：skill discovery / management
- **代表觀點**：dynamic skill loading 與 token 壓縮

### Gabriella（MCP Server 設計）
- **背景**：MCP server 設計
- **代表觀點**：skill vs MCP tool 的分界

### Devanch（Orchestration）
- **背景**：orchestration 架構
- **代表觀點**：DAG over reconciliation

### Paulong（Code Lab）
- **背景**：code lab 講師
- **代表觀點**：Antigravity Agent Skills 實務

## 四、關鍵概念定義表

| 概念 | 定義 | 應用 |
|------|------|------|
| **Agent Skills** | agent 的 playbook 系統 | 重用 task patterns |
| **Multi-turn Runbook** | 多輪對話的執行手冊 | complex workflows |
| **File Bus** | 用 file 傳遞 pointers 取代 context 內容 | context efficiency |
| **Pointer Passing** | 傳 reference 而非 data | state management |
| **Single Action Per Tool** | 一個 tool 只做一件事 | tool design |
| **DAG Orchestration** | 有向無環圖編排 | declarative workflow |
| **Reconciliation Anti-pattern** | 對多個 state 做 reconciliation 累積錯誤 | architectural warning |
| **Structured Schema References** | 透過 schema reference 傳 state | bus design |
| **Skills Manifest** | Agent Skills 的 manifest 檔（skills.md） | discovery |
| **Managed MCP Servers** | Google 託管的 MCP server | production deployment |
| **Defense-in-Depth** | 多層安全防禦 | safety |
| **Adversary Red Teaming** | 對抗性安全測試 | safety eval |

## 五、核心主旨

> Day 3 建立 Agent Skills 的設計哲學：**playbook 是把 prompt 從一次性藝術轉化為可重用系統工程的關鍵**。MCP 給 agent 雙手，Skills 給 agent 戰術。

## 六、金句摘錄

1. "If MCP is the hands of your agent, agent skills are the playbooks." — MCP vs Skills 的對比
2. "don't ever let safety fully depend on the model" — safety 多層防禦
3. "not data, not context, just pass pointers" — file bus 設計精髓
4. "single action that can be performed" — tool design 的單一職責
5. "architectural anti-pattern" — reconciliation 的批判
6. "DAG orchestration" — declarative over imperative
7. "structured schema references" — bus 設計的標準

## 七、延伸閱讀

- Agent Skills Manifest Spec（Kaggle × Google, 2026）
- Antigravity Agent Skills 文件（Google, 2026）
- DAG Orchestration Patterns（workflow design）
- Defense-in-Depth for LLM-based Systems（safety design）