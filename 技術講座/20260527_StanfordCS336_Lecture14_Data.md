# 【Stanford CS336 Language Modeling from Scratch — Lecture 14：Data — Filtering、Deduplication、Mixing 與 Synthetic Data】

**主講：Percy Liang（共同授課）｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/5sxHosTLPF8
> 影片時長：1 小時 24 分 46 秒（5086s）
> 性質：大學課程第十四講 — Data 第二講：從 transformation、filtering、deduplication、mixing 到 synthetic data 的完整 data pipeline
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260527_StanfordCS336_Lecture14_Data_逐字稿_en.txt
> **整理日期**：2026-05-27
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Lecture 14 是 Lecture 13 的延續——從 data sources 進入 data pipeline。Percy Liang 主講,主題涵蓋 **transformation**(HTML → text)、**filtering**(quality + toxicity + language)、**deduplication**(exact 與 near-duplicate)、**mixing**(不同 data sources 的 weight)、以及 **post-training data 與 synthetic data**。Lecture 14 顯示 LLM data pipeline 的核心矛盾:從 100+ trillion tokens 篩到 ~3 trillion tokens,需要大量 heuristics 與 small classifier;而 mixing 是 hyperparameter tuning at largest scale——用小 proxy model 推算大 model 的最佳 mix,搭配 simulated epoching 解決 scale-dependent effect。

**核心議題一句話**:Data pipeline 是「heuristic 與 rule-based」的藝術——HTML→text transformation 用 rule-based processors(快、lossy);filtering 用 small classifiers(generative model 或 fast classifier);deduplication 用 MinHash + LSH 達到 near-duplicate detection in linear time;mixing 用 regression-based framework 把 mixture weights 映射到 loss,搭配 downsampled sources 與 epoch cap 解決 scale-dependent effects;synthetic data 用於 post-training(math、coding、SWE-rebench 等)。

---

## 二、章節脈絡

### Section 1｜開場:Data Pipeline 全貌（00:00 ~ 08:00）

**重點摘要:** Data 不只是「從 Hugging Face 下載」——要從 transformation、filtering、deduplication 一路到 mixing、post-training data,每一步都有 lossiness 與 art。

**內容:**
- 從 raw data 到 ready-to-train:transformation → filtering → deduplication → mixing → post-training data
- 每一步都 lossy,需要 heuristic 與 rule-based processors
- Lecture 14 涵蓋 pre-training pipeline + post-training data overview

### Section 2｜HTML Transformation:Rule-Based Processors（08:00 ~ 18:00）

**重點摘要:** Raw web data 不是 text——是 HTML、PDF、GitHub directories;HTML→text 用 rule-based processors 是 fast 但 lossy。

**內容:**
- Raw data 不會以 text 形式給你:
  - Common Crawl 內部是 HTML(主要)、PDF、GitHub directories
- HTML→text processing:
  - Remove boilerplate(navigation、ads)
  - Extract content(footers、headers、menus 通常去掉)
  - Linearize HTML(階層式 → sequence of tokens)
  - **Inherently lossy**——tables 處理很 tricky,簡單 table 用 markdown,複雜 table 必須放棄或近似
- 為什麼用 rule-based processors:
  - **Fast**——web scale 需要 100T tokens throughput
  - 不是 trained model,no generalization issues
  - **Drawback**:subtleties——導航元素有時候對 model learning 也有用

### Section 3｜Filtering:Quality + Toxicity + Language（18:00 ~ 50:00）

**重點摘要:** Filtering 的核心 schema:有 target data(小量高品質) + raw data(大量低品質),train 一個 classifier 來挑出像 target 的 subset。

**內容:**
- **Filtering 通用 framework**:
  - Target = small, high-quality
  - Raw = 100+ trillion tokens(整個 internet)
  - 訓練 classifier(generative model 或 classifier)給 raw data 評分,保留 high-score 的
- **Filtering 目標**:
  - **Quality filtering**:不要 spam,要 encyclopedic information
  - **Language filtering**:英文 LM 就只挑英文
  - **Toxicity filtering**:避免 nasty content
- **Generative model 方法**:
  - KenLM:train 5-gram model on target data
  - 計算 raw data 的 likelihood,保留 high-likelihood 的
- **Classifier 方法**:
  - 用 target 為 positive、其他為 negative,train binary classifier
  - 用 raw data 通過 classifier,保留 positive predictions
  - Dolly 15K dataset 用這個方法,showed better performance than raw data
- **Toxicity filtering**:
  - Jigsaw Toxic Comments dataset:Wikipedia talk pages 標註
  - Train classifier,filter toxic comments out
- **重要 subtlety**:**沒有 optimal threshold**
  - 取決於你訓練多久(training duration 越長,可容忍越低 quality)
  - 取決於 model size 與 token count
  - 沒有 universal「0.9 以上就是好」的標準
- **Scaling 效果**:
  - 157M model,100B tokens,訓練多個 epoch
  - dclm baseline loss curve:每多一個 epoch loss 降,但會 overfit
  - 高 quality data 越多 → loss curve 越低
  - 但「high quality data 量是固定的」——trade-off

### Section 4｜Deduplication:MinHash + LSH（50:00 ~ 80:00）

**重點摘要:** Deduplication 是 O(n²) 問題——用 MinHash + Locality-Sensitive Hashing(LSH)把 near-duplicate detection 變 O(n)。

**內容:**
- **為什麼 dedupe**:
  - 訓練效率:移除 duplicates 不丟 information
  - 避免 memorization(copyright + privacy)
  - 省 FLOPs
- **Deduplication 是 O(n²) 問題**:
  - 每個 item 要 compare 每個 item
  - Web scale 不能這樣做
  - 用 hash functions 達到 linear time
- **Hash functions 簡介**:
  - Cryptographic hash:collision-resistant(Bitcoin 用)
  - Fast hash:hash table 用,collision 可接受
- **Exact deduplication**:
  - Hash 每個 item,移除重複
  - 但不夠——web data 經常 slightly modified
- **Near deduplication with MinHash**:
  - 把 document 用 n-gram shingles 表示(set of substrings)
  - **MinHash**:用多個 hash functions 取每個 set 的 minimum 值
  - 兩個 documents 的 Jaccard similarity ≈ Pr[h(A) = h(B)]
  - 不用比較所有 n-grams,只比較 min hash values
- **LSH(Locality-Sensitive Hashing)**:
  - 把 MinHash signatures 分成 b 個 bands,每個 band 有 r 個 hash functions
  - 任何 band 中 hash match → candidate pair
  - Phase transition:similarity < threshold → ~0 機率 match;> threshold → ~1 機率 match
  - Threshold = (1/b)^(1/r)
  - b ↑ → threshold ↓,但 false positive 增加
  - r ↑ → threshold 上升,collision 變尖銳
- **真實設定**:
  - Olmix paper 用 b=20, r=450
  - 可 tune 到任意 sharp phase transition
- **Decontamination**:
  - 類似的問題,但目標是「test set 不要在 training set」
  - 與 deduplication 結合

### Section 5｜Mixing:Regression-Based Framework（80:00 ~ 110:00）

**重點摘要:** Mixing 是 hyperparameter tuning at largest scale——用 small proxy models 推算最佳 mixture weights,搭配 epoch cap 與 simulated epoching 解決 scale-dependent effects。

**內容:**
- **Data mixing 問題**:多個 sources(Wikipedia、Common Crawl、code、math)如何 balance?
- **Regression-based mixing framework**:
  - 從 raw 與 target 數據 fit 一個 function mapping mixture weights → loss
  - 在 small scale 跑多個 mixtures,fit regression
  - 用 regression 推算 large scale 的 optimal mixture
  - Optimization:fit a log-linear model,效果不錯
- **兩大 leaps of faith**:
  - Regression model trained on small proxy runs,optimization 可能推到 extremes(沒 coverage)
  - Optimal data mixtures 從 small scale transfer 到 large scale(at open community scales 看似成立)
- **Scale-dependent effect**:
  - 想像 10T low-quality tokens + 10B high-quality tokens
  - Small model + low token count:大量 weight 放在 high-quality(Wikipedia 很棒,只 train Wikipedia)
  - Large model + many epochs:在 Wikipedia 上 overfit
  - **同一個 mixture 在不同 scale 表現不同**——這是 scale-dependent effect
- **兩個 solutions**:
  1. **Epoch cap**:限制每個 source 的 epoch 數
  2. **Simulated epoching**:
     - 把 small runs 的 sources downsampled(比例對應 large scale 的 epoch ratio)
     - 例:small 10B tokens,big 1T tokens → 1/100 downsampling
     - 小 scale 看起來就像 large scale 在 epoch
     - 一般原則:「parameterize your model so your hyperparameters transfer」(muP 的 spirit)
     - Downsampled data 強制「balanced approach」
- **Olmix paper 的實驗**:
  - Table:proxy model sizes(數千萬 parameters)、mixture count、Dirichlet 與 exponential sampling、log-linear regression
  - 證明 framework 可行但要小心 extrapolation

### Section 6｜Post-Training Data 與 Synthetic Data（110:00 ~ 130:00）

**重點摘要:** Post-training data 包含 real human data(Open Assistant、HelpSteer)與 synthetic data(math、coding、SWE-rebench);SWE-Zero 用 LLM-generated trajectories 擴展。

**內容:**
- **Post-training data 來源**:
  - 早期:Open Assistant、HelpSteer——人類 collected data
  - 風格差異大:ChatGPT 太 chatty,有些偏 formal concise
  - AlpacaEval 顯示 stylistic preferences 大幅變化,但 standard benchmarks 變化小
  - **Style control ≠ capability control**
- **Synthetic data 趨勢**:
  - 數學:用 LLM 生成 problems 與 solutions
  - Coding:產生 coding challenges 與 solutions
  - SWE-rebench:大量 GitHub PRs,LLM 給 responses
- **SWE-Zero**:
  - 用 SWE-rebench tasks 與 LLM-generated trajectories
  - 12 million agent trajectories,輕量級
  - 與 SWE-rebench 互補:SWE-rebench 32K execute 成功,SWE-Zero 用全部
- **General pattern**:
  - Synthetic + real + semi-synthetic 都有 trade-offs
  - Responses 都來自 capable models,但需要「good teachers」
  - Code environments 處理很 pain,需要大量 filtering

### Section 7｜最終總結:Data Work 是 Grungy（130:00 ~ 84:46）

**重點摘要:** Data pipeline 的關鍵 elements——filtering、deduplication、mixing、synthetic data——data work 是 grungy,domain-specific,要靠 concrete examples。

**內容:**
- Filtering:train lightweight classifier + go over web crawl
- Deduplication:MinHash + LSH,避免 overfitting + 省 FLOPs
- Mixing:small scale 推算 large scale,小心 scale-dependent effects
- Post-training data:real + synthetic + semi-synthetic,風格差異大
- **Punchline**:data work 很 grungy,domain-specific,需要看 concrete examples 才能做 high-quality data sets

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **HTML Transformation** | 把 HTML 轉成純文字;rule-based processors 是主流,fast 但 lossy |
| **Quality Filtering** | 用 classifier 從 raw data 挑出 high-quality subset;核心是 train classifier from target data |
| **Toxicity Filtering** | 用 Jigsaw Toxic Comments 訓練 classifier,filter nasty content |
| **KenLM** | 5-gram language model,用於 quality filtering 的 generative classifier |
| **MinHash** | 用多個 hash functions 取每個 set 的 minimum 值;兩個 docs 的 Jaccard ≈ Pr[h(A)=h(B)] |
| **Locality-Sensitive Hashing (LSH)** | 把 MinHash signatures 分成 bands,phase transition 控制 threshold;linear-time near-duplicate detection |
| **Jaccard Similarity** | |A ∩ B| / |A ∪ B|;用於 near-duplicate 衡量 |
| **Decontamination** | 確保 test set 不在 training set 中;類似 deduplication 但目標不同 |
| **Regression-based Mixing** | 用 small proxy runs 推算 mixture weights → loss 的 function;fit log-linear model |
| **Epoch Cap** | 限制每個 source 的 epoch 數,避免 overfitting on small high-quality data |
| **Simulated Epoching** | 把 small scale 的 sources downsampled,模擬 large scale 的 epoch pattern |
| **Synthetic Data** | LLM-generated problems/solutions;用於 math、coding、agentic tasks |
| **SWE-rebench** | 用大量 GitHub PRs 收集 SWE tasks;LLM 給 responses |
| **SWE-Zero** | SWE-rebench + LLM-generated trajectories;12M agent trajectories |
| **Scale-Dependent Effect** | 同一 mixture 在 small scale 與 large scale 表現不同;epoch 數不同 |

---

## 四、重要引用

> "Raw data doesn't come as text, even as if you've scraped something. If you ever look inside Common Crawl, it's not text. It's either HTML. Sometimes it could be PDFs or directories in the case of GitHub." — Raw data 的真實形式

> "Inherently, this is a lossy process because you need to linearize HTML, which at least is either hierarchical or visual, if you think about the rendered output, and to a sequence of tokens." — HTML transformation 的 inherent lossiness

> "Typically, HTML to text processing is rule-based. And the reason for this is that rule-based processors are very fast." — 為什麼用 rule-based

> "The goal is to find a subset of this raw data that is similar to target." — Filtering 的核心 schema

> "There's no optimal threshold... it depends on what you want to do. Intuitively, if you are going to train for a longer period of time, then you can tolerate lower quality data." — 沒有 universal quality threshold

> "Deduplication is fundamentally about comparing items to other items. And normally, if you're doing filtering, this is about an individual item... your duplication, clearly, you can't do the n-squared thing." — Deduplication 是 O(n²) 問題

> "MinHash LSH... we're using the MinHash, which approximates Jaccard. And so that basically is the one you should use here." — MinHash 是 LM dedupe 的標準

> "The phase transition happens at a threshold, which is 1/b raised to the power of 1/r." — LSH threshold formula

> "Optimal data mixtures, you just hope that they transfer from small scale to large scale." — Mixing 的 leap of faith

> "Simulated epoching... make your small scale look like your large scale. This is a general theme for the course." — Simulated epoching 與 muP 的同質性

> "If you have the downsampled data, then this solution is not going to look good because you're not training on all-- you don't get to just train on Wikipedia. You're going to train on some minuscule fraction of Wikipedia." — Downsampling 強制 balanced approach

> "Models don't really know necessarily whether a reference is true or false." — Synthetic data 的 hallucination 風險

> "A lot of the data work can be very grungy. It's very domain-specific and requires looking at concrete examples to make these high-quality data sets." — Data work 的本質

---

## 五、人物 / 角色分析

**Percy Liang**:CS336 共同授課教授,Lecture 14 完全由 Percy 主講。Percy 在 Lecture 14 顯示他對 data pipeline 的全棧掌握——從 HTML transformation 的 rule-based processors、到 KenLM/classifier filtering、到 MinHash/LSH 的 algorithmic 細節、到 regression-based mixing 的 Olmix paper、到 synthetic data 的 SWE-Zero。Percy 也強調「data work 是 grungy」——這呼應 Lecture 13「data processing is vibes-based」的論點。Lecture 14 顯示 Percy 對 LM data 領域的研究不僅是 knowledge,而是 hands-on 經驗(與 Michael Ryan 等合作 dclm、Olmix 等 paper)。

---

## 六、核心主旨總結

Lecture 14 把 data pipeline 從「拿到 raw data」分解到「train ready」的每一步:transformation(rule-based,fast 但 lossy)、filtering(target-driven classifier,無 universal threshold)、deduplication(MinHash + LSH,linear-time near-duplicate detection)、mixing(regression-based framework,simulated epoching 解決 scale-dependent effects)、post-training data(real + synthetic + semi-synthetic,風格差異大於 capability 差異)。核心 takeaway:每一步都有 art——HTML→text 是 lossy approximation,filtering threshold 依 training duration 而定,deduplication 用 LSH 達到 linear-time near-duplicate detection,mixing 必須處理 small/large scale 的 qualitative differences(small scale 看起來像 large scale epoch);**data work 是 grungy,domain-specific,需要看 concrete examples**——這也是 CS336 把 data 拆成兩講(13 + 14)的原因。

---

## 七、金句摘錄

- "Raw data doesn't come as text, even as if you've scraped something. If you ever look inside Common Crawl, it's not text. It's either HTML."
- "Inherently, this is a lossy process because you need to linearize HTML."
- "The goal is to find a subset of this raw data that is similar to target."
- "There's no optimal threshold."
- "Deduplication is fundamentally about comparing items to other items."
- "MinHash LSH... we're using the MinHash, which approximates Jaccard."
- "Optimal data mixtures, you just hope that they transfer from small scale to large scale."
- "Simulated epoching... make your small scale look like your large scale. This is a general theme for the course."
- "A lot of the data work can be very grungy. It's very domain-specific."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽(voice clone, speech-2.8-hd),約 4 分 30 秒
> 口播稿原文:transcripts/20260527_StanfordCS336_Lecture14_Data_口播稿.txt

- [opus 1.1 MB](../audio/20260527_StanfordCS336_Lecture14_Data_口播稿.opus)(Telegram 友善)
- [m4a 4.4 MB](../audio/20260527_StanfordCS336_Lecture14_Data_口播稿.m4a)(iOS 友善)
- [mp3 4.2 MB](../audio/20260527_StanfordCS336_Lecture14_Data_口播稿.mp3)(通用格式)