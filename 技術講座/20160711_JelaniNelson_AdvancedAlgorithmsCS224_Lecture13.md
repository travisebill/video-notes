# 【Harvard CS224 高階演算法 — Lecture 13：主題模型學習（Guest Lecture by Runge, Microsoft Research）】

**主講｜Runge（Microsoft Research 後博士）/ 2016年7月11日上傳 / 82 分鐘**

---

> **影片連結**：https://youtu.be/VuM1WnwEMRQ
> **影片時長**：82 分鐘（4906 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption）

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms（高階演算法）」2014 年秋季學期（f14）的第十三堂課，**由 Microsoft Research 的後博士 Runge 客座講演**，主題是「**主題模型學習（Learning Topic Models）**」：把演算法設計技術應用到機器學習，從理論電腦科學的角度處理文本分析問題。Jelani Nelson 教授本日缺席。

課程設計的重點：

- **機器學習兩大主流**：監督式學習給定標註資料學習預測函數；非監督式學習從未標註資料中找出結構
- **主題模型的生成模型**：每個文件是主題分佈、每個主題是字詞分佈、文件中的字從主題中抽樣
- **anchor word 假設**：每個主題至少有一個 anchor word，這個 word 只在這個主題下有非零機率
- **演算法設計技術的橋接**：把演算法課程學到的技術帶到機器學習研究，特別是 streaming 與 privacy

---

## 二、章節脈絡

### Section 1｜機器學習背景介紹

**重點摘要：** Runge 先介紹機器學習的兩大主流與主題模型在其中的位置。

**內容：**
- 監督式學習：給定標註資料學習預測函數，例如垃圾郵件分類
- 非監督式學習：從未標註資料中找出結構
- 主題模型屬於非監督式學習子領域，目的是從大量文檔集合中自動發現潛在主題結構
- 強調這堂課的重點是把演算法設計技術應用到機器學習問題
- Runge 來自 Microsoft Research，研究的目標是把演算法設計技術帶到機器學習領域

> 「Today we're going to talk about learning topic models, which is part of research where we apply algorithm design techniques to machine learning problems.」

---

### Section 2｜主題模型的生成模型

**重點摘要：** 主題模型的核心是文件由主題混合產生的機率模型，三個參數需要估計。

**內容：**

**生成過程：**
- 每個文件是一個主題分佈（θ 是 k 維向量）
- 每個主題是一個字詞分佈（φ 是字詞大小的向量）
- 文件中的每個字從某個主題中抽樣得到

**三個參數：**
- 主題個數 k
- 文件的主題分佈 θ
- 字詞在主題下的分佈 φ

**參數估計挑戰：**
- 參數空間很大
- 直接最大似然估計會遇到局部極值
- 傳統 MCMC 採樣的 mixing time 問題

**LDA 連結：**
- Latent Dirichlet Allocation 是這個模型的具體實作
- 在文本挖掘領域被廣泛應用
- 文件層級的參數與主題層級的參數相互獨立

---

### Section 3｜anchor word 假設與演算法

**重點摘要：** 引入 Arora 與 Runge 的 anchor word 假設，把主題估計問題簡化為矩陣分解問題。

**內容：**

**Anchor Word 假設：**
- 每個主題至少有一個 anchor word
- 這個 word 只在這個主題下有非零機率
- 利用 anchor word 可以簡化主題估計問題

**矩陣分解框架：**
- 觀察到的字詞共現矩陣可以分解為 anchor word 對應的稀疏子矩陣
- 矩陣分解的多項式時間演算法
- 避開 MCMC 採樣的 mixing time 問題

**計算複雜度：**
- Anchor word 演算法是 poly n 的
- 比 MCMC 採樣快得多
- 不依賴 mixing time

> 「We assume each topic has at least one anchor word — a word that appears only in that topic. Using this assumption, we can reduce the topic estimation problem to a matrix factorization problem.」

---

### Section 4｜應用與延伸方向

**重點摘要：** 介紹 anchor word 技術的延伸應用與研究機會。

**內容：**

**應用場景：**
- 情感分析
- 資訊檢索
- 生物資訊中的基因表現分析

**研究機會：**
- Streaming 設定下的主題模型
- 隱私保護的主題模型
- 演算法設計技術在機器學習中還有很多未開發的空間

**橋接研究：**
- 這條研究路線是理論電腦科學家進入機器學習的橋樑
- 鼓勵學生把演算法課程學到的技術帶到機器學習研究
- 未來的研究機會在於 streaming 演算法與 differential privacy 的結合

---

### Section 5｜Q&A 與課程結論

**重點摘要：** Q&A 環節討論 anchor word 假設的合理性與計算複雜度。

**內容：**
- Q：anchor word 假設是否太強？
- A：在大規模語料下這個假設是合理的，因為主題數量遠小於詞彙量
- Q：如何選擇主題數量 k？
- A：模型選擇問題，常用方法是對多個 k 值跑演算法並用 held-out likelihood 評估
- Q：演算法對雜訊的容忍度？
- A：對小量雜訊是 robust 的，這在實務語料中很重要

> 「The anchor word assumption is reasonable in large corpora because the number of topics is much smaller than the vocabulary size.」

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **監督式學習** | 給定標註資料學習預測函數 |
| **非監督式學習** | 從未標註資料中找出結構 |
| **主題模型** | 文件由主題混合產生的機率模型 |
| **生成模型** | 描述資料如何由潛在變數生成的機率模型 |
| **Anchor Word** | 只在特定主題下有非零機率的字詞 |
| **LDA** | Latent Dirichlet Allocation，主題模型的標準實作 |
| **矩陣分解** | 把觀察矩陣分解為多個結構性矩陣的乘積 |
| **Mixing Time** | MCMC 馬可夫鏈收斂到平穩分佈所需的時間 |
| **Differential Privacy** | 隱私保護的數學定義框架 |
| **Held-out Likelihood** | 用未訓練資料評估模型預測能力的方法 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 82 分鐘（4906 秒） | 影片總長度 |
| k | 主題個數 |
| n | 詞彙量 |
| poly(n) | Anchor word 演算法複雜度 |
| 大規模語料 | Anchor word 假設合理性的條件 |

---

## 五、核心主旨

> 主題模型是機器學習中文本分析的核心工具，傳統的最大似然估計或 MCMC 採樣在實務上面臨計算效率的挑戰。Anchor word 假設結合矩陣分解的多項式時間演算法，提供了一條從理論電腦科學出發的機器學習路徑。這條路徑在 streaming 與隱私保護設定下還有更多發展空間，是理論電腦科學家進入機器學習研究的天然橋樑。

---

## 六、金句摘錄

1. 「Today we're going to talk about learning topic models, which is part of research where we apply algorithm design techniques to machine learning problems.」

2. 「A topic model is a probabilistic model where each document is a distribution over topics and each topic is a distribution over words.」

3. 「We assume each topic has at least one anchor word — a word that appears only in that topic.」

4. 「Using the anchor word assumption, we reduce topic estimation to a matrix factorization problem solvable in polynomial time.」

5. 「The anchor word assumption is reasonable in large corpora because the number of topics is much smaller than the vocabulary size.」

6. 「Algorithm design techniques have much unexplored space in machine learning, including streaming and privacy-preserving settings.」

7. 「Polynomial-time algorithms for topic modeling avoid the mixing time issues of MCMC sampling.」

8. 「Bridging theoretical computer science and machine learning is a natural research direction.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption）
- **未使用 Whisper**：影片有完整 YouTube 自動字幕，無需 Whisper fallback
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **本筆記以繁體中文撰寫**，專業術語（LDA、anchor word、MCMC、differential privacy 等）保留英文原文並附中文說明
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture13_口播稿.txt`
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 34 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture13_口播稿.txt

- [opus 2.2 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture13.opus)（Telegram 友善）
- [m4a 4.3 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture13.m4a)（iOS 友善）
- [mp3 4.2 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture13.mp3)（通用格式）