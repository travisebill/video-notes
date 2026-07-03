# 【Harvard CS224 高階演算法 — Lecture 6：攤銷分析、二項堆與費氏堆】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 83分鐘**

---

> **影片連結**：https://youtu.be/gxp_FrgTkQI
> **影片時長**：83 分鐘（5026 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文手動字幕（en-j3PyPqV-e1s，1197 cues）— Harvard CS224 課程官方上傳

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms」2014 年秋季學期（f14）的第六堂課，主講者為 Jelani Nelson 教授。本堂課正式離開 word-RAM 模型，進入 **amortized analysis（攤銷分析）** 主題，並建構 **Binomial Heaps（二項堆）** 與 **Fibonacci Heaps（費氏堆）**。

課程設計的核心問題：**為什麼需要 amortized analysis？**

- 單一 operation 的 worst case 可能很貴，但一連串 operation 的平均成本可以便宜很多
- Fibonacci heaps 提供 insert O(1)、decrease key O(1)、delete min O(log n) 的 amortized time
- 直接讓 Dijkstra's algorithm 從 m log n 加速到 m + n log n
- 核心工具：potential function（位能函數）

課程流程：
- 開場修正 cuckoo hashing + power of two choices 的 bugs（教授會修在 notes）
- 介紹 amortized analysis 與 potential function method
- 回顧 heap 抽象資料型態與 Dijkstra 的需求
- 詳細建構 binomial heap 與 Fibonacci heap
- 證明 Fibonacci heap 的 amortized bounds
- 預告下週進入 splay trees

---

## 二、章節脈絡

### Section 1｜開場行政事項與 Bug 修正（00:00 ~ 06:00）

**重點摘要：** Piazza poll 收集 pset 1 花費時間。9 月 30 日的 scribe 缺人，請學生補上。教授修正上次 cuckoo hashing 的 off-by-one bug 跟 power of two choices lemma，已修在 notes。正式進入 amortized analysis。

**內容：**
- Piazza poll：請填寫 pset 1 花費時間
- 9 月 30 日的 scribe 缺人，請學生補上或跟其他人交換
- 教授已修正上次 cuckoo hashing 的 off-by-one bug
- 修正上次 power of two choices lemma（dependency issue）→ 已修在 notes
- 進入新主題：amortized analysis

> 「I fixed the two bugs—of by one in cuckoo hashing, and the lemma, I didn't actually prove for power of two choices.」

---

### Section 2｜Amortized Analysis 與 Potential Function（06:00 ~ 30:00）

**重點摘要：** 定義 amortized analysis：n_A 個 A operation、n_B 個 B operation... 的總時間 ≤ n_A·t_A + n_B·t_B + ...，其中 t_A 是 A 的 amortized cost。Potential function method：定義 Φ(state) ≥ 0、Φ(empty) = 0；amortized cost = actual cost + Φ(after) - Φ(before)。

**內容：**

**Amortized Analysis 定義：**
- 資料結構支援 operations A, B, C
- Amortized costs：t_A, t_B, t_C
- 任何 sequence of n_A A、n_B B、n_C C operations
- 總時間 ≤ n_A · t_A + n_B · t_B + n_C · t_C

**為什麼需要 amortized analysis：**
- Worst case：每個 operation 都 bound 在 worst case
- Amortized：允許某些 operation 很貴，只要平均便宜
- 例：red-black tree search 是 O(log n) worst case；但 union-find 的 amortized 也是 O(log n)
- 例：splay tree search 最壞 O(n)，但 amortized O(log n)

**Potential Function Method：**
- 定義 Φ: state → ℝ≥0
- Φ(empty data structure) = 0
- Amortized cost of operation = actual time + ΔΦ = actual time + Φ(after) - Φ(before)
- 為什麼 work：telescoping sum
  - Σ amortized costs = Σ actual + (Φ_final - Φ_0)
  - Φ_0 = 0, Φ_final ≥ 0
  - Σ amortized ≥ Σ actual → 反向：bound amortized → bound actual
- 常見 Φ：number of trees、number of marked nodes、heap size 等等

> 「If we bound the cost per operation as this thing, that will give us a correct upper bound on the actual cost.」

---

### Section 3｜Heap 抽象資料型態與 Dijkstra（30:00 ~ 45:00）

**重點摘要：** Heap 支援 insert(x)、decrease-key(x, k)、delete-min() 三種 operation。Dijkstra 需要 m 次 insert、m 次 decrease key、n 次 delete min。Binary heap 所有 operation O(log n) → m log n。Fibonacci heap insert + decrease key O(1) + delete min O(log n) → m + n log n。

**內容：**

**Heap ADT：**
- insert(x)：插入 key x
- delete min()：回傳並刪除最小元素
- decrease key(x, k)：把 x 的 key 降到 k（k ≤ x）

**為什麼 Dijkstra 需要 Fibonacci heap：**
- n 個 vertex、m 個 edge
- Dijkstra：m 次 insert、m 次 decrease key、n 次 delete min
- Binary heap：所有 operation O(log n) → m log n（connected graph 中 m > n）
- Fibonacci heap：insert + decrease key O(1)、delete min O(log n) → m + n log n
- 在 dense graph 中 m >> n 時 Fibonacci heap 大幅加速

**當代變體：**
- Kaplan-Tarjan-Zwick（2014 arXiv）：用 single tree 而非 forest
- 沒有改進 bound，只是 implementation 更乾淨
- Fibonacci heaps 在實務中 constants 太大不常用，但仍是 amortized analysis 的經典案例

---

### Section 4｜Binomial Heaps（45:00 ~ 65:00）

**重點摘要：** Binomial heap 用 forest 結構；rank k tree 有 2^k nodes 且 root 有 k 個 child；每個 rank 最多一棵樹。Insertion = binary addition（新增 singleton tree + 重複 merge）。Delete min = 移除 root + 把 children 變成新 trees。Potential = number of trees。

**內容：**

**結構：**
- 每個 item 是 node
- Forest of trees
- 如果 x 是 y 的 parent → key(x) ≤ key(y)（min-heap）
- Rank k tree = 2^k nodes
- 每個 rank 最多一棵樹
- Rank k root 有 children of rank 0, 1, ..., k-1

**範例：**
- Rank 0：單一 node
- Rank 1：root + 一個 rank 0 child
- Rank 2：root + rank 0 child + rank 1 child（4 nodes）
- Rank 3：root + rank 0 + rank 1 + rank 2（8 nodes）

**Insertion：**
- 新 node 加進 top-level linked list
- 等於 binary addition：每個 rank 最多一棵 → 多出來的 merge 起來
- Worst case：merge log n 次（每個 rank 都有一棵時）→ O(log n) worst case

**Delete min：**
- 從所有 root 中找 min（至多 log n 個 root）
- 移除該 root，其 children 變成新的 top-level trees
- 重新 consolidate（merge 同 rank）
- Worst case：O(log n)

**Decrease key：**
- 改 key，可能違反 heap order
- 一直 swap with parent 直到滿足 → O(log n) worst case

**Potential = number of trees：**
- Insertion：actual cost = t_old → t_new（number of trees before → after）
- Amortized cost = (t_old - t_new + 1) + (t_new - t_old) = 1
- 證明 insertion 是 O(1) amortized
- Delete min：amortized = O(log n)
- Decrease key：amortized = O(log n)

> 「So this is just like binary addition.」

---

### Section 5｜Fibonacci Heaps：Lazy Insertion + Mark Bit + Cascading Cuts（65:00 ~ 80:00）

**重點摘要：** Fibonacci heap 的核心是「lazy」：insertion 只加進 linked list 不 consolidate；decrease key 若違反 heap order 就 cut 出來成 top-level tree；如果 parent 失去兩個 child 也 cut 自己。Mark bit 追蹤「是否已失去一個 child」。Sizes follow Fibonacci numbers → k = O(log n)。

**內容：**

**Lazy insertion：**
- Insertion：只把 node 加進 top-level linked list，不 consolidate
- 為什麼 lazy：insertion 沒理由做 work（其他 operation 不需要）
- Consolidation 留給 delete min 做

**Lazy decrease key：**
- 改 key，若違反 heap order
- Cut x 從其 tree 移到 top-level linked list
- If x's parent is marked：也 cut parent 出去（cascading cut）
- 直到 parent 未標記或已是 top-level root

**Mark bit：**
- 每個 node 一個 bit：「是否已失去一個 child」
- 當 node 失去第一個 child → mark it
- 當 node 失去第二個 child → cut it out, reset mark

**Tree sizes follow Fibonacci：**
- Rank 0 tree：1 node
- Rank 1 tree：≥ 2 nodes
- Rank 2 tree：≥ 3 nodes
- Rank 3 tree：≥ 5 nodes
- Rank k tree：≥ F_{k+2} nodes (Fibonacci number)
- F_{k+2} ≥ φ^k → k = O(log n)

**Proof that sizes grow like Fibonacci：**
- 因為只有 lose 一個 child 仍維持 rank
- 兩個 child 都 lost 才 cut 出去
- 所以 tree 的 shape 跟 binomial tree 類似但容許 lose 一些

---

### Section 6｜Fibonacci Heaps Amortized Analysis（80:00 ~ 83:00）

**重點摘要：** Potential = trees + 2·marked items。Insertion O(1) amortized；delete min O(log n) amortized；decrease key O(1) amortized with cascading cuts。

**內容：**

**Potential function：**
- Φ(H) = #(trees in H) + 2 · #(marked items in H)

**Insertion amortized cost：**
- Actual cost = O(1)（只加進 linked list）
- ΔΦ = +1（新 tree）+ 0（no new marks）= 1
- Amortized = O(1) + 1 = O(1)

**Delete min amortized cost：**
- Actual cost = O(t + r)，t = delete min 前 tree 數、r = ranks involved
- Consolidation 後 rank 至多 log n（因 Fibonacci size）
- ΔΦ ≤ O(r) - 2·(可能減少的 marks)
- Amortized = O(t + r) + ΔΦ = O(log n)

**Decrease key amortized cost：**
- Case 1：x 不違反 heap order → actual O(1)、ΔΦ = 0 → amortized O(1)
- Case 2：cascading cuts 共 c 次
  - Actual cost = O(c)
  - ΔΦ = c (new trees) - 2c (lost marks) = -c
  - Amortized = O(c) + (-c) = O(1)

**結論：**
- Insertion O(1) amortized
- Decrease key O(1) amortized
- Delete min O(log n) amortized
- → Dijkstra 從 m log n 加速到 m + n log n

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Amortized Analysis** | 一連串 operation 的平均成本；可允許個別 operation 昂貴 |
| **Potential Function** | Φ: state → ℝ≥0；Φ(empty) = 0；amortized = actual + ΔΦ |
| **Telescoping Sum** | Σ amortized = Σ actual + Φ_final - Φ_0 |
| **Heap ADT** | insert、delete min、decrease key 三種 operation |
| **Binomial Heap** | Forest of rank k trees（2^k nodes）；insert O(1) amortized |
| **Fibonacci Heap** | Lazy insert + mark bit + cascading cut；insert/decrease key O(1) amortized |
| **Rank** | Tree 的 root degree；rank k tree 有 ≥ F_{k+2} nodes（Fibonacci） |
| **Mark Bit** | 「是否已失去一個 child」的 bit；loss 第二個 child 時 cut |
| **Cascading Cuts** | Decrease key 時若 parent 標記過 → 也 cut parent 出去 |
| **Lazy Insertion** | 只加進 top-level linked list；不 consolidate |
| **Consolidation** | Delete min 時 merge 同 rank trees；發生在 deletion 時 |
| **Dijkstra's Algorithm** | 單源最短路徑；用 Fibonacci heap 達 m + n log n |
| **Static Optimality** | Splay tree 的特性：跟 optimal BST 競爭（下一堂） |
| **Splay Tree** | Self-adjusting BST；log n amortized；下週主題 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 83 分鐘（5026 秒） | 影片總長度 |
| 1197 cues | 英文手動字幕數量 |
| 44,523 字元 | 英文逐字稿字元數（清理後） |
| O(1) amortized | Fibonacci heap 的 insertion 與 decrease key |
| O(log n) amortized | Fibonacci heap 的 delete min |
| m log n | Dijkstra 用 binary heap 的時間 |
| m + n log n | Dijkstra 用 Fibonacci heap 的時間 |
| log n | Binomial heap 的 worst case 各種 operation |
| 2^k | Binomial heap rank k tree 的 node 數 |
| F_{k+2} | Fibonacci heap rank k tree 的 minimum node 數 |
| φ ≈ 1.618 | Golden ratio；F_{k+2} ≥ φ^k |
| O(log n) | Fibonacci heap 的 maximum rank |
| O(log n) | Binomial heap 的 maximum tree 數 |

---

## 五、核心主旨

> Amortized analysis 把「資料結構設計」從單一 operation 的 worst case 思考中解放出來：Fibonacci heap 的 delete min 仍是 O(log n)、decrease key 是 O(1)、insertion 是 O(1)——但都是 amortized 而非 worst case。這個 trade-off 的核心是「lazy」：不做 work 直到必須做。Insertion 把 node 加進 top-level linked list 不 consolidate；decrease key 只在違反 heap order 時 cut，並用 cascading cuts + mark bit 維持 tree size 跟 Fibonacci 數列的關係（保證 rank = O(log n)）。Potential function Φ = #trees + 2·#marks 把這些「lazy 留給 delete min 做的 work」量化成 amortized 成本。Fibonacci heap 的存在讓 Dijkstra 從 m log n 加速到 m + n log n——這是 amortized analysis 在經典演算法中最具影響力的應用。

---

## 六、金句摘錄

1. 「The amortized cost of an operation is defined to be the actual time plus the potential difference.」

2. 「All we're left with is the sum of the actual costs plus the final potential minus the original potential.」

3. 「A rank k tree has exactly 2 to the k nodes.」

4. 「This is just like binary addition.」

5. 「Insertion is O(1) amortized—its potential just increases by 1.」

6. 「The main idea Fibonacci heaps is to be lazy.」

7. 「There's no reason for insertions to spend time consolidating.」

8. 「Really lazy decrease key—cut x out and place as top-level tree.」

9. 「If p loses a second child, we cut p out of the tree too.」

10. 「Fibonacci heaps are known as having somewhat large constants, so you wouldn't actually use them in real applications.」

---

## 七、備註

- **字幕來源**：YouTube 英文手動字幕（en-j3PyPqV-e1s，1197 cues）— Harvard CS224 課程官方上傳
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿分析整理
- **無 zh-Hant 字幕**：本影片有 en/zh-Hans/zh-Hant auto-cap，但抓取時遇到 HTTP 429
- **英文逐字稿字數**：44,523 字元（清理 VTT 時間碼、HTML 標籤後）
- **未使用 Whisper**：影片有完整手動字幕，無需 Whisper fallback
- **本筆記引用以 en 字幕為主**
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture6_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（Fibonacci heap、binomial heap、amortized analysis、potential function 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 32 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture6_口播稿.txt

- [opus 2.2 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture6.opus)（Telegram 友善）
- [m4a 4.3 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture6.m4a)（iOS 友善）
- [mp3 4.2 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture6.mp3)（通用格式）