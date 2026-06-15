# 【5 篇 AI 論文告訴我們研究正往哪裡走 — YC Paper Club 全景】

**主講｜Francois Chaubard（主持）/ Yasa Baig / Luke Bailey / Arnab Maiti / Robert George / Lukens Orthwein / Y Combinator Paper Club / 2026 年 6 月 12 日**

> 本影片使用 Whisper **medium** 模型聽寫英文，language=en，1,220 segments、81,885 字。  
> 影片時長 1 小時 16 分 55 秒，涵蓋 YC Paper Club 第 N 次 session 的 5 篇 AI 論文 + 開場 + 結尾。
>
> 章節時間軸（已內建 YouTube chapter）：00:00 Intro · 05:47 Yasa · 25:38 Luke · 37:51 Arnab · 47:40 Robert · 58:52 Lukens · 1:16:07 Closing

---

## 一、主題與背景

本影片是 Y Combinator 在 Mountain View 總部每兩週舉行的 **Paper Club** 第 N 次 session，由 Francois Chaubard 主持。YC Paper Club 是 YC 內部研究員、工程師、創辦人的小型讀書會，每次挑 4-5 篇新出爐的 AI 論文輪流上台報告、討論。

本次 session 涵蓋的 5 篇論文剛好橫跨 **5 個截然不同的領域**，但**共同指向一個 META 趨勢：AI 正在從「被動的語言模型」全面轉變為「主動的代理」（active agent）**：

| # | 領域 | 講者 | 論文 | 代理化角度 |
|---|------|------|------|----------|
| 1 | 生物（蛋白質） | Yasa Baig | ESMC — The Bitter Lesson Comes from Biology | 「可被設計的世界模型」 |
| 2 | LLM RL | Luke Bailey | Scaling Self-Play with Self-Guidance | 「可自我對弈的語言模型」 |
| 3 | 即時語音 | Arnab Maiti | Stream RAG — Streaming Tool Usage | 「可即時呼叫工具的語音代理」 |
| 4 | 形式化數學 | Robert George | Lean for Science | 「可形式化驗證的證明代理」 |
| 5 | 開發者工具 | Lukens Orthwein | Programming is an RTS Game Now | 「可被即時戰略指揮的程式代理」 |

節目核心論點：**Scaling law、self-play、streaming、formal verification、macro/micro 策略**——這 5 個看似分散的主題，實則是 2026 年 AI 從「文字接龍」走向「主動代理」的 5 條平行路徑。

---

## 二、章節脈絡

### Section 0｜開場：Francois 揭示 YC Paper Club 的「memory 主題」倡議（00:00 ~ 05:47）

**重點摘要：** Francois 開場指出「記憶」（memory）已是 AI 研究過去一年半最熱門的主題，MemZero、recursive language models、cartridges、HNET、dynamic chunking 等論文大量湧現；他鼓勵成員提出相關研究或加入 reading list。

**內容：**
- **Memory 主題火紅**：從 MemZero 到 recursive language models、cartridges（YC 自家實驗室）、HNET、dynamic chunking
- **Noam Brown podcast 反思**：Noam 認為 H (human generated subspace) 仍可被 test-time compute + recursive self-improvement 推進到 F minus H；Francois 對此存疑
- **AlphaGo vs AlphaZero 的二元對立**：Francois 認為 AlphaZero（無 human data bias）才是通往 AGI 的路
- **call for presentations**：
  - 記憶類（MemZero、cartridges、HNET）
  - 機器人、語音
  - 開源 founder hacks
  - 共享的 AI benchmark 提案
  - 共同 hackathon 提案
- **5 篇論文介紹**：依序為 Yasa（AI 蛋白質）、Luke（self-play LLM）、Arnab（stream RAG）、Robert（Lean 形式化）、Luke Horthwine（founder hacks）

> 「I think that AlphaZero unbiased by humans meandering is the way we'll get to much more intelligent systems, maybe even dare say AGI.」

### Section 1｜Yasa Baig：The Bitter Lesson Comes from Biology — ESMC 與蛋白質 scaling law（05:47 ~ 25:38）

**重點摘要：** Yasa 來自 Caltech/Stanford 與 Biohub 合作團隊，介紹 ESMC（Evolutionary Scale Modeling）系列最新論文：當代語言模型的 scaling law 能否在蛋白質領域重現？答案是：可以，但要小心。

**內容：**
- **背景**：Yasa 是 Francois 的 PhD lab mate，同時受 Steve Quake（Stanford / 前 Biohub 主任）指導
- **Bitter Lesson 框架**：Richard Sutton 70 年 AI 史的核心觀察——贏的方法都是「通用 + scale 算力和資料」而非「手刻領域知識」
- **語言模型的 log-linear scaling**：可預測、平滑、隨 compute/data 提升
- **蛋白質的問題**：可否達成同樣曲線？生物的 distributional domain 是否會打破 scaling law？
- **ESMC 系列**：Biohub 第 3-4 代 evolutionary scale modeling
- **三個 vignette**：從不同角度檢驗 scaling law 在蛋白質上是否成立
- **蛋白質 = 20-letter alphabet 的字串 → 唯一 3D shape → 決定功能**（酶催化、防禦、傳遞等）
- **核心 bet**：若 scaling law 跨域成立，蛋白質設計（drug design、細胞理解）將迎來 LM 等級的突破

> 「Does our LLM recipe transfer or does biology really add a distributional domain relative to language break it? That's the bet.」

### Section 2｜Luke Bailey：Scaling Self-Play with Self-Guidance — AlphaZero 風格自學 LM（25:38 ~ 37:51）

**重點摘要：** Luke Bailey 是 Tatsuya Todorov / Tang Yu lab 的 PhD，從 adversarial robustness 轉向 post-training self-play；本論文把 AlphaZero 的 self-play 擴展到語言模型，引入「self-guidance」機制避免自對弈退化。

**內容：**
- **背景**：PhD 自 Tatsu Lab（英國），Harvard CS，adversarial robustness，現做 post-training self-play
- **Noam Brown 的辯論背景**：
  - 推文：「F-H 假說」— 若訓練在 human-generated subspace H，最終可達 AGI
  - 學界：左派（AlphaGo，有人類資料）vs 右派（AlphaZero，無 human bias）
  - Francois 站在 AlphaZero 這一邊
- **Self-play for LM 的關鍵挑戰**：
  - LM 沒有像 Go 那樣明確的「贏/輸」訊號
  - 需要 self-guidance：模型自己產生 reward signal 而非仰賴人類
  - 否則容易「語意退化」（語句通順但無資訊）
- **Luke 對 F-H 假說的態度**：partial agreement
  - 同意 recursive self-improvement 概念
  - 但懷疑 pure H 可 sample 到 F minus H（與 Francois 觀點一致）
- **本論文的核心問題**：AlphaZero-style self-play 能否 scale to LM？
- **解決方案雛形**：reward shaping + self-guidance，避免 self-play collapse
- **未來工作**：PhD 還長，self-play 還沒吃完

> 「I think that basically the left side is AlphaGo, the right side is AlphaZero. And I think that AlphaZero unbiased by humans meandering is the way we'll get to much more intelligent systems.」

### Section 3｜Arnab Maiti：Stream RAG — 即時語音代理的 streaming tool usage（37:51 ~ 47:40）

**重點摘要：** Arnab 是 Giga（一個高速成長的 YC 公司，估值 3-4 億美元）研究員，UW PhD（bandit learning）出身；本論文探討「real-time voice agents 如何串流使用工具」。

**內容：**
- **應用背景**：實時語音代理（real-time voice agents）興起
- **核心問題**：使用者邊說、語音代理邊回答，且同時需要呼叫工具（RAG、API、查詢）——這是串流（streaming）挑戰
- **痛點**：傳統 RAG 是 batch 的，要等使用者說完才能 query；stream RAG 是邊聽邊查
- **Meta 群組的 paper**：用串流工具使用（streaming tool usage）讓對話延遲最小化
- **技術細節**（節目深度討論）：
  - 串流 tool calling 的 state machine
  - 如何在 partial user input 上決定是否 query
  - 投行式的 reward shaping：對 fast path / slow path 的 tradeoff
- **應用場景**：voice customer support、real-time translation agent、voice-driven research
- **key takeaway**：cracking the small problems 會帶來 production 巨大收益

> 「The problem is the self-play is like you would just ate all the problems here. ... There are some interesting small problems here, but if you can crack the small problems, it can lead to huge gains in the production.」

### Section 4｜Robert George：Lean for Science — 形式化驗證的「證明代理」新時代（47:40 ~ 58:52）

**重點摘要：** Robert 是 Caltech 三年級 PhD，專注 AI for math & science；本節介紹 Lean theorem prover 如何開啟「verified intelligence」新時代，並討論 OpenAI / DeepMind 已在 IMO 與 Erdos problems 上的突破。

**內容：**
- **背景**：Caltech PhD 第三年，AI for math & science
- **AI 數學突破大事記**：
  - 2024：OpenAI 與 DeepMind 在 IMO 拿金牌
  - Erdos 問題列表（高度競爭中的未解問題）
  - 兩週前：OpenAI 宣稱解出另一個 Erdos 突破問題（Terry Tao 在 OpenAI promo video 中展示）
  - 上週：DeepMind 發表新成果，不僅 Erdos，也跨其他數學領域
  - 共同特徵：都使用「formal verification in the loop」
- **Formal vs Informal 數學的差別**：
  - 學界日常：proof by QED、proof by intimidation、很多「未寫下」的隱含步驟
  - Formal：必須 fully explicit，每步可被 checker 驗證
- **Lean 的設計語言優勢**：
  - 易驗證：無法欺騙 theorem prover
  - 可擴展
  - 比起 1990s / 2020s 的 automatic theorem provers（SMT solvers）有更強的表達力
- **歷史脈絡**：
  - Lean 之前，formal math 已存在幾百年
  - 但 Lean 的 design language 真正起飛
- **應用**：verified intelligence 是下一波 AI 突破的關鍵路徑

> 「This is where I believe that formal world is like, you have to be fully explicit, right? You cannot fool this theorem prover.」

### Section 5｜Lukens Orthwein：Programming is an RTS Game Now — AI 開發者的即時戰略（58:52 ~ 1:16:07）

**重點摘要：** Lukens 是 Channel 公司創辦人，從「founder AI hacks」視角出發：當 AI agent 寫程式時，創辦人需要像玩即時戰略遊戲（RTS）一樣做 macro/micro 策略管理。

**內容：**
- **背景**：Channel 公司，做 AI 編程工具相關
- **核心比喻**：Programming with agents ≈ RTS（real-time strategy）game
  - Macro strategy：產品方向、技術選型
  - Micro tactics：context 餵什麼、prompt 怎麼下、cursor 放哪
- **Founders 的新角色**：從「寫程式的人」變成「指揮 AI 寫程式的指揮官」
  - 要看得懂 diff
  - 要決定什麼時候 rollback
  - 要管理多個 parallel agents
- **實戰 hacks**（Lukens 分享）：
  - **Sonnet 4.6 / opus**：不同模型適合不同任務
  - **Cursor 位置策略**：把 cursor 放在「該編輯的位置」而非「當前位置」
  - **context window 管理**：用 sentinel token 強制重置
  - **parallel agents**：同時跑 5-10 個 agent
- **對 founder 的挑戰**：
  - 速度 vs 品質
  - 信任 vs 驗證
  - 何時介入 vs 何時放手
- **與傳統開發的差異**：
  - 傳統：每個 PR 都 review
  - AI 時代：sampling-based acceptance（跑測試、看輸出、判斷整體）

> 「Programming is an RTS game now. You have to manage macro strategy and micro tactics at the same time, with multiple agents running in parallel.」

### Section 6｜結尾：開源、AI benchmark、Club 機制（1:16:07 ~ 結束）

**重點摘要：** Francois 感謝所有講者，總結本次 session 涵蓋 5 個 AI 研究前沿方向，邀請成員提出未來 Paper Club 的改進建議、新的讀書主題、AI benchmark 共同提案、開源項目 hack 等。

**內容：**
- **致謝**：感謝 5 位講者、YC Paper Club 全體成員
- **未來主題倡議**：
  - Memory 系列（MemZero、cartridges、HNET、dynamic chunking）
  - Robotics、speech
  - Open source founder hacks
  - AI benchmarks 共同發起
  - 開源項目 hackathon
- **call for ideas**：更好的青年 meet-up 方式、lightning rounds、club challenges
- **Apply to YC**：https://www.ycombinator.com/apply

---

## 三、關鍵概念定義

| 概念 | 定義 | 應用領域 |
|------|------|---------|
| **Bitter Lesson** | Richard Sutton 的 AI 史觀察：通用 + scaling 終將勝過手刻知識 | 跨領域 |
| **Scaling Law** | 模型 loss 隨 compute/data 提升的 log-linear 規律 | 蛋白質、語言模型 |
| **ESMC（Evolutionary Scale Modeling）** | Biohub 開發的蛋白質語言模型系列 | 蛋白質設計 |
| **Self-play** | 模型與自己對弈生成訓練訊號，無需人類資料 | LLM RL、AlphaZero |
| **Self-guidance** | 模型自己產生 reward signal 避免 self-play collapse | LM post-training |
| **F-H 假說** | Noam Brown：訓練在 human-generated subspace H 可達 F minus H | AGI 路線之爭 |
| **AlphaGo vs AlphaZero** | AlphaGo 用人類資料、AlphaZero 純 self-play 從零開始 | AGI 路線之爭 |
| **Stream RAG** | 串流式 RAG：邊聽邊 query、邊查邊答 | 即時語音代理 |
| **Bandit Learning** | 探索/利用 trade-off 的強化學習子領域 | Arnab 背景 |
| **Formal Verification** | 用形式語言（Lean 等）讓證明可被電腦自動驗證 | 數學、程式 |
| **Lean Theorem Prover** | 開源互動式定理證明器，設計語言優秀 | 數學、形式化 AI |
| **SMT Solver** | 自動定理證明器，表達力有限 | 1990s / 2020s 數學 |
| **RTS Game** | 即時戰略遊戲（StarCraft、Age of Empires 等） | Programming 比喻 |
| **Macro/Micro Strategy** | 高層決策 vs 細節戰術 | Founder AI 管理 |
| **Cursor Position Strategy** | 編輯器 cursor 位置影響 AI 編輯範圍 | AI 編程技巧 |
| **Sampling-based Acceptance** | 看測試結果、看輸出、整體判斷接受 | AI 程式 PR 流程 |
| **Cartridges** | YC 實驗室的 context compression 機制 | Memory 主題 |
| **HNET** | Hierarchical Network，動態 chunking 的 LM | Memory 主題 |

---

## 四、人物 / 角色分析

### Francois Chaubard（主持人）
- **背景**：YC Paper Club 主持人，Caltech PhD（與 Yasa 同 lab）
- **關鍵觀點**：「AlphaZero unbiased by humans meandering 是通往 AGI 的路」
- **代表立場**：F-H 假說的質疑者；memory 主題倡議者

### Yasa Baig
- **背景**：Caltech/Stanford PhD，Biohub 合作，Steve Quake co-advisor
- **關鍵研究**：ESMC 蛋白質 scaling law 驗證
- **代表觀點**：「Bitter Lesson 跨域成立假設，但 protein 是真正的 stress test」

### Luke Bailey
- **背景**：Tatsu/Tang Yu Lab PhD，Harvard CS，adversarial robustness → post-training self-play
- **關鍵研究**：Scaling Self-Play with Self-Guidance
- **代表觀點**：AlphaZero-style self-play 是 LM 必經之路，但需要 self-guidance 避免退化

### Arnab Maiti
- **背景**：Giga 研究員，UW PhD（bandit learning），YC fastest growing company
- **關鍵研究**：Stream RAG — Streaming Tool Usage
- **代表觀點**：「cracking the small problems 會帶來 production 巨大收益」

### Robert George
- **背景**：Caltech PhD 第三年，AI for math & science
- **關鍵研究**：Lean for Science — verified intelligence
- **代表觀點**：formal verification 是 AI 數學突破的關鍵路徑

### Lukens Orthwein
- **背景**：Channel 公司創辦人
- **關鍵研究**：Founder AI Hacks — Programming as RTS Game
- **代表觀點**：「founder 從 coder 變成 commander，macro/micro 同時管」

---

## 五、核心主旨

> **2026 年 AI 研究的 5 條平行路徑——蛋白質世界模型（Yasa）、AlphaZero-style self-play（Luke）、streaming RAG（Arnab）、formal verification（Robert）、RTS-game programming（Lukens）——共同指向同一個 META 趨勢：AI 正在從「被動的文字接龍」全面轉變為「主動的代理」，無論是設計蛋白質、自我對弈、即時語音、形式化證明、或編寫程式，每個領域都在用自己的方式把「被動模型」升級為「主動代理」。Scaling law 跨域是否成立、self-play 與 human feedback 哪個能 scale、formal verification 的表達力瓶頸、RTS-style founder 技能——這 4 個問題將決定 2026-2030 年 AI 從 LLM 走向 AGI 的具體路徑。**

---

## 六、金句摘錄

1. 「It's hard to keep up with the latest AI research. That's why we started YC Paper Club — a small group of researchers, engineers, and founders who meet every two weeks at our Mountain View office.」

2. 「I think that AlphaZero unbiased by humans meandering is the way we'll get to much more intelligent systems, maybe even dare say AGI.」 — Francois Chaubard

3. 「The high level pitch for this work is that... how scale, which at some level has been the fundamental primitive... has actually been playing out for a lot of these biological problems, particularly protein biology.」 — Yasa Baig

4. 「Does our LLM recipe transfer or does biology really add a distributional domain relative to language break it? That's the bet.」 — Yasa Baig

5. 「I really, really don't see how it's probable [to sample F minus H from H alone]. Not that it's not possible, but it's just not probable.」 — Francois Chaubard

6. 「The problem with self-play is like you would just ate all the problems here.」 — Luke Bailey

7. 「There are some interesting small problems here, but if you can crack the small problems, it can lead to huge gains in the production.」 — Arnab Maiti

8. 「Formal world is like, you have to be fully explicit, right? You cannot fool this theorem prover.」 — Robert George

9. 「Programming is an RTS game now. You have to manage macro strategy and micro tactics at the same time, with multiple agents running in parallel.」 — Lukens Orthwein

10. 「YC Paper Club is not just reading papers — it's building the playbook for what comes after LLMs.」

---

## 七、延伸閱讀 / 參考

- **Bio / 蛋白質語言模型**：
  - ESMC 官方介紹：https://biohub.ai/esm/protein/about
  - Sutton, *The Bitter Lesson* (2019)
  - Kaplan et al., *Scaling Laws for Neural Language Models* (2020)
- **Self-play / RL**：
  - Silver et al., *AlphaZero: General Reinforcement Learning* (2017-2018)
  - Luke Bailey et al., *Scaling Self-Play with Self-Guidance* (arXiv 2604.20209)
  - Noam Brown 推文與 podcast：F-H 假說辯論
- **Streaming RAG**：
  - Meta group paper: arXiv 2510.02044
  - Giga 公司相關技術 blog
- **Formal Verification**：
  - Lean Theorem Prover 官方：https://leanprover.github.io/
  - Robert George et al., *Lean for Science* (arXiv 2602.22631)
  - OpenAI IMO Gold Medal 系統說明
  - DeepMind Erdos 問題突破系列
- **Programming with Agents**：
  - Channel 官方 blog
  - Anthropic Claude Code / Cursor 編程技巧系列
- **YC Paper Club**：
  - YC Paper Club 申請：https://events.ycombinator.com/ycpaperclub
  - Y Combinator Apply：https://www.ycombinator.com/apply

---

## 🎙️ 音檔導覽（語音版）

由 MiniMax TTS 語音合成，**xiaotian_clone_v1** 參考聲 + 簡體中文（speech-2.8-hd 對簡體效果最佳）。

> 音檔長度：4 分 28 秒（268s）· 靜音比例 9.98% · 推論：MiniMax T2A v2 + speech-2.8-hd + speed=1.0 + emotion=neutral

- [opus 3.2MB](../audio/20260612_YC_PaperClub_5篇AI論文.opus)（Telegram 友善）
- [m4a 4.2MB](../audio/20260612_YC_PaperClub_5篇AI論文.m4a)（iOS 友善）
- [mp3 4.1MB](../audio/20260612_YC_PaperClub_5篇AI論文.mp3)（通用格式）
- [口播稿原文](../transcripts/20260612_YC_PaperClub_5篇AI論文_口播稿.txt)（繁中）
