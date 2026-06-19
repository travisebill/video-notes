# 【Matt Pocock's Agentic Engineering Workflow — Harness First, Model Second】

**David Ondrej 採訪 Matt Pocock（AI Hero 創辦人、Sandcastle 框架作者、TypeScript 教育者）｜2026/06/18 直播｜約 62 分鐘**

> 影片連結：https://youtu.be/nQwJVHCtDDY
> 影片時長：62 分 24 秒（3744s）
> 性質：技術 podcast 對談（David × Matt）+ 中段 live demo `/teach` skill
> 來源：YouTube 自動英文字幕（en-orig VTT，自動滾動字幕累積已清除）
> 英文逐字稿：transcripts/20260619_MattPocock_AgenticEngineeringWorkflow_逐字稿.txt

---

## 一、主題與背景

Matt Pocock 是英國知名的開發者教育者,曾以 TypeScript 教學聞名,2025 年起轉向 AI 編碼教育,創辦 AI Hero 線上課程平台,並開發了開源的 **Sandcastle** 多代理編碼沙盒框架。本場 podcast 由 David Ondrej 主訪,Matt 完整拆解他個人的「agentic engineering workflow」——從 `/teach` skill 的設計哲學、procedural skill vs ability 區分,到他如何在 Claude Code 之外用 Sandcastle + GitHub Actions 把 agent 推到雲端並平行運行。

Matt 的核心觀點明確反主流：**他認為社群對「模型」過度著迷,真正的槓桿在 harness**——prompt 品質、skill 設計、codebase 結構才是開發者真正能掌控的變因。這也是 OpenAI 內部 Ryan Lopopolo 同週提出的「harness engineering」主張的延伸,但 Matt 走得更遠:他不只把 harness 視為工程方法論,更把它升級為**程序化知識(knowledge)與技能(skills)的容器**,把 senior 開發者的直覺打包成可重用、可分配、可團隊協作的 skill bundle。

---

## 二、章節脈絡

### Section 1｜開場宣言:Harness > Model(0:00 ~ 1:30)

**重點摘要:** Matt 開場即點出核心主張 — 所有人都在談論 model,但開發者真正能掌控的是 harness(prompt + skill + 環境)。

**內容:**
- Model 是 Formula 1 的引擎,harness 是底盤與空氣動力學,引擎只占一部分
- 比起換 model,優化 harness 才是開發者能完全掌控的變因
- 具體能做的:給對的 prompt、給對的 skill、改善 model 跑的環境
- Fable 釋出當週,他堅持等一個月再評估,「不再被噪音牽著走」

> "Everyone's obsessed with the model and I think they should be more interested in the harness... giving it the right prompts, giving it the right skills to work with and improving the environment in which the model runs."

---

### Section 2｜Tactical vs Strategic Programming(1:30 ~ 5:00)

**重點摘要:** 借用 John Ousterhout《A Philosophy of Software Design》的戰術/戰略區分,Matt 指出 AI 已經吃掉戰術編程,所以開發者必須強化戰略思維。

**內容:**
- **Tactical programming**:寫程式碼、除錯、commit 等日常動作
- **Strategic programming**:贏得戰爭的長期思維 — codebase 應該長什麼樣、如何提升 velocity、如何設計模組介面
- AI「吃掉了」tactical programming — 比人類便宜、又快,所以人類必須專注 strategic
- 程式設計本質沒變,只是把「delegate 給 junior 工程師」換成「delegate 給 AI」

> "AI has basically eaten tactical programming. It's gone, right? It's all gone. So you need to be great at strategic programming in order to get the most out of this infinite fleet of tactical programmers that you now have access to."

---

### Section 3｜Skills 是 AI 的天花板(5:00 ~ 10:00)

**重點摘要:** Matt 提出「你的 skills 是 AI 的天花板」 — senior 開發者用 AI 可以 10 倍速,junior 只能一點點 boost。

**內容:**
- AI 對 senior 的放大效果遠大於 junior — 業界 CTO 普遍觀察
- 原因:senior 知道「如何 overseer codebase」、「如何告訴 AI 怎麼做」
- Skills 是 multiplier — 更好的老師用 AI 教得更好;更好的工程師用 AI 寫得更好
- 重要警告:**不該急著把思考 delegate 給 AI**,反而要把更多 strategic thinking 拉回自己腦袋
- 與 David 共識:這是一個 senior dev 的黃金年代

> "AI makes senior developers just 10 times better. And it sort of doesn't make sense to hire that many juniors anymore because juniors get a little boost from AI, but seniors just get this ridiculous huge boost from it."

---

### Section 4｜/teach Skill Live Demo(10:00 ~ 32:00)

**重點摘要:** Matt 即場 demo 他新出的 `/teach` skill — 給 vibe coder 一份個人化 curriculum,從 git 開始,依照 Vygotsky 的 ZPD 理論分階段教學。

**內容:**
- **設定**:David 自稱 vibe coder,只會基本 CLI 與讀 code,想學系統設計
- **Step 1 — Mission 對齊**:teacher 問「你想做什麼?為什麼?什麼算成功?」— 把教學框架從「塞知識進腦袋」轉為「在世界裡 orient 你」
- **Step 2 — 建立最高槓桿起點**:對 vibe coder 來說,最高槓桿不是更多語法,而是 **git + 讀錯 + 除錯 + 測試 + 軟體怎麼 ship**
- **Step 3 — State + Stateless Skills**:Matt 區分兩種 skill — stateless(不存本地狀態)與 stateful(會把 mission、reference、learning record 存到本地 workspace);teach 是 stateful 的
- **Step 4 — Reference cheat sheet + Lesson 1**:第一課「Get your project's undo button」(git 入門),用 HTML 格式產出(terminal 學習太殘忍)
- **Step 5 — 互動問答**:「Which command saves a snapshot of your staged changes?」 — `git commit`。「What does `git add` do?」 — 「Stages changes」 — 透過 quiz 強化 storage strength(教育心理學已知效果)
- **Step 6 — Primary source 導讀**:推薦讀 *Pro Git* 原文,並邀請使用者問 follow-up questions
- **Step 7 — Learning record**:每次 session 結束更新紀錄,下次進同一 workspace 自動接續

> "I've been a teacher for 10 years... I know a lot about teaching... such as the zone of proximal development, such as the difference between knowledge skills and wisdom, encode that into a skill."

---

### Section 5｜Procedure vs Ability(32:00 ~ 50:00)

**重點摘要:** Matt 把 skill 拆成兩類 — procedure(人類主動 invoke)與 ability(模型自主 invoke),並解釋 description 洩漏 context 的隱性成本。

**內容:**
- **Procedure**:人類主動呼叫 — 例如 `grill-me` skill(把模型變成 adversarial interviewer)、`prd` skill(產出 PRD)、`issues` skill(把 PRD 拆成 issue)
- **Ability**:模型自主呼叫 — 例如「coding standards」 skill(當 model 寫 React 時自動 pull in 該團隊的 standards)
- **核心 tradeoff**:每個 ability 都會把 description 洩漏進 context window;100 個 ability = 100 個 description 永遠在 context 裡
- 解法:`disable_model_invocation: true` — 讓 skill 只能被使用者呼叫,不進 context
- Matt 個人偏好 procedure(他要在 driver 座位),超級 powers 等社群偏好 ability(讓模型在 driver 座位)
- **三者框架** — knowledge(理論)、skill(做過很多次的肌肉記憶)、wisdom(知道何時做);wisdom 必須親身做過才會長出來,不能只透過 skill bundle 取得

> "I prefer to be the one in control. I like to go, okay, we'll do grill me and then we'll go, let's write a product requirements document... I don't want to delegate my thinking to the model."

---

### Section 6｜Agentic Setup:Claude Code + Sandcastle + GitHub Actions(50:00 ~ 60:00)

**重點摘要:** Matt 揭露他的工作流 — Claude Code Opus 4.8 medium 本地使用 + Sandcastle 雲端平行 + GitHub Actions 自動化 review agent。

**內容:**
- **本機**:Claude Code + Opus 4.8 medium effort(已穩定,不追新 model)
- **AFK 工具**:Matt 自己開發的 **Sandcastle** — 把 agent 跑在 Docker/Podman sandbox 裡,避免 agent 亂刪 home directory 或 exfiltrate 環境變數
- **雲端**:可接 Vercel Sandboxes 遠端執行,commit 拉回 local
- **自動化**:在 GitHub Actions 設 PR review agent,自動 type check / lint / 評論
- 強調「平行」 — 與 AWS Show & Tell 的 SDLC pipeline demo 主題呼應,但走 GitHub Actions 而非 Step Functions

> "I'm using claw code with opus 4.8 with medium effort... With Sand Castle, you're essentially able to plug in things like Docker or Podman and run agents inside some sandbox."

---

### Section 7｜Bitter Lesson 的誤用(60:00 ~ 75:00)

**重點摘要:** Matt 警告社群把 Rich Sutton 的「Bitter Lesson」誤用為「等 model 變好就好」 — 這是放棄優化的藉口。

**內容:**
- **Bitter Lesson 原意**:ML 研究中,raw compute 終究會勝過任何特化工法
- **誤用版本**:「所以不要優化 harness,等下一個 model 就好」
- Matt 的立場:**50/50** — 兩個都重要,但開發者不該停在等待 AGI
- 每天主動改善 setup(換 prompt、用 Tailscale、優化 codebase),不要把「反正 model 會變好」當藉口不動
- 但若 model 真的變強 10 倍,「harness 也會被放大」 — 不是二選一

> "I would say I'm somewhere in the middle. I would say like I'm actively trying to improve my setup every single day... trying to use the best model possible."

---

### Section 8｜10x AI Builder:看底層原因,不只修表面(75:00 ~ 92:00)

**重點摘要:** Matt 認為真正的「10x AI builder」差別不在用哪個 model,而在看到 bug 時會問「為什麼會發生」、並設計自我改進的 loops。

**內容:**
- David 提到 Fable 抓到他 Twitter API 設定 bug — AI 用 built-in browser 自己點完流程
- Matt 反對把這歸功於「Fable 是好 model」 — 重點是「**為什麼這 bug 存在這麼久**」
- 自我改進 loops:寫 cron 每天跑 security review、觀察 patterns、建系統而非修個案
- 教育心理學呼應:quizzes 雖然笨但有效、test suites 雖然麻煩但有效 — 過去 30 年有效的東西現在仍然有效

> "If someone keeps stealing your bike, maybe buy a lock."

---

### Section 9｜Loops vs Queues:用隊列思維管 AFK Agent(92:00 ~ 110:00)

**重點摘要:** Matt 主張與其陷入「agentic loop」熱潮,不如用「queue」 思維管理 — 就像傳統 PM 把 ticket 放進 backlog,開發者從 queue 取任務。

**內容:**
- **Ralph loop**(Geoffrey Huntley 提出):while-loop 不斷跑同一個 prompt 直到完成
- Matt 的反對:**真正的開發是 queue,不是 loop** — PM 把任務放進 backlog、開發者從 queue 取任務做、PR 合併就離開 queue
- 多個 agent 可平行取 queue 任務,GitHub label 就是觸發器
- **King 與 Minister 比喻**(David 提出):國王派 minister 到邊疆,不會讓他跑無限 loop;而是建立回報機制,讓問題回到中央
- Human-in-the-loop checkpoints:隨著 trust 增加,逐步往右推(從 explore → implement → review → merge → production)

> "The way I mostly think about these things as cues, okay, cues, not loops... An idea that there's a single loop that just sort of goes and completes all the tasks doesn't really match with how developer teams generally work."

---

### Section 10｜Hire Senior vs AI-Believer Junior(110:00 ~ 125:00)

**重點摘要:** Matt 提出 **DX vs AX** 框架 — senior 知道如何 build good Developer Experience,junior AI believer 知道如何 build good Agent Experience;兩者互補。

**內容:**
- **DX**(Developer Experience):人類讀得懂的 codebase、好的抽象、清楚的命名
- **AX**(Agent Experience):model 跑得順的 codebase — 同樣的命名、好的 type system、well-scoped tasks
- Senior 強在 DX,但好的 DX 通常也帶來好的 AX
- Junior AI believer 強在 AX,但若 DX 太差,AI 也跑不動
- 結論:**experimental mindset + AX 直覺** 是 AI 時代最有價值的能力;senior 與 junior 都能擁有

> "Agent experience is the experience that the agent has working in the codebase... there's a huge overlap between good DX and good AX."

---

### Section 11｜Build Business in AI Age + Closing(125:00 ~ 62:24)

**重點摘要:** Matt 認為做生意的方式沒變 — 仍然要去找客戶、聽需求、build prototype;AI 沒給你找出「人需要什麼」的優勢,但給你實作的 10x 槓桿。

**內容:**
- SAS 不會死,也不會更值錢 — 重點是 build 對的東西,不是 build 多少東西
- AI 弱在「原創想法」;強在「把想法變成程式」
- 開發者應問 AI「**這個功能可以怎麼拿掉**」,而非「可以加什麼」
- 與上集 AWS Show & Tell demo 的精神呼應 — AgentCore 讓 SDLC 自動化,Matt 這集強調「**自動化後,你要保留 strategic thinking + loops + human checkpoint**」
- 收尾:David 感謝 Matt,Matt 推薦 `aihero.dev/skills` 與 `mattpocock/skills` GitHub repo

> "If you're not also talking to actual people and figuring out what they want, as soon as you figure out what people want, um, you're good to go."

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處 / 應用 |
|------|------|-----------|
| **Harness** | 包圍 model 的整套執行環境 — prompt、skill、codebase、tooling | Matt Pocock 核心主張 |
| **Tactical Programming** | 寫程式、除錯、commit 等日常動作 — AI 已經擅長 | John Ousterhout《A Philosophy of Software Design》|
| **Strategic Programming** | 設計架構、規劃 velocity、思考介面 — AI 無法取代 | 同上 |
| **/teach Skill** | Matt Pocock 開發的 stateful skill,依照 ZPD 理論設計個人化課程 | github.com/mattpocock/skills |
| **Stateful Skill** | 在本地 workspace 存 mission、reference、learning record,跨 session 保留記憶 | Matt 分類 |
| **Stateless Skill** | 不存任何本地狀態,純程序性 | 同上 |
| **Procedure** | 人類主動 invoke 的 skill — 例如 grill-me、PRD | Matt 分類 |
| **Ability** | Model 自主 invoke 的 skill — 例如 coding standards | 同上 |
| **AFK Agent** | Away From Keyboard,人不需在場的 agent 工作模式 | Matt workflow |
| **Sandcastle** | Matt 開發的 agent sandbox 框架,接 Docker/Podman/Vercel Sandboxes | github.com/mattpocock/sandcastle |
| **Ralph Loop** | Geoffrey Huntley 提出:while-loop 持續跑同一 prompt 直到完成 | Matt 反對的簡化模型 |
| **Queue Mentality** | Matt 主張:把任務放進 queue,agent 從 queue 取任務執行 — 比 loop 更貼近傳統 SDLC | Section 9 |
| **DX vs AX** | Developer Experience vs Agent Experience;兩者大部分重疊但出發點不同 | Section 10 |
| **Bitter Lesson** | Rich Sutton 主張 raw compute 終究勝過特化 | 被 Matt 警告「誤用為不優化」 |
| **Self-Improving Loops** | cron、review agent、security scan 等系統化自我檢查機制 | Section 8 |
| **Grill-me Skill** | Matt 知名 procedure,把模型變成 adversarial interviewer,在 plan 階段使用 | github.com/mattpocock/skills |
| **Zone of Proximal Development (ZPD)** | Vygotsky 學習理論:學生在「別人幫忙一下就能做到」的範圍學得最快 | /teach skill 設計基礎 |
| **Human-in-the-loop Checkpoint** | 開發者審視 agent 輸出的關卡,可隨 trust 增加逐步往 production 推 | Section 9 |

---

## 四、人物 / 角色分析

### Matt Pocock — 主講
- 背景:英國開發者教育者、AI Hero 創辦人、Sandcastle 框架作者、TypeScript 教育出身
- 關鍵轉折:從 TypeScript 教學 → AI 編碼教學;從 model-centric 觀點 → harness-centric 觀點
- 代表觀點:**「你的 skills 是 AI 的天花板」** + 「**harness > model**」 + 「**procedure > ability**(對開發者而言)」
- 行動呼籲:`npx skills add mattpocock/skills` 安裝 teach / grill-me / prd / issues 等 procedure skills

### David Ondrej — 主持人
- 背景:AI 教學 YouTuber、AI 新創社群經營者
- 角色:提問者、demo 觀眾、用語言視覺化 Matt 的抽象主張(中世紀國王比喻)
- 貢獻:問出 Matt 真正想講的點(AI builder 與 vibe coder 的差別、senior vs junior hire、model vs harness)

### John Ousterhout — 引用學者
- 背景:Stanford 資深教授、《A Philosophy of Software Design》作者
- 貢獻:tactical / strategic programming 區分

### Geoffrey Huntley — Ralph loop 提出者
- 背景:Ralph Wiggum 比喻的 AI 循環執行 pattern 提出者
- 與 Matt 的對話:Matt 引用 Ralph 概念,但主張「queue 比 loop 更貼近真實開發」

### Rich Sutton — Bitter Lesson 提出者
- 背景:DeepMind 研究員、強化學習先驅、《Bitter Lesson》論文作者
- 與 Matt 的對話:警告社群別把「等 compute 變強就好」當藉口不優化

---

## 五、核心主旨

> **AI 時代的工程師價值不在「會寫程式碼」,而在「會設計讓 AI 寫出好程式碼的系統」——而這個系統的核心是 harness(prompt + skill + 環境),不是 model;開發者的 strategic thinking、codebase 設計、以及把個人經驗打包成 reusable skill bundle 的能力,才是 AI 真正的天花板。**

---

## 六、金句摘錄

1. "Everyone's obsessed with the model. Everyone's obsessed with the engine of the Formula 1 car whereas in fact the engine is really only a part of the whole system." — 整場 podcast 的開場宣言
2. "AI has basically eaten tactical programming. It's gone, right? It's all gone." — 戰術 vs 戰略的核心主張
3. "Your skills are the ceiling on what AI can do." — 開發者焦慮的解藥
4. "I prefer to be the one in control... I don't want to delegate my thinking to the model." — Procedure vs Ability 的個人立場
5. "If someone keeps stealing your bike, maybe buy a lock." — 10x AI Builder 的核心差別在系統設計
6. "The way I mostly think about these things as cues, okay, cues, not loops." — 對 Ralph loop 熱潮的降溫
7. "We need knowledge, we need skills, we need wisdom. Wisdom is almost impossible to obtain without actually having done the thing." — 三者框架的關鍵洞察
8. "There's a huge overlap between good DX and good AX." — Senior vs Junior hire 之爭的和解

---

## 七、延伸閱讀 / 參考

- Matt Pocock skills repo:https://github.com/mattpocock/skills(`npx skills add mattpocock/skills` 安裝)
- Sandcastle:https://github.com/mattpocock/sandcastle
- AI Hero 課程:https://aihero.dev
- John Ousterhout《A Philosophy of Software Design》
- Geoffrey Huntley Ralph loop 文章(2025/07/14)
- Rich Sutton《The Bitter Lesson》
- Vygotsky Zone of Proximal Development 理論
- 上集相關:**AWS Show & Tell — AgentCore SDLC**(雲端版 SDLC pipeline)+ **Ryan Lopopolo Harness Engineering keynote**(本地版 harness engineering)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd）,約 7 分 33 秒
> 口播稿原文:transcripts/20260619_MattPocock_AgenticEngineeringWorkflow_口播稿.txt

- [opus 3.6 MB](../audio/20260619_MattPocock_AgenticEngineeringWorkflow.opus)（Telegram 友善）
- [m4a 7.2 MB](../audio/20260619_MattPocock_AgenticEngineeringWorkflow.m4a)（iOS 友善）
- [mp3 6.9 MB](../audio/20260619_MattPocock_AgenticEngineeringWorkflow.mp3)（通用格式）
