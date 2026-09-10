# 【Foundations of multi-agent systems with ADK】

**講者｜Google Cloud Tech（Google 官方 AI/ML YouTube 頻道）**
**影片連結｜https://www.youtube.com/watch?v=pX0_iIfRilU**
**影片長度**｜5:17（317s）
**發布日期｜2025-10-01**
**Module｜A Multi-agent 基礎 (Ep.1)**
**類型｜教學影片（ADK 系列 Ep.1 入門）**
**主題｜Google Agent Development Kit (ADK) 系列開場 — Multi-agent system 基礎概念 + ADK 三種 agent 類型 + Agent hierarchy 設計原則**
**中文摘要｜Ryo（Backend Engineer Agent）**

---

## 主題與背景

Google Cloud Tech 推出 Google Agent Development Kit（ADK）系列教學影片，這是 Ep.1 入門篇。影片用 5 分鐘快速建立 multi-agent system 的三大基礎觀念：什麼是 multi-agent system、ADK 如何支援 multi-agent 開發、agent hierarchy 設計原則。

影片的核心架構是「由觀念到實作」的漸進式說明：先從鳥群飛翔的比喻建立 decentralized control、local view、emergent behavior 三個關鍵概念，再切入 ADK 提供的三種 agent 類型（LLM agent、workflow agent、custom agent）及其角色定位，最後用公司組織圖（CEO/VP/Manager/Worker）的比喻說明 agent hierarchy 的 single parent rule。

整支影片的關鍵洞察：multi-agent system 不是把多個 AI 工具串起來這麼簡單，而是要讓每個 agent 保有「自主決策」（decentralized）跟「局部視野」（local view），系統層級的智慧（emergent behavior）才會自然浮現。ADK 把這套理念產品化，提供 hierarchy + 三種 agent 類型的固定框架。

---

## 章節脈絡

| 段落 | 時間 | 標題 | 一句話摘要 |
|------|------|------|----------|
| Section 1 | 00:00 - 00:50 | 開場 + 系列目標 | 介紹 ADK multi-agent series，今天是 Ep.1 |
| Section 2 | 00:50 - 02:30 | 什麼是 multi-agent system | 三個關鍵概念：decentralized control、local view、emergent behavior |
| Section 3 | 02:30 - 04:00 | ADK 如何支援 multi-agent 開發 | 三種 agent 類型：LLM agent、workflow agent、custom agent |
| Section 4 | 04:00 - 05:00 | Agent hierarchy 設計原則 | Parent-sub agent + single parent rule + CEO 比喻 |
| Section 5 | 05:00 - 05:17 | 收尾 + 下集預告 | 下一集談 workflow orchestration 跟 agent communication |

> 時間軸是根據 711-word 逐字稿內容比例估算，非官方 timecode。

---

## 關鍵概念定義

| 概念 | 定義 | 角色 / 應用 |
|------|------|------------|
| **Multi-agent system** | 多個獨立 agent 協作解決單一 agent 無法輕易處理的複雜問題 | 適合需要分散式決策的場景 |
| **Decentralized control** | 沒有單一 boss，每個 agent 自主決定 | 鳥群飛翔比喻 |
| **Local view** | 每個 agent 只知道周圍環境，不是整個系統 | 體育場人群比喻 |
| **Emergent behavior** | 局部簡單規則產生全局複雜模式 | 集體智慧的浮現 |
| **ADK (Agent Development Kit)** | Google 推出的 multi-agent 開發框架，原生支援 multi-agent | 簡化開發者負擔 |
| **LLM agent** | 用 LLM（如 Gemini）當腦，理解輸入、推理、選 tool | 負責「思考」 |
| **Workflow agent** | 像 manager，orchestrate 多個 agent 一起完成任務 | 負責「協調」 |
| **Sequential agent** | 一個接一個跑（組裝線） | 任務有順序相依 |
| **Parallel agent** | 多個任務同時跑（多 API 並行） | 任務獨立 |
| **Loop agent** | 重複直到完成 | 除錯、迭代 |
| **Custom agent** | 自訂 Python 邏輯，繼承 base agent | 需要完全控制時 |
| **Agent hierarchy** | 像公司組織圖，root agent 是 CEO | 結構化 multi-agent |
| **Single parent rule** | 每個 sub agent 只有一個 parent agent | 避免混亂指揮鏈 |
| **Parent agent** | 管理多個 sub agent 的上層 | 控制下層行為 |
| **Sub agent** | 被 parent 管理的下層 agent | 執行具體任務 |

---

## 人物 / 角色分析

### Google Cloud Tech（講者）
- **背景**：Google 官方 AI/ML YouTube 頻道
- **角色**：本影片講者（從逐字稿口氣推斷是系列主講人，可能是 Developer Advocate 角色）
- **代表觀點**：ADK 是降低 multi-agent 開發門檻的關鍵框架；三種 agent 類型分工清楚（brain / manager / specialist）

---

## 核心主旨

> **Multi-agent system 的核心不是「多裝幾個 AI」，而是讓每個 agent 保有 decentralized 自主決策 + local 局部視野，讓系統層級的 emergent behavior 自然浮現；Google ADK 把這套理念產品化，提供 LLM agent（腦）、workflow agent（manager）、custom agent（specialist）三種角色，以及 single-parent-rule 的 hierarchy 結構，讓開發者不用 hack 也能建構真正可運作的 multi-agent 系統。**

---

## 金句摘錄

1. > "A multi-agent system is when individual agents work together."
   > —— 影片對 multi-agent 的最簡定義

2. > "There's no single boss. Each agent just decide for itself. You can think of it like a flock of birds swirling in the sky."
   > —— Decentralized control 的鳥群比喻

3. > "Each agent only know what's around it, but not the whole system."
   > —— Local view 的概念

4. > "You know, for those single local rules, amazing global patterns emerge."
   > —— Emergent behavior 的關鍵洞察

5. > "Google Agent Development Kit, ADK, was built in with multiple agent support in mind. Instead of you just hack things together, it gives you three main types of agent."
   > —— ADK 的設計哲學

6. > "The root agent is a CEO. And the sub agent are VPs, managers, and workers."
   > —— Agent hierarchy 的公司比喻

---

## 延伸閱讀 / 參考

- **Google Agent Development Kit (ADK) 官方文件** — https://google.github.io/adk-docs/
- **Google Cloud Tech YouTube 頻道** — https://www.youtube.com/@googlecloudtech
- ADK 系列影片（按日期排序）：
  - #2 Workflow agents and communication in ADK (2025-10-08)
  - #3 Connecting ADK Agents to MCP Servers (2025-11-07)
  - #4 Building your own MCP server with ADK (2025-11-17)

---

## 🎙️ 音檔導覽

> MiniMax TTS 語音導覽（voice clone, speech-2.8-hd），約 1 分 59 秒
> 口播稿原文：transcripts/20251001_GoogleCloudTech_FoundationsOfMultiAgentSystems_ADK_口播稿.txt

- [opus 0.5 MB](../audio/20251001_GoogleCloudTech_FoundationsOfMultiAgentSystems_ADK_口播稿.opus)（Telegram 友善）
- [m4a 2.0 MB](../audio/20251001_GoogleCloudTech_FoundationsOfMultiAgentSystems_ADK_口播稿.m4a)（iOS 友善）
- [mp3 1.8 MB](../audio/20251001_GoogleCloudTech_FoundationsOfMultiAgentSystems_ADK_口播稿.mp3）（通用格式）
