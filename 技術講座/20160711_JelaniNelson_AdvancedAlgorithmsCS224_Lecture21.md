# 【Harvard CS224 高階演算法 — Lecture 21：Faster Max Flow — Scaling、Blocking Flow 與 Link-cut Trees 整合】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 87分鐘**

---

> **影片連結**：https://youtu.be/rfTt7k6Nv-I
> **影片時長**：1 小時 27 分鐘（5229 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms（高階演算法）」2014 年秋季學期（f14）的第 21 堂課，主講者為 Jelani Nelson 教授。本堂進入流演算法主軸，目標是把 Ford-Fulkerson 的 O(MF) 擬多項式時間改進為強多項式時間。改進的路徑有三：blocking flow（Dinic）、scaling（處理一般容量）、link-cut trees（加速 blocking flow 查找）。

課程設計的重點：

- **從擬多項式到強多項式**：Ford-Fulkerson 只達到 O(MF)，需要強多項式演算法
- **三個術語的精確定義**：弱多項式 vs 強多項式 vs 擬多項式
- **Blocking Flow 與 Dinic**：用 level graph 加速找擴充路徑
- **單元容量的特殊情況**：blocking flow 對 unit capacity 是 O(M)
- **Scaling 對一般容量**：用位元分解把容量離散化
- **Link-cut trees 的角色**：把 blocking flow 查找從 O(M) 降到 O(M log N)

---

## 二、章節脈絡

### Section 1｜回顧 Ford-Fulkerson 與術語

**重點摘要：** 回顧基本設定、Ford-Fulkerson 演算法，並引入強/弱/擬多項式三個術語的精確定義。

**內容：**

**流問題設定：**
- 容量有向圖 G = (V, E)
- 每條邊有整數容量 cₑ ∈ [1, U]
- 目標：找從源點 S 到匯點 T 的最大流

**Ford-Fulkerson：**
- 反覆在殘餘圖中找擴充路徑
- 推送單位流量
- 直到沒有擴充路徑為止

**複雜度：**
- 對整數容量正確
- 時間為 O(MF)，其中 F 是最大流值
- 對容量為 U 的整數網路是擬多項式
- 不是強多項式

**三個術語：**
- 弱多項式：時間對 M 與 log U 多項式
- 強多項式：時間完全不依賴容量大小，只依賴 M 與 N
- 擬多項式：時間對 U 也多項式

> 「Ford-Fulkerson is pseudopolynomial. Today we're going to see some strongly polynomial algorithms.」

---

### Section 2｜強多項式 vs 弱多項式

**重點摘要：** 詳細解釋三個術語的區分，並指出本堂目標是強多項式演算法。

**內容：**

**三個層次的區分：**
- 弱多項式：時間是 poly(M, log U)
- 強多項式：時間是 poly(M, N)
- 擬多項式：時間是 poly(M, N, U)

**為什麼要追求強多項式：**
- 容量 U 在輸入中只需 log U 個位元表示
- 對 U 的多項式意味著實際上是 log U 的指數
- 強多項式意味著時間與容量大小完全無關

**本堂目標：**
- 強多項式最大流演算法
- 運行時間完全獨立於容量數值
- 從 O(MF) 降到 O(MN log N) 或更強

---

### Section 3｜Blocking Flow 與 Dinic

**重點摘要：** 回顧 blocking flow 概念，證明 N-1 次 blocking flow 就足夠，並分析其複雜度。

**內容：**

**Blocking Flow 定義：**
- 對 level graph 做 DFS 找從 S 到 T 的路徑
- 沿路推送最小容量
- 把飽和邊刪除
- 重複直到 level graph 中沒有 S-T 路徑

**為什麼 N-1 次就夠：**
- 每次找到 blocking flow 後殘餘圖的 S-T 距離至少增加 1
- 因此最多 N-1 次 blocking flow 就能完成

**複雜度：**
- 找一個 blocking flow 用 DFS 是 O(M)
- 整體是 O(MN)

**改進空間：**
- O(MN) 對很多圖已經足夠
- 但對稠密圖仍有改進空間——M 接近 N² 時 M 因子主導總時間

> 「So, in each iteration, when we find a blocking flow, the S-T distance in the residual graph increases by at least 1. So there are at most N-1 iterations.」

---

### Section 4｜單元容量圖的特殊情況

**重點摘要：** 展示 Dinic 對單元容量圖是 O(M) — 因為每次推送至少飽和一條邊。

**內容：**

**單元容量圖的 Dinic：**
- 每次推送至少飽和一條邊
- 總推送量受 M 限制
- 一個 blocking flow 步驟只要 O(M) 就能完成

**一般容量圖的問題：**
- 每次推送可能只推進 1 個單位的流
- blocking flow 內部要重複 O(M) 次
- 總時間 O(MN)

**Sleator-Tarjan 1983 改進：**
- 用 link-cut trees 加速 blocking flow 查找
- 從 O(M) 降到 O(M log N)
- 整體得到 O(MN log N) 或更強的強多項式界

**稠密圖 vs 稀疏圖：**
- 稀疏圖 M = O(N)，O(MN) = O(N²) 還可以接受
- 稠密圖 M = O(N²)，O(MN) = O(N³) 需要改進

---

### Section 5｜Scaling 對一般容量的加速

**重點摘要：** 介紹 scaling 法的核心想法——把容量二進位分解成位元層，逐步解決。

**內容：**

**Scaling 法核心：**
- 把容量的二進位表示拆成位元
- 從最低位元開始逐步加入
- 對當前位元為 1 的邊，先在殘餘圖上跑一次 blocking flow 把這些邊用掉
- 再進入下一個位元

**複雜度：**
- 對整數容量 U，需要 log U 個位元層
- 每層做一次 blocking flow
- 由於每層的 blocking flow 至少飽和若干邊
- 整體時間 O(M log U)，弱多項式

**Scaling 法的巧妙之處：**
- 把「容量大小」這個連續參數化為離散的位元層數
- 每層都是相同的子問題
- 因此可以用 divide-and-conquer 的精神逐位解決

**與 link-cut trees 結合：**
- 每層的 blocking flow 用 link-cut trees 加速
- 得到強多項式而非僅弱多項式

---

### Section 6｜Link-cut trees 與課程結論

**重點摘要：** 預告 link-cut trees 將完成最後一塊拼圖，並回顧三十年間最大流演算法的演進。

**內容：**

**Link-cut trees 的角色：**
- 加速 blocking flow 的查找
- 從 O(M) 降到 O(M log N)
- 整體得到 O(MN log N) 或更強的強多項式界

**Link-cut trees 簡介：**
- 由 Sleator 與 Tarjan 在 1983 年提出
- 處理動態森林的關鍵資料結構
- amortized O(log N) 時間內支援 link、cut、find-root 等操作

**三十年間的改進：**
- 1983 年的 O(MN log N)
- 後續的 O(MN)
- 甚至 O(M² / log M)
- 都是圍繞 link-cut trees 與其變體在做文章

**下堂課內容：**
- 詳細拆解 link-cut trees 的內部結構
- 展示它如何被應用到 blocking flow 中
- 讓強多項式最大流演算法的最後一塊拼圖落地

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **最大流（Max Flow）** | 給定容量網路，找從 S 到 T 的最大流 |
| **Ford-Fulkerson** | 反覆找擴充路徑推送流量的演算法；O(MF) |
| **擴充路徑（Augmenting Path）** | 殘餘圖中從 S 到 T 的路徑 |
| **殘餘圖（Residual Graph）** | 流量網路扣除已推送流量後剩餘的容量 |
| **Blocking Flow** | level graph 中沿所有 S-T 路徑推送至飽和 |
| **Level Graph** | 按 BFS 距離分層的有向圖；只保留相鄰層邊 |
| **Dinic 演算法** | 反覆找 blocking flow 直到沒有 S-T 路徑 |
| **Scaling** | 把容量二進位分解成位元層逐步處理 |
| **強多項式（Strongly Polynomial）** | 時間完全不依賴容量大小 |
| **弱多項式（Weakly Polynomial）** | 時間對 M 與 log U 多項式 |
| **擬多項式（Pseudopolynomial）** | 時間對 U 也多項式 |
| **Link-cut Trees** | 動態森林的資料結構；amortized O(log N) 操作 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 1 小時 27 分鐘（5229 秒） | 影片總長度 |
| 44,308 字元 | 英文逐字稿字元數（清理 VTT 時間碼、HTML 標籤後） |
| 8,794 字 | 英文逐字稿單字數 |
| 1,598 字元 | 繁中口播稿字元數（含標點空白） |
| 703 字 | 繁中口播稿漢字數 |
| 22 句 | 口播稿總句數 |
| 38 個逗號 | 口播稿總逗號數 |
| 8.19% | L21 silent ratio（Bar 3 通過） |
| 4.0 MB | m4a 音檔大小 |
| 2.0 MB | opus 音檔大小 |
| O(MF) | Ford-Fulkerson 時間（F 為最大流值） |
| O(MN) | Dinic 時間 |
| O(M log U) | Scaling 時間（弱多項式） |
| O(MN log N) | Sleator-Tarjan 1983 時間（強多項式） |

---

## 五、核心主旨

> 最大流演算法的歷史反映了整個演算法領域的演進：從擬多項式的 Ford-Fulkerson，到弱多項式的 Dinic 與 scaling，再到強多項式的 Sleator-Tarjan。本堂展示了兩個關鍵工具：blocking flow（Dinic 的核心）與 scaling（處理一般容量的位元分解），兩者結合得到 O(M log U) 的弱多項式界。最後一塊拼圖是 link-cut trees，把 blocking flow 查找從 O(M) 降到 O(M log N)，讓整個演算法達到強多項式。這條改進路徑的核心洞見是：演算法的瓶頸往往不在主邏輯而在資料結構，換一個更貼合問題的資料結構就能讓整個複雜度指數級改善。

---

## 六、金句摘錄

1. 「Ford-Fulkerson is pseudopolynomial. Today we're going to see some strongly polynomial algorithms.」

2. 「Each new path pushes at least one more unit of flow, and time to find one augmenting path is just linear in the number of edges.」

3. 「Strongly polynomial means the running time doesn't depend on the capacities at all.」

4. 「The time for Dinic is O(MN) since there are at most N-1 iterations, each costing O(M).」

5. 「In the unit capacity case, we can find a blocking flow in O(M) time. But in the general capacity case, this is not true.」

6. 「Scaling breaks up the capacity into bits and processes them one at a time from least significant to most significant.」

7. 「For an integer capacity U, we have log U bit layers. Each layer does one blocking flow. So the total time is O(M log U).」

8. 「Link-cut trees by Sleator and Tarjan, JCSS 1983, can be used to find a blocking flow in time O(M log N).」

9. 「This is a data structure that can be used to speed up blocking flow, and there are other applications as well.」

10. 「Over the course of 30 years, finally the log N was removed from the running time of strongly polynomial max flow.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照
- **未使用 Whisper**：影片有完整 YouTube 自動字幕（zh-Hant 與 en），無需 Whisper fallback
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **英文逐字稿字數**：44,308 字元（清理 VTT 時間碼、HTML 標籤後）
- **本筆記引用以 en 字幕為主**，zh-Hant 用於中文關鍵概念對照
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture21_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（blocking flow、scaling、link-cut trees 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 1 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture21_口播稿.txt

- [opus 2.0 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture21.opus)（Telegram 友善）
- [m4a 4.0 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture21.m4a)（iOS 友善）
- [mp3 3.7 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture21.mp3)（通用格式）