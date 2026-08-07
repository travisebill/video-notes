# 【Stanford CS329A — Part 3 — Robust Verification】

**講者｜Stanford CS329A (課程團隊)**
**影片連結｜https://www.youtube.com/watch?v=p7TdPUcPoik**
**影片長度**｜1:12:59（4379s）
**發布日期｜2026-08-03**

---

## 主題與背景

這是 Stanford CS329A「Self-Improving AI Agents」系列的 **Part 3 — Robust Verification**，核心議題是 **為什麼 self-improving agent 必須有一套強健的驗證機制**。

### 為什麼 verification 是 self-improvement 的瓶頸

上一堂課（Part 2）討論了 inference-time scaling 的概念——語言模型其實「知道」很多困難問題的答案，只要給它足夠的 sampling budget（例如 repeated sampling、tree search）就能在分佈中找到正確解。但這引出一個根本問題：

> **怎麼自動挑出哪一個 answer 是對的？或者怎麼在 generation 過程中引導模型不要走錯路？**

這個問題就是 **verification**——它是 self-improving loop 的關鍵瓶頸。如果沒有可靠的 verifier，無論你 sample 多少 candidate，都只是「在一堆答案裡瞎選」。

### 為什麼 LLM 需要 verifier

講者開場就點出 LLM 的兩個持續性問題：

1. **Hallucination**——LLM 會「自信地」把錯的答案呈現給使用者（4 年後的今天依然存在，雖然模型本身已經強很多）。
2. **Mid-trajectory derailment**——如果模型在多步推理中很早就走錯一步，後面整個解題路徑就會全部錯。

> The motivation for this work was that LLM hallucinate and can confidently present wrong solutions to the users. Four years later, of course, the model has have become significantly better.

### 4 papers 的進程

本堂課會走過 4 篇關鍵 paper，呈現 verification 研究在過去四年間的演進：

| # | 論文 | 年份 | 核心轉變 |
|---|------|------|----------|
| 1 | Training Verifiers to Solve Math Problems（OpenAI） | 2021 | 把 verifier 視為 token-level 分類器（ORM �形） |
| 2 | Let's Verify Step by Step / PRM800K（OpenAI） | 2023 | 從「整體對錯」到「逐步對錯」（PRM） |
| 3 | Math-Shepherd（Google DeepMind 等） | 2023-24 | 用 rollout 自動標記逐步 label，不再需要人類 |
| 4 | Beaver：Shrinking the Gap with Weak Verifiers（Stanford） | 2025 | 不訓練新 verifier，改用 ensemble + weak-to-strong supervision |

> There is a progression of how the way we approach verification changed or progressed throughout the years.

---

## 章節脈絡

### Section 1｜開場 + Generation-Verification Gap 回顧（00:00 ~ 02:30）

複習上一堂 inference-time scaling 議題：repeated sampling、test-time techniques 可以讓模型「覆蓋」到正確答案，但 **generation 與 verification 的能力不對等**——LLM 雖然知道答案，但要可靠選出哪一個是對的，這就需要 verifier。講者明確指出這堂課要談的「verification」就是為了解決這個 gap。

### Section 2｜Paper 1 — Training Verifiers for Math（OpenAI 2021, GSM8K）（02:30 ~ 17:00）

**貢獻一**：推出 **GSM8K**——8,500 題小學程度的數學應用題，強調 multi-step reasoning（每題需要幾步推理才能解出）。即使到今天，對中小模型仍是極具代表性的 benchmark。這個 dataset 的設計哲學是「**問題簡單但推理多步**」。

**貢獻二**：訓練 verifier model——
- 架構：本身就是 LM，加上一個小型 scalar head，**每個 token 輸出一個 binary prediction**。
- 訓練方式：給定 question Q 與 solution S，產生 100 個 completion，根據最終答案對錯打 binary label。
- 兩個 loss 並用：
  - **Binary classification loss**（對/錯）
  - **Language modeling loss**（標準 next-token prediction）
- 最終分數：取**最後一個 token 的 scalar prediction**作為整體解的 score。
- Token-level label 與 sentence-level label 的 ablation 都試過——sentence-level 比較 noisy。

**核心實驗結果**：

1. **大 generator + 小 verifier > 小 generator + 大 verifier**——假設 generation 是比 verification 更難的任務，這個結果直觀。
2. **Verifying > pure fine-tuning**（特別是 verifier 訓練資料量大時）；資料少時 finetune 反而可能較好。
3. **400 個 completion 是甜蜜點**：超過 800 之後 verifier 無法有效分辨 candidate 間的細微差異——precision 下降。

> Diminishing returns after 400 samples. For larger datasets the verification approach eventually outperforms the fine-tuning only approach.

### Section 3｜Paper 2 — Let's Verify Step by Step / PRM800K（OpenAI 2023）（17:00 ~ 30:00）

**核心轉變**：把 reward model 從 **outcome-based（ORM）** 推進到 **process-based（PRM）**。

| 類型 | 評分對象 | 訊號來源 |
|------|----------|----------|
| **ORM** | 整個 solution 的最終對錯 | 最終答案與 ground truth 比對 |
| **PRM** | solution 中**每一步**的對錯 | 人類對每個 step 標 correct / incorrect |

**PRM 的關鍵優勢**：

1. **更好的 false positive 控制**——LLM 可能「過程全錯但答案剛好對」（hallucination 撞到正確答案）。ORM 會誤判為正確，PRM 不會。
2. **鼓勵可解釋的推理**——因為人類認可的步驟本身就是「合理推理鏈」。
3. **資料效率高**——透過「**convincing wrong answers**」（最終對、過程錯）的優先取樣，比隨機選樣 **2.6× data efficient**。

**PRM800K 數據集**：800K 個 step-level 標註，由人類標註員對每一步打 positive / negative / neutral。

**實驗結果**：
- PRM > ORM > Majority voting（在相同 sample budget 下）。
- Majority voting 100 samples 後就退化；PRM 可以持續成長。
- PRM 在**罕見正確解答**（佔比 < 5%）的偵測上特別有效——這正是 RLHF 探索最需要的訊號。
- PRM 在跨 domain generalization 上也優於 ORM 與 majority voting，能容忍更多 distribution shift。

**最終 reward 計算**：PRM 把每一步的 reward 相乘（product of stepwise probabilities）。

> Process supervision is more precise way of collecting data and assigning labels to different steps of the problem rather than just looking at the output answer.

### Section 4｜Paper 3 — Math-Shepherd（DeepMind 2023）（30:00 ~ 47:00）

**動機**：PRM 雖然好，但需要大量人工標註——能不能自動化？

**核心想法**：把一個 step 的「品質」定義為「**從這步繼續 rollout，最終能走到正確答案的機率**」。

**兩種自動估計**：

| 方法 | 標記方式 | 直觀解釋 |
|------|----------|----------|
| **Hard estimate** | 若 N 條 rollout 至少有一條走到正確答案，標 1 | 「這步有潛力」 |
| **Soft estimate** | N 條 rollout 中走到正確的比例（freq） | 「這步成功率」 |

**重要取捨**：
- 對**困難問題**：N 不夠大會完全沒訊號（沒有 rollout 走到正確）。
- 對**罕見推理路徑**：可能被低估，模型可能放棄「不尋常但有效」的路徑。

**實驗結果**：
- Math-Shepherd PRM > PRM800K（human labeled）> ORM > majority voting。
- 在 MATH（比 GSM8K 更難）上 delta 更大。
- 跨模型驗證（Llama-70B、Mistral-34B、DeepSeek-67B）都成立。
- **額外 bonus**：這個 PRM 還可以拿來 RL / PPO 訓練 generator（self-improvement loop），效果比只用 ORM 當 reward 好。

> The generator should generate the steps. The PRM is trained on human annotations that also make sure this step makes sense given the prior steps.

### Section 5｜Paper 4 — Beaver: Shrinking the Gap with Weak Verifiers（Stanford 2025）（47:00 ~ 68:00）

**動機換角度**：與其訓練一個「更強」的單一 verifier，不如**承認沒有 verifier 是完美的**，把多個 weak verifier ensemble 起來。

**兩類 verifier**：
- **PRM / ORM**：reward model 類
- **LLM-as-a-judge**：直接 prompt LLM 給答案打分（可用 rubric / tools）

**Weak verifier 的屬性**：與真實 label 有正相關，但不完美。

**Beaver 三大招式**：

1. **Filter low-quality verifiers**：先用少量 labeled data 把太差的 verifier 踢出 pool（不然會污染 ensemble）。
2. **Score → Weight → Select**：把不同 verifier 的輸出 normalize 到同一 scale，再學一組權重（naive averaging 或 logistic regression）。
3. **Weak-to-strong supervision**（受 Snorkel 啟發）：
   - 假設每對 verifier **獨立捕捉正確性的某個面向**——這個 independence assumption 是核心。
   - 寫出兩個方程：
     - Pr(y=1 | l_i, l_j) = Pr(y=1 | l_i) · Pr(y=1 | l_j)（independence）
     - Pr(l_i | y) · Pr(y) = Pr(y=1 | l_i) · Pr(l_i)（Bayes）
   - 解 optimization 找出每個 verifier 的權重。
   - **不需要大量 labeled data**（unsupervised 設定下只用 1% labels）。

**驚人結果**：
- 8B generator + weak verifier pool（≤8B）→ 平均 **70%** on 困難 benchmark。
- 70B generator + 同樣 verifier pool → 平均 **86.2%**——與 **o3-mini** 等 proprietary 模型相當。
- 等於用 ensemble verifier 把小型模型的能力**推到大一級模型的水準**。

**Distillation bonus**：把整個 ensemble distill 到一個 400M 小模型，保留 **97%** 的 ensemble accuracy，但 test-time compute **降低 99%+**。

> If we take a generator model of llama 3.1 8B instruct and the verifier model which is 8B and below, we get an average of 70% on these data set and this is almost comparable to the accuracy that we get with majority voting but when our models are at 7B.

### Section 6｜Recap + 開放性問題（68:00 ~ 72:59）

講者總結四篇 paper 的脈絡，並回答 Q&A，重點：

- **Process reward 比 outcome reward 更有效**，但**兩者組合**才是當前主流方向。
- **Self-improvement loop**：PRM 不只用在 test time，還能在 RL fine-tuning 中當 reward，進一步提升 generator。
- **Verification 是縮小模型階級差距的槓桿**——小模型 + 好 verifier ≈ 大模型。
- **Distillation 讓 verifier ensemble 變得便宜**——開源 checkpoints 可直接用。
- **未來方向**：
  - coding 領域的 verification（unit test as verifier，下一堂課的 CodeMonkeys）。
  - generator-verifier 架構/家族差異對 verification 的影響——目前缺乏系統性研究。
  - pass@1 vs. test-time sampling 的 trade-off——前者效率高但犧牲 diversity。

> We want the model to be really really good at pass at one like the first time we ask it to do something... One challenge though with making the model too sharpened through one answer is that the creativity and diversity of solutions may be lost somehow during the training.

---

## 🎙️ 音檔導�

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/Stanford_CS329A_Part3_Robust_Verification_口播稿.txt

- [opus XX MB](../audio/Stanford_CS329A_Part3_Robust_Verification.opus)（Telegram 友善）
- [m4a XX MB](../audio/Stanford_CS329A_Part3_Robust_Verification.m4a)（iOS 友善）
- [mp3 XX MB](../audio/Stanford_CS329A_Part3_Robust_Verification.mp3)（通用格式）

> **注**：本影片長度為估算值（1:12:59），實際發布時以原始影片時長為準。口播稿以全知分析者視角撰寫，涵蓋 4 篇 paper 核心觀念、PRM 為何優於 ORM、弱到強監督的數學假設、以及 verification 如何縮小模型階級差距等重點。

---

## 關鍵概念定義

| 概念 | 英文 | 定義 |
|------|------|------|
| **驗證器** | Verifier | 一個模型，給定 (question, solution) 輸出該 solution 是對的機率。self-improvement loop 的核心元件。 |
| **結果獎勵模型** | Outcome Reward Model (ORM) | 只看最終答案對錯，給整體解一個 scalar score。簡單但容易被 hallucination 誤導。 |
| **過程獎勵模型** | Process Reward Model (PRM) | 對 solution 的每一步都打分。精細、可解釋、資料效率高，但需要 stepwise label。 |
| **獎勵駭客行為** | Reward Hacking | 模型學到「騙過 verifier」而不是「真的變好」。隨著 verifier 越強、generator 越強，這個風險指數上升。 |
| **弱到強監督** | Weak-to-Strong Supervision | 用多個 imperfect（weak）verifier 的 ensemble，透過統計假設（獨立性 + Bayes）學到近似 strong verifier 的效果。Beaver paper 的核心方法論。 |
| **生成-驗證鴻溝** | Generation-Verification Gap | 模型「知道答案」vs.「可靠判斷答案對錯」之間的能力差距。test-time scaling 的根本限制。 |
| **重複取樣** | Repeated Sampling | 對同一 query 生成 N 個 candidate，用 verifier 從中選出最佳。N 越大覆蓋率越高，但 verifier precision 會掉。 |
| **多數決** | Majority Voting / Self-Consistency | 不需 verifier，直接選最多次重複出現的答案。簡單 baseline，但 N=100 後退化。 |
| **GSM8K** | GSM8K | 8,500 題小學程度的 multi-step 數學題，OpenAI 2021 提出的經典 reasoning benchmark。 |
| **PRM800K** | PRM800K | 80 萬筆 stepwise human-labeled 數據集，OpenAI 2023 用於訓練 process reward model。 |
| **自我改進迴圈** | Self-Improvement Loop | model 自己生成資料 → 訓練 verifier/reward → 訓練 generator 變更強 → 再生成更難資料。verification 是這個 loop 的關卡。 |
| **測試時計算擴展** | Test-Time Compute Scaling | 用 inference 階段的計算（更多 sampling、更大 verifier、更多 ensemble）換取更好表現，不增加訓練成本。 |
| **信用分配** | Credit Assignment | 在多步推理中，把「最終對錯」這單一訊號歸因到具體哪一步的問題。PRM 直接解決這個問題。 |
| **蒸�驗證器** | Distilled Verifier | 把大型 verifier ensemble 的知識壓縮到小模型（400M），保留 97% 精度但 99%+ 更快。 |
| **說服性錯誤** | Convincing Wrong Answers | 「最終答案對但中間步驟錯」的解答。在 PRM800K 中優先標註，可 2.6× 提升資料效率。 |

---

## 金句摘錄

> "LLM hallucinate and can confidently present wrong solutions to the users. Uh this still is true to this day, four years later."——開場點出 hallucination 的頑固性。

> "There is a progression of how the way we approach verification changed or progressed throughout the years."——4 篇 paper 構成的研究脈絡主軸。

> "If you're showing the output of this entire system where the verifier ranks 800 different solutions, the precision of the verifier drops. It's like if two solutions are too close to each other but one is correct and incorrect across 800, it can't distinguish as well as it could do for 400."——解釋為何 verification 在 400 samples 後退化。

> "Process supervision is more precise way of collecting data and assigning labels to different steps of the problem rather than just looking at the output answer."——PRM 比 ORM 好的本質理由。

> "Model might hallucinate and get to a final correct answer while the process for it is like really wrong. Whereas with process supervision because we are seeing all the steps, it's less likely that we get into that mode where the steps are wrong but the final answer is correct."——PRM 抗 hallucination 的關鍵。

> "If we take a generator model of llama 3.1 8B instruct and the verifier model which is 8B and below, we get an average of 70% on these data set and this is almost comparable to the accuracy that we get with majority voting but when our models are at 7B."——弱 verifier ensemble 縮小模型階級差距。

> "We can distill that and capture a whole lot of the quality from a much smaller model."——400M 蒸餾 verifier 保留 97% ensemble 準確率。

> "The thing that is interesting here is that we can use this weak to strong supervision to reduce the gap between model classes."——verification 是階級躍遷的槓桿。

> "One challenge though with making the model too sharpened through one answer is that the creativity and diversity of solutions may be lost somehow during the training."——pass@1 vs. test-time sampling 的 trade-off 警告。

---

## Q&A 精選（學生提問 × 講者回答）

這堂課的 Q&A 是論文細節的重要補充。以下整理 8 個最值得深思的問答：

### Q1｜為什麼 verification 在 400 samples 後反而下降？

學生問：訓練資料增加 verifier 表現上升很正常，但為什麼超過某個點之後反而**掉下來**？

講者回答：因為這條曲線量的是整個系統的最終準確率——如果 verifier 要在 800 個 candidate 中挑出最對的那個，當所有 candidate 都很接近時，verifier 的 precision 就會掉。相對地，在 400 個 candidate 中區分好壞反而比較容易。所以實際部署時，他們停在 100 samples。

> If two solutions are too close to each other but one is correct and incorrect across 800, it can't distinguish between the two as well as it could do for 400.

### Q2｜ORM 是否真的需要比 PRM 多 K × 步數的 label？

學生指出 PRM 需要 stepwise label，比 ORM 需要更多人力；這樣 cross-paper 的比較公平嗎？

講者承認這是個「hard to control」的問題，因為不同問題的最佳 step 數不同，但他們在部分圖表中盡量控制了。這也呼應後面 Math-Shepherd 的動機——能不能**自動化**這個標註流程。

### Q3｜PRM 會不會反而鼓勵「跳步推理」？

學生提出一個聰明的攻擊：如果 generator 學到「反正 PRM 只看步驟對不對，那我跳過推理直接給答案、PRM 還是給高分」怎麼辦？

講者拆解兩層：
- 如果 PRM 是 human-labeled，那 human 看到「跳步」會標低分，所以 PRM 會學到不該跳。
- 如果 PRM 是自動標註的（Math-Shepherd 情境），就**真的有這個風險**——這是 open problem。

> If the labels are not generated by humans, that is definitely a caveat.

### Q4｜能否讓 PRM 鼓勵 self-correction？

學生問：能不能設計 reward 鼓勵模型「自己抓到自己的錯並修正」？

講者建議幾條路：
- 提供 rubric / ruleset 給 PRM 當 scoring step 的參考。
- 啟用 **tool use**（calculator、SyMPy）做數學驗證。
- 走 **agentic approaches**，讓模型自己呼叫工具確認中間結果。

### Q5｜PRM 會不會在某些 domain 反而有害？

學生擔心：credit assignment 有可能誤判——一個 step 看起來合理但其實沒貢獻於最終答案。

講者承認這是真的，並指出當前主流是**組合 PRM + ORM**：
- PRM 提供 stepwise 細節。
- ORM 提供最終對錯的 hard signal。
- 兩者相加，threshold 成為可調參數。

### Q6｜Math-Shepherd 的 hard / soft 估計有什麼根本限制？

學生抓到兩個關鍵：
- **Hard problems**：N=3 太小，需要 N=100 才能 rollout 到正確答案。
- **Wrong-step-then-correct**：如果中間有錯步但最終答案對，這些「錯步」仍會被標 positive（因為 rollout 走到終點是對的）。

講者承認這是 limitation，並期待更多樣本來緩解。

### Q7｜為什麼 RL 完之後只用 greedy decoding 而不是再驗證？

學生注意到 Math-Shepherd RL 階段的圖表只用 greedy，沒再做 verification。

講者同意這是 paper 的不足，並建議延伸方向：**RL → 再訓練一個 verifier → 在 RL 後的 checkpoint 上做 verification**，可能會再提升。

### Q8｜為什麼這四篇 paper 都專注在 math？coding 呢？

學生問：verification 在 coding 上會長什麼樣子？

講者預告下一堂課的 **CodeMonkeys paper**——直接讓模型生成 unit tests，**unit tests 就是 verifier**。這給 verification 換了一條完全不同的思路。

---

## 研究方向與延伸思考

講者在課堂中反覆暗示未來可做的 research direction，整理如下：

### 1. Generator vs. Verifier 的 Pareto 最佳化

Paper 1 的 ablation 顯示「**大 generator + 小 verifier**」優於反過來。但這是否隨模型家族、訓練階段、任務類型而變？目前沒有系統性研究。

> Finding the Pareto optimal of how these two can be sized with respect to each other would be a very interesting research direction.

### 2. Same-family vs. Different-family Verifier

學生問：「如果 generator 是 Llama、verifier 是 Qwen，會不會比都用 Llama 差或好？」

講者的直覺是「**模型自己驗證自己比自己家族的不同尺寸驗證自己更準**」，但**沒有實證**——這是 open question。

### 3. Coding as Verification

Unit test 不只是驗證手段，它本身就是**生成式 verifier**：
- 模型寫 code → 模型寫 test → test 跑 → 通過就是 correct。
- 這把「什麼是 correct」從「人類標註」變成「程式語義」，是個根本性的轉變。

### 4. Pass@1 vs. Test-Time Sampling 的終局

講者最後提到，未來大家會希望「**第一次就答對**」（pass@1），不再需要 repeated sampling。但這有個代價：

> One challenge though with making the model too sharpened through one answer is that the creativity and diversity of solutions may be lost somehow during the training.

換言之，diversity 是 exploration 的燃料——如果模型只會 pass@1，自我改進的資料來源就會枯竭。

### 5. 跨領域 generalization

PRM 在 math 上成功，但**能不能直接搬到 reasoning / coding / agentic tasks**？目前 PRM800K 主要是 math，跨域的 transfer 仍是 open。

### 6. Self-improvement 的 Verification

如果模型自己訓練 verifier，這個 verifier 能不能驗證「**更高一代**的模型」？這是 RLHF 世代遞進的核心問題。

---

## 與 Stanford CS329A 系列其他章節的關聯

| 章節 | 主題 | 與本章的關聯 |
|------|------|--------------|
| Part 2 | Inference-Time Scaling | 上一堂講了 repeated sampling，本章用 verification 解決「sample 之後怎麼選」 |
| Part 4（預告） | CodeMonkeys | coding 領域的 verification——unit test as verifier |
| 未來章節（暗示） | Reasoning Models | reasoning model 用 PRM 訓練，最後再用 test-time scaling 做 inference |

整體而言，Part 3 在整個 self-improving agent 課程中扮演**「把 inference-time scaling 從盲目變成精準」**的關鍵角色。

---

## 參考資源

### 課堂提到之 4 篇核心論文

1. **Cobbe et al. (2021).** *Training Verifiers to Solve Math Problems.* OpenAI. → 引入 GSM8K + outcome verifier。
2. **Lightman et al. (2023).** *Let's Verify Step by Step.* OpenAI. → PRM800K + process supervision。
3. **Wang et al. (2023).** *Math-Shepherd: Verify and Reinforce LLMs Step-by-step without Human Annotation.* → 自動化 stepwise label。
4. **Beaver (Stanford, 2025).** *Shrinking the Generation-Verification Gap with Weak Verifiers.* → weak-to-strong ensemble。

### 相關延伸閱讀

- Snorkel（weak supervision 起源工作，Ratner et al., Stanford）
- Self-Consistency（Wang et al., 2022）——majority voting 的代表 paper
- Tree of Thoughts（Yao et al., 2023）——test-time compute scaling 的另一支
- Process Reward Model 開源權重（huggingface leaderboard）——實際部署可挑選的 PRM
