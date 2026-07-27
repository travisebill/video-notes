# Boris Cherny: Building Claude Code

**講者｜Boris Cherny（Anthropic · Claude Code 創建者）· 主持｜Diana Hu**
**發布日期｜2026-07-27 · Y Combinator Startup School 2026**
**影片長度｜35:51（2,151s）**
**影片連結｜https://youtu.be/qyPCVqFUyDo?si=RATOoZCFwS9e6KeI**
**字幕｜en-orig 自動字幕（English Original，1922 行 / 105,591 chars）**
**音檔導覽｜口播稿 TTS（xiaotian_clone_v1 · speech-2.8-hd）**

---

## 主題與背景

這場訪談錄製於 Y Combinator Startup School 2026，時機是 Anthropic **前一天（2026-07-26）剛發布 Opus 5**。Boris Cherny 是 Claude Code（Anthropic 的 AI coding CLI / agent 工具）的創建者，對談涵蓋三件事：

1. **Opus 5 + 最新模型能多做什麼**
2. **Claude Code 怎麼從 0 走到 1**
3. **當底層模型能力持續加速時，AI 產品的設計哲學要怎麼跟上**

對身為 backend engineer + 用 Copilot CLI / Codex 的你，這場是**直接競爭對手的內部視角**——比公開 benchmark / changelog 更接近 Claude Code 的「設計意圖」。

---

## 章節脈絡

| 時間碼 | 章節 | 摘要 |
|---|---|---|
| `00:07 ~ 02:05` | What Makes Opus 5 Different | Opus 5 vs Opus 4 的關鍵差異（含 Arc AGI 3 從 <20% 跳到 30%） |
| `02:06 ~ 03:20` | Solving Prompt Injection | Opus 5 似乎「不再 prompt injectable」 |
| `03:21 ~ 06:36` | Why Claude Code Deleted 80% of Its System Prompt | 系統 prompt 從幾千行縮到幾百行 |
| `06:37 ~ 07:19` | Press Delete on Your AI Product | 「能刪就刪」的設計哲學 |
| `07:20 ~ 10:29` | How to Rebuild Your System Prompt | 重建 system prompt 的方法論 |
| `10:30 ~ 14:25` | Product Overhang and "Unhobbling" AI | Product overhang 概念 + unhobbling 模型 |
| `14:26 ~ 19:31` | Give Claude Harder Problems | 給 AI 更難的問題 |
| `19:32 ~ 21:56` | Prompt Engineering Is Changing | prompt engineering 在改變 |
| `21:57 ~ 24:41` | The Two-Week Claude Code Prompt | 兩週改一次 prompt |
| `24:42 ~ 30:14` | Running Thousands of AI Agents | 同時跑幾千個 agents |
| `30:15 ~ 32:19` | Coding Is (Almost) Solved | Coding 幾乎被解決了 |
| `32:20 ~ 35:51` | What Every CS Student Should Still Learn | CS 學生還是要學的東西 |

---

## 關鍵概念定義

| 概念 | 定義 |
|---|---|
| **Opus 5** | Anthropic 2026-07-26 發布的 LLM，更長 context + 更深 reasoning |
| **Claude Code** | Anthropic 的 AI coding CLI / agent 工具（對標 GitHub Copilot CLI / OpenAI Codex） |
| **Arc AGI 3** | ARC-AGI 第三代 benchmark（Abstraction and Reasoning Corpus） |
| **Prompt Injection** | 透過 user input / file content / tool output 注入 prompt，操縱 AI 行為 |
| **Lethal Trifecta** | 三個危險組合（untrusted input + code execution + outgoing communication）讓 prompt injection 可被武器化 |
| **Product Overhang** | 模型能力領先產品能利用的能力——差距就是「Product overhang」 |
| **Hobbling** | 產品介面 / 介面限制模型的能力釋放 |
| **Unhobbling** | 解開 prompt / 介面 / 工作流對模型的限制，讓模型能力被釋放 |
| **Scaffolding / SLGO** | 早期 AI agent 的腳手架程式碼（task planner / state machine 等） |
| **Auto Mode** | Opus 5 的 autonomous mode，不需要外部 scaffold 也能跑長任務 |
| **Cloud Tag** | Claude Code 跑在 Slack 的版本（產品） |
| **Agent Algebra** | Boris 設計 Claude Code multi-agent 的概念——sequence + parallel + map/reduce 對 agents |
| **Dynamic Workflows** | Claude Code 的 multi-agent orchestration feature——「use a workflow」就觸發 |
| **Loops & Routines** | Claude Code 的 cron-like 功能——Loop 在本機、Routine 在 cloud |
| **Abstraction Police** | Anthropic 內部 routine——找 codebase 內 nearly duplicated abstractions 並 unify |

---

## 重要引用

> "Fresh off the press, you guys just shipped Opus 5 yesterday."
> — Diana Hu 開場（前一天發布）

> "Arc AGI 3 to 30%. Before the best score was in the low single digits or low teens."
> — Diana Hu 引述 Opus 5 在 ARC-AGI-3 的突破

> "It can go for days, weeks, months at a time. It just won't stop. You don't even need to use scaffolding. So you don't need SLGO, you don't need all this other stuff. It'll just go because it knows it needs to do the task."
> — Boris Cherny 描述 Opus 5 + auto mode 的 long-running 能力

> "The model does not seem to be prompt injectable anymore... people have talked about this like lethal trifecta for a long time and this really affects kind of harness design and agent design."
> — Boris Cherny 描述 Opus 5 的 prompt injection 防禦改變

> "Building on models is just so different than all the engineering that I've ever done. Like in the past when you built on systems, you built these like big beautiful systems... rearchitecture is a big project. Sometimes it takes months... The way to think about it is almost like a living creature, something more organic."
> — Boris Cherny 描述 AI product 跟傳統 software engineering 的差異

> "You want to see where it fails with the model... only when you see it repeatedly stumble on the same thing, that's when you add it back. But you don't want to do it too early because remember like the model is going to read this instruction every single time you use it."
> — Boris Cherny 講 system prompt 的 empirical 重建方法論

> "Code and system prompt... if you want to build at the bleeding edge and have the most capability for models, you got to delete those. But evals are constant and keep appending to them basically."
> — Boris Cherny 講 stable assets 是 evals，不是 code / system prompt

> "There are so many capabilities the model has... that people are not aware of... we call this product overhang. So it's kind of like two sides of the same thing... the model is doing something and you're just getting in the way. We call this hobbling."
> — Boris Cherny 講 Product overhang + Hobbling 概念

> "Basically, all of you could create the next cloud code if you figure out how to unhobble the models."
> — Diana Hu 給 YC 觀眾的 insight

> "You should give the model slightly harder tasks than what you think it can do... you want to describe the task, you want to describe the guardrails, you want to describe like the exit criteria and then just go let the model cook and come back in a little bit and I think it'll surprise you."
> — Boris Cherny 講 Give Claude Harder Problems 哲學

> "And so one thing that the bun team was doing is they were having Claude fuzz the codebase... and then at some point Jared on the team was like, 'Okay, let's just like rewrite it.'... he had the model rewrite it from Zig to Rust. It was one prompt... And a dynamic referrals are a feature in cloud code that essentially let you orchestrate... dozens, hundred, thousands of agents... And it ran for 11 days and it rewrote the entire codebase."
> — Boris Cherny 講 Bun 11 天 Zig→Rust rewrite 實例

> "Even with the best engineers multiple months, years... definitely over a year. Yeah. Over a year. This is like over 100,000 like JavaScript runtime is really complicated."
> — Boris Cherny 對 Bun 11 天 rewrite 的人類 baseline 對比

> "A year ago, one of the most popular job openings was prompt engineer... I think it became like context engineer... The skill nowadays is less about prompt engineering and more about figuring out how do you give cla a hard task that seems a little bit too hard and then how do you make it possible for cla to verify its work along the way. And the verification I think is probably the single most important thing that people do not get right largely."
> — Boris Cherny 講 Prompt Engineering 在改變

> "It's been uh it's been a little over two weeks. So, it's like 14 days, 15 days... I don't know if anyone in the audience has gotten clock to run a a task for more than two weeks."
> — Boris Cherny 講 Claude rewrite Electron→Swift 跑了 14-15 天還在跑

> "So, I'm curious, someone in this room should be building something that runs hopefully multiple months and thousands of agents now that you have the account to do it. And with that, thank you so much, Morris."
> — Boris Cherny 結語

> "Forget all the things that you learn about past models. Forget everything that you learned about computer science theory in class. Look at the model, try to do a task, see where it struggles, and then based on that adjust. So it's just become an empirical science."
> — Boris Cherny 對「Coding 幾乎 solved」的 caveat

> "Learn not just the computer science... intellectually fascinating and it's really really interesting to know but learn how to apply it. And often this is about building startups. It's about building products. It's about developing your own design sense, developing your business sense, learning how to how to do data science, learning how to talk to users."
> — Boris Cherny 給 CS 學生的建議

---

## 章節 1 — What Makes Opus 5 Different（`00:07 ~ 02:05`）

Opus 5（2026-07-26 發布）的關鍵能力：

1. **Long-running autonomous tasks**：在 auto mode 下，「跑幾天、幾週、幾個月」不停，**不需要外部 scaffolding**。Boris 直接說「you don't need SLGO」——Anthropic 之前 agent 用的腳手架框架，Opus 5 已經不需要。
2. **ARC-AGI-3 從 low teens 跳到 30%**：抽象推理 benchmark 大幅提升。
3. **Surprise capabilities**：訓練時沒明確教，但模型自己學會的能力——Boris 強調「sometimes it surprises you」。

對工程師的 takeaway：Opus 5 把「AI agent 自己能跑長任務」變成 production-ready，不再需要 LangChain / LlamaIndex 風格的 scaffold。

---

## 章節 2 — Solving Prompt Injection（`02:06 ~ 03:20`）

Boris Cherny 直接說 Opus 5「does not seem to be prompt injectable anymore」。這對 agent design 是根本改變：

- 「Lethal trifecta」（untrusted input + code execution + outgoing communication）長期被視為 agent design 的危險組合
- Opus 5 的改變讓 agent design / harness design 不再需要把 prompt injection 防禦當成頭等約束
- 影響：未來 Claude Code 這類 agent 工具可以更信任 tool output / file content，不需要把所有 input 當 hostile

對工程師的 takeaway：如果你在設計 Claude Code / Codex agent，看到 tool output 包含 user input 內容時，過去要嚴格 escape——Opus 5 之後可以更信任。

---

## 章節 3 — Why Claude Code Deleted 80% of Its System Prompt（`03:21 ~ 06:36`）

Boris 解釋 Claude Code 砍 system prompt 的方法論——不是 upfront design，是 empirical iterate：

- **「You don't want to do it too early」**：不要因為「可能會 fail」就提前寫 instruction，model 每次都會讀，over-specify 等於浪費 context
- **「Building on models is just so different than all the engineering that I've ever done」**：傳統 software engineering 是 big beautiful system + upfront design + rearchitecture is a big project（months / years）；model 是 living creature，每個 generation 行為都不一樣
- **「Almost like a living creature, something more organic」**：AI product 不是靜態程式，是有機體
- **「You have to take a very scientific mindset to it where you try something, you see the result and then you iterate」**：empirical iterate，不是 upfront perfect

對工程師的 takeaway：AI product 的開發心態要從「建築師蓋房子」轉成「園丁照顧植物」。不要追求一次完美，要持續 empirical iterate。

---

## 章節 4 — Press Delete on Your AI Product（`06:37 ~ 07:19`）

Diana Hu 問「AI 產品世界裡什麼是 stable？」，Boris 的回答很直接：

- **Code**：要砍掉（每個 model release 都要重寫）
- **System prompt**：要砍掉（每個 model release 都要重寫）
- **Evals**：constant, keep appending（**唯一穩定的資產**）

Boris：「Code and system prompt you have if you want to build at the bleeding edge and have the most capability for models, you got to delete those. But evals are constant and keep appending to them basically.」

但 evals 也有保質期——「an eval might live for maybe one, two, three model generations. But nowadays... we just saturate the eval and then we have to throw it away and we have to come up with a new eval.」

對工程師的 takeaway：AI product 的「技術債」不只是程式碼，還包括 system prompt。每個 model release 都要砍掉重寫。能累積的只有 eval set。

---

## 章節 5 — How to Rebuild Your System Prompt（`07:20 ~ 10:29`）

延續 chapter 4 的「砍 system prompt」，Boris 解釋怎麼重建：

- **「Run the product, see where it fails」**：用實際產品找出 fail，不是猜 model 需要什麼 instruction
- **「Only when you see it repeatedly stumble on the same thing, that's when you add it back」**：重複 fail 才是真的需要 instruction
- **「You don't want to do it too early because remember like the model is going to read this instruction every single time you use it」**：每一次 model invocation 都會讀 prompt，over-specify 是浪費所有人的 token + 限制模型

對工程師的 takeaway：system prompt 不是 upfront design，是 empirical iterate——run product → see where it fails → add instruction only when fail is repeatable。

---

## 章節 6 — Product Overhang and "Unhobbling" AI（`10:30 ~ 14:25`）

Boris 提出兩個互補概念：

- **Product Overhang**：模型能做到的事 vs 產品實際讓模型做的事——差距就是「Product overhang」。Opus 5 已經能做很多事，但很多產品還沒讓模型做。
- **Hobbling**：當產品介面 / 介面 / 工作流限制模型的能力釋放——「the model is doing something and you're just getting in the way」

**Claude Code 的 birth story**：兩年前在 Sonnet 3.5 時代，Boris 看到當時 AI coding 產品都還在做 single-line autocomplete / multi-line autocomplete / chat 但不能 write。Sonnet 3.5 已經能寫整個 function / file，但沒產品讓它寫。Claude Code 的設計就是「unhobble Sonnet 3.5」——拿掉所有 scaffolding，給 full terminal access。

Diana Hu 補一句：「all of you could create the next cloud code if you figure out how to unhobble the models」——這是 YC 觀眾的 startup formula。

對工程師的 takeaway：Product overhang 是新創的 source of opportunity。找出模型能做但產品沒釋放的能力就是 startup idea。

---

## 章節 7 — Give Claude Harder Problems（`14:26 ~ 19:31`）

Boris 給 AI coding 工具開發者的具體建議：

- **「You should give the model slightly harder tasks than what you think it can do」**：給「比你以為它能做的更難一點」的任務
- **「A really common mistake... they're just give it like way overly specific instructions... you must do like one, then two, then three」**：over-specify 是 common mistake
- **「You want to go a little bit higher level. You want to describe the task, you want to describe the guardrails, you want to describe like the exit criteria and then just go let the model cook」**：higher level prompt pattern——task + guardrails + exit criteria

**實例：Bun 開源 JavaScript runtime**

- Bun team 一開始讓 Claude fuzz codebase 找 memory leak（one case at a time）
- 後來 Jared（team member）跟每個新 model generation 都試一個 test problem：「rewrite Bun from Zig to Rust」
- 從 Sonnet 開始，模型「started to be able to do it」；到 Opus 5 完全可行
- 一次 prompt，整個 workflow 跑了 **11 天**，從 Zig 重寫成 Rust，跑在 production
- 對照組：「even with the best engineers multiple months, years... definitely over a year」
- 「100,000 like JavaScript runtime is really complicated」

Boris：「should just keep throwing the latest model at it to see if it'll just do it because even if a previous model didn't, the new one might」——每個 model release 都重試一次。

另一個 internal viral 案例：「someone figured out that you can give Opus 5 OpenCV... and you can have a draw... you can ask Opus like hey use open CV to like draw this image and it's actually quite good... we didn't train the model to draw like... it's just like the solicitation gap」。

對工程師的 takeaway：「Higher level + verification」prompt pattern 是新 AI coding paradigm。實例：Bun 從「幾年壓到 11 天」。也代表「每個 model release 都重試」是常態。

---

## 章節 8 — Prompt Engineering Is Changing（`19:32 ~ 21:56`）

Boris 描述 prompt engineering 的演化：

- **「A year ago, one of the most popular job openings was prompt engineer」**：一年前 prompt engineer 是熱門職缺
- **「And then it kind of changed and then I think it became like context engineer」**：演變到 context engineer
- **「The skill nowadays is less about prompt engineering and more about figuring out how do you give cla a hard task」**：現在的 skill 是「給 AI 難任務」+ 「讓 AI 驗證自己的工作」
- **「Verification is probably the single most important thing that people do not get right largely」**：verification 是最被低估的環節

對工程師的 takeaway：Prompt engineer → context engineer → 「give AI hard task + verification」。Verification 是 AI coding 最被低估的環節——給 AI self-check loop 的能力比寫好 prompt 更重要。

---

## 章節 9 — The Two-Week Claude Code Prompt（`21:57 ~ 24:41`）

Boris 親身 demo：用 Cloud Tag（Claude Code running in Slack）把 Claude Code desktop app 從 Electron rewrite 成 Swift。

**整個 prompt 只有幾句**：

1. 「Hey, Tag, do you have access to a Mac OS runner on GitHub?」→ 沒有 → Boris hook up runner → start Mac VM
2. 「Can you access this empty Swift codebase?」→ 沒有 → Boris give access
3. 「I want you to rewrite the Electron app in Swift. I want you to run the Electron app in the Mac virtual machine, screenshot it, and then look pixel by pixel, compare it to the Swift version, don't stop until you're done.」

**跑了 14-15 天還在跑**。Cloud 自己 create Slack channel，每幾分鐘 post screenshot 進度（live blog 自己的 progress）。

Diana Hu：「The prompt sound is so simple. I mean everyone here could do it.」

Boris：「Don't listen to the LinkedIn influencers. Don't read Twitter. There's just like that doesn't exist. There's nothing like that. The way the model works is you have to approach it empirically.」

對工程師的 takeaway：「Higher level + self-verification loop」prompt pattern 的極致展現。整個 prompt 只有幾句，但 verification loop（run + screenshot + pixel-by-pixel compare）讓 Cloud 可以自己跑 14 天。

---

## 章節 10 — Running Thousands of AI Agents（`24:42 ~ 30:14`）

Boris 講 Claude Code multi-agent orchestration 的設計：

**Agent Algebra**：Boris 的 background 是 functional programming，他把 multi-agent design 成「agent algebra」——sequence + parallel + map/reduce 對 agents。

**Dynamic Workflows**：Claude Code 的新 feature，「use a workflow」就觸發。「essentially a new way to orchestrate test time compute」——multi-agent 是新的 test time compute 形式。

**Loops & Routines**：
- Loop = 本機跑的 cron job
- Routine = cloud 跑的 cron job（可以關 laptop）
- 用例：Anthropic 自己用 Claude 跑幾十個 routine 維護 codebase

**Claude maintaining itself（實際案例）**：

Anthropic 內部有個 Slack channel，Claude 自己跑幾十個 routine 做 codebase maintenance：

1. **Clean up dead code**：每天 grep + static + dynamic analysis，找 dead code，自動開 PR 刪除
2. **Ship experiments that should go out**：實驗已 rollout 100%，自動從 codebase 刪除實驗程式碼
3. **Write tests for areas that need test coverage**：自動找缺測試的程式碼，自動寫
4. **Delete useless tests**：刪掉 older models 加的或人加的 useless tests
5. **Abstraction Police**：每天掃所有 codebase，找 nearly duplicated abstractions，自動 unify

Boris：「Every day maybe 20 or 30 of these routines... hundreds of agents running every day, sometimes thousands of agents every day. It's doing the work of, you know, dozens or hundreds of engineers.」

對工程師的 takeaway：AI agent 的 orchestration 是「agent algebra」（sequence + parallel + map/reduce）。Claude Code 已經在自我維護——routines + abstractions police 是新 AI coding paradigm。

---

## 章節 11 — Coding Is (Almost) Solved（`30:15 ~ 32:19`）

Boris 對「Coding is solved」的 caveat：

- **「Coding is solved for the kind of coding that I do... it's not solved for everyone」**：對 Boris 的「coding」solve 了，但不是所有人
- **「Super deep systems code bases where cloud still struggles」**：超深的 systems code（kernel / driver / 編譯器內部）Claude 還會 struggle
- **「Distributed systems where cloud still struggles」**：分散式系統
- **「In the weeds UI verification, like something is off by pixel or something」**：pixel-perfect UI verification

Opus 5 在 vision + computer use 是 big leap，但仍 not perfect。

Survey: 100% code 是 agent 寫的人很少，>50% 的人多一些——「it's kind of getting there」。

Boris 的 mindset 建議：
- **「Forget all the things that you learn about past models」**：忘掉過去 model 的經驗
- **「Forget everything that you learned about computer science theory in class」**：忘掉 CS 課堂理論
- **「Look at the model, try to do a task, see where it struggles, and then based on that adjust」**：empirical iterate
- **「It's become an empirical science」**：AI coding 是經驗科學
- **「People that are really good at kind of forgetting their priors, letting go of... idea that didn't work before and just being open to trying it again」**：忘掉 priors，重試「之前沒 work 的事」

對工程師的 takeaway：Coding 對 Boris 的「coding」solve 了，但 deep systems / distributed systems / pixel-perfect UI 還沒。Empirical mindset > 理論 CS background。

---

## 章節 12 — What Every CS Student Should Still Learn（`32:20 ~ 35:51`）

Boris 從自身經驗講起：他在中學用 TI-83 calculator 學 BASIC 寫 math solver 考試高分（後來同學用 serial cable 拷貝），微積分要學 assembly 寫更好的 solver。「Programming has always been very practical」。

**給 CS 學生的建議**：

- **「Learn not just the computer science」**：CS 本身 intellectually fascinating，但不要只學這個
- **「Learn how to apply it」**：學應用
- **Building startups**：建 startup
- **Building products**：建產品
- **Developing your own design sense**：設計 sense
- **Developing your business sense**：商業 sense
- **Learning how to do data science**：data science
- **Learning how to talk to users**：跟用戶溝通

「When you combine it with computer science and engineering, that's where it becomes really really valuable」——CS + engineering + 應用 = 真正有價值。

Diana Hu 總結：「start with making something you want first for yourself and then level up and make something people want」。

YC 公告：所有觀眾拿 max 20x Claude Code credits。

Boris 結語：「someone in this room should be building something that runs hopefully multiple months and thousands of agents now that you have the account to do it」。

對工程師的 takeaway：CS student 該學的是 application（startups / products / design / business / data science / users），不是純 CS theory。CS 是 fascinating 但 application 才有市場價值。

---

## 核心主旨總結

這場訪談的主旨可以濃縮成四個 insight：

1. **Long-running autonomous 是新常態**：Opus 5 + auto mode 可以跑「幾天、幾週、幾個月」不停，不需要外部 scaffolding。對工程師來說，scaffold-based agent framework（LangChain / LlamaIndex）的時代接近尾聲。
2. **Prompt injection 已不是頭等約束**：Opus 5「does not seem to be prompt injectable anymore」，lethal trifecta 的危險降低。Agent design 可以更信任 tool output / file content。
3. **AI product 是 living creature**：Code 跟 system prompt 每個 model release 都要砍掉重寫，stable assets 只有 evals。要 empirical mindset，不要 upfront design。
4. **Empirical > Theoretical**：Forget priors，forget computer science theory in class。Look at the model, try task, see where it struggles, adjust。Anthropic 自己每天跑幾千 agents 做 eval / maintenance。

對身為 backend engineer + 用 Copilot CLI / Codex 的你，四個 takeaway 的實戰意義：

- **工具選型**：長期來看 scaffold-based framework 投資報酬率降低，auto mode + 簡單 harness 的設計會贏
- **安全模型**：Agent 設計可以減少 prompt injection 防禦投資，把精力放在 verification（self-check loop）跟 orchestration（agent algebra）
- **迭代節奏**：你的 AI coding workflow 應該每個 model release（每 1-2 個月）大砍 system prompt / configuration，重新 empirical iterate
- **核心競爭力**：Coding 本身的 skill 邊際價值在降低（Claude Code 已經 daily maintenance 取代「dozens of engineers」），business / design / user sense 的價值在提升

---

## 金句摘錄

> "It can go for days, weeks, months at a time. It just won't stop. You don't even need to use scaffolding."
> — Opus 5 + auto mode long-running

> "The model does not seem to be prompt injectable anymore."
> — Opus 5 prompt injection 防禦改變

> "Building on models is just so different than all the engineering that I've ever done... the way to think about it is almost like a living creature, something more organic."
> — AI product 不是傳統 software

> "You want to describe the task, you want to describe the guardrails, you want to describe like the exit criteria and then just go let the model cook."
> — Give Claude harder problems

> "Verification is probably the single most important thing that people do not get right largely."
> — Prompt engineering 在改變

> "Forget all the things that you learn about past models. Forget everything that you learned about computer science theory in class."
> — Empirical > Theoretical

> "Someone in this room should be building something that runs hopefully multiple months and thousands of agents now that you have the account to do it."
> — Boris 給 YC Startup School 觀眾的結語

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone `xiaotian_clone_v1` · `speech-2.8-hd`），約 2 分 41 秒
> 口播稿原文：transcripts/20260727_BorisCherny_BuildingClaudeCode_口播稿.txt

- [opus 1.3 MB](../audio/20260727_BorisCherny_BuildingClaudeCode_口播稿.opus)（Telegram 友善）
- [m4a 2.9 MB](../audio/20260727_BorisCherny_BuildingClaudeCode_口播稿.m4a)（iOS 友善）
- [mp3 2.5 MB](../audio/20260727_BorisCherny_BuildingClaudeCode_口播稿.mp3)（通用格式）

---

*備註：partial 結構化筆記 → 補完。Bar 1 音檔大小等 TTS 完成後填寫*