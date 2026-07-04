# 【Stanford CS336 Language Modeling from Scratch — Lecture 3: Architectures & Hyperparameters】

**主講：Tatsu Hashimoto｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/lVynu4bo1rY
> 影片時長：1 小時 29 分 14 秒（5354s）
> 性質：大學課程第三講 — 現代 transformer 變體與超參數選擇
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260415_StanfordCS336_Lecture3_Architectures_逐字稿.txt
> **整理日期**：2026-04-07
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

CS336 第三講由 Tatsu Hashimoto 主講,主題是「everything you didn't want to know about architectures and hyperparameters」。Tatsu 自嘲架構設計一直很 inscrutable(難以捉摸),所以這堂課走 survey 路線——快速走過現代所有重要 paper,從中歸納出「大家都同意的設計選擇」與「可以隨意變動而不影響表現的彈性參數」。

內容分兩大塊:**Layer norm / activation / positional encoding 等「幾乎標準化」的設計**——Tatsu 直接展示 12+ 個現代 LLM 的設計表格,指出大家在 RMSNorm、pre-norm、SwiGLU 等選擇上已高度收斂;**Architecture hyperparameters 的彈性帶**(head dim、aspect ratio、vocab size 等)——透過 Kaplan et al. 的 ablation 圖,證明這些超參數存在寬廣的「forgiving band」。最後延伸到 **scaling 時如何保持選擇一致**——這是 hyperparameter transfer 的實務面。

**核心議題一句話**:現代 transformer 已經高度標準化,真正影響模型表現的是「**FLOPs 規模**」與「**hyperparameter transfer**」——選錯 architecture 不會差太多,但選錯 FLOPs / 不能 scale 一致性,模型就完全沒救。

---

## 二、章節脈絡

### Section 1｜開場:架構設計的 survey 哲學（00:00 ~ 05:00）

**重點摘要:** 不可能窮舉所有架構,只能從別人的經驗學起;重點是「哪些參數是固定的、哪些可以變動」。

**內容:**
- 「everything you didn't want to know about architectures and hyperparameters」——涵蓋所有現代 paper
- 學架構最好方式是「自己 train 不同架構」,但 compute / 時間不夠
- 次好方式是「從別人的經驗學起」——survey 視角
- 透過比較 modern transformer,看哪些參數**跨模型固定**、哪些可以**變動不影響表現**

---

### Section 2｜Layer Norm:RMSNorm 統一江湖（05:00 ~ 25:00）

**重點摘要:** Layer norm 已標準化為「pre-norm + RMSNorm + 無 bias」;移除 bias 是免費的 systems win。

**內容:**
- **為什麼 layer norm 在殘差 stream 內外有差**:在 transformer 內會有 gradient attenuation 問題,深度增加時尤其嚴重
- **Layer norm vs RMSNorm**:RMSNorm 省掉 mean-centering 步驟,運算量略減;實際效能差異不大但**arithmetic intensity 較高**
- **Layer norm 的 arithmetic intensity 極低**——大部分 workload 是 memory movement,而非 contraction——是「free optimization」
- Google 2020 論文:200M 參數 transformer 換 RMSNorm → steps/sec 提升 + 效能不降
- **Bias terms**:原始 transformer 線性層都有 bias,但現代實作幾乎全部移除
  - Memory intensive 而非 arithmetic intense
  - 部分 case 還會引起 stability 問題
- 結論:**layer norm 設計已高度標準化**(pre-norm + RMSNorm + 無 bias)——大家選擇 Llama 2 路線,然後集體轉向

> "It's like a free systems win by just moving to RMS norm."

---

### Section 3｜Activation Zoo:SwiGLU 是事實標準（25:00 ~ 50:00）

**重點摘要:** 從 ReLU → GELU → SwiGLU 的演進;gated linear unit 是現代 LLM 的事實標準,除了 Falcon 之外幾乎都用。

**內容:**
- Activation 種類:ReLU、GELU、Swish、ELU、GeGLU、SeLU、SwiGLU、LiGLU
- Chinchilla 用 ReLU、GPT-3 用 GELU——這兩個都是 perfectly fine 的選擇
- **現代主流:SwiGLU / GeGLU(GLU 系列)**
- Gated linear unit 概念:`XW1` 通過 ReLU 後用 `XV` element-wise 乘以 gate——modulate output
- 公式推導:`output = (X W1 ⊙ X V) W2`,其中 ⊙ 是 element-wise product
- Tatsu 自嘲:以前統計 ML 訓練時以「永遠不學 SwiGLU」為傲,現在發現超重要
- 為什麼 GLU 好:gating 提供額外 capacity,且不大幅犧牲 arithmetic intensity

---

### Section 4｜Positional Encoding:RoPE 統一主流（50:00 ~ 75:00）

**重點摘要:** RoPE 已成為 2024 後 model 的事實標準;核心概念是「rotation in 2D pairs」實現相對位置。

**內容:**
- 為什麼 positional encoding 重要:attention 本身**位置獨立**——沒有 encoding 就分不出 "dog bites man" vs "man bites dog"
- 演進:sine/cosine(Fourier 直覺)→ absolute embeddings(每個位置一個 vector)→ relative embeddings(T5, Chinchilla,在 attention matrix 加 bias)→ **RoPE**
- **RoPE 是相對位置 encoding**:inner product 只跟位置**差**有關,跟絕對位置無關
- **RoPE 實作**:把 D 維向量切成 D/2 個 2D pairs,每個 pair 按位置旋轉
  - 低頻旋轉 → 捕捉 long-range dependence
  - 高頻旋轉 → 捕捉鄰接關係
- **RoPE 起源**:出自一篇「not very well known」的 GPT-J 時代 paper,作者在中國——「kind of came out of nowhere」但數學上極漂亮
- **為什麼 RoPE 重要**:inner product invariance to arbitrary rotation 自然滿足「相對位置」性質,前面的方案都沒真正滿足

> "There's no inner product structure that you can extract out of the previous embeddings."

---

### Section 5｜架構設計總表（75:00 ~ 85:00）

**重點摘要:** Tatsu 展示 12+ 個現代 LLM 的設計表,視覺化展示「設計高度標準化」。

**內容:**

| 模型 | Layer Norm | Serial/Parallel | Pre/Post Norm | GLU? |
|------|------------|-----------------|---------------|------|
| Llama 2 | RMSNorm | Serial | Pre-norm | SwiGLU |
| Mistral | RMSNorm | Serial | Pre-norm | SwiGLU |
| Qwen2 | RMSNorm | Serial | Pre-norm | SwiGLU |
| GPT-NeoX | LayerNorm | Serial | Pre-norm | SwiGLU |
| DeepSeek-V3 | RMSNorm | Parallel | Pre-norm | SwiGLU |
| Phi-3 | RMSNorm | Serial | Pre-norm | SwiGLU |
| Falcon | LayerNorm | Serial | Pre-norm | GLU(非 SwiGLU) |
| Gemma | RMSNorm | Serial | Pre-norm | GeGLU |

- 共同特徵:RMSNorm + serial + pre-norm + GLU 變體——**設計空間已大幅收斂**

---

### Section 6｜Head Dimension:1:1 比例是 safe default（85:00 ~ 95:00）

**重點摘要:** Head dim ≈ D / H(模型 dim 除以 head 數);約 1:1 比例是現代 LLM 的 safe default。

**內容:**
- T5 與 Lambda 例外,大部分模型 head dim 等於 D/H
- 這是「**forgiving hyperparameter**」——寬廣的 basin 約 1:1 都能 work
- 不是最 critical 的超參數;但在 scaling 時要保持一致

---

### Section 7｜Aspect Ratio:深度對寬度,大約 100:1（95:00 ~ 110:00）

**重點摘要:** D / L(模型 dim 除以 layer 數)大約 100——大部分現代 LLM 在這個 sweet spot。

**內容:**
- GPT-3、Llama、Qwen 等都落在 ~100
- **為什麼不是越深越好**:deep model pipeline parallel 極難處理——大部分人不願碰
- **為什麼不是越寬越好**:雖然 width 容易 parallelize(tensor parallel),但 expressiveness 可能不夠
- Expressiveness vs hardware 取捨 → 收斂在 ~100
- Kaplan et al. ablation:不管模型大小,**最佳 aspect ratio 都約 100**
- ETA 等人的 variation experiments:**唯一真正重要的是 FLOPs**,aspect ratio 在寬廣 band 內變動影響不大

> "The only thing that matters in some sense is FLOPs."

---

### Section 8｜Vocabulary Size:多語 vs 單語差異極大（110:00 ~ 125:00）

**重點摘要:** 多語模型 vocab 100K ~ 200K,單語(English-only)模型約 30K;模型越大 vocab 可越大。

**內容:**
- 早期 open-source 多為 English-only(vocab ~30K)
- Post-Llama 開始 multilingual / production system(vocab 100K ~ 200K)
- Google 模型 vocab 最大;Llama 衍生 ~100K;單語 ~30K
- **為什麼 vocab 不是越大越好**:Scaling law 顯示大模型才能 handle 大 vocab——小模型 vocab 過大會 over-parameterize embedding layer
- **Multimodal**:圖片 token 需要獨立 vocab,大小更大

---

### Section 9｜Scaling 與 Hyperparameter Transfer（125:00 ~ 結束）

**重點摘要:** Scaling 時**保持 hyperparameter 比例一致**(aspect ratio、head dim ratio),不要重新搜尋。

**內容:**
- Kaplan et al. ablation 圖:不同模型大小下,**最佳 aspect ratio 大致相同**
- 換言之,scale up 不是「重新 tune 所有東西」,而是**保持比例**
- 這呼應 Lecture 1 的「hyperparameter transfer」概念:可預測性比最優性重要
- Scaling 時真正要 care 的是:**FLOPs 規模**與**systems utilization**
- Architecture 細節差異在 1% 內,FLOPs 規模差異可達 10x

> "There's a general forgiving band of hyperparameters... and then you really worry about primarily your systems utilization."

---

## 三、關鍵概念定義

| 概念 | 定義 | 本講脈絡 |
|------|------|---------|
| **RMSNorm** | Layer norm 簡化版,只做 RMS 縮放不做 mean centering | arithmetic intensity 高、free systems win |
| **Pre-norm** | Layer norm 放在 residual stream 之外、attention 之前 | 移除 warm-up 需求、gradient attenuation 友善 |
| **SwiGLU / GeGLU** | Gated linear unit;output = (XW₁ ⊙ XV) W₂ | 現代 LLM 事實標準 |
| **RoPE** | Rotary Position Embedding;透過 2D 旋轉實現相對位置 | 2024 後 model 主流 |
| **Arithmetic Intensity** | FLOPs / bytes;決定 memory-bound 或 compute-bound | layer norm 偏低、matmul 偏高 |
| **Aspect Ratio** | 模型 dim(D)/ layer 數(L);sweet spot 約 100 | scaling 時保持 |
| **Head Dimension Ratio** | 每個 head 的 dim / 模型 dim;約 1:1 | forgiving hyperparameter |
| **Hyperparameter Transfer** | 小 scale 的超參數選擇可延伸到 large scale | 預測性比最優性重要 |
| **Forgiving Band** | 超參數的「寬廣安全區」,偏離一點不影響表現 | aspect ratio、head dim 都是 |

---

## 四、人物 / 角色分析

| 人物 | 角色 | 背景 |
|------|------|------|
| **Tatsu Hashimoto** | 主講 | CS336 共同授課,負責 architectures 與 scaling;自嘲「每年重做所有 lecture 因為 architecture 變太快」 |
| **Llama 2 設計** | 隱形主角 | RMSNorm + pre-norm + SwiGLU 的設計事實上成為業界標準 |
| **RoPE 作者** | 引用人物 | 中國研究者,「not very well known」但提出改變格局的 paper |
| **Kaplan et al.** | 引用文獻 | OpenAI 2020 scaling laws paper,提供 hyperparameter ablation 圖 |
| **Noam Shazeer** | 引用人物 | SwiGLU 作者(從 Lecture 1 持續出現) |
| **Google 2020 Get-All** | 引用文獻 | RMSNorm 實證 paper |
| **ETA** | 引用文獻 | architecture variation experiments 結論「只有 FLOPs 重要」 |

---

## 五、核心主旨總結

現代 transformer 已經高度標準化:RMSNorm + pre-norm + SwiGLU + RoPE 是 12+ 個現代 LLM 的共同選擇,真正的設計空間在「**架構細節差 1%、FLOPs 規模差 10x**」這個層級。對 scaling 來說,關鍵不是重新 tune 所有超參數,而是**保持比例**(aspect ratio ≈ 100、head dim ratio ≈ 1:1)——這就是 hyperparameter transfer 的實務面。Tatsu 提醒:**架構選擇的 forgiving band 很寬**,但在寬廣 band 內的選擇不能跨 scale 變化無常——那會破壞可預測性,比選錯更糟。

---

## 六、金句摘錄

> "Architecture from the original transformer paper is pretty close to what we do."(Tatsu)

> "It's like a free systems win by just moving to RMS norm."

> "There's no inner product structure that you can extract out of the previous embeddings."(RoPE 數學優勢)

> "The only thing that matters in some sense is FLOPs."

> "There's a general forgiving band of hyperparameters that people tend to choose."

> "If I would have to predict the future, hyperparameter transfer is going to be the name of the game."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260415_StanfordCS336_Lecture3_Architectures_口播稿.txt

- [opus X.X MB](../audio/20260415_StanfordCS336_Lecture3_Architectures.opus)（Telegram 友善）
- [m4a X.X MB](../audio/20260415_StanfordCS336_Lecture3_Architectures.m4a)（iOS 友善）
- [mp3 X.X MB](../audio/20260415_StanfordCS336_Lecture3_Architectures.mp3)（通用格式）