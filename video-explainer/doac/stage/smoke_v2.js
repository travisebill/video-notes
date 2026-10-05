// smoke_v2.js — 抽樣驗證 v2
const fs = require('fs'); const path = require('path');
const puppeteer = require('puppeteer');
const timeline = JSON.parse(fs.readFileSync('timeline.json', 'utf8'));
(async () => {
  fs.copyFileSync('scenes_v2.js', 'scenes_v2.build.js');
  let html = fs.readFileSync('index_v2.html', 'utf8');
  // 移除任何既存的 __TIMELINE__ script（避免 stale timeline 殘留）
  html = html.replace(/<script>window\.__TIMELINE__=[\s\S]*?<\/script>\n?/g, '');
  fs.writeFileSync('index_v2.build.html', html
    .replace('scenes_v2.js', 'scenes_v2.build.js')
    .replace('<script src="scenes_v2.build.js"></script>',
      `<script>window.__TIMELINE__=${JSON.stringify(timeline)};</script>\n<script src="scenes_v2.build.js"></script>`));
  const out = path.resolve('smoke_v2'); fs.mkdirSync(out, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new',
    args: ['--no-sandbox','--font-render-hinting=none','--force-color-profile=srgb'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve('index_v2.build.html'), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction('window.__ready === true', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 900));
  const samples = [10, 20, 30, 42, 56, 72, 88, 104, 122, 138, 158, 172];
  for (const t of samples) {
    await page.evaluate((t) => { window.__tl.pause(); window.__tl.time(t); }, t);
    await page.screenshot({ path: path.join(out, `t${String(t).padStart(3,'0')}.png`) });
  }
  await browser.close();
  console.log('smoke_v2 ->', samples.join(','));
})();
