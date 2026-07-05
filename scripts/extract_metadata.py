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

# 講者 slug → 展開後的顯示名稱（針對無 frontmatter「講者」欄位的影片）
# 2026-07-06 整理：把 "MattPocock" 展開成 "Matt Pocock"，避免 filter dropdown 出現
# slug 形式（"AndrewNg"、"MarieHaynes" 等）的選項，跟 frontmatter 寫的展開形式重複
SPEAKER_NAME_OVERRIDES = {
    'MattPocock': 'Matt Pocock',
    'DrDarrenCandow': 'Dr. Darren Candow',
    'AndrewNg': 'Andrew Ng',
    'MarieHaynes': 'Marie Haynes',
    'MartinFowler': 'Martin Fowler',
    'YannLeCun': 'Yann LeCun',
    'RyanLopopolo': 'Ryan Lopopolo',
    'PiotrIndyk': 'Piotr Indyk',
    'JelaniNelson': 'Jelani Nelson',
    'TaraAgyemang': 'Tara Agyemang',
}


def parse_speaker_field(speaker_full: str, speaker_slug: str) -> tuple[str, str | None]:
    """解析講者欄位 → (clean_name, description)

    2026-07-06 新增：把 'name（description）' / 'name，description' 拆成 name + description，
    避免同一個講者因為描述文字不同而出現在 filter dropdown 好幾次
    （例：林軒田原來有 3 個變體 → 合併為 1 個「林軒田」）。

    處理順序：
    1. 多位講者（含 ' × ' 或 '／'）→ 保持原樣（拆 multi-speaker 太複雜）
    2. 'name（desc）' / 'name(desc)' → 用 regex 切
    3. 'name，desc' 或 'name, desc' → rest 含中文才視為描述
    4. 無 frontmatter 時用 SPEAKER_NAME_OVERRIDES 或 CamelCase split

    Examples:
        ('Matt Pocock（TypeScript 教育者...）', 'MattPocock') → ('Matt Pocock', 'TypeScript 教育者...')
        ('Matt Pocock，知名 TypeScript 教育者...', 'Matt') → ('Matt Pocock', '知名 TypeScript 教育者...')
        ('陳文茜（TVBS 文茜的世界周報主持人）', 'TVBS') → ('陳文茜', 'TVBS 文茜的世界周報主持人')
        ('', 'MattPocock') → ('Matt Pocock', None)
        ('Percy Liang, Tatsu Hashimoto', 'CS336') → ('Percy Liang, Tatsu Hashimoto', None)  # 英文逗號兩位講者，不切
    """
    if not speaker_full:
        if speaker_slug in SPEAKER_NAME_OVERRIDES:
            return (SPEAKER_NAME_OVERRIDES[speaker_slug], None)
        # CamelCase split: MattPocock → Matt Pocock
        name = re.sub(r'([a-z])([A-Z])', r'\1 \2', speaker_slug)
        return (name, None)

    text = speaker_full.strip()

    # 1. 多位講者：任何形式的 '×' 都視為 multi-speaker（保持原樣）
    # 例：'Dr. X（desc）× Steven Y（desc）'、'Nick A（desc） × Daniel B（desc）'
    if '×' in text:
        return (text, None)
    # 也處理 '／'（Pooja Trivedi ／Craig 形式）
    if '／' in text:
        return (text, None)

    # 2. 嘗試在中/全形括號處切 'name（description）'
    m = re.match(r'^(.+?)\s*([（(])(.+?)([)）])\s*$', text)
    if m:
        name = m.group(1).strip()
        description = m.group(3).strip()
        # sanity check: name 不應太長（< 30 字元），description 至少 2 字元
        if 0 < len(name) <= 30 and len(description) >= 2:
            return (name, description)

    # 3. 嘗試「，」或 ', ' 切（必須 rest 含中文 → 視為描述）
    # 排除條件（multi-speaker）：rest 含 '；' / '×' / '（' → 表示還有另一位講者，不要切
    # 不排除 '，'（Anne Applebaum 描述本身含多個「，」逗號，應讓它能切）
    for sep_char, sep_len in [('，', 1), (', ', 2)]:
        idx = text.find(sep_char)
        if 0 < idx <= 30:
            name = text[:idx].strip()
            rest = text[idx + sep_len:].strip()
            if (len(name) >= 2 and len(rest) >= 5
                    and re.search(r'[\u4e00-\u9fff]', rest)
                    and not re.search(r'[；×(（]', rest)):
                return (name, rest)

    # 4. 整個當 name（單一講者、沒有 description）
    return (text, None)


def parse_filename(stem: str) -> dict:
    """從檔名 <date>_<speaker>_<title> 抽出 metadata"""
    parts = stem.split('_', 2)  # 只切前兩個底線，剩餘當 title
    if len(parts) < 3:
        return None
    date_str, speaker, title = parts
    if not re.match(r'^\d{8}$', date_str):
        return None
    date_iso = f"{date_str[:4]}-{date_str[4:6]}-{date_str[6:8]}"
    # 抽 Lecture 編號（課程系列用：CS224 / Harvard / MIT 等 _LectureN_ pattern）
    # 例如：AdvancedAlgorithmsCS224_Lecture12 → 12
    lec_match = re.search(r'Lecture(\d+)', title)
    lec_num = int(lec_match.group(1)) if lec_match else None

    # 抽 NTU FAI 編號（2026-07-06 加）：FAI 0 → 0, FAI 1.1 → 11, FAI 6.3 → 63
    # 例如：20260429_NTUFAI_FAI1.1_監督式機器學習之線性模型 → 11
    # 課程排序順序：FAI 0 (0), FAI 1.1-1.6 (11-16), FAI 2.1-2.4 (21-24), FAI 3.1-3.5 (31-35),
    #              FAI 4.1-4.8 (41-48), FAI 5.1-5.4 (51-54), FAI 6.1-6.3 (61-63),
    #              Sharing (700, course 收尾), Final Project (800, 學生 showcase)
    if lec_num is None:
        fai_match = re.search(r'FAI(\d+)(?:\.(\d+))?', title)
        if fai_match:
            major = int(fai_match.group(1))
            minor = int(fai_match.group(2) or 0)
            lec_num = major * 10 + minor
        elif 'Sharing' in title:
            lec_num = 700
        elif 'FinalProject' in title:
            lec_num = 800

    return {'date': date_iso, 'speaker_slug': speaker, 'title_slug': title, 'lec_num': lec_num}


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
    _VIDEO_URL_LABELS = ['影片連結', '連結', '影片來源', '文章來源', '來源網址', '影片 URL', '影片網址', 'YouTube', '來源', '影片']
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
    """找對應音檔是否存在，回傳 {opus, m4a, mp3} 路徑
    支援兩種命名：(1) base_name.ext  (2) base_name_口播稿.ext (CS336 系列)
    """
    # CS336 系列用「口播稿」後綴（2026-04-14 後所有 CS336 lecture 一致採用）
    candidates = [base_name, f'{base_name}_口播稿']
    out = {}
    for ext in ('opus', 'm4a', 'mp3'):
        out[ext] = None
        for c in candidates:
            p = AUDIO_DIR / f'{c}.{ext}'
            if p.exists():
                out[ext] = f'audio/{c}.{ext}'
                break
    return out


def find_transcripts(base_name: str) -> dict:
    """找對應 transcript + spoken script"""
    return {
        'transcript': f'transcripts/{base_name}_逐字稿.txt' if (TRANSCRIPTS_DIR / f'{base_name}_逐字稿.txt').exists() else None,
        'spoken_script': f'transcripts/{base_name}_口播稿.txt' if (TRANSCRIPTS_DIR / f'{base_name}_口播稿.txt').exists() else None,
        'spoken_script_tts': f'transcripts/{base_name}_口播稿_TTS_zh_CN.txt' if (TRANSCRIPTS_DIR / f'{base_name}_口播稿_TTS_zh_CN.txt').exists() else None,
    }


def derive_course_slug(filename_stem: str) -> str | None:
    """從檔名推導 course slug（B3 scheme 2026-07-05）。

    Returns:
        'Stanford CS336' / 'Harvard CS224' / 'NTU 人工智慧導論' / None
    """
    if 'StanfordCS336' in filename_stem:
        return 'Stanford CS336'
    if 'HarvardCS224' in filename_stem or 'AdvancedAlgorithmsCS224' in filename_stem or 'HarvardCS224AdvancedAlgorithms' in filename_stem:
        return 'Harvard CS224'
    # NTU FAI (2026-07-05)：用 '林軒田' / '陳縕儂' 等 NTU 教授 + FAI 章節編號
    if '林軒田' in filename_stem or '陳縕儂' in filename_stem or '陳上則' in filename_stem or 'NTUFAI' in filename_stem:
        return 'NTU 人工智慧導論'
    return None


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

            # 2026-07-06：用 parse_speaker_field 拆解 'name（description）'，
            # 把同一個講者的不同描述變體合併成一個 clean name
            speaker_name, speaker_description = parse_speaker_field(
                fm.get('speaker_full', ''),
                filename_meta['speaker_slug'],
            )
            video = {
                'id': base_name,
                'title': fm.get('title') or filename_meta['title_slug'].replace('_', ' '),
                'speaker': speaker_name,
                'speaker_description': speaker_description,
                'speaker_slug': filename_meta['speaker_slug'],
                'course_slug': derive_course_slug(md_path.stem),
                'category': category,
                'primary_topic': primary_topic,
                # 修 2026-07-03：note_date 優先（frontmatter 整理日期權威），
                # Lecture 23-26 filename 用 20160712_ prefix 但實際 frontmatter 寫 2016-07-11，
                # 不然前端 sort 會把 Lecture 23-26 排在 Lecture 1-22 前面
                'date': fm.get('note_date', filename_meta['date']),
                'note_date': fm.get('note_date', filename_meta['date']),
                'duration_seconds': fm.get('duration_seconds'),
                'duration_display': format_duration(fm.get('duration_seconds')),
                'video_url': fm.get('video_url'),
                'lec_num': filename_meta.get('lec_num'),
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
            'courses': sorted({v['course_slug'] for v in videos if v.get('course_slug')}),
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