# 【Z.AI 與中國開源時刻：GLM 5.2、Anthropic 切斷風暴、企業 AI 採用新座標】

**主講｜CNBC 主持人 + Gabe Pereyra（Harvey 共同創辦人，前 DeepMind 與 Meta 研究科學家）+ Aaron Pressman（CNBC 科技記者，open source 長期觀察者）+ Stacy Rasgot（Bernstein 半導體分析師）/ 2026 年 6 月 27 日**

> **影片來源**：https://youtu.be/wDf1IR8yP9s
> **影片長度**：52:19（3139 秒）
> **語言**：英文（自動字幕）

---

## 一、主題與背景

- **類型**：CNBC 商業訪談節目（panel 對談 + 第二段半導體分析）
- **核心議題**：以中國 Z.AI（智譜 AI）推出的 GLM 5.2 為切入點，探討「中國開源模型 vs 美國閉源模型」的新格局、Anthropic 切斷第三方存取的爭議，以及企業 AI 採用從「最強模型」轉向「每美元智能」的典範轉移。
- **節目分段**：
  - 0:00–35:50：Z.AI 與企業 AI 採用（主持人 + Gabe + Aaron）
  - 35:50–52:19：自研晶片與半導體超級循環（主持人 + Stacy Rasgot）
- **關鍵背景**：影片開頭引用 OpenRouter（AI 模型路由平台）的 token 流量數據——GLM 5.2 發布後的採用速度，比 4 月 DeepSeek V4 發布時還快，被視為「中國開源時刻第二波」。

---

## 二、章節脈絡

### Section 1｜Z.AI 與 GLM 5.2 的矽谷震撼（00:00 ~ 04:00）

**重點摘要：** 影片開場由 CNBC 主持人揭示核心張力——GLM 5.2 從中國空降矽谷，benchmark 距離 Claude Opus 4.8 只有一個百分點，但成本只要五分之一。矽谷的反應不再是「哪個模型最強」，而是「每美元能買到多少智能」。

**內容：**
- OpenRouter（AI 模型路由器）的 token 流量顯示：GLM 5.2 採用速度比今年 4 月 DeepSeek V4 發布時還快
- DeepSeek 時刻的特徵是「美股兆美元拋售」；GLM 5.2 時刻則更像是「結構性板塊位移」
- 智譜 GLM 5.2 benchmark 與 Claude Opus 4.8（Anthropic）差距只剩 1 個百分點，但價格只有五分之一
- Harvey（AI 法律平台）、Cognition、Cursor 等企業應用已開始跑大量推理任務
- 主持人提出的新座標：AI 的新 metric 不是「最強模型」而是「intelligence per dollar」

> 「The new metric in AI, it is intelligence per dollar. Models that are capable enough for real work.」

### Section 2｜Gabe Pereyra 觀點：便宜、夠用、可重複呼叫（04:00 ~ 09:30）

**重點摘要：** Harvey 共同創辦人 Gabe Pereyra（前 DeepMind、Meta 研究科學人）認為 GLM 5.2 是第一個真正跟 Opus 4.7 競爭的開源模型；企業部署的關鍵不是「最強」，而是「足夠聰明、能反覆呼叫、每個 token 便宜」。

**內容：**
- Gabe 觀察到 GLM 5.2 是第一個真正與 Opus 4.7 競爭的開源模型
- 對企業而言，「agent 跑一百萬次」的總成本遠比「單次問答最聰明」更重要
- 不同任務需要不同智能等級：合約審閱 vs. 簡易分類 → 不必所有任務都用 Frontier 模型
- Harvey 客戶同時要求使用美國模型（Mistral、Mistral 等）與中國開源模型，產品已做模型無關化（model agnostic）
- Gabe：對 Harvey 而言「完美的策略」是：永遠保持一個接近 frontier 等級的開源模型

> 「For every dollar of intelligence. And so as these models get smarter, do you need the smartest model reviewing your contracts or doing simple tasks?」

### Section 3｜Aaron 觀點：3-6 個月差距可接受、企業架構正在位移（09:30 ~ 14:30）

**重點摘要：** CNBC 科技記者 Aaron Pressman 認為 GLM 5.2 證明了中國與美國 frontier 模型的差距仍維持在 3 至 6 個月；只要這個差距存在，企業就能安心用開源模型做主流工作負載，把 frontier 留給真正需要最高智能的場景。

**內容：**
- Aaron 同意 Gabe 的判斷：3 至 6 個月的差距對企業是可接受的
- 若差距是 2-3 年，企業就絕對不會採用開源模型；3-6 個月差距則剛好
- 企業架構正在位移：不再「自己訓練模型」，而是「在多模型間路由」
- Aaron：「整個 AI 的架構正在被改變」——Harvey、Box、Factory、Cognition 等企業應用都將接受多模型輸入
- 企業部署的隱憂：需要各垂直領域專屬的開源模型（不只一個 GLM 5.2 就夠）

> 「You don't need open weights to be at the exact same frontier... Uh and then you know that gets to the second part which is now you can route tasks.」

### Section 4｜訓練資料所有權與 Frontier Labs 的市場結構（14:30 ~ 21:00）

**重點摘要：** Aaron 與 Gabe 進一步討論：開源模型時代的訓練資料從哪來？律師事務所等垂直領域的專家回饋如何變成下一輪 AI 的養分？以及 Frontier Labs（OpenAI、Anthropic、Google）是否會因此被市場結構弱化？

**內容：**
- 訓練資料將大量來自企業客戶的回饋：律所、私募基金等的回饋將成為下一代 AI 的訓練素材
- Gabe：Harvey 客戶的工作成果（合約分析、盡職調查）不會回流給模型訓練方——資料所有權留在客戶手中
- Aaron 提出一個有意思的市場結構問題：Frontier Labs 的市場是否會被開源弱化？
  - 答案可能不是「取代」而是「分層」：便宜模型做大量常規任務，frontier 模型做少量高智能任務
  - 但「token 消耗量十年後可能會是現在的一千倍」，因此 frontier 智慧仍有剛性需求
- 兩人都觀察到：Google Gemini 曾經訓練過開源模型，但 benchmark 上沒出現——為什麼美國大廠不更積極搶這個地盤？
- Cursor 等產品的「秘密醬汁」其實跑在中國開源模型之上

> 「We might spend the same amount of money on AI as we do today, but most of it will go to non-frontier intelligence. Those will actually cost five or 10 times as much.」

### Section 5｜Anthropic 切斷 Fable Mythos 事件與 AI 地緣政治（21:00 ~ 25:30）

**重點摘要：** 主持人將話題轉向近期爭議事件：Anthropic 切斷第三方應用 Fable Mythos 的 API 存取。Aaron 認為這個動作被「誤判」（misplayed），因為它樹立了一個危險的先例——當一個主權國家對美國 AI 設限時，美國自己也在對客戶設限。

**內容：**
- Anthropic 切斷 Fable Mythos（其最大客戶之一）的 API 存取，引發業界軒然大波
- Aaron：這不是商業問題，而是**地緣政治問題**——Anthropic 證明了「美國政府可以對 AI 模型設出口管制」，那別國也可以對自己的 AI 設限
- 先例已經建立：當出口管制被視為「地緣政治武器」，其他國家就會被迫發展自己的模型
- 美國應該「把開源做得越來越好」作為對沖策略，至少當地緣風險發生時還有選項
- Aaron 把 AI 出口管制類比為「核武管制」——這是一個全新的政策討論空間

> 「At a minimum as a hedge, you know, maybe you still do as much work as you can... AI could be treated as another kind of geopolitical or economic kind of weapon.」

### Section 6｜蒸餾（Distillation）：抄襲還是學習？（25:30 ~ 29:30）

**重點摘要：** Gabe 與 Aaron 對「蒸餾」（用 frontier 模型的輸出訓練小模型）有不同評估。Gabe 認為這不是中國追上美國的核心原因，中國實驗室本身就有頂尖人才；Aaron 則認為不該對蒸餾過度恐慌，因為「所有模型都建立在別人的資訊之上」。

**內容：**
- 蒸餾（distillation）= 用大模型輸出訓練小模型，讓小模型行為類似大模型
- Gabe：蒸餾只是一種方法，中國實驗室的真正實力來自頂尖人才，不是蒸餾
- Aaron 認為 distill 是一場「貓抓老鼠遊戲」，但「所有模型的訓練都建立在別人的資訊之上」，因此不該過度恐慌
- 晶片問題（chips）反而比蒸餾更 tractable——中國可以靠工程師解決晶片限制
- 結論：中國追上是結構性現象，不只是單一手段

> 「It's all within the same, you know, creation of information and knowledge. Um, and everything is sort of riding on on some other set of information.」

### Section 7｜Claude Tag 與「多人模式」AI（29:30 ~ 35:50）

**重點摘要：** 影片下半場由 Aaron 介紹 Claude Tag（Anthropic 推出的共享 AI 代理功能），這標誌著 AI 從「單人模式」（個人助理）轉向「多人模式」（組織內共享的 AI 實體）。這個轉變既是鎖定客戶的策略，也是 MCP 互通性下的新選擇。

**內容：**
- Claude Tag = Anthropic 推出的多人共享 AI 實體，可嵌入 Slack 等協作工具
- Aaron：「AI 從單人模式轉向多人模式」——不再只是個人助理，而是組織內的共享實體
- 多人群組共享 context 的 AI 更有意義：行銷資產、客戶資料、團隊記憶都可被統一存取
- 主持人提問：這是否是 Anthropic 新的鎖定（lockin）策略？
- Aaron 認為不一定——Claude Tag 可以插入 MCP server 連結其他代理系統，未必會形成封閉
- Harvey 等法律 AI 正在思考「如何把 agent 交給整個律所」而非只給個人

> 「It's a pretty big deal... we're very used to AI in kind of single player mode... and this is a kind of a multiplayer mode.」

### Section 8｜OpenAI 自研晶片與半導體超級循環（35:50 ~ 41:00）

**重點摘要：** 第二段由 Stacy Rasgot（Bernstein 半導體資深分析師）連線。主持人先提 OpenAI 九個月從零打造自家客製晶片、並用 AI 模型輔助設計的進展。Stacy 認為這在意料之中（晶片本來就是人類最複雜的設計），且對 Broadcom 等合作夥伴是大利多。

**內容：**
- OpenAI 在 9 個月內從零設計出客製 AI 晶片，且用 AI 輔助設計流程
- Broadcom 早在財報會議預告：2027 年將為 OpenAI 出貨 1.2-1.3 GW 等級的客製晶片
- Stacy：晶片設計週期本來就在縮短，OpenAI 9 個月並非完全史無前例，但「真的展示出一個能用的晶片」是第一次
- 關鍵指標：不是成本，而是 performance per watt、performance per dollar、total cost of ownership
- 業界資金規模已從億級跳到十億、百億級，超大型客戶真的願意為客製晶片付費

> 「Chips are the most complicated things that humanity has created.」

### Section 9｜GPU vs 客製晶片、ASIC、TPU 的競爭（41:00 ~ 46:30）

**重點摘要：** Stacy 認為 GPU vs ASIC / TPU 的討論雖然熱門，但實際上是「錯的問題」（wrong question）——產業需要的是「更多晶片」，所有贏家都會贏。同時他分析中國受晶片出口管制影響，被迫走 ASIC + 記憶體國產化路線。

**內容：**
- Stacy：「GPU vs TPU」的討論過度簡化——重點是 compute demand 全面成長，所有人都在買 GPU
- OpenAI 的 10 GW 訂單、Anthropic、Microsoft 都大量採購 Nvidia GPU
- Stacy 把半導體廠商分成三類：通用 GPU（Nvidia）、客製 ASIC（Broadcom、Marvell）、記憶體與設備（ASML、Applied Materials、光學元件）
- 中國受出口管制影響：被迫走 ASIC 路線、發展本土記憶體廠商、提升良率與封裝技術
- 中國的晶片供應在記憶體端可能面臨緊張，是 2026-2027 年的關鍵觀察點

> 「But they all are. BUT THEY'RE ALL BUYING A LOT OF GPUS, TOO.」

### Section 10｜超級循環、成本下行、AI 與晶片的雙螺旋（46:30 ~ 52:19）

**重點摘要：** 影片結尾探討半導體是否仍處於超級循環（super cycle）。Stacy 認為這是真正的「demand cycle」（非庫存週期或產品週期），AI 算力需求驅動一切。主持人 Stacy 補刀：成本下行就是半導體業的核心規律，過去 60 年來每兩年成本砍半，從來不是壞事。

**內容：**
- 半導體週期有四種：庫存週期、產品週期、socket 週期、demand 週期——現在是真正的 demand cycle
- 真正的問題不是「晶片廠商會不會賺錢」，而是「AI 應用端的 ROI 是否撐得住」
- 中國 DeepSeek 事件不是 blip（一時現象），而是成本下行的關鍵轉折
- 主持人 Stacy 收束：成本下降驅動採用、採用驅動成長——半導體過去 60 年的核心規律
- 「Socks index」隱喻：這幾年晶片股漲幅接近連衣裙指數（任何股票都漲），但未來將進入選股時代

> 「We need cost to come down. That's how you drive adoption. That's how you get growth.」

> 「GOT CUT IN HALF EVERY TWO YEARS FOR SIX DECADES. Was that a bad thing for semis? No.」

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone `xiaotian_clone_v1`，model `speech-2.8-hd`），約 5 分鐘
> 口播稿原文：transcripts/20260627_CNBC_ZAI_Chinese_OpenSourceMoment_口播稿.txt

- [opus](../audio/20260627_CNBC_ZAI_Chinese_OpenSourceMoment.opus)（Telegram 友善）
- [m4a](../audio/20260627_CNBC_ZAI_Chinese_OpenSourceMoment.m4a)（iOS 友善）
- [mp3](../audio/20260627_CNBC_ZAI_Chinese_OpenSourceMoment.mp3)（通用格式）

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處 |
|------|------|------|
| **Z.AI（智譜 AI）** | 中國開源 AI 實驗室，GLM 系列模型開發者 | Section 1 |
| **GLM 5.2** | Z.AI 2026 年發布的開源模型，benchmark 距 Opus 4.8 僅 1 個百分點，成本五分之一 | Section 1 |
| **Intelligence per dollar** | AI 領域新衡量指標：每美元能買到多少有效智能，而非「單次問答最強」 | Section 1 |
| **OpenRouter** | AI 模型路由器平台，提供 token 流量數據觀察模型採用速度 | Section 1 |
| **Frontier Labs** | OpenAI、Anthropic、Google 等開發最先進閉源模型的實驗室 | Section 3 |
| **Model Routing** | 企業 AI 架構新模式：根據任務特性在不同模型間動態切換 | Section 3 |
| **Frontier Gap** | 開源與閉源模型的智能差距，本片評估為 3-6 個月 | Section 3 |
| **Distillation（蒸餾）** | 用大模型輸出訓練小模型，讓小模型行為類似大模型 | Section 6 |
| **Fable Mythos** | 第三方 AI 應用，Anthropic 切斷其 API 存取引發爭議 | Section 5 |
| **MCP（Model Context Protocol）** | Anthropic 提出的協議，讓不同 AI 工具可互通 | Section 7 |
| **Single Player Mode / Multiplayer Mode** | AI 從「個人助理」演進到「組織共享實體」的比喻 | Section 7 |
| **Performance per watt / per dollar** | 晶片新衡量指標：每瓦、每美元的算力，而非絕對成本 | Section 8 |
| **ASIC / TPU** | 客製化晶片（ASIC）vs Google 的 TPU，都是 Nvidia GPU 之外的選擇 | Section 9 |
| **Demand Cycle** | 半導體超級循環類型之一，由 AI 算力需求驅動，非庫存或產品週期 | Section 10 |

---

## 四、人物分析

### Gabe Pereyra（Harvey 共同創辦人）

- **背景**：前 DeepMind 與 Meta 研究科學家，現為 Harvey（服務 Am Law 100 半數以上律所的 AI 法律平台）共同創辦人
- **關鍵轉折**：在 DeepMind / Meta 看到模型研發，在 Harvey 看到企業實際部署
- **代表觀點**：「完美的企業策略 = 永遠有一個接近 frontier 的開源模型 + 多模型路由」
- **立場**：溫和樂觀——認為 3-6 個月 frontier gap 對企業是可接受的距離

### Aaron Pressman（CNBC 科技記者）

- **背景**：長期報導 open source 與企業 AI，對中國開源生態有多年觀察
- **關鍵轉折**：DeepSeek 1 月時刻開始系統性追蹤中國開源進度
- **代表觀點**：「AI 出口管制是地緣政治武器，Anthropic 切斷 Fable Mythos 是危險先例」
- **立場**：謹慎樂觀——認為中國追上美國是結構性現象，不只是蒸餾抄襲

### Stacy Rasgot（Bernstein 半導體分析師）

- **背景**：Bernstein 半導體分析師，產業經驗超過十年
- **代表觀點**：「現在是真正的 demand cycle，不是 blip；GPU vs TPU 的討論是錯的問題，所有人都會贏」
- **立場**：產業派——認為超級循環仍持續，但選股時代已來臨

---

## 五、核心主旨

> AI 產業的新座標不再是「哪個模型最強」，而是「每美元能買到多少智能、能不能在企業內反覆呼叫」；GLM 5.2 從中國空降矽谷、Anthropic 切斷第三方存取、OpenAI 九個月自研晶片——三件事共同標誌了 2026 年 AI 產業從「智慧高度競賽」轉向「成本下行 + 採用普及」的雙螺旋時代。

---

## 六、金句摘錄

1. 「The new metric in AI is intelligence per dollar.」
2. 「We need cost to come down. That's how you drive adoption.」
3. 「You don't need open weights to be at the exact same frontier... but you can route tasks.」
4. 「AI is going to be treated as another kind of geopolitical or economic weapon.」
5. 「It's all within the same creation of information and knowledge. Everything is sort of riding on some other set of information.」
6. 「We're very used to AI in kind of single player mode... this is multiplayer mode.」
7. 「Chips are the most complicated things that humanity has created.」
8. 「The demand cycle is real, not a blip. Cost has been cut in half every two years for six decades. Was that a bad thing for semis? No.」

---

## 七、延伸閱讀 / 參考

- CNBC 原始影片：https://youtu.be/wDf1IR8yP9s
- OpenRouter（模型路由器平台）：https://openrouter.ai
- Harvey（AI 法律平台）：https://harvey.ai
- Z.AI（智譜 AI）：https://z.ai
- Anthropic Claude Tag 公告（2026 年）
- Bernstein 半導體研究報告（Stacy Rasgot 主持）

---

## 附：主講者中英文對照

| 影片稱呼 | 修正後推測 | 角色 |
|----------|-----------|------|
| Deepsec / Deepseeek | DeepSeek | 中國 AI 公司 |
| GLM52 / JLM52 | GLM 5.2 | 智譜 AI 模型 |
| Aentic / anthropic | Anthropic | 美國 AI 公司 |
| Opus 4.7 / 4.8 | Claude Opus 4.5 系列 | Anthropic 模型 |
| Mistrol | Mistral | 歐洲開源 AI 公司 |
| Fable Mythos | Fable Mythos | 第三方 AI 應用 |
| Aaron / Aeron / Erin | Aaron | CNBC 科技記者 |
| Stacy Rasgot | Stacy Rasgot | Bernstein 分析師 |
| Gabe | Gabe Pereyra | Harvey 共同創辦人 |