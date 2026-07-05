# 【NTU 人工智慧導論（FAI 2026）— Final Project：Game Agent 誰是牛頭王】

**主講｜NTU FAI 2026 教學團隊 TA（4 位主講助教，本講為期初 Final Project 說明會）｜2026 / 03 / 11（學期第一週，當日課程 release 對應 FAI 0 課程介紹）**

> 影片連結：https://youtu.be/ZwPdq140EKQ
> 影片時長：33 分 11 秒（1991s）
> 性質：FAI Final Project 期初說明會 — TAs 講解「誰是牛頭王」卡牌遊戲 AI 比賽的規則、引擎、賽制與評分
> 來源：YouTube 無字幕，以 Whisper base 模型（CPU, fp16=False）聽寫繁中逐字稿
> 逐字稿：transcripts/20260311_ZwPdq140EKQ_逐字稿.txt
> **整理日期**：2026-07-05
> **課程**：NTU 人工智慧導論（FAI 2026, Foundation of AI）
> **講者**：NTU CSIE 人工智慧導論 教學團隊（4 位主講 TAs；具體姓名影片未完整提及，需後續確認）
> **本講位置**：FAI 系列「Final Project Briefing」單元（無 FAI 編號），與 FAI 0 同日 release 對應，這是 Project 第一次正式說明

---

## 一、主題與背景

這場影片是 NTU「人工智慧導論（FAI 2026）」Final Project 的期初說明會，由 4 位主講 TA（影片未完整揭示姓名，僅在末段提供 Email）對全體修課學生說明這學期 Final Project 的全貌。Project 主題是實作一個玩「誰是牛頭王（6 Nimmt!）」卡牌遊戲的 Game Agent，學生必須在確定性的遊戲引擎中設計出一套策略，與其他學生 Agent 在大規模錦標賽（Tournament）中對戰。

誰是牛頭王是 B.V. 設計的卡牌遊戲，4 位玩家各有 10 張手牌（共 10 輪），每輪各出一張牌，依數字順序插入 4 個牌堆（pile）。卡牌尾數含 5（含 55 結尾）會帶有不同數量的「牛頭」（負分標記）：尾數 5 = 2 顆、尾數 0 = 3 顆、00 = 5 顆、55 = 7 顆。當某個牌堆湊到第 6 張牌時，第 6 張的玩家必須吃下整個牌堆（含 5 張）作為 Penalty。遊戲目標是 10 輪結束時，累計牛頭數最少。

但 Project 的重點不在純粹的卡牌戰術，而在於：學生必須在 1 秒決策時間、~1GB 記憶體上限、禁止 Multi-process / Multi-thread、CPU only、無網路等嚴格環境限制下，設計出一個能在 500 場以上隨機分組的錦標賽中勝出的 Agent。Tournament 採 4 人一組的分組賽（Partition），全場全部玩家的分數線性內插到 0~100 分。Mid Submission（4/29）佔 15 分、Final Submission（6/14）佔 55 分、Report 30 分；額外有「Novelty 加分 5%」，鼓勵學生提出跟其他人「決策分布不同的策略」。

**核心議題一句話**：從一張卡牌的 1 秒決策與 ~1GB 記憶體上限出發，學生必須設計一個能在 500+ 場大規模錦標賽中取勝的 Game Agent——這份 Final Project 是把課堂上學到的 Exploitation / Exploration、Reinforcement Learning、Search 等概念，壓縮到「工業級嚴苛條件」下的實戰考驗。

---

## 二、章節脈絡

### Section 1｜遊戲介紹：誰是牛頭王（00:00 ~ 03:30）

**重點摘要：** 4 人 10 輪卡牌遊戲；牌尾數決定牛頭數（5 = 2、0 = 3、00 = 5、55 = 7）；目標是最少牛頭數。

**內容：**
- 遊戲官方名：6 Nimmt!（誰是牛頭王）
- 4 個玩家，每場開始發 10 張手牌
- 共 10 輪，每輪各出一張牌，依出牌順序由小到大排列加入 4 個牌堆之一
- 牌堆中牌依數字由小到大排序，新牌加入必須接續在某牌堆的結尾之後
- **牛頭分數規則**：牌尾數為 5 = 2 顆、結尾為 0 = 3 顆、00 = 5 顆、55 = 7 顆
- 10 輪結束時，總牛頭數最少的玩家勝
- 誰是牛頭王的大魔王牌（55）必須嚴格迴避

> "就是一場遊戲會有 4 個玩家，然後 4 個玩家每個人一開始都會拿到 10 張卡牌，然後每一輪你們就是要選一張手牌出去，然後等 10 輪呢 10 張卡牌都出出去，然後這個遊戲就結束了。"

### Section 2｜出牌規則與堆疊機制（03:30 ~ 06:00）

**重點摘要：** 4 個牌堆依序排列；第 6 張到時收走整堆；太小的牌會自動丟掉一整堆。

**內容：**
- 規則詳細說明：每輪玩家出牌後，4 個牌堆由小到大排序；若新牌小於某堆結尾，就必須放到比它更大但差距最小的牌堆
- 「第 6 張到時收堆」：當某牌堆已經有 5 張牌，而你出的牌是第 6 張時，你要收走整個 5 張（連同你出的那張共 6 張），牛頭數是這 6 張牌的總和
- 太小的牌「自動丟」：若手牌最小（例如 11），但所有 4 個牌堆結尾都大於 11，你必須「手動選擇丟掉 1 個牌堆」，然後把你的牌放上去
- 演算法已經寫死：優先選擇 Penalty 最少的牌堆扔掉，平手時選卡牌數少的，平手時選 index 小的

> "如果你的牌是所有牌就是你發現你的牌太小了，然後你沒有辦法接上牌面上的任何一張牌，那我們會有一個 Deterministic 方法幫你決定要把哪一個堆丟掉。"

### Section 3｜Game Engine 三段式架構（06:00 ~ 10:30）

**重點摘要：** Initialization → PlayGame → PlayRound；PlayRound 是核心，內含 4 項檢查（Timeout / Invalid Move / Memory Excess / Multiprocess 禁用）。

**內容：**
- **Initialization**：發牌、確認玩家名單
- **PlayGame**：執行整場遊戲（10 輪）
- **PlayRound**：每輪呼叫每位 Player 的 `action()` function，內部檢查：
  1. **Timeout**：每輪只有 1 秒可作決策，逾時自動出最小牌
  2. **Invalid Move**：例如手上沒有此牌、回傳非整數、用到 disallowed method
  3. **Memory Excess**：每位 Player 預設可用 ~1GB
  4. **Multiprocess / Multithread 禁用**：禁止額外 spawn process
- 違規會被偵測並送出特殊 Exception（DQ = Disqualify）

> "我們這個 Game Engine 有三個主要部分……第一個是 Initialization 它就是會發牌，然後選好說這場遊戲是哪些 Player 要來玩。然後第二個是 PlayGame，PlayGame 就是它會讓每一個 Player 都各出於四堆，然後就是有十輪。然後最後是 PlayRound 就是每一個 Round。"

### Section 4｜違規偵測與 Penalty 系統（10:30 ~ 17:00）

**重點摘要：** 偽違規（改 History / Random Seed）不扣分但也沒用；真違規（超記憶體 / Multi-process / 故意吃 Exception）扣 50%-70%。

**內容：**
- **沒用的違規**（不會扣分但也無法得逞）：
  - 改 Game History：系統每次傳「複製版」給你，改原始 Reference 沒用
  - 改 Random Seed：系統用 custom RNG，不吃你的重設
- **會扣分的違規**：
  - 記憶體超限：Process 整個被 kill，連累同組 4 人都 game over；扣分最多 50%
  - Multi-process / Multi-thread：同樣最多扣 50%
  - 故意 catch TimeoutException 又繼續算：最多扣 70%（最嚴重的違規，因為 LLM 自動生成的程式常見此 pattern）
- **其他次要錯誤**：DQ（被判定）、Code Exception、Out of Memory、Other Errors
- 提醒：如果你用 LLM 寫 code，記得自己額外檢查 Exception catch 有沒有包太寬

> "我們會幫你出你手上最小的牌……然後你的分數就是你自己拿到的 Penalty 跟因為這個 MinPlay 就如果你的時間超過，然後我們自己幫你出最小的牌，這樣子是你最後的 Penalty。"

### Section 5｜Tournament 賽制（17:00 ~ 22:00）

**重點摘要：** ≥500 場 Partition 降低 random 影響；分數線性內插到 0~100；DQ 用 MinPlay 取代。

**內容：**
- 每場 Tournament 包含多個 Partition，4 人一組
- 每個 Partition 內跑多場遊戲
- 至少跑 500 個 Partition 來避免 Randomness 波動，必要時跑更多
- **Random Player**：每次隨機出一張牌的對手
- 計分方式：4 人 rank 是 1、2、3、4；若平手則平均分數
- 整場總分是所有場次的平均 rank，再內插到 0~100
- DQ 處置：被取消資格的玩家，將以「每次出最小牌」的 Player 取代並繼續打完剩餘場次，最終分數 = DQ 前的分數 + MinPlay 取代期間的分數

> "這個 Random Player 是真的 Random，就是他每一次就隨機出一張牌……每一個 Partition 裡面就會有很多遊戲……我們至少會跑 500 個 Partition 來避免 Randomness。"

### Section 6｜開發環境與硬體限制（22:00 ~ 25:00）

**重點摘要：** Python 3.13.11 + CPU only + 1 秒決策 + ~1GB 記憶體 + 無 GPU 無網路。

**內容：**
- 測試環境：BCSI Workstation WS1 ~ WS7
- 評分環境：硬體保證「至少跟測試機一樣好」，但可能更好
- **CPU only**：請勿期待 GPU；不要上大型 NN
- **1 秒決策 / 回合**：超過時間會自動出最小牌
- **~1GB 記憶體 / Player**：超記憶體整個 Process 死掉
- **無 Multi-processing**：禁止 spawn sub-process
- **無網路**：evaluation 時環境離線，不要在 code 中 require 網路下載 model
- 建議用 Conda 環境隔離，避免自己 Python 被感染
- 額外的 Python package 須先 Email 申請，全班公告後才會加進 `requirements.txt`

> "我們不會有 GPU，所以請你全部的東西就是 CPU，然後不要用超級無敵的 Model。"

### Section 7｜Player Class 介面與 Sample Code（25:00 ~ 28:00）

**重點摘要：** 寫一個 `Player` class，需要 `__init__(player_index)` 跟 `action(hand, history)`；不要儲存 state，每次用 History 重算。

**內容：**
- Repo 結構：`Config/` + `Source/Players/<student_id>/<your_player>.py`
- TA 的 Player folder 不要動；自己寫一個 student-id 資料夾
- Class 需要兩個 function：
  - `__init__(self, player_index)`：拿到自己的編號
  - `action(self, hand, history)`：拿到當前手牌 + 完整遊戲歷史，回傳要出的牌（**注意 hand 是 stored by reference，不要直接 modify**）
- **不要儲存自己的 state**——每次用傳入的 History 重新算需要的值
  - 原因：避免 Process 被中途 kill / DQ 後恢復時 state 跟 history 不一致
- 自訂 Argument 可以加，但提交時請拿掉或設定 default 值
- History 內容包含：當前牌堆狀況、每個 Agent 分數、當前回合數、之前每輪每個玩家打了什麼、每輪過後每個堆的牌面、每個人累計 Penalty

> "我們為什麼要給你 Player Index 跟 History，就是不讓你自己存你的 History……我們希望你每次都是拿這個 History 重算你所需要的 Value。"

### Section 8｜評分政策（28:00 ~ 33:11）

**重點摘要：** 70% Performance + 30% Report；Mid / Final 兩次提交；線性內插分數；Novelty 加分 5%。

**內容：**
- **總分 100**：Performance 70 + Report 30
- **Mid Submission（4/29）**：15 分，跑 40 個 Face Line；前 27 個 Face Line 中 release 5 個
- **Final Submission（6/14）**：55 分，跑 55 個 Face Line；前 27 個 + 後續中再 release 5 個
- **線性內插分數**：
  - Mid：能贏過第 5 個 Face Line 保底 60 分；贏第 20 個保底 90 分
  - Final：能贏過第 20 個 Face Line 保底 40 分；贏第 50 個保底 90 分
- **Face Line 用途**：可用來生成 training data，但**不要 import** 進提交 code
- **Bonus**：Final Rank 預測準的 + Novelty 加分最多 5 分
- **Novelty 評分雙重標準**：
  1. TA 主觀看 Report，判斷方法多新穎
  2. Quantitative script：跑同一個 Board 比對所有 Agent 的決策機率分布
- **Mid Submission 動機**：這學期是新遊戲第一年，需要全班幫忙抓 bug

> "因為這個遊戲是越少分的人贏，所以最後一個人他就是第一名，那剩下三個人他們就是就是會平分 2-3-4 名。"

### Section 9｜提交規範與獎勵（30:30 ~ 33:11）

**重點摘要：** 每個學生提交 2 個最佳 Player；3 頁 Report 上限；不要直接用 release 的 Face Line。

**內容：**
- 每位學生繳交 2 個最好的 Player（Best Player 1, Best Player 2）
- 提交內容：所有相關 code（生成 data、訓練 script 等）+ 一個 README 解釋其他 code
- 提交格式：`<student-id>.zip` 內含一個同名的資料夾
- **不要把 cache 打包進 zip**
- Report ≤ 3 頁，內容：
  1. 試過哪些方法
  2. 為什麼選這兩個 Player
  3. 兩個 Player 的比較（擅長 / 不擅長的對手）
  4. 未來改進方向 / 對遊戲的反思
- 不要把字縮到超小撐到 3 頁
- 鼓勵同學之間討論策略
- TA Hour：每週三下午，需前一天登記；Email 標題記得加 [Final Project]
- **Discord 討論區**：在 NTU COOL 上開，方便同學互助

---

## 三、關鍵概念定義表

| 概念 | 定義 / 出處 | 應用場景 |
|------|-------------|----------|
| 誰是牛頭王 / 6 Nimmt! | B.V. 設計的卡牌遊戲；4 人 10 輪；結尾數字決定牛頭數 | FAI 2026 Final Project 主題 |
| 牛頭（Penalty） | 標記在卡牌上的負分；5 = 2 顆、0 = 3 顆、00 = 5 顆、55 = 7 顆 | 計算每場遊戲分數的關鍵變數 |
| 牌堆（Pile） | 4 個玩家共同維護的 4 個牌堆；新牌按數字順序接續 | 遊戲狀態的核心資料結構 |
| 第 6 張收堆 | 當某牌堆已有 5 張牌，第 6 張到時整堆收走 | 拿牛頭的最重要瞬間 |
| MinPlay / Random Player | 預設對手：每次隨機出牌 / 每次出最小牌 | DQ 取代用、Baseline 對比用 |
| Partition | 4 人一組的 Tournament 單位；至少 500 場 | Tournament 架構 |
| Face Line | AI Agent 強度分級；用於內插分數 | Mid 40 條 / Final 55 條 |
| Game Engine | 三段式架構：Initialization → PlayGame → PlayRound | 學生寫 Player 必須熟悉的介面 |
| DQ（Disqualify） | 違規後被取消資格；分數由 MinPlay 取代期間計算 | 違規處置 |
| DQ Penalty | 違規扣分百分比：Memory Excess / Multiprocess -50%、故意 catch Timeout -70% | 真違規的懲罰 |
| Novelty 加分 | TA 主觀 + 量化 script 評估方法新穎度；最多 +5% | 鼓勵多元策略 |
| Hand Reference | Game Engine 傳給 Player 的手牌是 reference；不可直接 modify | 寫 Player 時的關鍵陷阱 |

---

## 四、人物 / 角色分析

### 主講 TA 群（影片前半 ~28 分鐘）
- 影片由一位主要 TA 主講（經常以「我」表示自己負責的 Engine 與 Game 部分）
- 另一位 TA 負責解釋 Player Class 介面與 Sample Code
- 還有一位 TA 負責補充評分政策與 Novelty 加分細節
- 整體而言：TAs 對這套 Game Engine 設計有充分掌握，強調嚴格執法（DQ、Memory 監控、Timer）

### 第二 TA（Player Class / Sample Code）
- 在 Section 7 中詳細說明寫 Player 的注意事項
- 強調「不要存自己的 state」、「每次用 History 重算」、「hand 是 reference 不要 modify」
- 提供具體的 Repository 結構、Configuration 寫法、跑單場/整場 Tournament 的指令

### 第三 TA（評分政策 / Novelty）
- 在 Section 8 末段說明 Novelty 雙重標準
- 解釋 Face Line 內插與對訓練 data 使用的限制
- 補充 Diversity 量化機制：拿同一個 Board 比對所有 Agent 的決策機率分布

### 第四 TA（時間表 + 提交規範）
- 在 Section 9 末段說明時間表與提交細節
- 補充 TA Hour 預約規則
- 鼓勵同學間策略討論（即使不能抄 code）

---

## 五、核心主旨

> FAI 2026 Final Project「誰是牛頭王」把課堂所學的 Exploitation / Exploration / Search / Reinforcement Learning 等概念，整合到 1 秒決策、~1GB 記憶體、CPU only、無 Multi-process 的嚴苛工業級條件下；學生必須設計 Game Agent 在 500+ 場大規模 Tournament 中勝出，並提出具備「方法新穎度 + 決策分布多樣性」的策略。整體設計目標是同時訓練 ML 工程能力（環境優化、AI 工具協作、3 頁精準表達）與 AI 研究能力（策略設計、Search 演算法、強化學習）。

---

## 六、金句摘錄

1. "我們這個 Game Engine 有三個主要部分：第一個是 Initialization……然後第二個是 PlayGame……然後最後是 PlayRound 就是每一個 Round。"
2. "你的分數……你自己拿到的 Penalty 跟因為這個 MinPlay 就如果你的時間超過，然後我們自己幫你出最小的牌，這樣子是你最後的 Penalty。"
3. "這個 Random Player 是真的 Random，就是他每一次就隨機出一張牌……我們至少會跑 500 個 Partition 來避免 Randomness。"
4. "我們為什麼要給你 Player Index 跟 History，就是不讓你自己存你的 History……我們希望你每次都是拿這個 History 重算你所需要的 Value。"
5. "中間人就是按照名次差值在線性內插的位置……你要打到第 50 個 Face Line 你才可以拿到 90 分。"
6. "會給你微調的部分……我們會看你的方法有多 Novel……你的 Model 它面對同一個 Board 它會做的決策跟別人很不一樣，而且你在這個情況下還可以表現很好，我們可能會幫你加分。"
7. "我們就從前面 27 個 Face Line 裡面選出 5 個 Face Line release……你們的 Face Line 超級多的，所以就是不要 overfit 在我們 release 的那幾個 Face Line 上面。"

---

## 七、延伸閱讀 / 參考

- B.V. **6 Nimmt!**（誰是牛頭王）— 德國經典卡牌遊戲，FAI 2026 Final Project 主題
- 林軒田《Learning from Data》— FAI 課程主要教科書，提供 Game Agent 設計背後的 ML 基礎
- FAI 系列其他單元 — Search / Exploitation & Exploration / Reinforcement Learning 等
- Python `concurrent.futures` / 多執行緒相關文件 — 學生實作 Player 時的環境界線

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd, voice_id=xiaotian_clone_v1），約 4 分 31 秒（271.2s, silent ratio 6.95%）
> 口播稿原文：transcripts/20260311_NTUFAI_FinalProject_GameAgent誰是牛頭王_口播稿.txt

- [opus 4.3 MB](../audio/20260311_NTUFAI_FinalProject_GameAgent誰是牛頭王_口播稿.opus)（Telegram 友善）
- [m4a 4.3 MB](../audio/20260311_NTUFAI_FinalProject_GameAgent誰是牛頭王_口播稿.m4a)（iOS 友善）
- [mp3 4.1 MB](../audio/20260311_NTUFAI_FinalProject_GameAgent誰是牛頭王_口播稿.mp3)（通用格式）
