# 【Building Proactive Agent Workflows with Claude Code】
## 影片基本資訊

> **影片連結：** https://youtu.be/eSP7PLTXNy8
> **影片長度：** 22:04
**Maya (Anthropic Applied AI Team)｜2026-05-28**

> 本影片使用 Whisper (base model, auto-detect English) 深度聽寫，經 AI 整理為繁體中文結構化筆記。

---

## 一、主題與背景

- **講者**：Maya，Anthropic Applied AI 團隊成員。一半時間開發自家產品功能，一半時間協助客戶基於 Anthropic 模型建構產品與代理。
- **影片類型**：技術講座 / 產品工作坊（Code with Claude 系列）
- **核心議題**：介紹 Claude Code 全新規則**「Routines」**，如何將 Claude Code 從被動工具轉變為主動協作隊友（teammate）。

---

## 二、章節脈絡

### Section 1｜開場與問題引導（00:00 ~ 04:32）

**重點摘要：** 提出三個當前建構主動代理的核心痛點基礎建設管理、觸發機制、以及缺乏即時互動性。

**內容：**
- 詢問在場觀眾：誰用過 Claude Code 的 routines 功能？、誰曾嘗試用 cron 執行 Claude Code？
- 用 cron 方式建立的代理基礎設施需要大量維護工作，乏味且容易出錯

**當前建構主動代理的三大挑戰：**

| 挑戰 | 說明 |
|------|------|
| 基礎設施（Infrastructure） | 不能跑在本地機器的 CLI，需要管理 hosting、資料持久化與認證，意味需要额外構建一堆無關prompt的系統 |
| 觸發機制（Triggering） | 只能自己建 cron 或自架 endpoint，需要大量客製化工程投入 |
| 即時互動性（Human-in-the-loop） | 無法即時觀看、引導或恢復代理進程，幾乎難以做到「人在迴路中」的狀態 |

---

### Section 2｜Routines 核心概念（04:32 ~ 07:44）

**重點摘要：** Routines 是託管在 Claude Code 雲端基礎設施上的遠端執行的自動化工作流程

**內容：**
- Routines 是一种自动化，可让你仅通过定義 prompt、連接的Repos、使用的 Connectors 以及觸發器，就能啟動遠端雲端代碼對話
- Claude Code 自動處理其餘所有事情

**Routines 設計三大核心原則：**

| 原則 | 說明 |
|------|------|
| 隨時可用（Always Available） | 執行於 Claude Code 托管基礎設施，處理 hosting、session 狀態保存、Connector 授权，無需開著筆電 |
| 可自定義觸發器（Customizable Triggers） | 支援時間排程（每週、每日）與事件驅動（GitHub 原生事件、custom webhook） |
| 可互動引導（Interactive & Steerable） | 每個 Routine 底層就是一個 Claude Code 對話，可通過 Web、CLI、Desktop 即時觀看、詢問、引導、恢復對話 |

---

### Section 3｜真實案例：文件自動化（07:44 ~ 12:35）

**重點摘要：** Anthropic 內部利用 Routines 每週自動比對 Cloud Code 原始碼变更與文檔 repository，主動建立 PR 更新文件

**內容：**
- 自年初以來 Cloud Code 每週 PR 數量成長 200%，新功能快速交付，代價是文件工程師負擔大增
- 文件管理員 Sarah 成為 Routines 早期採用者，用 `slash schedule` 設定自動化

**Sarah 採用的Routine 設定方式：**

> 「每週審視所有 merged 至 main 的變更與文檔 repo 差異，若有差異則建立 PR 更新文檔。」

**建立任何 Routine 前必須先確認的三個決策：**

| 決策 | 問題 | 例子：文件自動化 |
|------|------|----------------|
| 觸發器（Trigger） | Routine 何時啟動？ | 每週一10:00 依排程執行；或每次 release branch cut 時執行 |
| 上下文（Context） | Cloud 需要哪些資訊才能成功完成任務？ | 可連接 Cloud Code 原始碼Repo + 文件 Repo + Google Drive 行銷資料 + Slack |
| 導引（Steering） | 如何確保 Cloud 的輸出符合預期？ | 「agent review」模式由另一個 Routine 在 PR 建立後自動評論 + 人類可隨時進入即時干預 |

**觸發器類型：**
- **排程觸發（Schedule-based）**：時間驅動，如「每週一 10:00 AM 執行」
- **事件觸發（Event-based）**：GitHub 原生事件（e.g., 當 labeled PR merged 時）或自定義 Webhook

**常見 Connector 應用：**
- Google Drive：提供行銷簡報讓 Cloud 參考現有語言風格
- Slack：任務完成後主動通知
- GitHub MCP：代為開立 PR

---

### Section 4｜演示：排成與 GitHub 事件觸發（12:35 ~ 17:22）

**重點摘要：** 演示在 Cloud Code Web 介面建立並管理 Routines 的實際操作流程

**內容：**
- 在 Web 介面可即時看到 Routine 連接的 Repos、觸發時間、使用的 Connector
- Cloud 根據指令自動分析 source code 變更並建立 PR
- 當另一個 labeled PR 已存在時，可即時在 LIVE session 中引導 Cloud 停止當前任務

**Live Session 的 Steering 能力：**
- 可即時打開 Cloud Code Web 介面，觀看、詢問、引導 session 方向
- 可隨時恢復被中斷的 Routine 對話，繼續執行任務

---

### Section 5｜常見應用情境（17:22 ~ 20:40）

**重點摘要：** 軟體工程常見挑戰如何轉化為 Routines

**情境一：Deploy Verifier（部署驗證器）**

| 要素 | 設定 |
|------|------|
| 觸發器 | CD pipeline 在每次部署後 POST webhook |
| 上下文 | 部署的服務原始碼 + 監控工具（Datadog/Grafana）+ Slack/Twilio 警示 |
| 導引模式 | 先讓 Cloud 給出「go / no-go」決策建議，人可即時介入確認是否 rollback |

**情境二：On-call Investigator（值班調查員）**
- 定期讀取 GitHub Issues 與 Slack 討論
- 進行優先級排序
- 為重要 Issue 自動開立 PR

**情境三：PM Backlog Manager（產品經理的待辦清單管理）**
- 每週 kick off 時間驅動 task
- 讀取所有來源的 Issue（GitHub Issues、Slack channel posts）
- 幫助優先排序並開立對應 PR

---

### Section 6｜總結（20:40 ~ END）

**核心主旨：**
> 主動代理（Proactive Agent）優於被動代理。Routines 讓你從「等著你按下 Enter 才開始的工具」進化成「主動發現問題並自動采取行動的隊友」。

**三大要點：**

1. **主動代理勝過被動代理** — 想辦法讓 Cloud 能自主觸發並執行工作
2. **讓 Routines 處理基礎設施** — 你專注領域知識與流程最佳化，Claude Code 搞定代管基礎設施
3. **現在就能開始** — 只需在 Claude Code 內輸入 `/schedule` 命令，即可建立第一個 Routine

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處/應用 |
|------|------|-----------|
| Routines | Claude Code 內的自動化功能，可基於排程或事件驅動啟動遠端 Claude Code session | Anthropic Cloud Code |
| Proactive Agent | 主動代理，能自動感知環境變化並采取行動，不需等待人類觸發 | 影片核心理念 |
| Reactive Agent | 被動代理，必須等待人類輸入 prompt 才會行動 | 現有 Claude Code 默認模式 |
| Connector | Claude Code 用於連接外部工具（GitHub、Slack、Google Drive 等）的橋樑模組 | Routines 上下文供應 |
| Agent Review | 多代理系統中的 Generator-Critiquer 模式，借用到 Routines 中讓第二個 Routine 自動評論第一個 Routine 建立的 PR | 質量管控機制 |
| Steering | 在 Live Session 中即時引導 Cloud 朝正確方向前進的能力，可提問、修正、恢復對話 | Routines 互動性 |

---

## 四、人物分析了

### Maya
- **背景**：Anthropic Applied AI 團隊成員，負責第一方產品開發與客戶代理建構顧問
- **角色定位**：Routines 功能推廣者與技術教練
- **代表觀點**：「Coding agents 不應該等待你按下 Enter 才能開始工作。」

### Sarah（文檔管理員）
- **背景**：負責維護 Cloud Code 與 Agent SDK 的文檔工程師
- **關鍵轉折**：週 PR 成長 200% 後，成為 Routines 早期採用者，用自動化減輕重複性文檔更新負擔
- **代表觀點**：「所有新功能都應該有對應的自動化文檔更新流程。」

---

## 五、金句摘錄

1. > 「Coding agents shouldn't wait for you to press enter to get started. We want to take Claude Code and turn it into a really powerful coding teammate.」
2. > 「A teammate notices when something breaks and does something about it.」
3. > 「Proactive agents beat reactive agents. Move from an agent that waits for you to press enter and create a PR, to an agent that reacts to problems and opens a PR itself.」
4. > 「You're a single slash schedule command inside of Claude Code away from creating your very first routine.」

---

## 六、延伸參考

- [Claude Code 官方網站](https://claude.ai/code)
- [Claude Code Routines 文件](https://docs.anthropic.com/en/docs/claude-code/routines)
- Generator-Critiquer Pattern（多代理系統中的生成器-批判者模式）
