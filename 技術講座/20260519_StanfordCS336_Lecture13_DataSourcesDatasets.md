# 【Stanford CS336 Language Modeling from Scratch — Lecture 13：Data (Sources, Datasets) — 從網路到 Copyright 的完整 Pipeline】

**主講：Percy Liang（共同授課）｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/-qm0ln33G24
> 影片時長：1 小時 22 分 01 秒（4921s）
> 性質：大學課程第十三講 — Data 第一講：data 不會從天上掉下來——要從 live services 抓、要過 ToS、要處理 copyright 與 fair use
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260519_StanfordCS336_Lecture13_DataSourcesDatasets_逐字稿_en.txt
> **整理日期**：2026-05-19
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Lecture 13 是 CS336 data 兩講的第一講,標誌著從「如何訓練」(Lecture 5-11)與「如何評估」(Lecture 12)進入「用什麼資料訓練」。Percy Liang 主講,主題是 **data sources**——data 不會從天上掉下來,也不是從 Hugging Face 下載就完事。要從 live services 抓取、要應對 terms of service、要處理 copyright、license、fair use 等法律議題。Percy 用 Llama 3 paper 為例:Llama 3 對 architecture 與 training procedures 完整透明,但對 data 完全保密——只說「we train for a variety of data sources and do some stuff」。原因是 data 是 competitive secret sauce 加上 copyright liability 風險。Percy 也用大量篇幅討論 Shane Longpre 的「Consent in Crisis」研究,顯示 robots.txt 與 terms of service 的限制在 2023 年中期後急速增加,從 2020 年到 2026 年「能合法爬的 internet」實際上是 smaller 的。

**核心議題一句話**:Data 是語言模型最關鍵的 ingredient(也是最容易被保密的 ingredient),從網路爬資料不是單純的技術問題——涉及 robots.txt、terms of service、copyright、license、fair use 等多層法律與社會議題;從「公共領域 + Creative Commons + license」三種合法來源,到「fair use 四個因素」的灰色地帶,data sourcing 是 LLM 開發中最 messy 的一環,也是「competitive secret sauce」的所在。

---

## 二、章節脈絡

### Section 1｜開場:Data 是 LLM 的關鍵秘密（00:00 ~ 10:00）

**重點摘要:** Data 是 LLM 最重要的 ingredient——Llama 3 paper 對 architecture 與 training 完全透明,但對 data 完全保密,顯示 data 是 competitive secret sauce。

**內容:**
- Data 是 most important thing to get right in language models
- Llama 3 paper:full transparency 在 architecture(因為 open-weight),但對 data「do some stuff」一筆帶過
- Data 保密的兩個原因:
  1. **Competitive secret sauce**——不讓 competitors 知道
  2. **Copyright liability**——避免被告訴
- Data 在 ML 中一直是 long-tail bottleneck;data teams 與 model developers 規模都很大
- Data 在 pipeline 不同階段:
  - Pre-training:raw documents from the web
  - Mid-training:high quality data, long context
  - Post-training:chat transcripts 等
- Lecture 13 聚焦 pre-training 與 data sources

### Section 2｜Crawling:技術與法律限制（10:00 ~ 30:00）

**重點摘要:** Crawling 不是單純的技術問題——有 robots.txt、terms of service、rate limits、IP blocks、CAPTCHA 等多層限制;Consent in Crisis 顯示 2023 年後 restrictions 急速增加。

**內容:**
- Internet = 一堆 live services,data 要 dump 或 crawl
- **技術限制**:
  - robots.txt——告訴 crawler 哪些路徑不能爬
  - CAPTCHA——驗證是否為 bot
  - IP blocks / country restrictions
  - Rate limits——避免 hammer server(Anthropic 曾被投訴 24 小時打 100 萬次)
  - Read the Docs 也曾被 crawler 打到 load 過高
- **法律限制**:
  - Terms of service(ToS)——禁止 bot crawling 或 AI training
  - Content license——有些內容有 license(permissive 或 restrictive)
- **Consent in Crisis(Shane Longpre 2024)**:
  - 檢視 common datasets 的 robots.txt 與 ToS
  - 結論:限制在 2023 年中期後急速增加
  - Up until 2023,fairly constant;mid-2023 之後 full restrictions 增加到 ~50%
  - Terms of service:2016 年沒人在頁面放 terms,現在大多數頁面都有「不能用於 AI」的限制
- **意涵**:2020 年能合法爬的 internet 與 2026 年能合法爬的 internet 是不一樣的;後者實際上 smaller

### Section 3｜Copyright 與 Public Domain（30:00 ~ 50:00）

**重點摘要:** 網路上幾乎所有東西都有 copyright;但有三種合法來源——public domain、Creative Commons、付費 license;fair use 是第四種灰色地帶。

**內容:**
- Copyright 是什麼:
  - 保護 creator 一段時間(預設 75 年)
  - 不只是 verbatim memorization;plots 與 characters 也可 copyright(Harry Potter 角色可 copyright,但 parody 是 fair use)
  - Copyright 是關於 semantics,不是 N-gram overlap;也關於 economics
- **對 LM 的意涵**:
  - Even 沒 training,僅「copying data」就是 potential violation(這是 copyright 字面意義)
  - Training 模型有 transformative flavor——可能 fair use
  - 不論 copyright,LM 都會 affect the market——這是 fair use 第四個 factor
- **Public Domain**:
  - 超過 75 年的作品都在 public domain
  - 對所有使用者開放,鼓勵 innovation
- **Creative Commons**:
  - 2001 創立,bridging public domain 與 existing copyright
  - 讓 creator 可以「像 public domain 一樣」釋出,大家自由使用
  - 例子:Wikipedia、Open CourseWare、Khan Academy

### Section 4｜Fair Use 與四個因素（50:00 ~ 70:00）

**重點摘要:** Fair use 是 section 107 of Copyright Act;四個因素決定 fair use 是否成立——都不是 hard rule,是 court 來 weighted。

**內容:**
- Fair use 四個 factors:
  1. **Purpose / character of use**:教育 vs 商業(transformative flavor 影響判斷)
  2. **Nature of copyrighted work**:事實性 vs 創意性
  3. **Amount and substantiality**:使用量
  4. **Effect on market**:是否 negatively affect market(若 yes,更可能 not fair use)
- 都不是 hard rule,是 tendencies;需要 court 來 weight
- 訓練 LM 可能 transformative——是把 data 用作 means to extract general idea,不是純粹 rehost
- **市場效應**:即使 fair use,LM 也會 affect market,這對 fair use 不利

### Section 5｜實際法律案件與當前 Landscape（70:00 ~ 95:00）

**重點摘要:** 2023-2025 多起重大 LM 與內容方的訴訟——NYT vs OpenAI、Anthropic $1.5B 和解、Meta 案——顯示 copyright 對 LM 訓練的真實法律風險。

**內容:**
- **NYT vs OpenAI(2023)**:
  - 控訴 ChatGPT 生成近似 verbatim 的新聞文章
  - 案件仍在 pending
- **Anthropic vs Authors(2024)**:
  - 控訴 Anthropic pirated millions of books 訓練 Claude
  - Landmark ruling:training 是 fair use
  - 但 Anthropic 仍因 pirating books 有罪(即使買書 + scan 是 fair use)
  - 結果:$1.5B 和解金,約每本書 $3,000
- **Meta Lawsuit**:
  - 控訴 Meta 訓練於 books
- **注意**:
  - Even if fair use,ToS 可以另外禁止 scraping(另一層限制)
  - YouTube 有 license 但 ToS 禁止 bot 下載
  - Multiple layers of restrictions

### Section 6｜最終總結:Data 是 Rich Topic（95:00 ~ 82:01）

**重點摘要:** Data 不會從天上掉下來,要從 sources 抓、要處理 licensing、copyright、filtering;data 是 LLM 的 key differentiator;過程非常 messy。

**內容:**
- Data 不是從 Hugging Face 下載就好——要 come from somewhere
- Social context:有人要 build crawler,有人要決定 processing
- Filtering 是最重要的——200T tokens 怎麼變 3T tokens
- Data 是 LLM 的 key differentiator——architectures 大致相同,但 data 處理決定最終模型
- Legal 與 ethical issues 多到 lecture 內無法全 cover
- 過程 very messy——不像其他部分基於 first principles,data processing 很多是 vibes-based
- **Punchline**:很多 research 機會在 data,做 assignment 4 時思考有沒有更好的方式

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Data Sources** | Pre-training data 的來源:web crawls、licensed corpora、public domain、Creative Commons、付費 license |
| **Competitive Secret Sauce** | Data 是 LM 開發者的競爭優勢;Llama 3 等 paper 對 data 完全保密的原因之一 |
| **Copyright Liability** | Training on copyrighted data 的法律風險;NYT vs OpenAI、Anthropic 等案件的核心 |
| **Public Domain** | 超過 copyright 期限(預設 75 年)的作品;任何人都可使用,鼓勵 innovation |
| **Creative Commons** | 2001 創立的 license;讓 creator 把作品「像 public domain 一樣」釋出 |
| **Fair Use** | Section 107 of Copyright Act;四個 factors 決定是否成立;不是 hard rule,是 tendencies |
| **Transformative Use** | 使用方式與原作品「purpose 不同」;fair use 第一個 factor 重要考慮 |
| **Robots.txt** | 網站根目錄的 text file,告訴 crawler 哪些路徑可爬、哪些不能 |
| **Terms of Service (ToS)** | 網站對使用者的合約限制;常禁止 bot crawling 或 AI training |
| **Consent in Crisis** | Shane Longpre 2024 研究;顯示 robots.txt 與 ToS 限制在 2023 年後急速增加 |
| **License (Contract Law)** | Licensor 授權 licensee 使用作品的合約;「don't sue me, you can use it in these ways」 |
| **Mid-training** | Pre-training 後,訓練在 high quality data 上以增強特定能力(long context 等) |
| **Post-training** | Chat transcripts 等 RLHF/SFT data;調整模型行為 |
| **Verbatim Memorization** | 模型生成原文;copyright violation 的可能證據,但不是唯一方式 |

---

## 四、重要引用

> "Data is the most important thing to get right in language models." — Percy 在 Lecture 13 開場的核心論點

> "If you look at what companies actually disclose-- here is the Llama 3 paper. They have full transparency into the architecture-- well of course, because it's open-weight model-- they even tell you about their training procedures, but they don't say anything about their data." — Llama 3 paper 對 data 完全保密

> "Data is your competitive secret sauce. Competitive dynamics. You don't want your competitors to know what you're doing." — Data 保密的第一個原因

> "The second thing, which we'll talk a little bit more about, is copyright liability. You don't want to get sued if you tell people you're training on certain types of data." — Data 保密的第二個原因

> "Even if you're not training, even the mere fact of copying-- which is in the word copyright-- is potentially a violation already, even if you don't do anything with it." — Copyright 的字面意義:copying 本身就是 potential violation

> "Training a model... has a transformative flavor. Because it's certainly not-- it certainly seems different than just rehosting another work. It's doing something transformative." — Training LM 可能 fair use 的論點

> "Regardless of copyright, language models can definitely affect the market. So by negatively affecting the market, you are more likely to be ruled not fair use." — Fair use 第四個 factor 對 LM 不利

> "Copyright is not about verbatim memorization... Plots and characters can be copyrightable. So you can copyright Harry Potter the character." — Copyright 不只關於 N-gram overlap

> "Anthropic paid 1.5 billion to settle the authors. So this is about $3,000 a book." — Anthropic vs Authors 的和解金

> "Data has to come from somewhere. And there's also a technical but also social context in which data comes." — Data 的技術與社會雙重來源

> "Filtering is probably one of the most important things. How do you go from 200 trillion tokens to less than three trillion tokens?" — Filtering 在 data pipeline 的關鍵地位

---

## 五、人物 / 角色分析

**Percy Liang**:CS336 共同授課教授,Lecture 13 完全由 Percy 主講。Percy 在 Lecture 13 顯示他對 data ecosystem 與 legal landscape 的深度掌握——從 Llama 3 的保密策略、到 Shane Longpre 的 Consent in Crisis、到 Anthropic 的 $1.5B 和解、到 Creative Commons 與 fair use 四個 factors。Percy 同時強調「data 是 messy topic,不像其他部分基於 first principles」——這也呼應他在 Lecture 12 強調 evaluation 是 deep topic。Lecture 13 是 Lecture 12 evaluation 的延伸——兩者都是 LLM 開發中「不可純算法化、需要社會 + 法律 + 政策考慮」的維度。

---

## 六、核心主旨總結

Lecture 13 把 data sourcing 從「技術問題」拉到「技術 + 法律 + 社會 + 政策」的綜合議題。核心 takeaway:data 是 LLM 最關鍵的 ingredient 也是最 competitive 的 secret;從網路抓資料涉及 robots.txt、ToS、copyright、license、fair use 多層限制;2023 年後能合法爬的 internet 實際上是 smaller 的;合法來源有 public domain、Creative Commons、付費 license 三種,fair use 是灰色地帶(對 LM 來說 transformative flavor 是論點,但 market effect 不利)。**NYT vs OpenAI、Anthropic $1.5B 和解、Meta 訴訟**等案件顯示 copyright 對 LM 訓練的真實法律風險;data processing 是 LLM 開發中最 messy 的一環,也是「vibes-based」的研究機會所在。

---

## 七、金句摘錄

- "Data is the most important thing to get right in language models."
- "Data is your competitive secret sauce."
- "Copyright is not about verbatim memorization... Plots and characters can be copyrightable."
- "Training a model... has a transformative flavor."
- "Regardless of copyright, language models can definitely affect the market."
- "Anthropic paid 1.5 billion to settle the authors. So this is about $3,000 a book."
- "Data has to come from somewhere."
- "Filtering is probably one of the most important things. How do you go from 200 trillion tokens to less than three trillion tokens?"

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽(voice clone, speech-2.8-hd),約 5 分 18 秒
> 口播稿原文:transcripts/20260519_StanfordCS336_Lecture13_DataSourcesDatasets_口播稿.txt

- [opus 1.3 MB](../audio/20260519_StanfordCS336_Lecture13_DataSourcesDatasets_口播稿.opus)(Telegram 友善)
- [m4a 5.2 MB](../audio/20260519_StanfordCS336_Lecture13_DataSourcesDatasets_口播稿.m4a)(iOS 友善)
- [mp3 5.0 MB](../audio/20260519_StanfordCS336_Lecture13_DataSourcesDatasets_口播稿.mp3)(通用格式)