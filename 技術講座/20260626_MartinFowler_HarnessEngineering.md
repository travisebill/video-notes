# 【Harness Engineering：模型之外，讓 Coding Agent 真正可靠的整套控制系統】

**作者｜Martin Fowler（martinfowler.com）/ 中文摘要彙整｜doggy8088（Will 保哥）/ 2026 年 6 月 26 日**

---

## 一、主題與背景

- **作者**：Martin Fowler，軟體工程界最具影響力的思想家之一，長期撰寫企業級軟體設計與敏捷實務文章，代表作《Patterns of Enterprise Application Architecture》《Refactoring》。
- **文章來源**：[martinfowler.com/articles/harness-engineering.html](https://martinfowler.com/articles/harness-engineering.html)
- **中文摘要彙整**：doggy8088（Will 保哥）在 GitHub Gist `31ef72afb7945efba79c6a2e0b3b82e1` 提供繁體中文重點整理，本文以此 gist 為素材來源。
- **類型**：工程實務文章（技術評論 / 觀點整理）
- **核心議題**：要讓 Coding Agent 在較少人工監督下運作、並對其輸出更有信心，關鍵不在模型本身，而在模型之外那整套由提示詞、規則、文件、工具、檢查機制、測試、靜態分析與回饋迴圈構成的 **Harness** 控制系統。

---

## 二、章節脈絡

### Section 1｜Harness 是什麼：模型以外讓 Agent 能運作的一切

**重點摘要：** Fowler 將 Harness 定義為「模型之外、讓 Agent 能運作與被引導的一切」。在 Coding Agent 的情境中，模型本身不是全部；真正影響成果的還包括提示詞、規則、文件、工具、檢查機制、測試、靜態分析、審查流程與回饋迴圈。

**內容：**
- Harness 是 Coding Agent 工程實務中近一年最常被討論、卻最缺乏系統性定義的概念
- 作者刻意把模型本身排除在 Harness 之外——模型是引擎，Harness 是讓引擎得以發揮的整套底盤
- 涵蓋範圍：提示詞（Prompt）、規則（Rules）、文件（Docs）、工具（Tools）、檢查機制、測試、靜態分析、審查流程、回饋迴圈（Feedback Loop）
- 與既有概念的對應：Harness 近似於傳統 CI/CD Pipeline + Linter + 測試套件 + 程式碼審查流程的 AI 時代延伸

> 「Harness 是模型以外、讓 Agent 能運作與被引導的一切。」

### Section 2｜好 Harness 的兩個目的：第一次就對、能自我修正

**重點摘要：** 一個設計良好的 Harness 有兩個目的——提高 Agent 第一次就做對的機率；以及在結果交到人類眼前之前，盡可能讓 Agent 透過回饋自行修正問題。這兩個目的直接降低人工審查負擔、提升系統品質，也減少浪費的 Token。

**內容：**
- 目的 A：**First-time-right**——透過事前引導提高 Agent 第一次就產出可用結果的機率
- 目的 B：**Self-correction**——透過事後感測讓 Agent 在到達人類審查前先修正可被自動發現的錯誤
- 兩個目的都直接對應到傳統軟體工程的兩個成本軸線：審查成本與 Token 浪費

### Section 3｜控制的第一個維度：Feedforward vs Feedback

**重點摘要：** Fowler 把 Harness 的控制方式分成兩類——**Feedforward（事前引導）** 是在 Agent 行動之前先給它規則、文件、約束、範例與操作指南；**Feedback（事後感測）** 是在 Agent 行動之後用測試、Lint、型別檢查、靜態分析、審查 Agent、瀏覽器結果、Log 等方式發現問題並讓 Agent 修正。

**內容：**

| 維度 | 時機 | 工具/形式 | 目標 |
|------|------|-----------|------|
| **Feedforward**（事前引導） | Agent 行動之前 | 規則、文件、約束、範例、操作指南 | 提高 Agent 一開始就產出正確結果的機率 |
| **Feedback**（事後感測） | Agent 行動之後 | 測試、Lint、型別檢查、靜態分析、審查 Agent、瀏覽器結果、Log | 發現問題並讓 Agent 根據訊號修正 |

- 只有 Feedback：Agent 可能一直重複犯同樣的錯
- 只有 Feedforward：Agent 可能有很多規則，卻不知道這些規則是否真的有效
- 好的 Harness 需要兩者搭配

> 「只有 Feedback，Agent 可能一直重複犯同樣的錯。只有 Feedforward，Agent 可能有很多規則，卻不知道這些規則是否真的有效。好的 Harness 需要兩者搭配。」

### Section 4｜控制的第二個維度：Computational vs Inferential

**重點摘要：** 上述 Guides 與 Sensors 還可進一步分成兩種執行型態——**Computational**（確定性、快速、可重複的檢查：測試、Lint、型別檢查、靜態分析、架構規則）便宜可靠，適合在每次變更時執行；**Inferential**（語意判斷型工具：AI Code Review、LLM as Judge、語意分析）較昂貴、較慢、也較不確定，但能處理傳統工具難以判斷的問題。

**內容：**

| 類型 | 特性 | 範例 | 成本 |
|------|------|------|------|
| **Computational** | 確定性、快速、可重複 | 測試、Lint、型別檢查、靜態分析、架構規則檢查 | 便宜、可靠、適合每次變更執行 |
| **Inferential** | 語意判斷 | AI Code Review、LLM as Judge、語意分析 | 較貴、較慢、較不確定 |

- Computational Sensors 應該盡量靠近開發流程前段（提交前、Lint、快速測試）
- Inferential Sensors 應該選擇性使用在需要語意判斷的地方（整合後、Pipeline 中）
- Inferential Sensors 處理的問題：設計是否過度複雜、測試是否語意重複、解法是否符合需求脈絡

### Section 5｜人類的工作：從手動修正轉向改善 Harness

**重點摘要：** 人類開發者的角色不是只負責檢查 Agent 的輸出，而是觀察 Agent 反覆出現的錯誤並改善 Harness。重複出現的問題應轉化為更好的規則、Skill、文件、Linter、測試、審查流程、自動修正迴圈。AI 本身也可以協助建立 Harness（產生結構測試、從錯誤模式整理規則、建立自訂 Linter、從既有程式碼歸納 How-to 文件）。

**內容：**
- 重複發生問題 → 轉化為：更好的規則 / 更好的 Skill / 更好的文件 / 更好的 Linter / 更好的測試 / 更好的審查流程 / 更好的自動修正迴圈
- 人類工作逐漸從「每次手動修正結果」轉向「改善讓 Agent 不再犯同樣錯的環境」
- AI 協助建立 Harness 的具體方式：
  - 從錯誤模式整理規則
  - 幫忙產生結構測試
  - 建立自訂 Linter
  - 從既有程式碼歸納 How-to 文件

### Section 6｜三種 Harness 類型：Maintainability / Architecture Fitness / Behaviour

**重點摘要：** Fowler 提出三種 Harness 類型，依困難度遞增。**Maintainability Harness** 最容易建構（已有大量成熟工具）；**Architecture Fitness Harness** 用來定義與檢查架構特性；**Behaviour Harness** 最困難——它要回答「系統功能行為是否真的符合需求」，目前常見做法是規格作為 Feedforward、AI 產生的測試/覆蓋率/Mutation Testing/人工測試作為 Feedback，但作者認為單靠 AI 產生測試還不夠可靠。

**內容：**

| 類型 | 處理問題 | 困難度 | 現有工具/做法 |
|------|----------|--------|---------------|
| **Maintainability Harness** | 重複程式碼、圈複雜度、測試覆蓋不足、架構漂移、風格違規 | 低（最容易建構，已有大量成熟工具）| Linter、複雜度分析、覆蓋率工具 |
| **Architecture Fitness Harness** | 效能、可觀測性、Logging、模組邊界、依賴方向 | 中 | 架構規則檢查、模組依賴分析 |
| **Behaviour Harness** | 系統功能行為是否真的符合需求 | 高（最困難，尚未完全解決）| 規格作為 Feedforward + AI 測試/覆蓋率/Mutation Testing/人工測試作為 Feedback |

### Section 7｜Harnessability：不同程式碼庫的 Harness 難度

**重點摘要：** 不同程式碼庫的 Harnessability 不同——強型別語言天然提供型別檢查作為 Sensor；清楚的模組邊界讓架構規則更容易定義；成熟框架能抽象掉許多細節，降低 Agent 犯錯機率。相反地，Legacy 系統、技術債高、結構混亂、缺乏測試與邊界的程式碼庫，通常最需要 Harness，但也最難建立。

**內容：**
- 高 Harnessability 特徵：
  - 強型別語言（TypeScript、Rust、Go）→ 型別檢查 = 內建 Computational Sensor
  - 清楚的模組邊界 → 架構規則容易定義
  - 成熟框架（NestJS、Spring、Rails）→ 抽象掉細節，Agent 犯錯機率降低
- 低 Harnessability 特徵：
  - Legacy 系統
  - 技術債高
  - 結構混亂、缺乏測試、缺乏模組邊界
- 矛盾點：最需要 Harness 的程式碼庫，往往也是最難建立 Harness 的

### Section 8｜Harness Templates：企業服務拓撲的未來

**重點摘要：** 作者預測企業常見的服務拓撲未來可能演化成 Harness Templates——例如透過 API 暴露資料的商業服務、事件處理服務、資料儀表板，這些原本可能已有 Service Template，未來可進一步包裝成 Harness Template（內含結構、技術棧、規則、文件、測試、Sensors 與 Guides）。團隊甚至可能根據「某個技術棧是否已有良好的 Harness」來選擇技術架構。

**內容：**
- 演進路徑：Service Template → Harness Template（加上 Sensors 與 Guides）
- 三種典型企業服務型態：
  - API 暴露資料的商業服務
  - 事件處理服務
  - 資料儀表板
- 預測：未來團隊選技術棧的決策標準之一可能是「這個技術棧是否已有良好的 Harness」

### Section 9｜人類作為隱性 Harness + Harness Engineering 的真正遺產

**重點摘要：** 人類開發者本身就像一種隱性 Harness——知道團隊慣例、組織目標、技術債哪些可以接受、哪些不該接受，也知道什麼樣的程式碼在這個脈絡下算是「好」。Coding Agent 沒有這些東西：沒有社會責任感，不會因為寫出 300 行函式而感到不適，也不一定知道某個技術選擇雖然正確但不符合團隊方向。Harness 的目標不是完全消除人類，而是把人類注意力導向最重要的地方。Harness Engineering 是一種逐漸成形的工程實務，重點不是單一功能（Skill、MCP Server、Linter、測試工具），而是把 Guides、Sensors、Feedforward、Feedback、自動修正迴圈與人類審查組合成一套可信的控制系統。

**內容：**
- 隱性 Harness = 人類開發者對團隊與組織的深層理解
- Coding Agent 的限制：沒有社會責任感、不會因反模式感到不適、不一定知道技術選擇是否符合團隊方向
- Harness 的真正目標：不是消除人類，而是把人類注意力導向高價值判斷
- Harness Engineering = 逐漸成形的工程實務，不是單次設定
- 核心組合：Guides + Sensors + Feedforward + Feedback + 自動修正迴圈 + 人類審查 → 可信的控制系統

> 「Coding Agent 沒有社會責任感，不會因為寫出 300 行函式而感到不適，也不一定知道某個技術選擇雖然正確，但不符合團隊方向。」

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone `xiaotian_clone_v1`，model `speech-2.8-hd`），約 3 分鐘
> 口播稿原文：transcripts/20260626_MartinFowler_HarnessEngineering_口播稿.txt

- [opus](../audio/20260626_MartinFowler_HarnessEngineering.opus)（Telegram 友善）
- [m4a](../audio/20260626_MartinFowler_HarnessEngineering.m4a)（iOS 友善）
- [mp3](../audio/20260626_MartinFowler_HarnessEngineering.mp3)（通用格式）

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處 |
|------|------|------|
| **Harness** | 模型以外，讓 Agent 能運作與被引導的一切（提示詞、規則、文件、工具、檢查機制、測試、靜態分析、審查流程、回饋迴圈） | Section 1 |
| **Feedforward** | 事前引導：在 Agent 行動之前給它規則、文件、約束、範例與操作指南，提高第一次就對的機率 | Section 3 |
| **Feedback** | 事後感測：在 Agent 行動之後用測試、Lint、型別檢查、靜態分析、審查 Agent、Log 等方式發現問題並讓 Agent 修正 | Section 3 |
| **Computational Sensor/Guide** | 確定性、快速、可重複的檢查與工具（測試、Lint、型別檢查、靜態分析、架構規則檢查） | Section 4 |
| **Inferential Sensor/Guide** | 語意判斷型工具（AI Code Review、LLM as Judge、語意分析） | Section 4 |
| **Maintainability Harness** | 維護性 Harness：處理重複程式碼、圈複雜度、測試覆蓋不足、架構漂移、風格違規 | Section 6 |
| **Architecture Fitness Harness** | 架構適配度 Harness：定義與檢查效能、可觀測性、Logging、模組邊界、依賴方向 | Section 6 |
| **Behaviour Harness** | 行為 Harness：檢查系統功能行為是否真的符合需求（最困難） | Section 6 |
| **Harnessability** | 程式碼庫能多容易被 Harness 改善的程度（強型別/清楚模組邊界/成熟框架 → 高） | Section 7 |
| **Harness Template** | 企業 Service Template 的 AI 延伸，內含結構、技術棧、規則、文件、測試、Sensors 與 Guides | Section 8 |
| **隱性 Harness** | 人類開發者本身：對團隊慣例、組織目標、技術債邊界的深層理解 | Section 9 |

---

## 四、核心主旨

> 真正決定 Coding Agent 表現的不是模型，而是模型之外那整套 Harness；好的 Harness 把 Feedforward（事前引導）與 Feedback（事後感測）、Computational（確定性檢查）與 Inferential（語意判斷）組合成可信的控制系統，讓人類從「每次手動修正結果」轉向「持續改善讓 Agent 不再犯錯的環境」。

---

## 五、金句摘錄

1. 「Harness 是模型以外、讓 Agent 能運作與被引導的一切。」
2. 「好的 Harness 有兩個目的：提高 Agent 第一次就做對的機率，並在結果交到人類眼前之前，盡可能讓 Agent 透過回饋自行修正問題。」
3. 「只有 Feedback，Agent 可能一直重複犯同樣的錯。只有 Feedforward，Agent 可能有很多規則，卻不知道這些規則是否真的有效。好的 Harness 需要兩者搭配。」
4. 「人類開發者本身也像一種隱性的 Harness。」
5. 「Coding Agent 沒有社會責任感，不會因為寫出 300 行函式而感到不適，也不一定知道某個技術選擇雖然正確，但不符合團隊方向。」
6. 「Harness Engineering 的重點不是單一功能，例如 Skill、MCP Server、Linter 或測試工具，而是把 Guides、Sensors、Feedforward、Feedback、自動修正迴圈與人類審查組合成一套可信的控制系統。」

---

## 六、延伸閱讀

- [Martin Fowler — Harness Engineering（英文原文）](https://martinfowler.com/articles/harness-engineering.html)
- [doggy8088 / Will 保哥 — Harness Engineering 中文重點整理 Gist](https://gist.github.com/doggy8088/31ef72afb7945efba79c6a2e0b3b82e1)
- 同主題影片筆記：
  - 2026-04-12 李宏毅《Harness Engineering 駕馭工程》（92 分鐘課堂錄影）
  - 2026-06-17 Ryan Lopopolo（OpenAI）《Harness Engineering: How to Build Software When Humans Steer, Agents Execute》（46 分鐘訪談）
  - 2026-05-22 Tejas《AI Harnesses: Building Reliable AI Agents》（18 分鐘技術講座）
  - 2026-05-28《Claude Code Workflow 自動生成 Harness》（技術文章）
- 延伸概念：CI/CD 演進史、12-Factor Agents、AI Code Review、Mutation Testing、Architecture Decision Records（ADR）
