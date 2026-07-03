# 【Harvard CS224 高階演算法 — Lecture 3：Hashing 基礎、K-wise 獨立性與線性探測分析】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 88分鐘**

---

> **影片連結**：https://youtu.be/WqBc0ZCU4Uw
> **影片時長**：88 分鐘（5326 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文手動字幕（en-j3PyPqV-e1s，1165 cues）— Harvard CS224 課程官方上傳

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms」2014 年秋季學期（f14）的第三堂課，主講者為 Jelani Nelson 教授。本堂課正式開啟 **hashing** 主題——從 word-RAM 模型下的 hash function 開始，建立 k-wise independence 的概念工具，並應用到 load balancing、perfect hashing、linear probing 的分析上。

課程設計的邏輯順序：

- **基本概念**：hash function、collision、family H
- **應用**：dictionary problem、retrieval problem、membership problem
- **k-wise independence**：為何較弱的條件就足夠、為何 polynomial hash family 比 fully random 更好用
- **Linear probing 分析**：從 7-wise 到 5-wise，引入 moment method
- **延伸預告**：cuckoo hashing、Bloomier filters、Bloom filters

---

## 二、章節脈絡

### Section 1｜Hashing 與四大問題定義（00:00 ~ 15:00）

**重點摘要：** 教授從 word-RAM 模型出發，定義 hash family H：把 universe U 映射到 {0, ..., m-1}；定義 dictionary / retrieval / membership problem 的差別；最後預告會用 perfect hashing、linear probing、cuckoo hashing、Bloomier filters 解這些問題。

**內容：**
- Word-RAM 模型下 hash function h: U → {0, ..., m-1}
- 集合 S ⊆ U，|S| = n，選 h ∈ H 讓它在 S 上「behave nicely」
- Dictionary problem：key + value，可 insert/delete；空間可用 n 個 word
- Retrieval problem：每個 element 有一個 r-bit string associate；可用 n·r bit
- Membership problem：只問在不在 S 中；只允許 false positive，空間 n bit
- Perfect hashing、linear probing、cuckoo hashing、Bloomier filters 是這次會談的工具

> 「We have some hash function H, which sends them into let's think of it as say an array of size m.」

---

### Section 2｜應用：Load Balancing 與 K-wise Independence（15:00 ~ 45:00）

**重點摘要：** 用 load balancing 作為 running example 介紹 k-wise independence：把 n 個 item hash 到 n 個 machine（machine t 期望負載 ~ log n / log log n）；證明過程中其實只需要 k-wise independence 而不是 full independence；定義 k-wise independent hash family 並展示 polynomial 構造。

**內容：**

**Load balancing 設定：**
- n 個 job、n 個 machine、hash h: U → {0, ..., n-1}
- Machine t 的最大負載 = max over t 的 #{i: h(i) = t}
- 期望最大值 = O(log n / log log n)

**Proof 用到的關鍵性質：**
- E[max_t load_t] = E[max_t Σ_i 1_{h(i)=t}]
- 用「機率所有 machine 都 load 至少 k」轉成 E[Π_i X_i]（X_i 為 indicator）
- 證明過程中只需要任意 k 個 i 的 hash 值互相獨立
- 不需要所有 n 個 hash 值都互相獨立

**K-wise Independence 定義：**
- 隨機變數 X_1, ..., X_n 是 k-wise independent：對任意 k 個 index i_1, ..., i_k，X_{i_1}, ..., X_{i_k} 互相獨立
- Hash family H 是 k-wise independent：對任意 k 個 universe 值 x_1, ..., x_k，h(x_1), ..., h(x_k) 互相獨立

**Polynomial hash family 範例：**
- u = m = p（prime）
- h(x) = Σ_{i=0}^{k-1} a_i x^i mod p
- 只需 k 個係數 a_i，存一個 h 只需 k log p bit（而非 u log m bit）
- Polynomial interpolation 保證 k-wise independence

> 「K-wise independence is a weaker property than saying, if you look at all n items, they behave independently.」

---

### Section 3｜其他 Hash Family 與 Multiply-Shift Hashing（45:00 ~ 60:00）

**重點摘要：** 簡介其他 k-wise independent hash family；特別推薦 tabulation hashing（Thorup-FOCS 2013）跟 multiply-shift hashing（Dietzfelbinger），兩者都用 bit shift 而非 mod，速度更快。預告近期 FOCS 上會有 sequential evaluation 的 k-wise family。

**內容：**
- Thorup-FOCS 2013：用 tabulation 構造快速 k-wise independent family
- Dietzfelbinger 等：multiply-shift hashing — pairwise independent，用 bit shift 而不用 mod
- 即將在 FOCS 2014 發表的 paper：sequential evaluation 時 k-wise 評估可達 O(1)
- Trade-off：需要依序評估 h(1), h(2), h(3)，不適用於所有應用

> 「You can be very fast with multiply shift hashing.」

---

### Section 4｜Perfect Hashing 簡介（60:00 ~ 75:00）

**重點摘要：** 快速複習 Perfect Hashing——用兩階段 hashing：第一階段把 n 個 item hash 到 n 個 bucket，第二階段每個 bucket 用 secondary hash function 達到零碰撞。展示 secondary hash function 的選擇與空間分析。

**內容：**
- 第一階段：h_1 把 n 個 item hash 到 m = n 個 bucket
- Bucket i 的期望 size = O(log n / log log n)，使用 Chernoff bound
- 第二階段：每個 bucket i 選 secondary hash function h_i 把 bucket 內的 items hash 到 s_i² 大小的 array（s_i = bucket size）
- Total space = Σ_i O(s_i²) = O(n) expected
- Query：先 h_1 找 bucket，再用 h_i 找位置
- 缺點：靜態、需要知道所有 item、空間有 overhead

---

### Section 5｜Linear Probing 分析：Lemma 與 Moment Method（75:00 ~ 88:00）

**重點摘要：** 證明 linear probing 在 7-wise（甚至 5-wise）獨立下達到 expected O(1) query/update time。核心 lemma：query 進行 k 個 probes ⟹ h(x) 在至少 k 個 length-K 的 full interval 中。證明技巧：Markov's inequality 加 6th moment → O(1/k³) probability → sum converges。

**內容：**

**核心 Lemma：**
- 若 query on x 進行 k 個 probes，則 h(x) 至少在 k 個 length-K 的 full interval 中
- Proof sketch：每個 probe 都對應一段被佔用的 cell；這些 cell 都 hash 到某個 window；window 內的元素數量 ≥ window 長度 = full

**期望 query time 上界：**
- E[query time] ≤ Σ_{K=1}^{∞} K · max over length-K intervals of Pr[I is full]
- 需要 Pr[I is full] = O(1/K³) 才能讓 Σ K · 1/K³ = O(1) 收斂
- 用 Markov：Pr[L_I - E[L_I] ≥ E[L_I]] ≤ E[(L_I - E[L_I])⁶] / E[L_I]⁶
- 因為 h 是 6-wise independent，E[(L_I - E[L_I])⁶] 可以 bound
- 結果：Pr[I is full] ≤ O(1/K³) → query time O(1) expected

**為何 5-wise 而非 7-wise 也能 work：**
- Patrascu 解釋：「when you condition on one element where it lands, everything else is four-wise」
- 下一堂課會展示 5-wise 的 proof

**Moment Method：**
- 取變數的高次方再 Markov bound
- 直覺：對 concentrated 變數取大冪次不傷；對 spread out 變數取大冪次會爆掉
- 可用來 prove Chernoff bound

> 「The reason five comes about—actually, when I saw this, I asked Patrascu why five-wise. And he said, well, when you condition on one element where it lands, everything else is four-wise.」

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Hash Family H** | 一族從 universe U 到 {0, ..., m-1} 的函數；可隨機選一個 h ∈ H |
| **Dictionary Problem** | Key-value 結構，支援 insert/delete；空間 n 個 word |
| **Retrieval Problem** | 每個 element 有 r-bit string，query 回 string；空間 n·r bit |
| **Membership Problem** | 只問在不在 S 中；允許 false positive；空間 n bit |
| **K-wise Independence** | 隨機變數/Hash family 對任意 k 個 index/value 互相獨立 |
| **Polynomial Hash Family** | h(x) = Σ a_i x^i mod p；k-wise independent；存 h 只需 k log p bit |
| **Perfect Hashing** | 兩階段 hashing；secondary hash 達零碰撞；空間 O(n) expected |
| **Linear Probing** | Hash 衝突時往後找下一個空 cell；hash + 衝突處理一體 |
| **Full Interval** | Interval I of length K 內 hash 進來的 item 數 ≥ K |
| **Moment Method** | 用高次方 + Markov bound 證 concentration；可推 Chernoff |
| **Multiply-Shift Hashing** | Dietzfelbinger 構造：pairwise independent，用 multiply + shift，不用 mod |
| **Tabulation Hashing** | Thorup-FOCS 2013：用 lookup table 構造快速 k-wise family |
| **Chernoff Bound** | n 個 independent Bernoulli 的和集中在 mean 附近 |
| **Cuckoo Hashing** | 兩個 hash function；insert 衝突時 kick out，cycle > 10 log n 就 rebuild |
| **Bloomier Filters** | Retrieval problem 解法；用 cuckoo hash table + XOR 填值 |
| **Bloom Filters** | Membership problem 解法；log(1/ε) 個 bit array + k 個 hash |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 88 分鐘（5326 秒） | 影片總長度 |
| 1165 cues | 英文手動字幕數量 |
| 46,215 字元 | 英文逐字稿字元數（清理後） |
| log n / log log n | Load balancing 的 expected max load |
| n 個 | Universe 跟 machine 數量（load balancing 範例） |
| O(1) | Linear probing 在 7-wise independence 下的 expected query time |
| O(1/K³) | Length-K interval 為 full 的 probability 上界 |
| 6 | Markov bound 用的 moment 次方 |
| 7-wise | Linear probing 最簡單的 independence 設定（warm-up） |
| 5-wise | Linear probing 更緊的 independence（下一堂課證明） |
| 1970 | Bloom filter 原始論文（Bloom） |
| 2004 | Cuckoo hashing（Pagh-Rodl）；Bloomier filters（Chazelle-Kilian-Rubinfeld-Tal） |

---

## 五、核心主旨

> Word-RAM 模型下的 hashing 不只是「找個 h 把東西打散」——而是設計一個 hash family 在正確的「k-wise independence」強度下，能同時保證空間效率、查詢時間、儲存表示成本。Load balancing 的 max load 是 log n / log log n、linear probing 的 query 是 O(1)，這些結果的共同技巧是：證明時往往只需要 k-wise independence（不是 full independence），所以可以用多項式 hash family 取代 fully random function 省下 u log m bit 的儲存成本。K-wise independence 是 word-RAM hashing 設計的核心數學工具。

---

## 六、金句摘錄

1. 「We have some hash function H, which sends them into let's think of it as say an array of size m.」

2. 「K-wise independence is a weaker property than saying, if you look at all n items, they behave independently.」

3. 「You don't actually need all of the hashings to be totally independent.」

4. 「Polynomial interpolation is the basic idea: every possibility happens exactly once.」

5. 「You can store the hash function using k log p bits instead of u log m bits.」

6. 「If you have a totally random hash function, it takes u log m bits to store. That's way more expensive.」

7. 「This thing we could handle using Chernoff bounds.」

8. 「The reason five comes about—Patrascu said, when you condition on one, everything else is four-wise.」

9. 「If your random variable is concentrated about its mean, then taking it to a large power is not so bad.」

10. 「The moment method is something you should be aware of. It makes some intuitive sense.」

---

## 七、備註

- **字幕來源**：YouTube 英文手動字幕（en-j3PyPqV-e1s，1165 cues）— Harvard CS224 課程官方上傳
- **無 zh-Hant 字幕**：本影片在 YouTube 上無任何 zh-Hant auto-caption（只有 en auto-cap）
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **英文逐字稿字數**：46,215 字元（清理 VTT 時間碼、HTML 標籤後）
- **未使用 Whisper**：影片有完整手動字幕，無需 Whisper fallback
- **本筆記引用以 en 字幕為主**
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture3_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（k-wise independence、linear probing、moment method、cuckoo hashing 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 44 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture3_口播稿.txt

- [opus 2.3 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture3.opus)（Telegram 友善）
- [m4a 4.5 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture3.m4a)（iOS 友善）
- [mp3 4.3 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture3.mp3)（通用格式）