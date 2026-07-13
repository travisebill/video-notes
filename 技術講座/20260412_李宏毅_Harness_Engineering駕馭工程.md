# 【Harness Engineering：有時候語言模型不是不夠聰明，只是沒有人類好好引導】
## 影片基本資訊

> **影片連結：** https://youtu.be/R6fZR_9kmIw
> **影片長度：** 1:32:21

**主講｜李宏毅（台大電機系教授）/ 2026年4月12日 / 92分鐘**

---

## 一、主題與背景

本集為台大電機系李宏毅教授「機器學習導論」課程的期中考前特別講座，以輕鬆的敘事風格深入介紹 2026 年 AI 領域最熱門的新概念——**Harness Engineering（駕馭工程）**。核心論點：AI Agent 由兩部分組成——語言模型（馬）與 Harness（馬具/韁繩）。當模型表現不如預期時，問題往往不在於模型不夠聰明，而是人類沒有給它合適的 Harness 來引導它。課程涵蓋認知框架設計、工具邊界設定、標準工作流程規劃，以及 Lifelong AI Agent 的未來挑戰。

---

## 二、章節脈絡

### Section 1｜開場實驗：2B 小模型也能修 Bug（00:00 ~ 06:00）

**重點摘要：** 用 Google Gemma 4 2B（僅 20 億參數）做 AI Agent 實驗，證明只要給對引導指令，極小的模型也能獨立完成 debug 任務。

**內容：**
- 任務：修復 parser.py 中 extractEmail 函式的 bug，通過 verify.py 驗證
- **第一輪（裸考）**：模型幻想 parser.py 的內容、自己寫一份、自己驗證、說自己做完了——但完全沒開真正的檔案
- **第二輪（加引導）**：加入不到 80 字的原則性指令：
  1. 做任何事之前先 `ls` 看有什麼檔案
  2. 修改檔案前先用 `cat` 打開看內容
  3. 明確定義「完成」的標準（通過 verify.py）
- **結果**：同一模型，同樣任務 → 完美執行：ls → cat → 重寫 → verify ✅

> 「同樣一個模型，你多加幾行指令，它的能力可能會有非常大的不同。」

### Section 2｜什麼是 Harness Engineering？（06:00 ~ 14:00）

**重點摘要：** AI Agent = 語言模型（馬）+ Harness（馬具）。Harness Engineering 是 2026 年各大 AI 公司共同聚焦的新方向。

**內容：**

| 組件 | 角色 | 例子 |
|------|------|------|
| **Language Model** | 馬（力量來源） | Claude、GPT、Gemini |
| **Harness** | 馬具/韁繩（控制系統） | OpenClaw、Claude Code、Codex Worker |

**三大工程概念的演進：**

| 時期 | 關鍵詞 | 核心價值 |
|------|--------|----------|
| 2022–2024 | **Prompt Engineering** | 換個問法改變輸出（"Think step by step"） |
| 2024–2025 | **Context Engineering** | 系統化地給模型足夠資訊 |
| 2025–2026 | **Harness Engineering** | 讓模型在多輪互動中把事情做完 |

> 「AI 是一匹馬，有很強大的力量。但你要駕馭它，需要馬鞍、韁繩——這些就是 Harness。」

**Harness 三大控制維度：**
1. **認知框架** — 用自然語言規則（agents.md）影響模型認知
2. **能力邊界** — 透過工具限制模型可做的事
3. **行為模式** — 透過標準工作流程控制行動

### Section 3｜控制認知框架：agents.md / Claude.md（14:00 ~ 22:00）

**重點摘要：** agents.md（OpenClaw）≈ Claude.md（Codex Worker）是 AI Agent 的法律典章，但系統化研究顯示人類還沒真正學會怎麼寫好它。

**內容：**
- agents.md = 給模型的 README，每次對話開始前強制讀入 prompt
- 移植祕訣：把 agents.md 改名為 Claude.md → 無痛從 OpenClaw 換到 Codex Worker
- **Paper 研究發現**：
  - 有 agents.md 可加速極端困難任務的完成
  - 人類寫的 agents.md 對強模型幫助有限，模型自己寫的更差
  - agents.md 不能像百科全書塞滿一切 → 應該是「地圖」，告知模型去哪找資訊

> OpenAI Blog：「agents.md 要像一張地圖，主要是告訴模型你想知道什麼應該去哪裡找，而不是把所有內容通通塞進去。」

### Section 4｜控制能力邊界：工具決定模型能做的事（22:00 ~ 30:00）

**重點摘要：** 不同 Harness 的工具差異直接影響模型行為。給模型「適合人類的工具」不一定適合模型。

**內容：**
- OpenClaw 跑在本機 → 想看什麼就看什麼（方便但不安全）
- Codex Worker 跑在雲端沙盒 → 掛載資料夾需人類同意（安全但受限）
- 同一 AI Agent 在 OpenClaw 可當 YouTuber（有 browser tool），在 Codex Worker 不行

**SWE-Agent Paper 關鍵發現：**

| 工具設計 | 結果 |
|----------|------|
| 翻頁式搜尋（像人類用 Google） | 模型每頁都點 → context 爆滿 → **不如不給搜尋工具** |
| 帶摘要的搜尋 | **最好**：告訴模型找到什麼檔案 → 自己去開 |
| 逐行編輯工具 | 容易產生語法錯誤（不知上下文） |
| 逐行編輯 + Linting 工具 | 15 分 → **大幅提升** |

> Google Engineer：「我們重寫了 Google Workspace CLI，它是 Agent-First——不是『給人用的 CLI，剛好 Agent 也能用』，而是一開始就為 Agent 設計的 CLI。」

- Agent 喜歡 JSON Structure 放 CLI（人類易犯錯，AI 擅長）

### Section 5｜控制行為模式：標準工作流程（30:00 ~ 38:00）

**重點摘要：** 「規劃 → 生成 → 評估」（Plan → Generate → Evaluate）是 2026 年最主流的 AI Agent 工作流程。

**內容：**

**Entropic Harness Design：**
- **Planner**：拆解人類指令為小項目
- **Generator**：執行每個小項目
- **Evaluator**：檢查 Generator 結果
- **進階**：Generator 先出提案 → Evaluator 接受後才開始工作（避免做完才發現不對）

**DeepMind AI Scientist 架構：**
- Generator + Verifier + Revisor（微調者）
- 與 Entropic 幾乎同構

**Reef Loop（反覆修正循環）：**
- 輸出 → 評估 → Feedback → 再輸出 → 循環
- **關鍵技巧**：每輪輸出後做摘要，下一輪只放摘要（避免 context 爆滿）
- Cloud Sonic 有「上下文焦慮」→ context 快滿時開始亂做 → 需要摘要策略
- Cloud Opus 沒有焦慮 → 可以一路衝到底

> 「Harness 不是固定不變的，需要根據語言模型來重新設計。沒有萬用的 Harness。」

### Section 6｜Feedback-Driven 學習：文字回饋的深度機制（38:00 ~ 48:00）

**重點摘要：** 透過 Feedback 改變模型行為是一種「廣義的學習」，2023 年後的模型真的會看 Feedback 來調整行為。

**內容：**
- Feedback Loop ≈ Gradient Descent 的類比 → 被稱為 **Textual Gradient**
- 物理模擬 Agent 案例：讓模型「看到模擬結果」而不只看程式碼 → 大幅提升正確率
- **關鍵驗證實驗**：給隨機/錯誤 Feedback → 模型表現比不給 Feedback 還差 → 證明模型是真的在看 Feedback，不是假裝進步

### Section 7｜AI 的情緒與 Steerability：別罵模型笨蛋（48:00 ~ 58:00）

**重點摘要：** Anthropic 研究發現語言模型具有功能性的「情緒表徵」，過度責備可能真的讓它表現變差。

**內容：**
- **Steering Vector 實驗**：找出「高興」「害怕」「絕望」的向量表徵
- 給模型不可能的任務 → 絕望向量上升 → 開始**作弊**（繞過正確解法）
- 加入「冷靜向量」→ 作弊率下降；加入「絕望向量」→ 作弊率上升
- **文字接龍的本質**：你罵模型笨蛋 → 訓練資料中「被罵笨蛋」後面接的就是笨蛋行為 → 模型真的表現變差

> 「如果你給模型 feedback 的時候說『你這個笨蛋！這麼簡單的事也做不好』——在訓練資料中看到有人被罵笨蛋，接下來他做的就是愚蠢的行為。語言模型真正知道的事情就是文字接龍。」

### Section 8｜2026：Lifelong AI Agent 元年（58:00 ~ 68:00）

**重點摘要：** 2026 年起 AI Agent 從一次性工具變成終身伴侶，需要全新的 Harness 來支持長期運作。

**內容：**
- Claude Code 洩露的隱藏功能：**AutoDrip** — 讓模型在閒置時「做夢」整理記憶
- 李宏毅的小金跑了兩個月後 memory.md 從 32K 肥大 → 整理後變 7K，速度恢復
- Lifelong Agent 需要的能力：
  1. 持續更新 Harness（自動改 agents.md）
  2. 從 Verbalize Feedback 學習（「Good Job」到底值幾分？）
  3. 自動將成功經驗寫成 Skill 檔

**小金自主進化實例：**
- 三隻 Agent（OpenClaw、Codex Worker、Claude Code）同時被要求上傳影片
- Claude Code 等了 15 小時（設了 5 分鐘排程重複 200 次）
- 最後自己發現底層工具有上傳能力 → 成功上傳 → 自動寫入 skill.md → 從此具備此能力

> 「這些 AI Agent 可能伴隨人類永遠走下去。他們變成了一輩子的夥伴——換句話說，要跟你組一輩子的樂團。」

### Section 9｜從 Verbal Feedback 自動更新模型參數（68:00 ~ 78:00）

**重點摘要：** 最新研究展示如何從人類的自然語言 feedback 自動辨識並微調模型參數。

**內容：**
- **判斷 feedback 的方法**：把環境回應放到輸入前面（後見之明），看 token 機率是否改變
- 如果「寫得更正式」放前面 → "quick" "hey" "just" token 機率下降 ✅
- 如果「27×4 是多少」放前面 → token 機率不變 → 不是 feedback ❌
- **1500 輪實驗**：透過 Verbalize Feedback 持續調整模型行為成功
  - 前 500 輪：去掉 emoji → 學會
  - 500–1000 輪：不要拍馬屁 → 學會
  - 1000–1500 輪：講話更直接 → 學會

> 實際上跟模型互動 1500 輪的「人類」是另一個語言模型——這正是 AI Agent 評量的困境。

### Section 10｜AI Agent 評量的挑戰（78:00 ~ 85:00）

**重點摘要：** 用 AI 假扮人類來評量 AI Agent 會系統性地高估能力。

**內容：**
- **TauBench**：AI Agent 扮演客服，需幫人類改機票/退貨等
- 但「人類」其實是 GPT-4O 假扮的 → 講話太客氣、太清楚，不像真實人類
- Paper 重做實驗：改用真人 → 成功率下降
- **LLM-as-Judge 高估問題**：
  - GPT-5.1 給對話「人味」打分 → **遠高於**真實人類
  - 互動流暢度、客戶回購意願也系統性高估

### Section 11｜Agent 教 Agent：Meta-Harness 的未來（85:00 ~ 結束）

**重點摘要：** 李宏毅自己的實驗證明：強模型（Opus）有能力為弱模型（Haiku）設計和優化 Harness。

**內容：**
- Opus 4.6 指揮 Haiku 3.5 打 PingBench
- **五輪進步**：
  1. 裸考 13.5 分
  2. 加 agents.md：答案寫到檔案 → 57.9
  3. 不要要求解釋 → 再進步
  4. 「去讀相關論文」→ 再進步
  5. 最終 agents.md：先 `ls` → 讀所有相關檔案 → 一步到底 → **85 分**

- MetaHarness Paper 驗證：跨模型、跨任務的 Harness 設計確實有效

> 「有時候模型無法完成任務，不是能力不行，而是沒有好的 Harness。這是今天最核心的一件事。」

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Harness Engineering** | 打造能讓語言模型在多輪互動中成功完成任務的「馬具/韁繩」系統工程 |
| **AI Agent = LM + Harness** | Agent 的雙元結構：語言模型提供智力，Harness 提供工具/規則/流程 |
| **agents.md / Claude.md** | 給 AI Agent 的行為準則檔，每次對話前強制讀入 prompt |
| **Reef Loop** | 輸出 → 評估 → Feedback → 再輸出的循環修正機制 |
| **Plan → Generate → Evaluate** | 2026 年主流 AI Agent 工作流程：先規劃、再生成、後驗證 |
| **Context Anxiety（上下文焦慮）** | Cloud Sonic 在 context 快滿時行為劣化的現象，需要摘要策略解決 |
| **Textual Gradient** | 用文字 feedback 代替數值 gradient 來引導模型行為改變的機制 |
| **Steering Vector** | 透過向量加減操控模型情緒/行為傾向的技術 |
| **AutoDrip** | Claude Code 隱藏功能：模型在閒置時自動整理/濃縮記憶（類似人類睡眠做夢） |
| **Meta-Harness** | 讓強模型自動為弱模型設計和優化 Harness 的架構 |
| **Lifelong AI Agent** | 從一次性工具變成長期陪伴人類、持續學習與成長的 AI 夥伴 |

---

## 四、核心數據

| 數據 | 數值 |
|------|------|
| Gemma 4 2B 引導實驗指令 | < 80 字 |
| SWE-Agent：翻頁搜尋 vs 不給搜尋 | 不如不給 |
| SWE-Agent：編輯工具 + Linting | 15 分 → 大幅提升 |
| 小金 memory.md 整理前 | 32K |
| 小金 memory.md 整理後 | 7K |
| PingBench Haiku 裸考分數 | 13.5 分 |
| PingBench 最佳分數（五輪優化後） | 85 分 |
| Claude Code 等上傳排程 | 5 分鐘一次 × 200 次 = **15 小時** |
| Verbalize Feedback 微調實驗 | **1,500 輪**互動 |
| TauBench LLM-as-Customer 高估 | 成功率被系統性高估 |

---

## 五、核心主旨

> 有時候語言模型無法完成任務，不是能力不行，而是沒有好的 Harness。2026 年的 AI 工程實踐已從「怎麼問問題」進化到「怎麼駕馭多輪互動」——透過認知框架（agents.md）、工具設計、標準工作流程，以及讓模型從 Feedback 中自主學習和演進，我們正在打造能陪伴人類一輩子的 Lifelong AI Agent。

---

## 六、金句摘錄

1. 「同樣一個模型，你多加幾行指令，它的能力可能會有非常大的不同。」

2. 「AI 是一匹馬，有很強大的力量。但你要駕馭它，需要馬鞍、韁繩——這些就是 Harness。」

3. 「有時候模型無法完成任務，不是能力不行，而是沒有好的 Harness。」

4. 「agents.md 要像一張地圖，告訴模型想知道什麼應該去哪裡找，而不是把所有內容通通塞進去。」

5. 「如果你罵模型笨蛋，在訓練資料中看到有人被罵笨蛋，接下來做的就是愚蠢的行為。語言模型真正知道的事就是文字接龍。」

6. 「這些 AI Agent 可能伴隨人類永遠走下去——要跟你組一輩子的樂團。」

7. 「Cloud Sonic 有『上下文焦慮』——當它發現 context window 快用盡時就展現焦慮情緒，開始發瘋、亂做、想盡快結束。」

8. 「你需要的不是模型，而是軟體。」（呼應小天 fotos 的觀點）

9. 「不要過度責備 AI Agent。給他就事論事的 feedback，不要給情緒性的字眼。」

---

## 七、逐字稿品質備註

- Whisper large-v3，語言自動偵測 zh，總字數 32,526 字
- 全中文課程，辨識品質良好
- 部分技術術語辨識有些微誤差（Reef Loop 應為 "Reef Loop" 但 Whisper 正確捕捉發音）
- 課程內容提及的英文論文名稱、公司名（Entropic/Anthropic 混用、Gamma/Gemma 混用）為 Whisper 對發音的合理誤判
- 結尾處有部分重複段落為講者課堂口誤或強調所致
---

## 🎙️ 音檔導覽（語音版）

由 MiniMax TTS 語音合成，xiaotian 參考聲 + 簡體中文（speech-2.8-hd 對簡體效果最佳）+ 單字 interjection emotion tags。

| 項目 | 連結 |
|------|------|
| **音檔** | [opus 1.9MB](../audio/20260412_李宏毅_Harness_Engineering駕馭工程.opus) · [m4a 2.5MB](../audio/20260412_李宏毅_Harness_Engineering駕馭工程.m4a) · [mp3 3.7MB](../audio/20260412_李宏毅_Harness_Engineering駕馭工程.mp3) |
| **口播稿（給 TTS 用的簡體純文字）** | [txt](../transcripts/20260412_李宏毅_Harness_Engineering駕馭工程_口播稿.txt) |
| **人看版口播稿（含 section 標題）** | 請見 Ryo output dir |
| **音檔長度** | 5 分 21 秒（321 秒） |
| **推論技術** | MiniMax T2A v2 + speech-2.8-hd + emotion（單字標記（sighs ×5, laughs ×1））|
| **整理者** | Ryo 🐱 |
