# 【How to Understand the Next Wave of AI Before Everyone Else — Tibo Interview】

> **講者**：Tibo（Thibault Sottiaux，OpenAI Codex 團隊，OpenAI Technical Staff）
> **主持人**：Matthew Berman（Forward Future 作者、AI 教育頻道經營者）
> **影片連結**：https://youtu.be/4qjEgPojjzM
> **影片長度**：44:28（2668s）
> **發布日期**：2026-08-24
> **頻道**：Matthew Berman
> **主題｜🤖 OpenAI Codex / AI Agents / Ultra-fast Inference / Recursive Self-improvement**
> **中文摘要｜Ryo（Backend Engineer Agent）**

---

## 摘要

本場訪談是 Matthew Berman 與 OpenAI Codex 團隊成員 Tibo（Thibault Sottiaux）的 44 分鐘深度對談，橫跨 16 個章節，觸及 OpenAI 內部文化、Google DeepMind 教訓、Codex 與 ChatGPT 合併、ultra-fast inference 解鎖的新型態應用、recursive self-improvement 的真實樣貌、AGI 介面的未來想像、Ultra Fast 對開發者工作流的根本改變，以及對 AI 焦慮大眾的務實回應。

Tibo 在訪談中展現的核心理念可歸納為三條主軸：（1）**從 DeepMind 到 OpenAI 的文化對比** — DeepMind 是研究導向、不擅長產品落地，OpenAI 則是 bottom-up、bias to ship，Codex 之所以爆發是因為 OpenAI 兩年前押注了大量 compute capacity；（2）**Codex × ChatGPT 合併的設計哲學** — 同一個底層模型、同一個 harness、同一個 UI，每個人根據自己需要長出不同工作流，不預設「工程師用工程師介面、非技術用簡單介面」的標籤；（3）**Ultra-fast inference 解鎖的 next wave** — 14x tokens/sec 讓「在 flow 中保持注意力」變得可能、催生非文字互動（共享畫布、real-time prototype steer），但同時把瓶頸從 LLM 移到網路與 tool call 層。

訪談中 Tibo 對 Anthropic 的態度相當開放：他承認不傾向觀察競爭對手，但強調 OpenAI 的差異化在於「為全世界打造（build for the world）」的使命感 — 把強大技術以更便宜、更普及的方式遞到最多人手裡。對 recursive self-improvement，他給出務實定義：不是「模型訓練模型」，而是「最強模型反過來優化 inference stack、CUDA kernel、產品流程」這整套系統的自我迭代。對 Sam Altman 暫停 frontier RL 訓練的決策，他坦言屬於 safety team 的標準程序，重啟時機由一組明確原則決定。

---

## 章節脈絡

### Section 1｜Intro（00:00 ~ 00:45）

Tibo 在錄製現場展示一個真實存在的「重置按鈕」（physical reset button）— 這是他對開發者社群的招牌承諾：當 Codex 出問題或使用者體驗不佳時，他可以隨時按下按鈕補償 token 用量，無需經過 marketing 或 finance 的審批。「我按下按鈕的時機取決於當下感覺對不對，」Tibo 解釋，「OpenAI 是個你可以做事的地方，這種直覺式補償是我們文化的延伸。」

### Section 2｜Lessons from Google & DeepMind（00:45 ~ 04:22）

Tibo 自述 DeepMind 經歷：他的專業是 infrastructure 與加速研究的產品，當時內部已有一組人在做 language model scaling，並自然衍生出 LM Chat 的想法 — 在 ChatGPT 問世前約一年就已是內部產品，且曾有野心要對外釋出。「模型能產生連貫且有用的文字時，那感覺非常特別 — 一開始比較好笑，後來越來越實用，」他回憶。但 DeepMind 不擅長 ship product，這與 OpenAI 形成鮮明對比。OpenAI 的文化是研究與產品極度緊密協作、共同設計、bias to ship，這也是吸引 Tibo 從 DeepMind 跳槽到 OpenAI 的核心理由。

### Section 3｜Building OpenAI's Culture（04:22 ~ 07:23）

Tibo 將 OpenAI 文化拆解為兩個看似矛盾的面：（1）**bottom-up empowering** — 任何人都可以發想 idea、組隊、快速 ship，「對新產品想法幾乎沒有 stop energy」；（2）**頂層的簡潔與品質堅持** — 避免變成 feature 大雜燴，對 ChatGPT iOS app 的設計、效能、效率保持高標準。這兩者透過「把東西儘量讓最多人能用」的使命感對齊。對創辦人的建議，他歸納三條：有 conviction、用 first users 快速迭代、敢於自我顛覆（即使這對 founder 不一定直接相關，但對成熟公司至關重要）。

### Section 4｜The Future of AI Agents（07:23 ~ 11:18）

Tibo 把 AI agent 的未來切成兩個截然不同的問題類別：（1）**個人 AGI / personal agent** — 與用戶在 flow 中並肩、主動提出想法、深度個人化、處理技術或非技術任務；（2）**full-on automation** — 建構能處理極複雜流程的智慧系統，例如自動從 production log 找效能瓶頸並 patch、或在資安場景自動修補漏洞、把人為介入壓到「僅需核准高風險動作」。前者核心是理解「你是誰」，後者核心是任務的智慧化執行。

### Section 5｜How AI Changes Developer Workflows（11:18 ~ 14:27）

Tibo 觀察到 Codex 當前仍有不少 clunkiness：要管理 skill files、記憶不總是可靠、sub-agent 形成的網路會打斷「完美夥伴」的 illusion。下一代模型要解決這些。同時，他指出 laptop 本身會成為 constraint — laptop 是為人類設計的（有限的打字速度、有限的並行應用數），但 model 沒這個限制。「未來的模型需要的不只是 laptop 的資源，」Tibo 強調。談到 ultra-fast 14x 速度帶來的工作流改變，他預期 solo developer 不再需要平行 kick off 10-15 個 agent，而是回到 3-4 個並保持深度專注；attention 變成比 token 更珍貴的資源。

### Section 6｜ChatGPT & Codex Merging（14:27 ~ 17:00）

合併初期社群反應是「為什麼要合？」Tibo 給出底層邏輯：未來的模型設計就是要 merge 的，同一個底層技術、同一個 harness、同一套 voice-first、super-efficient 的 multimodal 架構。介面會根據個人需要自動調適 —「工程師介面」或「非技術介面」這種標籤是人類發明來處理抽象的產物，現實是每個人都位於光譜上的某個位置，AI 該學會適應每一個體的獨特性，不該強迫使用者改變自己。

### Section 7｜The Future of Human-AI Interaction（17:00 ~ 20:25）

Tibo 描繪的「完美 illusion」是一個深度個人化的 natural language 介面 — 就像寫一封信給老朋友，對方能讀懂字裡行間的情緒與細微差異。AI 該是「人類既有行為方式的自然延伸」，而不是使用者必須去適應的工具。對 Matt 追問的「非語言溝通（手勢、表情）的重要性」，Tibo 認為未來會非常 ambient — 在白板寫字、對辦公室空間說話，都該是自然的輸入介面。每次 OpenAI 朝「更自然」的方向推進（例如新 ChatGPT Voice），使用者就會自動切到阻力最小的路徑，voice-mode 用戶數正在快速成長就是證據。

### Section 8｜OpenAI vs. Anthropic（20:25 ~ 23:37）

Tibo 表示「我不太看競爭對手」，OpenAI 專注在打造最強模型、最高效率、為最多人打造產品這三件事。Codex 在極短時間內突破 2000 萬用戶的垂直成長曲線，動能來自合併 ChatGPT 的 distribution 紅利 + 把強大技術遞到非工程師手裡的使命感。對 Matt 追問「Anthropic 比較像建立社群、社群透明度、grounded 感」，Tibo 認同這是 OpenAI 也很重視的方向 — 對社群透明、吸收社群想法、把技術遞到全世界手中，這是 mission 本身。

### Section 9｜Why OpenAI Keeps Resetting Limits（23:37 ~ 26:41）

Tibo 解釋 reset 的初衷：當 Codex 出包或體驗不佳時，作為「謝謝你成為用戶、我們在努力打造」的補償 — 一開始是 30 分鐘 outage 的補貼，後來變成推廣新功能（例如 ultra-fast）時的「送你額外用量」分享機制。「這個按鈕沒有 marketing 或 finance 在背後審批，我想按就按，」Tibo 強調。Matt 認為這與 Amazon 的 return policy 有異曲同工之處 — 真心在意用戶的企業文化，會自然累積社群 goodwill 並轉化為成長動能。

### Section 10｜AI Efficiency & Compute（26:41 ~ 30:25）

Tibo 揭露 Luna 降價 80% 的真相：**絕大多數是演算法效率提升，而非單純 compute 規劃**。OpenAI 兩年前被質疑為何大量投資 compute，現在回頭看是個「極好的賭注」 — Frontier model 推出後，可用這些最強模型反過來重新設計 inference stack、CUDA kernel、產品互動流程。除了 cost efficiency，speed efficiency 也提升約 60%（對照 3 個月前），顯示整個 stack 在每個層面都被系統性優化。承諾是：當出現重大效率收益時，直接回饋給客戶與用戶，而非私下吸收為利潤。

### Section 11｜Recursive Self-Improvement（30:25 ~ 32:00）

Tibo 對 recursive self-improvement 給出比「模型訓練模型」更務實的定義：**最強模型反過來優化自己 serving 的基礎建設** — 包括 inference stack、CUDA kernel、新一代更高效的產品互動模式。「整個系統是一個大循環，」他強調。即使是 cloud agents 突破帶來的「工程師生產力提升，再用這份生產力回頭強化整個系統」，也算廣義的 recursive self-improvement。「如果我們不做這件事，那才奇怪。」

### Section 12｜Pausing Frontier AI Training（32:00 ~ 34:13）

對 Sam Altman 宣布暫停 frontier RL 訓練的決策，Tibo 給出內部視角：這是 safety team 的標準程序，當模型能力提升，alignment 與 safety 的投資也必須等比例強化。暫停是為了讓團隊「徹底理解並硬化系統各個部分」，重啟時機由 safety team 達成的一組明確原則決定 — 不是「看到就知道了」，而是經過嚴謹的辯論與探索過程。Tibo 認為 OpenAI 在這類決策上「總是能很有效率地做出來」。

### Section 13｜What Ultra Fast Unlocks（34:13 ~ 40:00）

Tibo 揭露 ultra-fast 的內部使用情境：（1）**高風險場景** — 當 outage 發生時，incident commander 與 response team 立刻取得 ultra-fast 額度，每一秒都很關鍵；（2）**團隊主動爭取** — 相信自己在做重要事情的團隊都會要 ultra-fast，例如 dev day 前的關鍵決定；（3）**個人偏好差異** — 多工者獲益較少，喜歡單線深耕的人獲益最大（Tibo 自己有 ADHD，喜歡 context switch，但有時也想專注）。對 ultra-fast 加速比，Tibo 給出經驗法則：純生成任務約 10x，含大量 tool call 的 agent 任務約 3-4x（瓶頸移到網路與 orchestration 層）。

### Section 14｜Will Ultra Fast Become the Default?（40:00 ~ 41:19）

Tibo 預期 ultra-fast 在 1-2 年內會成為「接近預設」的速度，技術普及的曲線（從昂貴到便宜到普及）歷來如此。速度提升來自三股力量同時推進：（1）inference 速度本身的改進；（2）模型 token 效率的提升（Sol 比 Terra 顯著更高效，下一代又會比 Sol 更高效）；（3）inference hardware 持續創新。但他也預期會永遠存在「更高階」的 tier — 願意付更多錢換取極致速度的使用者，永遠會有一個選項。

### Section 15｜Reassuring People About AI（41:19 ~ 43:20）

對 AI 焦慮的大眾，Tibo 的論點是「效率會自然普及」：今天的 frontier 模型 6 個月後會變得極便宜（以 Luna 為例，6 個月前的 frontier 級模型現在幾乎免費）。OpenAI 的核心使命就是把強大智慧遞到最多人手裡，效率每提升一次，access 就擴大一次。「不用看太遠，」Tibo 建議，「ChatGPT 已經在很多非常個人且深刻的場景幫助人 — 寫作、個人建議、健康諮詢、財務建議。我自己每天都在用，去看醫生前會先用它做功課，這是我原本很難取得的支援。」起點很簡單：跟身邊的人聊聊 AI 怎麼幫助他們，從中得到啟發，再想想自己可以怎麼受惠。

### Section 16｜Why Everyone Should Try AI（43:20 ~ 44:28）

收尾呼應：對 AI 感到陌生或害怕的人，不必從大處著手。ChatGPT 在個人化、日常化的場景已經有非常具體的幫助 — 從寫作輔助到看醫生前的準備。Tibo 建議的切入點是「從觀察別人怎麼用開始」，讓實際效用說服自己。Matt 致謝結束訪談。

---

## 關鍵概念定義

| 概念 | 英文原詞 | 定義與脈絡 |
|------|---------|-----------|
| Codex | Codex | OpenAI 推出的 AI 程式設計助手產品；2026 年 8 月突破 2000 萬用戶，與 ChatGPT 合併 |
| Ultra Fast | Ultra Fast | OpenAI 的高速 inference tier，比標準速度快 14 倍；解鎖 in-flow、real-time 等新型態應用 |
| Reset Button | Reset Button | Tibo 對開發者社群的招牌承諾；可隨時補償 token 用量，無需 marketing/finance 審批 |
| Recursive Self-Improvement | Recursive Self-Improvement | Tibo 定義：最強模型反過來優化 serving 自己的 inference stack、CUDA kernel、產品流程；是「整個系統的自我迭代」而非狹義的模型訓練模型 |
| Personal AGI | Personal AGI | 與用戶在 flow 中並肩、主動提出想法、深度個人化的 AI agent；底層同一個模型，但介面根據個人需要自動調適 |
| Full-on Automation | Full-on Automation | 建構能處理極複雜流程的智慧系統；典型場景：自動 patch production log 效能瓶頸、自動修補資安漏洞 |
| LM Chat | LM Chat | Google DeepMind 在 ChatGPT 問世前約一年研發的內部對話產品；曾有對外釋出的野心但最終未 ship |
| Compute Capacity Planning | Compute Capacity Planning | 兩年前被質疑過度投資 compute 的「賭注」現在得到驗證；為效率提升、降價、reset 補償提供餘裕 |
| The "Perfect Illusion" | The "Perfect Illusion" | Tibo 對未來人機互動的願景：AI 是人類既有行為方式的自然延伸，使用者不需要改變自己去適應工具 |
| Voice-first | Voice-first | OpenAI 的介面策略之一；新 ChatGPT Voice 上線後，純語音互動用戶數快速成長 |
| Pause Frontier RL Training | Pause Frontier RL Training | Sam Altman 宣布的決策；safety team 達到明確原則後重啟，屬於 OpenAI 的標準程序 |
| Frontier → Commoditization | Frontier → Commoditization | Tibo 的核心信念：6 個月前的 frontier 模型今天會變得極便宜甚至免費；技術普及曲線歷來如此 |
| Bottleneck Migration | Bottleneck Migration | Ultra-fast 把瓶頸從 LLM 移到網路、tool call、orchestration 層；對 pure generation 任務約 10x 加速，對 agent 任務約 3-4x |
| Attention as Resource | Attention as Resource | Tibo 框架：未來 attention 比 token 更珍貴；ultra-fast 讓使用者從「平行 kick off 10 個 agent」回到「深度專注 3-4 個」 |

---

## 重要引用

> **"OpenAI is a very — it's a place where you can just do things. And so it just felt right initially to compensate when we were iterating and breaking things."**
>
> **譯**：OpenAI 是個你可以做事的地方。所以當我們反覆嘗試、出包時，直覺上就應該補償 — 這就是 reset button 的文化根源。

> **"DeepMind was a very creative place... deep mind was not set up to ship product. OpenAI is a very very different place in that sense. We just like research and products just collaborate super closely together."**
>
> **譯**：DeepMind 是個極富創造力的地方，但它不擅長 ship product。OpenAI 在這點上完全不同 — 研究與產品極度緊密協作。

> **"The most powerful models that we have are the ones that make it capable for us to do it with a very small team. And so the majority of whenever we come up with very significant efficiency gains — our commitment is to keep things at the frontier of performance cost and to share with our customers and our users."**
>
> **譯**：我們最強的模型，正是讓小團隊就能完成大事的關鍵。每當出現重大效率收益時，我們的承諾是把它保持在 performance/cost 的 frontier，並直接回饋給客戶與用戶。

> **"Recursive self-improvement... what we are seeing a ton of success with is using those models to develop the infrastructure that is on the critical path of using those models — which is also a form of recursive self-improvement. It's all one big system."**
>
> **譯**：Recursive self-improvement... 我們看到大量成功案例，是用最強模型反過來開發 serving 這些模型的基礎建設 — 這也算 recursive self-improvement。整個系統是一個大循環。

> **"The ultra-fast thing works amazingly well when there's not that many tool calls involved or it's like a lot of generation of context. So for example, if you're trying to prototype a website or a video game... it will do it so so quickly — 10 times more quickly. But if it's a lot of tool calls like the overhead is in somewhere else in the network... you'll only feel like a 3x or 4x speed up."**
>
> **譯**：Ultra-fast 在 tool call 少或大量內容生成的場景表現驚艷 — 例如 prototyping 網站或遊戲，可達 10 倍加速。但如果有很多 tool call，瓶頸移到網路或其他地方，就只會感受到 3-4 倍加速。

> **"You and your mom will use the same thing. It will be your personal AGI. You will have very different kinds of tasks and utility that you get from it... it will continue to tailor itself to maximally benefit you."**
>
> **譯**：你和你的媽媽會用同一個東西。它會是你的個人 AGI。你們會有不同的任務、不同的效用... 它會持續自我調適，極大化對你的助益。

> **"We're building the technology that's the most empowering for humans — and that requires building around your ability to multitask, how you want to manage your attention, do you want something brought up now or is it better to bring it up in 30 minutes."**
>
> **譯**：我們在打造最能賦能人類的科技 — 這需要圍繞著你的多工能力、注意力管理方式來設計：你要現在拉出來，還是 30 分鐘後再說。

> **"I don't tend to look at the competition that much. I really look at what can we do uniquely well and what are our values and how do we maximally accelerate towards that."**
>
> **譯**：我不太看競爭對手。我真正關注的是我們能獨特地做好的事、價值觀、以及如何極大化朝那個方向加速。

> **"Every time you lean into something that is more natural, humans just choose the path of least resistance."**
>
> **譯**：每次你往「更自然」的方向推進，人類就會自動選擇阻力最小的路徑。

> **"Technology has a way to become very very efficient over time. We're very focused on very broad access and we're optimizing for the utility that you get out of it directly."**
>
> **譯**：科技總會變得非常高效。我們極度專注在最大化可及性，優化你直接從中獲得的效用。

---

## 人物與角色分析

### Tibo（講者，Thibault Sottiaux）

OpenAI Codex 團隊成員，OpenAI Technical Staff。從 Google DeepMind 跳槽至 OpenAI，專業背景為 research infrastructure 與加速研究的產品。社群上以兩件事聞名：（1）Codex 的「reset button」— 可隨時補償用戶 token 的招牌承諾；（2）對 recursive self-improvement、ultra-fast inference 等技術議題的深度公開討論。

**本場訪談的特殊角色**：

Tibo 採取的立場介於「純技術人」與「產品哲學家」之間。他會用具體數字（Luna 80% 降價、3-4x 與 10x 加速比、Codex 2000 萬用戶）說話，但也頻繁使用框架性語言（build for the world、the perfect illusion、path of least resistance、one big system）來描述 OpenAI 的設計哲學。

**溝通風格**：

- **具體數字錨定**：每談到一個技術論點必附數字（80% 降價、60% 加速、14x tokens/sec、20M 用戶）
- **框架式總結**：擅長把抽象概念收束為一句話框架（attention 是稀缺資源、整個系統是一個大循環、人類選阻力最小的路徑）
- **內部視角坦誠**：不迴避 reset 按鈕背後沒有審批機制這類「非標準流程」的細節，展現 OpenAI 的 bottom-up 文化
- **ADHD 個人化細節**：自承有 ADHD、喜歡 context switch，但偶爾也想要深度專注；ultra-fast 對他來說是「保持 flow」的關鍵工具

**核心信念**：

- 研究與產品的極度緊密協作是 OpenAI 的根本優勢
- 個人 AGI 不該用「工程師介面 vs 非技術介面」這種二分法思考
- Ultra-fast inference 會在 1-2 年內成為「接近預設」的速度
- Recursive self-improvement 的真實樣貌是「最強模型優化自己的基礎建設」
- Frontier 模型 6 個月後會變得極便宜甚至免費 — 這是 OpenAI 使命的延伸

### Matthew Berman（主持人）

Forward Future 作者、AI 教育頻道經營者，頻道專注於實用 AI 工具與最新研究。本場訪談採取「觀眾代言人」式提問策略 — 把推特上開發者社群真正在問的問題（Codex 為何爆發、Anthropic vs OpenAI、ultra-fast 解鎖什麼、recursive self-improvement 是不是真的）依序拋出，並用「我自己也有 ADHD」「我自己也會 kick off 10 個 agent」這類個人化陳述建立雙向對話。

**提問風格**：

1. **社群熱度議題切入**：每段都從一則 Tibo 推特或一段近期 OpenAI 公告開始，作為錨點
2. **個人化追問**：在 Tibo 給出抽象答案時追問「你個人怎麼用？」「你自己會怎麼選擇？」
3. **框架挑戰**：在 Tibo 描述願景時插入「但 X 真的會這樣演嗎？」「那 Y 是不是就過時了？」的反思式挑戰

**亮點追問**：

- 「你 context switch 的傾向是什麼？」 — 製造雙方都有 ADHD 但行為相反的有趣對位
- 「OpenAI 員工真的可以無上限用 ultra-fast 嗎？」 — 把抽象願景拉回內部資源配置的真實面
- 「你會給對 AI 焦慮的大眾什麼話？」 — 收束訪談的務實視角

---

## 核心主旨總結

> **OpenAI 的 next wave 不是單一新模型，而是「個人 AGI 介面統一 + Ultra-fast inference 解鎖新型態應用 + Frontier 模型持續降價普及」這三條軸線同時推進；Codex 的爆發只是開始，真正的 next wave 仍在展開中。**

本場訪談的核心論點可壓縮為五條遞進線索：

1. **DeepMind vs OpenAI 文化對比（00:45 ~ 04:22）**：研究與產品的協作密度決定了 ship 速度 — DeepMind 強在研究弱在產品，OpenAI 兩者極度緊密結合，這是 Codex 能爆發的根本前提。
2. **個人 AGI 不該二分（07:23 ~ 11:18）**：個人 AGI 的介面不該預設「工程師介面 vs 非技術介面」，而是同一個底層模型根據每個人光譜上的位置自動調適 — 這是 Codex 與 ChatGPT 合併的設計哲學根源。
3. **Ultra-fast inference 解鎖新型態應用（34:13 ~ 40:00）**：14x tokens/sec 讓「在 flow 中保持注意力」變得可能、催生非文字互動（共享畫布、real-time prototype steer），但同時把瓶頸從 LLM 移到網路與 tool call 層。
4. **Recursive self-improvement 的真實樣貌（30:25 ~ 32:00）**：不是「模型訓練模型」，而是「最強模型反過來優化 inference stack、CUDA kernel、產品流程」這整套系統的自我迭代 —「整個系統是一個大循環」。
5. **Frontier 模型的 commodity 化（26:41 ~ 30:25 + 41:19 ~ 43:20）**：今天的 frontier 模型 6 個月後會變得極便宜甚至免費；OpenAI 的承諾是「把強大智慧遞到最多人手裡」— Luna 降價 80% 不是終點而是起點。

Tibo 的角色定位揭示了 OpenAI 內部「產品技術領導者」的工作方式：他同時要管 Codex 這個 2000 萬用戶產品的 day-to-day 細節（reset 按鈕、token 用量、ultra-fast 內部配額），又要思考「個人 AGI 介面」「next wave 應用場景」這類 5-10 年的設計哲學問題。從 DeepMind 到 OpenAI 的文化對比，呼應 Harari 在 2026-07-30 gala 對談中對「intelligence 廉價化時代，真正的稀缺資源是 attention」這一論述：Tibo 從工程師視角出發，把「attention 是稀缺資源」具體化為「ultra-fast 讓使用者從平行 kick off 10 個 agent 回到深度專注 3-4 個」的產品設計原則。

---

## 金句摘錄

1. 「OpenAI 是個你可以做事的地方 — 當我們反覆嘗試、出包時，直覺上就應該補償。」
2. 「DeepMind 強在研究弱在產品；OpenAI 的研究與產品極度緊密協作，這是根本差異。」
3. 「你和你的媽媽會用同一個東西。它會持續自我調適，極大化對你的助益。」
4. 「每次你往『更自然』的方向推進，人類就會自動選擇阻力最小的路徑。」
5. 「Recursive self-improvement 的真實樣貌：最強模型反過來優化 serving 自己的基礎建設 — 整個系統是一個大循環。」
6. 「Ultra-fast 在純生成任務可達 10 倍加速；在 agent 任務只有 3-4 倍 — 瓶頸移到網路層了。」
7. 「今天的 frontier 模型 6 個月後會變得極便宜 — 科技普及的曲線歷來如此。」
8. 「不用看太遠 — ChatGPT 已經在很多非常個人且深刻的場景幫助人。」

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice id: `Chinese (Mandarin)_Soft_Girl`，speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260826_Tibo_NextWaveOfAIBeforeEveryoneElse_口播稿.txt

- [opus X.X MB](../audio/20260826_Tibo_NextWaveOfAIBeforeEveryoneElse.opus)（Telegram 友善）
- [m4a X.X MB](../audio/20260826_Tibo_NextWaveOfAIBeforeEveryoneElse.m4a)（iOS 友善）
- [mp3 X.X MB](../audio/20260826_Tibo_NextWaveOfAIBeforeEveryoneElse.mp3)（通用格式）
