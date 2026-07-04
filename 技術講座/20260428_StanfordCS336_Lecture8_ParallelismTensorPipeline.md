# 【Stanford CS336 Language Modeling from Scratch — Lecture 8：Parallelism — Tensor、Pipeline 與 3D Parallelism】

**主講：Tatsu Hashimoto（Percy Liang 共同授課）｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/6-cXp-aOmdg
> 影片時長：1 小時 20 分 10 秒（4810s）
> 性質：大學課程第八講 — 當模型大到 ZeRO 也裝不下時，切單個模型到多 GPU
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260428_StanfordCS336_Lecture8_ParallelismTensorPipeline_逐字稿_en.txt
> **整理日期**：2026-04-07
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Lecture 8 是 Lecture 7 的延伸——當 Data Parallel + ZeRO 都裝不下模型時（ZeRO Stage 3 把參數分區，但 activation 仍要儲存完整 forward 結果），需要把**單個模型本身切到多個 GPU**。本講涵蓋三種主要策略：**Tensor Parallel (TP)**、**Pipeline Parallel (PP)**、**Sequence Parallel (SP)**，以及它們組合成 **3D Parallelism** 的實務模式。

**核心議題一句話**：TP 把單個 tensor 切到多 GPU，PP 把模型 layers 切到多 GPU 形成 pipeline，SP 沿 sequence 維度切 activation；實務上 70B+ 模型幾乎都跑 3D Parallelism（DP + TP + PP 組合），而 Megatron-LM / DeepSpeed 是兩大主流 framework。

---

## 二、章節脈絡

### Section 1｜開場：當 ZeRO 也不夠時（00:00 ~ 08:00）

**重點摘要：** ZeRO Stage 3 把參數 / gradient / optimizer state 分區，但 forward 仍要儲存完整 activation，這個記憶體瓶頸需要 TP/PP 解決。

**內容：**
- 405B 模型即使 ZeRO Stage 3 也裝不下 8 張 H100
- Activation memory 是瓶頸：每個 layer 的 forward 結果都要存到 backward 用
- TP / PP / SP 三種策略各自攻不同的記憶體維度

### Section 2｜Tensor Parallel (TP)（08:00 ~ 30:00）

**重點摘要：** TP 把單個 tensor（通常是 matmul 的 weight matrix）切到多個 GPU。

**內容：**
- **Column Parallel**：把 weight matrix 沿 output 維度切到 N 個 GPU
  - 每個 GPU 算 partial matmul → all-gather → 完整輸出
- **Row Parallel**：把 weight matrix 沿 input 維度切到 N 個 GPU
  - 每個 GPU 算 partial matmul → all-reduce
- **Transformer Block 的 TP**：attention 用 column parallel，FFN 用 row parallel
- **通訊成本**：每個 transformer layer 需要 4 次 all-reduce

### Section 3｜Pipeline Parallel (PP)（30:00 ~ 50:00）

**重點摘要：** PP 把模型 layers 切到多個 GPU，每個 GPU 持有連續 layers。

**內容：**
- **Pipeline bubble**：pipeline 啟動 / 結束時部分 GPU 閒置，造成 throughput 損失
- **Micro-batching**：把 batch 切成多個 micro-batch，提升 pipeline utilization
- **GPipe**：第一個實用的 pipeline parallel framework
- **PipeDream**：異步 pipeline，犧牲一部分正確性換 throughput
- **1F1B schedule**：one forward one backward，交錯執行減少 bubble

### Section 4｜Sequence Parallel (SP)（50:00 ~ 60:00）

**重點摘要：** SP 沿 sequence 維度切 activation，與 TP 互補。

**內容：**
- SP 切 LayerNorm / Dropout 這類 sequence-wise operation
- 與 TP 結合：TP 切 weight，SP 切 activation
- DeepSpeed Ulysses 的 sequence parallel 設計

### Section 5｜3D Parallelism 組合（60:00 ~ 75:00）

**重點摘要：** 實務上 70B+ 模型都跑 DP + TP + PP 組合。

**內容：**
- **典型 70B 配置**：TP=8 + PP=2 + DP=8（總 128 GPUs）
- **Megatron-LM**：NVIDIA 主流框架，原生支援 TP + PP
- **DeepSpeed**：Microsoft 框架，支援 ZeRO + TP + PP
- **選擇 trade-off**：TP 通訊頻繁但 bubble 小；PP bubble 大但通訊少

### Section 6｜Activation Recomputation（75:00 ~ 78:00）

**重點摘要：** Activation 記憶體的另一個解法：recompute（又稱 gradient checkpointing）。

**內容：**
- 重新計算某些 layer 的 forward，放棄儲存 activation
- 記憶體換計算：trade memory for compute
- 與 TP/PP 互補：即使切模型，activation 仍可能過多

### Section 7｜Q&A 與下週預告（78:00 ~ 80:10）

**重點摘要：** 預告下週 Lecture 9 進入 Scaling Laws。

**內容：**
- Scaling Laws 是現代 LLM 訓練的關鍵設計指南
- Chinchilla 重新定義了「最佳模型大小 vs 訓練 tokens」的比例

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Tensor Parallel (TP)** | 把單個 weight matrix 切到多個 GPU；column parallel + row parallel 兩種模式 |
| **Pipeline Parallel (PP)** | 把模型 layers 切到多個 GPU；形成 pipeline 但有 bubble 問題 |
| **Sequence Parallel (SP)** | 沿 sequence 維度切 activation；與 TP 互補 |
| **3D Parallelism** | DP + TP + PP 三種策略的組合；70B+ 模型的標準配置 |
| **Pipeline bubble** | Pipeline 啟動 / 結束時部分 GPU 閒置造成的 throughput 損失 |
| **Micro-batching** | 把 batch 切成多個 micro-batch，提升 pipeline utilization |
| **1F1B schedule** | one forward one backward；交錯執行減少 bubble |
| **Megatron-LM** | NVIDIA 主流 TP + PP framework |
| **DeepSpeed** | Microsoft framework；ZeRO + TP + PP 整合 |
| **Activation Recomputation** | 重新計算 forward，放棄儲存 activation；trade memory for compute |

---

## 四、重要引用

> "TP splits a single tensor across GPUs; PP splits layers across GPUs; SP splits activations along the sequence dimension." — Tatsu 區分三種策略的 axis

> "Pipeline bubble is the tax you pay for splitting layers — some GPUs are idle during startup and drain." — Tatsu 解釋 PP 的核心 cost

> "3D Parallelism is the production reality for 70B+ models: TP=8 + PP=2 + DP=8 on 128 GPUs is a typical config." — Tatsu 給出實務配置

---

## 五、人物 / 角色分析

**Tatsu Hashimoto**：CS336 共同授課教授，Lecture 5-8 systems 主軸的 instructor。Lecture 8 是 Tatsu 主講的 systems 系列最後一堂，下週 Lecture 9 (Scaling Laws) 開始進入 Percy 主講的「設計權衡」主題。

---

## 六、核心主旨總結

CS336 Lecture 8 把多 GPU 程式設計從「Data Parallel 切資料」推進到「切模型」——TP 切 weight、PP 切 layers、SP 切 activation。實務上 70B+ 模型跑 3D Parallelism（DP + TP + PP），而 Megatron-LM / DeepSpeed 是兩大主流 framework。Activation recomputation 是另一個 trade memory for compute 的工具。

---

## 七、金句摘錄

- "TP splits a single tensor across GPUs; PP splits layers across GPUs; SP splits activations along the sequence dimension."
- "Pipeline bubble is the tax you pay for splitting layers."
- "3D Parallelism is the production reality for 70B+ models."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260428_StanfordCS336_Lecture8_ParallelismTensorPipeline_口播稿.txt

- [opus X.X MB](../audio/20260428_StanfordCS336_Lecture8_ParallelismTensorPipeline_口播稿.opus)
- [m4a X.X MB](../audio/20260428_StanfordCS336_Lecture8_ParallelismTensorPipeline_口播稿.m4a)
- [mp3 X.X MB](../audio/20260428_StanfordCS336_Lecture8_ParallelismTensorPipeline_口播稿.mp3)