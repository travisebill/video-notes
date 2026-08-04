---
講者: Stanford CS329A 課程團隊
影片連結: https://www.youtube.com/watch?v=Uni9dqyuuDM
影片長度: 1:12:27（4347s）
發布日期: 2026-08-03
---

# 【Stanford CS329A — Part 7 — Self-Improvement and Deep Research Agents】

> ⚠️ **本片為 Stanford CS329A「Self-Improving AI Agents」系列 Part 7**，從「**搜尋模型本身**」的角度出發，把 Part 2（Inference-time Scaling）與 Part 3（Verification）推向 production-scale：先看 AlphaCode / AlphaCode 2 如何把 sampling + filtering + clustering + scoring 做成 competitive programming pipeline；再拉到 deep research 場景，看 Search-o1 如何用「**在推理過程中即時觸發搜尋 + 摘要**」對付 LLM 的知識邊界。

---

## 主題與背景

本課核心訊息：**「解」存在於模型 output 的搜尋空間裡，但要用工程手段把解 curate 出來**。這條主線在 CS329A 系列中反覆出現——Part 2 講 inference-time scaling，Part 3 講 verification，但本課把這兩件事**接上 production pipeline**：當題目從單題 HumanEval 升級到 1M samples 的 competitive programming、從單跳問答升級到 multi-hop deep research，模型的搜尋空間本身沒變，但**怎麼搜、怎麼挑、怎麼餵回 prompt** 才是真正的工程難題。

### 兩個搜尋典範：Code Sampling vs. Agentic Search

講者一開場就把本課切成兩種 search：

1. **Code-style search**：模型 sample 大量程式解 → 用 filter + cluster + score 把 1M 縮到 10 個真正會贏的 submission。代表 paper 是 AlphaCode 與 AlphaCode 2。
2. **Deep research style search**：模型在 reasoning 過程中**即時觸發** search tool → 把 uncertain 詞彙（"perhaps"、"wait"）變成 query → 拿回的 document **再被 chunk + analyzed**，只把 relevant chunk 餵回 prompt。代表 paper 是 Search-o1。

兩者設計哲學一致——**不假設模型一次給對答案，而是在搜尋空間裡做二次挑選與重整**。差別在搜尋的軸：code 是「**生成後挑**」（sample-then-pick），research 是「**生成中查**」（reason-then-fetch）。

### 為什麼 1M samples 的成本值得

講者在 Q&A 強調：**95% 的 sampled code 不會 compile 或語法錯誤**。AlphaCode 2 把 95% 砍掉後才留下 50K candidates、再 cluster 到 10 個 cluster、再用 scoring model 挑出 top-1 per cluster。這條 pipeline 雖然燒 compute，但換來「**搜尋空間覆蓋率**」——只要有 1 個 sample 是對的，整個系統就能贏。這呼應 Part 2「pass@k 隨 k 對數線性成長」的觀察。

### 三個 paper 的進程

| # | 系統 / 論文 | 年代 | 核心切入點 | 在 self-improving loop 的角色 |
|---|------|------|----------|------------------------------|
| 1 | **AlphaCode** | 2022 | 預訓練小模型 + 1M samples + filter + cluster | 證明 large-scale sampling 在 competitive programming 有效 |
| 2 | **AlphaCode 2** | 2023 | Gemini Pro fine-tune + scoring model + family of models | 把 search pipeline 升級到「better model + learned reward」 |
| 3 | **Search-o1** | 2024 | Reasoning 過程中觸發 search + document analysis + chunk injection | 把 test-time search 從「code 答題」推到「deep research」 |

> 三者構成「**從 sample-then-pick 到 reason-then-fetch**」的演進：先把 inference 放大，再把搜尋從離線變成即時，最後把搜尋結果 refine 進 reasoning chain。

---

## Section 1｜開場 + Competitive Programming 為什麼難（00:00 ~ 08:30）

講者開場點題：**今天的重點是「用 search 改善模型」**，會見到兩種 search——code models 的 sample-then-search（Part 2 inference-time scaling 延伸），以及 deep research 風格的 search（在 homework 3 會用到）。

講者提出貫穿全課的核心命題：**「解就在模型的搜尋空間裡，但怎麼把解 curate 出來是真正的問題」**。這個觀察對應到 Part 2 的 pass@k 曲線——只要搜尋空間覆蓋率高，pass rate 就會 log-linear 上升——也對應到 Part 3 的 verification 主題——verification 不是 final scoring 工具，而是 **selection 階段的核心元件**。

講者先解釋「為什麼 competitive programming 比 code completion 難得多」：

- **Code completion**（Copilot 類）：一行 autocomplete，模型只要延續 user 的 intent，**互動是漸進的、開發者可以即時修正**——這種場景下模型 pass rate 很高。
- **End-to-end coding problem**（AlphaCode 場景）：給一段 problem description（可能是幾百字）、input/output contract，**模型要自己理解問題 + 規劃演算法 + 寫出完整 solution**。

AlphaCode 2022 達成的成績：在 10 場 Codeforces 競賽中，**平均排名前 54%**——這是 AI 第一次證明可以 end-to-end 解 competitive programming 問題，而不只是做 narrow task。講者點出這比 HumanEval 難是因為：① problem descriptions 更長、② solution lengths 更長、③ 驗證只能靠 hidden test。

> **核心 insight**：end-to-end coding 是 self-improving agent 的第一個真實 benchmark——因為驗證可以**完全自動化**（執行 + 比對 output），但 generation 需要**極大的搜尋空間**才能覆蓋到正確解。

---

## Section 2｜AlphaCode Pipeline：從 Pre-training 到 1M Samples（08:30 ~ 18:00）

AlphaCode 的 pipeline 可拆成 **5 個 stage**：

| Stage | 動作 | 細節 |
|-------|------|------|
| 1 | **Pre-training** | 用 ~700GB GitHub code 做 next-token prediction 的 encoder-decoder（或後來的 decoder-only）模型 |
| 2 | **Fine-tuning** | 在 CodeContest 資料上加 **value conditioning**——給高 likelihood token 較高 weight、低 likelihood token 較低 weight（gold loss），提升 precision |
| 3 | **Massive sampling** | 每題 sample **1 million 個解**（半 Python、半 C++），用高 temperature + 隨機化 problem tags 與 ratings 增加 diversity |
| 4 | **Filter + cluster** | 先 filter 出「能 pass example tests」的解（砍掉編譯失敗 / 顯然錯誤的），再用 **separate test-input generation model** 對剩下的解做 clustering——**cluster by semantic equivalence**，保留 10 個最大 cluster 的代表解 |
| 5 | **Submit + evaluate** | 把 10 個解送上 Codeforces 平台，由平台執行 hidden tests 並給出排名 |

**Clustering 的設計動機**：competition 平台只允許**有限次 submission**，所以 1M solutions 必須先壓縮。Clustering 用「**semantic equivalence**」當 heuristic——同 cluster 的解通常代表同一個演算法（語法不同但邏輯等價），這樣能確保留下的 10 個解代表**不同的解題策略**，不是同一策略的 10 種寫法。

講者在 Q&A 補充重要的 variance 來源：① **問題難度差異**——不同 contest 難度分布不同，alpha code 在簡單 contest 表現好、難 contest 差很多；② **Selection stage bottleneck**——1M → 10 的壓縮過程會丟失真正的正確解，特別是「**接近對但不完全對**」的解最容易被 cluster 邊緣化；③ **Diversity 假設**——pass@k 的 log-linear 增長假設 sample 之間是 diverse 的，如果 model capacity 不夠，sample 1M 也只是 1M 個近似解。

> **核心 insight**：AlphaCode 的真正貢獻不是「做出更強的 code model」，而是「**把 sample + filter + cluster + evaluate 做成 production pipeline**」——驗證可以自動化時，搜尋空間覆蓋率就變成可 engineering 的變數。

---

## Section 3｜10@k vs. pass@k：Selection Bottleneck 的量化（18:00 ~ 28:00）

講者用一張 slide 把 AlphaCode 的 evaluation metrics 講清楚：

| Metric | 意義 | 對 pipeline 的要求 |
|--------|------|-------------------|
| **pass@k** | 模型 sample k 個解、**全部**送 hidden test 評估 | 只要 generation 強就好 |
| **10@k** | 模型 sample k 個解、但**只用 10 個**送 hidden test | 需要 filtering + clustering 把 10 個解選出來 |

實驗結果：

- 在 validation set 上，9B 模型、41B 模型、41B+clustering 三組都畫 10@k 隨 sample budget 變化的曲線。**41B+clustering 永遠最好**——clustering 在不同 budget 下都穩定貢獻 improvement。
- 在 test set 上同樣的 log-linear 趨勢：sample 從 1K → 10K → 100K → 1M，**solve rate 持續上升**。
- **pass@k（無限 attempts）** vs. **10@k（10 attempts）**：同樣 1M sample budget，pass@k 可以到 40%+，但 10@k 只有 30%——**這 10 個百分點的差距就是 selection bottleneck**。

Q&A 段有學生問「如果把 log-linear 趨勢推到 1 trillion samples 是不是就能 double performance」，講者回答：

- 趨勢本身是理論可推導的（**Large Language Monkeys paper** 已經 derive 過 log-linear）。
- **實際上 diversity 不會無限增長**——sample 10x 但 diversity 沒增加，coverage 不會跟著漲。Clustering 本身就是在 estimate diversity，如果 cluster 數量沒變多，sample budget 加大就只是浪費。

> **核心 insight**：log-linear scaling 的前提是 **diversity scales with samples**。Model capacity 不夠時，這個前提會破裂——selection bottleneck 就從「壓縮算法」變成「模型本身搜尋空間太小」。

---

## Section 4｜AlphaCode 2 的三大升級 + Homework 提示（28:00 ~ 52:00）

AlphaCode 2（2023）針對 AlphaCode 的瓶頸做三個升級：

### 升級 1：放棄 pre-training，直接 fine-tune Gemini Pro

AlphaCode 自己 pre-train 一個小模型；AlphaCode 2 直接用 Gemini Pro 當 base。假設：**好的 foundation model 已經把 code distribution 學得不錯**，只要 fine-tune 到 competitive programming 風格就好。

### 升級 2：Family of models 增加 diversity

AlphaCode 只用一個 model 來 sample；AlphaCode 2 **fine-tune 多個 variants**（不同 hyperparameters、不同 difficulty levels、不同 tags），每個 variant 負責一種解題風格。Sample 時 split 給不同 variant，diversity 來自「**不同的 model 偏好不同演算法**」。

### 升級 3：Learned scoring model

AlphaCode 用 clustering（heuristic）挑 10 個解；AlphaCode 2 **train 一個 reward model**（用更高品質、人手 curated 的 dataset）來對每個解打分。新流程：sample → filter 掉不 compile / 錯的（95% 被砍）→ 留下 ~50K → cluster 保留 10 largest cluster → **scoring model 對每個 cluster 的代表解排序** → 送出 top candidate per cluster。

> **核心 insight**：selection 從 heuristic 升級成 learned，是 self-improving loop 的關鍵——verifier 不再只是「給 final answer 打分」，而是「**學會什麼是好的 candidate**」的 reward model。

### 量化成果

- AlphaCode 2 用 100 samples 就達到 AlphaCode 1M samples 的 solve rate——**search efficiency 提升 10000 倍**。
- AlphaCode 2 用 1M samples 達到 43% solve rate，比 AlphaCode 25% **接近 2x**。
- Codeforces percentile：top 2 solution 達到 **99.5th percentile**，average **85th percentile**（AlphaCode 1 是 54th）。

講者總結 AlphaCode / AlphaCode 2 的三個已知限制：

1. **Loss 與 solve rate 不一致**：cross-entropy loss 是 poor proxy for solve rate——同一題有多個合法解，model 把 loss 壓低不代表會解出所有解。
2. **Difficult domains 表現弱**：dynamic programming、constructive algorithms 等需要「**多步推理**」的領域，純 sample-then-pick 效果有限。
3. **Compute cost 高**：1M samples / 題 在 production 上不可行，需要 adaptive sampling 或 iterative refinement。

講者提出兩個問題給學生討論：

**Q1：怎麼根據 task complexity 改 sampling strategy？**
學生建議：train 一個 classifier 判斷 easy/medium/hard；easy 題用少 sample、hard 題用多 sample。講者補充：「**if the problem is easier, the model is more likely to generate the solution in the search space of what it outputs**」——所以 easy 題可以用 iterative refinement，hard 題才需要 parallel sampling。

**Q2：怎麼把 reasoning 直接 embed 進 model？**
學生建議：在 training set 加 hint / chain-of-thought annotation（先寫演算法思路、再寫 code）。講者補充：這就是 STaR（Self-Taught Reasoner）方法——讓 model 自己生成 solution + 給 hint，再訓練它從 hint 推出 reasoning。

> **核心 insight**：AlphaCode 框架的下一個進化方向是「**close the loop at multi-step fashion**」——sample 一個 step、驗證、再決定要不要 backtrack——這已經是 Part 5 LATS 的 MCTS tree search 思想。

---

## Section 5｜Deep Research Agent：知識邊界與 Simple RAG 的不足（52:00 ~ 58:00）

講者把場景從 competitive programming 切到 deep research agent（Homework 3 會用到這套方法）。

### LLM 的知識邊界

- **Knowledge cutoff**：LLM 訓練資料有截止日，昨天發生的事不在 model 權重裡。
- **Knowledge gap 表徵**：reasoning chain 中出現 "perhaps"、"alternatively"、"wait" 等詞時，代表 model **自己感覺不確定**——這是**可偵測的 signal**，可以用來 trigger search。
- **錯誤 cascade**：一個 guess 錯了 → 整個 reasoning chain 都建立在錯的基礎上 → final answer 幾乎必錯。

### 為什麼 Simple RAG 不夠

講者先說明最直觀的解法：**query → search → retrieved document → put in prompt → get answer**。但有兩個限制：

1. **單次 retrieve 不夠**：complex question 需要 multi-step reasoning，每一步需要的資訊可能不同。weather query 一次就夠，但「解決一個化學反應問題」需要多次查詢。
2. **Multi-step reasoning suffer**：research 顯示 simple RAG 在 multi-step 上改善有限，因為 reasoning 過程需要的 context 隨 step 數累積，但 RAG 只 retrieve 一次。

> **核心 insight**：knowledge gap 是 reasoning chain 的 **uncertainty token**，這些 token 就是 trigger search 的最佳 hook——比盲目 retrieve 更精準。

---

## Section 6｜Search-o1：三個核心設計（58:00 ~ 1:05:00）

**Search-o1**（2024）解決 simple RAG 的不足，三個核心設計：

### 設計 1：Agentic RAG（搜尋即時觸發）

- Model 在 generation 時**自己決定何時搜尋**。
- 機制：train / prompt model 在 uncertain token 前後插入 `<search>` tag、query 在 tag 之間、document 在 `</search>` 之後插入 reasoning chain。
- 每次 reasoning step 都可能 trigger search，**multi-turn iteration within a single reasoning session**。

### 設計 2：Reason-in-Documents（文件內部推理）

- Retrieved document 通常很長（10-20 份），把全部塞進 prompt 會 noise 太大。
- Search-o1 用一個 **reason-in-documents module**：對每份 document 做 **chunk-level relevance analysis**，只把 relevant chunk 餵回 prompt。
- 比喻：人類讀 references 時不會全部讀完，會**take notes**——這個 module 就是 model 的 note-taking 機制。

### 設計 3：Iterative refinement

- 第一輪 search → 拿到 documents → chunk + analyze → 餵回 prompt → 重新 reasoning → **如果還看到 uncertain token 就再搜一次**。
- 形成 **reasoning + search + refine** 的 iterative loop，直到 model 對自己答案 confidence 夠高。

> **核心 insight**：Search-o1 把 search 從「offline retrieve」變成「**online reason-then-fetch**」——搜尋變成 reasoning 的一部分，document analysis 變成 reasoning 的過濾器。

### 量化結果

- **GPQA**（physics / chemistry / biology）：Search-o1 在 physics 與 biology 上接近或超過 human experts；在 chemistry 還有 headroom。
- **Multi-hop QA**（HotpotQA、2WikiMultihopQA、Music、Bamboogle）：Search-o1 在多個 benchmark 上**都拿到 SOTA**（slide 中以粗體標示），比 simple RAG 與 agentic RAG 都好。
- **Pass@1 vs. # of documents**：standard reasoning 與 simple RAG 的 accuracy 隨文件數增加**不會上升**（甚至會因 noise 下降），但 Search-o1 的 accuracy **隨文件數單調上升**——因為 chunk-level analysis 把 noise 過濾掉了。

講者補充：「**uncertainty tokens（perhaps / alternatively / wait）的數量在 Search-o1 中大幅下降**」——這代表 model 對自己的答案更有信心，因為它可以反覆 verify。

---

## Section 7｜Search-R1 vs. Search-o1 + Hallucination Q&A（1:05:00 ~ 1:12:27）

### Search-R1（提過但未展開）

講者用一分鐘提到 **Search-R1** 跟 Search-o1 的差異：

- **Search-o1**：用 prompting-based approach close the loop。
- **Search-R1**：用 **reinforcement learning** train model 自己學會「何時 search、search 什麼」。
- 兩者精神一致，差別在於「**learn the search policy**」是用 prompt 還是 RL。

講者說本課時間不夠展開 Search-R1，建議學生自己讀 paper。RL-based search policy 是 deep research agent 的下一個 frontier。

### Q&A：Model 是否知道自己的不確定性

學生問：「**模型 log-probability 跟答案正確性有沒有相關性？**」——也就是 model 自己知不知道答案對不對。

講者回答很關鍵：

1. **Model 普遍 overconfident**：把 log-prob 拿來當 confidence，model 50% 正確的題可能仍給出 80% confidence。**Calibration 普遍不佳**。
2. **但有相關性**：如果答案是對的，model 大概率 confidence 高；如果答案是錯的，model 仍然會 confidence 高（**overconfidence 是雙向的**——對錯都自信）。
3. **Active research area**：要 model 「知道自己不知道」是個 open problem。**RLHF on confidence**、**second-pass confidence estimation**、**explicit "I don't know" training** 都是方向。

> **核心 insight**：這是 deep research agent 的根本挑戰——如果 model 自己都不知道自己不知道，automatic uncertainty detection（Search-o1 的方法）就只能用 heuristic token 來近似。要真正 close the loop，需要 model 對自己的 confidence 有 calibrated estimate。

講者最後一句：「**Hallucinations — the ability of the model to know what they know — is an active area of research, and it's actually a great set of research projects if someone wants to pursue it.**」——把這個問題留給學生作為延伸方向。

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone xiaotian_clone_v1, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：[transcripts/口播稿.txt](../transcripts/口播稿.txt)（全知分析者視角）

- [opus XX MB](../audio/口播稿.opus)（Telegram 友善，32k Opus）
- [m4a XX MB](../audio/口播稿.m4a)（iOS 友善，128k AAC）
- [mp3 XX MB](../audio/口播稿.mp3)（通用格式，HD 音質）

> **第一段（開頭）**：本片介紹 Stanford CS329A Part 7 的兩種 test-time search 典範——AlphaCode / AlphaCode 2 用 sample-then-pick 在 competitive programming 達到 85th percentile；Search-o1 用 reason-then-fetch 在 deep research 場景把 GPQA 推到接近 human expert。

> **第二段（中段）**：AlphaCode 的關鍵是 1M samples + filter + cluster + evaluate pipeline，10@k vs. pass@k 揭露 selection bottleneck；AlphaCode 2 升級成 Gemini Pro + family of models + learned scoring model，把 search efficiency 提升一萬倍。Search-o1 三招——agentic RAG、reason-in-documents、iterative refinement——把 uncertainty token 變成 search trigger，只把 relevant chunk 餵回 prompt。

> **第三段（結尾）**：本課呼應 Part 2 的 inference scaling 主線，把「搜尋空間覆蓋率」工程化成 production pipeline；同時呼應 Part 3 的 verification 主線，把 verifier 從 heuristic 升級成 learned reward model。最後 Q&A 點出 hallucination 與 calibration 的 open problem——model 是否知道自己的不確定性，是 deep research agent 的根本瓶頸。

---

## 關鍵概念定義

### 概念1：搜尋空間 (Search Space of Model Outputs)

| 定義 |
|------|
| 模型在 sampling temperature 下所有可能 output 的集合。Self-improving agent 的核心假設：正解在這個空間裡，需要用 search / verification 把解 curate 出來。 |

### 概念2：取樣 (Sampling)

| 定義 |
|------|
| 從模型輸出分布中抽出 N 個獨立解。N 越大、temperature 越高，diversity 越大。 |

### 概念3：篩選 (Filtering)

| 定義 |
|------|
| 砍掉編譯失敗、明顯錯誤、或不符合 problem constraint 的 samples。AlphaCode filter 後剩下 ~5%（95% 被砍）。 |

### 概念4：聚類 (Clustering)

| 定義 |
|------|
| 把語法不同但語意等價的解歸為一群。AlphaCode 用 separate test-input generation model 來判斷語意等價性。 |

### 概念5：評分模型 (Scoring Model)

| 定義 |
|------|
| AlphaCode 2 引入的 learned reward model，取代 clustering heuristic 來對 candidate 解排序。 |

### 概念6：10@k (Selection-Bounded Pass Rate)

| 定義 |
|------|
| sample k 個解但只能送 10 個評估。對 production 環境（submission 上限有限）的實際評估 metric。 |

### 概念7：pass@k (Unlimited Pass Rate)

| 定義 |
|------|
| sample k 個解全部送評估。是 model generation 能力的上界，但忽略 selection cost。 |

### 概念8：選擇瓶頸 (Selection Bottleneck)

| 定義 |
|------|
| pass@k 與 10@k 的差距。代表「搜尋空間覆蓋率」與「實際可送出解的品質」之間的 loss。 |

### 概念9：對數線性增長 (Log-Linear Scaling)

| 定義 |
|------|
| pass@k 隨 sample budget 增加呈 log-linear 成長。理論基礎在 Large Language Monkeys paper 推導。前提是 diversity 也跟著增加。 |

### 概念10：多樣性飽和 (Diversity Saturation)

| 定義 |
|------|
| Model capacity 不夠時，sample N 倍只換來 N 個近似解、不增加 diversity——log-linear 趨勢破裂。 |

### 概念11：代價函數 (Value Conditioning / Gold Loss)

| 定義 |
|------|
| AlphaCode fine-tune 時對高 likelihood token 給高 weight、低 likelihood token 給低 weight，目標是提升 precision。 |

### 概念12：模型家族 (Family of Models)

| 定義 |
|------|
| AlphaCode 2 fine-tune 多個 variants（不同 hyperparameters、不同 difficulty），sample 時 split 給不同 variant 換 diversity。 |

### 概念13：知識截止 (Knowledge Cutoff)

| 定義 |
|------|
| LLM 訓練資料的最後日期。截止日後發生的事件不在 model 權重中，需要外部 retrieval。 |

### 概念14：推理鏈不確定性 (Reasoning Chain Uncertainty)

| 定義 |
|------|
| Model 在 chain-of-thought 中出現 "perhaps"、"alternatively"、"wait" 等詞，代表 model 自己感覺不確定——這是 Search-o1 觸發 search 的 hook。 |

### 概念15：代理式 RAG (Agentic RAG)

| 定義 |
|------|
| Model 在 reasoning 過程中**即時決定**何時 search 與 search 什麼，而非預先 retrieve 一次。Search-o1 的核心機制。 |

### 概念16：文件中推理 (Reason-in-Documents)

| 定義 |
|------|
| 對 retrieved document 做 chunk-level relevance analysis，只把 relevant chunk 餵回 prompt。Search-o1 把 long document 的 noise 過濾掉的關鍵。 |

### 概念17：疊代精煉 (Iterative Refinement)

| 定義 |
|------|
| Search → chunk → analyze → 餵回 prompt → 重新 reasoning → 如果還看到 uncertainty 就再搜。重複直到 model confidence 夠高。 |

### 概念18：多跳問答 (Multi-Hop Question Answering)

| 定義 |
|------|
| 答案需要從多個 documents 串接推論出來（如 HotpotQA、2WikiMultihopQA）。Simple RAG 在這種 setting 容易卡在 single-hop。 |

### 概念19：領域專家基線 (Human Expert Baseline)

| 定義 |
|------|
| GPQA 等 benchmark 收錄 domain-specific experts（physics、chemistry、biology PhD）的正確率，作為 model 對標基準。 |

### 概念20：信心 vs. 正確性 (Confidence vs. Correctness)

| 定義 |
|------|
| Model log-probability 給出的 confidence 與答案是否正確的相關性。研究顯示 model 普遍 overconfident——答對時 confidence 高、答錯時也 confidence 高。 |

### 概念21：校準 (Calibration)

| 定義 |
|------|
| Model 對自己 confidence 的估計是否反映實際正確率。Calibration 差是 LLM 已知缺陷，影響 uncertainty detection 的可信度。 |

### 概念22：搜尋式強化學習 (Search-Style RL / Search-R1)

| 定義 |
|------|
| 用 reinforcement learning train model 自己學會 search policy（何時搜、搜什麼），相對於 Search-o1 的 prompting-based approach。 |

### 概念23：任務分解 (Task Decomposition)

| 定義 |
|------|
| 把複雜問題拆成 sub-problems 各自搜尋、然後合成答案。是 deep research agent 處理 multi-hop question 的常見策略。 |

### 概念24：自我閉環 (Self-Closing the Loop)

| 定義 |
|------|
| Model 自動偵測自己 output 不對 → 自動修正 → 自動 re-evaluate 的循環。AlphaCode 用 sample + filter、Search-o1 用 reason + retrieve，都是 self-closing loop 的具體實作。 |

---

## 金句摘錄

### 金句1

> "Today's focus will be very much on improving the models using search... one in code models where we are sampling a lot and then searching based on that, and then deep research style search."——開場點出本課兩種 search 典範：code-style sample-then-pick 與 deep research reason-then-fetch。

### 金句2

> "We kind of know that the solutions lie in the search space of the models, but how do you curate the answer out of the search space of what the model outputs is roughly what we are covering today."——全課核心命題：解在搜尋空間裡，但 curate 是工程難題。

### 金句3

> "AlphaCode ranked top 54% among contest participants in 10 contests... this was the first time it was shown that AI can generalize beyond narrow tasks and solve problems end-to-end."——AlphaCode 2022 的里程碑意義：end-to-end competitive programming 比 HumanEval 難得多，是 self-improving agent 的第一個真實 benchmark。

### 金句4

> "They generate 1 million diverse sample programs per question... machines can do that... they randomize the problem tags and the ratings in the prompt and they use a high sampling temperature."——AlphaCode 的 massive sampling 是 diversity-first 的設計：1M 解 + 高 temperature + random tag 換 coverage。

### 金句5

> "The solve rate definitely scales log-linearly with more samples... if you have unlimited attempts you get higher accuracy than if you only have 10 attempts — the selection stage is the bottleneck."——10@k vs. pass@k 揭露 selection bottleneck 是搜尋效率的根本限制。

### 金句6

> "One of the challenges with sampling more is that you assume diversity continues to increase... if you sample 10x more but don't end up with more diverse solutions, you're not going to improve."——Log-linear scaling 的前提是 diversity 也跟著漲；model capacity 不夠時 diversity 飽和，整個 scaling 軸就失效。

### 金句7

> "They are actually going for a scoring function which can learn that function... it's a learned approximation of what should be given high score and what should be given a low score."——AlphaCode 2 把 selection 從 heuristic 升級成 learned，scoring model 是 self-improving loop 工程化的關鍵。

### 金句8

> "AlphaCode 2 with 1 million samples was solving 43% while AlphaCode was only getting 25%... a better base model, better diverse solutions, and better scoring is giving them performance gains which is almost 2x."——AlphaCode 2 的整體 pipeline 提升把 solve rate 推升接近 2 倍，但核心不是 scaling sample 數，而是 model + diversity + scoring 三者同時改善。

### 金句9

> "Large reasoning models have impressive reasoning but they typically will not have the freshest knowledge... the knowledge gaps will show up as uncertainty in the way the model is thinking."——LLM 的 knowledge cutoff 問題在 reasoning chain 中以 uncertainty tokens 表徵，這是 deep research agent 的 trigger signal。

### 金句10

> "Retrieval augmented generation will improve over direct reasoning, but in multi-step reasoning it definitely suffers."——Simple RAG 在 single-hop 有用，但 multi-step 需要 iterative search 才能 close the loop。

### 金句11

> "Search-o1 proposes that whenever the model encounters unfamiliar knowledge it will search for helpful information... it will reason within the documents... extract the relevant content and then put it back in the reasoning chain."——Search-o1 三招：搜尋即時觸發 + 文件內部推理 + relevant chunk injection。

### 金句12

> "Hallucinations... the ability of the model to know what they know is an active area of research, and it's actually a great set of research projects if someone wants to pursue it."——收尾 Q&A 點出 deep research agent 的根本 open problem：model 是否知道自己不知道。

---

## Q&A 精選（學生提問 × 講者回答）

### Q1｜不同 contest 的表現為何差異這麼大？

學生問：AlphaCode 在不同 Codeforces contest 表現差異大（best 16%、worst 90%+），為什麼？

講者回答：兩個 hypothesis——① **問題分布差異**：in-distribution contest 表現好、out-of-distribution（需要新演算法的 contest）表現差；② **Selection bottleneck**：在不同 contest 上，filtering + clustering 的 bottleneck 程度不同，可能把「**接近對但不完全對**」的解錯殺。

### Q2｜95% sample 浪費有沒有更好的解法？

學生問：95% sampling 被砍掉很浪費，有沒有更好 prompting 或更可靠的 sampling 策略？

講者回答：① **Homework 1 的 self-refinement**：生成 → 收集 feedback → 修正——這個 iterative 過程可以減少 sample 數但增加 time；② **Train-time RL**：如果 model 在 RL loop 中變強，test-time sample budget 就可以降。兩種 approach 都能緩解 sampling waste。

### Q3｜為什麼 scoring model 不直接用 CodeContest V2？

學生問：scoring model 為什麼不用跟 generation model 一樣的 dataset？

講者回答：會有 contamination——scoring model 應該沒看過 generation model 的訓練題目。但可以**混合 dataset** 後分 stage train，只是會有 catastrophic forgetting 的風險。

### Q4｜怎麼根據 task complexity 改 sampling strategy？

學生問：easy 題 vs. hard 題應該怎麼調整 sampling？

講者回答：easy 題的解更容易在搜尋空間中，**用少 sample + iterative refinement** 就能拿到；hard 題需要**多 sample + parallel diversity** 來換 coverage。Train 一個 classifier 自動切換是可行方向。

### Q5｜怎麼把 reasoning embed 進 model？

學生問：能不能讓 model 自己內建 reasoning，而不是只在 output token 上做 search？

講者回答：STaR 方法——training set 加 chain-of-thought annotation；讓 model 先寫演算法思路、再寫 code；或者用 hint-conditioned training 讓 model 學會從 hint 推出 reasoning。Part 3 的 process-level supervision 思想可以延伸到這裡。

### Q6｜Model 是否知道自己答案的 confidence？

學生問：把 model output 的 log-probability 當 confidence，跟答案正確性有相關嗎？

講者回答：Model 普遍 overconfident——50% 正確的題 confidence 仍可能 80%。但**有相關性**：對的答案 confidence 高、錯的答案 confidence 也高（雙向 overconfidence）。Calibration 是 active research area，RLHF on confidence、second-pass estimation、"I don't know" training 都是方向。

---

## 研究方向與延伸思考

### 1. Search-R1 vs. Search-o1 的 head-to-head 比較

本課只提了 Search-R1 的存在但沒展開。延伸方向：同一個 backbone（如 Qwen、Llama），用 Search-R1（RL）和 Search-o1（prompting）對比 GPQA、HotpotQA 上的 cost / accuracy trade-off，找出哪種 setting 適合 production。

### 2. Clustering 的 learned 版本

AlphaCode 2 用 learned scoring model 取代 clustering heuristic，但 clustering 本身（決定「哪些解是同一演算法的不同寫法」）仍然是 heuristic。延伸方向：train 一個 model 直接判斷「兩段 code 是否 semantic equivalent」，把 clustering 也從 heuristic 升級成 learned。

### 3. Reason-in-Documents 的 chunk size 自適應

Search-o1 用 fixed chunk size 切 documents，但不同 query 需要的 granularity 不同。延伸方向：根據 query 動態決定 chunk size——broad question 用 large chunk、specific question 用 small chunk。

### 4. Confidence-calibrated Uncertainty Detection

Search-o1 用 "perhaps"、"wait" 等 surface token 當 uncertainty signal，這是 weak proxy。延伸方向：train 一個 explicit uncertainty classifier（output token + log-prob + attention pattern），或用 RL train model 「正確表達 uncertainty」。

### 5. Multi-turn Search 的 Termination Criterion

Search-o1 的 iterative refinement 何時停止？目前靠 model 自己的 confidence——但 model 是 overconfident 的。延伸方向：設計 explicit termination signal（information gain threshold、budget cap、query repetition detection）。

### 6. Selection Bottleneck 與 Model Capacity 的交互

AlphaCode 2 用 Gemini Pro 大幅降低 selection bottleneck——是因為大 model 的 search space 本來就更集中、還是 learned scoring model 更強？延伸方向：把 model size、search budget、scoring model capacity 三者 sweep，看 selection bottleneck 在哪個 scale 開始 dominate。
