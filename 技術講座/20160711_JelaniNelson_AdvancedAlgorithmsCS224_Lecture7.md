# 【Harvard CS224 高階演算法 — Lecture 7：Splay Trees】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 86分鐘**

---

> **影片連結**：https://youtu.be/LbX51mey3vo
> **影片時長**：86 分鐘（5206 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms」2014 年秋季學期（f14）的第七堂課，主講者為 Jelani Nelson 教授。本堂課的主題是 **Splay Trees（Sleator 與 Tarjan 1985）**——一種類似 AVL Tree、Red-black Tree 的平衡二元搜尋樹，但具備「**Self-adjusting（自我調整）**」特性：每次操作後透過一連串 rotation 把被存取的節點搬到 root。本堂課的目標是證明 Splay Tree 在 amortized（攤銷）意義下達到 **O(log n)** 的單次操作時間，並展示其額外的強性質（static optimality、entropy bound 等）。

課程設計的重點：

- **Splay Trees 雖然在最壞情況下是 O(n)**，但 amortized 是 O(log n)
- **與 RB Tree / AVL Tree 的差異**：後者始終保持嚴格高度平衡；splay tree 只在每次操作時局部調整
- **實際應用廣泛**：1999 年獲 Paris Kanellakis Theory and Practice 獎（因「過去 20 年最廣泛使用的資料結構」）
- **本課目標**：定義 splay 操作（zig / zig-zig / zig-zag）→ 設計 potential function Φ → 用 amortized analysis 證明 O(log n) bound
- **期末目標**：展示 splay trees 達到 entropy bound（即 static optimality），代表它對「哪些 key 比較常被存取」的 workload 自動適應

---

## 二、章節脈絡

### Section 1｜課程介紹與 Splay Trees 背景

**重點摘要：** 教授點名、學生提問、引入 Splay Trees 的歷史背景（Sleator-Tarjan 1985）與實際影響（Paris Kanellakis Award 1999）。

**內容：**
- Splay Trees 是 Sleator 與 Tarjan 於 1985 年提出的 self-adjusting 資料結構
- 1999 年因「過去 20 年最廣泛使用的資料結構」獲得 Paris Kanellakis Theory and Practice 獎
- 屬於 comparison-based 字典結構（支援 insert / find / delete with key）
- 主要分析工具是 amortized analysis——單次操作可能慢，但「平均」快
- 也回應學生關於「課堂上像 fusion tree 這種理論結構是否有人真的在用」的疑問
- 課堂上的平衡樹是 binary search tree 的一種，差別在 splay tree 每次操作後做 rebalancing

### Section 2｜BST Model 與 Rotation 操作的定義

**重點摘要：** 正式定義 Splay Trees 在其上的計算模型——BST Model：每步可選擇走 child / parent 指標，或執行一次 rotation。

**內容：**
- **BST Model**：在每個 operation 的開始，持有指向 root 的指標；每步可以 walk to child / walk to parent / do a rotation
- **Rotation 的定義**：給定一個 node X 及其 parent Y，rotate X 後 X 成為 Y 的 parent，原先 X 的 sibling subtree 改接到 Y 的下方，且 binary search tree 的 order 不變
- 對稱的情況：X 為 Y 的 right child 時的 mirror image
- Rotation 是 atomic O(1) operation，且不改變 BST ordering 性質
- 本模型比 comparison-based pointer machine 更強，因為 rotation 可以決定子樹的形狀

### Section 3｜Splay 操作：Zig / Zig-Zig / Zig-Zag

**重點摘要：** Splay 是把某個 node X 搬到 root 的 subroutine，由三種基本情形組成——Zig（X 的 parent 是 root）、Zig-zig（X 與 parent 同方向）、Zig-zag（X 與 parent 反方向）。

**內容：**

**Splay-X 的定義：**
- 三種 case case 1：X 是 root 的 child → 做一次 zig rotation
- Case 2：X 與其 parent P 與 grandparent G 形成「同方向」（left-left 或 right-right）→ 做 zig-zig（兩次同方向 rotation：先 rotate P，再 rotate X）
- Case 3：X 與 P 形成「反方向」（left-right 或 right-left）→ 做 zig-zag（兩次反方向 rotation）

**Find 操作：**
- 按 BST 規則找到 X，走到該 node
- 然後 splay X（X 變成新 root）

**Insert 操作：**
- 按 BST 規則插入新 key 到對應位置
- 然後 splay 新插入的 node（新 node 變成 root）

**Delete 操作：**
- 一個方法：先 splay K（讓 K 變 root），移除 K，然後把左右兩 subtree 合併（兩棵樹的 min 跟 max 用一連串 splay 銜接）

### Section 4｜Potential Function 設計：Rank r(x) = log size of subtree

**重點摘要：** 為 Splay Tree 選用 potential function——Φ = Σ log(size(T_v))，其中 T_v 是以 v 為 root 的 subtree，並定義每個 node 的 rank r(v) = ⌊log(size(T_v))⌋。

**內容：**

**Potential Φ = Σ_v log |T_v|：**
- 對每個 node v，T_v 是以 v 為 root 的 subtree
- size(T_v) = 子樹節點數
- Potential 是所有 v 的 log size 總和
- Φ 一定 ≥ 0，且 size 越大 log 越大，所以插入大資料結構會把潛能拉高
- Φ 最多 O(n log n)，因為 size ≤ n

**Rank r(x) = ⌊log |T_x|⌋：**
- 注意 rank 會隨 rotation 改變（祖先、子孫的 size 都會變）
- Φ = Σ_v rank(v)，rank 是 floor(log size)
- 每個 node 對 Φ 的「貢獻」是其 rank
- Φ(T) = sum of all ranks（T 為整棵樹時）

**Delta 計算技巧：**
- 對 splay step，要分析 ΔΦ
- ΔΦ = (新 Φ) − (舊 Φ)
- 由於 splay 只動到 x、x 的 parent、x 的 grandparent 三個 node 的子樹，所以 ΔΦ 涉及這幾個 node rank 的變化

### Section 5｜Splay Theorem 的 Amortized 分析：3 Roti + 3 Rank Drop

**重點摘要：** 證明 splaying a node x 的 amortized cost 最多 3(r(root) − r(x)) + 1 = O(log n) rank drops；對應 amortized 時間 O(log n)。

**內容：**

**Splay 單步 amortized cost 公式：**
- **Case 1（Zig）**：amortized cost ≤ 1 + 3(r'(x) − r(x)) + 1 ≤ 1 + 3Δr(x) + 1
- **Case 2（Zig-zig）**：amortized cost ≤ 2 + 3(r'(x) − r(x)) − 3 + … ≤ 3(r'(x) − r(x))
- **Case 3（Zig-zag）**：amortized cost ≤ 2 + 3(r'(x) − r(x)) ≤ 3(r'(x) − r(x))
- 每種 case amortized cost 以 Δr(x) 的 **3 倍** 上界

**為什麼 Δr(x) ≤ −1 每 splay-step？**
- Case 2 & 3 至少把 x 的 rank 降 1，因為 x 的子樹 size 至少減半（因為做完 rotation 後 x 只剩原本一半的 size）
- 所以 Δr(x) ≤ −1，累加下來 splaying 一個 depth-d 的 node 要 d steps → total amortized 3 × log n

**Access Theorem：**
- 任何 m 個 operations（insert / find / delete）的總 amortized cost = O(m log n)
- 攤銷後每次操作 O(log n) 攤銷時間

### Section 6｜Splay Trees 的其他強性質：Static Optimality

**重點摘要：** 教授快速證明 Splay Trees 達到 static optimality（access 順序已知的最佳 BST 的 cost 範圍），與 entropy bound（為每個 key 分配權重後達 Huffman coding 等級的 access cost）。

**內容：**

**Static Optimality 定理：**
- 給定一個 fixed request sequence σ
- 令 T_σ 是 optimal BST（事先知道 σ 的靜態最佳 BST）
- 對 splay tree，在 σ 上的 amortized cost ≤ O(1) × OPT(T_σ)
- 即 splay tree **不會比**事先知道未來的 optimal BST 差太多

**證明思路（weight assignment）：**
- 給每個 node 分配 weight = 1 / 3^(depth)
- 證明 splay 的 amortization 結構剛好打到 Huffman bound
- 每個 node 的 weight 對應 access 機率
- potential function: Φ(T) = Σ_v −log(w_v)

**Entropy Bound：**
- Static optimality 直接蘊含 entropy bound
- 對 Huffman-style 編碼也很自然（splay tree 對常被存取的 key 自動降低深度）

> 「Splay trees have proven to achieve entropy bound and a lot more — they're basically optimal on many natural access sequences without knowing the future.」

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Splay Tree** | Sleator-Tarjan 1985 的 self-adjusting BST；每次操作後把被存取 node 搬到 root |
| **BST Model** | 一種 pointer machine：每步可走 child / parent 指標或做 rotation |
| **Rotation** | 在 BST 中把一個 node 提到其 parent 之上，O(1) 操作且不破壞 BST ordering |
| **Splay Operation** | 把 node X 透過一連串 zig / zig-zig / zig-zag rotation 搬到 root 的 subroutine |
| **Zig Rotation** | X 的 parent 是 root 時，做一次簡單 rotation |
| **Zig-Zig Rotation** | X 與 parent 形成同方向（左左 / 右右）時，做兩次同方向 rotation |
| **Zig-Zag Rotation** | X 與 parent 形成反方向（左右 / 右左）時，做兩次反方向 rotation |
| **Amortized Analysis** | 一種動態分析，允許單次操作昂貴但保證「平均」夠快 |
| **Potential Function Φ** | 一個資料結構的「能量」非負函數，操作成本 = 實際成本 + ΔΦ |
| **Rank r(x)** | r(x) = ⌊log(|T_x|)⌋，T_x 為以 x 為 root 的 subtree |
| **Access Theorem** | m 個 splay operations 的 amortized cost ≤ O(m log n) |
| **Static Optimality** | Splay tree 的 amortized cost 與 optimal BST（事先知道 access sequence）只差 O(1) 倍 |
| **Entropy Bound** | 對 Huffman-style access（高頻 key 優先），splay tree 達到熵下界 |
| **Paris Kanellakis Award** | ACM 獎項，表彰「短期內從理論走向實際」的研究；1999 年頒給 Sleator-Tarjan splay tree |
| **Self-Adjusting Data Structure** | 不靠 heuristic（如 size 平衡）而是根據 access pattern 自動調整 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 86 分鐘（5206 秒） | 影片總長度 |
| 1568 cues | 英文自動字幕數量（清後逐字稿 lines） |
| 9188 words | 英文逐字稿字數（清理 VTT 後） |
| 1985 | Sleator-Tarjan 原始論文年份 |
| 1999 | Splay Tree 獲 Paris Kanellakis Theory and Practice 獎 |
| log n | splay tree 的 amortized cost 對單次操作的上界 |
| 3 (r'(x) − r(x)) | splay 單步 amortized cost 公式 |
| O(n log n) | Φ(T) 最大值（rank 上界） |
| O(log n) | rank 的範圍（最小 1，最大 log n） |
| ⌊log(size)⌋ | rank 的具體定義 |

---

## 五、核心主旨

> Splay Tree 是 Sleator-Tarjan 1985 的 self-adjusting binary search tree；它透過每次操作後把被存取的 node 搬到 root 的 splay operation（zig / zig-zig / zig-zag 組合），讓 amortized cost 在 m 個操作中達到 O(m log n)。但 splay tree 的力量不止於 amortized O(log n)——透過設計適當的 potential function，它還能達到 static optimality（自動學習 access pattern）、entropy bound（Huffman 等級），是「不需要事先知道 request sequence 也能跑到 optimal BST 的 cost 範圍」的極少數實用資料結構之一。

---

## 六、金句摘錄

1. 「Splay trees are due to Sleator and Tarjan. I think it's 85.」

2. 「This is a comparison-based data structure that supports insert, find, and delete.」

3. 「After every operation we do some rebalancing. After each operation the tree adjusts itself — this is why splay trees are called self-adjusting data structures.」

4. 「At each step we can either walk to a child, walk to a parent, or do a rotation.」

5. 「The splay operation consists of three cases: zig, zig-zig, and zig-zag.」

6. 「The potential function is the sum over all nodes v of log of the size of the subtree rooted at v.」

7. 「The rank of x is floor log of the size of the subtree rooted at x.」

8. 「The amortized cost of one splay step is at most 3 times the rank drop of x plus some constant.」

9. 「Since x's rank drops by at least 1 each step, and total rank is log n, splaying a node takes O(log n) amortized time.」

10. 「Splay trees achieve the entropy bound — they adapt to the access pattern without knowing the future, beating even optimal static BSTs.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption，1568 cues）+ 繁體中文自動字幕（zh-Hant auto-caption，629 words）雙語交叉對照
- **Lecture 7 的 zh-Hant 字幕明顯短於 en 字幕**（YouTube 自動翻譯對此 lecture 翻譯不完整）
- **未使用 Whisper**：影片有完整 YouTube 自動字幕（en 完整、zh-Hant 部分覆蓋），無需 Whisper fallback
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **本筆記引用以 en 字幕為主**，zh-Hant 用於繁中關鍵概念對照
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture7_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（Splay Tree、zig-zig、potential function、amortized analysis 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 3 分 16 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture7_口播稿.txt

- [opus 0.7 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture7.opus)（Telegram 友善）
- [m4a 2.3 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture7.m4a)（iOS 友善）
- [mp3 2.9 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture7.mp3)（通用格式）
