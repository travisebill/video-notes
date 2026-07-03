# 【Harvard CS224 高階演算法 — Lecture 11：Duel Fitting wrap-up、LP Integrality Gaps、PTAS for Knapsack】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 85分鐘**

---

> **影片連結**：https://youtu.be/vnS9_NKoEKI
> **影片時長**：85 分鐘（5141 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms」2014 年秋季學期（f14）的第十一堂課。本堂課完成三件事：第一是用 dual fitting 完整證明 weighted set cover 的 log n approximation；第二是用 dual fitting 證明 unweighted vertex cover 的 2-approximation；第三是引入 LP integrality gap 的概念與 PTAS / FPTAS / FPRAS 定義，並對 knapsack 構造一個 PTAS。

課程設計的重點：

- **Dual Fitting for Weighted Set Cover**：greedy 達 log n approximation
- **Dual Fitting for Unweighted Vertex Cover**：2-approximation via primal-dual
- **LP Integrality Gap**：LP optimal 與 integer optimal 的差（衡量 LP relaxation 的鬆緊）
- **PTAS / FPTAS / FPRAS 定義**：固定 ε 的 (1+ε)-approximation 在 polynomial 時間
- **Knapsack PTAS**：用「猜測大 items」+ greedy for small items 達 PTAS

---

## 二、章節脈絡

### Section 1｜Dual Fitting for Weighted Set Cover 完成證明

**重點摘要：** 教授從 greedy weighted set cover 演算法出發，構造 dual solution 並證明每個 constraint 至少被 violate log n 倍，所以 scale down 後 feasible。

**內容：**

**Greedy Algorithm：**
- 還有 uncovered element 時：選 set S minimizing cost(S) / (new elements covered)
- 標準 greedy（無成本時：cost 1/個，自然 = 純新元素數量）

**Dual Construction：**
- 對 greedy 選的每個 set S，x_S = 1（決定買 S）
- 對 S cover 的每個新 element i，設 y_i = cost(S) / (S 涵蓋的新元素個數)
- 關鍵性質：對 greedy 過程中每個 set S，所有 S 覆蓋 elements 的 y_i 總和恰好等於 cost(S)

**Feasibility 檢查：**
- 對 final dual y 來說，每個 set S 的 constraint Σ_{i ∈ S} y_i ≤ cost(S) 不一定滿足
- 證明：對每個 S 來說，被 violate 的程度 ≤ log n（每個 i 的 y_i 不超過 1/2^(stage) 系列遞減）
- Scale down：把所有 y_i 除以 log n，現在 y 是 feasible dual
- 因此 greedy cost ≤ log n · dual value ≤ log n · OPT

**Logarithmic 來源：**
- 對 greedy 過程的第 k 個買的 set，被這個 set 涵蓋且先前沒有被 cover 的元素至少一半來自它的 new elements
- 因此隨 greedy 進行，新 cover 元素越來越少，每個 cost 分配到更多 elements → y_i 越小

> 「The greedy's violation per constraint is at most log n, so scaling down by log n gives a feasible dual.」

### Section 2｜Dual Fitting for Unweighted Vertex Cover 2-Approximation

**重點摘要：** 教授展示如何在 unweighted vertex cover 上用 primal-dual 達到 2-approximation，作為 dual fitting 的另一個例子。

**內容：**

**Vertex Cover Problem：**
- 給定 graph G = (V, E)
- 找 subset U ⊆ V 使所有 edges 都有 endpoint 在 U 中
- minimize |U|
- NP-hard

**LP Relaxation：**
- Primal：minimize Σ x_v subject to x_u + x_v ≥ 1 for each edge (u, v) ∈ E
- x_v ≥ 0
- LP optimal 提供 lower bound

**LP-based Primal-Dual Algorithm：**
- 維持 0 ≤ x_v ≤ 1
- 對未 covered edge (u, v)：同時 raise x_u 跟 x_v 直到其中一個 = 1 或 edge 被其他 covered
- 同時設 y_e = raise 量（這個 edge 的 dual 變數）
- 結束時：把所有 x_v = 1 的 vertices 選入 U

**為什麼 2-approximation：**
- 每個 unselected vertex 的 x_v < 1
- 對每個 (u, v) ∈ U，它的 y_e（edge 被 raise 到 tight 為止）相加 ≤ |U|
- 關鍵：每個 vertex v 在 U 中對應的 raise ≤ 2，因為每 raise 一次 v 對應 1 個 edge，但 v 也 cover 一次
- 因此 |U| ≤ 2 · dual = 2 · OPT

### Section 3｜LP Integrality Gaps：當 LP Relaxation 不夠緊

**重點摘要：** 教授介紹 LP integrality gap 概念——LP optimal 與 integer optimal 的比，衡量 relaxation 的鬆度。對 set cover，這個 gap 是 Ω(log n)。

**內容：**

**Integrality Gap Definition：**
- 給定一個 integer program (IP) 與其 LP relaxation
- 設 LP* = LP optimal value, IP* = IP optimal value
- Integrality gap = LP* / IP*（≥ 1）
- Gap = 1 代表 relaxation tight；gap > 1 代表 LP 給了 loose bound

**Set Cover 的 Integrality Gap：**
- 對 set cover LP，greedy 達 log n approximation，但 LP* 可能比 IP* 小很多
- 一個經典構造：n 個 elements，n 個 sets，每個 set 是不同 k-element subset
- LP* 的 fractional solution 接近 1，但 IP* 真實要選 n 個 sets
- Gap = Ω(log n) — greedy 已達 optimal approximation

**為什麼重要：**
- 對 IP，LP-based approximation 的 tight bound 由 integrality gap 決定
- 超出 LP relaxation 的 approximation 需要不同技術

### Section 4｜Beyond LP Relaxations：PTAS 定義

**重點摘要：** 教授引入 PTAS（Polynomial-Time Approximation Scheme）：對任何 ε > 0，給出 (1+ε)-approximation 在 poly(n) 時間。

**內容：**

**PTAS Definition：**
- 一個演算法 A_n 對每個 ε > 0，給出 (1+ε)-approximation for size-n inputs
- 時間：poly(n)，對 fixed ε 是 polynomial，但可能 ε 越小子越高
- 例子：對 knapsack，有 PTAS

**為什麼 set cover 沒 PTAS：**
- 已知 set cover 在 standard assumption 下沒 PTAS（除非 P = NP）
- 因為 set cover LP integrality gap 已知 Ω(log n)

**FPTAS Definition：**
- Fully PTAS：時間 poly(n, 1/ε) — poly in both n and 1/ε
- 比 PTAS 更強（因為 PTAS 對 ε 可能 superpolynomial）

**FPRAS Definition：**
- Fully Polynomial Randomized Approximation Scheme：用 randomness，給 (1 ± ε) approximation with high probability
- 例子：DPF (Dagum-Karp 等)，特別 in #P-hard counting problems

### Section 5｜Knapsack Problem 設定與 PTAS Construction

**重點摘要：** Knapsack problem 設定：有 n 個 items，每個有 value v_i 與 weight w_i，knapsack capacity C；選 items 使 total value 最大（受 weight ≤ C）。目標：構造 PTAS。

**內容：**

**Knapsack Problem：**
- n items，item i 為 (v_i, w_i)
- Capacity C
- 選 S 使 Σ_{i∈S} w_i ≤ C，maximize Σ_{i∈S} v_i
- NP-hard (it's a basic NP-hard problem)
- But 有 PTAS！

**Naïve DP：**
- DP table 由 C 與 n 決定，pseudo-polynomial
- 對 fixed C 可在 poly(n, C) 解，但不實用

**PTAS High-level Idea：**
- 把 items 分成 big items (w_i > εC) 與 small items (w_i ≤ εC)
- Big items：可用 DP 求 exact optimal subset（因為最多 n 個，但 DP by # of big items × C → poly(n) sized table）
- Small items：用 greedy 解（因 ≤ εC weight each，且 total capacity = C，最多 n 個 small items 都選）

### Section 6｜PTAS 算法細節與 Logarithmic Guess

**重點摘要：** PTAS 對 big items 構造 DP 找出 optimal subset，再用 greedy 處理 small items（每個 ≤ εC weight），整體保證 (1-ε) approximation。

**內容：**

**PTAS Algorithm：**
1. 把 items 分成 big (w_i > εC) 與 small (w_i ≤ εC)
2. 對 big items，列舉所有 subsets of big items，DP 求解 max value（因為 # big items ≤ n 但每個 weight > εC 所以最多 n items usable, DP poly(n))
3. 對每個可行的 big-items subset B：剩餘 capacity C - Σ_{i∈B} w_i，用 greedy 處理 small items
4. 在所有 big subsets 中選 value 最高的

**為什麼 (1 - ε)-approximation：**
- OPT 包含 big + small parts
- DT 不會 miss 超過 ε · OPT 的 value（small items 每個價值 loss ≤ εC，因此 small items 總 loss ≤ ε · max_item_value · n ≤ ε · OPT）
- 詳細：small items 總 weight ≤ C，每個 ≤ εC，因此 small items 數量 ≤ n 但每個 value loss bounded；greedy for small items 達 optimal

> 「Knapsack has a PTAS — guess big items exactly via DP, then greedy for the small items.」

### Section 7｜下節課預告與觀眾問題

**重點摘要：** 教授預告下節課會講 FPTAS for knapsack 與另一個 problem，並且下週有兩場 guest lectures 教授不在。

**內容：**
- 下節課：FPTAS for knapsack + 其他 problem 的 FPTAS
- 教授下週不在 Cambridge，會有兩場 guest lecture
- 學生有問題可以 email 教授安排 Google Hangout 聊

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Dual Fitting** | 構造 dual solution + scale down 的 approximation 證明技術 |
| **Greedy for Set Cover** | 每次選 cost(S)/new_elements 最小 set，達 log n approximation |
| **Vertex Cover** | 給定 graph，找最小 vertex subset U 使所有 edges 有 endpoint in U |
| **LP Relaxation** | 把 IP 的 discrete constraints 改成 continuous (≥ 0) |
| **Integrality Gap** | LP optimal 值 / IP optimal 值，衡量 LP relaxation 的鬆度 |
| **PTAS** | Polynomial-Time Approximation Scheme；對 ε > 0 給 (1+ε)-approximation in poly(n) |
| **FPTAS** | Fully PTAS；時間 poly(n, 1/ε) |
| **FPRAS** | Fully Polynomial Randomized Approximation Scheme；用 randomness |
| **Knapsack** | 選 items 使 weight ≤ C，maximize value；NP-hard 但有 PTAS |
| **Big Items** | weight > εC 的 items |
| **Small Items** | weight ≤ εC 的 items |
| **DP for Big Items** | dynamic programming for knapsack on big items only；pseudo-poly |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 85 分鐘（5141 秒） | 影片總長度 |
| 8721 words | 英文逐字稿字數 |
| 1902 words | 繁中逐字稿字數 |
| 1974 | Johnson 對 unweighted set cover greedy 論文的年份 |
| 1975 | Lovász 等獨立發現 unweighted greedy 的年份 |
| 1979 | Weighted set cover greedy due to Chvátal 等的年份 |
| Ω(log n) | Set Cover LP 的 integrality gap |
| log n | Weighted set cover greedy approximation ratio |
| 2 | Unweighted vertex cover via primal-dual 的 approximation ratio |
| 1 + ε | PTAS 的 approximation factor (對 fixed ε) |
| ε C | Big / Small items 的 threshold |

---

## 五、核心主旨

> 本堂課完成 dual fitting 對 weighted set cover 的 log n approximation 完整證明（greedy + dual construction + scale down by log n），並用 unweighted vertex cover 的 2-approximation via primal-dual 作為另一個例子——展示了 dual fitting 不只能給 log n 等級，對某些特殊問題可以給到 2 等更好的結果。當 LP-based methods 不夠強時，PTAS 是另一條路：對 knapsack 構造 PTAS，把 items 分 big（DP optimal）與 small（greedy），達到 (1-ε) approximation。integrality gap 衡量 LP relaxation 的鬆度；PTAS 是繞過 LP 限制的另一個工具，但對 set cover 這類問題已知沒 PTAS（除非 P = NP）。

---

## 六、金句摘錄

1. 「Dual fitting constructs a dual solution equal to primal cost, then scales down by log n to make it feasible.」

2. 「The greedy's violation per set constraint is at most log n, giving us a log n approximation.」

3. 「Vertex cover via primal-dual achieves a 2-approximation — a classical example.」

4. 「LP integrality gap measures how tight the LP relaxation is; set cover has gap Ω(log n).」

5. 「PTAS: for any ε > 0, give (1+ε)-approximation in polynomial time.」

6. 「FPTAS: time is polynomial in both n and 1/ε — stronger than PTAS.」

7. 「FPRAS: randomized approximation scheme for counting problems.」

8. 「Knapsack has a PTAS — DP for big items, greedy for small items.」

9. 「The small items each weight ≤ εC, so even greedy is at most (1-ε) of optimal.」

10. 「Next time: FPTAS for knapsack and more applications of these approximation scheme techniques.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption，1902 words）雙語交叉對照
- **未使用 Whisper**：影片有完整 YouTube 自動字幕
- **無官方章節**：YouTube 影片 metadata 無 chapters
- **本筆記引用以 en 字幕為主**，zh-Hant 用於繁中關鍵概念對照
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture11_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（Duel Fitting、Integrality Gap、PTAS、FPTAS、Knapsack 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 3 分 22 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture11_口播稿.txt

- [opus 0.7 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture11.opus)（Telegram 友善）
- [m4a 2.3 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture11.m4a)（iOS 友善）
- [mp3 3.0 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture11.mp3)（通用格式）
