// gen_timeline.js — 開場 30 秒舞台版分鏡（4 段：開場 / 主軸1 / 主軸2 / 主軸3 / 收束）
const fs = require('fs');
const total = 60.0; // 先做 0–60 秒的舞台版
const scenes = [
  { id: 'OPEN', start: 0.00,  end: 29.80, title: '開場 · 舞台建立' },
  { id: 'S1',   start: 29.80, end: 69.20, title: '主軸一 · 帝國衰退' },
];
fs.writeFileSync('timeline.json', JSON.stringify({ total: 69.20, scenes }, null, 2));
console.log('scenes', scenes.length, 'total', 69.20);
