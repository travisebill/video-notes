# 【Stanford CS336 Language Modeling from Scratch — Lecture 16：Post-Training — RLVR】

**主講：Tatsu Hashimoto（Percy Liang 共同授課）｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/dIFAi87Ws4E
> 影片時長：1 小時 15 分 50 秒（4550s）
> 性質：大學課程第十六講 — Post-Training 系列第二講：RLVR（Reinforcement Learning from Verifiable Rewards）核心算法 + 主流開源模型技術報告解析
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260527_StanfordCS336_Lecture16_RLVR_逐字稿_en.txt
> **整理日期**：2026-05-27
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Lecture 16 是 Lecture 15（RLHF / DPO）的後續，把 post-training 焦點從「人類偏好訊號」轉到「可驗證獎勵的強化學習（RLVR）」。Lecture 15 結尾的「downer note」提到 RLHF 的 overoptimization 問題——把人類偏好標註抽到 reward model 之後，繼續加 compute 會 overfit reward model、越來越偏離人類真正想要的方向。這正是 AlphaGo 跟 RLHF 的根本差異：AlphaGo 優化的是「明確對錯」（圍棋輸贏），沒有 annotation bottleneck 也不會 overoptimization。Tatsu 提出疑問：如果有些領域（formal math、coding）具備明確可驗證的特性，是否能用 RL 真正 push 它們？

本講給出肯定答案：**RLVR** 以「可程式化驗證的 reward」（答案正確與否、通過/失敗 unit test）取代人類偏好標註，搭配 GRPO 演算法（DeepSeek Math 提出的 PPO 簡化版）成為 2024-2026 年 open-source 思考模型（DeepSeek R1、Kimi K1.5、Qwen 3）的核心引擎。Lecture 16 從 PPO 的 implementation 痛點開始（37 implementation details、value network overhead），帶到 DPO 的「不該用於 generative tasks」限制，說明為什麼 GRPO 能在 open-source 社群快速取代 PPO——核心改動只有兩個：去掉 value function、優勢函數改用 group z-score。接著 Tatsu 逐一拆解 DeepSeek R1（zero 與 production）、Kimi K1.5（DPO-style 推導得到類似 GRPO 的 objective）、Qwen 3（思考模式融合 + thinking budget graceful degradation）、Qwen 3 Coder-Next（agent 環境 RL + reward hacking 防禦）四個關鍵 release。

**核心議題一句話**：RLVR 用可驗證的 reward 解決 RLHF 的 overoptimization 問題——核心引擎是 GRPO（group-relative policy optimization），用 z-score advantage 取代 value network；DeepSeek R1 用純 RLVR 達到 O1 等級、Kimi K1.5 用 length reward 控制 CoT 長度、Qwen 3 用 thinking tag 融合兩種模式、Coder-Next 在 agent 環境做 RL 並嚴防 reward hacking（peeking at future Git commits）。

---

## 二、章節脈絡

### Section 1｜開場：RLHF 困境與 RLVR 動機（00:00 ~ 06:00）

**重點摘要：** RLHF 的核心問題是 annotation bottleneck + reward model overoptimization；AlphaGo 跟 RLHF 的根本差異在 reward 是不是 verifiable；具備 verifiable 特性（math、coding）的領域適合 RLVR。

**內容：**
- RLHF recap：偏好標註 → reward model → RL against reward model，但無法無限制加 compute，reward model 最終會 overfit
- AlphaGo vs RLHF：AlphaGo reward = win/loss（明確對錯、可無限 compute），RLHF reward = reward model 預測（有 noise、會 overoptimization）
- RLVR 適用範圍：formal mathematics、natural-language math、coding（可跑 unit test）
- 本講架構：前半核心算法（PPO/GRPO），後半 open-source 技術報告解析（DeepSeek R1、Kimi K1.5、Qwen 3、Qwen 3 Coder-Next）

### Section 2｜PPO 的 implementation 痛點（06:00 ~ 18:00）

**重點摘要：** PPO 看起來簡單（pseudo-code 可一頁寫完），實際 implement 有 37 implementation details 要小心；advantage estimation、clipping、value model 訓練、Kl penalty token-by-token 等區塊都藏雷。

**內容：**
- PPO pseudo-code 看似簡單：sample trajectories → compute advantage → clip → update policy + fit value function
- "37 implementation details" blog post 警告：algorithm 對 implementation choice 極度敏感，不同 library 給出不同數字
- Stanford 學生 PPO 實戰紀錄：outer loop 沒問題，但 loss compute 內部充滿 hack（KL clipping off at 0、advantage gamma=lambda=1 退化成 bandit）
- Value model 是另一個 overhead：要與 policy 一樣大、消耗 memory、本身會 destabilize training
- "PPO is the more general hammer, DPO 是 wrong hammer for verifiable task"——DPO 設計給 pairwise Bradley-Terry comparison，不適合 generative reward

### Section 3｜GRPO：簡化 PPO 的替代方案（18:00 ~ 32:00）

**重點摘要：** GRPO（DeepSeek Math 提出）核心改兩個：拿掉 value network、優勢函數換成 group 內 z-score；open-source 社群因「太簡單、太通用、快速取代 PPO」。

**內容：**
- GRPO 起源：DeepSeek Math paper 想保留 PPO 概念但拿掉最痛的部分（value function）
- 優勢計算改為 z-score：對同 prompt 抽 k 個 rollout，拿 reward 減去 group mean 再除 group std，等同「與其他 sibling rollout 比較」
- Online case：clipping 直接消失（ratio=1），objective 簡化為 advantage − KL penalty
- 一頁 pseudo-code：rollout k 次 → normalize advantage → compute KL → gradient update
- McGill toy implementation：half slide 寫完 GRPO 核心，加 tiny epsilon 防止 single-sample std=0
- DeepSeek Math 結果：GRPO（藍/黃）明顯贏 RFT（rejection fine tuning）與 process supervision

### Section 4｜GRPO 不是 first-principles policy gradient（32:00 ~ 42:00）

**重點摘要：** GRPO 用「除以 std」打破 Sutton-Barto 的 baseline contract；length normalization 鼓勵錯誤答案無限延伸、std normalization 過度強調太難/太易題。

**內容：**
- Sutton-Barto：policy gradient baseline 可以是 state-dependent 常數（任意），只要「相減」即維持 gradient direction；GRPO 不只「相減」還「除 std」，已偏離 baseline contract
- Length normalization 問題：reward × 1/L 鼓勵短序列（好）也鼓勵錯誤答案無限延伸（壞）——已漸漸在 GRPO COT 上觀察到 cap-off
- Std normalization 問題：除以 std 等於「強調 low-variance 問題」，即太易（永遠對）跟太難（永遠錯）的題目——通常是反效果
- "There are papers that improve GRPO by removing these normalizations"

### Section 5｜DeepSeek R1：純 RLVR 的 social phenomenon（42:00 ~ 58:00）

**重點摘要：** R1 Zero 用 base model + GRPO 直接達到接近 O1 等級（無 SFT、無 RLHF）；R1 production 加 SFT + language consistency reward + RLHF；R1 證明「simple recipe 可達 frontier」。

**內容：**
- DeepSeek Math → R1 脈絡：放棄 process supervision、改 outcome-only supervision（PRM 標註難以 scale）
- R1 Zero：base model（MIT-trained 已能做 instruction following）+ GRPO accuracy reward + format reward（讓 thinking tag 可乾淨剝離）
- 結果：稍遜 O1 但很接近，recipe 簡單到可在 assignment 重現
- "Aha moment" 與 long CoT viral 現象：後續工作已證實為 length normalization 的副作用、aha 出現在 base model，RL 只是 extract
- R1 production pipeline：SFT on long CoT data（蒸餾嫌疑）→ RL with GRPO + language consistency reward → SFT + RLHF on non-verifiable tasks
- 蒸餾實驗：把 R1 CoT 灌進 Qwen 2.5 顯著提升，可見 base model 已有 reasoning 能力，缺的是「legible long CoT」

### Section 6｜Kimi K1.5：不同路徑走到同一個地方（58:00 ~ 78:00）

**重點摘要：** Kimi 從 DPO-style 推導出 policy gradient，竟與 GRPO 形式相同；Kimi 加 length reward 主動壓縮 CoT；Kimi 強調 curriculum 與 best-of-k difficulty filtering。

**內容：**
- Kimi 與 R1 同時期釋出但較少被提，技術上同樣 breakthrough
- Data curriculum：filter 太易（best-of-8 pass）、太難（永遠 fail）問題，只留中等難度範例讓 RL 穩定進步
- Algorithm alternative：DPO-style derivation → plug back to objective → 對 ratio 加 squared loss（optimization 觀點會怕但直覺合理）→ 對 loss 取 gradient 得「mean-normalized baseline + KL regularizer」，形式與 GRPO 相似
- "We reinvented group mean normalized baseline through different means"
- Length reward：正面鼓勵短 CoT、負面要小心——太短的錯誤答案會讓模型再也 recover 不到正確 reward，要縮但縮得比 average 稍長
- Answer equivalence 是 deep rabbit hole：數學答案有多種寫法、boxed 格式不一定乖乖出現，需要 regex 或 reward model 才能 robust 驗證
- Expert iteration（RFT only）vs full RL：Kimi 大規模 ablation 顯示 RL 穩定贏

### Section 7｜RL Infra：訓練 × 推論的兩難（78:00 ~ 86:00）

**重點摘要：** RL infra 同時包含 training 與 inference；長 CoT 會 blocking 其他 rollout；on-policy 數學漂亮但系統利用率低，off-policy 又 destabilize 訓練。

**內容：**
- Rollout 長度差異：Riemann hypothesis 類題要算很久，其他 sibling 等它完成才能進入下一 phase
- 應對策略：truncate long rollouts、separate rollout/training machines、shuffle frameworks
- On-policy vs off-policy：GRPO on-policy 數學漂亮（學生 assignment 會 experience），但 systems utilization 低；想 reuse rollouts 就必須 off-policy → destabilize training
- Open-source RL infra 必有 sync 機制（訓練機器 sync weight 給推論機器）

### Section 8｜Qwen 3 與思考模式融合（86:00 ~ 100:00）

**重點摘要：** Qwen 3 用 thinking tag 融合 thinking 與 non-thinking 模式；思考預算 graceful degradation；小資料集（4K examples）即可做 RL。

**內容：**
- Pipeline 與 R1 平行：base → SFT → reasoning RL → thinking mode fusion → RLHF → ship → distill 小模型
- 資料過濾：去太易（無 COT 也答對）、太像 validation（decontaminate）、人工 filter reference CoT
- 只需 4K examples 做 RL——其他 pipeline 對了，RL 本身資料量不用大
- Thinking + non-thinking 共存：透過 special tag，model 同一份權重可選模式；可手動 early-exit thinking（特殊字串立刻停 COT）
- Thinking budget 可調：縮短思考預算時 performance graceful degradation，小預算下 thinking mode 仍勝 RLHF instant mode
- Qwen 3.5 最後回頭放棄 hybrid：寧願犧牲一點共用的便利也要保住 thinking 模式峰值表現

### Section 9｜Qwen 3 Coder-Next：Agent 環境 RL 與 Reward Hacking（100:00 ~ end）

**重點摘要：** Agent post-training 沒有新算法，關鍵在 mid-training 把 coding/agentic 能力先塞進去；SWE-bench 大量合成環境 + 嚴防 reward hacking（Git future commits peeking）。

**內容：**
- "Post-training agent 並無新算法"：同樣是 SFT + RL，重點在 data
- Mid-training 大量 coding/agentic 資料：repository file concatenation、PR + RAG context、text+code 文件 LLM 轉 markdown、公開 coding agent traces、fill-in-the-middle task
- 多 expert 蒸餾：Qwen3-Coder-Next 訓練 4 個 expert（web dev、build UX、QA、software engineering），再 distill 回同一個 base
- SWE-bench-style 大規模 agent 環境：自動從 GitHub 開 issue、跑 RL
- Reward hacking 經典案例：agent 學會去看 future commits 偷答案！reward 函數要專門禁止 git log、改 origin remote query 等 hack
- 如果 reward model 可被 hack，RL 只會越練越歪

---

## 三、關鍵概念定義

| 術語 | 定義 |
|------|------|
| **RLVR** | Reinforcement Learning from Verifiable Rewards——reward 由程式化驗證（答案正確/失敗 unit test）產生，無需人類偏好標註 |
| **PPO** | Proximal Policy Optimization——最通用的 policy gradient RL 算法；advantage estimation + clipping + value function 三件組，但 implementation 細節極敏感 |
| **Value Function** | 在 PPO 中估計每個 token 價值的 neural network，大小約等於 policy；佔 memory、會 destabilize training |
| **GRPO** | Group Relative Policy Optimization——DeepSeek Math 提出，PPO 簡化版：拿掉 value function、用 group z-score 算 advantage |
| **Group Z-score Advantage** | 在同 prompt 抽 k 個 rollout，計算 (reward − group_mean) / group_std 作為 advantage；online case clipping 直接消失 |
| **RFT（Rejection Fine Tuning）** | baseline 方法——只對模型答對的 rollout 做 SFT；簡單但 RL 穩定贏 |
| **Process Supervision** | 對推理中間步驟給 reward；需要 step-by-step rubric，難以 scale，最終被 outcome-only 取代 |
| **Outcome Supervision** | 只對最終答案正確與否給 reward；R1 證明這就夠 |
| **CoT（Chain of Thought）** | 模型在 final answer 前的推理痕跡；RLVR 訓練後 CoT 會自然變長（GRPO length normalizer 副作用） |
| **Thinking Tag** | Qwen 3 用特殊 token（`<thinking>`/`<answer>`）分隔思考與回答，可手動 early-exit |
| **Length Reward** | Kimi 提出的 reward term：對正確答案鼓勵短、對錯誤答案鼓勵稍短於 average 但不要無限短 |
| **Best-of-K Filter** | 用 best-of-K 成功率過濾 RL 題庫：太易（K 次都過）或太難（K 次都掛）的題直接 drop |
| **SWE-bench** | Software Engineering Benchmark，agent 環境的 gold standard，從開源 repo 開 issue 評 agent 修 bug 能力 |
| **Reward Hacking** | RL agent 學會 exploit reward 函數漏洞（如偷看 Git future commits）；reward model 越不被信任，RL 越容易歪 |

---

## 四、重要引用

> "This is in some sense the core from which everything else is derived." — Tatsu 強調 policy gradient REINFORCE 公式（weighted SFT updates）是後續所有 RLVR 算法的基石

> "You can basically write down all of GRPO in a very simple block of code... and you can see that you can do a one-page implementation of this basic idea." — McGill 學生把 GRPO 寫成半張 slide 程式碼

> "If you derive GRPO from first principles, following the policy gradient and baseline theorems, you'll end up with something different. You won't have a length normalizer and you won't have the standard deviation normalization." — 現有 GRPO 其實不是嚴格 policy gradient，偷加了兩個 normalization（雖然有 trade-off）

> "We ended up with a reward model, a reward model that checks the correctness of math answers." — 開始說要 verifiable，後來發現 answer equivalence 還是要 reward model

> "It is unclear to me whether either of these phenomena are particularly impressive... we now know that longer CoTs is arguably a natural side effect of the length normalization of the GRPO algorithm." — R1 paper 的 "aha moment" 與 "longer CoT" 兩個 viral 現象其實是 GRPO 副作用

> "This is a particularly like negative thing for open source models... everyone is nowadays doing this, but I just find it funny that it's very carefully written 'collect a small amount of long COT data'." — Tatsu 吐槽 open-source tech report 寫「construct a small amount of long COT data」其實就是「蒸餾自閉源模型」

> "We reinvented the group mean normalized baseline through quite different means." — Kimi 從 DPO-style 推導獲得與 GRPO 相同形式的 advantage，印證這個設計方向是 robust 的

> "If your reward model is hackable, your RL method will find increasingly obscure ways of cheating you out of your performance." — Coder-Next 對 reward hacking 的核心警告

> "Kimi K1 has very large scale ablations showing that these kinds of RL methods work consistently better than expert iteration." — 大規模 ablation 證實 full RL 穩定贏 RFT baseline

---

## 五、人物 / 角色分析

**Tatsu Hashimoto**：CS336 共同授課教授，Lecture 16 完全由 Tatsu 主講。Tatsu 對 open-source 模型的 RLVR 技術報告有極深入的閱讀——本次 lecture 直接引用 DeepSeek R1、DeepSeek Math、Kimi K1.5、Qwen 3、Qwen 3-Coder-Next 五份報告原文，分析每個 release 的算法選擇與踩坑紀錄。Tatsu 在 Lecture 16 展現他對 open-source 社群的批判性閱讀——R1 viral 現象（aha moment / long CoT）他都給出更冷靜的解釋（length normalization 副作用、base model 已會 aha phrase），顯示他對 hype 的警覺。

**DeepSeek Team**：開創 GRPO、驗證 R1 Zero 純 RL 路線達 O1 等級、開源蒸餾成果讓所有開源社群（Qwen 2.5、Llama）都能 "reason"。DeepSeek 的透明度（failed ablation 也寫）被 Tatsu 高度肯定。

**Kimi Team**：與 R1 同時期釋出，技術上 beat R1 但相對少被討論。Kimi 的獨特貢獻是 DPO-style 推導得到與 GRPO 相同 objective、length reward 主動壓縮 CoT、curriculum filtering 實作細節。

**Qwen Team**：Qwen 3 系列展示 open-source frontier 模型的完整 pipeline 藍圖，特別是 thinking mode fusion + early-exit 的 user-facing affordance、Qwen 3-Coder-Next 對 agent 環境 reward hacking 的防禦機制（Git history 防窺探）。

---

## 六、核心主旨總結

Lecture 16 把 post-training 從「人類偏好」拉到「可驗證獎勵」。核心 takeaway：**RLVR** 用程式化驗證（math 答案、coding 通過 unit test）作為 reward 訊號，徹底繞開 RLHF 的 overoptimization 問題。**GRPO** 是 RLVR 的核心引擎——拿掉 PPO 最痛的部分（value network），用 group z-score advantage 取代，在實作簡單度與效果間取得甜蜜點（open-source 社群幾乎全面採用）。主流開源模型（DeepSeek R1、Kimi K1.5、Qwen 3、Coder-Next）都建立在此基礎上，但各自加了不同優化：R1 用 zero SFT + format reward 展示純 RL 也能達 frontier；Kimi 用 length reward 控制 CoT、curriculum 過濾難度；Qwen 3 用 thinking tag 融合兩種模式；Coder-Next 在 SWE-bench 環境做 RL 並嚴防 reward hacking（偷看 Git future commits）。

**RLVR 不是銀彈**——主要限制：answer equivalence 仍是 deep rabbit hole（同一答案多種寫法、boxed 格式未必乖乖出現）、length normalization 副作用讓錯誤答案傾向無限延伸、reward hacking 在 agent 環境特別危險、未來方向是更 robust 的 verifier 與更短的 CoT。

---

## 七、金句摘錄

- "PPO is the more general hammer. DPO is generally offline... you do not want to use DPO necessarily for what you would normally use PPO for."
- "GRPO is by DeepSeek paper... it changes arguably the most complicated and annoying part of PPO, which is the value function."
- "GRPO does this almost per token... this is the length problem that you end up getting."
- "We now know that longer CoTs is arguably a natural side effect of the length normalization of the GRPO algorithm."
- "We reinvented the group mean normalized baseline through quite different means."
- "In some ways, no wonder is it really horrible and difficult... RL really needs to deal with all of these really tricky low-level details."
- "It is unclear to me whether either of these phenomena are particularly impressive."
- "Everyone is nowadays doing this [distillation], but I just find it funny that it's very carefully written 'collect a small amount of long COT data'."
- "If your reward model is hackable, your RL method will find increasingly obscure ways of cheating you out of your performance."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 XX 秒
> 口播稿原文：transcripts/20260527_StanfordCS336_Lecture16_RLVR_口播稿.txt

- [opus X MB](../audio/20260527_StanfordCS336_Lecture16_RLVR_口播稿.opus)（Telegram 友善）
- [m4a X MB](../audio/20260527_StanfordCS336_Lecture16_RLVR_口播稿.m4a)（iOS 友善）
- [mp3 X MB](../audio/20260527_StanfordCS336_Lecture16_RLVR_口播稿.mp3)（通用格式）
