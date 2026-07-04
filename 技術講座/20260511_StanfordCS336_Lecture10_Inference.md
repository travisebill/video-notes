# 【Stanford CS336 Language Modeling from Scratch — Lecture 10：Inference — KV Cache、Speculative Decoding 與 Continuous Batching】

**主講：Percy Liang & Tatsu Hashimoto｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/EfM546A79aM
> 影片時長：1 小時 25 分 30 秒（5130s）
> 性質：大學課程第十講 — 模型訓練完後的推論階段：memory、latency、throughput 的權衡
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260511_StanfordCS336_Lecture10_Inference_逐字稿_en.txt
> **整理日期**：2026-04-07
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Lecture 10 從「模型如何訓練」（Lecture 5-9）轉向「模型如何使用」——Inference。LLM inference 有獨特的 memory / latency / throughput trade-off：訓練算力是一次性 amortized，但 inference 算力是 per-request，必須在「生成一個 token 的延遲」與「每秒處理多少請求」之間權衡。本講涵蓋 **KV Cache**、**Speculative Decoding**、**Continuous Batching**、**PagedAttention** 等現代 inference 優化技術。

**核心議題一句話**：LLM inference 的核心問題是 autoregressive decoding——每生成一個 token 都要重新跑整個 forward，但 attention 可以用 KV cache 避免重算；現代 inference engine（vLLM、TGI、TensorRT-LLM）透過 continuous batching + PagedAttention 把 throughput 提升 10-24x。

---

## 二、章節脈絡

### Section 1｜開場：Inference vs Training（00:00 ~ 08:00）

**重點摘要：** Inference 是 per-request 算力，與 training 是一次性 amortized 的算力，trade-off 不同。

**內容：**
- **Training 算力**：amortized over 整個 training run，可承受高算力
- **Inference 算力**：每個 request 都要付 cost，必須極度優化
- **三個核心指標**：
  - **Latency**：single request 的 time-to-first-token (TTFT) + per-token latency
  - **Throughput**：每秒能處理多少 requests / tokens
  - **Memory**：KV cache 佔的 GPU memory

### Section 2｜Autoregressive Decoding 與 KV Cache（08:00 ~ 30:00）

**重點摘要：** LLM 生成 token 的標準方式是 autoregressive，每次 forward 都跑整個 sequence。

**內容：**
- **Autoregressive**：token[t] = model(token[1:t-1])；每步 forward 都跑完整 sequence
- **Naive 問題**：每次 forward 都重算所有 previous tokens 的 K/V projection
- **KV Cache**：儲存每個 layer 每個 head 的 K/V projection，下次 forward 直接讀
  - Memory cost：O(layers × heads × seq_len × head_dim × batch_size × 2)
  - 70B 模型 + 8K context + batch=32 → KV cache 可能 100+ GB
- **KV Cache Memory 是 inference 的主要瓶頸**

### Section 3｜Speculative Decoding（30:00 ~ 50:00）

**重點摘要：** 用小模型 draft tokens，大模型 batch verify，加速 inference 2-3x。

**內容：**
- **Draft Model**：小模型（例如 7B）先生成 K 個 draft tokens
- **Verification**：大模型（例如 70B）一次 forward 驗證 K 個 draft tokens 是否接受
- **Acceptance Criterion**：用 rejection sampling 維持輸出分布不變
- **Speedup**：當 draft model 接受率高時，可加速 2-3x（因為大模型 batch 處理 K 個 token）
- **Trade-off**：需要額外小模型 + acceptance 受限於任務難度

### Section 4｜Continuous Batching（50:00 ~ 65:00）

**重點摘要：** 把多個 requests 的 forward / decode 階段混合，提升 GPU 利用率。

**內容：**
- **Static Batching**：等所有 requests 完成才釋放 GPU，長 request 浪費 GPU
- **Continuous Batching**：每個 decode step 都接 / 換 requests，GPU 永遠有工作
- **vLLM**：UC Berkeley 開源 inference engine，continuous batching 標準實作
- **Throughput**：相比 static batching，continuous batching 可提升 10-24x throughput

### Section 5｜PagedAttention 與 Memory 管理（65:00 ~ 78:00）

**重點摘要：** 把 KV cache 切成 pages，消除 fragmentation，提升記憶體利用率。

**內容：**
- **KV Cache Fragmentation**：每個 request 的 seq_len 動態變化，連續記憶體配置造成 fragmentation
- **PagedAttention**：把 KV cache 切成 fixed-size pages，借鑑 OS virtual memory 的 paging
- **Block Manager**：追蹤每個 request 的 logical → physical page mapping
- **Memory Sharing**：beam search / parallel sampling 可共享 KV cache pages
- **Throughput**：相比 continuous batching + naive KV，pagedattention 再提升 2-4x

### Section 6｜Inference Frameworks 比較（78:00 ~ 82:00）

**重點摘要：** 主流 inference framework 簡介。

**內容：**
- **vLLM**：UC Berkeley；continuous batching + PagedAttention 開創者
- **TGI（Text Generation Inference）**：HuggingFace；偏 production deployment
- **TensorRT-LLM**：NVIDIA；極致效能優化但彈性較低
- **SGLang**：Stanford；RadixAttention 進階 KV cache reuse

### Section 7｜Q&A + 下週預告（82:00 ~ 85:30）

**重點摘要：** 預告 Lecture 11 進入 Evaluation。

**內容：**
- 評估 LLM 是一個獨立的學問（HELM、lm-evaluation-harness）
- 下週 Lecture 11 / 12 涵蓋 evaluation methodology

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Autoregressive Decoding** | token[t] = model(token[1:t-1])；每步 forward 跑完整 sequence |
| **KV Cache** | 儲存每個 layer 每個 head 的 K/V projection；避免重算，memory cost 是 inference 瓶頸 |
| **Speculative Decoding** | 小模型 draft + 大模型 batch verify；加速 2-3x 但需 draft model |
| **Static Batching** | 等所有 requests 完成才釋放 GPU；長 request 浪費 GPU |
| **Continuous Batching** | 每個 decode step 都接 / 換 requests；GPU 永遠有工作；vLLM 標準 |
| **PagedAttention** | 把 KV cache 切成 fixed-size pages；消除 fragmentation；借鑑 OS paging |
| **vLLM** | UC Berkeley 開源 inference engine；continuous batching + PagedAttention 開創者 |
| **TGI** | HuggingFace Text Generation Inference；偏 production |
| **TensorRT-LLM** | NVIDIA；極致效能優化 |
| **SGLang** | Stanford；RadixAttention 進階 KV cache reuse |

---

## 四、重要引用

> "KV cache is the memory bottleneck of inference — 70B model + 8K context can eat 100+ GB." — Tatsu 點出 inference 的核心 memory 問題

> "Continuous batching gives 10-24x throughput over static batching." — vLLM 開創者的基準測試結果

> "Speculative decoding works when your draft model has high acceptance rate — for hard reasoning tasks it may not help much." — Tatsu 解釋 speculative decoding 的限制

---

## 五、人物 / 角色分析

**Percy Liang & Tatsu Hashimoto**：Lecture 10 兩位共同主講，標誌著從「training systems」轉向「deployment systems」。Inference 是 LLM 商業化的核心瓶頸，需要兩位共同講解 memory / latency / throughput 的權衡。

---

## 六、核心主旨總結

CS336 Lecture 10 把 LLM 從「訓練完」推進到「上線」：Inference 的核心問題是 autoregressive decoding + KV cache memory 瓶頸。Speculative decoding 用小模型 draft + 大模型 verify 加速 2-3x；Continuous batching 把 GPU 利用率從靜態提升到動態；PagedAttention 借鑑 OS paging 消除 KV cache fragmentation。三者組合（vLLM 風格）相比 naive inference 可提升 20-30x throughput。

---

## 七、金句摘錄

- "KV cache is the memory bottleneck of inference."
- "Continuous batching gives 10-24x throughput over static batching."
- "Speculative decoding works when your draft model has high acceptance rate."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260511_StanfordCS336_Lecture10_Inference_口播稿.txt

- [opus X.X MB](../audio/20260511_StanfordCS336_Lecture10_Inference_口播稿.opus)
- [m4a X.X MB](../audio/20260511_StanfordCS336_Lecture10_Inference_口播稿.m4a)
- [mp3 X.X MB](../audio/20260511_StanfordCS336_Lecture10_Inference_口播稿.mp3)