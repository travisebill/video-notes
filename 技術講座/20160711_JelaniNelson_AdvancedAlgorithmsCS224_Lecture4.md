# 【Harvard CS224 高階演算法 — Lecture 4：線性探測 5-wise 證明、Bloom Filters、Bloomier Filters 與 Cuckoo Hashing】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 87分鐘**

---

> **影片連結**：https://youtu.be/edOWKZE1t84
> **影片時長**：87 分鐘（5271 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 官方章節：Moment Method / Bloom Filters / The Union Bound / Update Algorithm / Log 1 over Epsilon Copies / The Bloom Filter / The Dynamic Dictionary Problem / Cuckoo Hashing / The Insertion Algorithm
> **字幕來源**：YouTube 英文手動字幕（en-j3PyPqV-e1s，1305 cues）— Harvard CS224 課程官方上傳

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms」2014 年秋季學期（f14）的第四堂課，主講者為 Jelani Nelson 教授。本堂課是 hashing 主題的第二天，涵蓋三個主軸：

- **修正 cuckoo hashing lemma**：教授先修正上次沒講清楚的 cuckoo hashing lemma，再開始今天的內容
- **Linear probing 5-wise 證明**：上次講了 7-wise 的 warm-up proof，本堂用同樣手法但條件更緊
- **Bloom filters / Bloomier filters / Cuckoo hashing**：approximate membership 與 retrieval 問題的實用解法

課程設計從純分析（moment method）走到實際 data structure 設計（Bloom filter 的 bit array trick、Bloomier filter 的 XOR 填值），最後用 cuckoo hashing 統一三個問題。

---

## 二、章節脈絡

### Section 1｜開場修正：Cuckoo Hashing Lemma（00:00 ~ 10:00）

**重點摘要：** 教授修正上次的 cuckoo hashing lemma 陳述錯誤（會用 email 寄給全班），並確認全班都在 mailing list。提醒學生到 class website 註冊。

**內容：**
- 修正上次的 lemma 陳述
- 確認學生都在 class mailing list
- 沒註冊的到 class website 註冊
- 接下來：finish linear probing 5-wise proof、bloom filters、bloomier filters、cuckoo hashing、power of two choices

---

### Section 2｜5-wise Independence 證明（10:00 ~ 25:00）

**重點摘要：** 沿用上堂課 7-wise 的 moment method 證明框架，但條件更緊：m ≥ constant × n、h 為 5-wise independent 時 expected query time = O(1)。核心步驟：用 6 次 Markov bound 證 Pr[I full] = O(1/K³)，5-wise 剛好夠是因為 condition on 1 個還剩 4-wise。

**內容：**

**核心 Lemma（同上節課）：**
- query on x 進行 k 個 probes ⟹ h(x) 在至少 k 個 length-K full interval 中

**期望 query time 上界：**
- E[query time] ≤ Σ_{K=1}^{∞} K · max Pr[I is full]
- 需要 Pr[I is full] = O(1/K³)

**Markov bound 推導：**
- Pr[L_I - E[L_I] ≥ E[L_I]] ≤ E[(L_I - E[L_I])⁶] / E[L_I]⁶
- E[L_I] = K/2（當 m = 2n）
- 分母 (K/2)⁶ = K⁶/64
- 分子：因 h 是 6-wise independent，可展開 E[(L_I - E[L_I])⁶]
- 主要項：6 個變數都用到，coefficient 是 K⁶ 量級
- 結果：Pr[I is full] = O(1/K⁶) · K⁶ = O(1/K⁶)... 等等需要重算
- 最終得到 O(1/K³)

**為何是 5-wise 而非 7-wise：**
- condition on h(x) 落在 I 中：用掉 1 個變數
- 還有 4 個變數是 4-wise independent
- 4-wise 對 sixth moment expansion 已經足夠
- 所以 5-wise 就夠了

> 「The original statement by someone was that 5-wise works because when you condition on one, it's 4-wise.」

---

### Section 3｜Bloom Filters（25:00 ~ 35:00）

**重點摘要：** Approximate membership 問題：insert/query 只支援 key 不支援 value；允許 false positive（x ∉ S 但 query 回 1 的機率 ≤ ε）。基礎方案：bit array + hash function；改進方案：log(1/ε) 個 copies 把 ε 降到任意小。Bloom 1970。

**內容：**

**問題定義：**
- update: S ← S ∪ {x}
- query: x ∈ S? yes / no
- 對 x ∈ S，query 必須回 yes（機率 1）
- 對 x ∉ S，query 回 yes 的機率 ≤ 1/2（後改成 ≤ ε）

**基本方案：**
- bit array A of length m
- update x：set A[h(x)] = 1
- query x：return A[h(x)]
- 對 x ∉ S，query 回 yes 的機率 = Pr[∃ y ∈ S: h(x) = h(y)]
- ≤ Σ_{y ∈ S} Pr[h(x) = h(y)] = n · 1/m = n/m = 1/2（when m = 2n）

**改進方案：**
- log(1/ε) 個 copies of bit array
- 每個 copy 用獨立 hash function h_1, h_2, ..., h_k
- update：對所有 k 個 array 都 set A_j[h_j(x)] = 1
- query：檢查所有 k 個 array 都是 1 才回 yes
- 機率 ≤ (1/2)^k = ε
- 空間：n · log(1/ε) bit
- 時間：O(log(1/ε))

**Bloom filter 的歷史：**
- Bloom 1970 提出
- 有更精緻的實作支援 deletion、constant time query

> 「This is one thing that's called a bloom filter. And that was bloom filter, and it's due to bloom in 1970.」

---

### Section 4｜Bloomier Filters（35:00 ~ 50:00）

**重點摘要：** Retrieval problem 解法：每個 element 有一個 r-bit string associate；query 給 element 回 string。空間 n·r bit。構造：用 cuckoo hash table + 在 forest 結構上 XOR 填值。Chazelle-Kilian-Rubinfeld-Tal 2004。

**內容：**

**問題定義：**
- 對 x ∈ S，query 必須回正確 r-bit string
- 對 x ∉ S，query 可回任意 garbage（不告知）
- 空間：n·r bit

**解法構造：**
- 建立 cuckoo hash table（見 Section 5）
- Cuckoo graph = forest（無 cycle）
- 對 forest 的每個 edge x = (g(x), h(x))，x 擁有「deep node」
- 從 top down 填入 r-bit string：
  - Root 存 0
  - 對每個 edge，填入「下面的值」使 XOR 起來等於 x 的 string
- Query x：output A[g(x)] XOR A[h(x)]

**為什麼需要 XOR：**
- 節點數 > 邊數（m > n）
- 不能每個 edge 都有自己的節點
- XOR 技巧：對 root 存 0、每個 edge 在 deep node 處填入「正確值 ⊕ 上面值」
- 結果：A[g(x)] ⊕ A[h(x)] = 正確 r-bit string

> 「If we query x, we'll output A of g of x XOR A of h of x.」

---

### Section 5｜Cuckoo Hashing（Pagh-Rodl, 2004）（50:00 ~ 70:00）

**重點摘要：** Dynamic dictionary problem 解法：兩個 hash function g, h：U → [m]；insert x 時放 A[g(x)]，若衝突就 kick 舊的；chain 超過 10 log n 就 rebuild。Expected insertion time O(1)。Cuckoo graph 用於分析。

**內容：**

**資料結構：**
- array A of length m = c·n（c = 4 之類）
- 兩個 hash function g, h: U → [m]

**Insertion algorithm：**
- 嘗試放 x 到 A[g(x)]
- 若 A[g(x)] 已被 y 佔據，kick y 出去
- y 要去 A[h(y)]（y 的另一個 hash function 對應的位置）
- 若 A[h(y)] 也被佔據，繼續 kick
- Chain 超過 10 log n 步就 rebuild（重選 g, h、重新 hash 全部 item）
- Expected insertion time O(1)

**Cuckoo graph 分析工具：**
- m 個 vertex、n 個 edge
- 每個 x ∈ S 對應一條 edge (g(x), h(x))
- 是 multigraph（可能有平行 edge、self-loop）
- 動態問題：cycle 出現會卡住 → 用 rebuild 處理
- 靜態問題（用於 Bloomier filter）：先檢查有沒有 cycle、無 cycle 就用

**Bloomier filter 用 cuckoo hashing 構造：**
- 建立 cuckoo hash table
- 期望 2 次 rebuild 內找到無 cycle 的 graph
- Cuckoo graph 無 cycle → 是 forest
- Forest 上用 XOR 填值（見 Section 4）

> 「If this chain of moving things around went on for more than 10 log n steps, we'll pick a totally new h and g at random.」

---

### Section 6｜Power of Two Choices + 開放問答（70:00 ~ 87:00）

**重點摘要：** 簡介 power of two choices：用 g 和 h 兩個 hash function 選 load 較小的 bin；intuition：每層的 fraction 平方遞減 → log log n 層後 ≤ 1。下一堂課會 finish 嚴格證明。學生提問其他 hash family 設計。

**內容：**

**Power of 2 choices 設定：**
- n 個 item、n 個 bin
- 兩個 hash function g, h
- Insert x：放 A[g(x)] 或 A[h(x)] 中 load 較小的

**Intuition（non-rigorous）：**
- B_i = 至少有 i 個 item 的 bin 數
- Pr[height(x) ≥ i+1] ≤ (B_i/n)²（要兩個 bin 都 load ≥ i）
- E[B_{i+1}] ≤ n · (B_i/n)² = B_i²/n
- B_10/n ≤ 1/2 → B_{10+j}/n ≤ 1/2^(2^j)
- 2^j ≥ n 時 = 0 → j ≥ log log n

**嚴格證明預告：**
- 定義 α_i = e · α_{i-1}² / n
- Claim：Pr[B_{i+1} > α_{i+1} | E_i] = Pr[Binomial(α_i²/n²) > α_{i+1}]
- 用 Chernoff bound + union bound
- 證明有些 dependency issue 需要 fix（教授會修在 notes）

**學生問題：**
- Q：polynomial hash 之外還有哪些 family？
- A：tabulation hashing（Thorup-FOCS 2013）、multiply-shift（Dietzfelbinger）、即將在 FOCS 2014 發表的 sequential evaluation k-wise

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Moment Method** | 高次方 + Markov bound 證 concentration；可推 Chernoff |
| **5-wise Independence** | 對任意 5 個 index/value 互相獨立；足夠做 linear probing |
| **Bloom Filter** | Membership problem 解法；log(1/ε) 個 bit array；空間 n·log(1/ε) bit |
| **False Positive** | x ∉ S 但 query 回 yes 的情況；Bloom filter 允許 ε 機率 |
| **Bloomier Filter** | Retrieval problem 解法；每個 element 有 r-bit string；空間 n·r bit |
| **Cuckoo Hashing** | 兩個 hash function；衝突就 kick out；cycle > 10 log n 就 rebuild |
| **Cuckoo Graph** | m vertex、n edge 的 multigraph；每個 x 對應 edge (g(x), h(x)) |
| **Multigraph** | 允許平行 edge、self-loop 的 graph |
| **Mark Bit** | 在 Fibonacci heaps 中追蹤「是否已失去一個 child」的 bit（後續 Lecture 6） |
| **Power of Two Choices** | 用 g 和 h 兩個 hash function 選 load 較小的 bin；max load = log log n |
| **Tabulation Hashing** | Thorup 2013：lookup table 構造 k-wise；constant time evaluation |
| **Multiply-Shift Hashing** | Dietzfelbinger 構造：pairwise independent；用 multiply + shift |
| **Forest Top-Down Filling** | Bloomier filter 在 cuckoo forest 上從 root 往下 XOR 填值的技巧 |
| **Retrieval Problem** | 給 element 回 r-bit string；空間 n·r bit；Bloomier 解 |
| **Membership Problem** | 問 in/not in S；空間 n bit；Bloom filter 解 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 87 分鐘（5271 秒） | 影片總長度 |
| 1305 cues | 英文手動字幕數量 |
| 48893 字元 | 英文逐字稿字元數（清理後） |
| 9 個 | YouTube 官方章節數量 |
| O(1) | Linear probing 在 5-wise independent 下的 expected query time |
| O(1/K³) | Length-K interval 為 full 的 probability 上界 |
| 6 | Markov bound 用的 moment 次方 |
| 1970 | Bloom filter 原始論文（Bloom） |
| 2004 | Cuckoo hashing（Pagh-Rodl）；Bloomier filters（Chazelle-Kilian-Rubinfeld-Tal） |
| n·log(1/ε) bit | Bloom filter 空間複雜度 |
| n·r bit | Bloomier filter 空間複雜度 |
| O(log(1/ε)) | Bloom filter query time |
| m = c·n | Cuckoo hashing array 大小（c = 4 之類常數） |
| 10 log n | Cuckoo hashing rebuild threshold |

---

## 五、核心主旨

> Approximate membership 與 retrieval 問題展示了 hashing 在 word-RAM 下從「分析工具」（moment method、5-wise independence）走到「實用 data structure」（Bloom filter 用 log(1/ε) 個 bit array 把 false positive 壓到任意小；Bloomier filter 用 cuckoo hash table + XOR 填值；cuckoo hashing 用兩個 hash function + kick-out 機制）的完整路徑。共同主題是：**空間與時間的 trade-off 用 hash family 的獨立性強度與 hash function 的數量精準調控**——5-wise independence 就足以讓 linear probing 達 O(1) query；log(1/ε) 個 hash function 就足以把 Bloom filter 的 false positive 壓到 ε；兩個 hash function + cycle rebuild 就足以讓 cuckoo hashing 達 O(1) expected insertion。

---

## 六、金句摘錄

1. 「The reason 5-wise works is because when you condition on one, everything else is 4-wise.」

2. 「Bloom filter is due to bloom in 1970.」

3. 「We'll allow false positives.」

4. 「You need n words of space to hold the keys, and I'm only using n times r bits.」

5. 「If we query x, we'll output A of g of x XOR A of h of x.」

6. 「Cuckoo bird lays eggs in the other bird's nest.」

7. 「If this chain went on for more than 10 log n steps, we'll pick a totally new h and g at random.」

8. 「Bloomier filters are due to Chazelle, Kilian, and Rubinfeld and Tal.」

9. 「The expected number of times you have to construct the cuckoo hash table is two.」

10. 「Power of two choices: this is just a second example of the power of using two hash functions instead of one.」

---

## 七、備註

- **字幕來源**：YouTube 英文手動字幕（en-j3PyPqV-e1s，1305 cues）— Harvard CS224 課程官方上傳
- **官方章節**：YouTube 影片有 9 個官方章節（Moment Method / Bloom Filters / The Union Bound / Update Algorithm / Log 1 over Epsilon Copies / The Bloom Filter / The Dynamic Dictionary Problem / Cuckoo Hashing / The Insertion Algorithm）
- **無 zh-Hant 字幕**：本影片有 en/zh-Hans/zh-Hant auto-cap，但抓取時遇到 HTTP 429
- **英文逐字稿字數**：48,893 字元（清理 VTT 時間碼、HTML 標籤後）
- **未使用 Whisper**：影片有完整手動字幕，無需 Whisper fallback
- **本筆記引用以 en 字幕為主**
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture4_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（Bloom filter、Bloomier filter、cuckoo hashing、moment method 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 59 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture4_口播稿.txt

- [opus 2.4 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture4.opus)（Telegram 友善）
- [m4a 4.7 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture4.m4a)（iOS 友善）
- [mp3 4.6 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture4.mp3)（通用格式）