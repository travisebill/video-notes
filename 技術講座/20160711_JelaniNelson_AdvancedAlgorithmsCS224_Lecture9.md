# 【Harvard CS224 高階演算法 — Lecture 9：Randomized Paging、Packing/Covering LP Duality、Primal-Dual Online】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 84分鐘**

---

> **影片連結**：https://youtu.be/KBVkri8k3Ao
> **影片時長**：84 分鐘（5096 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms」2014 年秋季學期（f14）的第九堂課。本堂課完成兩件事：第一是完成 Mark 演算法的 2 H_K competitive 分析（上堂課的 paging 問題）；第二是引入 covering/packing linear program 的 duality，並用這個 primitive 重新分析 ski rental。

課程設計的重點：

- **Mark 演算法的 phase 分析**：expected cost = 2 H_K × OPT + O(K)
- **Packing LPs**：maximize c·x such that Ax ≤ b, x ≥ 0
- **Covering LPs**：minimize b·y such that A^T y ≥ c, y ≥ 0
- **Weak Duality**：packing LP 值 ≤ covering LP 值（強對偶在 LP 達成時也成立）
- **Online Primal-Dual（Bookbinder-Naor 2005）**：在 covering LPs 框架下分析 online 算法
- **Approximate Complementary Slackness**：什麼條件下 primal/dual solutions 是「良好的」近似解

---

## 二、章節脈絡

### Section 1｜Mark 演算法的 2 H_K Competitive 分析

**重點摘要：** Mark（隨機 paging）是 Fiat et al. 1991 提出的演算法——每次 cache miss 時 evict 一個**隨機選擇的 unmarked page**。證明其 expected cost ≤ 2 H_K × OPT + O(K)。

**內容：**

**演算法細節：**
- 開始：所有 pages 都 marked
- Cache miss：evict 一個 uniformly 隨機選的 unmarked page；mark 新進來的 page
- 全部 marked 時：unmark all，重新計 phase

**Phase 的定義：**
- 一個 phase 從「全部 unmark、引入新的 page」開始
- Phase 結束時，所有 pages 又都 marked
- Phase 內 access 某 page P：如果 P 在 cache，標 marked；如果 P 不在 cache，evict 隨機 unmarked page，加 P，標 marked

**為什麼 2 H_K-competitive：**
- 在 phase 內，如果有 L 個 distinct pages 被 access（稱為「clean」 pages）
- OPT 至少付出 ⌈L/2⌉ - K 個 miss（OPT 也得 evict K 個才放得下）
- Mark 的 expected cost：每個 clean page miss 一次，但 evict 階段 evict random unmarked page
- 期望：Mark 在每次 miss 付出期望 1 × H_K（harmonic 級數），合計 2 H_K × OPT

**H_K = 1 + 1/2 + 1/3 + ... + 1/K = ln K + γ**
- 比較 sum 與 integral：H_K ≈ ln K + γ（γ 為 Euler–Mascheroni constant）

> 「Mark is 2 H_K-competitive where H_K is the harmonic sum 1 + 1/2 + ... + 1/K, which is about ln K.」

### Section 2｜從 Paging 到 LP：Set Cover 的鋪墊

**重點摘要：** 教授從 set cover problem 引入 LP——這是 covering LP 的典型代表，並會成為下兩個 toy example 的入口。

**內容：**

**Set Cover Problem：**
- 有 m 個 sets S_1, ..., S_m，每個都是 universe U = {1, ..., n} 的子集；每個 set S_j 有 cost c_j ≥ 0
- 目標：選 sub-collection 涵蓋整個 U，使 total cost 最小
- 是 NP-hard，但是有 polynomial approximation algorithms

**Greedy for Set Cover：**
- 每次選「cost / new elements」最小的 set
- 達 log n approximation（這是下一個 toy example，今天只是鋪墊）

**為什麼提到 Set Cover：**
- Online set cover 是 set cover 的 online 變體（set 預先給好，但 element 一個一個出現，需即時決定）
- Online 版本也用 LP duality 分析
- 為下兩個 toy example（online set cover 與 ski rental via LP）做準備

### Section 3｜線性規劃 (Linear Programming) 簡介

**重點摘要：** 教授快速複習 LP——目標是找多項式時間演算法解 LP，且 primal/dual 對偶是解 LP 的核心工具。

**內容：**

**LP 的標準形式：**
- Primal（packing）：maximize c^T x subject to Ax ≤ b, x ≥ 0
- Primal（covering）：minimize b^T y subject to A^T y ≥ c, y ≥ 0
- Linear objective + linear constraints

**為什麼用 LP：**
- LP 可在多項式時間解（內點法、ellipsoid method、Simplex）
- LP 給我們 strong duality、weak duality、complementary slackness 等工具
- 對 online 算法：把 online 決策編碼成 LP 變數，把 OPT 編碼成 dual

### Section 4｜Packing-Covering Weak Duality

**重點摘要：** Weak duality 說若 primal（Packing）是「maximize」覆蓋，dual（Covering）是「minimize」保證，則 packing LP 的 OPT 值 ≤ covering LP 的 OPT 值。

**內容：**

**Packing Primal：** max c^T x subject to Ax ≤ b, x ≥ 0
**Covering Dual：** min b^T y subject to A^T y ≥ c, y ≥ 0

**Weak Duality Theorem：**
- 對所有 feasible primal x 與 feasible dual y：c^T x ≤ b^T y
- 證明：c^T x ≤ (A^T y)^T x = y^T A x ≤ y^T b = b^T y
- 因此 packing LP 值（最大值）≤ covering LP 值（最小值）
- 強對偶（Strong Duality）：當 LP 達成時，兩個值相等

**為什麼 online 算法會用到：**
- 在 online 問題，online 算法建構的 primal solution 跟 OPT 建的 dual solution 比較
- 若能讓兩者 cost 接近 1:1 或 1:r，就是 r-competitive

### Section 5｜Online Primal-Dual 框架（Bookbinder-Naor 2005）

**重點摘要：** 教授引入 Buchbinder-Naor 2005 的 online primal-dual 框架——把 online 算法放在 covering LP 框架下分析，邊做決定邊更新 dual 變數。

**內容：**

**Framework：**
- 給定 covering LP，約束逐個出現（online）
- Primal 變數 y_i 必須 maintain 滿足所有已看到的 constraints
- Dual 變數 x_j 隨 constraint 出現而增長
- 每個 constraint 出現時：increase some y_i（付出 primal cost），並 maintain approximate complementary slackness

**Approximate Complementary Slackness：**
- 定義 α, β ≥ 1
- 若 primal 變數 x_j > 0，則 dual 對應 constraint 的「slack」 ≤ α 因子
- 若 dual 變數 y_i > 0，則 primal 對應 constraint 的「slack」 ≤ β 因子
- 那麼 online 算法 cost ≤ α × β × OPT

### Section 6｜Ski Rental 的 Primal-Dual 分析

**重點摘要：** 把 ski rental 重寫成 covering LP，並用 approximate complementary slackness 證明 2-competitive。隨機化版本可以達 e/(e-1) competitive。

**內容：**

**Ski Rental 的 Covering LP：**
- 變數：x_buy = 是否買雪具；y_i = 第 i 天是否租
- Objective：minimize B · x_buy + Σ y_i
- Constraint：對每天 i，要有 x_buy + Σ_{j ≤ i} y_j ≥ 1（每天都要租或買）

**Online 演算法的 LP 對應：**
- 今天發現沒買也沒租過（之前的 rental sum 還不夠）：決定租，y_i = 1
- 當 Σ y_i 到達 B 時，決定買：x_buy = 1，把 remaining y_i 都設 0

**為什麼是 2-competitive：**
- α = β = 1 時是 1-competitive；但因為 LP rounding 限制，實際是 α = β = √2
- 證明：α · β = 2
- Randomized：α = β → e/(e-1)（用 balanced increase）

> 「The Buchbinder-Naor framework gives a unified way to design and analyze online algorithms in LP terms.」

### Section 7｜從 2-competitive 到 e/(e-1): Randomized Ski Rental 預告

**重點摘要：** 教授用 Buchbinder-Naor 框架證明 deterministic 2-competitive ski rental，下堂課會引入 randomization 達到 e/(e−1)。

**內容：**
- Buchbinder-Naor 框架也可以推 randomized competitive ratio
- Randomized ski rental result is due to Karlin et al. 1994
- 在 Buchbinder-Naor 框架下：randomization → α · β → e/(e−1) 「在 randomize 分支上」
- 對應爬山性質：在 constraint 越靠近 tight 時，用 exponential distribution 決定是否 raise dual
- 下堂課會詳細給 randomize online primal-dual 與 online set cover

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Mark Algorithm** | Fiat et al. 1991 的隨機 paging 演算法；evict 一個隨機選的 unmarked page |
| **H_K (Harmonic Number)** | 1 + 1/2 + 1/3 + ... + 1/K；約等於 ln K + Euler-Mascheroni 常數 |
| **2 H_K** | Mark 演算法的 competitive ratio |
| **Phase Analysis** | 把 access sequence 切成 phase，每 phase 是「unmark all」開頭到「全部 marked」結尾 |
| **Linear Program (LP)** | 多項式時間可解的最適化問題；目標 + 約束都是 linear |
| **Packing LP** | Primal：maximize c^T x subject to Ax ≤ b, x ≥ 0 |
| **Covering LP** | Primal：minimize b^T y subject to A^T y ≥ c, y ≥ 0 |
| **Weak Duality** | Packing LP 的 optimal 值 ≤ Covering LP 的 optimal 值 |
| **Strong Duality** | LP 達成時，packing = covering 對偶值 |
| **Complementary Slackness** | x_j > 0 ⇒ 第 j 個 constraint tight；y_i > 0 ⇒ 第 i 個 constraint tight |
| **Approximate CS** | α, β：x_j > 0 ⇒ slack ≤ α；y_i > 0 ⇒ slack ≤ β；則 cost ≤ α · β · OPT |
| **Buchbinder-Naor 2005** | 引入 online primal-dual framework 來統一分析 online algorithms |
| **Set Cover** | NP-hard；greedy 達 log n approximation；online 版本 O(log n) competitive |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 84 分鐘（5096 秒） | 影片總長度 |
| 8699 words | 英文逐字稿字數 |
| 1563 words | 繁中逐字稿字數 |
| 1991 | Fiat et al. Mark Algorithm 論文年份（Journal of Algorithms） |
| 2005 | Buchbinder-Naor Online Primal-Dual 論文年份 |
| 2 H_K | Mark Algorithm 的 competitive ratio |
| H_K ≈ ln K | Harmonic number 的 asymptotic 值 |
| e/(e-1) | Randomized Ski Rental 的 competitive ratio（約 1.58） |
| 2 | Deterministic Ski Rental 的 competitive ratio |
| K | Cache size |
| γ ≈ 0.5772 | Euler-Mascheroni constant |
| log n | Greedy Set Cover 的 approximation ratio |
| O(log n) | Online Set Cover 的 competitive ratio |

---

## 五、核心主旨

> Mark 演算法是 randomized paging 的代表：每次 cache miss 時隨機 evict 一個 unmarked page，達到 2 H_K competitive，其中 H_K ≈ ln K 代表 randomize 比 deterministic LRU 的 K bound 顯著好（log n 等級 vs n 等級）。本堂課同時引入 covering/packing LP 與 Buchbinder-Naor 2005 的 online primal-dual framework，把 online 算法放在 LP 框架下分析——邊做決定邊更新 primal/dual 變數，用 approximate complementary slackness 證明 competitive ratio 為 α · β。用這個 framework 重寫 ski rental：deterministic 是 2-competitive，randomized 是 e/(e−1) ≈ 1.58-competitive。框架的價值在於把分散的 online 算法（ski rental、paging、set cover）統一在同一個 LP duality 的語言下。

---

## 六、金句摘錄

1. 「Mark is 2 H_K-competitive where H_K is the harmonic sum, about ln K.」

2. 「Randomize and you beat the deterministic K lower bound — Markov's inequality style.」

3. 「Packing LP: maximize c^T x subject to Ax ≤ b. Covering LP: minimize b^T y subject to A^T y ≥ c.」

4. 「Weak duality: any feasible primal x has value ≤ any feasible dual y's value.」

5. 「Strong duality: when LP is feasible and bounded, the primal and dual optimal values are equal.」

6. 「Buchbinder and Naor introduced this online primal-dual framework in 2005 — it gives a unified way to design online algorithms.」

7. 「Approximate complementary slackness: if primal variable is positive, dual constraint slack ≤ α; if dual variable is positive, primal slack ≤ β.」

8. 「With α = β = √2, online ski rental gives cost ≤ 2 · OPT.」

9. 「Randomized ski rental achieves e/(e-1) competitive — almost matching offline OPT.」

10. 「Set cover greedy gets log n approximation; we'll see online set cover next time achieves the same bound.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption，1563 words）雙語交叉對照
- **未使用 Whisper**：影片有完整 YouTube 自動字幕
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **本筆記引用以 en 字幕為主**，zh-Hant 用於繁中關鍵概念對照
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture9_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（Mark Algorithm、Harmonic Number、Packing/Covering LP、Online Primal-Dual、Complementary Slackness 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 2 分 57 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture9_口播稿.txt

- [opus 0.6 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture9.opus)（Telegram 友善）
- [m4a 2.1 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture9.m4a)（iOS 友善）
- [mp3 2.7 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture9.mp3)（通用格式）
