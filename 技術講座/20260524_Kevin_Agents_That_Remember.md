# 【Agents That Remember】
## 影片基本資訊

> **影片連結：** https://youtu.be/BacJ6sEhqMo
> **影片長度：** 10:41
**講者｜Kevin（Anthropic Engineer）｜—**
> 本影片使用 Whisper 英語聽寫（base 模型），經轉換為繁體中文逐字稿後整理成結構化筆記。

---

## 一、主題與背景

- **講者身份：** Kevin，Anthropic 工程師，專門負責 Cloud Manage Agents（CMA）平台
- **影片類型：** 技術工作坊（Workshop）+ 產品功能演示
- **核心議題：** 展示 CMA 新功能——**Agent Memory Store（記憶庫）**與**Dreaming（做夢）**機制，讓 AI Agent 能在多次對話之間保持記憶、跨 session 傳遞資訊，並透過非同步 batch 處理自動組織與豐富化記憶內容

---

## 二、章節脈絡

### Section 1｜問題陳述：Agent 孤島效應（00:00 ~ 05:30）

**重點摘要：** 說明當前 Agent 的基本限制——每個 session 彼此隔離，無法跨對話記住資訊

**內容：**
- 當前多數 Agent 平台，每個 session 是**孤立**的
- Agent 無法記住過去 session 的資訊，也無法將資訊傳遞到未來的 session
- 實際演示：建立兩個獨立 session，先後告訴 Agent 同一件事，再問它「還記得嗎」——Agent 回應「我不知道」

> 「We told it something, asked another session about it later. No information is transferred between the sessions.」
> （我們告訴它一些事，之後在另一個 session 問它，但 session 之間沒有任何資訊傳遞。）

---

### Section 2｜解決方案：Memory Store 記憶庫（05:30 ~ 15:00）

**重點摘要：** 介紹 Memory Store——一種持久化的檔案系統，Agent 可以讀寫，跨 session 保留資訊

**內容：**

#### 什麼是 Memory Store？
- 每個組織可以建立**多個** Memory Store（可依用戶、workspace 自由規劃邊界）
- 在底層，Memory Store 被 mount 為 session container 的檔案系統
- Model 具備工具可讀寫它（用 bash explore、用 grep 搜尋關鍵字、直接讀寫檔案）

#### 如何建立 Memory Store
```bash
# CLI 建立記憶庫
cma memory-stores create --name "CWC Memory" --description "Claude Workshop Content"
```

- Memory Store 建立後可在 Console UI 中看到，支援手動新增 memories
- 還可設定 access 權限：`reader`（預設，可讀寫）或 `read-only`（僅限讀取）

#### 與 Session 掛鉤
```bash
# 建立 session 時附加 memory store
cma sessions create --agent-id <id> --environment-id <id> \
  --memory-store-id <memory_store_id> \
  --prompt "Focus on remembering key details about events and links"
```

#### 實際效果演示
- 第一個 session：告訴 Agent 關於「CMA talk」的資訊（multi-agent orchestration、outcomes、memory、URL）
- Agent **主動**將資訊寫入 memory store 的 `sessions.md` 檔案
- 第二個 session（掛相同 memory store）：問它「CMA talk 講了什麼」→ Agent 用 grep 搜尋，直接從 memory store 讀取並回答

> 「The model is now first looking at memory to see, okay, was there anything that I need to remember for this conversation.」
> （模型現在會先查看記憶，確認這次對話需要記住什麼。）

---

### Section 3｜Memory Store 的額外功能（15:00 ~ 18:00）

**重點摘要：** 展示記憶庫的版本控制、手動編輯與管理能力

**內容：**
- 每個 Memory Store 和裡面的 Memory Files 都有**版本控制**，任何變更都會產生新版本
- 支援手動新增 memories、直接編輯檔案
- Console 提供檔案系統瀏覽器，可即時查看 Agent 寫入的內容
- 若 Agent 寫入錯誤或需要补充資料，可由人類直接修改

---

### Section 4｜Dreaming 做夢機制（18:00 ~ 28:00）

**重點摘要：** 面對 Memory Store 無限增長、資訊混亂的問題，Dreaming 以非同步 multi-agent 批次作業自動組織、豐富化、去重記憶

**問題背景：**
- Agent 持續讀寫 memory store，會開始**任意傾倒資訊**
- 隨時間推移，memory store 變大、缺乏組織、可能有重複或過時資訊

#### Dreaming 是什麼？
- 一個**非同步 batch 程序**，運行於背景
- 輸入：一個 input memory store + 一组 session IDs（當作 transcripts）
- 輸出：一個全新的 output memory store（不覆蓋 input，非破壞性）
- 內部是一個 **multi-agent harness**（協調者 + 每個 session 一個子 Agent）

#### Dreaming 的任務
1. **事實查核（Fact checking）**——驗證記憶中的資訊是否正確
2. **豐富化（Enriching）**——自動填入細節（日期、具體識別符等）
3. **組織合併（Consolidating）**——去除重複、整理檔案結構

#### 實際演示
```bash
# 建立 dream job
cma dreams create \
  --model "claude-opus-4.7" \
  --memory-store-id <input_memory_store_id> \
  --session-ids <session1_id> <session2_id> ...
```

- Dream job 在 Console UI 中可見，顯示進度（token count）和狀態
- 底層使用 CMA primitives：dream job 本身會建立一個 session，可進入查看內部運作細節
- 完成後顯示**差異（diff）**：建立了 `index.md`（索引檔）、豐富化了 `sessions.md`、新增了 `event-logistics.md`（完整時間表、講者名單）

> 「It's creating this event logistics file, gives the whole schedule of Code with Claude, a bunch of names as well as schedule for day two.」
> （它建立了 event logistics 檔案，列出 Code with Claude 完整議程、講者名單，以及第二天日程。）

#### 使用 Dreaming 輸出的 Memory Store
- 取得 output memory store ID後，掛載到新 session
- 測試結果：Agent 不只回答「有什麼 session」，還給出**時間戳、資源連結**等豐富資訊

---

## 三、關鍵概念定義表

| 概念 | 定義 | 備註 |
|------|------|------|
| **Session（對話）** | Agent 的單次獨立執行個體，通常是一段對話線 | Agent 的基本執行單位 |
| **Memory Store（記憶庫）** | 持久化檔案系統，作為資源掛載到 session，Agent 可跨 session 讀寫 | 可多人共用或一人一個，端看需求 |
| **Dreaming（做夢）** | 非同步 multi-agent batch 程序，輸入舊 memory + sessions，輸出整理過的新 memory store | 不修改輸入，輸出為全新 store |
| **Dream Harness（做夢 harness）** | 內部的 multi-agent 架構——一個 orchestrator 協調者 + 每個 input session 一個 sub-agent | 確保遍歷所有 sessions exhaustive |
| **Session Transcript** | 對話記錄文字版，Dreaming 拿它當輸入來分析、查核、豐富化記憶 | 可餵給 Dreaming 的素材 |

---

## 四、核心主旨

> **Memory Store 讓 Agent 跨越 session 記住資訊，Dreaming 自動組織與豐富化這些記憶，兩者疊加形成「Session → Memory Store → Dreaming」三層可組合架構，支撐大規模資訊傳遞與管理。**

---

## 五、金句摘錄

1. 「We told it something, asked another session about it later. **No information is transferred between the sessions.**」
   （我們告訴它一些事，之後在另一個 session 問它。Session 之間沒有任何資訊傳遞。）

2. 「We actually mounted it as a file system because it's such a powerful interface for the model. You can use things like bash to explore the file system. It can use grep to search for keywords.」
   （我們實際把它 mount 為檔案系統，因為這對模型來說是非常強大的介面。你可以用 bash 探索檔案系統，可以用 grep 搜尋關鍵字。）

3. 「We actually want dreaming to be **exhaustive by design**. If you give it 100 transcripts, we want to make sure Cloud is looking over all the information to make sure it's not missing.」
   （我們在設計上就希望 Dreaming 是 exhaustive 的。如果你給它 100 份 transcripts，我們希望確保它遍歷所有資訊，確保不會漏掉任何東西。）

4. 「**More information actually really does help future sessions.** Intuitively, while an agent is working on a task currently, it's kind of hard to predict down the line what it might need. That's just generally a harder prediction problem. So it's actually good to write additional details down that a future agent might need.」
   （更多的資訊實際上真的能幫助未來的 sessions。直覺上，當 agent 在執行任務時，很難預測它未來可能需要什麼。這本來就是個更困難的預測問題。所以寫下更多未來 agent 可能需要的細節是有幫助的。）

---

## 六、重點步驟速查

```
建立 Memory Store
  → cma memory-stores create --name "名稱"

建立並掛載 Memory Store 的 Session
  → cma sessions create --memory-store-id <id> --prompt "..."

建立 Dream Job
  → cma dreams create --model claude-opus-4.7 \
      --memory-store-id <input_id> --session-ids <id1> <id2> ...

取回 Dream 輸出的 Memory Store ID
  → cma dreams get <dream_id> → 取 output_memory_store_id
```