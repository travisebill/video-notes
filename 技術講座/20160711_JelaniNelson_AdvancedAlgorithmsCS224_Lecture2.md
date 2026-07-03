# 【Harvard CS224 高階演算法 — Lecture 2：Fusion Trees 與 Word-RAM 下的靜態前驅問題】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 85分鐘**

---

> **影片連結**：https://youtu.be/3_o0-zPRQqw
> **影片時長**：85 分鐘（5139 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文手動字幕（en-j3PyPqV-e1s，1315 cues）— Harvard CS224 課程官方上傳

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms（高階演算法）」2014 年秋季學期（f14）的第二堂課，主講者為 Jelani Nelson 教授。本堂課聚焦在 **Fusion Tree**（Fredman-Willard, 1993），一個在 word RAM 模型下達到 O(log_w n) 的靜態前驅問題解法——比 vEB 樹更快、也比 BST 對 word RAM 更貼近理論下界。

課程流程分為三段：

- **開場修正**：教授先修正上課提到的 Van Emde Boas 樹用 hash table 取代 array 達 O(N) space 的論點，引用 CLRS Exercise 20-1 Part F——這個論證其實有「very subtle error」，最終的空間複雜度略差於 O(N)，將作為 P-set 問題。
- **Fusion Tree 主體**：靜態前驅問題的 word-RAM 解法；展示如何用 B = w^(1/5) 大小的內部節點搭出查詢 O(log_w n) 的 B-ary tree，搭配多項式時間的前處理。
- **歷史脈絡**：Anderson-Thorup 與 Raman 後續將其做成動態版本（deterministic / randomized update time）。

---

## 二、章節脈絡

### Section 1｜開場修正：Van Emde Boas 樹的空間錯處（00:00 ~ 07:00）

**重點摘要：** 教授承認上次授課關於 vEB 樹用 hash table 換 array 達 O(N) space 的論證有 subtle error，CLRS Exercise 20-1 Part F 也有同樣問題；真正的空間會略差於 O(N)，將作為 P-set 修正題。Y-Fast Trie 仍正確達到 O(N)。

**內容：**
- 教授：上次提到 vEB 樹用 hash table 取代 array 就能拿到 O(N) space，這其實是錯的
- 引用 CLRS Exercise 20-1 Part F，發現題目的「intended solution」其實也有 subtle error
- 真正的論證並非 O(N) space，而是略差；將作為 P-set 1 的一題
- 學生要找出哪句話錯並修正
- Y-Fast Trie 在使用 indirection 後確實得到 O(N) space（沒問題）

> 「The argument that we discussed in class that gets O of N space is not really O of N space. It's slightly worse.」

---

### Section 2｜前驅問題定義與歷史脈絡（07:00 ~ 15:00）

**重點摘要：** 重新定義靜態與動態前驅問題；介紹 Fusion Tree（Fredman-Willard, 1993）的靜態版本 O(log_w n) query，並簡介後續 Anderson-Thorup（Raman）的動態版本。

**內容：**
- 問題：在集合 S ⊆ {0, ..., U−1} 中查 predecessor
- 靜態：集合 S 不變；動態：支援 insert/delete
- Fusion Tree（Fredman-Willard, 1993）靜態版本：query time O(log_w n)
- Anderson-Thorup 後續：動態版本，update time O(log_w n + log log n)，deterministic
- Raman：update time O(log_w n)，expected randomized
- 本節只展示靜態版本

> 「Later, after their paper, it was made dynamic. So there was a paper by Anderson and Thorup.」

---

### Section 3｜為何需要 Bit-Level 技巧（15:00 ~ 35:00）

**重點摘要：** 說明 Fusion Tree 設計的核心挑戰——內部節點有 B = w^(1/5) 個 key 但無法放進一個 word，所以必須在每個節點只用常數時間找 subtree；定義四個核心 ingredients：multiplication、sketch compression、word-level parallelism、most significant bit。

**內容：**

**樹結構設定：**
- B = w^(1/5) keys per internal node
- 樹深度 = log_B(n) ≈ log_w(n) / 5 = log n / (5 log w)
- 關鍵約束：每個節點只能花常數時間，否則會被 K factor 抵消

**問題：**
- K 個 key 每個是 w bit → K 個 key 共 w^(6/5) bit
- 連一個節點都放不進一個 word（單 word = w bit），更別說要在常數時間處理
- 怎麼辦？

**四個核心 ingredients：**
1. **Multiplication** — 用乘法把多個 key 壓進一個 word
2. **Sketch compression** — 把 K 個 key 壓縮成一個 word 表示
3. **Word-level parallelism** — 同時比較所有 K 個 key
4. **Most significant bit subroutine** — 在 word-RAM 下找 MSB 要 O(log w)（binary search on bits）甚至 O(1)

**Most Significant Bit 在 word-RAM 下：**
- Naive：loop w 次 = O(w)
- Binary search：log w 次迭代 = O(log w)
- Word-RAM 加 trick：O(1)（教授說稍後展示）

> 「There's going to be a very basic subroutine we're going to need, which is the most significant set bit.」

---

### Section 4｜單節點搜尋的 Bit-Level 構造（35:00 ~ 70:00）

**重點摘要：** 詳細展示 fusion tree 單節點內部如何用乘法、sketch、word-level parallelism 在常數時間找出 query 應該往哪個 subtree。Multiplication lemma：存在常數 a 使得 K 個 w-bit 數字乘上 a 後，重要 bits 變成連續且無 gap。

**內容：**

**步驟 1：找 magic constant `a`**
- 由一個引理（professor 說留作業）：給定 K 個 w-bit 數字，存在常數 `a` 使得 `x_i · a` 之後，這些數字乘出來的前綴 important bits 變得 consecutive with no gaps
- 重要 bits 落在 branch bits（root w / root w-1 等）的位置

**步驟 2：用 multiplication 找重要 bits**
- 把每個 key 乘上 magic constant `a`
- 重要 bits 變成 consecutive：用 multiply + shift + mask 把「1, 0, 1, 1」這個 pattern 抽成一個 word
- 整個過程常數時間

**步驟 3：word-level parallel comparison**
- 把濃縮後的重要 bits 跟「0, 0, 0, 1, 0, 0, 1, 0, ...」vector 做平行比較
- 每個 1 是 root w 寬；vector 全部塞得進兩個 word
- 平行比較找出 first cluster with nonzero

**步驟 4：找 most significant bit**
- 找到 first cluster 的 index
- shift down 再做平行比較找出 MSB
- 整個節點搜尋 = 常數時間 word operations

> 「We know what the BI's are. So when the BI are i, root w plus root w minus 1, there is an M such that multiplying by M makes all the important bits consecutive with no gaps.」

---

### Section 5｜收尾與下週預告（70:00 ~ 85:00）

**重點摘要：** 教授確認 fusion tree 主體講完，學生提問關於 multiplication lemma 的細節；下週進入 hashing 主題。

**內容：**
- 教授：證明 multiplication lemma 的部分留作業（problem set）
- 學生追問「how do you form this vector」— 教授解釋從 E（每個 cluster 最深 element）算出來
- 下次進入 hashing 主題，會討論 load balancing、k-wise independence、dictionary problem、perfect hashing、linear probing

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Predecessor Problem** | 給定集合 S ⊆ {0, ..., U−1}，query x 回傳 S 中 ≤ x 的最大元素 |
| **Fusion Tree** | Fredman-Willard (1993)：word RAM 下達 O(log_w n) predecessor 時間的靜態資料結構 |
| **Static Predecessor** | 集合 S 不變的 predecessor 問題 |
| **Dynamic Predecessor** | 集合 S 支援 insert/delete 的 predecessor 問題 |
| **Word RAM Model** | CPU 暫存器 w bit，可 O(1) 做加、乘、AND、OR、shift、unbounded shift |
| **B = w^(1/5)** | Fusion Tree 每個 internal node 的 branching factor |
| **Sketch Compression** | 把 K 個 w-bit key 壓縮成一個 word 表示的技巧 |
| **Word-Level Parallelism** | 在單一 word operation 中同時處理 K 個 key 的技巧 |
| **Most Significant Set Bit** | 找出 word 中最高位元 1 的位置；word-RAM 下可達 O(1) |
| **Multiplication Lemma** | 存在 magic constant `a` 使得 K 個 w-bit 數字乘 `a` 後重要 bits 變 consecutive |
| **Branch Bits** | Fusion Tree 中用來決定走哪個 subtree 的位元 |
| **CLRS Exercise 20-1 Part F** | CLRS 課本中關於 vEB 用 hash table 換 array 達 O(N) space 的習題（其實有 subtle error） |
| **Anderson-Thorup** | 把 Fusion Tree 做成 dynamic 的後續工作；deterministic update O(log_w n + log log n) |
| **Raman** | 把 Fusion Tree 做成 dynamic；randomized update O(log_w n) expected |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 85 分鐘（5139 秒） | 影片總長度 |
| 1315 cues | 英文手動字幕數量 |
| 47,629 字元 | 英文逐字稿字元數（清理後） |
| B = w^(1/5) | Fusion Tree 內部節點的 branching factor |
| w^(6/5) bit | K 個 key 在節點內的總 bit 數（超過單 word） |
| O(log_w n) | Fusion Tree 靜態 predecessor query 時間 |
| O(log_w n + log log n) | Anderson-Thorup 動態 update 時間（deterministic） |
| O(log_w n) | Raman 動態 update 時間（expected randomized） |
| 1993 | Fredman-Willard Fusion Tree 論文年代 |
| 4 個 | 課程 problem set 數量（lecture 1 提到） |
| 1 個 | project 數量 |

---

## 五、核心主旨

> Fusion Tree 把 word-RAM 模型從比較模型的 Ω(log n) 下界推進到 Ω(log w / log log w) 的 cell-probe 下界附近：透過 B = w^(1/5) 的 B-ary tree、multiplication lemma 把 K 個 key 的重要 bits 變 consecutive、word-level parallelism 做平行比較，整個單節點搜尋只需要常數時間 word operations——這是 word-RAM 模型從「比較」走到「位元操作」的關鍵範例，也是後續 word-RAM 演算法（fusion node、vEB 變體、word-RAM priority queue）的設計原型。

---

## 六、金句摘錄

1. 「The argument that we discussed in class that gets O of N space is not really O of N space. It's slightly worse.」

2. 「There's going to be a very basic subroutine we're going to need, which is the most significant set bit.」

3. 「We can't even fit it in a single machine word so how can we process it in constant time?」

4. 「We have to develop some techniques to get around that.」

5. 「How do we search a single fusion tree node in constant time? That's the basic issue.」

6. 「There's an M such that multiplying by M makes all the important bits consecutive with no gaps.」

7. 「You do a parallel comparison between this 1, 0, 1, 1, and the set of words 0, 0, 0, 1, 0, 0, 1, ...」

8. 「You can use the Word-RAM to find the most significant bit in constant time.」

9. 「There's a version of fusion trees which avoids multiplication, which came later. But I'm not going to present that.」

10. 「Polynomial time preprocessing is allowed in the static setting.」

---

## 七、備註

- **字幕來源**：YouTube 英文手動字幕（en-j3PyPqV-e1s，1315 cues）— Harvard CS224 課程官方上傳
- **無自動字幕**：YouTube 對本影片無任何 auto-caption（無 en/zh-Hant auto-cap），所以手動字幕是唯一選擇
- **zh-Hant 字幕補抓失敗**：嘗試抓 zh-Hant auto-caption 時遇到 HTTP 429 Too Many Requests（YouTube rate limit）
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **英文逐字稿字數**：47,629 字元（清理 VTT 時間碼、HTML 標籤後）
- **未使用 Whisper**：影片有完整手動字幕，無需 Whisper fallback
- **本筆記引用以 en 字幕為主**
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture2_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（Fusion Tree、word RAM、van Emde Boas、Y-Fast Trie 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 52 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture2_口播稿.txt

- [opus 2.4 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture2.opus)（Telegram 友善）
- [m4a 4.6 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture2.m4a)（iOS 友善）
- [mp3 4.5 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture2.mp3)（通用格式）