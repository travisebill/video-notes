# WSL Containers — 架構摘要筆記

> **影片**：WSL 的改進以及新的 Containers CLI 與 APIs #DEM346 // MS Build 2026
> **講者**：Pooja Trivedi（Microsoft 架構師，主導 Windows on Linux 開發者體驗與 AI）／Craig（Microsoft PM，負責 WSL 與 Windows AI 工具）
> **來源**：Microsoft Build 2026（DEM346 議程）
> **中文化**：Will 保哥（YouTube 頻道 Will 保哥）
> **時長**：23 分 14 秒
> **YouTube ID**：`4QQ7yn37Ipk`
> **整理日期**：2026-06-10
> **語言**：原始為英文，本筆記以繁體中文撰寫並附原文引用

---

## 一、TL;DR — 三大重點

整場演講濃縮成三個 takeaways：

1. **在 Windows 本機執行 Linux 容器** — 透過 CLI 直接執行，或透過 API 嵌入到 Windows 應用程式內執行。
2. **WSL 內建** — 不需安裝第三方工具（Docker Desktop、Rancher Desktop、Podman Desktop 等都仍可選用），新功能是 WSL 既有套件的一部份。
3. **企業就緒（Enterprise Ready）** — Intune、MDE 等企業級管理工具直接可用，解決「組織內有黑箱 VM 在跑」的疑慮。

---

## 二、章節脈絡（按影片時間軸）

| 時間 | 段落 | 一句話摘要 |
|------|------|------------|
| 00:00–00:12 | 開場 | 兩位講者自我介紹與議程破冰 |
| 00:12–01:13 | 主題概覽 | 點出三大 takeaways |
| 01:13–01:35 | 進入展示 | 切到第二台機器進行 live demo |
| 01:35–02:08 | 安裝簡化 | 隨 WSL update 內建，無需下載第三方工具、無需啟動 daemon |
| 02:08–02:39 | WSLC CLI 介紹 | 命令列工具，subcommand/switch 與業界標準工具一致；同時 alias 為 `container` |
| 02:39–04:02 | Demo 1：建立 Debian 容器 | `wslc -it` 啟動互動 shell，Ctrl-P/Q 卸離，`wslc ps -a` 檢視 |
| 04:02–06:18 | Demo 2：自訂映像 | 用 Containerfile 打造 `linuxpy` web server，expose port 5000 |
| 06:18–07:09 | 啟動容器 + 端口對應 | 透過 `-p` 將容器內 port 5000 對應到 Windows 主機 localhost |
| 07:09–09:03 | Demo 3：GPU 加速 AI | 跑 GPT-2 fine-tuning + torch.compile，產生 Triton 核心，速度對比 eager mode |
| 09:03–09:44 | 兩種互動模式 | CLI（直接操作）vs API（NuGet 套件嵌入應用）— 同一個 WSL VM 引擎 |
| 09:44–12:01 | 設計動機 × 三大客群 | Container Devs、App Builders/ISVs、Enterprise IT Admins |
| 12:01–14:15 | Demo 4：Moonray 渲染引擎 | 用 `moonray.exe`（背後跑 Linux）做 3D 渲染，輸出 JPEG |
| 14:15–16:42 | Demo 5：AI 股票代理人 Herbert | 故意寫一個會亂刪檔的 AI，示範容器與 Windows 的檔案/端口整合 |
| 16:42–19:47 | 架構說明 | 1 App = 1 VM，IPC → WSL service → HV socket → Moby container runtime |
| 19:47–21:47 | 儲存管理 | 每個 app 一個 VHD；VirtIO FS 取代 Plan 9，檔案分享速度 ×2 |
| 21:47–22:44 | 其他 WSL 新功能 | Azure Linux 4.0 GA 與即將推出的 WSL distro |
| 22:44–23:14 | 結語 | 2026 年 6 月底公開預覽，開源於 Microsoft/wsl |

---

## 三、關鍵概念定義

| 術語 | 說明 |
|------|------|
| **WSL Containers** | Windows 內建、隨 WSL update 釋出的 Linux 容器功能，無需 Docker Desktop |
| **WSLC / `container`** | 命令列工具，兩者為 alias；subcommand 設計對齊業界標準（Docker/Podman） |
| **Containerfile** | 描述容器映像建置流程的檔案（FROM、COPY、RUN、EXPOSE、CMD 等） |
| **WSL C SDK** | NuGet 套件，供 Windows 應用程式內嵌呼叫，建立/管理 Linux 容器 |
| **Moby** | Docker 開源上游引擎，WSL 容器底層即使用 Moby |
| **HV Socket** | Hyper-V/VBS 提供的 hypervisor-to-VM 專用 socket，非網路 socket；每個 VM 一條獨立通道 |
| **VHD** | Virtual Hard Disk，每個應用程式（含 CLI flow）獨立一個 VHD 做儲存隔離 |
| **VirtIO FS** | VM↔Hypervisor 的檔案分享 protocol，WSL Containers 用它取代傳統 Plan 9，速度約 2 倍 |
| **Azure Linux 4.0** | Microsoft 自家 Linux distro，與 AKS 同源，現已 GA；WSL distro 變體即將推出 |
| **Moonray** | Dreamworks Animation 開源的 Linux-based 渲染引擎（用於《The Bad Guys 2》《The Wild Robot》） |

---

## 四、架構圖（口述重構）

```
┌─────────────────────────────── Windows Host ───────────────────────────────┐
│                                                                            │
│   ┌────────────────────────┐    ┌────────────────────────┐                │
│   │ Windows App A          │    │ Windows App B          │                │
│   │ (含 WSLC SDK NuGet)    │    │ (moonray.exe 範例)     │                │
│   └──────────┬─────────────┘    └──────────┬─────────────┘                │
│              │ IPC                          │ IPC                         │
│   ┌──────────┴──────────────────────────────┴─────────────┐                │
│   │                  WSL Service                          │                │
│   │  • 既有：distro lifecycle、VM 與 host 通訊            │                │
│   │  • 新增：管理容器、轉發使用者操作                      │                │
│   └──────────┬────────────────────────────────────────────┘                │
│              │ HV Socket（每 VM 一條獨立通道）                              │
│                                                                            │
│   ┌───────────┴─ App A 的 VHD ─────────┐  ┌──── App B 的 VHD ──────┐     │
│   │   ┌──── Utility VM A ──────┐       │  │  ┌──── Utility VM B ──┐│     │
│   │   │  Moby container runtime│       │  │  │  Moby container    ││     │
│   │   │  內有多個 Linux 容器    │       │  │  │  runtime           ││     │
│   │   └────────────────────────┘       │  │  └────────────────────┘│     │
│   └────────────────────────────────────┘  └─────────────────────────┘     │
│                                                                            │
│   檔案分享：Windows 資料夾 ◀──VirtIO FS（速度 ≈ Plan 9 的 2 倍）──▶ Linux │
└────────────────────────────────────────────────────────────────────────────┘

CLI Flow：`wslc` / `container` 指令 → WSL Service → 同上管線
```

---

## 五、API × CLI 雙路徑設計

| 面向 | CLI | API |
|------|-----|-----|
| **進入點** | `wslc` 或 `container` 可執行檔 | NuGet 套件（WSL C SDK） |
| **適用對象** | DevOps、容器開發者 | App Builder、ISV |
| **VM 隔離** | CLI 本身一個獨立 VM | 同一個 App 共用一個 VM |
| **典型指令** | `wslc run -it -p 5000:5000 -v ... debian:latest` | `WSLContainerRuntime.CreateContainerAsync(...)` |
| **使用者感知** | 終端機互動（看得到容器） | 透明 — 對 end-user 而言就是 Windows app |

> "It's basically two different doors for the same engine." — Craig

---

## 六、為誰而做？三大客群

### 1. Container Developers
- **痛點**：在 Windows 上要裝 Docker Desktop 才能跑容器
- **解法**：WSL 內建、原生整合、命令列對齊業界標準
- **態度**：Docker / Podman / Rancher Desktop 仍可用 — WSL Containers 只是「另一種選擇」，底層 VM 改進會回饋給整個生態

### 2. App Builders / ISVs
- **痛點**：手上有一堆 Linux code，想打包進 Windows 應用卻卡 VM 黑箱
- **解法**：用 WSLC SDK 標準 API 內嵌，整個 container lifecycle 都可控
- **承諾**：「對 end-user 來說就是 Windows app，他不會知道他跑的是 Linux」

### 3. Enterprise IT Admins
- **痛點**：員工跑 Linux container 怎麼管？Intune 管不到、看不到 VM 在幹嘛
- **解法**：WSL Containers 設計上就讓企業級工具（Intune、MDE）能見到、能管理
- **願景**：「用你熟悉的 Windows 工具去管 Linux 容器，無需擔心黑箱」

---

## 七、Demo 場景一覽

| Demo | 場景 | 驗證的價值 |
|------|------|------------|
| **#1 Debian 容器** | `wslc -it debian:latest` 互動 shell | CLI 基本功：啟動 / 卸離 / 終止 |
| **#2 linuxpy web server** | 自建 Containerfile → build → run → port mapping | 「Dev 環境 = Prod 環境」，避開 "works on my machine" |
| **#3 GPT-2 + GPU** | `-v` 掛載 HF cache + `--gpus all` 跑 fine-tuning | GPU 透通，WSL → Windows GPU 不掉效能 |
| **#4 Moonray 渲染** | `moonray.exe` 背後跑 Linux 引擎 | 對 end-user 完全透明的 Linux 執行 |
| **#5 Herbert AI agent** | 假 AI 故意亂刪檔 | 展示 **blast radius control**（限制容器只能動指定資料夾） |

---

## 八、關鍵引用

> "It will just be part of an existing package that I hope you're already using."
> — Pooja 強調零摩擦導入

> "No need to download any third party tools. No starting of daemons, no Faustian rituals."
> — Pooja 開玩笑說不需要跟 Docker 簽賣身契

> "It's basically two different doors for the same engine. It's all powered by the same WSL VM that actually powers WSL distributions."
> — Craig 點出 CLI 與 API 的關係

> "We don't want you to be afraid of, hey, there's a black box opaque VM running in my organization."
> — Craig 談企業 IT 採用障礙

> "Even though it really was deleting random things, I'm OK with showing that on this demo machine because it could not physically delete all the files on Windows. You could only delete the files in the C:\\temp\\herbert folder."
> — Pooja 強調「blast radius minimization」的設計

> "Virtio FS is about twice as fast as [Plan 9] stands today in this environment, and we're investing more in these areas."
> — Pooja 談 VirtIO FS 帶來的檔案 I/O 提升

---

## 九、給 Ruka（前端）與 Mame（QA）的提醒

> ⚠️ 此為內部備註，非影片內容

- **Ruka**：API 回傳結構走 `WSL C SDK`，記得包一層 Pydantic model；不要把 WSL service 內部錯誤直接回給前端。
- **Mame**：每個 App 一個 VM 是設計重點。測試時要驗證「App A 的容器名稱衝突不會影響 App B」。
- **Moka**：CLI 與 API 是「同一引擎的兩個門」 — UI 設計上讓 user 感覺是 Windows app，技術上是 Linux VM。UX 要把複雜度藏起來。

---

## 十、未來展望與時程

| 項目 | 狀態 | 預計時程 |
|------|------|----------|
| WSL Containers Public Preview | 即將推出 | **2026 年 6 月底** |
| Azure Linux 4.0 (GA) | ✅ 已發布 | 現在可用 |
| Azure Linux 4.0 WSL Distro | 開發中 | 即將推出 |
| 開源進度 | 持續更新 | github.com/microsoft/wsl |
| CLI 文件 | 撰寫中 | 上線時同步發布於 CLI 部落格 |

---

## 十一、一句話總結

> **WSL Containers = 把 Linux 容器收進 WSL 的內建功能，企業用 Windows 工具管、開發者用 CLI 寫、ISV 用 SDK 嵌，底層共用同一個輕量 utility VM — 6 月底公開預覽。**
