# 【Harvard CS224 高階演算法 — Lecture 20：Multiplicative Weights 應用至 LP、近似演算法與 Flow 演算法入門】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 83分鐘**

---

> **影片連結**：https://youtu.be/TdTFYVjzs1I
> **影片時長**：1 小時 23 分鐘（5017 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms（高階演算法）」2014 年秋季學期（f14）的第 20 堂課，主講者為 Jelani Nelson 教授。本堂完成兩件事：把乘法權重法付諸實戰，應用到線性規劃（LP）近似與分數集合覆蓋（fractional set cover）；同時宣布課程即將轉入下一個主軸——流演算法（flow algorithms）。

課程設計的重點：

- **從抽象到應用**：把上堂課的乘法權重定理套用到具體問題
- **行受限 oracle 的雙層結構**：外層 MW、內層 oracle，是處理複雜約束系統的經典手法
- **分數集合覆蓋的近似**：用 MW 解集合覆蓋 LP 鬆弛，得到 1+ε 近似
- **內點法的實務位置**：在多項式 LP 求解器中比單純形法更穩、比橢圓體法更快
- **轉入 Flow 主題**：從 LP 切到最大流問題

---

## 二、章節脈絡

### Section 1｜回顧乘法權重定理

**重點摘要：** 教授先把上堂課的乘法權重定理重新寫成期望後悔界的精確形式，並展示如何選 ε 平衡 trade-off。

**內容：**

**核心定理：**
- 若每天成本向量在 [-1, 1] 之間，用乘法權重法得到的期望總成本上界為
- E[Σₜ cₜ · pₜ] ≤ min_i Σₜ cₜ(i) + ε · Σₜ |cₜ| + log N / ε

**選最佳 ε：**
- 當 T 遠大於 log N 時，可以選 ε = √(log N / T)
- 讓兩項 trade-off 平衡
- 得到期望後悔衰減率為 O(√(log N / T))

**應用框架：**
- 接下來要把這個定理套用到 LP 與分數集合覆蓋
- 證明同一個工具可以解決多個看似無關的問題

> 「Remember we assumed that all our costs these entries of these cost vectors are all between -1 and 1.」

---

### Section 2｜行受限 oracle 與 LP 近似

**重點摘要：** 定義行受限 oracle（row-bounded oracle），並展示如何用乘法權重法包外層、oracle 處理內層，達到 LP 的近似求解。

**內容：**

**行受限 oracle：**
- 給定機率向量 P，查詢約束 PᵀAX ≥ PᵀB 的可行性
- 回傳：近似可行的 X，或宣告不可行
- 若不可行，輸出 infeasible

**雙層結構：**
- 外層：乘法權重法，每天 oracle 回傳一個近似可行的 Xₜ
- 內層：oracle 處理 PᵀAX ≥ PᵀB 的約束
- 記錄違反量作為成本向量
- 最終解是所有 Xₜ 的平均值

**最終解的性質：**
- 在所有原始約束上的違反量不超過 1 + ε
- 這個「用 oracle 換約束、把外層迭代當內層」的雙層結構
- 是處理複雜約束系統的經典手法

> 「The Oracle just guarantees that the difference in magnitude is small. If I had said that where row is positive, then this would have been feasible. But I put absolute values here, so I'm not telling you anything about which one is bigger.」

---

### Section 3｜分數集合覆蓋的應用

**重點摘要：** 把行受限 oracle 套用到分數集合覆蓋問題，得到 1+ε 近似的多項式時間演算法。

**內容：**

**分數集合覆蓋問題：**
- 給定要被覆蓋的元素集合 U 與候選集合族 S
- 目標：選最少集合覆蓋所有元素
- LP 鬆弛：min Σ xₛ s.t. Σ_{s∋e} xₛ ≥ 1 for all e

**用乘法權重法解：**
- 每次選一個違反最多的元素
- 讓包含它的集合以更高機率被選
- 重複 O(M² log M / ε²) 次

**近似比：**
- 得到 1 + ε 近似的覆蓋方案
- 時間 O(M² log M / ε²)，多項式時間

**演算法的優雅之處：**
- 完全繞過了單純形法的指數最壞情況
- 用迭代式的統計方法達到穩定的多項式時間近似
- 證明簡單：把 MW 定理的 regret bound 直接套用

> 「If you're violating the constraints by ε, you can reduce the number of sets by some amount. There's a classical rounding argument.」

---

### Section 4｜回到內點法的迭代次數

**重點摘要：** 把 MW 分析套用到內點法的迭代次數分析，並討論內點法在多項式 LP 求解器中的實務位置。

**內容：**

**內點法迭代次數：**
- 每次內層牛頓法收斂後更新 λ
- 外層需要 O(√(M log)) 次迭代
- 每次迭代的內層牛頓法只需對數步
- 總複雜度為 O(M³ · polylog) 級別

**在 LP 求解器光譜中的位置：**
- 單純形法：實務最快但有指數最壞情況
- 橢圓體法：多項式時間但實務較慢
- 內點法：多項式時間 + 實務速度快，常數因子小，數值穩定性好
- 在商用 LP 求解器中佔據主導地位

**雖然 O(M³) 在理論上不算最佳：**
- 內點法的常數因子小
- 數值穩定性好
- 實務上內點法比理論上更快的演算法更受歡迎

---

### Section 5｜進入流演算法

**重點摘要：** 教授宣布下個主軸轉向流問題，並介紹 Ford-Fulkerson 作為直觀起點。

**內容：**

**流問題設定：**
- 給定容量有向圖 G = (V, E)
- 每條邊有整數容量 cₑ ∈ [1, U]
- 目標：找從源點 S 到匯點 T 的最大流

**Ford-Fulkerson 演算法：**
- 不斷在殘餘圖中找擴充路徑
- 推送流量
- 直到沒有擴充路徑為止

**複雜度：**
- 時間為 O(M · F)，其中 F 是最大流值
- 對整數容量 U，這是擬多項式而非強多項式

**最大流的歷史：**
- 從擬多項式的 Ford-Fulkerson
- 到弱多項式的 Edmonds-Karp 與 Dinic
- 再到強多項式的 Goldberg-Tarjan
- 與後續的 link-cut trees 改進

**下個主軸：**
- 下一階段將用流演算法展示另一條優化路徑
- 透過更聰明的資料結構（scaling 與 link-cut trees）
- 讓時間複雜度從擬多項式降到強多項式

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **行受限 oracle（Row-bounded Oracle）** | 給定機率向量 P，回傳 PᵀAX ≥ PᵀB 近似可行 X 或宣告不可行 |
| **分數集合覆蓋（Fractional Set Cover）** | LP 鬆弛後的集合覆蓋；解為 0~1 之間的權重 |
| **集合覆蓋（Set Cover）** | NP-hard；選最少集合覆蓋所有元素 |
| **殘餘圖（Residual Graph）** | 流量網路扣除已推送流量後剩餘的容量 |
| **Ford-Fulkerson** | 反覆找擴充路徑推送流量的演算法；O(MF) |
| **擴充路徑（Augmenting Path）** | 殘餘圖中從 S 到 T 的路徑 |
| **擬多項式（Pseudopolynomial）** | 時間對容量 U 為多項式；非強多項式 |
| **強多項式（Strongly Polynomial）** | 時間完全不依賴容量大小，只依賴 M 與 N |
| **內點法（Interior Point）** | 用障礙函數將 LP 約束問題轉為無約束優化 |
| **Edmonds-Karp** | BFS 找最短擴充路徑的 Ford-Fulkerson 變體；O(M²N) |
| **Goldberg-Tarjan** | 用 push-relabel 的強多項式最大流演算法 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 1 小時 23 分鐘（5017 秒） | 影片總長度 |
| 41,384 字元 | 英文逐字稿字元數（清理 VTT 時間碼、HTML 標籤後） |
| 8,234 字 | 英文逐字稿單字數 |
| 1,522 字元 | 繁中口播稿字元數（含標點空白） |
| 996 字 | 繁中口播稿漢字數 |
| 24 句 | 口播稿總句數 |
| 27 個逗號 | 口播稿總逗號數 |
| 9.12% | L20 silent ratio（Bar 3 通過） |
| 4.3 MB | m4a 音檔大小 |
| 2.1 MB | opus 音檔大小 |
| O(M² log M / ε²) | 分數集合覆蓋 MW 演算法的迭代次數 |
| O(M³ · polylog) | 內點法總複雜度（M 為約束數） |
| O(M · F) | Ford-Fulkerson 時間（F 為最大流值） |

---

## 五、核心主旨

> 乘法權重法的強大在於它的通用性：把同一個框架套用到 LP 近似、分數集合覆蓋等多個問題，每個都自然落入「外層 MW + 內層 oracle」的雙層結構。同時，本堂也明確了內點法在多項式 LP 求解器中的位置——比單純形法有最壞情況保證，比橢圓體法實務更快。下一階段將用流演算法展示另一條優化路徑：透過更聰明的資料結構（scaling 與 link-cut trees）讓時間複雜度從擬多項式降到強多項式。這條路徑的關鍵洞見是：演算法的瓶頸往往不在主邏輯而在資料結構，換一個更貼合問題的資料結構就能讓整個複雜度指數級改善。

---

## 六、金句摘錄

1. 「We had this theorem last time. If you use multiplicative weights to come up with the probability vectors, you get a bound on the expected cost in terms of the best expert in hindsight.」

2. 「The Oracle just guarantees that the difference in magnitude is small. So it's not telling you anything about which one is bigger.」

3. 「So how many iterations do we need? Well, you'd choose ε to balance these two terms, and you get O(√(T log N)) regret.」

4. 「If you're violating the constraints by ε, you can reduce the number of sets by some amount. There's a classical rounding argument.」

5. 「For fractional set cover, the number of multiplicative weights iterations is O(M² log M / ε²).」

6. 「In practice, interior point is what people use. It's strongly polynomial-ish, and it's actually fast in practice.」

7. 「So, after this we're going to switch into a new topic, namely flows.」

8. 「Ford-Fulkerson is the basic algorithm: repeatedly find augmenting paths in the residual graph. The time is O(MF) where F is the max flow value.」

9. 「If F is as big as nU, then O(MF) is not even polynomial, because writing down a capacity takes log U bits.」

10. 「Strongly polynomial means the running time doesn't depend on the capacities at all. So Ford-Fulkerson is pseudopolynomial, not strongly polynomial.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照
- **未使用 Whisper**：影片有完整 YouTube 自動字幕（zh-Hant 與 en），無需 Whisper fallback
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **英文逐字稿字數**：41,384 字元（清理 VTT 時間碼、HTML 標籤後）
- **本筆記引用以 en 字幕為主**，zh-Hant 用於中文關鍵概念對照
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture20_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（Multiplicative Weights、set cover、flow 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 20 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture20_口播稿.txt

- [opus 2.1 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture20.opus)（Telegram 友善）
- [m4a 4.3 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture20.m4a)（iOS 友善）
- [mp3 4.0 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture20.mp3)（通用格式）