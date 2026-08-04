#!/usr/bin/env bash
# video-notes pre-publish check
# 用途：extract_metadata.py 跑完後，驗證「新增 entry」的所有 metadata populated
#       任一欄位 None → exit 1，block publish.sh
#
# 歷史：2026-08-04 Microsoft Dev Blog entry 案例 — 3 次 publish.sh 才修好，因為
#       publish 前沒檢查 metadata 是否 populated。這個 script 是補丁。
#
# 用法：
#   bash scripts/pre_publish_check.sh         # 全檢查（找新增 entry vs git HEAD）
#   bash scripts/pre_publish_check.sh --all   # 檢查所有 entry（含 legacy bug）
#   bash scripts/pre_publish_check.sh <id>    # 檢查特定 entry id
#
# 退出碼：
#   0 = 通過（沒有 blocking error）
#   1 = 失敗（有 blocking error，列出哪個欄位 None）
#   2 = 警告（warning 但不 blocking，目前 m4a 是 warning）

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DATA_JSON="$REPO_ROOT/data/video-notes.json"
SCRIPT_DIR="$REPO_ROOT/scripts"

# 解析參數
CHECK_MODE="new"  # 預設只檢查新 entry
SPECIFIC_ID=""
for arg in "$@"; do
    case "$arg" in
        --all)
            CHECK_MODE="all"
            ;;
        --new)
            CHECK_MODE="new"
            ;;
        --help|-h)
            head -20 "$0" | grep -E "^#" | sed 's/^# \?//'
            exit 0
            ;;
        *)
            SPECIFIC_ID="$arg"
            ;;
    esac
done

echo "═══════════════════════════════════════"
echo "  video-notes pre-publish check"
echo "  mode: $CHECK_MODE${SPECIFIC_ID:+ (id=$SPECIFIC_ID)}"
echo "═══════════════════════════════════════"
echo ""

# Step 1: 跑 extract_metadata.py
echo "[1/3] 跑 extract_metadata.py"
python3 "$SCRIPT_DIR/extract_metadata.py"
echo ""

# Step 2 + 3: Python 檢查
echo "[2/3] 找 target entries"
python3 << PYEOF
import json, subprocess, sys
from pathlib import Path

repo_root = Path("$REPO_ROOT")
data_json = repo_root / "data" / "video-notes.json"

if not data_json.exists():
    print(f"❌ {data_json} 不存在")
    sys.exit(1)

wt_data = json.loads(data_json.read_text())
wt_videos = wt_data.get("videos", [])

# 找 target entries
target_videos = []
if "$SPECIFIC_ID":
    target_videos = [v for v in wt_videos if v["id"] == "$SPECIFIC_ID"]
    if not target_videos:
        print(f"❌ 找不到 id=$SPECIFIC_ID")
        sys.exit(1)
elif "$CHECK_MODE" == "new":
    # 從 git HEAD 拿舊 video-notes.json
    try:
        head_json_str = subprocess.check_output(
            ["git", "show", "HEAD:data/video-notes.json"],
            cwd=repo_root, text=True, stderr=subprocess.DEVNULL
        )
        head_data = json.loads(head_json_str)
        head_ids = {v["id"] for v in head_data.get("videos", [])}
    except Exception as e:
        print(f"⚠️  拿不到 HEAD JSON（{e}），fallback 到全部檢查")
        head_ids = set()

    target_videos = [v for v in wt_videos if v["id"] not in head_ids]
    if not target_videos:
        print("  ℹ️  沒新 entry，跳過檢查")
        sys.exit(0)
else:  # --all
    target_videos = wt_videos

print(f"  找到 {len(target_videos)} 個 target entries")
for v in target_videos:
    print(f"    - {v['id']}: {v.get('title', '?')[:60]}")

# Step 3: 檢查每個 target entry
errors = []
warns = []

for v in target_videos:
    vid = v["id"]
    audio = v.get("audio", {})
    transcripts = v.get("transcripts", {})
    note_path = v.get("note_path", "")

    # === Required (errors) ===

    # audio.opus + mp3 必須 populated
    if audio.get("opus") is None:
        errors.append(f"{vid}: audio.opus is None（檔名 base_name 要對齊 audio/ 實際檔案）")
    if audio.get("mp3") is None:
        errors.append(f"{vid}: audio.mp3 is None")

    # transcripts.spoken_script 必須 populated
    if transcripts.get("spoken_script") is None:
        errors.append(f"{vid}: transcripts.spoken_script is None（檔名 base_name 要對齊 transcripts/ 實際檔案）")

    # speaker 必須 populated
    speaker = v.get("speaker")
    if not speaker or not speaker.strip():
        errors.append(f"{vid}: speaker is None or empty")

    # duration_seconds 必須 populated
    if v.get("duration_seconds") is None:
        errors.append(f"{vid}: duration_seconds is None（影片長度 frontmatter 格式要 'MM:SS（NNNs）'）")

    # note_path 必須 populated
    if not note_path.strip():
        errors.append(f"{vid}: note_path is empty")

    # video_url 對於非 Article entry 必須 populated
    if v.get("video_url") is None:
        is_article = "Article" in note_path or "_article" in vid.lower() or "Article" in (v.get("title") or "")
        if not is_article:
            errors.append(f"{vid}: video_url is None")

    # === Warning (non-blocking) ===

    # m4a — 因為 .gitignore audio/*.m4a 全排除，Pages UI 不顯示 m4a
    if audio.get("m4a") is None and audio.get("opus") is not None:
        warns.append(f"{vid}: audio.m4a is None（.gitignore 'audio/*.m4a' 全排除；其他 entry 也一樣）")

    # transcript (Whisper 聽寫) — Article SOP 沒 Whisper，正常
    if transcripts.get("transcript") is None:
        is_article = "Article" in note_path or "_article" in vid.lower()
        if not is_article:
            warns.append(f"{vid}: transcripts.transcript is None（YouTube SOP 應有 Whisper 聽寫）")

    # spoken_script_tts (簡中口播稿) — 通常有，但 Article SOP 命名 _zh_CN.txt 不是 _TTS_zh_CN.txt
    if transcripts.get("spoken_script_tts") is None and transcripts.get("spoken_script") is not None:
        warns.append(f"{vid}: transcripts.spoken_script_tts is None（檔名要 _口播稿_TTS_zh_CN.txt）")

# Report
print()
print(f"[3/3] 檢查結果：{len(errors)} 個 error，{len(warns)} 個 warning")

if warns:
    print()
    print("⚠️  Warnings (non-blocking):")
    for w in warns:
        print(f"  - {w}")

if errors:
    print()
    print("❌ Errors (blocking publish):")
    for e in errors:
        print(f"  - {e}")
    print()
    print("💡 修法參考：AGENTS.md 主題群 4 (SOP 驗證) 教訓 + video-notes-sop.md")
    sys.exit(1)

print()
print(f"✅ {len(target_videos)} 個 entries 通過檢查，可以 push")
PYEOF