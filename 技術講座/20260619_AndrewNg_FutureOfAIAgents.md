# 【The Future of AI Agents — Andrew Ng × Harrison Chase @ LangChain Interrupt】

**主講：Andrew Ng（Landing AI / DeepLearning.AI / AI Fund / AI Aspire 創辦人）｜主持：Harrison Chase（LangChain CEO）｜LangChain Interrupt 26 Fireside Chat｜2026 年**

> 影片連結：https://youtu.be/OaRhpwz_TGM
> 影片時長：31 分 39 秒（1899s）
> 性質：產業 fireside chat + Q&A
> 來源：YouTube 自動英文字幕（en VTT，自動滾動字幕累積已清除）
> 英文逐字稿：transcripts/20260619_AndrewNg_FutureOfAIAgents_逐字稿.txt

---

## 一、主題與背景

本場是 LangChain 一年一度的 Interrupt conference 中 Andrew Ng 與 Harrison Chase 的 fireside chat 第二年回歸。Andrew Ng 是 Landing AI、DeepLearning.AI、AI Fund、AI Aspire 的創辦人,並與商界夥伴 Christy Tan 共同經營 AI Aspire（AI 顧問公司）。本場對談從「過去一年 AI agent 進展」一路聊到「企業 AI 轉型的實戰挑戰」,涵蓋 coding agent 演進、product management bottleneck、generalist pod 組織型態、building blocks + LEGO 比喻、Context Hub、教育轉變、企業 bottom-up vs top-down 採納、ROI 量測、FTE（Forward-Deployed Engineer）熱潮、開源模型困境,以及未來資料架構重設計。

核心議題一句話：**AI agent 不再只是 coding agent 的工具競賽,而是企業組織形態、資料架構、教育模式、商業策略的全面重塑——而其中最被低估的,是「資料架構重設計」與「保 vendor optionality」這兩條底層邏輯**。

---

## 二、章節脈絡

### Section 1｜開場與過去一年回顧（00:00 ~ 02:00）

**重點摘要：** Andrew 點出 hype 與 doomsaying 都比預期更猛,但 coding agent 是真的超出預期。

**內容：**
- 去年(2025)的 fireside 是 YouTube after-hours 最受歡迎的影片,今年第二年回歸
- Hype 超出預期,doomsaying（特別是 jobpocalypse）也被過度渲染
- Coding agent 進展**真的快**——Andrew 自己一年前幾乎只用 Claude Code,如今混用 Codex / Gemini CLI / OpenCode
- 工作流變化:在**手機**上寫 code 成為日常;Mac mini 等 host 環境普及
- Agentic workflows 開始進入企業,但仍在早期

> "Coding agents probably took off faster than I would have guessed. And the frontier coding agents... it feels like the frontier of what we can do is so competitive."

---

### Section 2｜Product Management Bottleneck 升級（02:00 ~ 06:00）

**重點摘要：** 一年前 Andrew 提出 PM bottleneck;一年後發現「寫 code 變快」讓**所有事情都變成 bottleneck**。

**內容：**
- **原版 PM bottleneck**:寫 code 變快 → 決定做什麼變慢
- **升級版**:不只是 PM,marketing、legal、design、data infra 全部變成新瓶頸
- 案例:以前 build 3 個月 → 等 legal 1 週沒差;現在 build 1 天 → 等 legal 1 週 = 法律瓶頸
- 解決方案:**小 pod（1-10 人）、高 context、highly empowered generalists**
- 套用 pigeonhole principle:若 2 個人要 cover 5 個職能,每人必跨多 role
- AI 讓工程師「slightly less bad」當 marketer — 不是變好,但從不可用變勉強可用
- 每個工程師都能用 AI 起草 terms of service,再讓律師最後潤稿

> "If you build in a day, then wait a week for legal to sign off, that's a legal compliance bottleneck."

---

### Section 3｜Generalist Pod 的人選背景（06:00 ~ 07:50）

**重點摘要：** 目前最多成功的 generalist 來自工程背景,但任何背景的人都能進場。

**內容：**
- 最多成功的仍是工程師 — 因為理解 frontier tech 有天然優勢
- 但 PM、marketer、operations people 都開始有效 coding 並參與這些 pod
- 鼓勵「任何背景」嘗試 — 進入障礙比過去低很多
- 重點不是「學什麼」,而是「能不能 acquire 這個 mix of skills」

---

### Section 4｜LEGO Building Blocks 與組合性開發（07:50 ~ 09:50）

**重點摘要：** Agentic 時代讓 building blocks（LEGO 積木）激增;能掌握足夠積木的開發者可以組合性地 build 任何東西。

**內容：**
- Building blocks 包括:RAG、agentic frameworks、evals、guardrails、UI 元件、identity、DB 等
- Agentic coding 讓更多 open source / proprietary API 型 building blocks 湧現
- **LEGO 比喻**:只有白色積木只能蓋簡單東西;加入黑黃棕綠 + 異形件,可組合的可能性**指數級成長**
- DeepLearning.AI 提供大量 short courses 幫開發者 master 這些 building blocks
- 真正的挑戰:用 coding agent 把這些 blocks 組裝起來

> "Building blocks are proliferating... the what I can build grows combinatorially or grows exponentially as a function of the number of Lego bricks I have."

---

### Section 5｜Context Hub:Stack Overflow for AI Agents（09:50 ~ 10:05）

**重點摘要：** Andrew × Rohit Prasad 推出 Context Hub,讓 agent 取得最新 API/SDK 文件,解決 knowledge cutoff 問題。

**內容：**
- 領先的 coding agent 對新工具（如 Nano Banana）一無所知 — 因為 knowledge cutoff
- Context Hub = 「給 AI agent 用的 Stack Overflow」
- 讓 agent 能讀最新文件、對文件給 feedback、迭代改進
- Andrew 自己用 Context Hub load 討人厭的 API syntax,讓 coding agent 自動 make 正確 calls
- Harrison 笑說 LangChain 也推出同名但不同產品的 Context Hub

---

### Section 6｜教育轉變:LearnDream.ai / codedream.ai（10:05 ~ 11:46）

**重點摘要：** DeepLearning.AI 嘗試用「可互動的 JavaScript 視窗 + 模擬 video call」取代靜態影片。

**內容：**
- 過去十年在線教育的最大變化:互動性增加、視覺化加強
- 但 Andrew 認為「教育轉型」被過度 hype — 現在仍沒有比十年前「根本性地好」的東西
- 新實驗（LearnDream.ai / codedream.ai）:
  - 不是課程,而是**模擬 video call**
  - 使用者可中斷「Andrew 的 AI」、問問題
  - 影片區是 **JavaScript** 而非靜態影片 — 可在影片中輸入自己的 prompt 試
- 「Replace videos and slides with JavaScript」 — 螢幕分享變 JavaScript 分享

> "Rather than taking online course, come and have a conversation... instead of me screen sharing in a video, I am JavaScript sharing in the video."

---

### Section 7｜企業 AI 採納:Bottom-up vs Top-down（11:46 ~ 18:00）

**重點摘要：** Bottom-up innovation 本身沒錯但單獨做不出 ROI;需要 top-down 重設計整個 workflow。

**內容：**
- AI Aspire 與 Fortune 50/500/G2000 企業合作看見的一致 pattern:
  - CEO 與董事會都在問「AI 的 ROI 在哪」
  - 「Let a thousand flowers bloom」策略大多是**point solutions** + 增量效率,不是 transformation
- **銀行貸款案例**:5 步流程中只自動化中間一步 = 小幅效率;若重設計整個 workflow = 「10-minute loan approval」轉型產品
  - 必須 marketing、data infra、AI decision、final diligence 全部一起改
  - 需要 someone with **broadest scope** 重新設計 — 這就是 top-down 的價值
- **其他案例**:
  - 客服中心:cost savings 之外,「serve customers much faster」能 drive growth
  - drive-thru AI 點餐:delightful experience + growth
- **核心主張**:**Drive growth, not cost savings** — 你只能省這麼多錢,但 growth 幾乎沒有 ceiling

> "Bottom-up innovation is really valuable, generates lots of ideas, but often it takes... a top-down motion of having someone with a broader scope to change how all of these steps operate to then create growth."

---

### Section 8｜ROI 量測:增量比轉型更難（18:00 ~ 20:00）

**重點摘要：** 要求「2% 改善」比要求「50% growth」更難,因為前者要每個人多努力,後者強迫你找 creative solutions。

**內容：**
- Andrew 沒有 universal ROI 量測法 — 企業差異太大
- 但觀察:**driving 2% incremental gain is harder than driving 50% transformative gain**
- 原因:2% → 老闆叫你工作 2% 賣力;50% → 你必須想 creative solutions
- Big bets 不該 single wild swing,而是 **portfolio of handful of thoughtful bets**
- 客戶痛點:某金融機構給 Andrew 一份 300 個 AI 想法的試算表,請他幫忙篩出要投的
  - 篩選本身就是**極大工作**:technical feasibility + business impact 都要分析
  - 最後 narrow 到 handful of bets 才有資源投注

> "Sometimes driving incremental gains is harder than driving transformative gains... you can't just get everyone to work 50% harder and you have to come up with more creative solutions."

---

### Section 9｜Forward-Deployed Engineers(FTE)與 Vendor Lock-in（20:00 ~ 23:00）

**重點摘要：** FTE 是好主意,但 vendor lock-in 是大風險;Andrew 個人偏好 ≤1 年合約保 optionality。

**內容：**
- FTE 在 Silicon Valley 確實 having a moment
- 預測:多數企業會有「**少量 FTE** + **大量 in-house AI engineer**」的組合
- FTE 工作的價值:懂業務、customer-facing、evals、change management
- **核心風險**:vendor-neutral FTE 很難找 — 領先 AI model 一年內可能換家
- **Andrew 的個人習慣**:**幾乎不簽超過 1 年合約**,即使廠商提供 20-30% discount
  - 因為他不知道一年後哪個 model/agent 會是 leading
  - Optionality > 折扣
- LangSmith 等 vendor-neutral observability 工具特別有價值

> "I personally almost never sign longer than a 1-year contract... regardless of the discounts offered, because I value that optionality."

---

### Section 10｜Open Source 與 White House 政策（23:00 ~ 24:30）

**重點摘要：** Open weight 模型落後 frontier 6-9 個月但價格便宜;Andrew 警告白宮審查模型的政策是「對 open source 的戰爭」。

**內容：**
- Open weight 模型持續落後 frontier 6-9 個月,但 frontier 太貴 → 很多 use case 用 open weight
- 過去兩週白宮有「release 前審查模型」的政策討論,Andrew 對此感到擔憂
- 他已向幾位政府友人表達意見
- 「**A war on open source open weight models is being waged**」 — 有時以美中競爭為名,有時以其他論點
- Andrew 呼籲大家保護 open source / open weight,既讓世界更豐富,也保 optionality

> "If we can all protect open source open weight, it will make the world much richer and also help all of us preserve optionality."

---

### Section 11｜資料架構重設計：下一個十年的大工程（24:30 ~ end）

**重點摘要：** AI 時代最大的資料挑戰不是結構化資料,而是 unstructured data 的組織——這將是未來數年數億美元等級的工程。

**內容：**
- 過去 10-20 年企業把結構化資料（tables、spreadsheets）整理得很好
- 現在 AI 能處理 unstructured data（text、images、PDF、audio、video）— 但這些資料的組織變**更重要**而非更不
- Andrew 的觀察:市場上**沒有 single good solution** 處理 unstructured data
- AI Fund / AI Aspire 內部在實驗自己的 rearchitecture
- **預測**:未來幾年企業會花**數千萬到數億美元**重做 data architecture
- **現有架構的問題**:
  - Fragmentation — 資料散落各處
  - Governance — permissions 設計給人類,不是 agent
  - 「Does the agent inherit my permissions?」是治理大哉問
  - PDF 桶中堆了 20 年沒人看的文件（金融業合規用）— 突然可以讓 AI 看
- **MongoDB 個人偏好**:NoSQL 對 AI prototyping 友善
  - Schema-less → 不需要 refactor 整個 DB 加欄位
  - AI 偶爾會「聰明地刪掉整個 DB」做 migration — NoSQL 降低風險
  - 規模到大 production 還是用 relational,但 prototyping 用 NoSQL 大幅加速

> "There will be very large... tens of millions, maybe hundreds of millions of dollars of projects in many businesses to rethink their data architecture."

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處 / 應用 |
|------|------|-----------|
| **Product Management Bottleneck** | 寫 code 變快後,決定做什麼變瓶頸 — Andrew 一年前提 | Section 2 |
| **Everything-Bottleneck** | 升級版:PM bottleneck 解決後,marketing/legal/design 全部變瓶頸 | Section 2 |
| **Generalist Pod** | 1-10 人小團隊、高 context、跨職能 — pigeonhole principle 驅動 | Section 2-3 |
| **Pigeonhole Principle** | n 隻鴿子放進 m 個洞,m<n → 至少一個洞有兩隻以上 — 應用於 small team 必須跨 role | Section 2 |
| **LEGO Building Blocks** | Building blocks（API、framework、tool）越多,可組合的可能性指數成長 | Section 4 |
| **Context Hub** | Stack Overflow for AI agents — 讓 agent 取得最新 API/SDK 文件 | Section 5 |
| **LearnDream.ai / codedream.ai** | DeepLearning.AI 的實驗產品:模擬 video call + JavaScript 互動視窗 | Section 6 |
| **Bottom-up Innovation** | 「Let a thousand flowers bloom」策略 — 產生 point solutions 與增量效率 | Section 7 |
| **Top-down Redesign** | 有人有 broadest scope 重設計整個 workflow（如 10-min loan approval）| Section 7 |
| **Drive Growth, Not Cost Savings** | AI 真正的價值是 growth,不是 cost saving — growth 沒 ceiling | Section 7 |
| **Portfolio of Big Bets** | 不 single wild swing,而是 handful of thoughtful bets;若任何一個 pay off 就有意義 | Section 8 |
| **2% vs 50% Growth** | 2% 增量改善比 50% transformative growth 更難 — 因為前者要每個人多努力 | Section 8 |
| **FTE (Forward-Deployed Engineer)** | 廠商派遣進客戶端、懂業務 + customer-facing 的工程師 | Section 9 |
| **Vendor Optionality** | 不被單一廠商鎖死 — Andrew 個人偏好 ≤1 年合約 | Section 9 |
| **Open Weight Models** | 開源權重模型,落後 frontier 6-9 個月但便宜 | Section 10 |
| **Data Architecture Rework** | 未來幾年企業將花數億美元重做資料架構,讓 unstructured data 對 AI/agent ready | Section 11 |
| **NoSQL for AI Prototyping** | MongoDB 等 schema-less DB 對 AI 友善 — 避免 refactor + 降低「聰明刪 DB」風險 | Section 11 |
| **Inherit Permissions** | 「Agent 是否繼承人類使用者的權限」是治理核心問題 | Section 11 |

---

## 四、人物 / 角色分析

### Andrew Ng — 主講
- 背景:Landing AI / DeepLearning.AI / AI Fund / AI Aspire 創辦人;Coursera 共同創辦人;前史丹佛 CS 教授;百度前首席科學家
- 關鍵角色:本場 podcast 的智識權威,以企業顧問視角看 AI 轉型
- 代表觀點:**「Drive growth, not cost savings」** + **「保 vendor optionality」** + **「保護 open source」** + **「未來是 data architecture 數億美元大工程」**
- 個人習慣:用 Claude Code / Codex / Gemini CLI / OpenCode 混用;MongoDB prototyping;不簽超過 1 年合約;在手機上寫 code

### Harrison Chase — 主持人
- 背景:LangChain CEO、LangSmith 創辦人
- 角色:提問者,問題涵蓋從 coding agent 演進到企業 FTE 策略
- 關鍵貢獻:問出 Andrew 對 vendor lock-in、open source、data architecture 的真實看法

### Christy Tan — 引用但未出席
- 角色:Andrew 的商界夥伴,AI Aspire 共同創辦人
- 與 Andrew 的合作:與 Fortune 500/G2000 企業談 AI 策略

### Rohit Prasad — Context Hub 共同作者
- 角色:Andrew 的朋友,Context Hub 共同作者
- 貢獻:解決 agent 對新工具知識斷層的問題

### CJ — 下一位 speaker
- 角色:MongoDB 關鍵人物(Andrew 玩笑提到「希望 CJ 別介意」)
- 與本場連結:Andrew 用 MongoDB 做 AI prototyping 的個人偏好

---

## 五、核心主旨

> **AI agent 的下一階段不是 model 競賽,而是組織形態（generalist pod）、資料架構（unstructured data 重設計）、商業策略（drive growth, not savings）與生態系治理（保護 open source、保 vendor optionality）的全面重塑——企業若只在 bottom-up 做 point solutions,將錯過 AI 真正的 transformation 紅利;真正的贏家會是那些敢做 top-down workflow redesign、並把資料架構當作未來五年最大投資的組織。**

---

## 六、金句摘錄

1. "Coding agents probably took off faster than I would have guessed." — 開場對過去一年的總結
2. "If you build in a day, then wait a week for legal to sign off, that's a legal compliance bottleneck." — Everything-Bottleneck 的具體圖像
3. "The what I can build grows combinatorially or grows exponentially as a function of the number of Lego bricks I have." — LEGO 比喻
4. "Drive growth, not cost savings." — 整場 AI 商業策略的核心主張
5. "Sometimes driving incremental gains is harder than driving transformative gains." — ROI 量測的逆直覺
6. "I personally almost never sign longer than a 1-year contract." — Vendor optionality 的極致實踐
7. "A war on open source open weight models is being waged." — 對白宮審查政策的嚴厲警告
8. "There will be tens of millions, maybe hundreds of millions of dollars of projects... to rethink their data architecture." — 對未來五年資料工程市場的預測

---

## 七、延伸閱讀 / 參考

- LangChain Interrupt 26:https://interrupt.langchain.com
- DeepLearning.AI Short Courses:https://www.deeplearning.ai/short-courses/
- LearnDream.ai / codedream.ai（DeepLearning.AI 新實驗）
- Context Hub:Andrew Ng × Rohit Prasad 共同作品
- Andrew Ng 個人 LinkedIn 文章（搜尋 "product management bottleneck"）
- AI Fund / AI Aspire（顧問服務）
- 上集相關:**Matt Pocock Agentic Engineering Workflow**(個人開發者的 harness-centric 觀點);**AWS Show & Tell AgentCore SDLC**(雲端版的 SDLC pipeline)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd）,約 7 分 42 秒
> 口播稿原文:transcripts/20260619_AndrewNg_FutureOfAIAgents_口播稿.txt

- [opus 3.7 MB](../audio/20260619_AndrewNg_FutureOfAIAgents.opus)（Telegram 友善）
- [m4a 7.3 MB](../audio/20260619_AndrewNg_FutureOfAIAgents.m4a)（iOS 友善）
- [mp3 7.1 MB](../audio/20260619_AndrewNg_FutureOfAIAgents.mp3)（通用格式）
