# 【Harvard CS224 高階演算法 — Lecture 1：Word RAM、Predecessor 問題、van Emde Boas 與 Y-Fast Tries】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 88分鐘**

---

> **影片連結**：https://youtu.be/0JUN9aDxVmI
> **影片時長**：88 分鐘（5299 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption，3741 cues）+ 繁體中文自動字幕（zh-Hant auto-caption，3033 cues）雙語交叉對照

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms（高階演算法）」2014 年秋季學期（f14）的第一堂課，主講者為 Jelani Nelson 教授，TF（助教）為 Jeffrey。本堂課正式展開「**前驅問題（Predecessor Problem）**」這個貫穿整門課的主題：在靜態與動態的 word RAM 模型下，如何用最少的空間支援 insert、delete、predecessor、successor、min、max 等操作，並從排序的下界出發，分析為何需要 van Emde Boas 樹（vEB）、Fusion Tree、Y-Fast Trie 等資料結構。

課程設計的重點：

- **靜態 vs 動態資料結構**：靜態 = 集合 S 不變；動態 = 支援 insert/delete
- **Word RAM 模型**：CPU 暫存器大小為 w bit，可在 O(1) 對一個 word 做運算（加、乘、AND、OR、shift 等），且假設指標也能放進一個 word
- **下界與上界的對齊**：會證明 predecessor 在 word RAM 下有 Ω(log w / log log w) 的 cell-probe 下界，再展示 vEB、Y-Fast Trie 等如何逼近此下界
- **實作選擇**：vEB 雖給 O(log w / log log w) 時間但需 O(U) 空間（U 為 universe size），Y-Fast Trie 用 O(n) 空間達到 O(log w) 的期望時間

---

## 二、章節脈絡

### Section 1｜行政事項與課程概覽（00:00 ~ 08:00）

**重點摘要：** 教授自我介紹、TF 介紹、課程進行方式（scribe notes、problem set、project、grading policy）。

**內容：**
- 教授 Jelani Nelson 自我介紹，並介紹在後排舉手的 TF Jeffrey
- 聯絡方式：cs224-f14-staff@seas.harvard.edu
- 課程形式：上課有 scribe notes（學生輪流記錄 lecture notes）、4 個 problem set、1 個 project
- Project 截止日：reading period 最後一天（約 10 月 30 日）
- Grading policy：先看 project proposal，後續再調整
- Scribe 制度：先搶先贏，每個人至少要 scribe 一次

---

### Section 2｜為什麼要談 Predecessor？從排序下界講起（08:00 ~ 17:00）

**重點摘要：** 正式定義 predecessor problem——給定集合 S ⊆ {0, ..., U−1}，query x 回傳 S 中 ≤ x 的最大元素。Sorting 並不能真正解決 predecessor，因為 dynamic 版本在插入後還要 query，下界會被推高。

**內容：**

**Sorting 的啟示與限制：**
- Sorting 在靜態設定下是最強的——任何能用 comparison model 解的問題，sorting 都辦得到
- 但**動態 predecessor**（插入新元素後 query）不能用單純 sorting 解
- 若每次插入後重新排序，insert 是 O(n log n)；若用 binary search tree，insert 是 O(log n)，但 predecessor query 也是 O(log n)
- 問題：能不能更快？

**空間定義：**
- `s(n)` = 資料結構使用 n 個元素時的空間量
- `t(n)` = 操作時間（含 insert、delete、predecessor、successor、min、max）
- `q(n)` = query-only 的時間
- 動態版本：insert、delete 也要算進 t(n)

**靜態 vs 動態的核心差異：**
- 靜態 predecessor：sorting 就能達到 O(log n) query、O(n log n) 建構
- 動態 predecessor：sorting 不是好解，因為每次 insert 都要重排
- 用 BST 可達 insert/delete O(log n)、predecessor O(log n)，但仍不是 word RAM 最優

> 「Static just means that the set S of items doesn't change. If you had said a dynamic data structure, then of course it's a different ballgame.」

---

### Section 3｜Word RAM 模型與 Cell Probe 下界（17:00 ~ 26:00）

**重點摘要：** 介紹 word RAM 計算模型——CPU 暫存器 w bit、可在 O(1) 對 word 做基本運算。在這個模型下，predecessor 有 Ω(log w / log log w) 的 cell probe 下界，這是排序所沒有的下界。

**內容：**

**Word RAM 假設：**
- 暫存器 w bit 寬，w 至少 log n（否則連指標都放不下）
- 對一個 word 做加、乘、AND、OR、shift、unbounded shift 都是 O(1)
- 假設指標也能放進一個 word（因為 w ≥ log n）
- 此模型比 comparison model 更強：能直接做位元運算

**Cell Probe 下界（核心結果）：**
- 在 cell probe model 下，predecessor query 的下界是 **Ω(log w / log log w)**
- 這個下界比 comparison model 的 Ω(log n) 還要好（因為 log w 可能 ≪ log n）
- 證明技巧：把 predecessor 問題編碼為 communication protocol，使用「richness」參數
- Richness：S 中有 n 個元素要 precode 為 hash codes，predecessor query 相當於在某個 hash value 之前找到一個元素

> 「The predecessor problem has a lower bound of log w over log log w in the cell probe model.」

---

### Section 4｜上界：Fusion Tree、van Emde Boas、Y-Fast Trie 簡介（26:00 ~ 34:00）

**重點摘要：** 展示三個達到 word RAM 上界的資料結構——Fusion Tree 達 O(log n / log log n)、vEB 達 O(log w / log log w)、Y-Fast Trie 達 O(log w) 期望時間。

**內容：**

**Fusion Tree（Fredman、Willard 1993）：**
- 在 word RAM 下達到 O(log n / log log n) predecessor 時間
- 用 B = (log n) / 4 bit 切塊，把多個元素壓進一個 word
- 關鍵技巧：用到一個引理說對任意 n 個 w-bit 數字，可找到一個 `a` 使得這些數字乘以 `a` 後，前綴不重疊

**van Emde Boas 樹（vEB）：**
- 達到 O(log w / log log w) predecessor 時間
- 假設 word size w、universe size U = 2^w
- 遞迴結構：將 U 分成 √U 個 cluster，每個 cluster 是大小 √U 的 vEB；另有 summary vEB 記錄哪些 cluster 非空
- 空間 O(U)——對靜態資料來說太大

**Y-Fast Trie（Willard, 1982 / 1983）：**
- 達到 O(log w) 期望時間 predecessor
- 空間 O(n)——比 vEB 好很多
- 結合兩個概念：hash table + search trie + 「代表元素」（representative）

**三個資料結構的取捨：**

| 資料結構 | 時間 | 空間 | 適用情境 |
|----------|------|------|----------|
| BST | O(log n) | O(n) | 通用 |
| Fusion Tree | O(log n / log log n) | O(n) | word RAM，靜態／動態皆可 |
| vEB 樹 | O(log w / log log w) | O(U) | 靜態，U 不太大 |
| Y-Fast Trie | O(log w) 期望 | O(n) | 動態，n ≪ U |

---

### Section 5｜van Emde Boas 樹詳細分析（34:00 ~ 53:00）

**重點摘要：** 詳細推導 vEB 的時間複雜度——透過「將 w 連續取 √ 直到 1」的分析，證明 O(log w / log log w)。也討論插入時 summary 結構的維護，以及 cluster 是否為空的判斷。

**內容：**

**vEB 基本結構：**
- Universe size U，U = 2^k
- 把 U 切成 √U = 2^(k/2) 個 cluster
- 每個 cluster 存大小 √U 的元素
- Summary vEB 存哪些 cluster 非空
- 另存最小元素（min）與最大元素（max）於 vEB 物件本身

**Insert 演算法：**
- 若 x > max，直接更新 max
- 否則找到對應 cluster c = ⌊x / √U⌋
- Recursively insert x mod √U 到 cluster[c]
- 若 cluster[c] 之前是空的，insert c 到 summary

**Query 演算法：**
- 若 x ≥ max，回傳 max
- 否則找到對應 cluster c = ⌊x / √U⌋
- Recursively query x mod √U 到 cluster[c]
- 但有邊角情況：若 x 比 cluster[c] 的 min 還小，predecessor 不在那個 cluster，要往 summary 找前一個非空 cluster

**時間分析：**
- 設 T(U) = predecessor 在 U-universe 的時間
- Recurrence：T(U) = 2 T(√U) + O(1)（query summary + recurse cluster）
- 解：T(U) = O(log U / log log U) = O(log w / log log w)
- 直觀：U → √U → ⁴√U → ... 直到 1；√ 取了 log log U 次，每層 O(1)

> 「So if we're saying that W is getting square rooted, that basically means this, if we're saying U gets square rooted, we end up with log log U levels.」

**空間問題：**
- vEB 用了 O(U) 空間——對 U 大的情況不切實際
- 解法：Y-Fast Trie

---

### Section 6｜Y-Fast Trie：結合 Hash Table 與 Trie（53:00 ~ 73:00）

**重點摘要：** Y-Fast Trie 解決 vEB 空間過大的問題——把元素分組到 √n 大小的 bucket，用 hash table 存每個 bucket 的代表元素，用 search trie 在代表元素間查詢。

**內容：**

**基本想法：**
- 把 S 中的 n 個元素分成 O(n/√n) = O(√n) 個 bucket
- 每個 bucket 存 ≤ √n 個元素（具體數量隨機）
- 從每個 bucket 抽一個「代表元素」（representative）插入 search trie
- Bucket 本身用 hash table 儲存所有元素

**資料結構組成：**
- 一棵 search trie（或 skiplist）儲存所有代表元素
- 每個代表元素指向一個 hash table，存對應 bucket 的所有元素
- 為了避免空間問題，每個 bucket 期望 √n 大小（用 universal hash family 隨機分配）

**操作複雜度：**
- Query：在 trie 中找 predecessor of x（O(log n) 或 O(log w) 用 vEB）→ 找到對應 bucket → 在 hash table 中找 exact predecessor（O(1) 期望）
- Insert：找到 bucket → insert 到 hash table；若 bucket overflow，重新切分並更新 trie 中的代表元素
- Delete：類似 insert

**為什麼空間是 O(n)？**
- Trie 存 O(n/√n) = O(√n) 個代表元素
- Hash tables 共有 O(n) 個元素（每個元素恰好在一個 hash table 內）
- 加上 hash table 的 overhead（用 perfect hashing 可省空間）

**Trade-off 總結：**
- 用 O(n) 空間 + O(log w) 期望時間
- 比 vEB 空間好，比 BST 時間好
- 取兩者之長

> 「You store one representative per bucket, and that representative goes into the trie, and then within the bucket you have a hash table.」

---

### Section 7｜Paper 簽署、開放問答與下週預告（73:00 ~ 88:00）

**重點摘要：** 教授開放學生簽署某篇 paper，開放 Office Hours 問題，並回應學生關於 predecessor 動態版本的疑問。

**內容：**
- 開放學生簽署 paper（scribe 也包含在此）
- 有學生問：Fusion Tree 動態版本可不可行？教授回答：可以，但 insert 時要重新計算 multiplication constant `a`，需要 O(log n) 重新 amortized
- 有學生問：vEB 動態版本？教授回答：可以，但 insert 也涉及 cluster 重建，空間仍是 O(U)
- Office Hours 公布
- 提醒下次 lecture 會講 fusion tree 的細節

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Predecessor Problem** | 給定集合 S ⊆ {0, ..., U−1}，query x 回傳 S 中 ≤ x 的最大元素 |
| **Word RAM Model** | CPU 暫存器 w bit，可在 O(1) 對 word 做加、乘、AND、OR、shift 等運算；w ≥ log n |
| **Cell Probe Model** | 只計算記憶體存取的計算模型；word RAM 的下界常用此模型證明 |
| **Static vs Dynamic** | Static = 集合 S 不變；Dynamic = 支援 insert/delete 操作 |
| **van Emde Boas Tree (vEB)** | 達 O(log w / log log w) predecessor 時間的遞迴資料結構；空間 O(U) |
| **Fusion Tree** | 達 O(log n / log log n) predecessor 時間；用位元壓縮技巧 |
| **Y-Fast Trie** | 達 O(log w) 期望時間 predecessor；空間 O(n)；結合 hash table + search trie |
| **Cluster** | vEB 中將 universe U 分成 √U 個子區段，每個 cluster 是大小 √U 的 vEB |
| **Summary vEB** | vEB 中記錄「哪些 cluster 非空」的遞迴結構 |
| **Representative** | Y-Fast Trie 中每個 bucket 抽出的一個代表元素，存於 search trie |
| **Bucket** | Y-Fast Trie 中 O(√n) 大小的元素分組 |
| **Universal Hash Family** | 一族 hash function 保證對任意兩個 key 碰撞機率 ≤ 1/m |
| **Richness** | Cell probe 下界證明中的關鍵參數，描述 precode 的資訊密度 |
| **Scribe Notes** | 學生輪流擔任記錄員，把 lecture 內容整理成正式 notes 的制度 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 88 分鐘（5299 秒） | 影片總長度 |
| 3741 cues | 英文自動字幕數量 |
| 3033 cues | 繁體中文自動字幕數量 |
| 88,432 字 | 英文逐字稿字元數（cleanup 後） |
| log w / log log w | predecessor 在 cell probe model 的下界 |
| O(U) | vEB 樹的空間複雜度（universe size） |
| O(n) | Y-Fast Trie 的空間複雜度 |
| O(√n) | Y-Fast Trie 中每個 bucket 的期望大小 |
| O(log w) | Y-Fast Trie predecessor 的期望時間 |
| 1975 | van Emde Boas 原始論文的年代 |
| 1993 | Fredman-Willard Fusion Tree 論文的年代 |
| 1982-83 | Willard Y-Fast Trie 論文的年代 |
| 4 個 | 課程 problem set 數量 |
| 1 個 | project 數量 |

---

## 五、核心主旨

> Predecessor 問題在 word RAM 模型下有 Ω(log w / log log w) 的 cell probe 下界——這是 sorting 的 O(log n) 下界無法達到的。van Emde Boas 樹以 O(U) 空間達到此下界，但對大 universe 不切實際；Y-Fast Trie 用 hash table 與 trie 的混合結構，以 O(n) 空間達到 O(log w) 期望時間，是動態 predecessor 的實用選擇。這門課的核心主題就是：在 word RAM 這個比 comparison model 更強的計算模型下，設計資料結構來逼近 predecessor 與其他基本問題的理論下界。

---

## 六、金句摘錄

1. 「Static just means that the set S of items doesn't change. If you had said a dynamic data structure, then of course it's a different ballgame.」

2. 「You can get a fast sorting algorithm using dynamic predecessor, but sorting itself doesn't solve dynamic predecessor efficiently.」

3. 「The predecessor problem has a lower bound of log w over log log w in the cell probe model, which is strictly better than comparison-based bounds when w is small.」

4. 「Fusion Tree packs B elements into a word using a multiplication lemma that finds a magic constant `a` such that the products don't overlap.」

5. 「Van Emde Boas recurses on the universe size — square root each level — and ends up with log log U levels, each costing O(1).」

6. 「The unfortunate thing about vEB is that it uses O(U) space, which is way more than O(n) if U is large.」

7. 「Y-Fast Trie solves the space problem: hash table per bucket, representative in trie, total space O(n).」

8. 「You store one representative per bucket in the trie; within each bucket you have a hash table storing all elements.」

9. 「Each minimum in a cluster gets charged for storing a pointer to its cluster — amortized analysis handles the rest.」

10. 「When we hit log log U levels of recursion with O(1) per level, that's where the log w / log log w comes from.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption，3741 cues）+ 繁體中文自動字幕（zh-Hant auto-caption，3033 cues）雙語交叉對照
- **未使用 Whisper**：影片有完整 YouTube 自動字幕（zh-Hant 與 en），無需 Whisper fallback
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **英文逐字稿字數**：43,896 字元（清理 VTT 時間碼、HTML 標籤後）
- **自動字幕品質**：zh-Hant 為 en 的機器翻譯版本（zh-Hant 3033 vs en 3741 cues，差 19%）；en 字幕對技術術語（van Emde Boas、Fusion Tree、word RAM、cell probe 等）保留更精確
- **本筆記引用以 en 字幕為主，zh-Hant 用於中文關鍵概念對照**
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture1_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（van Emde Boas、Fusion Tree、Word RAM、cell probe 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 41 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture1_口播稿.txt

- [opus 2.3 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture1.opus)（Telegram 友善）
- [m4a 4.5 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture1.m4a)（iOS 友善）
- [mp3 4.3 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture1.mp3)（通用格式）