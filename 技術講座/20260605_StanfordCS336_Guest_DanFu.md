# 【Stanford CS336 Language Modeling from Scratch — Guest Lecture：Dan Fu — Inference Stack, Megakernels, Recurrent Transformers】

**主講：Dan Fu（Stanford PhD, UCSD × Together AI）｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/9EEm4iMAF5s
> 影片時長：1 小時 11 分 40 秒（4300s）
> 性質：大學課程 Guest Lecture — 模型訓練完成後的「另一面」：Inference Service、KV Cache、Disaggregated Prefill/Decode、Megakernels 加速 Decode、Recurrent Transformer (Parcae) 數值穩定性與 Scaling Laws
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260605_StanfordCS336_Guest_DanFu_逐字稿_en.txt
> **整理日期**：2026-06-05
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Dan Fu（Stanford PhD） × Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Dan Fu 的 guest lecture 把視角從「模型訓練」翻到「模型部署的另一面」——inference service、GPU kernels、recurrent architecture。Dan 開宗明義用「1902 曼哈頓 130,000 匹馬、1912 汽車已超馬、1918 馬路消失」10 年工業革命類比 2025-2026 年的語言模型轉折：他個人從去年開始大部分程式都用 LLM 寫，這就是語言模型界的 1912 moment。Inference 是「把 electricity 變成 intelligence 的引擎」——GPU 就像新石油，inference engine / GPU kernel 才是把沙子變成可用產品的關鍵。Dan 在 Stanford 跟 Together AI 各有團隊, Lec 主要展示三項 inference-side research：cache-aware prefill-decode disaggregation（40% 提速）、Megakernels 用於 Decode（30-70% 提速、72% GPU bandwidth utilization）、Parcae（loop transformer 數值穩定性與 scaling laws）。

**核心議題一句話**：語言模型的下半場是 inference 系統——不是只把模型變大、怎麼 serve 它才是關鍵;Megakernels 把 decode kernel fusion 化以吃滿 GPU bandwidth、Cache-aware routing 把 warm vs cold 流量分開以避免 tail effect、Parcae 用 State Space Model 數學框架分析 loop transformer 的 spectral radius 問題並用 negative diagonal A matrix 達 stable training；最後 co-design inference 與 architecture 不可分——NVFP4 是 NVIDIA 特有、MXFP4 是 AMD，模型選擇 quantization 必須配硬體；DeepSeek MLA、FP4 KV cache、Bidirectional (BERT) vs Causal attention 都由 use case 驅動。

---

## 二、章節脈絡

### Section 1｜開場：Inference 是把 electricity 變 intelligence 的引擎 (00:00 ~ 12:00)

**重點摘要：** 語言模型經歷 10 年工業革命 (2018 100M → 2025 1T+ parameters)；inference engine / GPU kernel 是關鍵 transformer；Stanford + Together 是主要研究方。

**內容：**
- 模型從 2018 100M → 2019 GPT-2 太危險不釋出 → 2025 open-source 1T+ parameters、frontier 5-10T
- 1902 Manhattan 130,000 working horses → 1898 「manure crisis」學術 conference 結論「沒辦法」→ 1912 cars outnumbered horses → 1918 horse 從 NYC 消失
- Dan 自承：for him, last year was the "1912 moment"——開始用 LLM 寫大部分 code
- "GPUs are the new oil"——hundreds of billions 投資、sovereign wealth funds 押注
- Inference engine / GPU kernel 是 the engine that turns oil into something useful
- Dan 兩個組織：UCSD 實驗室 + Together AI（GPU cloud）重研究背景

### Section 2｜Token Lifetime：從 request 到 response 的完整路徑 (12:00 ~ 22:00)

**重點摘要：** Inference = prefill (compute-bound) + decode (memory-bandwidth bound)；兩者瓶頸完全不同, 開始 disaggregate 到不同 GPU pool；routing 與 KV cache 是關鍵。

**內容：**
- Request lifecycle：schedule → KV cache lookup → prefill → decode → tokens
- KV Cache：跨 request / session 共用 prefix activations；用 prefix sharing (tree-based) 判定哪些 tokens 之前算過
- Disaggregated prefill/decode：prefill 是 compute-bound (像 training)、decode 是 memory-bandwidth bound (因每次只生成 1 token, 但要 load 整個 model weights)
- Tensor parallelism：1T model 跑 280GB GPU 上必須 split tensors
- Disaggregation 推到不同 GPU 群：可以 specialize 不同 stack, 所以 NVIDIA Blackwell 配 Groq LPU、Cerebras SambaNova 等
- Inference engine loop：waiting → scheduling → execution → token sampling → repeat

### Section 3｜Workload 形態對 Inference Design 的影響 (22:00 ~ 32:00)

**重點摘要：** 不同 workload 對 tokens distribution、turn cadence、SLO 完全不同——coding (短 input, 多 turn, sticky)、summarization (短 input/output)、batch (長 input, 一次過)、voice (急迫 TTFT)；SLO 由互動模式決定。

**內容：**
- Coding workload：tens of thousands input tokens (整 code base) + thinking tokens + short outputs；turn-by-turn sticky
- Summarization：把整本書丟進來，會與 chat workflow 截然不同
- Batch processing workflow：only sees each document once, KV cache 重要性低 (vs agentic workflow 高)
- TTFT (time to first token) vs total response time：interactive application 要 <1s first token, long agent workflow 要 total <X 分鐘
- 對 inference design 影響：cache hot vs cold、routing strategy、KV cache eviction policy

### Section 4｜Prod Scale 的稀有 Bug 與 Reasoning Drama (32:00 ~ 42:00)

**重點摘要：** 大量生產部署時浮現 0.001% 級別 nasty bugs——kernel 細微錯誤導致 NaN、logit 變 NaN 後 model 重複 output；不同 bugs 有非常奇怪的症狀。

**內容：**
- 0.001% 級別 bugs 在小 scale 不出現, prod scale 才浮現
- Kernel 細微數值錯誤：logit 變 NaN, model 開始說 "hi, hi, hi, hi" 或無限 "!" 符號
- Tool call 處理 bug：model 變 doom loop, 一直說 "make an internet search" 但 harness 處理不對, 生成 tens of thousands tokens
- Insurance providers 因為 quantization issue 被誤會——其實是 off-by-I error in kernel, 讀進 uninitialized GPU memory, retention 過後 random Chinese character 出現, model 接著 "為什麼我開始用中文思考" 並轉語
- 症狀可能誤導：細微 kernel bug 看起來像 fine-tune 行為改變, 但其實是 uninitialized memory read

### Section 5｜KV Cache 層次化：GPU → CPU DRAM → SSD (42:00 ~ 50:00)

**重點摘要：** KV cache 是 inference inference 的核心——演化路徑 GPU → CPU DRAM → SSD；Jensen 開始執著 CPU performance；OpenAI 掃光 SSD/DRAM 庫存。

**內容：**
- 想存大 KV cache：先 GPU memory → 不夠 → CPU DRAM → 不夠 → SSD
- Jensen 開始執著 CPU performance——上一代 CPU 太慢 bottleneck inference；$500,000 GPU 被 $1,000 CPU 拖累極不合理
- OpenAI 掃購 SSD/DRAM 庫存——為了 KV cache 容量
- Eviction policy：LRU 是經典 heuristic (OS paper 證明 within 2x optimal)
- Future prediction 是 dream：user 把舊對話叫出來 = strong signal 要 query, 提前 prefetch

### Section 6｜NVl72 Hardware 與新 Inference Topology (50:00 ~ 56:00)

**重點摘要：** Blackwell NVl72 把 72 GPUs 用 NVLink 高速連起來；帶來 fault tolerance 問題與 distributed context 處理問題。

**內容：**
- NVIDIA Blackwell NVl72 Grace Blackwell：72 GPUs with fast interconnect
- Fault tolerance 是新問題——當你 split 64 GPUs 給 production traffic, 1 GPU 故障怎辦？cables 是塑膠 (flimsy), flaky NV links 是常態
- Million+ context 處理：context 也跨 GPU 切?
- 結論：這是非常早期的研究 — 10-20 年後回頭看會覺得 "isn't this obvious"

### Section 7｜Project 1：Cache-aware Prefill-Decode Disaggregation (56:00 ~ 64:00)

**重點摘要：** 簡單兩行 routing 邏輯：低 cache hit 的新 request 走 "cold" prefill pool, 高 cache hit 的多輪對話走 "warm" prefill pool；最高 40% 提升。

**內容：**
- 新 request (long, cold) vs 多輪對話 (warm, short) 不該跑同 prefill GPUs
- 新 request (如 paste 整本書 "talk to me about this book") 跟短對話 "1+1 等於多少" 共享 GPU 會互相踩——前者 block decoder, 後者等太久
- 簡單兩行 router：cold → cold pool、warm → warm pool
- 上線後可達 **40% serving 提升**
- TL;DR：我們在 inference 系統設計早期階段, 很多這類簡單優化空間未開

### Section 8｜Project 2：Megakernels (64:00 ~ 78:00)

**重點摘要：** Decode 是 memory-bound，kernel launch overhead 大→ Megakernels 把多 operation fuse 成 single kernel；用 instruction-level 抽象與 ThunderKittens library；H100 達 72% bandwidth utilization（near speed of light）。

**內容：**
- Decode 困境：每生成 1 token 要跑整 model，無法用 GPU 大 parallelism, GPU 變成 "glorified memory loader"
- 傳統寫 kernel 一個 operation 一個——Norm、matmul、attention 各自獨立 kernel——大量 launch overhead 與空檔
- Cartoon 顯示 x 軸時間、y 軸 SM processors；很多時間等別 operation 完成 = SM 空轉
- Megakernels 概念：把多 operation fuse 成 single kernel，類似 flash attention fusion 但更積極
- 把 layer 整體 fuse 成一個 kernel——可以看到 weight load from next layer 跟 attention overlap、reduction 跑到 attention over 之前
- KV Cache load 跟 QKV+rope overlap——非常 fine-grained control
- ThunderKittens library：低階 CUDA 框架, instruction-based abstraction, 提供 virtualized shared memory 編排
- Llama-1B 一層 fuse 結果：vs SOTA engines 達 **30-70% speedup**、H100 **72% bandwidth utilization (near speed of light)**
- Off-the-top "near speed of light"：H100 能跑多快的 physical limit, 我們已逼近

### Section 9｜Project 3：Parcae - Stabilized Loop Transformer (78:00 ~ 95:00)

**重點摘要：** Loop transformer 把 transformer blocks 重複跑——FLOPs dial 但 parameter 不增；naive implementation training 爆炸；Dan Fu 用 State Space Model 分析，把 A 改成 negative diagonal matrix 達 stable。

**內容：**
- Loop transformer 概念：token 通過 transformer 到某個點送進 recurrent block, 跑同樣 block N 次；FLOPs ↑ 但 params 穩定
- 優勢：可以 reuse params 換 FLOPs（同樣 parameter budget 換更高 quality）、expressivity 更高
- Twitter hype 巧合：release Parcae 前一週，有人說 Claude mythos 是 recurrent model——後來撰文道歉說自編
- 訓練困境：naive loop transformer 改 LR 或其他 training algorithm 會爆炸 (loss spike)、NaN 出現
- 過去 workaround：每層加 norm、挑特定 LR (2e-4)——Dan 覺得這治標不治本
- 數學分析：把 transformer 視為 State Space Model, residual block R + A/B matrices
- 殘差 block 模型：active = A × previous + B × initial
- 觀察 A、B matrix dominate 整個 equation magnitude
- 關鍵 insight：A matrix powered to huge degree (e.g., A^16)；若 A 是 2, activation 變 2^16 級爆炸
- Spectral radius = norm of matrix，當 spectral radius > 1 時, powered up 就爆炸
- 過去 paper A 是 identity 或 fully learnable——都 either marginally stable or unstable
- Parcae solution：A = negative diagonal matrix → powered up 收斂到 0；B = simple linear norm → spectral radius < 1
- 實驗結果：stable loss curve, 即使用之前會爆炸的 6e-4 LR
- 比 baseline Recurrent Depth Model 更穩定, 更高 quality, perplexity 更好
- Constraint state norm：藍線 (有 norm constraint) 跟橘線 (無) 對比—— norm 約束讓 model 不再 keep expanding activations

### Section 10｜Loop Transformer Scaling Laws (95:00 ~ 105:00)

**重點摘要：** 固定 model size 增大 data → 應同時增大 recurrence；scaling law 顯示 recurrence 應作為另一個 axis 來 scale；目前所有 frontier model 都沒 recurrent, 都停在曲線左邊。

**內容：**
- 經典 scaling law：data + params 應 jointly scale (down-right curve)
- Loop transformer 加入新 axis：data + params + recurrence
- 實驗結果：fixed param, 增大 data 時也增大 recurrence 給 lower validation loss
- 結論：as you increase data, you should also be increasing recurrence
- 目前所有 production model 都 "no recurrence, big data"——停在 scaling curve 最左
- 暗示可能還有改進空間
- "Always get better 增大 model + train longer" 仍是 golden rule；但考慮 compute-optimal / serving constraints 時，looping 是 trade-off

### Section 11｜Co-Design：Inference × Architecture (105:00 ~ end)

**重點摘要：** 模型設計必須跟 serving 硬件共同設計——NVFP4 是 NVIDIA 特有、MXFP4 是 AMD、DeepSeek MLA 是 KV cache 激進壓縮、Bidirectional (BERT) vs Causal attention 用於不同 use case。

**內容：**
- Co-design 三大維度：
  1. **Memory budget 設計 model size**：先看 chip memory 多大, 設計 model 留 KV cache
  2. **Quantization 配硬體**：NVIDIA NVFP4 (Nemotron)、AMD MXFP4；Chinese model 看 Huawei chip 選格式
  3. **Workflow type**：Agentic looped → KV cache 必須 hot；batch processing → 一次過, KV 不重要
- KV cache 激進壓縮例子：
  - **DeepSeek MLA**：multi-latent attention, KV cache 大幅壓縮
  - **FPA / FP4 KV cache**：非常敏感 size reduction, 對 agentic workflow 影響巨大
- Causal attention vs Bidirectional：
  - Google 搜索至今用 BERT (bidirectional), 因為只 encode 不 generate
  - T5: encoder-decoder hybrid, 一度被選
  - Chat: 必有 decode portion, causal 不變
- Q&A 重要 insight：Megakernels 跨多 GPU NCCL fuse 也是研究方向 (DeepSeek 4 已經對 MoE inference layer fuse NCCL 進去)

### Section 12｜Q&A 與結論 (Q&A after main talk)

**重點摘要：** Parcae 可從 pretrained model 開始 loop? Work in progress; Megakernels 寫作代價極高 (一年一人三 models 三 batch sizes)；Co-design 是 system 與 model team 的對話。

**內容：**
- Parcae Q&A：可從 pretrained model loop? Yes，有人在 leaderboard 用這個 trick——disturbs Dan 但確實有效
- Megakernels 的 cost：full-time kernel engineer 一年能寫 1 hardware × 2-3 models × batch sizes 1-16；超出 batch size 17 又要重寫
- Together 在做 compiler 自動化部分 Megakernel 寫作
- Compute optimal trade-off：for compute optimal, looping vs more parameters 是 context-dependent——depends on serving constraints、模型大小需求
- Inference implications for loop：少 params → 可以 fit more KV cache、減少 GPU-to-GPU 通信——對 inference 友好
- NVFP4 case study：NVIDIA Nemotron 用 NVFP4 train, 跟 NVIDIA hardware 鎖定；若用 AMD chip 會選 MXFP4

---

## 三、關鍵概念定義

| 術語 | 定義 |
|------|------|
| **Inference Engine** | 從 electricity 變 intelligence 的引擎——scheduling + execution + sampling 的循環 loop |
| **Prefill** | 整 prompt (10K tokens) → 算 activations + 第一個 logit；compute-bound, 像 training |
| **Decode** | 一次生成 1 token（spec decoding 時 3-4 tokens）；memory-bandwidth bound |
| **KV Cache** | Cross-request/session 共用 prefix activations；prefix sharing tree-based lookup；現在已 GPU → CPU DRAM → SSD 三層 |
| **Disaggregated Prefill/Decode** | prefill 跟 decode 用不同 GPU pool, 因 compute characteristics 完全不同 |
| **Tensor Parallelism** | 1T model 必須 split tensor 到多 GPU；1 tensor 切 4-way 或 8-way |
| **MoE (Mixture of Experts)** | Selective activated experts；可分散到不同 GPU |
| **Continuous Batching** | New requests 動態加入 batch——不是等整 batch 結束才加新的 |
| **Megakernels** | 多 operation fuse 為 single kernel——aggressive version of fusion；用於 decode kernel 接近 speed of light |
| **ThunderKittens** | Dan Fu 的 kernel writing library，CUDA-based，instruction-level abstraction，virtualized shared memory |
| **Loop Transformer (Recurrent Transformer)** | Transformer blocks 重複跑——FLOPs ↑ 但 params 不變；Parcae 穩定版本 |
| **State Space Model (SSM)** | Continuous dynamical system x'(t) = A·x + B·u；Parcae 借這個框架分析 loop transformer 數值穩定性 |
| **Spectral Radius** | Matrix norm of A, |A|——若 <1, A^N → 0 收斂; 若 >1, A^N 爆炸 |
| **Negative Diagonal Matrix** | Parcae 設計的 A matrix——diag entries 為負, powered up → 0, stable |
| **SLO (Service Level Objective)** | Inference service agreement——TTFT <1s, total response <X 分鐘 |
| **NVFP4 / MXFP4** | NVIDIA / AMD 各自的 4-bit 浮點格式；訓練時選哪個看 serving chip |
| **DeepSeek MLA** | Multi-latent attention——KV cache 激進壓縮技術 |
| **Cache-aware Prefill/Decode Disaggregation** | Cold request 走 cold pool, warm request 走 warm pool——兩行 routing logic, 達 40% serving 提升 |
| **Compute Optimal** | 給定 FLOP budget, 怎樣 model size 最佳—data / params / recurrence 的 trade-off |

---

## 四、重要引用

> "If you understand inference and understand the inference engines, if you understand the GPU kernels that underlie a lot of the core technology, you can enable full stack innovation in machine learning algorithms." — Dan Fu 的核心 take-away

> "Just like in 1902 there were 130,000 working horses in Manhattan, in 1898 they had academic conferences about what to do about the poop. Ten years later, cars had already outnumbered horses." — 語言模型界也正在經歷 10 年工業革命, 1912 moment 是 last year for him

> "So this is one of those things that in 10, 20 years, they're going to look back on and be like, oh, why are these guys talking about this? Isn't this already obvious?" — Inference research 是早期階段

> "If you do the math on decode, there's actually not too many flops that you need to compute. So it's going to be a relatively light computation, but it's going to be very memory bandwidth bound." — Decode 為什麼需要不同的硬體（NV LPU、Cerebras）

> "Hundred of billions of GPUs are being bought... inference is the piece that turns GPUs into intelligence, just like engines turn oil into motion." — inference 與 engine 類比

> "We are pretty close to 72% of that speed of light. So if you just ignore all the complexities... how fast can the GPU physically go to do this operation? We are pretty close." — Megakernels 在 H100 上達成 near-speed-of-light bandwidth

> "If this matrix can learn to be something like 2. And then this T is like 16 or something, you've now taken this activation, you've blown it up to 2 to the power of 16. And it's really big." — Spectral radius >1 為何爆炸, 用 A^16 = 2^16 解釋

> "Always get better if you make the model bigger and train it on more data. But it really depends on those design points." — Model 大 + data 多 仍 golden rule, 但 design constraints 時可 loop

> "Megakernels, turns out they're very, very labor intensive to write. So to give you some context, a full talented kernel engineer over the course of a year, will probably be able to write Megakernels for one hardware for two or three models for batch sizes 1 to 16. Go batch size 17, he was like nope, start over." — Megakernel 寫作成本

> "The tradeoff is people's blood, sweat, and tears." — Megakernels 的關鍵 tradeoff

---

## 五、人物 / 角色分析

**Dan Fu**：Stanford PhD, 現在同時在 UCSD 開實驗室 + 在 Together AI 做 research；研究主軸是 inference-side 完整 stack (KV cache eviction, routing, kernels, recurrent architectures)。Dan 的 guest lecture 顯示三個特性：(1) Industrial awareness——清楚 GPU / LPU / SSD / DRAM 成本結構；(2) Hardware-aware system thinking——Megakernels 接近 speed of light bandwidth utilization, Cache-aware routing 提 40%；(3) Architectural creativity——Parcae 用 SSM 數學解 loop stability, 找到 negative-diagonal A 約束。Dan 對 hype 持平——"Twitter dude said Claude mythos is recurrent, I think he made it up; he later apologized"；同時對 incremental ops 也有 sense of humor——production bug "model 開始用中文思考 然後 veer off into Chinese" 的 kernel off-by-I。

**Together AI**：研究 + production inference platform，主要 GPU cloud，提供訓練/微調/inference 服務。Dan 在 Together 把 Megakernels 等研究成果在 production 落地。

**UCSD**：Dan 開的實驗室，主推 Parcae (loop transformer) 等 architecture-level research。

**NVIDIA**：NVl72 Grace Blackwell 把 72 GPUs 用 NVLink 串起來;Groq LPU (NVIDIA 買下 Groq) 針對 decode workload;NVFP4 是 NVIDIA 專屬格式

**DeepSeek**：發布了基於 Megakernel 的 MoE inference layer, 把 NCCL communication fuse 進 kernel——Dan Q&A 提到的 killer use case

---

## 六、核心主旨總結

Dan Fu 的 guest lecture 把 inference 升格為 ML research 的 first-class topic。核心 takeaway：**Inference ≠ 模型大小的 inverse——它是 GPU kernel、cache hierarchy、routing、co-design 等多層系統設計**;具體三項研究：(1) **Cache-aware prefill/decode disaggregation**——cold vs warm 分 pool, 兩行 routing 達 40% serving 提升; (2) **Megakernels**——把 decode 多 operation fuse 成 single kernel, H100 達 72% bandwidth (near speed of light), 但寫作成本極高 (一人一年 1 hardware × 2-3 models × batch 1-16); (3) **Parcae (stabilized loop transformer)**——用 State Space Model 數學框架分析 loop transformer 的 A/B matrices, 觀察到 A^N 在 spectral radius > 1 時爆炸, 改用 negative-diagonal A + linear-norm B 達 stable training; 同時 scaling law 顯示 fixed model size 增大 data 時應同時增大 recurrence; 目前所有 frontier model 都 "no recurrence, big data" 都停在 scaling curve 最左。

**Co-design inference 與 architecture 不可分**——NVFP4 是 NVIDIA 鎖定、MXFP4 是 AMD、DeepSeek MLA 是 KV cache 激進壓縮、bidirectional (BERT) vs causal attention 由 use case 驅動。**Inference 研究早期**——10-20 年後回頭看會覺得 "isn't this obvious now?" 但現在每個看似簡單的 routing / kernel / cache 設計都還有巨幅改進空間。**對 CS336 學生最大訊息**：理解 inference / GPU kernel 等於開啟 full-stack ML 創新——別只在 model side 想改進。

---

## 七、金句摘錄

- "If you understand inference and understand the inference engines, you can enable full stack innovation in machine learning algorithms."
- "Just like in 1898 they had academic conferences about what to do about the horse poop. Ten years later, cars had already outnumbered horses."
- "Inference is the piece. So you can think of inference as the engine that turns electricity into intelligence."
- "Decode is very memory bandwidth bound. You're not doing that much compute, but you still have to load up all the model weights at the same time."
- "Decoding 1 token requires running the whole model. So instead of using all this big parallelism, you've now turned this massively parallel system into basically a glorified memory loader."
- "We are pretty close to 72% of that speed of light."
- "If this matrix can learn to be 2, and T is like 16, you've blown it up to 2 to the power of 16."
- "Always get better if you make the model bigger and train it on more data. But it really depends on those design points."
- "Megakernels require people's blood, sweat, and tears."
- "The tradeoff is people's blood, sweat, and tears."
- "We're all at the very left of these curves. So they all have a ton of data, which suggests that there might be something slightly better that we could be doing."
- "It's GPU memory that ends up being the biggest bottleneck to serving inference efficiently."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 XX 秒
> 口播稿原文：transcripts/20260605_StanfordCS336_Guest_DanFu_口播稿.txt

- [opus X MB](../audio/20260605_StanfordCS336_Guest_DanFu_口播稿.opus)（Telegram 友善）
- [m4a X MB](../audio/20260605_StanfordCS336_Guest_DanFu_口播稿.m4a)（iOS 友善）
- [mp3 X MB](../audio/20260605_StanfordCS336_Guest_DanFu_口播稿.mp3)（通用格式）
