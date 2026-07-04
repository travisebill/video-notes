# 【Stanford CS336 Language Modeling from Scratch — Lecture 11：Scaling Laws（進階） — Open-Source Frontier 與 Optimizer 細節】

**主講：Tatsu Hashimoto（Percy Liang 共同授課）｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/vTfEyOyzV9E
> 影片時長：1 小時 17 分 03 秒（4623s）
> 性質：大學課程第十一講 — Scaling Laws 進階：從古典 Kaplan/Chinchilla 過渡到 open-source frontier 與 optimizer scale-sensitivity
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260519_StanfordCS336_Lecture11_ScalingLaws_逐字稿_en.txt
> **整理日期**：2026-05-19
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Lecture 11 是 Lecture 9「Scaling Laws — Kaplan、Chinchilla」的進階篇。Lecture 9 建立了「loss 是 N / D / C 的冪律函數、Chinchilla 重新定義 compute-optimal frontier」的基礎理論；本講則把視角拉到 **2024-2026 年 open-source 模型實際訓練時 scaling 是怎麼做的**，特別是 MiniCPM、DeepSeek、Hunyuan、LLaMA 3 等 open-source 前沿模型如何處理 **initialization、optimizer、batch size、learning rate 這些會隨 scale 漂移的敏感參數**。Tatsu 強調：scaling laws 在教科書裡看起來像科學——「畫一條線、做這些步驟，就能預測大模型的表現」——但實際操作中非常 messy，沒有所謂的「銀彈」。

**核心議題一句話**：Scaling laws 不只是 Kaplan-Chinchilla 的冪律擬合——現代 frontier 模型要同時處理 **muP 初始化、WSD learning rate schedule、MoE sparsity 與 active parameters 的 scaling、critical batch size 隨 scale 的冪律漂移** 等多維度問題；Lecture 11 透過 MiniCPM、DeepSeek、LLaMA 3、Hunyuan 等案例，展示 open-source 社群如何在沒有銀彈的前提下，用一整套「hyperparameter drift 控制」的工具組合來逼近 compute-optimal frontier。

---

## 二、章節脈絡

### Section 1｜開場：Scaling 在真實世界 vs 教科書（00:00 ~ 08:00）

**重點摘要：** Scaling laws 在 initial presentation 看似科學——畫線、做步驟就能預測大模型表現；但實務上非常 messy，需要一整套工具組合才能逼近 frontier。

**內容：**
- 古典 scaling laws（Kaplan 2020、Chinchilla 2022）只給出「最終模型大小 N 與資料量 D 的取捨」
- 真實 frontier 模型還要處理：initialization、optimizer、batch size、learning rate 隨 scale 漂移
- Lecture 11 三條主軸：
  1. **Open-source 模型的 scaling strategies**（MiniCPM、DeepSeek、LLaMA 3、Hunyuan）
  2. **Optimizers 與 initializations 的 scale sensitivity**
  3. **MoE 與 sparsity 對 scaling laws 的影響**

### Section 2｜MiniCPM：muP 初始化 + WSD Learning Rate（08:00 ~ 35:00）

**重點摘要：** MiniCPM 透過 muP（Maximal Update Parametrization）把 optimal learning rate 穩定在跨 scale 不變，搭配 WSD（Warmup-Stable-Decay）learning rate schedule 把 critical batch size 控制成 power law。

**內容：**
- **muP 的設計目標**：讓 optimal learning rate 在 scale up/down 時保持穩定
  - 5x 差距的 scaling ladder（小模型推到目標 5x 大小）
  - 不需要 brute-force 訓練數百個不同大小的模型
- **muP 具體做的事**：
  - Scale embedding output
  - Scale residual connections by `√(layers)`
  - Scale matrix initialization by fan-in/fan-out ratio
  - **Per-parameter learning rates**（exotic 但關鍵）
  - Scale LM heads
- **muP 效果**：實驗顯示 optimal learning rate 在不同 model size 下都接近 10⁻²，minimal loss curve 乾淨
- **Critical Batch Size（miniCPM 結果）**：optimal batch size 隨 tokens processed 呈冪律變化，跨 model sizes 都成立
  - 對應 Kaplan 2020 critical batch size 的 scaling
  - 給定 target loss，optimal batch size 是 power law
- **WSD（Warmup-Stable-Decay）Schedule**：
  - 三段式：warmup → 穩定 plateau → 最後 annealing decay
  - 比 cosine schedule 更乾淨，final annealing 對模型最終表現非常關鍵
  - 讓 Chinchilla 分析更容易：跑一個 long run + 反覆 decay checkpoint = 沿 data dimension sweep
- **MiniCPM 重現 Chinchilla**：replicate method 1 與 method 3，雖 exponent 與原始 Chinchilla 不同但 scaling curves 看起來 reasonable
  - Tatsu 對 method 1/3 的可靠性持保留態度，但 MiniCPM 仍有不錯的 scaling curves
- **MiniCPM 兩個 takeaway**：
  1. muP 是穩定 learning rate 的有用 trick
  2. WSD 是必須知道的 basic learning rate schedule

### Section 3｜DeepSeek：Scaling Law Fit Optimal LR & Batch Size（35:00 ~ 60:00）

**重點摘要：** DeepSeek 走完全相反的路——不用 muP，而是透過大量 grid search 跑 scaling laws，把 optimal learning rate 與 optimal batch size 都 fit 成 nonembedding FLOPs 的冪律。

**內容：**
- **DeepSeek 的策略**：直接假設 LR 與 batch size 隨 scale 變化，但「如果變化是可預測的 scaling law，就不需要太擔心」
- **執行方式**：
  - 跨多個 scales 跑 extensive grid search（LR × batch size）
  - 對每個 scale，找到最低 loss 的 LR/batch 組合（淺色點 + 星號標記）
  - 把 optimal batch size vs nonembedding FLOPs 畫成線，得到 power law fit
  - 把 optimal learning rate vs nonembedding FLOPs 也 fit 成線
- **DeepSeek 的結果**：
  - Higher FLOPs → higher batch size + lower learning rate
  - 星號是實際跑的 full runs，符合 fit 的預測
- **Tatsu 評價**：DeepSeek LLM 是 open world 中做得最好的 scaling analysis 之一
  - 即使在 R1 之前的 paper，就看得出來是 serious people
  - Experiments 設計有 great taste

### Section 4｜MoE Scaling：Sparsity × Active Parameters 的權衡（60:00 ~ 75:00）

**重點摘要：** 切換到 MoE（Mixture of Experts）後，要重新做 scaling laws——重點不是 total parameters 而是 active parameters，且 sparsity 對 loss 的影響是 quantifiable 的冪律。

**內容：**
- **MoE scaling 的新問題**：
  - 給定 FLOPs，要選多少 active parameters？
  - Sparsity（active / total）越高 → 相同 FLOP 下 validation loss 越低（unsurprising）
  - 但 quantitative 關係讓人可以理性選 sparsity
- **Hunyuan 的選擇**：固定 sparsity level，最終用 96 data points per active parameter ratio
  - 不搜 sparsity，只 fit active params vs data
- **LLaMA 3 的 scaling**：
  - IsoFLOP-style analysis，得到與 Chinchilla 相似但稍有不同的 token-to-model ratio
  - 有趣的雙圖：logprob decay 一致性 + 下游 accuracy sigmoid 對應 loss
  - LLaMA 3 的 scaling laws「not particularly useful」但 illustrative

### Section 5｜Optimizers 的 Scale Sensitivity 與 muP 限制（75:00 ~ 95:00）

**重點摘要：** Optimizer 對 scale 非常敏感——initialization、learning rate、batch size 都需要當作 scale 的函數來思考；muP 不是萬靈丹，在某些設定（Lion、large decoupled weight decay）下會失敗。

**內容：**
- **Scale-sensitive parameters**：
  - Initialization（特別是 fan-in/fan-out ratio）
  - Learning rate
  - Batch size
  - 這些都會隨 scale 漂移，需要小心處理
- **muP 的 failure modes**：
  - 不傷害人，但會 break 自己
  - Lion optimizer（sign gradient-based）會 break muP——因為 sign gradient 在精神上類似 Muon
  - **Large decoupled weight decay 是 muP 最明顯的 failure**——唯一明顯 stress test 失敗
- **muP 的核心價值**：如果你真的想穩定 learning rate across scales，muP 是 pretty useful 的工具
  - 增加 width 時 optimal LR 變化非常 predictable 但幅度很大
  - muP 把這個變化壓平
- **Tatsu 的結論**：
  - muP 是「interesting open area of research」——不是 done and dusted
  - 但有 promise
  - Fitting scaling laws 也有 promise
  - **Scaling in the wild is very tricky**——教科書是科學，現實是 art
  - 沒有 silver bullet；明年可能有新 paper 解決，但 not yet

### Section 6｜Q&A 與最終總結（95:00 ~ 77:03）

**重點摘要：** Scaling laws 在 open-source frontier 的實務應用——選擇 architecture、optimizer、hyperparameters 時都要用 scaling laws 來 guide，但 extrapolation 仍有不確定性。

**內容：**
- Scaling laws 的實際用途：
  - Picking architectures
  - Picking optimizers
  - Picking hyperparameters
  - 這些都是「用 scaling laws 做決策」的場景
- 但 extrapolation 永遠有 art 成分——你不知道它會不會永遠 extrapolate 對
- 「Reasonable things to maximize the chances of success」——沒有保證
- **Final punchline**：You can use muP. You can search for optimal LR. These are ways of controlling hyperparameter drift. But there's no silver bullet yet.

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **muP（Maximal Update Parametrization）** | 一類特殊初始化方式，讓 optimal learning rate 跨 scale 保持穩定；透過 scale embedding/residual/initialization/LR/LM heads 等多個維度 |
| **WSD（Warmup-Stable-Decay）Schedule** | 三段式 learning rate schedule：warmup → 穩定 plateau → 最後 annealing decay；比 cosine 更乾淨，final annealing 對最終表現非常關鍵 |
| **Critical Batch Size** | Optimal batch size 隨 tokens processed 呈冪律變化；對應 Kaplan 2020 critical batch size 的 scaling |
| **Hyperparameter Drift** | Optimal LR / batch size / initialization 等隨 model scale 變化的現象；需要 muP、scaling law fit 等工具來控制 |
| **Active Parameters（MoE）** | MoE 模型中每個 token 實際 activate 的參數量；scaling laws 應 fit active 而非 total parameters |
| **Sparsity（MoE）** | MoE 模型中 active / total 參數比；越高 sparsity 對相同 FLOPs 的 loss 越低 |
| **Chinchilla Method 1/3** | Chinchilla paper 中兩種估計 optimal N/D 的方法；Tatsu 認為是「least reliable」的方法，但 MiniCPM 重現得不錯 |
| **Nonembedding FLOPs** | DeepSeek 用來 fit scaling laws 的計算量單位；排除 embedding 部分以更準確反映 transformer 計算成本 |
| **IsoFLOP Analysis** | 固定 FLOPs，掃描不同 N/D 組合找最低 loss；Chinchilla 與 LLaMA 3 都用此方法 |
| **Per-parameter Learning Rate** | muP 引入的概念：對不同參數（embedding、residual、matrix、LM head）設定不同的 learning rate scaling |
| **Lion Optimizer** | Sign-based optimizer；精神上類似 Muon；在 muP 設定下會 break scaling assumptions |
| **Decoupled Weight Decay** | Weight decay 與 gradient update 分離的 optimizer 設計；large decoupled weight decay 是 muP 明顯的 failure mode |

---

## 四、重要引用

> "Up until now, most of our discussions is what I would call the classical scaling laws cannon. We talked about Kaplan. We talked about, oh, even Hestnes and then the Chinchilla paper." — Tatsu 定義 Lecture 9 涵蓋的「classical」scaling laws 範圍

> "The number of such papers have decreased in recent years, and most of them have come out of the open-source community in China." — Tatsu 觀察 open-source scaling laws paper 的來源趨勢（MiniCPM、DeepSeek、Hunyuan 等）

> "muP, the whole point of this approach is to say, I want to make sure that my optimal learning rate is the same as I scale up and down." — muP 的設計目標核心

> "WSD learning rate. That's just a very common trick. You should all know about this learning rate. That's a basic thing to know." — Tatsu 把 WSD 列為研究者必備知識

> "I think DeepSeek LLM, even now, is, I think, one of the more nicely executed scaling analyses in the open world." — Tatsu 對 DeepSeek LLM scaling analysis 的高度評價

> "If you do large decoupled weight decay, you end up with significant muP failure. So this is maybe the one stress test that it does fail." — muP 唯一明顯的 failure mode

> "I think the initial presentation of scaling laws makes it sound like a science. It's like, yes, draw this line, do these procedures, and you will know, for sure, what will happen at scale. But I think, in reality, it's a lot more messy and a lot more unknown than that." — Tatsu 對 scaling laws 在 real-world 應用的最終 punchline

> "There's no silver bullet yet. Maybe next year, there will be a module that's like, we solved it, but not quite yet." — Lecture 11 最終結論：沒有銀彈

---

## 五、人物 / 角色分析

**Tatsu Hashimoto**：CS336 共同授課教授，Lecture 11 完全由 Tatsu 主講（Lecture 9 也是）。Tatsu 在 Lecture 11 顯示他對 open-source 社群 scaling analysis 的深度追蹤（MiniCPM、DeepSeek、LLaMA 3、Hunyuan 都點名），以及對 scaling laws 「教科書 vs 實務」落差的第一手觀察。Lecture 11 是 Lecture 9「classical scaling laws」的延伸——把 Kaplan/Chinchilla 的冪律基礎擴展到現代 frontier 模型的 hyperparameter drift 控制。

---

## 六、核心主旨總結

Lecture 11 把 scaling laws 從「教科書的冪律擬合」拉到「2024-2026 open-source frontier 的實務工具組合」。核心 takeaway：muP 透過 scale-aware initialization 把 optimal LR 穩定在 10⁻² 附近；WSD schedule 把 final annealing 變乾淨、讓 Chinchilla analysis 更容易；DeepSeek 用 grid search fit scaling laws 而非 muP；MoE 模型要重新 fit active parameters vs sparsity 的權衡；muP 不是萬靈丹——Lion optimizer 與 large decoupled weight decay 會 break 它。**Scaling laws 在現實中不是科學而是 art**，沒有 silver bullet——muP、scaling law fit、grid search 是工具箱裡的選項，但 extrapolation 永遠有不确定性。

---

## 七、金句摘錄

- "muP, the whole point of this approach is to say, I want to make sure that my optimal learning rate is the same as I scale up and down."
- "WSD learning rate. That's just a very common trick. You should all know about this learning rate."
- "I think DeepSeek LLM, even now, is, I think, one of the more nicely executed scaling analyses in the open world."
- "If you do large decoupled weight decay, you end up with significant muP failure."
- "I think the initial presentation of scaling laws makes it sound like a science... But I think, in reality, it's a lot more messy and a lot more unknown than that."
- "There's no silver bullet yet. Maybe next year, there will be a module that's like, we solved it, but not quite yet."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 4 分 41 秒
> 口播稿原文：transcripts/20260519_StanfordCS336_Lecture11_ScalingLaws_口播稿.txt

- [opus 1.1 MB](../audio/20260519_StanfordCS336_Lecture11_ScalingLaws_口播稿.opus)（Telegram 友善）
- [m4a 4.6 MB](../audio/20260519_StanfordCS336_Lecture11_ScalingLaws_口播稿.m4a)（iOS 友善）
- [mp3 4.4 MB](../audio/20260519_StanfordCS336_Lecture11_ScalingLaws_口播稿.mp3)（通用格式）