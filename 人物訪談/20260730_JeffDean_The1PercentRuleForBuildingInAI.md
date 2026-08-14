---
title: Jeff Dean — The 1% Rule for Building in AI
講者: Jeff Dean
影片連結: https://youtu.be/CxXgV54KzpQ
影片長度: 57:07（3427s）
發布日期: 2026-07-30
頻道: Y Combinator
類型: 人物訪談
語言: 英文
---

# 【Jeff Dean — The 1% Rule for Building in AI】

> **講者**： Jeff Dean（Google Chief Scientist、Google DeepMind 共同創辦人；MapReduce、BigTable、TensorFlow、TPU、Gemini 等基礎設施的原作者之一）
> **影片來源**： Y Combinator 2026-07-30 訪談（主持人 Garry Tan）
> **影片長度**： 57 分 07 秒
> **主題**：🤖 AI / 大規模系統 / 創業 / 1% 思維 / 後摩爾時代
> **核心議題**： 後摩爾時代的 AI 算力、agent 時代的工程方法、給未來創辦人的「1% 思維」——從 napking math 到長跑 agent、從硬體特化到 model 本身加速 ML 研究

## 主題與背景

這支影片是 Y Combinator 於 2026 年 7 月 30 日發布的對談錄影，主題是「The 1% Rule for Building in AI」。主持人 Garry Tan 邀請 Google Chief Scientist Jeff Dean 進行一場 57 分鐘的深度訪談，場景設定在 YC 對約 6,000 位創業家的演講場合。

Jeff Dean 是當代分散式系統與機器學習基礎設施最重要的工程師之一。他在 1999 年加入當時只有 20 人的 Google，是 MapReduce、BigTable、TensorFlow、TPU（Tensor Processing Unit）、Gemini 等劃時代系統的共同作者。這場訪談談的不只是 AI 模型本身，而是把 AI 時代的工程方法、硬體設計、創業選擇串起來——用他自己的工程史回答「未來的傑出工程應該怎麼做」。

整場訪談圍繞六個軸線展開：

1. **預測驗證** — 一年前他說「AI 等於 junior 工程師」，現在看來如何？
2. **下一次預測** — 2027 年有哪些被他低估的趨勢會成真？
3. **歷史的韻律** — 從 2001 年 Google 把搜尋索引從硬碟搬到 RAM 到 2026 年的 inference 硬體特化
4. **napkin math** — 用簡單數字估算系統限制的傳統
5. **AI 時代的工程方法** — 從 context engineering 到 agent 編排
6. **給未來創辦人的選擇標準** — 從 Google 內部的工作與小型 startup 的取捨

## 核心章節

### Section 1：開場與一年前的預言（00:00 ~ 02:38）

Garry Tan 用一句話總結 Jeff 的工程史：「You built MapReduce, Bigtable, TensorFlow, the TPU, Gemini」——每一個系統都重塑了後續十年的雲端與 AI 產業。Garry 接著切入主題：Jeff 一年前在 AI Ascent（2025 年 5 月）公開說「AI 達到 junior 工程師水平」，這個預測現在看來如何？

Jeff 的回答簡潔：「**It seems pretty spot-on**。」他解釋，現在的模型在 agent-based、longer-running coding tasks 上已經「pretty capable」；問題只是「junior engineer」該如何嚴格定義。

Garry 接著追問「你低估了什麼？」Jeff 給出兩個層次：

- **第一層**：模型做複雜任務的能力比他預期成長更快
- **第二層**：除了 coding 之外，agent-based 系統在其他領域也開始展現能力，這是未來重要趨勢

### Section 2：2027 年的預言——AI 自動改進 ML 系統（01:47 ~ 02:38）

Garry 要求 Jeff 給出「2027 edition」的預測。Jeff 的回答是**自動化 ML 系統本身**：

> 「You'll see a lot more automation of ML systems themselves, basically getting ML systems to improve their capabilities by running lots of experiments, breaking things down into sub-problems, running those sub-problems in a tight automatic experimentation loop, putting the results together, and being able to then get some improved system out from that fully automated problem decomposition and automated experimentation.」

關鍵是**任何有可量化目標的領域**都適用（不只是 ML，也包括科學與工程）。這個概念呼應了他後段提到的 Alpha Evolve——AI 系統自己跑實驗、評估、保留有效果的方案。

### Section 3：歷史的韻律——從 2001 年硬碟搬到 RAM 到 2026 年的 inference 硬體（02:40 ~ 04:40）

Garry 切到歷史：2001 年 Google 搜尋原本跑在硬碟上，Jeff 和 Sanjay Ghemawat 做了「napkin math」算出「整個搜尋索引終究會 fit in all of the RAM」，於是幾天內就把整套 production 系統搬到 RAM 架構。這讓 Google 搜尋變快的核心原因。

Garry 問：「**2026 年的『it fits the memory moment』是什麼？**」Jeff 認為是**高效能、低能耗的 inference 硬體**。理由是：

- 現在每個人都意識到 inference 是讓 agent-based 系統普及到更多人的關鍵
- latency 是要角
- 硬體特化（specialization）才能做到比 GPU/TPU 更節能、更低延遲

Jeff 進一步鋪墊：「想像一下 latency 50x better 的世界」。這個假設也為他後來談 Google 自家硬體策略埋下伏筆。

### Section 4：對 6,000 人錯的最大謬誤——長跑 agent（04:40 ~ 06:00）

Garry 問：「在座 6,000 人對 AI 持有的某個假設，其實是錯的？」Jeff 的回答是：

> 「People don't quite realize how possible it is to have agent-based systems that can run not just for an hour or two hours on a problem you care about, but for some problem domains and with highly capable models underlying them, you can get them to run for days or weeks and do really, really complicated tasks.」

他具體描述了一個案例：讓 agents 去實作「完全新版本的軟體，用不同程式語言重寫，可能有更好的安全或效能特性」。這個任務他曾讓 agents「跑了好幾週」。

### Section 5：TPU 的起源故事——2013 年的 napkin math（06:00 ~ 09:20）

接著進入經典故事。2013 年 Google 內部 deep learning 語音系統終於開始 work，錯誤率砍半——相當於語音辨識 20 年的進步壓縮到幾個月。但 Jeff 跑了 napkin math：

> 「如果每個 Google 用戶每天用 phone 講 3 分鐘，現有 CPU fleet 必須翻倍。」

這個數字直接催生 TPU 計畫。Jeff 解釋 TPU 的核心設計哲學：

- **特化於低精度密集線性代數**（low precision dense linear algebra），這是幾乎所有現代 ML 演算法的心臟
- **不做其他事**——TPU 不能跑 Chrome、不能跑 Word，但 ML 推理上極度節能
- 結果：比當時 CPU/GPU **節能 30-80 倍、延遲低 20-30 倍**

有趣的是 Jeff 強調他們故意避免「過度特化」：

> 「That's sort of why we built a general purpose linear algebra system, which is what a TPU is really. Because we knew ML algorithms were still evolving, and you didn't want to over-specialize.」

這是 2013 年的設計選擇，結果在 Transformer 時代（2017 年後）意外成為整個 AI 革命的算力基礎。

### Section 6：給未來創辦人的 napkin math + 2026 年版的「Latency Numbers」（09:20 ~ 12:30）

Garry 問有抱負的創辦人今晚該跑什麼 napkin math。Jeff 的建議濃縮為一個原則：

> 「Look at what problems you see, what bottlenecks you see, and are there very different ways of thinking of the solutions... that would get you to an order of magnitude better performance or capability? Because sometimes if you just squint at a problem and you think about not necessarily being anchored on how the problem is solved today, but how you would solve it from first principles, you can come up with really good ideas.」

接著 Garry 提到 Jeff 著名的「**Latency Numbers Every Programmer Should Know**」（每個工程師都該知道的延遲數字）——這是一份分散式系統圈的「聖經表」，從 L1 cache miss 到跨洲網路封包的時間。Garry 問：2026 年 AI 版的數字應該長什麼樣？

Jeff 給出幾個關鍵 metric：

- 加速器主記憶體到 on-chip memory 到 multiplier unit 的**頻寬**
- **一次乘法運算要花多少能量**
- 晶片之間的**互連頻寬**，以及能串多少顆晶片
- 從 500 顆擴到 10,000 顆時，**網路頻寬會衰減多少**

這份心理清單決定了 AI 系統設計師怎麼思考 scaling。

### Section 7：能量界線——為什麼 batching 是 model 問題也是 data I/O 問題（12:30 ~ 15:50）

Jeff 提出一個震撼的數字：

> 「Doing a calculation of math costs about one picodruel. But moving the data and doing data I/O costs 1,000 times that.」

這個 **1,000x 差距**決定了什麼產品可能、什麼演算法該怎麼寫。Jeff 解釋 ML 訓練中 batching 的存在不是模型問題而是系統問題：

- 如果沒有 1,000x 差距，你不需要 batching
- 因為有 1,000x 差距，你必須把 many examples 或 many tokens 包成 batch 來**分攤** data movement 的成本
- 但 batching 對極低延遲場景不利

這是「**問題以為是 model 問題，其實是 energy / data I/O 問題**」的經典例子。

Jeff 認為 inference 比 training 更有趣——因為 training 不需要極低延遲，但 inference 需要。他在思考的 inference 優化：

- **盡量減少 data movement**
- **極低精度運算**（incredibly low precision operations）
- **不做太多種精度**——如果知道要什麼精度，就直接做進硬體

他最後順道引用了一句來自「famous computer scientists」的金句：

> 「The whole process of AI is a big compression problem. Because in order to have the data to be fully lossy and compress it and then restore it, you basically need to understand it.」

Transformer 正是把這件事做到極致的架構。

### Section 8：Context Engineering 與自己寫的 skill——Performance Hints（15:50 ~ 22:00）

Garry 把焦點拉到 context engineering。Jeff 認為：

- 模型只是系統的一部分
- 系統還包含**使用工具、檢索資訊、記憶體/歷史資訊、agent tools**
- 重點：context 對模型來說是「really clear」的，不像訓練資料是「trillions of tokens stirred together」

**關鍵洞察**：context engineering 對在場 6,000 人來說**人人可做**——只要有 Gemini API 就能開始，不需要巨大 GPU 或資料集。

Jeff 給出個人案例：他和 Sanjay 寫了一個 skill 來自動優化 Google 內部的低階函式庫。他們的 microbenchmark library 過去必須由人跑——量 baseline、改 code、跑 benchmark、量 cache footprint——現在他把這個流程封裝成 skill 讓 agent 自己迭代。

更進一步，他和 Sanjay 寫了一份 30 頁的「**Performance Hints**」文件，記錄各種效能優化技巧。許多團隊把這份文件總結後餵給模型，模型就能開始自己 reasoning 程式碼的效能問題。

> 「You could actually optimize your own code like Jeff Dean if you take this paper that you published in Performance Hints.」

### Section 9：長跑 agent 的限制——為什麼第 10 步後會崩（22:00 ~ 25:30）

Garry 觀察到：「agents are great for up to step 10, and then gets shaky at step 50」。Jeff 同意核心問題：

> 「As soon as you get a little bit off the distribution of things it knows how to do, then like most ML models, its performance will suddenly degrade.」

解方有幾個：

1. **Skills 與 hints**——讓模型留在「更明亮的路徑」上
2. **Multi-agent 系統**——多個 agent 嘗試不同解法，由評估者挑選最有希望的
3. **Inference-time compute 做搜尋**——在合理解的空間中搜尋並保留最佳解

Jeff 進一步說 Google 內部做了大量**內部工具的 skills**——例如讓 agent 知道怎麼從內部日誌系統抓 log、抓 code review 資料、量效能。Skill 讓 base model 變得更能幹，**即使它根本沒被訓練過那些內部工具**。

### Section 10：Startup 致勝領域——個人資料與 niche 模型（25:30 ~ 31:00）

Garry 切到創業家最關心的問題：Google 從處理器到產品都自己設計，但 2-3 人的小團隊在哪裡能贏？

Jeff 的回答是兩條路：

1. **個人資料 / 垂直領域**：Google 沒有管道（visibility）進入的資料，2-3 人小團隊可以做。例如「organize your personal information」——Google 的強項是「organize the world's information」，但「你的個人資訊」這塊是空白。
2. **特殊領域的特化模型**：例如 AlphaFold（蛋白質結構預測）、材料科學、晶片設計——這些領域不需要一個巨大通用模型，需要一個**精準的 niche 模型**。

選擇標準很硬：看當前通用模型在這個領域的表現

- **0% 或 1% 成功率** → 好選擇（model 還沒進入這個能力）
- **20% 成功率** → 不太好（模型正在追上，很快就會更好）

換言之：「找那些 model 0% 會的事」。

### Section 11：AI-native 創辦人——spec 寫好才能 scale agents（31:00 ~ 36:00）

Jeff 過去說過「管理 50-100 個 agents 的關鍵是寫好 crisp design docs / specs」。他解釋：

> 「The clearer you are on what it is you want, the more the agent will have guidelines and rules of an outline of what it is trying to accomplish. Whereas if you don't specify very much stuff, the agent has to infer what it is you meant.」

這個重要性反而**比過去更高**——因為過去你交給聰明的人類，他會反問你；現在你交給 agent，它 inference 出來的可能是另一回事。

範例：把 Python 程式碼翻譯成 Go，模型非常能幹，因為「**spec 已經非常清楚**」——整個 Python 程式碼本身就是 spec，agent 可以跑所有測試、port 測試、對照行為差異直到完全一致。

當 agents 接管所有寫 code 的工作，**稀缺的技能變成「taste」**——選對問題問 agent。

### Section 12：如何 build taste——經驗、預測練習、瘋狂 thought experiments（36:00 ~ 42:00）

Garry 問「taste 怎麼 build？」Jeff 給出三條路：

1. **經驗**——做過很多問題才知道哪些有趣
2. **預測練習**——寫下未來 12 個月覺得重要的事，只挑一個做，過 12 個月回頭看哪些對了。這個練習累積「taste 樣本」
3. **瘋狂 thought experiments**——挑戰別人當作 given 的假設

Jeff 舉了一個經典 thought experiment：

> 60 年來晶片設計/製造產業都假設「每顆出廠的 chip 都應該一模一樣、不會 bit flip」。但大型分散式系統根本不做這個假設——個別 disk 會壞，但用 3 份副本 + Reed-Solomon 編碼就能保護資料。那能不能在**電晶體層級**讓 transistor 故意不穩定（20 errors/day 而不是每百萬年一次），改用更高層的 redundancy 機制？

這個 idea 跟 neuromorphic computing、人腦的多路徑信號處理很像。Jeff 承認「這不是說我們要做，但是這是個值得偶爾做的 thought experiment」。

他在這個段落透露 MapReduce 的本質就是 thought experiment：

> 過去他和 Sanjay 為了讓分散式 crawling/indexing 系統 robust，寫了大量手刻的 checkpointing 與平行化程式碼。但他後來回想起 functional language 訓練，發現可以抽出一個 map/produce abstraction——上層是應用邏輯，下層是 reliability 機制，全公司都能用。這個 thought experiment 變成 MapReduce。

### Section 13：AI 建構 AI 的時代——Alpha Evolve、AlphaChip、模型自我改進（42:00 ~ 47:00）

Garry 提到 Google 現在有 AlphaChip（設計晶片）、Alpha Evolve（提出解、評估、保留有效方案）。Jeff 認為這是**「AI 自動做科學方法」的黎明**：

> 「The foundation of the scientific method is you propose an experiment, you implement what you need to run the experiment, and you evaluate the experiment, and then you get results.」

未來的典範是：**高階目標 → 拆解成子問題 → 每個子問題跑自動化 loop 探索最佳解 → orchestration 框架把子問題解組合回高階解**。

關鍵瓶頸是**evaluator 的速度**。Jeff 舉了一個量子化學案例：原本用 density functional theory 模擬一個分子要**一整晚**。他的同事用神經網路近似 simulator——結果**快 300,000 倍**且幾乎同樣準確。這讓「一頓午餐篩選 1000 萬個分子」變得可行。

Jeff 直接點名 ML 本身就是最大應用場景：

> 「Can we have a model that is able to recursively self improve itself by running lots of experiments?」

### Section 14：被拒絕的經典——Distillation 論文（47:00 ~ 50:00）

Garry 轉到失敗的故事。2014 年 Jeff、Geoff Hinton、Oriol Vinyals 寫了 distillation 論文——用大老師模型訓練小學生模型，達到便宜又高效的推論。這個方法現在是整個 industry 的標準技巧。

但這篇論文**被 NeurIPS 拒絕了**。評審寫道「unlikely to have significant impact」。

Jeff 不怪 program committee：

> 「The reviewer maybe didn't have the experience because maybe they're not thinking about large scale AI services.」

但他把論文放上 arXiv，社群讀、引用、使用。今天 Gemini 的 Flash 模型之所以在小尺寸下這麼強，就是把大型 Pro 模型蒸餾成小的。

Jeff 的教訓：「**即使被拒絕，keep going**。」

### Section 15：加入 frontier lab 還是創立 startup？（50:00 ~ 53:30）

Garry 問：「如果把 25 歲的 Jeff Dean 傳送到 2026 年，他會加入 frontier lab 還是創立公司？」

Jeff 不直接回答，而是給出**選擇標準**：

- 你要做的東西你真的在乎嗎？
- 跟喜歡的同事一起做？
- 做出來會讓世界變好嗎？

兩種路徑各有取捨：

- **大組織**：有結構、有各種厲害的同事、已經有影響力平台
- **小 startup**：有很大的風險，但可能「incredibly rewarding」

最終標準是：「**如果最佳結果發生，世界會變得明顯更好嗎？**」如果答案是「嗯，酷，但也就這樣」，那不值得花時間。

### Section 16：團隊組成與最後的問題清單（53:30 ~ 57:00）

Jeff 對團隊組成的建議：

- 找有互補技能的人
- 找**低 ego、能 team play**的人
- 你會跟這些人花很長時間，要找「delight being around」的人
- 把職涯當作累積**工具箱**——持續學新技術，因為你不知道未來會遇到什麼問題

最後 Garry 問：「你希望這房間的某個人未來做出像 MapReduce、TPU 一樣的東西，你希望他們做什麼？」Jeff 列出幾個方向：

1. **新型硬體**（呼應前面的 inference 硬體 + 不可靠 transistor 的 thought experiment）
2. **資料效率高很多的 ML 演算法**——目前模型看到 18 歲人類看過的 1000 倍資料還沒有全面勝過人類，能不能做更資料效率的、continuous learning 的系統？
3. **Multi-agent 互動**
4. **改善人類對話品質**——如何讓人更理性地對話、幫助人連結共同興趣的人？

結尾 Garry 說「That's all we have today」，全場掌聲。

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, speech-2.8-hd），約 9 分鐘
> 口播稿原文：transcripts/20260730_JeffDean_The1PercentRuleForBuildingInAI_口播稿.txt

- [opus X.X MB](../audio/20260730_JeffDean_The1PercentRuleForBuildingInAI_口播稿.opus)（Telegram 友善）
- [m4a X.X MB](../audio/20260730_JeffDean_The1PercentRuleForBuildingInAI_口播稿.m4a)（iOS 友善）
- [mp3 X.X MB](../audio/20260730_JeffDean_The1PercentRuleForBuildingInAI_口播稿.mp3)（通用格式）

## 關鍵概念定義

| 概念 | 說明 | 影片重點 |
|------|------|----------|
| **MapReduce** | Google 2004 年發表的分散式運算框架，把大規模資料處理抽象成 map + reduce 兩個步驟，由 Sanjay Ghemawat 與 Jeff Dean 共同設計 | Jeff 用「thought experiment」故事解釋其誕生——他們抽取出 functional language 的抽象，解決大規模平行 indexing 的 reliability 問題 |
| **BigTable** | Google 2006 年的分散式結構化儲存系統，奠基於 GFS + MapReduce 之上 | 訪談中只作背景帶過 |
| **TensorFlow** | Google 2015 年開源的 ML 框架，把 ML 計算抽象成資料流圖 | 訪談中只作背景帶過 |
| **TPU（Tensor Processing Unit）** | Google 自研的 ML 加速 ASIC，專為低精度密集線性代數設計 | 2013 年由 Jeff 領導 napkin math 推動，2015 年上線；對 Transformer 時代意外關鍵 |
| **Transformer 架構** | 2017 年 Google 發表的 attention-based 神經網路架構（論文 "Attention Is All You Need"） | Jeff 認為是「把 AI 壓縮問題做到極致」的具體實現 |
| **Gemini 系列模型** | Google DeepMind 的多模態基礎模型系列（含 Pro / Flash 等版本） | 影片背景技術之一，也是 Jeff 與 Hinton、Vinyals 等蒸餾論文的延伸應用 |
| **Distillation（知識蒸餾）** | 用大模型訓練小模型的技術，2014 年由 Jeff Dean、Geoff Hinton、Oriol Vinyals 共同發表 | 當年被 NeurIPS 拒絕，現為業界標準技術 |
| **Context Engineering** | 把模型所需的工具、檢索、記憶、歷史資訊整合進 prompt 的工程領域 | Jeff 認為這是 2026 年工程師人人可做、進入門檻最低的 AI 領域 |
| **Inference-Time Compute** | 在推論階段用額外計算做搜尋或多解評估的技術 | Jeff 認為這是讓長跑 agent 變可靠的關鍵 |
| **HBM（High Bandwidth Memory）** | 加速器上的高頻寬記憶體 | 與 on-chip memory、multiplier unit 之間的頻寬是 2026 年工程師必知數字 |
| **ECC Memory** | 帶錯誤更正碼的記憶體 | Jeff 用它比喻分散式系統的 redundancy：個別元件會錯，但更高層機制保護整體 |
| **Reed-Solomon Coding** | 經典的糾錯編碼，廣泛用於分散式儲存 | Jeff 把它視為分散式系統版的「multi-pathway signaling」 |
| **Apollo 11 / AlphaFold** | Google 同事做的蛋白質結構預測模型，是 niche 特化模型的典範 | 訪談中被列為「model 0% 會的事的好選擇」 |
| **AlphaChip** | Google 內部用 ML 設計晶片布局的系統 | 與 Alpha Evolve 並列為「AI 建構 AI」的代表 |
| **Alpha Evolve** | Google 內部系統，能提出解、評估、保留有效方案 | 影片中作為「自我改進自動化 loop」的例子 |
| **density functional theory (DFT)** | 量子化學中計算分子性質的標準方法 | 影片中作為「evaluator」案例，原本算一個分子要一晚 |
| **Picodruel** | Jeff 提出的能量單位（口誤，原意 picojoule 級），用於能量 vs 計算的比較 | 計算花 1 picodruel，搬移資料花 1,000x |
| **Reed-Muller Code / neuromorphic computing** | 受生物神經啟發的運算範式 | Jeff 比喻「不可靠 transistor + multi-pathway signal」類似人腦 |

## 重要引用

> **「You're going to see more and more high performance and low energy inference hardware systems. Because everyone is now realizing that inference is the key to making these agent-based systems be available to more and more people.」**
> —— Jeff Dean，談 2026 年的「it fits the memory moment」是 inference 硬體特化

> **「Imagine what you could do with something where the latency is 50x better.」**
> —— Jeff Dean，描述未來 inference 硬體的應用場景

> **「You can get them to run for days or weeks and do really, really complicated tasks.」**
> —— Jeff Dean，談現有 agent 系統可以連續跑幾天到幾週來解決複雜問題

> **「We built a general purpose linear algebra system, which is what a TPU is really. Because we knew ML algorithms were still evolving, and you didn't want to over-specialize.」**
> —— Jeff Dean，解釋 TPU 為什麼刻意不做太特化，反而在 Transformer 時代意外關鍵

> **「Doing a calculation of math costs about one picodruel. But moving the data and doing data I/O costs 1,000 times that.」**
> —— Jeff Dean，談為什麼 batching 是系統問題不是模型問題

> **「The whole process of AI is a big compression problem. Because in order to have the data to be fully lossy and compress it and then restore it, you basically need to understand it.」**
> —— Jeff Dean 引述 colleagues 的金句，呼應 Transformer 架構的意義

> **「The model is really only one piece of what you're trying to do... This is the whole orchestration of complex agent and multi-agent systems that is going to be more and more important.」**
> —— Jeff Dean，談 context engineering 為何重要

> **「Look for something where the model succeeds zero percent or one percent at a time, not 20%.」**
> —— Jeff Dean，給未來創辦人選擇領域的硬標準

> **「The clearer you are on what it is you want, the more the agent will have guidelines and rules of an outline of what it is trying to accomplish.」**
> —— Jeff Dean，談為什麼 spec 寫好才能 scale agent

> **「I think it's really having incredibly good taste in what you ask your agents to work on.」**
> —— Jeff Dean，談 AI 時代的稀缺技能是 taste

> **「Sometimes it's good to not take as a given things that most people seem to take as a given.」**
> —— Jeff Dean，談瘋狂 thought experiment 的價值

> **「Even if you get rejected, keep going.」**
> —— Jeff Dean，從 2014 年 distillation 論文被拒的教訓

> **「If I work on this problem and the best possible outcome happens, will the world be a lot better in some way?」**
> —— Jeff Dean，給未來創辦人的選擇標準

> **「Adding more tools makes it more likely that the problems you encounter in the future will be solvable by you.」**
> —— Jeff Dean，談為什麼工程師要持續累積工具箱

## 人物與角色分析

### Jeff Dean（Google Chief Scientist）

Jeff Dean 在 1999 年加入 Google——當時還是 20 人的 startup。他是當代對「分散式系統 × 機器學習」交叉領域影響力最大的工程師之一，MapReduce、BigTable、TensorFlow、TPU、Gemini 都與他有關。影片中他展現三個身份：

1. **系統架構師**——用 napkin math 推導出 2001 年把搜尋索引搬到 RAM、2013 年催生 TPU 等關鍵設計決策
2. **研究領導者**——倡導 AI 自我改進、niche 特化模型、context engineering
3. **創業導師**——給未來創辦人選擇領域、組團隊、寫 spec 的具體建議

他對「未來想做出 next big thing 的人」的最核心建議是：**選對問題、taste 從經驗累積、敢於挑戰既有假設、即使被拒絕也 keep going**。

### Sanjay Ghemawat（Jeff 的長期合作者）

Sanjay 是 Jeff 在 Google 內部最親密的合作夥伴，兩人共同撰寫了 MapReduce、BigTable、TensorFlow 等經典論文。影片中 Sanjay 出現的場景：

- 2001 年一起把搜尋索引從硬碟搬到 RAM
- 共同寫 Performance Hints 文件
- 兩人合作寫 self-improving benchmark skill

Jeff 多次提到「Sanjay and I」，這對搭檔在 Google 內部幾乎等同一個單位。

### Geoffrey Hinton（深度學習教父，Jeff Dean 的共同作者）

Hinton 是 2014 年 distillation 論文的共同作者，影片中以「被拒絕的共同作者」身份出現。Hinton 的影響力不需多言。

### Oriol Vinyals（Google DeepMind 研究 VP）

Vinyals 同樣是 2014 年 distillation 論文的共同作者，現在是 Google DeepMind VP。

### Garry Tan（主持人，Y Combinator CEO）

Garry 是 Y Combinator 現任 CEO，本場訪談的主持人。他的提問策略非常精準——從追溯 Jeff 的過往預言、從 2001 年的歷史切入、把 TPU 故事從「ship a custom chip」挖到設計哲學，最後逼出「taste 怎麼 build」這個抽象問題。

## 核心主旨總結

這場 57 分鐘訪談的核心訊息是：**在 AI 時代，傑出工程不是「寫出更好的模型」，而是「選對問題、設計好系統、讓 AI 自己加速」。**Jeff Dean 在影片中反覆回到三個主題：

1. **硬體特化是 AI 普及的瓶頸**——從 TPU 到 inference 專用晶片，1,000x 的 data movement 成本決定了什麼產品可能
2. **Context engineering 是進入 AI 時代的最低門檻**——任何人有 API 就能開始，而且這個能力比調模型參數更實用
3. **未來屬於「選對問題的人」**——agent 接管寫 code 後，taste 變成稀缺技能；找 0% 成功率的領域、別怕瘋狂 thought experiment、即使被拒絕也 keep going

從 2001 年的 RAM 時刻到 2026 年的 inference 時刻，Jeff 看到的歷史韻律是：**「當限制改變，誰先抓到這個改變誰就能重新定義整個產業」**——這就是他想傳給 6,000 位未來創辦人的「1% rule」。

## 金句摘錄

### 金句 1：「It seems pretty spot-on.」

Jeff 對一年前「AI = junior 工程師」預測的驗證，乾脆俐落。

### 金句 2：「You'll see a lot more automation of ML systems themselves.」

Jeff 的 2027 年預測核心——AI 自動改進 ML 系統的循環即將到來。

### 金句 3：「Imagine what you could do with something where the latency is 50x better.」

談 inference 硬體的未來時，Jeff 用這句話打開觀眾想像。

### 金句 4：「You can get them to run for days or weeks and do really, really complicated tasks.」

Jeff 揭示當前 agent 能力的隱藏真相——大部分人沒意識到長跑 agent 已經可能。

### 金句 5：「That's sort of why we built a general purpose linear algebra system. Because we knew ML algorithms were still evolving.」

TPU 為什麼不過度特化的設計哲學——這個「故意保留彈性」事後讓 TPU 成為 Transformer 時代的硬體基礎。

### 金句 6：「Doing a calculation of math costs about one picodruel. But moving the data costs 1,000 times that.」

Jeff 給 2026 年每位工程師必記的數字——也是 batching 為何存在的根本原因。

### 金句 7：「The whole process of AI is a big compression problem.」

Jeff 引述的 AI 本質定義——理解資料就是能極度壓縮它，Transformer 正是實踐。

### 金句 8：「Look for something where the model succeeds zero percent or one percent at a time, not 20%.」

Jeff 給未來創辦人的硬標準——選 0% 領域別選 20% 領域。

### 金句 9：「The clearer you are on what it is you want, the more the agent will have guidelines.」

寫好 spec 才能 scale 50-100 個 agents——這是 AI-native 創辦人的核心能力。

### 金句 10：「It's really having incredibly good taste in what you ask your agents to work on.」

當 agents 接管寫 code，taste 變成稀缺技能。

### 金句 11：「Sometimes it's good to not take as a given things that most people seem to take as a given.」

瘋狂 thought experiment 的方法論——挑戰 60 年來半導體業界的「同樣晶片該完全一樣」假設。

### 金句 12：「Even if you get rejected, keep going.」

從 2014 年 distillation 論文被拒的教訓，給所有正在被拒的未來創辦人。

### 金句 13：「If the best possible outcome happens, will the world be a lot better in some way?」

Jeff 給所有選擇創辦議題的人的終極提問。

### 金句 14：「Adding more tools makes it more likely that the problems you encounter in the future will be solvable by you.」

為什麼工程師要把職涯當作工具箱累積——這也是長期主義的工程觀。

## 延伸閱讀

1. [Jeff Dean 的 Latency Numbers Every Programmer Should Know](https://gist.github.com/jboner/2841832) — 經典的工程師必記數字表，影片中提到要更新為 AI 版
2. [Distill Knowledge 論文 (Hinton, Vinyals, Dean, 2014)](https://arxiv.org/abs/1503.02531) — 被 NeurIPS 拒絕的經典，現為業界標準
3. [MapReduce 論文 (Dean, Ghemawat, 2004)](https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/) — Google 分散式運算的起點
4. [Google TPU 介紹](https://cloud.google.com/tpu/docs/intro-to-tpu) — TPU 架構與演進史
5. [Gemini 模型系列](https://deepmind.google/technologies/gemini/) — Google DeepMind 當前旗艦模型
6. [Attention Is All You Need (Vaswani et al., 2017)](https://arxiv.org/abs/1706.03762) — Transformer 原始論文
7. [AlphaFold 介紹](https://deepmind.google/technologies/alphafold/) — 影片中提到的 niche 模型成功案例
8. [Performance Hints（Jeff Dean 與 Sanjay 撰寫的 30 頁文件）] — 在影片中被提到，社群已開始拿來增強模型的程式碼效能 reasoning 能力
9. [Reed-Solomon Coding 介紹](https://en.wikipedia.org/wiki/Reed%E2%80%93Solomon_error_correction) — Jeff 用來比喻分散式系統 redundancy 的經典編碼
10. [density functional theory (DFT)](https://en.wikipedia.org/wiki/Density_functional_theory) — 影片中作為「evaluator 速度」案例的量子化學標準方法
