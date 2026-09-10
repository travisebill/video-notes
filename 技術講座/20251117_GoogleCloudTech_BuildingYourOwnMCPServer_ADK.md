# 【Building your own MCP server with ADK】

**講者｜Google Cloud Tech（Google 官方 AI/ML YouTube 頻道，ADK 系列主講人 Annie）**
**影片連結｜https://www.youtube.com/watch?v=XwlVHm3JKWU**
**影片長度**｜9:01（541s）
**發布日期｜2025-11-17**
**類型｜教學影片（MCP 系列 Ep.2 完結篇）**
**主題｜Google Agent Development Kit (ADK) × Model Context Protocol (MCP) — 用 ADK 建自己的 MCP server**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Google Cloud Tech 推出 Model Context Protocol（MCP）系列教學影片，這是系列第二集也是完結篇。影片用 9 分多鐘從「核心元件」到「三個實際使用案例」完整說明如何用 ADK 建自己的 MCP server。

影片的核心架構分為兩大部分。第一部分介紹建 MCP server 的核心元件：MCP library、兩個 server handler（list_tools / call_tool）、連線機制（stdio / streamable HTTP）、async I/O 設計。第二部分展示三個實際使用案例：API MCP server（以 load_web_page 為例）、Database MCP server（用 MCP Toolbox for Database）、Custom MCP server（Imagen、Veo、內部 API、自訂邏輯）。影片最後強調建 MCP server 不只強化自己的 ADK agent，更讓工具對整個 MCP 生態系可用。

整支影片的關鍵洞察：建 MCP server 是「工具貢獻」而非「工具消費」——連接 MCP server（Ep.1）是消費既有工具，建 MCP server（Ep.2）是把自己的工具包裝成 MCP 標準讓任何 client 都能用；FastMCP library 讓這個過程更簡單；MCP Toolbox for Database 讓企業資料庫整合不再是從零寫起。

---

## 章節脈絡

| 段落 | 時間 | 標題 | 一句話摘要 |
|------|------|------|----------|
| Section 1 | 00:00 - 00:30 | 開場 + 系列回顧 | MCP 系列 Ep.2，重點是建自己的 MCP server |
| Section 2 | 00:30 - 03:00 | 建 MCP server 的核心元件 | MCP library + list_tools/call_tool + 連線機制 + async I/O |
| Section 3 | 03:00 - 05:00 | Use Case 1：API MCP server | load_web_page 範例：list_tools 暴露、call_tool 呼叫、ADK web 測試 |
| Section 4 | 05:00 - 06:30 | Use Case 2：Database MCP server | MCP Toolbox for Database 開源方案 |
| Section 5 | 06:30 - 08:30 | Use Case 3：Custom MCP server | Imagen / Veo / 內部 API / 自訂邏輯 / FastMCP |
| Section 6 | 08:30 - 09:01 | 收尾 + 系列總結 | 從單獨 agent 到互聯 AI 生態系 |

> 時間軸是根據 1163-word 逐字稿內容比例估算。

---

## 關鍵概念定義

| 概念 | 定義 | 角色 / 應用 |
|------|------|------------|
| **MCP server building** | 把 ADK tools 包裝成 MCP 標準介面的過程 | 讓自己的工具被任何 MCP client 使用 |
| **MCP library** | Python library，提供建 MCP server 的框架 | ADK 官方提供 |
| **list_tools handler** | MCP server 的一個 handler，告訴 client 哪些 tools 可用 | 工具發現機制 |
| **call_tool handler** | MCP server 的另一個 handler，執行 client 呼叫的 tool | 工具執行機制 |
| **stdio** | 本地開發用的 MCP 連線機制（透過 stdin/stdout）| 簡單部署、subprocess 模式 |
| **streamable HTTP** | Production 用的 MCP 連線機制（可走網路）| 可擴展、跨機器 |
| **async I/O** | Python 的非同步 I/O 模式 | ADK 和 MCP library 都是 async-first |
| **API MCP server** | 把 API（如 load_web_page）包裝成 MCP server | 讓 agent 透過 MCP 標準呼叫 API |
| **MCP Toolbox for Database** | Google 開源的 database MCP server | 企業資料庫快速整合 |
| **Custom MCP server** | 自訂邏輯的 MCP server（Imagen、Veo、內部 API）| 處理非標準工具 |
| **FastMCP** | 簡化 MCP server 建置和部署的 library | 降低開發門檻 |
| **Tool contribution** | 把自己的工具包裝成 MCP 標準，貢獻給生態系 | 從「消費」到「貢獻」的心態轉變 |

---

## 人物 / 角色分析

### Google Cloud Tech（講者 Annie）
- **背景**：Google 官方 AI/ML YouTube 頻道 ADK 系列主講人（從逐字稿口氣推斷，可能是 Developer Advocate）
- **關鍵角色**：本影片（MCP 系列 Ep.2 完結篇）講者，延續 Ep.1 的「連接 MCP server」主題深入到「建自己的 MCP server」
- **代表觀點**：建 MCP server 是工具貢獻而非工具消費；FastMCP 和 MCP Toolbox 降低建置門檻

---

## 核心主旨

> **用 ADK 建自己的 MCP server 只需四個核心元件：MCP library 提供框架、list_tools/call_tool 兩個 handler 處理工具發現與執行、stdio/streamable HTTP 兩種連線機制、async I/O 設計；應用場景涵蓋 API MCP server（load_web_page 範例）、Database MCP server（MCP Toolbox for Database 開源方案）、Custom MCP server（Imagen/Veo/內部 API/自訂邏輯/FastMCP 簡化部署）；建 MCP server 不只強化自己的 ADK agent，更讓工具對整個 MCP 生態系可用，是從單獨 agent 走向真正互聯 AI 生態系的關鍵一步。**

---

## 金句摘錄

1. > "At a high level, it's about wrapping your ADK tools inside an MCP server."
   > —— 建 MCP server 的本質

2. > "MCP servers need a way to communicate. So for local development or simple deployment, SCIO is common. For scalable production environment, streamable HTTP is often preferred."
   > —— 連線機制選擇：stdio vs streamable HTTP

3. > "The main idea is your MCP server acts as a wrapper and translator. It makes your ADK tools discoverable and lets other clients call them in a standardized way."
   > —— MCP server 的角色定位

4. > "Instead of building everything yourself, you can deploy the MCP Toolbox as a service, and then connect your ADK agent using MCP toolset."
   > —— MCP Toolbox for Database 的價值

5. > "By building custom MCP server, you can really unleash your creativity. You are no longer limited to consuming existing tools. Instead, you're contributing tools to the wider MCP ecosystem."
   > —— 從消費到貢獻的心態轉變

---

## 延伸閱讀 / 參考

- **Model Context Protocol 官方網站** — https://modelcontextprotocol.io/
- **MCP Toolbox for Database** — Google 開源 database MCP server
- **FastMCP** — 簡化 MCP server 開發的 Python library
- **Google Agent Development Kit (ADK) 官方文件** — https://google.github.io/adk-docs/
- **Google Cloud Tech YouTube 頻道** — https://www.youtube.com/@googlecloudtech
- ADK 系列影片（按日期排序）：
  - #1 Foundations of multi-agent systems with ADK (2025-10-01)
  - #2 Workflow agents and communication in ADK (2025-10-08)
  - #3 Connecting ADK Agents to MCP Servers (2025-11-07)
  - #5 The agent evaluation revolution (2025-12-03)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 1 分 56 秒
> 口播稿原文：transcripts/20251117_GoogleCloudTech_BuildingYourOwnMCPServer_ADK_口播稿.txt

- [opus 0.5 MB](../audio/20251117_GoogleCloudTech_BuildingYourOwnMCPServer_ADK_口播稿.opus)（Telegram 友善）
- [m4a 1.4 MB](../audio/20251117_GoogleCloudTech_BuildingYourOwnMCPServer_ADK_口播稿.m4a)（iOS 友善）
- [mp3 1.8 MB](../audio/20251117_GoogleCloudTech_BuildingYourOwnMCPServer_ADK_口播稿.mp3）（通用格式）
