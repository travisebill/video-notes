// smoke.js — 舞台版：抽樣檢查
const fs = require('fs'); const path = require('path');
const puppeteer = require('puppeteer');
const timeline = JSON.parse(fs.readFileSync('timeline.json', 'utf8'));
(async () => {
  fs.copyFileSync('scenes.js', 'scenes.build.js');
  fs.writeFileSync('index.build.html', fs.readFileSync('index.html', 'utf8')
    .replace('scenes.js', 'scenes.build.js')
    .replace('<script src="scenes.build.js"></script>',
      `<script>window.__TIMELINE__=${JSON.stringify(timeline)};</script>\n<script src="scenes.build.js"></script>`));
  const out = path.resolve('smoke'); fs.mkdirSync(out, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new',
    args: ['--no-sandbox','--font-render-hinting=none','--force-color-profile=srgb'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve('index.build.html'), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction('window.__ready === true', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 800));
  const samples = [3, 8, 12, 17, 22, 26, 34, 40, 46, 52, 58, 66];
  for (const t of samples) {
    await page.evaluate((t) => { window.__tl.pause(); window.__tl.time(t); }, t);
    await page.screenshot({ path: path.join(out, `t${String(t).padStart(3,'0')}.png`) });
  }
  await browser.close();
  console.log('smoke ->', samples.join(','));
})();
