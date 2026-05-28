# 【🚀AI編程革命！Claude Code Workflow 自動生成 Harness！徹底抹平 Harness Engineering 技術鴻溝！】
**主講/講者｜未知（2026-05-27）**

---

## 一、主題與背景

這是一場關於 **Claude Code 雲端編輯器** 新功能「**Workflow**」的技術展示教學影片。講者說明如何透過 Workflow 自動生成 Harness，讓 AI Agent 成為 Harness 的主要創建者，從根本上簡化開發流程並降低技術門檻。

---

## 二、章節脈絡

### Section 1｜ Cloud Code 新功能 Workflow 簡介（00:00 ~ 03:00）

**重點摘要：** 介紹 Claude Code 的 Workflow 功能定位與核心價值

**內容：**
- Cloud Code 的 Workflow 建立在 VM Sandbox 環境之上
- 讓 Cloud Code 撰寫 JS 交換腳本，由整個大模型從 Sandbox 往外溝通
- 核心優勢：Sandbox 環境確保 API 確定性、安全隔離，且所有大模型都從同個出口往外溝通
- 過去用 Cypress 等工具能做到的事，現在 Workflow 都能做，且更加即時真實

### Section 2｜為何將 Workflow 放在 Sandbox 內（03:00 ~ 05:30）

**重點摘要：**  解釋 Sandbox 設計的安全與可控性優勢

**內容：**
- **Sandbox 的三大價值：**
  1. **API 確定性** — 確保可使用的 API 環境一致
  2. **安全隔離** — 與外部環境隔離，确保安全性
  3. **統一溝通出口** — 所有大模型皆從 Sandbox往外溝通，結果可控
- Workflow 已整合 13 個 Agents，分四個步驟執行
- 可即時查看每個 Agent 的 token 消耗與執行狀態

### Section 3｜Workflow 實際操作示範 — UI 介面與功能（05:30 ~ 08:00）

**重點摘要：** 展示如何用 Workflow 操作 GUI 窗口、測試流程與狀態管理

**內容：**
- 示範使用 Workflow 升級規則（rules upgrade）
- 測試使用者相關功能（user test）
- 技術戰（technical battle）功能測試
- 使用 Outro Worker 確保 fire state 正確
- 可即時開啟/關閉 GUI 窗口，進行流程管理
- 包括：資料同步（counter-sync test）、PR 觸發（PR-touch）等操作

### Section 4｜Harness 自動生成機制（08:00 ~ 10:30）

**重點摘要：** 說明 Cloud Code 作為 Harness 的創建者與使用者的雙重角色

**內容：**
- **Cloud Code 的雙重角色：**
  - **Harness 的創建者（Creator）**
  - **Harness 的使用者（User）**
- 半年前：人類是 Harness 的主要創建者
- 現在：**AI Agent 是 Harness 的主要創建者**，可用 prompt 驅動任務
- 透過給予一定額度的 token 計算量，來控制 Workflow 的執行範圍（避免 token 爆炸）

### Section 5｜JS 交換腳本的安全性疑慮與解法（10:30 ~ 13:00）

**重點摘要：** 提供安全使用 Workflow 所撰寫 JS 腳本的最佳實踐

**內容：**
- 可先讓 Cloud Code 在程式碼 Review 中撰寫腳本，而非直接執行
- 腳本分兩階段：
  1. **先用其他 AI 或 Codex 輔助驗證腳本邏輯**
  2. **再由 Cloud Code寫 Workflow 腳本，並與驗證過的腳本合併執行**
- 提供的五個選項：不改變 / 減少變化量 / 減少 token / 調整表述 / 直接執行修改後的腳本
- 每一次腳本變更都會給出完整的修改方法與新選項

### Section 6｜完整工作流程總結（13:00 ~ 13:45）

**重點摘要：** 總結 Workflow 的完整操作流程與價值主張

**內容：**
- **完整流程：選擇需求 → 撰写/修改腳本 → 結合驗證 → 執行腳本**
- 支援與其他 AI（如 Codex）協作控制腳本
- 提供腳本與 Sound 的合併使用方式
- Workflow 可與多個 Cloud Code 實例協作
- 最後一步可直接執行修改後的腳本，無需擔心安全性問題

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處/應用 |
|------|------|-----------|
| **Harness** | 自動化測試/任務執行框架 | Claude Code 的核心組件 |
| **Workflow** | 建立在 Sandbox VM 上的自動化工作流程工具 | Claude Code 新功能 |
| **Sandbox** | 隔離的虛擬機環境，確保 API 確定性與安全 | Workflow 的底層架構 |
| **JS 交換腳本** | 用於在 Sandbox 內外通訊的 JavaScript 橋接程式 | 由 Cloud Code 自動生成 |
| **Outro Worker** | UI fire state 觸發工具，確保介面狀態正確 | GUI 操作演示 |
| **AI Agent as Creator** | AI Agent 取代人類成為 Harness 的主要創建者 | 半年內的關鍵轉變 |
| **Token 控制** | 給予 AI 一定額度的 token 計算量，防止失控 | Workflow 安全機制 |

---

## 四、核心主旨

> Claude Code 的 Workflow 功能讓 AI Agent 成為 Harness 的主要創建者，透過 Sandbox VM 環境確保安全性與可控性，以 JS 交換腳本為橋樑，大幅簡化了自動化測試與任務執行的技術門檻。

---

## 五、金句摘錄

1. 「In this situation, the system of cloud code is the creator of harness. It is also the user of harness.」
   > Claude Code 在這個情境下，是 Harness 的創建者，同時也是 Harness 的使用者。

2. 「After half a year, the AI agent is the creator of harness. Will become a main source.」
   > 半年後，AI Agent 作為 Harness 創建者的時代將成為主流。

3. 「As long as we give him a certain calculation, will not be the Token爆炸」
   > 只要給予 AI 一定的計算量額度，就不會造成 Token 爆炸。

4. 「The script video is done. Welcome everyone to watch and develop. Thank you for watching.」
   > 腳本影片到此結束，歡迎大家觀看與開發。謝謝觀看。

---

## 六、相關資訊

- **影片標題：** 🚀AI编程革命！Claude Code Workflow自动生成Harness！彻底抹平Harness Engineering技术鸿沟！
- **影片來源：** YouTube（Claude Code 應用相關技術教學）
- **備註：** 本影片使用 Whisper 自動語音辨識（英文），經 AI 整理為繁體中文結構化筆記
