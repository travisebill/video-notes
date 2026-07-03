# 【Harvard CS224 Advanced Algorithms — Lecture 14：最近鄰搜索與 Locality-Sensitive Hashing】

**主講｜Piotr Indyk（MIT CSAIL 教授，LSH 共同發明人）/ 2014年10月16日 / Lecture #14**

---

> **文章來源**：http://people.seas.harvard.edu/~cs224/fall14/lec/lec14.pdf
> **簡報來源**：http://people.seas.harvard.edu/~cs224/fall14/lec/piotr.pptx
> **Scribe**：Jao-ke Chin-Lee
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節來源**：Lecture notes 6 個章節 + 29 個 slides
> **字幕來源**：N/A（Article 路徑，無原始音檔，僅 TTS 口播稿音檔）

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms（高階演算法）」2014 年秋季學期（f14）的第十四堂課，由 Jelani Nelson 教授主持，邀請到 **MIT CSAIL 的 Piotr Indyk 教授**客座講演，主題是「**Nearest Neighbor Search in High Dimensions（高維最近鄰搜索）**」。Indyk 是 locality-sensitive hashing（位置敏感雜湊，簡稱 LSH）這個領域的共同發明人，這堂課主要圍繞 LSH 展開。

前一堂課（Lecture 13）由 Rong Ge 主講，主題為「學習主題模型」。本日重點是：

- **最近鄰搜索（NNS）**與 **r-近鄰搜索**的嚴格定義
- **維度詛咒（curse of dimensionality）**：為什麼低維解法在高維失效
- **近似最近鄰（Approximate Nearest Neighbor, ANN）**：放寬精確度換取多項式時間
- **Locality-Sensitive Hashing (LSH)**：核心思想、機率保證、放大技巧
- **延伸應用**：Random Projection LSH（L2）、Ball Lattice Hashing、Min-wise Hashing、Jaccard
- **Leech Lattice** 在 24 維空間的特殊結果

引用文獻涵蓋 LSH 經典論文：GIM99、IM98、Cha02、DIIM04、AI06。

---

## 二、章節脈絡

### Section 1｜Overview（總覽）

**重點摘要：** 銜接 Lecture 13（Rong Ge 主講的主題模型），本講由 Piotr Indyk 主講最近鄰搜索。

**內容：**
- 上一講由 Rong Ge 主講主題模型學習
- 本講進入最近鄰搜索，主講者為 Piotr Indyk
- Indyk 是 LSH（locality-sensitive hashing）共同發明人之一
- 本講圍繞 LSH 核心思想展開

---

### Section 2｜Introduction（最近鄰搜索定義）

**重點摘要：** 給出最近鄰搜索與 r-近鄰搜索的形式化定義，並舉出機器學習與文件相似度的應用場景。

**內容：**

**問題定義：**
- **最近鄰搜索（NN）**：給定 n 個點的集合 P ⊆ ℝⁿ，對任何查詢 q，回傳 p ∈ P 使 ‖p − q‖ 最小
- **r-近鄰搜索**：回傳所有與 q 距離 ≤ r 的點（若存在），可視為 NN 的決策版本

**應用領域：**
- 機器學習：影像相似度比對（特徵為像素）、筆跡分析，維度 = 像素數
- 近重複文件檢索：上次課的主題模型延伸應用，維度 = 詞彙數
- 任何需要「找最相似實例」的場景

**低維（d = 2）解法：**
- 建構 Voronoi 圖，把平面切成區域
- 用 BST 找出查詢點所在的格
- 空間 O(n)，查詢 O(log n)

---

### Section 3｜Approximate Nearest Neighbor（近似最近鄰）

**重點摘要：** 揭示維度詛咒的根本困難，引入近似放寬以換取多項式時間。

**內容：**

**高維的難處：**
- d > 2 時 Voronoi 圖大小為 n⌈d/2⌉，不可能儲存
- 線性掃描成本 O(dn)，仍是高維最壞情況下的退化選項
- 兩個重要先驅工作（Dobkin-Lipton'78、Clarkson'88）證明精確解一定有維度指數成本

**c-Approximate Nearest Neighbor：**
- 給定近似因子 c 與點集 P
- 對查詢 q，回傳 p′ ∈ P 使 ‖p′ − q‖ ≤ c·r，其中 r 是真正最近鄰距離
- 即回傳距離不超過真正最近鄰 c 倍的點
- 實務上常見情形：c-ANN 與精確 NN 結果差異極小

**c-Approximate r-Near Neighbor：**
- 給定參數 r 與 c
- 若存在 p ∈ P 使 ‖p − q‖ ≤ r，回傳 p′ ∈ P 使 ‖p′ − q‖ ≤ cr
- 「枚舉所有 c-近似近鄰」可恢復精確解
- 若資料結構回傳空集合（沒有命中點），可雙重確認距離

**隨機化演算法：**
- 多數演算法是隨機化的
- 對任何查詢 q，回傳正確答案的機率（在建構資料結構的隨機性下）至少是常數（例如 0.9）
- 重複執行可把失敗機率壓到任意低

---

### Section 4｜Algorithms（演算法綜覽）

**重點摘要：** 把 ANN 演算法分成指數維度（早期）與多項式維度（LSH 革命）兩類，並列出重要里程碑。

**內容：**

**理論進展時間軸：**

| 階段 | 空間/時間 | 代表工作 |
|------|-----------|----------|
| 早期（指數維度）| d 指數級 | Arya-Mount'93, Clarkson'94, Kleinberg'97, Har-Peled'02 |
| 突破（多項式維度）| d 多項式 | Indyk-Motwani'98, Kushilevitz-Ostrovsky-Rabani'98, IM'98, GIM'99, Cha'02, DIIM'04, AI'06 |

**重點演算法的 ρ(c) 下界（隨時間改進）：**

| Norm | ρ(c) | 出處 |
|------|------|------|
| Hamming, L2 | ρ = 1/c | IM98, GIM99, Cha02 |
| L2 | ρ < 1/c | DIIM04 |
| L2 | ρ = 1/c² + o(1) | AI06 |
| L2 | ρ = 7/(8c²) + o(1/c³) | AINR14 |
| L2 | ρ = 1/(2c²-1) + o(1) | AR15 |

---

### Section 5｜Locality-Sensitive Hashing（LSH 核心）

**重點摘要：** 用 Hamming LSH 作為範例，給出完整的 LSH 定義、演算法與分析。

**內容：**

#### 5.1 Sensitivity 定義

一族函數 H : ℝᵈ → U 對距離 D 是 **(P₁, P₂, r, cr)-sensitive** 若對任何 p, q：

- 若 D(p, q) < r ⇒ P[h(p) = h(q)] > P₁（近點碰撞機率高）
- 若 D(p, q) > cr ⇒ P[h(p) = h(q)] < P₂（遠點碰撞機率低）

**Hamming 距離範例：**
- 令 h(p) = p_i（隨機挑一個 bit 位置）
- D(p, q) 為 Hamming 距離
- 碰撞機率 = 1 − D(p, q)/d

#### 5.2 演算法

定義 g(p) = ⟨h₁(p), h₂(p), …, h_k(p)⟩（k 個雜湊函數串接）。

**預處理：**
- 隨機獨立選 g₁, …, g_L（k, L 是 c, r 的函數，稍後計算）
- 對每個 p ∈ P 算出 g₁(p), …, g_L(p)，把點丟進對應桶子

**查詢：**
- 從桶子 g₁(q), …, g_L(q) 撈點
- 直到撈完所有 L 桶，或累計超過 3L 點為止
- 從撈到的點中回傳答案
- 總時間 O(dL)

#### 5.3 分析

**Lemma 6（主要結果）：** 演算法解 c-ANN with：

- L = C·n^ρ 個雜湊函數，其中 ρ = log(1/P₁) / log(1/P₂)
- 固定查詢 q 的常數成功機率

**證明核心思路：**

定義兩個事件：
- **E₁**：存在 i 使 g_i(p) = g_i(q)（與真正近鄰碰撞）
- **E₂**：Σᵢ |B_i(q) ∩ FAR(q)| < 3L（遠方點在桶中總數 < 3L）

兩者同時發生的機率下界：P[E₁ ∩ E₂] ≥ 1 − (1/3 + 1/e) ≈ 0.3

**Lemma 7（Hamming 特殊情形）：** ρ = 1/c

證明用了 (1 − x)^c ≥ 1 − cx 不等式（對 0 < x < 1, c > 1）。

**空間**：nL（多項式級），與所需查詢時間匹配。

---

### Section 6｜Beyond（超越 Hamming 空間）

**重點摘要：** 探討歐氏空間下的 LSH 設計，目標是把 ρ 從 1/c 推到 1/c²。

**內容：**

#### 6.1 Random Projection LSH for L₂（DIIM04）

定義：

h_{X,b}(p) = ⌊(p·X + b)/w⌋

其中：
- w ≈ r（桶子寬度）
- X = (X₁, …, X_d) 是 i.i.d. 高斯隨機變數
- b 是 [0, w] 上均勻分布的標量

**特性：**
- 對 ρ 的改善有限（圖表：相對 Hamming 只有小幅進步）
- 好處是直接作用於 L2 距離，無需座標取值

#### 6.2 Ball Lattice Hashing（AI06）

**核心思想：**
- 不投影到 ℝ¹，改投影到 ℝᵗ（t 是常數）
- 用球（而非線段）量化：投影落入「以 ball 為中心的 Voronoi cell」時接受
- 命中空白時 re-hash 直到命中

**效果：**
- ρ = 1/c² + O(log t / √t)
- 查詢時間 O(d · n^{1/c² + o(1)})
- 下界：[Motwani-Naor-Panigrahy'06] 證明 ρ ≥ 0.45/c²；[O'Donnell-Wu-Zhou'09] 證明 ρ ≥ 1/c² − o(1)

#### 6.3 其他 LSH 變體

| 類型 | 簡述 |
|------|------|
| **資料相關雜湊**（Data-dependent） | 先把資料「隨機化」（聚類），再跑上述 oblivious LSH |
| **Min-wise Hashing**（Broder'97） | 處理 Jaccard 係數 J(A, B) = \|A ∩ B\| / \|A ∪ B\|，把集合映射到 min(h(a)) |
| **Random Hyperplane**（Charikar'02） | 對單位向量 r 計算 sign(u·r)，以 A(u,v)/π 為碰撞機率 |
| **Leech Lattice LSH** | ℝ²⁴ 維 Leech 格，kissing number = 196560，ρ ≈ 0.36（24D 特殊 ρ ≈ 0.26） |

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **NN（Nearest Neighbor）** | 給定點集 P 與查詢 q，回傳離 q 最近的一點 |
| **r-Near Neighbor** | 回傳所有距離 q ≤ r 的點（NN 的決策版本）|
| **c-Approximate NN** | 回傳距 q 不超過 c 倍真正最近距離的點 |
| **Voronoi 圖** | 把空間切成「最近站點」區域的幾何分割 |
| **維度詛咒**（curse of dimensionality）| 演算法在高維度時空間/時間指數增長 |
| **LSH** | 位置敏感雜湊：讓相似點碰撞機率高、相異點碰撞機率低 |
| **(P₁, P₂, r, cr)-sensitive** | LSH 函數族的條件定義 |
| **ρ 指數** | ρ = log(1/P₁) / log(1/P₂)，LSH 效率的核心參數 |
| **d-穩定分布** | 隨機向量投影後分布穩定，用於 L2 LSH |
| **Ball Lattice Hashing** | 用高維球格量化替代線段量化 |
| **Jaccard 係數** | J(A,B) = \|A∩B\| / \|A∪B\|，集合相似度 |
| **Leech Lattice** | 24 維最密球填充格，kissing number 196560 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| d = 2 | 低維 Voronoi 圖：空間 O(n)，查詢 O(log n) |
| d > 2 | Voronoi 圖大小 n⌈d/2⌉，n²^（d+1)（Dobkin-Lipton'78）|
| ρ = 1/c | Hamming LSH 主要定理（Lemma 7）|
| ρ = 1/c² | Ball Lattice Hashing 漸進下界（AI06 + O'Donnell-Wu-Zhou'09 下界）|
| L = n^ρ | 所需雜湊函數總數 |
| 1/3 + 1/e ≈ 0.7012 | E₁ 與 E₂ 都失敗的機率上界 |
| Pr[E₁ ∩ E₂] ≥ 0.3 | 演算法常數成功機率 |
| 196560 | Leech Lattice 在 24D 的 kissing number |
| t ≈ 30 | Ball Lattice Hashing 開始有改善所需的 t 值 |

---

## 五、核心主旨

> 最近鄰搜索在高維時遇到維度詛咒，精確解需要指數級空間，迫使研究者轉向近似解 c-ANN。Locality-Sensitive Hashing 是解這問題的關鍵工具：設計讓相似點碰撞機率高、相異點碰撞機率低的雜湊函數族，藉此避免全域掃描。對 Hamming 距離，達到 ρ = 1/c 已是 1998 年 Indyk-Motwani 的經典結果。後續工作把目標推到 ρ = 1/c²（Ball Lattice Hashing），資料相關雜湊與 Min-wise Hashing 則處理更一般的度量與集合相似度。

---

## 六、金句摘錄

1. 「Given a set P of n points in ℝⁿ, for any query q, return the p ∈ P minimizing ‖p − q‖.」—— 最近鄰搜索的形式化定義
2. 「When we consider higher dimensions, i.e. d > 2, however, the Voronoi diagram has size n⌈d/2⌉, which is prohibitively large.」—— 維度詛咒的低維解法失效
3. 「We instead consider approximations.」—— 從精確到近似的轉向
4. 「Most algorithms are randomized... by working iteratively, we can bring our probability of failure arbitrarily close to 0.」—— 隨機化演算法的失敗率控制
5. 「We will focus on locality-sensitive hashing... and touch on a few others that have appeared in recent work.」—— LSH 是本講的核心
6. 「Here, we will use hashing whose probability of collision depends on the similarity between the queries.」—— LSH 與傳統雜湊的本質區別
7. 「L = C·n^ρ hash functions, where ρ = log(1/P₁)/log(1/P₂).」—— LSH 的主要定理
8. 「For Hamming LSH functions, we have ρ = 1/c.」—— Hamming 空間的特殊結果
9. 「This only has a small improvement over the 1/c bound... Therefore we consider alternative ways of projection.」—— 隨機投影的有限成效
10. 「ρ = 1/c² + O(log t / √t)... Time to hash is t^O(t)」—— Ball Lattice Hashing 的 ρ 與時間權衡

---

## 七、參考文獻（Lecture notes 引用）

| ID | 作者 | 標題 | 會議 / 年份 |
|----|------|------|-------------|
| **[IM98]** | Indyk, P. & Motwani, R. | Approximate Nearest Neighbors: Towards Removing the Curse of Dimensionality | STOC '98, 604-613 |
| **[GIM99]** | Gionis, A., Indyk, P. & Motwani, R. | Similarity Search in High Dimensions via Hashing | VLDB '99, 518-529 |
| **[Cha02]** | Charikar, M. | Similarity Estimation Techniques from Rounding Algorithms | STOC '02, 380-388 |
| **[DIIM04]** | Datar, M., Immorlica, N., Indyk, P. & Mirrokni, V. | Locality-Sensitive Hashing Scheme Based on p-stable Distributions | SCG '04, 253-262 |
| **[AI06]** | Andoni, A. & Indyk, P. | Near-Optimal Hashing Algorithms for Approximate Nearest Neighbor in High Dimensions | FOCS '06, 459-468 |

延伸文獻（slides 引用）：Indyk-Motwani'98、Kushilevitz-Ostrovsky-Rabani'98、Charikar'02、DIIM'04、Chakrabarti-Regev'04、Panigrahy'06、Ailon-Chazelle'06、Andoni-Indyk'06、Andoni-Indyk-Nguyen-Razenshteyn'14、Andoni-Razenshteyn'15、Broder'97、Broder-Charikar-Frieze-Mitzenmacher'98、Goemans-Williamson'94、Amrani-Beery'94、Motwani-Naor-Panigrahy'06、O'Donnell-Wu-Zhou'09。

---

## 八、備註

- **字幕來源**：Article 路徑，無原始音檔、無字幕、無 YouTube 影片
- **逐字稿**：使用 `transcripts/20141016_PiotrIndyk_HarvardCS224AdvancedAlgorithmsLecture14_NearestNeighbor_LSH_原文_notes.md`（PDF 轉 markdown）+ `原文_slides.md`（PPTX 轉 markdown）合併整理
- **口播稿原文**：`transcripts/20141016_PiotrIndyk_HarvardCS224AdvancedAlgorithmsLecture14_NearestNeighbor_LSH_口播稿.txt`（繁中，人讀）
- **TTS 輸入稿**：`transcripts/20141016_PiotrIndyk_HarvardCS224AdvancedAlgorithmsLecture14_NearestNeighbor_LSH_口播稿_TTS_zh_CN.txt`（OpenCC t2s 轉簡中）
- **本筆記以繁體中文撰寫**，專業術語（LSH、c-ANN、Voronoi 圖、Hamming 距離、Jaccard 係數、Leech Lattice 等）保留英文原文並附中文說明
- **TTS 口播稿另見**：`transcripts/20141016_PiotrIndyk_HarvardCS224AdvancedAlgorithmsLecture14_NearestNeighbor_LSH_口播稿.txt`
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`
- **Scribe 致謝**：Jao-ke Chin-Lee（PDF lecture notes 整理者）

### 4 Bar 驗證結果

| Bar | 規則 | 結果 |
|-----|------|------|
| Bar 1 | 結構化筆記含「🎙️ 音檔導覽」段落 + 3 個音檔連結 | ✅ pass |
| Bar 2 | 口播稿全知分析者視角，「我/Ryo/咱們」ratio < 1.0/1K | ✅ pass（ratio 0.65/1K，1 次「我」in 1535 字）|
| Bar 3 | TTS silent ratio < 10% | ✅ pass（silent ratio 8.11%，34 個 gaps / 274.51s）|
| Bar 4 | TTS voice id = xiaotian_clone_v1（禮士聲音 clone）| ✅ pass（TTS wrapper fail-fast 驗證）|

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 34 秒
> 口播稿原文：transcripts/20141016_PiotrIndyk_HarvardCS224AdvancedAlgorithmsLecture14_NearestNeighbor_LSH_口播稿.txt

- [opus 2.2 MB](../audio/20141016_PiotrIndyk_HarvardCS224AdvancedAlgorithmsLecture14_NearestNeighbor_LSH.opus)（Telegram 友善）
- [m4a 4.3 MB](../audio/20141016_PiotrIndyk_HarvardCS224AdvancedAlgorithmsLecture14_NearestNeighbor_LSH.m4a)（iOS 友善）
- [mp3 4.2 MB](../audio/20141016_PiotrIndyk_HarvardCS224AdvancedAlgorithmsLecture14_NearestNeighbor_LSH.mp3)（通用格式）
