# 【Harvard CS224 高階演算法 — Lecture 15：線性規畫與單體法】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 86 分鐘**

---

> **影片連結**：https://youtu.be/U7158Q-2rJc
> **影片時長**：86 分鐘（5173 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption）

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms（高階演算法）」2014 年秋季學期（f14）的第十五堂課，主講者為 Jelani Nelson 教授。本堂課正式展開「**線性規畫（Linear Programming）**」這個主題：從線性規畫的基本定義、可行解區域的多面體幾何，到 Dantzig 的單體法如何沿著多面體頂點搜尋最優解。

課程設計的重點：

- **線性規畫定義**：給定 m 個約束、n 個變數的系統，目標是最小化 cᵀx，滿足 Ax = b、x ≥ 0
- **對偶理論**：每個 LP 都有對偶 LP，強對偶定理說明對偶值相等
- **多面體幾何**：可行解區域是多面體，頂點對應於 m 個線性獨立行
- **單體法流程**：從基本可行解開始，沿多面體邊移動到相鄰頂點
- **平滑分析**：解釋單體法的實務表現與最壞情況指數級的落差

---

## 二、章節脈絡

### Section 1｜線性規畫問題定義

**重點摘要：** 教授從線性規畫的標準形出發，介紹對偶理論與應用場景。

**內容：**

**標準形 LP：**
- 給定 m 個約束、n 個變數的系統
- 目標：最小化 cᵀx
- 約束：Ax = b、x ≥ 0
- A 是 m×n 矩陣，b ∈ ℝᵐ

**對偶理論：**
- 每個 LP 都有對偶 LP
- 強對偶定理：在適當條件下對偶值相等
- 對偶變數 y 對應約束
- 在經濟學上稱為影子價格（shadow price）

**應用場景：**
- 最短路徑
- 網路流
- 組合最佳化
- 半正定規畫的特例

> 「For any LP there is a dual LP, and under appropriate conditions, the dual value equals the primal value — this is strong duality.」

---

### Section 2｜多面體幾何與頂點

**重點摘要：** LP 的可行解區域是多面體，頂點對應於線性獨立的 active 約束。

**內容：**

**頂點定義：**
- 頂點是多面體中不能表示為其他兩點凸組合的點
- 在標準形 LP 中對應於約束矩陣的 m 個線性獨立行
- 對應於基本可行解

**基本解的數量：**
- 當 n = m 時基本解唯一
- 當 n > m 時有無窮多個基本可行解
- 每個基本可行解對應於一組 m 個線性獨立的 active 約束

**幾何直觀：**
- 非頂點解可以寫成頂點的凸組合
- 這是線性規畫理論的基礎
- 也是單體法終止在頂點的原因

---

### Section 3｜單體法的基本流程

**重點摘要：** 單體法從基本可行解開始，迭代選擇進入與離開變數，沿多面體邊移動。

**內容：**

**演算法流程：**
- 從一個基本可行解出發
- 選擇進入變數增加目標值
- 選擇離開變數維持可行性
- 沿多面體的一條邊移動到相鄰頂點
- 重複直到沒有改善為止

**迭代次數：**
- 總迭代數最多是多面體的頂點數
- 多面體頂點數在最壞情況下是指數級
- 這是單體法在最壞情況下表現不佳的原因

**實務表現：**
- 在實務中平均表現非常好
- Klee 與 Minty 在 1972 年構造出指數級的 worst case 實例
- 這個結果讓理論界對單體法的信心一度下降
- 但實際商業 LP solver 從未觀察到這種 worst case
- 這個矛盾啟發了平滑分析的研究

---

### Section 4｜退化與 cycling 問題

**重點摘要：** 單體法可能遇到退化問題，教授介紹 Bland 規則作為處理 cycling 的方法。

**內容：**

**退化問題：**
- 某個基本可行解對應的目標值在下一步沒有改善
- 演算法可能 cycling

**處理方法：**
- Lexicographic 規則：引入字典順序避免退化
- Perturbation：在 b 上加小擾動讓基本解唯一
- Bland 規則：給出進入與離開變數的選擇規則

**Bland 規則細節：**
- 進入變數選擇最小索引的非基本變數
- 離開變數選擇滿足最小比的最小索引
- 保證單體法在有限步內終止
- 並避免在退化情況下陷入無窮迴圈
- Bland 規則雖然簡單，但實際上很少被使用，因為實務上退化問題不常發生
- 這也是理論與實務脫節的一個例子

---

### Section 5｜實務與理論的落差

**重點摘要：** Spielman 與 Teng 的平滑分析解釋了單體法的實務表現。

**內容：**

**實務 vs 理論：**
- 單體法在實務中通常在 O 至 2n 次迭代內收斂
- 遠小於理論上的指數上界

**平滑分析：**
- 2001 年由 Spielman 與 Teng 提出
- 在實際輸入上加入微小隨機擾動
- 單體法的期望迭代數是 poly n 的
- 證明了單體法在擾動下的穩定性

**數學工具：**
- Smoothed complexity 是數學框架
- 期望迭代數公式涉及條件數分析
- Bridging 理論與實務的有力工具
- Spielman 與 Teng 的這個工作獲得 2008 年 Gödel 獎
- 是理論電腦科學的重要里程碑
- 教授補充說明平滑分析也適用於其他演算法的實務分析

> 「Smoothed analysis explains why simplex is so fast in practice: with small random perturbations, the expected number of iterations is polynomial.」

---

### Section 6｜課程結論

**重點摘要：** 總結線性規畫的幾何直觀與單體法的理論地位。

**內容：**
- 多面體、頂點、邊構成 LP 的幾何直觀
- 單體法沿邊走訪頂點直到最優，是 1947 年 Dantzig 的經典發明
- 雖然最壞情況複雜度是指數級，但實務表現優異
- 平滑分析解釋了這個落差
- 接下來的課程會介紹 Bland 規則處理 cycling、互補鬆弛條件
- 以及橢球演算法作為多項式時間的替代方案
- 最後探討內點法的多項式時間保證

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **線性規畫 LP** | 給定線性約束與線性目標的最佳化問題 |
| **對偶 LP** | 從原始 LP 衍生的對偶問題 |
| **強對偶定理** | 在適當條件下對偶值相等 |
| **影子價格** | 對偶變數的值，在經濟學上表示邊際價值 |
| **多面體** | LP 可行解區域的幾何形狀 |
| **頂點** | 多面體中不能表示為其他兩點凸組合的點 |
| **基本可行解** | 對應於 m 個線性獨立 active 約束的頂點 |
| **單體法** | Dantzig 1947 年的 LP 求解演算法，沿多面體邊搜尋 |
| **退化** | 多個頂點對應同一個目標值的情況 |
| **Bland 規則** | 處理退化 cycling 的單體法變體 |
| **平滑分析** | Spielman-Teng 2001 年的實務表現分析框架 |
| **Klee-Minty 立方體** | 1972 年的單體法最壞情況實例 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 86 分鐘（5173 秒） | 影片總長度 |
| O 至 2n | 單體法實務迭代次數 |
| 指數級 | 單體法最壞情況迭代次數上界 |
| poly(n) | 平滑分析下的單體法期望迭代次數 |
| 1947 | Dantzig 單體法論文年代 |
| 1972 | Klee-Minty worst case 構造 |
| 2001 | Spielman-Teng 平滑分析 |
| 2008 | Spielman-Teng 獲得 Gödel 獎 |

---

## 五、核心主旨

> 線性規畫的幾何直觀：多面體、頂點、邊。單體法沿邊走訪頂點直到最優，是 1947 年 Dantzig 的經典發明。雖然最壞情況複雜度是指數級，但實務表現優異，平滑分析解釋了這個落差。理解 LP 的幾何結構是設計單體法變體與分析 LP 對偶的基礎。

---

## 六、金句摘錄

1. 「For any LP there is a dual LP, and under appropriate conditions, the dual value equals the primal value — this is strong duality.」

2. 「A vertex of a polytope is a point that cannot be expressed as a convex combination of two other points in the polytope.」

3. 「The simplex method starts at a basic feasible solution and moves along an edge to an adjacent vertex at each iteration.」

4. 「Klee and Minty in 1972 constructed a perturbed cube that gives exponential worst case for simplex.」

5. 「Smoothed analysis explains why simplex is so fast in practice: with small random perturbations, the expected number of iterations is polynomial.」

6. 「The dual variable yᵢ tells you the marginal value of constraint i at the optimum — this is the shadow price.」

7. 「When n equals m, the basic solution is unique; when n is larger than m, there are infinitely many basic feasible solutions.」

8. 「Bland's rule is theoretically elegant but rarely used in practice, illustrating the gap between theory and implementation.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption）
- **未使用 Whisper**：影片有完整 YouTube 自動字幕，無需 Whisper fallback
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **本筆記以繁體中文撰寫**，專業術語（LP、simplex、polytope 等）保留英文原文並附中文說明
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture15_口播稿.txt`
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 48 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture15_口播稿.txt

- [opus 2.3 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture15.opus)（Telegram 友善）
- [m4a 4.6 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture15.m4a)（iOS 友善）
- [mp3 4.4 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture15.mp3)（通用格式）