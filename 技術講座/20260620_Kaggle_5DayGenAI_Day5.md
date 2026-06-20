# DAY 5 Livestream — 5-Day Gen AI Intensive Course（Paige Bailey × Google）

**Paige Bailey + Ilya + Long + Kaz + Mark + Eric + Irwin + Miles + Guillaume + Olivia（DeepMind）（Google Research / Google Cloud / DeepMind）｜2026-06-20**

> 影片連結：https://www.youtube.com/live/uCFW0i9xrBc
> 影片時長：60:28（3628s）
> 語言：英文（YouTube 自動字幕 en-orig）
> 上傳者：Kaggle
> 來源：**5-Day Gen AI Intensive Course** Day 5（最終場）

## 一、主題與背景

本影片是 Kaggle 與 Google 共同舉辦的「5-Day Gen AI Intensive Course」第五天（最終場）的直播內容。Day 4 聚焦 domain-specific model 應用，Day 5 聚焦 **MLOps for Generative AI**——把 Gen AI 從 prototype 推向 production 的工程實踐。涵蓋 end-to-end GenAI app starter pack、Vertex AI 工具鏈、multimodal evaluation、continuous monitoring 與 drift detection。

## 二、章節脈絡

### Section 1｜開場與 Day 4 回顧（00:00 ~ 05:00）

**重點摘要**：歡迎來到最終場，MLOps 主題預告。

**內容：**
- 為什麼 fine-tuning 慢：課程學員同時打 API
- 今天主題：MLOps for Generative AI
- Side-by-side evaluation 與 accountability/transparency

### Section 2｜Code Lab：End-to-End GenAI App Starter Pack（05:00 ~ 25:00）

**重點摘要**：Ilya 展示 end-to-end GenAI 應用程式 starter pack。

**內容：**
- **Starter pack** 開箱即用的 reference 架構
- **Terraform** 快速部署
- **Vertex AI Model Garden** 模型選擇
- **Vertex AI Evaluation** 模型評估
- **BigQuery** logging 與 monitoring
- **Custom RAG Q&A** 應用範例（食譜 specialist）
- **Event streaming** 與 auto-generation of docs
- **UI playground** 供實驗

> "End-to-end GenAI app starter pack"
> （端到端 GenAI 應用 starter pack。）

### Section 3｜Q&A 1：MLOps 世代演進（25:00 ~ 35:00）

**重點摘要**：多位來賓回顧 MLOps 演進。

**內容：**
- 2010 年前後：傳統 ML 的 MLOps 起源
- Late 2010s：完整 ecosystem 出現
- 2020s：GenAI 時代加入 prompt template、chaining、continuous evaluation
- 從 platform engineering 角度的工具典範轉移

### Section 4｜Q&A 2：Multimodal Evaluation（35:00 ~ 45:00）

**重點摘要**：DeepMind Olivia 深入討論 multimodal evaluation。

**內容：**
- 不只評估文字，還要評估 image 對 prompt 的對齊
- 從 evaluation methodology 角度：task-specific 多維度評估
- 關鍵 insight：先定義 use case，再決定 metric
- Neptune eval 等工具

> "image aligned with prompt?"
> （image 與 prompt 對齊嗎？）

### Section 5｜Q&A 3：Vertex AI 工具鏈（45:00 ~ 50:00）

**重點摘要**：Vertex AI 在 GenAI MLOps 的工具組合。

**內容：**
- **Vertex AI Model Garden** — 模型選擇（quality、latency、cost、compliance）
- **Vertex AI Pipelines** — CI/CD 與 recurrent evaluation
- **Vertex AI Feature Store** + **Model Registry** — governance
- **Rapid Evaluation API** — 自動化 metrics
- **Cloud Build / Cloud Deploy** — CI/CD 工具
- **Data Plex** — 跨資料治理

> "Vertex AI Model Garden, which is where you'll pick up the model of your choice."
> （Vertex AI Model Garden 是選擇模型的地方。）

### Section 6｜Q&A 4：Continuous Monitoring 與 Drift Detection（50:00 ~ 55:00）

**重點摘要**：production 階段的 observability 與 quality 維護。

**內容：**
- 詳細 log：prompts、generated answers、user feedback、latencies
- BigQuery 集中儲存
- **Drift detection** 監控 model quality 退化
- **Guardrails** 為 mission-critical 任務的最後防線
- Auto-scaling 確保持續可用

> "ensure auto-scaling mechanisms that then point is up and running continuously."
> （確保 auto-scaling 機制讓服務持續運行。）

### Section 7｜Pop Quiz + 系列回顧 + 閉幕（55:00 ~ 60:28）

**重點摘要**：隨堂測驗回顧五天主題，正式閉幕。

**內容：**
- Pop quiz：prompt template versioning、Vertex AI pipelines、evaluation 為衡量 model output quality
- Paige 感謝 hosts、guests、白皮書團隊、社群
- 教材留在 Kaggle learner portal 供 self-paced 學習

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 3 分 08 秒（silent ratio 8.95% ✅）
> 口播稿原文：transcripts/20260620_Kaggle_5DayGenAI_Day5_口播稿.txt

- [opus 1.4 MB](../audio/20260620_Kaggle_5DayGenAI_Day5.opus)（Telegram 友善）
- [m4a 3.0 MB](../audio/20260620_Kaggle_5DayGenAI_Day5.m4a)（iOS 友善）
- [mp3 2.8 MB](../audio/20260620_Kaggle_5DayGenAI_Day5.mp3)（通用格式）

## 三、人物/角色分析

### Paige Bailey
- **背景**：Google 主講人，本系列 Day 1-5 host
- **角色**：引導 Q&A，主持本系列

### Ilya
- **背景**：code lab 講師
- **代表觀點**：end-to-end starter pack 的 reference 架構設計

### Long / Kaz / Mark / Eric / Irwin / Miles / Guillaume（Q&A 來賓）
- **背景**：Google Cloud 與 AI 團隊代表
- **代表觀點**：MLOps 工具鏈的設計與實務

### Olivia（DeepMind）
- **背景**：DeepMind evaluation 專家
- **代表觀點**：multimodal evaluation 與 alignment 評估

## 四、關鍵概念定義表

| 概念 | 定義 | 應用 |
|------|------|------|
| **MLOps for GenAI** | 把 Gen AI 模型部署到 production 的工程實務 | production deployment |
| **End-to-End GenAI Starter Pack** | 開箱即用的 reference 架構 | reference impl |
| **Terraform Deployment** | 用 Terraform 做 infrastructure-as-code 部署 | IaC |
| **Vertex AI Model Garden** | Vertex AI 的模型目錄 | model selection |
| **Vertex AI Evaluation** | Vertex AI 的模型評估服務 | eval |
| **Vertex AI Pipelines** | Vertex AI 的 CI/CD 與 recurrent eval | automation |
| **Vertex AI Feature Store** | Vertex AI 的特徵儲存 | data layer |
| **Model Registry** | 模型版本與 lineage 管理 | governance |
| **BigQuery Logging** | 用 BigQuery 集中儲存應用日誌 | observability |
| **Custom RAG Q&A** | 自訂的 retrieval-augmented Q&A 應用 | pattern |
| **Multimodal Evaluation** | 對 image + text 對齊的評估 | multi-modality |
| **Drift Detection** | 監控 model quality 是否退化 | reliability |
| **Guardrails** | LLM 應用的安全護欄 | safety |
| **Prompt Template Versioning** | prompt 模板的版本控制 | reproducibility |
| **Chaining** | 把多個 LLM 步驟串成 pipeline | orchestration |
| **Rapid Evaluation API** | 自動化的 evaluation API | automation |

## 五、核心主旨

> Day 5（最終場）建立 Gen AI MLOps 的完整圖像：**MLOps 不是 ML 的附屬品，而是 Gen AI 從實驗走向 production 的橋樑**。從 starter pack、tooling、evaluation 到 monitoring，每個環節都是 production-ready 系統的必要條件。

## 六、金句摘錄

1. "end-to-end GenAI app starter pack" — 開箱即用 reference 架構
2. "Vertex AI Model Garden" — 模型選擇的起點
3. "image aligned with prompt?" — multimodal eval 的核心問題
4. "Vertex AI pipelines" — recurrent evaluation 的正解
5. "drift detection" — production 階段的 reliability 守門員
6. "prompt template versioning" — 重現性與可審計性的基礎
7. "auto-scaling mechanisms" — 持續可用的工程保證

## 七、延伸閱讀

- Vertex AI Documentation（Google Cloud）— 工具鏈完整文件
- Generative AI Official Google Cloud Repo — starter pack 開源碼
- MLOps for Generative AI Whitepaper（Kaggle × Google, 2026）
- Multimodal Evaluation Research（DeepMind, 2024-2026）

## 八、五天系列回顧

| Day | 主題 | 重點概念 |
|-----|------|----------|
| 1 | 個體基礎 | AI agent 建構、需求規格、verification |
| 2 | protocol 群體 | A2A、MCP、UCP、AP2、A2UI、Agentic Data Cloud |
| 3 | playbook 系統 | Agent Skills、File Bus、DAG Orchestration |
| 4 | domain 應用 | Med-PaLM、Sec-PaLM、Grounding、Prompt Injection |
| 5 | production MLOps | starter pack、Vertex AI、multimodal eval、drift detection |