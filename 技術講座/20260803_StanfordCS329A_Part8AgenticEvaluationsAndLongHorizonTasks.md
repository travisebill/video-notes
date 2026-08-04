---
講者: Stanford CS329A 課程團隊
影片連結: https://www.youtube.com/watch?v=8JAqLnTaZu4
影片長度: 1:15:18（4518s）
發布日期: 2026-08-03
中文摘要: Ryo（Backend Engineer Agent）
---

# 【Stanford CS329A — Part 8 — Agentic Evaluations and Long Horizon Tasks】

Stanford CS329A「Self-Improving AI Agents」系列第八講聚焦於**代理式評測（agentic evaluations）與長時程任務（long horizon tasks）**。影片以課堂對談開場，三位學生被點名回答在期末專題中用過哪些評測，答案集中在 SWE-bench、multihop QA、私有 wiki QA 等類型。講者隨即切入本講核心：**當傳統的 chatbot / QA 基準迅速飽和時，我們應該改用什麼樣的代理式評測來衡量模型能力、經濟價值與研究品質**。

本講以三篇代表性論文為骨幹：METR 的「time horizon」、OpenAI 的 GDPval，以及 Stanford 推出的 DeepScholarBench。三者分別從「任務可被完成的最長時長」、「任務的經濟價值能否匹敵專業人士」、以及「深度研究合成的品質與可驗證度」三個軸度切入，建構一個多面向的代理式評測框架。

講者在最後總結三個評測得到的訊號：**模型在隔離良好、規格明確的任務上表現優異；在高度依賴脈絡、引用資料或專家默會知識的任務上仍存在巨大差距**。換言之，「時間長度」、「經濟價值」、「合成品質」三項指標缺一不可，而每一項都需要與人類表現相互校準。

---

## 主題與背景

CS329A 是 Stanford 探討 self-improving AI agents 的進階課程。第八講的整體論述框架圍繞一個核心張力：**AI 模型的能力正在以令人眼花繚亂的速度提升，但「如何量化這份提升」本身卻是個難題**。講者開宗明義指出，傳統 benchmark（QA、chatbot 等）在 4-5 年內就已飽和，業界亟需新型態的評測方法。

講者引用三篇具代表性的近期工作：**METR** 透過「人類專業人士完成任務所需時間」作為錨點，把 AI 模型的時間視野（time horizon）量化為「以 50% 或 80% 成功率可完成任務的最長時長」；**GDPval**（OpenAI）則直接拿「模型 vs. 十年以上經驗的產業專家」的勝率做比較；**DeepScholarBench**（Stanford）則專注於 deep research / 論文 related work synthesis 的品質與可驗證度。三篇論文共同拼出代理式評測的三大軸度：**時間長度、經濟價值、合成品質**。

本講的核心訊息是：**「我們知道 AI 在做什麼，但不知道我們不知道什麼」**——也就是說，模型在隔離良好的單一任務上表現亮眼，但在需要脈絡、引用資料、專業默會知識的真實場景中，差距仍大。這對 self-improving agents 的研究意涵深遠：**自動化的瓶頸不是模型本身，而是評測本身**。

---

## 一、課堂開場與評測現況診斷（00:00 ~ 04:00）

**重點摘要**：講者以點名方式開場，凸顯「學生在做期末專題卻沒人跑過評測」這個尷尬現狀，作為本講的問題意識。

**內容：**
- 講者詢問學生在期末專題中用了哪些 agentic evaluation，答案包括 SWE-bench 風格的程式碼基準、multihop QA、私有 wiki QA
- 講者宣告本講目標：**為何 agentic evaluations 困難、它如何不同於傳統 benchmark、未來該如何量測 AI 進展**
- 三篇核心論文：METR、GDPval、DeepScholarBench，分別對應不同面向

**重要引用**：
> 「No one is running an evaluation. How are you guys doing any projects?」

---

## 二、METR 與「時間視野」（time horizon）方法論（04:00 ~ 18:00）

**重點摘要**：METR 透過「人類完成任務所需時間」作為錨點，把模型能力量化為「可完成任務的最長時長」，並區分 50% 與 80% 兩種可靠度門檻。

**內容：**
- **METR 的核心問題**：模型能完成多長任務？成功率為何？
- **三套任務套組**：
  - SWAA（Software Atomic Actions）：1-30 秒的原子操作
  - GAIA / EdgeCast：1 分鐘到 30 小時的多樣任務
  - RE-Bench：可達 8 小時的完整 ML 研究任務
- **方法論**：招募 5 年經驗的專業人士紀錄完成時間，收集人類難度評分（幾何平均），再以 agent 跑同一批任務並擬合「成功率 vs. 時間」曲線
- **人為偏差**：領域專家常低估任務難度，因為他們對「什麼算成功」有既定框架
- **METR 的關鍵設計**：把任務時長、可靠度（50%/80%）同時記錄下來，並以人類時間作為 universal anchor

**重要引用**：
> 「So just the duration question. And then the second question is what's the percentage success? Can it do it reliably?」

---

## 三、METR 趨勢與七大失敗模式（18:00 ~ 30:00）

**重點摘要**：模型時間視野呈現「每 7 個月翻倍」的指數增長，但 50% 與 80% 成功率之間存在巨大 delta；GPT-4 與 o1 的失敗模式分佈也透露出能力差異。

**內容：**
- **時間視野的歷史趨勢**：GPT-2（2019）僅能完成 ~2 秒任務；GPT-4（2023）達 ~8 分鐘；Claude 3.7 Sonnet（2025）可達 ~59 分鐘（50% 成功率）
- **雙倍時間常數（doubling time）**：約每 7 個月翻倍，預估 2028-2031 年可達 1 個月級任務
- **可靠度 delta**：80% 成功率下，Claude 3.7 仍僅能完成 ~8-15 分鐘任務，遠低於 50% 門檻的 59 分鐘
- **七大失敗模式**（以 GPT-4 vs. o1 對照）：
  1. Poor planning（任務拆解失敗）
  2. Poor tool choice（工具選擇錯誤）
  3. Incorrect mental math / reasoning（推算錯誤）
  4. Premature task abandonment（過早放棄）
  5. Repetitive loops（重複無效動作）
  6. Inability to judge task completion（無法判斷任務結束）
  7. Lack of error recovery（錯誤恢復能力不足）
- **METR 的限制**：內部 pull request / contractor vs. maintainer 場景下，模型表現接近 contractor（無脈絡者）而非 maintainer，速度可慢 5-18 倍

**重要引用**：
> 「It's like you gave your task to an intern, but it only completes it 50% of the time.」

---

## 四、GDPval：經濟價值為導向的真實世界評測（30:00 ~ 45:00）

**重點摘要**：GDPval 直接比較模型與十年經驗產業專家的勝率，覆蓋 9 大產業、44 種職業、220+ 真實任務；趨勢為線性增長，與 METR 的指數增長形成對比。

**內容：**
- **任務範例**：3D 線纜捲筒設計、競爭格局分析、護理評估報告、影片開場設計、不滿客戶回信、家庭旅遊行程、採購單價格稽核等
- **產業覆蓋**：9 大產業（不動產、政府、製造業、專業科學技術服務、健康照護、金融、批發零售、資訊業等），對應 GDP 前 5% 經濟活動
- **任務特性**：平均 7 小時完成時間，部分需數週；70% 需參考檔案；以 O*NET taxonomy 為基礎，60% 為電腦/數位任務
- **勝率趨勢**：GPT-4o（2024）約 12.4% → GPT-5 High 約 30% → Claude Opus 4.1 約 47.6%，呈現**線性而非指數**增長
- **任務分類觀察**：
  - Claude Opus 擅長美學、文件格式、PDF/試算表/簡報理解
  - GPT-5 擅長指令遵循、計算正確性、文字任務
- **失敗模式**：指令遵循錯誤最為普遍（模型答應看參考資料卻未實際讀取）；幻覺覆蓋參考內容；格式錯誤
- **GPT-5 細項分佈**：~50% 可接受但 subpar、~20% 明顯優於人類、~29% 不合格或災難性失敗

**重要引用**：
> 「If you underspecify the prompts... the models do end up not doing that well.」

---

## 五、GDPval 各職業細項分析（45:00 ~ 60:00）

**重點摘要**：模型在「櫃台租賃、生產線 clerk、不動產經紀、軟體開發、IT 系統管理」等任務已逼近人類平均專家；醫療管理、客服代表、稽核人員任務也已達標。

**內容：**
- **極強表現職業**（已達或超過人類平均）：
  - Government：行政服務經理、法規遵循人員
  - Healthcare：醫療健康服務經理
  - Finance：個人理財顧問、稽核人員
  - Customer Service：客戶服務代表
  - Retail：第一線督導、零售銷售人員
  - Sales：批發/製造業銷售代表、新聞分析師
  - IT：電腦/IT 系統管理者、軟體開發者
- **self-improvement 的關鍵發現**：n 次嘗試 + self-fix loop 可讓 GPT-5 達 1.6× 成本改善、1.4× 速度改善
- **經濟意涵**：在成功場景下，模型成本 < 人類專家薪資的 10%，特定職業已具備完全代理的經濟可行性
- **人類的不可取代角色**：當任務需要「找出該做什麼」而非「執行已明確的工作」時，人類仍負責架構問題與設定脈絡

**重要引用**：
> 「Humans are basically architecting what is the set of problems and then the model can go solve it.」

---

## 六、DeepScholarBench：深度研究合成的品質與可驗證度（60:00 ~ 70:00）

**重點摘要**：DeepScholarBench 把焦點從「能不能做」轉向「做出來的品質與可驗證性如何」，專注於學術論文 related work 合成。三個評測軸度（knowledge synthesis、retrieval quality、verifiability）共同構成品質檢驗框架。

**內容：**
- **任務定義**：用 arXiv 近期論文（PhD 級難度、22 領域），每月重新執行以避免資料污染，僅納入訓練截止後的論文
- **三大量測軸度**：
  - **Knowledge synthesis**：是否組織有序、捕捉所有關鍵事實
  - **Retrieval quality**：引用的文獻是否相關、重要、覆蓋率高
  - **Verifiability**：引用是否真的支持論述（precision + coverage）
- **現有系統表現**：所有系統皆未超過 19%（與 SWE-bench 70-80% 的飽和情況形成對比）
- **個別觀察**：
  - OpenAI Deep Research：英文表達佳，但遺漏關鍵事實
  - DeepScholar：precision 高達 ~90%，但 coverage 低
- **四大失敗模式**：
  1. 找不到全面性來源（即便相關文獻也未必包含基礎論文）
  2. 無法評估文獻重要性（不像專家有長期積累）
  3. 抓不到關鍵事實（即便給定完美來源，仍僅 ~50% coverage）
  4. 無法同時兼顧合成品質與可驗證度

**重要引用**：
> 「Most benchmarks get saturated. The fun thing about this particular benchmark is that none of the existing systems actually exceeds 19%.」

---

## 七、跨論文總結與代理式評測的三大軸度（70:00 ~ 75:18）

**重點摘要**：本講總結了**「時間長度、經濟價值、合成品質」**三軸度的互補性，並指出 self-improving agents 的下一個研究瓶頸不在模型，而在評測本身。

**內容：**
- **跨論文三大發現**：
  1. **METR**：50% 可靠度的時間視野每 7 個月翻倍，2028-2031 預估可達 1 個月任務
  2. **GDPval**：勝率呈現線性增長（最高 47.6%），但許多職業與任務類型仍未達標
  3. **DeepScholarBench**：引用資料、脈絡依賴、合成品質的可驗證度均存在巨大落差
- **我們有信心的領域**：
  - 隔離良好、規格明確的任務
  - 軟體工程、ML 研究（因為我們最能評估這些）
  - 較強的模型可生成結構良好的輸出（即便細節不全對）
- **信心不足的領域**：
  - 高度依賴脈絡的任務
  - 對抗性環境（adversarial）
  - 95% 可靠度的任務
  - 軟體/知識工作以外的領域（機器人、embodied AI 等）
  - 引用外部知識庫的綜合任務
- **三項未來指標缺一不可**：時長導向、經濟價值導向、合成品質導向
- **Q&A 重點**：
  - 「電腦科學專業不會消失」——能推理底層原理的人才有價值
  - AGI 定義：當 AI 能自行提出假設、跑實驗、完成整個研究循環
  - 長尾可靠度（long-tail reliability）是真正的瓶頸
  - 機器人領域的瓶頸可能更接近「資料收集」而非模型架構

**重要引用**：
> 「We are not just limited by task duration. How well we do in terms of quality of synthesis at these time horizons also has a lot of headroom for improvement.」

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 4 分 35 秒
> 口播稿原文：/tmp/cs329a-part8/口播稿.txt

- [opus 格式（待生成）](口播稿.opus)（Telegram 友善）
- [m4a 格式（待生成）](口播稿.m4a)（iOS 友善）
- [mp3 格式（待生成）](口播稿.mp3)（通用格式）

第一段導覽介紹 Stanford CS329A 第八講的問題意識：傳統 chatbot 與 QA 基準已飽和，業界需要新型態的代理式評測來衡量 AI 進展。講者引用三篇代表性論文：METR 的時間視野、OpenAI 的 GDPval、Stanford 的 DeepScholarBench，三者從不同軸度切入。

第二段導覽深入 METR 的方法論：把模型能力量化為「可完成任務的最長時長」，並區分 50% 與 80% 兩種可靠度門檻。GPT-2 的 2 秒、GPT-4 的 8 分鐘、Claude 3.7 的 59 分鐘，呈現每 7 個月翻倍的指數增長；但 80% 門檻下僅能完成 8-15 分鐘任務，凸顯可靠度落差。

第三段導覽聚焦 GDPval 與 DeepScholarBench：前者以「vs. 十年經驗產業專家」的勝率衡量真實經濟價值，線性增長到 47.6%；後者把焦點從「能不能做」轉向「品質與可驗證性如何」，所有現有系統皆未超過 19%。三個評測共同拼出**時間長度、經濟價值、合成品質**三軸度的完整框架。

---

## 核心概念表

### 概念1：Agentic Evaluation（代理式評測）
| 項目 | 內容 |
|------|------|
| 定義 | 評測 AI agent 完成多步驟、需要工具使用與決策的任務能力 |
| 與傳統評測差異 | 從「單輪 QA」轉向「多輪互動 + 工具使用 + 環境回饋」 |
| 三大挑戰 | 任務定義、長度衡量、可靠度量測 |
| 本講應用 | METR、GDPval、DeepScholarBench 三個案例 |

### 概念2：Time Horizon（時間視野）
| 項目 | 內容 |
|------|------|
| 定義 | 模型以特定可靠度可完成任務的最長時長 |
| 衡量方式 | 人類專業人士完成時間作為 universal anchor |
| 兩種門檻 | 50% 成功率 vs. 80% 成功率 |
| METR 數據 | GPT-2 = 2 秒 / GPT-4 = 8 分 / Claude 3.7 = 59 分鐘 |

### 概念3：METR（Model Evaluation and Threat Research）
| 項目 | 內容 |
|------|------|
| 機構 | METR（早期為 AI Safety Camp） |
| 三套任務 | SWAA（1-30 秒）、GAIA/EdgeCast（1 分-30 小時）、RE-Bench（8 小時） |
| 任務總數 | ~170 個 |
| 核心方法 | 招募 5 年經驗專家紀錄時間 + 擬合成功率曲線 |

### 概念4：Doubling Time（時間視野翻倍時間）
| 項目 | 內容 |
|------|------|
| 定義 | 模型時間視野增長到原來 2 倍所需的時間 |
| METR 估算 | 約每 7 個月 |
| 預測 | 2028-2031 年可達 1 個月級任務 |
| 警示 | 50% 門檻下的樂觀預期，80% 門檻下大幅縮水 |

### 概念5：Capability vs. Reliability（能力 vs. 可靠度）
| 項目 | 內容 |
|------|------|
| 能力軸 | 模型可完成多複雜任務 |
| 可靠度軸 | 模型可多穩定地完成任務 |
| 衡量差異 | 50% 成功率 vs. 80% 成功率 |
| METR 觀察 | 80% 門檻的時間視野僅為 50% 的 ~1/4 |

### 概念6：Human Time Anchor（人類時間錨點）
| 項目 | 內容 |
|------|------|
| 定義 | 用人類完成任務的時間作為模型能力的基準線 |
| 目的 | 跨任務類型提供統一的衡量尺度 |
| METR 數據 | 5 年經驗專業人士的完成時間 |
| 偏差風險 | 專家常低估任務難度 |

### 概念7：Reliability Delta（可靠度落差）
| 項目 | 內容 |
|------|------|
| 定義 | 50% 成功率時間視野與 80% 成功率時間視野的差距 |
| METR 案例 | Claude 3.7：50% = 59 分鐘，80% = 8-15 分鐘 |
| 意涵 | 部署到真實世界時，可靠度是巨大瓶頸 |
| 改善方向 | error recovery、context engineering、planning |

### 概念8：GDPval（GDP Validation）
| 項目 | 內容 |
|------|------|
| 機構 | OpenAI |
| 設計目標 | 衡量模型在真實經濟任務上的能力 |
| 對標對象 | 10+ 年經驗產業專家 |
| 評測指標 | 勝率（win rate），含 ties |

### 概念9：Win Rate（勝率）
| 項目 | 內容 |
|------|------|
| 定義 | 模型輸出被評為「不輸給產業專家」的比例 |
| 計算方式 | pair-wise preferences + human grading |
| GDPval 數據 | GPT-4o = 12.4% / GPT-5 High = ~30% / Claude Opus 4.1 = 47.6% |
| 趨勢 | 線性增長（vs. METR 的指數） |

### 概念10：O*NET Taxonomy（職業分類法）
| 項目 | 內容 |
|------|------|
| 定義 | 美國勞工部的職業分類與任務資料庫 |
| GDPval 用途 | 篩選「電腦/數位」任務（佔 60%） |
| 涵蓋範圍 | 9 大產業、44 種職業 |
| 經濟聚焦 | 鎖定 GDP 前 5% 的經濟活動 |

### 概念11：Instruction Following Errors（指令遵循錯誤）
| 項目 | 內容 |
|------|------|
| 定義 | 模型未真正執行 prompt 中要求的動作 |
| GDPval 案例 | 模型答應看參考檔案卻沒看；以幻覺覆蓋參考內容 |
| 模型差異 | GPT-5 指令遵循錯誤率較低 |
| 設計建議 | 評測應檢驗「是否真的執行」而非「輸出是否像執行」 |

### 概念12：Subjectivity in Real Work（真實工作中的主觀性）
| 項目 | 內容 |
|------|------|
| 特性 | 許多真實任務沒有唯一正確答案 |
| GDPval 處理 | 用 win rate 而非 accuracy |
| 影響 | 需要更細緻的評測設計與多人評分 |
| 風險 | 評分者之間的分歧（29% catastrophic） |

### 概念13：DeepScholarBench
| 項目 | 內容 |
|------|------|
| 機構 | Stanford |
| 任務 | 生成學術論文 related work 段落 |
| 範圍 | 22 領域 arXiv 論文，每月更新 |
| 評測機制 | human-validated，70-80% 評分者同意 |

### 概念14：Knowledge Synthesis（知識合成）
| 項目 | 內容 |
|------|------|
| 定義 | 把多個來源的關鍵事實組織成連貫論述 |
| DeepScholar 維度 | 第一軸 |
| 現狀 | 英文表達佳，但容易遺漏關鍵事實 |
| 改善方向 | 更強的資訊提取 + 主題組織能力 |

### 概念15：Retrieval Quality（檢索品質）
| 項目 | 內容 |
|------|------|
| 定義 | 找到的參考文獻是否相關且具重要性 |
| DeepScholar 維度 | 第二軸 |
| 衡量指標 | 文獻相關性 + 文獻重要性 + 覆蓋率 |
| 現狀 | document importance 全系統 < 12.5% |

### 概念16：Verifiability（可驗證度）
| 項目 | 內容 |
|------|------|
| 定義 | 引用是否真的支持對應論述 |
| 兩面向 | precision（引用是否準確）+ coverage（關鍵論述是否有引用） |
| DeepScholar 案例 | DeepScholar ~90% precision, Open Deep Research 較低 |
| 應用 | 評測 LLM 幻覺的關鍵指標 |

### 概念17：Data Contamination（資料污染）
| 項目 | 內容 |
|------|------|
| 定義 | 訓練資料包含評測資料導致高分假象 |
| DeepScholar 解法 | 僅用訓練截止後的 arXiv 論文 |
| 每月更新 | 避免「記憶式通過」 |
| 應用建議 | 任何評測都應考慮污染防護 |

### 概念18：Failure Mode Analysis（失敗模式分析）
| 項目 | 內容 |
|------|------|
| METR 七大失敗 | planning、tool choice、reasoning、abandonment、repetitive loop、completion judgment、error recovery |
| GDPval 失敗 | instruction following、hallucination overriding reference、format errors |
| DeepScholar 失敗 | 找不到全面來源、無法評估重要性、抓不到關鍵事實、無法兼顧品質與可驗證 |
| 共同教訓 | 失敗模式比成功案例更能指引研究方向 |

### 概念19：Context Engineering（脈絡工程）
| 項目 | 內容 |
|------|------|
| 定義 | 結構化設計模型可用的脈絡以提升表現 |
| 課堂觀察 | Claude Code 表現優於去年，主要來自 context engineering |
| 相關技術 | compaction window、planning、replanning |
| 未來方向 | distributed context engineering（跨多次工具呼叫） |

### 概念20：Self-Improvement Loop（自我改善迴圈）
| 項目 | 內容 |
|------|------|
| 定義 | 模型根據回饋自動修正輸出的機制 |
| 應用方式 | parallel sampling / sequential sampling |
| GPT-5 數據 | 1.6× 成本改善、1.4× 速度改善 |
| 限制 | 仍 < 人類專家薪資 10%，僅特定職業可完全代理 |

### 概念21：Maintainer vs. Contractor（維護者 vs. 承包商）
| 項目 | 內容 |
|------|------|
| 定義 | 內部熟悉 codebase 的人 vs. 外部新加入的人 |
| 速度差異 | contractor 比 maintainer 慢 5-18 倍 |
| 模型位置 | 模型表現接近 contractor 而非 maintainer |
| 意涵 | 真實部署時，模型相當於「無脈絡新人類」 |

### 概念22：Long-Tail Reliability（長尾可靠度）
| 項目 | 內容 |
|------|------|
| 定義 | 在罕見但關鍵的任務上維持高可靠度 |
| 重要性 | 真實部署需要 95%+ 可靠度 |
| 現狀 | 模型在長尾任務上仍不穩定 |
| 比喻 | 80% 易達、最後 20% 需 10 年 |

### 概念23：Domain Generalization（領域泛化）
| 項目 | 內容 |
|------|------|
| 強項領域 | 軟體工程、ML 研究、知識工作 |
| 弱項領域 | 機器人、embodied AI、跨領域綜合任務 |
| 根因 | 訓練資料 + 模型架構 + 評測機制都偏向已熟悉領域 |
| 機器人案例 | 資料收集成為主要瓶頸 |

### 概念24：Evaluation Methodology（評測方法論）
| 項目 | 內容 |
|------|------|
| 三大軸度 | 時間長度、經濟價值、合成品質 |
| 共同要求 | 與人類表現校準、避免資料污染、失敗模式分析 |
| 設計原則 | 自動評分 vs. 人類評分、單次 vs. 多次嘗試、規格明確 vs. 模糊任務 |
| 未來方向 | multi-agent 互動評測、資源約束評測、真實部署約束 |

---

## 12 條金句摘錄

### 金句1：模型時間視野的指數增長
> 「On the y-axis you have the task time for completion with 50% success rate. So in 2019 when GPT-2 came out only 2 seconds; closer to GPT-4 which is 2023 you are starting to see few minutes; when we have Claude 3.7 Sonnet in 2025 you are starting to see a few hours. Now note that this is almost like a doubling every 7 months.」

### 金句2：intern 比喻
> 「It's like you gave your task to an intern, but it only completes it 50% of the time. So it might come back with an answer or it might not. So there's always some amount of uncertainty.」

### 金句3：可靠的 delta
> 「So if you want high reliability, you are still at a few minutes or maybe tens of minutes. There's a big delta between the 59 minutes that we were claiming versus at 80% success rate you're still closer to say somewhere around 8 to 10 minutes.」

### 金句4：失敗模式分析的價值
> 「If you're saying that you have a challenging benchmark then you would showcase where do the models fail what is the common failure pattern.」

### 金句5：GDPval 的線性趨勢
> 「It's more of a linear trend roughly compared to the exponential trend that METR was talking about. And at the same time this is real work where you are comparing relative to an expert.」

### 金句6：人類的不可取代角色
> 「Humans are basically architecting what is the set of problems and then the model can go solve it in certain cases.」

### 金句7：脈絡工程的崛起
> 「I think there's new trend for context engineering. People are just learning how to structure the context better so that the tooling just becomes better and improves the improvements.」

### 金句8：DeepScholarBench 的留白
> 「Most benchmarks get saturated. The fun thing about this particular benchmark is that none of the existing systems actually exceeds 19%. So if this were to show up in your homework for the next iteration of the class a lot of headroom for you folks to actually make it a final project.」

### 金句9：quality 與 verifiability 的取捨
> 「None of the systems actually excels at both like the quality of synthesis and the verifiability in certain ways.」

### 金句10：研究合成的品質瓶頸
> 「We are not just limited by task duration. How well we do in terms of quality of synthesis at these time horizons also has a lot of headroom for improvement.」

### 金句11：電腦科學專業的存續
> 「I think the computer science as a profession is not going anywhere. And if you're able to reason for fundamentals, that is very important skill to have. AI as you saw needs to figure out the context to solve anything. So you need to be able to give it the context.」

### 金句12：AGI 的定義與長尾瓶頸
> 「AI scientist being able to come up with hypothesis and run the experiments and then complete the whole loop is still something of that that is our definition of AGI is to like when AI can build the next generation of models themselves then we don't have to even be in the room. But I don't think that is quite there yet.」

---

## 人物與機構

### 講者
- **Stanford CS329A 課程團隊**：本講授課者，負責 self-improving AI agents 系列課程。授課風格強調「學生參與 + 案例分析 + 跨論文綜合」。

### 學生互動
- 課堂對談中提到自己在做「private wiki QA + coding agent」餵入流程的學生
- 詢問 GDPval 中 dollar value 衡量是否可靠、deep scholar bench 為何被選為代表案例的學生

### 重要機構
- **METR（Model Evaluation and Threat Research）**：早期為 AI Safety Camp，現為獨立 AI 評測研究機構
- **OpenAI**：GDPval 開發者，專注於真實經濟價值評測
- **Stanford DeepScholarBench 團隊**：開發 DeepScholarBench，發布在 arXiv

---

## 延伸閱讀

### 核心論文
1. **METR Time Horizon Paper** — 「Measuring AI Ability to Complete Long Tasks」（2025）
2. **GDPval** — 「Measuring AI Performance on Real-World Economic Tasks」（OpenAI, 2025）
3. **DeepScholarBench** — 「A Live Benchmark for Deep Research Synthesis」（Stanford, 2025）

### 相關資源
- **AI Scientist Paper** — RE-Bench 任務套組的代表性工作
- **SWE-bench / SWE-bench Verified** — 程式碼修復基準
- **Homework 3（CS329A 過往作業）** — 學生建構 deep research agent 的實作練習
- **O*NET Online** — 美國勞工部職業資料庫
- **Stork, OpenAI Deep Research, Gemini Deep Research, Perplexity Deep Research** — 業界 deep research 產品

### 系列影片
- Stanford CS329A Part 1-7（前 7 講涵蓋 self-improving agents 的基礎理論、self-RAG、React、AlphaEvolve 等）
- 後續可能討論 multi-agent 評測、資源約束評測、真實部署約束

---

## 總結：給工程團隊的 3 個 takeaway

1. **評測設計三軸並重**：時長、經濟價值、合成品質，缺一不可。任何只衡量其中一軸的評測都有盲點。
2. **失敗模式比成功率更值錢**：與其追求 95% reliability，不如把 80% → 90% 的瓶頸列出來（planning、error recovery、context engineering）。
3. **模型是 contractor 不是 maintainer**：在內部 codebase 或高度脈絡依賴的任務上，仍需人類專家設計 prompt 與架構問題。