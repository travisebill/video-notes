// scenes_v2.js — DOAC × Friedberg 解說動畫 v2（10 幕，固定舞台 + 物件累積）
// 精緻度升級：手繪筆觸 SVG、紙紋疊層、路徑動畫、運鏡
const P = { ink:'#1c1c1c', paper:'#f6f1e4', accent:'#e8542f', gold:'#f2b53a',
            blue:'#2f6fa8', green:'#3f8f63', purple:'#7a4fa3', muted:'#9a9188',
            red:'#c0392b', skin:'#f7d9bd' };

function el(tag, cls, style) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (style) Object.assign(e.style, style);
  return e;
}
function html(s, str) { s.insertAdjacentHTML('beforeend', str); return s; }

const NODES = ['開場','地圖','衰退','月光族','樓梯','財稅','買房','長壽','黃金'];

function makeStage(root, activeIdx) {
  const s = el('div', 'scene');
  html(s, `
    <div class="grain"></div><div class="vign"></div>
    <div class="top-id">
      <div class="brand">THE DIARY OF A CEO <small>· David Friedberg</small></div>
      <div class="top-right">124 分鐘深度對談 · 40 章節</div>
    </div>
    <div class="title-wrap">
      <div class="mega">美國帝國衰退<br><span class="ink2">與 AI 黃金時代</span></div>
      <div class="subtitle">白宮科技顧問 Friedberg 的四條主軸</div>
    </div>
    <div class="stagebox"><div class="grid"></div><div class="stage-content"></div>
      <div class="stage-caption"></div></div>
    <div class="cmd">
      <div class="step"></div><div class="verb"></div><div class="obj"></div><div class="note"></div>
    </div>
    <div class="rail">
      <div class="rail-line"></div><div class="rail-fill"></div>
      <div class="rail-nodes">${NODES.map((n,i)=>
        `<div class="node" data-i="${i}"><div class="dot">${i+1}</div><div class="nlabel">${n}</div></div>`).join('')}
      </div>
    </div>`);
  root.appendChild(s);
  return s;
}
function setCmd(s, step, verb, obj, note) {
  s.querySelector('.cmd .step').textContent = step;
  s.querySelector('.cmd .verb').textContent = verb;
  s.querySelector('.cmd .obj').textContent = obj || '';
  s.querySelector('.cmd .note').textContent = note || '';
}
function setCap(s, t) { s.querySelector('.stage-caption').textContent = t; }
function mark(s, i, st) { const n = s.querySelector(`.node[data-i="${i}"]`); if (n) n.classList.add(st); }
function rail(tl, s, pct, at, dur, from) {
  tl.fromTo(s.querySelector('.rail-fill'), { width:(from||0)+'%' }, { width:pct+'%', duration:dur, ease:'none' }, at);
}
// 通用入場：標題列 + 舞台框 + 指令卡 + 時間軸
function intro(tl, s, t0, pct, dur, from) {
  tl.set(s, { opacity:1 }, t0);
  tl.from(s.querySelectorAll('.top-id, .title-wrap'), { y:-26, opacity:0, duration:.6, ease:'power3.out' }, t0+.05);
  tl.from(s.querySelector('.stagebox'), { scale:.94, opacity:0, duration:.6, ease:'back.out(1.2)' }, t0+.35);
  tl.from(s.querySelector('.cmd'), { x:70, opacity:0, duration:.6, ease:'power3.out' }, t0+.55);
  tl.from(s.querySelector('.rail'), { y:40, opacity:0, duration:.5 }, t0+.85);
  rail(tl, s, pct, t0+1, dur, from);
}
function outro(tl, s, t1) { tl.to(s, { opacity:0, duration:.6, ease:'power2.in' }, t1-.6); }

// 手繪角色（精緻版）：粗細不一描邊、服裝細節、表情
function drawPerson() {
  return `
  <svg width="360" height="440" viewBox="0 0 360 440">
    <ellipse cx="180" cy="400" rx="150" ry="30" fill="rgba(28,28,28,.09)"/>
    <!-- 身體（西裝） -->
    <path d="M78,428 Q92,300 140,272 L180,296 L220,272 Q268,300 282,428 Z"
          fill="#2f6fa8" stroke="#1c1c1c" stroke-width="8" stroke-linejoin="round"/>
    <path d="M140,272 L180,330 L220,272" fill="#fffdf7" stroke="#1c1c1c" stroke-width="7"/>
    <path d="M180,330 L172,428 M180,330 L188,428" stroke="#1c1c1c" stroke-width="6" fill="none"/>
    <!-- 領帶 -->
    <path d="M172,300 L188,300 L184,360 L176,360 Z" fill="#e8542f" stroke="#1c1c1c" stroke-width="5"/>
    <!-- 脖子 -->
    <rect x="158" y="238" width="44" height="46" fill="#eec6a4" stroke="#1c1c1c" stroke-width="7"/>
    <!-- 頭 -->
    <path d="M104,150 Q104,68 180,68 Q256,68 256,150 Q256,232 180,244 Q104,232 104,150 Z"
          fill="${'#f7d9bd'}" stroke="#1c1c1c" stroke-width="8"/><!-- 頭髮 -->
    <path d="M100,140 Q108,60 180,58 Q252,60 260,140 Q238,104 180,100 Q122,104 100,140 Z"
          fill="#3a2f28" stroke="#1c1c1c" stroke-width="8" stroke-linejoin="round"/>
    <!-- 眼睛（眉毛） -->
    <path d="M132,140 Q146,132 160,140" stroke="#1c1c1c" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M200,140 Q214,132 228,140" stroke="#1c1c1c" stroke-width="6" fill="none" stroke-linecap="round"/>
    <circle cx="146" cy="158" r="8" fill="#1c1c1c"/><circle cx="214" cy="158" r="8" fill="#1c1c1c"/>
    <circle cx="149" cy="155" r="2.5" fill="#fff"/><circle cx="217" cy="155" r="2.5" fill="#fff"/>
    <!-- 鼻子、嘴 -->
    <path d="M180,172 L174,196 L188,196" fill="none" stroke="#1c1c1c" stroke-width="5" stroke-linecap="round"/>
    <path d="M158,214 Q180,230 202,214" fill="none" stroke="#1c1c1c" stroke-width="6" stroke-linecap="round"/>
  </svg>`;
}
// 手繪麥克風
function drawMic() {
  return `
  <svg width="150" height="260" viewBox="0 0 150 260">
    <rect x="62" y="18" width="26" height="200" rx="13" fill="#8a8178" stroke="#1c1c1c" stroke-width="7"/>
    <rect x="46" y="0" width="58" height="64" rx="29" fill="#2f6fa8" stroke="#1c1c1c" stroke-width="7"/>
    <line x1="58" y1="20" x2="92" y2="20" stroke="#1c1c1c" stroke-width="4"/>
    <line x1="58" y1="34" x2="92" y2="34" stroke="#1c1c1c" stroke-width="4"/>
    <line x1="58" y1="48" x2="92" y2="48" stroke="#1c1c1c" stroke-width="4"/>
  </svg>`;
}

window.SCENES = {};

// ── 幕 1 · 開場：這個人是誰（0–36.4）──
window.SCENES.S1_OPEN = function (root, tl, t0, t1) {
  const s = makeStage(root, 0), sc = s.querySelector('.stage-content');
  tl.set(s, { opacity:1 }, t0);
  mark(s,0,'active');

  // 舞台聚光燈
  const spot = el('div','fig',{ left:'250px', top:'-40px' });
  spot.innerHTML = `<svg width="600" height="640" viewBox="0 0 600 640">
    <path d="M300,0 L120,620 L480,620 Z" fill="rgba(242,181,58,.22)"/></svg>`;
  sc.appendChild(spot);

  const person = el('div','fig',{ left:'350px', top:'70px' }); person.innerHTML = drawPerson();
  sc.appendChild(person);
  const mic = el('div','fig',{ left:'700px', top:'180px' }); mic.innerHTML = drawMic();
  sc.appendChild(mic);

  setCmd(s,'STEP 1 / 9','開場','大衛・弗雷德伯格','白宮科技顧問 · 矽谷連續創業者');
  setCap(s,'The Diary Of A CEO · 與白宮科技顧問的一場對談');

  intro(tl, s, t0, 11, t1-t0-2, 0);
  // 聚光燈先亮（旁白已進）→ 物件依旁白節奏依序進場，不要留空舞台
  tl.from(spot, { opacity:0, duration:.5 }, t0+.4);
  tl.from(person, { x:-140, opacity:0, duration:.9, ease:'power3.out' }, t0+1.2);
  tl.from(mic, { y:120, opacity:0, duration:.8, ease:'back.out(1.4)' }, t0+6.0);
  // 履歷卡片翻出（旁白「把這段經歷寫進履歷」）
  const cv = el('div','obj-item',{ left:'120px', top:'90px' });
  cv.innerHTML = `<div style="background:#fffdf7;border:5px solid #1c1c1c;border-radius:14px;
    padding:16px 20px;box-shadow:8px 8px 0 rgba(28,28,28,.15);font-size:24px;font-weight:900;line-height:1.5">
    履歷<br><span style="color:#e8542f">♠ 撲克選手</span></div>`;
  sc.appendChild(cv);
  tl.from(cv, { scale:0, rotate:-20, opacity:0, duration:.5, ease:'back.out(2)' }, t0+4.6);
  // Google 招牌（旁白「他進了 Google」）
  const goo = el('div','obj-item',{ left:'150px', top:'250px' });
  goo.innerHTML = `<div style="font-family:'Archivo Black',sans-serif;font-size:46px;color:#2f6fa8;
    background:#fffdf7;border:5px solid #1c1c1c;border-radius:14px;padding:10px 22px;
    box-shadow:8px 8px 0 rgba(28,28,28,.15)">Google</div>`;
  sc.appendChild(goo);
  tl.from(goo, { y:40, opacity:0, duration:.5, ease:'back.out(1.8)' }, t0+9.0);
  // 11 億美元成交（旁白「以 11 億美元賣掉」）— 移到舞台右下角落，避開人物身體
  const deal = el('div','obj-item',{ left:'800px', top:'430px', zIndex:'20' });
  deal.innerHTML = `<div style="font-family:'Archivo Black',sans-serif;font-size:60px;color:#fff;
    background:#e8542f;border:5px solid #1c1c1c;border-radius:18px;padding:12px 26px;
    box-shadow:8px 8px 0 rgba(28,28,28,.2)">$1.1B</div>`;
  sc.appendChild(deal);
  tl.from(deal, { scale:0, opacity:0, duration:.55, ease:'back.out(2.4)' }, t0+15.0);
  tl.to(deal, { rotation:2, duration:.6, yoyo:true, repeat:1, ease:'sine.inOut' }, t0+17.0);

  mark(s,0,'done'); mark(s,1,'active');
  outro(tl, s, t1);
};

// ── 幕 2 · 四主軸地圖（36.4–48.7）──
window.SCENES.S2_MAP = function (root, tl, t0, t1) {
  const s = makeStage(root, 1), sc = s.querySelector('.stage-content');
  sc.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 1090 566">
    <circle cx="545" cy="283" r="150" fill="#fffdf7" stroke="#1c1c1c" stroke-width="7"/>
    <text x="545" y="272" text-anchor="middle" font-size="30" font-weight="900">FRIEDBERG</text>
    <text x="545" y="312" text-anchor="middle" font-size="22" fill="#6b6259">四條主軸</text>
  </svg>`;
  setCmd(s,'STEP 2 / 9','全片地圖','四條主軸','帝國衰退 · 社會主義 · 住房謊言 · AI 黃金時代');
  setCap(s,'一小時裡，他把四件事串成一條線');
  intro(tl, s, t0, 22, t1-t0-1.5, 11);

  const axes = [
    { ang:-145, x:110, y:90,  t:'帝國衰退', c:P.accent },
    { ang:-35,  x:760, y:90,  t:'社會主義', c:P.purple },
    { ang:145,  x:110, y:390, t:'住房謊言', c:P.blue },
    { ang:35,   x:760, y:390, t:'AI 黃金時代', c:P.green },
  ];
  axes.forEach((a,i) => {
    const path = el('div','obj-item',{ left:'0px', top:'0px', width:'100%', height:'100%' });
    path.innerHTML = `<svg width="1090" height="566" viewBox="0 0 1090 566" style="position:absolute;inset:0">
      <line class="ln" x1="545" y1="283" x2="${a.x+120}" y2="${a.y+30}"
        stroke="${a.c}" stroke-width="7" stroke-linecap="round" stroke-dasharray="600" stroke-dashoffset="600"/></svg>`;
    sc.appendChild(path);
    const card = el('div','obj-item',{ left:a.x+'px', top:a.y+'px' });
    card.innerHTML = `<div style="background:${a.c};color:#fff;font-size:32px;font-weight:900;
      padding:16px 30px;border-radius:16px;border:5px solid #1c1c1c;
      box-shadow:9px 9px 0 rgba(28,28,28,.18);white-space:nowrap">${a.t}</div>`;
    sc.appendChild(card);
    tl.to(path.querySelector('.ln'), { 'stroke-dashoffset':0, duration:.6, ease:'power2.out' }, t0+1.0+i*.9);
    tl.from(card, { scale:0, opacity:0, duration:.5, ease:'back.out(2)' }, t0+1.5+i*.9);
  });
  mark(s,1,'done'); mark(s,2,'active');
  outro(tl, s, t1);
};

// ── 幕 3 · 帝國週期儀表板（48.7–64.5）──
window.SCENES.S3_EMPIRE = function (root, tl, t0, t1) {
  const s = makeStage(root, 2), sc = s.querySelector('.stage-content');
  sc.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 1090 566">
    <rect x="60" y="60" width="430" height="260" rx="18" fill="#fff" stroke="#1c1c1c" stroke-width="6"/>
    <text x="92" y="106" font-size="27" font-weight="900" fill="#e8542f">帝國週期 · 500 年</text>
    <path d="M150,270 A120,120 0 0 1 400,270" fill="none" stroke="#ded6c6" stroke-width="22" stroke-linecap="round"/>
    <path class="needle" d="M275,270 L275,168" stroke="#c0392b" stroke-width="11" stroke-linecap="round"
          style="transform-origin:275px 270px;transform:rotate(-88deg)"/>
    <circle cx="275" cy="270" r="13" fill="#1c1c1c"/>
    <text x="275" y="205" text-anchor="middle" font-size="21" font-weight="700" fill="#6b6259">衰退中</text>
    <path class="decl" d="M540,150 C650,168 740,300 1020,370" fill="none" stroke="#c0392b"
          stroke-width="10" stroke-linecap="round" stroke-dasharray="700" stroke-dashoffset="700"/>
    <circle cx="1020" cy="370" r="17" fill="#c0392b" class="ddot"/>
    <text x="1022" y="415" text-anchor="end" font-size="26" font-weight="900" fill="#c0392b">現在</text>
  </svg>`;
  setCmd(s,'STEP 3 / 9','帝國衰退','引擎還在轉，但指針往下','Ray Dalio 帝國週期模型');
  setCap(s,'崛起 → 擴張 → 過度負債 → 衰退');
  intro(tl, s, t0, 33, t1-t0-1.5, 22);
  tl.to(sc.querySelector('.needle'), { rotation:52, duration:2.2, ease:'power2.inOut' }, t0+2.2);
  tl.to(sc.querySelector('.decl'), { 'stroke-dashoffset':0, duration:2.0, ease:'power2.out' }, t0+4.0);
  tl.from(sc.querySelector('.ddot'), { scale:0, transformOrigin:'center', duration:.5, ease:'back.out(3)' }, t0+5.8);
  mark(s,2,'done'); mark(s,3,'active');
  outro(tl, s, t1);
};

// ── 幕 4 · 月光族與學費機器（64.5–92.9）──
window.SCENES.S4_MOON = function (root, tl, t0, t1) {
  const s = makeStage(root, 3), sc = s.querySelector('.stage-content');
  sc.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 1090 566">
    <text x="60" y="70" font-size="28" font-weight="900" fill="#e8542f">63% 月光族</text>
    <rect x="60" y="100" width="440" height="90" rx="14" fill="#f0ece2" stroke="#1c1c1c" stroke-width="5"/>
    <rect class="moonbar" x="60" y="100" width="0" height="90" rx="14" fill="#e8542f"/>
    <text class="moonnum num" x="300" y="162" font-size="54" font-weight="900" fill="#fff"
          font-family="Archivo Black">0%</text>
    <!-- 學費印鈔機 -->
    <rect x="600" y="330" width="200" height="140" rx="14" fill="#141b2b"/>
    <circle class="gear" cx="700" cy="400" r="40" fill="none" stroke="#f2b53a" stroke-width="9"
            style="transform-origin:700px 400px"/>
    <text x="700" y="500" text-anchor="middle" font-size="22" font-weight="700" fill="#9aa4b8">學貸印鈔機</text>
    <!-- 大學建築 -->
    <rect x="830" y="200" width="200" height="270" rx="10" fill="#fff" stroke="#1c1c1c" stroke-width="6"/>
    <polygon points="830,200 930,130 1030,200" fill="#2f6fa8" stroke="#1c1c1c" stroke-width="6"/>
    <text class="tuition num" x="930" y="460" text-anchor="middle" font-size="46" font-weight="900"
          fill="#c0392b" font-family="Archivo Black">0%</text>
    <text x="930" y="330" text-anchor="middle" font-size="24" font-weight="900">學費年漲</text>
  </svg>`;
  setCmd(s,'STEP 4 / 9','政府的善意','越想幫人民，東西就越貴','學貸不分好壞學校 → 學費失控');
  setCap(s,'行政人員：30 年前 10% → 現在 60%');
  intro(tl, s, t0, 44, t1-t0-2, 33);

  const m = { v:0 };
  tl.to(m, { v:63, duration:2.0, ease:'power1.out',
    onUpdate:()=>{ sc.querySelector('.moonnum').textContent = Math.round(m.v)+'%';
                   sc.querySelector('.moonbar').setAttribute('width', (440*m.v/100).toFixed(0)); } }, t0+2.5);
  tl.to(sc.querySelector('.gear'), { rotation:360, duration:3.0, repeat:-1, ease:'none',
    transformOrigin:'700px 400px' }, t0+8.0);
  const tu = { v:0 };
  tl.to(tu, { v:10, duration:2.2, ease:'power1.out',
    onUpdate:()=>{ sc.querySelector('.tuition').textContent = Math.round(tu.v)+'%'; } }, t0+24.0);
  mark(s,3,'done'); mark(s,4,'active');
  outro(tl, s, t1);
};

// ── 幕 5 · 勞動→資本的樓梯（92.9–115.6）──
window.SCENES.S5_LADDER = function (root, tl, t0, t1) {
  const s = makeStage(root, 4), sc = s.querySelector('.stage-content');
  sc.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 1090 566">
    <rect x="60" y="60" width="240" height="70" rx="12" fill="#3f8f63"/>
    <text x="180" y="105" text-anchor="middle" font-size="28" font-weight="900" fill="#fff">資本</text>
    <rect x="60" y="440" width="240" height="70" rx="12" fill="#2f6fa8"/>
    <text x="180" y="485" text-anchor="middle" font-size="28" font-weight="900" fill="#fff">勞動</text>
  </svg>`;
  // 樓梯 + 數字
  const stair = el('div','obj-item',{ left:'0px', top:'0px', width:'100%', height:'100%' });
  let steps = '';
  for (let i=0;i<6;i++){
    const x = 340 + i*105, y = 440 - i*64;
    steps += `<rect x="${x}" y="${y}" width="105" height="64" fill="#fffdf7" stroke="#1c1c1c" stroke-width="5"/>`;
  }
  stair.innerHTML = `<svg width="1090" height="566" viewBox="0 0 1090 566" style="position:absolute;inset:0">${steps}</svg>`;
  sc.appendChild(stair);
  const walker = el('div','fig',{ left:'320px', top:'300px' }); walker.innerHTML =
    `<svg width="70" height="110" viewBox="0 0 70 110">
       <circle cx="35" cy="20" r="16" fill="#f7d9bd" stroke="#1c1c1c" stroke-width="5"/>
       <path d="M35,36 L35,72 M35,48 L14,60 M35,48 L56,60 M35,72 L22,100 M35,72 L48,100"
         stroke="#1c1c1c" stroke-width="6" stroke-linecap="round" fill="none"/></svg>`;
  sc.appendChild(walker);
  const money = el('div','obj-item',{ left:'700px', top:'90px' });
  money.innerHTML = `<div class="num" style="font-family:'Archivo Black',sans-serif;font-size:64px;
    color:#3f8f63">$100K</div>`;
  sc.appendChild(money);
  setCmd(s,'STEP 5 / 9','美國夢的真相','資產，不是房子','每年 2% 人從勞動跨進資本');
  setCap(s,'S&P 500 年化 10–11%：10 萬 → 25 年後 108 萬');
  intro(tl, s, t0, 55, t1-t0-2, 44);

  tl.from(walker, { opacity:0, duration:.4 }, t0+2.0);
  steps = [ {x:320,y:300},{x:425,y:236},{x:530,y:172},{x:635,y:108},{x:740,y:44} ];
  // 爬階（旁白講「從勞動跨進資本」）
  tl.to(walker, { x:'+=315', y:'-=192', duration:3.4, ease:'power1.inOut' }, t0+4.0);
  const mv = { v:10 };
  tl.to(mv, { v:108, duration:2.6, ease:'power1.out',
    onUpdate:()=>{ sc.querySelector('.num').textContent = '$'+Math.round(mv.v)+'K'; } }, t0+13.5);
  mark(s,4,'done'); mark(s,5,'active');
  outro(tl, s, t1);
};

// ── 幕 6 · 財富稅天平（115.6–133.0）──
window.SCENES.S6_TAX = function (root, tl, t0, t1) {
  const s = makeStage(root, 5), sc = s.querySelector('.stage-content');
  sc.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 1090 566">
    <line x1="545" y1="110" x2="545" y2="470" stroke="#1c1c1c" stroke-width="9"/>
    <g class="beam" style="transform-origin:545px 150px">
      <line x1="250" y1="150" x2="840" y2="150" stroke="#1c1c1c" stroke-width="9" stroke-linecap="round"/>
      <circle cx="250" cy="150" r="9" fill="#1c1c1c"/><circle cx="840" cy="150" r="9" fill="#1c1c1c"/>
    </g>
    <rect x="140" y="170" width="220" height="110" rx="12" fill="#2f6fa8"/>
    <text x="250" y="238" text-anchor="middle" font-size="26" font-weight="900" fill="#fff">51% 多數決</text>
    <rect class="rightpan" x="730" y="170" width="220" height="110" rx="12" fill="#c0392b"/>
    <text x="840" y="238" text-anchor="middle" font-size="26" font-weight="900" fill="#fff">私產 49%</text>
    <text class="confsc num" x="545" y="520" text-anchor="middle" font-size="36" font-weight="900"
          fill="#c0392b" font-family="Archivo Black">沒收</text>
  </svg>`;
  setCmd(s,'STEP 6 / 9','社會主義','必然會來，但自由會失去','財富稅 ≠ 課稅，是沒收');
  setCap(s,'正解：對「交易」課稅，不是對財產');
  intro(tl, s, t0, 66, t1-t0-1.5, 55);
  tl.to(sc.querySelector('.beam'), { rotation:-9, duration:1.6, ease:'power2.inOut' }, t0+8.0);
  tl.to(sc.querySelector('.rightpan'), { opacity:.25, duration:1.0 }, t0+10.0);
  tl.from(sc.querySelector('.confsc'), { scale:0, duration:.5, ease:'back.out(2.4)' }, t0+10.5);
  mark(s,5,'done'); mark(s,6,'active');
  outro(tl, s, t1);
};

// ── 幕 7 · 房子 vs 股市（133.0–145.1）──
window.SCENES.S7_HOUSE = function (root, tl, t0, t1) {
  const s = makeStage(root, 6), sc = s.querySelector('.stage-content');
  sc.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 1090 566">
    <rect x="80" y="70" width="180" height="140" fill="#fff" stroke="#1c1c1c" stroke-width="6"/>
    <polygon points="80,70 170,10 260,70" fill="#c0392b" stroke="#1c1c1c" stroke-width="6"/>
    <rect x="150" y="150" width="44" height="60" fill="#2f6fa8" stroke="#1c1c1c" stroke-width="5"/>
    <path class="hprice" d="M80,400 L300,300 L480,120" fill="none" stroke="#c0392b"
          stroke-width="10" stroke-linecap="round" stroke-dasharray="600" stroke-dashoffset="600"/>
    <text x="500" y="120" font-size="26" font-weight="900" fill="#c0392b">房價暴漲</text>
    <text x="170" y="260" text-anchor="middle" font-size="24" font-weight="900">買房</text>
  </svg>`;
  const tree = el('div','obj-item',{ left:'640px', top:'90px' });
  tree.innerHTML = `<svg width="380" height="420" viewBox="0 0 380 420">
    <rect x="170" y="300" width="42" height="110" fill="#8a8178" stroke="#1c1c1c" stroke-width="6"/>
    <circle class="canopy" cx="190" cy="200" r="130" fill="#3f8f63" stroke="#1c1c1c" stroke-width="6"
            style="transform-origin:190px 200px;transform:scale(.1)"/>
    <text x="190" y="410" text-anchor="middle" font-size="24" font-weight="900" fill="#3f8f63">S&P 500</text>
  </svg>`;
  sc.appendChild(tree);
  setCmd(s,'STEP 7 / 9','最大的謊言','買房 ≠ 美國夢','政策推升房價，年輕人買不起');
  setCap(s,'把資產放進會成長的地方');
  intro(tl, s, t0, 77, t1-t0-1.5, 66);
  tl.to(sc.querySelector('.hprice'), { 'stroke-dashoffset':0, duration:2.0, ease:'power2.out' }, t0+3.6);
  tl.to(tree.querySelector('.canopy'), { scale:1, duration:1.8, ease:'back.out(1.5)' }, t0+1.0);
  mark(s,6,'done'); mark(s,7,'active');
  outro(tl, s, t1);
};

// ── 幕 8 · 長壽革命（145.7–169.2）──
window.SCENES.S8_LONG = function (root, tl, t0, t1) {
  const s = makeStage(root, 7), sc = s.querySelector('.stage-content');
  let sw = '';
  for (let i=0;i<9;i++){
    const x = 150 + i*88;
    sw += `<rect class="sw sw${i}" x="${x}" y="${200+(i%3)*10}" width="64" height="26" rx="13"
      fill="${i<5?'#c0392b':'#9aa4b8'}" stroke="#1c1c1c" stroke-width="4"/>`;
  }
  sc.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 1090 566">
    <ellipse cx="545" cy="300" rx="420" ry="220" fill="#fffdf7" stroke="#1c1c1c" stroke-width="8"/>
    <path d="M200,300 Q360,180 545,300 Q730,420 890,300" fill="none" stroke="#2f6fa8" stroke-width="7" opacity=".5"/>
    <path d="M200,330 Q360,210 545,330 Q730,450 890,330" fill="none" stroke="#2f6fa8" stroke-width="7" opacity=".35"/>
    ${sw}
    <text x="545" y="80" text-anchor="middle" font-size="30" font-weight="900" fill="#e8542f">細胞 · 表觀遺傳開關</text>
    <text class="rate num" x="545" y="510" text-anchor="middle" font-size="42" font-weight="900"
          fill="#3f8f63" font-family="Archivo Black">成功率 1%</text>
  </svg>`;
  setCmd(s,'STEP 8 / 9','長壽革命','老化是可以重置的工程問題','2006 山中伸彌 Yamanaka 因子');
  setCap(s,'AI 讓成功率從 1% → 75%');
  intro(tl, s, t0, 88, t1-t0-2, 77);

  // 開關錯位（老化）
  sc.querySelectorAll('.sw').forEach((sw,i) => {
    tl.to(sw, { y:'+=18', x:'+=6', duration:1.2, delay:i*.06, ease:'sine.inOut' }, t0+2.5);
  });
  // 光照歸位
  tl.to(sc.querySelectorAll('.sw'), { y:'-=18', x:'-=6', fill:'#3f8f63', duration:1.0, stagger:.05,
    ease:'power2.out' }, t0+9.5);
  const rr = { v:1 };
  tl.to(rr, { v:75, duration:2.4, ease:'power1.out',
    onUpdate:()=>{ sc.querySelector('.rate').textContent = '成功率 '+Math.round(rr.v)+'%'; } }, t0+12.0);
  mark(s,7,'done'); mark(s,8,'active');
  outro(tl, s, t1);
};

// ── 幕 9 · 黃金時代收尾（169.2–174.1）──
window.SCENES.S9_OUT = function (root, tl, t0, t1) {
  const s = makeStage(root, 8), sc = s.querySelector('.stage-content');
  sc.innerHTML = `<div style="position:absolute;left:0;right:0;top:0;bottom:78px;display:block">
    <div style="position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:24px">
    <div style="font-size:40px;font-weight:900;color:#6b6259">FRIEDBERG 的四條主軸</div>
    <div style="display:flex;gap:20px">
      ${[['① 帝國衰退',P.accent],['② 社會主義',P.purple],['③ 住房謊言',P.blue],['④ AI 黃金',P.green]]
        .map(([t,c])=>`<div class="fin" style="background:${c};color:#fff;font-size:34px;font-weight:900;
          padding:22px 34px;border-radius:18px;border:5px solid #1c1c1c;
          box-shadow:10px 10px 0 rgba(28,28,28,.18)">${t}</div>`).join('')}
    </div>
    <div style="margin-top:10px;font-family:'Caveat',cursive;font-size:44px;color:#e8542f">
      光，正在從地平線升起</div>
    </div>
  </div>`;
  setCmd(s,'9 / 9','黃金時代','大部分的人還沒意識到','光正在從地平線升起');
  setCap(s,'AI 釋放人類進步：抗衰老、解決飢餓、治癒疾病');
  tl.set(s, { opacity:1 }, t0);
  [0,1,2,3,4,5,6,7,8].forEach(i=>mark(s,i,'done'));
  rail(tl, s, 100, t0, t1-t0-1, 88);
  tl.from(s.querySelector('.cmd'), { x:60, opacity:0, duration:.5 }, t0);
  tl.from(s.querySelectorAll('.fin'), { scale:0, opacity:0, duration:.45, stagger:.2, ease:'back.out(2)' }, t0+.4);
  tl.to(s.querySelector('.stagebox'), { scale:1.06, duration:t1-t0-1, ease:'none' }, t0+1.2); // 運鏡拉遠感
  outro(tl, s, t1);
};
