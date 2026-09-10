# 【Connecting ADK Agents to MCP Servers】

**講者｜Google Cloud Tech（Google 官方 AI/ML YouTube 頻道，ADK 系列主講人 Annie）**
**影片連結｜https://www.youtube.com/watch?v=JnKkdHaatwU**
**影片長度**｜7:39（459s）
**發布日期｜2025-11-07**
**類型｜教學影片（MCP 系列 Ep.1）**
**主題｜Google Agent Development Kit (ADK) × Model Context Protocol (MCP) — ADK agents 如何連接 MCP servers**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Google Cloud Tech 推出 Model Context Protocol（MCP）系列教學影片，這是系列第一集，介紹 ADK agents 如何連接 MCP servers。影片用 7 分多鐘從「MCP 是什麼」、「為什麼要用 MCP」到「如何實際連接」三個層次完整說明。

影片的核心架構分為三大部分。第一部分介紹 MCP 概念：Model Context Protocol 是定義 LLM 和 AI agent 與外部世界溝通的開放標準，用 USB-C 埠比喻 MCP 是 AI 的萬用接頭。第二部分說明 MCP 的價值：更強大（存取外部能力如檔案系統、資料庫、Google Maps）、更可靠（標準化介面）、更實用（模組化、安全控制、簡化部署）。第三部分展示 ADK 如何用 MCP toolset 作為橋樑連接 MCP server，並用 file system 和 Google Map 兩個實際範例演示。

整支影片的關鍵洞察：MCP 解決了 AI agent 與外部工具整合的「重複造輪子」問題——過去每個工具都需要客製化連接器，現在透過 MCP 標準，一個 ADK agent 可以用同一套介面連接任意 MCP-compliant server，大幅降低整合成本並提升可維護性。

---

## 章節脈絡

| 段落 | 時間 | 標題 | 一句話摘要 |
|------|------|------|----------|
| Section 1 | 00:00 - 00:30 | 開場 + 系列目標 | MCP 系列 Ep.1，2 集完結 |
| Section 2 | 00:30 - 01:50 | 什麼是 MCP server？ | Model Context Protocol = AI 的 USB-C 埠 |
| Section 3 | 01:50 - 03:50 | 為什麼要用 MCP？ | 強大 + 可靠 + 實用：外部能力、模組化、安全、簡化部署 |
| Section 4 | 03:50 - 06:00 | 如何連接 ADK agent 到 MCP server？ | ADK MCP toolset 自動處理連接、工具載入、通訊轉譯 |
| Section 5 | 06:00 - 07:39 | 兩個實際範例 | File system MCP server + Google Map MCP server |
| Section 6 | 07:20 - 07:39 | 收尾 + 下集預告 | 下集反過來：用 ADK tools 建自己的 MCP server |

> 時間軸是根據 1052-word 逐字稿內容比例估算。

---

## 關鍵概念定義

| 概念 | 定義 | 角色 / 應用 |
|------|------|------------|
| **MCP (Model Context Protocol)** | 定義 LLM/AI agent 與外部世界溝通的開放標準 | AI 的「USB-C 埠」，統一介面 |
| **MCP server** | 暴露工具的服務端（連接資料源、API、自訂動作）| 提供工具給 MCP client 使用 |
| **MCP client** | 探索並使用 MCP server 暴露的工具 | ADK agent 通常扮演此角色 |
| **MCP toolset** | ADK 的 MCP 橋樑，自動處理連接、載入、轉譯、轉發 | 簡化 ADK agent 與 MCP server 的整合 |
| **External capabilities** | 透過 MCP 可存取的外部能力（檔案系統、BigQuery、MongoDB、Google Maps、Imagen）| 讓 agent 與真實世界互動 |
| **Modularity** | MCP server 是獨立服務，可被任何 MCP-compliant client 接入 | 可重用性 + 鬆耦合 |
| **Reusability** | 不需要為每個工具寫客製化黏合代碼 | 降低整合成本 |
| **Security & Control** | MCP 允許定義明確的權限邊界 | 企業級安全要求 |
| **Simplified deployment** | 遠端 MCP server 可把工具從 agent 解耦 | Cloud Run / GKE 等環境容易擴展 |
| **Universal adapter** | 一個標準介面連接所有工具，USB-C 比喻 | 解決 M×N 整合問題 |

---

## 人物 / 角色分析

### Google Cloud Tech（講者 Annie）
- **背景**：Google 官方 AI/ML YouTube 頻道 ADK 系列主講人（從逐字稿口氣推斷，可能是 Developer Advocate）
- **關鍵角色**：本影片（MCP 系列 Ep.1）講者，從 Ep.1 Ep.2 的 multi-agent 系列切到 MCP 工具整合主題
- **代表觀點**：MCP 是 AI agent 連接外部世界的標準答案；ADK MCP toolset 讓整合變簡單

---

## 核心主旨

> **MCP（Model Context Protocol）是 LLM 與 AI agent 連接外部工具的開放標準，USB-C 埠比喻完美：不用為每個工具寫客製化連接器，一個 MCP 規範的介面就夠；Google ADK 透過 MCP toolset 自動處理連接、工具載入、通訊轉譯、請求轉發四個步驟，讓 ADK agent 可以輕鬆接入 file system、BigQuery、Google Maps、Imagen 等外部能力；MCP 帶來四大價值：更強大（外部能力）、更可靠（標準化）、更實用（模組化 + 簡化部署）、更安全（明確權限邊界）。**

---

## 金句摘錄

1. > "Think of it as MCP is a USB-C port for AI. Instead of building a custom connector for every single tool, you get one universal way of plugging in."
   > —— MCP 的 USB-C 比喻

2. > "In most cases, your ADK agent acts as an MCP client and it connects two MCP servers to gain new capabilities."
   > —— ADK agent 與 MCP 的角色關係

3. > "MCP makes your agents more powerful, more reliable, and more practical."
   > —— MCP 的三大價值

4. > "An MCP server can be a standalone service and any MCP-compliant client, including ADK agent, can plug in. And there's no custom glue code required."
   > —— MCP 的模組化優勢

5. > "You can think of it as ADK's building bridge to the MCP world."
   > —— MCP toolset 的角色定位

---

## 延伸閱讀 / 參考

- **Model Context Protocol 官方網站** — https://modelcontextprotocol.io/
- **Google Agent Development Kit (ADK) 官方文件** — https://google.github.io/adk-docs/
- **Google Cloud Tech YouTube 頻道** — https://www.youtube.com/@googlecloudtech
- ADK 系列影片（按日期排序）：
  - #1 Foundations of multi-agent systems with ADK (2025-10-01)
  - #2 Workflow agents and communication in ADK (2025-10-08)
  - #4 Building your own MCP server with ADK (2025-11-17)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 2 分 30 秒
> 口播稿原文：transcripts/20251107_GoogleCloudTech_ConnectingADKAgentsToMCPServers_口播稿.txt

- [opus 0.6 MB](../audio/20251107_GoogleCloudTech_ConnectingADKAgentsToMCPServers_口播稿.opus)（Telegram 友善）
- [m4a 1.8 MB](../audio/20251107_GoogleCloudTech_ConnectingADKAgentsToMCPServers_口播稿.m4a)（iOS 友善）
- [mp3 2.3 MB](../audio/20251107_GoogleCloudTech_ConnectingADKAgentsToMCPServers_口播稿.mp3）（通用格式）
