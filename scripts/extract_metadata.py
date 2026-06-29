#!/usr/bin/env python3
"""
video-notes metadata extractor

從 .md frontmatter + 檔名 + 資料夾 + audio/ 自動抽出影片 metadata
輸出到 data/video-notes.json

未來新增影片 SOP：
1. 跑 SOP 自動產生 .md / 口播稿 / 音檔
2. commit + push
3. 跑 python3 scripts/extract_metadata.py
4. git add data/video-notes.json && commit -m "更新 metadata"
5. 重新部署（GitHub Pages 自動從 docs/ build）

Author: Ryo 🐱
Created: 2026-06-28
"""
import json
import re
import sys
from pathlib import Path
from datetime import datetime

REPO_ROOT = Path(__file__).resolve().parent.parent
CATEGORIES = ['人物訪談', '國際局勢', '財經分析', '技術講座']
AUDIO_DIR = REPO_ROOT / 'audio'
TRANSCRIPTS_DIR = REPO_ROOT / 'transcripts'
README_PATH = REPO_ROOT / 'README.md'
OUTPUT_PATH = REPO_ROOT / 'data' / 'video-notes.json'


def parse_filename(stem: str) -> dict:
    """從檔名 <date>_<speaker>_<title> 抽出 metadata"""
    parts = stem.split('_', 2)  # 只切前兩個底線，剩餘當 title
    if len(parts) < 3:
        return None
    date_str, speaker, title = parts
    if not re.match(r'^\d{8}$', date_str):
        return None
    date_iso = f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"
    return {'date': date_iso, 'speaker_slug': speaker, 'title_slug': title}


def parse_md_frontmatter(content: str) -> dict:
    """從 .md 內容抽出 metadata blockquote (兩種格式都支援)

    格式 A（舊版）: > **講者**：xxx     (全形冒號 U+FF1A)
    格式 B（新版）: **講者｜xxx**     (FULLWIDTH VERTICAL BAR U+FF5C)
    格式 C（混合）: **講者｜xxx**     (半形冒號 U+003A，罕見)
    + `**key** ：value` ( ** 後有空格)

    分隔符統一支援三種: [｜：:], 並允許 ** 後有空格
    """
    md = {}

    # 分隔符統一三種: 全形垂直線｜、全形冒號：、半形冒號:
    SEP = '[｜：:]'

    # 影片連結（支援多種格式與 label）
    # Markdown 重要特性：`**影片連結：** https://youtu.be/...` → 整個 `**影片連結：**` 是 bold
    # 不是我們以為的 `**影片連結**` + SEP，所以 label regex 要允許 SEP 在 ** 內。
    #
    # 支援格式：
    # - `> **影片連結：** https://youtu.be/...`（標準，SEP 在 ** 內）
    # - `> **影片**: [title](url)` markdown link 格式（SEP 在 ** 外）
    # - `**來源**: https://youtu.be/...`（Podcast/TBBS 格式，SEP 在 ** 外）
    # - `**來源網址｜https://...**`（Apple Developer 格式，SEP 在 ** 內）
    # - `**文章來源**：[title](url)` 雖然不是影片但可以連出去
    #
    # 策略：長 label 先試，每個 label 試多個 pattern
    _VIDEO_URL_LABELS = ['影片連結', '影片來源', '文章來源', '來源網址', '影片 URL', '影片網址', '來源', '影片']
    _URL_FROM_MD_LINK = re.compile(r'\[([^\]]+)\]\((https?://[^\s\)]+)\)')
    _URL_RAW = re.compile(r'(https?://[^\s\)]+)')
    for _label in _VIDEO_URL_LABELS:
        # SEP 在 ** 內（label 與 SEP 一起 bold）→ `**label[SEP]**` 後接 url
        # SEP 在 ** 外（label 單獨 bold）→ `**label**` + SEP + url
        # **label[SEP]URL** （SEP + url 一起 bold，例如 Apple Developer 格式）
        for _pattern in [
            # 寬鬆匹配各種位置
            rf'(?:>|[> ]?)[ ]?\*\*{re.escape(_label)}[：:|｜\*]*\*\*[ ]?([^\n*]+?)(?:\*\*|$)',
            rf'(?:>|[> ]?)[ ]?\*\*{re.escape(_label)}\*\*[：:|｜][ ]?([^\n*]+?)(?:\*\*|$)',
            rf'(?:>|[> ]?)[ ]?\*\*{re.escape(_label)}\*\*[ ]?([^\n*]+?)(?:\*\*|$)',
            # **label[SEP]URL** （URL 也在 bold 內）
            rf'\*\*{re.escape(_label)}[：:|｜]([^\n*]+?)\*\*',
            # 裸文字 label（沒用 **）後接 SEP 跟 URL：'> 影片連結：URL' 或 '- 影片網址：URL'
            rf'(?:>|^|\n)\s*[-*]?\s*{re.escape(_label)}\s*[：:|｜]\s*(https?://\S+)',
        ]:
            m = re.search(_pattern, content, re.MULTILINE)
            if m:
                text = m.group(1).strip().rstrip('*').strip()
                # 優先抽 markdown link [text](url)
                link_m = _URL_FROM_MD_LINK.search(text)
                if link_m:
                    md['video_url'] = link_m.group(2).rstrip(')')
                    break
                # fallback：抽第一個 raw URL
                url_m = _URL_RAW.search(text)
                if url_m:
                    md['video_url'] = url_m.group(1).rstrip('*)')
                    break
        if 'video_url' in md:
            break

    # 影片長度（支援多種格式）
    m = re.search(rf'\*\*影片長度\*\*\s*{SEP}\s*([^\n]+)', content)
    if not m:
        m = re.search(rf'\*\*影片長度{SEP}\*\*\s*([^\n]+)', content)
    if not m:
        m = re.search(rf'> \*\*影片長度\*\*\s*{SEP}\s*([^\n]+)', content)
    if not m:
        m = re.search(rf'> \*\*影片長度{SEP}\*\*\s*([^\n]+)', content)
    if not m:
        m = re.search(rf'> 影片長度{SEP}\s*([^\n]+)', content)
    if not m:
        m = re.search(rf'> 影片時長{SEP}\s*([^\n]+)', content)
    if m:
        s = m.group(1).strip()
        secs = parse_duration(s)
        if secs:
            md['duration_seconds'] = secs

    # 整理日期
    m = re.search(rf'\*\*整理日期\*\*\s*{SEP}\s*(\d{{4}}-\d{{2}}-\d{{2}})', content)
    if not m:
        m = re.search(rf'\*\*整理日期{SEP}\*\*\s*(\d{{4}}-\d{{2}}-\d{{2}})', content)
    if m:
        md['note_date'] = m.group(1)

    # 講者（詳細版）
    m = re.search(rf'\*\*講者\*\*\s*{SEP}\s*([^\n]+)', content)
    if not m:
        m = re.search(rf'\*\*講者{SEP}\*\*\s*([^\n]+)', content)
    if not m:
        m = re.search(rf'> \*\*講者\*\*\s*{SEP}\s*([^\n]+)', content)
    if not m:
        m = re.search(rf'> \*\*講者{SEP}\*\*\s*([^\n]+)', content)
    if m:
        md['speaker_full'] = m.group(1).strip()

    # 主題（primary_topic）— 可選，override README 自動分類
    # 格式: `> **主題**：🤖 AI 安全 / 末日論 / 政策` 或 `> 主題：xxx`
    m = re.search(rf'\*\*主題\*\*\s*{SEP}\s*([^\n]+)', content)
    if not m:
        m = re.search(rf'\*\*主題{SEP}\*\*\s*([^\n]+)', content)
    if not m:
        m = re.search(rf'> \*\*主題\*\*\s*{SEP}\s*([^\n]+)', content)
    if not m:
        m = re.search(rf'> \*\*主題{SEP}\*\*\s*([^\n]+)', content)
    if not m:
        m = re.search(rf'> 主題{SEP}\s*([^\n]+)', content)
    if m:
        md['topic'] = m.group(1).strip()

    # 標題（H1）
    m = re.search(r'^# (.+)$', content, re.MULTILINE)
    if m:
        md['title'] = m.group(1).strip()

    return md


def parse_duration(s: str):
    """解析 '30 分 54 秒' / '13:26（806s）' / '1 小時 56 分 40 秒' / '28 分 50 秒' → 秒數"""
    # "X 小時 Y 分 Z 秒"
    m = re.search(r'(\d+)\s*小時\s*(\d+)\s*分(?:\s*(\d+)\s*秒)?', s)
    if m:
        h = int(m.group(1))
        mi = int(m.group(2))
        se = int(m.group(3) or 0)
        return h * 3600 + mi * 60 + se
    # "X 分 Y 秒"
    m = re.search(r'(\d+)\s*分(?:\s*(\d+)\s*秒)?', s)
    if m:
        mi = int(m.group(1))
        se = int(m.group(2) or 0)
        return mi * 60 + se
    # "MM:SS" or "H:MM:SS"
    m = re.search(r'(\d+):(\d{2})(?::(\d{2}))?', s)
    if m:
        if m.group(3):
            return int(m.group(1)) * 3600 + int(m.group(2)) * 60 + int(m.group(3))
        return int(m.group(1)) * 60 + int(m.group(2))
    # "(NNNs)"
    m = re.search(r'(\d+)\s*s', s)
    if m:
        return int(m.group(1))
    return None


def format_duration(seconds):
    """秒數 → 'MM:SS' 或 'H:MM:SS'"""
    if seconds is None:
        return None
    h = seconds // 3600
    m = (seconds % 3600) // 60
    s = seconds % 60
    if h:
        return f"{h}:{m:02d}:{s:02d}"
    return f"{m}:{s:02d}"


def parse_readme_topics(readme: str) -> dict:
    """從 README「按主題」表格抽出 primary_topic (檔路徑 → 主題)

    嚴格限定在 <a id="by-topic"> 與 <a id="by-speaker"> 之間，
    避免「按日期」/「按講者」section 的 markdown links 混淆。

    統一格式：去除 `**` markdown 強調標記，跟 .md frontmatter 抽出的格式一致。
    """
    topics = {}
    in_topic_section = False
    current_topic = None
    for line in readme.split('\n'):
        # 進入「按主題」section
        if 'id="by-topic"' in line or '## 🏷️ 按主題' in line:
            in_topic_section = True
            continue
        # 離開「按主題」section（下一個主要 section）
        if in_topic_section and ('id="by-speaker"' in line or '## 👥 按講者' in line):
            in_topic_section = False
            break
        if not in_topic_section:
            continue
        # 主題標題
        m = re.match(r'### (.+?)（\d+ 支）', line)
        if m:
            # 去除 markdown ** 強調（與 .md frontmatter 抽出的格式一致）
            current_topic = m.group(1).strip().replace('**', '')
            continue
        # 主題下的條目（包含 markdown link）
        if current_topic and '[' in line and '.md)' in line:
            for m in re.finditer(r'\[([^\]]+)\]\(([^)]+\.md)\)', line):
                topics[m.group(2)] = current_topic
    return topics


def find_audio_files(base_name: str) -> dict:
    """找對應音檔是否存在，回傳 {opus, m4a, mp3} 路徑"""
    return {
        'opus': f'audio/{base_name}.opus' if (AUDIO_DIR / f'{base_name}.opus').exists() else None,
        'm4a': f'audio/{base_name}.m4a' if (AUDIO_DIR / f'{base_name}.m4a').exists() else None,
        'mp3': f'audio/{base_name}.mp3' if (AUDIO_DIR / f'{base_name}.mp3').exists() else None,
    }


def find_transcripts(base_name: str) -> dict:
    """找對應 transcript + spoken script"""
    return {
        'transcript': f'transcripts/{base_name}_逐字稿.txt' if (TRANSCRIPTS_DIR / f'{base_name}_逐字稿.txt').exists() else None,
        'spoken_script': f'transcripts/{base_name}_口播稿.txt' if (TRANSCRIPTS_DIR / f'{base_name}_口播稿.txt').exists() else None,
        'spoken_script_tts': f'transcripts/{base_name}_口播稿_TTS_zh_CN.txt' if (TRANSCRIPTS_DIR / f'{base_name}_口播稿_TTS_zh_CN.txt').exists() else None,
    }


def main():
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)

    readme = README_PATH.read_text(encoding='utf-8')
    topics_map = parse_readme_topics(readme)

    videos = []
    for category in CATEGORIES:
        cat_dir = REPO_ROOT / category
        if not cat_dir.exists():
            continue
        for md_path in sorted(cat_dir.glob('*.md'), reverse=True):
            # 跳過 README.md（子資料夾的索引檔）
            if md_path.name == 'README.md':
                continue
            filename_meta = parse_filename(md_path.stem)
            if not filename_meta:
                print(f"⚠️  跳過無效檔名: {md_path.name}", file=sys.stderr)
                continue

            content = md_path.read_text(encoding='utf-8')
            fm = parse_md_frontmatter(content)

            base_name = md_path.stem
            note_rel_path = f'{category}/{md_path.name}'
            primary_topic = fm.get('topic') or topics_map.get(note_rel_path)

            video = {
                'id': base_name,
                'title': fm.get('title') or filename_meta['title_slug'].replace('_', ' '),
                'speaker': fm.get('speaker_full') or filename_meta['speaker_slug'],
                'speaker_slug': filename_meta['speaker_slug'],
                'category': category,
                'primary_topic': primary_topic,
                'date': filename_meta['date'],
                'note_date': fm.get('note_date', filename_meta['date']),
                'duration_seconds': fm.get('duration_seconds'),
                'duration_display': format_duration(fm.get('duration_seconds')),
                'video_url': fm.get('video_url'),
                'audio': find_audio_files(base_name),
                'transcripts': find_transcripts(base_name),
                'note_path': note_rel_path,
                'note_github_url': f'https://github.com/travisebill/video-notes/blob/main/{note_rel_path}',
            }
            videos.append(video)

    # 計算 meta
    speakers = sorted({v['speaker'] for v in videos})
    categories = sorted({v['category'] for v in videos})
    topics = sorted({t for t in (v['primary_topic'] for v in videos) if t})

    # 統計：含音檔的影片數
    videos_with_audio = sum(1 for v in videos if any(v['audio'].values()))
    videos_with_transcript = sum(1 for v in videos if v['transcripts']['transcript'])
    videos_with_spoken = sum(1 for v in videos if v['transcripts']['spoken_script'])

    output = {
        'meta': {
            'total_videos': len(videos),
            'total_with_audio': videos_with_audio,
            'total_with_transcript': videos_with_transcript,
            'total_with_spoken_script': videos_with_spoken,
            'speakers_count': len(speakers),
            'categories_count': len(categories),
            'topics_count': len(topics),
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'speakers': speakers,
            'categories': categories,
            'topics': topics,
        },
        'videos': videos,
    }

    OUTPUT_PATH.write_text(
        json.dumps(output, ensure_ascii=False, indent=2),
        encoding='utf-8',
    )

    # 輸出統計
    print(f"✅ {OUTPUT_PATH.relative_to(REPO_ROOT)}")
    print(f"   總影片數:    {len(videos)}")
    print(f"   含音檔:      {videos_with_audio}")
    print(f"   含逐字稿:    {videos_with_transcript}")
    print(f"   含口播稿:    {videos_with_spoken}")
    print(f"   講者數:      {len(speakers)}")
    print(f"   主題數:      {len(topics)}")
    print(f"   分類:        {', '.join(categories)}")


if __name__ == '__main__':
    main()