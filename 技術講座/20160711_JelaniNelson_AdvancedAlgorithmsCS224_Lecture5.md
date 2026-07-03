# 【Harvard CS224 高階演算法 — Lecture 5：Cuckoo Hashing 嚴格分析與 Power of Two Choices】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 81分鐘**

---

> **影片連結**：https://youtu.be/rLMikQTOVnI
> **影片時長**：81 分鐘（4897 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文手動字幕（en-j3PyPqV-e1s，1036 cues）— Harvard CS224 課程官方上傳

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms」2014 年秋季學期（f14）的第五堂課，主講者為 Jelani Nelson 教授。本堂課是 hashing 主題的最後一堂，涵蓋兩個核心：

- **Cuckoo hashing 嚴格證明**：完成上堂課沒講完的 cuckoo hashing 分析（cuckoo graph 沒 cycle 的機率 ≤ 1/2）
- **Power of Two Choices**：用兩個 hash function 達 max load = O(log log n)

課程設計從 discrete random variable 的 moment 計算（cuckoo hashing 路徑長度分析），走到 functional analysis of random graphs（power of two choices 的 bin load distribution）。最後預告下週進入 amortized analysis 與 Fibonacci heaps。

---

## 二、章節脈絡

### Section 1｜開場行政事項（00:00 ~ 05:00）

**重點摘要：** 教授提到 pset 最後忘了加 fake problem（記錄花多少時間做作業），會設 Piazza poll 補上。確認 Albert Wu 是今天的 scribe。

**內容：**
- Pset 缺 final fake problem：記錄學生花多少時間做作業
- 從 pset 2 開始會固定加在最後
- Albert Wu 是今天的 scribe
- 今天的 plan：finish cuckoo hashing 證明 + power of two choices + 進入 Fibonacci heaps

---

### Section 2｜Cuckoo Hashing 分析：Cycle 機率 ≤ 1/2（05:00 ~ 30:00）

**重點摘要：** Cuckoo hashing 的 expected insertion time = O(1) 證明。核心：Cuckoo graph 中存在 cycle 的機率 ≤ 1/2。因為 cycle 一出現 rebuild 期望兩次內成功 → expected cost 仍是常數。

**內容：**

**Cuckoo graph 設定（同 Lecture 4）：**
- m 個 vertex、n 個 edge
- 每個 x ∈ S 對應 edge (g(x), h(x))
- Multigraph（可有平行 edge、self-loop）

**目標：**
- Pr[cuckoo graph contains a cycle] ≤ 1/2
- 因為一旦有 cycle，insertion 可能 loop → rebuild
- Rebuild 期望 2 次內成功（因為每次 cycle-free 機率 ≥ 1/2）

**證明技巧：**
- 取一個特定 path of length k 存在的機率
- Fix k+1 個 vertex（hash 值）和 k 個 edge（item）
- Pr[this specific path exists] = ?
- 用 union bound over 所有可能的 vertex 集合 + edge 集合

**Moment method 應用：**
- Define P_k = Pr[存在 path of length ≥ k]
- 用 moment-generating function / 高次方期望 bound P_k
- Sum over all configurations

**為何 expected insertion = O(1)：**
- 大部分 insert 不 rebuild → 期望時間 = O(log n) for chain
- 有時 rebuild → 但 rebuild 期望 2 次內成功 → constant
- 總 expected time = O(log n) for non-rebuild + O(1) for rebuild = O(1) when amortized

> 「We used it to construct Lumiere filters for the orbit for retrieval problems.」

---

### Section 3｜Power of Two Choices 直覺（30:00 ~ 50:00）

**重點摘要：** 用 g 和 h 兩個 hash function 選 load 較小的 bin。Intuition（non-rigorous）：每層的 fraction 平方遞減 → log log n 層後 ≤ 1。證明 max load = O(log log n) with high probability。

**內容：**

**設定：**
- n 個 item、n 個 bin
- 兩個 hash function g, h: U → [n]
- Insert x：放 A[g(x)] 或 A[h(x)] 中 load 較小的

**直覺論證（non-rigorous）：**
- B_i = 至少有 i 個 item 的 bin 數
- Pr[height(x) ≥ i+1] ≤ (B_i/n)²（要兩個 bin 都 load ≥ i）
- E[B_{i+1}] ≤ n · (B_i/n)² = B_i²/n
- 設 B_{10}/n ≤ 1/2（這個 base case 先接受）
- B_{10+j}/n ≤ (1/2)^{2^j}
- 2^j ≥ n 時 = 0 → j ≥ log log n
- 所以 max load = O(log log n)

> 「Once you're in a situation where B_i/n is less than, say, 1/2, then the fraction of bins that have a high load is decreasing as a power. It's squaring each time.」

---

### Section 4｜Power of Two Choices 嚴格證明（50:00 ~ 70:00）

**重點摘要：** 把直覺論證做成嚴格證明。定義 α_i = e · α_{i-1}²/n（比直覺多 e factor 給 slack）；用 Chernoff + union bound 證所有 E_i events 同時成立（high probability）。教授承認有 dependency issue 需修在 notes。

**內容：**

**嚴格定義：**
- α_i = e · α_{i-1}² / n
- E_i = [B_i ≤ α_i]

**Base case：**
- E_6: B_6 ≤ n/6 ≤ n/(2e) = α_6 → 機率 = 1
- 因為 n 個 item 最多 n/6 個 bin 有 6 個以上 item

**Claim 1：**
- Pr[B_{i+1} ≥ α_{i+1} | E_i] ≤ Pr[Binomial(α_i²/n², n) ≥ α_{i+1}]
- 用 Chernoff bound 處理 Binomial concentration

**Inductive step：**
- 假設 E_i 成立（conditioning）
- B_{i+1} ≤ #{x: height(x) ≥ i+1} = Σ_x B_x
- E[B_x] = Pr[both bins have load ≥ i] ≤ (B_i/n)² ≤ (α_i/n)²
- 因 E_i：B_i ≤ α_i
- 用 Chernoff：Pr[Σ B_x ≥ α_{i+1}] ≤ exp(-Ω(α_{i+1}))

**Union bound：**
- Σ_i Pr[B_{i+1} ≥ α_{i+1} | E_i] ≤ Σ exp(-Ω(α_{i+1}))
- 收斂 → with high probability, all E_i hold
- 故 max load = O(log log n)

**Dependency issue：**
- 教授承認：「There's some dependency issues you need to fix in this proof. Sorry, I have to fix this in the notes.」
- 是因為 condition on E_i 後 Binomial independence 不完全成立

> 「Sorry, I know that might have been an annoying point. But are there questions about the structure of the proof?」

---

### Section 5｜下週預告：Amortized Analysis + Heaps（70:00 ~ 81:00）

**重點摘要：** 教授公告下週進入 amortized analysis 主題：binomial heaps、Fibonacci heaps、splay trees。Fibonacci heaps 提供 Dijkstra 的 m + n log n 加速（vs binary heap 的 m log n）。學生中有人看過 fib heaps 但少數看過嚴格 analysis。

**內容：**

**下週計畫：**
- No more hashing after this lecture
- Amortized analysis
- Binomial heaps + Fibonacci heaps
- Splay trees（probably next week）

**Heaps 的應用：Dijkstra：**
- n 個 vertex、m 個 edge
- Dijkstra 用 heap：m 次 insert + m 次 decrease key + n 次 delete min
- Binary heap：所有 operation O(log n) → m log n
- Fibonacci heap：insert/decrease key O(1) + delete min O(log n) → m + n log n
- 在 connected graph 中 m > n → Fibonacci heap 是 speed up

**學生問：**
- Q：誰看過 Fibonacci heaps？
- A：少數人
- Q：誰看過 Fibonacci heaps 的 analysis（不只是 exist）？
- A：很少人；有人說是 project 的一部分

> 「Fibonacci heaps are able to do these operations in constant time and delete min in log n time, which gives you m plus n log n.」

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Cuckoo Hashing** | 兩個 hash function + kick-out；cycle > 10 log n 就 rebuild |
| **Cuckoo Graph** | m vertex + n edge 的 multigraph；cycle-free → forest |
| **Cycle Probability ≤ 1/2** | Cuckoo hashing 中 cycle 出現機率上界；rebuild 期望 2 次內成功 |
| **Power of Two Choices** | 兩個 hash function 選 load 較小的 bin；max load = O(log log n) |
| **B_i** | 至少有 i 個 item 的 bin 數 |
| **α_i** | 嚴格證明中 B_i 的 upper bound 序列；α_i = e·α_{i-1}²/n |
| **E_i** | Event：B_i ≤ α_i |
| **Lumiere Filter** | 一個 bloomier filter 的變體，用 cuckoo hashing 構造 |
| **Piazza Poll** | 課程用的討論 / 投票平台 |
| **Scribe** | 學生輪流擔任的 lecture note 記錄員 |
| **Amortized Analysis** | 計算一連串 operation 的平均成本；可允許某些 operation 昂貴 |
| **Fibonacci Heap** | 下一堂主題；insert/decrease key O(1) amortized；delete min O(log n) amortized |
| **Binomial Heap** | rank k 樹有 2^k nodes；insert O(1) amortized；delete min O(log n) |
| **Splay Tree** | 下一堂主題；self-adjusting BST；log n amortized |
| **Dijkstra's Algorithm** | 單源最短路徑；用 heap 達 m log n 或 m + n log n |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 81 分鐘（4897 秒） | 影片總長度 |
| 1036 cues | 英文手動字幕數量 |
| 37463 字元 | 英文逐字稿字元數（清理後） |
| 1/2 | Cuckoo hashing cycle 出現機率上界 |
| 2 | Rebuild 期望次數內成功 |
| log log n | Power of two choices 的 max load（with high probability） |
| 10 log n | Cuckoo hashing rebuild threshold |
| n | Universe size = bin 數量（power of two choices 設定） |
| 6 | α_i 序列的 base index |
| e | α_i recursion 的常數 factor（給 slack） |
| 2^j | B_{10+j}/n 的 fraction 衰減速率 |
| m log n | Dijkstra 用 binary heap 的時間 |
| m + n log n | Dijkstra 用 Fibonacci heap 的時間 |
| 4 個 | 課程 problem set 數量 |

---

## 五、核心主旨

> Cuckoo hashing 與 power of two choices 展示了 hashing 在 word-RAM 下的兩個不同深度：Cuckoo hashing 用「兩個 hash function + kick-out 機制 + rebuild threshold」達成 expected O(1) insertion（cuckoo graph 的 cycle 機率 ≤ 1/2 → rebuild 期望 2 次內成功 → amortized constant）；power of two choices 用「兩個 hash function 選 load 較小」達成 max load O(log log n)（每層 fraction 平方遞減）。共同主題：**兩個 hash function 比一個 hash function 帶來指數級的改善**——cycle-free 機率從 0 跳到 ≥ 1/2、max load 從 log n / log log n 跳到 log log n。下一堂進入 amortized analysis 主題，這是 Fibonacci heaps 與 splay trees 的前置工具。

---

## 六、金句摘錄

1. 「We used it to construct Lumiere filters for the orbit for retrieval problems.」

2. 「The probability that there exists a cycle in cuckoo graph is at most 1/2.」

3. 「The expected number of times you have to construct the cuckoo hash table is two.」

4. 「It's squaring each time. That's where log log n comes from.」

5. 「Once you're in a situation where B_i/n is less than 1/2, the fraction is decreasing as a power.」

6. 「There's some dependency issues you need to fix in this proof. Sorry, I have to fix this in the notes.」

7. 「The moment method is just a clever way to handle binomial concentration.」

8. 「Fibonacci heaps are able to do these operations in constant time and delete min in log n time.」

9. 「That gives you m plus n log n for Dijkstra.」

10. 「Who's seen Fibonacci heaps? OK. Who's seen the analysis? Oh, interesting.」

---

## 七、備註

- **字幕來源**：YouTube 英文手動字幕（en-j3PyPqV-e1s，1036 cues）— Harvard CS224 課程官方上傳
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **無 zh-Hant 字幕**：本影片有 en/zh-Hans/zh-Hant auto-cap，但抓取時遇到 HTTP 429
- **英文逐字稿字數**：37,463 字元（清理 VTT 時間碼、HTML 標籤後）
- **未使用 Whisper**：影片有完整手動字幕，無需 Whisper fallback
- **本筆記引用以 en 字幕為主**
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture5_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（cuckoo hashing、power of two choices、amortized analysis、Fibonacci heaps 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 58 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture5_口播稿.txt

- [opus 2.4 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture5.opus)（Telegram 友善）
- [m4a 4.7 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture5.m4a)（iOS 友善）
- [mp3 4.6 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture5.mp3)（通用格式）