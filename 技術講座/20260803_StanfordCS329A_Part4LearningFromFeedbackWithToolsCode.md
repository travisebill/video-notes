---
講者: Stanford CS329A（Self-Improving AI Agents 課程團隊 — Azalia Mirhoseini / Kian Katanforoosh 主講）
影片連結: https://www.youtube.com/watch?v=Lxh9RF5S-K0
影片長度: 1:11:13（4273s）
發布日期: 2026-08-03
---

# 【Stanford CS329A — Part 4 — Learning from Feedback with Tools/Code】

## 主題與背景

這是 Stanford CS329A「Self-Improving AI Agents」系列的 **Part 4 — Learning from Feedback with Tools/Code**。前 3 堂課�墊了 LLM 的基礎能力（Part 1）、inference-time scaling 三大策略（Part 2）、以及 robust verification 為何是 self-improvement 的瓶頸（Part 3）。Part 4 把鏡頭轉向另一條主軸——**feedback loop 的來源**：當模型需要「超出訓練資料」的能力時，**它如何從環境、執行結果、甚至自己身上學到訊號**。

### 三篇 paper 的共同主題：「feedback 從哪來？」

講者開宗明義：本堂課會讀 3 篇 paper，但核心問題只有一個——**feedback 從哪裡來**。

| Paper | Feedback 來源 | 改進目標 |
|-------|----------------|----------|
| **ReAct** | 環境（搜尋 API、瀏覽器、機器人模擬器） | reasoning + acting 的語言化循環 |
| **RLEF**（Grounding Code LLMs in Execution Feedback） | 執行程式碼的回饋（單元測試通過/失敗） | coding agent 的迭代修正 |
| **Constitutional AI** | 模型自己依「憲法」批評與改寫 | harmlessness（+ help–harm 平衡） |

> What differs in each of these techniques is where is the feedback coming from? It's some form of interaction with either the environment or some form of critique mechanism or grounding using what we know should be the right answer.

三種來源對應 self-improving agent 的三個抽象層次：**外部環境（tools/code）→ 自身執行（tests）→ 自身價值觀（constitution）**。

### 為什麼這條主軸對 agent 至關重要

講者延續 Part 1 的論點：「LLM 在 chatbot 場景很強，但要變成 real-world 工具，必須能跟環境、tools、code 互動，並從互動中學習。」這堂課展示三種 feedback loop——它們不是孤立技巧，而是構成 agent 自我演進的**底層引擎**：

1. **沒有 feedback 就沒有 self-improvement**——這呼應 Part 3 的 verification gap：模型再會 generate，若無法可靠分辨對錯，就無法形成正向�圈。
2. **feedback 可以是程式化的**（test pass/fail）而非人類標註，大幅降低 RL 成本。
3. **feedback 可以內生**（self-critique），把「人類寫原則、模型做評審」的開銷降到極低。

---

## 章節脈絡

### Section 1｜開場 + 系列回顧（00:00 ~ 02:30）

講者開場複習前 3 堂課的兩條主線：test-time compute scaling（Part 2）與 robust verification（Part 3）。本堂課的核心問題是「**feedback 從哪來**」，並點出三篇 paper 會分別回答三種來源——環境、執行、自身批評。講者特別強調：**這三條路徑都是讓模型「超出訓練資料」變強的途徑**，只要 feedback loop 有足夠訊號，就能突破模型原始能力的天花板。

### Section 2｜ReAct 概念框架（02:30 ~ 13:30）

**核心思想**：把人類「先想再行動」的思考模式，移植到 LLM 的 tool calling 流程中。講者先描述人類決策的循環——**Thought → Action → Observation**——然後指出 LLM 過去做不到，是因為它會「在沒有環境 context 的情況下 hallucinate」。ReAct 的解法是把 reasoning trace 跟 action 交錯寫在同一個 prompt 裡，讓模型「邊想邊查」。動作空間極簡：通常是 `search[query]`、`lookup[key]`、`finish[answer]`。講者說明 few-shot prompt 結構：每個 example 是一串交錯的 thought + action + observation 序列。

**Action Space vs. Reasoning Trace 的關鍵區分**：學生生疑——既然 thought 也在被模型生成，為什麼不把 thought 也算 action 的一部分？講者解釋：reasoning tokens 是「**內部**」、由 model 自己產出；action tokens 是「**外部**」、會送進環境執行。把它們放在一起只是**架構便利**——LM 訓練在語言 token 上，把 reasoning 用自然語言寫出來是它最自然的媒介。如果你有 intermediate representation，理論上可以把 reasoning 從 action space 抽離。

### Section 3｜ReAct 實驗結果（13:30 ~ 27:00）

ReAct 在兩種任務上測試：

**知識密集任務（Knowledge-intensive）**：
- **HotpotQA**（多跳 Wikipedia QA）——搜尋→查字→完成的 action space。
- **FEVER**（事實查核）——判斷敘述是否被 Wikipedia 支持。

**基線對照**：標準 prompting、CoT、CoT + Self-Consistency（多數決）、純 Act（無 thought）。

**結果**：ReAct 不一定在所有任務上贏 CoT（HotpotQA 上 CoT-SC 反而略勝），但**當 ReAct 失敗時可 fallback 到 CoT-SC**，組合起來最佳。講者點出關鍵洞察：**CoT 的失敗模式是 hallucination；ReAct 的失敗模式是 retrieval error**——前者更難修，後者可透過更好的 search 改善。

**決策任務（Decision-making）**：**WebShop**（網路購物模擬器）、**ALFWorld**（家事模擬器），基線是 imitation learning、IL + RL。結果：ReAct **單獨使用**就超越 IL + RL——因為 reasoning abstraction 把「為什麼這樣做」的意圖顯式化，比純模仿監督更強。

**為什麼 fine-tune 後差距更大？**：學生追問為什麼 few-shot 結果不顯著、fine-tune 後才拉開。講者解釋：few-shot 時 model 還在「順從 prompt」而非「學會模式」；一旦 fine-tune（或加上 RL 訓練），reasoning 的抽象才真正內化。

### Section 4｜RLEF 與 Execution Feedback（27:00 ~ 44:00）

從 tool calling 轉到 coding agent。講者問：「在座有多少人用 Claude Code？」——幾乎全班，呼應 coding agent 已成為 LLM 主流應用。

**RLEF 核心**：把「**執行程式碼的回饋**」當作 RL 的 reward signal。Action = generated code，Observation = test pass/fail + 錯誤訊息。Loop：模型寫 solution → 跑 unit tests → 若失敗把錯誤訊息塞回 prompt → 模型再寫 → 直到通過或 budget 用盡。

**為什麼 public + private test 兩段式？**：學生抓到關鍵——如果只用 public test 當 reward，模型會「memorize 公開測資」而非「學會解題」。所以 split 成兩層：public test 用來當 in-loop reward，private test 留作 final eval。

**實驗結果**：pass@1 隨著 RLEF 顯著上升（log scale 圖）；**小模型獲益 > 大模型獲益**——因為大模型本來就有較高的先驗知識，少用 feedback；**不能 memorize test outputs**——模型不是「背答案」，而是「學會 debug 模式」。

**訓練時 vs. 推理時 execution feedback 的差別**：講者特別說明——RLEF 在 training time 用 execution feedback fine-tune LLM（offline RL），跟 inference time「跑一次→修一次→再跑」不同。**訓練時的 RLEF 把 execution signal 內化到權重**，讓模型第一次嘗試就少錯。

### Section 5｜Constitutional AI 概念（44:00 ~ 56:00）

從 coding 跳到 alignment。講者問：「為什麼不用 RLHF？」——因為**人類標註太貴**。

**Constitutional AI 解法**：Anthropic 提出「**憲法**」——16 條由人類寫的原則（例如「不要有害」、「避免性別偏見」、「適合兒童」），用這些原則讓模型**自我批評並改寫**。

**兩階段**：
1. **Supervised 階段**：用 constitution 當 critique prompt，讓模型批評自己的 output → 改寫 → fine-tune。多次迭代後 harmlessness 上升、helpfulness 略降，但總體 helpful+harmless 上升。
2. **RL 階段**：用同一套 constitution 訓練 preference model（取代人類標註的 RLHF），再用 PPO 訓練 LLM。

**為什麼「constitution」有效？**：因為現代 LLM 對 instruction following 很強——把「批評自己」和「改寫」寫成 prompt，模型就能做到。本質上是**用人類的價值觀 + 模型的 instruction-following 能力 = 自動化 alignment**。

### Section 6｜Constitutional AI 結果 + 持續學習問題（56:00 ~ 1:00:00）

實驗對照四種 RL：RLHF（helpfulness only）、RLHF（helpfulness + harmlessness）、Constitutional AI（無 CoT）、Constitutional AI + CoT。

**結果**：Constitutional AI 在 harmlessness 上大幅領先（與 RLHF-help-harm 相當）；helpfulness 略低於 RLHF-help；Constitutional AI + CoT 反而**比無 CoT 略差**——CoT 增加推理深度，但也可能讓模型「找到漏洞」來合理化有害輸出。

**Q&A 關鍵問題——continual learning**：學生問「**constitution 要更新怎麼辦？**」講者：(1) **post-training compute 比例小**（~5%），定期重訓可行；(2) **真正困難的是 continual learning**——忘舊原則、記新原則仍是 open problem。

### Section 7｜總結 + 開放性 Q&A（1:00:00 ~ 1:11:13）

講者總結三篇 paper 的脈絡：

- **ReAct**：reasoning + acting 的交錯 prompt 是 tool calling 的基礎模組；現代模型的 tool call 已經「內化」，但 ReAct 的精神（先想後做）仍是 agent 的核心抽象。
- **RLEF**：coding 是 self-improvement 的天然場域——execution feedback（unit test）是免費且可靠的 reward signal，可大幅降低對人類標註的依賴。
- **Constitutional AI**：把人類的價值觀編碼成 constitution，讓模型自己批評自己，是 alignment 的可擴展路徑。

**Q&A 開放性問題**：
1. **Cognitive Science × LLM**：學問 LLM 跟人類認知的研究有沒有系統性結合？講者認為目前大家是用「人類解題的比喻」來引導 LLM（分解、CoT、平行思考），但真正的「自動化 reasoning space search」仍是 open question。
2. **Well-defined search space**：任務有明確 reward 就能自動化（像 RLEF 的 test），但很多任務沒有 well-defined search space——這正是為什麼我們還在用 language space 來做 reasoning。

> In general you can also generalize it to anything where you can get the model to follow a set of rules and then based on whether it's following the rules well or not you can get a self-improvement loop going.

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, speech-2.8-hd），約 3 分 50 秒
> 口播稿原文：transcripts/20260803_StanfordCS329A_Part4LearningFromFeedbackWithToolsCode_口播稿.txt

- [opus 0.7 MB](口播稿.opus)（Telegram 友善）
- [m4a 0.9 MB](口播稿.m4a)（iOS 友善）
- [mp3 0.9 MB](口播稿.mp3)（通用格式）

> **注**：本影片時長約 1:11:13（4273 秒），自動字幕為 en-orig。本篇 notes 由 Ryo 🐱 從自動字幕 + LLM 整理為結構化版本，重點在「feedback 來源的三條路徑」以及它們如何把 self-improvement 從人類標註推向自動化。

---

## 關鍵概念定義

### 概念 1：工具呼叫（Tool Calling）

| 項目 | 內容 |
|------|------|
| 英文 | Tool Calling |
| 定義 | LLM 在生成文字時插入結構化動作（API 呼叫、搜尋、瀏覽器、執行 shell），把外部環境當作可互動的 action space。 |
| 課堂觀點 | 「現代模型 tool call 已經內化（innate），但這是 ReAct 開始�墊的——先想後做是核心抽象。」 |

### 概念 2：ReAct 框架（Reasoning + Acting）

| 項目 | 內容 |
|------|------|
| 英文 | ReAct (Reasoning + Acting) |
| 定義 | 把 reasoning trace（內部思考）和 action（外部動作）交錯在同一個 prompt 裡的 prompt 工程方法。每步由 Thought → Action → Observation 組成。 |
| 課堂觀點 | 「ReAct 是早期把 reasoning 和 acting 結合的 paper，奠定後來 tool calling 框架的基礎。」 |

### 概念 3：推理軌跡（Reasoning Trace）

| 項目 | 內容 |
|------|------|
| 英文 | Reasoning Trace |
| 定義 | LLM 在生成最終答案前輸出的中間思考步驟（自然語言）。可以內隱（CoT）或顯式（ReAct）。 |
| 課堂觀點 | 「Reasoning tokens 是內部、模型自己生成；把它們放進 prompt 是因為 LM 訓練在語言 token 上，這是它最自然的媒介。」 |

### 概念 4：動作空間（Action Space）

| 項目 | 內容 |
|------|------|
| 英文 | Action Space |
| 定義 | 模型可以選擇的所有可能動作集合。在 ReAct 範例中通常極簡：`search[query]`、`lookup[key]`、`finish[answer]`。 |
| 課堂觀點 | 「在 HotpotQA 上，action space 模擬人類跟 Wikipedia 互動——搜尋、查字、完成。」 |

### 概念 5：觀察（Observation）

| 項目 | 內容 |
|------|------|
| 英文 | Observation |
| 定義 | 環境（搜尋引擎、瀏覽器、test runner）回傳給模型的結果，會被 append 進 prompt 供下一步 reasoning 使用。 |
| 課堂觀點 | 「Observation 由環境給予、不是 LM 生成——這是跟 thought 的根本區別。」 |

### 概念 6：少樣本提示（Few-shot Prompting）

| 項目 | 內容 |
|------|------|
| 英文 | Few-shot Prompting |
| 定義 | 在 prompt 中提供數個 (input, 完整 thought-action-observation sequence) 範例，讓模型模仿格式與推理模式。 |
| 課堂觀點 | 「Few-shot 結果不顯著，fine-tune 後才拉開——model 從『順從 prompt』進階到『學會模式』。」 |

### 概念 7：HotpotQA

| 項目 | 內容 |
|------|------|
| 英文 | HotpotQA |
| 定義 | 多跳 Wikipedia 問答 benchmark，問題需要串接多個段落才能回答。ReAct 論文用它驗證 search-then-reason 的能力。 |
| 課堂觀點 | 「ReAct 在 HotpotQA 上不一定贏 CoT-SC，但 fallback 組合後最佳——CoT 會 hallucinate，ReAct 會 retrieval error，後者比較好修。」 |

### 概念 8：FEVER

| 項目 | 內容 |
|------|------|
| 英文 | FEVER (Fact Extraction and VERification) |
| 定義 | 事實查核 benchmark：給一句敘述，判斷是否被 Wikipedia 支持、refute、或無法判定。ReAct 用它驗證 grounded reasoning。 |
| 課堂觀點 | 「FEVER 比 HotpotQA 更明確需要『查證』——ReAct 在這個任務上穩定贏 CoT。」 |

### 概念 9：WebShop

| 項目 | 內容 |
|------|------|
| 英文 | WebShop |
| 定義 | 模擬網路購物環境的決策任務 benchmark。模型根據使用者指示（如「找有抽屜的床頭櫃」）瀏覽商品並完成購買。 |
| 課堂觀點 | 「WebShop + ALFWorld 是 decision-making benchmark——ReAct 比 imitation + RL 還強。」 |

### 概念 10：ALFWorld

| 項目 | 內容 |
|------|------|
| 英文 | ALFWorld |
| 定義 | 文字版家事模擬環境，模型需要做出一連串動作（開門、拿東西、放到正確位置）來完成指令。 |
| 課堂觀點 | 「ALFWorld 與 WebShop 都是 sequential decision making——ReAct 把『意圖』顯式寫出來，比純模仿更強。」 |

### 概念 11：模仿學習（Imitation Learning）

| 項目 | 內容 |
|------|------|
| 英文 | Imitation Learning |
| 定義 | 從專家示範中學習行為策略的監督式訓練。在 agent 領域是「看著人類做，照著做」的 baseline。 |
| 課堂觀點 | 「模仿學習 + RL 是 WebShop 的 baseline——但 ReAct 單獨就贏它們。」 |

### 概念 12：思維鏈（Chain-of-Thought, CoT）

| 項目 | 內容 |
|------|------|
| 英文 | Chain-of-Thought |
| 定義 | 在 prompt 中要求模型「一步一步想」並輸出中間步驟的 prompting 技巧。 |
| 課堂觀點 | 「CoT 的失敗模式是 hallucination——沒有 grounded knowledge 就會編；ReAct 用 retrieval 解決。」 |

### 概念 13：自我一致性（Self-Consistency）

| 項目 | 內容 |
|------|------|
| 英文 | Self-Consistency |
| 定義 | 對同一 query 生成 N 個答案，取多數決。不需 verifier，是 inference-time scaling 的最簡單策略。 |
| 課堂觀點 | 「CoT + Self-Consistency 是 ReAct 的 fallback 組合——CoT-SC 強在多數決，但失去 grounded。」 |

### 概念 14：RLEF（Reinforcement Learning from Execution Feedback）

| 項目 | 內容 |
|------|------|
| 英文 | RLEF (RL from Execution Feedback) |
| 定義 | 把執行程式碼的回饋（pass/fail + error msg）當作 RL reward，訓練 coding agent 的方法。 |
| 課堂觀點 | 「RLEF 是 coding agent 領域最早展示 execution feedback 能大幅提升表現的 paper。」 |

### 概念 15：執行回饋（Execution Feedback）

| 項目 | 內容 |
|------|------|
| 英文 | Execution Feedback |
| 定義 | 程式碼執行後得到的結果——通常是 unit test 通過/失敗、編譯錯誤、timeout 等。 |
| 課堂觀點 | 「Execution feedback 是 test feedback——你跑一些 test，得到 pass/fail，這就是最自然、便宜的 reward。」 |

### 概念 16：以單元測試作為驗證器（Unit Tests as Verifier）

| 項目 | 內容 |
|------|------|
| 英文 | Unit Tests as Verifier |
| 定義 | 把 unit test 視為「正確性 oracle」——pass 等於 correct，fail 等於 incorrect。 |
| 課堂觀點 | 「Coding 領域最強的 verifier 就是 test 本身——它是程式語義的體現，比人類標註可靠。」 |

### 概念 17：公開測試 vs 私有測試（Public vs Private Test Split）

| 項目 | 內容 |
|------|------|
| 英文 | Public/Private Test Split |
| 定義 | 把 test 集分成兩部分：public 在 RL loop 中作為 reward signal；private 留作最終評估，避免 memorize。 |
| 課堂觀點 | 「Public + private split 是為了防止 model 透過 in-loop reward 直接 memorize test outputs。」 |

### 概念 18：程式碼生成（Code Generation）

| 項目 | 內容 |
|------|------|
| 英文 | Code Generation |
| 定義 | LLM 根據自然語言描述產生可執行程式碼的任務。現代 agent 的核心應用。 |
| 課堂觀點 | 「Coding 是 self-improvement 的天然場域——你寫了 code，跑 test 得到 feedback，這是 closed loop。」 |

### 概念 19：競程（Competitive Programming）

| 項目 | 內容 |
|------|------|
| 英文 | Competitive Programming |
| 定義 | 類似 Codeforces、ICPC 等比賽題目，題目有明確的 input/output 規格，可用 test 驗證。RLEF 的實驗場。 |
| 課堂觀點 | 「RLEF 在 Code Contests 上 pass@1 大幅上升，且 generalization 到其他 benchmark。」 |

### 概念 20：憲法式 AI（Constitutional AI）

| 項目 | 內容 |
|------|------|
| 英文 | Constitutional AI |
| 定義 | Anthropic 提出的 alignment 方法：讓模型依「人類寫的原則」自我批評與改寫，取代 RLHF 中的人類標註。 |
| 課堂觀點 | 「Constitutional AI 用人類原則 + 模型 instruction following，換掉 RLHF 的人類偏好標註。」 |

### 概念 21：憲法（Constitution）

| 項目 | 內容 |
|------|------|
| 英文 | Constitution |
| 定義 | 一組由人類撰寫、用來定義模型行為的原則清單。Constitutional AI 用了 16 條原則。 |
| 課堂觀點 | 「人類不需要在每次評分都在 loop——只需要寫一次 constitution，後續的 critique/revision 由模型自動跑。」 |

### 概念 22：批評請求（Critique Request）

| 項目 | 內容 |
|------|------|
| 英文 | Critique Request |
| 定義 | Constitutional AI 中的 prompt 模板：要求模型依某條 constitution 原則檢查自己的 output 是否違規。 |
| 課堂觀點 | 「Critique request 是 red-teaming prompt——你叫模型找自己 output 的問題。」 |

### 概念 23：改寫請求（Revision Request）

| 項目 | 內容 |
|------|------|
| 英文 | Revision Request |
| 定義 | Critique 找到問題後，要求模型依 constitution 改寫 output 的 prompt 模板。 |
| 課堂觀點 | 「Revision request 要求模型用特定 style 或移除特定內容——現代模型的 instruction following 讓這可行。」 |

### 概念 24：持續學習（Continual Learning）

| 項目 | 內容 |
|------|------|
| 英文 | Continual Learning |
| 定義 | 模型在不重新訓練整個 base 的前提下，持續吸收新知識、忘記舊知識的能力。Constitutional AI 的 open problem。 |
| 課堂觀點 | 「Constitution 更新目前只能重新 fine-tune，continual learning 是 open problem，可能需要 interpretability 介入。」 |

---

## 金句摘錄

> "What differs in each of these techniques is where is the feedback coming from?"——三篇 paper 的共同主題。

> "In chain of thought hallucination ends up being a major failure mode, but in ReAct you basically end up having grounded information."——CoT vs. ReAct 失敗模式差異。

> "If you fine-tune, ReAct definitely does better. And if you can RL loop then it does even better."——ReAct few-shot 不顯著、fine-tune/RL 才拉開。

> "Execution feedback is test feedback. That's the most natural, cheap reward."——RLEF 核心。

> "The model cannot simply memorize the test outputs because it's getting the execution feedback. So it learns to debug, not to memorize."——public/private test split 防 memorize。

> "Human labelers are extremely expensive — imagine generating tens of thousands of model outputs and rating each one."——Constitutional AI 動機。

> "Constitutional AI used 16 principles written by humans. Humans don't need to be in the loop except to write that constitution."——解放 RLHF 人類標註。

> "The reason this notion of rules works is because the models get better at instruction following."——constitution 為何有效。

> "Chain of thought actually slightly hurts Constitutional AI — the model may find loopholes to rationalize harmful outputs."——CoT 反效果。

> "Post-training compute is maybe 5% of total — so updating the constitution periodically is feasible, but continual learning is still an open problem."——Constitution 更新工程現實。

> "If the search space is well-defined then you can automate it. But a lot of tasks we give to LLMs are not in a well-defined search space."——language space reasoning 的根本理由。

> "Reasoning tokens are internal, model 自己產出；把它們放在 action space 只是架構便利——LM 訓練在語言 token 上。"——ReAct 為什麼 thought + action 共用 prompt。

---

## 與 Stanford CS329A 系列其他章節的關聯

| 章節 | 主題 | 與本章的關聯 |
|------|------|--------------|
| Part 1 | Course Overview | 介紹 self-improving agent 課程地圖，本章是「feedback 來源」支線 |
| Part 2 | Test-Time Compute Scaling | inference-time sampling 是 implicit feedback 的一種；本章的 ReAct 把「環境回饋」加進來 |
| Part 3 | Robust Verification | 講 verifier 怎麼挑出正確答案；本章講 feedback 訊號從哪來——兩者是 self-improvement 的兩條腿 |
| Part 5+（預告） | RL for Agents / Reasoning Models | Part 5 預期會進入更深的 RL training（從 RLEF 延伸到 PRM-based RL） |

整體而言，Part 4 把 self-improving agent 從「**如何驗證**」（Part 3）推進到「**如何取得訊號**」（Part 4）。下一階段是把這兩條線合在一起——用 verifier 引導 generator、用 feedback 訓練 verifier。

---

## 研究方向與延伸思考

### 1. ReAct 變體：Reasoning Token 的位置

ReAct 把 reasoning 跟 action 寫在同一序列，但學生問到：「能不能把 thought 從 action space 完全抽離，用 latent representation？」講者回答：理論上可以，但**目前 LM 訓練在語言 token 上**，這是最自然的介面。

### 2. Tool Calling 的 Pareto 前緣

現代模型的 tool call「已經內化」（innate），但不同任務需要的 reasoning:action 比例不同。學生問：「能不能 fine-tune 不同任務的最適比例？」講者回應：這跟**避免 overthinking** 是同一個問題——現代模型對簡單任務也會產生很長的 reasoning trace。

### 3. Execution Feedback 的泛化

RLEF 在 Code Contests 上學到的能力，能不能轉移到 bug fixing、test generation、SWE-bench？講者點出 SWE-bench 是個關鍵 target——context window 限制、code base 探索、test 驗證，全都需要 RLEF 精神。

### 4. Constitutional AI 的 CoT 反效果

Chain-of-thought 反而降低 Constitutional AI 的 harmlessness——這很反直覺。可能的解釋：CoT 給模型更強的 reasoning 能力，**也包括「找到 constitution 漏洞」的能力**。

### 5. Constitution 的動態演化

Constitution 不會永遠夠用。問題是「如何讓模型在不忘記舊能力的同時，遵守新 constitution？」continual learning / model editing / interpretability 是可能途徑。

### 6. 三條 feedback 路徑的統一框架

ReAct = 環境 feedback；RLEF = 執行 feedback；Constitutional AI = 自我 feedback。能否建一個 unified framework，把所有 feedback 來源當作「reward function」的一般化？這是 self-improving agent 理論化的關鍵一步。

---

## 參考資源

### 課堂提到之 3 篇核心論文

1. **Yao et al. (2022).** *ReAct: Synergizing Reasoning and Acting in Language Models.* → Thought-Action-Observation 交錯 prompt，是 tool calling 框架的基石。
2. **RLEF (2024).** *Grounding Code LLMs in Execution Feedback.* ——把 unit test 結果當 RL reward。
3. **Bai et al. (2022).** *Constitutional AI: Harmlessness from AI Feedback.* Anthropic。→ 用 16 條 constitution 讓模型自我批評。

### 相關延伸閱讀

**Reflexion**（Shinn et al., 2023）、**Self-Refine**（Madaan et al., 2023）、**SWE-bench**（Jimenez et al., 2024）、**WebShop / ALFWorld**（Yao et al., 2022）、**RLHF**（Christiano et al., 2017；Ouyang et al., 2022）、**CodeContests**（Li et al., 2022）。

### 影片來源

- **YouTube**：[Part 4 — Learning from Feedback with Tools/Code](https://www.youtube.com/watch?v=Lxh9RF5S-K0)
- **播放清單**：Stanford CS329A: Self-Improving AI Agents（2026 Spring）
- **字幕來源**：YouTube auto-generated English (en-orig)
