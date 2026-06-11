# Matt Pocock：Learn anything with the /teach skill

> **講者：** Matt Pocock（TypeScript 教育者、aihero.dev 創辦人、Total TypeScript 作者）
> **場合：** YouTube 教學影片（Matt Pocock Skills 系列）
> **影片連結：** https://youtu.be/s5T5oQJcJ6U
> **影片長度：** 13 分 04 秒
> **處理方式：** YouTube 英文自動字幕 (en-orig) → 繁體中文結構化筆記
> **整理日期：** 2026-06-12

---

## 目錄

- [影片概覽](#影片概覽)
- [核心命題](#核心命題)
- [章節脈絡](#章節脈絡)
  - [1. Intro：為什麼做 /teach skill？](#1-intro為什麼做-teach-skill)
  - [2. Stateful vs Stateless：/teach 必須是 Stateful](#2-stateful-vs-stateless-teach-必須是-stateful)
  - [3. 安裝與啟動：skills.sh 一鍵安裝](#3-安裝與啟動skillssh-一鍵安裝)
  - [4. Mission 第一步：為什麼學生要學這個？](#4-mission-第一步為什麼學生要學這個)
  - [5. Resources：自動蒐集高品質學習素材](#5-resources自動蒐集高品質學習素材)
  - [6. Lessons：HTML 而非 Markdown 的關鍵選擇](#6-lessonshtml-而非-markdown-的關鍵選擇)
  - [7. Quizzes：建立 Feedback Loop](#7-quizzes建立-feedback-loop)
  - [8. Learning Records：像真老師一樣追蹤進度](#8-learning-records像真老師一樣追蹤進度)
  - [9. Glossary：參考資料的累積](#9-glossary參考資料的累積)
  - [10. ZPD：最近發展區教學法](#10-zpd最近發展區教學法)
  - [11. Use Cases：onboarding、學新技術、debug 思維](#11-use-casesonboarding學新技術debug-思維)
  - [12. 結語：開發者是 AI 時代的 first movers](#12-結語開發者是-ai-時代的-first-movers)
- [時間軸](#時間軸)
- [重點引言](#重點引言)
- [核心概念定義表](#核心概念定義表)
- [延伸閱讀](#延伸閱讀)
- [專家視角：教育設計 × AI 工具](#專家視角教育設計-ai-工具)

---

## 影片概覽

| 項目 | 內容 |
|------|------|
| **講者** | Matt Pocock — TypeScript 教育者、aihero.dev 創辦人、Total TypeScript 作者 |
| **影片類型** | Skill 教學 demo（13 分鐘實機展示）|
| **核心主題** | `/teach` skill — 把「教學」這件事本身封裝成 Claude Code 可執行的 skill |
| **核心差異** | `/teach` 是 **stateful** 的（記得學生進度、調整後續課程），不同於 stateless skill |
| **技術 demo** | Matt 親自用 /teach 學「解魔術方塊」（從完全不會到能完成）|
| **教育理論** | 借用 Vygotsky 的「最近發展區」(Zone of Proximal Development, ZPD) 概念 |
| **影片分類** | 技術講座（Claude Code / AI 工具）|

---

## 核心命題

> **「教學」本身是一種可被編碼、可被 AI agent 化的流程 — /teach skill 把「好的老師會做的事」拆解成可重複、可調適、可追蹤的步驟（Mission → Resources → Lessons → Quizzes → Records），讓任何人在任何 coding agent 裡都能「隨時有一位個人化家教」。**

---

## 章節脈絡

### 1. Intro：為什麼做 /teach skill？

**重點摘要**：Matt Pocock 有 10 年教學經驗（前 6 年當 voice coach、後 4 年教 dev），一直想把「教學」這件事封裝成可重複的工具。在一趟倫敦的長途巴士旅程中，他寫出了 /teach skill — 並用「解魔術方塊」這個他一直想學但沒時間的東西親自實測，發現效果極佳。

**內容**：
- Matt 自我介紹：6 年 voice coach + 4 年教 dev
- 動機：「如果能把所有教學知識封裝成 skill，讓任何人都能學任何東西？」
- 倫敦長途巴士上寫出 /teach skill
- 親自 demo：學解魔術方塊（從 0 到能完成）
- 結論：「感覺像是有一個真老師在教我，用我喜歡被教的方式」

### 2. Stateful vs Stateless：/teach 必須是 Stateful

**重點摘要**：Matt 先講關鍵設計決策 — skill 必須是「stateful」（記得進度）而非 stateless（每次重來）。他用自己之前做的兩個 skill 對比：Grill with Docs（stateful，會越用越好）和 Grill me（stateless，每次都重來）。/teach 必須是 stateful 才能追蹤學生進度。

**內容**：
- 兩個對比案例：
  - **Grill with Docs** — Stateful，會把新的問答加到 repo，會越用越好
  - **Grill me** — Stateless，每次都重來
- 「Neither is better — useful in different situations」
- 設計 skill 時必須想清楚：這個 skill 需要 stateful 還是 stateless？
- **/teach 必須是 stateful** — 因為學習是連續過程，需要記得學生已經會什麼、不會什麼

### 3. 安裝與啟動：skills.sh 一鍵安裝

**重點摘要**：安裝流程非常簡單 — 從 Matt 的 skills repo 跑 `skills.sh` installer，選擇 Teach skill，就能在任何 coding agent 裡使用。

**內容**：
- 步驟 1：去 Matt 的 skills repo（github.com/mattpocock/skills）
- 步驟 2：跑 `skills.sh` installer
- 步驟 3：選擇 Teach skill
- 步驟 4：在任何 coding agent 的空目錄裡跑 `/teach` 命令
- 範例：Matt 在自己的「魔術方塊專案目錄」跑 `/teach`
- 注意：從空目錄開始 — 因為 /teach 會建立很多檔案（mission、resources、lessons、learning records）

### 4. Mission 第一步：為什麼學生要學這個？

**重點摘要**：/teach 啟動後第一步是建立「mission」— 問學生「為什麼要學這個？」。Matt 引用教育心理學：「老師要有效，必須理解學生為什麼要學這件事」。

**內容**：
- 範例：Matt 的魔術方塊 mission
  > 「Matt wants to be able to take a scrambled 3x3 Rubik's Cube and solve it unaided at least once. The goal is the achievement itself, not speed, not theory.」
- 重點：goal statement 要明確、要有真實的動機
- 「Not speed, not theory」— 強調「我只要完成一次」這個具體目標
- 哲學：mission 決定整個課程的方向

### 5. Resources：自動蒐集高品質學習素材

**重點摘要**：/teach 會自動去搜尋「primary source, high trust」資源，建立教學素材庫。這個步驟只在第一次執行時完整跑，後續會增量更新。

**內容**：
- 自動搜尋網路上的 primary source、high trust 教學資源
- 第一次跑會完整建立 resources list
- 後續會根據學生進度「增量更新」資源
- 範例：Matt 的魔術方塊 resources（解法教學、notation 規範、cubing 社群等）
- 哲學：好的教學必須基於好的素材，不是 agent 自己編的

### 6. Lessons：HTML 而非 Markdown 的關鍵選擇

**重點摘要**：/teach 把每個 lesson 存成獨立的 HTML 檔案（不是 Markdown）。Matt 解釋：HTML 比 Markdown 豐富太多 — 允許互動元素、視覺化、自訂 CSS、quiz widgets。這是「教學體驗」的核心。

**內容**：
- 每個 lesson 一個 HTML 檔案，存放在 `lessons/` 目錄，編號命名
- 為什麼用 HTML 而非 Markdown：
  - HTML 互動性更強（quizzes 可以是互動的）
  - 視覺化更豐富（CSS、SVG 動畫）
  - 可以放 callouts、diagrams
  - 個人化 styling
- 範例 lesson 結構：標題、簡短 explainer、diagrams、callouts、quiz
- 哲學：教學不只是「給文字」，是「設計體驗」

### 7. Quizzes：建立 Feedback Loop

**重點摘要**：每個 lesson 都有 quiz — 這是「feedback loop」的關鍵。Matt 解釋：教學若沒有 feedback 機制，學生不知道自己會不會。「Quizzes are okay at this — they're basically good if you can't find any richer feedback loop.」

**內容**：
- 為什麼需要 quiz：
  - 學生需要知道自己有沒有真的懂
  - 老師需要知道下一步該教什麼
  - 形成「教 → 測 → 調整」的閉環
- Quiz 設計原則：
  - 不要太難（會挫折）
  - 不要太簡單（會無聊）
  - 立即 feedback（做完馬上知道對錯）
- Matt 的限制：理想是「在真實情境中實作」（如真的試著解魔術方塊），quiz 退而求其次

### 8. Learning Records：像真老師一樣追蹤進度

**重點摘要**：/teach 會把學生的進度記錄在 `learning_records/` 目錄。當學生回報「我學會了 white cross」，skill 會把這個狀態存起來，下次教新內容時會自動調整難度，跳過已會的部分。

**內容**：
- Learning records 結構簡單：每個學生成就 = 一筆記錄
- 範例：Matt 學會 white cross → 記錄 → 下個 lesson 自動跳過 white cross
- 哲學：「Just like a real teacher, then tailor the next lesson to what I need.」
- 對比：沒有 records 的話，每次 /teach 都從頭教 → 無法個人化

### 9. Glossary：參考資料的累積

**重點摘要**：/teach 會持續建立 glossary（術語表），這是 Matt 自己學魔術方塊時發現特別需要的工具。

**內容**：
- Glossary 是一個累積的術語 + 定義列表
- 隨著課程推進，glossary 會逐漸擴充
- 範例：魔術方塊的「F2L」、「OLL」、「PLL」這些縮寫
- 哲學：好的教學不只教 skill，也教 vocabulary — 讓學生能進入那個領域的對話

### 10. ZPD：最近發展區教學法

**重點摘要**：Matt 解釋 /teach 的核心教學法是 Vygotsky 的「最近發展區」(Zone of Proximal Development, ZPD) — 教學生「差一點就會」的東西，而不是「已經會的」或「完全不會的」。

**內容**：
- ZPD 概念：
  - 學生已有能力 = 下限
  - 完全超出學生能力的 = 上限
  - **ZPD = 介於兩者之間、學生在協助下能完成的範圍**
- /teach 怎麼套用 ZPD：
  - 從 mission 知道學生的起點
  - 從 learning records 知道學生已會的
  - 設計 lesson 剛好在「差一點就會」的區間
  - 用 quizzes 確認學生真的會了才前進
- 哲學：太簡單 → 無聊；太難 → 挫折；剛好 → 學習高原

### 11. Use Cases：onboarding、學新技術、debug 思維

**重點摘要**：Matt 列出 /teach 的實際應用場景 — 從 onboarding 新工程師、學新技術棧、培養 debug 思維，到純粹的興趣學習（如他的魔術方塊）。

**內容**：
- **新工程師 onboarding**：
  - 用 /teach 教新人該團隊的技術棧約定
  - 比文件好（互動 + 個人化）
- **學新技術**：
  - 例如：學 Rust、學 Kubernetes、學新 framework
  - /teach 自動找 primary source 整理成課程
- **培養 debug 思維**：
  - /teach 可以教「如何系統性找 bug」這類 meta skill
- **純興趣學習**：
  - Matt 自己用 /teach 學魔術方塊
  - 「Learn anything」 — 任何你想學的東西
- 哲學：好的學習工具應該讓「學任何東西」變得跟「看教學影片」一樣容易

### 12. 結語：開發者是 AI 時代的 first movers

**重點摘要**：Matt 用一句話總結 — 開發者（不是一般大眾）會是 AI 時代的 first movers，因為開發者最懂如何「組裝工具」來完成工作。/teach 就是這個時代的範例 — 開發者不只是用 AI 工具，還自己創造 AI 工具。

**內容**：
- Matt 邀請訂閱他的 newsletter（https://aihero.dev/s/1T2OM1）— 接收新 skill 發布通知
- 開發者 skills repo：https://github.com/mattpocock/skills
- 開發者社群：
  - 互動測試想法
  - 進入領域對話
  - 學到的不只是 knowledge/skill，還有 wisdom
- 哲學總結：「AI 時代的 first movers 是開發者」— 因為開發者懂如何「用 AI 來做 AI 還做不到的事」

---

## 時間軸

```
0:00 Building a teach skill
0:39 Stateful vs stateless skills
2:19 Installing and running teach
2:47 Mission and resources setup
3:30 HTML lessons and interactive content
5:21 Reference materials and glossary
6:11 Continuing a learning session
7:16 Zone of proximal development
8:36 Skill design and philosophy
10:04 Use cases for teach
11:06 Developers as AI first movers
```

---

## 重點引言

> 「I've been teaching stuff for 10 years. Wouldn't it be great if I could take everything I know about teaching and put it inside a skill so that anyone could learn anything?」— Matt Pocock

> 「When you're designing skills, you need to be careful to think about whether they need to be stateless or stateful. Teach needed to be stateful.」— Matt Pocock

> 「I believe that for a teacher to be effective, you need to understand why a student wants to learn the thing.」— Matt Pocock

> 「HTML is just so much richer than markdown, it allows it to be so much more expressive, so much more interactive.」— Matt Pocock

> 「One thing I find really important whenever you're teaching anything is to develop a feedback loop, and quizzes are okay at this.」— Matt Pocock

> 「Just like a real teacher, then tailor the next lesson to what I need.」— Matt Pocock

> 「The only way you're going to develop wisdom about the thing is actually interacting with a community, testing your ideas out in the real world.」— Matt Pocock

> 「Developers are going to be the first movers in the AI revolution.」— Matt Pocock

---

## 核心概念定義表

| 概念 | 定義 | 出處 / 應用 |
|------|------|------------|
| **Skill** | 在 Claude Code 裡可被呼叫的指令集（類似 plugin）| /teach、/grill-me、/grill-with-docs 都是 skill |
| **Stateful Skill** | 會記得先前對話狀態、隨使用累積改善的 skill | Grill with Docs、/teach |
| **Stateless Skill** | 每次執行都是全新狀態，不記得過去的 skill | Grill me |
| **Mission** | /teach 啟動時第一個建立的「為什麼學」聲明 | 影響整個課程方向 |
| **Resources** | /teach 自動從網路蒐集的 primary source 教學素材 | 增量更新 |
| **Lessons** | HTML 檔案，每個 lesson 一個檔案，存於 `lessons/` | 數字編號命名 |
| **Quiz** | Lesson 內的測驗題，建立 feedback loop | 立即 feedback |
| **Learning Records** | 學生進度記錄，存於 `learning_records/` | 個人化調整課程 |
| **Glossary** | 術語表，累積建立的 reference | 進入領域對話用 |
| **ZPD (Zone of Proximal Development)** | Vygotsky 的最近發展區教學法 — 教學生「差一點就會」的東西 | /teach 核心教學邏輯 |
| **Feedback Loop** | 教 → 測 → 調整的閉環 | 教學有效性核心 |
| **Primary Source** | 第一手、高可信度的學習素材 | /teach 搜尋標準 |

---

## 延伸閱讀

- **Matt Pocock Skills Repo**: https://github.com/mattpocock/skills
- **Matt Pocock Newsletter**: https://aihero.dev/s/1T2OM1
- **Total TypeScript**: https://www.totaltypescript.com/（Matt 的 TypeScript 教學平台）
- **Lev Vygotsky**: 《Mind in Society》— ZPD 理論原典
- **Claude Code Skills 文件**: 學習如何自定義 skill
- **Replit 的 /teach、Cursor 的 /learn**: 類似概念的其他實作

---

## 專家視角：教育設計 × AI 工具

從教育心理學 + AI 工具設計兩個視角，專家會這樣解讀 /teach skill：

### 1. /teach 把教學流程「程式化」了

傳統的個人化教學仰賴老師的經驗與直覺，很難規模化。/teach 把教學流程拆成 5 個可程式化的步驟：

| 步驟 | 教育學對應 | AI 工具優勢 |
|------|----------|-----------|
| Mission | 學習動機理論（Self-Determination Theory）| 強制建立 mission → 提升 engagement |
| Resources | 資訊素養（Information Literacy）| 自動過濾 high-trust source |
| Lessons | 微型學習（Microlearning）| HTML 互動設計 |
| Quizzes | 形成性評量（Formative Assessment）| 立即 feedback、自動化評分 |
| Learning Records | 個人化學習路徑（Adaptive Learning）| 累積資料 → 動態調整 |

這個拆解跟 Bloom's Taxonomy、Mastery Learning、Bloom's 2 Sigma Problem 的研究一致 — 個人化教學效果遠優於團體教學，但成本太高。/teach 用 AI 把個人化教學的成本降到接近 0。

### 2. ZPD 從理論變成可執行程式碼

Vygotsky 的 ZPD 概念 1978 年提出後，影響了無數教育實踐，但一直難以規模化 — 因為「找到學生差一點就會的內容」需要即時診斷。/teach 用 AI agent 把這個診斷自動化：

- 從 mission 推算起點
- 從 learning records 推算已會
- 自動設計 lesson 在「剛剛好的難度」
- 從 quiz 結果動態調整

這是 ZPD 概念第一次真正大規模可執行。

### 3. /teach 是 Claude Code 工具設計的範例

從工具設計角度，/teach 展示了幾個關鍵設計原則：

| 原則 | /teach 的實作 |
|------|--------------|
| **Stateful vs Stateless 取捨** | 教學必須是 stateful — 跟 Grill me 的 stateless 形成對比 |
| **Mission 強制性** | 第一步強制問 mission → 避免「沒有目標的學習」|
| **檔案系統作為狀態** | 不用資料庫，用 lessons/、learning_records/ 資料夾管理狀態 — 透明、可讀、可版控 |
| **HTML 而非 Markdown** | 教學需要豐富互動，HTML 才有表達力 |
| **Feedback loop 內建** | 每個 lesson 都有 quiz → 閉環設計 |
| **Community 連結** | 最後推薦社群 → 知識 → 技能 → 智慧的進階路徑 |

Matt 自己也說：「If you can't find a richer feedback loop, quizzes are okay.」— 這是工程師的務實，知道 quiz 不是終點，是起點。

### 4. 開發者 = AI 時代 first movers 的真實意涵

Matt 結語說「開發者會是 AI 時代的 first movers」— 表面上是行銷話術，實際上有深意：

- **開發者懂「組裝」**：不是用 AI 工具就好，是把 AI 工具 + 其他工具組合成 workflow
- **開發者懂「迭代」**：不追求一次到位，而是 release early, iterate often
- **開發者懂「自動化」**：把重複的「教學」這類任務程式化
- **開發者懂「個人化」**：每個人有自己的需求、自己的 stack、自己的學習曲線

/teach skill 本身就是這個論點的證明 — Matt 沒有等「完美的 AI 教學產品」出現，他自己用 13 分鐘的影片 + 一個 skill 就做出來了。

### 5. 給團隊的實作建議

如果你的團隊想用 /teach 風格的工具，幾個關鍵考量：

- **從 stateful 設計開始**：不要從 stateless MVP 開始
- **用檔案系統當資料庫**：透明、可版控、簡單
- **HTML 優先**：互動性是教學體驗的核心
- **Feedback loop 是必須**：沒有 quiz、沒有評估的教學是無效的
- **連結到社群**：知識、技能、智慧是三個層次

---

*筆記整理：Ryo ⚙️🐱 | 資料來源：YouTube 英文自動字幕 (en-orig)，繁體中文重點整理 | 專家視角：教育設計（教育心理學 / AI 工具設計 / DevTools）*
