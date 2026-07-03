# 【Harvard CS224 高階演算法 — Lecture 8：Online Algorithms、Move-to-Front、Paging】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 84分鐘**

---

> **影片連結**：https://youtu.be/aHW6HKVC-SY
> **影片時長**：84 分鐘（5046 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms」2014 年秋季學期（f14）的第八堂課。本堂課的主題是 **Online Algorithms**——面對未知的未來，要如何做決定才能讓「後悔（regret）」不累積？這個概念由 Sleator 與 Tarjan 在 1985 年提出（同一年提出 splay tree，但不同的論文），名為 **Competitive Analysis（競爭式分析）**：把 online algorithm 與知道未來的 optimal offline algorithm 比較，以倍率衡量 regret。

課程設計的重點：

- **Online vs Offline**：offline 看得見整個 request sequence；online 只看得到當下的 request
- **競爭比率 r**：algorithm A 在所有 sequence σ 上的 cost ≤ r × OPT(σ) + constant
- **應用**：投資組合管理（這一年市場不好，不能怪你沒賺到）、paging（cache 替換）、move-to-front list、ski rental
- **三個 Toy Example**：ski rental、move-to-front、paging
- **最壞情況 deterministic 下界**：對 paging 證明沒有 online algorithm 比 K-competitive 更好
- **下堂課預告**：randomized online algorithm（如 Mark algorithm）可以超越 deterministic lower bound

---

## 二、章節脈絡

### Section 1｜Online Algorithms 的動機與競爭式分析定義

**重點摘要：** 教授以投資組合管理比喻引入 online 問題：不只跟「去年賺最多的人」比，而是跟「今年能賺最多的人」比——也就是 OPT。Competitive analysis 就是 ONLINE vs OPT 的 cost 比。

**內容：**
- Online algorithm 在每個 request 來時必須立即做決定，不知道未來
- 投資比喻：如果這一年市場很差，即使你比去年賺少了，你還是 competitive with OPT
- Formal 定義：對所有 sequence σ，cost(A, σ) ≤ r × cost(OPT, σ) + c
- 這個 r 是 competitive ratio，「plus a constant」讓 additive 起始成本不會破壞 ratio
- Competitive analysis 概念由 Sleator-Tarjan 1985 提出（同年的不同論文）

> 「If you made less than the previous year, the boss might fire you — but if this year was a bad year for everyone, you can appeal to competitive analysis.」

### Section 2｜Toy Example 1：Ski Rental Problem

**重點摘要：** 經典 online problem：每天租雪具 $1，買雪具 $B；但不知道會去滑雪幾天。最簡單的 2-competitive 演算法是「看到第 B 天就買」。

**內容：**
- **問題設定**：每天 ski rental cost $1，買雪具 cost $B（B 已知），不知 m（天數）
- **演算法**：前 B 天都租，租到第 B 天就買。Cost = B + (m − B) × B（之後都 own）
- **為什麼 2-competitive**：
  - Case m ≤ B：OPT 也得租滿 m 天，cost = m。Online 租 m 天，cost = m。ratio = 1
  - Case m > B：OPT 在某天買（第 k 天後），cost = k + (m − k) × B；最便宜是第一天就買，cost = B。Online cost = B + (m − B) × B。ratio 最多 2
- 這是 online 算法第一個 toy example；下堂課會用 linear programming 重新描述達到 e/(e−1) randomized ratio

### Section 3｜Toy Example 2：Move-to-Front List

**重點摘要：** List 中的 item 由 access pattern 動態調整——每次 access 把 item 移到 list front。第一次接觸時隨機排序，之後發現 access hot spot。

**內容：**
- **問題設定**：有 list L；支援 access(L, x) 與 reorder(x, y)。Cost 是 access 路徑長度
- **Move-to-Front Algorithm**：每次 access x，把 x 搬到 list front
- **Competitive vs OPT**：OPT 可以任意 reorder（offline 知道整個 sequence）
- **靜態分析**：對 fixed sequence σ，MTF cost ≤ 2 × OPT(σ) + O(n)
- **直觀**：MTF 把 hot items 推到前面，OPT 也只能這樣做——但 OPT 是 offline 才知道哪些 hot，MTF 是 online 自然學到
- 這個結果在 1985 年原始論文中證明

### Section 4｜Toy Example 3：Paging Problem 的設定

**重點摘要：** Cache size K，最多存 K 個 pages；當需 access 不在 cache 的 page 時就是 cache miss，必須 evict 一個。問：怎麼 evict 才能 minimize misses？

**內容：**
- **問題設定**：cache size K，可存 K 個 pages；total 有 N ≥ K 個 pages 存在磁碟
- **Access request**：每次要一個 page p；若 p ∈ cache（cache hit），cost 0；否則 cache miss，cost 1，需 evict 一個 page 才能放 p 進來
- **OPT**：offline 知道未來；standard 結果 OPT cost ≤ (# of distinct pages accessed − K) 等級
- **Online 必須：每次 cache miss 就要選一個 victim evict**
- 這就是「線上 eviction policy」問題

### Section 5｜Deterministic Paging 的演算法：FIFO / LRU / LFU

**重點摘要：** 在 K-cache 下，常見 deterministic paging policies 包括 FIFO（先進先出）、LRU（最近最少使用）、LFU（最不常用）。LRU 達到 K-competitive。

**內容：**

**FIFO (First-In-First-Out)：**
- Evict 最早進入 cache 的 page
- 達 K-competitive（簡單易分析）

**LRU (Least Recently Used)：**
- Evict 最久沒被使用的 page
- 達 K-competitive，且是「最直觀的 hot spot」policy

**LFU (Least Frequently Used)：**
- Evict 歷史 access 次數最少的 page
- 比 LRU 略弱（可能誤判）

**為什麼是 K-competitive：**
- 把 access sequence 切成 phase——每次遇到「過去 K 個 distinct pages 都在 cache」時開新 phase
- 證明 LRU 在每 phase ≤ K 個 misses，OPT ≥ (|# 個 new pages| − K) 等級
- 細節留給下堂課，但 LRU 是 K-competitive

### Section 6｜Deterministic Paging Lower Bound：Ω(K)

**重點摘要：** 證明對任何 deterministic online paging algorithm，存在 adversarial sequence σ 使其 cost = K × OPT cost，因此 Ω(K) 是 lower bound。

**內容：**

**Adversarial Sequence：**
- Adversary 構造 sequence：每次請 online algorithm 必須 evict 一個 page，下一個 request 就是剛剛被 evict 的 page
- 因為有 K+1 個 pages 在 sequence 中，每次 online evict 一個，下次一定 miss
- Online cost = sequence length；OPT 知道未來，可以預先放對 pages

**結論：**
- 任何 deterministic online 不能比 K-competitive 更好
- LRU 與 FIFO 已經達到這個 bound
- 但這就結束了嗎？下堂課回答 randomize 是否能突破 K bound

> 「LRU is K-competitive, and no deterministic online algorithm can beat that. But randomized might — that's next time.」

### Section 7｜下堂課預告與問題收尾

**重點摘要：** 學生問 mark algorithm 為何是 randomised paging 的 2 H_K-competitive，下堂課用 phase analysis 完整證明。

**內容：**
- Open questions：FIFO 是不是真的 K-competitive（hint：yes，透過 phase 分析）
- 學生關切 timestamp 在不同 cache 間同步問題（FIFO 不需要，marking 需要）
- 學生問 randomize 演算法是否能避免 K bound——下堂課用 Mark 達 2 H_K

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Online Algorithm** | 每次 request 時必須立即做決定，不知道未來的演算法 |
| **Offline Algorithm / OPT** | 事先知道整個 request sequence，能做到最佳的演算法 |
| **Competitive Ratio r** | Online A 在所有 σ 上的 cost ≤ r × OPT(σ) + c 的最小 r |
| **Competitive Analysis** | 比較 online algorithm 與 offline OPT 的分析框架，由 Sleator-Tarjan 1985 提出 |
| **Ski Rental Problem** | 經典 online toy example：每天租 $1、買 $B、不知 m（天數） |
| **Move-to-Front List** | 每次 access 把 item 移到 list front 的 list 結構；MTF 達 2-competitive |
| **Paging Problem** | Cache size K；eviction policy 決定 evict 哪個 page |
| **Cache Hit** | Request page 已在 cache（cost 0） |
| **Cache Miss** | Request page 不在 cache（cost 1，需 evict） |
| **FIFO** | First-In-First-Out；evict 最早進入 cache 的 page |
| **LRU** | Least Recently Used；evict 最久沒被使用的 page（K-competitive） |
| **LFU** | Least Frequently Used；evict 歷史 access 最少的 page |
| **Phase** | 在 paging 分析中，把 sequence 切成段的技巧 |
| **Adversarial Lower Bound** | 證明任何 online algorithm 必有某 sequence σ 達到某 ratio 的技術 |
| **Ω(K) Lower Bound** | 對 paging 來說，沒有 deterministic online 能比 K-competitive 更好 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 84 分鐘（5046 秒） | 影片總長度 |
| 8747 words | 英文逐字稿字數 |
| 1376 words | 繁中逐字稿字數 |
| 1985 | Online algorithms 與 splay tree 兩篇論文同一年由 Sleator-Tarjan 提出 |
| K | Cache size，也是 deterministic competitive ratio 的 lower bound |
| 2 | Move-to-Front List 的 competitive ratio |
| 2 | Ski Rental 簡單演算法的 competitive ratio |
| 2 H_K | 下堂課將提到的 randomized paging 的 competitive ratio（H_K 是 harmonic number） |
| O(n) | Move-to-Front 的 additive term（cache list 大小） |

---

## 五、核心主旨

> Online Algorithms 處理「未知的未來」情境——不只要跟去年比，還要跟「今年能賺最多的人」比，這就是 competitive analysis 的本質（online A 與 offline OPT 的 cost 比率）。本堂課介紹三個 toy example：ski rental（每天租 vs 買；2-competitive with 第 B 天買策略）、move-to-front list（access 時搬到 front；2-competitive）、paging（cache miss 時要 evict）。對 paging 來說，LRU 與 FIFO 都是 K-competitive，且對 deterministic online 不能比 K-competitive 更好（adversarial lower bound）；但這就結束了嗎？randomized online algorithm 是否能突破 K bound？下堂課以 Mark algorithm 達到 2 H_K-competitive 回答這個問題。

---

## 六、金句摘錄

1. 「We run algorithm A and OPT is an algorithm making the best decisions while knowing the future.」

2. 「r-competitive means that for all request sequences σ, the cost using A is at most r times OPT's cost plus a constant.」

3. 「Competitive analysis was introduced by Sleator and Tarjan — totally different paper than splay trees but the same year.」

4. 「In ski rental, the simplest 2-competitive algorithm is: rent until day B, then buy.」

5. 「Move-to-front list: access x, then put x at the front; 2-competitive with OPT plus O(n) overhead.」

6. 「LRU evicts the least recently used page; this is K-competitive where K is the cache size.」

7. 「For paging, no deterministic online algorithm can beat K-competitive; this follows from an adversarial argument.」

8. 「Adversary constructs a sequence so that every page you evict becomes the next request — forcing K misses per OPT page.」

9. 「LRU is K-competitive and we have a tight Ω(K) lower bound for deterministic online.」

10. 「But wait — can randomized online break this K barrier? That's the question for next time.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption，1376 words）雙語交叉對照
- **未使用 Whisper**：影片有完整 YouTube 自動字幕，無需 Whisper fallback
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **本筆記引用以 en 字幕為主**，zh-Hant 用於繁中關鍵概念對照
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture8_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（Competitive Analysis、Move-to-Front、Paging、Cache Miss、Harmonic Number 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 3 分 8 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture8_口播稿.txt

- [opus 0.7 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture8.opus)（Telegram 友善）
- [m4a 2.2 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture8.m4a)（iOS 友善）
- [mp3 2.8 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture8.mp3)（通用格式）
