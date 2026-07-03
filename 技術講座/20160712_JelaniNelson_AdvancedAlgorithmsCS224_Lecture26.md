# 【Harvard CS224 高階演算法 — Lecture 26：Streaming Algorithms 與 Linear Sketching — 從 F0 Distinct Elements 到 F2 L2 Norm 的 AMS 草圖】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 85分鐘**

---

> **影片連結**：https://youtu.be/DpxNW0T8CWg
> **影片時長**：85 分鐘（5102 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption，約 3,000 cues）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms」Lecture 26，也是本學期最後一講，主題是 streaming algorithms 與 linear sketching。教授聚焦在兩個核心問題：（1）F0 distinct elements（支援大小），用隨機 hash 函數估計；（2）F2（L2 norm）estimation，用 Alon-Matias-Szegedy（AMS）的 linear sketch 估計。本講展示當資料量太大無法儲存時，如何用隨機化把高維向量壓縮到小空間，再從草圖估計所需的統計量。教授也簡介 Johnson-Lindenstrauss 維度縮減與點查詢，並預告下學期 CS 229r 會更深入探討。

課程設計的重點：

- **Streaming 模型**：更新序列 x_i → x_i + v，要計算函數 f(x) 但無法儲存整個向量
- **F0 支援大小**：用隨機 hash 估計 distinct element 數量
- **AMS Linear Sketch**：用隨機 ±1 矩陣估計 L2 norm
- **失敗機率降低**：中位數技巧與平均化
- **維度縮減**：Johnson-Lindenstrauss lemma

---

## 二、章節脈絡

### Section 1｜串流模型回顧（00:00 ~ 12:00）

**重點摘要：** 教授定義 streaming 計算模型並回顧 F0 distinct elements 問題。

**內容：**

**Streaming 模型：**
- 輸入：長度 m 的更新序列 x_i → x_i + v
- 初始向量 x = 0
- 要計算函數 f(x) 但無法儲存整個向量
- 目標：空間複雜度遠小於 n

**F0 Distinct Elements 問題：**
- F0(x) = |{i : x_i ≠ 0}| = 支援大小
- 應用：路由器一天收到多少不同 IP 位址
- 樸素演算法：n 位元記錄每座標，或 m log n 位元儲存所有元素

**下界：**
- 任何 deterministic 演算法需要 ω(min(n, m)) 位元
- 證明：編碼論證，壓縮任意 n 位元字串成更短會違反鴿籠原理

> 「Any deterministic algorithm for F0 requires ω(min(n,m)) bits of space.」

---

### Section 2｜Random Hash 估計 F0（12:00 ~ 25:00）

**重點摘要：** 教授展示 Bar-Yossef-Kumar 演算法，用隨機 hash 估計 F0。

**內容：**

**演算法：**
- 對串流中每個元素 i 用隨機 hash 函數 h：{1,...,n} → [0,1]
- 記錄 z = min_{i 在 stream} h(i)
- 估計 F0 ≈ 1/z - 1

**直覺：**
- 把 F0 個元素隨機 hash 到 [0,1]
- 最小值期望約為 1/(F0+1)
- 所以 F0 ≈ 1/z - 1

**變異數降低：**
- 單一 hash 估計的變異數是常數倍
- 用 R = O(1/ε²) 個獨立 hash 函數平均
- 把變異數壓到 (1+ε) 倍乘 F0²
- 中位數技巧取 R log(1/δ) 個副本，失敗機率降到 δ

> 「The expected minimum hash value is 1/(F0+1), so F0 ≈ 1/z - 1.」

---

### Section 3｜L2 Norm 與 Linear Sketching（25:00 ~ 40:00）

**重點摘要：** 教授引入 linear sketching 框架，並展示為何 F0 的方法不能直接處理 L2 norm。

**內容：**

**L2 Norm 問題：**
- 給定 x ∈ R^n，估計 ||x||_2² 到 (1+ε) 倍誤差
- 空間遠小於 n

**為何 F0 方法不夠：**
- F0 用最小 hash 值估計，刪除時最小值失去意義
- 例如：刪除對應最小 hash 的元素後，不知道次小值
- 必須用支援插入與刪除的資料結構

**Linear Sketching 框架：**
- 選 m × n 矩陣 Π（通常 m << n）
- 存 y = Πx
- 更新時：x_i += v → y += v × Π_*,i
- 支援任意更新（插入或刪除）

**Lyu-Woodruff 定理：**
- 任何支援刪除的 streaming 演算法可轉成 linear sketch
- 空間最多差 O(log n) 倍

> 「Linear sketching lets you support deletions because the sketch y = Πx is linear in x.」

---

### Section 4｜AMS 演算法分析（40:00 ~ 60:00）

**重點摘要：** 教授展示 Alon-Matias-Szegedy（AMS）演算法，用 ±1 隨機矩陣估計 L2 norm。

**內容：**

**AMS 演算法：**
- Π 的每個條目 Π_ij = σ_ij / √n，σ_ij 獨立 ±1
- y = Πx，估計 ||x||_2² ≈ ||y||_2²

**期望分析：**
- y_r = (1/√n) Σ_i σ_ri × x_i
- E[y_r²] = (1/m) ||x||_2²（交叉項期望為 0）
- E[||y||_2²] = Σ_r E[y_r²] = ||x||_2²

**變異數分析：**
- Var[y_r²] = E[y_r^4] - E[y_r²]²
- 展開後 = O(1) × ||x||_2^4 / m
- 取 m = O(1/ε²)，變異數 ≤ ε² × ||x||_2^4
- 由 Chebyshev 不等式：P[| ||y||_2² - ||x||_2² | > ε||x||_2² ] ≤ 1/3

> 「With m = O(1/ε²) measurements, the variance is bounded by ε² × ||x||_2^4, giving a (1+ε) approximation.」

---

### Section 5｜失敗機率降低與維度縮減（60:00 ~ 75:00）

**重點摘要：** 教授展示如何把失敗機率從 1/3 降到 δ，並簡介維度縮減。

**內容：**

**降低失敗機率：**
- 方法 1：對數(1/δ) 個獨立副本取中位數，失敗機率指數下降
- 方法 2：對單一草圖做多次 random sign 平均

**點查詢與維度縮減：**
- 給定矩陣 A，要在 streaming 中估計 (Ax)_j
- 使用 Johnson-Lindenstrauss 維度縮減
- 把 x 投影到 d = O(log n / ε²) 維空間
- 保持 L2 norm 到 (1+ε) 倍
- 在 d 維空間做估計，空間從 n 降到 d

**為何維度縮減有效：**
- JL lemma：對任何 n 維向量，投影到 d = O(log n / ε²) 維保持 pairwise distance 到 (1+ε)
- 應用到 streaming：先把高維資料降到低維草圖

> 「Johnson-Lindenstrauss reduces n dimensions to O(log n / ε²) while preserving L2 norms to (1+ε).」

---

### Section 6｜結論與延伸（75:00 ~ 85:00）

**重點摘要：** 教授總結 streaming algorithms 的核心思想，並預告下學期 CS 229r。

**內容：**

**核心思想：**
- 當資料量太大無法儲存時，用隨機 hash 或線性草圖壓縮到小空間
- F0 用最小 hash 值估計支援大小
- L2 norm 用 AMS 草圖估計能量
- 維度縮減把高維向量降到對數維度

**下學期 CS 229r 預告：**
- 點查詢：給定矩陣 A 估計 (Ax)_j
- 稀疏復原：從壓縮觀測中恢復稀疏向量
- 矩陣與圖的 streaming 模型
- CountMin、CountSketch 等實務演算法

**總結本學期：**
- 前 17 講：min-cost max-flow、link-cut trees
- 18-22 講：approximation algorithms、Friendly partitions
- 23 講：link-cut trees 完整分析 + min-cost flow
- 24-25 講：快速指數時間演算法
- 26 講：streaming 與 linear sketching

> 「Streaming algorithms show that when data is too large to store, random hashes and linear sketches let you estimate statistics in sublinear space.」

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Streaming Model** | 處理長度 m 的更新序列，計算函數 f(x) 但無法儲存整個向量 x |
| **F0 (Support Size)** | 向量中非零座標的數量 |
| **F2 (L2 Norm)** | 向量的 Euclidean 範數平方 |
| **F_k (Frequency Moments)** | F_k = Σ_i x_i^k，k 階頻率矩 |
| **Linear Sketching** | 對輸入向量 x 線性變換成低維表示 y = Πx |
| **AMS Sketch** | Alon-Matias-Szegedy 用 ±1 隨機矩陣估計 F2 的演算法 |
| **Johnson-Lindenstrauss Lemma** | 高維向量可投影到 d = O(log n / ε²) 維保持距離 (1+ε) |
| **Median Trick** | 取多個獨立副本的中位數，把失敗機率從 1/3 降到指數小 |
| **Chebyshev's Inequality** | P[\|X - E[X]\| > t] ≤ Var[X] / t² |
| **Markov Chain** | 下一狀態只與當前狀態有關的隨機過程 |
| **Frequency Estimation** | 估計串流中元素的出現頻率 |
| **Heavy Hitters** | 串流中出現頻率最高的幾個元素 |
| **Count-Min Sketch** | 用多個 hash 函數估計 frequency 的實務演算法 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 85 分鐘（5102 秒） | 影片總長度 |
| 約 3,000 cues | 英文自動字幕數量 |
| O(n) | F0 確定性演算法的空間下界 |
| O(log n / ε²) | JL 維度縮減的目標維度 |
| O(1/ε²) | AMS 草圖需要的測量次數 |
| 1/√n | AMS 矩陣條目的縮放因子 |
| Alon-Matias-Szegedy 1996 | AMS 演算法的原始論文 |
| m log n | 樸素 streaming 演算法的空間 |
| Bar-Yossef-Kumar | F0 隨機 hash 估計的論文 |
| Lyu-Woodruff | Linear sketch 通用轉換的定理 |

---

## 五、核心主旨

> 當資料量太大無法儲存時，streaming algorithms 用隨機 hash 或線性草圖把高維向量壓縮到小空間，再從草圖估計所需的統計量。本講聚焦在 F0 distinct elements（用隨機 hash 估計支援大小）與 F2 L2 norm（用 AMS 草圖估計能量）兩個核心問題。Linear sketching 的關鍵性質是支援插入與刪除，因為 y = Πx 對 x 是線性的。失敗機率透過中位數技巧降到指數小。維度縮減（Johnson-Lindenstrauss）把高維向量降到對數維度，進一步降低空間複雜度。教授預告下學期 CS 229r 會深入探討點查詢、稀疏復原、矩陣與圖的 streaming 模型。

---

## 六、金句摘錄

1. 「In the streaming model, we receive updates x_i → x_i + v and must answer queries about f(x) without storing the entire vector.」

2. 「Any deterministic algorithm for F0 requires ω(min(n,m)) bits of space.」

3. 「Linear sketching lets you support deletions because the sketch y = Πx is linear in x.」

4. 「AMS uses a random ±1 matrix scaled by 1/√n, then estimates ||x||_2² as ||y||_2².」

5. 「With m = O(1/ε²) measurements, the variance is bounded by ε² × ||x||_2^4, giving a (1+ε) approximation.」

6. 「The median trick takes O(log(1/δ)) independent copies and returns the median, driving failure probability down exponentially.」

7. 「Johnson-Lindenstrauss reduces n dimensions to O(log n / ε²) while preserving L2 norms to (1+ε).」

8. 「Lyu-Woodruff showed that any streaming algorithm supporting deletions can be converted to a linear sketch with O(log n) blowup.」

9. 「In CS 229r, we'll go deeper into point queries, sparse recovery, and matrix/graph streaming.」

10. 「The basic idea: hash F0 items into [0,1], the smallest hash value is approximately 1/(F0+1).」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption，約 3,000 cues）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照
- **未使用 Whisper**：影片有完整 YouTube 自動字幕（zh-Hant 與 en），無需 Whisper fallback
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **英文逐字稿字數**：41,490 字元（清理 VTT 時間碼、HTML 標籤後）
- **自動字幕品質**：zh-Hant 為 en 的機器翻譯版本；en 字幕對技術術語（AMS sketch、Johnson-Lindenstrauss、linear sketching、frequency moments 等）保留更精確
- **本筆記引用以 en 字幕為主，zh-Hant 用於中文關鍵概念對照**
- **TTS 口播稿另見**：`transcripts/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture26_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（AMS sketch、Johnson-Lindenstrauss、linear sketching、frequency moments 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 27 秒
> 口播稿原文：transcripts/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture26_口播稿.txt

- [opus 2.1 MB](../audio/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture26.opus)（Telegram 友善）
- [m4a 4.2 MB](../audio/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture26.m4a)（iOS 友善）
- [mp3 4.1 MB](../audio/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture26.mp3)（通用格式）