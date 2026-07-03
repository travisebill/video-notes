# 【Harvard CS224 高階演算法 — Lecture 25：Inclusion-Exclusion、Zeta Transform 與 Möbius Inversion 應用於 K-Coloring】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 86分鐘**

---

> **影片連結**：https://youtu.be/M42rQM0vC4g
> **影片時長**：86 分鐘（5174 秒）
> **整理日期**：2016-07-11
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption，約 3,000 cues）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms」Lecture 25，是 Lecture 24 inclusion-exclusion 主題的延伸。本講聚焦在 zeta transform 與 Möbius inversion 的精確定義，並展示如何把這些組合工具應用到 k-coloring 問題。教授證明 k-coloring 可在 O*(3^n) 時間 + 多項式空間內解決，或 O*(2^n) 時間 + O*(2^n) 空間內解決，大幅改善樸素枚舉的 k^n 時間。教授也補充了歷史脈絡：這個技巧由 Björklund-Husfeldt 與 Fox 兩個獨立團隊在 2006 年同時間系統化。

課程設計的重點：

- **Inclusion-Exclusion 與 Zeta Transform 的精確定義**
- **Möbius Inversion 的雙向性質（f̂̃ = f̃̂ = f）**
- **k-coloring 透過 inclusion-exclusion 化為子集上的求和**
- **3^n 時間多項式空間的演算法（座標遞迴展開）**

---

## 二、章節脈絡

### Section 1｜複習上節的 Inclusion-Exclusion（00:00 ~ 12:00）

**重點摘要：** 教授複習 inclusion-exclusion 恆等式，並嚴格定義 zeta transform 與 Möbius inversion。

**內容：**

**Inclusion-Exclusion 定理：**
- 對所有 r ⊆ t：Σ_{r ⊆ s ⊆ t} (-1)^(|t|-|s|) = [r = t]
- 證明：r = t 時只有 s = t 一項 = 1；r ≠ t 時奇偶配對抵消

**Zeta Transform 定義：**
- 給定函數 f：集合 → 環
- f̂(s) = Σ_{R ⊆ S} f(R)
- 即 f 在 s 所有子集上的和

**Möbius Inversion 定義：**
- f̃(S) = Σ_{R ⊆ S} (-1)^(|S|-|R|) × f(R)
- 與 zeta transform 互為反變換

**核心性質：**
- f̂̃ = f̃̂ = f（兩個方向都可以還原）
- 這個性質是 inclusion-exclusion 應用的基礎

> 「F-hat tilde equals F-tilde hat equals F. So you can do the transforms in either order.」

---

### Section 2｜k-coloring 與 Zeta Transform（12:00 ~ 30:00）

**重點摘要：** 教授把 zeta transform 應用到 k-coloring，給出雙重計數的等式，並用 Möbius inversion 推導出精確公式。

**內容：**

**k-coloring 問題：**
- 圖 g = (V, E)，|V| = n，|E| = m
- 找函數 c：V → {1, ..., k} 使相鄰頂點不同色
- 等價於把 V 分割成 k 個獨立集

**定義：**
- f(S) = [S 是非空獨立集]（指示函數）
- f̂(S) = Σ_{R ⊆ S} f(R) = S 中所有非空獨立集的數量

**雙重計數等式（**）：**
- 左邊：g(s)^k = (把 s 切成 k 個非空獨立集的方法數)^k
- 右邊：f̂(s)^k = (s 中非空獨立集總數)^k
- 兩者計數相同事物（k 個都在 s 內的非空獨立集的有序選擇）

**Möbius 反變換：**
- g(V) = (f̂(S)^k 在 V 的 Möbius 反變換)
- 等價於：g(V) = Σ_{S ⊆ V} (-1)^(|V|-|S|) × f̂(S)^k

> 「G is k-colorable iff the inclusion-exclusion sum over all S ⊆ V of (-1)^(|V|-|S|) × f̂(S)^k is positive.」

---

### Section 3｜演算法時間與空間分析（30:00 ~ 60:00）

**重點摘要：** 教授證明如何用座標遞迴在 3^n 時間內計算所有 f̂(S) 值。

**內容：**

**演算法：**
- 對每個座標 i ∈ {1, ..., n}，定義 g(i, S) = 部分 zeta transform
- 遞迴式：
  - 若 i ∉ S：g(i, S) = g(i-1, S)
  - 若 i ∈ S：g(i, S) = g(i-1, S) + g(i-1, S-{i}) × f(i)
- 邊界：g(0, S) = 0
- 最終：g(n, S) = f̂(S)

**時間複雜度：**
- 對每個 S ⊆ V，遞迴展開需要 3^n 次操作（每個座標有 3 種選擇：不在 S、在 S 不翻轉、在 S 翻轉）
- 實際計算 f(i)（檢查 i 是否為獨立集）需多項式時間

**空間複雜度：**
- 只需要儲存當前遞迴狀態：多項式空間

**另一個變體：**
- 用 fast Möbius transform 可在 O*(2^n) 時間 + O*(2^n) 空間完成
- 兩種取捨：時間 3^n+空間 poly，或時間 2^n+空間 2^n

> 「We can compute all f̂(S) values in O*(3^n) time and poly space, or O*(2^n) time and O*(2^n) space.」

---

### Section 4｜Inclusion-Exclusion 的歷史脈絡（60:00 ~ 70:00）

**重點摘要：** 教授補充這個技巧在 2006 年的兩個獨立論文，以及後續改進。

**內容：**

**原始論文：**
- Björklund & Husfeldt 2006：O*(3^n) 時間 + poly 空間
- Fox 2006：O*(2^n) 時間 + O*(2^n) 空間
- 兩個獨立團隊同時間發表

**後續改進：**
- Björklund-Husfeldt 後續工作：O*(2^2.461) 時間 + poly 空間
- 開放問題：O*(2^n) 時間 + poly 空間是否可達
- 這個極限是 Inclusion-Exclusion 的本質限制

**應用範圍：**
- k-coloring、Hamiltonian 路徑、#P 計數問題
- 所有可用 inclusion-exclusion 表達的 NP-hard 問題

> 「It's an open problem to get O*(2^n) time with poly space using only inclusion-exclusion.」

---

### Section 5｜獨立計數應用（70:00 ~ 80:00）

**重點摘要：** 教授舉例 inclusion-exclusion 的其他應用，包括獨立集計數與 Hamiltonian 路徑判斷。

**內容：**

**獨立集計數：**
- 計算圖 g 中大小為 k 的獨立集數量是 #P 困難問題
- 用 inclusion-exclusion 可在 2^n 時間內精確計數所有大小的獨立集數量
- 方法：對每個子集應用 inclusion-exclusion + zeta transform 加速

**Hamiltonian 路徑：**
- 判斷圖是否存在 Hamiltonian 路徑
- 可表達為 inclusion-exclusion 形式
- 在 2^n 時間內解決，比 DP 的 2^n 空間版本省了大量記憶體

**其他 #P 問題：**
- 永恆式判定（permanent）
- 圖著色數計數
- 路徑計數

> 「The zeta transform + inclusion-exclusion framework is a powerful tool for #P-hard counting problems.」

---

### Section 6｜結論（80:00 ~ 86:00）

**重點摘要：** 教授總結 inclusion-exclusion 從數學恆等式推進到演算法工具的歷程。

**內容：**
- Inclusion-exclusion 不只是計數技巧，更是 subexponential 演算法的核心工具
- 透過 zeta transform 與 Möbius inversion，可在 3^n 時間內計算所有子集上的 transform 值
- 應用範圍：k-coloring、Hamiltonian path、#P counting
- 與 divide-and-conquer、隨機化結合可進一步改進
- 後續課程：streaming algorithms、linear sketching

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Inclusion-Exclusion** | 對集合族計數的代數技巧，把交集計數轉為子集求和 |
| **Zeta Transform** | f̂(S) = Σ_{R ⊆ S} f(R)，子集求和變換 |
| **Möbius Inversion** | f̃(S) = Σ_{R ⊆ S} (-1)^(|S|-|R|) × f(R)，zeta transform 的反變換 |
| **Fast Möbius Transform** | 在 3^n 時間內計算所有 f̂(S) 或 f̃(S) 值的演算法 |
| **k-coloring** | 對圖的頂點著色使相鄰頂點不同色，最多 k 種顏色 |
| **Independent Set** | 圖中兩兩不相鄰的頂點集合 |
| **Boolean Bracket** | [P] = 1 若 P 為真，否則 0 |
| **Ring** | 抽象代數結構，加法與乘法運算 |
| **Subset Convolution** | 把子集上的卷積運算用 zeta transform 加速的技巧 |
| **Björklund-Husfeldt** | 2006 年提出 inclusion-exclusion k-coloring 演算法的兩位學者 |
| **Fox** | 2006 年獨立提出類似演算法的學者 |
| **#P-hard** | 比 NP 更難的計數問題類 |
| **Hamiltonian Path** | 拜訪圖中每個頂點恰好一次的路徑 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 86 分鐘（5174 秒） | 影片總長度 |
| 約 3,000 cues | 英文自動字幕數量 |
| O*(3^n) | 計算所有 f̂(S) 值的時間 |
| O*(2^n) | 計算所有 f̂(S) 值的另一個時間（需要 O*(2^n) 空間） |
| O*(2^2.461) | 後續改進的時間 |
| k^n | k-coloring 樸素枚舉時間 |
| O*(n!) | TSP 樸素演算法的時間 |
| 2006 | Björklund-Husfeldt 與 Fox 發表 inclusion-exclusion k-coloring 演算法的年份 |
| 8 | n 個變數的 3-CNF 公式最大可能子句數（8 × n choose 3） |

---

## 五、核心主旨

> 本講把 inclusion-exclusion 從數學恆等式推進到演算法工具：透過 zeta transform 與 Möbius inversion，可以在 O*(3^n) 時間與多項式空間內計算所有子集上的 transform 值，從而把 k-coloring 等問題的指數基數壓到接近 2^n。這個技巧由 Björklund-Husfeldt 與 Fox 在 2006 年同時間系統化，後續可改進到 O*(2^2.461) 時間。教授總結這套技巧的價值：它把看似神秘的 inclusion-exclusion 變成可操作的演算法，並展示如何用 transform 觀點重新理解組合計數問題。本講也為下節的 streaming algorithms 鋪墊——把離散最佳化的指數技巧延伸到處理連續大規模資料的場景。

---

## 六、金句摘錄

1. 「F-hat tilde equals F-tilde hat equals F. This is the foundation of all inclusion-exclusion based algorithms.」

2. 「A graph is k-colorable iff the sum over all S ⊆ V of (-1)^(|V|-|S|) × f̂(S)^k is positive.」

3. 「We can compute all f̂(S) values in O*(3^n) time and poly space via coordinate recursion.」

4. 「The zeta transform is like a Fourier transform but on the subset lattice instead of cyclic groups.」

5. 「Both Björklund-Husfeldt and Fox independently developed this technique in 2006.」

6. 「It's an open problem to get O*(2^n) time with poly space using only inclusion-exclusion.」

7. 「The dual counting argument: g(s)^k on the left, f̂(s)^k on the right—both count the same thing.」

8. 「The 3^n time comes from three choices per coordinate: not in S, in S without flip, in S with flip.」

9. 「Inclusion-exclusion is a powerful tool for #P-hard counting problems like Hamiltonian path and independent set counting.」

10. 「The Möbius inversion recovers g(V) from the k-th power of the zeta transform.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption，約 3,000 cues）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照
- **未使用 Whisper**：影片有完整 YouTube 自動字幕（zh-Hant 與 en），無需 Whisper fallback
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **英文逐字稿字數**：43,159 字元（清理 VTT 時間碼、HTML 標籤後）
- **自動字幕品質**：zh-Hant 為 en 的機器翻譯版本；en 字幕對技術術語（zeta transform、Möbius inversion、inclusion-exclusion 等）保留更精確
- **本筆記引用以 en 字幕為主，zh-Hant 用於中文關鍵概念對照**
- **TTS 口播稿另見**：`transcripts/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture25_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（zeta transform、Möbius inversion、inclusion-exclusion、k-coloring 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 6 秒
> 口播稿原文：transcripts/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture25_口播稿.txt

- [opus 1.9 MB](../audio/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture25.opus)（Telegram 友善）
- [m4a 3.9 MB](../audio/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture25.m4a)（iOS 友善）
- [mp3 3.8 MB](../audio/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture25.mp3)（通用格式）