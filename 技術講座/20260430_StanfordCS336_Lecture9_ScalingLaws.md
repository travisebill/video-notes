# 【Stanford CS336 Language Modeling from Scratch — Lecture 9：Scaling Laws — Kaplan、Chinchilla 與 Compute-Optimal Frontier】

**主講：Percy Liang & Tatsu Hashimoto｜Stanford CS336 第三版｜Spring 2026**

> 影片連結：https://youtu.be/Q15rhEWZPQ4
> 影片時長：1 小時 17 分 57 秒（4677s）
> 性質：大學課程第九講 — 訓練 LLM 的「最佳模型大小 vs 資料量」權衡
> 來源：YouTube 自動英文字幕（en-US auto VTT，已清除時間碼）
> 英文逐字稿：transcripts/20260430_StanfordCS336_Lecture9_ScalingLaws_逐字稿_en.txt
> **整理日期**：2026-04-07
> **課程**：Stanford CS336 Language Modeling from Scratch
> **講者**：Percy Liang, Tatsu Hashimoto

---

## 一、主題與背景

Lecture 9 從 systems（L5-8 的 GPU / Triton / Parallelism）轉向 **訓練策略的數學基礎**——Scaling Laws。本講從 Kaplan et al. 2020 的經典 scaling laws 開始，延伸到 Hoffmann et al. 2022 的 **Chinchilla paper**，定義了現代 LLM 訓練的 **compute-optimal frontier**：給定訓練算力 C，最佳模型大小 N 和訓練 tokens D 應該如何分配。

**核心議題一句話**：Scaling Laws 揭示 LLM 的 loss 是模型大小 N、訓練 tokens D、訓練算力 C 的冪律函數（power law）；Chinchilla 證明 Kaplan 2020 高估了模型大小——同等算力下，**70B 模型應該訓練在 1.4T tokens 上**，而不是 Kaplan 建議的 280B tokens。這重新定義了 GPT-4 / Claude / Gemini 等旗艦模型的訓練策略。

---

## 二、章節脈絡

### Section 1｜開場：Scaling Laws 為什麼重要（00:00 ~ 08:00）

**重點摘要：** Scaling Laws 是 LLM 訓練的「事前設計指南」——不必訓練完才知道模型好不好，可以從小模型推算大模型表現。

**內容：**
- LLM 訓練成本極高（一個 run 可能 100M USD），不能靠 trial and error
- Scaling Laws 提供從小模型預測大模型表現的能力
- 兩個里程碑：Kaplan 2020 + Chinchilla 2022

### Section 2｜Kaplan 2020 Scaling Laws（08:00 ~ 25:00）

**重點摘要：** Kaplan et al. (OpenAI) 2020 首次系統性研究 LLM 的 scaling behavior。

**內容：**
- **冪律關係**：Loss L(N, D) = (N_c/N)^α_N + (D_c/D)^α_D + L_∞
  - 模型大小 N、訓練 tokens D 各自有冪律貢獻
  - L_∞ 是 irreducible loss
- **Kaplan 的建議**：給定算力 C，模型大小 N 應該 scaling 大，訓練 tokens D 相對不重要
  - Kaplan 建議 70B 模型訓練在 280B tokens
- **方法**：訓練多個 sizes × datasets，用 regression 擬合冪律

### Section 3｜Chinchilla 2022 — 重新定義最佳分配（25:00 ~ 45:00）

**重點摘要：** Hoffmann et al. (DeepMind) 2022 重新跑 scaling laws，發現 Kaplan 高估了模型大小。

**內容：**
- **方法差異**：Chinchilla 更嚴格控制算力 C = 6ND（forward + backward），跑更廣泛的 N × D combinations
- **核心發現**：N_opt ∝ C^0.5，D_opt ∝ C^0.5
  - 模型大小和訓練 tokens **同等重要** scaling
  - 每 2x 算力 → 模型 1.41x + tokens 1.41x
- **Chinchilla 結論**：70B 模型應該訓練在 ~1.4T tokens（4.5x Kaplan 建議的 280B）
- **衝擊**：所有 major labs 重新調整訓練策略——更多資料、更小模型、更長訓練

### Section 4｜Compute-Optimal Frontier 的設計含義（45:00 ~ 60:00）

**重點摘要：** Chinchilla 給出 LLM 訓練的「最佳投資組合」：同等算力下，小模型 + 多資料 永遠勝過 大模型 + 少資料。

**內容：**
- **過參數化（over-parameterization）成本**：模型遠大於 compute-optimal 點 → 浪費算力
- **訓練算力 vs 推論算力 trade-off**：小模型（chinchilla-optimal）推論成本低，但能力可能受限
- **下游任務表現**：chinchilla-optimal 模型在多數 benchmark 表現更好，但極端任務（如長 context reasoning）可能過參數化更佳
- **例外**：Inference-optimal 模型（如 GPT-4）可能選擇 over-parameterization，因為推論成本是 amortized over millions of users

### Section 5｜Scaling Laws 的實務應用（60:00 ~ 72:00）

**重點摘要：** Scaling Laws 不是「完美的預測」，而是用於做粗略的 capacity planning。

**內容：**
- **能力 vs 算力**：訓練 loss 下降不代表所有能力都 gain，有些 emergent abilities（few-shot, reasoning）只在特定 scale 才出現
- **資料品質**：Scaling Laws 假設資料均質，但實際上 data quality matters（filtered 高品質資料 > 未過濾）
- **Chinchilla 之後的新工作**：繼續 refine scaling laws（e.g., data-constrained regime、multi-modal scaling）

### Section 6｜Q&A + 下週預告（72:00 ~ 77:57）

**重點摘要：** 預告下週 Lecture 10 進入 Inference。

**內容：**
- Inference 有獨特的 memory / latency / throughput 權衡
- 訓練好的模型在 deployment 階段需要 KV cache、speculative decoding 等技術

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Scaling Law** | Loss 是模型大小 N 與訓練 tokens D 的冪律函數；L(N, D) = (N_c/N)^α + (D_c/D)^β + L_∞ |
| **冪律（Power Law）** | Loss ∝ N^(-α) 或 D^(-β)；β/α 比例決定 trade-off |
| **Compute-Optimal Frontier** | 給定算力 C = 6ND，最大化能力（最小化 loss）的 (N, D) 組合 |
| **Chinchilla Optimal** | N_opt ∝ C^0.5, D_opt ∝ C^0.5；模型大小與訓練 tokens 同等 scaling |
| **Kaplan Optimal** | N_opt scaling 比 D_opt 快；偏向大模型、少量訓練 |
| **Over-Parameterization** | 模型遠大於 compute-optimal；訓練算力浪費在不必要的參數上 |
| **Emergent Abilities** | 在特定 scale 才出現的能力（few-shot, chain-of-thought reasoning） |
| **Data Quality** | 高品質過濾資料的 scaling 表現優於未過濾 |

---

## 四、重要引用

> "Kaplan said: scale models fast, don't worry about data. Chinchilla said: scale both equally." — Tatsu 總結兩種 scaling 哲學的核心差異

> "For every 2x compute, you should scale model by 1.41x AND tokens by 1.41x." — Chinchilla 的核心結論

> "Chinchilla-optimal models win on benchmarks, but inference-optimal models (like GPT-4) may choose over-parameterization because inference cost is amortized over millions of users." — 訓練 vs 推論的 trade-off

---

## 五、人物 / 角色分析

**Percy Liang & Tatsu Hashimoto**：Lecture 9 是兩位教授共同主講，標誌著從 Lecture 5-8 systems 主軸（Tatsu 為主）轉向 Lecture 9-11 的「設計權衡」主題。Scaling Laws 是現代 LLM 設計的核心方法論，需要兩位共同講解。

---

## 六、核心主旨總結

CS336 Lecture 9 把 LLM 訓練從「systems」推進到「設計權衡」：Scaling Laws 揭示 loss 是 N 與 D 的冪律函數，Chinchilla 證明 Kaplan 2020 高估模型大小——同等算力下 70B 應該訓練在 1.4T tokens。Compute-optimal frontier 是現代 LLM 訓練的設計指南，但 inference-optimal 模型可能選擇 over-parameterization 做為 trade-off。

---

## 七、金句摘錄

- "Kaplan said: scale models fast, don't worry about data. Chinchilla said: scale both equally."
- "For every 2x compute, you should scale model by 1.41x AND tokens by 1.41x."
- "Chinchilla-optimal models win on benchmarks; inference-optimal models may choose over-parameterization."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260430_StanfordCS336_Lecture9_ScalingLaws_口播稿.txt

- [opus X.X MB](../audio/20260430_StanfordCS336_Lecture9_ScalingLaws_口播稿.opus)
- [m4a X.X MB](../audio/20260430_StanfordCS336_Lecture9_ScalingLaws_口播稿.m4a)
- [mp3 X.X MB](../audio/20260430_StanfordCS336_Lecture9_ScalingLaws_口播稿.mp3)