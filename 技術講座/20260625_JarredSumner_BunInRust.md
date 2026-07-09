# Rewriting Bun in Rust：Bun 從 Zig 改寫成 Rust 的工程紀實

> 原文網址：<https://bun.com/blog/bun-in-rust>
> 作者｜Jarred Sumner（Bun 創辦人，Anthropic 工程師）
> 中文摘要｜禮士
> 發布日期｜2026-06-25（推算；內文引用 5/18 Twitter、6/17 Claude Code v2.1.181）

## 影片基本資訊

> **影片標題：** Rewriting Bun in Rust：Bun 從 Zig 改寫成 Rust 的工程紀實
> **影片連結：** https://bun.com/blog/bun-in-rust
> **講者：** Jarred Sumner（Bun 創辦人、Anthropic 工程師）
> **影片長度：** 技術文章（純文字來源，沒有原始音檔；以口播稿長度估算 ~3:27）
> **上稿日期：** 2026-06-25
> **整理日期：** 2026-07-09
> **類別：** 技術講座
> **主題：** 🛠️ 編碼工具 / Agent 工程實踐
> **影片語言：** 英文（原文）

---

## 一、主題與背景

Bun 原生以 Zig 改寫自 esbuild 的 transpiler，覆蓋 transpiler / bundler / npm package manager / test runner / HTTP server / Node.js 相容層等「幾乎全包」的 scope。隨著 Bun CLI 月下載量突破 2,200 萬、Claude Code 與 Vercel / Railway / DigitalOcean 都採用作為 runtime，穩定性成為新的瓶頸 — v1.3.14 累積一連串 use-after-free、double-free、heap out-of-bounds、SSL/TLS memory leak 等難以根治的 bug。

Jarred Sumner 這篇文章詳述 Bun 從 Zig 改寫成 Rust 的完整歷程：為何放棄 Zig、為何不選 C++、如何用 Anthropic 內部 pre-release 的 Claude Fable 5（Mythos-class model）+ Claude Code dynamic workflows，在 11 天內把 535,496 行的 Zig 程式碼機械式改寫成 1,009,272 行（diff）的 Rust，並讓所有平台的 test suite 100% 通過、零測試被 skip 或刪除、Bun v1.4.0 解掉 v1.3.14 全部 128 個 bug。

**核心議題一句話概括**：在 LLM 編程時代，一個工程師 + 嚴謹的 Adversarial Review 流程，能在 11 天完成傳統估算需一個團隊一年的全規模程式碼語言移植。

## 二、章節脈絡

### Section 1｜Zig 的極限與 Bun 的穩定性債（What we were already doing / Just be really smart / What about C/C++）

**重點摘要**：Bun 在 Zig 上已經做了所有「正常」能做的事（patch compiler 加 ASAN、用 Fuzzilli 24/7 fuzz、加 memory leak 測試），但仍擋不住 GC 與手動記憶體混合造成的 use-after-free / double-free / leaked。

**內容：**

- **Zig 已極度用心**：patch Zig compiler 加 Address Sanitizer、Windows 發 ReleaseSafe、用 Fuzzilli 做 JavaScript engine fuzz、巨量 end-to-end memory leak tests — 已比多數開源專案更嚴謹
- **核心痛點**：JavaScript 是 GC 語言（JavaScriptCore / V8 對 exception 處理跟 GC 有嚴格規則），而 Zig 像 C 不管理記憶體、沒有 constructor / destructor、大多 cleanup 用 `defer` 寫在每個 call site — 兩者混合造成 Bun 特有的穩定性問題
- **可選方案對照表**：

  | 語言 | Cleanup 機制 | 評估 |
  |------|--------------|------|
  | Zig | `defer` / `errdefer`（顯式，無隱藏控制流） | 易忘、易重複跑 |
  | C++ | `~Destructor` / `&&` Move（隱式） | 仍需 ASAN + 風格指南 |
  | Rust | `Drop` trait（編譯器強制 RAII） | use-after-free / double-free 是編譯錯誤 |

- **為何 C++ 也不行**：雖然 destructor 隱式呼叫，但仍要靠風格指南 + 程式碼審查，記憶體腐敗與 leak 不會自動消失
- **機械式移植策略**：535,496 行 Zig 全機械移植到 Rust，架構 / 測試不變，先 shippable 再逐步改寫得更像 idiomatic Rust（先發 v1.4，後續 refactor）

> 「We wouldn't have gotten this far if not for Zig, and I'll always be grateful. Until very recently, programming language choice was a one-way decision for a project like Bun.」

> 「A year of zero user-facing impact is not a realistic option we could consider.」

### Section 2｜為什麼最終選 Rust（Why Rust / Claude, rewrite Bun in Rust）

**重點摘要**：Bun bug 清單大半是 Rust 預設會報成「編譯錯誤」的那類問題 — use-after-free、double-free、error path 忘了 free — 因此 Rust 的 borrow checker 是更短的 feedback loop。

**內容：**

- **Lifetimes 比 `defer` 強**：Rust 的 `Drop` 在編譯期靜態決定，不需要在每個 call site 寫 defer，也不會忘記或重複 — 用「no hidden control flow」換一個常見的 footgun
- **跨語言 LTO**：Rust ↔ C/C++ 跨語言 link-time optimization，讓 LLVM 能在最終 binary 跨語言 inline
- **兩大 Q&A**：incremental or everything-at-once？ → everything-at-once（incremental 會有大量暫存程式碼）；how to preserve architecture / performance / feature-set？ → 做一個「看起來像 Zig 直譯成 Rust」的版本，先 ship，後續再減少 `unsafe`
- **試試看的心態**：「What if, instead, I spend a week testing if Anthropic's new model can rewrite Bun in Rust?」 — 一開始不抱期望，幾天後 high % tests passing，意見從「this is worth trying」變「I'm going to merge this」
- **不要的 prompt**：「Rewrite Bun in Rust. Don't make any mistakes.」然後禱告 — 作者強調這不是他的做法

> 「Historically, rewrites are a terrible idea. Excluding comments, Bun is 535,496 lines of Zig. A rewrite in another language would take a small team of engineers a full year.」

### Section 3｜Adversarial Review 設計：寫與審查分離（Loops that write & review code / Adversarial review / Split context windows）

**重點摘要**：1 個 implementer + 2 個以上 adversarial reviewer — review 拿到「只剩 diff、預設立場為 code 是錯的」，不能 implement；implement 不能 review。

**內容：**

- **迴圈式工程**：日常工程 → 一個 task loop：`task → 寫 → 兩位 reviewer → apply feedback → commit`
- **巨型 PR 的 review 哲學**：1+ million lines 的 PR 怎麼 review？靠「language-independent test suite with a million assertions + adversarial code review + 修產生 code 的 process 而不是修 code 本身」
- **拆開 context windows**：實作的 Claude 想 merge、審查的 Claude 想找出 bug — bias 不同，把它們分到不同 context；reviewer 只看 diff 不看 implementer 的 reasoning
- **3 個 reviewer 抓到的 bug**（每個都附 commit subject 連結）：
  1. **`the async close`** — 看似合理但會 leak
  2. **`tcp close in callback`** — async close 行為不對
  3. **`tls close in scope`** — scope 結束時 close 順序錯誤
- **三個 bug 都 compile 通過、看起來 plausible** — 證明 reviewer 不能只看編譯 / lint，要靠獨立 context 的攻擊假設

> 「The Claude that wrote the code wants the code to get accepted. The Claude that reviews wants to find issues in the code.」

### Section 4｜實戰流程：Prep → Trial → False Starts → Final Run（What does this look like / Prep work / Trial run / False starts / Finally writing the code）

**重點摘要**：先寫 PORTING.md + LIFETIMES.tsv → trial run 3 個檔 → false start 修正 → 4 worktree × 16 Claude 並行，最終 peak 1,300 LOC/min。

**內容：**

- **Prep work（3 小時討論）**：先跟 Claude 對談如何把 Zig pattern 對應到 Rust → 序列化成 PORTING.md（上 Hacker News 引發討論）；再 dynamic workflow 分析每個 struct field 的 lifetime → 2 個 adversarial reviewer 檢查 → 套用 feedback → 序列化成 LIFETIMES.tsv
- **Trial run**：先挑 3 個 `.zig` 檔 → 1 implementer 寫 `.rs`、2 reviewer 對照 `.zig` 行為、1 fixer apply
- **False start #1**：Claude 之間互踩 — 一個跑 `git stash`、另一個跑 `git stash pop`、再 `git reset --hard`；改用 worktree 又把 disk 吃完（Bun repo 太大）
- **解法**：禁止 `git stash` / `git reset --hard` / `cargo` / 任何慢指令 — 只准一次 commit 一個特定檔。4 worktree × 16 Claude 並行
- **最終**：peak 1,300 lines/min 寫入，每行都經 2 reviewer + 1 fixer
- **Bun 在 EC2 IOPS 沒調高**：slow grep 一次就 freeze disk reads & writes 好幾分鐘 — 細節也會成瓶頸

> 「If you need a paragraph-long comment to justify why the workaround is OK, the code is wrong — fix the code.」

### Section 5｜Compiler Errors → Test Suite：64 Claudes 跑 11 天（Compiler errors as a work queue / Smoke tests / Get the test suite passing locally + in CI）

**重點摘要**：把 `cargo check` 吐的 ≈16K errors 當 work queue；再把 test suite 跑失敗的案子分 4 worktree × 16 Claude 修；6 個平台 CI 135 次 build 才全綠。

**內容：**

- **Phase D（compiler errors）**：`cargo check` 把 ≈16K errors 寫進 errors.txt，依 crate 分組 → 64 Claudes 平行跑（4 worktree × 16 loop）— 1 修 + 2 審 + 1 套用
- **Smoke tests**：`cargo check` 通過 → 編譯 + 跑 `bun --version` 階段 linker errors + panic on start；再來 `bun test <file>` 跑得起來才能跑 test suite
- **Test suite locha 循環**：~100 random test files 隨機切 4 worktree 跑 → 跑失敗的 stacktrace & errors 存檔 → 1 implementer + 2 reviewer + 1 fixer
- **測試設計**：memory leak tests / `next dev` 重 100 次的 HMR 整合測試 / 用光全部 TCP socket / 讀寫 GB disk / spawn 10k processes — 必須用 `systemd-run` cgroup + pid namespace 隔離，磁碟還是被打爆
- **Race to green**：BuildKite build #52897 → #54202 共 **135 次 build**，6 個平台（Linux x64 / arm64、macOS x64 / arm64、Windows x64 / arm64）— Linux 先綠（60 shards），Windows 最後；build #54202 是唯一 6 平台全綠

### Section 6｜結果：穩定性、效能、bin size、生產上線（Stats / Bun is better in Rust / Production / Maintainability / What's next）

**重點摘要**：11 天 / 6,778 commits / $165K API 成本，Bun v1.4.0 解 128 bug、100% instrumentable memory leak 解掉、bin size -20%、HTTP +2-5%、startup -10%。

**內容：**

- **Stats**：
  - 時間：May 3 → 合併 May 14，共 11 天
  - Commit：6,778（不含 merge），peak 695 commits/hr，peak 58 commits/min
  - Diff：`+1,009,272` lines
  - Token：5.9B uncached input + 690M output + 72B cached reads
  - API 成本：約 **$165,000** at API pricing
  - human baseline 估算：3 位熟悉 codebase 的工程師 ≈ 一年
  - 測試規模：expect() calls ~1.07B（Linux x64 1,386,826 × 60,624 tests × 4,174 files）；6 平台 × 一致測試數
  - **0 tests skipped or deleted**
- **Adversarial review 抓到 3 個 bug 都 compile 過**：證明「看得懂」≠「正確」
- **Porting mistakes — 19 個已知 regression**（都已修）：
  1. **Side effect inside `debug_assert!`** — Zig `assert` 是 function（永遠執行），Rust `debug_assert!` 是 macro（release build 把整個 expression 拔掉包含 `insert_stale`），HMR 在有 HTML routes 的 React 專案壞掉
  2. **Slices of odd length** — Zig `reinterpretSlice` 用 `@divTrunc` 忽略 odd 結尾 byte，Rust `bytemuck::cast_slice` panic；`Blob.text()` 在 UTF-16 BOM + odd bytes 不再回傳字串 → panic
  3. **Bounds checks** — Zig macOS / Linux 用 `ReleaseFast`（去 bounds checks），Rust release 保留；`BSS_OVERFLOW_BLOCK_SIZE` placeholder 從 2048 變 64，內部 filename interning ceiling 從 8.4M 降到 270K，reaching `ptrs[4095]` off-by-one → Rust panic 而非寫超過邊界（Zig 用 ReleaseSafe 也會 panic，但只 Windows 用）
  4. **`comptime` format strings** — Zig `Output.pretty` 是 `comptime` 函數（color 標記在 args substitute 前消失），Rust 函數沒 comptime，`<r>{}<r>` 印出後才 rewrite marker 把 args 一起改壞 — `bun update -i` 把 OSC 8 hyperlink 結尾的 `ESC \` + `<` 吃進 marker parser，印出「oxfmtr」而非「oxfmt」
- **Bun is better in Rust（v1.3.14 → v1.4.0 改善）**：
  - **128 bugs 修掉**：memory leaks / crashes / 顏色錯的 help text
  - **Drop trait 自動清理**：原本 Zig `defer bytes.unpin()` 寫在每個 call site，Rust `impl Drop for Bytes` 自動跑（搭配 `if !self.pinned.is_empty()`）；修掉若干 file path error handling 的 memory leak
  - **100% instrumentable memory leak 修完**：增強 LeakSanitizer 追蹤所有 native 記憶體配置；`Bun.build()` 每次漏 ~3 MB → 現在 levels off；同專案 bundle 2,000 次，Bun v1.3.14 漏到 6,745 MB，v1.4.0 穩在 609 MB
  - **bin size**：initial Rust rewrite 少 3.8/5.5/6.8 MB；加 ICF + ICU lazy decompress + zstd dictionary，**Linux/Windows total -20%**（Windows 94 → 76 MB，Linux 88 → 70 MB）
  - **Stack space**：recursive-descent parsers（TOML / JSON / YAML / JS / TS）用更少 stack — Rust LLVM IR 自動 emit `llvm.lifetime.start/end`，可重用 stack 槽位；之前要手動 refactor
  - **2-5% faster**：Rust ↔ C/C++ 跨語言 LTO（LLVM 跨語言 inline）

    | server | Bun v1.3.14 | Bun v1.4.0 | Δ |
    |--------|-------------|-------------|---|
    | Bun.serve | 169.6k | 177.7k | +4.8% |
    | node:http | 103.8k | 108.5k | +4.5% |
    | Elysia | 158.9k | 163.3k | +2.8% |
    | express | 64.5k | 66.6k | +3.2% |
    | fastify | 91.5k | 95.9k | +4.8% |

    | workload | Bun v1.3.14 | Bun v1.4.0 | Δ |
    |----------|-------------|-------------|---|
    | next build | 13.62s | 13.03s | +4.5% |
    | vite build | 1.69s | 1.65s | +2.2% |
    | tsc -b --force | 0.94s | 0.89s | +4.7% |

- **Production**：Prisma Compute public beta 跑在 Bun 的 Rust rewrite 上 — 之前遇到的 memory leak + VM pause/resume 後 connection pool 不恢復都解了；Claude Code v2.1.181（6/17）+ 之後版本用 Rust port，Linux startup 10% 更快，「but otherwise, barely anyone noticed. Boring is good.」
- **unsafe 比例**：截至寫文時，~4% 的 Rust code 在 `unsafe` block（~13K `unsafe` keywords / ~27K lines / ~780K lines），其中 78% 是一行 — 一個 C++ 來的指標或一個 C library call。後續會逐步從「faithful Zig port」refactor 成 idiomatic Rust，但因為仍 embed JavaScriptCore 等 C/C++ library，會永遠比純 Rust 專案多 `unsafe`
- **Maintainability**：機械移植的 Rust 對熟悉原 Zig 程式碼的人來說非常像；團隊 review PR 的方式是檢查 adversarial review agent 有沒有確實抓到 Zig ↔ Rust 行為差異、有沒有遵守 PORTING.md 跟 LIFETIMES.tsv，並手動 zigzag 比對程式碼
- **Shipping / What's next**：Bun v1.3.14 是最後一個 Zig 版本；v1.4.0（現在 canary）可用 `bun upgrade --canary` 取得；後續還有 refactor 要做，但起點良好

> 「One engineer can do a lot more today than a year ago.」

> 「Boring is good.」

## 三、關鍵概念定義表

| 概念 | 定義 | 出處 / 應用 |
|------|------|------------|
| Zig `defer` / `errdefer` | 顯式 cleanup 關鍵字，在 scope 結束時跑；無 destructor / RAII | Bun 原生 cleanup 機制；易遺漏或重複 |
| C++ `~Destructor` / `&&` Move | 隱式 cleanup；對應離開 scope 自動執行 | 評估選項之一；仍需風格指南 |
| Rust `Drop` trait | 編譯器強制 RAII；值離開 scope 時 `drop` 自動跑 | Bun v1.4 修 leak 的關鍵 |
| Borrow checker | Rust 編譯器靜態分析 lifetime、防止 use-after-free / double-free 在 compile-time 失敗 | 評估選 Rust 的核心理由 |
| Zig Address Sanitizer patch | 在 Zig compiler 加 ASAN 支援、test suite 每 commit 跑 ASAN | Bun 已做的基礎設施 |
| Fuzzilli | Google Project Zero 的 JavaScript engine fuzzer（V8 / JSC 也用） | Bun 對 runtime API 24/7 fuzz |
| `unsafe` block | Rust 繞過 borrow checker 的 escape hatch；可呼叫 C/C++ 或操作 raw pointer | Bun 目前 ~4% Rust code 在 unsafe，預期會下降 |
| Adversarial review | 第二個獨立 Claude context window 拿 diff、預設立場為「code 有錯」找出問題 | Section 3 核心 SOP |
| Split context windows | 不同任務（implementer / reviewer）放獨立 context 隔離 bias | Section 3 細節 |
| PORTING.md | Claude 把 Zig → Rust 對應規則序列化的文件 | Section 4 Prep work 產物（曾上 Hacker News） |
| LIFETIMES.tsv | 每個 struct field 的 lifetime 標註 + reviewer 簽核 | Section 4 Prep work 產物 |
| Dynamic workflow | Claude Code 的迴圈式 task 引擎（task 列表 → 寫 → 審 → 套用 → commit） | Section 3-5 核心基礎設施 |
| Mythos-class model | Anthropic 內部分級中的高階 model；Claude Fable 5 pre-release 屬此級 | 本文用的 model |
| Claude Code 2.1.181+ | v2.1.181（6/17）+ 之後版本已預設用 Bun 的 Rust port | 自我引用證據 |
| cross-language LTO | Rust ↔ C/C++ 跨語言 link-time optimization，LLVM 可跨語言 inline | Bun +2-5% 效能提升的關鍵 |
| `llvm.lifetime.start/end` | Rust codegen 自動 emit，讓 LLVM 重用 stack slot | Section 6 stack space 改善的原因 |
| LeakSanitizer（LSAN） | Linux 上追蹤 native memory 的工具（搭配 ASAN） | Bun v1.4 修掉 100% instrumentable leak |
| Identical Code Folding（ICF） | Linker 把相同 machine code 合併，省 bin size | Bun v1.4 bin size -20% 的一部分 |
| ICU lazy decompress + zstd dict | libicu 改用 zstd dictionary on-demand 解壓縮，縮小進 binary 的 ICU 體積 | Bun v1.4 bin size -20% 的一部分 |
| Bun v1.3.14 最後一個 Zig 版本 | 改寫截止線；之後合併的所有改動都在 Rust codebase | Shipping 段落 |

## 四、人物 / 角色分析

### Jarred Sumner

- 背景：Bun 創辦人，現於 Anthropic 工程團隊（Bun 2025-12 被 Anthropic 併購）
- 關鍵轉折：用 11 天把 Bun 從 Zig 改寫到 Rust，1 個工程師 + Claude Fable + Claude Code dynamic workflows
- 代表觀點：
  - 對 Zig 永遠感恩（沒有 Zig 走不到這裡），但承認 Zig vs GC 混合記憶體管理的設計 trade-off 不適合大規模 GC runtime
  - 對 LLM 編程時代的強烈信念：「One engineer can do a lot more today than a year ago」
  - 對 LLM 程式碼品質的務實：1+ million lines PR 仍能 ship 是靠「language-independent test suite + adversarial review + 修 process 而非修 code」
  - 對 production bug 數量的痛點（v1.3.14 那串 use-after-free 是他睡不著覺的原因）

### Anthropic Fable 5（Mythos-class model）

- 背景：本文用的 pre-release Anthropic 內部高階 model
- 關鍵能力：在 adversarial review、batch refactor、mechanical port 等任務上能維持行為對齊原 Zig 程式碼
- 限制：仍是工具 — 需要嚴謹的 process（reviewer / 禁止危險指令 / 限制 IOPS / systemd 隔離測試）才能用於 production codebase

### Claude Code

- 背景：Anthropic 的 dynamic workflow 引擎
- 關鍵能力：把 task list + 寫 / 審 / 套用 loop 包成可長時間跑的 workflow；支援 worktree parallelism；本身（v2.1.181+）已用 Bun 的 Rust port 跑

### BuildKite

- 背景：Bun 的 CI 平台
- 本文價值：build #52897 → #54202 共 135 次 build 的 race-to-green 視覺化，每個平台 lane 在全綠時 stamp — Linux 60 shards 比 Windows 早接近一天全綠，Windows 最後

## 五、核心主旨

> **在 LLM 編程時代，最稀缺的是工程紀律 — 不是 model、不是 prompt，而是能為百萬行 LLM 程式碼建立「語言無關的測試套件 + 攻擊假設獨立的程式碼審查 + 可中斷可修復的生產流程」的工程師。**

## 六、金句摘錄

1. 「If you need a paragraph-long comment to justify why the workaround is OK, the code is wrong — fix the code.」
2. 「The Claude that wrote the code wants the code to get accepted. The Claude that reviews wants to find issues in the code.」
3. 「One engineer can do a lot more today than a year ago.」
4. 「Boring is good.」
5. 「We wouldn't have gotten this far if not for Zig, and I'll always be grateful.」
6. 「A year of zero user-facing impact is not a realistic option we could consider.」
7. 「Compiler errors are a better feedback loop than a style guide.」
8. 「Historically, rewrites are a terrible idea.」

## 七、延伸閱讀 / 參考

- [PORTING.md on Hacker News](https://news.ycombinator.com/item?id=48016880) — Jarred 的 Zig → Rust 對應規則文件
- [Zig Language Reference](https://ziglang.org/documentation/master/) — 當初 Bun 賭 Zig 的單頁語言參考手冊
- [TigerBeetle's TigerStyle](https://tigerstyle.dev/) — Zig 風格指南示例
- [Google's 31,000 word C++ style guide](https://google.github.io/styleguide/cppguide.html) — 對照 C++ 用風格指南強制 cleanup 紀律的反例
- [Bun 的 Smart pointers PR](https://github.com/oven-sh/bun/blob/3a79bd746b11601c9db970b608c73f0b9f96ac81/src/ptr/shared.zig#L569) — 在 Rust 改寫前的 Zig smart pointer 嘗試
- [Fuzzilli](https://github.com/googleprojectzero/fuzzilli) — Google Project Zero 的 JS engine fuzzer
- [Apple JavaScriptCore](https://developer.apple.com/documentation/javascriptcore) — Bun 嵌入的 JS engine
- 注意內文引用的 3 個 bug commit subject（每個 reviewer commit 都附審查 attribution）：
  - `the async close`
  - `tcp close in callback`
  - `tls close in scope`
- 注意 19 個 known regression commit（4 個本文詳列）：
  - `#30678` Side effect inside `debug_assert!`
  - `#31188` Slices of odd length
  - `#31503` Bounds checks / BSS_OVERFLOW_BLOCK_SIZE
  - `#30693` `comptime` format strings → `bun_core::pretty!` macro

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 X 分 Y 秒
> 口播稿原文：transcripts/20260625_JarredSumner_BunInRust_口播稿.txt

- [opus X.X MB](../audio/20260625_JarredSumner_BunInRust.opus)（Telegram 友善）
- [m4a X.X MB](../audio/20260625_JarredSumner_BunInRust.m4a)（iOS 友善）
- [mp3 X.X MB](../audio/20260625_JarredSumner_BunInRust.mp3)（通用格式）
