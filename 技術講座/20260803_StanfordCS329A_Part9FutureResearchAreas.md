---
講者: Stanford CS329A 課程團隊（Azalia Mirhoseini, Jure Leskovec, 加州史丹佛大學）
影片連結: https://www.youtube.com/watch?v=AyO6wyu4DEg
影片長度: 1:07:42（4062s）
發布日期: 2026-08-03
關鍵字: self-improving agents, future research, multi-agent fine-tuning, meta verification, self-proposed tasks, intelligence per watt, continual learning
主講系列: Stanford CS329A — Self-Improving AI Agents
集數: Part 9（最終集）
---

# 【Stanford CS329A — Part 9 — Future Research Areas】

## 主題與背景

本集是 Stanford CS329A「Self-Improving AI Agents」系列課程的最終集，由兩位主導教授 Azalia Mirhoseini 與 Jure Leskovec 共同講授，並邀請 Azalia 博士後（曾與 John Hennessy 合作研究）短講「Intelligence per Watt」專題。整堂課定位為「未來研究路線圖」，重點不在於複習既有的 test-time scaling 或 RL 訓練技巧，而是從三大 open problems 切入——**多樣性、驗證瓶頸、任務選擇**——並以一條全新的效率指標（Intelligence per Watt, IPW）收束，預測下一波 6–12 個月 self-improving agents 研究的走向。

課程中段以三篇代表性論文作為切入點：multi-agent fine-tuning（多專家辯論生成多樣化 reasoning chains）、DeepSeek-Math V2（meta-verification 自動形成 self-verification loop）、以及 Absolute Zero / 自提任務（model 同時扮演 proposer 與 solver，自己設計 curriculum）。結尾則提出四大未解問題——**test-time scaling 的理論基礎、testing-time scaling 與 RL fine-tuning 的飛輪、continual learning 的可行性、以及高效低延遲的 test-time scaling 基礎設施**。本集對於想進入 self-improving agents 領域的研究生、工程師、政策制定者，是一份濃縮的「接下來要做什麼」清單。

從產業意義來看，這堂課揭示了學界對未來一年的共識：agents 的能力不會只靠更大的模型解掉，而是要靠**多樣化推理路徑 + 可自我驗證 + 可自主生成任務**三個維度同時突破；同時，運算效率（per watt）將取代單純 benchmark 排名，成為下一代 agent 系統的核心競爭指標。

---

## 7 個核心章節

### Section 1｜全季回顧與 self-improving agents 的核心定義（00:00 ~ 02:50）

**重點摘要**：回顧 CS329A 一整季涵蓋的脈絡——從 LLM 基礎、搜尋/RL、open-endedness、tool use、規劃、retrieval，到 post-training / multi-modal / robotics 多場 guest lectures——並把 self-improving agent 定義為「有目標、可與環境互動、收集 feedback、修正自身步驟」的系統。

**內容：**
- 一開頭講師用一段總綱回顧整季主題：test-time scaling 與 train-time scaling 透過 verifier 與 feedback 形成 hill-climbing 迴路；open-endedness / Alpha Evolve 開啟探索式自演化；tool use 讓 agent 與環境互動；retrieval / memory / planning 撐起多步驟工作流；guest lectures 補上 post-training、multi-modal、robotics、reasoning 等子題。
- Jure 補一個觀察：symbolic techniques 屬於 tool use 傘下，但被用於合成更多合成資料，正在成為新的潮流。
- 課程的核心定義：**agent 是 LLM 的一般化**——它有目標、會與環境互動、會採集 feedback、會修正步驟。當前雖然 LLM 還不足以獨立撐起完整目標，但 coding agent 已開始讓 workflow 自驅動。
- 講師提醒：通常形式會是 orchestration，verifier 也可能是 LLM-as-judge、tool call、search algorithm 或平行 LLM 採樣；系統需要 planning + 自我修正 + 持續自我改進。
- 本集定位：未來 6–12 個月內 field 會關注的「新方向」——兼顧 self-improvement 與 intelligence efficiency。

> 「The class is named as self-improving agents. So it's not just focusing on LLMs, it's focusing on the agent aspect of it.」
> — Jure Leskovec

---

### Section 2｜多樣性瓶頸 — Multi-Agent Fine-Tuning 與多樣化 Reasoning Chains（03:00 ~ 13:00）

**重點摘要**：單一 LLM 自我迭代多次後，diversity 崩潰導致 accuracy 很快 plateau；multi-agent fine-tuning（多個 specialized generation 與 critic agent 互相 debate）能在多輪 fine-tuning 持續維持 diversity 並 hill-climb 超越單 agent 設定。

**內容：**
- **問題起點**：pre-training 是「internet scale 的人類多樣化資料壓縮」，但 instruct-tuning 與 rejection sampling 後續迭代使用同一個 LLM 產生自己的 output，導致 response 多樣性不足、單 agent fine-tuning 經過幾輪迭代後 accuracy collapse。
- **解法**：multi-agent fine-tuning 訓練多個 specialists — generation agent 產出多樣化初稿，critic agent 評估並改良；多個 round 的 debate + 彙整（summarize across agents）→ 對最終結果做 majority voting → 把 successful trajectories 拿來 SFT。
- **關鍵設計點**：
  - generation models 從同一個 base model 微調，但 prompt 不同 → 「poor man's version」即可拿到多樣性。
  - critic model 學的是「對 vs 錯」的對比，使用辯論過程中正確答案與被修正答案的 trajectory mix。
  - 摘要步驟可以是 model summarization 或單純 concat。
- **實驗結果**（x 軸 = fine-tune 迭代數）：
  - 單 agent fine-tuning：NLL 下降但 diversity 同步下降，accuracy plateau。
  - 多 agent fine-tuning：Llama 3 等開源模型在 math 上不僅 NLL 持續下降、embedding dissimilarity 仍維持高，多輪 fine-tuning 仍能持續 hill-climb。
  - 跨域泛化：在 in-domain math 上效果好，連 GSM8K 這種相近 benchmark 也能同步提升。
- **核心 takeaway**：self-improvement 要走得遠，**reasoning chains 的多樣性是必要條件**；多 agent / 多模型生成是當前最具體的 diversity injection 技術。

> 「What that roughly says is that if we want self-improvement, the reasoning chains that are provided to the model to drive those need to be diverse in some way.」
> — Azalia Mirhoseini

---

### Section 3｜驗證瓶頸 — DeepSeek-Math V2 的 Meta-Verification（13:00 ~ 19:30）

**重點摘要**：即便最終答案正確，proof 過程仍可能數學錯誤；ORM（outcome reward model）不足以抓到推理錯誤，需要 PRM（process reward model）但 PRM 又極難構建。DeepSeek-Math V2 引入 meta-verifier 來對「verifier 自己」做評估，實現 self-verification loop。

**內容：**
- **現狀**：當前 RL 假設「final answer → ground truth match = reward」，已讓 AIME 等多數 math 基準 saturate，但**最終答案對 ≠ 推理步驟對**。Theorem proving 需要嚴格的逐步 derivation，而 final answer 給不出這層資訊。
- **LLM 的盲點**：LLM 雖然在定量推理上學得多，但對自己生成的 proof 仍會錯誤判定為 valid；LLM-as-judge 在 proof verification 場景幾乎失效。
- **DeepSeek-Math V2 的解法**：先用真人找 proof 中的問題（不需要 reference solution），用這些標註訓練 LLM 找 proof 問題；再訓練一個 meta-verifier 去評估「verifier 抓到的問題是否真的存在、評分是否合理」。
- **三層結構**：
  1. Generator：產出 proof。
  2. Verifier：找出 proof 問題，給 0.5 或 1 分。
  3. Meta-verifier：審查 verifier 的分析是否合理，**這個 LLM-as-judge-of-judge 的設計大幅降低 hallucinated issues**。
- **迴路**：一旦 meta-verifier 學會判斷，**錯誤 proof 的標註本身可以自動化**；人為介入的需求逐漸降低。
- **實驗結果**（基於 DeepSeek V3 + GRPO）：
  - 8 輪迭代後，proof score 持續上升。
  - best-of-32 → IMO Shortlist 2024 達 ~42% proof score。
  - 這條路徑驗證了「**抓 reasoning chain 問題 → 推 generator 修正**」是有效的 hill-climbing。
- **核心 takeaway**：把 verification 從「只看 final answer」升級為「逐步 process + meta-驗證」，是突破驗證瓶頸的關鍵路徑。

> 「Verifiers can get correct score when the reasoning chains are incorrect. For example, they might come up with fabricated errors. Meta verification has evaluation of this analysis to these issues.」
> — Azalia Mirhoseini

---

### Section 4｜任務選擇瓶頸 — Self-Proposed Tasks 與 Proposer-Solver 對抗（19:30 ~ 27:00）

**重點摘要**：當模型超越人類專家後，靠人類標資料會撞牆。Absolute Zero 風格的工作讓單一模型同時當 proposer（出題）與 solver（解題），以難度中等的任務作為 curriculum，並在 coding 領域證明能 hill-climb 超越 human-curated 資料。

**內容：**
- **問題**：現有 RLVR pipeline 仰賴人類專家（數學家教 IMO 題、資深工程師寫 code），模型越強就越難找到更強的專家供資料，**資料瓶頸**成為下一個 wall。
- **三種任務類型**（focus 在 coding）：
  - **Deduction**：模型產出 program + input → 環境執行得 output。
  - **Abduction**：模型產出 program + input → 環境執行得 output（與 deduction 結構相似，但條件不同）。
  - **Induction**：模型抽樣既有 program → 產出新的 input + 自然語言描述，環境判斷是否一致。
- **Reward 設計**：
  - 任務選擇：solver 成功率 0 → reward 0；成功率 > 0 → reward = 1 − 平均成功率（鼓勵中等難度任務）。
  - 任務驗證：跑 program integrity、安全檢查、多次執行同一輸入結果是否一致。
- **動態 curriculum**：每個 (input, output, program) 三元組放進 task buffer，proposer 從 buffer 抽樣 + 紀錄成功/失敗次數，**整體形成隨時間演化的 curriculum**。
- **實驗結果**：
  - 在 coding benchmark 不靠任何 human-curated prompt 達到 SOTA，超越數萬筆 human-curated 範例的 baseline。
  - complexity metrics 隨時間上升、diversity 改善、proposer 學會產出更難任務。
  - **意外驚喜**：coding 訓練後在 math benchmark 也同步提升，呼應 Swirl 等其他 paper 的 transferability 觀察。
- **核心 takeaway**：**proposer × solver 對抗**是突破人類資料瓶頸的可行路徑；大模型在這個飛輪上的收益比小模型更顯著。

> 「The proposer and solver are slightly adversarial, but overall they're helping each other improve in some ways.」
> — Azalia Mirhoseini

---

### Section 5｜非可驗證領域的開放問題（27:00 ~ 30:30）

**重點摘要**：Test-time scaling 與 RL fine-tuning 仰賴幾乎即時的 verifier，但在科學模擬、晶片設計、化學實驗、創意寫作等領域，feedback 訊號慢、昂貴或主觀，當前的 self-improvement loop 無法直接套用。

**內容：**
- **可驗證 vs 不可驗證**：math / coding 之所以成為 RLVR 主力，是因為 verifier 能在幾秒內給出 reward；但很多現實任務需要幾天（晶片模擬、化學 wet lab）或主觀評分（creative writing），現有 RL 飛輪無法直接吃掉。
- **Approach 1 — 學一個 reward model**：用離線資料（過去仿真 / 實驗結果）訓練 surrogate reward model，在 RL 內圈以 reward model 當 verifier。問題是 reward model 的泛化性受資料覆蓋限制，不準就會帶偏整個 loop。
- **Approach 2 — 問題分解 + 知識庫**：例如 kernel optimization，模型單獨解完整的效能 profiling 太難，class project 的作法是拆成子問題、用 reference solutions 與 KB 補強。**這是「模型能力不足時的務實解」**。
- **Approach 3 — 評估性指標**：authenticity / creativity 是高度主觀的，要寫一個完美的 reward function 極難；即使寫出來，RL 與 agent 也會 reward hacking。這種**主觀性 in metrics** 是另一類「無法驗證」。
- **研究問題**：能不能靠「可驗證領域的 self-improvement 飛輪」換到「非可驗證領域」的泛化能力，進而減少對人類標註資料的依賴？這是一個 compute-heavy 的開放實驗。

> 「If we can verify verify and minimize or remove the need for label data in non-verifiable domains based on that, that would be an interesting research area.」
> — Jure Leskovec

---

### Section 6｜Intelligence per Watt — 效率定義新指標（30:30 ~ 37:30）

**重點摘要**：與 Stanford 系統 / John Hennessy 合作的研究發現 77% 的 ChatGPT 查詢其實可被小模型回答；過去 2 年 local model 解決 chat query 的能力提升 3.1x，硬體效率提升 1.7x，**Intelligence per Watt（IPW = 解決率 / 瓦）提升 5.3x**——意味著 edge inference 即將反轉雲端集中格局。

**內容：**
- **背景**：當前 LLM 仍以雲端為主（mainframe era），但 Google Cloud 12–20 個月推理算力暴增 ~1200x、影片推理年增 10x；Google 處理 token 數從 2025/02 的 160 兆成長到 2025/10 的 1.3 個 quadrillion tokens。功耗壓力倒逼重新分配 inference。
- **77% 的需求可被小模型滿足**：分析 1M 條 ChatGPT 查詢，發現 practical guidance / 資訊查詢 / 寫作類佔絕大多數，不需要 frontier model；這為 local inference 提供了需求基礎。
- **Local accelerator 進度**：自 2012 年 GPU 記憶體成長 126x，MacBook 已有 ~100GB 記憶體，搭配 8-bit 量化已能在本地 serve 最大型開源模型。
- **新指標 IPW**：
  - Capability = 模型在 single-turn / reasoning queries 上的解決率。
  - Efficiency = 解決任務所需的平均功耗。
  - IPW = 平均任務準確率 / 平均功耗。local model 定義為 active params ≤ 20B。
- **實驗數據**（涵蓋 20+ 個 local model、各種硬體、Natural Reasoning / MMLU Pro / Super GPQA）：
  - 自 2023 年 local model 解決率提升 3.1x；當前可解決 88.7% 的常見 chat 查詢。
  - Apple M4 Max intelligence/watt 比 B200 低 1.5x（雲端晶片專為 LLM 最佳化）。
  - **2 年內 IPW 提升 5.3x**（3.1x 來自模型 + 1.7x 來自硬體）。
- **核心 takeaway**：edge inference 不再是 niche，未來大部分的 AI 流量會被分散到 personal device / local cloud，**energy 會成為最稀缺資源**。

> 「This suggests that we're heading towards this future that more and more of this traffic can be addressed or can be solved by models that we can run on our edge device.」
> — Azalia 博士後

---

### Section 7｜未解研究路線圖 — 從 test-time scaling 到 continual learning（37:30 ~ 結束）

**重點摘要**：整堂課總收四個未解方向——test-time scaling 的理論基礎、synthetic data flywheel 與 RL fine-tuning 的銜接、continual learning 的可行性、test-time scaling 的高效底層系統——並指出「agent 自我修改的合理邊界」仍是研究空白。

**內容：**
- **Open 1｜Test-time scaling 的理論基礎**：KPI 看似是「ask 多遍 → 正確答案冒出」，但**為什麼多問就會冒出？** 怎麼把 successful trajectories 蒸回 model？其原理仍不清晰，**這是從當前現象回到理論的關鍵 gap**。
- **Open 2｜Synthetic data flywheel × continual learning**：人解決任務時會持續累積 skill，模型則是「agent 累積 experience → 之後做一次 fine-tuning」的非同步模式。**如何讓 positive / negative experience 自然回流到模型**，而不是離線 batch update，是 continual learning 的核心問題。
- **Open 3｜記憶系統 vs 權重更新**：解決 continual learning 的兩個路線：
  - 加大有效 context（如 Cartridge 把 KB 載入 KV cache 而不動 weights）。
  - 更新模型 weights（特別是跨 embodiment / 跨 domain 的技能遷移，純靠記憶系統做不到）。
  - 兩種路線在不同任務上的取捨仍是開放問題。
- **Open 4｜Test-time scaling 的高效基礎設施**：當 inference 變成多輪 sampling、平行 LLM 採樣、tool call 多次呼叫，**與主流 chatbot 單輪對話的使用情境完全不同**；Hydrogen、Tokamak 等早期工作顯示系統層與 kernel 層的優化空間巨大。
- **Open 5｜雲端 / 邊緣混合 serving**：IPW 暗示未來 inference 會在 laptop / phone / cloud 之間動態路由，需要新的 serving engine 設計。
- **Open 6｜新模型架構與 kernel**：為 edge accelerator 量身打造的節能架構仍欠投入；當前晶片設計對 LLM 在本地跑的想像不足。
- **Open 7｜Energy-focused metrics**：IPW 只是開始，**更精準的能量 / 瓦數測量與優化目標**會成為主流。
- **課程尾聲**：兩位講師代表課程團隊致謝學生，並提醒 — 「anything that we teach now starts to be history by the next time the class rolls around」，但**底層技術（verifier、self-improvement loop、test-time scaling）長期有效**。

> 「These are still open questions, and there is a very clear segway from this synthetic data flywheel kind of phenomenon back to continual learning.」
> — Azalia 博士後

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, speech-2.8-hd），約 3 分鐘
> 口播稿原文：/tmp/cs329a-part9/口播稿.txt

- [mp3 4.1 MB](口播稿.mp3)（通用格式）
- [opus 1.1 MB](口播稿.opus)（Telegram 友善，32kbps）
- [m4a 4.5 MB](口播稿.m4a)（iOS 友善，AAC 128k）

---

## 24 個核心概念表

### 概念1：Self-Improving Agent
| 項目 | 內容 |
|------|------|
| 定義 | 有目標、能與環境互動、收集 feedback、修正自身步驟的系統 |
| 出處 | 第一堂課定義；本集第 1 段重述 |
| 應用 | coding agent、deep research agent、robotics policy |

### 概念2：Test-Time Scaling
| 項目 | 內容 |
|------|------|
| 定義 | 推理階段用更多 compute（多 sampling、majority vote、search）換取更好答案 |
| 出處 | Part 1-2 RL 與 scaling 講 |
| 應用 | majority voting、best-of-N、tree search、multi-agent debate |

### 概念3：Train-Time Scaling
| 項目 | 內容 |
|------|------|
| 定義 | 訓練階段用 verifier feedback 與 RL 飛輪提升模型能力 |
| 出處 | Part 2-3；本集 Section 1 重述 |
| 應用 | RLHF、RLVR、rejection sampling、STaR |

### 概念4：Multi-Agent Fine-Tuning
| 項目 | 內容 |
|------|------|
| 定義 | 多個 specialized generation + critic agent 互相 debate，產生多樣化 reasoning chains 再做 SFT |
| 出處 | Section 2 論文 |
| 應用 | 突破單 agent self-improvement 的 diversity collapse |

### 概念5：Reasoning Chain Diversity
| 項目 | 內容 |
|------|------|
| 定義 | 推理路徑的豐富度；缺乏多樣性會讓 self-improvement 早早 plateau |
| 出處 | Section 2 核心 insight |
| 應用 | 用多 agent / 多 prompt / 高中溫度採樣注入 diversity |

### 概念6：Generation Agent
| 項目 | 內容 |
|------|------|
| 定義 | Multi-agent fine-tuning 中的專門負責產出初稿的 specialist |
| 出處 | Section 2 論文角色 |
| 應用 | 與 critic agent 協作，維持 reasoning chain 多樣性 |

### 概念7：Critic Agent
| 項目 | 內容 |
|------|------|
| 定義 | 接受辯論後的更新答案，選擇最佳解的 specialist |
| 出處 | Section 2 論文角色 |
| 應用 | 學對 vs 錯的對比，給出 final pick |

### 概念8：Rejection Sampling Fine-Tuning
| 項目 | 內容 |
|------|------|
| 定義 | 從 LLM 採樣多份答案，過濾掉錯的，只用對的做 SFT |
| 出處 | Section 2 提到的 baseline |
| 應用 | STaR、Self-Refine 等都屬此家族 |

### 概念9：Meta-Verification
| 項目 | 內容 |
|------|------|
| 定義 | 對「verifier 本身的分析」再做判斷，判斷其抓到的問題是否實際存在 |
| 出處 | Section 3 DeepSeek-Math V2 |
| 應用 | 降低 hallucinated issues，提升 theorem proving 自動化 |

### 概念10：Outcome Reward Model (ORM)
| 項目 | 內容 |
|------|------|
| 定義 | 只看 final answer 是否與 ground truth 匹配的 reward model |
| 出處 | Section 3 當前 RL baseline |
| 應用 | 已讓 AIME 等 saturate；但難抓 reasoning 錯誤 |

### 概念11：Process Reward Model (PRM)
| 項目 | 內容 |
|------|------|
| 定義 | 對推理每一步給 reward 的 model |
| 出處 | Section 3 |
| 應用 | 較 ORM 強但建造難、容易 hallucinate |

### 概念12：Self-Verification Loop
| 項目 | 內容 |
|------|------|
| 定義 | Generator 與 Verifier 互相提升；meta-verifier 讓這個 loop 變自動 |
| 出處 | Section 3 DeepSeek-Math V2 |
| 應用 | 持續改進 theorem proving 品質 |

### 概念13：Proposer-Solver Paradigm
| 項目 | 內容 |
|------|------|
| 定義 | 單一模型同時擔任 proposer（出 curriculum 等級任務）與 solver（解題） |
| 出處 | Section 4 Absolute Zero 風格工作 |
| 應用 | 突破 human-curated 資料瓶頸 |

### 概念14：Task Difficulty Reward
| 項目 | 內容 |
|------|------|
| 定義 | 1 − 平均成功率；鼓勵 proposer 生成 solver 偶爾成功偶爾失敗的任務 |
| 出處 | Section 4 |
| 應用 | 動態 curriculum learning |

### 概念15：Task Buffer
| 項目 | 內容 |
|------|------|
| 定義 | 儲存 (input, output, program) 三元組 + 成功/失敗次數的資料結構 |
| 出處 | Section 4 |
| 應用 | proposer 抽樣生成新任務，保證 diversity |

### 概念16：Abduction / Deduction / Induction
| 項目 | 內容 |
|------|------|
| 定義 | coding 任務三型：abduction/deduction 都產 program + input；induction 抽既有的 program 衍生新 input |
| 出處 | Section 4 |
| 應用 | proposer 混搭生成多種任務 |

### 概念17：Synthetic Data Flywheel
| 項目 | 內容 |
|------|------|
| 定義 | 模型產出資料 → 訓練自己 → 變更強 → 產出更好的資料 |
| 出處 | Section 4 & 5 對話 |
| 應用 | 已在 Swirl、Absolute Zero 等多個工作驗證 |

### 概念18：Non-Verifiable Domain
| 項目 | 內容 |
|------|------|
| 定義 | verifier 慢、昂貴或主觀的領域，如晶片模擬、化學實驗、creative writing |
| 出處 | Section 5 |
| 應用 | reward model 代理、任務分解、主觀 metric 設計 |

### 概念19：Surrogate Reward Model
| 項目 | 內容 |
|------|------|
| 定義 | 用離線（仿真 / 實驗）資料訓練的 reward 模型，代理昂貴的真實 verifier |
| 出處 | Section 5 |
| 應用 | RL 飛輪在晶片設計、材料科學的可行性 |

### 概念20：Intelligence per Watt (IPW)
| 項目 | 內容 |
|------|------|
| 定義 | 平均任務準確率 / 平均功耗；本集新提出的效率指標 |
| 出處 | Section 6 與 John Hennessy 合作研究 |
| 應用 | 比較不同 model × hardware 組合的效率 |

### 概念21：Local Inference
| 項目 | 內容 |
|------|------|
| 定義 | 在個人裝置（laptop、phone）上跑 LLM，本集定義為 active params ≤ 20B |
| 出處 | Section 6 |
| 應用 | 解 88.7% 常見 chat 查詢、edge serve |

### 概念22：Continual Learning
| 項目 | 內容 |
|------|------|
| 定義 | 模型在「線上」累積 positive / negative experience、持續更新能力的機制 |
| 出處 | Section 7 Open 2 |
| 應用 | 從人腦 continual skill 發展類比；仍是 open problem |

### 概念23：Hybrid Serving Engine
| 項目 | 內容 |
|------|------|
| 定義 | 根據任務複雜度在 local / cloud 之間動態路由的 inference 架構 |
| 出處 | Section 7 Open 5 |
| 應用 | edge 與雲端協同，平衡 IPW 與能力 |

### 概念24：Cartridge / Long-Context Memory
| 項目 | 內容 |
|------|------|
| 定義 | 不動 weights，把 KB / 經驗載入 KV cache 達成長期記憶 |
| 出處 | Section 7 對話提及 |
| 應用 | 解決 continual learning 的「in-context」路線 |

---

## 12 個金句

### 金句1
> 「The class is named as self-improving agents. So it's not just focusing on LLMs, it's focusing on the agent aspect of it.」
> — Jure Leskovec 開場定義 self-improving agent 的核心精神

### 金句2
> 「If we want self-improvement, the reasoning chains that are provided to the model to drive those need to be diverse in some way.」
> — Azalia Mirhoseini 點出 diversity 是 self-improvement 的必要條件

### 金句3
> 「Multiple agents … you get majority voting for free just by having multiple agents, and assuming that these are trained slightly differently, you get diversity for free.」
> — 解釋 multi-agent fine-tuning 為何能跨越 single-agent plateau

### 金句4
> 「Verifiers can get correct score when the reasoning chains are incorrect. For example, they might come up with fabricated errors.」
> — 點出 ORM 與 PRM 的盲點，meta-verification 因此重要

### 金句5
> 「The proposer and solver are slightly adversarial, but overall they're helping each other improve in some ways.」
> — 描述 proposer-solver 對抗式學習的本質

### 金句6
> 「This is almost a play on synthetic data in some ways, but it's generating that in the loop at the task level as well.」
> — 點出 Absolute Zero 與傳統 synthetic data 的差異

### 金句7
> 「The ability to find more and more experts and more and more such tasks starts to be limiting.」
> — 解釋為何要擺脫 human-curated prompt 依賴

### 金句8
> 「As the models continue to surpass human intelligence, the ability to find more and more experts and more and more such tasks starts to be limiting.」
> — 預言人類專家標註會成為 RLVR 的下一個瓶頸

### 金句9
> 「This suggests that we're heading towards this future that more and more of this traffic can be addressed or can be solved by models that we can run on our edge device.」
> — 預測 edge inference 將分食雲端流量

### 金句10
> 「Energy is going to be the most kind of valuable resource that we have going forward.」
> — 宣告 energy 將成為 AI 競爭的核心資源

### 金句11
> 「What is happening that these correct answers are coming out? Like, what are the best practices to kind of distill these successful trajectories back to the model.」
> — 點出 test-time scaling 理論基礎的 open gap

### 金句12
> 「Anything that we teach now starts to be history by the next time the class rolls around, and yet the basic techniques that you're learning are extremely valuable over time.」
> — 結尾勉勵：基本技術恆久遠，每年應用翻新

---

## 人物

### Azalia Mirhoseini
- **背景**：Stanford CS 教授，CS329A 共同主講；AI 系統與硬體協同設計專家。
- **本集關鍵角色**：主導 self-improvement 議題，並與 John Hennessy 合作的 IPW 研究。
- **代表觀點**：效率不只是工程指標，而是下一代 AI 競爭力的核心。

### Jure Leskovec
- **背景**：Stanford CS 教授，CS329A 共同主講；graph / network / agent 領域知名學者。
- **本集關鍵角色**：開場定義 self-improving agent，並主導 multi-agent fine-tuning 與 non-verifiable domain 對話。
- **代表觀點**：diversity 是 self-improvement 的必要條件，verification 要靠 meta-verification 才能突破。

### Azalia 博士後研究團隊成員
- **背景**：與 Azalia Mirhoseini、John Hennessy 合作 Intelligence per Watt 研究。
- **本集關鍵角色**：短講 IPW 指標與 edge inference 趨勢。
- **代表觀點**：edge 將吃下大部分 inference 流量，IPW 是新指標。

### John Hennessy
- **背景**：Stanford 第十任校長、Turing Award 得主、RISC 架構之父。
- **本集關鍵角色**：共同作者（IPW 論文）。
- **代表觀點**：硬體趨勢與 AI workload 的連動；本集未親自出席但研究被引用。

### DeepSeek-Math V2 團隊
- **背景**：DeepSeek 公司 open-source model 開發者。
- **本集關鍵角色**：提出 meta-verification 的 theorem proving 系統。
- **代表觀點**：proof verification 需要 process reward + meta-verifier 雙層結構。

### Absolute Zero 論文團隊
- **背景**：推動 model-as-proposer 研究的工作。
- **本集關鍵角色**：提出 self-proposed coding task 框架。
- **代表觀點**：proposer-solver 對抗可突破 human-curated 資料瓶頸。

---

## 延伸閱讀

### 1. Multi-Agent Fine-Tuning 原文
- 搜尋關鍵字：`multi-agent fine-tuning self-improving reasoning chains debate specialization`
- 核心機構：Stanford CS / 開源社群合作
- 與本集關聯：Section 2 唯一引用文獻

### 2. DeepSeek-Math V2
- 來源：DeepSeek 官方 release
- 搜尋關鍵字：`DeepSeek-Math V2 meta-verification theorem proving`
- 與本集關聯：Section 3 唯一引用文獻

### 3. Absolute Zero / Self-Proposed Tasks
- 搜尋關鍵字：`absolute zero proposer solver self-play coding`
- 與本集關聯：Section 4 引用為「proposing tasks」代表工作

### 4. Intelligence per Watt 論文
- 共同作者：Azalia Mirhoseini、John Hennessy、Stanford 合作
- 搜尋關鍵字：`intelligence per watt IPW local inference Apple M4 B200`
- 與本集關聯：Section 6 專題

### 5. Swirl（合成資料與 RL）
- 與本集關聯：Section 4 對話引用，證明 synthetic data flywheel 的跨域遷移能力

### 6. Alpha Evolve
- 與本集關聯：Section 1 回顧，open-endedness 探索的代表工作

### 7. Cartridge
- 與本集關聯：Section 7 對話，continual learning 的「in-context」路線代表

### 8. Hydrogen / Tokamak
- 與本集關聯：Section 7 對話，test-time scaling 的系統層優化早期工作

### 9. Cartridge / KernelBench
- 與本集關聯：Section 5 對話，stanford class project 示範問題分解

### 10. 工業面 — ChatGPT 流量分析
- 與本集關聯：Section 6 引用的 1M query 樣本分析

### 11. 課程先修系列
- Stanford CS329A Part 1–Part 8（test-time scaling、RL、open-endedness、tool use、planning、retrieval、post-training、multi-modal）
- 與本集關聯：本集是終點，所有概念都假設學生看過 Part 1–8

### 12. CS329A 系列官網
- Stanford CS 官方頁面
- 與本集關聯：可找到 slide deck、reading list、project archive

---

## 結語 — 給進入這個領域的人

CS329A Part 9 不只是「未解題目清單」，更是一份**領域共識的快照**：self-improving agents 已經從「框架驗證」走到「瓶頸辨識」。**多樣性、驗證、任務選擇**三條 axis 互相糾纏，解一道常常牽動另外兩條；**效率指標 IPW** 則把 AI 競爭從「能力排名」轉向「每瓦能力」。

對碩博士生：6–12 個月的 promising 切入點是 meta-verification、proposer-solver 對抗、continual learning 之一，每一個都還有大量 low-hanging fruit。

對工程師：multi-agent fine-tuning 的開源實作、IPW 評測工具、hybrid serving engine 是 close-to-production 的需求。

對政策 / 產業觀察者：edge inference 即將反轉雲端集中格局，**energy 將成為下一代 AI 競爭的戰略資源**——這是政府、企業、投資人都必須正視的轉折。

> 「End of Part 9. The class is named as self-improving agents. So it's not just focusing on LLMs, it's focusing on the agent aspect of it.」

</thinking>
