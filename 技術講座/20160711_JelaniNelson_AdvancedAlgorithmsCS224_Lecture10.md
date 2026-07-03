# 【Harvard CS224 高階演算法 — Lecture 10：Randomized e/(e-1) Ski Rental、Online Set Cover、Dual Fitting】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 84分鐘**

---

> **影片連結**：https://youtu.be/Jsg9TwLRTbM
> **影片時長**：84 分鐘（5073 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms」2014 年秋季學期（f14）的第十堂課。本堂課延續上堂課的 Buchbinder-Naor online primal-dual framework，給出兩個完整應用：第一是用該 framework 重證 randomized ski rental 的 e/(e-1) competitive ratio（Karlin et al. 1994 原始結果）；第二是處理 online set cover，用 LP framework 證明 O(log n) competitive。最後引入 dual fitting 技術用於 weighted set cover 的 log n approximation（將在 lecture 11 詳述）。

課程設計的重點：

- **Covering LP**：online algorithm 逐個看到 constraints，逐個 update primal/dual 變數
- **Randomized Ski Rental**：e/(e-1) ≈ 1.58；用 Buchbinder-Naor 框架給出乾淨的證明
- **Online Set Cover**：m sets 的 set cover，但 elements 一個個出現需即時決定 cover；O(log n) competitive
- **Dual Fitting 簡介**：把 greedy 算法建構的 dual 解決方案乘以一個 log n 倍數使其 feasible，從而證明算法達 log n approximation
- **上堂課回顧**：Buchbinder-Naor 框架 + approximate CS 條件

---

## 二、章節脈絡

### Section 1｜上堂課回顧與本課目標

**重點摘要：** 教授快速回顧 Buchbinder-Naor 框架，以及 ski rental 的 covering LP 設定。本堂課正式完成 randomized 版本。

**內容：**
- Buchbinder-Naor 2005：online primal-dual 框架
- Ski rental covering LP：minimize B·x + Σ y_i，constraint x + Σ_{j≤i} y_j ≥ 1 for all i
- 上堂課證明 deterministic 是 2-competitive
- 本課：用同樣的 framework 加上 randomization，達到 e/(e-1) ≈ 1.58

### Section 2｜Randomized e/(e-1) Ski Rental 的 Buchbinder-Naor 證明

**重點摘要：** 用 Buchbinder-Naor 框架證明 randomized ski rental 達 e/(e-1) competitive。Competitive ratio 公式為 (1 + 1/(1+B))^(B+1) / (1 + 1/(1+B))^(B+1) − 1 of times OPT，最壞情況為 B = 1 時得 2，漸近 e/(e-1)。

**內容：**

**演算法：**
- 維持 dual variables y_i（每個 day 一個）
- 當 constraint 不滿足時：依某個 exponential distribution 隨機 raise 一些 y_i
- 同時 update primal：可能決定 buy (x = 1) 或 rent

**詳細 Competitive Ratio 公式：**
- 對任何 B ≥ 1：competitive ratio = (1 + 1/(1+B))^(B+1) / ((1 + 1/(1+B))^(B+1) − 1)
- 隨 B 增加，分子分母都接近 e，收斂到 e/(e-1)
- 對 B = 1：恰好等於 2（演算法表現 worst case）
- 對 B → ∞：趨近 e/(e-1) ≈ 1.58

**歷史歸屬：**
- 這個 e/(e-1) 結果由 Karlin, Manasse, McGeoch, Owicki 1994 提出（Karlin et al.）
- Buchbinder-Naor 重新整理成 LP framework 後，論證乾淨很多

> 「The competitive ratio is (1 + 1/(1+B))^(B+1) / ((1 + 1/(1+B))^(B+1) − 1) — converges to e/(e−1).」

### Section 3｜從 Ski Rental 到 Online Set Cover：問題設定

**重點摘要：** Online set cover problem 的定義——預先知道 m sets 但 elements 一個個出現，online algorithm 必須即時決定覆蓋。

**內容：**

**Online Set Cover Problem：**
- 預先給定 m sets S_1, ..., S_m ⊆ U = {1, ..., n}
- 不知道哪個 element 在哪個 set 中（只知道 set 的「名字」）
- Online：當 element i 出現時：
  - 若 i 已被某 selected set 覆蓋：不做事
  - 若 i 還沒被覆蓋：必須選一個 set S_j，把 S_j 整個買下來（cost = cost(S_j)），並覆蓋 i
- 目標：minimize total cost
- Offline OPT：預先知道所有 elements 都在哪個 set，挑選最優 cover

### Section 4｜Online Set Cover 的 Covering LP 設定

**重點摘要：** Online set cover 的 covering LP 設定：primal 是 set selection（x_j = 是否選 S_j），dual 是 element-level（y_i = 第 i 個 element 的 dual 變數）。

**內容：**

**Covering LP：**
- Primal：minimize Σ c_j · x_j subject to Σ_{j: i ∈ S_j} x_j ≥ 1 for all i, x_j ≥ 0
- Dual：maximize Σ y_i subject to Σ_{i ∈ S_j} y_i ≤ c_j for all j, y_i ≥ 0

**Dual 的直覺：**
- y_i 是 element i 的「contribution weight」
- 對每個 set j，所有 selected elements 在 S_j 中的 y_i 總和 ≤ c_j（不能透支 cost）

### Section 5｜Online Set Cover 演算法：Primal-Dual Construction

**重點摘要：** Online algorithm 邊做決定邊 update x 與 y：每個新 element i 出現時，把 y_i 增加到 S_j 的 constraint tight 為止，然後買 cost 最少的 covering S_j。

**內容：**

**演算法：**
- x 與 y 都 initialize 為 0
- 當 element i 出現但還沒被覆蓋：
  - 增加 y_i 直到某個 constraint j：Σ_{i ∈ S_j} y_i = c_j 變 tight
  - 設 x_j = 1（買 set S_j）
- 這是「raise y_i → 找到 tight set j → 買 j」的 greedy dual construction

**為什麼 O(log n) competitive：**
- 對每個 set j，在整個 online 過程中 y_i 增加到 Σ y_i ≤ c_j；那個 set 總共被 buy 一次（cost = c_j）
- 對每個 element i：y_i 的 raise 數量是 O(log n) factor
- Approximate CS：α = β = O(log n)

### Section 6｜證明 Online Set Cover 是 O(log n) Competitive

**重點摘要：** 完整證明 online set cover 達 O(log n) competitive ratio——對每個 element i，y_i 的 raise 數量 = log(OPT / initial_y)。

**內容：**

**Lemma：**
- 一個 element i 一共被 raise 多少次取決於它每 raise 一次影響多少 set 的 constraints
- 隨 time 經過，能用來 charge y_i 的 sets 越來越少（因為已被 buy 的 set 不再 raise）
- 證明：i 的 y_i raise 數量 ≤ log n（因為每次 raise 至少讓某 set j 的 Σ_{k∈S_j} y_k 翻倍）

**整體 bound：**
- Primal cost = Σ c_j · x_j = Σ_{j bought} c_j
- Dual cost = Σ y_i
- Approximate CS：每一個 selected set 對應 constraint 用了 α = O(log n) 因子
- 所以 Primal cost ≤ α · Dual cost ≤ α · OPT = O(log n) · OPT

### Section 7｜Dual Fitting 簡介：對 Weighted Set Cover 啟示

**重點摘要：** 教授引入 dual fitting 技術——它不要求線上更新，而是 offline 構造 dual + 乘以係數使其 feasible，最終得 log n approximation for weighted set cover。

**內容：**

**Dual Fitting 概念：**
- 給定一個 greedy algorithm 的 primal solution
- 構造一個 dual solution，使 dual cost = primal cost，但 feasibility 被 violate log n 倍
- 將 dual 變數 scale down log n 倍，得到 feasible dual solution
- 因此 primal cost ≤ log n · dual OPT ≤ log n · offline OPT

**與 Online Primal-Dual 的差異：**
- Online primal-dual：邊做決定邊更新，要求 marginal analysis
- Dual fitting：算法完成後，再 fit 一個 dual solution
- 兩者都用到 LP duality，但技巧不同

**下一堂課：**
- 完整 dual fitting 對 weighted set cover 的 log n approximation 證明
- Unweighted vertex cover 的 2-approximation via dual fitting

### Section 8｜下堂課預告與學生問題

**重點摘要：** 學生對 weighted set cover greedy 性質與 dual fitting 細節提問，預告下堂課 PTAS / FPTAS / FPRAS 與 LP integrality gaps。

**內容：**
- 教授提醒 Pset 3 截止 Monday night
- 學生問 greedy for weighted set cover 為何選「cost / new elements」比 — 這是因為 dual fitting 想 make every element 對 set j 的 constraint 在 raise 时變 tight
- 學生問 dual fitting 違背 feasibility 但最後 scale down 的邏輯
- 預告下堂課：LP integrality gaps、PTAS / FPTAS / FPRAS 定義、PTAS for knapsack

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Online Ski Rental Covering LP** | primal: minimize B·x + Σ y_i; constraints x + Σ_{j≤i} y_j ≥ 1 |
| **e/(e-1)** | Randomized ski rental 的 competitive ratio (≈ 1.58) |
| **Online Set Cover** | Sets 預先給；elements 一個個出現；需即時買 set 覆蓋 |
| **Covering LP for Set Cover** | Primal: minimize Σ c_j · x_j; constraint Σ_{j: i∈S_j} x_j ≥ 1 |
| **Dual of Set Cover LP** | Maximize Σ y_i; constraint Σ_{i∈S_j} y_i ≤ c_j |
| **Tight Constraint** | Σ y_i = c_j (constraint equality) |
| **Approximate CS** | α, β factors 控制 online algorithm 的 competitive ratio |
| **Buchbinder-Naor Framework** | online primal-dual 框架；逐步 update primal/dual 變數 |
| **Dual Fitting** | 構造 dual solution + scale down；證明 LP approximation ratio |
| **Integrality Gap** | LP optimal 與 integer optimal 的比（衡量 LP relaxation 緊度） |
| **PTAS** | Polynomial-Time Approximation Scheme；對任何 ε > 0，給 (1+ε)-approximation 在 poly(n) 時間 |
| **FPTAS** | Fully PTAS；poly(n/ε) 時間 |
| **FPRAS** | Fully Polynomial Randomized Approximation Scheme |
| **Karlin et al. 1994** | Randomized ski rental e/(e-1) 結果的原始論文 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 84 分鐘（5073 秒） | 影片總長度 |
| 8610 words | 英文逐字稿字數 |
| 2127 words | 繁中逐字稿字數 |
| 1994 | Karlin et al. 論文年份（Algorithmic） |
| 2005 | Buchbinder-Naor 框架論文年份 |
| e/(e-1) ≈ 1.58 | Randomized ski rental competitive ratio 的漸近值 |
| 2 | B = 1 時的 competitive ratio（最壞情況） |
| 1 + 1/(1+B) | 該算法 competitive ratio 表達式內的主要項 |
| O(log n) | Online set cover 的 competitive ratio |
| m / n | Set cover 的常見維度（sets × universe size） |
| c_j | Set S_j 的 cost |
| (1 + 1/(1+B))^(B+1) | randomized ski rental 的分子 |

---

## 五、核心主旨

> 用 Buchbinder-Naor online primal-dual 框架完成兩個重要 online 算法的分析：第一個是 randomized ski rental，competitive ratio 為 (1 + 1/(1+B))^(B+1) / ((1+1/(1+B))^(B+1) − 1)，隨 B 增加收斂到 e/(e-1) ≈ 1.58，這個結果由 Karlin 等人在 1994 年提出但用 LP framework 證明更乾淨。第二個是 online set cover，演算法用 greedy dual construction 達到 O(log n) competitive，並引出 dual fitting 技術——把 offline 算法的 primal solution 用 dual solution + scale down 證明 LP approximation。這兩個應用展示了 LP duality 在 online 算法設計與分析中的強大：把分散的 online 決策問題統一到 primal-dual 框架下，提供一致的證明技術。下堂課將進一步引入 LP integrality gaps 與 PTAS / FPTAS / FPRAS 概念，挑戰 approximation algorithms 在 LP relaxation 下的極限。

---

## 六、金句摘錄

1. 「Today's randomized ski rental achieves competitive ratio (1 + 1/(1+B))^(B+1) / ((1+1/(1+B))^(B+1) − 1).」

2. 「As B gets large this converges to e/(e−1) ≈ 1.58, but in the worst case at B = 1 it equals 2.」

3. 「This bound is due to Karlin et al. 1994 — but today's proof uses the Buchbinder-Naor primal-dual framework.」

4. 「In online set cover, m sets are given but elements arrive one by one; when a new element arrives, we may need to buy a set.」

5. 「The LP for set cover: primal is set selection, dual is per-element weights.」

6. 「Algorithm: raise y_i until some set j's constraint becomes tight, then buy set j.」

7. 「Each element i's y_i is raised O(log n) times — so primal cost is O(log n) times dual OPT.」

8. 「Dual fitting: construct a dual solution equal to primal cost, then scale it down by log n to make it feasible.」

9. 「Approximate CS is the key — both online primal-dual and dual fitting use it.」

10. 「Next time: integrality gaps and PTAS / FPTAS / FPRAS — pushing approximation algorithms beyond LP relaxations.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption，2127 words）雙語交叉對照
- **未使用 Whisper**：影片有完整 YouTube 自動字幕
- **無官方章節**：YouTube 影片 metadata 無 chapters
- **本筆記引用以 en 字幕為主**，zh-Hant 用於繁中關鍵概念對照
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture10_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（Online Primal-Dual、Dual Fitting、PTAS、Integrality Gap 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 3 分 14 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture10_口播稿.txt

- [opus 0.7 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture10.opus)（Telegram 友善）
- [m4a 2.2 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture10.m4a)（iOS 友善）
- [mp3 2.9 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture10.mp3)（通用格式）
