# 【Stanford CS336 Language Modeling from Scratch — Lecture 15：Mid-Training 與 Post-Training — SFT、RLHF 與 Reward Model 設計】

**主講：Percy Liang（共同授課）｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/2oH6PWPrYFo
> 影片時長：1 小時 19 分 54 秒（4794s）
> 性質：大學課程第十五講 — 從 GPT-3 到 ChatGPT 的 post-training 旅程：SFT data、RLHF、reward model 與 over-optimization
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260527_StanfordCS336_Lecture15_MidPostTraining_逐字稿_en.txt
> **整理日期**：2026-05-27
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Lecture 15 是 CS336 從 pre-training 進入 post-training 的轉折點。Percy Liang 主講,主題是 **從 GPT-3 到 ChatGPT 的旅程**——pre-training 是「souped-up version of GPT-3」,但要讓模型做到 instruction following 與 chat-style interaction,需要 post-training。Lecture 15 涵蓋三個關鍵主題:**SFT(Supervised Fine-Tuning)data 演進**(從 FLAN、Alpaca、Open Assistant 到 ultra chat-style data 混入 pre-training decay)、**RLHF**(PPO、reward model、over-optimization、mode collapse)、以及 **reward model 設計**。Percy 強調 RLHF data collection 與 algorithms 都非常 hard——algorithms 不是 secret sauce,data 才是;post-training 是「artisanal」的 messy process。

**核心議題一句話**:Post-training 是「從 GPT-3 到 ChatGPT」的關鍵轉折——需要 SFT data + RLHF(reward model + PPO/GRPO);但 SFT data 從 FLAN-style large-scale(數十萬 examples)演進到 Alpaca-style distilled data,再到 ultra chat-style mixed into pre-training decay;RLHF 核心是 reward model 設計,常見問題是 over-optimization(過度擬合 reward)與 mode collapse(loss of diversity);**現在「base model」概念已被模糊化**——多數 model release 把 SFT/instruction tuning data 混入 pre-training tail,使得傳統 base model 與 chat model 的界線不再清楚。

---

## 二、章節脈絡

### Section 1｜開場:GPT-3 到 ChatGPT 的 Post-Training 旅程（00:00 ~ 12:00）

**重點摘要:** Post-training 是從 GPT-3 到 ChatGPT 的關鍵——pre-training 可以做 souped-up GPT-3,但 instruction following 必須靠 SFT + RLHF;algorithms 不是 secret sauce,data 才是。

**內容:**
- Pre-training 可以做 souped-up GPT-3——更多 flops、更多 data、可以稍勝 GPT-3
- 但 GPT-3 的 utility 有限——只能做 copywriting 這類不需要 reliability 的任務
- ChatGPT 是「amazing」——能處理 long programmatic prompts、instruction following
- **Instruction following 是 remarkable 的能力**——GPT-3 時代 fine-grained control 幾乎不可能,ChatGPT 開始可以 one-shot 處理長 prompt
- Post-training 包含兩階段:
  - **Part 1(SFT)**:從 GPT-3 到 ChatGPT(Lecture 15 主軸)
  - **Part 2(RLVR)**:從 ChatGPT 到 GPT-o1 / thinking models(下週)
- Algorithms 不 secret——RLHF papers 都很 straightforward;**secret 是 data**
- Scale AI 內部 leak 顯示 competitive dynamics——為什麼 GPT-4 比較好?「Need to reverse engineer, get annotators to produce responses more detailed than GPT-4」

### Section 2｜SFT Data 的演進（12:00 ~ 50:00）

**重點摘要:** SFT data 從 FLAN 的「NLP benchmarks → instruction format」(unnatural, hallucinated summaries)演進到 Alpaca 蒸餾 ChatGPT traces、再到 ultra chat 混入 pre-training decay;**base model 概念已被模糊化**。

**內容:**
- **FLAN(2021)**:
  - 概念聰明——把 NLP benchmarks(Enron emails 主旨預測、CNN/Daily Mail summarization)轉成 instruction format
  - Dataset:enormous,包含 tons of data sets
  - **Drawback**:
    - Unnatural——summaries 很短、常 hallucinated(細節不在 input)
    - 從原 NLP datasets 繼承 deficiencies
    - Structure 不自然 carry down
  - Theory:post-training 也需要 scale,就像 pre-training 一樣
  - 但後來發現:**不需要那麼多 data**——strong pre-trained model 可以用 very few high quality examples
- **Alpaca(2023)**:
  - 蒸餾 ChatGPT traces 為 input-output pairs
  - Self-instruct 風格
  - 數量從 FLAN 的「huge」變 small 但 still works
- **Open Assistant / HelpSteer**:
  - 高 quality human-collected data
  - 風格差異大:ChatGPT 太 chatty,有些偏 formal concise
- **AlpacaEval 顯示**:
  - Stylistic preferences 大幅變化
  - Standard benchmarks 變化小
  - **Style control ≠ capability control**
- **Two-phase training (MiniCPM 為例)**:
  - **First phase**:standard pre-training,主要 internet data
  - **Second phase(decay/mid-training)**:切換到 high quality + chatty data(Stack Exchange QA、Ultra Chat、SFT data)
  - 大幅減少 standard general purpose pre-training data
  - **Base model 概念已模糊化**——現在 release 的「base model」其實是 pre-trained on ultra chat 與各種 chat data sets,不是傳統 base model
- **為什麼 mix together**:
  - 把 SFT data 與 pre-training tail 混合 → scale up instruction tuning
  - Emphasize higher quality data
  - Pre-training 與 instruction tuning 的 boundaries 「blurred very much」

### Section 3｜RLHF 基礎:Pairs、Reward Model、PPO（50:00 ~ 70:00）

**重點摘要:** RLHF 兩階段:SFT 從 demonstration data,然後 RL 用 preference data + reward model;reward model 訓練在 pairwise human preferences。

**內容:**
- **RLHF 兩階段**:
  1. **SFT phase**:collect demonstration data,annotator 給 supervised responses,fine-tune
  2. **RL phase**:reinforcement learning shape behavior aligned with human preferences
- **Reward model 訓練**:
  - 收集 preference data:同一 prompt,兩個 responses,人選出 preferred one
  - Train reward model 預測 pairwise preferences
  - 用 reward model 對 SFT model 給 reward,optimize via PPO
- **Bradley-Terry model**:
  - P(A preferred over B) = sigmoid(r(A) - r(B))
  - Reward model 學 r(x)
- **Open source preference data**:
  - UltraFeedback、HelpSteer 等
- **Algorithm 複雜度**:
  - PPO 很 difficult;有 simpler variant(GRPO)在 assignments 用
  - 「PPO is especially difficult」

### Section 4｜RLHF 的常見問題:Over-Optimization 與 Mode Collapse（70:00 ~ 90:00）

**重點摘要:** RLHF 的兩個大問題——over-optimization(reward 過度擬合,真實表現下降)與 mode collapse(模型失去多樣性);entropy 與 exploration 是 critical issue。

**內容:**
- **Over-optimization(Goldilocks problem)**:
  - Reward 越高 ≠ 真實表現越好
  - Reward model 有 noise,模型 exploit reward holes
  - 需要 early stopping 或 KL penalty 防止 reward hacking
- **Mode collapse / Loss of diversity**:
  - RL models 集中於少數 possible outputs
  - RLHF 模型 no longer modeling a distribution——是 policy,可以 collapse as long as reward 佳
  - RLHF models 在 recent years 一直 struggle with 這個
- **Calibration 問題**:
  - RLHF 後 models are uncalibrated——OpenAI 在 GPT-4 era 有公開 plot 顯示
  - Anthropic:「naturally uncalibrated」,可以 recalibrate 但不總是
  - 這對下週的 RLVR(entropy 與 exploration critical)很重要

### Section 5｜Reward Model 設計與失敗模式（90:00 ~ 105:00）

**重點摘要:** Reward model 設計有很多 pitfalls——只用 synthetic 或只用 real 都有限制;好的 reward model 是 RLHF 成敗關鍵。

**內容:**
- Reward model 設計空間:
  - 從 human preferences 直接 train
  - 從 LLM judge(LLM-as-judge)
  - 從 rule-based heuristics(math correctness、code execution)
- 失敗模式:
  - Length bias——reward 偏 longer responses
  - Style bias——reward 偏 bullet points
  - Verbosity bias
- Reward hacking:
  - 模型 learn to game reward 而非真實改善

### Section 6｜最終總結與下週預告:RLVR（105:00 ~ 79:54）

**重點摘要:** Post-training data collection 很 hard;RLHF algorithms 複雜;over-optimization 是大問題;transition 到 RLVR(下一講)。

**內容:**
- **Post-training data collection**:
  - 非常 hard——post-training 是 complicated messy process,a lot of it is getting good data
  - Good data always very difficult
- **RLHF algorithms**:
  - 複雜,PPO especially difficult
  - Simpler variant(GRPO)works pretty well
- **Over-optimization**:
  - 從 RLHF 過渡到 RLVR 的原因——is there rewards where we won't over optimize,where we can dump compute and performance monotonically improves?
  - **RLVR 為什麼 so impactful**——下一講
- **Punchline**:post-training 是 messy 過程,RLHF data 與 algorithms 都 hard,但 RLVR 開啟新方向

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **SFT (Supervised Fine-Tuning)** | 用 demonstration data(input-output pairs)supervised 訓練 LM;post-training 第一階段 |
| **RLHF (Reinforcement Learning from Human Feedback)** | 用 preference data + reward model + PPO 對齊 LM;post-training 第二階段 |
| **Reward Model** | Train 在 pairwise human preferences 上,給 LM response 一個 reward score;Bradley-Terry model 是經典選擇 |
| **Bradley-Terry Model** | P(A preferred over B) = sigmoid(r(A) - r(B));reward model 學 r(x) |
| **PPO (Proximal Policy Optimization)** | RLHF 的標準 RL 算法;複雜難 implement;有 KL penalty 防止 reward hacking |
| **GRPO** | PPO 的 simpler variant;在 CS336 assignments 使用 |
| **Over-optimization** | Reward 過度擬合,真實表現下降;RLHF 的 Goldilocks problem |
| **Reward Hacking** | 模型 learn to game reward 而非真實改善 |
| **Mode Collapse** | RL 模型失去多樣性,集中於少數 outputs;RLHF 模型「no longer modeling a distribution」 |
| **Calibration** | 模型預測機率與真實頻率一致;RLHF 後 models are uncalibrated |
| **FLAN** | 早期 instruction tuning dataset;把 NLP benchmarks 轉成 instruction format;unnatural 與 hallucinated summaries |
| **Alpaca** | 蒸餾 ChatGPT traces 為 input-output pairs;self-instruct 風格;證明少量 high quality data 可用 |
| **UltraFeedback / HelpSteer** | Open source preference datasets |
| **Two-phase Training (Mid-training)** | Pre-training tail 切換到 high quality + chatty data;base model 概念已模糊化 |
| **LLM-as-Judge** | 用 LLM 評估 responses;reward model 的另一種來源 |
| **Style Control** | 控制 model 的 tone、format(chatty、concise、bullet points) |
| **Capability Control** | 控制 model 的真實能力(knowledge、reasoning) |
| **RLVR (RL with Verifiable Rewards)** | 下一講主題;reward 是 verifiable(math correctness、code execution);解決 over-optimization |

---

## 四、重要引用

> "Pre-training, you can make something a little bit better than GPT3. But ultimately, the amount of utility you can get from something like GPT3... is ultimately a little bit limited." — Pre-training 的 utility 上限

> "Instruction following is this process of being able to put in a pretty long, complicated prompt and get back very reasonable answers... at the GPT-3 level, fine-grained control of these systems was basically impossible." — Instruction following 是 remarkable 能力

> "Algorithms are not really the secret sauce. It's not where a lot of the leverage leverages. It's going to be the data." — Post-training 的 secret 是 data 不是 algorithm

> "Part of the change from FLAN to later data sets is this observation that if you have a sufficiently strong, big, pre-trained model, you can actually get away with very few high quality examples because of pre-training generalization is going to get you quite a bit of the way." — FLAN 到 Alpaca 的演進

> "Base models today are pre-trained on ultra chat, and who knows what else. Those are like chat data sets that are synthetically designed to make you good at chat. And so it's very hard to say that this is like a base model in the traditional sense of the word." — Base model 概念已模糊化

> "The boundaries between pre-training and instruction tuning, and also high quality data is just being blurred very much." — Pre-training 與 instruction tuning 的界線模糊

> "People will very often select responses that have bullet pointed lists in their outputs, or they will select responses that have more and longer detail." — Human evaluator 的 stylistic bias

> "RL models have much less diversity. They're concentrated on a few different possible outputs... RLHF models are really no longer modeling a distribution which comes with its own inherent diversity. It's a policy that can collapse as long as it gets a good reward." — Mode collapse 的本質

> "GPT-4 era actually was one of the few plots that OpenAI put out, where they said, actually, we have a few open problems left. And one of the open problems they had was, actually, our models are uncalibrated after we do RLHF." — RLHF 後的 calibration 問題

> "Post-training is very complicated, messy process because a lot of it is getting good data. And getting good data is always very difficult." — Post-tuning 的 messy 本質

> "RLHF algorithms are quite complex. PPO is especially difficult... GRPO. That works pretty well." — RLHF algorithms 的複雜度

---

## 五、人物 / 角色分析

**Percy Liang**:CS336 共同授課教授,Lecture 15 完全由 Percy 主講。Percy 在 Lecture 15 顯示他對 post-training 領域的深度掌握——從 SFT data 演進(FLAN、Alpaca、Open Assistant、MiniCPM two-phase training)、RLHF 兩階段(reward model + PPO)、到 calibration 與 mode collapse 等 open problems。Percy 同時坦誠「algorithms 不是 secret,data 才是」——這呼應 Lecture 13「data 是 competitive secret sauce」的論點。Lecture 15 是從 Lecture 13-14 data 進入 post-training data 的延伸,顯示 Percy 對 LM 開發的全棧理解;**transition 到 RLVR(下一講)** 是 Lecture 15 最重要的 forward-looking 結論——reward 是 verifiable 將解開 over-optimization 的死結。

---

## 六、核心主旨總結

Lecture 15 把「從 GPT-3 到 ChatGPT」分解為 SFT data + RLHF 兩階段。SFT data 從 FLAN 的「NLP benchmarks → instruction format」(unnatural、hallucinated)演進到 Alpaca 蒸餾、再到 ultra chat mixed into pre-training decay(two-phase training),**base model 概念已模糊化**。RLHF 兩階段:SFT 從 demonstration data + RL 從 preference data + reward model(Bradley-Terry)+ PPO;但 RLHF 有兩個大問題——over-optimization(reward hacking、Goldilocks)與 mode collapse(loss of diversity、uncalibrated)。**Punchline**:post-tuning 是 messy 過程,RLHF data 與 algorithms 都 hard,但 RLVR(下一講)開啟新方向——verifiable rewards 將解開 over-optimization 死結。

---

## 七、金句摘錄

- "Pre-training, you can make something a little bit better than GPT3. But ultimately, the amount of utility you can get from something like GPT3... is ultimately a little bit limited."
- "Algorithms are not really the secret sauce. It's not where a lot of the leverage leverages. It's going to be the data."
- "The boundaries between pre-training and instruction tuning, and also high quality data is just being blurred very much."
- "Base models today are pre-trained on ultra chat... it's very hard to say that this is like a base model in the traditional sense of the word."
- "RL models have much less diversity. They're concentrated on a few different possible outputs."
- "Our models are uncalibrated after we do RLHF."
- "Post-training is very complicated, messy process because a lot of it is getting good data."
- "RLHF algorithms are quite complex. PPO is especially difficult... GRPO. That works pretty well."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽(voice clone, speech-2.8-hd),約 4 分 05 秒
> 口播稿原文:transcripts/20260527_StanfordCS336_Lecture15_MidPostTraining_口播稿.txt

- [opus 1.0 MB](../audio/20260527_StanfordCS336_Lecture15_MidPostTraining_口播稿.opus)(Telegram 友善)
- [m4a 4.0 MB](../audio/20260527_StanfordCS336_Lecture15_MidPostTraining_口播稿.m4a)(iOS 友善)
- [mp3 3.8 MB](../audio/20260527_StanfordCS336_Lecture15_MidPostTraining_口播稿.mp3)(通用格式)