# 【Harvard CS224 高階演算法 — Lecture 24：快速指數時間演算法 — Divide-and-Conquer、Pruned Brute Force、隨機化與 Inclusion-Exclusion】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 86分鐘**

---

> **影片連結**：https://youtu.be/GAKpnKLnJtc
> **影片時長**：86 分鐘（5163 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：影片無自動字幕（YouTube 未產生），使用 Whisper small 模型從音訊重新聽寫

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms」Lecture 24，本講介紹快速指數時間演算法的四種核心技巧，用於處理 NP-hard 問題時儘量壓低指數基數：（1）指數型 divide-and-conquer，把 TSP 從階乘級壓到 4 的 n 次方級；（2）pruned brute force，把 3-SAT 從 2 的 n 次方壓到根號 3 的 n 次方；（3）隨機漫步（Schöning's algorithm），把 3-SAT 壓到 4/3 的 n 次方；（4）inclusion-exclusion，把 k-coloring 壓到 2 的 n 次方。教授特別強調時間與空間的權衡：有些技巧把指數時間換成多項式空間，反之亦然。

課程設計的重點：

- **指數型 divide-and-conquer**：在指數時間下維持多項式空間
- **Pruned brute force**：利用剪枝條件降低分支因子
- **Schöning 隨機漫步**：Markov chain 分析結合隨機指派
- **Inclusion-exclusion 與 Möbius inversion**：組合計數的工具套用到 k-coloring

---

## 二、章節脈絡

### Section 1｜課程方向與四種技巧（00:00 ~ 06:00）

**重點摘要：** 教授宣告課程進入 NP-hard 問題的指數時間加速主題，並列出四種核心技巧的清單。

**內容：**
- 課程剩三講：今天是第一講談快速指數時間演算法
- NP-hard 問題的兩條路徑：approximation（多項式時間近似解）vs 指數時間精確解
- 四種技巧：exponential divide-and-conquer、pruned brute force、隨機化、inclusion-exclusion
- O* 記號：poly(n) × f(n)，忽略多項式因子
- 目標：把指數基數從階乘或 n^n 壓到 4 的 n 次方、根號 3 的 n 次方、4/3 的 n 次方、2 的 n 次方

---

### Section 2｜TSP 與指數型 Divide-and-Conquer（06:00 ~ 22:00）

**重點摘要：** 展示如何把 TSP 從階乘級時間壓到 4 的 n 次方級時間，同時保持多項式空間。

**內容：**

**TSP 樸素演算法：**
- 枚舉中間頂點的所有排列：n! 時間、多項式空間
- 動態規劃版本：f(x, S) = 從 x 到 t 走過 S 中所有點的最短路徑
- 時間 O*(2^n)、空間 O*(2^n)

**指數型 Divide-and-Conquer：**
- 把路徑切成前後兩半，窮舉前半段的子集合 s 與中間點 m
- opt(U, s, t) = min over s ⊆ U, |s| = |U|/2 + 1, m ∈ s∩T 的 [opt({s}, s, m) + opt({T}, m, t)]
- 空間：遞迴深度 O(log n)，每層只需多項式記憶體
- 時間遞迴式：T(n) = (n-2) × C(n-2, n/2) × T(n/2) ≈ (4.01)^n
- 屬於「時間換空間」：4.01^n 時間但多項式空間

> 「There's a tantalizing open problem: can we get O*(2^n) time with poly space for TSP?」

---

### Section 3｜3-SAT 的 Pruned Brute Force（22:00 ~ 50:00）

**重點摘要：** 教授展示 3-SAT 的三種剪枝演算法，從 2^n 一直壓到根號 3 的 n 次方。

**內容：**

**樸素 Brute Force：**
- 時間 O*(2^n)、空間 poly(n)
- 枚舉所有指派

**剪枝 Brute Force v1：**
- 對每個子句，嘗試把它的三個文字之一設為真
- 若分支失敗則假設某變數為假，剪掉部分指派空間
- 遞迴式：T(n) ≤ 3 × T(n-1) + poly(n)
- 解為 O*(3^n)（比樸素更差）

**剪枝 Brute Force v2：**
- 設定 X 為真，若失敗則假設 X 為假
- 子句若有 not X 可移除該文字，減少到兩個文字
- 改進遞迴式：T(n) ≤ T(n-1) + T(n-2) + T(n-3) + poly(n)
- 解約為 O*(1.84^n)

**剪枝 Brute Force v3（漢明距離假設）：**
- 假設滿足指派 A* 與某指派 A 的漢明距離 ≤ n/2
- 每次找未滿足子句並翻轉其中一個變數
- 翻轉 n/2 次後若未找到則失敗
- 三分支後總時間 O*(√3^n) ≈ O*(1.73^n)

> 「If we assume there's an assignment within Hamming distance n/2, then the brute force recursion takes (√3)^n time.」

---

### Section 4｜Schöning 隨機演算法（50:00 ~ 70:00）

**重點摘要：** 教授介紹 Schöning 2002 的隨機演算法，用 Markov chain 分析把 3-SAT 壓到 4/3 的 n 次方時間。

**內容：**

**演算法：**
- 隨機選一個指派 a
- 重複 t 次：找未滿足子句 C，翻轉 C 中的隨機一個變數
- 若找到滿足指派則成功；t 步後仍無則失敗

**Markov Chain 分析：**
- 狀態 = 當前指派到 A* 的漢明距離
- 每次翻轉：至少 1/3 機率往左（距離減少），至多 2/3 往右（距離增加）
- 簡化為無界路徑上的隨機漫步：左 1/3、右 2/3
- 從距離 k 出發，恰好 3k 步抵達零的機率 = C(3k, k) × (1/3)^k × (2/3)^(2k)
- 由 Stirling 公式 ≈ 1/√k × 1/2^k
- 對所有可能的 k 求和：P(success) ≈ 1/√n × (3/4)^n
- 重複 1/P(success) 次後成功機率近一
- 總時間：(4/3)^n × poly(n)

**後續改進：**
- 2002 Schöning：O*((4/3)^n)
- 2014 Hertli & Sycom：O*(1.307^n) 隨機
- 確定性最佳：O*(1.330^n)

> 「By Markov chain analysis, the probability of success in 3n steps is roughly (3/4)^n, so we repeat (4/3)^n times.」

---

### Section 5｜Inclusion-Exclusion 與 k-coloring（70:00 ~ 80:00）

**重點摘要：** 教授介紹第四種技巧 inclusion-exclusion，並展示如何應用到 k-coloring 問題。

**內容：**

**Inclusion-Exclusion 定理：**
- 對所有 r ⊆ t：Σ_{r ⊆ s ⊆ t} (-1)^(|t|-|s|) = [r = t]
- 證明：r = t 時只有 s = t 一項 = 1；r ≠ t 時奇偶配對抵消

**應用到 k-coloring：**
- 定義 f(S) = [S 是非空獨立集]（指示函數）
- Zeta transform：f̂(S) = Σ_{R ⊆ S} f(R) = S 中非空獨立集的數量
- 定理：圖 g 可 k 著色 ⟺ Σ_{S ⊆ V} (-1)^(|V|-|S|) × f̂(S)^k > 0
- 證明留到下次（lecture 25）

**演算法時間：**
- 計算所有 f̂(S) 值：O*(3^n) 時間、poly(n) 空間
- 或 O*(2^n) 時間、O*(2^n) 空間
- 後續可改進到 O*(2^2.461) 時間、poly 空間
- O*(2^n) 時間、poly 空間仍是公開問題

> 「A graph is k-colorable iff the sum of (-1)^(|V|-|S|) × f̂(S)^k over all S ⊆ V is positive.」

---

### Section 6｜結論（80:00 ~ 86:00）

**重點摘要：** 總結四種技巧如何把 NP-hard 問題的指數基數壓低，並指出極限與開放問題。

**內容：**
- TSP：指數型 D&C 從 n! 壓到 4.01^n
- 3-SAT：剪枝從 2^n 壓到 √3^n；隨機化進一步壓到 (4/3)^n
- k-coloring：inclusion-exclusion 壓到 2^n 時間
- 核心訊息：即使無法在多項式時間解決，仍可把指數基數壓到符合實務
- 開放問題：2^n 時間 + poly 空間是否對所有 NP-hard 問題可達

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **O\* 記號** | 忽略多項式因子的漸近記號，O*(f(n)) = poly(n) × f(n) |
| **TSP** | 旅行推銷員問題，找拜訪所有頂點一次的最短路徑 |
| **Exponential Divide-and-Conquer** | 指數型分治，把問題切成指數多個子問題，但空間維持多項式 |
| **3-SAT** | 判斷 3-CNF 公式是否可滿足的問題 |
| **Pruned Brute Force** | 剪枝暴力搜尋，利用邏輯推論減少分支 |
| **Hamming Distance** | 兩個二元字串中相異位元的數量 |
| **Schöning's Algorithm** | 隨機漫步演算法，從隨機指派出發反覆翻轉未滿足子句中的變數 |
| **Markov Chain** | 隨機過程，下一狀態只與當前狀態有關 |
| **Inclusion-Exclusion** | 對集合族計數的代數技巧，把交集計數轉為子集求和 |
| **Zeta Transform** | f̂(S) = Σ_{R ⊆ S} f(R)，子集求和變換 |
| **Möbius Inversion** | Zeta transform 的反變換 |
| **k-coloring** | 對圖的頂點著色使相鄰頂點不同色，最多 k 種顏色 |
| **Independent Set** | 圖中兩兩不相鄰的頂點集合 |
| **AM (Alon-Mansour)** | 用於證明 lower bound 的編碼論證技巧 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 86 分鐘（5163 秒） | 影片總長度 |
| 42,425 字元 | Whisper 聽寫後的英文逐字稿字元數 |
| n! | TSP 樸素演算法的時間 |
| 4.01^n | TSP 指數型 D&C 的時間 |
| 2^n | 3-SAT 樸素演算法的時間 |
| 1.84^n | 3-SAT 剪枝 brute force v2 的時間 |
| √3^n ≈ 1.73^n | 3-SAT 漢明距離剪枝 brute force 的時間 |
| (4/3)^n ≈ 1.33^n | Schöning 隨機演算法的時間 |
| 1.307^n | 2014 Hertli-Sycom 隨機演算法的時間 |
| 1.330^n | 確定性最佳演算法的時間 |
| 3^n | Inclusion-exclusion k-coloring 時間 + poly 空間 |
| 2.461^n | Inclusion-exclusion 改進時間 + poly 空間 |
| (3/4)^n | Schöning 演算法單次成功率 |

---

## 五、核心主旨

> NP-hard 問題無法在多項式時間內精確解決，但可以透過快速指數時間演算法把指數基數壓到符合實務需求。本講介紹四種技巧：指數型 divide-and-conquer 把 TSP 從階乘級壓到 4^n；pruned brute force 配合漢明距離假設把 3-SAT 壓到 √3^n；隨機漫步（Schöning）進一步壓到 (4/3)^n；inclusion-exclusion 與 Möbius inversion 把 k-coloring 壓到 2^n。這些技巧的共通點是：利用問題的結構特性（路徑的對稱性、剪枝條件、隨機性、組合計數恆等式）把樸素枚舉的指數空間縮小。極限問題是 2^n 時間 + poly 空間是否對所有 NP-hard 問題可達。

---

## 六、金句摘錄

1. 「Today I'll talk about fast exponential time algorithms for NP-hard problems. We want to make the exponential as small as possible.」

2. 「For TSP, we can get O*(n!) time with poly space, or O*(2^n) time with O*(2^n) space, or O*(4^n) time with poly space.」

3. 「For 3-SAT, pruned brute force gives O*(1.84^n), and with Hamming distance assumption we get O*(√3^n).」

4. 「Schöning's algorithm uses a random walk on assignments: flip a random variable in an unsatisfied clause, repeat.」

5. 「The success probability of Schöning's algorithm in 3k steps is approximately 1/√k × 1/2^k, so total is (4/3)^n.」

6. 「A graph is k-colorable iff the inclusion-exclusion sum Σ (-1)^(|V|-|S|) × f̂(S)^k is positive.」

7. 「We can compute k-colorability in O*(3^n) time with poly space, or O*(2^n) time with O*(2^n) space.」

8. 「It's an open problem to get O*(2^n) time with poly(n) space for general NP-hard problems.」

9. 「The zeta transform f̂(S) counts the number of non-empty independent sets in S.」

10. 「In practice, SAT solvers like DPLL are much faster than the theoretical bounds, but NP-hard instances are carefully crafted to be hard.」

---

## 七、備註

- **字幕來源**：影片無 YouTube 自動字幕，使用 Whisper small 模型從音訊重新聽寫
- **無字幕原因**：該影片未由 YouTube 自動語音辨識產生字幕（推測可能是早期上傳未觸發 ASR、或 ASR 失敗）
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由 Whisper 逐字稿時序分析整理
- **英文逐字稿字數**：42,425 字元（Whisper small 模型聽寫，未清理標點）
- **逐字稿品質**：Whisper small 在 Jelani Nelson 口音 + 數學術語下表現尚可，偶有技術詞拼寫錯誤（如 "n choose k" 可能誤為 "in choose k"），但內容可辨識
- **TTS 口播稿另見**：`transcripts/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture24_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（Markov chain、inclusion-exclusion、Möbius inversion、zeta transform、Schöning algorithm 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 27 秒
> 口播稿原文：transcripts/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture24_口播稿.txt

- [opus 2.1 MB](../audio/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture24.opus)（Telegram 友善）
- [m4a 4.2 MB](../audio/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture24.m4a)（iOS 友善）
- [mp3 4.1 MB](../audio/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture24.mp3)（通用格式）