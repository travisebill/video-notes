# Generative UI 與 MCP Apps：Ruben Casas @ Postman

> **講者**：Ruben Casas（Postman Staff Engineer）
> **連結**：<https://youtu.be/hCMrEfPG2Yg>
> **整理日期**：2026-06-08
> **Owner**：Ryo 🐱
> **影片長度**：~16 分鐘

---

## 1. 核心命題（一句話）

**「新電腦的 GUI 還沒被發明 — 我們還在 radio era，目前的 static / declarative UI 只是過渡形態；真正的 Generative UI 必須靠 sandboxed distribution（MCP apps）+ 人機協作（shared canvas）才能落地。」**

支撐這個命題的 3 個支柱：
1. **模型能力已到位** — GPT 5.2 / Opus 4.5 寫前端比人好（3 年內從 copy-paste 到 production-grade）
2. **分發機制還沒到位** — 生成式 UI 需要 boundary / containment / sandbox，否則是 security hole
3. **互動範式還沒到位** — 從「components」走向「collaboration」，人 + agent 共用 canvas

---

## 2. 章節脈絡

### Ch.1｜開場：3 年的 vibe coding 演進
- **2022 Nov**：copy-paste ChatGPT 產出 code block → 「poor man's vibe coding」
- **2025 Q4**：GPT 5.2 / Opus 4.5 兩個 release 是 inflect point
  - 長時程任務（long horizon）OK
  - 高 fidelity UI 生成 OK
  - 速度快
- 講者親身實驗：single prompt「rewrite my blog」→ LLM 給出 search box + blur animation + a11y
- **轉折**：模型寫前端 code 已比人強，那為什麼 UI 還停在 static？

### Ch.2｜提問：Jarvis 在哪？
- 為什麼沒有 floating UI windows 自動出現 / 消失？
- 為什麼 SaaS 還在「把 chat 塞進首頁」？

### Ch.3｜兩個未來路徑（開放式）
- **A. Chat everywhere**：每個 app 都加 chat（短期現象）
- **B. Super app**：ChatGPT / Claude / Gemini 一個入口跑完所有 MCP apps
- 講者不下定論，但指出**真正重要的問題不是「UI 在哪跑」，而是「model 在生什麼」**

### Ch.4｜3 種 UI 生成層級（核心）

| 層級 | 誰生 UI | 範例 | 優點 | 缺點 |
|---|---|---|---|---|
| **Static components** | Developer 預寫 React component，agent 只傳 props | AGUI SDK、Goose Auto Visualizer | 安全、predictable、快、便宜 | 沒個人化 |
| **Declarative UI** | Agent 生成 JSON/YAML descriptor，runtime 翻成 component | Vercel JSON Render、FastMCP Python descriptor | 個人化 + 仍守 design system | 仍受限於 static components |
| **Generative components** | Agent 一次 tool call 生 HTML/CSS/JS | Postman weather agent（講者親做實驗） | 完全自由、即時、imaginative | 信任問題、無 boundary |

**講者判斷**：**Declarative UI 是當下的最佳平衡點**（flexibility ↔ consistency）

### Ch.5｜Generative UI 的關鍵風險
- 第三方程式碼不可信 → LLM 生成的也同樣不可信
- 必須有 **distribution model**：
  - Boundary
  - Containment
  - Sandbox
- → **MCP apps 是當下最好的 delivery mechanism**（auth + tool call + message passing + 預設 sandbox（double iFrame））

### Ch.6｜MCP apps 的戰略訊號
- Anthropic 自己的 first-party UI 也走 MCP apps（Visualizer feature）
- 為什麼？因為 MCP apps 內建上述 features，不用 Anthropic 從頭刻
- 暗示：**MCP apps 有可能成為 third-party UI 配送的標準協議**
- 開放問題：MCP apps 會不會變成 web standard（像 HTTP / OAuth）？

### Ch.7｜結論：從 components 走向 collaboration
- 還有更明顯的 future？講者引用：「where is my Jarvis?」
- **「Radio era」類比**：電視剛發明時，前 10 年節目都是「radio + camera」，因為人們想像不到新介面能做什麼
- 我們現在對 Generative UI 的想像，還卡在「floating windows」這種 web-era 延伸
- **真正的未來**：人 + agent 共享 canvas，**協作**
  - 範例：Excalidraw MCP app — 共享 artifact，人可以 click 改、agent 可以 propose
- 結語：「We are still early」「But we can shape that future, and create this new computer」

---

## 3. 開放問題

1. **MCP apps 真的會標準化嗎？** Anthropic 推，OpenAI / Google 跟不跟？這是 web 級別的 protocol 博弈
2. **Declarative UI 的 descriptor schema 誰定？** Vercel JSON Render 是事實標準還是過渡？
3. **Sandbox 的合規性** — 醫療 / 金融 generative UI 能不能用 double iFrame？需要更強的 isolation 嗎？
4. **協作 canvas 的 UX 範式** — Excalidraw MCP app 只是起點，email / spreadsheet / video editor 什麼時候會有 MCP app 版？
5. **「radio era」是真的還是講者過度類比？** — 我們可能其實已經看到正確的未來，只是還沒規模化

---

## 4. 時間軸

```
00:00 ┃ 開場：lunch 前的 talk
00:30 ┃ 2022 copy-paste ChatGPT → 2025 GPT 5.2 / Opus 4.5
03:00 ┃ 自己 blog 改寫實驗：a11y + 動畫自動生成
04:30 ┃ 提問：Jarvis 在哪？floating windows 在哪？
05:30 ┃ 自我介紹 + Andrej Karpathy「terminal 比喻」
06:30 ┃ 兩個路徑：chat everywhere vs MCP super app
07:30 ┃ 重點：真正問題是「model 在生什麼」，不是「UI 在哪跑」
08:00 ┃ Static components（AGUI、Goose）
09:30 ┃ Declarative UI（JSON Render、FastMCP）
11:00 ┃ Generative components（Postman weather agent）
12:30 ┃ 風險：third-party code 不可信 → 需要 distribution model
13:00 ┃ MCP apps 是最佳 delivery（auth + sandbox + message passing）
14:00 ┃ Anthropic first-party UI 也走 MCP apps → 戰略訊號
14:30 ┃ Radio era 類比：我們想像力還不夠
15:00 ┃ 結論：從 components 走向 collaboration
15:30 ┃ Excalidraw MCP app 範例
16:00 ┃ 「We are still early」「shape that future」
```

---

## 5. 重點引言

> "We have a new computer, but the GUI has not been invented yet."

> "Today, we are still in the radio era. The first TV shows were radio shows with cameras."

> "Beyond components, it will be a collaborative experience."

> "We are still early. We don't have the answer. But we can shape that future."
