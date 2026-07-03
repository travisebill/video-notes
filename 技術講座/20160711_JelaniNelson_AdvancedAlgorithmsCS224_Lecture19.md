# 【Harvard CS224 高階演算法 — Lecture 19：Multiplicative Weights 與專家意見的競爭式分析】

**主講｜Jelani Nelson（Harvard 計算機科學教授）/ 2016年7月11日上傳 / 81分鐘**

---

> **影片連結**：https://youtu.be/R9mT5CtdHLg
> **影片時長**：1 小時 21 分鐘（4893 秒）
> **分類**：技術講座
> **主題**：📚 算法 / 計算機科學理論
> **章節**：YouTube 無官方章節，由逐字稿分析整理
> **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照

---

## 一、主題與背景

這是 Harvard CS224「Advanced Algorithms（高階演算法）」2014 年秋季學期（f14）的第 19 堂課，主講者為 Jelani Nelson 教授。前幾堂課覆蓋了單純形法、橢圓體法、內點法三大 LP 求解器；本堂正式從 LP 專題轉進一種更通用的演算法範式——乘法權重法（Multiplicative Weights）。這個方法不只是另一個 LP 工具，而是處理「聽取專家意見」問題的通用框架，應用遠超線性規劃。

課程設計的重點：

- **從 LP 工具到通用方法**：乘法權重法橫跨線上學習、賽局理論、近似演算法、機器學習 boosting
- **競爭式分析**：與事後回頭看最準的專家表現接近——「相對而非絕對」的目標設定
- **多數決的失敗**：無記憶的策略在最壞情況下與最差專家一樣差
- **指數衰減的權重**：表現好的專家權重越高，表現差的越來越低
- **期望後悔界**：總期望損失的精確上界，能用 epsilon 平衡 trade-off

---

## 二、章節脈絡

### Section 1｜從 LP 工具到通用方法

**重點摘要：** 教授回顧前幾堂課的 LP 求解器，正式宣布轉向乘法權重法，並強調這個方法的跨領域通用性。

**內容：**

**前情提要：**
- 前幾堂覆蓋單純形法、橢圓體法、內點法三大 LP 求解器
- 之後不再以「求解 LP」為主要場景
- 乘法權重法將橫跨更多應用領域

**應用範圍：**
- 線上學習（online learning）
- 賽局理論（game theory）
- 近似演算法（approximation algorithms）
- 機器學習的 boosting
- 資訊理論的編碼

**脫離 LP 專題：**
- 從這裡開始進入更廣泛的演算法範式學習階段
- 不再以 LP 為主軸，而是建立可重用的工具箱

---

### Section 2｜聽取專家意見的設定

**重點摘要：** 定義聽取專家意見問題的基本設定、目標函數（競爭式分析）以及其巧妙之處。

**內容：**

**問題設定：**
- 有 N 位專家、T 個日子
- 每天每個專家給出 yes 或 no 的預測
- 你需要根據所有專家過去的表現做決策
- 目標：與事後回頭看最準的那位專家表現接近

**競爭式分析的目標：**
- 不是要求你預測未來
- 而是要求你不比最佳專家差太多
- 也就是所謂的「competitive with the best expert in hindsight」

**目標的巧妙之處：**
- 承認專家群體可能完全無知
- 但只要其中一位專家偶爾正確，你就能從中獲益
- 這個「相對而非絕對」的目標設定避免了對未來的硬性要求
- 在實際應用中，這個框架已成為線上廣告競價與推薦系統的理論基礎

> 「There's lots of so-called self-proclaimed experts who tell you what to buy so that you make money, and you're not sure which one to listen to. So, you want some strategy for deciding which one to listen to.」

---

### Section 3｜多數決的失敗

**重點摘要：** 從最直觀的多數決出發，展示無記憶策略在最壞情況下完全沒有競爭保證。

**內容：**

**多數決演算法：**
- 每天聽取所有專家意見，採多數者勝
- 完全沒用到專家的歷史表現
- 每天都從零開始

**失敗案例：**
- 一個專家可能前一天全對、後一天全錯
- 多數決不會因此調整權重
- 即使存在完美專家，只要其他專家中存在特定共謀的多數群體，多數決就會被誤導

**理論限制：**
- 多數決在最壞情況下與最差專家一樣差
- 沒有任何競爭保證
- 凸顯出「用歷史資訊調整權重」的必要性

> 「If you don't define your measure of success appropriately, this is a hopeless problem. Because it might just be the case that none of the experts know anything.」

---

### Section 4｜乘法權重法核心

**重點摘要：** 引入乘法權重法的核心機制——指數衰減的權重更新加上機率性抽樣決策。

**內容：**

**權重初始化：**
- 每個專家的權重初始都為 1

**權重更新規則：**
- 對的專家：權重不變（或乘以接近 1 的因子）
- 錯的專家：權重乘以 (1 - ε)
- 表現好的專家權重越來越高
- 表現差的專家權重越來越低

**決策方式：**
- 依照權重比例做機率性抽樣
- 期望錯誤率接近最佳專家
- 這個機制有兩個關鍵設計：
  - 權重的指數衰減讓表現差的專家迅速被淘汰，但又不會完全歸零而失去重新崛起的機會
  - 機率性抽樣保證單日表現不會因某次意外而完全主導

**為什麼有效：**
- 用歷史表現累積證據
- 透過指數衰減快速聚焦到好專家
- 用機率性抽樣避免極端決策

---

### Section 5｜權重更新的數學分析

**重點摘要：** 用 Φ_T（所有專家權重之積）作為勢能函數，證明期望後悔衰減率為 √(log N / T)。

**內容：**

**勢能函數 Φ_T：**
- Φ_T = Σᵢ wᵢ(T)，所有專家權重之和
- 當某天犯錯時，所有錯的專家權重都乘以 (1 - ε)
- Φ_T 至少減半（假設至少一位專家犯錯）
- 因此至多犯 log N 次錯就把所有專家淘汰

**從「至多 log N 次錯」到「期望後悔界」：**
- 推廣到每次犯錯減少固定比例
- 得到總期望損失的精確上界：
  E[Σₜ cₜ · pₜ] ≤ min_i Σₜ cₜ(i) + ε · Σₜ |cₜ| + log N / ε

**最佳 epsilon 選擇：**
- 對所有 ε 通用，可以自由選 ε
- 選 ε = √(log N / T)，讓兩項 trade-off 平衡
- 得到期望後悔衰減率為 O(√(log N / T))

**這個界的理論意義：**
- 是乘法權重法的理論極限
- 任何線上學習演算法在沒有額外結構假設下都無法超越 O(√T) 的後悔界
- 證明完全基於代數與機率，不需要假設專家表現有任何特殊結構
- 讓它在實務應用中極具魯棒性

> 「There's a very natural algorithm and the analysis is just an elementary use of calculus and probabilities.」

---

## 三、關鍵概念定義

| 概念 | 定義 |
|------|------|
| **乘法權重法（Multiplicative Weights）** | 用指數衰減更新專家權重的線上學習演算法 |
| **競爭式分析（Competitive Analysis）** | 演算法表現與事後最佳固定策略的比較 |
| **專家意見問題（Expert Advice）** | N 位專家、T 個日子，目標是與最佳專家表現接近 |
| **期望後悔（Expected Regret）** | 演算法的期望損失減去最佳固定專家的損失 |
| **勢能函數 Φ_T** | 所有專家權重之和；犯錯時單調遞減 |
| **Loewner 序** | PSD 矩陣上的偏序；B - A 為 PSD 則 A ⪯ B |
| **權重更新規則** | 對的專家權重不變；錯的乘以 (1 - ε) |
| **多數決（Majority Vote）** | 無記憶策略；每天從零開始 |
| **線上學習（Online Learning）** | 序列決策問題；每步根據歷史調整策略 |
| **賽局理論（Game Theory）** | 多人決策問題；乘法權重法可達納許均衡 |
| **Boosting** | 機器學習中把弱學習器組合成強學習器的方法 |

---

## 四、核心數據

| 數據 | 說明 |
|------|------|
| 1 小時 21 分鐘（4893 秒） | 影片總長度 |
| 35,826 字元 | 英文逐字稿字元數（清理 VTT 時間碼、HTML 標籤後） |
| 7,287 字 | 英文逐字稿單字數 |
| 1,525 字元 | 繁中口播稿字元數（含標點空白） |
| 1,142 字 | 繁中口播稿漢字數 |
| 31 句 | 口播稿總句數 |
| 40 個逗號 | 口播稿總逗號數 |
| 7.97% | L19 silent ratio（Bar 3 通過） |
| 4.6 MB | m4a 音檔大小 |
| 2.3 MB | opus 音檔大小 |
| O(√T) | 期望後悔衰減率（最佳可能） |
| log N | 勢能函數的最大減少次數 |

---

## 五、核心主旨

> 乘法權重法展示了「用歷史資訊調整權重」的優雅：透過指數衰減與機率性抽樣，演算法的期望表現逼近最佳固定專家，後悔衰減率為 O(√T)。這個界的證明完全基於代數與機率，不需要對專家表現做任何結構假設，因此極具實務魯棒性。更重要的是，這個方法不只是另一個 LP 工具，而是處理「與最佳固定策略競爭」問題的通用框架——從線上學習到賽局理論，從近似演算法到機器學習 boosting，都能看到它的影子。深入理解這個方法對任何演算法研究者都是值得的投資。

---

## 六、金句摘錄

1. 「There's lots of so-called self-proclaimed experts who tell you what to buy so that you make money, and you're not sure which one to listen to.」

2. 「If you don't define your measure of success appropriately, this is a hopeless problem. Because it might just be the case that none of the experts know anything.」

3. 「Be competitive with the best expert in hindsight. At the end of the T days, you're going to look back at each expert and see how many mistakes that expert made.」

4. 「The simplest thing you can imagine doing in this model is just take a majority vote. But this completely ignores history.」

5. 「On every day when we make a mistake, at least half of the population of the experts gets killed. So we can make at most log N errors before we kill everybody.」

6. 「The weights of experts who were right stay the same, and the weights of experts who were wrong get multiplied by (1 - ε).」

7. 「So Φ_T is at most Φ_0 · (1 - ε)^{number of mistakes} · exp(ε · Σ |mₜ|).」

8. 「By calculus, (1 - ε)^k ≤ exp(-εk). So that's how the analysis works.」

9. 「The regret is the difference between your performance and the best expert in hindsight. And we showed that the regret is at most O(√(T log N)).」

10. 「Multiplicative weights is one of those rare algorithmic tools that bridges multiple subfields of theoretical computer science.」

---

## 七、備註

- **字幕來源**：YouTube 英文自動字幕（en auto-caption）+ 繁體中文自動字幕（zh-Hant auto-caption）雙語交叉對照
- **未使用 Whisper**：影片有完整 YouTube 自動字幕（zh-Hant 與 en），無需 Whisper fallback
- **無官方章節**：YouTube 影片 metadata 無 chapters，本筆記的章節由逐字稿時序分析整理
- **英文逐字稿字數**：35,826 字元（清理 VTT 時間碼、HTML 標籤後）
- **本筆記引用以 en 字幕為主**，zh-Hant 用於中文關鍵概念對照
- **TTS 口播稿另見**：`transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture19_口播稿.txt`
- **本筆記以繁體中文撰寫**，專業術語（Multiplicative Weights、competitive analysis、boosting 等）保留英文原文並附中文說明
- **語音導覽 voice id**：`xiaotian_clone_v1`（禮士聲音 clone）
- **語音導覽 model**：`speech-2.8-hd`

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone: xiaotian_clone_v1, model: speech-2.8-hd），約 4 分 37 秒
> 口播稿原文：transcripts/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture19_口播稿.txt

- [opus 2.3 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture19.opus)（Telegram 友善）
- [m4a 4.6 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture19.m4a)（iOS 友善）
- [mp3 4.2 MB](../audio/20160711_JelaniNelson_AdvancedAlgorithmsCS224_Lecture19.mp3)（通用格式）