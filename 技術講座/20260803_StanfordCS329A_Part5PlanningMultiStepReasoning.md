---
講者: Stanford CS329A 課程團隊
影片連結: https://www.youtube.com/watch?v=Ml_fp9XkB8Y
影片長度: 1:14:55（4495s）
發布日期: 2026-08-03
---

# 【Stanford CS329A — Part 5 — Planning and Multi-Step Reasoning】

> ⚠️ **本片為 Stanford CS329A「Self-Improving AI Agents」系列 Part 5**，承接 Part 2（Inference-time Scaling）與 Part 3（Verification），把焦點從「**生成與驗證**」推進到「**規劃與多步推理**」——LLM 如何在一連串動作、觀察、反思之間自己找出解題軌跡。

---

## 主題與背景

這堂課的主軸是「**Planning + Multi-Step Reasoning**」，跟 Part 2/3 討論的「**單題怎麼找答案**」不同，本堂課把題目拉長成「**一連串互相依�的子任務**」：模型必須同時做 reasoning（規劃）、acting（執行）、search（搜尋軌跡），在三者間反覆來回。講者開場直接點出三類典型應用：trip planning、Deep Research、software engineering——這些任務若交給純粹的 single-step LLM，再多的 inference scaling 也救不了，因為**錯誤會沿著多步累積、放大**。

### 為什麼 multi-step 是 self-improving loop 的新瓶頸

Part 2 告訴我們：當 verifier 給力時，重複取樣可以換來 log-linear 的 pass@k 改善；Part 3 又示範 verifier 可以從人工標註走向自動 rollout、再走向 weak-to-strong ensemble。**但這些技術都建立在「單題可驗證」的假設上**。一旦任務變成多步，驗證器就難以單獨打分。本堂課的三篇 paper 從三個角度回應這個瓶頸：

1. **LATS**（ICML 2024）—— 把 MCTS 整套 selection-expansion-evaluation-simulation-backpropagation-reflection 搬進 LLM agent，把「搜尋軌跡」變成可操作、可驗證的 process。
2. **SPRINT**（2025, 未發表）—— 換個維度，承認「**思考太慢**」是另一個瓶頸，用 fine-tuning 教模型**平行思考**——把獨立的子計畫一次生成、平行執行，省下 sequential token。
3. **SWIRL**（COLM 2025, preview）—— 把 Part 3 的 process-level verifier 思想延伸到「**多步 + 工具使用**」的 setting，搭配 multi-step RL 讓模型學會**怎麼使用工具、何時停止、如何從錯誤中恢復**。

### 三篇 paper 的進程

| # | 論文 | 年份 | 核心切入點 | 在 self-improving loop 的角色 |
|---|------|------|----------|------------------------------|
| 1 | **LATS** | ICML 2024 | 把 MCTS / UCT 搬進 LLM agent | inference-time 強化軌跡搜尋 |
| 2 | **SPRINT** | 2025（未發表） | 用平行計畫降低 inference latency | post-training 改變思考結構 |
| 3 | **SWIRL** | COLM 2025（preview） | process-level verifier + multi-step RL | training-time 教模型使用工具 |

> 三篇 paper 構成「**inference → 訓練結構 → 訓練目標**」的脈絡：先強化 test-time 搜尋，再改變模型的思考結構，最後把 verification 內化到 RL 目標。

---

## Section 1｜開場：為什麼 Planning 是 Self-Improving Agent 的下一關（00:00 ~ 03:00）

講者開場直接�出問題：**多步任務（multi-step task）跟單步任務有什麼本質差別？** 答案是：模型不只要推理，還要**行動**（browse、search、call API），並且要**搜尋自己的軌跡**。Trip planning 是最直觀的例子——模型先 reasoning（預算、目的地），再 acting（搜尋 Reddit、blog、評價網），最後 search（refine 計畫、考慮替代方案）。

講者點出三篇 paper 共同的設計哲學：把 RL 與 multi-step planning 的既有技術（MCTS、UCT、reward shaping）搬進 LLM reasoning，並且**讓模型自己接收環境 feedback 來 refine 後續動作**。這是 Part 3 那條 verifier 主線的延伸——verifier 不再只是「給 final answer 打分」的工具，而變成「**引導每一個搜尋節點**」的核心元件。

> **核心訊息**：Multi-step task 的瓶頸不在於「能不能生成對的單步」，而在於「**能不能在錯誤累積之前就修正方向**」——這需要 search、reflection、re-planning 三件齊備。

---

## Section 2｜Paper 1 — LATS 核心思想：把 MCTS 搬進 LLM Agent（03:00 ~ 08:30）

**LATS（Language Agent Tree Search）** 是 ICML 2024 的 paper，標題就是「Unifies reasoning, acting, and planning in language models」。講者把它跟 Part 3 提到的 **Math-Shepherd** 對比：

| 對比項 | Math-Shepherd | LATS |
|--------|---------------|------|
| Scoring 對象 | reasoning choices（步驟本身的對錯） | action outcomes（執行動作後從環境拿到的結果） |
| 訊號來源 | 自動 rollout 標註每一步 | LLM-as-Judge + 環境反饋 + reflection |
| 主要方法論 | PRM 啟發式引導 | MCTS + UCT + ReAct-style reflection |

LATS 從 **ReAct** 借鏡三個設計原語——reasoning、acting、reflection——把 feedback 從環境 incorporate 進搜尋過程。LATS 的關鍵創新是**把 reflection（自我反思）做成標準步驟**——模型能在 trajectory 結束時自動總結「為什麼失敗 / 為什麼成功」，並把這個反思回灌到未來的搜尋。

---

## Section 3｜LATS 六階段機制 + UCT 數學 + 實驗結果（08:30 ~ 22:30）

LATS 的搜尋流程由 **6 個階段**組成：

1. **Selection（選擇）**：用 **UCT** 從 root 走到 leaf。UCT = `V(s) + c × √(ln N_parent / N_s)`，平衡 exploitation 與 exploration。
2. **Expansion（展開）**：在 leaf 產生 K 個候選 action，每個 action 是新的 child node。
3. **Simulation（模擬）**：從 child rollout 到 terminal 或 max-depth，拿 return（成功/失敗）。
4. **Evaluation（評估）**：給 child 一個 initial value——LATS 採用 **LLM-as-Judge + self-consistency + environment feedback** 的加權平均。
5. **Back-propagation（回溯）**：用 rollout 結果更新路徑上所有節點的 V(s)，公式 `V_new = (V_old × (n-1) + R) / n`。
6. **Reflection（反思）**：在 trajectory 結束時讓模型總結成功/失敗原因，回灌 prompt。

> UCT 是 LATS 借自 bandit theory 的核心平衡機制。講者特別說明 UCT「沒有 optimality proof」，但它在實務上比純 exploitation 效果好很多。

**實驗結果**：

- LATS 在 **HotpotQA**（多跳 Wikipedia 問答，每題至少要從 2 個 Wikipedia pages 擷取）與 **WebShop**（多步商品搜尋與下單決策）上都展現了**log-linear scaling**——trajectory 數從 1 增加到數十、數百，pass rate 持續上升。
- LATS 在 WebShop 上**不需要任何 fine-tuning** 就能達到接近專用 RL agent 的表現。
- Reflection step 對 final performance 的 boost 非常顯著——拿掉 reflection，pass rate 會掉 10%+ 個百分點。
- **可逆 vs. 不可逆 action**：講者在 Q&A 點出 LATS 的限制——它假設 action 是可逆、可實驗的。對不可逆 action（如金融交易、付款），LATS 的樹狀搜尋就沒這麼好用。

---

## Section 4｜Paper 2 — SPRINT：用平行思考換 Inference Latency（22:30 ~ 49:30）

**SPRINT**（講者全程唸成「sprint」）是 2025 年的新 paper，動機來自一個 practical 觀察：**reasoning model 在困難題上思考越來越長**。講者引用 DeepSeek R1 的訓練曲線：隨著 RL 訓練推進，平均 response length 從 ~1k tokens 增加到 ~10k tokens，但 accuracy 確實跟著上升。

問題是：**多出來的 token 都是必要的嗎？** 講者用 graph 展示 reasoning trace——裡面很多 sub-task 之間其實是**互相獨立的**（例如「驗證 step A 的結果」跟「計算 step B」可以同時進行）。傳統 sequential decoding 卻把所有獨立步驟都串成一行，浪費了大量 wall-clock time。

**SPRINT 的核心做法**分四步：用 GPT-4o 對 DeepSeek R1 的 reasoning trace 做 annotation（**decompose trace**，把 step 切成 plan / execution）；請 GPT-4o 標 step 依賴關係（**build DAG**）；把 DAG 拓樸排序後同一層的獨立 step 包成「同一批」（**pack parallel groups**）；拿重新格式化過的 trace 來 supervised fine-tune DeepSeek R1 Distill 7B，教模型在 inference 時自己輸出「plan 1 / plan 2 / ...」的特殊 tag。

**實驗結果**：

- **Sequential tokens 減少約 40%**（在 math dataset 上），accuracy 反而**上升約 3.5 個百分點**。
- **Out-of-domain generalization**：在 math 上訓練、在 GPQA Diamond 與 Countdown 上測試，accuracy 跟 parallelism 雙雙提升——這暗示「**學會平行思考**」本身是個 transferable skill。
- **比 32B 模型更省 token**：7B SPRINT 在 sequential tokens 上比 32B 對照組更少，accuracy 卻差不多。

講者點出一個關鍵 insight：**強迫模型做 structured planning 本身就提升了 reasoning quality**——給模型一個「先想再寫」的結構，錯誤率會掉。

---

## Section 5｜Paper 3 — SWIRL：把 Process Reward 延伸到 Multi-Step + 工具使用（49:30 ~ 1:04:00）

**SWIRL** 將在 2025 年 10 月的 **COLM（Conference on Language Modeling）** 在 Montreal 發表。Preview 強調四個 design goal：

1. **解決複雜多步 + 工具使用任務**：模型要知道何時 call tool、用什麼 query、何時停止。
2. **教模型從錯誤中恢復**：process-level reward 而非 only outcome-level reward。
3. **訓練時避免真實呼叫工具**：tools 慢、會 fail、會引入 bug，所以 SWIRL 採用**離線（offline）合成資料 + RL**。
4. **泛化到 unseen tools & domains**：訓練時只教某幾個 tool，測試時要能 generalize 到新工具。

**SWIRL 的三階段 pipeline**：① **Synthetic multi-step data generation**——用 GPT-4o iteratively prompt 自己產生 multi-step trajectories（每步可以是 reasoning、tool call、或 final answer）；② **LLM-as-Judge labeling**——對 trajectory 的**每一個 step**（reasoning + tool call）請另一個 LLM 給 good/bad reward（**judge 只看 query 不看 tool output**，才能離線 scale）；③ **Multi-step RL**——目標函數 `max E[R(a_k \| s_1, a_1, ..., s_k)]`，給定前 k-1 步 context 優化第 k 步 expected reward。

---

## Section 6｜SWIRL 訓練細節 + 跨域泛化實驗（1:04:00 ~ 1:12:00）

SWIRL 的實驗 setup 用 **Gemma 2 27B** 生成 50k 條 trajectories（source: HotpotQA + GSM8K），再用 LLM-as-Judge 標 process label。他們比較了四種 data filtering 策略：

| 過濾策略 | 說明 | 效果 |
|---------|------|------|
| **Random** | 隨機抽 | baseline |
| **Process-only** | 只保留每個 step 都被 judge 標 good 的 | 意外地比 outcome-filtered 好 |
| **Outcome-only** | 只保留 final answer 正確的 | 不錯，但 train/test mismatch |
| **Both** | process + outcome 都嚴格過濾 | 反而不如 process-only |

講者點出一個反直覺的發現：**只用 process label 過濾（不管 final answer 對不對）的訓練資料效果最好**。原因是：如果只留 final 正確的 trajectories，模型只是在「**模仿自己本來就會的東西**」——它沒學到新能力；但 process-filtered 的 trajectories 可能包含 final answer 錯、但中間 reasoning step 好的範例，反而教會模型「**正確的過程可以導向正確的答案**」這個 transferable lesson。

> **最關鍵的 generalization 圖**：在 HotpotQA + search tool 上 RL 訓練、在 GSM8K + calculator 上測試——accuracy 從 baseline 的 65% 跳到 **75.1%**；反過來在 GSM8K 上訓練、在 HotpotQA 上測試，accuracy 也從 65% 跳到 **73%**。這證明 SWIRL 不是學會某個特定 tool，而是學會「**如何思考 + 何時 call tool + 如何收尾**」這個 meta-skill。

講者也展示一條 scaling curve：把 training data 從 100 筆加到 10,000 筆，**out-of-domain test accuracy 仍然持續上升**。這暗示 process reward + synthetic data + multi-step RL 的組合，可以靠資料量 scaling 一直改善。

---

## Section 7｜收尾 + Takeaways（1:12:00 ~ 1:14:55）

講者用一張 summary slide 把整堂課收尾，三個 takeaway：

1. **Process-filtered synthetic data 比 outcome-filtered 更有威力**——呼應 Part 3 PRM800K 的發現，但要延伸到 multi-step + tool use setting。
2. **Generalization across datasets + tools 是真實可達成的**——前提是 reward function 設計要對（process-level，而非 outcome-only）。
3. **Multi-step RL 比 Supervised Fine-tuning 在 long-horizon task 上更強**——因為 SFT 是 imitation learning，無法探索「如果走錯了該怎麼回頭」；RL 可以給模型「換個 action 再試一次」的機會。

講者最後留下一個開放性問題：**怎麼把 SWIRL 的 process reward 跟 LATS 的 tree search 結合？** 例如在 RL 過程中，同時用 LATS 的 selection 機制引導搜尋，再用 SWIRL 的 judge 給每個 node 打分——這是 Part 6（如果有的話）可能探討的方向。

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone xiaotian_clone_v1, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：[transcripts/口播稿.txt](../transcripts/口播稿.txt)（全知分析者視角）

- [opus XX MB](../audio/口播稿.opus)（Telegram 友善，32k Opus）
- [m4a XX MB](../audio/口播稿.m4a)（iOS 友善，128k AAC）
- [mp3 XX MB](../audio/口播稿.mp3)（通用格式，HD 音質）

> **第一段（開頭）**：本片介紹 Stanford CS329A Part 5 的三篇 paper——LATS、SPRINT、SWIRL，三者構成「inference-time search → 訓練時結構 → 訓練時目標」一條貫穿的脈絡。

> **第二段（中段）**：LATS 把 MCTS + UCT + reflection 搬進 LLM agent，用 tree search 強化多步軌跡；SPRINT 教模型平行思考，把 sequential tokens 砍掉四成同時 accuracy 還上升；SWIRL 用 LLM-as-Judge 標 process reward，搭配 multi-step RL 教模型使用工具並跨域泛化。

> **第三段（結尾）**：本課呼應 Part 3 的 PRM 主線，把 process-level supervision 延伸到多步 + 工具使用 setting；同時呼應 Part 2 的 inference scaling 概念，證明 test-time 結構化思考本身就是個 scaling axis。

---

## 關鍵概念定義

### 概念1：多步任務 (Multi-Step Task)

| 定義 |
|------|
| 模型必須依序執行多個動作（搜尋、計算、查 API、寫程式），每步輸出是下一步輸入。 |

### 概念2：推理步 (Reasoning Step)

| 定義 |
|------|
| 模型內部 chain-of-thought，拆解任務、列舉選項。 |

### 概念3：行動步 (Acting Step)

| 定義 |
|------|
| 模型呼叫外部 tool（search、calculator、Python）。 |

### 概念4：搜尋步 (Search Step)

| 定義 |
|------|
| 在多條可能軌跡中選擇下一步要走哪一條。 |

### 概念5：反思步 (Reflection Step)

| 定義 |
|------|
| 模型對剛結束的 trajectory 做總結（成功/失敗原因），回灌 prompt。 |

### 概念6：軌跡 (Trajectory)

| 定義 |
|------|
| 一條從 root 到 leaf 的動作序列。LATS 用 MCTS 搜尋多條軌跡，從中選出最佳。 |

### 概念7：錯誤累積 (Error Accumulation)

| 定義 |
|------|
| 單步錯誤率 p，K 步後總正確率約 `(1-p)^K`。multi-step 任務對錯誤極為敏感。 |

### 概念8：軌跡優化 (Trajectory Optimization)

| 定義 |
|------|
| 在多條可能軌跡中找出最佳，是 multi-step planning 的核心問題。 |

### 概念9：LATS 語言代理樹搜尋 (Language Agent Tree Search)

| 定義 |
|------|
| 把 MCTS 整套 selection-expansion-simulation-backprop 搬進 LLM agent 的框架（ICML 2024）。 |

### 概念10：MCTS 蒙地卡羅樹搜尋 (Monte Carlo Tree Search)

| 定義 |
|------|
| RL 經典演算法，用大量 random rollout 估計每個 state 的 value。AlphaGo 用此打敗人類。 |

### 概念11：UCT (Upper Confidence Bounds for Trees)

| 定義 |
|------|
| MCTS 的選擇公式 `V(s) + c × √(ln N_parent / N_s)`，平衡 exploitation 與 exploration。 |

### 概念12：回溯更新 (Back-propagation)

| 定義 |
|------|
| rollout 結束後把 return 沿路徑更新所有節點的 value 估計。 |

### 概念13：SPRINT

| 定義 |
|------|
| 教模型把獨立子計畫一次生成、平行執行的 post-training framework（2025 paper）。 |

### 概念14：平行思考 (Parallel Thinking)

| 定義 |
|------|
| 把推理 trace 中互相獨立的 sub-task 編成同一批、同時執行，節省 sequential tokens。 |

### 概念15：DAG 註解 (DAG Annotation)

| 定義 |
|------|
| 用 LLM 標註 step 之間的依賴關係，把線性 trace 轉成有向無環圖。 |

### 概念16：執行標籤 (Execution Tag)

| 定義 |
|------|
| 模型在 inference 時輸出的特殊 tag（plan 1 / plan 2 / ...），告訴執行端哪些可以平行。 |

### 概念17：SWIRL

| 定義 |
|------|
| 用 process-level LLM-as-Judge + multi-step RL 教模型使用工具的 framework（COLM 2025）。 |

### 概念18：過程獎勵 (Process Reward)

| 定義 |
|------|
| 給 trajectory 的每一步（reasoning + tool call）打分，而非只給 final answer 打分。 |

### 概念19：LLM 當裁判 (LLM-as-Judge)

| 定義 |
|------|
| 用一個 LLM 評另一個 LLM 的 step quality，可離線批次做、scale 到 50k+ 軌跡。 |

### 概念20：跨域泛化 (Cross-Domain Generalization)

| 定義 |
|------|
| 在 dataset A 上訓練、在 dataset B 上測試，accuracy 仍然上升的現象。 |

### 概念21：多步強化學習 (Multi-Step RL)

| 定義 |
|------|
| RL 目標函數擴展到 multi-step trajectory，每步都有 reward，比 SFT 更適合 long-horizon。 |

### 概念22：離線訓練 (Offline Training)

| 定義 |
|------|
| 訓練前把所有 tool call 結果 pre-collected，訓練時不真的 call tool，省 latency 並避免 tool failure。 |

### 概念23：過程過濾資料 (Process-Filtered Data)

| 定義 |
|------|
| 只保留每個 step 都被 judge 標 good 的 trajectory。SWIRL 發現這種資料訓練效果最好。 |

### 概念24：結構化規劃 (Structured Planning)

| 定義 |
|------|
| 強迫模型先列子計畫再執行，比 free-form 推理更穩定（SPRINT 的關鍵 insight）。 |

---

## 金句摘錄

### 金句1

> "Today's lecture is going to be about planning and multi-step reasoning... three papers on multi-step reasoning and planning."——開場點出本課主題與三篇 paper 範圍。

### 金句2

> "We need not only to reason about things but also to act through those reasoning steps and search our trajectories or optimize trajectories."——定義 multi-step task 的三個本質要素：reasoning、acting、search。

### 金句3

> "In LATS, the scoring is not based on reasoning choices but based on the outcomes of the actions that the model takes."——LATS 跟 Math-Shepherd 的根本差異：scoring 對象是 action outcome，不是 reasoning choice。

### 金句4

> "UCT... balance between exploration and exploitation... there's no proof that this is the optimal round but you want to just balance the two."——UCT 在 LATS 中的角色：沒有 theoretical optimality guarantee，但實務上比純 exploitation 穩定。

### 金句5

> "They appended this reflection of the model itself about the trajectory that was expanded. If it fails or if it succeeds, the model adds some thinking behind what happened. This has been very helpful."——Reflection 是 LATS 六步驟中對 final performance boost 最顯著的一步。

### 金句6

> "Many of these reasoning steps seem to be independent of each other. We don't need to really wait for all of these steps to be created sequentially."——SPRINT 的觀察起點：reasoning trace 裡藏著大量可平行化的 sub-task。

### 金句7

> "We teach the model to think in parallel... and it turns out this process actually helps out with accuracy as well. Like the model seems to like this kind of more structured way of thinking."——SPRINT 最重要發現：平行化本身提升 accuracy，而不只是省 token。

### 金句8

> "We have out-of-domain generalization as well... training to think in parallel was done for math but we saw the model is doing better not only more parallelism but also higher accuracy for GPQA Diamond... there's no training on those datasets."——SPRINT 的 transferable skill：平行思考是個跨域的能力。

### 金句9

> "Multi-step reasoning and tool use... errors and complications can compound over these different steps."——SWIRL 設定的核心難題：錯誤在多步 + 工具使用中會 compound。

### 金句10

> "We ask an LLM as a judge to say given an input prompt and this action what is the reward for this step."——SWIRL 的 process reward 設計：judge 只看 query、不看 tool output，所以可離線批次做。

### 金句11

> "When our training data was only process filtered but we didn't filter based on correctness of final answer, this seems to help the training more than if we only took trajectories where the outcome was correct."——SWIRL 最反直覺的發現：process-only 過濾比 outcome-only 過濾更強，因為後者只是模仿模型已經會的東西。

### 金句12

> "It's the most important graph from this paper... by creating synthetic data in environments that are perhaps easier to create data for... we can generalize these behavior to entirely new tools and domains."——SWIRL 跨域泛化曲線：tool-specific training 可以 generalize 到 unseen tool，是 multi-step agent 的 scaling axis。

---

## Q&A 精選（學生提問 × 講者回答）

### Q1｜LATS 假設 action 是可實驗、可逆的嗎？

學生問：LATS 的樹狀搜尋假設可以反覆試 action，但**現實中很多 action 不可逆**（金融交易、付款）——怎麼處理？

講者回答：這是 LATS 的根本 limitation。對不可逆 action 需更保守策略（先 read-only 模擬再 commit）。未在 paper 正式處理，是 future work。

### Q2｜SPRINT 平行執行時怎麼處理 error recovery？

學生問：如果某個 plan 的 tool call 失敗了，模型怎麼記得是哪個 plan 對應哪個 execution？

講者回答：透過 context。模型把 plan 1 / plan 2 的 tag 一起 output，tool 結果帶著對應的 tag 回填 context，模型看 context 就知道對應關係。

### Q3｜SWIRL 為什麼 process-only filter 比 outcome-filtered 好？

學生問：直覺上「final answer 正確的 trajectories」應該是高品質資料，為什麼反而 process-only 更好？

講者回答：因為 outcome-filtered 是「**模型已經會的東西**」——你訓練它模仿自己會的答案，泛化不出去。Process-filtered 可能含 final 錯但 reasoning step 好的範例，反而教會「**正確過程導向正確答案**」這個 meta-skill。跟 Part 3 PRM800K 的「convincing wrong answers」標註邏輯一致——**學過程，不只學答案**。

### Q4｜這三篇 paper 對 real-world deployment 的建議？

學生問：對 production agent（Deep Research、Claude Code），takeaway 是什麼？

講者回答：① **LATS-style tree search 適合 read-only 環境**，對不可逆 action 要小心；② **SPRINT-style 平行 thinking 適合 latency-sensitive API**，但要先做好 dependency parsing；③ **SWIRL-style process-level RL 是 long-horizon agent 方向**，模型學「如何使用 tool」這個 meta-skill。

---

## 研究方向與延伸思考

### 1. SWIRL × LATS 的 hybrid framework

SWIRL 的 process reward 可以給 LATS 的每個 node 打分——把 tree search 的「探索-利用」與 RL 的「process-level supervision」結合起來。這個 hybrid 可能是 multi-step agent 的終局框架。

### 2. SPRINT 的 dependency detection 上限

SPRINT 用 GPT-4o 標 step 依賴關係，但 GPT-4o 也有 hallucination——標錯依賴會讓平行執行 race condition。延伸方向是用**形式化方法**（type system、symbolic execution）標 dependency。

### 3. Multi-step RL 的 credit assignment 瓶頸

SWIRL 用 expected reward 解 credit assignment，但 reward 稀疏（sparse reward）。延伸方向是引入 **step-level bootstrapping**（Part 3 PRM 思想），讓每步都能 refine 自己。

### 4. Process-filtered data 的 scaling law

SWIRL 發現 100 → 10,000 筆訓練資料，out-of-domain test accuracy 持續上升。延伸方向是**用更大 model、data、RL 步數**，看 SWIRL generalization 能 push 到哪裡。
