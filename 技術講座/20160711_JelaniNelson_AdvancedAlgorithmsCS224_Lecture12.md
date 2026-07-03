# 【Harvard CS224 高階演算法 — Lecture 12：DNF 計數 FPRAS、半正定規畫與 Max-Cut 0.878 逼近】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 85 分鐘**

---

> **影片連結**：https://youtu.be/2Gl-yNso0_0
> **影片時長**：85 分鐘（5104 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption）

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms（高階演算法）」2014 年秋季學期（f14）的第十二堂課，主講者為 Jelani Nelson 教授。本堂課正式展開「**逼近演算法的下半場**」這個主題：先回顧 Knapsack 的 FPTAS 通用架構，再深入 DNF 計數問題的 FPRAS，然後引入半正定規畫（SDP）作為新的最佳化工具，最後用 Max-Cut 切割問題展示 SDP 如何達到經典的 0.878 逼近比。

課程設計的重點：

- **FPTAS 通用架構**：從 pseudo-polynomial 演算法透過對某個參數四捨五入得到 FPTAS，這是普世的設計模式
- **DNF 計數與 #P 完備性**：counting 問題比 decision 問題更難，需要 FPRAS 來處理
- **Karp-Luby FPRAS**：透過 Monte Carlo 採樣估計 #P 問題，給出 (1 ± ε) 逼近
- **半正定規畫 SDP**：把 LP 的向量變數推廣到矩陣變數，加上 positive semidefinite 約束
- **Max-Cut 與 Goemans-Williamson**：用 SDP 放鬆 + 隨機超平面切割達到 0.878 逼近比，這是最佳值除非 P=NP

---

## 二、章節脈絡

### Section 1｜Knapsack FPTAS 回顧與通用架構

**重點摘要：** 教授先用 Knapsack 的 FPTAS 做為暖身，並指出 FPTAS 是 pseudo-polynomial 演算法的通用升級路徑。

**內容：**
- FPTAS 精神：先對價值做四捨五入到 b bits，再用動態規畫把權重為 nW 的問題降到 n 乘以二的 b 次方
- 時間複雜度：poly n 除以 ε，這對所有 pseudo-polynomial 演算法都通用
- 設計模式：任何 pseudo-poly 時間的演算法都可以透過對某個參數四捨五入變成 FPTAS
- 普適性：從 Knapsack 延伸到 Subset Sum、bin packing 等問題都適用

> 「A FPTAS is essentially what you get when you take a pseudo-polynomial time algorithm and round one of the quantities involved in the pseudo-polynomial bound.」

---

### Section 2｜DNF 計數問題與 #P 完備性

**重點摘要：** 進入 DNF 計數問題，給定 DNF 公式計算滿足賦值的數量，這是 #P 完備問題，比 NP 更難。

**內容：**

**問題定義：**
- DNF 公式有 m 個子句、每子句最多 k 個字、總共 n 個不同布林變數
- 計算滿足賦值的數量
- 屬於 #P 完備問題，計算版本甚至比 NP 還難

**#P 完備類別：**
- 包含所有 NP 問題加上 counting 版本
- 給定 NP 機器接受路徑數的計算問題屬於 #P 完備
- 範例：Permutations 問題屬於 #P 完備

**為什麼 #P 難：**
- 即使問題可在多項式時間內 decision，counting 版本仍可能很難
- 例如 SAT decision 是 NP-complete，但 #SAT 是 #P-complete
- 計算 #SAT 等於計算接受路徑數

---

### Section 3｜Karp-Luby FPRAS 演算法細節

**重點摘要：** 介紹 Karp 與 Luby 在 1980 年提出的 FPRAS，給定任意 δ 與 ε，演算法在 poly n log 1/δ 時間內回傳一個 ε 逼近。

**內容：**

**Estimator 設計：**
- 目標：估計子集 A 大小對總集大小 U 的比例 p = |A| / |U|
- 方法：從 U 中均匀採樣，得到子集 B
- 計算 |A ∩ B| / |B| 作為 p 的 estimator
- 乘以 |U| 得到 |A| 的估計值

**統計分析：**
- Estimator 是無偏的
- 變異數上界是 1/p
- Chernoff bound 給出指數級的集中
- 採樣複雜度：O((1/p) log(1/δ) / ε²)

**FPRAS 核心精神：**
- 把 #P 難問題轉化為多項式時間的 Monte Carlo 估計
- 透過均匀採樣把 NP 搜尋問題轉化為計數估計

> 「The estimator is unbiased and the variance is bounded by 1 over p, so by Chernoff we get exponential concentration.」

---

### Section 4｜半正定規畫 SDP 簡介

**重點摘要：** 引入半正定規畫，把 LP 的向量變數推廣到矩陣變數，加上 positive semidefinite 約束。

**內容：**

**LP vs SDP：**
- LP：Ax = b，x ∈ ℝⁿ，最小化 cᵀx
- SDP：把 x xᵀ 換成矩陣 X，加上 X 是 PSD 的約束
- 目標函數：Tr(CX) 最小化
- 約束：Tr(AᵢX) = bᵢ

**為什麼 SDP 更強：**
- 能表示向量之間的內積與範數約束
- Max-Cut 這類組合問題中 SDP 比 LP 強很多
- SDP 屬於凸最佳化，所以可以用內點法多項式時間求解
- 從理論到實務都可行

---

### Section 5｜Max-Cut 與 Goemans-Williamson 逼近

**重點摘要：** Max-Cut 問題是給定圖 G 把頂點分成兩組讓切割邊數最大，介紹 Goemans-Williamson 1995 的 0.878 逼近演算法。

**內容：**

**問題定義：**
- 給定圖 G = (V, E)，頂點分成兩組 S 與 V\S
- 切割邊：端點在不同組的邊
- 目標：最大化切割邊數
- NP 難問題

**Goemans-Williamson 演算法：**
- 對每個頂點 i 對應到單位向量 vᵢ
- 求解放鬆後的 SDP
- 用隨機超平面切割：r 是隨機向量，根據 sign(rᵀvᵢ) 決定頂點分組
- 切割邊被切的機率 = θ/π，其中 θ = arccos(vᵢᵀvⱼ)
- 期望切割數 ≥ 0.878 × SDP 上界

**為什麼 0.878 是最佳：**
- 0.878 數字來自於 θ/π 的最小值除以 (1/π) 的積分
- 完全圖的 PCP 證據顯示超越這個比例是不可能的
- 除非 P = NP，這個 0.878 牆無法突破

> 「We get 0.878 by taking the minimum of θ/π over θ in [0, π], divided by 1/π.」

---

### Section 6｜課程結論

**重點摘要：** 完整展示逼近演算法的設計哲學，並預告下堂課主題。

**內容：**
- FPTAS：對 pseudo-poly 演算法做四捨五入
- FPRAS：用 Monte Carlo 採樣估計 #P 問題
- SDP：放鬆組合問題再用隨機切割
- Max-Cut 0.878 結果說明逼近比存在不可超越的牆
- 下堂課會把這些技術擴展到更多幾何與圖論問題

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **FPTAS** | Fully Polynomial-Time Approximation Scheme，給定任意 ε，在 poly(n, 1/ε) 時間內給出 (1 ± ε) 逼近 |
| **FPRAS** | Fully Polynomial Randomized Approximation Scheme，給定任意 ε 與 δ，以至少 1-δ 機率給出 (1 ± ε) 逼近 |
| **DNF 計數** | 給定 DNF 公式，計算滿足賦值的數量 |
| **#P 完備** | Counting 問題的完備類別，比 NP 完備更難 |
| **Karp-Luby** | 1980 年的 FPRAS，用 Monte Carlo 採樣估計 DNF 計數 |
| **半正定規畫 SDP** | 把 LP 的向量變數推廣到矩陣變數，加上 PSD 約束 |
| **Max-Cut** | 把圖頂點分成兩組，最大化切割邊數 |
| **Goemans-Williamson** | 1995 年的 0.878 逼近演算法，用 SDP + 隨機超平面切割 |
| **PCP 定理** | Probabilistically Checkable Proofs，證明某些問題的逼近硬度 |
| **Smoothed Analysis** | Spielman-Teng 2001 年的平滑分析框架 |
| **Estimator** | 用樣本估計未知參數的函數，無偏 estimator 期望等於真值 |
| **Chernoff Bound** | 獨立隨機變數和的指數級集中不等式 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 85 分鐘（5104 秒） | 影片總長度 |
| poly(n, 1/ε) | FPTAS 時間複雜度 |
| poly(n, 1/ε, log 1/δ) | FPRAS 時間複雜度 |
| 1/p | FPRAS estimator 的變異數上界 |
| 0.878 | Max-Cut 的 Goemans-Williamson 逼近比 |
| 1980 | Karp-Luby FPRAS 論文年代 |
| 1995 | Goemans-Williamson Max-Cut 論文年代 |
| 2008 | Spielman-Teng 平滑分析獲得 Gödel 獎 |

---

## 五、核心主旨

> 逼近演算法的設計哲學有三條主要路徑：對 pseudo-polynomial 演算法做四捨五入得到 FPTAS、用 Monte Carlo 採樣估計 #P 問題得到 FPRAS、用 SDP 放鬆組合問題再用隨機切割得到超越 Greedy 的逼近比。Max-Cut 的 0.878 結果說明在某些問題上，逼近比存在不可超越的牆，除非 P 等於 NP。理解這些技術的適用條件，是設計逼近演算法的核心能力。

---

## 六、金句摘錄

1. 「A FPTAS is essentially what you get when you take a pseudo-polynomial time algorithm and round one of the quantities involved in the pseudo-polynomial bound.」

2. 「DNF counting is #P-complete, which means computing the number of satisfying assignments is even harder than deciding whether any assignment exists.」

3. 「The estimator is unbiased and the variance is bounded by 1 over p, so by Chernoff we get exponential concentration.」

4. 「SDP replaces the vector variable x with a matrix variable X subject to X being positive semidefinite, which lets us express inner product constraints.」

5. 「We get 0.878 by taking the minimum of θ/π over θ in [0, π], divided by 1/π.」

6. 「The 0.878 ratio is optimal unless P equals NP, as shown by PCP evidence for the complete graph.」

7. 「Monte Carlo sampling converts a #P-hard counting problem into a polynomial-time estimation problem with bounded variance.」

8. 「The SDP relaxation of Max-Cut is stronger than any LP relaxation because it captures inner products between vertex vectors.」

9. 「Goemans-Williamson uses a random hyperplane cut: the probability that edge (i,j) is cut equals arccos(vᵢᵀvⱼ)/π.」

10. 「Combining pseudo-polynomial algorithms with rounding gives FPTAS in a universal way.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption）
- **未使用 Whisper**：影片有完整 YouTube 自動字幕，無需 Whisper fallback
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **本筆記以繁體中文撰寫**，專業術語（FPTAS、FPRAS、SDP、PCP 等）保留英文原文並附中文說明
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture12_口播稿.txt`
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 39 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture12_口播稿.txt

- [opus 2.3 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture12.opus)（Telegram 友善）
- [m4a 4.5 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture12.m4a)（iOS 友善）
- [mp3 4.3 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture12.mp3)（通用格式）