# 【Stanford CS336 Language Modeling from Scratch — Lecture 17：Alignment — Multimodality】

**主講：Percy Liang ｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/26FtD08ZpOU
> 影片時長：1 小時 17 分 39 秒（4659s）
> 性質：大學課程第十七講 — Post-Training 系列第三講：Multimodal Alignment——CLIP/SigLIP 視覺編碼器、LLaVA/Qwen 系列 VLM、Chameleon 全模態統一、Understanding vs Generation 不對稱
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260604_StanfordCS336_Lecture17_AlignmentMultimodality_逐字稿_en.txt
> **整理日期**：2026-06-04
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Lecture 17 把 post-training 拉到「multimodality 對齊」，主軸是 vision language model（VLM）如何把 image 注入 transformer。Percy Liang 開宗明義：transformer 仍是最通用的跨模態 backbone（試過其他架構在 scale 下都沒贏），關鍵是把所有 modality 變成 transformer 吃得下的 tokens。文字原本就是 subword tokens；圖像需要 patch-based tokenization（continuous 或 discrete），音訊也需要 encoder——這給 lecturer 兩個問題：如何輸入（focus）、如何輸出（後續）。

本講沿著 2021 → 2026 演進的時間軸：CLIP（2021, OpenAI, contrastive image-text pretraining）→ SigLIP（Google, sigmoid loss 解 batch size 困境）→ LLaVA 2023（CLIP + 線性 projector + Vicuna, 兩階段訓練）→ LLaVA OneVision 2024（SigLIP + Qwen-2 + MLP projector + AnyRes dynamic resolution）→ Qwen-VL 系列（2023-2025 三代演進：OpenCLIP → dynamic resolution → Multimodal RoPE → explicit video timestamps → DeepStack deep fusion）→ Chameleon 2024（Meta, VQ-VAE 全部離散化實現原生全模態, training 不穩定）→ 反思 natively multimodal 與 understanding/generation 的不對稱。

**核心議題一句話**：Multimodal alignment 的核心是把 vision encoder 的 continuous embedding 注入 language model——CLIP/SigLIP 是雙編碼器 contrastive baseline、LLaVA/Qwen 是「encoder + projector + LLM」的 modular 拼裝路線（主流, AnyRes 處理高解析、DeepStack 做 deep fusion、M-RoPE 把 3D 位置編碼打通）、Chameleon 走 VQ-VAE 全離散化的原生路線（優雅但 training 不穩且 discrete 損失細節）；understanding 與 generation 是本質不對稱——前者需要 high-level semantic encoder, 後者需要 diffusion 級 fine-grained 生成器。

---

## 二、章節脈絡

### Section 1｜開場：為什麼講 multimodality（00:00 ~ 06:00）

**重點摘要：** Transformer 仍是最通用跨模態 backbone；omni model 終極目標是任意模態輸入輸出；關鍵是 tokenization。

**內容：**
- 本講原訂是 RL 進階，但 multimodality 在所有 major model 裡無所不在，一個 lecture 不講會讓課程不完整
- Omni model 北極星：任意模態輸入（image + video + text）輸出（任意模態），例如「給 image + video 問問題」、「產生 image」、「audio 轉 image」
- 本講聚焦 question 1（input 怎麼轉成 tokens）, 不會蓋到 generation
- Tokenization 推廣：text 用 subword token（已有 BPE tokenizer 經驗）；image / audio / video 必須轉成 discrete 或 continuous tokens（每個 token 是一個 semantic unit）

### Section 2｜CLIP 起源：Contrastive Language-Image Pre-training (2021)（06:00 ~ 18:00）

**重點摘要：** CLIP 用 400M 圖文對做 contrastive learning；用對齊 dot product + softmax 拉近配對、推開非配對。

**內容：**
- 2021 之前：vision model 都 train 在 ImageNet 等 annotated dataset（大量 Mechanical Turk 標註）
- OpenAI 受 GPT「scrap noisy internet text」啟發：image 也可以 scrape web image-text 對
- CLIP objective：對 batch 內 N 個 (image, text) 對，做 2N 個 softmax classification（N 個 image-to-text + N 個 text-to-image）, label 是 diagonal
- Dot product with temperature, normalize embeddings, cross-entropy loss
- 訓練資料 400M image-text pairs（LAION-5B 公開版釋出 5B pairs）
- Figure-grounding 限制：images resize to short side 336, center crop square；CLIP 設計 for classification, fine-grained perception 不在目標內

### Section 3｜Vision Transformer (ViT) + CLIP Image Encoder (14:00 ~ 26:00)

**重點摘要：** CLIP 用 ViT-L/14 (24 layers, 14×14 patches)；CLIP 結論：CLIP-ViT zero-shot 在 ImageNet 打敗 ResNet trained on 1.2M labels。

**內容：**
- ViT 操作：把 image 切成 14×14 patches, 每個 patch 加 position embedding, 進標準 transformer
- 從 ViT 拿單一向量：attention pooling (global average + another round of attention with query) 比直接 average 好
- CLIP-ViT-L/14 = 24 layers, 14×14 patches, 3 channels RGB, 336×336
- High-resolution training：先低解析速度, 後段升 336×336
- Positional embedding：線性 0-9 即可, 2D-aware 嘗試但 win 不大（可能是 classification 任務太簡單）
- Text encoder：GPT-2 style transformer, prepend BOS + append EOS, take EOS activation last layer
- Zero-shot prediction：給 image + 一堆 label texts, 選 dot product 最大者
- 關鍵 headline：0-shot CLIP 打敗 ResNet trained on 1.2M ImageNet labels（CLIP 不用任何 manual annotation）

### Section 4｜SigLIP (Google)：Sigmoid Loss 解放 Batch Size (26:00 ~ 36:00)

**重點摘要：** SigLIP 把 softmax 多分類改為 sigmoid 二分類（對角線 +1, 其他 −1）；batch size 完全解耦。

**內容：**
- CLIP 兩個痛點：需要 30K+ 大 batch size、softmax 操作 over 整 batch 不可分解
- SigLIP 改為 binary classification：對角線 +1、off-diagonal −1、用 log_sigmoid loss
- 訓練效率：WebLI dataset (10 billion image-text pairs, multilingual, 含 OCR)；CLIP 需 10 天 on 256 TPUv3，SigLIP 5 天 on 32 TPUv4（v4 雖 flops/sec 較慢但 interconnect 強, 並沒比較快, 主要是 softmax 解構的可平行化）
- 訓練平行化（DDP-style）：每個 device 算自己的 loss, 然後 rotate texts 算所有 off-diagonal block entries
- Batch size 完全解耦：用 16K batch 就比 CLIP 好, 可實驗更小 batch 不會變不同 loss
- WebLI 1B-10B 規模, OCR 處理含文字的 images
- 結論：critical batch size 32K, 超過沒幫助；SigLIP 全面贏 CLIP 效率

### Section 5｜LLaVA 2023：CLIP + Projector + LLM 模板 (36:00 ~ 50:00)

**重點摘要：** LLaVA 三大件：CLIP (vision encoder) + linear projector (W) + Vicuna (LLM)；兩階段訓練。

**內容：**
- LLaVA 拿到 2023 attention：open model 也能做視覺推理（雖不如 GPT-4, 但開源）
- 三大件組合：CLIP (VIT-L/14) → linear matrix W → Vicuna LLM (第一個 ShareGPT 微調的 Llama)
- 訓練資料：MS COCO captions + bounding boxes, 叫 GPT-4 用 captions / detected objects 生成 conversations / detailed descriptions / complex reasoning → 158K 合成 examples
- 兩階段訓練：Stage 1 alignment（只 train W, 凍 vision encoder 和 LLM）→ Stage 2 fine-tune（凍 vision encoder, train W + LLM）
- 三大設計選擇：CLIP embeddings 不是 LLM space, W 把 image 映射到 LLM token space；對齊只需 158K 對話 examples；產出 model 能做視覺 reasoning
- 範例：給 "what's unusual about this image?" 問 ironing on minivan 後面, model 答得出（GPT-4 等也會答, 但同期其他 open models 不行）

### Section 6｜LLaVA OneVision 2024：SigLIP + Qwen-2 + AnyRes (50:00 ~ 65:00）

**重點摘要：** LLaVA OneVision 用 SigLIP + Qwen-2 + 兩層 MLP projector；AnyRes 動態解析度處理 OCR 細節；多階段訓練。

**內容：**
- 三大升級：SigLIP 取代 CLIP (eff)；Qwen-2 (當時 SOTA LLM) 取代 Vicuna；projector 升級兩層 MLP
- AnyRes 動態解析度：CLIP 固定 336×336 crop 不能讀文件（OCR 沒救）；AnyRes 把 image 切成多塊, 每塊 336×336 各自編碼, 再 concate vectors（adaptively 配合 transformer 的可變長輸入）
- 應用範圍：single image (最多 9 crops) / multi-images (base resolution) / video (32 frames, lower res per frame)
- 三階段訓練：Stage 1 alignment (只 train projector) → Stage 2 (high quality knowledge data) → Stage 3 (task-specific)
- 資料哲學：curate high quality task data + GPT-4 蒸餾（無 annotation budget 下唯一辦法）
- 跨模態 transfer：只在 single image 訓練 OCR、只在 multi-image 訓練 relational reasoning, 但能 generalize 到 GUI agents (多 screenshots → 描述) 與 video visual prompting (highlight player across frames)

### Section 7｜Qwen-VL 系列演進 (65:00 ~ 90:00)

**重點摘要：** Qwen-VL → Qwen-2-VL → Qwen-3-VL 三代升級——OpenCLIP → dynamic resolution → SigLIP-2；單層 cross-attention → M-RoPE (3D) → interleaved M-RoPE + explicit video timestamps + DeepStack deep fusion。

**內容：**
- Qwen-VL 2023：OpenCLIP vision encoder + 單層 cross-attention adapter (2D positional) + 固定 256 tokens；special tokens (image / box / ref)；三階段訓練 (凍 LM 預訓練 → train vision+adapter 高品質 → instruction tune)
- Qwen-2-VL：升級到 dynamic resolution（每 image 8 tokens、equation 8 tokens、複雜 paper 11K tokens）；Multimodal RoPE 把 RoPE 推到 3D (height × width × time)；2×2 patch compression 後每 224×224 → 66 tokens；video 2fps, max 16K tokens
- Qwen-3-VL：使用 SigLIP-2（架構相同、backward compatible）；改進 M-RoPE 把 three-axis dimension 交錯（避免 low/high freq 全集中在一個 axis）；explicit video timestamp tokens（"0 second" 獨立可被 reference）；square root per-token loss normalization（避免 video example 壓過 text）；DeepStack adapter（vision encoder 每一層輸出直接加入 LLM residual stream, deep fusion）
- 訓練 pipeline 越來越複雜：Qwen-3-VL 預訓練 4 階段 (8K → 32K → 256K) + post-training 3 階段 (SFT long CoT → distillation → RL)
- 資料量：scaling up + curating, 末期細節不多（Qwen paper 較 high-level）
- Vision encoder 參數通常 < 1B（patch 是 local operation, 大部分 knowledge 在 LLM）；LLaVA 72B LLM + 投影器 72M + ViT < 1B

### Section 8｜Chameleon (Meta 2024)：全離散原生全模態 (90:00 ~ 100:00）

**重點摘要：** Chameleon 用 VQ-VAE 把 image 變 1024 discrete tokens from 8000-code vocab；一次 LLM 即可 understanding + generation；但 training 不穩、OCR 不行。

**內容：**
- Chameleon 動機：VLMs 只能產文字, 不能 generate images；解法之一是把 diffusion head 接上去；Chameleon 走另一條：image 也變 discrete tokens, 全部 LLM
- VQ-VAE (van den Oord 2017)：encode image → continuous vector → round 到 8000-prototype codebook 最近的 code → decode 重建 image, train by reconstruction loss
- 512×512 image → 1024 tokens 從 8000 vocab；1 image 之後就跟 text 一樣處理, 訓練就是一般 LM 訓練
- 兩階段：bulk unsupervised (text + image) → mix in high quality data
- 三大問題：訓練不穩定（text token 低 entropy、image token 高 entropy, 混在一起 norm 爆掉）、discretization 損失細節（OCR 細小文字 / 高頻影像資訊都會掉）、實務表現不如 modular 方案
- 緩解：QK norm + z-loss regularization 控制 norm growth

### Section 9｜Omni Models 反思與 Understanding/Generation 不對稱 (100:00 ~ end)

**重點摘要：** Frontier model 都號稱 natively multimodal；understanding 需 high-level semantic encoder, generation 需 diffusion 級 fine-grained generator——這是本質不對稱。

**內容：**
- Gemini / GPT 系列標榜 natively multimodal, 但具體架構不公開（推測是 continuous encoder + diffusion 的組合）
- 三個關鍵 insight：
  1. **沒有 universal encoder**：CLIP-high-level-semantic-classification vs OCR / image-generation low-high-frequency-detail 需求相反——一個 encoder 沒辦法同時 cover
  2. **Understanding vs Generation 不對稱**：理解圖片要 high-level semantic, 產生圖片要 fine-grained detail（diffusion 在這方面強）
  3. **Modality weighting**：video 信息密度遠低於 text, 訓練時不應讓 video 壓過 text（Qwen-3-VL 用 √L normalization、Qwen team 一直調 data mixture weighting）
- 最終總結：transformer 仍是 backbones、continuous encoders (CLIP-style) 仍是最主流 understanding 方案、diffusion models 才是 generation 主力
- 不要混為一談：理解模態 ≠ 生成模態, 一個 encoder 滿足不了所有需求

---

## 三、關鍵概念定義

| 術語 | 定義 |
|------|------|
| **Omni Model** | 終極目標——任意模態輸入、任意模態輸出的模型；例如 image + video 同時輸入 → 產生 text + image |
| **CLIP** | Contrastive Language-Image Pre-training——2021 OpenAI 提出，image-text 對用 dot product + softmax contrastive learning；400M 對訓練 |
| **Contrastive Learning** | 拉近配對 image / text 的 dot product，推開非配對；CLIP / SigLIP 都在此範式 |
| **ViT (Vision Transformer)** | 把 image 切成 patches (14×14), 加 position embedding, 進標準 transformer；CLIP 採 ViT-L/14 |
| **Attention Pooling** | ViT 結尾取單一向量的方法：global average 再加另一輪 attention；比直接 average 好 |
| **SigLIP** | Sigmoid Loss for Language Image Pre-training——Google 改進, 用 sigmoid loss (binary) 取代 softmax；batch size 可任意小 (16K 比 30K 更好) |
| **VLM (Vision Language Model)** | Vision Encoder + Projector + LLM 三大件；LLaVA / Qwen 都此架構 |
| **LLaVA** | 2023 第一個 open VLM；CLIP + Linear Projector + Vicuna + 兩階段訓練；MS COCO 158K 合成資料 |
| **AnyRes** | 動態解析度——把大 image 切成多 336×336 patches 個別編碼再 concate vectors；OCR 細節不流失 |
| **Projector / Adapter** | 把 vision encoder output 映射到 LLM input space 的模組；線性 → MLP → cross-attention → DeepStack deep fusion 演進 |
| **M-RoPE (Multimodal RoPE)** | RoPE 從 1D 推廣到 3D (height × width × time)；Qwen-2-VL 用之；Qwen-3-VL 改成交錯以避免 low/high freq 全集中在一個 axis |
| **DeepStack** | Vision encoder 每一層的 output 直接加入 LLM residual stream；deep fusion 而非 black-box output 模式；DeepSeek 團隊提出 |
| **Square Root Per-token Loss Normalization** | Qwen-3-VL 用 √L normalization 讓 long video example 不壓過 short text example |
| **VQ-VAE** | Vector Quantized VAE：encode image → continuous vector → round to nearest codebook entry → discrete token；Chameleon 用之 |
| **Chameleon** | Meta 2024 全離散原生全模態——所有 modality 都先 VQ-VAE 變 discrete tokens 進同一個 LLM；elegant 但 training 不穩、OCR 不行 |
| **Natively Multimodal** | Frontier model（Gemini / GPT 系列）聲稱從 base 就原生支援多模態，不似舊 VLM 是 modular 後接；但架構細節常不公開 |
| **Understanding vs Generation Asymmetry** | 理解模態需要 high-level semantic encoder, 生成模態需要 fine-grained detail generator——本質不對稱、無 universal encoder |

---

## 四、重要引用

> "Despite the best efforts of people to try other things, those are across all of these modalities still at scale the best thing we have." — Percy Liang 強調 transformer 仍是多模態 SOTA backbone

> "CLIP, in some sense, is a lot simpler [than SigLIP]... it basically says for any given image text pair, are they aligned or not?" — SigLIP binary classification 是對 CLIP multi-class 的根本簡化

> "Most of the capabilities of the model are still in the language model... the vision encoder is in some sense doing a very local operation." — Vision encoder 參數遠小於 LLM 因為 patch 是 local operation

> "Transformers want things to be fixed size... One thing that you learn about neural nets is that they don't like things to be dynamic." — 解釋為什麼 CLIP 需要 resize + center crop, 為什麼 AnyRes 是進步

> "This is a bit more of a deep fusion of the vision encoder into the language model as opposed to the vision encoder is a black box that just outputs a sequence of vectors." — DeepStack 改變 VLM 整合方式

> "There's a certain elegance here because it's just one model that treats really all modalities the same. But the downside is that it turned out this model was not really as performant, and the discretization does definitely lose its information." — Chameleon 的 elegance vs performance 取捨

> "There's no one universal encoder... for example, when we looked at CLIP, you only cared for classification to capture high level semantics. Whereas if you wanted to do OCR or whether you wanted to generate an image, then you need really fine-grained detail." — Multimodal 沒有 single universal encoder 涵蓋所有需求

> "If you take arbitrary images on and text on that web, it's probably going to be way too noisy." — 對 raw image-text pair 的 noise 警告, CLIP 必須做大量 filter

> "Just calling things discrete tokens isn't hiding the fact that there's an image living there." — Chameleon 看似統一其實沒解決 text/image 的 entropy 不對稱

---

## 五、人物 / 角色分析

**Percy Liang**：CS336 共同授課教授，Lecture 17 完全由 Percy 主講。Percy 把 multimodal alignment 拆成兩個問題（input/output）並強調 understanding/generation 不對稱——這是他的獨特視角。Percy 對 technical decision 的詮釋精準到位：CLIP 為什麼用 contrastive（high-level semantic, 對 classification 友善）、SigLIP 為什麼去掉 softmax 限制（解 batch size 困境）、Qwen-3-VL 為什麼把 M-RoPE dimension 交錯（避免低/高頻聚集）。Percy 同時對 raw claims 持保留：Chameleon 的 elegance 與不穩定並存、frontier model 的 natively multimodal 可能是 marketing 詞。

**OpenAI CLIP Team (2021)**：Alec Radford 等開創 image-text contrastive pretraining 範式；證明 noisy web data 可取代 curated ImageNet labels。缺點：batch size 卡 30K+、不適合 fine-grained perception。

**Google SigLIP Team**：把 CLIP softmax 改 sigmoid；解 batch size 困境，訓起來更快更便宜。WebLI dataset (1B-10B image-text pairs) 同步公開。

**LLaVA Team (Microsoft / Wisconsin)**：把 vision encoder + LLM 直接拼裝，證明 minimal connector (線性 projector) + 158K examples 就能讓 open model 做視覺推理；開源 weights + data（開放性高）。

**Qwen Team (Alibaba)**：Qwen-VL 系列三代演進展示 VLM 的 systematic 工程化（OpenCLIP → SigLIP-2、線性 → MLP → cross-attention → DeepStack、固定 → dynamic → M-RoPE、3 階段 → 4+3 階段）；Qwen-3-VL 加入 explicit video timestamps、√L loss normalization 顯示對 modality weighting 的極致琢磨。

**Meta Chameleon Team**：走原生全模態另一條路（VQ-VAE 離散化, Chameleon 34B）；showing elegance but acknowledging training instability + OCR degradation；近年因 diffusion model 崛起而此 flavor 較少被 follow。

---

## 六、核心主旨總結

Lecture 17 從 2021 CLIP 一路演進到 2024-2025 的 modular VLM 與 native multimodal。核心 takeaway：**Modular VLM 是目前最穩定方案**——vision encoder (CLIP / SigLIP) + projector (線性 → MLP → cross-attention → DeepStack) + LLM (Vicuna → Qwen-2 → Qwen-3) 三件組；每代升級聚焦 projector architecture (DeepStack deep fusion 取代 black-box 接法)、position encoding (M-RoPE 把 1D 推到 3D height×width×time)、dynamic resolution (AnyRes 處理 OCR / documents)、modality weighting (√L per-token loss normalization 讓 video 不壓過 text)。Vision encoder 參數遠小於 LLM（patch 是 local operation，大部分 reasoning knowledge 在 LLM）。

**Native multimodal（Chameleon）短期內仍是 elegant but unstable**——VQ-VAE 全部離散化的 elegance 吸引人, 但 text/image token entropy 不對稱造成訓練不穩、discretization 損失 fine-grained detail（OCR 不行）。**Understanding vs generation 是本質不對稱**——CLIP-level high-level semantic encoder 對 classification / QA 夠用, 但 OCR / image generation 需要 fine-grained detail, 必須 diffusion model 才能 handle；也沒有 single universal encoder 涵蓋所有需求。

**未來方向**：更好的 modality weighting (video 信息密度 < text 不應壓過)、更深的 cross-modal fusion (DeepStack 是這方向的開端)、更長 context (Qwen-3-VL 達 256K)、generation 端不應期待 single-model unify, 應該 diffusion 當 generation 主力, VLM 專注 understanding。

---

## 七、金句摘錄

- "Despite the best efforts of people to try other things, transformers across all of these modalities still at scale the best thing we have."
- "CLIP, in some sense, is a lot simpler... it basically says for any given image text pair, are they aligned or not?"
- "The vision encoder is in some sense doing a very local operation."
- "Transformers want things to be fixed size."
- "This is a bit more of a deep fusion of the vision encoder into the language model."
- "Just calling things discrete tokens isn't hiding the fact that there's an image living there."
- "There's no one universal encoder."
- "Discretization does definitely lose its information."
- "Modular VLM template is going to remain the same... mostly it's scaling up, curating more data sets."
- "If I had to pick back on the same dynamic ability [any resolution]... the transformer is already adaptive."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 XX 秒
> 口播稿原文：transcripts/20260604_StanfordCS336_Lecture17_AlignmentMultimodality_口播稿.txt

- [opus X MB](../audio/20260604_StanfordCS336_Lecture17_AlignmentMultimodality_口播稿.opus)（Telegram 友善）
- [m4a X MB](../audio/20260604_StanfordCS336_Lecture17_AlignmentMultimodality_口播稿.m4a)（iOS 友善）
- [mp3 X MB](../audio/20260604_StanfordCS336_Lecture17_AlignmentMultimodality_口播稿.mp3)（通用格式）
