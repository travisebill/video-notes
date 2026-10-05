// render.js — 舞台版：Puppeteer 逐幀 + FFmpeg
const fs = require('fs'); const path = require('path');
const puppeteer = require('puppeteer');
const { execSync } = require('child_process');
const timeline = JSON.parse(fs.readFileSync('timeline.json', 'utf8'));
const FPS = parseInt(process.argv[2] || '30', 10);
const W = 1920, H = 1080;

(async () => {
  fs.copyFileSync('scenes.js', 'scenes.build.js');
  fs.writeFileSync('index.build.html', fs.readFileSync('index.html', 'utf8')
    .replace('scenes.js', 'scenes.build.js')
    .replace('<script src="scenes.build.js"></script>',
      `<script>window.__TIMELINE__=${JSON.stringify(timeline)};</script>\n<script src="scenes.build.js"></script>`));

  const outDir = path.resolve('frames');
  if (fs.existsSync(outDir)) execSync(`rm -rf "${outDir}"`);
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await puppeteer.launch({ headless: 'new',
    args: ['--no-sandbox','--font-render-hinting=none','--force-color-profile=srgb','--hide-scrollbars'] });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve('index.build.html'), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction('window.__ready === true', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 800));

  const total = timeline.total;
  const frames = Math.ceil(total * FPS);
  console.log(`Rendering ${frames} frames @ ${FPS}fps (${total.toFixed(2)}s)`);
  for (let i = 0; i < frames; i++) {
    const t = i / FPS;
    await page.evaluate((t) => { window.__tl.pause(); window.__tl.time(t); }, t);
    await page.screenshot({ path: path.join(outDir, `f${String(i).padStart(6,'0')}.png`) });
    if (i % 120 === 0) process.stdout.write(`  ${i}/${frames}`);
  }
  await browser.close();
  console.log('\nMuxing ...');
  execSync(`ffmpeg -y -framerate ${FPS} -i "${outDir}/f%06d.png" -i ../narration.mp3 ` +
    `-c:v libx264 -pix_fmt yuv420p -crf 20 -preset medium -c:a aac -b:a 192k -shortest ` +
    `-movflags +faststart "stage30.mp4"`, { stdio: 'inherit' });
  console.log('Done -> stage30.mp4');
})();
