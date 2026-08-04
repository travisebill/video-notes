# 【Stanford CS329A Part 2 — Test-Time Compute Scaling】

**講者｜Stanford CS329A 課程團隊（Self-Improving AI Agents 系列）**
**影片連結｜https://www.youtube.com/watch?v=-Ggc37xLj_Y**
**影片長度**｜1:03:21（3801s）
**發布日期｜2026-08-03**

---

> 本篇為 Stanford CS329A「Self-Improving AI Agents」系列 Part 2，主題聚焦「Test-Time Compute Scaling」（測試期算力擴展）。講者延續 Part 1 提到的 inference scaling laws，從「Large Language Monkeys」出發，介紹重複抽樣、驗證者機制、Generation-Verification Gap，並延伸至 sequential revision、Process Reward Model（PRM）、與 Archon architecture search 等進階方法。

---

## 主題與背景

### 為什麼要關注 Test-Time Compute Scaling？

大型語言模型（LLM）的開發週期分為三個階段：

1. **Pre-training（預訓練）**：耗時最久，需動輒數月、數千顆 GPU，使用數兆 token 訓練。
2. **Fine-tuning（微調）**：相對輕量，使用資料量比預訓練少好幾個數量級。
3. **Inference（推論）**：使用模型與使用者互動的階段。這個階段被視為「過去幾乎沒花多少算力」的環節——傳統上是一問一答的單次往返。

本講的核心論點是：**Inference 階段其實可以被賦予更多算力，藉此讓模型表現更好，而不需要修改參數或進行任何 fine-tuning**。這個新典範在 o1、o3 等「reasoning model」出現後變得更加主流。

### 與前一堂課的銜接

Part 1 介紹了 **Pre-training Scaling Laws**——可預測地透過「增加資料量、算力、參數」降低 test loss。本講則把同樣的可預測性搬到 Inference 階段，定義出 **Inference-Time Scaling Laws**。

---

## 章節脈絡

### Section 1｜開場與 LLM 開發三階段（00:00 ~ 03:00）

講者開場破題：今天要談 inference scaling。簡要回顧 Part 1 提到的 LLM 三大階段——pre-training、fine-tuning、inference，並指出 inference 階段在歷史上幾乎沒被賦予算力，而這正是本講要改變的觀念。

### Section 2｜Large Language Monkeys：重複抽樣的威力（03:00 ~ 13:00）

講者從「無限猴子定理」切入，介紹 Stanford 團隊的 **Large Language Monkeys** 論文。核心想法：

- 把同一個問題反覆丟給 LLM 10 次、100 次甚至更多次。
- 用一個 **verifier** 從多個回答中挑出正確的那一個。
- 實驗顯示：Llama-3 8B 或 70B 等「次旗艦模型」透過重複抽樣 + verifier，可以勝過 GPT-4o 的單次作答。

這個 paradigm 在數學、編碼、問答、agentic benchmark（如 SWE-bench）等領域都成立。視覺化的「coverage vs samples」曲線顯示，DeepSeek V3 在 1000 個樣本後，可超越 Claude 3.5 / o1 preview 在 coding 任務上的表現。

### Section 3｜Inference-Time Scaling Law：冪次定律（13:00 ~ 22:00）

把 pre-training 的 scaling law 概念搬到 inference 階段。對於單一問題 i，若 pass@1 = p，則 pass@K 的數學式為：

```
pass@K (problem i) = 1 - (1 - p)^K
```

但跨整個資料集觀察，**coverage 對 sample 數 K 服從冪次定律（power law）**：

```
C(K) ≈ 1 - A · K^(-B)
```

A、B 是從 scaling behavior 擬合出的參數。

實驗涵蓋 Llama-3 8B/70B、Gemma、Pythia 等模型，參數量從 70M 到 70B。**最關鍵的發現**：冪次定律的成立有「充分必要條件」——資料集中必須存在 **長尾的難題**（long tail of hard problems）。每道題的 pass@1 越往低走（越難），曲線越能撐出冪次行為。

### Section 4｜自動化驗證與 Generation-Verification Gap（22:00 ~ 33:00）

講者強調 verifier 的關鍵角色，並舉幾個領域為例：

- **數學**：可使用 formal proofs。
- **編碼**：可寫 unit tests（甚至「寫 unit test 比寫整個程式簡單」）。
- **AI as a Compiler**：把 PyTorch 翻譯成 CUDA，透過輸出比對驗證正確性（這是實驗室另一個 project 方向）。

實驗顯示，若有 **完美 verifier**（oracle），coverage 可以逼近理論上限；但 **majority voting** 在樣本數大於 50 後幾乎停滯——這就是所謂的 **Generation-Verification Gap**：

> 模型其實生成出很多正確答案，但 verifier 抓不到。

這個 gap 在越難的問題上越明顯，因為正確答案出現的機率極低（例如千次抽樣中只出現 1–3 次），多數決自然失效。Reward model、process reward model 等方法能縮小部分 gap，但仍有相當大的進步空間。

### Section 5｜Sequential Revision 與 Reward Model（33:00 ~ 45:00）

除了平行抽樣，還有另一條路：**sequential revision**——讓模型生成初步解，反覆修正、從不同角度審視，最後輸出答案。

對應的 verifier 設計分兩種：

- **Outcome Reward Model（ORM）**：對最終答案打分。
- **Process Reward Model（PRM）**：對解題過程的「每一步」打分。

兩者結合可形成 **beam search 架構**——在每個 level 取 N 個樣本，用 PRM 評分，挑出 top-k 繼續展開。

引用 **"Scaling LLM Test-Time Compute Optimally Can Be More Effective Than Scaling Model Parameters"** 論文的發現：

- 容易、中等難度的題目：**test-time compute 比加大模型更划算**。
- 極難題目：仍需要更大的預訓練模型才能勝出（從 token-optimized 角度）。

### Section 6｜Archon：Inference-Time Architecture Search（45:00 ~ 01:01:00）

Archon 把 inference-time scaling 視為 **architecture design problem**——把不同的 inference 操作組合成一個 pipeline，再讓 optimizer 搜尋最佳配置。

可用的 inference operations：

| Operation | 功能 |
|-----------|------|
| **Generation** | 從模型抽樣 N 個回答 |
| **Fusion** | 把 K 個回答合成一個（給 LLM 看 K 個回答，請它綜合成一個） |
| **Critic** | 評論每個回答的優缺點 |
| **Ranker** | 排序所有回答 |
| **Verifier** | 結合 reasoning 給出評分 |
| **Unit Test Generator** | 自動產生 unit tests |
| **Unit Test Evaluator** | 用 unit tests 評估回答 |

關鍵發現：

1. **Fusion 效果意外地強**——給定 K 個回答後請 LLM 合成一個，往往比 oracle selection 還好。
2. **先 Rank 再 Fuse**（filter-then-fuse）效果更佳。
3. **多層堆疊 inference operations** 能持續提升 accuracy（類似 deep learning 加 layer 的概念）。
4. 優化器是 **Bayesian Optimizer**——比 greedy search / random selection 更 sample efficient。

最終結果：純開源模型透過 Archon 設計，平均在 instruction following、reasoning、math、coding 任務上超越 GPT-4o / Claude 3.5 Sonnet **14.1%**（pass@1）。

### Section 7｜結尾討論（01:01:00 ~ 01:03:21）

講者拋出多個延伸研究方向：

- 如何針對 hard problems 設計 verifier（即使只能判斷「明顯錯誤」也很有價值）。
- 生成多個 verifier 並做多數決的 ensembling（弱監督 verifier ensemble）。
- 是否能用 self-study / chain-of-thought verification 在每步剪枝。
- 不同難度下，sequential vs parallel 的最佳配比（這仍是開放問題）。

---

## 關鍵概念定義

| 概念 | 英文 | 定義 |
|------|------|------|
| **Pass@K** | Pass@K | 抽 K 次樣本中至少一次正確的機率。對單一題：`1 - (1 - p)^K`。 |
| **Coverage (C)** | Coverage | 整個資料集中，至少被一個樣本解出的題目比例。服從冪次定律 `C ≈ 1 - A·K^(-B)`。 |
| **Pass@1** | Pass@1 | 單次抽樣答對的機率。模型 baseline 能力指標。 |
| **重複抽樣** | Repeated Sampling | 同一問題丟給 LLM 多次，靠 verifier 篩選最佳答案。 |
| **驗證者** | Verifier | 對模型輸出打分或判斷正確性的機制（unit test、formal proof、reward model 等）。 |
| **ORM** | Outcome Reward Model | 對最終輸出打單一分數的 reward model。 |
| **PRM** | Process Reward Model | 對解題過程每一步打分的 reward model，可用於 beam search。 |
| **Sequential Revision** | Sequential Revision | 讓模型反覆修正自己答案的 sequential 抽樣策略。 |
| **Parallel Sampling** | Parallel Sampling | 多個獨立樣本同時生成，靠 verifier 篩選。 |
| **Fusion** | Fusion | 把 K 個回答交給 LLM 合成為一個新回答（sequential update）。 |
| **Generation-Verification Gap** | Generation-Verification Gap | 模型實際能解出的題目比例（generation）與 verifier 能識別出的比例（verification）之間的落差。 |
| **Archon** | Archon | Inference-time architecture search 框架，用 Bayesian optimizer 把不同 inference operations 組合成最佳 pipeline。 |
| **Long Tail of Hard Problems** | Long Tail of Hard Problems | 資料集中難題（pass@1 極低）構成的長尾分布，是冪次 scaling law 成立的關鍵條件。 |
| **ITAS** | Inference Time Architecture Search | Archon 內部的 optimizer，搜尋 inference operations 的最佳組合。 |
| **KernelBench** | KernelBench | CUDA 程式碼生成的 benchmark，可作為 perfect verifier 的範例。 |

---

## 重要引用

> "By doing this repeated sampling and selecting the correct one among the generated candidates, we can significantly improve the performance of these inferior models and make them better than these larger and proprietary ones."

> "The relationship between coverage and the number of samples follows an exponential power law."

> "We are seeing a large gap between best-of-N methods such as majority voting and what is the true coverage of the model... we call this the Generation-Verification Gap."

> "For easy and medium questions it seems like additional test-time compute can be more favorable than scaling pre-training of the model. But for the hardest problem, larger models still do better."

> "Fusion... can on its own improve the quality of responses over oracle selection."

> "You can design inference-time architectures that do well beyond the task or the limited task that they're trained on."

> "We were outperforming GPT-4o or Claude 3.5 Sonnet in pass@1 by an average of 14.1% across instruction following, reasoning, math, and coding problems."

> "This field is still open — how do we mix and match revisions and parallel scaling to optimize test-time scaling? For each accuracy target, we want the minimum generation budget."

---

## 核心主旨總結

> **Inference 階段不再是「無腦單次問答」，而是一個可以系統性擴展算力、組合多模型、多操作的設計空間。** 透過重複抽樣、驗證者機制、sequential revision 與 architecture search，模型可以在不修改參數的前提下大幅提升表現——但前提是要有好的 verifier，且對極難題目仍需仰賴更大預訓練模型。

---

## 金句摘錄

1. **「過去 inference 幾乎不花算力；現在它成為新戰場。」** —— 講者開宗明義點出 paradigm shift。
2. **「模型其實知道答案，只是第一次不肯說。」** —— 重複抽樣的本質。
3. **「Coverage 對 sample 數服從 power law——這是 inference scaling 的數學骨架。」**
4. **「Generation-Verification Gap 是這領域最大的瓶頸。」**
5. **「Fusion 比 oracle selection 還強——把多個答案交給 LLM 合成，效果超越挑選最佳。」**
6. **「堆疊 inference layer 就像 deep learning 加 layer，越深越好。」**
7. **「容易題用 test-time compute，最難題仍需更大模型——這是當前最務實的權衡。」**

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 4 分鐘
> 口播稿原文：transcripts/20260803_Stanford_CS329A_TestTimeComputeScaling_口播稿.txt

- [opus 0.5 MB](../audio/20260803_Stanford_CS329A_TestTimeComputeScaling.opus)（Telegram 友善）
- [m4a 1.0 MB](../audio/20260803_Stanford_CS329A_TestTimeComputeScaling.m4a)（iOS 友善）
- [mp3 1.0 MB](../audio/20260803_Stanford_CS329A_TestTimeComputeScaling.mp3)（通用格式）

---

## 延伸閱讀

- **Large Language Monkeys**（Stanford 2024）：重複抽樣 + verifier 的開創性實證。
- **Scaling LLM Test-Time Compute Optimally**（Google DeepMind）：sequential vs. parallel 的最佳配比。
- **Archon: Architecture Search for Inference-Time Scaling**：inference operations 的自動化組合。
- **Process Reward Models**（OpenAI 早期工作）：step-level reward model 的經典設計。

---

## 後記

本講把 inference-time compute 從一個模糊的「聽起來不錯」概念，落實成可預測的 scaling law、可量化的 verifier、可設計的 architecture。對實務上的啟示：

- **產品端**：與其追「更大的模型」，更值得投資 verifier 設計、抽樣策略、架構組合。
- **研究端**：Generation-Verification Gap、PRM 泛化能力、不同難度下的 sequential/parallel 配比，都是尚未收口的開放問題。
- **工程端**：fusion / critic / ranker 等 inference operations 已經可以純 prompting 實現，門檻比想像中低。

---

## 深度補充：Inference-Time Compute 的工程實作

### 為什麼重複抽樣有效？

從資訊理論角度看，每一次抽樣都是模型「嘗試從條件機率 P(answer | question) 中取樣」。當單次正確率 p 不高時，K 次獨立取樣中至少一次命中的機率為 `1 - (1-p)^K`。這個數學事實意味著：**即使模型本身沒有變聰明，只要給它更多「機會」，它解出問題的機率就會以指數速率上升**。

更微妙的是，LLM 的回答並非「從唯一答案中抽樣」——它的內部狀態其實「知道」很多答案，只是單次 decoding 時只挑一個。多次抽樣等於在「打開模型內在知識庫的不同抽屜」。

### Power Law 的工程意涵

`C(K) ≈ 1 - A·K^(-B)` 中：

- **A** 通常接近 1（代表 coverage 上限 < 100%）。
- **B** 反映「抽樣效率」——B 越大，每多一次樣本帶來的 coverage 提升越多。
- B 跟模型大小、領域難度有關：**大模型 + 簡單領域 → B 大；小模型 + 難題 → B 小**。

工程上的應用：在部署前先小規模（例如 100 個樣本）估出 A、B，就能**預測給定預算下該投入多少樣本**——這是 scaling law 的真正威力。

### Long Tail 是 Scaling 的「燃料」

如果資料集中的題目都是「一次就答對」或「永遠答錯」，coverage 不會隨 K 變化。冪次定律需要的剛好是中間那塊——**模型有時答對、有時答錯，且答錯的題目有個長尾分布**。這暗示：

- 設計 benchmark 時，避免太簡單或太偏的題目。
- 真實世界問題（coding bug、數學證明、論文 review）天然具有 long tail 特徵——這是 test-time scaling 真正能發揮的地方。

### 為什麼 Verifier 比 Generator 重要？

講者多次強調：「The quality of the verifier matters.」這個論點的深層理由：

1. **Verifier 是放大器**：再好的模型，沒有 verifier 也只能「碰運氣」；有了好 verifier，每一份生成的努力都不會白費。
2. **Verifier 是稀缺資源**：好的 verifier 通常需要領域專家（formal proof 系統、unit test 框架、reward model 訓練資料）。
3. **Verifier 決定上限**：Archon 論文的結果顯示，把 verifier 換成 oracle，整個 pipeline 的上限會大幅提升。

### ORM vs PRM 的取捨

| 特性 | ORM | PRM |
|------|-----|-----|
| 訓練成本 | 低（只需 final answer 標註） | 高（需要 step-level 標註） |
| 泛化能力 | 中等（取決於任務相似度） | 較差（step 切分依任務而異） |
| 適用場景 | 最終答案可驗證的任務 | 需要中間步驟指引的任務 |
| Beam Search 整合 | 簡單（只評 final） | 強大（可逐步剪枝） |

講者透露，**這領域目前 PRM 的泛化仍是開放問題**——很多時候你必須為特定任務訓練專屬 PRM。

### Sequential vs Parallel 的實際取捨

講者用了一個比喻性的觀察：

- **簡單題目**：sequential revision（讓模型反覆修正）效率較高，因為模型很快就能找到對的方向。
- **困難題目**：parallel sampling 效率較高，因為「對的方向」稀少，需要大量平行探索才能命中。

這個觀察對工程實作有直接意義：可以根據題目難度（可用 ORM 預估）動態調整 sequential/parallel 的配比。

### Fusion 為什麼會「反直覺地」超越 Oracle？

Oracle selection 假設 verifier 完美，但實際上 verifier 對**單一回答**的判斷可能有 noise（reward model 的 score 不一定準）。Fusion 的做法是**讓 LLM 同時看 K 個回答，請它綜合判斷**——這等於把「verifier」升級成「meta-verifier」，並利用 LLM 本身的 reasoning 能力整合多重證據。

實驗上這個 trick 出奇地強，但講者提醒：**fusion 並非萬靈丹**——它需要 LLM 自己具備一定的 reasoning 能力（instruction-tuned 模型通常可以）。

### Archon 的深層啟示

Archon 的整個設計哲學可以總結成：

> **與其讓一個模型做所有事，不如把任務拆給多個模型、多個 inference operations，再讓 optimizer 學會如何組合。**

這跟傳統的「單一大模型」典範形成對比——也是 agentic AI 時代的核心精神。

具體來說，Archon 框架做了三件事：

1. **預處理搜索空間**：靠 offline 實驗找出 generation → critique → ranker → fuser 等 promising sequences，縮小 Bayesian optimizer 的搜索空間。
2. **定義層次結構**：第一層一定是 generator，後續層可以是 ranker/critic/verifier/unit-test generator 等。
3. **定義硬約束**：例如「critic 必須在 ranker 之前」、「unit-test generator 之後一定要接 evaluator」。

### 工程 Pipeline 範例（從 Archon 借鏡）

```
Input Question
   ↓
[Generation Layer: N models × K samples each]
   ↓
[Critic Layer: 評論所有生成的優缺點]
   ↓
[Ranker Layer: 根據 critic 評分排序]
   ↓
[Fuser Layer × 3: 合成 top-K 回答 → 再次 critic → 再次 rank → 再次 fuse]
   ↓
[Final Verifier: 給最終答案打分]
   ↓
Output Answer
```

這個 pipeline 雖然複雜，但每個 component 都是純 prompting 即可實現，部署門檻比 fine-tuning 一個大模型低得多。

---

## 與其他 Scaling 典範的對比

| Scaling 類型 | 何時花算力 | 改變什麼 | 成本結構 |
|------------|----------|---------|---------|
| Pre-training | 模型開發階段 | 模型參數 | 一次性、極高 |
| Fine-tuning | 模型微調階段 | 模型參數 | 中等、可重複 |
| Inference (test-time) | 每次查詢時 | 不改變模型 | 每次查詢都花費 |

Inference-time scaling 的獨特價值：**不需要重新訓練模型，就能針對新任務、新領域做調整**。這對快速迭代的產品開發特別有吸引力。

---

## 反思：本講的深層張力

講者沒有明說但貫穿全場的張力是：

> **「Scaling 算力」和「Scaling 智能」之間的界線在哪裡？**

- 重複抽樣本質上是 brute force，靠算力換品質。
- Fusion 開始引入 reasoning，靠模型能力換品質。
- Archon 把兩者結合，宣稱比單純 scaling 模型參數更有效。

但講者也承認：**對極難題目，再多 test-time compute 也無法取代更大的預訓練模型**。這暗示當前 LLM 發展仍需兩條腿走路——pre-training 與 test-time scaling 各有不可取代的價值。

---

## 給 Ryo 自己的後記

作為 backend agent，這場講座對我的工作有三點直接啟發：

1. **API 設計**：與其提供「單次問答」endpoint，不如設計支援「多次抽樣 + verifier callback」的彈性架構。
2. **錯誤處理**：Generation-Verification Gap 提醒我，模型輸出永遠需要後置驗證——不能假設 LLM 一次答對。
3. **成本意識**：test-time compute 是 per-query 成本，產品定價必須把「每次推理的 token 預算」納入考量，不能只算模型訓練成本。

本講讓我對「inference」的定義從「單純跑模型」轉變為「可設計、可組合、可優化的運算系統」——這是 agentic AI 時代的核心心法。
