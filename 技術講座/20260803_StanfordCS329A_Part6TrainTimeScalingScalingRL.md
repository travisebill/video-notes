---
講者: Stanford CS329A 課程團隊（Self-Improving AI Agents 系列）
影片連結: https://www.youtube.com/watch?v=yVnmHSAy3ck
影片長度: 1:12:39（4359s）
發布日期: 2026-08-03
---

# 【Stanford CS329A — Part 6 — Train Time Scaling / Scaling RL】

> ⚠️ **本片為 Stanford CS329A「Self-Improving AI Agents」系列 Part 6**，承接 Part 2（Test-Time Scaling）、Part 3（Verification）、Part 4（Learning from Feedback with Tools & Code）、Part 5（Planning & Multi-Step Reasoning），把焦點從「**Inference 時怎麼花算力**」轉向「**Training 時怎麼花算力**」——也就是所謂 **Train-Time Scaling / Scaling RL**。

---

## 主題與背景

### 為什麼需要 Train-Time Scaling？

整個系列的問題意識一致：**模型自己能不能變得更好？** Part 2 給了 inference 一條路徑——重複取樣 + verifier，可以把 pass@K 拉到 log-linear 的改善；Part 3 又示範 verifier 可以從人工標註走向自動 rollout 與 weak-to-strong ensemble。**但這些技術都停留在 inference 階段，不更新模型參數。** 本課把焦點翻過來：**讓模型從「自己生成的輸出」中學**，研究這個 RL 閉環如何才能穩定運作。

講者開場用一個震撼數字對照：AIME 2024/2025 benchmark 上，GPT-3.5（175B）只有 **5% 準確率**，但 DeepSeekMath 7B 透過 train-time scaling 達到 **51.7%**，加上技巧可拉到 60%；DAPO 在 Qwen 32B 上還能拉到 **50%**。**模型大小不是推理能力的唯一瓶頸**——train-time scaling 可以讓小模型在推理 benchmark 上接近甚至超越大模型。

### Train-Time Scaling 在 self-improving loop 的位置

講者把 LLM 開發週期分成三個 paradigm：

1. **Pre-training**——在 internet data 上訓練（Part 1）。
2. **Fine-tuning / RLHF**——把模型對齊到人類偏好（chatbot 訓練）。
3. **Test-time scaling**——inference 時的技巧（Part 2：majority voting、inference-time sampling）。

本課的 **Train-Time Scaling** 把 test-time scaling 的「**filter**」邏輯搬回 training loop：先用 test-time scaling 產生大量 model output，**只保留通過 verifier 的 correct 樣本**，再拿這些「filtered outputs」去 fine-tune 模型。講者一句話總結整堂課的核心循環：**「If you take the model output filter after applying this test time scaling and then use that to fine-tune further — that's roughly what train time scaling is.」**

### 為什麼這堂課很難？

講者直言：「**Typically if you try to do reinforcement learning on reasoning, it will not work well — the reason it doesn't work well is because the implementation details are hard to get right.**」本課要花三篇 paper 的篇幅，一層層揭開 RL 在 reasoning 上會壞掉的地方——entropy collapse、reward hacking、response length 爆炸、effective batch size 為零。**這堂課的價值在於把這些「**RL 訓練失敗的常見模式**」拆給你看，並教每一種失敗對應什麼修法**。

---

## Section 1｜開場：Train-Time Scaling 的定義與三個 insight（00:00 ~ 15:00）

講者開場定義三個關鍵 insight：(1) **從 internet training 走向 self-output training**——讓模型從自己生成的輸出中學習（用 verifier 過濾錯的、留下對的）；(2) **Train-time compute 可 substitute model parameters**——在 training 投入更多 compute 可達到跟加大模型類似的效果；(3) **RL 比 SL 對 implementation details 更敏感**——當 scaling up RL 算法時，「**小修正**」會產生巨大差異。

### AIME Benchmark 的震撼對照

講者用 AIME（American Invitational Mathematics Examination）當開場——高中邀請賽數學題，比 GSM8K 更難、更需要多步推理。之前用 MATH benchmark，但「**MATH benchmark 已經 saturated 並被 contamination**」（大多數模型已訓練見過），所以改用 AIME 2024/2025。

| 模型 | 規模 | 訓練方式 | AIME 準確率 |
|------|------|---------|------------|
| GPT-3.5 | ~175B | 標準 pre-training + RLHF | ~5% |
| DeepSeekMath | 7B | Train-time scaling + RL | 51.7%（→ 60%） |
| Qwen 32B + DAPO | 32B | DAPO 改進的 RL | 50% |

> **關鍵 takeaway**：**推理能力不純粹是 model size 的函數**——小模型透過 train-time scaling 可在推理 benchmark 上接近大模型。

### Reasoning Model 的思考模式 + Verifiability 前提

講者展示 reasoning model（o1、o3、Gemini Flash Thinking）內部的 thinking token 模式：**problem analysis** → **task decomposition** → **self-evaluation** → **self-correction / backtracking** → **parallel search**。講者引用 o1 在 bash transpose matrix 與化學 pH 計算兩個例子的自我修正行為。**Verifiability 是 train-time scaling 的前提**——講者引用 o1 win rate：可驗證領域（程式、數據分析、數學）win rate > 50%；不可驗證領域（personal writing）改善有限。

> 講者金句：**「Test-time compute works well in benchmarks where the verifiability is robust. Otherwise you do need to get the model to start to reason better — and you need some verification loops.」**

---

## Section 2｜Paper 1 — STaR：Bootstrap 推理能力（15:00 ~ 40:00）

**STaR（Self-Taught Reasoner）** 是 Stanford 2022 的 paper，提出簡單卻強大的 bootstrapping 演算法：**讓模型自己產生 reasoning chains，再用 verifier 過濾，最後 fine-tune 回模型本身**。

### STaR 的三步 + 第四步 Rationalization

1. **生成**——Few-shot prompt 模型產生 rationales + answers。
2. **過濾**——只保留 answer 正確的 rationale，丟掉錯誤的。
3. **Fine-tune**——用這些「filtered rationales」去 fine-tune 模型，重複整個 loop。

這跟 test-time scaling 很像——**STaR 的關鍵差別是：把 test-time scaling 的「filter 留下 correct」邏輯搬回 training loop**。講者直接說：「**It's almost like off-policy reinforcement learning. It's a very bare-bones way of producing reasoning techniques in a model.**」

如果只做上面三步，模型只會在「**它本來就會的題目**」上學到東西——難題永遠進不到 training data。**STaR 的解法是 rationalization**：給模型「**答案提示**」（hint），讓它**逆向推出 reasoning**。例如答案是 42，就把 42 給模型，要求它「show your work」並產出能推導到 42 的 reasoning chain。**這讓模型可以擴展到原本答錯的題目**——這就是 STaR bootstrap 的關鍵：rationalization 把難題也納入 training set。

### STaR 的假設與限制

三個關鍵假設：(1) **正確 final answer 是 reasoning quality 的 proxy**；(2) **模型在給定 answer hint 後能生成 valid reasoning paths**；(3) **初始模型要 strong enough**——「if the class of problems is way outside the capability of the initial language model, then it will not make much progress」。

主要限制：**沒有真正的 RL signal**（只用 binary filter）、**Plateaus 很快**、**Rationalization 引入 false positives**（答對不代表 reasoning 對）、**Few-shot prompt 的 bias 會灌進 model**。

### STaR 實驗結果

| Dataset | 規模 | 效果 |
|---------|------|------|
| GSM8K | 9K grade school math | **rationalization 沒幫助**（題目太簡單，模型本來就會） |
| CommonsenseQA | 多選常識 | STaR + rationalization 達到 **72.5%** 準確率，使用 86% data |
| Arithmetic | 多位數加法（合成） | 大幅超過 baseline |

關鍵 takeaway：**STaR 的 sample efficiency 比直接 fine-tuning 好很多**——用更少的 training data 達到可比擬的 accuracy。講者點出：**「This was the first sign of life that was shown for reasoning.」**

### Q&A：STaR 的性能瓶頸

講者引導學生思考：

> 「**The model cannot make logical leaps into a new domain. It will not have figured out new things.**」
> 「If the model is really bad at creating new reasoning, then you'll introduce wrong samples into the training.」

總結成對未來 RL paper 的鋪墊：

> 「**A lot of the magic in this particular domain is like what can the base model do — as we're building on top of that.**」

---

## Section 3｜Paper 2 — DeepSeekMath 與 GRPO（40:00 ~ 60:00）

**DeepSeekMath**（2024）是第二篇 paper，講者把它定位為 STaR 的延伸——但這次用 **真正的 RL algorithm**，並把 RL 推到 7B 模型上。

### DeepSeekMath 的兩個關鍵動作

**動作 1：Pre-RL 的 priming**——起點是 **DeepSeek Coder**（已在 code 上 fine-tune 過的模型），不用 archive papers，從 **Common Crawl** 開始 curate math content，用 **OpenWebMath** mining technique 抽出高 math-quality 內容。訓練 token 數大幅增加，且跨 math domains 覆蓋率比 archive papers 好。講者點出：**「This was the first time that was shown — if you start from a coding-based model, you could do better.」** 因為 code 訓練教會「**reasoning + tool use**」，對數學推理很有幫助。

**動作 2：Scale up RL with GRPO**——RL for Human Feedback 傳統用 **PPO**，但 PPO **要 keep 4 份模型**（old policy、new policy、critic、reward model），對 7B 還 OK，scale up 就記憶體爆炸。DeepSeekMath 提出 **GRPO（Group Relative Policy Optimization）**：

> **「Instead of having a critic or a value function estimate, they used some sort of a generalized advantage estimation, and then you only have three copies of the model.」**

GRPO 核心是 **group baseline**：對同一 question sample 很多 answers（K 次）→ 用 reward model 評分 → **Advantage = (reward - mean(rewards)) / std(rewards)**。直覺：

> 「Reward models are going to essentially be trained on comparison anyway. So by providing the group context, you can save memory — and now you can start scaling up RL.」

GRPO 好處：**不需要 critic**，記憶體降一個 model size。DeepSeekMath 7B 用 GRPO 從 46.8% 提升到 **51.7% on MATH benchmark**——**第一個 open-source 7B 模型跨過 50%，沒用 critic**。

### Q&A：Regression 問題

學生問：「**If you update all the weights on difficult problems, won't that regress on simpler problems?**」

講者回答：

> 「**If you're basically trying to close the loop, what you're trying to figure out is how much reward you're giving. So simple problems effectively might equate to you're going to get a reward of one anyways, and you're never getting a reward of zero. And with GRPO you're getting some form of a distribution of rewards.**」

關鍵 insight：**如果 reward distribution 全是 1 或全是 0，normalization 就壞掉**——model 沒有 hill-climbing signal。要避免 regression：

- **保留「簡單題」在 training batch**——model 在簡單題上仍有 reward signal。
- **加 KL divergence term**——不讓模型偏離原來能力太遠。

### GRPO 的限制與後續

講者明示：「**Which we will solve in the next paper — the shortcoming of this particular method we will solve in the next paper.**」下一個 paper DAPO 會解決 GRPO 在 long reasoning chain 上的不穩定。

講者最後點出重要觀察：

> 「**What was improving in this particular paper was that the majority of the solutions become correct. The model actually became more consistent — not fundamentally smarter.**」

GRPO 改善的是 **majority@K**（重複抽樣多數會對），但 **pass@K**（K 次內至少一次會對）沒有顯著提升。**這個「majority@K 提升、pass@K 持平」的模式是 RL training 的典型特徵**——也是後續 open problem 的起點。

---

## Section 4｜Paper 3 — DAPO：把 RL 穩定在 Long Reasoning Chains 上（60:00 ~ 75:00）

**DAPO（Decoupled Clip and Dynamic Sampling Policy Optimization）** 是第三篇 paper，目標是解決 GRPO 在 **long reasoning chain**（AIME 級別題目）上會壞掉的問題。

講者開場直接展示問題：

> 「**If you naively scale up GRPO and want to do this on even a Qwen 32B model, you would get 30% on AIME benchmark. The entropy of the model collapses, the model can become too confident, the training can become unstable, and the response length can become uncontrollable — like it can explode uncontrollably.**」

四個失敗模式：**Entropy collapse**（exploration 變少）、**Overconfidence**（對錯答案太肯定）、**Training instability**（loss 震盪）、**Response length explosion**（回答越 train 越長，最後被 truncate 產生 noise）。

### DAPO 的五個關鍵技術

**技術 1：Clip-Higher（Asymmetric Clipping）**——PPO 傳統 clipping 對「增加機率」和「降低機率」是對稱的，low-prob token 只能 hill-climb 有限。**DAPO 改用 asymmetric clipping，允許更大的「增加」幅度**。結果：entropy 不 collapse、accuracy 上升。

**技術 2：Dynamic Sampling（過濾全對全錯 group）**——GRPO 原本 sample 64 個 answers，DAPO 改成 **oversample + filter**：先 sample **比 64 多**的 answers，**過濾掉「全對」跟「全錯」的 group**（advantage 都是零），**只保留「有些對、有些錯」的 group**。

> 「**You essentially want to keep only those groups that have some signal.**」

**技術 3：Token-Level Loss**——原 loss 是 sample-level，long garbage 跟 short good answer 同樣 weight → noise dominate。**DAPO 改成 token-level loss**——每個 token 都有 loss contribution。

**技術 4：Overlong Reward Shaping**——Long reasoning chain 容易被 context window truncate 產生 noise。DAPO 加 **gradual penalty function**——在接近 truncate 邊界的 token 上施加漸進式懲罰。

**技術 5：Soft Overlong Punishment**——比技術 4 更溫和的版本，soft penalty 讓 model 自己學會不要寫太長。

### DAPO 在 Qwen 32B + AIME 上的累積結果

| 技術 | AIME 準確率（Qwen 32B） |
|------|-------------------------|
| Baseline GRPO | 30% |
| + Overlong Filtering | 36% |
| + Asymmetric Clipping（Clip-Higher） | 38% |
| + Soft Overlong Punishment | 41% |
| + Token-Level Loss | 42% |
| + Dynamic Sampling | **50%** |

> 「**They could actually hill-climb on the Qwen 32B themselves and get to a pretty strong score here.**」

### 三個關鍵監控原則

1. **Loss function 本身不是 reasonable proxy**——還要看 response length、entropy、reward distribution。
2. **Entropy 要 keep 在 sweet spot**——不能太 low（collapse）、不能太 high（unstable）。
3. **Full-accuracy-one 的 sample 比例**告訴你還要不要多 sample——**「the percentage of samples that have a full accuracy of one tells you how much you need to sample」**。

### DAPO 對 SFT vs RL 的回答

講者對前面學生提問的「SFT vs RL」做明確回答：

> 「**RL does provide you, in the domains where you do have a strong reward signal, the ability to hill-climb with fewer number of examples — but it does take a lot of work to get it right. Supervised fine-tuning oftentimes, if you do have access to a lot of high quality data, is a faster way to just improve the model performance in certain cases. But it doesn't bring reasoning trace reasoning capabilities or boost them in certain ways.**」

---

## Section 5｜三種方法的對比與何時用誰（75:00 ~ 85:00）

| 場景 | 推薦方法 | 原因 |
|------|----------|------|
| 只有 ~100 個 reasoning examples，沒有 RL infra | **STaR** | 簡單、可在 small model 上跑，GSM8K 級別有改善 |
| 有 decent base model + 想做 standard math reasoning | **DeepSeekMath + GRPO** | 演算法成熟、不需要 critic、有限 GPU 也能跑 |
| Reasoning chains 很長（>10K tokens），需要 SOTA | **DAPO** | 必須控制所有 RL 變數，competition-level problems（AIME、IMO）必備 |

> 「**If your reasoning chains are going to be much longer — you need state-of-the-art performance — then you do need to control all of these variables in your RL algorithm and infrastructure. But for competition-level problems like AIME and IMO, this is very useful.**」

### 三種方法的共同邊界

講者直言三種方法的共同限制：

> 「**All three techniques will improve, in general, the majority-at-K performance on the y-axis as you put more compute. But none of these will yet improve the fundamental capability or just teach the model to solve no new problems or generalize a lot out of domain.**」

- ✅ 三種方法都會改善 **majority@K**（重複取樣多數對）。
- ❌ 三種方法都還不會顯著改善 **pass@K**（K 次內至少一次對）。

**這個「majority@K 上升、pass@K 持平」是 RL training 的根本限制**——RL 改善的是「**在已知解題空間內的 consistency**」，但「**發明新解法、out-of-domain generalization**」還是要靠 pre-training + scaling。

---

## Section 6｜Open Questions：RL for Reasoning 的未解難題（85:00 ~ 95:00）

講者列出 **5 個 open problems**，這些是後續 train-time scaling 的研究機會。

### 1. 為什麼 majority@K 升但 pass@K 不升？

> 「**To improve pass-at-K, you're basically improving the fundamental capability of the model to solve new problems, right? The fundamental capability step-jumps have typically been seen by either some sort of a breakthrough or by scaling in some dimension.**」

換言之：**majority@K 是 consistency metric、pass@K 是 capability metric**。RL 提升 consistency 但不會憑空創造 capability。

### 2. Reasoning Behaviors 是 emerging 還是 prevalent？

講者展示 o1 的 backtracking、self-evaluation 行為，並問：

> 「**Are these reasoning behaviors real? Are they emerging? Or were they already present and they're basically statistically becoming more prevalent?**」

後者的話 RL 只是在 amplify 既有 pattern，不是 genuinely creating new reasoning。

### 3. 如何從失敗樣本中學習？

> 「**Currently we don't really have very good techniques to learn from failures. There have been a few papers that have tried to learn from failures in useful ways, but currently a lot of the techniques just filter them out.**」

**RL 的核心 signal 是 reward，但 negative reward 怎麼用還沒很好地解決。** STaR 走 rationalization 把 negative 變成 positive；DAPO 直接 filter out negative；後續工作可能在探索「**從 negative 中學**」。

### 4. Reward Hacking 與 Reward Model 飽和

> 「**The reward models, if the model is too capable, then the rewards will get hacked. And if the reward model doesn't have enough signal, then you're basically not able to hill-climb the loop. So it is a harder optimization problem.**」

**RL 的 reward signal 要夠 strong 才能 drive learning，但太 strong 又會被 model hack**——這是 reward design 的兩難。

### 5. RL 與 SFT 的數據佔比

講者回答前面的問題：

> 「**Typically the percentage of RL versus pre-training has been closer to — last year it was closer to 99% to 1%, and then it's grown to perhaps like 5% or something like that. But Grok 4 claimed that it did 50% RL — but it actually did not quite improve 50% — like 50% RL should give a big jump but you're bottlenecked by a lot of the things that I'm showing you here.**」

這個 99% → 5% → 50% 的比例變化反映 RL 在 LLM 訓練中的角色正在快速變大，但 **infrastructure bottleneck 也越來越明顯**。

---

## Section 7｜結語：Train-Time Scaling 的核心循環與課程閉環（95:00 ~ End）

講者最後用一段總結收尾——把整堂課的核心循環畫成閉環：

> 「**The fundamental question we're trying to answer is that in test-time compute, you can basically — if you go back to this plot — test-time compute is very cheap for someone to put, because you've trained a model, and then you can go and do multiple inferences. And if one of the answers is correct, and you have a good verifier, then you can basically scale compute infinitely. But train-time scaling — the challenge will be that you have to scale it correctly, and the second bit is that there's a certain amount of this closed feedback loop has to have enough successes for the train-time scaling to work well.**」

### 與前幾堂課的銜接

| Part | 主題 | 與 Part 6 的關聯 |
|------|------|------------------|
| Part 1 | Pre-training scaling laws | Train-time scaling 是 pre-training scaling 的延伸（用 self-output 而非 internet data） |
| Part 2 | Test-time compute scaling | Train-time scaling 是「filter 邏輯搬回 training」 |
| Part 3 | Robust verification | Train-time scaling 的前提是「有 verifier」 |
| Part 4 | Learning from feedback with tools & code | RLEF（unit test execution feedback）是 verifier 的一種 |
| Part 5 | Planning & multi-step reasoning | Reasoning chains 變長是 DAPO 要解決的核心問題 |
| **Part 6** | **Train-time scaling / Scaling RL** | **Self-improving loop 的閉環：從 inference filter → training update** |

### Verification Signal 的最後反思

講者最後點出幾個 still-open 的 verifier 問題：

> 「**What verification signals are good enough? And then can you use an ensemble of verifiers instead of like one single verifier to make up for the gaps of what a single verifier will provide signal on?**」

這正是 Part 3 講 robust verification 的延伸主題——**verifier quality 是 RL training 的根本限制**，多個 verifier 的 ensemble 是 future direction。

### 課程的最終 takeaway

> 「**If you take the model output filter after applying this test-time scaling, and then use that to fine-tune further — that's roughly what train-time scaling does.**」

而這堂課的價值不只是教三篇 paper，而是教三種失敗模式——**STaR 教你 bootstrap 的天花板（plateau）、DeepSeekMath 教你 GRPO 在 long chain 上會壞、DAPO 教你怎麼一個一個修**。**理解失敗模式比記住 paper 更重要**。

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone xiaotian_clone_v1, speech-2.8-hd），約 2 分 56 秒
> 口播稿原文：[transcripts/口播稿.txt](../transcripts/口播稿.txt)（全知分析者視角）

- [opus 0.7 MB](../audio/口播稿.opus)（Telegram 友善，32k Opus）
- [m4a 2.9 MB](../audio/口播稿.m4a)（iOS 友善，128k AAC）
- [mp3 2.8 MB](../audio/口播稿.mp3)（通用格式，HD 音質）

**🎧 第一段：開場與 Train-Time Scaling 的定義**
本集 Stanford CS329A 進入 Part 6，主題是 Train-Time Scaling 與 Scaling RL。講者用 AIME benchmark 的震撼數字開場——GPT-3.5 175B 只有 5%，但 DeepSeekMath 7B 透過 train-time scaling 達到 51.7%。三篇 paper 構成從 bootstrap 到 RL 的完整光譜。

**🎧 第二段：STaR 與 DeepSeekMath/GRPO 的核心機制**
STaR 是 Stanford 的 bootstrapping paper，用 rationalization 把難題納入 training。DeepSeekMath 提出 GRPO，用 group baseline 取代 PPO 的 critic，把記憶體從四份模型降到三份。第一個 open-source 7B 模型跨過 50% MATH benchmark。

**🎧 第三段：DAPO 與 Open Problems**
DAPO 解決 GRPO 在 long reasoning chain 上的不穩定——asymmetric clipping、dynamic sampling、token-level loss、overlong reward shaping，把 Qwen 32B 從 30% 推到 50%。但三種方法都改善 majority@K 而非 pass@K，這是 RL for reasoning 的根本限制。

---

## 概念表

### 概念 1：Train-Time Scaling

| 項目 | 內容 |
|------|------|
| 定義 | 在 training 階段投入更多 compute（讓模型反覆產生、篩選、學習自己的輸出）以提升模型能力 |
| vs Test-time scaling | Test-time 在 inference 重複取樣 + verifier；Train-time 把 filter 邏輯搬回 training |
| 前提 | 領域要有 verifiability（math、code）或可訓練的 verifier |
| 核心循環 | Test-time filter correct outputs → fine-tune model → 重複 |

### 概念 2：Self-Improving Loop

| 項目 | 內容 |
|------|------|
| 定義 | 模型從「自己生成的輸出」中學習，透過 verifier 過濾後 fine-tune 自己 |
| 三階段 | Pre-training（internet）→ Fine-tuning（preference data）→ Self-improving（self-output + verifier） |
| 為什麼叫「Self-Improving」 | 不需要新的人類標註；模型自己產生訓練資料 |
| 前提 | 領域可驗證（verifiability） |

### 概念 3：STaR（Self-Taught Reasoner）

| 項目 | 內容 |
|------|------|
| 提出時間 | 2022，Stanford |
| 核心想法 | Bootstrap reasoning：用 few-shot prompt 生成 rationales → filter correct → fine-tune |
| 關鍵創新 | **Rationalization**——給模型 answer hint，要求逆向推出 reasoning，把難題納入 training |
| 模型 | GPT-J 6B |
| 結果 | GSM8K、CommonsenseQA、Arithmetic 都有改善，sample efficiency 比 SFT 好 |
| 限制 | Plateau 快、rationalization 引入 false positives、不算真 RL |

### 概念 4：Rationalization

| 項目 | 內容 |
|------|------|
| 定義 | 給模型「答案提示」，要求它「show your work」逆向產生 reasoning |
| 為什麼需要 | 沒有 rationalization，模型只在「它本來就會的題目」上學習；難題永遠進不到 training data |
| 直覺 | 「Here's the answer — please generate the rationale that leads to it」 |
| 風險 | 答對不代表 reasoning 對；可能有 invalid 中間步驟 |

### 概念 5：DeepSeekMath

| 項目 | 內容 |
|------|------|
| 提出時間 | 2024 |
| 規模 | 7B |
| 兩個關鍵動作 | (1) 從 DeepSeek Coder 起點 + Common Crawl curate math；(2) 用 GRPO scale up RL |
| 起點選擇 | **Code-trained model 對 math reasoning 很有幫助**（code 教會 reasoning + tool use） |
| 結果 | MATH benchmark 從 46.8% 提升到 **51.7%** |
| 意義 | 第一個 open-source 7B 模型跨過 50% MATH，不用 critic |

### 概念 6：GRPO（Group Relative Policy Optimization）

| 項目 | 內容 |
|------|------|
| 核心想法 | 用 group baseline 取代 PPO 的 critic/value function |
| 公式 | Advantage = (reward - mean(rewards)) / std(rewards) |
| 記憶體 | 從 PPO 的 4 份模型降到 3 份（old policy、new policy、reward model） |
| 直覺 | 「Reward models are trained on comparison anyway — by providing the group context you can save memory」 |
| 限制 | 如果 rewards 全 1 或全 0，normalization 壞掉，沒有 hill-climbing signal |

### 概念 7：Group Baseline

| 項目 | 內容 |
|------|------|
| 定義 | 對同一個 question sample K 個 answers，用 reward model 評分，再算 group 內的 mean 和 std |
| 為什麼有效 | 比較型 reward model 跟「相對於 group」是同樣的精神 |
| 失敗條件 | 如果 group 內 answers 全對或全錯（all 1s 或 all 0s），advantage 為零 |
| 修法 | Dynamic sampling（見 DAPO） |

### 概念 8：DAPO（Decoupled Clip and Dynamic Sampling Policy Optimization）

| 項目 | 內容 |
|------|------|
| 目標 | 解決 GRPO 在 long reasoning chain（AIME 級別）上的不穩定 |
| 五個技術 | Clip-Higher、Dynamic Sampling、Token-Level Loss、Overlong Reward Shaping、Soft Overlong Punishment |
| 結果 | Qwen 32B 在 AIME 上從 30% → **50%** |
| 意義 | 讓 Qwen 32B 自己 hill-climb 到接近 DeepSeek R1 distilled 32B 的水平 |

### 概念 9：Clip-Higher（Asymmetric Clipping）

| 項目 | 內容 |
|------|------|
| 問題 | PPO 傳統 clipping 對「增加」和「降低」是對稱的 → low-prob token 只能 hill-climb 有限 |
| 解法 | 允許更大的「增加」幅度（asymmetric clipping） |
| 效果 | Entropy 不會 collapse、accuracy 上升、exploration 保持 |

### 概念 10：Dynamic Sampling

| 項目 | 內容 |
|------|------|
| 問題 | GRPO 對全對或全錯的 group 浪費 gradient（advantage 都是零） |
| 解法 | Oversample + filter——只保留「有些對、有些錯」的 group |
| 為什麼有效 | 確保 effective batch size 都用來做有效 gradient update |
| 直覺 | 「You essentially want to keep only those groups that have some signal」 |

### 概念 11：Token-Level Loss vs Sample-Level Loss

| 項目 | 內容 |
|------|------|
| Sample-level loss | 整個 answer 算一個 loss，long garbage 跟 short good answer 同樣 weight |
| Token-level loss | 每個 token 都有 loss contribution |
| 為什麼 token-level 好 | Long reasoning chain 裡每個 token 都重要；避免 long noise dominate |

### 概念 12：Overlong Reward Shaping

| 項目 | 內容 |
|------|------|
| 問題 | Long reasoning chain 容易被 context window truncate，產生 noise |
| 解法 | 在接近 truncate 邊界的 token 上施加漸進式懲罰 |
| 替代方案 | Increase context length over RL loop |
| 目的 | 讓 training 不被 truncated noise dominate |

### 概念 13：Entropy（in RL training）

| 項目 | 內容 |
|------|------|
| 定義 | 模型 output 分布的「不確定性」——entropy 越高代表 exploration 越多 |
| 在 RL 中的角色 | Entropy 是 exploration 的 proxy |
| 失敗模式 1 | Entropy collapse（太低）→ 失去 exploration |
| 失敗模式 2 | Entropy explosion（太高）→ 訓練不穩定 |
| 監控指標 | 必須 keep 在 sweet spot |

### 概念 14：majority@K vs pass@K

| 項目 | 內容 |
|------|------|
| majority@K | K 次取樣中「**多數**」對——consistency metric |
| pass@K | K 次取樣中「**至少一次**」對——capability metric |
| 三大 RL 方法 | 都改善 majority@K |
| 三大 RL 方法 | 都還沒顯著改善 pass@K |
| 根本限制 | RL 改善 consistency，但不會憑空創造 capability |

### 概念 15：Verifiability

| 項目 | 內容 |
|------|------|
| 定義 | 領域是否可用程式化方式驗證答案對錯 |
| 高 verifiability | math、code、formal proof、unit test execution |
| 低 verifiability | personal writing、text editing、creative writing |
| 與 RL 關聯 | Train-time scaling 只在有 verifiability 的領域有效 |
| 與 Part 3 關聯 | Part 3 講 verifier 的 robustness，正是 train-time scaling 的前提 |

### 概念 16：Reward Hacking

| 項目 | 內容 |
|------|------|
| 定義 | Model 學到「hacking reward model」而非「真正學到任務」 |
| 觸發條件 | Reward model 太弱 / model 太 capable |
| 例子 | 答對率提升但 reasoning quality 下降 |
| 解法方向 | Ensemble verifiers、process reward model |

### 概念 17：Effective Batch Size（in RL）

| 項目 | 內容 |
|------|------|
| 定義 | 真正能 propagate gradient 的 batch size（filter 掉零 advantage 後） |
| 在 DAPO 中 | Dynamic sampling 後，effective batch size 維持穩定 |
| 問題 | 太多 group 被 filter（all 0s 或 all 1s），effective batch size 會塌縮 |
| 解法 | Oversample + 確保 reward distribution 有 variance |

### 概念 18：Off-Policy vs On-Policy RL

| 項目 | 內容 |
|------|------|
| On-policy | 用「current policy」sample 訓練資料（如 PPO、GRPO） |
| Off-policy | 用「其他來源」的資料訓練（如 STaR 用 self-generated rationale 但沒嚴格 on-policy） |
| STaR | 講者直接說「almost like off-policy RL」——bare-bones |
| DAPO/GRPO | 都是 on-policy RL |

### 概念 19：Pre-training vs RL 的 Compute 比例

| 項目 | 內容 |
|------|------|
| 2024 | Pre-training 99% / RL 1% |
| 2025 | Pre-training 95% / RL 5% |
| Grok 4 自稱 | 50% RL（但實際被 entropy / reward noise 卡住） |
| 趨勢 | RL 在 LLM 訓練中角色快速上升，infrastructure bottleneck 也變大 |

### 概念 20：KL Divergence Term（在 RL 中）

| 項目 | 內容 |
|------|------|
| 目的 | 防止 policy 偏離 reference model 太遠 |
| 用途 | 避免 fine-tune 在難題上忘記簡單題（regression） |
| 在哪出現 | PPO loss 的一部分；DPO 也用 KL 防止 drift |
| 限制 | KL 太強會限制 learning；太弱會允許 catastrophic forgetting |

### 概念 21：Verifier Quality 的根本重要性

| 項目 | 內容 |
|------|------|
| 影響 | 決定整個 train-time scaling loop 的上限 |
| 太弱 verifier | RL 沒有 hill-climbing signal |
| 太強 verifier | Reward hacking（model hacking reward） |
| 解法方向 | Ensemble verifiers（Part 3 方向） |

### 概念 22：AIME Benchmark

| 項目 | 內容 |
|------|------|
| 全名 | American Invitational Mathematics Examination |
| 難度 | 比 GSM8K 難，高中邀請賽等級 |
| 為什麼選 | MATH benchmark 已 saturated + contamination |
| 2024/2025 對照 | GPT-3.5 175B ~5%、DeepSeekMath 7B 51.7%、Qwen 32B + DAPO 50% |
| 意義 | Train-time scaling 讓小模型接近大模型的推理能力 |

### 概念 23：Reasoning Behaviors（emerging vs prevalent）

| 項目 | 內容 |
|------|------|
| 觀察行為 | backtracking、self-evaluation、task decomposition、parallel search |
| 問題 | 這些行為是真的 emerge 還是統計上更常發生？ |
| 兩種解釋 | (a) Model 學會新能力；(b) Model 把既有 capability 的機率提高 |

### 概念 24：Code-to-Math Transfer

| 項目 | 內容 |
|------|------|
| 觀察 | DeepSeekMath 從 DeepSeek Coder 起點，比從一般 base model 起點好 |
| 原因 | Code 訓練教會 reasoning + tool use |
| 影響 | 跨 domain 的 transfer learning |

---

## 金句

### 金句 1
> 「**If you take the model output filter after applying this test-time scaling, and then use that to fine-tune further — that's roughly what train-time scaling does.**」
> ——講者總結 train-time scaling 的本質

### 金句 2
> 「**Typically if you try to do reinforcement learning on reasoning, it will not work well — and a lot of the times the reason it doesn't work well is because the implementation details are hard to get right.**」
> ——講者點出 RL for reasoning 的核心挑戰

### 金句 3
> 「**A lot of the magic in this particular domain is like what can the base model do — as we're building on top of that.**」
> ——講者解釋為什麼 STaR 的天花板受限於 base model

### 金句 4
> 「**It's almost like off-policy reinforcement learning. It's a very bare-bones way of producing reasoning techniques in a model.**」
> ——講者定位 STaR 在 RL 光譜上的位置

### 金句 5
> 「**Math is a domain in which there is verifiability.**」
> ——講者解釋為什麼 train-time scaling 在 math 上有效

### 金句 6
> 「**Test-time compute works well in benchmarks where the verifiability is robust. Otherwise you do need to get the model to start to reason better — and you need some verification loops.**」
> ——講者區分 test-time vs train-time scaling 的適用場景

### 金句 7
> 「**If you're basically trying to close the loop, what you're trying to figure out is how much reward you're giving. So simple problems effectively might equate to you're going to get a reward of one anyways, and you're never getting a reward of zero. And with GRPO, you're getting some form of a distribution of rewards.**」
> ——講者解釋為什麼 GRPO 需要 reward distribution 有 variance

### 金句 8
> 「**What was improving in this particular paper was that the majority of the solutions become correct. The model actually became more consistent — not fundamentally smarter.**」
> ——講者點出 RL training 的根本限制

### 金句 9
> 「**If you naively scale up GRPO and want to do this on even a Qwen 32B model, you would get 30% on AIME benchmark. The entropy of the model collapses, the model can become too confident, the training can become unstable, and the response length can become uncontrollable — like it can explode uncontrollably.**」
> ——講者描述 GRPO 在 long chain 上會遇到的四個失敗

### 金句 10
> 「**You essentially want to keep only those groups that have some signal.**」
> ——講者解釋 Dynamic Sampling 的核心原則

### 金句 11
> 「**RL does provide you, in the domains where you do have a strong reward signal, the ability to hill-climb with fewer number of examples — but it does take a lot of work to get it right. Supervised fine-tuning oftentimes, if you do have access to a lot of high quality data, is a faster way to just improve the model performance in certain cases. But it doesn't bring reasoning trace reasoning capabilities or boost them in certain ways.**」
> ——講者回答 SFT vs RL 的取捨

### 金句 12
> 「**All three techniques will improve, in general, the majority-at-K performance on the y-axis as you put more compute. But none of these will yet improve the fundamental capability or just teach the model to solve no new problems or generalize a lot out of domain.**」
> ——講者總結三種方法的共同邊界

---

## 人物

### 講者
- **Stanford CS329A 課程團隊**——Self-Improving AI Agents 系列授課者。

### 相關學者（從 transcript 提到 / 隱含）
- **Stanford STaR 作者群**——本課 Paper 1 作者。
- **DeepSeek Math / GRPO 作者群**——DeepSeek 團隊。
- **DAPO 作者群**——講者未明示。
- **o1 / Gemini Flash Thinking 開發者**——reasoning model 代表案例。
- **Grok 4 開發者**（xAI）——講者引用其聲稱 50% RL 訓練。

---

## 延伸閱讀

### 直接相關 Paper
- **STaR: Self-Taught Reasoner**（Stanford, 2022）——本課 Paper 1。
- **DeepSeekMath**（DeepSeek, 2024）——本課 Paper 2，GRPO 出處。
- **DAPO**（2025）——本課 Paper 3，解決 GRPO 在 long chain 上的不穩定。

### 同系列前幾堂
- **CS329A Part 1**—Pre-training Scaling Laws
- **CS329A Part 2**—Test-Time Compute Scaling
- **CS329A Part 3**—Robust Verification
- **CS329A Part 4**—Learning from Feedback with Tools & Code
- **CS329A Part 5**—Planning & Multi-Step Reasoning

### 同源相關 Lecture
- **Stanford CS336 Lecture 16: RLVR**——RL with Verifiable Rewards。
- **Stanford CS336 Lecture 17: Alignment & Multimodality**。

### 核心概念對照

| Part 6 概念 | 對應前面 Part |
|------------|---------------|
| STaR bootstrap | Part 2（Test-time scaling 的 filter 邏輯） |
| Rationalization | Part 3（Process Reward Model 的反向應用） |
| Verifiability 前提 | Part 3（Robust verification） |
| Entropy collapse | Part 2（Inference-time scaling 的 log-linear 限制） |
| Dynamic sampling | Part 2（Coverage vs samples 的 power law） |
| Long reasoning chain | Part 5（Multi-step reasoning 的延伸） |
| RLEF | Part 4（Learning from feedback with code） |
