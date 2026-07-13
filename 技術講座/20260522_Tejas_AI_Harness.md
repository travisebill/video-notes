# 【AI Harnesses: Building Reliable AI Agents】
## 影片基本資訊

> **影片連結：** https://youtu.be/C_GG5g38vLU
> **影片長度：** 20:27
**Tejas（IBM AI Developer Advocate）｜2025（演講時長：18 分鐘）**

---

## 一、主題與背景

- **講者背景：** Tejas，IBM AI Developer Advocate，曾在多種機構工作，現於 IBM 訓練前沿模型（frontier models）與建構 AI 工具
- **影片類型：** 技術演講／Conference Talk
- **核心議題：** 什麼是 AI Harness（AI 韁繩）——為何需要、它是什麼、以及如何從零建立一個 harness，透過一個真實 Demo 展示如何將弱模型（GPT-3.5 Turbo）變得可靠

---

## 二、章節脈絡

### Section 1｜Why Harness?（為何需要 Harness）
**重點摘要：** 因為租用模型是個黑盒子，有太多變數無法控制——Harness 的核心價值是 reliability（可靠性）

**內容：**
- 我們向 API 提供商（如 Anthropic、Google）支付費用取得 compute 和 inference tokens，絕大多數人不是「token billionaires」
- 花了 $20/month 訂閱 Claude Pro，取得的上下文視窗有限，也無法確定拿到的模型是否真的是 Opus
- 模型是個黑盒子——供應商隨時可能給你 Sonnet 而非 Opus，你無從得知
- **Harness 解決的問題**：不論黑盒子模型如何、租用服務如何，確保 agents **做它們該做的事**

> 「The name of the game with harness is reliability.」
>（Harness 的核心價值在於可靠性。）

---

### Section 2｜What is a Harness?（Harness 的定義）
**重點摘要：** Harness 是「围绕在模型周圍的一切」，將模型錨定在一個穩定、可控制的環境

**內容：**
- **傳統 ML 的 harness**：類似測試套件（test suite）+ 測試執行器（test runner），非本次演講重點
- **AI Agent Harness（本次焦點）**：將 LLM 接入現實世界的所有工程基礎設施
- 比喻1：攀岩者用 harness 把自己固定在穩定的山壁上，避免脫軌
- 比喻2：遛狗時用 harness，避免狗跑丟或讓你破產（燒光 tokens）
- **Claude Code 就是一個 coding agent harness**

---

### Section 3｜Harness 的六大核心元件
**重點摘要：** 一個完整的 Agent Harness 由這些元件組成

| 元件 | 說明 |
|------|------|
| **Tool Registry** | 工具清單，如讀寫檔案、執行 bash 命令 |
| **Model** | 所使用的 LLM（本 Demo 用 GPT-3.5 Turbo，故意選爛模型） |
| **Context Primitives** | 上下文管理——每個 harness runtime 都會壓縮自己的 context |
| **Guardrails** | 防護機制，如限制最多 N 步工具呼叫（max steps） |
| **Agent Loop** |  agent 的主迴圈，負責互動流程 |
| **Verify Step** | 驗證步驟——任務完成後執行 lint、測試等確認 |

> 「The agent harness is everything around the model that gives it grounding in reality.」
>（Agent harness 就是圍繞在模型周圍的一切，讓模型接地現實。）

---

### Section 4｜Demo 實作：Poor Man's AI Harness（從零建構 Harness）
**重點摘要：** 用一個爛模型（GPT-3.5 Turbo）+ 漸進式建構的 harness，完成「到 Hacker News 點擊第一篇貼文 upvote」的任務

#### 4.1 初始系統（無 harness）
- 只有 model + browser session + 基本 tool registry
- 模型直接面对 Hacker News 的登入頁面，嘗試點擊 upvote，撞到登入牆後慌張崩潰
- **問題：模型會說謊——聲稱「已成功 upvote」，實際上根本沒做到**

#### 4.2 加入 Guardrails（第一層 harness）
- **Max Iterations**：超過 6 步就終止任務
- **Max Messages**：訊息過多時壓縮 context
- Context compressor 策略：保留 system prompt + user prompt + 最近兩條訊息
- **效果**：仍會失敗，但現在能「正確地失敗」——不再假裝成功

> 「Step one to solving a problem is admitting you have one.」
>（解決問題的第一步是承認問題存在。）

#### 4.3 加入 Verify Step（第二層 harness）
- `verify_successful_upvote()`：一個確定性的檢查函式
- 檢視 agent loop 中累積的工具歷史（tool history）
- 發現「harness_auto_login」沒有實際執行、仍卡在登入頁 → 回報失敗
- **從欺騙變成了誠實**

#### 4.4 加入 Login Handler（第三層 harness）
- 在每次 agent loop 執行前，檢查當前 URL 是否為登入頁面
- 若檢測到 login URL：將登入憑證以環境變數形式自動填入表單並 submit
- 整個登入流程由 harness **程式化地、確定地**執行，而不是交給不靠譜的 LLM
- **最後成功**：自動化完成 Hacker News 登入 → 點擊 upvote → 任務完成

---

### Section 5｜Harness 的終極價值
**重點摘要：** 非決定性的模型 + 精心設計的 harness = 可以用便宜模型做到複雜任務

**內容：**
- 模型是非決定性的（non-deterministic）——你希望用更便宜的模型（如 GPT-3.5）
- 有了好的 harness，**用免費模型也能走很遠**
- IBM 實際案例：**OpenRAG**——在企業私有雲環境中，透過强大的 harness 提供企業級安全防護，完成各種 RAG 任務（會議記錄、PDF、發票等）
- **核心觀點**：prompt 和 system prompt 完全沒改變，**只靠改變 harness 就讓 outcome 徹底不同**

---

### Section 6｜總結與未來展望
**重點摘要：** 2026 年是 Harness 元年；未來的方向是「動態即時生成 harness」

- 2025 = Year of **Agents**
- 2026 = Year of **Harnesses**
- 2027 的展望：**Dynamic on-the-fly generated harnesses**——讓 agent 在執行任務前自己創造專屬的 harness（類似 Plan Mode 但更進一步），自帶 guardrails，讓整個系統更可靠

---

## 三、關鍵概念定義表

| 概念 | 定義 | 備註 |
|------|------|------|
| **AI Harness** | 圍繞在 LLM 模型周圍的所有工程基礎設施，讓黑盒子模型在穩定的環境中運作 | 類似攀岩 harness 的比喻 |
| **Tool Registry** | AI agent 可呼叫的工具清單（檔案讀寫、bash 命令、瀏覽器操作等） | Claude Code / Cursor / Codex 都有 |
| **Guardrails** | 防護機制，如 max steps（限制工具呼叫次數）、context compression | 防止模型無限期運作或燒光 tokens |
| **Agent Loop** | 讓 agent 持續運作的迴圈，直到任務完成或被 guardrail 終止 | 不是 harness 本身，是被 harness 包圍的環 |
| **Verify Step** | 任務完成後的確定性驗證（lint、測試、URL 檢查等） | 確保 agent 不是「假成功」 |
| **Context Compression** | 當對話歷史過長時，harness 自動刪除舊訊息以節省 context window | 本 Demo 的策略：保留 system + user + 最近 2 條 |
| **Login Handler** | 在每次 agent loop 前檢查是否在登入頁，是的話自動注入憑證 | harness 層級處理敏感資訊的經典範例 |

---

## 四、核心主旨

> **AI Harness 是 AI 工程的精髓——它將非決定性的黑盒子模型錨定在確定性的工程系統中，讓弱模型也能可靠地完成複雜任務。重點不是模型多強，而是框架（harness）多好。**

---

## 五、金句摘錄

1. 「The name of the game with harness is reliability.」
   （Harness 遊戲的名字是可靠性。）

2. 「The agent harness is everything around the model that gives it grounding in reality.」
   （Agent harness 就是圍繞在模型周圍的一切，讓模型接地現實。）

3. 「Step one to solving a problem is admitting you have one.」
   （解決問題的第一步是承認問題存在。）

4. 「With a great harness, you can go very far with a cheap model.」
   （擁有一個好的 harness，用便宜模型也能走得很遠。）

5. 「I did not change the system prompt. We just built a harness and the outcome radically changed.」
   （我完全沒改 system prompt，我們只是建了一個 harness，outcome 就徹底改變了。）

6. 「2026 is the year of harnesses.」
   （2026 年是 Harness 元年。）

---

## 六、延伸參考

- **OpenRAG**（IBM 開源專案）——企業級 RAG 操作的 harness 實作範例
- 講者 GitHub 上有完整的 Demo 程式碼（演講中提及）
- 相關工具：Playwright（瀏覽器自動化）、OpenAI SDK（tool calling）

---

> 本影片使用 YouTube 英文自動字幕（en auto-generated VTT），經清除時間碼與格式標籤後得到逐字稿，全文翻譯為繁體中文整理。