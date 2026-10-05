// scenes.js — DOAC 舞台式解說 · 開場 30 秒
// 文法：固定舞台（標題 / 中央舞台框 / 右側指令卡 / 底部時間軸）
//       物件在舞台上累積，文字指令 ↔ 圖像執行成對出現
const P = { ink:'#1c1c1c', paper:'#f6f1e4', accent:'#e8542f', gold:'#f2b53a',
            blue:'#2f6fa8', green:'#3f8f63', purple:'#7a4fa3', muted:'#9a9188' };

function el(tag, cls, style) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (style) Object.assign(e.style, style);
  return e;
}
function html(s, fragment) { s.insertAdjacentHTML('beforeend', fragment); return s; }

// ── 固定舞台骨架（每一幕都長一樣，只有內容變）──────────────
function makeStage(root, nodes) {
  const s = el('div', 'scene');
  html(s, `
    <div class="grain"></div>
    <div class="top-id">
      <div class="brand">THE DIARY OF A CEO <small>· David Friedberg</small></div>
      <div class="top-right">124 分鐘深度對談 · 40 章節</div>
    </div>
    <div class="title-wrap">
      <div class="mega">美國帝國衰退<br><span class="ink2">與 AI 黃金時代</span></div>
      <div class="subtitle">白宮科技顧問 Friedberg 的四條主軸</div>
    </div>
    <div class="stagebox">
      <div class="grid"></div>
      <div class="stage-content"></div>
      <div class="stage-caption"></div>
    </div>
    <div class="cmd">
      <div class="step">STEP 0 / 4</div>
      <div class="verb">開場</div>
      <div class="obj"></div>
      <div class="note"></div>
    </div>
    <div class="rail">
      <div class="rail-line"></div><div class="rail-fill"></div>
      <div class="rail-nodes">${nodes.map((n,i)=>`
        <div class="node" data-i="${i}"><div class="dot">${i+1}</div><div class="nlabel">${n}</div></div>`).join('')}
      </div>
    </div>`);
  root.appendChild(s);
  return s;
}

// 設定指令卡
function setCmd(s, step, verb, obj, note) {
  s.querySelector('.cmd .step').textContent = step;
  s.querySelector('.cmd .verb').textContent = verb;
  s.querySelector('.cmd .obj').textContent = obj || '';
  s.querySelector('.cmd .note').textContent = note || '';
}
// 標記時間軸節點
function markNode(s, i, state) {
  const n = s.querySelector(`.node[data-i="${i}"]`);
  if (n) n.classList.add(state);
}
// 推進時間軸紅線
function railTo(tl, s, pct, at, dur) {
  tl.fromTo(s.querySelector('.rail-fill'), { width: '0%' }, { width: pct + '%', duration: dur, ease: 'power1.inOut' }, at);
}

window.SCENES = {};

// ═══ 開場 30 秒：單一舞台，物件持續累積 ═══
window.SCENES.OPEN = function (root, tl, t0, t1) {
  const s = makeStage(root, ['帝國衰退', '社會主義', '住房謊言', 'AI 時代']);
  const sc = s.querySelector('.stage-content');
  const cap = s.querySelector('.stage-caption');

  // 舞台上的三個持續存在的物件：人物、麥克風、以及累積的「議題泡泡」
  const person = el('div', 'fig', { left:'390px', top:'120px' });
  person.innerHTML = `
    <svg width="320" height="380" viewBox="0 0 320 380">
      <ellipse cx="160" cy="340" rx="130" ry="26" fill="rgba(0,0,0,.07)"/>
      <path d="M70,368 Q160,300 250,368 Z" fill="#2f6fa8" stroke="#1c1c1c" stroke-width="7"/>
      <circle cx="160" cy="130" r="74" fill="#f7d9bd" stroke="#1c1c1c" stroke-width="7"/>
      <path d="M92,116 Q160,58 228,116 Q200,86 160,84 Q120,86 92,116 Z" fill="#3a2f28" stroke="#1c1c1c" stroke-width="7"/>
      <circle cx="136" cy="132" r="7" fill="#1c1c1c"/><circle cx="186" cy="132" r="7" fill="#1c1c1c"/>
      <path d="M138,168 Q160,182 182,168" fill="none" stroke="#1c1c1c" stroke-width="6" stroke-linecap="round"/>
      <rect x="140" y="240" width="40" height="70" fill="#f2b53a" stroke="#1c1c1c" stroke-width="6"/>
      <path d="M120,250 L160,300 L200,250" fill="none" stroke="#1c1c1c" stroke-width="7"/>
    </svg>`;
  sc.appendChild(person);

  const mic = el('div', 'fig', { left:'760px', top:'190px' });
  mic.innerHTML = `
    <svg width="180" height="300" viewBox="0 0 180 300">
      <rect x="76" y="20" width="28" height="230" rx="14" fill="#8a8178" stroke="#1c1c1c" stroke-width="6"/>
      <rect x="60" y="0" width="60" height="70" rx="30" fill="#2f6fa8" stroke="#1c1c1c" stroke-width="6"/>
    </svg>`;
  sc.appendChild(mic);

  cap.textContent = 'The Diary Of A CEO · 與白宮科技顧問的一場對談';
  cap.style.cssText = 'position:absolute;left:0;right:0;bottom:18px;text-align:center;' +
    'font-size:26px;font-weight:700;color:#6b6259;';

  setCmd(s, 'STEP 0 / 4', '開場', '史蒂芬・巴特利 × 大衛・弗雷德伯格', 'All-In Podcast 共同主持人');

  // ── 時間軸 ──
  tl.set(s, { opacity: 1 }, t0);
  tl.from(s.querySelectorAll('.top-id, .title-wrap'), { y:-30, opacity:0, duration:.7, ease:'power3.out' }, t0 + .1);
  tl.from(s.querySelector('.stagebox'), { scale:.92, opacity:0, duration:.7, ease:'back.out(1.3)' }, t0 + .5);
  tl.from(s.querySelector('.cmd'), { x:80, opacity:0, duration:.7, ease:'power3.out' }, t0 + .9);
  tl.from(s.querySelector('.rail'), { y:50, opacity:0, duration:.6 }, t0 + 1.3);
  tl.from(person, { y:60, opacity:0, duration:.8, ease:'back.out(1.2)' }, t0 + 1.8);
  tl.from(mic, { y:80, opacity:0, duration:.7, ease:'back.out(1.4)' }, t0 + 5.6);
  railTo(tl, s, 25, t0 + 1.5, t1 - t0 - 3);

  // 「議題泡泡」依旁白逐個從舞台上方冒出來（物件累積）
  const bubbles = [
    { t: t0 + 10.1, x: 120, y: 60,  txt: '美國經濟結構', c: P.accent },
    { t: t0 + 15.7, x: 470, y: 30,  txt: '住房迷思',     c: P.blue },
    { t: t0 + 18.7, x: 120, y: 250, txt: 'AI 與工作',    c: P.green },
    { t: t0 + 23.8, x: 470, y: 240, txt: '長壽革命',     c: P.purple },
  ];
  bubbles.forEach(b => {
    const n = el('div', 'obj-item', { left:b.x+'px', top:b.y+'px' });
    n.textContent = b.txt;
    n.style.cssText += `background:${b.c};color:#fff;font-size:28px;font-weight:900;
      padding:14px 30px;border-radius:40px;border:4px solid #1c1c1c;white-space:nowrap;
      box-shadow:8px 8px 0 rgba(28,28,28,.15);`;
    sc.appendChild(n);
    tl.from(n, { scale:0, opacity:0, duration:.5, ease:'back.out(2.2)' }, b.t);
    tl.to(n, { y:'-=10', duration:1.6, yoyo:true, repeat:-1, ease:'sine.inOut' }, b.t + .5);
  });

  // ── 收束：切入四條主軸 ──
  markNode(s, 0, 'done');
  tl.to(s, { opacity: 0, duration: .7, ease:'power2.in' }, t1 - .7);
};

// ═══ 主軸一：帝國衰退（儀表板指針動起來）═══
window.SCENES.S1 = function (root, tl, t0, t1) {
  const s = makeStage(root, ['帝國衰退', '社會主義', '住房謊言', 'AI 時代']);
  const sc = s.querySelector('.stage-content');
  const cap = s.querySelector('.stage-caption');

  sc.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 1080 560">
      <!-- 儀表板：美國引擎 -->
      <rect x="60" y="70" width="420" height="250" rx="18" fill="#fff" stroke="#1c1c1c" stroke-width="5"/>
      <text x="90" y="115" font-size="26" font-weight="900" fill="#e8542f">美國引擎儀表板</text>
      <!-- 指針錶 -->
      <path d="M150,270 A110,110 0 0 1 370,270" fill="none" stroke="#ded6c6" stroke-width="20" stroke-linecap="round"/>
      <path class="needle" d="M260,270 L260,175" stroke="#e8542f" stroke-width="10" stroke-linecap="round"
            style="transform-origin:260px 270px;transform:rotate(-90deg)"/>
      <circle cx="260" cy="270" r="12" fill="#1c1c1c"/>
      <text x="260" y="200" text-anchor="middle" font-size="22" font-weight="700" fill="#6b6259">帝國週期</text>
      <!-- 下沉曲線 -->
      <path d="M520,180 C620,190 700,300 1000,340" fill="none" stroke="#e8542f" stroke-width="9"
            stroke-linecap="round" class="decline"/>
      <circle cx="1000" cy="340" r="16" fill="#c0392b" class="dcl-dot"/>
      <text x="1000" y="380" text-anchor="end" font-size="26" font-weight="900" fill="#c0392b">現在</text>
      <!-- 月光族 -->
      <rect x="520" y="400" width="480" height="110" rx="16" fill="#141b2b"/>
      <text x="550" y="442" font-size="24" font-weight="700" fill="#9aa4b8">月光族比例</text>
      <text class="paycheck num" x="550" y="498" font-size="56" font-weight="900" fill="#f2b53a"
            font-family="Archivo Black">0%</text>
    </svg>`;
  cap.textContent = 'Ray Dalio 帝國週期模型 · 勞動 → 資本的轉換';
  cap.style.cssText = 'position:absolute;left:0;right:0;bottom:18px;text-align:center;' +
    'font-size:26px;font-weight:700;color:#6b6259;';
  setCmd(s, 'STEP 1 / 4', '帝國衰退', '但潛力並未被刪除', '每年需 2% 美國人從勞動跨入資本');

  tl.set(s, { opacity: 1 }, t0);
  markNode(s, 0, 'done'); markNode(s, 1, 'active');
  tl.from(sc.querySelector('svg'), { opacity:0, scale:.94, duration:.6 }, t0 + .1);
  tl.from(s.querySelector('.stagebox'), { x:-60, opacity:0, duration:.6, ease:'power3.out' }, t0);
  tl.from(s.querySelector('.cmd'), { x:60, opacity:0, duration:.6 }, t0 + .2);
  tl.from(cap, { opacity:0, duration:.5 }, t0 + .4);
  railTo(tl, s, 50, t0, t1 - t0 - 1);

  // 指針轉動（旁白講「衰退」時）
  tl.to(sc.querySelector('.needle'), { rotation: 55, duration: 2.4, ease:'power2.inOut' }, t0 + 4.0);
  // 下沉曲線畫出
  tl.fromTo(sc.querySelector('.decline'), { 'stroke-dasharray':'600', 'stroke-dashoffset':'600' },
            { 'stroke-dashoffset':'0', duration:2.0, ease:'power2.out' }, t0 + 6.0);
  tl.from(sc.querySelector('.dcl-dot'), { scale:0, transformOrigin:'center', duration:.5, ease:'back.out(3)' }, t0 + 7.8);
  // 月光族數字跳到 63%
  const obj = { v: 0 };
  tl.to(obj, { v: 63, duration: 1.6, ease:'power1.out',
    onUpdate: () => { sc.querySelector('.paycheck').textContent = Math.round(obj.v) + '%'; } }, t0 + 9.5);

  tl.to(s, { opacity: 0, x: 60, duration:.7, ease:'power2.in' }, t1 - .7);
};

// ═══ 主軸二：社會主義與財富稅 ═══
window.SCENES.S2 = function (root, tl, t0, t1) {
  const s = makeStage(root, ['帝國衰退', '社會主義', '住房謊言', 'AI 時代']);
  const sc = s.querySelector('.stage-content');
  const cap = s.querySelector('.stage-caption');

  sc.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 1080 560">
      <!-- 兩根天平：多數 vs 少數 -->
      <rect x="70" y="90" width="440" height="180" rx="16" fill="#fff" stroke="#1c1c1c" stroke-width="5"/>
      <text x="100" y="135" font-size="26" font-weight="900" fill="#2f6fa8">51% 多數決</text>
      <rect class="barA" x="100" y="170" width="0" height="60" rx="10" fill="#2f6fa8"/>
      <rect x="70" y="320" width="440" height="180" rx="16" fill="#fff" stroke="#c0392b" stroke-width="5"/>
      <text x="100" y="365" font-size="26" font-weight="900" fill="#c0392b">49% 被沒收</text>
      <rect class="barB" x="100" y="400" width="0" height="60" rx="10" fill="#c0392b"/>
      <!-- 右：財產 vs 交易 -->
      <rect x="570" y="90" width="440" height="180" rx="16" fill="#fff" stroke="#1c1c1c" stroke-width="5"/>
      <text x="820" y="150" text-anchor="middle" font-size="56" font-weight="900" fill="#c0392b">✕</text>
      <text x="820" y="200" text-anchor="middle" font-size="30" font-weight="900">財富稅＝沒收</text>
      <text x="820" y="240" text-anchor="middle" font-size="22" fill="#6b6259">違反私有財產權</text>
      <rect x="570" y="320" width="440" height="180" rx="16" fill="#eef7f0" stroke="#3f8f63" stroke-width="5"/>
      <text x="820" y="380" text-anchor="middle" font-size="56" font-weight="900" fill="#3f8f63">✓</text>
      <text x="820" y="430" text-anchor="middle" font-size="30" font-weight="900">對交易課稅</text>
      <text x="820" y="470" text-anchor="middle" font-size="22" fill="#6b6259">賣股・質押買遊艇才課</text>
    </svg>`;
  cap.textContent = '50% 美國人某種程度上依賴政府支付';
  cap.style.cssText = 'position:absolute;left:0;right:0;bottom:18px;text-align:center;' +
    'font-size:26px;font-weight:700;color:#6b6259;';
  setCmd(s, 'STEP 2 / 4', '社會主義', '必然會來，但自由會失去', '關鍵：不打開私有財產權的漏洞');

  tl.set(s, { opacity: 1 }, t0);
  markNode(s, 0, 'done'); markNode(s, 1, 'done'); markNode(s, 2, 'active');
  tl.from(sc.querySelector('svg'), { opacity:0, x:-50, duration:.6 }, t0 + .1);
  tl.from(s.querySelector('.stagebox'), { x:-60, opacity:0, duration:.6, ease:'power3.out' }, t0);
  tl.from(s.querySelector('.cmd'), { x:60, opacity:0, duration:.6 }, t0 + .2);
  tl.from(cap, { opacity:0, duration:.5 }, t0 + .4);
  railTo(tl, s, 50, t0, t1 - t0 - 1);

  tl.fromTo(sc.querySelector('.barA'), { width:0 }, { width:'330px', duration:1.1, ease:'power3.out' }, t0 + 1.0);
  tl.fromTo(sc.querySelector('.barB'), { width:0 }, { width:'300px', duration:1.1, ease:'power3.out' }, t0 + 2.3);
  tl.from(sc.querySelectorAll('svg > rect, svg > text'), { opacity:0, duration:.4 }, t0 + 5.0);

  tl.to(s, { opacity: 0, x: 60, duration:.7, ease:'power2.in' }, t1 - .7);
};

// ═══ 主軸三：住房謊言 ═══
window.SCENES.S3 = function (root, tl, t0, t1) {
  const s = makeStage(root, ['帝國衰退', '社會主義', '住房謊言', 'AI 時代']);
  const sc = s.querySelector('.stage-content');
  const cap = s.querySelector('.stage-caption');

  sc.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 1080 560">
      <text x="70" y="70" font-size="30" font-weight="900" fill="#c0392b">自有住房是最大的謊言</text>
      <path class="houseline" d="M80,460 L260,380 L440,260 L620,120 L780,70"
            fill="none" stroke="#c0392b" stroke-width="10" stroke-linecap="round"/>
      <text x="790" y="60" font-size="24" font-weight="900" fill="#c0392b">房價暴漲</text>
      <rect x="620" y="330" width="400" height="150" rx="16" fill="#141b2b"/>
      <text x="650" y="375" font-size="24" font-weight="700" fill="#9aa4b8">買不起的年輕世代</text>
      <text class="young num" x="650" y="440" font-size="56" font-weight="900" fill="#f2b53a"
            font-family="Archivo Black">0 萬</text>
      <rect x="70" y="330" width="480" height="150" rx="16" fill="#eef7f0" stroke="#3f8f63" stroke-width="5"/>
      <text x="100" y="375" font-size="24" font-weight="900" fill="#3f8f63">更好的工具：S&amp;P 500</text>
      <text class="sp num" x="100" y="440" font-size="56" font-weight="900" fill="#3f8f63"
            font-family="Archivo Black">0%</text>
    </svg>`;
  cap.textContent = '年均 10–11% 報酬 · 免財產稅、保險、維修';
  cap.style.cssText = 'position:absolute;left:0;right:0;bottom:18px;text-align:center;' +
    'font-size:26px;font-weight:700;color:#6b6259;';
  setCmd(s, 'STEP 3 / 4', '住房謊言', '資產該放哪裡？', '說服每個人押一棟房子，才是問題');

  tl.set(s, { opacity: 1 }, t0);
  markNode(s, 0, 'done'); markNode(s, 1, 'done'); markNode(s, 2, 'active');
  tl.from(sc.querySelector('svg'), { opacity:0, x:-50, duration:.6 }, t0 + .1);
  tl.from(s.querySelector('.stagebox'), { opacity:0, duration:.6 }, t0);
  tl.from(s.querySelector('.cmd'), { x:60, opacity:0, duration:.6 }, t0 + .2);
  tl.from(cap, { opacity:0, duration:.5 }, t0 + .4);
  railTo(tl, s, 75, t0, t1 - t0 - 1);

  tl.fromTo(sc.querySelector('.houseline'), { 'stroke-dasharray':'1000', 'stroke-dashoffset':'1000' },
            { 'stroke-dashoffset':'0', duration:2.2, ease:'power2.out' }, t0 + 1.0);
  const o1 = { v:0 };
  tl.to(o1, { v:4000, duration:1.5, ease:'power1.out',
    onUpdate: () => { sc.querySelector('.young').textContent = Math.round(o1.v) + ' 萬'; } }, t0 + 3.0);
  const o2 = { v:0 };
  tl.to(o2, { v:10, duration:1.4, ease:'power1.out',
    onUpdate: () => { sc.querySelector('.sp').textContent = Math.round(o2.v) + '–11%'; } }, t0 + 5.5);

  tl.to(s, { opacity: 0, x: 60, duration:.7, ease:'power2.in' }, t1 - .7);
};

// ═══ 尾聲：四條主軸齊發 ═══
window.SCENES.OUT = function (root, tl, t0, t1) {
  const s = makeStage(root, ['帝國衰退', '社會主義', '住房謊言', 'AI 時代']);
  const sc = s.querySelector('.stage-content');
  const cap = s.querySelector('.stage-caption');
  sc.innerHTML = `
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;
      align-items:center;justify-content:center;gap:26px;">
      <div style="font-size:44px;font-weight:900;color:#6b6259;">FRIEDBERG 的四條主軸</div>
      <div style="display:flex;gap:22px;">
        ${['① 帝國衰退','② 社會主義','③ 住房謊言','④ AI 黃金時代'].map((t,i)=>
          `<div class="fin" style="background:${[P.accent,P.purple,P.blue,P.green][i]};color:#fff;
            font-size:38px;font-weight:900;padding:24px 40px;border-radius:20px;
            border:5px solid #1c1c1c;box-shadow:10px 10px 0 rgba(28,28,28,.18)">${t}</div>`).join('')}
      </div>
    </div>`;
  cap.textContent = '真正的風險不在 AI 本身，而在選擇如何回應不平等';
  cap.style.cssText = 'position:absolute;left:0;right:0;bottom:18px;text-align:center;' +
    'font-size:26px;font-weight:700;color:#6b6259;';
  setCmd(s, '4 / 4', '全部收束', '四條主軸串成一條線', '被嚴重低估的人類適應力');

  tl.set(s, { opacity: 1 }, t0);
  [0,1,2,3].forEach(i => markNode(s, i, 'done'));
  railTo(tl, s, 100, t0, t1 - t0 - 1);
  tl.from(s.querySelector('.cmd'), { x:60, opacity:0, duration:.6 }, t0);
  tl.from(s.querySelectorAll('.fin'), { scale:0, opacity:0, duration:.5, stagger:.25, ease:'back.out(2)' }, t0 + .5);
  tl.to(s.querySelectorAll('.fin'), { y:-12, duration:.8, stagger:.2, yoyo:true, repeat:1, ease:'sine.inOut' }, t0 + 2.0);
  tl.from(cap, { opacity:0, duration:.7 }, t0 + 2.4);
  tl.to(s, { opacity: 0, duration:.8 }, t1 - .8);
};
