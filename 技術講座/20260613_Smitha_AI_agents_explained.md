# AI Agents 入門：8 分鐘打造你的第一個 Agent

> **講者**：Smitha（Google Cloud Tech）
> **影片連結**：https://youtu.be/Zqno_vux6d8
> **影片長度**：8 分 29 秒
> **字幕來源**：YouTube 英文自動字幕（en-orig / auto-generated VTT），已清除時間碼、合併重複後轉為文字
> **整理日期**：2026-06-13
> **TTS 語音**：`xiaotian_clone_v1`（語音 clone，MCP `text_to_audio` 生成）
> **處理方式**：MCP `text_to_audio` (speech-2.8-hd) → 繁中介紹 + ffmpeg 轉 opus/m4a

---

## 目錄

- [一、核心觀念：Agent 跟 Chatbot 差在哪](#一核心觀念agent-跟-chatbot-差在哪)
- [二、三種 Agent Pattern](#二三種-agent-pattern)
- [三、實作：用 Google ADK 寫一個部落格 Agent](#三實作用-google-adk-寫一個部落格-agent)
- [四、執行 demo](#四執行-demo)
- [五、為什麼這部影片值得看](#五為什麼這部影片值得看)
- [關鍵資源](#關鍵資源)

---

## 一、核心觀念：Agent 跟 Chatbot 差在哪？

傳統 chatbot 是「**給問題，給答案**」— 一次 response 就結束。
Agent（智慧代理）不一樣，它能：

1. **Reason** — 拆解問題，思考要分幾步
2. **Act** — 呼叫 API、執行程式碼、查資料
3. **Observe** — 看結果對不對
4. **Adapt** — 根據結果決定下一步

學術上最經典的解釋是 **ReAct paper**（*Synergizing Reasoning and Acting in Language Models*）：LLM 不只是「一次吐完答案」，而是「**思考 → 行動 → 觀察 → 調整**」的迴圈。

---

## 二、三種 Agent Pattern

不是所有 agent 都一樣。常見三種 pattern：

| Pattern | 行為 | 適用場景 | 缺點 |
|---|---|---|---|
| **Sequential（循序）** | 像產線，一步接一步 | 流程固定、可預測 | 太僵硬 |
| **Reactive（反應式）** | 看當下狀態決定下一步 | 動態環境 | 不會事先規劃 |
| **Deliberate / Planning（規劃式）** | 先擬計畫再執行 | 多步驟且有相依性的目標（如訂旅遊） | 計算成本高 |

實務上選哪個：**看問題複雜度**。簡單 → sequential；動態 → reactive；多步驟有依賴 → planning。

---

## 三、實作：用 Google ADK 寫一個部落格 Agent

影片用 **Google Agent Development Kit（ADK）** 示範做一個「**部落格寫手**」：給主題，自動產出大綱 → 寫成文章 → 給三個備選標題 + 兩條 tweet 級的 hook。

### 整體架構（4 個 sub-agent + 2 個 checker + 1 個 root）

```
                 ┌─────────────────────┐
   user topic →  │   Root "blogger"    │
                 └──────────┬──────────┘
                            │ 呼叫兩個 tool
                ┌───────────┴───────────┐
                ▼                       ▼
   ┌────────────────────┐   ┌────────────────────┐
   │ robust_blog_planner│   │ robust_blog_writer │
   │  (Loop agent)      │   │  (Loop agent)      │
   │                    │   │                    │
   │  ┌──────────────┐  │   │  ┌──────────────┐  │
   │  │ blog_planner │←→│   │  │ blog_writer  │←→│
   │  └──────────────┘  │   │  └──────────────┘  │
   │  ┌──────────────┐  │   │  ┌──────────────┐  │
   │  │ outline_     │  │   │  │ post_        │  │
   │  │ validation_  │  │   │  │ validation_  │  │
   │  │ checker      │  │   │  │ checker      │  │
   │  └──────────────┘  │   │  └──────────────┘  │
   └────────────────────┘   └────────────────────┘
```

### 重點設計：Loop + Validation Checker

每個 LLM agent 都包進 **Loop agent** 裡面，搭配一個**驗證 checker**：

- **blog_planner** 產大綱 → 寫進 shared state 的 `blog_outline`
- **outline_validation_checker** 檢查大綱：有標題、intro、4–6 個 section、conclusion 才回答 "okay"，缺東西就回答 "retry" 並說明缺什麼
- Loop agent：checker 說 retry 就重跑 planner，最多 **3 次**

這樣做的好處：**LLM 偶爾會漏東西，loop 是它的安全網**。這個 pattern 在 production agent 系統很常見，概念上類似 unit test 的 retry。

### Root agent 的精簡哲學

`blogger` 這個 root agent **只暴露兩個 tool**（planner、writer）給使用者。它不直接管內部的 loop 細節 — 對它來說就只是「先 plan 再 write」。

> **設計原則**：root agent 的 workflow 越簡潔、越 controlled，行為越好預測。

---

## 四、執行 demo

作者在 ADK web UI 跑這個 agent，下指令「寫一篇 top 10 use cases for AI agents 的部落格」。可以看到 sub-agent 怎麼協作：planner 跑 → checker 通過 → writer 跑 → checker 通過 → root 組合出最終結果。

---

## 五、為什麼這部影片值得看

1. **從觀念到程式碼一次走完** — 不是只講理論，給你真的能跑的 code
2. **展示 agent 設計的核心 pattern**：拆解 + loop + validation + root orchestration
3. **Google ADK 是 production-grade framework**，跟 LangGraph / CrewAI 思路類似但整合 Google 生態（Vertex AI、Gemini）

## 關鍵資源
- 影片附的 codelab → goo.gle/3Q5TSt3
- GitHub repo → goo.gle/4fsahT8
- Google ADK → goo.gle/3Q3enqf
