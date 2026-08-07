# 【Stanford CS329A — Part 1 — Course Overview】

**講者｜Akanksha Sreyas（Stanford 兼任教授／Reflection AI 研究員）& Azalia Mirhoseini（Stanford CS 系助理教授）**
**影片連結｜https://www.youtube.com/watch?v=6YnLB0XbTnI**
**影片長度**｜1:09:42（4182s）
**發布日期｜2026-08-03**

---

## 主題與背景

本片為 Stanford CS329A 秋季課程「Self-Improving AI Agents」的第一堂「Course Overview」，由兩位講者——Akanksha Sreyas（兼任 Stanford 教授、Reflection AI 研究員，曾任 Google Brain）與 Azalia Mirhoseini（Stanford CS 系助理教授，橫跨 Cod、Anthropic、Gemini、DeepMind）——共同授課。她們於課堂開場即自我介紹，並提到這是**第二次**教授本課程，內容相較去年已有大幅更新，包括講章重新編排、評量方式多了一份 homework，以及 industry guest lectures 的擴大。

學生組成以碩士班為主，少數博班與大學部，這個分佈呼應了 Stanford 近年對 AI 工程師職涯發展的重視。課堂採取互動式授課，學生可以在中段提問，兩位講者也針對 CoT 是否 baked-in、reasoning 模型是否需要換模型、temperature 上限等細節進行了相當深入的答辯。

整堂 70 分鐘可拆成三大段：

1. **大型語言模型（LLM）回顧（00:00 ~ 48:30）**——Scaling Laws 三軸（參數／資料／算力）、Few-shot Learning、Chain-of-Thought 湧現、Pre-training／Instruction Tuning／RLHF 三階段、Inference Scaling（Large Language Monkeys）、Reasoning Models（o1、o3、DeepSeek、Gemini Thinking）。
2. **從 LLM 到 Self-Improving AI Agents（48:30 ~ 62:00）**——Agent 與 Chatbot 的差異、Agentic Workflows 六原語、實際應用（Deep Research、Claude Code、Customer Support、Research Agents、AI Scientist）。
3. **課程行政（Logistics，62:00 ~ 結束）**——3 份作業（佔 50%）、1 份 Course Project（佔 50%）、團隊 1-4 人、API Credits、Poster Presentation、Grading Rubric、Honor Code。

> **核心訊息**：在 frontier 模型參數量趨近飽和（GPT-4 約 1T、訓練成本已達天文數字）的當下，「**自我改進（Self-Improvement）**」成為主要突破方向——透過 Inference Scaling 產生大量合成 trace／程式／解題資料，再回灌到 pre-training 或 fine-tuning 循環，形成**自我改進迴路（Self-Improving Loop）**。CS329A 的整個學期都在圍繞如何把這條迴路具象化、實作化。

---

## 章節脈絡

### Section 1｜課程介紹 & Scaling Laws 概觀 (00:00 ~ 05:30)
開場自我介紹完畢後，Akanksha 直接切入 LLM 三大 Scaling Laws：參數量、資料集大小、訓練算力。三者皆與 test loss 呈冪次下降關係，這個經驗法則奠定了 2018-2024 年所有 frontier 模型（BERT-340M → GPT-2-1.5B → GPT-3-175B → PaLM-540B → GPT-4 ~1T）的指數級成長動能。她特別強調：「**Large stands for they're growing in size**」——這也意味著我們正在逼近一個物理與經濟極限：更大模型不一定能繼續帶來等比例提升。

### Section 2｜Emergent Behavior & Few-shot / Chain-of-Thought (05:30 ~ 12:30)
模型變大後浮現三項關鍵能力：

- **Zero-shot Learning**：給任務描述（如「Translate English to French」），模型就能直接產出答案。
- **Few-shot Learning**：在 prompt 中提供幾個範例，模型可跟隨範例格式推理，免去 fine-tune。
- **Emergent Reasoning**：Chain-of-Thought 能力只在大型模型（PaLM-540B 等級）突然出現，8B 以下幾乎為零。這項特性後來成為 reasoning 模型的基石。課堂舉了經典 Roger 有五顆網球的題目，展示模型如何自己生成步驟「5 + 6 = 11」而非直接給答案。

> Azalia：「This property shows up as we have larger and larger models. As they become larger, they suddenly solve mod arithmetic or word unscramble better——all of a sudden it appears at a certain size.」

### Section 3｜Pre-training / Fine-tuning / RLHF 三階段 (12:30 ~ 24:00)
拆解 ChatGPT 之所以大幅領先 GPT-3 的三塊基石：

- **Pre-training**：海量網路／書籍文本的 next-token prediction，是「最容易」但成本最高的一步。
- **Fine-tuning（Supervised）**：用高質量資料（書、創意散文、付費 corpora，動輒百萬美元授權費）做監督式微調。
- **Instruction Tuning**：以 (instruction, answer) 配對（含 CoT 資料）做 fine-tuning，讓模型學會「聽指令」、能與人類對話。
- **RLHF / RLAIF**：請人類或 AI 評分模型輸出（正確性、helpful、無害等維度），訓練 Reward Model，再用 PPO／RLAIF 引導 LLM 對齊人類價值。

每階段的**資料品質與 curation effort**直接決定最終模型表現——這也是為什麼 data-centric AI 在 2024 後重新被業界重視。

### Section 4｜Inference Scaling & Large Language Monkeys (24:00 ~ 34:00)
Akanksha 提出「**Inference 是新的 frontier**」：不改動模型參數，只在推論時**平行取樣 N 次**（用 temperature 控制多樣性），再以 verifier 選出正確答案。實驗結果：

- Llama 3 8B 單次取樣遠輸 GPT-4o，但取樣到約 100 次即可追上；
- 10,000 次取樣在困難數學／IMO 等級題目上仍能持續提升（log-linear scaling）；
- 對某些問題，10,000 個解中可能只有 3-4 個正確，凸顯 verification 的重要性。

她也澄清了學生的兩個常見疑問：
1. **latency**：平行取樣可同時跑，不增加 wall-clock 太多，主要 trade-off 是**算力成本**；
2. **temperature**：上限通常 ~1.2，過高會生成 gibberish。

### Section 5｜Reasoning Models（o1、o3、DeepSeek、Gemini Thinking） (34:00 ~ 48:30)
Reasoning 模型與一般 LLM 的核心差異在於模型**自己生成** CoT，並內建四個能力：

| 能力 | 說明 |
|------|------|
| Problem Analysis | 先拆解問題要素（input/output 格式、edge cases） |
| Task Decomposition | 把任務切成更小、可處理的 subtask |
| Self-Evolution Strategies | 嘗試 → 看 feedback（執行 unit test、calculator、LLM-judge）→ 優化 |
| Self-Correction / Alternative Proposals | trace 中發現錯誤就回頭重試 |

Azalia 展示 o1 寫 bash script 的 trace：模型會自言「Wait, 這裡有錯…」，並重新思考。OpenAI o1 釋出時，在 AIME 數學題上展現 **log-linear scaling**——僅增加 test-time compute 就能穩定拉高 pass@1，這與「Inference Scaling」一脈相承。

> 學生問：「推理時是不是要把 reasoning 跟 final answer 拆給不同模型？」  
> 答：「Reasoning 能力隨模型大小成長，反而是小模型摘要大模型 traces 比較常見；模型**偏好自己的 traces**（self-preference）也是個值得研究的現象。」

> 學生問：「Reasoning 是 emergent 還是訓練出來的？」  
> 答：「Chain-of-Thought 原本是 emergent；Reasoning Models 則是**刻意訓練**它『何時該深度思考、何時該快速作答』。」

### Section 6｜LLM → Agents：Agentic Workflows (48:30 ~ 62:00)
Azalia 直接點出**LLM 與 Agent 的本質差異**：

> 「LLM as a chatbot is fun but doesn't accomplish a task for you. This year, agents like Claude Code or Deep Research enable real-world workflows.」

Agent 三元素：

- **Goal**（目標）：使用者給定一個 end-to-end 目標（找房子、研究主題、debug 程式）。
- **Action**（動作）：模型主動呼叫 tool（搜尋、讀檔、執行 shell）。
- **Feedback**（回饋）：從環境或 verifier 拿到結果，據以修正下一步。

現實中多半採「**半開放**」設計，組合六種 Workflow 原語：

| 原語 | 用途 | 典型應用 |
|------|------|----------|
| Prompt Chaining | 任務分解成 subtask | 報告生成 multi-step |
| Routing | 簡單／複雜分流 | 客服自動分流 |
| Parallelization | 平行 LLM calls | Deep Research 多關鍵字 |
| Orchestrator | 中心 LLM 規劃 | Claude Code 的 plan mode |
| Evaluator / Judge | LLM-as-Judge 評估產出 | 自動 code review |
| Verifier | 跑 unit test 等可驗證訊號 | 程式解題、數學驗算 |

三個已落地場景：

1. **Coding Agents**（Claude Code、Codex）：code migration、版本升級、repo 重構、unit test 生成。  
2. **Customer Support Agents**：live transcription、knowledge assist、smart replies、call summary。  
3. **Research Agents**：Deep Research（文獻綜述）、The AI Scientist（自動腦力激盪 + 實驗迭代 + 論文撰寫）。

> Azalia：「Generator-verifier gap——it's easy for models to generate sensible content, but whether it's useful, we need a feedback loop. In creative writing, human feedback becomes the bottleneck.」  
> 這也是本學期會強調**驗證（Verification）**這個瓶頸的原因——有 verifier 的 math / code / rule-based 領域進步最快。

### Section 7｜Course Logistics (62:00 ~ 結束)
- **3 份 Homework = 50% 總成績**（比去年多 1 份，TA 團隊加碼設計），鼓勵學生把概念動手做一次。
- **Course Project = 50%**，**1-4 人一組**（最低 1 人，建議組隊以共用 API credits 與互補能力）。
- **里程碑**：
  - Project Proposal（約 **10 月初**）
  - Midterm Project Presentation（**兩週後需有實驗進度**）
  - Final Report
  - **Poster Presentation = 12/12 16:00-18:00**
- **可接受題目**：新 benchmark、agentic system reliability 改進、論文 hill-climb、The AI Scientist-style 自主研究。
- **不接受**：純 survey paper、純 live coding demo、純 app demo（必須有 hypothesis、有實驗、有分析）。
- **去年成果**：有學生把 project 延伸成 conference paper 投稿成功，鼓勵本屆跟進。
- **行政**：
  - 網站：`cs329a.stanford.edu`
  - Canvas：最新公告
  - Ed Stem：公開問答（鼓勵 broadcast 讓其他同學也看到）
  - GradeScope：繳交 homework / project milestones
  - **Honor Code 嚴格執行**
  - Audit 不開放，但影片日後會放 YouTube
  - Late days 額度有限，因班級大不開例外

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 5 分鐘
> 口播稿原文：transcripts/20260803_stanford_cs329a_口播稿.txt

- [opus ~1.6 MB](../audio/20260803_stanford_cs329a.opus)（Telegram 友善）
- [m4a ~3.2 MB](../audio/20260803_stanford_cs329a.m4a)（iOS 友善）
- [mp3 ~3.2 MB](../audio/20260803_stanford_cs329a.mp3)（通用格式）

---

## 關鍵概念定義

| 概念 | 英文 | 定義 |
|------|------|------|
| Scaling Laws | Scaling Laws | 模型 loss 隨參數量／資料量／算力呈冪次下降的經驗關係，是 2018-2024 訓練 LLM 的核心動能；2024 後逼近自然飽和 |
| Few-shot Learning | Few-shot Learning | 在 prompt 中提供少量範例，模型即可跟隨範例格式推理，免去 fine-tune |
| Zero-shot Learning | Zero-shot Learning | 模型在未見過該任務的情況下，僅憑任務描述即可作答 |
| Chain-of-Thought (CoT) | Chain-of-Thought | 在 prompt 中示範／讓模型自己產出推理步驟，提升邏輯與數學表現，屬 emergent behavior |
| Emergent Behavior | Emergent Behavior | 模型在規模超過某個 threshold 後突然湧現的能力，事前無法精確預測 |
| Instruction Tuning | Instruction Tuning | 在 (instruction, answer) 配對資料上 fine-tune，讓模型學會「聽指令」並以對話形式互動 |
| RLHF | Reinforcement Learning from Human Feedback | 用人類評分資料訓練 Reward Model，再以 RL 引導 LLM 對齊人類價值 |
| RLAIF | Reinforcement Learning from AI Feedback | 上述流程的 AI 評分變體，可降低對人類標註的依賴 |
| Inference Scaling | Inference Scaling / Test-Time Compute Scaling | 推論時不改參數，透過多次取樣／搜尋／驗證拉高性能；2024 後的新 frontier |
| Large Language Monkeys | Large Language Monkeys | Stanford 提出的平行取樣法，論證小模型在 verifier 輔助下能超越大模型 |
| Temperature Sampling | Temperature Sampling | 控制 LLM 取樣多樣性的超參數；上限通常 ~1.2，過高會 gibberish |
| Reasoning Model | Reasoning Model（如 o1、o3、DeepSeek-R1） | 模型在內部生成 CoT 與自我修正 trace，pass@1 隨 test-time compute 對數線性成長 |
| Verifier | Verifier | 對 LLM 輸出給出二元（pass/fail）或評分的函式，常用 unit test、symbolic check、LLM-as-Judge |
| Generator-Verifier Gap | Generator-Verifier Gap | 模型生成容易，但要正確判斷輸出好壞則需回饋迴路，這個落差是 self-improving 的瓶頸 |
| Agentic Workflow | Agentic Workflow | 由 LLM calls、verifiers、tool calls 編排而成的工作流，達成 end-to-end goal |
| Prompt Chaining | Prompt Chaining | 把任務切成 subtask 串成 chain 的 workflow 原語 |
| Routing | Routing | 根據任務難度分流到不同 workflow 的原語 |
| Parallelization | Parallelization | 平行執行多個 LLM call 的原語（Deep Research 典型用法） |
| Orchestrator | Orchestrator | 中心 LLM 負責 planning，再 dispatch subtask 的原語（Claude Code plan mode） |
| LLM-as-Judge | LLM-as-Judge | 用一個 LLM 評估另一個 LLM 輸出的方法 |
| Self-Improving AI Agent | Self-Improving AI Agent | 模型透過自我產生 trace／合成資料／驗證回饋，反覆改進自身效能的系統 |
| AI Scientist | AI Scientist | Sakana AI 提出的自動化研究 pipeline：腦力激盪 → 實驗迭代 → 論文撰寫 |
| Process Reward Model (PRM) | Process Reward Model | 對 reasoning 過程每一步都給 reward 的模型，比僅看最終結果的 ORM 更細緻 |
| Outcome Reward Model (ORM) | Outcome Reward Model | 僅根據最終答案對錯給 reward 的模型 |

---

## 重要引用（逐字稿原文翻譯）

> **Akanksha**：「Pre-training is the easy step——we just train the model to predict the next token out of all sorts of text and data.」  
> （Pre-training 是最單純的一步——我們只是讓模型從各式文本中預測下一個 token。）

> **Akanksha**：「ChatGPT reached 1 million users in 5 days, which is significantly faster than any famous software you see there.」  
> （ChatGPT 5 天內達到 100 萬使用者，比任何一款知名軟體都快得多。）

> **Akanksha**：「What you get out of the model when you just ask it once is way less than what it actually knows.」  
> （單次詢問模型得到的答案，遠少於模型真正會的東西。）

> **Azalia**：「As the models become bigger, not only do we have this predictive scaling laws property, there are new behaviors that appear that we never could predict until we had these bigger models.」  
> （模型變大後不只遵循 scaling laws，還會湧現出過去預測不到的新行為。）

> **Azalia**：「The chain of thought property itself is a very important property for reasoning models and all the thinking models and much of the progress we have seen in the past year or so.」  
> （CoT 特性至今仍是 reasoning 與 thinking 模型的基石，也是近一年來多數進步的核心。）

> **Azalia**：「Models like 01 tend to be better at math, data analysis, programming, but not necessarily in personal writing or editing text.」  
> （o1 等 reasoning 模型在數學、資料分析、程式表現更好，但不一定在創意寫作上比較強。）

> **Azalia**：「LLM as a chatbot is fun but doesn't accomplish a task for you. What has happened this year is that agents like Claude Code or Deep Research enable real-world workflows.」  
> （LLM 作為聊天機器人有趣但無法完成任務。今年的 Claude Code、Deep Research 開啟了真實世界的工作流。）

> **Azalia**：「Agent means having a goal, taking actions toward that goal, getting feedback, and deciding when to stop.」  
> （Agent 的本質是有目標、採取行動、獲取回饋、判斷何時停止。）

> **Azalia**：「Generator-verifier gap——it's easy for models to generate sensible content, but whether it's useful, we need a feedback loop. In creative writing, human feedback becomes the bottleneck.」  
> （生成器—驗證器落差：模型生成容易，但要判斷是否有用就得有回饋迴路；創意寫作就因回饋不易而成為瓶頸。）

> **Azalia**：「We had students publishing papers out of their projects last quarter. Your project could become a publication.」  
> （上屆有學生把 project 延伸成 conference paper 投稿成功，你們的 project 也有機會變成 publication。）

> **Akanksha**：「Even though these models hallucinate, they can come up with so many ideas that are way outside the box, which is very useful for AI scientist style of work.」  
> （即使模型會 hallucinate，仍能提出很多跳脫框架的想法，這對 AI Scientist 形式的工作很有用。）

> **Akanksha**：「We don't want a survey paper or just an app demo. We want a hypothesis, a question, an improvement, properties to analyze.」  
> （我們不要 survey paper，也不要純 app demo；我們要 hypothesis、問題、改善方向、可分析的性質。）

---

## 金句摘錄

> 「Pre-training 是 LLM 訓練的第一步；instruction tuning 與 RLHF 才把 GPT-3 變成 ChatGPT。」

> 「Few-shot、Chain-of-Thought 與 reasoning，這些 emergent behavior 撐起了整個 reasoning model 的時代。」

> 「我們不再只動參數——inference scaling 是新的 frontier；同一個模型，搭配 verifier，重複取樣就能贏過大模型。」

> 「LLM 是 chatbot，Agent 是 worker；差異在 goal、action、feedback 三件齊備。」

> 「Agentic Workflow 由六個原語組成：Prompt Chaining、Routing、Parallelization、Orchestrator、Evaluator、Verifier。」

> 「Verification 是新時代的瓶頸——有 verifier 的數學／程式領域進步最快，沒有 verifier 的創意寫作仍卡關。」

> 「Generator-verifier gap 是 self-improving agent 的核心難題：模型生成很容易，但要判斷生成得好不好，就需要回饋迴路。」

> 「即便模型會 hallucinate，它們仍能提出很多 outside-the-box 的想法，這對 AI Scientist 工作很有用。」

> 「Reasoning Models 是訓練出來的『何時該思考、何時該快速作答』的策略，而不是 emergent。」

> 「Self-improvement 迴路 = Inference Scaling 產生合成資料 → 回灌到 pre-training 或 fine-tuning → 模型變強 → 更好的 trace。」

---

## 核心主旨總結

CS329A 開宗明義：LLM 的 scaling 已逼近飽和，真正的下一波動能來自「**讓模型自我改進**」——把 inference scaling 產生的合成資料回灌到訓練流程中，搭配 verifiers 與 agentic workflows，模型就能在 coding、research、customer support 等任務上端到端完成工作。本學期目標是讓學生把這個自我改進迴路實際做出來（**3 homework + 1 project**），並把成果做成 **12/12 的 poster presentation**——甚至投稿 conference paper。

整堂課的隱含主軸是：**生成器與驗證器的落差（Generator-Verifier Gap）**。當模型本身既是 producer 又是 judge 時，self-improving loop 才能收斂；當人類 feedback 是必要 bottleneck 時，進步就會受限。這也是為什麼 verifier design、reward model training、process reward model 等主題會在後續課程被反覆提及。

---

## 人物與團隊

- **Akanksha Sreyas** — Stanford 兼任教授、Reflection AI 研究員。背景橫跨 Google Brain / DeepMind，專注 LLM scaling 與 inference-time optimization。是「Large Language Monkeys」論文共同作者。
- **Azalia Mirhoseini** — Stanford CS 系助理教授。橫跨 Cod、Anthropic、Gemini、DeepMind 經驗，專注 reasoning models、verifier design、agentic workflows。
- **CS329A TA 團隊** — 負責作業設計與課程投影片更新，本季新增第 3 份 homework。

---

## 延伸閱讀／後續課程主題

- **Inference Scaling 細節**：Large Language Monkeys（Stanford 2024）、Self-Consistency、Best-of-N Sampling
- **Reasoning Models 訓練法**：Outcome Reward Model (ORM)、Process Reward Model (PRM)
- **Agentic Workflows 框架**：LangGraph、Anthropic Computer Use、Claude Code Architecture
- **Research Agents**：Deep Research、The AI Scientist（Sakana AI）
- **Verifier 設計**：unit tests、symbolic checker、LLM-as-Judge、reward hacking 防範
- **下堂課重點**：進入推理模型訓練方法與 test-time scaling 的技術細節

---

*中文摘要／翻譯：Ryo（Backend Engineer Agent）*
*原始影片：Stanford CS329A Part 1 — Course Overview（2026-08-03）*