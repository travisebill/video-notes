# MCP vs Skills：哪一個適合你的 AI Agent 與 LLM？

## 影片基本資訊

> **影片標題：** MCP vs Skills: Which Is Right for Your AI Agent and LLMs?
> **影片連結：** https://youtu.be/goU9VIXA8II
> **講者：** Cedric Clyburn（IBM Technology）
> **影片長度：** 8 分 2 秒（482 秒）
> **上稿日期：** 2026-07-07
> **整理日期：** 2026-07-08
> **類別：** 技術講座
> **主題標籤：** MCP、Skills、Context Engineering、AI Agents、LLM、Anthropic
> **影片語言：** 英文（自動字幕 zh-Hant）

---

## 主題背景

AI Agent 在 2026 年進入快速發展期，開發者普遍面臨一個核心問題：當 LLM 本身缺乏特定領域知識、即時資料或專屬工具時，應該怎麼「擴充」它？IBM Technology 的 Cedric Clyburn 在這部 8 分鐘短片中，以**「Context Engineering（上下文工程）」** 為切入點，比較兩種主流擴充機制：

- **MCP（Model Context Protocol）** — 由 Anthropic 主導的標準化協議
- **Skills（技能）** — 可重複使用的提示 + 腳本打包機制

影片最後給出清楚的**選型決策樹**：需要即時資料且權限嚴控 → MCP；需要可重複的格式化任務 → Skills。並強調兩者**皆為開源**，且可在本機直接使用。

---

## 章節列表（依 transcript 結構推斷）

| # | 章節 | 內容主題 | 時間區間 |
|---|------|---------|---------|
| 1 | LLM 是水晶球預測機 | LLM 訓練機制 + 為何需要 context | 0:00 - 0:55 |
| 2 | Prompt Engineering → Context Engineering | 從單純 prompt 進到多源 context | 0:55 - 1:55 |
| 3 | MCP 登場：標準化外部資料層 | API 抽象化 + 身份驗證 + 範例 CRM | 1:55 - 3:50 |
| 4 | Skills 登場：可重複的格式化封包 | Markdown + 自動載入 + 偵錯/清理案例 | 3:50 - 5:30 |
| 5 | 選型決策：MCP vs Skills | 即時資料 → MCP；可重複任務 → Skills | 5:30 - 7:10 |
| 6 | 兩者並行 + CLI 彩蛋 | 兩者皆開源、本機可用；下集談 CLI | 7:10 - 8:02 |

---

## 核心概念詳解

### 概念 1：LLM 本質是「訓練後的水晶球」

LLM 在大量文本（書、雜誌、網路文章）訓練後，學會模式識別與問答。但**它「知道」≠「現在該用什麼」**。當應用情境涉及：

- 公司內部 CRM 客戶資料
- 團隊特定的資料表結構
- 工具呼叫結果

就需要在 prompt 之外提供**正確的 context**。影片用「水晶球預測機」比喻 LLM 的非確定性特質 — 這是 Skills 存在的根本原因。

### 概念 2：從 Prompt Engineering 升級到 Context Engineering

Cedric 點出一個重要概念轉換：

- **Prompt Engineering**：佈置任務給 LLM（角色 + 任務描述）
- **Context Engineering**：除了任務，附加「資料格式期望」「團隊設定」「工具回應」等多源上下文

> 「當 prompt 加入所有附加資訊時，事情就變得非常有趣 — 這就是 Context Engineering。」

這個術語在 2024-2025 年逐漸取代「Prompt Engineering」成為主流說法，原因是 LLM 應用從「單次對話」演進為「多輪工具呼叫 + 多源資料整合」。

### 概念 3：MCP（Model Context Protocol）

**定義**：MCP 是 LLM 與外部資料來源之間的**標準化層**（standardized layer）。

**核心功能**：
1. **API 抽象化**：把服務的 REST API 包成 LLM-ready 格式（LLM 只需要發出 JSON 請求）
2. **身份驗證**：提供 scoped token，控制讀寫權限
3. **雙向轉換**：MCP server 把 LLM 的 JSON 請求轉成 POST/GET，反向把服務回應塞回 LLM context window
4. **IDE/AI App 整合**：MCP server 通常掛在 IDE（VS Code、Cursor）或 AI app 上

**影片案例**（CRM）：
> 「與其把 CRM API 文件 + token 複製貼上給 LLM 說『嘿，請更新客戶聯絡資訊，千萬別出錯』，我們只能祈禱好運 — **MCP 規範了 AI 模型與這些不同資料來源的交互方式**。」

### 概念 4：Skills（技能）

**定義**：Skills 是**可重複使用的 prompt + 腳本**打包成 Markdown 檔 + 資料夾的機制。

**檔案結構**：
```
skill-name/
├── SKILL.md          # 標題 + 描述 + 使用時機 + 實際 prompt
├── scripts/          # 附加腳本（Python、Bash 等）
└── resources/        # 範例資料、reference files
```

**關鍵特性 — 自動載入**：
Skills 會**根據 LLM 當前詢問的內容自動載入**到 context window。例如：
- 使用者問「程式碼報錯」 → 自動載入「code-debugger」skill
- 使用者問「Excel 清理」 → 自動載入「excel-cleaner」skill

**影片舉例**：
- 清理 Excel 文件
- 偵錯程式碼（總是用 `maven verify`）
- 執行合規性檢查
- 格式化 CRM 客戶資料（含「最喜歡的 cookie 類型」這種固定欄位）

### 概念 5：選型決策樹

Cedric 給出明確的選擇原則：

| 情境 | 建議 | 原因 |
|------|------|------|
| 需要即時資料（VM 狀態、叢集狀態、客戶資料查詢） | **MCP** | 嚴格權限 + 雙向 API 呼叫 |
| 需要可重複 + 輕量的格式化任務 | **Skills** | 輕巧、教模型做某事、不需 API 整合 |
| 兩個都需要 | **MCP + Skills 並用** | MCP 拉資料 + Skills 格式化輸出 |

> 「如果你只需要為 AI 添加可重複使用和自訂功能，那麼設定 MCP 可能就有點大材小用 — 這就是 Skills 的優勢所在，因為它們輕巧。」

### 概念 6：兩者皆開源 + 本機可用

影片尾聲強調：
- MCP 和 Skills 都是**開源標準**
- **目前大多數 AI 工具都普遍採用**它們
- **今天就可以在本機機器上使用**

---

## 概念速查表

| 維度 | MCP | Skills |
|------|-----|--------|
| 發起者 | Anthropic（2024-11） | Anthropic（2025） |
| 用途 | LLM ↔ 資料來源 標準介面 | 可重複的 prompt + 腳本封包 |
| 機制 | JSON-RPC over stdio/HTTP | Markdown + 自動 context 載入 |
| 適用場景 | 即時資料、API 呼叫、權限控管 | 格式化任務、清理、偵錯、合規 |
| 學習曲線 | 中（需懂 protocol） | 低（Markdown + YAML frontmatter） |
| 開源 | ✅ | ✅ |

---

## 金句摘錄

> 「LLM 本質上就像一台水晶球預測機，經過各種類型資訊的訓練 — 但要得到正確的答案，就需要向 LLM 提供正確的上下文。」

> 「當 prompt 加入所有附加資訊時，事情就變得非常有趣 — 這就是 Context Engineering。」

> 「MCP 規範了 AI 模型與這些不同資料來源的交互方式。與其把 API 文件複製貼上給 LLM 祈禱好運，MCP 提供標準化層。」

> 「Skills 是帶有少量額外元資料的 Markdown 文件，可以根據需要自動載入到 LLM 的上下文視窗中。」

> 「如果你只需要為 AI 添加可重複使用和自訂功能，那麼設定 MCP 可能就有點大材小用 — 這就是 Skills 的優勢所在。」

---

## 人物背景：Cedric Clyburn

- **身份**：IBM Technology 的開發者倡導者（Developer Advocate）
- **專長**：AI agents、context engineering、開源協議
- **影片定位**：以 IBM 官方頻道角度，客觀介紹 Anthropic 主導的 MCP 與 Skills（非 IBM 自家產品）
- **語言風格**：口語化、用「對吧？」結尾、用 CRM/cookie 等具體案例拉近距離

---

## 核心主旨

**Context Engineering 是 AI Agent 時代的核心問題；MCP 與 Skills 是兩個互補的解法 — 一個處理即時資料的「外部整合」，一個處理可重複任務的「內部格式化」。**

選型邏輯：

```
需要即時資料 / 嚴格權限 ─→ MCP
需要可重複 / 輕量擴充 ─→ Skills
兩個都有 ─→ 並用
```

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 5 秒
> 口播稿原文：transcripts/20260707_CedricClyburn_MCP_vs_Skills_口播稿.txt

- [opus 970 KB](../audio/20260707_CedricClyburn_MCP_vs_Skills.opus)（Telegram 友善）
- [m4a 4.0 MB](../audio/20260707_CedricClyburn_MCP_vs_Skills.m4a)（iOS 友善）
- [mp3 3.7 MB](../audio/20260707_CedricClyburn_MCP_vs_Skills.mp3)（通用格式）