# 【Uncle Bob on Software Fundamentals in the Age of AI】

**講者｜Uncle Bob Martin（Robert C. Martin，「Clean Code」作者）**
**影片連結｜https://www.youtube.com/watch?v=zcLPGC-tvgk**
**影片長度**｜56:39（3399s）
**發布日期｜2026-08-19**
**類型｜Livestream 訪談（Matt Pocock × Uncle Bob Martin）**
**主題｜AI Agent 時代的軟體基礎、工程紀律、戰術 vs 戰略程式設計**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Matt Pocock 在他的 livestream 邀請 Uncle Bob Martin（Robert C. Martin，《Clean Code》《Clean Architecture》《The Clean Coder》作者）談「AI 時代的軟體基礎」。直播現場 Uncle Bob 穿著招牌浴袍開場，訪談從他的 60 年程式設計生涯（1964 年 12 歲在母親送的 3-bit finite state machine 上開始）一路談到他在 2025 年 12 月才開始認真用 AI agent 的真實體悟。

整場對話的核心張力在於：Uncle Bob 主張**軟體基礎（disciplines）在 AI 時代不但沒死，反而比過去更重要**——因為現在終於有「勞動力」能把這些紀律真的執行下去。他援引 John Ousterhout《A Philosophy of Software Design》的「deep modules」與「戰術 vs 戰略程式設計」、Dex Horby 的「smart zone / dumb zone」context window 概念，反覆辯證 AI 對工程紀律帶來的顛覆與強化。

Uncle Bob 對新人學習路徑的具體建議尤其值得劃重點：「**Become the agent. Have the agent delegate to you.**」——年輕工程師應該把自己當成一個 agent，受同樣的 deterministic tools 制約，熬過幾個月錘鍊後才有資格獨立運行自己的 agent。

---

## 章節脈絡

| 段落 | 時間 | 標題 | 一句話摘要 |
|------|------|------|----------|
| 1 | (00:00 ~ 03:30) | 開場 + Uncle Bob 浴袍由來 | 前 porch 清晨 6 點抱怨 SQL injection 的即興錄影意外爆紅 |
| 2 | (03:30 ~ 04:30) | Clean Code 與 60 年資歷 | 12 歲寫第一支程式；Clean Code 是「被引用回來最多次」的書 |
| 3 | (04:30 ~ 07:00) | 第一次認真用 AI（2025-12） | 從「沒什麼印象」到「第一個 Grok agent 寫程式——一直留狗屎要清」 |
| 4 | (07:00 ~ 13:30) | AI 帶來的能力：CRAP score + 突變測試 | 2000 年代沒人力的兩個創新，現在 agent 跑得動了 |
| 5 | (13:30 ~ 16:30) | Smart zone / Dumb zone context window | 開頭 150k tokens 聰明，後面像「房間越來越擠」每個 token 在吼 |
| 6 | (16:30 ~ 22:00) | Multi-agent systems | 平行 + 縮小 context；red-green-refactor 拆 implementer / reviewer / hardener |
| 7 | (22:00 ~ 27:00) | Specifier agent + Gherkin + QA | 用 Gherkin（given-when-then）寫高階驗收測試，QA procedure 跑系統測試 |
| 8 | (27:00 ~ 30:00) | 模組化對 agent 一樣重要 | Well-disciplined interfaces 讓 agent 不必讀整個實作 |
| 9 | (30:00 ~ 34:00) | John Ousterhout 的 deep modules | Shallow = 介面寬內容少；deep = 介面小內容深——剛好是 agent 的最愛 |
| 10 | (34:00 ~ 39:00) | 函式大小門檻變了 | 人類 crap score ≤ 4；agent 容許 6、可能推到 8——但 TDD 仍是底線 |
| 11 | (39:00 ~ 43:00) | 成本崩跌 → 「fiddle fiddle」 | 修改成本趨近零，upfront planning 為什麼還要做？ |
| 12 | (43:00 ~ 46:30) | Spec-driven development 不是規格 | 規格是 ephemeral；終點結果本身就是規格；agent 讀規格，人不讀 |
| 13 | (46:30 ~ 53:00) | 戰術 vs 戰略，新人該被當 agent | 老書（70-80 年代）+ 被 agent 制約幾個月，才學得會戰略 |
| 14 | (53:00 ~ 56:40) | 軟體基礎為何還沒死 | Dijkstra：「軟體是人類做過最複雜的事」；抽象層次每升一階都喊過「會毀掉一切」 |

---

## 關鍵概念定義

| 概念 | 定義 | 角色 |
|------|------|------|
| **Smart zone / Dumb zone** | Dex Horby 提出的 context window 概念；前 ~150k tokens 聰明，後面注意力稀釋 | 解釋為什麼 prompt 要精簡 |
| **Lost in the middle** | Transformer 對中間段的資訊提取能力明顯下降 | 解釋 steering instruction 為何易失效 |
| **CRAP score** | Change Risk Anti-Patterns：測試覆蓋率 × 循環複雜度的綜合指標 | 過去理想化、沒人跑；現在 agent 跑得動 |
| **Mutation testing** | 自動翻轉程式符號（負→正、<→>）測試是否會被現有測試抓出 | 過去慢到不可行；現在 agent 速度解決 |
| **Deterministic tools** | 編譯器、linter、CRAP、突變測試等「不會因為 context 變胖而失靈」的工具 | AI 時代真正能信賴的紀律執行者 |
| **Multi-agent specialization** | 把任務拆給不同專長 agent：specifier / implementer / reviewer / hardener | 縮小 context + 平行 + 工序化 |
| **Red-green-refactor agent pattern** | Implementer 只求「寫壞測試→讓它過」；Reviewer 接手優化；分工明確 | 模擬 TDD 循環 |
| **Gherkin（Given-When-Then）** | 高階驗收測試語法 | Specifier agent 的產出格式 |
| **Deep module（Ousterhout）** | 介面小、隱藏實作深的模組 | Agent 最愛的形狀（不必讀全部 code） |
| **Shallow module** | 介面寬、內容淺的模組 | Agent 看到寬介面會困惑 |
| **Tactical programming** | 戰術程式設計：像士官長處理眼前戰鬥（Ousterhout 詞） | Agent 擅長；人類正被 AI 取代這塊 |
| **Strategic programming** | 戰略程式設計：像將軍規劃整個戰役 | AI 不擅長；新人必須學 |
| **Anchor** | 「不能被反駁」的外部節點（真實測試、真實收入、凍結規則） | 圖工程的誠實底線（同 Anatoli Kopadze 文章的延伸） |

---

## 各章節重點與引用

### 1. 開場 + Uncle Bob 浴袍由來
Matt 介紹 Uncle Bob 直播登場穿著招牌浴袍。原來故事是兩年前某天清晨 6 點在自家前廊思考 SQL injection，順手拿手機錄了段即興 rant，意外爆紅，於是浴袍成了他的 signature。訪談氣氛輕鬆，但整場對話的工程密度極高。

### 2. Clean Code 與 60 年資歷
Matt 提到 Clean Code 是他開發者朋友最常被引用回來的書。Uncle Bob 12 歲（1964）用母親送的 3-bit finite state machine 寫第一支程式；父親陸續買 Fortran / Cobalt / PL1 的書給他，但沒有電腦，所以他在紙上寫、在腦中執行。18 歲拿到第一份正職，從此沒離開過程式設計。

> I started programming when I was 12, in 1964, on a three-bit finite state machine my mother got me for my birthday. And I've been a programmer ever since.

### 3. 第一次認真用 AI（2025-12）
2025 年 12 月聖誕假期，Uncle Bob 開始認真把玩 agent。第一個是早期的 Grok agent，叫它寫 code，表現「很糟」但「真的會寫」。把它拉進進行中的專案協作，發現它**寫 code 很快，但一直留狗屎要清**——最後他意識到：「它很快，但讓我變慢。」

> It's interesting because it's fast, but it's frustrating because it makes me slow.

### 4. AI 帶來的能力：CRAP score + 突變測試
2000 年代有兩個 Uncle Bob 覺得很棒的創新但「不可行」：
- **CRAP score**（測試覆蓋 × 循環複雜度）—— 跑起來簡單，但改 code 太花時間
- **突變測試**（mutation testing）—— 自動翻轉負號、<、> 等，看現有測試能否抓到

兩個都是好點子但沒人力做。AI agent 速度剛好補上這個 gap，現在他同時跑 CRAP + 突變測試來驗證 agent 的輸出。

> The point is: because it's fast, it can do things that I cannot.

### 5. Smart zone / Dumb zone context window
Uncle Bob 引用 Dex Horby 的概念：context window 前段（~150k tokens）很聰明，越後面 transformer 的注意力越稀釋。Agent 會「忽略中間的東西」，前面寫的 steering 指令如果太長，會被擠進「dumb zone」而失效。

**解法**：把 steering 砍到最小，把確定性檢查（deterministic tools）放在 prompt 之外，事後用 loop 強制 agent 修到通過。

> Once again, the agent will ignore the stuff in the middle. And anything you say at the very beginning is going to get shoved into the middle if it's long.

### 6. Multi-agent systems
Matt 對「百個 agent 各有 email 帳號互相對話」的炒作有點感冒，但承認 implementer + reviewer + hardener 三件式例外有效。Uncle Bob 補上兩個好處：
1. **平行**——他筆電可以同時跑 3 個 coder
2. **context 控制**——每個 agent context 獨立，lost-in-the-middle 問題變小

代價是 startup time（10-15 秒），所以他聚焦任務範圍。他的工作流是「specifier 把人類文件轉成 Gherkin + QA procedure → 餵給下游 agents」。

> You focus the agents down to a single task, you're keeping the context window under control.

### 7. Specifier agent + Gherkin + QA
Specifier agent 的工作：把人寫的文件轉成 (a) Gherkin（given-when-then 高階驗收測試）+ (b) QA procedure（系統測試程序）。QA agent 跑整套測試。這條 pipeline 把「驗收條件」從模糊自然語言變成可執行的測試規格。Uncle Bob 進一步用一個「dependency 規範器」決定模組間依賴方向，agent 違反就倒過來修。

### 8. 模組化對 agent 一樣重要
這是 Uncle Bob 與 Matt 最有共鳴的一段。Well-disciplined modules + clean interfaces 不只是給人看的，**agent 也需要**。如果一個 module 介面寬、塞一堆不相關功能，agent 會卡住「我到底在這裡做什麼」。和 Ousterhout 的 coffee-and-soap opera 比喻呼應：別把不相干的東西混進同一個 module。

> If you load up a module with every bit of stuff under the sun, the poor agent is going to wonder, "What the heck am I doing in here?"

### 9. John Ousterhout 的 deep modules
Matt 提到 Ousterhout《A Philosophy of Software Design》的「deep modules」概念：small interface + hidden implementation depth。Uncle Bob 立刻接上：**這對 agent 來說特別合適**，因為 agent 看介面就能用，不必讀完整個實作。但介面命名要一致，否則 agent 會誤解。

> They pay attention to interface names. They pay attention to the structure. It can allow them to not read the code beneath them, which is both a danger and an advantage.

順便補一個八卦：Uncle Bob 的書附錄有他和 Ousterhout 的完整辯論，Matt 說他看完整場 YouTube 訪問，非常精彩。

### 10. 函式大小門檻變了
Matt 問：「你書裡教的『小函式』，在 AI 時代要改嗎？」Uncle Bob 的答案務實到不行：

- **人類**：CRAP score ≤ 4
- **Agent**：CRAP score ≤ 6，可能推到 8
- **底線沒變**：100% test coverage + 限制循環複雜度

Agent 的短期記憶比人類準，這是門檻可以放寬的唯一理由。但 TDD 仍然必須，因為「你不能信任跟 agent 的任何辯論」。

> One of the things that I do is I widen the allowed size of a function. I do that by adjusting the CRAP score. So for a human I would keep CRAP numbers below four. But for the agents I've set this at six.

### 11. 成本崩跌 → 「fiddle fiddle」
這是全場最震撼的一段。Matt 引「cost of change curve」說明過去 upfront design 划算；Uncle Bob 直球回應：

> The cost of change has plummeted to as close to zero as I think we're ever going to get it. Why would you do this upfront planning because that's expensive? Why wouldn't you just fiddle fiddle fiddle until it looks right?

他把這種「try → check → adjust → repeat」的迭代文化當成新常態。**不是反對設計，而是反對「過度前置設計」**——Fiddle 到對就好，specifications 因此變得 ephemeral（稍縱即逝）。

### 12. Spec-driven development 不是規格
Matt 對「spec-driven development」這個 label 有意見，因為它太含糊：每次給 agent prompt 也可以叫 spec-driven。Uncle Bob 補一刀：「我不持久化規格。規格是 ephemeris，會一直變。」

他的做法反過來：**終點結果本身就是規格**。他不寫 spec，他寫 tools（CRAP、突變測試、agent harness）然後叫 agent 看這些 tools、自己 build 一個屬於自己的版本。

> Don't download those. I wrote them for me. What you should do is point your agents at them, have the agents look at them, and then build one for you.

另外一個尖銳觀察：給人類一份長規格，可能 5-20% 的命中率；但**給 agent 同一份規格，它真的會讀**。反過來，agent 寫的人類不讀——「It's so one-sided」。

### 13. 戰術 vs 戰略，新人該被當 agent
Matt 借 Ousterhout 的「tactical vs strategic programming」收尾：tactical 是士官長打眼前仗，strategic 是將軍看整個戰役。Agent 戰術超強、戰略超弱。

問題是：**現在新人要怎麼學戰略？** 因為 AI 把戰術工作都吃掉了，新人沒機會練習。

Uncle Bob 的答案非常具體：

> You should be writing code for a year. The next thing: when you get hired into a company that makes heavy use of agents, the young person should be treated like an agent. Give them the same tasks, subject them to the same deterministic tools. Spend several months being horribly unproductive but learning a hell of a lot.

新人學習路徑：寫 code 一年 → 進公司被當 agent 制約幾個月 → 讀老書（DeMarco、Yourdon、《Pragmatic Programmer》，70-80 年代的戰略思維）→ 「Become the agent. Have the agent delegate to you.」

> If you've never written assembly language, you should spend the weekend writing assembly language just so you know what's really going on behind the scenes. — 對應到現在：寫 assembly → C → Python → agent + deterministic tools → 戰略監督。

老書之所以重要：「Lessons were learned in the 70s and 80s — that's when these lessons were learned.」

### 14. 軟體基礎為何還沒死
Matt 最後一擊：「聽起來軟體基礎還是重要？」Uncle Bob 給出整場最強的一段話（歸功 Dijkstra）：

> Software is the most complicated thing that humans have ever attempted to do. More complicated than any other task that we've tried. The fundamentals are the way of organizing that complexity into a form that can be conceived — not just by humans, but by our models as well, since our models are modeled after humans after all.

接著補上抽象層次的歷史對照：binary → assembly → compiler → model，每升一階都有人喊「會毀掉一切」、「五歲小孩都能寫 code」。「At every step it's the same.」

結尾 Plato 的呼應：writing 會讓人變笨；agent 會讓人變笨；同樣的抽象恐懼從希臘人到 2026 年都一樣。

> The rules you throw away are the ones you're going to pick up off the floor in a year and dust off and remember why you need them.

---

## 人物 / 角色分析

### Uncle Bob Martin（Robert C. Martin）
- **身份**：軟體工程界傳奇，Clean Code 系列的作者，Agile Manifesto 簽署人之一
- **這場訪談的角色**：60 年資深工程師面對 AI 衝擊的第一手反思者
- **核心立場**：disciplines 沒死；CRAP score、突變測試、模組化等過去「沒人跑」的工具，現在因為 AI agent 的速度而成為日常
- **獨特觀點**：把 2000 年代的「不可行創新」重新拿出來用；用 deterministic tools loop 取代 steering instruction；新人被當 agent 制約幾個月才能學戰略

### Matt Pocock（主持人）
- **身份**：TypeScript / AI 開發者教育者（Total TypeScript、aihero.co）
- **這場訪談的角色**：提問者 + 異議者（代表「agent 化」年輕一代的視角）
- **核心動作**：把 John Ousterhout 的 deep modules 拉進對話；質疑「spec-driven development」標籤；追問新人學習路徑
- **獨特觀點**：對「百個 agent 互相 email」的炒作保持懷疑；偏好 implementer / reviewer 兩件式而非多 agent 大雜燴

### John Ousterhout（被引用）
- **身份**：Stanford 教授、《A Philosophy of Software Design》作者、Tcl / Tk 創造者
- **被引用的概念**：deep modules、戰術 vs 戰略程式設計
- **與 Uncle Bob 的關係**：在 Clean Code 附錄有完整辯論（Matt 看了全程 YouTube 訪問）

### Dex Horby（被引用）
- **身份**：AI 工程師 / 內容創作者
- **被引用的概念**：smart zone / dumb zone context window 分區

---

## 核心主旨總結

Uncle Bob 的中心論點可以用一句話濃縮：

> **「過去 30 年工程界覺得太貴而沒人跑的那些紀律（CRAP score、突變測試、模組化、clean interfaces），現在因為 AI agent 的速度成本，終於變成可行且必要。Disciplines 沒死，只是換了執行者。」**

支撐論點的 4 個支柱：
1. **AI 是紀律的執行者，不是紀律的取代者**——steering prompt 會被 lost-in-the-middle，但 deterministic tools 不會
2. **context window 是新瓶頸**——解法是 multi-agent specialization + clean module interfaces
3. **成本曲線已變**——fiddle 到對就好，specifications 是 ephemeral，終點結果才是規格
4. **戰略能力比戰術能力更值錢**——新人要把自己當 agent 制約 + 讀 70-80 年代老書

---

## 金句摘錄

> It's interesting because it's fast, but it's frustrating because it makes me slow. — Uncle Bob 談第一次用 AI 的挫折

> Because it's fast, it can do things that I cannot. — 為什麼 CRAP + 突變測試終於可行

> Anything you say at the very beginning is going to get shoved into the middle if it's long. — Lost-in-the-middle 警訊

> Don't download those. I wrote them for me. What you should do is point your agents at them, have the agents look at them, and then build one for you. — Uncle Bob 對「直接用別人工具」的回應

> If you load up a module with every bit of stuff under the sun, the poor agent is going to wonder, "What the heck am I doing in here?" — 模組化對 agent 也重要

> The cost of change has plummeted to as close to zero as I think we're ever going to get it. — 為什麼 spec 是 ephemeral

> Why wouldn't you just fiddle fiddle fiddle until it looks right? — 新時代工程文化

> Software is the most complicated thing that humans have ever attempted to do. — Dijkstra via Uncle Bob

> The fundamentals still apply because that's the way we organize complexity to be conceived. — 為什麼 disciplines 沒死

> You cannot lose the code entirely. — 對「不學寫 code」的回應

> Become the agent. Have the agent delegate to you. — 新人學習戰略的核心建議

> The rules you throw away are the ones you're going to pick up off the floor in a year and dust off and remember why you need them. — 抽象層次的歷史規律

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 4 分 30 秒
> 口播稿原文：transcripts/20260819_UncleBob_SoftwareFundamentalsInTheAgeOfAI_口播稿.txt

- [opus 2.8 MB](../audio/20260819_UncleBob_SoftwareFundamentalsInTheAgeOfAI.opus)（Telegram 友善）
- [m4a 4.6 MB](../audio/20260819_UncleBob_SoftwareFundamentalsInTheAgeOfAI.m4a)（iOS 友善）
- [mp3 4.4 MB](../audio/20260819_UncleBob_SoftwareFundamentalsInTheAgeOfAI.mp3)（通用格式）