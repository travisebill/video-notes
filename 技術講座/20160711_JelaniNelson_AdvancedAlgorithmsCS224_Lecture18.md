# 【Harvard CS224 高階演算法 — Lecture 18：Newton's Method、進度定理與內點法的內層收斂】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 84分鐘**

---

> **影片連結**：https://youtu.be/kqt1YV9dEoE
> **影片時長**：1 小時 24 分鐘（5082 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms（高階演算法）」2014 年秋季學期（f14）的第 18 堂課，主講者為 Jelani Nelson 教授。延續前幾堂對內點法（interior point method）的鋪墊，本堂正式引入牛頓法（Newton's method）作為內點法的內層求解工具。牛頓法屬於二階優化方法，不只用到函數值與梯度，還能 query 函數的 Hessian 矩陣，從更完整的曲率資訊中榨出更快的收斂速度。

課程設計的重點：

- **從一階到二階方法**：梯度下降只用函數值與梯度；牛頓法還能用 Hessian——二階資訊換更高收斂速度
- **泰勒展開的幾何意涵**：牛頓法的更新規則是對二階泰勒展開取極值的結果
- **進度定理**：在兩次迭代之間 Hessian 變化平緩的假設下，梯度範數以幾何級數收斂
- **譜定理的角色**：把抽象的矩陣不等式轉換成具體的二次型估計
- **接回內點法**：把牛頓法塞回內點法的迭代框架，作為每個 λ 處的內層求解器

---

## 二、章節脈絡

### Section 1｜牛頓法作為二階優化方法

**重點摘要：** 教授從一階方法（梯度下降）過渡到二階方法（牛頓法），點出 Hessian 帶來的曲率資訊讓收斂加速，但每次迭代成本更高。

**內容：**

**一階 vs 二階方法：**
- 一階方法（如梯度下降）：只能 query 函數 f(x) 與梯度 ∇f(x)
- 二階方法（牛頓法）：還能 query Hessian 矩陣 ∇²f(x)
- 直觀上：曲率資訊讓牛頓法在每步選擇更聰明的步長

**牛頓法的成本 trade-off：**
- 優點：曲率資訊帶來更快收斂（從次線性到線性甚至超線性）
- 缺點：每次迭代需要計算 Hessian 並對其做反運算
- 哲學：用更多查詢換更快收斂——這種「資訊換時間」的模式會在整門課反覆出現

> 「We're at some current iterate X₀, and the update rule is X₁ = X₀ - H⁻¹(X₀) · ∇f(X₀).」

---

### Section 2｜從泰勒展開推導更新規則

**重點摘要：** 透過二階泰勒展開的自然推導，把牛頓法的更新規則直接寫成 Hessian 反矩陣乘以梯度。

**內容：**

**二階泰勒展開：**
- 對 f(y) 在 X₀ 附近展開：f(y) ≈ f(X₀) + ∇f(X₀)ᵀ(y - X₀) + ½(y - X₀)ᵀ H(X₀) (y - X₀)
- 對右側二次模型直接做微分取極值

**最小化右側二次式：**
- 對 y 微分並設為零：∇f(X₀) + H(X₀)(y - X₀) = 0
- 解得 y = X₀ - H(X₀)⁻¹ ∇f(X₀)

**直觀意義：**
- 曲率大的方向走小步，曲率小的方向走大步
- 比梯度下降的固定步長更貼合函數的局部幾何
- 推導完全用純微積分，不需要額外的幾何直觀

> 「So, Taylor's theorem says that up to some error that comes out of Taylor's theorem, f(y) is approximately equal to f(X₀) plus the gradient dotted with y - X₀ plus one-half y - X₀ dotted with the Hessian dotted with y - X₀.」

---

### Section 3｜牛頓法的進度定理

**重點摘要：** 教授引用 Aaron Sidford 的分析，證明當 Hessian 在兩次迭代之間變化平緩時，梯度範數以幾何級數收斂。

**內容：**

**前提條件（Hessian 平緩變化）：**
- 對線段上所有點 Xₜ，存在小量 ε > 0，使得
- (1 - ε) H(X₀) ⪯ H(Xₜ) ⪯ (1 + ε) H(X₀)
- 也就是兩端的 Hessian 在 Loewner 序下被互相 ε 夾住

**進度結論：**
- 在此條件下，新梯度範數 ‖∇f(X₁)‖_{H(X₀)} 滿足
- ‖∇f(X₁)‖_{H(X₀)} ≤ (ε / (1 - ε)) · ‖∇f(X₀)‖_{H(X₀)}
- 也就是說，每一步至少以 1 減 ε 的比例縮小

**收斂速度：**
- 迭代 k 次後，梯度範數衰減為初始的 (ε / (1 - ε))ᵏ 倍
- 與梯度下降的 O(1/ε) 步數相比，牛頓法只需 O(log log (1/ε)) 步

> 「It's telling us that the norm isn't changing too much because these matrices are very similar all across the line. In particular, the Hessian at X₁ is very similar to the Hessian at X₀.」

---

### Section 4｜用譜定理重寫條件

**重點摘要：** 把進度定理的矩陣不等式透過譜定理與平方根技巧，轉換成可操作的二次型估計。

**內容：**

**譜定理：**
- 對稱矩陣 A 可寫成 U Λ Uᵀ，其中 U 正交、Λ 對角
- PSD 矩陣的特徵值都非負，可以做平方根 A^{1/2}

**平方根重寫：**
- ‖X‖_A 定義為 √(Xᵀ A X)
- 條件 (1 - ε) A ⪯ B ⪯ (1 + ε) A 等價於
- 對所有 Y：-ε Yᵀ Y ≤ Yᵀ A^{1/2} (B - A) A^{1/2} Y ≤ ε Yᵀ Y

**結論：**
- 整個證明從抽象的矩陣不等式變成具體的二次型估計
- 能用譜範數 ‖·‖₂ 把條件壓縮成單一數字 ε
- 最終結論：新梯度範數被壓縮成 1 減某個與 ε 相關的比例因子

---

### Section 5｜把牛頓法接回內點法

**重點摘要：** 把牛頓法塞回內點法的迭代框架，作為每個 λ 處的內層求解器，並分析 λ 的更新策略如何與內層收斂耦合。

**內容：**

**回顧內點法框架：**
- 目標：minimize cᵀx subject to Ax ≥ b
- 障礙函數：f_λ(x) = λ cᵀx - Σᵢ ln(slack(x)ᵢ)
- 鬆弛向量：slack(x) = Ax - b

**內層牛頓法：**
- 給定當前 λ，用牛頓法近似最小化 f_λ(x)
- 進度定理保證每個 λ 處的內層收斂速度

**外層 λ 更新：**
- λ 的更新需要維持中心性測度在某個界內
- 中心性測度控制每個 λ 處牛頓法的快速收斂
- 兩者耦合得到總迭代次數的多項式上界

**剩餘工作：**
- 分析 λ 的更新策略如何與內層收斂耦合
- 證明中心性測度在 λ 更新時仍維持在某個界內
- 從而得到整個內點法的總迭代次數——這是 Lecture 19 即將開展的工作

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **牛頓法（Newton's Method）** | 二階優化方法；更新規則 X₁ = X₀ - H(X₀)⁻¹ ∇f(X₀) |
| **Hessian 矩陣** | 函數的二階導數矩陣 H(X) = ∇²f(X) |
| **二階泰勒展開** | f(y) ≈ f(X₀) + ∇f(X₀)ᵀ(y - X₀) + ½(y - X₀)ᵀ H(X₀) (y - X₀) |
| **Loewner 序** | 偏序：A ⪯ B 表示 B - A 為 PSD 矩陣 |
| **進度定理** | Hessian 變化平緩時，梯度範數以幾何級數收斂 |
| **譜定理** | 對稱矩陣可寫成正交矩陣乘以對角特徵值矩陣 |
| **二次型 norm** | ‖X‖_A = √(Xᵀ A X) |
| **內點法（Interior Point）** | 用障礙函數將 LP 約束問題轉為無約束優化的迭代法 |
| **障礙函數（Barrier）** | -Σᵢ ln(slack(x)ᵢ)；在可行域邊界處趨於無窮大 |
| **鬆弛變數（Slack）** | slack(x) = Ax - b；衡量約束的「剩餘空間」 |
| **中心性測度（Centrality）** | 衡量當前點距離中心路徑多遠的指標 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 1 小時 24 分鐘（5082 秒） | 影片總長度 |
| 43,846 字元 | 英文逐字稿字元數（清理 VTT 時間碼、HTML 標籤後） |
| 8,656 字 | 英文逐字稿單字數 |
| 1,603 字元 | 繁中口播稿字元數（含標點空白） |
| 1,103 字 | 繁中口播稿漢字數 |
| 28 句 | 口播稿總句數 |
| 36 個逗號 | 口播稿總逗號數 |
| 8.54% | L18 silent ratio（Bar 3 通過） |
| 4.8 MB | m4a 音檔大小 |
| 2.4 MB | opus 音檔大小 |
| O(log log 1/ε) | 牛頓法的迭代次數（梯度下降為 O(1/ε)） |
| O(M · log U) | 內點法搭配牛頓法的總複雜度（M 為約束數、U 為精度） |

---

## 五、核心主旨

> 牛頓法展示了二階資訊換更快收斂的威力：在 Hessian 變化平緩的合理假設下，新梯度範數以幾何級數衰減，迭代次數從 O(1/ε) 降到 O(log log 1/ε)。譜定理把抽象的矩陣不等式轉換成可操作的二次型估計，讓進度定理的證明變得具體而完整。把牛頓法塞回內點法的迭代框架後，就能保證每個 λ 處的內層快速收斂，進而得到整個 LP 求解器的多項式時間上界。這堂課的核心是：理解二階優化方法的數學基礎，並把它接上既有的內點法框架。

---

## 六、金句摘錄

1. 「We're at some current iterate X₀, and the update rule is X₁ = X₀ - H⁻¹(X₀) · ∇f(X₀).」

2. 「So, Taylor's theorem says that up to some error that comes out of Taylor's theorem, f(y) is approximately equal to f(X₀) plus the gradient dotted with y - X₀ plus one-half y - X₀ dotted with the Hessian dotted with y - X₀.」

3. 「It's telling us that the norm isn't changing too much because these matrices are very similar all across the line. In particular, the Hessian at X₁ is very similar to the Hessian at X₀.」

4. 「So pretend for a second that these are the same matrix. In other words, these are the same norm. It's telling us that our new norm of the gradient is at most the old norm of the gradient times roughly epsilon.」

5. 「The spectral theorem says when you have a real symmetric matrix, you can write it as U times Λ times U transpose where Λ has the eigenvalues.」

6. 「What does it mean to say that (1 - ε)A is at most B is at most (1 + ε)A? That means B - A is sandwiched by ±εA in the Loewner ordering.」

7. 「So now we can write Y as A to the 1/2 X, and that implies that for all Y, -ε Yᵀ Y is at most Yᵀ (B - A) Y which is at most ε Yᵀ Y.」

8. 「Newton's method is basically just assuming that the second-order Taylor expansion is an equality and then trying to minimize the right-hand side.」

9. 「The minimum of this right-hand side is exactly this if you do calculus.」

10. 「When we hit O(log log 1/ε) iterations with each step costing O(1), that's where the quadratic convergence of Newton's method comes from.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照
- **未使用 Whisper**：影片有完整 YouTube 自動字幕（zh-Hant 與 en），無需 Whisper fallback
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **英文逐字稿字數**：43,846 字元（清理 VTT 時間碼、HTML 標籤後）
- **本筆記引用以 en 字幕為主**，zh-Hant 用於中文關鍵概念對照
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture18_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（Hessian、Loewner 序、譜定理等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 48 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture18_口播稿.txt

- [opus 2.4 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture18.opus)（Telegram 友善）
- [m4a 4.8 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture18.m4a)（iOS 友善）
- [mp3 4.4 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture18.mp3)（通用格式）