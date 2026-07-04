# 【Stanford CS336 Language Modeling from Scratch — Lecture 1: Overview & Tokenization】

**主講：Percy Liang（Tatsu Hashimoto 教授合開，Marcel、Herman、Steven 助教程式）｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/JuoVZkPBiKk
> 影片時長：1 小時 19 分 22 秒（4762s）
> 性質：大學課程第一講 — 整體 roadmap + tokenizer 入門
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260414_StanfordCS336_Lecture1_OverviewTokenization_逐字稿.txt
> **整理日期**：2026-04-07
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Stanford CS336「Language Modeling from Scratch」是 Percy Liang 與 Tatsu Hashimoto 共同授課的第三年旗艦課程，5 學分、5 個 assignment、修課強度約等於 CS224N 的 5 個作業總和。教學團隊包含 Percy Liang（20 年語言模型經驗，主要做小模型研究）、Tatsu Hashimoto（負責 architectures 與 scaling）、Marcel（上過一次的 CA，做 higher-order gradients、training、architecture）、Herman（一年前還不知道 LLM 怎麼運轉，現已是 LLM 研究員）、Steven（首次擔任 CA，做語言模型理論與 data efficiency）。

本講是整門課的「roadmap lecture」—— 先講「為什麼要從零開始做 LM」，再 walk through 5 個 assignment（tokenization、systems、scaling laws、data、alignment）的設計邏輯，最後實際示範 BPE（Byte Pair Encoding）tokenizer 的從零實作。Percy 把這堂課定位成「從統計學習理論的數學課，到系統 + 經驗導向的現代 LLM 課」的對位。

**核心議題一句話**：現代 LLM 的基礎元件（tokenizer、transformer、optimizer、GPU kernel）並非神祕黑盒子——全部可以用 200 行 Python 從頭組裝出來；理解這些元件的設計權衡（efficiency vs expressiveness vs stability）才是 LLM 研究的真正入場券。

---

## 二、章節脈絡

### Section 1｜開場與助教介紹（00:00 ~ 04:30）

**重點摘要：** 第三年開課、5 位 TA 自介、從 2024 開始把 lecture 全部放上 YouTube。

**內容：**
- Tatsu 主講 architectures 與 scaling；Percy 主講其他
- 「two years ago when we started teaching this class, we weren't really sure of what we were going to expect」—— 第一年出乎意料多學生想學
- 即使「a coding agent could probably zero-shot a language model」，仍有人想理解底層
- 2024 開始把 lecture 公開——「you might have seen some of them」

> "We're bringing you the third edition of 336."

---

### Section 2｜為什麼要從零開始（04:30 ~ 10:00）

**重點摘要：** 「from scratch」不是要重發明輪子，而是要在「機械（mechanics）、心態（mindset）、直覺（intuitions）」三層都建立肌肉記憶。

**內容：**
- **Mechanics**：transformer 是什麼、model parallelism 怎麼運作——這層課堂可以教好
- **Mindset**：怎麼榨乾硬體、嚴肅看待 scaling——這層也可以教
- **Intuitions**：什麼 data/modeling decisions 會 work——**這層不能直接教**，必須到能跑大規模實驗的地方才學得到
- 「Bitter lesson」常被誤讀：「scale is all that matters, algorithms don't matter」是**錯的**——正解是「algorithms that scale are what matters」
- Accuracy = efficiency × resources，efficiency 在大規模下反而更重要
- OpenAI 2020 paper：2012 ~ 2019 ImageNet 上有 **44× 演算法效率提升**

> "Some design decisions are just not justifiable and purely come from experimentation... We offer no explanation. We attribute their success of these architectures all else to divine benevolence."（Noam Shazeer 引 SwiGLU 論文）

---

### Section 3｜歷史背景：2017 ~ 2026 LLM 演進（10:00 ~ 28:00）

**重點摘要：** Transformer (2017) → GPT-3 (2020) → Llama 系列 (2023+) → 開源追近閉源、Agent 時代降臨。

**內容：**
- 2017 Transformer 引入 self-attention + parallelization——DeepMind seq2seq 證明可擴展
- 2020 GPT-3 175B 參數展現 in-context learning——Google 匆忙訓練超大模型但**未達最佳 compute-optimal 點**
- DeepMind 獨立運作時已研究 optimal compute scaling laws（後成 Chinchilla 基礎）
- 開源運動：Luther（草根）、Meta OPT-175B（replication 但硬體問題）、Big Science
- 近三年 Llama / Llama 2 / Llama 3 + Mistral + 中國軍團（DeepSeek、Qwen、ByteDance、Tencent）
- **AI2 / Nvidia / Marine 計畫**：除權重外也 release paper + code + data——「這堂課沒有這些根本不可能存在」
- **LM 的定義演變**：fine-tune → prompt → chat → **agent**（一個連結可以展示一個巨大 agent trace）
- 但底層未變：**GPU + kernels + gradient + transformer + attention**——只是 specs（context length）變了

> "It is mind-boggling how strong some of these models are. You give it like a page of text and it does have some really complicated agentic coding task."

---

### Section 4｜Roadmap：5 個 Assignment 全景（28:00 ~ 60:00）

**重點摘要：** 5 個 assignment 對應 5 個 pillar——從單機訓練到 distributed RL。

**內容：**

| # | 主題 | 核心任務 |
|---|------|---------|
| 1 | Tokenizer + Transformer LM | 實作 BPE、transformer、loss、optimizer；資源 accounting；在 TinyStories / OpenWebText 訓練；leaderboard 衝 perplexity |
| 2 | Systems | 寫 Triton kernels、跨多 GPU parallelize、inference；B200 上玩 roofline analysis |
| 3 | Scaling Laws | 透過 training API 拿到 loss，用小實驗擬 scaling law，外推到目標 scale |
| 4 | Data | 從 raw web crawl 開始 filter / dedupe / 加工；這是 dirty work 但必要 |
| 5 | Alignment | 實作 DPO / GRPO，用於 math benchmark；今年希望 push realistic dimension |

**Assignment 1 的 takeaway**：雖然 tokenizer / modeling / training 看似分開，實則都在平衡三件事——
- **Expressive**：能 represent data 的複雜度
- **Stable**：parameter / gradient norm 在「Goldilocks zone」不爆不消失
- **Efficient**：在硬體上跑得快

> "Everything is about kind of balancing... expressive models... stable training... efficiency."

---

### Section 5｜Resource Accounting 入門（60:00 ~ 75:00）

**重點摘要：** 「6ND」是訓練 FLOPs 的基本公式；硬體瓶頸常在「memory bandwidth」而非「compute」。

**內容：**
- 訓練 7B model 在 1T tokens ≈ **6 × N × D** FLOPs（N = params，D = tokens）
- 記憶體 ≠ compute，必須把 parameters/activations 從 memory 搬到 compute、做運算、再搬回
- B200：2.25 PFLOPS（BF16）、8 TB/s memory bandwidth
- **Roofline analysis**：判斷 operation 是 compute-bound 或 memory-bound（通常 memory-bound）
- DGX B200 = 8 個 GPU 互連（NVLink）；千 GPU 級透過 InfiniBand/Ethernet
- **Operator fusion**：把 `read → compute A → write → read → compute B → write` 合併成 `read → compute A+B → write`——省一半 memory 流量
- **Tiling**：fusion 的進階版

> "Your memory is not where your compute is, and you have to move your either your parameters or activations into from the memory to compute."

---

### Section 6｜Distributed Training & Inference 概論（75:00 ~ 90:00）

**重點摘要：** 跨 GPU 移動資料**更貴**；sharding 的策略決定一切。

**內容：**
- 跨 GPU 的 collective ops：gather、reduce、all-reduce 是 distributed training 的基礎
- 4 種 sharding 策略：data、model（layers）、sequence、experts——各有 trade-off
- **Inference 兩階段**：prefill（平行填 KV cache，類似 training）+ decode（一次一個 token，memory-bound）
- Inference 加速：pruning、quantization、distillation、**speculative decoding**（小 model 先跑 N 個 token，大 model 平行驗證）
- Service batching：query 隨機到達，要 dynamic batching（training 是 batch 已定義好）

> "Decoding part, tokens are generated one at a time. And this is the part that is becomes quickly memory bound, and this is why inference is hard."

---

### Section 7｜Scaling Laws：從單模型到「Scaling Recipe」（90:00 ~ 115:00）

**重點摘要：** 大規模不能逐個 hyperparameter 試——必須用小實驗擬 scaling law 外推。

**內容：**
- 1e25 FLOPs = 數千萬美元 compute——只能 train **一次**
- **關鍵概念轉移**：從「train 單一模型」變成「設計 scaling recipe」（FLOPs budget → hyperparameter config 的映射）
- 用小實驗 fit scaling law → 外推到目標 scale 的 loss → 募資：「請給我錢，我能 train GPT-5 等級的 model」
- **「Scaling laws are not laws of nature」**——你必須 will them into existence（careful construction of scaling recipe）
- **Hyperparameter transfer**：小 scale 用的 LR / batch size 必須可預測地延伸到 large scale
- **Predictability ≥ Optimality**：為了大規模穩定，可預測性有時比最優解更重要
- **Chinchilla rule of thumb**：token count ≈ 20× params（70B model ≈ 1.4T tokens）
- 但 inference cost 改變一切——現代小 model 訓練 token 數遠超 compute-optimal

> "The predictability is actually at least as important as optimality."

---

### Section 8｜Data：Curation、評測、過濾、合成（115:00 ~ 140:00）

**重點摘要：** Data quality 決定 model 品質；web crawl 是「髒到必須主動清理」的狀態。

**內容：**
- 先講 evaluation：內部（development 用，如 perplexity）vs 外部（report 給客戶用）
- Perplexity 至今仍是捕捉模型內在品質的好指標
- 來源：web、books（爭議）、archive papers、GitHub code、synthetic data
- **法律問題**：很多 GitHub code 沒 license——「樂觀假設 permissive」還是「保守假設不可用」？
- Data processing 流程：transformation（HTML/PDF/code → text）→ filtering → deduplication → mixing
- **Synthetic data**：用真實資料改寫成下游任務格式、或生 Wikipedia-style 內容
- 三種 data 用途：pre-training、mid-training（高質量 + long context）、post-training（對話、agent traces）

> "Data does not just fall from the sky. It has to be actively curated."

---

### Section 9｜Alignment：從 Full Supervision 到 RL（140:00 ~ 150:00）

**重點摘要：** 當 ground truth 難取得時，用 critique 來 weak supervise。

**內容：**
- Full supervision：next-token prediction（可選 multi-token prediction）
- Weak supervision：generate → score（human / verifier / LM judge）→ update
- 演算法：PPO、GRPO、DPO（preference data）
- **RL 痛點**：不穩定、難調、scale 後有 throughput 挑戰（inference server + training server 同步）
- **On-policyness vs throughput** 的取捨

---

### Section 10｜Tokenization 概論（150:00 ~ 160:00）

**重點摘要：** Raw text（Unicode）↔ tokens（indices）的 round-trip——tokenizer 是 LM 的「語言介面」。

**內容：**
- Tokenizer 必須 round-trip（encode → decode 回原文）
- **壓縮率** = bytes / token——越大越好（attention 是 O(n²)，序列越短越好）
- Vocab size 與壓縮率 trade-off：vocab 大 → 稀疏；vocab 小 → 序列長
- 現代多語 tokenizer 通常 100K ~ 200K tokens
- Tokenizer 為什麼「煩人」：因為 word 和「前綴空白 + word」是**不同 token**（hello vs 「 hello」）
- 數字可能每幾位數就一個 token（或每數字一個 token）

> "Many of tokens you'll actually see are space word, which is you know, fine, but kind of strange."

---

### Section 11｜Tokenization 方案演進（160:00 ~ 175:00）

**重點摘要：** Character-level → byte-level → word-level → BPE——前 3 種都有致命缺陷。

**內容：**

| 方案 | Vocab size | 壓縮率 | 致命問題 |
|------|------------|--------|----------|
| Character-level (Unicode codepoint) | 150K | 差 | 罕用字浪費 vocab |
| Byte-level (UTF-8) | 256 | 1.0 | 序列太長 |
| Word-level (whitespace split) | unbounded | 好 | OOV 問題、`<unk>` 會搞壞 perplexity |
| **BPE** | 動態（可調） | 好（資料驅動） | 啟發式但有效 |

- BPE 是 1994 資料壓縮演算法；2016 引入神經機器翻譯；GPT-2 首次用於 LM
- **核心性質**：常見序列 = 1 token、罕見序列 = 拆成多 token（無 `<unk>`）

---

### Section 12｜BPE 演算法實作示範（175:00 ~ 結束）

**重點摘要：** BPE = 「反覆 merge 最常見的相鄰 byte pair」直到 vocab 到達目標大小。

**內容：**
- 演算法（簡化）：
  1. 起始 corpus → byte sequence
  2. 數所有相鄰 byte pair 出現次數
  3. Merge 最常見的 pair → 創新 token（編號 = current vocab size）
  4. 重複直到 vocab 達目標
- 範例「the cat in the hat」：
  - 起始：byte seq，pair (116, 104) = 「th」出現 2 次 → merge → token 256
  - 下次：pair (256, 101) = 「the」merge → token 257
  - 再下次：merge 到 258
- 編碼新字串：套用 learned merges 的順序
- **Assignment 1 的優化方向**：用 index 結構只 loop 與當前 bytes 有關的 merges
- 還要支援 **special tokens**（`<|endoftext|>` 等）
- 工業級 tokenizer 會先 **chunk** 文字再 encode，避免一次處理整個超長字串
- Python 太慢的話，鼓勵用 Rust/C 重寫

> "BPE is effective heuristic that is data-driven. Pretty effective. Maybe next year I don't have to teach this but for this year we're stuck with tokenization."

---

## 三、關鍵概念定義

| 概念 | 定義 | 本講脈絡 |
|------|------|---------|
| **Mechanics** | 怎麼運作（transformer 結構、parallelism） | 可在課堂教好 |
| **Mindset** | 怎麼榨乾硬體、嚴肅看待 scaling | 可在課堂建立 |
| **Intuitions** | 什麼 modeling / data 決策會 work | 必須實驗得來 |
| **Bitter Lesson** | 「Algorithms that scale are what matters」（誤讀：scale alone） | 正確解讀：scale-friendly 算法最重要 |
| **Compute-optimal** | 給定 FLOPs budget，選 model size + data 達最低 loss | Chinchilla rule：tokens ≈ 20× params |
| **Hyperparameter Transfer** | 小 scale 的 hyperparameter 可預測地延伸到 large scale | 預測性比最優性更重要 |
| **Operator Fusion** | 把多個 op 合成一個 kernel，省 HBM 流量 | Triton / 自訂 kernel 核心技巧 |
| **Roofline Analysis** | 判斷 op 是 compute-bound 或 memory-bound | 通常 memory-bound |
| **Speculative Decoding** | 小 model 先跑 N token，大 model 平行驗證 | inference 加速關鍵 |
| **Weak Supervision** | 用 critique 評分取代 ground truth | alignment 通用模板 |
| **BPE (Byte Pair Encoding)** | 反覆 merge 最常見 byte pair | 1994 data compression → GPT-2 LM |

---

## 四、人物 / 角色分析

| 人物 | 角色 | 背景 |
|------|------|------|
| **Percy Liang** | 主講（前半） | Stanford CS 教授，20 年 LM 經驗，Marine 計畫主持人之一 |
| **Tatsu Hashimoto** | 主講（架構/scaling） | 共同授課，每年重做所有 lecture 因為 architecture 變太快 |
| **Marcel** | CA | 上過一次課，做 higher-order gradients、architecture、training |
| **Herman** | CA | 一年前不知道 LLM 怎麼運轉，現已是 LLM 研究員 |
| **Steven** | CA（首次） | LM 理論 + data efficiency 研究 |
| **Noam Shazeer** | 引言人物 | SwiGLU 作者，論文結論自嘲「we attribute their success to divine benevolence」 |
| **AI2 / Marine / Nvidia** | 開放生態系 | release weights + paper + code + data 的 LM 聯盟 |

---

## 五、核心主旨總結

Stanford CS336 第三年的第一講把整門課的 roadmap 完整攤開：**5 個 assignment 對應 5 個 pillar**（tokenizer → systems → scaling laws → data → alignment），全部用「**從零開始**」的精神——即使「coding agent could probably zero-shot a language model」，理解底層 mechanics 與 mindset 仍是 LLM 研究者最重要的入場券。BPE 雖然是 30 年老演算法，但因為 frontier model 都還在用，今年仍教；但 Percy 預期**明年可能可以跳過**——因為終究會有 end-to-end byte-level 方案取代它。

---

## 六、金句摘錄

> "We're bringing you the third edition of 336."（Percy Liang）

> "We offer no explanation. We attribute their success of these architectures all else to divine benevolence."（Noam Shazeer, SwiGLU 論文）

> "Some design decisions are just not justifiable and purely come from experimentation."（Percy Liang）

> "Algorithms that scale are what that or what matters."（Percy Liang 重解 bitter lesson）

> "The predictability is actually at least as important as optimality."（Percy Liang）

> "Your memory is not where your compute is."（Percy Liang 講 roofline）

> "Data does not just fall from the sky. It has to be actively curated."（Percy Liang）

> "BPE is effective heuristic that is data-driven. Pretty effective. Maybe next year I don't have to teach this."（Percy Liang）

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260414_StanfordCS336_Lecture1_OverviewTokenization_口播稿.txt

- [opus X.X MB](../audio/20260414_StanfordCS336_Lecture1_OverviewTokenization.opus)（Telegram 友善）
- [m4a X.X MB](../audio/20260414_StanfordCS336_Lecture1_OverviewTokenization.m4a)（iOS 友善）
- [mp3 X.X MB](../audio/20260414_StanfordCS336_Lecture1_OverviewTokenization.mp3)（通用格式）