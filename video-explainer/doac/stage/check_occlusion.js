// check_occlusion.js — 生成前的自動遮蓋檢查
// 原理：DOM 幾何 → 找出「可見文字節點被其他 element 覆蓋」的情況
// 檢查項：
//   1. 每個含文字的 element 是否被 z-index 更高 / 後畫的 element 部分或完全覆蓋
//   2. 文字是否溢出父容器（title-wrap 壓到 stagebox）
//   3. 元素是否超出畫布
const fs = require('fs'); const path = require('path');
const puppeteer = require('puppeteer');

const timeline = JSON.parse(fs.readFileSync('timeline.json', 'utf8'));

(async () => {
  fs.copyFileSync('scenes_v2.js', 'scenes_v2.build.js');
  let html = fs.readFileSync('index_v2.html', 'utf8');
  html = html.replace(/[ \t]*<script>window\.__TIMELINE__=[\s\S]*?<\/script>\n/g, '');
  fs.writeFileSync('index_v2.build.html', html
    .replace('scenes_v2.js', 'scenes_v2.build.js')
    .replace('<script src="scenes_v2.build.js"></script>',
      `<script>window.__TIMELINE__=${JSON.stringify(timeline)};</script>\n<script src="scenes_v2.build.js"></script>`));

  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--font-render-hinting=none'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve('index_v2.build.html'), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction('window.__ready === true', { timeout: 30000 });

  // 每個場景結束前 1 秒（畫面最滿的時刻）取樣
  const probes = timeline.scenes.map(sc => ({ id: sc.id, t: Math.max(sc.start + 0.5, sc.end - 1.0) }));

  let totalIssues = 0;
  for (const p of probes) {
    await page.evaluate((t) => { window.__tl.pause(); window.__tl.time(t); }, p.t);
    await new Promise(r => setTimeout(r, 120));
    const issues = await page.evaluate(() => {
      const out = [];
      const scene = document.querySelector('.scene');
      if (!scene) return [{ kind: 'NO_SCENE', detail: 'no .scene' }];

      const rectOf = (el) => { const r = el.getBoundingClientRect(); return r; };
      const visible = (el) => {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        if (parseFloat(cs.opacity) < 0.05) return false;
        return rectOf(el).width > 0 && rectOf(el).height > 0;
      };

      // 1) 收集「有直接文字」的葉節點
      const textEls = [];
      scene.querySelectorAll('*').forEach(el => {
        const own = Array.from(el.childNodes).some(n => n.nodeType === 3 && n.textContent.trim().length > 0);
        if (own && visible(el)) textEls.push(el);
      });

      // 只把「實際會擋住視線的層」算成盒：排除全幅疊層（grain/vign）與純容器
      const IGNORE = ['grain', 'vign', 'grid', 'stage-content'];

      // 2) 收集所有可見的「繪製盒」（有背景或邊框的容器）
      const boxes = [];
      scene.querySelectorAll('*').forEach(el => {
        if (!visible(el)) return;
        const cs = getComputedStyle(el);
        const hasBg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent';
        const hasBorder = parseFloat(cs.borderTopWidth) > 0 || parseFloat(cs.borderLeftWidth) > 0;
        if (IGNORE.some(c => el.classList.contains(c))) return;
        // .fig / .obj-item 是內容容器，但它們「會擋住文字」→ 必須納入檢查
        if (hasBg || hasBorder || el.classList.contains('fig') || el.classList.contains('obj-item')) boxes.push(el);
      });

      const overlapArea = (a, b) => {
        const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
        const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
        return x * y;
      };
      const contains = (outer, inner) => {
        const o = rectOf(outer), i = rectOf(inner);
        return o.left <= i.left + 1 && o.right >= i.right - 1 && o.top <= i.top + 1 && o.bottom >= i.bottom - 1;
      };
      const zOf = (el) => { let z = 0, n = el; while (n && n !== scene) { const cz = parseInt(getComputedStyle(n).zIndex); if (!isNaN(cz)) z = Math.max(z, cz); n = n.parentElement; } return z; };

      // 3) 檢查文字被覆蓋
      for (const t of textEls) {
        const tr = rectOf(t);
        const tz = zOf(t);
        for (const b of boxes) {
          // 跳過：自己、祖父母、子孫（合法的容器關係，不是遮蓋）
          if (b === t || b.contains(t) || t.contains(b)) continue;
          if (contains(b, t)) {
            // 完全包住：只有在 b 是祖先/較低 z 時才算合法
            if (zOf(b) > tz) {
              out.push({ kind: 'TEXT_COVERED', text: t.textContent.trim().slice(0, 24),
                         by: b.className || b.tagName, pct: 100 });
            }
            continue;
          }
          const br = rectOf(b);
          const ov = overlapArea(tr, br);
          const area = tr.width * tr.height;
          // 只有當 b 真的「蓋在文字上方」（z 更高）且不是祖先關係才算遮蓋
          if (area > 0 && ov / area > 0.12 && zOf(b) > tz) {
            out.push({ kind: 'TEXT_COVERED', text: t.textContent.trim().slice(0, 24),
                       by: b.className || b.tagName, pct: Math.round(100 * ov / area) });
          }
        }
      }

      // 4) 標題溢出（title-wrap 與 stagebox 是否相交）
      const tw = scene.querySelector('.title-wrap');
      const sb = scene.querySelector('.stagebox');
      if (tw && sb) {
        const ov = overlapArea(rectOf(tw), rectOf(sb));
        if (ov > 0) out.push({ kind: 'TITLE_OVERFLOW', detail: `title-wrap 與 stagebox 相交 ${Math.round(ov)}px²` });
      }

      // 5) 畫布外
      scene.querySelectorAll('.obj-item, .fig').forEach(el => {
        if (!visible(el)) return;
        const r = rectOf(el);
        if (r.right > 1920 + 2 || r.bottom > 1080 + 2 || r.left < -2 || r.top < -2) {
          out.push({ kind: 'OUT_OF_CANVAS', el: el.className, rect: `${Math.round(r.left)},${Math.round(r.top)},${Math.round(r.right)},${Math.round(r.bottom)}` });
        }
      });

      // 去重
      const seen = new Set();
      return out.filter(o => { const k = JSON.stringify(o); if (seen.has(k)) return false; seen.add(k); return true; });
    });

    if (issues.length) {
      totalIssues += issues.length;
      console.log(`\n❌ ${p.id} @ ${p.t.toFixed(1)}s — ${issues.length} 個問題`);
      issues.forEach(i => console.log('   ', JSON.stringify(i)));
    } else {
      console.log(`✅ ${p.id} @ ${p.t.toFixed(1)}s — clean`);
    }
  }
  await browser.close();
  console.log(`\n=== 總計 ${totalIssues} 個問題 ===`);
  process.exit(totalIssues > 0 ? 1 : 0);
})();
