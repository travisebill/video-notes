# 【Stanford CS336 Language Modeling from Scratch — Lecture 4: Attention Alternatives & Mixture of Experts】

**主講：Tatsu Hashimoto｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/cKSwj_qZ8Jg
> 影片時長：1 小時 26 分 20 秒（5180s）
> 性質：大學課程第四講 — 注意力替代方案 + MoE
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260415_StanfordCS336_Lecture4_AttentionAlternatives_逐字稿.txt
> **整理日期**：2026-04-07
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

CS336 第四講延續 Tatsu 上一講的架構主題,深入兩個進階主題:**Attention Alternatives(線性注意力、Mamba、Gated DeltaNet)** 與 **Mixture of Experts(MoE)**。開場 Tatsu 強調 people want longer context length——agentic coding、多輪對話、長文件處理都推動 context 需求爆炸。但 softmax attention 是 O(n²),sequence 越長成本越高,所以業界嘗試各種「線性時間 attention」方案;然而**沒有任何純線性方案在 scale 上被證明 work**——所有大規模成功的方案都是 hybrid(混合 softmax + 線性)。

MoE 部分,Tatsu 用一句話總結:「**MoE 是更高效的 MLP**」——把一個大 FFN 切成 N 個小 FFN,router 動態選 K 個,active parameters 維持小但 total parameters 大幅增加,等於「free win」——同樣 FLOPs 下模型更強。重點是如何 train MoE,因為 router 不可微分,需要 load balancing loss 等啟發式技巧避免「expert collapse」(少數 expert 拿走所有 token)。

**核心議題一句話**:Linear attention 仍未在 scale 上 standalone work——目前實戰都是「7:1 hybrid」(七層 linear + 一層 softmax)。MoE 是「用 FLOPs 換 parameters」的最重要技巧,但訓練時必須用 load balancing loss 防止 expert collapse,且 DeepSeek V3 等前沿模型仍依賴這套啟發式損失——「沒有 silver bullet,只有 carefully tuned heuristics」。

---

## 二、章節脈絡

### Section 1｜開場:為什麼要改 attention（00:00 ~ 10:00）

**重點摘要:** Context length 需求爆炸;softmax attention 是 O(n²),線性方案需求明確但 scale 上尚未 standalone work。

**內容:**
- 人們想要更長 context——agentic coding、multi-turn dialogue、長文件
- 標準 softmax attention 對 n tokens 計算量 O(n²)
- 業界嘗試把 attention 改成 O(n) 線性時間
- **現實**:沒有任何純線性方案在 frontier scale 證明 standalone work
- 所有大規模成功的方案都是 **hybrid**(linear + softmax 混合)

---

### Section 2｜Linear Attention:基本公式與限制（10:00 ~ 25:00）

**重點摘要:** Linear attention 用 kernel trick 把 softmax 換成 element-wise,計算量 O(n),但表達力下降。

**內容:**
- 標準 softmax attention:softmax(QK^T)V
- Linear attention:用 kernel ϕ 把 softmax(QK^T) 換成 ϕ(Q) ϕ(K)^T,然後矩陣乘法結合律 → **ϕ(Q) (ϕ(K)^T V)** 先算右側,O(n)
- 問題:沒有 softmax 的「尖峰銳化」,attention scores 變得太平滑
- MiniMax M1:7:1 hybrid(7 層 linear + 1 層 softmax)——大規模仍需要 softmax
- 結論:**linear 必須搭 softmax**,純線性方案在 frontier 規模失效

---

### Section 3｜Mamba 與 State Space Models（25:00 ~ 45:00）

**重點摘要:** Mamba 2 = linear attention + input-dependent gate γ_t,允許 RNN 與 parallel 形式互換。

**內容:**
- Mamba 家族(Albert Gu + Tri Dao):state space models
- Mamba 2 的核心 = linear attention + **gate γ_t**(input-dependent,不是 state-dependent)
- γ_t 決定「要保留多少 state 到下一步」——受 LSTM 啟發
- γ_t 不依賴 state → **parallel 與 recurrent 形式 duality**
- 訓練用 parallel form(快);inference 用 recurrent form(節省 KV cache)
- **NeMo Tron 3**:用 Mamba 2 + softmax attention 交替,large context 下 throughput 很好
- vs Qwen 3 Thinking、GPT-OSS 效能有競爭力

> "As long as you're gating the various terms in your RNN with only input-dependent terms... you'll still have this fairly nice duality."

---

### Section 4｜Gated DeltaNet:LSTM 風格的雙 gate（45:00 ~ 70:00）

**重點摘要:** Gated DeltaNet = Mamba 2 + 第二個 gate β_t(類似 LSTM 的 input gate),Qwen 3.5 scale up 驗證有效。

**內容:**
- β_t 是「no input gate」——若 β_t = 0,當前 token 不寫入 state
- 與 Mamba 2 對比:**兩個 gate**(γ forget gate + β input gate),與 LSTM 設計哲學一致
- **DeltaNet 獨特之處**:update 不是簡單 1 - β_t,而是「投影掉當前 key 方向」——避免重複寫入
- Qwen 3.5 大規模 scale up 驗證 Gated DeltaNet 在 production 可用
- 推理時仍維持 parallel/recurrent duality

---

### Section 5｜MoE 是什麼:「更高效的 MLP」（70:00 ~ 90:00）

**重點摘要:** MoE 把一個 FFN 切成 N 個小 FFN,router 動態選 K,active params 少但 total params 多——同 FLOPs 下更強。

**內容:**
- **直覺**:把一個大 FFN 切成 4 個相同大小的 FFN,router 決定用哪一個
- 每個 forward/backward 只用 1 個 FFN(成本不變),但 total parameters 4 倍
- **為什麼流行**:保持 total compute 不變,只增加 sparse parameters,模型明顯更強
- Fedus et al. 2022(Switch Transformer):experts 越多 → test loss 越低
- Olmo paper:同樣 training compute,MoE 訓練時間約 2× 快於 dense
- DeepSeek V2 是 dense → MoE 的典範轉移,active parameters 更少但 MMLU 更強

> "You want to increase parameters without affecting your flops."

---

### Section 6｜Routing:Top-K 是業界共識（90:00 ~ 130:00）

**重點摘要:** Top-K router(內積分數 + softmax)是業界事實標準;DeepSeek MoE 加入 shared experts 進一步優化。

**內容:**

| Routing 方案 | 機制 | 使用案例 |
|-------------|------|---------|
| **Top-K (inner product)** | 每個 expert 一個 weight vector,softmax 取分數最高的 K 個 | Switch Transformer、GShard、Grok、Mistral、DeepSeek(DBRX 等) |
| **Hash-based** | 用 hash 函數隨機分派 token 到 expert | 早期 baseline,deployment 罕用 |
| **RL 學 routing** | 把 router 當 policy,bandit/RL 算法學 | Bengio 2013,啟發性大但 overhead 過高 |
| **Linear assignment** | 全域計算 assignment score,精確解 linear assignment | 未在 scale 上驗證,計算太貴 |

- **DeepSeek MoE 創新**:shared experts(永遠啟動的 expert,bypass router)+ routed experts
- 把大 expert 切成更小、更 fine-grained,並保留一個 shared expert 處理通用模式
- Ablation:more experts + shared experts 都顯著提升效能,TriviaQA、NQ 等任務特別明顯

---

### Section 7｜Expert Parallel:多一個平行化維度（130:00 ~ 150:00）

**重點摘要:** MoE 提供 expert parallel——把不同 expert 放不同 device,token 透過 router 分派。

**內容:**
- 與 data / tensor / pipeline parallel 並列,expert parallel 是第四個平行化軸
- 每個 expert 是天然的 chunk,自然可以分到不同 device
- **Trade-off**:得到更多 aggregate FLOPs、降低 memory,but **pay for communication**(activation 在 device 間傳輸)
- 是否 net win 取決於 topology 與 workload 設計

---

### Section 8｜Load Balancing:防止 Expert Collapse（150:00 ~ 220:00）

**重點摘要:** MoE 訓練必須加 auxiliary load balancing loss,防止少數 expert 拿走所有 token。

**內容:**
- **Expert collapse 問題**:Router 用 gradient descent 會「rich gets richer」——被選中的 expert 拿到更多 gradient → 權重變強 → 更容易被選中 → 跑贏全部
- **Switch Transformer 的 auxiliary loss**:L = F × P(F = fraction of tokens、 P = total probability mass)
  - 直觀理解:對熱門 expert 施加負 gradient,推下 probability mass
  - 雖不是 first-principles 推導,但「penalty proportional to fraction」邏輯清晰
- **DeepSeek 增強**:除了 per-expert balance,還加 **per-device balance**(讓每張 device 滿載)
- **DeepSeek V3**:用 per-expert bias term + online learning trick 取代部分 auxiliary loss,但仍需 balance loss 防 extreme imbalance
- **Olmo paper ablation**:移除 load balancing loss → loss 顯著上升、expert utilization 崩盤(幾乎所有 token 跑到 2 個 expert)
- 結論:**load balancing loss 是必要之惡**——目前沒有 fully differentiable 的替代方案

> "Without load balancing, you've thrown away a ton of parameters. Those experts are doing absolutely nothing for most of training."

---

### Section 9｜中國 MoE 生態系（220:00 ~ 結束）

**重點摘要:** Qwen、DeepSeek、MiniCPM 等中國團隊是 MoE 研究的領頭羊;西方 open-source MoE release 較少。

**內容:**
- Qwen 1.5 MoE 是早期成功案例——2.7B active parameters 超越許多 7B dense
- DeepSeek MoE 系列持續引領架構與訓練創新
- MiniCPM 等團隊也早期投入 MoE
- 西方 open-source:Llama 4、GPT-OSS(兩個高品質 MoE)
- 但整體而言**西方 open-source MoE 進展放緩**

---

## 三、關鍵概念定義

| 概念 | 定義 | 本講脈絡 |
|------|------|---------|
| **Linear Attention** | 用 kernel trick 把 softmax(QK^T)V 改成 O(n) | 表達力下降,scale 上不 standalone work |
| **Hybrid Attention** | 7:1 等比例混合 linear + softmax | MiniMax M1 等大規模實證可行 |
| **Mamba 2** | Linear attention + input-dependent gate γ_t | parallel/recurrent duality |
| **Gated DeltaNet** | Mamba 2 + 第二個 input gate β_t | Qwen 3.5 scale up 驗證 |
| **MoE (Mixture of Experts)** | 把 FFN 切成 N 個小 FFN,router 選 K 個 | 同 FLOPs 下更強,active params 少 |
| **Top-K Router** | Inner product 分數 + softmax,取 K 個最高 | 業界事實標準 |
| **Shared Experts** | DeepSeek 創新:bypass router 的常駐 expert | 處理通用模式 |
| **Expert Parallel** | 把不同 expert 放不同 device,token 路由 | 第四個平行化軸 |
| **Expert Collapse** | 少數 expert 拿走所有 token,其他廢掉 | 主要訓練問題 |
| **Load Balancing Loss** | F × P auxiliary loss,推下熱門 expert 的 gradient | Switch Transformer 標準做法 |
| **Per-Device Balance** | 不只平 expert,也平 device utilization | DeepSeek 強化 |

---

## 四、人物 / 角色分析

| 人物 / 團隊 | 角色 | 背景 |
|-------------|------|------|
| **Tatsu Hashimoto** | 主講 | CS336 共同授課 |
| **Albert Gu + Tri Dao** | Mamba 系列作者 | state space models 代表人物 |
| **MiniMax** | MiniMax M1 開發者 | 7:1 hybrid attention 實證 |
| **DeepSeek 團隊** | MoE 創新者 | shared experts、device balance |
| **Qwen 團隊** | 中國 MoE 推手 | Qwen 3.5 Gated DeltaNet 驗證 |
| **Olmo (AI2)** | 西方 MoE 研究 | 嚴謹 ablation 驗證 load balancing 必要性 |
| **Fedus et al. 2022** | Switch Transformer 作者 | MoE 在 scale 上的奠基 paper |
| **Llama 4 / GPT-OSS** | 西方 open-source MoE | 兩個高品質案例 |

---

## 五、核心主旨總結

Linear attention 在 frontier scale 上仍**無法 standalone work**——所有大規模方案都是 hybrid(線性 + softmax 混合)。Mamba 2 與 Gated DeltaNet 用 input-dependent gate 解決「何時保留 state、何時忘記」問題,並維持 parallel/recurrent duality,讓訓練與 inference 都能高效進行。

MoE 是現代 LLM 的「**更高效 MLP**」——active parameters 保持小但 total parameters 數倍增加,同 FLOPs 下模型明顯更強。Top-K routing + shared experts 是業界事實標準,但訓練時必須加 load balancing loss 防止 expert collapse。DeepSeek V3 等前沿模型仍依賴這套啟發式,**沒有 silver bullet**——只有 carefully tuned heuristics。

---

## 六、金句摘錄

> "As long as you're gating the various terms in your RNN with only input-dependent terms... you'll still have this fairly nice duality."

> "You want to increase parameters without affecting your flops."

> "Without load balancing, you've thrown away a ton of parameters. Those experts are doing absolutely nothing for most of training."

> "The only thing that matters in some sense is FLOPs."(從 Lecture 3 持續)

> "This is the kind of pretty surprising... you've got this thing that's non-differentiable... and all you really need to do is to just add this balancing loss."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260415_StanfordCS336_Lecture4_AttentionAlternatives_口播稿.txt

- [opus X.X MB](../audio/20260415_StanfordCS336_Lecture4_AttentionAlternatives.opus)（Telegram 友善）
- [m4a X.X MB](../audio/20260415_StanfordCS336_Lecture4_AttentionAlternatives.m4a)（iOS 友善）
- [mp3 X.X MB](../audio/20260415_StanfordCS336_Lecture4_AttentionAlternatives.mp3)（通用格式）