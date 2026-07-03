# 【Harvard CS224 高階演算法 — Lecture 23：Link-Cut Trees 平攤分析與 Min-Cost Max-Flow】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 87分鐘**

---

> **影片連結**：https://youtu.be/nDLe6_sPSfs
> **影片時長**：87 分鐘（5206 秒）
> **整理日期**：2016-07-11
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption，約 3,000 cues）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms（高階演算法）」的 Lecture 23，本講是 Link-Cut Trees 平攤分析的收尾，並把 flow 演算法從純 max flow 推進到有成本成本的版本，引入最小成本最大流（min-cost max-flow）與最小成本循環（min-cost circulation）。前半段繼續 LCT 的 amortized 分析，證明 access 的 PCC（preferred child changes）總和是 O(m log n)，得出 O(log² n) 平攤成本；後半段介紹殘餘圖中的負成本循環演算法，以及 successive shortest paths 的思路。

課程設計的重點：

- **Link-Cut Trees 完整分析**：從 access、PCC 計數，到 heavy-light decomposition 作為分析工具
- **Min-Cost Max-Flow**：在有成本的一般圖上找最大流量且成本最低的流
- **Min-Cost Circulation**：無源匯的循環流，所有頂點 inflow 等於 outflow
- **歸約**：MCMF 與 MCC 可互相歸約，只需解決一個問題

---

## 二、章節脈絡

### Section 1｜課程行政與 Pset 7 勘誤（00:00 ~ 04:00）

**重點摘要：** 教授為 Pset 7 第二題的舊論文錯誤致歉，並說明 Pset 8 的問題分配。

**內容：**
- Pset 7 第二題引用了一篇舊論文，其中漏寫了 m 因子，教授已修正並補進 Pset 8
- Pset 8 問題一：繼續 LCT 分析，從 O(log² n) 改進到 O(log n)
- Pset 8 問題二：用 scaling 處理任意容量的 min-cost circulation
- Pset 8 問題三：min-cost max-flow 相關應用
- 課程還剩三講，本週結束 flow，之後介紹 streaming

---

### Section 2｜Link-Cut Trees 的 access 與 PCC（04:00 ~ 25:00）

**重點摘要：** 複習 LCT 的 access 操作與 splay，並引入 PCC（preferred child changes）作為平攤分析的計數單位。

**內容：**

**access 操作的實作：**
- 對頂點 v 反覆做 splay，把 v 推到 auxiliary tree 的 root
- 每次 splay 後更新 preferred path，把 v 接到其 path parent
- 再 splay 一次確保 v 是當前 root
- access 完成後 v 沒有 preferred child

**cut 與 link 操作：**
- cut(v)：先 access(v)，再斷開 v 的 right child，v.parent 設為 None
- link(v, w)：先 access(v) 和 access(w)，把 v 當作 w 的 left child
- 兩個操作都需要 O(log n) 期望時間

**access 的成本分解：**
- access 的運行時間正比於 1 加上 PCC（preferred child changes 數）
- 對 m 個操作，總成本 = O(splay 最壞情況 × m) + 總 PCC
- 總 PCC 已知是 O(m log n)（splay 平攤分析）
- 但用 splay 的 worst-case 乘 PCC 是鬆的，緊的分析要把平攤成本算進去

> 「The runtime of access is proportional to 1 plus the number of preferred child changes.」

---

### Section 3｜Heavy-Light 分解與 PCC 界定（25:00 ~ 45:00）

**重點摘要：** 引入 heavy-light decomposition 作為分析工具，證明 light edge 上的 preferred 改變是常數次，從而 PCC = O(m log n)。

**內容：**

**Heavy-Light 定義：**
- 對頂點 v 定義 size(v) 為其在 represented tree 的子樹大小
- 邊 (u,v) 為 heavy：若 size(u) ≥ size(v) / 2（即 u 的子樹至少一半）
- 邊 (u,v) 為 light：若 size(u) < size(v) / 2
- Heavy-light 分解純粹作為分析工具，不在資料結構中維護

**PCC 的兩個維度：**
- 每個邊可以是 light 或 heavy（heavy-light 維度）
- 同時也可以是 preferred 或 not preferred（preferred 維度）
- access 操作時可能銷毀某些 preferred edge，建立新的

**PCC = O(m log n) 的證明：**
- 一條邊從 light 變 heavy 後，再變回 light 會使子樹大小加倍
- 所以 light 邊上的 preferred 改變是常數次
- Heavy 邊上的 preferred 改變總和也是 O(log n) per 邊
- 總 PCC = O(m log n)

> 「For light edges, the number of preferred child changes is constant.」

---

### Section 4｜Min-Cost Max-Flow 問題定義（45:00 ~ 65:00）

**重點摘要：** 把 flow 問題從純容量擴展到有成本的情況，引入 MCC（min-cost circulation）並證明與 MCMF 等價。

**內容：**

**Min-Cost Max-Flow：**
- 輸入：有容量與成本的圖，找從 s 到 t 流量最大的最低成本流
- 殘餘圖：正向邊保留剩餘容量與原始成本，反向邊帶負成本
- 反向邊帶負成本的意義：可以撤回流量，回收成本

**Min-Cost Circulation：**
- 定義：流 f 使每個頂點 inflow = outflow，無源匯
- 等價性：MCMF 與 MCC 可互相歸約
- MCMF → MCC：加不連接的 s 與 t，max flow 為零的特例就是 MCC
- MCC → MCMF：通過 max flow 找出 s-t 路徑，把 MCC 嵌入 MCMF

**反向邊的負成本：**
- 若原始邊成本為 c，殘餘圖中正向邊成本仍為 c（剩餘容量）
- 反向邊成本為 -c（撤回流量可回收成本）

> 「Min-cost max flow and min-cost circulation efficiently reduce to each other.」

---

### Section 5｜殘餘圖的負成本循環演算法（65:00 ~ 80:00）

**重點摘要：** 介紹解 MCC 的直覺演算法——反覆尋找殘餘圖中的負成本循環並沿其擴充；分析正確性與複雜度。

**內容：**

**演算法：**
- 重複：找殘餘圖中的負成本循環，沿其擴充
- 直到殘餘圖中無負成本循環為止

**找負成本循環：**
- Bellman-Ford：O(mn) 時間，可偵測負循環
- Goldberg 1995 scaling：O(m√n log C) 時間（成本範圍 [-C, C]）

**正確性：**
- 若當前循環 f 不是最優 f*，則 f* - f 是負成本循環
- 因為兩個循環相減仍是循環
- 任何循環可分解為 m 個循環，其中至少一個為負

**複雜度：**
- 每次擴充至少減少成本一單位
- 總迭代次數 ≤ mC（C 為最大成本絕對值）

> 「If f* is strictly better than f, then f* - f is a negative cost circulation in the residual graph.」

---

### Section 6｜Successive Shortest Paths 與結論（80:00 ~ 87:00）

**重點摘要：** 教授簡介另一條思路——successive shortest paths，並用 reduced cost 證明其正確性。

**內容：**

**Successive Shortest Paths：**
- 重複：在殘餘圖中找最短成本 s-t 路徑，沿其擴充
- 對單位容量圖，這個演算法是強多項式時間

**Reduced Cost 分析：**
- 對最短路徑上的邊 uv：dist(v) = dist(u) + cost(uv)，所以 reduced cost = 0
- 沿 reduced cost 為 0 的邊擴充時，反向邊的 reduced cost 也是 0
- 因此永遠不會引入負 reduced cost 的邊
- 從而避免負循環

**一般容量：**
- 對一般容量圖需加 scaling 技巧
- 空間複雜度加入 O(log u) 的相依性（u 為最大容量）

> 「We'll never have negative reduced costs in the residual graph.」

**本講小結：**
- 完成了 LCT 的平攤分析：PCC = O(m log n)，access = O(log² n) amortized
- 把 flow 演算法從純 max flow 推進到 min-cost 版本
- 兩個關鍵演算法：負成本循環法 與 successive shortest paths

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Link-Cut Trees (LCT)** | 動態森林資料結構，支援 link、cut、path query 等操作 |
| **Access 操作** | 把頂點 v 推到其 auxiliary tree 的 root，並更新 preferred path |
| **PCC** | Preferred Child Changes，access 中 preferred child 改變的次數 |
| **Heavy-Light Decomposition** | 將樹邊分成 heavy（子樹 ≥ 1/2）與 light（< 1/2）的分解；純分析工具 |
| **Heavy Edge** | 子節點的子樹大小至少為父節點一半的邊 |
| **Light Edge** | 子節點的子樹大小不到父節點一半的邊 |
| **Preferred Edge** | 代表 preferred path 中父子關係的邊 |
| **Min-Cost Max-Flow** | 在有容量與成本的圖上找從 s 到 t 流量最大且成本最低的流 |
| **Min-Cost Circulation (MCC)** | 無源匯的循環流，每頂點 inflow = outflow，且總成本最低 |
| **Residual Graph** | 殘餘圖，正向邊保留剩餘容量，反向邊帶負成本 |
| **Negative Cost Cycle** | 殘餘圖中總成本為負的循環；可用 Bellman-Ford 偵測 |
| **Reduced Cost** | cost(uv) + dist(u) - dist(v)；最短路徑上的邊 reduced cost = 0 |
| **Successive Shortest Paths** | 反覆在殘餘圖中找最短成本路徑並擴充的演算法 |
| **Strongly Polynomial** | 時間複雜度只與圖大小有關，與成本絕對值無關 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 87 分鐘（5206 秒） | 影片總長度 |
| 約 3,000 cues | 英文自動字幕數量 |
| O(log² n) | LCT access 的 amortized 時間（用一般 balanced BST） |
| O(log n) | LCT access 的 amortized 時間（用 splay + access lemma） |
| O(m log n) | PCC 在 m 個操作內的總和 |
| O(mC) | 負成本循環法的迭代次數 |
| O(mn) | Bellman-Ford 找負循環時間 |
| O(m√n log C) | Goldberg scaling 找負循環時間 |
| O(m × C choose n/2) | TSP 指數型 divide-and-conquer 的時間 |

---

## 五、核心主旨

> 本講完成 Link-Cut Trees 的平攤分析：access 的成本正比於 1 + PCC，而 PCC = O(m log n)，總 amortized 時間為 O(log² n)（或用 splay 加 access lemma 改進到 O(log n)）。後半段把 flow 演算法從純 max flow 推進到 min-cost max-flow，引入殘餘圖中的負成本循環法與 successive shortest paths 兩種思路，並用 reduced cost 證明後者永遠不會引入負循環。Link-Cut Trees 展示了 amortized analysis 在動態資料結構中的威力，min-cost flow 展示了同一個演算法（殘餘圖 + 擴充）如何從純容量擴展到有成本的版本。

---

## 六、金句摘錄

1. 「The runtime of access is proportional to 1 plus the number of preferred child changes, which we call PCC.」

2. 「The total number of preferred child changes across m operations is at most O(m log n).」

3. 「For light edges, the number of preferred child changes is constant, since going from light to heavy doubles the subtree size.」

4. 「Min-cost max flow and min-cost circulation efficiently reduce to each other.」

5. 「If f* is strictly better than f, then f* - f is a negative cost circulation in the residual graph.」

6. 「Any circulation decomposes into m cycles, and if the total is negative, at least one cycle is negative.」

7. 「We'll never have negative reduced costs in the residual graph, since edges on shortest paths have reduced cost zero.」

8. 「The key insight is that Bellman-Ford finds negative cycles in O(mn), while Goldberg's scaling does it in O(m√n log C).」

9. 「For unit capacity graphs, successive shortest paths is strongly polynomial; for general capacities we need scaling.」

10. 「When the runtime says O(m log² n), the log² comes from the depth of recursion plus the access cost.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption，約 3,000 cues）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照
- **未使用 Whisper**：影片有完整 YouTube 自動字幕（zh-Hant 與 en），無需 Whisper fallback
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **英文逐字稿字數**：43,999 字元（清理 VTT 時間碼、HTML 標籤後）
- **自動字幕品質**：zh-Hant 為 en 的機器翻譯版本；en 字幕對技術術語（access、preferred path、residual graph、reduced cost 等）保留更精確
- **本筆記引用以 en 字幕為主，zh-Hant 用於中文關鍵概念對照**
- **TTS 口播稿另見**：`transcripts/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture23_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（access、preferred path、residual graph、reduced cost 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 3 分 53 秒
> 口播稿原文：transcripts/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture23_口播稿.txt

- [opus 1.8 MB](../audio/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture23.opus)（Telegram 友善）
- [m4a 3.7 MB](../audio/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture23.m4a)（iOS 友善）
- [mp3 3.6 MB](../audio/20160712_JelaniNelson_AdvancedAlgorithmsCS224_Lecture23.mp3)（通用格式）