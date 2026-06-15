# 【Yann LeCun: World Models 將開啟下一場 AI 革命 — 從 LLMs 的死路到 AMILabs】

**主講｜Yann LeCun / 紐約大學教授、Meta 首席 AI 科學家（已離任）、Turing 獎得主 / ETH Zürich "Frontiers of Embodied AI" / 2026 年**

> 本影片使用 Whisper **medium** 模型聽寫英文，language=en，588 segments、51,573 字。  
> 影片時長 58 分 54 秒，演講約 50 分鐘、Q&A 約 8 分鐘。
>
> **重大訊息**：LeCun 已離開 Meta 創立新公司 **AMILabs**（Advanced Machine Intelligence Labs），專注「AI for the real world / physical AI」。

---

## 一、主題與背景

本影片是 Yann LeCun 在 ETH Zürich「Frontiers of Embodied AI」研討會的專題演講，主題為 **「World Models: Enabling the next AI revolution」**。LeCun 為深度學習三大巨頭之一（與 Geoffrey Hinton、Yoshua Bengio 同列 2018 Turing 獎得主），捲積網路發明人之一，長期擔任 Meta 首席 AI 科學家與 FAIR 負責人。

演講核心論點：
- **LLM 已到盡頭**：單純的語言模型無法通往真正的 AI 智能
- **世界模型（World Models）才是下一場革命的關鍵**：人類與動物能在少量樣本中學會複雜任務，正是因為內化了世界的物理模型
- **JEPA 架構**：Joint Embedding Predictive Architecture —— LeCun 提出的下一代自監督學習架構
- **能源模型（Energy-Based Models）**：表達變量間相依性的統一框架
- **AMILabs 新章節**：離開 Meta，創立專注 physical AI 的新公司

節目 META 命題：**2026 年的 AI 研究不應再以 LLM 為中心，而應轉向「能內化世界物理模型」的代理系統**——這條路徑從 LeCun 2022 年的「A Path Towards Autonomous Machine Intelligence」白皮書開始，如今以 AMILabs 為機構化載體全面推進。

---

## 二、章節脈絡

### Section 1｜開場挑釁：「Machine learning sucks」（00:00 ~ 06:09）

**重點摘要：** LeCun 開門見山宣告當代機器學習的局限——無法處理真實世界的高維度、連續、雜訊數據；引用 Moravec paradox 與 Piaget 的「智慧定義」指出 AI 必須 grounding。

**內容：**
- **Moravec paradox**：對人類簡單、對電腦難（空間推理、動作規劃）vs 對人類困難、對電腦簡單（棋、符號積分、證明定理）
- **案例對比**：
  - 10 歲小孩就能操作家事機器人
  - 青少年 20 小時學會開車
  - 自駕車公司要數百萬小時訓練 + L4/L5 都還沒達標
- **Piaget 智慧定義**（apocryphal，Piaget 本人未說過，但被廣為引用）：
  - 「Intelligence is not what you know, it's what you do when you don't know」
  - 智慧 = 快速適應新任務的能力
  - LLMs 是 declarative knowledge 累積器，**不是**智慧本身
- **AGI 是 nonsense**：人類智慧是「特化的、適應性的」
  - 沒有單一 intelligence 衡量
  - 不同人因環境不同而會不同的事
- **呼應 Bleden（？）先前演講**：「AGI 概念本身就是 nonsense」

> 「I have news for you. Machine learning sucks.」 — Yann LeCun

### Section 2｜嬰兒如何學會物理？（06:09 ~ 10:00）

**重點摘要：** LeCun 用嬰兒發展心理學的實驗展示人類如何從被動觀察中建構「世界模型」——這正是 AI 缺少的關鍵能力。

**內容：**
- **2 個月大嬰兒**：能 gesticulate、發展自我肢體的動態模型，但無法影響世界
- **3D 世界感知**：嬰兒從頭部移動 → 視角變化 → 推論世界是 3D 的
  - 機器學習今天**也能**做到（從 video 學習 3D 表徵）
- **物件永久性（object permanence）**：早期嬰兒即學會
- **重力、慣性**：9 個月大才學會
  - 經典實驗：8-9 個月嬰兒把玩具從高腳椅丟下 = 系統性驗證「重力適用於所有物體」
  - **Violation of expectation**：心理學家用「物體漂浮」場景測試嬰兒是否已學會重力（6 個月不在意，10 個月大驚訝）
  - **可應用於 AI**：用同樣方法測試 ML 系統是否有 common sense

> 「Intelligence is not an accumulation of declarative knowledge. LLMs are an accumulation of declarative knowledge, not just, but the main reason they're useful is because they can accumulate a lot of declarative knowledge.」

### Section 3｜AI 架構：System 1 vs System 2（10:00 ~ 16:00）

**重點摘要：** LeCun 提出 AI 必須從「被動前向傳播」（System 1）升級為「規劃 + 推理」（System 2）—— 後者需要內部 world model + 推理 by optimization。

**內容：**
- **System 1（被動）**：感知 → 動作，無內部模型
  - 對應：當代深度學習 + RL
- **System 2（主動）**：感知 → 內部模型 → 規劃動作序列 → 優化目標
  - 對應：人類推理、規劃
- **關鍵差異**：System 2 需要 **world model** 預測動作結果
- **Energy-based 統一框架**：
  - 推理 = energy minimization
  - 學習 = good energy function
- **2022 年白皮書**：LeCun 已在 "A Path Towards Autonomous Machine Intelligence" 提出完整架構
- **架構 6 模組**：
  - 感知（perception）
  - 世界模型（world model）
  - 動作規劃（actor）
  - 任務目標（cost function）
  - 短期記憶（configurator）
  - 推理器（reasoner）

> 「Reasoning and planning are essential. And they basically proceed by energy minimization rather than forward propagation.」

### Section 4｜JEPA：Joint Embedding Predictive Architecture（16:00 ~ 30:00）

**重點摘要：** LeCun 介紹 JEPA —— 不是預測像素（像 generative models），而是預測潛在空間中的抽象表徵；這避免了 generative models 的固有缺陷。

**內容：**
- **Generative models 的根本問題**：
  - 預測像素 = 在高維空間做 prediction
  - 不可行：世界充滿不確定性，pixel-level prediction 永遠不準
  - LLM 之所以能 work 是因為語言是 discrete、低維、人類已經做了抽象
- **JEPA 核心思想**：
  - 不預測 x（raw signal）
  - 預測 y = Encoder(x) 的 latent representation
  - Loss 只在 latent space 計算
- **為何這更可行**：
  - 抽象層級的 prediction 比 pixel-level 更可學習
  - 可以忽略不確定的細節（背景、光線）
  - 學到的是「概念」而非「像素」
- **兩個 JEPA 變體**：
  - **V-JEPA**（vision）：影像的自監督學習，V-JEPA 2 已發表
  - **I-JEPA**（image，跟 V 同源但不同）
- **應用**：
  - 視覺理解
  - 動作規劃
  - 具身 AI

> 「If you want to predict something in the world, don't predict the pixels. Predict the abstract representation.」

### Section 5｜自監督學習的測度難題（30:00 ~ 35:00）

**重點摘要：** JEPA 訓練需要「資訊含量的可微測度」，但資訊理論本身缺乏這樣的工具；LeCun 用 energy-based models 繞過此難題。

**內容：**
- **問題**：如何測量 latent representation 的資訊含量？
  - 沒有 ground truth distribution
  - 只有 encoder 輸出的 samples
  - 經驗測度都是 upper bounds
  - 我們需要 lower bound 才能 maximize
- **Energy-based models（EBMs）作為統一框架**：
  - 20 年來 LeCun 一直在倡導
  - 基本思想：學一個 energy function F(x, y)，低能量表示 compatible
  - 給定 x，可找出 minimize F 的 y
  - **推理 = 優化**（不是 forward propagation）
- **連續變量的能量景觀**：
  - 數據點在 valley
  - 偏離資料分布 = 高能量
  - 推理 = 找到最低能量

> 「If you want to capture the dependency between two variables X and Y, there is no real functional relationship. It's a relation, some kind of mapping, but not a function. ... learn or build a contrast function, energy function, that tells you a point in this X-Y space is near the training data or not.」

### Section 6｜V-JEPA 2 與具身 AI 應用（35:00 ~ 50:00）

**重點摘要：** V-JEPA 2 展示了 video-level 的世界模型能力，可預測「物體在虛擬環境中的運動軌跡」；DINO 自監督 encoder 成為最佳視覺特徵提取器。

**內容：**
- **V-JEPA 2 的突破**：
  - 在 video 上自監督學習
  - 可作為 world model 預測「未來 video 段」
  - 對具身 AI（機器人、自動駕駛）有直接應用
- **DINO encoder**（Meta Paris 同事開發）：
  - 完全自監督
  - 用 distillation + 多種 tricks
  - **目前 image 任務的最佳通用 encoder**
  - Yann：「if you have any type of vision task you want to do, that's probably the best technique」
- **世界模型 + 規劃的 demo**：
  - 在模擬環境中
  - 用 DINO encoder + JEPA world model
  - 透過 optimization 找最佳動作序列
- **Q&A 議題：MPC（Model Predictive Control）與 constraints**：
  - 工程師想「在 representation space 寫 constraints（不要撞牆）」
  - LeCun 答：constraints 不能直接寫進 representation，需要學一個 small projector
  - 每個 constraint 需對應一個小 head

> 「Those systems basically at this time produce the best generic representations of images.」

### Section 7｜結語：放棄生成模型、放棄 RL、不要做 LLMs（55:00 ~ 結束）

**重點摘要：** LeCun 提出 4 個「放棄」宣言 + 創立 AMILabs，正式宣告下一階段研究方向。

**內容：**
- **LeCun 的 4 個宣言**：
  1. **放棄 generative models**（改用 joint embedding architectures）
  2. **放棄機率模型**（改用 energy-based models 處理依賴性）
  3. **放棄 RL**（不是真放棄，是最小化使用——它 sample efficiency 太差）
  4. **不要做 LLMs**（如果你想做 physical AI / grounded AI）
- **為什麼 LLMs 不夠**：
  - 對 continuous、high-dimensional、noisy data 完全無用
  - 物理世界、機器人、工業控制都不是 LLM 能處理的
- **AMILabs（Advanced Machine Intelligence Labs）**：
  - LeCun 在 2025 年底離開 Meta
  - 創立新公司，專注「AI for the real world / physical AI」
  - 機器人是 use case，但不限於機器人
  - 涵蓋：工業製程控制、自駕、機器人、所有「高維、連續、雜訊」的領域
- **結語：「Don't work on LLMs」**：
  - 「If you're interested in making real progress in AI in grounded AI for the real world, if you want physical AI, don't work on LLMs. Don't work on generative models either.」
  - 「As you can probably guess, this does not make me very popular in Silicon Valley.」

> 「Once you have good representations, you can use RL on top of it because you already have the good representations. You won't require too many samples.」

---

## 三、關鍵概念定義

| 概念 | 定義 | 應用領域 |
|------|------|---------|
| **Moravec paradox** | 對人類簡單的任務（空間推理）對電腦難，反之亦然 | AI 哲學 |
| **World Model** | 代理對環境動力學的內部模擬，能預測動作結果 | 具身 AI、RL |
| **System 1 vs System 2** | System 1 = 被動反應；System 2 = 規劃推理 | 認知科學 |
| **JEPA（Joint Embedding Predictive Architecture）** | 在 latent space 預測抽象表徵而非 pixel | 自監督學習 |
| **V-JEPA 2** | JEPA 在 video 上的實作，Meta 2024-2025 發表 | video 自監督 |
| **Energy-Based Model（EBM）** | 用 energy function F(x, y) 表達變量相依性 | 統一 ML 框架 |
| **Energy Minimization** | 推理 = minimize F，找 compatible 的 latent | LeCun 統一觀 |
| **Violation of Expectation** | 心理學家用「物理不可能場景」測試嬰兒概念習得 | AI 常識評估 |
| **Generative Model** | 預測 raw output（pixel、token）的模型 | LLM、diffusion |
| **Joint Embedding** | 編碼器把 x, y 都映到 latent space，計算相似度 | 表徵學習 |
| **MPC（Model Predictive Control）** | 控制理論中「用模型預測未來並優化」的技術 | 機器人 |
| **AMILabs** | Advanced Machine Intelligence Labs，LeCun 離開 Meta 後創立 | LeCun 新公司 |
| **Piaget 智慧定義** | 「智慧不是你知道什麼，是不知道時做什麼」（apocryphal） | 認知科學 |
| **Configurator** | LeCun 架構中的短期記憶模組，控制其他模組的行為 | 具身 AI 架構 |
| **Reasoner** | LeCun 架構中的推理器，透過 energy minimization 工作 | 具身 AI 架構 |

---

## 四、人物 / 角色分析

### Yann LeCun（講者）
- **背景**：紐約大學教授、Meta 首席 AI 科學家（已離任）、FAIR 創辦人、2018 Turing 獎、捲積神經網路共同發明人
- **關鍵研究**：JEPA 系列、Energy-Based Models、World Models
- **代表立場**：「Don't work on LLMs」「Abandon generative models」「Abandon RL」
- **新角色**：AMILabs 創辦人，physical AI 路線

### Jean Piaget
- **背景**：瑞士發展心理學家（LeCun 在 ETH 致敬同鄉）
- **關鍵轉折**：與 Chomsky 1970s 爭論「語言是先天的還是後天的」
- **代表觀點**：「智慧是適應環境的能力」（被引用為 LeCun 的智慧定義）

### Seymour Papert
- **背景**：MIT 教授，Logo 語言發明人
- **關鍵轉折**：早期曾寫書批評神經網路，後改為支持 ML
- **代表觀點**：「Learning is possible, contrary to what Chomsky was saying」

### Vladimir（Vladlin / Vladlen）
- **背景**：ETH 教授（演講中提到）
- **角色**：主辦方致詞代表，引出 LeCun 演講

### Jitendra（Malik）
- **背景**：UC Berkeley 教授，computer vision 大師
- **角色**：與 LeCun 合作研究

### Emmanuel Dupoux
- **背景**：LeCun 合作者
- **角色**：與 LeCun、Jitendra 合作 paper 的主要作者

### Simon Shelley（？）
- **背景**：NYU 神經科學家
- **角色**：MNCR squared 概念來源

---

## 五、核心主旨

> **2026 年 AI 研究的根本轉向：LLM 與 generative models 對物理世界（continuous、high-dimensional、noisy）束手無策；真正能解鎖下一場 AI 革命的，是具備「世界模型」（World Model）的具身 AI 系統——透過 JEPA 在 latent space 學習抽象表徵、用 energy-based models 統一推理框架、用「放棄 RL、放棄生成模型、放棄 LLMs」的紀律，LeCun 在離開 Meta 創立 AMILabs 後，將這條路線推進到機構化階段。Jean Piaget 的智慧定義（「不知道時做什麼」）與 Moravec paradox 是這個轉向的哲學基礎——智慧不是 declarative knowledge 的累積，而是對世界物理模型的快速適應。**

---

## 六、金句摘錄

1. 「I have news for you. Machine learning sucks.」

2. 「The Moravec paradox: things that are simple are difficult for computers, and things that are complicated for humans turn out to not be that difficult for computers.」

3. 「Intelligence is not an accumulation of declarative knowledge. LLMs are an accumulation of declarative knowledge, not just, but the main reason they're useful is because they can accumulate a lot of declarative knowledge.」

4. 「Intelligence is the ability to learn to drive in about 20 hours, or to learn any new task with very little training, or accomplish new tasks or a shot.」

5. 「Reasoning and planning are essential. And they basically proceed by energy minimization rather than forward propagation.」

6. 「If you want to predict something in the world, don't predict the pixels. Predict the abstract representation.」

7. 「If you want to capture the dependency between two variables X and Y, there is no real functional relationship. It's a relation, some kind of mapping, but not a function. ... learn or build a contrast function, energy function, that tells you a point in this X-Y space is near the training data or not.」

8. 「Abandoned generative model in favor of joint emitting architectures. If you are interested in intelligence, abandoned probabilistic models in favor of those energy-based models.」

9. 「I've been saying forever to abandon reinforcement learning. I don't really mean abandon. I mean minimize its use because it's so horribly inefficient in terms of sample efficiency.」

10. 「If you're interested in making real progress in AI in grounded AI for the real world, if you want physical AI, don't work on LLMs. Don't work on generative models either. As you can probably guess, this does not make me very popular in Silicon Valley.」

---

## 七、延伸閱讀 / 參考

- **LeCun 2022 白皮書**：
  - *A Path Towards Autonomous Machine Intelligence* (OpenReview 2022)
  - https://openreview.net/pdf?id=BZ5a1r-kVsf
- **JEPA 系列**：
  - V-JEPA: *Self-Supervised Learning from Video with Joint Embedding Predictive Architecture* (Meta 2024)
  - V-JEPA 2: *Self-Supervised Video World Model* (Meta 2025)
  - I-JEPA: *Self-Supervised Learning from Images with a Joint-Embedding Predictive Architecture* (Meta 2023)
- **Energy-Based Models**：
  - LeCun et al., *A Tutorial on Energy-Based Learning* (2006)
  - *Structured Prediction Energy Networks* (Belanger & McCallum 2016)
- **具身 AI 與世界模型**：
  - Ha & Schmidhuber, *World Models* (2018)
  - Pathak et al., *Curiosity-driven Exploration* (ICM, 2017)
  - Dreamer 系列（Hafner et al.）
- **嬰兒認知發展**：
  - Baillargeon et al., *Violation-of-Expectation* paradigm
  - Spelke, *Core Knowledge and Cognitive Development*
- **LeCun 新公司**：
  - AMILabs (Advanced Machine Intelligence Labs) — 2025 年底成立
  - https://amilabs.ai（待確認）
- **辯論與反方觀點**：
  - Noam Brown 對 self-play 在 LLM 上的辯論（見 YC Paper Club 筆記）
  - 對 LLM 路徑的支持者：Yann Dubois、Hyung Won Chung 等

---

## 🎙️ 音檔導覽（語音版）

由 MiniMax TTS 語音合成，**xiaotian_clone_v1** 參考聲 + 簡體中文（speech-2.8-hd 對簡體效果最佳）。

> 音檔長度：4 分 26 秒（266s）· 靜音比例 8.57% · 推論：MiniMax T2A v2 + speech-2.8-hd + speed=1.0 + emotion=neutral

- [opus 3.2MB](../audio/20260615_YannLeCun_WorldModels與AMILabs.opus)（Telegram 友善）
- [m4a 4.2MB](../audio/20260615_YannLeCun_WorldModels與AMILabs.m4a)（iOS 友善）
- [mp3 4.1MB](../audio/20260615_YannLeCun_WorldModels與AMILabs.mp3)（通用格式）
- [口播稿原文](../transcripts/20260615_YannLeCun_WorldModels與AMILabs_口播稿.txt)（繁中）
