# 【No Vibes Allowed: Solving Hard Problems in Complex Codebases】
## 影片基本資訊

> **影片連結：** https://youtu.be/rmvDxxNubIg
> **影片長度：** 20:31
**Dex Horthy（HumanLayer）｜2025-05｜AI Engineer Conf**

---

## 一、主題與背景

- **講者身份：** Dex Horthy，HumanLayer 創辦工程師，長期研究 AI coding agents 實戰方法
- **影片類型：** 技術演講（Engineering Talk）
- **核心議題：** 如何透過「情境工程」（Context Engineering）讓 AI coding agent 在 brownfield（大規模 legacy）程式碼庫中真正發揮效用，而非產出一堆「slop」（技術債垃圾）

---

## 二、章節脈絡

### Section 1｜問題現狀：AI 真的能幫工程師嗎？（00:00 ~ 04:30）

**重點摘要：** 大多數 AI 輔助開發在複雜程式碼庫中表現不佳，產生大量 rework 與 tech debt

**內容：**
- Igor 的調查（100,000 開發者）：多數時候用 AI 寫 code = 大量重工 + 產出 slop
  > 「你確實交付了更多，但大部分只是在 rework 上週發佈的垃圾」
- Greenfield（小規模新專案）效果佳；Brownfield（10 年以上 legacy code）效果差
- **Context Engineering 是解法**：如何在當前模型限制下最大化產出

---

### Section 2｜Context Engineering 基本概念（04:30 ~ 09:00）

**重點摘要：** LLMs 並非純函式——輸出品質完全取決於 context window 裡的 tokens

**內容：**

- **LLMs 不是 pure function**：它們是非確定性的，但有狀態（stateless）
  > 「讓 LLM 變強的唯一方法：放更好的 tokens 進去，然後得到更好的 tokens 出來」
- 每次 tool call 的決策鏈：對話中已有的內容決定下一個 token 的選擇
- **Context 最佳化目標**：correctness、completeness、size、trajectory
- **Trajectory 陷阱**：不斷指責 AI 犯錯 = 強化它繼續犯錯的機率
  > 「LLM 會想：好吧我又做錯了，人類又罵我，下次我最好再做錯，這樣人類才會再罵我一次」

---

### Section 3｜Dumb Zone 理論（09:00 ~ 12:00）

**重點摘要：** Context window 超過 40% 使用率時，AI 表現開始顯著下降

**內容：**

- **The Dumb Zone**：以 Claude Code 為例，~40% context 使用率是關鍵臨界點
  > 「如果你有太多 MCPs，你的 coding agent 整個都在 dumb zone 運作，永遠不會有好結果」
- Context 使用越多 → 結果越差（Jeff Huntley 的研究）
- 解決方案：**Intentional Compaction**（刻意壓縮）

---

### Section 4｜Compaction 三大技術（12:00 ~ 16:00）

**重點摘要：** 透過 Subagents、按需壓縮、頻繁 Compaction 三層手法控制 context

**內容：**

#### 4.1 Subagents（子代理）
- **用途：控制 context，不是人格化角色**
- 做法：fork 新 context window 做搜尋/理解，回傳極簡結論給 parent agent
- 範例：讓 subagent 去理解某個 300,000 行 Rust code base，回傳「目標檔案在此」

#### 4.2 On-Demand Compressed Context（按需壓縮）
- 不要在 repo 裡寫死一堆 onboarding 文件 → 會過時（lies in documentation）
- 做法：用 research prompt 啟動 subagents，主動掃描 code base，建立「當下真實」的壓縮上下文
  > 「我們壓縮的是 truth」

#### 4.3 Frequent Intentional Compaction（頻繁刻意壓縮）
- 核心 workflow：**Research → Plan → Implement**
- 目標：整個團隊的 workflow 都圍繞 context 管理建立，永遠保持在 smart zone

---

### Section 5｜Research-Plan-Implement Workflow（16:00 ~ 19:00）

**重點摘要：** RPI 是實戰中發現最有效的三階段框架

**內容：**

#### Research 階段
- 理解系統運作方式、找到對的檔案、保持客觀
- 輸出：research prompt + 研究文件（vertical slice of codebase）

#### Plan 階段
- 壓縮意圖（compression of intent）
- 包含：具體步驟、檔案名稱+行號、測試方式
- **納入 code snippet**：讓團隊成員一眼看出要發生什麼變化
  > 「我沒辦法只看 plan 就知道實際會發生什麼 code 變更，所以我們迭代到 plan 裡包含 actual code snippets」

#### Implement 階段
- 嚴格按照 plan 執行
- 保持 low context

---

### Section 6｜實戰案例與Limits（19:00 ~ 20:30）

**重點摘要：** 7 小時產出 35,000 行 BAML code，但 Hadoop dependency removal 失敗

**內容：**

- **成功案例：** 與 ViBob（BoundaryML CEO）合作，一次修復 300,000 行 Rust code base，7 小時產出 35,000 行 code
- **失敗案例：** 嘗試移除 Parquet Java 的 Hadoop dependency → 最終放棄，回到白板重構
  > 「到了某個點，我們把所有東西丟掉，回到白板，問：這到底要怎麼整合？」

---

### Section 7｜Spec-Driven Dev 已死（20:30 ~ 結束）

**重點摘要：** 不要外包思考，AI 只是放大器

**內容：**

- **不要外包思考**：AI 無法取代思考，只能放大你已經做過的思考（或你沒做的思考）
- **Spec-driven dev 已無意義**：Martin Fowler 說的「語義擴散」（semantic diffusion）——術語太好用於 100 種不同場景，最後變無意義
- **沒有銀彈**：沒有完美的 prompt，沒有完美的 tool
- **Harness Engineering = Context Engineering 的一部分**：整合 Codex、Claude、Cursor 等工具的方式
- **最終忠告：**
  > 「爛的 code 是一行爛 code。爛的 plan 可能是 100 行爛 code。爛的 research = 你讓 model 朝完全錯誤的方向走」

---

## 三、關鍵概念定義表

| 概念 | 定義 | 應用場景 |
|------|------|---------|
| **Slop** | AI 大量產出、但品質低落的技術債 code | Brownfield code base 中常見的問題 |
| **Context Engineering** | 管理 LLMs context window 的紀律，最大化有效 tokens | 所有 AI coding tasks 的核心框架 |
| **Dumb Zone** | Context 使用 > 40% 時，AI 表現開始明顯下降的區間 | 診斷 agent 效能瓶頸 |
| **Intentional Compaction** | 刻意將現有 context window 壓縮成 markdown 檔案 | 每次 agent 偏離軌道時使用 |
| **Subagent** | Fork 新 context window 執行特定任務後回傳結論 | 大型 code base 的探索任務 |
| **Mental Alignment** | 團隊成員對 code base 變化的共同理解 | 透過 plan review 維持 |
| **Semantic Diffusion** | 術語被濫用於太多不同場景而失去精確定義 | Spec-driven dev 的問題 |
| **Harness Engineering** | 如何與 Codex/Claude/Cursor 等工具整合的客製化方式 | Context engineering 的子領域 |

---

## 四、核心主旨

> AI coding agent 的瓶頸不在模型本身，而在於你如何餵给它正確、适量、可執行的 context——Context Engineering 是將 AI 從「產生 slop 的機器」變成「真正解決複雜問題的伙伴」的關鍵紀律。

---

## 五、金句摘錄

1. > 「LLM 變強的唯一方法：放更好的 tokens 進去，然後得到更好的 tokens 出來」
2. > 「如果你不給 agent 做 onboarding，它就會憑空捏造（hallucinate）」
3. > 「LLM 在看的對話：好吧我又做錯了，人類又罵我，下次我最好再做錯，這樣人類才會再罵我一次」
4. > 「Subagents 不是用來人格化角色，而是用來控制 context」
5. > 「爛的 code 是一行爛 code。爛的 plan 可能是 100 行爛 code。爛的 research = 你讓 model 朝完全錯誤的方向走」
6. > 「AI 無法取代思考，只能放大你已經做過的思考（或你沒做的思考）」
7. > 「沒有銀彈。沒有完美的 prompt。如果你真的想要一個 hype word，這叫 harness engineering」

---

## 六、延伸思考與團隊建議

### 給技術領導者的行動項目

1. **選一個工具，累積足夠的實戰經驗**：不要在不同模型間不斷切換
2. **建立 context 管理為核心的 workflow**：Research → Plan → Implement（RPI）
3. **用 plan + code snippets 取代 plain prompts**：團隊才能做 code review
4. **把 mental alignment 視為首要目標**：隨著 AI 產出增加，保持團隊共識比以往更難也更更重要
5. **不要讓 junior 用 AI 取代思考**：需要 senior 建立正確的 context 框架

### 常見錯誤

| 錯誤 | 為什麼錯誤 |
|------|-----------|
| 對 AI 犯錯一直指責 | 強化負面 trajectory |
| 在 repo 寫死大量 onboarding 文件 | 文件會過時（lies），且佔用 smart zone |
| 讓 subagent 做人格化分工 | 應用於控制 context，不是取代團隊角色 |
| 過度依賴 markdown 檔案 | 容易變成「讓你感覺良好」的 noise |
| Spec-driven dev 作為銀彈 | 術語已 semantic diffusion，意義已經模糊 |

---

## 七、參考資源

- **演講者：** Dex Horthy（HumanLayer）
- **相關研究：** Jeff Huntley「Coding Agents 表現與 Context 使用量負相關」
- **Martin Fowler：** Semantic Diffusion（2006）
- **Memento（電影）：** Dex 稱之為「最好的 context engineering 教材」
- **HumanLayer 官網：** humanlayer.ai
- **原始 Talk：**[AI Engineer June Conf - 12-Factor Agents](https://www.youtube.com/watch?v=rmvDxxNubIg)

---

*本筆記由 Whisper（small model）聽寫 + AI 整理，繁體中文版本*
