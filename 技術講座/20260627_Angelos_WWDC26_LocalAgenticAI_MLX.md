# Run local agentic AI on the Mac using MLX

**講者｜Angelos（Apple MLX team 工程師）**
**來源｜Apple Developer WWDC26 Session 232（HTML-Video-Page 路徑）**
**影片長度｜13:26（806s）**
**類型｜技術講座（tech conference / Apple developer session）**
**來源網址｜https://developer.apple.com/videos/play/wwdc2026/232/**

> **Source Type**：HTML-Video-Page（SOP 2026-06-27 新增路徑）
> Apple Developer 影片頁面 HTML 內嵌完整 transcript + 8 個官方 chapters + 3 段 sample code + 時間錨點
> 解析方式：`curl` 抓 HTML → regex 抽 `data-start` 標記的逐字稿 + `<input id="analytics-meta">` 影片 metadata + `<li class="supplement summary">` 章節 + `<pre class="code-source">` 程式碼
> **不走** YouTube 路徑（無需下載影片 / 無需 Whisper），但保留 YouTube 風格時間碼標記

---

## 一、主題與背景（核心議題）

Apple 在 WWDC26 展示如何在 Mac 上**完整本地執行 agentic AI workflow**——不需要雲端、不需要 API key、不需要付費，使用者資料完全保留在自己機器上。講者 Angelos 用 MLX stack 展示從模型載入、OpenAI 相容 server、本地 agent 串接到實際 demo（用 OpenCode 建 SwiftUI app、用 Xcode 修 bug）。

**核心架構**：MLX（底層 array framework）→ MLX-LM（模型載入/量化/微調）→ MLX-LM Server（OpenAI 相容 HTTP）→ Agent（Xcode / OpenCode / Pi agent）

**三大工程挑戰與解法**：
1. **Prompt processing**（context 越長越慢）→ M5 Neural Accelerator 加速 4×
2. **Concurrency**（多 subagent 同時打 server）→ Continuous batching
3. **Model size**（單機記憶體不夠）→ Distributed inference（多 Mac Thunderbolt / Ethernet）

---

## 二、章節脈絡

### Section 1｜Introduction（00:00 ~ 00:32，32s）

**重點摘要**：破題—AI agent 從研究原型走入日常工具，Apple silicon 讓整個 agentic loop 可以**完全本地**執行。

**內容：**
- 講者自我介紹：MLX team 工程師 Angelos
- 影片主軸：用 MLX 在 Mac 上**完整本地**建構並執行 agentic AI workflow
- 三個關鍵賣點：**無雲端、無 API key、無使用成本**——資料留本地，AI 隨時可用

> "No cloud, no API keys, just your hardware doing the work."
> "Your data stays on your machine; AI is available anywhere at any time and there are no usage costs."

---

### Section 2｜The chat and agentic loop（00:32 ~ 02:42，130s）

**重點摘要**：對比傳統 chat（user→model 來回）vs agentic loop（user→agent→model→tools→observe→model→...）

**內容：**

| 模式 | 流程 | 誰負責執行 |
|------|------|------------|
| **Chat** | user → prompt → model → response | User 自己 |
| **Agentic loop** | agent ↔ model（決策）+ agent ↔ tools（執行） | Agent 自主循環 |

- Agentic loop 的四個動作：**User→Agent → Agent→Model（推理）→ Agent→Tools（執行）→ Observe results → 回 model 規劃下一步**
- 「Loop」會持續循環直到任務完成
- 在 Apple silicon 上，**整個 loop 可以本地跑**——這是影片主軸

> "This is the agentic loop. And it keeps cycling until your task is done."
> "The agent doesn't know or care that the model is running on your Mac rather than in the cloud."

**Live demo 預告**：用 OpenCode 抓 MLX repo PR，agent 自己呼叫 `gh` CLI、讀 diff、產摘要，全程本地執行。

---

### Section 3｜Local agentic AI stack（02:42 ~ 04:36，114s）

**重點摘要**：MLX local agentic AI stack 的**四層架構**——從底層 MLX 到頂層 agent。

**四層架構**（由下而上）：

```
┌─────────────────────────────────────────────┐
│  ④ Agent Layer                              │
│  (任何 OpenAI chat completions 相容框架)     │
│   - Xcode / OpenCode / Pi agent / 自寫腳本    │
├─────────────────────────────────────────────┤
│  ③ MLX-LM Server                            │
│  (OpenAI 相容 HTTP server)                   │
│   - 標準 API                                  │
│   - Tool calling 支援                        │
│   - Reasoning model 支援                      │
│   - Drop-in 取代雲端 LLM API                  │
├─────────────────────────────────────────────┤
│  ② MLX-LM                                   │
│  (LLM 載入 / 量化 / 微調工具)                 │
│   - HuggingFace 數千模型                      │
│   - CLI + Python API                         │
├─────────────────────────────────────────────┤
│  ① MLX                                      │
│  (Apple 開源 array framework)                │
│   - 專為 Apple silicon 設計                   │
│   - Metal acceleration                       │
│   - Memory management                        │
└─────────────────────────────────────────────┘
```

**生態系**：除了 MLX 自家 stack，**Ollama、LM Studio、vLLM** 也都跑在 MLX 之上——代表 MLX 已是 Apple silicon AI 的事實標準。

> "Several popular apps and tools build on MLX and MLX-LM. Ollama, LM Studio, and vLLM are just a few of the most popular ones. The ecosystem is broad and growing, and if you're using one of these tools, chances are you're already running on MLX."

---

### Section 4｜Setting up your own agent（04:36 ~ 05:39，63s）

**重點摘要**：三步從零建好 local agent——`pip install` → 啟 server → 設定 agent URL。

**內容：**

| Step | 動作 | 指令 |
|------|------|------|
| 1 | 安裝 MLX-LM | `pip install mlx-lm` |
| 2 | 啟動 server（選支援 tool calling 的模型） | `mlx_lm.server --model mlx-community/Qwen-3.5-4B-8bit` |
| 3 | 把 agent 指向 local server | 設 `baseURL` 為 `http://127.0.0.1:8080/v1` |

**Sample code 1（4:40）— Set up MLX-LM and start the local server**：

```bash
# Step 1: Install MLX-LM
pip install mlx-lm

# Step 2: Start the server
mlx_lm.server --model mlx-community/Qwen-3.5-4B-8bit

# Step 3: Point your agent to the server
curl -X POST \
  http://127.0.0.1:8080/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{"model":"default_model","messages":[{"role":"user","content":"Hello!"}]}'
```

**Sample code 2（5:18）— Configure an agent to use your local MLX server**：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "mlx/default_model",
  "small_model": "mlx/default_model",
  "provider": {
    "mlx": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "MLX (local)",
      "options": {
        "baseURL": "http://127.0.0.1:8080/v1"
      },
      "models": {
        "default_model": {
          "name": "Default MLX Model"
        }
      }
    }
  }
}
```

---

### Section 5｜Making agents fast — Prompt Processing（05:39 ~ 06:53，74s）

**重點摘要**：第一個工程挑戰——**prompt processing** 在 agentic workflow 是瓶頸（每次 tool output 都要重算整個 context）；M5 Neural Accelerator 讓這件事 4× 更快。

**內容：**

- **挑戰本質**：agentic session 通常是**數十萬 token** 規模，且**絕大多數不是生成**——而是 prompt processing（讀 tool result、讀 codebase、規劃下一步）
- **M5 晶片新硬體**：**Neural Accelerators**（專為矩陣乘法設計的硬體單元）
- **MLX 自動對接**：MLX 直接 target Neural Accelerator，**不需要特殊 flag、不需要改 code**——模型選最佳 kernel 就跑
- **加速幅度**：M5 vs M4 的**矩陣乘法 4× 更快** → 透過 MLX 的特化 kernel（乘法 + attention）→ **prompt processing 幾乎正好 4× 速度提升**

> "Neural Accelerators make matrix multiplication four times faster on M5 compared to M4."
> "Taking advantage of Neural Accelerators requires no special arguments or code changes on your part, MLX selects the best kernel for the available hardware and it just works."

---

### Section 6｜Concurrency and distributed inference（06:53 ~ 09:20，147s）

**重點摘要**：第二、三個工程挑戰——**concurrency**（多 subagent 同時打）用 continuous batching 解、**model size**（單機裝不下）用 distributed inference 解。

**內容：**

**挑戰 2：Concurrency**
- 實務上 agent 不單獨運作，常 spawn 多個 subagent **平行**處理不同子任務（讀文件、搜 code、寫 test）
- 解法：**Continuous batching** — server 動態把多個 in-flight request 組成 batch 一起在 GPU 跑，新 request 可加入進行中的 batch，**不用排隊等**
- 效果：所有 subagent **並行被服務**，整個 workflow 不會卡

> "Instead of processing requests one at a time, it dynamically groups incoming requests into batches and processes them together on the GPU. New requests can join a batch in progress without waiting for the current one to finish."

**挑戰 3：Model size**
- 即使 512GB RAM 也不夠裝 1.6T 參數的 DeepSeek（單 weights 就要 800GB+）
- 解法：**MLX distributed support** — 把模型**跨多台 Mac** 切 shard，靠 Thunderbolt 或 Ethernet 連
- 對 agent 的兩個好處：
  1. 能跑**更大、更強**的模型
  2. **prompt processing 也平行化** → 直接加速 agentic loop

**Sample code 3（8:33）— Launch distributed inference with MLX**：

```bash
mlx.launch --hostfile hosts.json \
  --backend jaccl \
  /remote/path/to/mlx_lm.server \
  --model mlx-community/Qwen-3.5-122B-A3B-8bit
```

**macOS 26.2 新功能**：**Thunderbolt RDMA** — 提供低延遲、高頻寬的 Thunderbolt 通訊，讓 distributed inference **4 node 達 3× 加速**。

> "Starting with macOS 26.2, we have support for Thunderbolt RDMA, which provides low-latency, high-bandwidth communication over Thunderbolt. As a result, distributed inference with MLX has seen significant speed-ups: up to three times with four nodes."

**相關 session**：「Explore distributed inference and training with MLX」

---

### Section 7｜More examples — Live demos（09:20 ~ 13:01，221s）

**重點摘要**：兩個 live demo — **demo 1** 用 OpenCode + MLX 從無到有建 SwiftUI iPad 繪圖 app（含反覆迭代），**demo 2** 用 Xcode 接 MLX server 修 SwiftUI bug。

**內容：**

**Demo 1：從無到有建 SwiftUI app**
- 起點：**blank Xcode project**，要求 agent 建 iPad drawing app
- Agent 自動流程：看目錄結構 → 做 plan → 寫 code → 編譯 → 修錯
- 完成時間：**約 2 分鐘**產出第一版
- **迭代示範**：講者偏好「rounded end caps」筆觸 → 要求 agent 加上 → agent 改 code、重編譯、直到成功
- 重點：**全程本地**（model 跑在 MLX-LM server，agent 用 standard dev tools 如 `xcodebuild` 驗證）

> "Using an agent means we don't need to copy anything or even build the project. The agent writes the file then builds the app, fixing any errors it encounters along the way."
> "It seems that we have a fully functional drawing app. That's really nice for something that was built in 2 minutes."

**Demo 2：用 Xcode 修 SwiftUI bug**
- 同一個 drawing app project，故意引入 bug
- Xcode 設定 → Intelligence tab → **Add Chat Provider → Locally Hosted** → 設 port 8080 → 完成
- Xcode 內直接問 model → 數秒內**定位 bug、檢查周邊 code、寫 fix**
- 重點：**local agent 整合進既有的 Xcode 開發 workflow** — 讀 project file、理解 build error、做 targeted fix

> "This shows how a locally running agent can integrate with your existing development workflow in Xcode, reading project files, understanding build errors, and making targeted fixes. Local AI means your code never leaves your Mac."

---

### Section 8｜Next steps（13:01 ~ 13:37，36s）

**重點摘要**：總結 + 行動呼籲——三步就能開始：`pip install mlx-lm` → 啟 server → 接 agent。

**內容：**
- 全 stack 重申：MLX → MLX-LM → Server → Agent
- 三大加速手段：Neural Accelerators + Continuous batching + Distributed inference
- 立即可用：**Everything we showed today is open-source and available right now**

> "Everything we showed today is open-source and available right now."
> "Thank you for watching and I'm excited to see what you build with local agentic AI on the Mac."

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone `xiaotian_clone_v1` + `speech-2.8-hd`），約 4 分 40 秒（280s，silent ratio 7.49%）
> 口播稿原文：transcripts/20260627_Angelos_WWDC26_MLX_口播稿.txt

- [opus 2.3 MB](../audio/20260627_Angelos_WWDC26_MLX.opus)（Telegram 友善）
- [m4a 4.7 MB](../audio/20260627_Angelos_WWDC26_MLX.m4a)（iOS 友善）
- [mp3 4.3 MB](../audio/20260627_Angelos_WWDC26_MLX.mp3)（通用格式）

---

## 三、關鍵概念定義表

| 概念 | 定義 | 出處/應用 |
|------|------|-----------|
| **MLX** | Apple 開源 array framework，專為 Apple silicon 設計，處理 Metal 加速與記憶體管理 | Stack 最底層，所有東西的基礎 |
| **MLX-LM** | MLX 上的 LLM 工具包：載入、量化、微調；CLI + Python API；支援 HuggingFace 數千模型 | Stack 第二層 |
| **MLX-LM Server** | OpenAI 相容 HTTP server，把 local model 透過標準 API 暴露；支援 tool calling + reasoning models | Stack 第三層 |
| **MLX Neural Accelerator** | M5 晶片新硬體，專為矩陣乘法設計；MLX 自動 target，無需特殊參數 | Section 5 解 prompt processing 瓶頸 |
| **Continuous batching** | Server 動態把多個 in-flight request 組成 batch 在 GPU 同時跑 | Section 6 解 concurrency 瓶頸 |
| **Distributed inference** | 模型跨多台 Mac 切 shard，靠 Thunderbolt / Ethernet 通訊 | Section 6 解 model size 瓶頸 |
| **Thunderbolt RDMA** | macOS 26.2 新功能，低延遲高頻寬 Thunderbolt 通訊 | Section 6 讓 distributed 4 node 達 3× 加速 |
| **Agentic loop** | User→Agent→Model→Tools→Observe→回 Model→... 的循環，直到任務完成 | Section 2 對比傳統 chat |
| **Tool calling** | Model 透過結構化 schema 呼叫 function 的能力；MLX-LM Server 支援 | Section 3 server 能力 |
| **JACCL backend** | MLX distributed 用的 collective communication backend | Sample code 3 |

---

## 四、人物/角色分析

### Angelos（講者）

- **角色**：Apple MLX team 工程師
- **專業背景**：負責 MLX 開源 array framework 與 MLX-LM 生態
- **演講風格**：實作導向（90% 在 demo），先講 stack 再講 demo，邏輯清晰
- **代表觀點**：
  - 「本地 AI」不只是隱私議題，更是**成本與可用性**議題（無 API key、無使用費、隨時可用）
  - Apple silicon 不是只能跑 inference，還能跑**完整的 agentic loop**——這跟雲端相比是**架構性**的不同
  - MLX 不只是 Apple 自家工具，**Ollama / LM Studio / vLLM 都跑在 MLX 之上**——代表 MLX 已成 Apple silicon AI 的事實標準

---

## 五、核心主旨

> **Apple silicon + MLX stack 已能做到「完整的本地 agentic AI」——不只是推論，從 agent loop 到 tool calling 到多機 distributed inference 全在 Mac 上跑，程式碼與資料不離機。**

---

## 六、金句摘錄

1. "No cloud, no API keys, just your hardware doing the work."
2. "Your data stays on your machine; AI is available anywhere at any time and there are no usage costs."
3. "This is the agentic loop. And it keeps cycling until your task is done."
4. "The agent doesn't know or care that the model is running on your Mac rather than in the cloud."
5. "Taking advantage of Neural Accelerators requires no special arguments or code changes on your part, MLX selects the best kernel for the available hardware and it just works."
6. "Neural Accelerators make matrix multiplication four times faster on M5 compared to M4."
7. "Several popular apps and tools build on MLX and MLX-LM. Ollama, LM Studio, and vLLM are just a few of the most popular ones."
8. "Local AI means your code never leaves your Mac."
9. "Everything we showed today is open-source and available right now."

---

## 七、延伸閱讀 / 相關 Session

- **WWDC26 Session 232**：Run local agentic AI on the Mac using MLX（本影片）
- **WWDC26 Session（相關）**：Explore distributed inference and training with MLX（Section 6 提到的延伸 session）
- **MLX**：https://github.com/ml-explore/mlx
- **MLX-LM**：`pip install mlx-lm`
- **OpenCode**：https://opencode.ai/（demo 用的 agent framework）
- **生態系**：Ollama / LM Studio / vLLM（都跑在 MLX 上）

---

## 八、SOP 補充：HTML-Video-Page 路徑解析方式（給未來 reference）

**識別特徵**：`developer.apple.com/videos/play/<event>/<session>/` 開頭的 URL

**解析流程**：
1. `curl` 抓 HTML（readability 抽不到內容）
2. Regex 抽 4 種資料：
   - `<input id="analytics-meta">` → 影片 metadata（title / event / duration）
   - `<section id="transcript-content">` 內 `<span data-start="X">` → 逐字稿（帶時間碼）
   - `<li class="supplement summary">` → 章節摘要（data-start-time / data-chapter-end-time）
   - `<li class="sample-code-main-container">` 內 `<pre class="code-source">` → sample code（帶時間錨點）
3. 影片 mp4 / HLS URL 在 `https://devstreaming-cdn.apple.com/videos/...` pattern

**vs YouTube 路徑差異**：
| 項目 | YouTube | HTML-Video-Page |
|------|---------|-----------------|
| 影片下載 | 需要 yt-dlp | **不需要**（transcript 已內嵌） |
| Whisper | 需要 | **不需要**（已有完整 transcript） |
| 章節來源 | YouTube chapters JSON | HTML `data-chapter-index` attribute |
| Sample code | 人工另抓 | HTML 內嵌（含時間錨點） |
| 時間碼格式 | `(mm:ss ~ mm:ss)` | 同 YouTube |
| Bar 2 口播稿字數目標 | 1500-1700 chars | **1300-1500 chars**（13 分鐘影片偏短） |
