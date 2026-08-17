# 【Graph Engineering：給 AI 工作的流程圖】

**講者｜Anatoli Kopadze（@AnatoliKopadze）**
**影片連結｜https://x.com/AnatoliKopadze/status/2080668775796314331**
**影片長度**｜（X 帖非影片，無時間標記）
**發布日期｜2026-08-17**
**類型｜Article（X 帖長文，社群媒體完整文字來源）**
**主題｜編碼工具 / Agent 工程實踐**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Anatoli Kopadze 在 X 平台發布的長文，主題是 **Graph Engineering** —— 把 AI agent 工作流程畫成圖（graph），而非單一線性迴圈（loop）。開宗明義指出，多數人只用到 AI 5–10% 的能力，真正的槓桿在於把流程設計成可並行的節點網路。

作者背景為丹麥頂尖大學畢業，在校曾修過「如何把流程攤成圖並最大化效率」的整學期課程。文章主打「Graph 比 Loop 強」的核心論點，並輔以具體可落地的測試（fake-edge test）、單一 pattern（the diamond）、失敗模式（context collapse / false independence / silent node failure）與成本真實面（$165K 範例）。

文章共 13 個章節，結尾提供 5 個現成可貼的 graph 範本與一個 Claude Code 實作示範。性質偏引導式教學 + 自我行銷（結尾 X / Telegram 雙追蹤引流）。

---

## 章節脈絡

| Section | 標題 | 一句話摘要 |
|---------|------|----------|
| Section 1｜Where this even came from | 起源 | 從 Loop 升級到 Graph of Loops；老派工程師吐槽是「30 年舊概念換新名字」，但作者認為正是好事 |
| Section 2｜What a graph actually is | 圖的本質 | 兩個詞就夠：node（節點，做一件事）+ edge（邊，承載結果）；關鍵是 node 要有 contract |
| Section 3｜The test that finds the fake edges | 假邊測試 | 問每一條邊：「這一步真的需要上一步的結果嗎？」不需要 → 切掉，兩件事可並行 |
| Section 4｜Your current setup is already a graph | 你的線性就是最糟的圖 | 40 步線性 vs 4 個真實依賴的圖：5 分鐘 vs 15 秒；瓶頸從來不是模型，是畫圖方式 |
| Section 5｜The one pattern that pays: the diamond | 唯一值得記的 pattern | Fan out → Reduce → Synthesize；Claude 的 research 功能就是這個樣子 |
| Section 6｜The checker is the whole trick | 驗證節點是整個技巧 | 工人與驗證者不能共享 context；三分鏡檢查（correct / current / source real） |
| Section 7｜Where graphs actually break | 圖真正會壞的地方 | 三個失敗模式：context collapse / false independence（共用資源）/ silent node failure |
| Section 8｜Do you even need one? | 你真的需要圖嗎 | 圖買的是寬度不是判斷；任務小、要逐步審批、探索性、真實依賴時該跳過 |
| Section 9｜The part nobody wants to hear: anchors | 沒人想聽的：錨點 | 拓樸本身不買真相；圖需要「不能被反駁」的錨點（真實測試、實際收入、凍結規則） |
| Section 10｜Build one yourself in Claude Code | 在 Claude Code 動手做 | 關鍵字「workflow」；Claude 寫短腳本調度 sub-agents，省 context 還能重用 |
| Section 11｜Ready graphs you can paste right away | 5 個現成模板 | 研究桌、SEO 內容機、上市套件、整庫重構、未知大小探索 |
| Section 12｜The cost and the supervision | 成本與監督 | Bun runtime 改寫範例：50 workflows / 64 agents / 11 天 / $165K；需要預算與監控 |
| Section 13｜What this actually means for you | 對你的意義 | 不是什麼都圖學化；學 fake-edge test 比多摸一個工具更划算 |

---

## 關鍵概念定義

| 概念 | 定義 | 角色 |
|------|------|------|
| **Node（節點）** | 一個 agent 做一件事，有定義輸入、定義輸出 | 負責「思考」 |
| **Edge（邊）** | 一條「一步需要上一步結果」的依賴關係；只有真正有資料傳遞才算 | 負責「承載結果」 |
| **Contract（節點契約）** | 固定輸入/輸出形狀的節點；非自由文字 | 讓下一個節點不必猜格式 |
| **Loop（迴圈）** | 單一 agent 重複改進一件事：try → check → adjust → repeat | 適合窄而深的改進 |
| **Graph of Loops（迴圈之圖）** | 互相監督、修正的迴圈網路 | 適合寬而淺的並行工作 |
| **Fake Edge（假邊）** | 邏輯上不存在的依賴；砍掉後兩步可並行 | 圖工程第一個要修的東西 |
| **Diamond（菱形）** | Fan-out → Reduce → Synthesize 的單一骨架 | 一年內唯一值得記的 pattern |
| **Worker / Verifier 隔離** | 做的人與驗證的人不能共享 context | 否則等於一個 loop 改自己作業 |
| **Anchor（錨點）** | 「不能被反駁」的外部節點：實際跑過的測試、進到銀行的收入、留住的客戶 | 圖的誠實底線 |
| **Frozen Rule（凍結規則）** | 優化器會想弱化的規則，故意鎖死不讓碰 | 防止圖學會作弊拿高分 |

---

## 各章節重點與引用

### Section 1｜起源
一個月前整個圈子在談 loops；Peter Steinberger 發的 tweet 觸發跳到 graphs。Loop 是「一個 agent 改一件事：try → check → adjust → repeat」，graph of loops 是「網路裡 cycles 互相看、互相修正」。工程師 24 小時內反駁：30 年舊概念換新名字。作者的答辯是：30 年下來還在跑 critical system 的 pattern，正是值得託付工作的那種。

> A pattern that has run critical systems for thirty years is exactly what you want to trust with your work.（一個跑了 30 年關鍵系統的 pattern，正是你想拿來託付工作的那種。）

### Section 2｜圖的本質
Graph = 一張畫出來的 AI 工作計畫。回答兩個問題：哪些事要做、哪些事得等哪些事。兩個詞就夠：**node** = 一個 agent 做一件事，**edge** = 一個 job 需要另一個 job 的結果。沒資料傳遞的 edge 不算。Node 必須有 contract（自由文字輸出 = 只有人讀得懂的下游黑箱；固定輸出形狀 = 下一個 node 不必猜就能吃）。

> A node whose output is a wall of free text is a node only a human can read. A node with a fixed output shape is one the next node can consume without guessing.（輸出是一面自由文字的 node，是只有人讀得懂的 node；有固定輸出形狀的 node，是下一個 node 不用猜就能吃的 node。）

### Section 3｜假邊測試
拿現有 AI workflow 一步步走，每一步問一個問題：「這步真的需要上一步的結果嗎？」是 → 邊是真的，留著；否 → 沒邊，等是浪費，兩件事可並行。範例：`review file A for bugs, then review file B for bugs` 讀起來是序列，但 B 不讀 A 的結果，純粹是輸入順序問題。平行後耗時 = max(A, B) 不是 A + B。任何 workflow 都能找到 2-3 條假邊。

> Run them side by side and the whole thing finishes in the time of the slower single file, not the two added together.（把兩個檔平行跑，總時間 = 較慢的那個檔，不是兩檔相加。）

### Section 4｜線性就是最糟的圖
寫「do A, B, C, D」已經是 graph，但最慘的那種 — 單鏈。執行正確但慢又脆：C 死了 D 永不發生，A 的成果雍塞上游。圖工程第一個真本領是重畫這條鏈。對每條邊問 fake-edge 問題，砍掉沒資料流動的邊，鏈塌成更寬的圖：幾個獨立 job 並行，匯入一個需要全部結果的 job。40 步線性 vs 40 步 graph（3-5 個真實依賴）：5 分鐘 vs 15 秒；40 個單一失敗點 vs 真正依賴數的失敗點。

> The model was never the bottleneck. The line you drew was.（從來不是模型的瓶頸。是你畫的那條線。）

### Section 5｜唯一值得記的 pattern：菱形
不需要一百種形狀；觀察任何嚴肅的 agent 系統都是同一張圖：工作分裂 → 幾個 worker 並行挖 → 有人檢查他們挖到的 → 全部合併成一個答案。這張圖叫 **diamond**，正式名稱是 **fan out → reduce → synthesize**。Fan out 蒐廣度，reduce 用 plain code 壓縮，synthesize 用最終 agent 寫答案。Claude 的 research 功能就是跑這個 production。問「split 在哪、merge 在哪」比「agent 多走幾步」更 scale。

> Same skeleton behind a market scan, a code review, or a research report. Swap the angles and the prompts.（同一副骨架，能撐市場掃描、程式碼審查、研究報告。換角度跟提示詞就好。）

### Section 6｜驗證節點是整個技巧
所有嚴肅的 AI 自評測試都說同一句話：模型漏掉自己大部分的錯。讓做事的 agent 評自己，太手軟。解法：每條邊上加一個獨立 node，專門試圖 kill 掉 finding。沒殺掉才放行。**Catch**：這個 checker 必須有 clean context；給它 worker 同樣的對話等於沒檢查，只是一個 loop 換了字型。Worker 與 verifier 永遠不能共享 context。三分鏡檢查：對不對、新不新、來源是不是真的。

> A worker and its verifier must never share a context. The moment they do, you are back to one loop grading its own homework, just with a bigger bill.（工人與驗證者絕不能共享 context。一旦共享，就退回一個 loop 改自己作業 — 只是帳單變大。）

### Section 7｜圖真正會壞的地方
三個失敗模式（每個都有公開踩雷案例）：

1. **Context collapse**：fan-out 1000 個 node → 終點試圖餵 1000 個輸出 → 合成步開始前 context window 就爆。修：分層 fan-in，先 batch → summary → 合併 summary，不要直接合併 raw pile。
2. **False independence**：兩個 node prompt 互不提到對方，但寫同一個檔 / 打同一個 rate-limited API（Bun 團隊當年踩過）。修：每個 worker 各自獨立空間，audit 共用資源不是共用資料。
3. **Silent node failure**：鏈上一個死全雍塞（討厭但明顯）；圖裡 200 個 node 死一個，產出看起來完整。修：merge step 數輸入對預期數，差就 flag，不要拿半套資料繼續跑。

### Section 8｜你真的需要圖嗎
圖買的是寬度不是判斷。Skip 條件：任務小或孤立（加一個 function、修一個 bug，協作成本反而更高）；想逐 step 審批（圖的天職是不要你盯）；探索性不知道要找什麼（這種工作要一個能邊走邊轉的 agent，不是鎖死計畫的艦隊）；各步真實依賴（勉強上圖 = 多花錢沒加速）。判斷基準：fake-edge test 找不到兩個無邊工作 → 沒圖可建；那是 loop，loop 也很好。

> It is a loop, and a loop is fine.（那是 loop，loop 沒問題。）

### Section 9｜沒人想聽的：錨點
圖可以疊加 checker、audit node、meta-node 調整其他 node。但每個都讀同一份報告 → 自我審查。拓樸本身不買真相。圖需要 **anchor**：「不能被反駁」的事實節點 — 跑過的測試（不是「該過」）、進到銀行的收入、留住客戶。**Frozen rule**：優化器會想弱化的規則，故意鎖死不讓碰，因為那正是它會彎曲拿分的部分。

> The graph is only as honest as the things inside it that refuse to move.（圖的誠實程度，取決於內部那些拒絕移動的東西。）

### Section 10｜在 Claude Code 動手做
關鍵字 **「workflow」**。把它寫進 prompt，Claude 不會走單線對話，而是寫一支短調度腳本，spawn 一組互相協調的 sub-agents 跑。重點：協作是 code 不是對話，agent 之間的結果傳遞不走 context（這是省下來的關鍵）。實務上：寫 prompt 帶「workflow」+ 命名 max files；Claude 先秀 plan 等你 approve；批准後一 agent 一檔同時跑；本地 session 全程沒被吃。存好的 run 可命名重跑。

> That is a graph. A dozen agents from a single sentence.（這就是 graph。一個句子召喚十幾個 agent。）

### Section 11｜5 個現成模板
全部都是 diamond 變體，換工作本質不換骨架：

- **決策級研究桌**：一個問題切成幾個角度 → 並行研究員 → 質疑者攻擊每個發現 → 倖存者進報告。
- **SEO 內容機**：每次一篇可排名的草稿，永遠不繞過你直接發。
- **上市套件**：一次產生全套上線物料，每件都要你 approval。
- **整庫重構**：單一 context 撐不住的寬度。
- **未知大小探索**：找到一個 bug 才發現有三個 — 用可迭代的 discovery loop。

> Keep yourself as the last yes before anything ships.（任何東西出貨前，最後一個 yes 留給你。）

### Section 12｜成本與監督
公開案例：一位工程師用同一套改寫 Bun runtime，把約 535,000 行一種語言翻譯成超過一百萬行另一種語言，原本近一年 → 11 天。代價：50 個 workflow、最多 64 個 agent 同時跑、約 $165,000。更要命的是：這麼大量 AI 寫的程式碼到底能不能安全 review，社群有真實批評。圖能吃下單一 context 沒法吃的工作，也能在背景悄悄燒錢（任務沒對、anchor 沒設）。重版本需要預算 + caps + 監控；沒有的話，從小開始，看一次跑多少錢，再決定要不要放大。

> A graph can fan out to a thousand agents and chew through a job no single context could hold. It can also quietly spend your money in the background if you point it at the wrong task or skip the anchors.（圖可以 fan-out 到一千個 agent，啃下單一 context 沒法吃的工作；也能在背景悄悄燒錢，如果你把任務指錯或漏掉錨點。）

### Section 13｜對你的意義
全部都在這了。圖的強項是寬度、並行獨立；弱項是買寬度不買判斷、跑錯任務會燒錢。**操作守則**：不是什麼都圖學化；寬度工作用圖，窄工作用 loop。實戰建議很具體：今晚學 fake-edge test，畫現有 workflow，找出沒資料傳遞的邊砍掉。這個動作比多摸一個新工具讓你更快。

> That one move makes you faster than most people before you touch a single new tool.（這一個動作，讓你比大多數人更快 — 還沒碰任何新工具。）

> Most will keep queueing steps in a line. The few who learn to draw the graph will run a fleet.（大多數人會繼續把步驟排成一條線。學會畫圖的人會跑一整支艦隊。）

---

## 人物分析

- **Anatoli Kopadze（作者）**：丹麥頂尖大學背景，在學時修過整學期的「流程圖」課。文章帶有強烈的「教學 + 自我行銷」雙重目的 — 13 個章節的技術內容 + 結尾 X / Telegram 雙追蹤引流。寫作風格：先拆直覺、再下定義、最後給具體可貼的範本。
- **Peter Steinberger（被引述者）**：發了一則讓圈子從 loops 跳到 graphs 的單行 tweet — 本文論述的轉折點。
- **Bun 團隊（公開案例）**：用 50 workflows / 64 agents 改寫 Bun runtime，11 天、$165K，是 Section 7「false independence」與 Section 12「成本」共同引用的真實案例。
- **Claude research 功能（被引述系統）**：作者說 production 就是 diamond；是 Section 5 唯一指定的業界實作。

---

## 核心主旨總結

Graph Engineering 的本質**不是「多 agent」也不是「更多步驟」**，而是三件事同時到位：

1. **有資料流動的結構**（fake-edge 砍掉、diamond 撐起來）
2. **不能共享 context 的驗證者**（worker / verifier 必須隔離）
3. **外部世界不可反駁的錨點**（真實測試、實際收入、凍結規則）

三件事缺一不可。拓樸本身不買真相 — 一個閉環自審的圖，比一個誠實的單 loop 更危險。

---

## 金句摘錄

> The model was never the bottleneck. The line you drew was.（從來不是模型的瓶頸。是你畫的那條線。）

> A worker and its verifier must never share a context. The moment they do, you are back to one loop grading its own homework, just with a bigger bill.

> The graph is only as honest as the things inside it that refuse to move.（圖的誠實程度，取決於內部那些拒絕移動的東西。）

> A pattern that has run critical systems for thirty years is exactly what you want to trust with your work.

> That one move makes you faster than most people before you touch a single new tool.

> Most will keep queueing steps in a line. The few who learn to draw the graph will run a fleet.

> Pass it through the diamond. Fan out, reduce, synthesize.

> Let it grade its own reports and it will be confidently wrong.（讓它評自己的報告，它會自信地錯。）

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone `xiaotian_clone_v1`, speech-2.8-hd），約 3 分 33 秒
> 口播稿原文：transcripts/20260817_AnatoliKopadze_GraphEngineering_口播稿.txt

- [opus 1.7 MB](../audio/20260817_AnatoliKopadze_GraphEngineering.opus)（Telegram 友善）
- [m4a 3.4 MB](../audio/20260817_AnatoliKopadze_GraphEngineering.m4a)（iOS 友善）
- [mp3 3.2 MB](../audio/20260817_AnatoliKopadze_GraphEngineering.mp3)（通用格式）

> **Bar 3 備註**：silent ratio 9.49%（31 個 ≥ 0.5s gaps）— 通過 < 10% 閾值，但偏 high 邊界，下次同類內容可多加句號避免連讀。
