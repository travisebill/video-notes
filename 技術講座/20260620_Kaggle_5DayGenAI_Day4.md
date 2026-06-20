# DAY 4 Livestream — 5-Day Gen AI Intensive Course（Paige Bailey × Google）

**Paige Bailey + Chris + Antonio + Scott + Christopher + Umesh（Google Research / Google Cloud）｜2026-06-20**

> 影片連結：https://www.youtube.com/live/odvuLMJWUSU
> 影片時長：62:46（3766s）
> 語言：英文（YouTube 自動字幕 en-orig）
> 上傳者：Kaggle
> 來源：**5-Day Gen AI Intensive Course** Day 4 Livestream（**注意：與 Day 1-3 的 5-Day AI Agents Intensive 是不同系列**）

## 一、主題與背景

本影片是 Kaggle 與 Google 共同舉辦的「5-Day Gen AI Intensive Course」第四天的直播內容。**這是不同於 Day 1-3 的系列課程**（Day 1-3 是「5-Day AI Agents Intensive Vibe Coding」，由 Smitha 與 Anant 主持；本系列由 Paige Bailey 主持，聚焦 domain-specific generative AI 應用）。Day 4 主題是 LLM 在 healthcare 與 security 兩個高敏感度領域的實務應用。

## 二、章節脈絡

### Section 1｜開場與回顧（00:00 ~ 05:00）

**重點摘要**：Paige 開場，code lab 走一遍概覽。

**內容：**
- 今天主題：LLM 無法獨立完成的任務
- Tool use 與 grounding 的價值
- 涵蓋 Med-PaLM、Sec-PaLM

### Section 2｜Code Lab 導讀：Grounding 與 Tool Use（05:00 ~ 20:00）

**重點摘要**：實際走過 code，展示 Gemini 的 grounding 功能。

**內容：**
- 匯入 libraries 與模型設定
- 使用 Google Search grounding 取得最新資訊
- Prompt engineering 提升 precision
- AI Studio 測試入口

> "use grounding and you can utilize it in your applications as well."
> （在你的應用中使用 grounding。）

### Section 3｜來賓 Q&A 1：Healthcare 與 Med-PaLM（20:00 ~ 35:00）

**重點摘要**：Chris（Google Research）介紹 MedQA benchmark 與 Med-PaLM 進展。

**內容：**
- **MedQA benchmark**：醫學生執照考試風格的多選題
- Gemini 等模型已達 90% 正確率
- 但這仍是「人工化情境」——真實臨床需完整病歷、影像、檢驗值
- 從 multiple-choice 轉向更複雜的 expert task benchmark
- Benchmark 高分 ≠ 臨床可用

> "Probably. Somebody's going to get there."
> （達到 100% MedQA 是可能的。）

### Section 4｜來賓 Q&A 2：Domain-Specific Model 設計（35:00 ~ 45:00）

**重點摘要**：Antonio（Office of the CTO）分享 domain-specific model 的取捨。

**內容：**
- Trade-off 存在於品質、成本、延遲三維度
- Fine-tuning、context caching、RAG 等多種技術
- Google Cloud + Unsloth 等開源框架
- 沒有「最佳模型」，只有「最適 use case 的模型」

> "It really depends on the specific use case."
> （取決於特定 use case。）

### Section 5｜來賓 Q&A 3：Security 與 Sec-PaLM（45:00 ~ 55:00）

**重點摘要**：Scott 與 Umesh 討論 security 應用與 prompt injection。

**內容：**
- **Sec-PaLM** 訓練於 cybersecurity 資料
- 理解 alert 中真正發生什麼
- 不同於傳統 security operations analyst
- 結合 LLM 與 security rules 的 hybrid 系統

> "LLM 對 security 問題有效，超越傳統 model。"
> （LLM 對 security 問題的正確率比專門 model 更高。）

### Section 6｜Q&A 4：Prompt Injection 與 Privacy（55:00 ~ 60:00）

**重點摘要**：prompt injection 防禦與隱私設計。

**內容：**
- **Prompt injection** — 攻擊者透過 input 繞過安全機制
- Runtime 防禦：sanitize input、限制 subcomponent access
- Privacy：de-identified / synthetic data、傳輸加密
- 從 day one 設計 privacy，事後補救不可行

> "you have to sanitize the input and use it carefully and correctly."
> （必須 sanitize input 並謹慎使用。）

### Section 7｜總結 + Day 5 預告（60:00 ~ 62:46）

**重點摘要**：Q&A 結束，預告 Day 5 主題。

**內容：**
- Med-PaLM V2 的 ensemble refinement（ER）
- Day 5 主題：evals 與 MLOps for generative models

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 3 分 08 秒（silent ratio 7.08% ✅）
> 口播稿原文：transcripts/20260620_Kaggle_5DayGenAI_Day4_口播稿.txt

- [opus 1.4 MB](../audio/20260620_Kaggle_5DayGenAI_Day4.opus)（Telegram 友善）
- [m4a 3.0 MB](../audio/20260620_Kaggle_5DayGenAI_Day4.m4a)（iOS 友善）
- [mp3 2.8 MB](../audio/20260620_Kaggle_5DayGenAI_Day4.mp3)（通用格式）

## 三、人物/角色分析

### Paige Bailey
- **背景**：Google 主講人，Gen AI Intensive 課程 host
- **角色**：引導 Q&A，主持本系列 Day 1-5

### Chris（Google Research / Health AI）
- **背景**：Health AI 研究員
- **代表觀點**：MedQA benchmark 進展，但「真實臨床 ≠ multiple choice」

### Antonio（Office of the CTO, Google Cloud）
- **背景**：Google Cloud Office of the CTO 主管
- **代表觀點**：domain-specific model 的 trade-off 與最佳化

### Scott（Security）
- **背景**：cybersecurity 專家，從事 security AI 數十年
- **代表觀點**：LLM 對 security 問題的應用與 prompt injection 防禦

### Christopher（Med-PaLM / Privacy）
- **背景**：醫療 AI 與隱私專家
- **代表觀點**：Med-PaLM 進展與 privacy 設計

### Umesh（Security）
- **背景**：security AI 應用
- **代表觀點**：end-to-end security 系統的 LLM 角色

## 四、關鍵概念定義表

| 概念 | 定義 | 應用 |
|------|------|------|
| **Grounding** | 讓 LLM 取得外部即時資訊（搜尋、API） | factuality |
| **RAG** | Retrieval-Augmented Generation，搜尋增強生成 | dynamic context |
| **Med-PaLM** | Google 醫療領域 LLM | healthcare |
| **Sec-PaLM** | Google cybersecurity 領域 LLM | security |
| **MedQA** | 醫學生執照風格多選題 benchmark | medical eval |
| **Ensemble Refinement (ER)** | Med-PaLM V2 的 ensemble 改進技術 | medical accuracy |
| **Prompt Injection** | 透過 input 操控 LLM 行為的攻擊手法 | security |
| **Domain-Specific Model** | 為特定領域微調的 LLM | vertical AI |
| **Context Caching** | 快取常見 context 降低成本 | efficiency |
| **De-identified Data** | 移除個資的訓練資料 | privacy |
| **Synthetic Data** | 人工生成的訓練資料 | privacy + scale |
| **Fine-tuning** | 在 base model 上針對特定任務微調 | domain adapt |
| **Function Calling** | LLM 呼叫外部 function 的能力 | tool use |
| **Adversarial AI** | 對抗式 AI 研究 | security |
| **MLOps** | ML 系統的 DevOps 實務 | production |

## 五、核心主旨

> Day 4 建立 domain-specific Gen AI 的設計哲學：**通用 LLM 是起點，domain-specific model 與 grounding 機制才是落地應用的關鍵**。Healthcare 與 security 是兩個最嚴苛的試金石。

## 六、金句摘錄

1. "use grounding and you can utilize it in your applications as well." — Grounding 價值
2. "It really depends on the specific use case." — 沒有最佳模型
3. "you have to sanitize the input and use it carefully and correctly." — Prompt injection 防禦
4. "Probably. Somebody's going to get there." — MedQA 100%
5. "LLM 對 security 問題的正確率比專門 model 更高" — 通用 LLM 價值
6. "ensemble refinement" — Med-PaLM V2 改進技術
7. "evals 與 MLOps" — Day 5 主題

## 七、延伸閱讀

- Med-PaLM（Google Research, 2024）— Healthcare domain LLM
- Sec-PaLM（Google, 2023）— Cybersecurity LLM
- MedQA Benchmark（USMLE-style）— 醫療 AI 評估
- Kaggle 5-Day Gen AI Intensive Course（2024-2026）

## 八、與 Day 1-3 系列的關係

**重要**：Day 1-3 是「5-Day AI Agents Intensive Vibe Coding」系列（Smitha × Anant 主講，2026 年），Day 4-5 是「5-Day Gen AI Intensive」系列（Paige Bailey 主講，更早期版本）。**兩者為不同課程**，但都來自 Kaggle × Google 合作。本 note 與 Day 1-3 在同一 repo 僅因為當天 user 同時排入佇列。