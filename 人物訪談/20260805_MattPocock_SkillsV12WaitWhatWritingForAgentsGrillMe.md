# 【Matt Pocock — Claude Skills v1.2 釋出：/wait-what、/writing-for-agents、/grill-me 修復】

**講者｜Matt Pocock（AI 工程教育者、Total TypeScript 創辦人；claude-code-skill-engineering-template 等熱門 repo 維護者）**
**影片連結｜https://youtu.be/gaDdrDdczO4**
**影片長度**｜11:37（697s）
**發布日期｜2026-08-05**

---

## 主題與背景

Matt Pocock 在 2026 年 8 月 5 日發佈了 Claude Skills 的 v1.2.0 版本更新，這是繼 v1.0 與 v1.1 之後的第三個重大里程碑。影片以「Skills, skills, skills」開場，宣佈這個工程技能 repo 已成為 GitHub 史上第 24 名最高星數的專案、突破 24K stars，正式從個人專案進入「成熟專案」階段，需要完善的正式文件支撐。

這次發佈可分為三大主軸：文件化與生態整合（aihero.dev/skills 官方文件站、Claude Code 官方 plugin marketplace、Codex 透過 OpenAI.YAML 檔案原生支援）、三個改寫既有痛點的核心技能（/wait-what 解決 Opus 5 過度冗長、/grill-me 改成多題並答的圖形化提問流程、/writing-for-agents 把 /writing-great-skills 拓寬成所有 agent 配置檔的寫作助手），以及兩個全新技能（/wizard 把繁瑣基礎設施設定變成互動式 bash 向導、/questionnaire 把 grill 對話抽成可分享的 Markdown 文件）。影片不只是 changelog 說明，更呈現了 Matt 對「AI 編碼正在沉澱下來（settling down）」的觀察，因此敢推出自學式的 AI 編碼速成課程作為這套技能的延伸。

## 核心章節

### Section 1：v1.2 三層架構總覽與成熟化宣言

Matt 在影片一開始就拉高層次定位 v1.2：「不是又一波更新，而是這個 repo 進入了成熟期所需的轉折」。他用 repo 達到 GitHub 史上第 24 名、24K stars 的數據作為觀眾熟悉的背景，進而帶出三層改動：文件化（需要被外人讀懂）、生態整合（需要被 Claude Code 與 Codex 安裝流程直接吸收）、技能本體（需要解決過去使用者的真實痛點）。Matt 也暗示這個版本的步調比前幾版慢一點，因為他在「更仔細打磨技能文字、文件與工具」，這也是為什麼這次用了 11 分鐘而不是 5 分鐘來談。

### Section 2：官方文件站 aihero.dev/skills — 從 README 到完整參考手冊

第二大改變是 Matt 與團隊建立了一套「真正漂亮（absolutely wonderful）」的官方文件站，網址是 aihero.dev/skills。導覽從首頁的 `/skills` 開始，把所有技能分成幾個視覺化群組：左側面板是「所有技能的完整參考」、主視覺則是一條從左到右的工作流（grill → with-docs → spec → tickets → implement → code-review），清楚標示一輪 AI 開發週期的順序。文件還內嵌了 Matt 維護多年的「個人 wiki 問題清單」當作常見問答，並交叉連結到他正在持續構建的「AI 編碼字典」（例如點 skill 文件裡的 ticket 連結，會帶你去看他對「ticket」這個詞的定義）。Matt 開玩笑說他以前的全職工作就是寫文件，這次剛好回到老本行，但這次文件品質明顯比他自己一個人寫的有跳躍式提升。

### Section 3：進入 Claude Code 官方 plugin marketplace + Codex OpenAI.YAML

第三改變是 Matt 的 skills 已經成為 Claude Code 官方 plugin marketplace 的一份子。在 Claude Code 內輸入 `/plugin` 指令、搜尋「Matt Pocock」或「Matt Pocock skills」就能一鍵安裝，安裝後是唯讀 bundle（readonly bundle），所有後續更新都會自動 pull 下來；對 Claude Code 使用者而言完全省事。**但對 Codex 使用者呢？** Matt 新增了每個 skill 一個 OpenAI.YAML sidecar 檔，讓 Codex UI 也能「開箱即用」。這個小細節其實解決了一個過去隱而未現的相容性問題：模型叫用的 skill 雖然對 Claude Code 與 Pi 等工具能正確「隱藏到使用者主動 / 指令才注入 context」的機制在 Codex 上不存在，但透過 sidecar 檔帶上 `allow_implicit_invocation: false`，Codex 也能正確區分哪些是 model-invocable、哪些是 user-invocable。

### Section 4：/wait-what — 終結 Opus 5 的「鬼話連篇」

Matt 一開場就吐槽 Opus（特別是 Opus 5）「現在滿嘴垃圾話（talking garbage）」：「每次跟 Opus 對話，我都看不懂它寫什麼，極度冗長、用一堆奇怪的 LLM 慣用語，讀起來超痛苦，很多人有同感。」他試過用 output styles、寫進 AGENTS.md 等各種 hack，但唯一真的有效的是一個專門的 skill：`/wait-what`。它的原理只有兩條：第一，呼叫 ASD-STE100 簡化技術英文標準（簡單明確的祈使句、減少 LLM 慣用語），第二，把 Agent 拉到 `context.md` 的 ubiquitous language 上（也就是 `/grill-with-docs` 跑出來的那份詞彙表），讓 Agent 用「你的語言」寫而不是「通用 LLM 語言」寫。Matt 重點強調：真正的解方不是要它「簡單一點」，而是要它「用你的語言」；每次 Agent 吐出一坨你看不懂的內容時，叫一下 `/wait-what`，它就會吐回一個「你真的看得懂」的版本。

### Section 5：/grill-me 改寫 — 圖形化提問、一次多題

`/grill-me` 是 Matt 史上最熱門的技能之一，過去的流程是「一次只問一題、你答一題、再下一題」；問題是，grilling session 尾段通常只剩一堆瑣碎確認題，逼使用者一直「yes sounds good、yes sounds good」回得很煩、進度很慢。Matt 想要的是「多題一次答」，但這牽涉到題目相依性的問題——第三題可能要看第一題的答案才有意義。他的解法是把題目結構看成「**圖形（graph）**」：開場有一個（或少數）關鍵題必須先答，那些題目完成後才會「打開下一輪」的新題目；skill 會持續把題目往前沿（frontier）推進，使用者盡可能一次答完所有目前 frontier 上的題目再進下一輪。介面上，Matt 用 emoji 標題讓圓圈看起來有彩色彈跳的視覺感，並且旁邊直接給建議答案，讓用聽寫（dictation）的使用者可以一次唰唰唰點完。

### Section 6：/writing-for-agents — 從 skills-only 變成所有 agent 配置寫作助手

Matt 注意到他原本的 `/writing-great-skills` 早就被他「超範圍使用」：不管在寫 AGENTS.md、CLAUDE.md、還是任何技能檔，他都會叫它出來幫忙讓 agent 更好讀、更精簡、更可預測。所以 v1.2 把這個 skill 拓寬成 **`/writing-for-agents`**，並在 reference file 裡內嵌「skill 機制」的說明（如何描述、何時 model-invocable、何時 user-invocable）。核心賣點是「**把 AGENTS.md 抽出去變成 skill**，停止那個恐怖的前段灌入（frontloading）」：如果一份規範長到會撐爆 context window，被迫一開會話就灌進去，就把它變成 skill，讓 Agent 真的需要時才叫。新版也正式宣告為 model invocable，Matt 對它的高頻依賴直白說是「我每次要寫任何 agent 配置時都會叫它」。

### Section 7：/wizard + /questionnaire — 基礎設施設定與非 AI 協作的橋接

最後兩個新技能目的相反但互補。`/wizard` 解決一個 Matt 自己最近很煩的工作：到處架 infra、跑 AWS 設定；他不放心讓 Agent 自己 computer-use 去點 AWS console（「感覺很 icky」），但又想要最少的摩擦。解法是讓 Agent 產生一個**互動式 bash 向導**，每一個步驟只交給「只有人類能做」的部分（例如打開特定網頁、登入、貼 API key），然後 script 自動把值塞到正確的檔案、甚至推到 GitHub secrets；因為整個流程是 deterministic script，不送任何資料到 Anthropic，使用者保有完全控制權、Agent 只負責生成這個 script 與對應 UI。`/questionnaire` 則相反方向：它把 `/grill-me` 的問題抽成 Markdown 文件、丟到 Google Doc，給「沒在用 AI 的利害關係人」評論（例如 Matt 蓋花園辦公室時要跟老婆一起決策），評論完再把答案倒回 Agent；Matt 自嘲這個 skill 是個「patch」，希望未來 agent 能直接在 Slack / Teams 與人協作時這個 patch 就可以刪掉。

## 概念

### 概念 1：Skills 成熟期的三層指標

Matt 對「成熟 skill repo」給了三層判據：社群規模（GitHub 24 名/24K stars）、文件完備（專屬文件站 aihero.dev/skills）、被上游生態吸納（進入 Claude Code 官方 marketplace）。三層齊備才能進入「穩定版本節奏」。

### 概念 2：v1.2 版本節奏比 v1.0/v1.1 慢的原因

Matt 明確說這次改動「更仔細打磨技能文字、文件、工具」，所以版本號推進慢；成熟專案的版本不是「功能加得多」而是「剩下來的更穩」。這也是 changelog 變長、影片變長的合理原因。

### 概念 3：aihero.dev/skills 文件站的三大區塊

文件站由三個區塊組成：技能完整參考手冊（左側）、主流程視覺化（grill → with-docs → spec → tickets → implement → code-review）、常見問題列表（從個人 wiki 抽出）。三者構成「讓外人三個小時就上手」的入口。

### 概念 4：AI 編碼字典的雙重角色

文件站把技能關鍵詞（例如 ticket）連結到 Matt 維護的 AI 編碼字典，同一份資源既服務「想學這個 skill 的人」，也服務「想理解 AI 編碼概念但還沒用 skill 的人」。Matt 把它定位為可獨立使用的學習資源。

### 概念 5：Claude Code 唯讀 plugin bundle 的設計意圖

Matt 的 skill bundle 在 Claude Code marketplace 安裝後是唯讀的（read-only），所有更新由 Matt 推送、客戶端自動 pull；這個設計保護了使用者的本地修改不會被覆蓋，也讓分發流程單一可控。

### 概念 6：sidecar 設定檔解決跨工具相容性

每個 skill 多一個 `OpenAI.YAML` sidecar 檔，確保 `allow_implicit_invocation: false` 這類語意在 Claude Code / Pi / Codex 三家都有同等效果；sidecar 模式是「不改核心 spec、加 metadata 補足差異」的低成本相容策略。

### 概念 7：Model-Invocable vs User-Invocable skill 的 context-window 影響

User-invocable skill 在使用者主動 `/` 叫出之前不會進入 context window；這個語意在 Claude Code / Pi 正常、但 Codex 不支援；sidecar 檔是 portable solution。

### 概念 8：/wait-what 為何比 output-style 更有效

Matt 試過 `output styles` 與在 AGENTS.md 加 prompt，但都失敗；唯一有效的是「**針對單一情境設計的 skill**」。這個觀察暗示：想修某個特定症狀，寫一個專門 skill 遠比改全域 prompt 有效。

### 概念 9：ASD-STE100 簡化技術英文標準

`/wait-what` 直接引用 ASD-STE100——航空業使用的簡化技術英文規範，規定用簡短祈使句、控制每句字數、避免被動句；LLM 聽到這條命名標準會「煞車」。

### 概念 10：「用你的語言寫」比「簡單一點」更治本

Matt 認為冗長的真凶不是複雜度，而是 LLM 通用語；讓 Agent 吃 `context.md` 的 ubiquitous language 才能根治；呼叫一個 skill（/grill-with-docs）餵出詞彙表，再呼叫另一個 skill（/wait-what）強制執行。

### 概念 11：/grill-me 從線性提問進化到圖形提問

舊版 /grill-me 把問題排成「一次一題」的線性流程；新版把問題結構看成有向圖，graph frontier 上的題目是目前可以答的集合，每次推進一輪。

### 概念 12：Graph frontier 推進的使用者體驗

題目被分成 round 1、round 2、round 3；每一輪盡量一次答完所有 frontier 題目後再進下一輪；瑣碎確認題被「打包」加速，前期關鍵題不受拖累。

### 概念 13：dictation-friendly 的 grill-me UI

Matt 用 emoji 標題 + 每題自帶「建議答案」是針對聽寫（語音輸入）設計：使用者可以快速唰唰唰「Q1 agree、Q2 agree、Q3 change、Q4 change」；UI 不是為鍵盤設計的，是為語音設計的。

### 概念 14：/writing-for-agents 是 /writing-great-skills 的超集合

舊技能專門寫 skill，新版本涵蓋所有「Agent 會讀到的檔案」：AGENTS.md、CLAUDE.md、skill、reference document 等；所有需要讓 Agent 表現更好的文字工作都納入。

### 概念 15：將 AGENTS.md 抽成 skill 的「去前段灌入」策略

Matt 鼓勵把超長 AGENTS.md 拆成 skill，讓 Agent 在「真的需要」時才讀；這既降低 context window 壓力，也讓規範更容易被維護；writing-for-agents 是把這個動作模板化的工具。

### 概念 16：model-invocable 的 writing-for-agents

`/writing-for-agents` 是 model-invocable，代表 Agent 在自動修改 agents.md 時會自己 pull 進來使用；使用者不需要手動叫它，這把「好工具就該自動出現」這個原則延伸到配置檔層次。

### 概念 17：/wizard — 把 Agent 變成「互動式 bash script 生成器」

`/wizard` 不讓 Agent 自己 computer-use 去點 AWS console，而是產出一個**deterministic bash wizard** 給人執行；Agent 的角色是「產生 script 與 UI」，執行者是「人」；資料不送 Anthropic。

### 概念 18：wizard 的步驟分工原則

每一步只交給「只有人能做到的部分」（打開特定 URL、登入、貼 API key），剩下的（寫檔、推 secrets）全自動；這個分工兼顧「人保有控制權」與「程式盡量減少摩擦」兩個目標。

### 概念 19：wizard 把 infra 工作從 painful 變 joyful

Matt 親口說 wizard「把我本來痛得要命的服務架設變成奇怪的享受（weirdly joyful）」；這個 user experience 改變是 /wizard 被 Matt 自己列為「必備技能」的主要原因。

### 概念 20：/questionnaire — grill 對話的可分享化

`/questionnaire` 把 /grill-me 的問題序列抽成 Markdown 文件，丟進 Google Doc 給非 AI 使用者（利害關係人）評論；評論完再把答案倒回 Agent；這個 skill 等於「grill-me 的離線版本」。

### 概念 21：questionnaire 是一個「期望被刪除的 patch」

Matt 把 /questionnaire 定位為「我希望有一天能刪掉的 skill」——它存在的意義是現在 Agent 還不能直接在 Slack 對人類協作；一旦 agent-native team workflow 普及，這個 patch 就失去必要性。

### 概念 22：Agent-native 團隊協作的工作流想像

Matt 描述他心中理想：Agent 進駐 Slack，使用者與利害關係人在 channel 對話，Agent 看見 tag 就自動 pile-in 開始實作；目前很多團隊還沒在這種環境，所以 /questionnaire 是過渡解。

### 概念 23：AI coding 「正在沉澱下來」的觀察

Matt 在影片末段直言，他認為 AI 編碼「自去年 12 月以來變化不大」，技術漸趨穩定；這個觀察是他敢推出自學式（self-paced）課程的基礎，因為課程內容短期內不會過時。

### 概念 24：自學式 AI coding 速成課程的發佈訊號

Matt 影片結尾預告一個比他過往付費課程「更便宜、全年可看」的 AI coding crash course，採用 waitlist 制，幾週後上線；這個課程定位呼應 v1.2 skills 的穩定版本節奏——「給你一個穩固基礎讓你能真的 ship」。

## 金句

### 金句 1：「Skills, skills, skills. Folks, we have yet more skills for you.」

開場招呼確立 v1.2 不只是更新，是「又一輪新技能」；節奏直接、立場明確。

### 金句 2：「The skills repo is now, I think, the 24th most starred repo of all time on GitHub, up to 24K stars.」

24 名、24K stars 的雙 24 是 Matt 對「成熟期到來」的精準定義。

### 金句 3：「And as a mature project, we need some proper documentation.」

「mature project → proper documentation」短短一句，把版本節奏轉到文件與生態的合理邏輯交代清楚。

### 金句 4：「[Opus 5 is] just talking garbage. For some reason, every time I interact with Opus, it just goes right over my head. It's incredibly verbose. It uses really weird LLM phrases.」

Matt 用最直白的使用者口吻描述 Opus 5 的症狀：冗長、奇怪的 LLM 慣用語、讀不懂；這個痛點共鳴很強，也是 /wait-what 誕生的根本動機。

### 金句 5：「The real cure for verbosity is not to tell it to use simple language... is to tell it to use your language, the stuff that you have come up with in Grill with Docs.」

這句是 /wait-what 的哲學核心：簡化口吻只是治標，讓 Agent 內化你自己的 ubiquitous language 才治本。

### 金句 6：「You use this skill whenever the agent just creates some random garbage and you've no idea what they just said. You just say, 'Wait, what?' and it should reply with a much better alternative.」

用一個動作（說 "wait, what?"）取代一長串 prompt hack，這是 skill 思維最經典的 UX 示範。

### 金句 7：「Previously, Grill Me used to grill you one question at a time... [and] most of the hard stuff is already done, you just have a bunch of easy questions... Yeah, that sounds good. Yeah, that sounds good, too.」

舊版 grill-me 的「yes, that sounds good, too」地獄是新版重寫的最清楚理由；UX 上要先點名痛點才能解釋改動。

### 金句 8：「These questions are really like a graph... It's always pushing you as fast as possible down the frontier of questions.」

把 grill-me 從線性提問升級到「圖形 frontier 推進」是這版最重要的抽象化；用最簡單的圖論術語就讓結構變得很清晰。

### 金句 9：「I decided to use... emojis here for a little pop of color. This makes it super easy to navigate with my eyes.」

emoji 不是為了可愛，是為了「視覺快速定位」+「搭配語音聽寫輸入」；這個細節把 UI 設計的目的講得很明確。

### 金句 10：「[Wizard] takes provisioning services from incredibly painful to weirdly joyful because I just know how long it took me before.」

Matt 用「painful → weirdly joyful」兩個極端形容同一件工作的改變，這是 /wizard 的真實客戶驗證。

### 金句 11：「[Questionnaire] is a skill that I hope someday to delete because it's sort of like a patch for the fact that agents are kind of hard to collaborate with at the moment.」

Matt 直接說 /questionnaire 是個 patch、希望未來可刪；對「過渡型工具」最誠實的定位。

### 金句 12：「My personal opinion about AI coding is that it's kind of settling down a little bit... I now feel confident enough that I can put out a self-paced course that hopefully won't change too much even as things develop.」

Matt 對 AI coding 進入「沉澱期」的判斷，是他敢推出自學式課程的最大前提；也是這支影片想留給觀眾的最大 meta 訊號。

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, speech-2.8-hd），約 8 分鐘
> 口播稿原文：/tmp/20260805_MattPocock_SkillsV12WaitWhatWritingForAgentsGrillMe/口播稿.txt

這段口播稿以全知分析者的視角，介紹 Matt Pocock 在 2026 年 8 月 5 日發佈的 Claude Skills v1.2.0 版本。影片重點有三：第一，v1.2 不只是加功能，而是這個 repo 進入成熟期後的生態擴張——官方文件站 aihero.dev/skills 上線、進入 Claude Code 官方 plugin marketplace、透過 OpenAI.YAML sidecar 讓 Codex 也開箱即用。第二，三個核心技能更新回應真實痛點：`/wait-what` 直接治 Opus 5 滿嘴 LLM 慣用語的毛病，靠 ASD-STE100 與 ubiquitous language 兩個開關讓 Agent 改用「你的語言」寫；`/grill-me` 從線性提問改成圖形化 frontier 推進，讓瑣碎確認題一次打包答完、聽寫輸入也能高速通過；`/writing-for-agents` 把 `/writing-great-skills` 拓寬到所有 AGENTS.md 與 CLAUDE.md 的寫作，並鼓勵把超長 prompt 抽成 skill。第三，新進的 `/wizard` 與 `/questionnaire` 分別解決「infra 設定太痛」與「利害關係人不在 AI 工作流」兩個互補場景，前者產 deterministic bash script、後者把 grill 對話轉成可分享 Markdown。影片末段 Matt 對 AI coding 進入「沉澱期」下了個人判斷，預告一個自學式 AI coding 速成課程即將上線。整支影片的 meta 訊號是：版本節奏放慢是為了把品質拉到生產線可依賴的水位，使用者現在有一個穩固的基礎可以開始 ship。

- [mp3 7.4 MB](口播稿.mp3)（通用格式）
- [opus 1.9 MB](口播稿.opus)（Telegram 友善，32kbps）
- [m4a 7.8 MB](口播稿.m4a)（Apple 裝置友善）

## 人物

- **Matt Pocock** — AI 工程教育者、Total TypeScript 創辦人，目前聚焦 AI 編碼技能工程；本影片作者，claude-code-skill-engineering-template 等熱門 repo 作者；也是 AI 編碼字典與 aihero.dev/skills 文件站的維護者；對 AI coding 進入「沉澱期」的判斷出自他。
- **Claude Code 官方團隊（Anthropic）** — 影片中提到的「official plugin marketplace」營運方，把 Matt 的 skills 列為官方 plugin；這個角色在影片中是用戶安裝流程的隱形推手。

## 延伸閱讀

1. [aihero.dev/skills](https://aihero.dev/skills) — Matt 為 v1.2 推出的官方技能文件站，含主流程視覺化、完整參考手冊、常見問題清單與 AI 編碼字典交叉連結
2. [GitHub: claude-code-skill-engineering-template](https://github.com/total-typescript/claude-code-skill-engineering-template) — Matt 的 skills repo，目前 GitHub 史上第 24 名最熱門專案，v1.2.0 release notes 可在 releases 頁找到
3. [Anthropic Claude Code Plugin Marketplace 文件](https://docs.claude.com/en/docs/claude-code/plugins) — 了解 Claude Code 官方 plugin 安裝流程（`/plugin` 指令內搜尋 Matt Pocock skills）
4. [ASD-STE100 簡化技術英文規範](https://www.asd-ste100.org/) — `/wait-what` 引用的標準，航空業使用的簡化技術英文撰寫守則
5. [Microsoft / Slack AI assistant 整合文件](https://slack.com/help/articles/222386767-Manage-Slackbot-and-other-apps) — Matt 在影片末段提到的「agent 直接進駐 Slack / Teams 與人類協作」願景的實作參考
6. [Total TypeScript](https://www.totaltypescript.com/) — Matt 的 TypeScript 教學平台，是他從「寫文件」舊工作走到 AI 編碼新工作的根基
