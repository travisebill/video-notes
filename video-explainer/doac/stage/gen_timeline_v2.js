// gen_timeline_v2.js — 全片 10 幕分鏡，依 narration_v3.json 逐字時間戳對齊
const fs = require('fs');
const n = JSON.parse(fs.readFileSync('narration_v3.json', 'utf8'));
const segs = n.segments;
const TOTAL = segs[segs.length - 1].end; // 174.06

// 依旁白語意切幕（用句子索引定位）
const scenes = [
  { id: 'S1_OPEN',   start: 0.0,   end: 36.4,  title: '開場 · 這個人是誰' },
  { id: 'S2_MAP',    start: 36.4,  end: 48.7,  title: '四主軸地圖' },
  { id: 'S3_EMPIRE', start: 48.7,  end: 64.5,  title: '帝國週期儀表板' },
  { id: 'S4_MOON',   start: 64.5,  end: 92.9,  title: '月光族與學費機器' },
  { id: 'S5_LADDER', start: 92.9,  end: 115.6, title: '勞動到資本的樓梯' },
  { id: 'S6_TAX',    start: 115.6, end: 133.0, title: '財富稅天平' },
  { id: 'S7_HOUSE',  start: 133.0, end: 145.1, title: '房子 vs 股市' },
  { id: 'S8_LONG',   start: 145.7, end: 169.2, title: '長壽革命' },
  { id: 'S9_OUT',    start: 169.2, end: TOTAL, title: '黃金時代收尾' },
];
fs.writeFileSync('timeline.json', JSON.stringify({ total: TOTAL, scenes }, null, 2));
console.log('scenes', scenes.length, 'total', TOTAL.toFixed(2));
scenes.forEach(s => console.log(` ${s.id.padEnd(11)} ${s.start.toFixed(1)}-${s.end.toFixed(1)}  ${s.title}`));
