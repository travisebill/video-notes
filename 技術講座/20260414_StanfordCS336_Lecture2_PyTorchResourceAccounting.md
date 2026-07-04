# 【Stanford CS336 Language Modeling from Scratch — Lecture 2: PyTorch (einops) & Resource Accounting】

**主講：Percy Liang｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/kuYAsz7zspQ
> 影片時長：1 小時 17 分 25 秒（4645s）
> 性質：大學課程第二講 — PyTorch 基礎 + 資源 accounting
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260414_StanfordCS336_Lecture2_PyTorchResourceAccounting_逐字稿.txt
> **整理日期**：2026-04-07
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

CS336 第二講由 Percy Liang 主講,延續第一講的 roadmap,正式進入「systems 思維」的第一個基石——**resource accounting**。開場 Percy 先分享好消息:Moraine 計畫預訓練的大模型 loss 與預測值的差距僅 0.05,證明 scaling law 外推的有效性。本講核心是讓學生建立「每寫一行 code,就要想性能特徵」的習慣——這也是整門 systems 模組的 mindset 起點。

內容涵蓋三大塊:**tensor 與精度**(FP32 / FP16 / BF16 / FP8 / FP4)、**matmul FLOPs 計算**(包含 forward/backward 細節)、**roofline analysis**(arithmetic intensity 決定 compute-bound 或 memory-bound)。Percy 用 einops(einsum notation)取代傳統 matmul 寫法,因為前者讓 broadcasting 與 dimension 命名更直觀——這對後續做 transformer 數學推導極有幫助。

**核心議題一句話**:在動手寫 model 之前,先學會把一塊 matmul 拆成「參數量、activation 大小、forward FLOPs、backward FLOPs、optimizer state」五項來計算——這套 resource accounting 是把 LLM 從「能跑」推到「能 scale」的底層功夫。

---

## 二、章節脈絡

### Section 1｜開場與 Moraine Scaling Law 驗證（00:00 ~ 02:00）

**重點摘要:** Moraine 預訓練大模型 loss 與預測差距僅 0.05;外推到 GPT-5 等級的 loss 數字也公開。

**內容:**
- Moraine 計畫跑了 iso-FLOPs curves——每條曲線是一群小模型實驗的 compute-optimal 點
- 用小實驗 fit scaling law,預測大模型 loss——實測驗證 0.05 差距
- 如果 scaling law 對的,外推到 GPT-5 等級 compute,loss 將會落在某個值
- 預注冊(public prediction)的好處:訓練前就把預測 loss 公開,事後驗證

---

### Section 2｜Resource Accounting 為何重要（02:00 ~ 08:00）

**重點摘要:** 兩個經典問題——「70B model 在 15T tokens 上要訓練多久?」「H100 × 8 用 AdamW 能 train 最大的 model 是多大?」

**內容:**
- 70B on 15T on H100:公式 6ND 算 FLOPs → 查 spec sheet → 用 MFU 0.5 估實際 throughput → **143 天**
- H100 × 8 配 AdamW:80GB HBM、每個 param 需 2+2+4+4 bytes(parameters + gradients + 2× optimizer states) → **約 53B params**
- 這些都是 back-of-envelope 計算,不計 activations(取決於 batch × sequence)
- 重點不是精確數字,而是**掌握 rough shape of things**

> "The point is not to precisely calculate every single thing, but just get the rough shape of things."

---

### Section 3｜Tensor 是萬物基礎(08:00 ~ 15:00)

**重點摘要:** 參數、gradient、optimizer state、data、activation 全部都是 tensor。

**內容:**
- DeepSeek 3.2 為例:每個矩陣有 shape 與 precision——LM 就是一堆 tensor
- Float32 結構:1 sign bit + 8 exponent bits(動態範圍)+ 23 mantissa bits(精度)
- 4 × 8 FP32 matrix = 4×8×4 bytes = **128 bytes**
- 對比 GPT-3 feed-forward 某個矩陣約 2.3 GB——tensor 大小可觀
- 為什麼 deep learning 偏好低精度:運算快、省記憶體、且 ML 不像科學運算需要高精

---

### Section 4｜FP16 / BF16 / FP8 / FP4 精度演進（15:00 ~ 30:00）

**重點摘要:** BF16 是目前主流;FP8 有兩個變體;FP4 已開始實驗(NVFP4、NeMo-3 Super)。

**內容:**

| 格式 | Bits | 用途 | 風險 |
|------|------|------|------|
| **FP32** | 32 | 預設、optimizer states | 太貴 |
| **FP16** | 16 | 不建議直接訓練 | 動態範圍太小,易溢位 |
| **BF16** | 16 | parameters / activations / gradients | 仍是 sweet spot |
| **FP8** | 8 | 兩變體(E4M3 dynamic range / E5M2 resolution) | NVIDIA Transformer Engine 支援 |
| **FP4 / NVFP4** | 4 | NeMo-3 Super 2025 已使用 | 每 block 共享 scale,可表達範圍擴大但單值動態範圍犧牲 |

- **Mixed precision training**:BF16 算 matmul、FP32 存 optimizer states;PyTorch AMP 自動處理
- FP4 不像「宣告 tensor 類型」這麼簡單——大多是 NVIDIA 軟體棧在背後處理

---

### Section 5｜Einops:用命名維度取代 matmul（30:00 ~ 45:00）

**重點摘要:** Einsum notation 讓 matmul 的 broadcasting 與維度命名直觀化,大幅降低 backward 公式寫錯的機率。

**內容:**
- 傳統寫法 `Y = X @ W` 容易忘記 transpose
- Einops 用 named dimensions 寫:`Y[b, k] = einsum("b d, d k -> b k", X, W)`
- **重點技巧**:看前向是 `b d, d k -> b k`,backward `H1.grad[b, d] = einsum("b k, d k -> b d", H2.grad, W2)`——「scalar case 倒推 indexing」永遠對
- 學會 einops 後,transformer 的 QKV attention、MLP、layer norm 都可以乾淨地用 einsum 表達

> "Einsum I think makes it very clear because if you just like looking at the scalar case, it has to look like H1.grad is H2.grad times W2."

---

### Section 6｜Matmul FLOPs:2BDK（45:00 ~ 65:00）

**重點摘要:** 一個 B×D 輸入 × D×K 矩陣的 matmul 消耗 2BDK FLOPs;這是 transformer 6ND 公式的雛形。

**內容:**
- 公式推導:每個 output element 做 D 次乘加(D 次 multiply + D 次 add = 2D FLOPs) × B×K elements = **2BDK**
- 換個角度看:B = tokens 數、D = input dim、K = output dim → **2 × tokens × params**
- 6ND 公式由此延伸:forward pass = 2ND、backward ≈ 4ND、總計 6ND
- 程式碼實測:用 `torch.cuda.Event(enable_timing=True)` 計時 + `torch.cuda.synchronize()` 確保 barrier——忘了 sync 會得到過於樂觀的時間

---

### Section 7｜MFU:實際 vs 承諾 FLOPs（65:00 ~ 75:00）

**重點摘要:** Model FLOPs Utilization = 實際 FLOPs/sec ÷ 承諾 FLOPs/sec;現代模型 0.5 已算不錯。

**內容:**
- Spec sheet 寫 989 TFLOPs(H100 BF16),實際可能只有一半——這就是 MFU
- **0.5 MFU 算優秀**;純 matmul 可能達 0.8;0.1 表示有嚴重問題
- 為什麼拿不到 100%?——memory bottleneck
- **不計 communication overhead**——distributed training 時這是另一個獨立變量

---

### Section 8｜Arithmetic Intensity 與 Roofline（75:00 ~ 110:00）

**重點摘要:** Arithmetic intensity = FLOPs / bytes;低 intensity 被 memory bandwidth 限制,高 intensity 被 compute 限制。

**內容:**
- Cartoon 圖:HBM(memory)↔ accelerator cores(compute),每次運算要送 tensor 過去、算完送回
- **Arithmetic intensity = (計算量 FLOPs) / (記憶體流量 bytes)**
- Roofline plot:X 軸 = arithmetic intensity、Y 軸 = realized FLOPs/sec
  - 低 intensity 區:memory-bound,線性上升
  - 高 intensity 區:compute-bound,水平飽和於 peak FLOPs
- **Value/dot product 類運算** intensity 極低,memory-bound
- **大矩陣 matmul** intensity 高,compute-bound
- B200 spec:2.25 PFLOPS BF16 + 8 TB/s memory bandwidth——可算出 roofline 轉折點
- 為什麼 MFU 只有 0.5:大部分 op 落在 memory-bound 區,實際 FLOPs 遠低於 peak

---

### Section 9｜Forward + Backward FLOPs 計算（110:00 ~ 130:00）

**重點摘要:** 一個 B×D → D×K matmul 的 backward = 2 次 forward 大小。

**內容:**
- Forward:`Y[b, k] = einsum("b d, d k -> b k", X, W)` → 2BDK FLOPs
- Backward 需要算兩個 gradient:
  - `X.grad[b, d] = einsum("b k, d k -> b d", Y.grad, W)` → 2BDK FLOPs
  - `W.grad[d, k] = einsum("b d, b k -> d k", X, Y.grad)` → 2BDK FLOPs
- **Backward ≈ 2 × forward**
- 總計一次 layer = forward 2BDK + backward 4BDK = **6BDK FLOPs**
- 延伸到整個 LLM:forward 2ND + backward 4ND = **6ND**

---

### Section 10｜Optimizer States 與記憶體（130:00 ~ 150:00）

**重點摘要:** AdamW 每個參數要 12 bytes(2 + 2 + 4 + 4)= 本身 FP16 + grad FP16 + 兩個 FP32 states。

**內容:**
- 1 parameter 需要儲存:
  - 參數本身(2 bytes BF16)
  - gradient(2 bytes BF16)
  - Adam m state(4 bytes FP32)
  - Adam v state(4 bytes FP32)
- 總計 **12 bytes/param**
- H100 80GB / 12 bytes ≈ **6.6B params**——這是不計 activations 的上限
- 啟動 ShardedOptimizer、gradient checkpointing 等技巧可突破上限

---

### Section 11｜Deep Network Memory 與 Activation（150:00 ~ 結束）

**重點摘要:** Deep network 的 activation 隨 layer 數線性增長,是 GPU 記憶體另一個主要消耗者。

**內容:**
- 簡單 L-layer D×D matmul network:
  - Parameters = D² × L(每層一個矩陣)
  - Forward 過程需要存每層 activation:每層 B×D → 總計 B×D×L
- Activation 不是「參數量」而是「forward pass 過程的中間值」——可透過 gradient checkpointing 換記憶體換 compute
- 為什麼 activation 重要:backward 要用 forward 的中間值算 gradient,不能丟

---

## 三、關鍵概念定義

| 概念 | 定義 | 本講公式/數值 |
|------|------|--------------|
| **FLOPs** | 浮點運算次數(乘 + 加 各算 1 次) | Matmul B×D × D×K = **2BDK** |
| **MFU (Model FLOPs Utilization)** | 實際 FLOPs/sec ÷ 承諾 FLOPs/sec | 現代模型 ~0.5 算優秀 |
| **Arithmetic Intensity** | FLOPs / bytes(每次運算需要的資料量比例) | 決定 memory-bound 或 compute-bound |
| **Roofline** | 理論上界 FLOPs/sec vs arithmetic intensity 圖 | 低 intensity 線性、高 intensity 水平 |
| **6ND** | 訓練一個 N 參數 model 在 D tokens 的總 FLOPs | forward 2ND + backward 4ND |
| **Mixed Precision** | 計算用 BF16、optimizer states 用 FP32 | PyTorch AMP 自動處理 |
| **BF16** | 1+8+7 bits;動態範圍同 FP32、精度同 FP16 | 現代 training default |
| **FP8** | 兩變體:E4M3(dynamic range)、E5M2(resolution) | NVIDIA Transformer Engine 支援 |
| **Einops / Einsum** | 用 named dimensions 寫 matmul | `Y[b,k] = einsum("b d, d k -> b k", X, W)` |
| **AdamW Memory** | 12 bytes/param | 2 + 2 + 4 + 4 |
| **Gradient Checkpointing** | 丟掉部分 activation,backward 重算 | 換記憶體換 compute |

---

## 四、人物 / 角色分析

| 人物 | 角色 | 背景 |
|------|------|------|
| **Percy Liang** | 主講 | Stanford CS 教授,主導 Moraine 計畫,本講從 PyTorch 基礎帶到 roofline analysis |
| **Marine / Moraine 計畫** | 主角配角 | 預注冊 scaling law 預測大模型 loss;本講驗證外推誤差僅 0.05 |

---

## 五、核心主旨總結

Resource accounting 不是「紙上算數」,而是 LLM 工程師的核心 mindset:每一行 code 寫下去之前,先想清楚這一行消耗多少 FLOPs、多少 bytes、走的是 matmul 還是 element-wise op,落在 roofline 哪個區。BF16 / FP8 / FP4 的精度演進讓訓練成本急速下降,但**記憶體頻寬**才是現代硬體的真正瓶頸——也是 Assignment 2 要用 Triton kernel 解決的核心問題。Einops 不只是寫法,更是把 broadcasting 與 chain rule 用 named dimensions 寫得無歧義——學會之後,transformer 的 backward 公式可以一行推完,不再出錯。

---

## 六、金句摘錄

> "The point is not to precisely calculate every single thing, but just get the rough shape of things."

> "Your memory is not where your compute is."(延續 Lecture 1)

> "We didn't actually achieve 1.0 MFU because of memory bottlenecks."(roofline 解釋)

> "Einsum I think makes it very clear because if you just like looking at the scalar case..."

> "Mixed precision training is where some computations use some precision and for some other computations use other precision."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260414_StanfordCS336_Lecture2_PyTorchResourceAccounting_口播稿.txt

- [opus X.X MB](../audio/20260414_StanfordCS336_Lecture2_PyTorchResourceAccounting.opus)（Telegram 友善）
- [m4a X.X MB](../audio/20260414_StanfordCS336_Lecture2_PyTorchResourceAccounting.m4a)（iOS 友善）
- [mp3 X.X MB](../audio/20260414_StanfordCS336_Lecture2_PyTorchResourceAccounting.mp3)（通用格式）