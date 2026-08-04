# 【From generated code to trusted code with a unit-test agent】

**講者｜Microsoft .NET team（Principal Software Engineer，未署名具體姓名）**
**影片連結｜https://devblogs.microsoft.com/dotnet/polyglot-unit-testing-agent/**
**影片長度**｜3:29（209s）
**發布日期｜2026-07-31**
**Open Source｜https://github.com/dotnet/skills（`plugins/dotnet-test/agents/code-testing-generator.agent.md`）**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Microsoft 在 2026-07-31 透過 DevBlogs .NET channel 發布 open-source polyglot unit-test agent，命名為 `code-testing-generator`，屬於 `dotnet/skills` repo 下的 `dotnet-test` plugin。這篇文章講述這個 agent 如何把「一行 prompt」變成「可信賴的測試產出」——不只 compile + pass，還要 assertion 強、coverage 對、CI 可被發現。

核心議題：

- Coding agent 在 unit-test generation 場景的最大痛點是 **reliability**，不是 coverage 數字。
- Stock GitHub Copilot（沒特化的 agent）能跑出測試，但常見失敗模式：compile error、CI 找不到測試、assertion 太弱（只檢查 not null）、測了錯誤的方法。
- Polyglot agent 透過 repo-aware workflow + 三層 plan（Direct/Single-pass/Iterative）大幅提升 reliability。

---

## 章節脈絡

### Section 1｜What happens after the prompt（prompt 後發生什麼事）

Agent 不會立刻寫測試，採 **4 階段 workflow**：

1. **Learn from the repository** — 偵測語言、test framework，找到正確的 build / test command。常見問題：新測試本地能跑、CI 找不到，因為沒被加入 solution 或 test command。
2. **Choose the right amount of work** — 從 3 條路徑選一條：
   - **Direct**：讀完直接寫
   - **Single pass**：先研究 + 規劃一次，再實作
   - **Iterative**：重複 cycle 直到覆蓋完整
3. **Plan and write the tests** — 列出要測的 code，從簡單到複雜，每個 behavior map 到 test file。遵循 local convention。compile 失敗就修，assertion 錯就讀 source 修。**不動 production code**，**不呼叫 external URL/port/timing**。
4. **Check that the tests are useful** — mutation testing（小幅改 production code 看測試是否 fail）+ 檢查 weak assertions + 確認所有 requested scenarios 都有對應 test + 完整 build + 完整 test suite。

### Section 2｜What we measured（測量結果）

**Internal benchmark**：152 tasks（real repos），分 vague（89 tasks）+ detailed（63 tasks）。

整體：
- Specialized agent：**140/152 (92.1%)**
- Stock Copilot：**120/152 (78.9%)**
- **63% fewer failures**

Vague prompts (89 tasks)：
- Specialized：**79 (88.8%)**
- Stock Copilot：59 (66.3%)
- 失敗從 30 降到 10 — **67% fewer failures**
- **20 個 net gains 全部來自 vague prompts**（呼應 agent 設計目標）

Detailed prompts (63 tasks)：61 vs 61 — **tied**

Diff-specific prompts (15 tasks)：Specialized **15/15** vs Stock Copilot **0/15**

Coverage / efficiency：
- Line coverage：72.4% vs 72.2%（差不多）
- Branch coverage：49.8% vs 49.1%
- 測試數：6,963 vs 7,129（specialized 略少 2.3%）
- 時間：359s vs 380s（specialized **快 5.5%**）

**結論**：specialized agent 不是產出更多測試，而是 **產出更可靠的測試**。

跨模型 (.NET 45 tasks)：

| Model | Specialized | Stock Copilot | Failure reduction |
|---|---|---|---|
| Claude Opus 4.8 | **43/45 (95.6%)** | 35/45 (77.8%) | 80% |
| GPT-5.5 | 41/45 (91.1%) | 36/45 (80.0%) | 56% |
| Claude Haiku 4.5 | 34/45 (75.6%) | 25/45 (55.6%) | 45% |

Workflow 對所有 model 都有效。**Specialized GPT-5.5 = 90.1% ≈ Specialized Opus，遠超 stock Opus**。Strong workflow 能把 mid-tier model 拉到接近 best tier。

跨語言（Opus run）：
- Python (15 tasks)：**13 vs 6**（雙倍）
- Go (15 tasks)：**15 vs 10**（全部通過）
- PowerShell (10 tasks)：7 vs 8（這裡輸 1 個）

支援語言：.NET、Python、TypeScript、JavaScript、Java、Go、Ruby、Rust、Swift、Kotlin、PowerShell、C++。Agent 學習各 repo 的 convention，**不強制套 C# pattern**。

**SWE Atlas**（更難的 benchmark，會注入 bug 驗證 catch 能力，44 tasks）：
- Specialized：**16/44 (36.4%)**
- Stock Copilot：12/44 (27.3%)
- Wins by only one setup：4 vs 0
- Passing tests：550 vs 493
- Tests catching injected bugs：**360 vs 316**

### Section 3｜What we learned and what comes next

- 最大的 gain = **reliability**（不是 coverage、不是測試數）
- Stock Copilot 在 assertion/coverage 上略贏；specialized agent 在 test hygiene（clean structure + 避免 slow/fragile pattern）略贏
- Token 用量 +3.2%（cache input 包含在內，不直接等於成本）
- 改善方向：deeper assertions + error-path tests，同時維持 strong test hygiene
- 其他測試類型（integration / e2e / browser / performance）暫無 committed plans

### Section 4｜Try the agent

Open source：[github.com/dotnet/skills](https://github.com/dotnet/skills)

GitHub Copilot CLI：

```
/plugin marketplace add dotnet/skills
/plugin install dotnet-test@dotnet-agent-skills
```

重啟 CLI → 選擇 `code-testing-generator` → 試 prompt「Generate unit tests.」

VS Code / VS Code Insiders：透過 plugin support（preview）
Visual Studio：working on support

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 3 分 29 秒（209s）
> 口播稿原文：transcripts/20260731_Microsoft_NETteam_PolyglotUnitTestingAgent_口播稿.txt

- [opus 0.8 MB](audio/20260731_Microsoft_NETteam_PolyglotUnitTestingAgent_口播稿.opus)（Telegram 友善）
- [m4a 3.3 MB](audio/20260731_Microsoft_NETteam_PolyglotUnitTestingAgent_口播稿.m4a)（iOS 友善）
- [mp3 3.2 MB](audio/20260731_Microsoft_NETteam_PolyglotUnitTestingAgent_口播稿.mp3)（通用格式）

---

## 關鍵概念定義

| 概念 | 定義 |
|------|------|
| **Polyglot agent** | 支援多語言的 coding agent（vs 單一語言特化） |
| **`code-testing-generator`** | dotnet-test plugin 下的 unit-test generation agent |
| **Vague prompt** | 沒指定 framework / 範圍 / assertion 細節的 prompt |
| **Mutation testing** | 改動 production code 看測試是否 fail（驗證測試的「價值」） |
| **Test hygiene** | 測試結構乾淨，避免 slow / fragile pattern |
| **SWE Atlas** | Scale AI 開源的 unit-test benchmark，會注入 bugs 驗證 catch 能力 |
| **Trust loop** | "good tests are not only generated. they are planned, built, run, and checked"（原文章金句） |

## 人物/角色分析

無人物訪談。文章署名為 Microsoft .NET team 的 Principal Software Engineer，定位為工程團隊的 retrospective + open-source release announcement。

## 核心主旨總結

> Microsoft 把 unit-test generation 從「coding agent 順手做」變成「specialized agent 專門做」，核心賣點是 reliability — 透過 repo-aware workflow（偵測 framework / build command / test discovery）+ mutation testing 驗證測試價值，讓 vague prompt 也能產出 trusted tests。

## 金句摘錄

> "Generate unit tests." — 一行 prompt 留 5 個問題：哪段 code？哪個 framework？測試放哪？build 怎麼找？測試什麼？

> "A test can pass but provide little or no added value."

> "A new test project can build and pass on its own but never run in continuous integration (CI) because it was not added to the solution or the repository's test command."

> "These groups contain different tasks. ... We see these results as guidance for the next improvements: deeper assertions and error-path tests while keeping strong test hygiene."

> "Good tests are not only generated. They are planned, built, run, and checked. That is the trust loop we are building."

> "Efficiency remained close after accounting for completed tasks. The agent used about 3.2% more recorded tokens per completed task. These counts include cached input, so they do not directly represent cost."

## 延伸閱讀 / 參考

- [dotnet/skills repository](https://github.com/dotnet/skills)
- [dotnet-test plugin](https://github.com/dotnet/skills/tree/main/plugins/dotnet-test)
- [code-testing-generator agent spec](https://github.com/dotnet/skills/blob/main/plugins/dotnet-test/agents/code-testing-generator.agent.md)
- [SWE Atlas benchmark](https://github.com/scaleapi/SWE-Atlas)