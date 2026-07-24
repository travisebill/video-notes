# 【LIVE: The /wayfinder Demo】

**講者｜Matt Pocock（AI Hero Skills For Real Engineers）**
**影片類型｜技術講座 / Live Demo**
**影片日期｜2026-07-13**
**影片長度｜74:40（4480s）**
**語言｜英文（en-US）**

> 本影片使用 YouTube 原始英文自動字幕（en-orig auto-generated VTT）+ YouTube 繁體中文自動翻譯字幕（zh-Hant auto-generated VTT，機器翻譯），經清除時間碼與格式標籤後得到逐字稿。技術內容以 en-orig 為準，繁中版本僅供參考。

> **影片連結**：[https://www.youtube.com/live/251hsWgoTPM](https://www.youtube.com/live/251hsWgoTPM?si=svpv9fFpnsrbn5gv)
> **講者網站**：[https://www.aihero.dev/skills/subscribe](https://www.aihero.dev/skills/subscribe)
> **講者 Twitter**：[https://twitter.com/mattpocockuk](https://twitter.com/mattpocockuk)
> **講者 Discord**：[https://aihero.dev/discord](https://aihero.dev/discord)

---

## 主題與背景

Matt Pocock 是 AI Hero 創辦人，推廣「Skills For Real Engineers」這套 AI 輔助開發方法論。本次直播展示他最新的 `/wayfinder` skill — 是他過去 `/grill-me` skill 的進化版，目標是把「**大量工作一次性、整體地解決**」。Matt 從土耳其飛回來立刻上線，給自己約一小時的時間示範。

影片主軸：用 `/wayfinder` 為現有的 **Course Video Manager（CVM）** 應用新增 **TikTok creator** 支援。Matt 用一個完整的 live coding session 展示從「模糊需求」到「結構化 tickets」再到「實作」的整個 workflow。

## 章節脈絡

### Section 1｜開場與 Wayfinder 簡介（00:00 ~ 03:00）

Matt 從土耳其剛抵達，用約一小時聊 Wayfinder。開場就點出關鍵差異：**Wayfinder 是 `/grill-me` skill 的進化版**。Grill me 是早期版本，專注在一對一對話釐清需求；Wayfinder 擴展到可以處理「huge chunks of work all together and all in one piece」。

> "Wayfinder, for those who don't know, is uh… a sort of evolution of the Grill Me skill. And it's a way of figuring out huge chunks of work all together and all in one piece."

Matt 開門見山：今天要用 Wayfinder 蓋一個他一直想做的東西 — **Course Video Manager 加 TikTok creator 支援**。他不打算用 Whisper flow（避免暴露環境變數），改走 dictation 模式。

### Section 2｜Demo 起點：TikTok creator 需求探索（03:00 ~ 17:00）

Matt 進入 CVM 應用，目標明確：擴展現有 course video manager，使其能支援 TikTok creator。**第一步先做 pre-specification（預規格）階段** — 這是 Wayfinder 的核心理念。

一開始他刻意把需求講得很模糊：

> "You see how vague I'm being? I'm not being particularly concrete here. I'm just kind of talking as if I were talking in a meeting, really."

這就是 Wayfinder 的價值所在 — **接住模糊需求**，透過對話把它們收斂成具體的 tickets。對話期間穿插展示其他 skill：

- **Sandcastle**：Matt 改成用 sub-agent-based approach 做 research tickets
- **Teach skill**：用來學習「怎麼讀程式碼」這類問題
- 質疑 pitch 跟 TikTok 的關係：TikTok 應該 extremely low friction，bypass pitch machinery

Matt 提到一個關鍵發現：**現有 `repos/ts-total-typescript-monorepo` 已經 deprecated**，裡面有個 remotion repo 可能要抽出來。

> "Notice how much fog there is in this… like we don't know the way yet. This is what wayfinder is doing. It's helping us find the way."

Wayfinder 在這段產生 tickets，分為幾種類型：
- **Grilling sessions**（對話討論型）— 需要做 decision
- **Prototype**（原型實作）— 需要動手寫 code
- **Research tasks**（調研）— 例如研究 TikTok API 公開哪些欄位

### Section 3｜Tickets 系統詳解（17:00 ~ 35:00）

Matt 展示 Wayfinder 在 GitHub 上產生的 issue 結構。`/wayfinder` 開了一個主 issue，底下掛了 **9 個 subtasks / subissues**，每個 subtask 都有 **blocking relationships**（依賴關係）。

> "We can see that it's got some blocking relationships here. So, we've got three open tickets which we can grab. This one is a grilling session. So, this means we need to have a conversation about something. This one is a prototype. So, this one means we need to actually like have a play and mess around with some code."

Matt 強調：**接 ticket 一定要用 Wayfinder 指定的 skill**（不能換成自己熟悉的工具）：

> "You should always use the skill the issue says to. Okay, yeah. Whenever you pick up a decision ticket, you've got to use Wayfinder."

這段展示 Wayfinder 的核心價值：**建立 ticket dependency graph**，讓多個 AI agent 可以並行處理。

接下來進入第一個 ticket 的處理：TikTok 影片的**格式**（aspect ratio）。Matt 跟 Wayfinder 對話討論：
- 現有 code base 有 portrait signal 但不可信（不要做 backfill）
- 假設所有 video 是 landscape（MVP 範圍）
- 接下來進入「what should it look like」問題

Matt 提到一個使用細節：**Opus 4.8 medium**，對話 no dead time（不是刻意不休息，是「while I'm working, no dead time」）。

> "I've got four terminal workers in one terminal window without tapping over? This is a Claude code feature. So it allows me to view it from the top level. I've really enjoyed using this."

> "Why don't I use Fable 5? Because I'm really happy with Opus. Really happy with Opus. It's doing good for me."

### Section 4｜多 Sessions 平行 + 架構決策（35:00 ~ 56:00）

Matt 解釋 Wayfinder 的 multi-session 並行策略：

> "This is just grilling here. Basically, you know, this is just grilling across multiple sessions about the same thing. And because they're in parallel, you end up being faster."

關鍵設計：**不依賴 GitHub**（issue tracker 可換其他工具）。處理完一個 ticket 標記 done，就關閉原 map thread。

這段處理多個 decision tickets：
1. **Top-level list of TikTok videos** 應該放哪？Matt 同意用 dedicated TikToks sidebar item。
2. **Render pipeline 應該放哪**？Matt 做出重要架構決策：

> "Extract just the My Comp 3 motion project into its clean standalone repo… CVM invokes it via a local shell out… CVM owns the surrounding glue natively."

架構原則：**CVM 是 local desktop tool**（不是 SaaS），用 OBS forwarder streaming。CVM 透過 shell out 呼叫獨立 repo，**CVM 負責周邊 glue code**。這樣保持單一職責。

> "Transcribe audio file. Yeah, that seems fine. Defer the eventual pull into CVM at later optional step."

### Section 5｜Decision Tickets vs Implementation Tickets（56:00 ~ 70:00）

Matt 處理另一個重要 ticket：**rendered vs posted** 在 local storage 的 UI 結構。Wayfinder 問 schema 怎麼 fit 進現有 CVM schema，Matt 同意需要再 grilling session 釐清。

> "Okay, decision fully grilled resolution comment post on the ticket. Good. Okay, so we've closed another ticket in the decision map or in the map."

每個 decision 都要在 ticket 留下 resolution comment。處理完一個 ticket 後，Wayfinder 問 "Needs input, may proceed"，Matt 答 "Yes, crack on"。

> "Okay, so it just needed input from me to ask whether it was okay to proceed. Fair enough."

下一個 ticket：Portrait view 的 editing experience（不是 top-level list experience）。Wayfinder 問「What actually lives in that new panel?」，Matt 講 clean seam 概念：tab contain no context read，lift as is。

> "Fully drop. And tab contain no context read, so that's a clean seam. Lift as is."

### Section 6｜完整 Pipeline + 收尾（70:00 ~ 結束）

Matt 最後講解完整的 tickets → implementation 流程：

> "And then to tickets, so I turn that into sub-tasks. Then I would implement each sub task in a separate context window, usually with an AFK agent cuz I'm not needed for that, and then I do a code review on the whole diff and fix any problems, and then it goes to human review."

**完整 5 步 pipeline**：
1. Wayfinder map → 拆 tickets
2. Tickets → sub-tasks
3. 每個 sub-task 用 **separate context window** 實作（通常是 AFK agent，因為 Matt 不需要在場）
4. **Code review on whole diff**（人工 review 整個 diff，找問題）
5. **Human review**（最終人工 review）

Matt 強調兩種 tickets 的本質差異：

> "There's a difference between the decision tickets that Wayfinder makes and the implementation tickets that to tickets creates. Cuz the decision tickets can only be resolved by resolving the decision, by making the decision. Whereas the implementation tickets are when those decisions are reified in the code or represented in the code."

**Decision tickets**：必須 resolve decision（透過對話釐清做什麼）
**Implementation tickets**：當 decision 被「具體化」（reified）到 code 時產生

收尾的 Q&A：
- **Done 偵測**：要問 "are you done yet or not"，這有點煩。Matt 解法：**看地圖**，看 sub issues 視覺化判斷
- **Backend / Frontend / Middle-end 都可用**：Wayfinder 不限定 stack
- **Feedback channel**：用 **Ask Matt skill**

> "If you have any questions about this, by the way, then you can use my ask Matt skill. That's the place to go for feedback."

最後 Matt 重申：spec ticket 跟 map ticket 的轉換 — fresh session，把 map 變成 big spec。

---

## 關鍵概念定義

| 概念 | 定義 | 對比 |
|------|------|------|
| **Wayfinder** | Matt 的 AI skill，演化自 Grill Me skill | Grill Me = 一對一對話釐清需求；Wayfinder = 整體性大規模工作 |
| **Pre-specification** | 寫 code 之前先用對話產生 spec 的階段 | 取代傳統直接 jump into coding |
| **Tickets** | Wayfinder 拆解 spec 後產生的 issue 項目 | 分為 decision / prototype / research |
| **Decision tickets** | 必須 resolve decision 才能關閉 | 透過對話釐清做什麼 |
| **Implementation tickets** | 當 decision 被 reified 到 code 時產生 | 透過 code 實作 |
| **Subtasks / subissues** | GitHub issue 底下的子項目 | 有 blocking relationships（依賴關係） |
| **Sub-agent-based research** | 用 sub-agent 做 research tickets | 因為 research 是簡單任務 |
| **AFK agent** | 不用人在場監看的 AI agent | Matt 用來 implement sub-tasks |
| **Sandcastle** | Matt 另一個 AI skill | 用 sub-agent 做 research |
| **Teach skill** | Matt 另一個 AI skill | 用來學習「怎麼讀 code」這類問題 |
| **Ask Matt skill** | Matt 的 feedback channel | 給使用者問問題用 |
| **CVM (Course Video Manager)** | Matt 現有的影片管理 app | Local desktop tool，stream via OBS |
| **My Comp 3 motion project** | CVM 內的一個 video rendering component | 抽出成獨立 repo |
| **Glue code** | CVM 內負責串接各 component 的周邊程式碼 | CVM owns surrounding glue natively |

---

## Wayfinder vs Grill Me Skill

| 特性 | Grill Me (舊) | Wayfinder (新) |
|------|---------------|----------------|
| **對話範圍** | 一對一釐清單一需求 | 整體性大規模工作 |
| **產出** | Spec ticket | Tickets graph（含 decision / prototype / research） |
| **Ticket 結構** | 扁平 | GitHub issue + subissues + blocking relationships |
| **Multi-session 平行** | 不支援 | 支援（grilling across multiple sessions） |
| **適用場景** | 單一 bug 或小 feature | 新功能模組、跨多檔案架構 |
| **Issue tracker** | 預設 GitHub | 可換任何 tracker（不依賴 GitHub） |

---

## 完整 Pipeline 流程圖

```
模糊需求（像在 meeting 講話）
        ↓
Wayfinder Map 階段（pre-specification）
        ↓ 產生 9 個 tickets
Tickets Graph（GitHub issue + subissues）
        ↓ decision / prototype / research
Decision Tickets（用 Wayfinder skill 處理）
        ↓ 留下 resolution comment
Implementation Tickets（sub-tasks）
        ↓ 每個 task 獨立 context window
AFK Agent Implement
        ↓
Code Review on Whole Diff（人工）
        ↓
Human Review（最終）
        ↓
Done
```

---

## 重要引用

> "Wayfinder, for those who don't know, is uh… a sort of evolution of the Grill Me skill. And it's a way of figuring out huge chunks of work all together and all in one piece."

> "Notice how much fog there is in this… like we don't know the way yet. This is what wayfinder is doing. It's helping us find the way."

> "You should always use the skill the issue says to. Okay, yeah. Whenever you pick up a decision ticket, you've got to use Wayfinder."

> "Extract just the My Comp 3 motion project into its clean standalone repo… CVM invokes it via a local shell out… CVM owns the surrounding glue natively."

> "There's a difference between the decision tickets that Wayfinder makes and the implementation tickets that to tickets creates. Cuz the decision tickets can only be resolved by resolving the decision, by making the decision. Whereas the implementation tickets are when those decisions are reified in the code or represented in the code."

> "And then to tickets, so I turn that into sub-tasks. Then I would implement each sub task in a separate context window, usually with an AFK agent cuz I'm not needed for that, and then I do a code review on the whole diff and fix any problems, and then it goes to human review."

---

## 人物分析

### Matt Pocock

- **身份**：AI Hero 創辦人，推廣「Skills For Real Engineers」AI 輔助開發方法論
- **背景**：講 TypeScript / AI 教育（從 Total TypeScript 起家），現推 AI Skills
- **技術偏好**：Opus 4.8 medium（不用 Fable 5）、Claude Code（4 terminal workers）、VS Code
- **工作風格**：no dead time、live coding 為主、AFK agent 處理可平行任務
- **核心信念**：**code review on whole diff** 是必要的（不能完全信任 AI agent 產出）

---

## 核心主旨總結

**Wayfinder = 把模糊需求轉成結構化 ticket graph 的 AI skill**，讓工程師可以一次處理大量工作而不用 jump into coding。它的核心價值在於（1）透過對話接住模糊需求、（2）建立 tickets dependency graph 支援 multi-session 並行、（3）嚴格區分 decision tickets（必須 resolve decision）和 implementation tickets（把 decision reified 到 code）。整套方法論的關鍵信念是：**code review on whole diff 仍然是必要的最後一關**，AI agent 不能跳過 human review。

---

## 金句摘錄

1. "Wayfinder is like a sort of grill me on steroids, basically." — 用 grill me on steroids 形容 Wayfinder 的進化幅度

2. "You see how vague I'm being? I'm not being particularly concrete here. I'm just kind of talking as if I were talking in a meeting, really." — 展示 Wayfinder 接住模糊需求的能力

3. "Notice how much fog there is in this… like we don't know the way yet. This is what wayfinder is doing. It's helping us find the way." — Wayfinder = 幫你 find the way

4. "You should always use the skill the issue says to." — 紀律：接 ticket 一定要用指定的 skill

5. "And because they're in parallel, you end up being faster." — Multi-session 並行的速度優勢

6. "CVM invokes it via a local shell out… CVM owns the surrounding glue natively." — 架構決策：獨立 repo + CVM 做 glue

7. "Decision tickets can only be resolved by resolving the decision… Implementation tickets are when those decisions are reified in the code." — 兩種 tickets 的本質差異

8. "Code review on the whole diff and fix any problems, and then it goes to human review." — Human review 仍然是必要的最後一關

9. "It is not dependent on GitHub. You can set it up any way you like." — Issue tracker 是可換的，不綁特定工具

10. "You often have to ask if you're done yet or not." — AI agent 不會主動報告完成，需要人介入

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260713_MattPocock_WayfinderDemo_口播稿.txt

- [opus X.X MB](../audio/20260713_MattPocock_WayfinderDemo.opus)（Telegram 友善）
- [m4a X.X MB](../audio/20260713_MattPocock_WayfinderDemo.m4a)（iOS 友善）
- [mp3 X.X MB](../audio/20260713_MattPocock_WayfinderDemo.mp3)（通用格式）
