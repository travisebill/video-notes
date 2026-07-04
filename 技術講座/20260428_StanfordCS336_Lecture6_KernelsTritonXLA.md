# 【Stanford CS336 Language Modeling from Scratch — Lecture 6：Kernels、Triton 與 XLA】

**主講：Tatsu Hashimoto（Percy Liang 共同授課，Marcel 助教程式）｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/xnDHaNUvHBg
> 影片時長：1 小時 26 分 41 秒（5201s）
> 性質：大學課程第六講 — 從 GPU 概論深入到 Triton kernel 編程實作
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260428_StanfordCS336_Lecture6_KernelsTritonXLA_逐字稿_en.txt
> **整理日期**：2026-04-07
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Stanford CS336「Language Modeling from Scratch」Lecture 6 由 **Tatsu Hashimoto** 單獨主講（Lecture 5 也是），聚焦在 **GPU kernel 編程的實作細節**，特別是 **Triton** 語言——Stanford CS336 團隊推薦的 Pythonic kernel 編程框架。本講從 GPU 硬體 hierarchy 開始，建立 shared memory / registers / L1/L2 cache / HBM 的容量-頻寬權衡觀念，再深入 Triton 的 thread block 編程模型、tiling 技巧、matmul 範例，最後討論 Triton 的替代方案（PTX、ThunderKittens、CUTE）與個別處理 vs 批次處理的權衡。

**核心議題一句話**：現代 GPU kernel 編程不是 CUDA 的專利——Triton 用 Pythonic 抽象把 thread block / shared memory / tiling 這些 CUDA 細節自動處理掉，讓研究者聚焦在演算法層級的權衡；但你仍然要懂 memory hierarchy 的容量-頻寬 trade-off，才能寫出真正高效的核心。

---

## 二、章節脈絡

### Section 1｜開場與 Lecture 5 複習（00:00 ~ 05:00）

**重點摘要：** 從 Lecture 5 GPU/TPU 概論過渡到 Triton 實作。本週 Lecture 6 與下週 Lecture 7 是 Lecture 5 的延伸——Lecture 6 講單 GPU 的 kernel 編程（Triton + benchmarking），Lecture 7 講多 GPU 程式設計。

**內容：**
- Lecture 5 講了 GPU 高階概覽、roofline model、Flash Attention 等
- Lecture 6 重點：深入寫 Triton kernels、做 benchmarking + profiling
- 下週 Lecture 7：多 GPU 程式設計

### Section 2｜GPU Architecture 深入：Memory Hierarchy（05:00 ~ 25:00）

**重點摘要：** 重新檢視 GPU memory hierarchy，建立容量-頻寬反比的設計權衡觀念。

**內容：**
- **SM（Streaming Multiprocessor）**：GPU 的基本運算單元，約 100-200 個 SMs
  - NVIDIA A100 → H100 → B200 演進，SM 數量沒變多（但每個 SM 變強）
  - 每個 SM 內有 ~65K registers（B200）、L1 cache + shared memory（同一塊記憶體的不同 view）
- **Memory Hierarchy（由小到大、由快到慢）**：
  - **Registers**：最 fast，每個 SM ~65K
  - **L1 cache**：per SM，與 shared memory 同硬體但不能控制
  - **L2 cache**：整個 chip 共享，比 L1 大、比 HBM 快
  - **HBM（High Bandwidth Memory）**：GPU 主記憶體，容量最大（GB 等級）但最慢
- **頻寬 vs 容量的反比**：size 越大，bandwidth 越慢
  - HBM 8 TB/s 雖最慢，但仍是高速記憶體
- **Shared Memory vs L1**：同一塊硬體，但你可以控制 shared memory 的使用方式

### Section 3｜為什麼選 Triton（25:00 ~ 30:00）

**重點摘要：** Triton 是一種 Pythonic kernel 編程語言，由訓練 transformer 的人設計——對 transformer 相關運算特別友善。

**內容：**
- **Triton 的設計哲學**：「Triton was built by people who train transformers」
  - 任何涉及 transformer 的運算，Triton 都會比通用 DSL 更容易
  - 由 deep learning 研究者設計，不是系統程式設計師
- **Triton vs CUDA**：Triton 自動處理 thread block 配置、shared memory 管理
  - CUDA 需要 manual thread block 設計 + shared memory 同步
  - Triton 讓你專注在「做什麼」而不是「怎麼做」
- **可選的 extreme**：PTX（NVIDIA 的 assembly）給極致效能但極難寫

### Section 4｜Triton Kernel 編程範例：由簡入深（30:00 ~ 70:00）

**重點摘要：** 五個由簡到難的 kernel 範例，展示 Triton 如何從 element-wise 一路到 matmul。

**內容：**
- **範例 1 — Element-wise**：最基本的 kernel，每個 thread 處理一個元素
  - 不需要 shared memory 同步
  - 純粹從 HBM 讀 → 計算 → 寫回 HBM
- **範例 2 — Reduction over a row**：把一列元素 reduce 成一個值
  - 需要 thread block 內的同步
  - 開始用到 shared memory 暫存部分結果
- **範例 3 — Reduction（不只 over a row）**：跨多列的 reduction
  - 更複雜的 thread block 配置
  - 開始討論 occupancy（每個 SM 能同時跑幾個 thread block）
- **範例 4 — Baby Tiling**：第一次引入 tile 概念
  - 把矩陣切成小塊，配合 shared memory 提升 cache locality
  - 為 matmul 做準備
- **範例 5 — Matmul（Canonical Example）**：the canonical tiling example
  - Inner tile：放進 shared memory 重複使用
  - Outer tile：跨 thread blocks 分配工作
  - 雙層 tiling 是高效 matmul 的標準模式

### Section 5｜Shared Memory vs Registers 同步策略（70:00 ~ 80:00）

**重點摘要：** 顯式同步 threads 的時機與策略，shared memory 是關鍵工具。

**內容：**
- **何時需要顯式同步**：當多個 thread blocks 需要讀同一塊 shared memory 時
- **設計模式**：把 computation 拆解成「從 shared memory 讀 → 計算 → 寫回 HBM」的迴圈
- **進階範例**：
  - Element-wise（最簡單）
  - Reduction over a row
  - Reduction（多列）
  - Baby tiling
  - Matmul（canonical）

### Section 6｜單 GPU 程式設計小結 + 下週預告（80:00 ~ 82:00）

**重點摘要：** 複習單 GPU 的 kernel 編程要點，預告下週進入多 GPU。

**內容：**
- 五個範例的難度遞增展示了 Triton 的核心抽象
- 下週 Lecture 7：multi-GPU programming

### Section 7｜Q&A：Triton 替代方案 + 處理策略（82:00 ~ 86:41）

**重點摘要：** 兩個 Q&A 觸及 Triton alternatives 與「批次 vs 個別」處理權衡。

**內容：**
- **Q1：Triton 之外還有什麼 kernel 編程選項？**
  - A: PTX（NVIDIA assembly，極致效能但極難）
  - ThunderKittens、CUTE 等其他 DSL
  - 每個語言有不同 inductive bias，沒有絕對好壞
- **Q2：高維 tensor 應該一次 load 全部，還是分批處理？**
  - A: 沒有 abstract 答案，看 computation 性質
  - 建議 offline 討論

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **SM（Streaming Multiprocessor）** | NVIDIA GPU 的基本運算單元；每個 SM 包含 ~65K registers、L1 cache、shared memory。約 100-200 SMs per chip（A100/H100/B200） |
| **HBM（High Bandwidth Memory）** | GPU 主記憶體；容量最大（GB 等級），頻寬 8 TB/s，頻寬-容量反比 trade-off 的最慢端 |
| **L1 / L2 Cache** | L1 per SM（與 shared memory 共用硬體），L2 整個 chip 共享；介於 registers 與 HBM 之間的中介層 |
| **Shared Memory** | 與 L1 共用硬體，但**程式設計師可以控制**；用於 thread block 內的資料共享與同步 |
| **Triton** | Pythonic GPU kernel 編程語言；由訓練 transformer 的人設計，對 transformer 相關運算特別友善 |
| **Thread Block** | CUDA/Triton 的基本平行單位；多個 threads 組成、可共享 shared memory |
| **Tiling** | 把大矩陣切成小塊（tiles），配合 shared memory 提升 cache locality；高效 matmul / conv 的標準模式 |
| **Matmul Tiling** | 把 matmul 拆成 inner tile（放 shared memory 重複使用）+ outer tile（跨 thread blocks 分配） |
| **Occupancy** | 每個 SM 同時能跑幾個 thread blocks；取決於 register、shared memory 用量 |
| **PTX** | NVIDIA 的 assembly-level 指令集；極致效能但極難寫，是 Triton 的「最終逃生口」 |
| **ThunderKittens / CUTE** | 其他 GPU kernel DSL；各有不同 inductive bias |

---

## 四、重要引用

> "registers are very fast, L1 is slightly less fast, L2 is less fast, and high bandwidth memory is the slowest. Although eight terabytes a second is still not that slow." — Tatsu Hashimoto 描述 GPU memory hierarchy 的速度梯度與「HBM 雖最慢但仍是高速記憶體」的權衡觀

> "Triton was built by people who train transformers. So anything involving transformers, I think it's going to be relatively easy there." — Tatsu 解釋為什麼選 Triton 而不是其他 DSL；innovative inductive bias

> "matmul is the canonical example where you actually do tiling." — Tatsu 在 tiling 章節的核心論述；matmul tiling 是高效 GPU kernel 的「教科書範例」

> "every language has an inductive bias... makes certain things easier and certain things harder." — Tatsu 在 Q&A 回答 Triton alternatives；語言選擇沒有 free lunch

---

## 五、人物 / 角色分析

**Tatsu Hashimoto**：CS336 共同授課教授（與 Percy Liang），負責 architectures / scaling / **systems** 三大主題。本講完全由 Tatsu 主講（Lecture 5 也是），顯示他是 CS336 systems 部分的 primary instructor。Lecture 6 是 Tatsu 主講的「連續三堂」（L5 GPU/TPU → L6 Triton → L7 多 GPU）。

---

## 六、核心主旨總結

CS336 Lecture 6 把「GPU kernel 編程」這件事拉到**研究者的視角**：Triton 把 CUDA 的 thread block / shared memory / tiling 抽象成 Pythonic 操作，讓研究者不用管 hardware-specific 細節；但仍要懂 memory hierarchy 的容量-頻寬權衡（registers vs L1 vs L2 vs HBM），才能寫出真正高效的核心。下週 Lecture 7 進入 multi-GPU programming。

---

## 七、金句摘錄

- "Triton was built by people who train transformers. So anything involving transformers, I think it's going to be relatively easy there."
- "matmul is the canonical example where you actually do tiling."
- "every language has an inductive bias... makes certain things easier and certain things harder."
- "registers are very fast, L1 is slightly less fast, L2 is less fast, and high bandwidth memory is the slowest. Although eight terabytes a second is still not that slow."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260428_StanfordCS336_Lecture6_KernelsTritonXLA_口播稿.txt

- [opus X.X MB](../audio/20260428_StanfordCS336_Lecture6_KernelsTritonXLA_口播稿.opus)（Telegram 友善）
- [m4a X.X MB](../audio/20260428_StanfordCS336_Lecture6_KernelsTritonXLA_口播稿.m4a)（iOS 友善）
- [mp3 X.X MB](../audio/20260428_StanfordCS336_Lecture6_KernelsTritonXLA_口播稿.mp3)（通用格式）