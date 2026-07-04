# 【Stanford CS336 Language Modeling from Scratch — Lecture 5: GPUs, TPUs & Performance Engineering】

**主講：Percy Liang｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/izZba4UA7iY
> 影片時長：1 小時 18 分 39 秒（4719s）
> 性質：大學課程第五講 — GPU 硬體基礎、TPUs 對比、kernel 優化策略
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260420_StanfordCS336_Lecture5_GPUsTPUs_逐字稿.txt
> **整理日期**：2026-04-07
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

CS336 第五講由 Percy Liang 主講,正式進入 systems module 的核心——**GPU 程式設計與效能工程**。開場承諾:聽完這堂課,學生會理解「為什麼 matmul throughput plot 會出現那些奇怪的波動」以及如何讓自己的程式碼跑在 roofline 飽和區。

內容分三大塊:**GPU 硬體基礎** (streaming multiprocessors、Tensor Cores、memory hierarchy)、**TPUs 對比** (systolic array、bigger but fewer units)、**Performance engineering** (operator fusion、tiling、低精度、Flash Attention 案例)。Percy 強調 modern LM optimization is defined by memory,not compute——這是 Lecture 2 roofline analysis 的延伸,也是 Triton kernel 設計的核心。

**核心議題一句話**:GPU 是 throughput 導向的「上千個 lightweight cores」,TPUs 是 systolic array 架構的「少量巨大矩陣運算單元」——兩者 memory hierarchy 與 bottleneck 一致,核心優化策略(operator fusion、tiling、低精度)通用。Memory bandwidth 是現代 LLM 訓練的真正瓶頸,所有 kernel 設計都是圍繞「最小化 data movement」展開。

---

## 二、章節脈絡

### Section 1｜開場:GPU 程式設計的魔術感（00:00 ~ 08:00）

**重點摘要:** 第一次接觸 GPU 會覺得「像魔術」;本講目標是把 throughput plot 的奇怪波動全部解釋清楚。

**內容:**
- 大部分人接觸 GPU 會有魔術感——明明 SIMD 但感覺很深奧
- 承諾:本講結束後,學生會理解 matmul throughput plot 的所有奇怪 pattern
- **Memory hierarchy + matrix multiply units 是現代 GPU/TPU 設計的兩大核心**

---

### Section 2｜GPU vs CPU:throughput 對 latency 哲學（08:00 ~ 25:00）

**重點摘要:** CPU 是 latency 導向(低延遲串行),GPU 是 throughput 導向(高並行犧牲延遲);GPU 用數百個 lightweight cores 換 aggregate throughput。

**內容:**

| 維度 | CPU | GPU |
|------|-----|-----|
| 哲學 | Quick serial execution | Throughput |
| 設計 | 大控制單元 + 少量 ALU | 數百 lightweight cores |
| 適用 | 複雜 branching、低延遲 | 大量平行運算 |
| 任務完成時間 | 短(快 latency) | 長(切換任務) |
| Aggregate throughput | 低 | 高 |

---

### Section 3｜GPU 硬體架構:SMs + Memory Hierarchy（25:00 ~ 50:00）

**重點摘要:** Streaming Multiprocessor (SM) 是基本運算單元;H100 有 132 個 SM,各有 L1/shared memory;global memory (HBM) 是 80GB 等級但 latency 高 10×。

**內容:**
- **SM = Streaming Multiprocessor** = GPU 的基本 core(A100 有 128、H100 有 132、B200 類似)
- 每個 SM 有自己的 **L1 cache + shared memory**(20-30 cycle latency)
- **L2 cache** 在晶片上但跨 SM(慢一點)
- **Global memory / HBM**(H200 144GB)——是「GPU memory」但 latency 是 L1 的 10×
- 為什麼不全部用 SRAM(shared memory)?——貴幾百倍、耗電——memory hierarchy 是 trade-off
- **Grok(Nvidia 收購)** 是例外:用巨大 SRAM 設計 inference——SRAM 對特定 workload 很有效

> "Modern sort of hardware and LM optimization is really defined by the memory."

---

### Section 4｜Tensor Cores 與矩陣運算（50:00 ~ 65:00）

**重點摘要:** Tensor Cores 是 GPU 上的矩陣運算單元;FP32 → BF16 → FP8 → FP4 精度演進讓 FLOPs 與 memory 都大幅提升。

**內容:**
- V100 (2017) 開始有 Tensor Cores——重大硬體創新
- 接下來:structured sparsity、FP8 等低精度格式推動 FLOPs
- GPU throughput plot 的 super exponential 成長 → **很大部分來自精度下降**
- FP32 → BF16:bits 減半 → memory 流量減半
- FP8 / FP4:更激進——memory bottleneck 大幅緩解
- 但低精度有數值穩定性風險——需要 mixed precision + loss scaling

---

### Section 5｜TPUs:Google 的 GPU 替代方案（65:00 ~ 100:00）

**重點摘要:** TPU 用 systolic array;與 GPU 在 memory hierarchy 與 matrix multiply 哲學上一致,但單元數量懸殊(GPU 528 vs TPU 8 MXU);程式設計彈性差異大。

**內容:**

| 維度 | GPU | TPU |
|------|-----|-----|
| 基本單元 | SM × ~130(132 in H100) | 2 tensor cores |
| Matrix multiply unit | MXU × ~528 | MXU × 8 |
| 哲學 | 小但眾多 unit,flexible | 大但少,batch 大才有效率 |
| 程式設計 | SIMD,相對簡單 | TensorCore 強制 ≥64 input |
| Memory hierarchy | 一致 | 一致 |
| 例子 | H100、A100、B200 | TPU v4、v5 |

- **TPU 與 GPU 都叫「tensor cores」,但意思不同**——TPU 的 tensor core 是 processor;GPU 的 tensor core 是 matrix multiply unit
- 為什麼 TPU 效率高但彈性差?——systolic array 結構(streaming data through fixed circuit)很適合大矩陣
- **TPU 限制**:batch size ≤ 64 tensor core 直接拒絕(recent paper sweep 在 64 卡住)
- GPU 與 TPU 是 convergent evolution——memory hierarchy + matrix multiply unit 是必然選擇

> "TPU call their streaming multiprocessors tensor cores. GPUs call their matrix multiply units tensor cores. They are named exactly the same thing."

---

### Section 6｜GPU 程式設計基礎:Threads、Warp、Block（100:00 ~ 130:00）

**重點摘要:** GPU 程式設計用 SIMD,threads 非常 lightweight 可隨時 swap;目的是「最大化 aggregate throughput」。

**內容:**
- Threads 在 GPU 上非常 lightweight——可隨時 start/stop,scheduler 可 swap
- 當某個 warp stalled,scheduler 可換其他 warp 執行——保持 throughput 高
- 「Massive parallelism + fast swap」是 GPU 高 throughput 的核心
- 早期:人們手寫 shader 做 matrix multiply(NV 早期 GPU 上)
- 現在:Tensor Cores + 高階 kernel 語言(自訂 Triton kernel)

---

### Section 7｜Performance Engineering 六大策略（130:00 ~ 350:00）

**重點摘要:** Kernel 優化六大方向——vectorization、parallelism、memory hierarchy exploitation、operator fusion、loop transformations、低精度運算;Flash Attention 是「memory hierarchy + operator fusion」的極致展現。

**內容:**

| 策略 | 機制 | 效果 |
|------|------|------|
| **Vectorization** | 用 SIMD 指令一次算多個元素 | 4-8× throughput |
| **Parallelism** | 多 thread、多 SM 並行 | 線性擴展 |
| **Memory hierarchy** | 優先用 shared memory / register,減少 global memory 存取 | 10-100× latency 改善 |
| **Operator fusion** | 多 op 合成一個 kernel,減少 HBM 流量 | 2-10× |
| **Loop transformations** | Tiling、loop unroll、loop interchange | 改善 cache locality |
| **Low precision** | FP32 → BF16 → FP8 → FP4 | bits 減半 = memory 流量減半 |

- **Operator fusion 範例**:原本 `read A → compute A → write A → read A → compute B → write A` 兩輪 HBM,改成 `read A → compute A+B → write A` 一輪——省一半
- **Tiling**:fusion 的進階版,把大矩陣切成 tile,每個 tile 在 shared memory 完成計算後再寫回

---

### Section 8｜Flash Attention:Memory Hierarchy 最佳化典範（350:00 ~ 結束）

**重點摘要:** Flash Attention 透過 tiling + online softmax,讓 attention 的 memory complexity 從 O(n²) 降到 O(n);這是 Assignment 2 必學的 kernel。

**內容:**
- 標準 attention:QK^T → softmax → @V,需要存完整 n × n attention matrix(O(n²) memory)
- **Flash Attention 核心**:不存完整 attention matrix,改用 tiling + online softmax
- 把 Q、K、V 切成 block,block by block 計算 softmax 並寫回 output
- **Memory 從 O(n²) 降到 O(n)**——長 context 訓練的關鍵
- Flash Attention 2、3 進一步優化 warp scheduling 與 low precision
- 這是「memory hierarchy + operator fusion + low precision」三策略的極致展現

> "Flash attention is this lovely combination of all of these tricks combined together."

---

### Section 9｜為什麼 Roofline Plot 有波動(400:00 ~ 結束)

**重點摘要:** Matmul throughput plot 的奇怪 pattern 來自:matrix size 對齊 Tensor Core 要求、cache 命中、warp scheduling 等綜合效應。

**內容:**
- 預期:matrix 越大 throughput 越高(更多 work → 更高 utilization)
- 實際:有奇怪的「高高低低」波動
- 原因:
  - **Matrix size 未對齊 Tensor Core 要求**(如 64 倍數)
  - **L2 cache 命中與否**(matrix 太大塞不下 cache → 大量 global memory access)
  - **Warp scheduling 平衡**
- Roofline model 解釋:低 intensity = memory-bound(對角線)、高 intensity = compute-bound(水平)
- **為什麼 roofline plot 看起來像「先斜後平」**:從 memory-bound 過渡到 compute-bound

---

## 三、關鍵概念定義

| 概念 | 定義 | 本講脈絡 |
|------|------|---------|
| **Streaming Multiprocessor (SM)** | GPU 的基本運算單元(類似 core) | H100 有 132 個 |
| **Tensor Core** | 矩陣運算單元(GPU)/processor(TPU) | 注意同名異義 |
| **Memory Hierarchy** | register > L1/shared > L2 > HBM(global) | latency 從 1 cycle 到 500 cycle |
| **HBM (High Bandwidth Memory)** | Global memory,GPU 主流外部記憶體 | H200 144GB |
| **SRAM vs HBM** | SRAM 貴但快;HBM 便宜但慢 | Grok 用 SRAM 設計 |
| **Systolic Array** | TPU 核心,streaming data through fixed circuit | 強制大矩陣才有高效率 |
| **Operator Fusion** | 多 op 合成一個 kernel | 省 HBM 流量 |
| **Tiling** | 把大矩陣切成 tile,逐塊計算 | fusion 進階版 |
| **Flash Attention** | Tiling + online softmax | attention memory 從 O(n²) 降到 O(n) |
| **Vectorization** | SIMD 一次算多個元素 | 4-8× throughput |
| **Loop Transformation** | Tiling、unroll、interchange | 改善 cache locality |

---

## 四、人物 / 角色分析

| 人物 / 團隊 | 角色 | 背景 |
|-------------|------|------|
| **Percy Liang** | 主講 | 從 CPU vs CPU 哲學講到 TPU 對比再到 Flash Attention |
| **Nvidia** | GPU 設計者 | H100/B200/H200 系列;Tensor Cores 發明者 |
| **Google TPU 團隊** | TPU 設計者 | systolic array、tensor core (processor) |
| **Grok (Groq)** | SRAM 設計者 | 巨大 SRAM 換 inference 效率;被 Nvidia 收購 |
| **Flash Attention 作者** | Flash Attention 1/2/3 | tiling + online softmax 的極致展現 |
| **Bill Dally** | 引用人物 | Nvidia 首席科學家,super exponential growth plot |

---

## 五、核心主旨總結

GPU 與 TPU 雖然架構不同(SIMD vs systolic array),但在「memory hierarchy + matrix multiply unit」這兩大核心上**高度收斂**——這是 convergent evolution 的結果。所有 kernel 優化策略(operator fusion、tiling、low precision、Flash Attention)都圍繞**最小化 data movement** 展開,因為現代硬體瓶頸是 memory bandwidth 而非 compute。Flash Attention 是這套思維的極致展現——把 attention memory 從 O(n²) 降到 O(n),讓長 context 訓練變得可行。

**Roofline model 是理解這一切的核心框架**:低 intensity → memory-bound(對角線成長);高 intensity → compute-bound(水平飽和)。透過 vectorization、fusion、tiling 把 op 推到 roofline 飽和區,才是 modern LLM optimization 的本質。

---

## 六、金句摘錄

> "Modern sort of hardware and LM optimization is really defined by the memory."

> "TPU call their streaming multiprocessors tensor cores. GPUs call their matrix multiply units tensor cores. They are named exactly the same thing."

> "Flash attention is this lovely combination of all of these tricks combined together."

> "Memory movement is really, really important."

> "Roofline says, up until a certain point, we will be memory limited."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260420_StanfordCS336_Lecture5_GPUsTPUs_口播稿.txt

- [opus X.X MB](../audio/20260420_StanfordCS336_Lecture5_GPUsTPUs.opus)（Telegram 友善）
- [m4a X.X MB](../audio/20260420_StanfordCS336_Lecture5_GPUsTPUs.m4a)（iOS 友善）
- [mp3 X.X MB](../audio/20260420_StanfordCS336_Lecture5_GPUsTPUs.mp3)（通用格式）