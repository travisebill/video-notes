# -*- coding: utf-8 -*-
"""
Regenerate the headline statistics in video-notes/README.md.

Source of truth = data/video-notes.json (produced by scripts/extract_metadata.py).
These numbers used to be hand-incremented and had drifted: the README claimed
'207 支內容 / 350 個音檔 / 175 個逐字稿 / 184 個口播稿' while the catalogue
actually held 209 / 495 / 134 / 178.

口徑 (what each number counts — everything the site can actually serve):
  支內容   = entries in data/video-notes.json
  個音檔   = distinct opus/m4a/mp3 paths referenced by those entries
  個逐字稿 = distinct transcripts.transcript paths referenced
  個口播稿 = distinct transcripts.spoken_script paths referenced

Scope: the headline line and the footer only. The '按分類' block and the
per-category README tables are hand-curated and are left untouched.

Usage:
  python3 scripts/update_readme_stats.py          # rewrite in place
  python3 scripts/update_readme_stats.py --check  # exit 1 when README is stale
"""
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
JSON_PATH = REPO / 'data' / 'video-notes.json'
README_PATH = REPO / 'README.md'

HEAD_RE = r'^> \*\*\d+ 支內容\*\* · \d+ 個音檔 · \d+ 個逐字稿 · \d+ 個口播稿$'
FOOT_RE = r'^\*最後更新：\d{4}-\d{2}-\d{2} \| 由 \[Ryo\]\(.+\) 自動維護 · 共 \d+ 支內容\*$'


def load_stats():
    data = json.loads(JSON_PATH.read_text(encoding='utf-8'))
    videos = data['videos']
    audio, transcript, spoken = set(), set(), set()
    for v in videos:
        a = v.get('audio') or {}
        for key in ('opus', 'm4a', 'mp3'):
            if a.get(key):
                audio.add(a[key])
        t = v.get('transcripts') or {}
        if t.get('transcript'):
            transcript.add(t['transcript'])
        if t.get('spoken_script'):
            spoken.add(t['spoken_script'])
    return {
        'videos': len(videos),
        'audio': len(audio),
        'transcript': len(transcript),
        'spoken': len(spoken),
    }


def apply(readme, stats):
    lines = readme.split(chr(10))
    changed = []
    head = '> **%d 支內容** · %d 個音檔 · %d 個逐字稿 · %d 個口播稿' % (
        stats['videos'], stats['audio'], stats['transcript'], stats['spoken'])
    foot = '*最後更新：%s | 由 [Ryo](https://github.com/travisebill) 自動維護 · 共 %d 支內容*'

    for i, line in enumerate(lines):
        s = line.strip()
        if re.match(HEAD_RE, s):
            if s != head:
                changed.append('L%d 統計行' % (i + 1))
                lines[i] = head
            break
    else:
        raise SystemExit('找不到統計行')

    for i, line in enumerate(lines):
        s = line.strip()
        if re.match(FOOT_RE, s):
            m = re.search(r'最後更新：(\d{4}-\d{2}-\d{2})', s)
            new = foot % (m.group(1), stats['videos'])
            if s != new:
                changed.append('L%d 頁尾' % (i + 1))
                lines[i] = new
            break
    else:
        raise SystemExit('找不到頁尾統計')

    return chr(10).join(lines), changed


def main():
    stats = load_stats()
    readme = README_PATH.read_text(encoding='utf-8')
    new, changed = apply(readme, stats)
    if '--check' in sys.argv:
        if new != readme:
            print('README 統計過期 → 跑 scripts/update_readme_stats.py')
            for c in changed:
                print('  -', c)
            return 1
        print('README 統計已是最新 ✓')
        return 0
    if new != readme:
        README_PATH.write_text(new, encoding='utf-8')
    print('支內容=%d 音檔=%d 逐字稿=%d 口播稿=%d' % (
        stats['videos'], stats['audio'], stats['transcript'], stats['spoken']))
    print('變更:', changed if changed else '無')
    return 0


if __name__ == '__main__':
    sys.exit(main())