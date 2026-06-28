#!/usr/bin/env bash
# video-notes 完整發布 SOP
# 用法：bash scripts/publish.sh "commit message"
#
# 流程：
#   1. 重新抽取 metadata → data/video-notes.json
#   2. git add 所有新檔案
#   3. git commit + push 到 main
#   4. git subtree push 把 docs/ 推到 gh-pages
#
# 假設你已經：
#   - 跑完 youtube-video-summary SOP（產生了 .md / 口播稿 / 音檔）
#   - 把新檔案放到正確的 人物訪談/、技術講座/ 等資料夾

set -e  # 任一步失敗就停止

COMMIT_MSG="${1:-更新影片 notes}"

cd "$(dirname "$0")/.."  # 切到 repo root

echo "═══════════════════════════════════════"
echo "  video-notes publish pipeline"
echo "═══════════════════════════════════════"
echo ""

# Step 1: 重新抽取 metadata
echo "[1/4] 抽取 metadata → data/video-notes.json"
python3 scripts/extract_metadata.py
echo ""

# Step 2: git add 所有新檔案
echo "[2/4] git add (新 .md + transcripts + audio + data)"
git add 人物訪談/ 國際局勢/ 財經分析/ 技術講座/
git add transcripts/ audio/
git add data/video-notes.json scripts/

# 顯示將要 commit 的檔案
echo "--- 待 commit 檔案 ---"
git status -s
echo ""

# Step 3: commit + push 到 main
echo "[3/4] git commit + push → main"
git commit -m "$COMMIT_MSG"
git push origin main
echo ""

# Step 4: subtree push 到 gh-pages（GitHub Pages 來源）
echo "[4/4] git subtree push → gh-pages (GitHub Pages deploy)"
git subtree push --prefix=docs origin gh-pages
echo ""

echo "═══════════════════════════════════════"
echo "  ✅ Done!"
echo "  - main:    https://github.com/travisebill/video-notes"
echo "  - Pages:   https://travisebill.github.io/video-notes/"
echo "  - 等 1-2 分鐘後 GitHub Pages 自動更新"
echo "═══════════════════════════════════════"