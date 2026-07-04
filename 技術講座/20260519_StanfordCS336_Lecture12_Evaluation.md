# 【Stanford CS336 Language Modeling from Scratch — Lecture 12：Evaluation — 從 Perplexity 到 Agent Benchmarks】

**主講：Percy Liang（共同授課）｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/JpAxdTWQJxM
> 影片時長：1 小時 18 分 34 秒（4714s）
> 性質：大學課程第十二講 — 從 perplexity、exam benchmarks、chat benchmarks 到 agentic benchmarks 的完整 evaluation 工具箱
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260519_StanfordCS336_Lecture12_Evaluation_逐字稿_en.txt
> **整理日期**：2026-05-19
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Lecture 12 是 CS336 在 Lecture 11（Scaling Laws 進階）後的主題轉進——從「如何訓練」轉向「訓練完怎麼知道模型好」。Lecture 5-11 已經涵蓋 architecture、optimizer、training loop、kernels、parallelism、scaling laws 與 inference optimization；Lecture 12 探討的 evaluation 是 LLM 開發中「形塑 AI 發展方向」的核心環節——benchmarks 設定 North Stars，所有模型開發者（open 或 closed）都用 evaluation 衡量進度。本講從 perplexity（最 classical 的 metric）開始，延伸到 exam benchmarks（MMLU、HLE）、chat benchmarks（Chatbot Arena ELO rankings）、agentic benchmarks（Terminal-Bench、CyBench、MLE-bench）、reasoning benchmarks、safety benchmarks，並探討每種 evaluation 類型的難度、真實性、validity trade-off。

**核心議題一句話**：Evaluation 是把「我想要模型做什麼」的抽象概念，轉化為「concrete metric powered by concrete prompts or environments」的過程——這個轉化本身就是 evaluation 的核心挑戰；沒有任何一個 benchmark 能統治所有面向，使用者必須根據目標（購買決策、研究、policy、開發者回饋）選擇對應的 evaluation strategy，並在真實性、難度、ecological validity、無 contamination 之間做取捨。

---

## 二、章節脈絡

### Section 1｜開場：為什麼整堂課講 Evaluation（00:00 ~ 08:00）

**重點摘要：** Evaluation 不只是機械化的「送 prompt、看 accuracy」——它形塑 AI 發展方向，是 deep topic 也是 important topic。

**內容：**
- CS336 到目前為止：architecture / optimizer / training loop / kernels / parallelism / scaling laws / inference
- 唯一缺的就是「用什麼 data 訓練」與「模型如何評估」——本週講 evaluation，下週講 data
- Evaluation sets North Stars——open 與 closed 模型開發者都用 evaluation 衡量進度
- Evaluation 的核心難題：把「我想要模型做什麼」的抽象概念（對話、推理）轉化成 concrete metric

### Section 2｜什麼是「好模型」：Artificial Analysis 與 Perplexity（08:00 ~ 25:00）

**重點摘要：** 「好」有多種定義——Artificial Analysis 之類的網站把多個 benchmark 組合成 composite score；perplexity 是最 classical 的 metric，但有 trust 與 distribution 問題。

**內容：**
- Artificial Analysis：用 composite intelligence score 把多個 benchmark 整合
- Perplexity：log probability over test set 的 geometric mean
  - 用於 scaling laws（smoothly varying with scale）
  - 用於 model comparison
  - **Trust 問題**：perplexity leaderboard 需要信任模型回傳的 logprob 是 valid distribution
  - 下游任務沒這問題——黑盒 LM 給 prompt 得 response，可以計算 accuracy
- Perplexity summary：仍被廣泛使用，特別是 scaling laws；但要小心「模型可能給出 1 的機率，永遠得 perplexity 0」的攻擊

### Section 3｜Exam Benchmarks：MMLU 與 HLE（25:00 ~ 50:00）

**重點摘要：** Exam-based benchmarks 是 LM benchmarking 文化的主流——從 MMLU（57 個 subject 的大規模 multitask test）到 HLE（Humanity's Last Exam，2026 仍只 64.7%）。

**內容：**
- **MMLU（Massive Multitask Language Understanding, Hendrycks 2020）**：
  - 57 個 subjects，從高中到大學程度
  - Hendrycks 團隊「ahead of the curve」——在 GPT-3 時代就押 LM 是 general-purpose task solver
  - 評估方式：few-shot prompting + GPT-3
  - 多年後已 saturated——現在 90%+
- **MMLU saturation 問題**：benchmark 越容易飽和，研究者越要設計更難的 benchmark
- **HLE（Humanity's Last Exam）**：
  - Frontier 級 benchmark，2026 仍只有 ~64.7% best models
  - 多選題即使飽和也可以變難——但「multiple choice 限制可以問的問題種類」
  - 私有 hold-out 避免 contamination
- Exam-based benchmarks 的限制：沒捕捉 real-world usage——除了作弊，沒人會問 HLE 問題給 LM

### Section 4｜Chat Benchmarks：Chatbot Arena 與 ELO（50:00 ~ 65:00）

**重點摘要：** 開放式 chat 問題沒有 ground truth——Chatbot Arena 用 pairwise human comparison + ELO rankings 解決這問題，但評審會被 stylistic factors（bullet points、長度）誤導。

**內容：**
- 開放式問題：beet salad with cheese, 什麼 herbs 合適——沒 ground truth
- **Chatbot Arena**（LMSYS 創立）：
  - 隨機訪客與兩個匿名模型對話，選出 A 較好 / B 較好 / 都好 / 都差
  - 透過 pairwise comparison 數據計算 ELO rankings
  - ELO rating → 兩個模型對戰的 probability
- **Stylistic bias 問題**：
  - 人會偏好 bullet-pointed lists 與 longer detail
  - 這誘導 chatbot 學會特定語氣
  - **Engagement signals ≠ capability**——可能 fool 自己以為模型變好
- Style control 與 capability control 應該分開

### Section 5｜Agentic Benchmarks：Terminal-Bench、CyBench、MLE-Bench（65:00 ~ 80:00）

**重點摘要：** Agentic benchmarks 評估「在 environment 中完成 multi-step tasks」的能力——Terminal-Bench 用 terminal、CyBench 用 CTF、MLE-Bench 用 Kaggle；agent scaffolds 顯著影響表現。

**內容：**
- **Terminal-Bench**：通用 computer terminal tasks
  - 93 人 crowdsourced，89 個 tasks
  - 任務時間 1 小時到 1 週不等
  - Frontier 模型 top，agent scaffold 顯著影響 accuracy
- **CyBench**：40 個 Capture-The-Flag 任務
  - Agent 攻擊 server 拿 flag
  - 早期最好模型 ~10%，現在已 solved
  - 簡單 scaffold：連續 memory + action + environment feedback 串接
- **MLE-bench**：Kaggle competitions
  - 處理 data、train models、submit
  - LLM 表現「usual suspects」但 agent scaffolds 變化大
- **Agent scaffolds 重要性**：
  - Explicit planning（不要 stream of consciousness）
  - To-do list with checking off
  - Hierarchical delegation（master agent + sub-agents）
  - Memory management（讀寫 file）
  - Context engineering

### Section 6｜Reasoning 與 Safety Benchmarks（80:00 ~ 95:00）

**重點摘要：** Reasoning benchmarks 評估 long-horizon planning 與 verifiable rewards；safety benchmarks 涵蓋 harm categories、bias、jailbreak resistance。

**內容：**
- Reasoning benchmarks 包含 math olympiad、theorem proving
- Safety benchmarks：bias、toxicity、harm categories、jailbreak resistance
- 評估 reasoning 的方式：verifiable rewards（math 答案對錯）、process-based evaluation

### Section 7｜最終總結：沒有 One True Evaluation（95:00 ~ 78:34）

**重點摘要：** Evaluation 沒有 silver bullet——使用者必須根據目標（用戶、研究者、policy、開發者）選擇 benchmark，並在 difficulty / realism / validity / contamination 之間做取捨。

**內容：**
- **沒有 one evaluation to rule them all**
- 不同目標選擇不同 benchmark：
  - 用戶 / 購買決策 → 對應 use case 的 benchmark
  - 研究者 → 直覺 intelligence measure
  - Policy → benefit / harm
  - 開發者 → feedback to improve
- 評估什麼也在變：
  - Foundation model 之前：評估 methods
  - Foundation model 時代：評估 models 與 systems
  - NanoGPT speedrun 是個例外——純算法評估
- **Punchline**：永遠要明確宣告你的目標是什麼。沒有 perfect benchmark；選 trade-off。

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Perplexity** | Language model 在 test set 上的 geometric mean of inverse probability；classical metric，smoothly varying with scale |
| **MMLU** | Massive Multitask Language Understanding, Hendrycks 2020；57 個 subject 的大規模 exam-style benchmark；現已 saturated 90%+ |
| **HLE（Humanity's Last Exam）** | Frontier 級 exam benchmark；2026 仍只 ~64.7%；multiple choice 形式但極難 |
| **Chatbot Arena** | LMSYS 創立的 chat benchmark；透過 pairwise human comparison 計算 ELO rankings |
| **ELO Ranking** | 基於 pairwise 對戰的 rating system；ELO score 越高勝率越大 |
| **Terminal-Bench** | Agentic benchmark；89 個 computer terminal tasks；通用 evaluation |
| **CyBench** | Cybersecurity benchmark；40 個 Capture-The-Flag tasks |
| **MLE-bench** | Machine Learning Engineering benchmark；Kaggle competitions |
| **Agent Scaffold** | 包圍 language model 的 agent 框架；包括 planning / memory / delegation / context engineering |
| **Stylistic Bias** | Human evaluator 偏好 bullet points 與 longer detail；誘導 chatbot 學特定語氣 |
| **Engagement Signal** | User engagement 指標（like、分享、長對話）；≠ capability improvement |
| **Few-shot Prompting** | 在 prompt 中給幾個 in-context examples 後問問題；MMLU 等 exam benchmarks 的標準評估方式 |
| **Composite Intelligence Score** | Artificial Analysis 等網站把多個 benchmark 整合為單一 score |
| **Contamination** | Test set 出現在 training data 中；評估失真 |

---

## 四、重要引用

> "Evaluation sets North Stars and model developers-- open, closed-- everyone looks at evaluation as a measure of progress." — Percy 強調 evaluation 形塑 AI 發展方向的核心地位

> "Evaluation is really the process of turning that into a concrete metric powered by, presumably, some concrete prompts or environments." — Evaluation 的核心挑戰：把抽象轉 concrete

> "It's interesting that multiple choice format still survives because it's-- with multiple choice, I mean, you can make it as difficult as you want." — 多選題即使飽和也能變難；不是格式問題是難度問題

> "Most of the time people are asking open-ended questions. They don't even necessarily have a correct answer." — 為什麼需要 chat benchmarks 而不只是 exam benchmarks

> "The way they ask humans, I think is a clever idea. So they basically had this set of this website where any random person from the internet can go in and chat." — Chatbot Arena 的核心設計巧思

> "People will get very easily tricked... they will very often select responses that have bullet pointed lists in their outputs, or they will select responses that have more and longer detail." — Human evaluator 的 stylistic bias

> "If you look at all of these different kinds of post-training data sets that you can train on, you'll see big variations in preferences when you train on some of these things... But really, it doesn't necessarily change standard benchmarking evaluations." — Engagement signals ≠ capability improvement

> "There's no one evaluation to rule them all. And I think it's-- when you're thinking about evaluation, you have to be very clear about what the purpose is." — Lecture 12 核心結論

> "Choose what you're trying to measure. And we talked about a bunch of different benchmarks starting with perplexity, exam based, chat, agentic, reasoning, and safety. They vary in terms of difficulty, realism, how valid they are." — Evaluation 的多維度 trade-off

---

## 五、人物 / 角色分析

**Percy Liang**：CS336 共同授課教授，Lecture 12 完全由 Percy 主講（顯示他是 CS336 evaluation / data / policy 主軸的 primary instructor）。Percy 在 Lecture 12 顯示他對 evaluation ecosystem 的全面掌握——從 perplexity 的數學基礎（MMLU paper 是 Hendrycks 2020）到 LMSYS Chatbot Arena 的 design 巧思、到 Terminal-Bench 與 CyBench 的 agentic 設計、到 reasoning 與 safety 的 frontier 級 benchmark。Percy 同時強調「evaluation 形塑 AI 發展方向」的 policy 維度——這也是 CS336 把 evaluation 獨立成一個 lecture 的原因。

---

## 六、核心主旨總結

Lecture 12 提供了 evaluation 的完整工具箱——perplexity（classical metric）、MMLU/HLE（exam benchmarks）、Chatbot Arena（chat with ELO rankings）、Terminal-Bench/CyBench/MLE-bench（agentic with environment）、reasoning 與 safety（frontier 級）。核心 takeaway：evaluation 是把「我想要模型做什麼」的抽象概念轉化為「concrete metric」的過程——這個轉化本身就是 evaluation 的核心難題。Stylistic bias 會誤導 human evaluator、engagement signals ≠ capability、沒有 one evaluation to rule them all；使用者必須根據目標選擇 benchmark，並在 difficulty / realism / validity / contamination 之間做取捨。

---

## 七、金句摘錄

- "Evaluation sets North Stars and model developers-- open, closed-- everyone looks at evaluation as a measure of progress."
- "Evaluation is really the process of turning that into a concrete metric powered by, presumably, some concrete prompts or environments."
- "Most of the time people are asking open-ended questions. They don't even necessarily have a correct answer."
- "People will get very easily tricked... they will very often select responses that have bullet pointed lists in their outputs."
- "There's no one evaluation to rule them all."
- "Choose what you're trying to measure."
- "Often you have to compromise on one of these factors, and depending on your goals, you will have to choose which one you're willing to compromise on."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 5 分 05 秒
> 口播稿原文：transcripts/20260519_StanfordCS336_Lecture12_Evaluation_口播稿.txt

- [opus 1.2 MB](../audio/20260519_StanfordCS336_Lecture12_Evaluation_口播稿.opus)（Telegram 友善）
- [m4a 5.0 MB](../audio/20260519_StanfordCS336_Lecture12_Evaluation_口播稿.m4a)（iOS 友善）
- [mp3 4.8 MB](../audio/20260519_StanfordCS336_Lecture12_Evaluation_口播稿.mp3)（通用格式）