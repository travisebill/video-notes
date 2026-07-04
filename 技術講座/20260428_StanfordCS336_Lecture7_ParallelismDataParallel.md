# 【Stanford CS336 Language Modeling from Scratch — Lecture 7：Parallelism — Data Parallel 與 ZeRO】

**主講：Tatsu Hashimoto（Percy Liang 共同授課）｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/SzpOcwdIL0Y
> 影片時長：1 小時 21 分 02 秒（4862s）
> 性質：大學課程第七講 — 從單 GPU 進入多 GPU 程式設計（Data Parallel 主題）
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260428_StanfordCS336_Lecture7_ParallelismDataParallel_逐字稿_en.txt
> **整理日期**：2026-04-07
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Stanford CS336 Lecture 7 延續 Lecture 6 的單 GPU Triton kernel 編程，**正式進入多 GPU 程式設計**。本講聚焦在 **Data Parallel (DP)**——最基本也最常用的平行策略——以及 **ZeRO (Zero Redundancy Optimizer)** 等減少記憶體冗餘的優化。Lecture 7 是 Lecture 8（Tensor/Pipeline Parallel）的基礎：先學會「多個 GPU 各自持有模型副本 + 同步 gradient」，再學「如何把單個模型切到多個 GPU」。

**核心議題一句話**：當模型大到單 GPU 裝不下時，第一個武器是 Data Parallel——每個 GPU 跑同一份模型但處理不同 batch，再 sync gradient；但 DP 會複製 optimizer state 造成記憶體浪費，ZeRO 把 optimizer state / gradient / parameter 分區儲存，把「模型大小 × GPU 數」變成「模型大小 / GPU 數」。

---

## 二、章節脈絡

### Section 1｜開場：為什麼需要 Parallelism（00:00 ~ 08:00）

**重點摘要：** 現代 LLM 規模（70B、405B）已經遠超單 GPU 容量（H100 80GB），必須用多 GPU。

**內容：**
- 70B 模型 fp16 要 ~140GB，單張 H100 80GB 裝不下
- 多 GPU 平行是現代 LLM 訓練的必備技術
- 三種主要平行策略：Data Parallel (DP)、Tensor Parallel (TP)、Pipeline Parallel (PP)

### Section 2｜Data Parallel (DP) 基礎（08:00 ~ 30:00）

**重點摘要：** Data Parallel 是最直觀的平行策略：每個 GPU 持有完整 model copy，分別處理不同 batch。

**內容：**
- **DP 工作流**：每個 GPU 載入完整模型副本 → 處理不同 mini-batch → 計算 local gradient → all-reduce gradient → 每個 GPU 用同步後的 gradient 更新本地參數
- **優勢**：實作簡單、與單 GPU 訓練幾乎相同（只多 all-reduce 通訊）
- **劣勢**：每個 GPU 都要儲存完整模型 + optimizer state（Adam 需要 2x model size 的 optimizer state），記憶體浪費
- **適用場景**：模型 < 單 GPU 容量，但需要更大 effective batch size

### Section 3｜Gradient AllReduce 通訊原語（30:00 ~ 50:00）

**重點摘要：** All-reduce 是 DP 的核心通訊操作，NCCL 提供高效能實作。

**內容：**
- **All-reduce**：每個 GPU 提供一個 tensor，所有 GPU 收到「所有 tensor 的 sum（或 average）」
- **通訊成本**：O(N × GPU 數) for ring all-reduce
- **NCCL**：NVIDIA Collective Communications Library，提供 ring / tree / butterfly 等 all-reduce 演算法
- **Communication vs Computation overlap**：在 backward pass 計算時，同步進行下一個 forward 的 all-reduce，提升硬體利用率

### Section 4｜ZeRO (Zero Redundancy Optimizer)（50:00 ~ 75:00）

**重點摘要：** ZeRO 把 optimizer state / gradient / parameter 在多 GPU 間分區，消除冗餘。

**內容：**
- **Stage 1 - Optimizer State Partitioning（P_os）**：把 Adam 的兩個狀態（momentum + variance）分到 N 個 GPU，每個 GPU 只持有 1/N
  - 記憶體節省：2x → 2x/N
- **Stage 2 - Gradient Partitioning（P_g）**：gradient 也分到 N 個 GPU
  - 記憶體節省：再多 1x → 1x/N
- **Stage 3 - Parameter Partitioning（P_p）**：parameter 也分區
  - 記憶體節省：總計每個 GPU 只需 ~1/N 的全部狀態
  - 但每次 forward / backward 需要 all-gather 參數
- **ZeRO-Offload**：把 optimizer state 卸載到 CPU memory，進一步節省 GPU 記憶體
- **ZeRO-Infinity**：卸載到 NVMe，訓練 > 32B 參數的模型

### Section 5｜FSDP（Fully Sharded Data Parallel）（75:00 ~ 80:00）

**重點摘要：** PyTorch 對 ZeRO Stage 3 的官方實作，現在已是大型模型訓練的主流。

**內容：**
- **FSDP vs DDP**：FSDP 是 ZeRO Stage 3 + 自動參數分區，DDP 是 DP（無分區）
- **使用方式**：`model = FSDP(model, sharding_strategy=ShardingStrategy.FULL_SHARD)`
- **優勢**：透明 API，向後相容 DDP

### Section 6｜下週預告：Tensor/Pipeline Parallel（80:00 ~ 81:02）

**重點摘要：** 當模型大到連 ZeRO 都裝不下時，下週進入 TP/PP 把單個模型切到多個 GPU。

**內容：**
- Lecture 8 將涵蓋 tensor parallel（切單個 tensor）+ pipeline parallel（切 layers）+ sequence parallel
- 3D Parallelism：DP + TP + PP 組合

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Data Parallel (DP)** | 每個 GPU 持有完整模型副本，分別處理不同 mini-batch，sync gradient |
| **AllReduce** | 集合通訊原語：每個 GPU 提供 tensor，所有 GPU 收到聚合結果（sum / average） |
| **NCCL** | NVIDIA Collective Communications Library；提供高效能 all-reduce / all-gather / reduce-scatter |
| **ZeRO Stage 1** | Optimizer state partitioning；每個 GPU 只持有 1/N 的 Adam states |
| **ZeRO Stage 2** | + Gradient partitioning；每個 GPU 只持有 1/N 的 gradient |
| **ZeRO Stage 3** | + Parameter partitioning；每個 GPU 只持有 1/N 的 parameter（forward/backward 時 all-gather） |
| **FSDP** | Fully Sharded Data Parallel；PyTorch 對 ZeRO Stage 3 的官方實作 |
| **ZeRO-Offload** | 把 optimizer state 卸載到 CPU memory |
| **ZeRO-Infinity** | 卸載到 NVMe；訓練 > 32B 參數的模型 |

---

## 四、重要引用

> "Data Parallel is the simplest form of multi-GPU training — every GPU holds a complete copy of the model, but processes a different mini-batch." — 教科書定義

> "ZeRO Stage 3 trades communication for memory: you shard parameters across GPUs and all-gather them on demand." — Tatsu 解釋 ZeRO Stage 3 的核心 trade-off

> "FSDP is the production-ready implementation of ZeRO Stage 3 in PyTorch." — Tatsu 推薦的 modern PyTorch 介面

---

## 五、人物 / 角色分析

**Tatsu Hashimoto**：CS336 共同授課教授，本講延續 Lecture 5-6 的 systems 主軸。Lecture 7-8 是 Tatsu 主講的「連續四堂 systems」最後兩堂（與 Lecture 6 一起共四堂）。

---

## 六、核心主旨總結

CS336 Lecture 7 從「為什麼需要 parallelism」開始，建立 Data Parallel 的工作流（每個 GPU 持完整模型 + sync gradient），再深入 ZeRO 三個 stage 如何分區 optimizer state / gradient / parameter，最後展示 FSDP 作為 PyTorch 官方 ZeRO Stage 3 實作。下週 Lecture 8 進入更進階的 TP/PP，把單個模型切到多個 GPU。

---

## 七、金句摘錄

- "Every GPU holds a complete copy of the model, but processes a different mini-batch."
- "ZeRO Stage 3 trades communication for memory."
- "FSDP is the production-ready implementation of ZeRO Stage 3 in PyTorch."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260428_StanfordCS336_Lecture7_ParallelismDataParallel_口播稿.txt

- [opus X.X MB](../audio/20260428_StanfordCS336_Lecture7_ParallelismDataParallel_口播稿.opus)
- [m4a X.X MB](../audio/20260428_StanfordCS336_Lecture7_ParallelismDataParallel_口播稿.m4a)
- [mp3 X.X MB](../audio/20260428_StanfordCS336_Lecture7_ParallelismDataParallel_口播稿.mp3)