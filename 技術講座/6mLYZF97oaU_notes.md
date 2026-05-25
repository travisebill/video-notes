# 【AI 代理開發實踐：Spec-Driven、Guard Rails 與軟體品質】
**開發者對談｜2026-04-23｜39 分鐘**

> 本影片使用 Whisper base 模型自動聽寫（en），經清除時間碼與格式標籤後得到逐字稿，並整理為結構化筆記

---

## 一、主題與背景

- **講者**：兩位資深軟體工程師，進行一場關於 AI Agent 開發工具與流程的深度技術對談
- **影片類型**：Podcast 形式技術訪談
- **核心議題**：AI Agent 時代的軟體開發流程——Spec-Driven Living Development 的務實觀點，以及如何建立維護 Code Quality Guard Rails

---

## 二、章節脈絡

### Section 1｜Spec-Driven 的兩種形態（00:00 ~ 08:00）

**重點摘要：** Spec-driven 一次性描述完整系統交給 Agent 生成不可能成功，但迭代式 Spec-Driven 其實就是 BDD

**內容：**
- **One-shot Spec-Driven 註定失敗**：你不可能用一份文件描述完整功能，交給 Bot 或 Swarm 生成最終產品還能跑進 Production（Security、Resilience、Availability、Compliance、Accessibility 都有保障）
- **Coding 是最 deterministic 的部分**：Martin Fowler 1996 年就說過「any idiot can write code for a computer to understand; programming is about writing software that humans can understand」
- **Gen AI 還沒有能力寫出人類可理解的軟體**，起碼目前還差很遠
- **真正的機會在迭代迴圈**：小步反饋、自動化測試、持續修正 spec——這就是 BDD
- Living Spec 文件變成 500 頁 Word 文件，每個 Approve 都沒人真的讀過

**重要引用：**
> 「You can't describe a fully functional, fully complete application and give it to a bot or a swarm of bots or whatever and get a product out of the other end. I don't think that's a thing.」

---

### Section 2｜工具歷史的商業循環（08:00 ~ 15:00）

**重點摘要：** 90 年代 CASE Tools、2000 年代 MDA Tools 的商業軌跡，今天的 AI Agent 工具幾乎完全相同

**內容：**
- **跟風隨潮的行銷話術**：用自然語言讓電腦幫你寫程式給另一台電腦；中間那台電腦我們稱之為 Agent，但其實沒有理解能力
- **這種工具的商業弧線會和 CASE Tools、MDA Tools 完全一樣**：熱鬧一陣後消失
- **商業問題**：企業 Senior Purchasing 買了工具後，以為 Agent 可以取代 Business Analyst——但 BA 的價值在理解問題領域，不是寫文件
- **Programming 不是打字進電腦**：是理解整個 Stack、Mechanical Sympathy，所有好工程實踐的總和
- **Spec-Kit、Open Spec、Kiro（Amazon）**：這些框架都是別人的流程，直接拿來用等於在實現 Microsoft 或 Amazon 的流程，不是你的

---

### Section 3｜Agent 作為編譯器的危險誤解（15:00 ~ 20:00）

**重點摘要：** 大家開始把 Agent 當編譯器用，覺得能確定性地把 Spec 轉成產品，這是目前最大的危險

**內容：**
- **軟體品質的 Venn Diagram**：每個人寫的 Guard Rails 集合，最後會收斂到差不多的範圍，但要維持 Agent 在軌道上才是真正的難題
- **Emily Bender 的 Cassie Parrot 概念**：Agent 完全沒有 semantic awareness，不在乎你的具體情況
- **純制定 Guard Rails 不夠**：定義規則簡單，遵守規則是另一回事
- **用 Markdown 檔案定義規則失敗案例**：寫了很詳細的記憶檔，Agent 十分鐘後就忘記，還是犯同樣的錯
- **Agent 自己也不在乎**：當你說「你沒遵守我的規則」，它的回應就是「Catch!」之類的安慰話語

---

### Section 4｜Domain Specific Linting Rules（20:00 ~ 28:00）

**重點摘要：** 把專案規則翻譯成程式化 Lint 檢查——從 Markdown 規則變成 ESLint Plugin 之後，CI 系統可以直接 Block 不合規的 Code

**內容：**
- **問題由來**：JavaScript 專案裡有個 workflow 類不該被 Mock，應該在測試中直接用真正的 Method
- **自己寫 Markdown 規則**，自己偶爾還是犯錯
- **solution：請 Agent 寫 Custom ESLint Rule 來自動化這個檢查**
- 為 workflow class 被 Mock 的情況寫了一個 ESLint Rule，錯誤訊息精確說明「Never mock this method, use the real method instead」
- **LRU 效應**：一旦類似的 Domain Rule 累積到幾百條，你就等於有了一個商業軟體品質產品的核心
- **核心 Lesson**：當規則被明確化之後，把它轉成 deterministic check code，不要繼續依賴 Markdown rule files

---

### Section 5｜每小時重新 onboard 新進工程師（28:00 ~ 33:00）

**重點摘要：** Agent 每次 Session 等於一小時 onboarding 一次新 developer。因此所有規則、Feedback、Bumpers 都必須系統化

**內容：**
- **元比喻**：你必須假設每小時 onboard 一個新 developer 到團隊
- **規則文檔化不夠**：必須讓系統在出錯時自動阻止、直接給出修復指引
- **Google MCP for Chrome 案例**：Agent 面對「Access Denied」會一直試 10 次；但人類工程師會知道去檢查 access keys
  - **Lesson**：Error Message 必須教 Agent 如何修復（not just 說「Access Denied」，要說「Access Denied — check your access keys」）
- **Guard Rails 的終極形態**：寫進既有的 Lint/CI 工具，而非放在 Markdown 檔案裡
- **工具切換不受影響**：只要檢查邏輯在 ESLint 裡，明天切到別的 Agent 系統同樣生效

**重要引用：**
> 「Access denied is not good enough. Access denied check your access keys.」

---

### Section 6｜AI 的合理定位：Non-Critical Quality of Life Tasks（33:00 ~ 38:00）

**重點摘要：** 目前 Ai 最適合的位置是 non-critical、non-differentiating 的生活品質改善工作，而非核心 Domain Logic

**內容：**
- **作者的使用模式**：不是用 Claude 開發核心系統，而是用來做「讓我有時間做真正重要的事」的小功能優化
  - 例如：自定義網頁介面最佳化、各類小事先墊一墊
- **自動化不等於更好的**：自動化讓事情變快，但如果你原本的定義就是錯的，自動化會持續地犯同樣的錯
- **自動化是鎖定效應**：一旦 Automate 了某個流程，你就鎖定在當時的假設上了；如果產品、假設在變化，明天你就得把這些 Automation 全部扔掉
- **Financial Domain Story**：銀行 settlements 系统用了 Oracle PL/SQL，幾千萬筆 record 的 if-else chain，最後從 9 小時變成 11 秒（Python）+ 8 秒 + 3 秒（Java）
  - **Lesson**：`set-based operation` 用 SQL 或 Python 做，永遠比在 Application 層做迴圈快
  - **後續**：3 秒的 Job，就可以加 Web UI、放給 Audit Team 即時跑了
- **獨立工程師的 Tinker Time**：每個人都應該被給兩天時間隨便玩玩這些工具，這才是真正的學習方式

---

### Section 7｜總結與建議（38:00 ~ 39:00）

**重點摘要：** 不要盲目跟隨任何框架，快速疊代、找到自己團隊適用的規則，規則穩定後再自動化進 Lint/CI

**內容：**
- **快速疊代框架**：選任何一個 starter framework（SpecKit、Kiro、OpenSpec 都可以），快速改造它成為自己的流程
- **找到瓶頸`：觀察 Agent 持續犯同一個錯誤的地點，快速在這裡建立規則繞開
- **用 RPI Loop（Research → Plan → Implement）**，但每個人的實作方式各不同
- **作者自己的.tool chains**：
  - `intent template`：提醒設定 Goals、Constraints、Scopes
  - `impact analysis`：分析要改哪些 File、API、Demo Pages、UI Design
  - `iterative implementation`：一次只改 3 個 File，觀察中控結果再繼續

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處/應用 |
|------|------|-----------|
| Spec-Driven (One-shot) | 用一份文件完整描述系統，期望 Agent 直接生成最終產品 | 影片｜確定會失敗 |
| Spec-Driven (Iterative) | 小步疊代、持續回饋，慢慢把文件變成系統，是 BDD 的精神前身 | 影片｜真正的機會 |
| CASE Tools (1990s) | Computer-Aided Software Engineering，自動生成程式碼的工具，最後不了了之 | 影片｜商業弧線相同 |
| MDA (2000s) | Model Driven Architecture，模型驅動的架構，同樣熱潮後消失 | 影片｜商業弧線相同 |
| Guard Rails | 引導 Agent 行為的規則，避免偏離預期方向 | 影片｜維護是真正的難題 |
| Living Spec | 持續存在的規格文件，不再是一次性交付後就靜態的文檔 | 影片｜風險是變成 500 頁沒人讀的文件 |
| Custom Linting Rules | 把專案特定的程式碼品質規則寫成 ESLint 之類的自動化檢查 | 影片｜規則明確化後的正確出口 |
| BDD (Behavior-Driven Development) | 用實例驅動開發，強調人類可讀的規格 + 自動化驗證 | 影片｜迭代式 Spec-Driven 就是 BDD |
| Automation Lock-in | 自動化後會被鎖定在當時的假設裡，假設一變就得全部重寫 | 影片｜核心風險 |
| Cassie Parrot | Emily Bender 提出的概念，指模型沒有真正的 semantic awareness | 影片｜Agent 只是模仿機器 |
| RPI Loop | Research → Plan → Implement，疊代開發的核心循環 | 影片｜各種 Spec 工具的底層邏輯 |
| Mechanical Sympathy | 理解硬體與系統底層的工作方式，才能寫出好軟體 | 影片｜Martin Fowler 1996 |

---

## 四、人物訪談（對談方）

### Host（提問方）
- 背景：資深工程師，近年持續觀察 AI Coding Tool 生態
- 代表觀點：對 Spec-Driven 工具的懷疑與務實期望

### Guest（主要發言方）
- 背景：實際在專案中 teaching Claude Code 做實際專案，有數月經驗
- 代表觀點：
  - AI Agent 是很聰明的模仿機器，不是真的有理解能力
  - 不要浪費時間在 Markdown 規則上，把規則明確化後寫成 Lint Rule 才是正途
  - 使用 AI 的最佳位置：non-critical、生活品質改善類工作
  - 每次創建規則前先確認是否穩定，再自動化進 Lint/CI

---

## 五、核心主旨

> AI Agent 不會也不能取代軟體工程師；最有價值的用法是迭代式 Spec-Driven 開發（接近 BDD）+ 把穩定後的規則寫成 Domain Specific Linting Rules，鎖進 CI 系統，而不是繼續寫沒人會讀的 Markdown Files

---

## 六、金句摘錄

1. 「Any idiot can write code for a computer to understand; programming is about writing software that humans can understand.」—— Martin Fowler, 1996

2. 「You can't describe a fully functional, fully complete application and give it to a bot or a swarm of bots or whatever and get a product out of the other end. I don't think that's a thing.」

3. 「Access denied is not good enough. Access denied check your access keys.」

4. 「Automation makes things faster. It doesn't make things better. It makes them the same.」

5. 「Imagine you had to onboard the new developer to your team every hour — because that's what's happening when you're onto the agent.」

6. `The thing about being Independent... we're both independent... you can decide go as go as boss can decide to give go a couple of days just to muck around with us and see what happens."

---

## 七、延伸閱讀/相關研究

- **Martin Fowler** — Refactoring, 1996（程式可讀性與人類可理解軟體的經典引用來源）
- **Emily Bender** — 關於大型語言模型缺乏 semantic awareness 的研究
- **SpecKit / OpenSpec** — Microsoft/GitHub 推的 Living Spec 工具鏈
- **Kiro (Amazon)** — Amazon 的 Spec Living Development 工具
- **ESLint Plugin 生態** — Custom Linting Rules 寫作參考
- **BDD (Behavior-Driven Development)** — Cucumber/Gherkin 生態
- **MCP (Model Context Protocol)** — Google 用於 Chrome 自動化的 MCP 實現
