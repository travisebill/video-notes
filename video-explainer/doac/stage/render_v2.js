// render_v2.js — 全片渲染（v2，174s）
const fs = require('fs'); const path = require('path');
const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const timeline = JSON.parse(fs.readFileSync('timeline.json', 'utf8'));
const FPS = parseInt(process.argv[2] || '30', 10);
const W = 1920, H = 1080;

(async () => {
  fs.copyFileSync('scenes_v2.js', 'scenes_v2.build.js');
  let html = fs.readFileSync('index_v2.html', 'utf8');
  html = html.replace(/[ \t]*<script>window\.__TIMELINE__=[\s\S]*?<\/script>\n/g, '');
  fs.writeFileSync('index_v2.build.html', html
    .replace('scenes_v2.js', 'scenes_v2.build.js')
    .replace('<script src="scenes_v2.build.js"></script>',
      `<script>window.__TIMELINE__=${JSON.stringify(timeline)};</script>\n<script src="scenes_v2.build.js"></script>`));

  const outDir = path.resolve('frames_v2');
  if (fs.existsSync(outDir)) execSync(`rm -rf "${outDir}"`);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: 'new',
    args: ['--no-sandbox','--font-render-hinting=none','--force-color-profile=srgb','--hide-scrollbars'] });
  const page = await browser.newPage();
  page.on('pageerror', e => console.log('PAGEERROR:', e.message));
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve('index_v2.build.html'), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction('window.__ready === true', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 900));

  const total = timeline.total;
  const frames = Math.ceil(total * FPS);
  console.log(`Rendering ${frames} frames @ ${FPS}fps (${total.toFixed(2)}s)`);
  for (let i = 0; i < frames; i++) {
    const t = i / FPS;
    await page.evaluate((t) => { window.__tl.pause(); window.__tl.time(t); }, t);
    await page.screenshot({ path: path.join(outDir, `f${String(i).padStart(6,'0')}.png`) });
    if (i % 150 === 0) console.log(`  ${i}/${frames}`);
  }
  await browser.close();
  console.log('Muxing ...');
  execSync(`ffmpeg -y -framerate ${FPS} -i "${outDir}/f%06d.png" -i ../narration_v3.mp3 ` +
    `-c:v libx264 -pix_fmt yuv420p -crf 20 -preset medium -c:a aac -b:a 192k -shortest ` +
    `-movflags +faststart "explainer_v2.mp4"`, { stdio: 'inherit' });
  console.log('Done -> explainer_v2.mp4');
})();
