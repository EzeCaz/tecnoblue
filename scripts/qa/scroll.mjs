import puppeteer from 'puppeteer-core';
const OUT='/private/tmp/claude-501/-Users-amitsingler-tecnoblue-site/e79fbd1a-bcb7-4a1d-98dc-0901cc30f77a/scratchpad/qa/scroll';
import fs from 'node:fs'; fs.mkdirSync(OUT,{recursive:true});
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
const jobs = JSON.parse(process.argv[2]);
for (const { route, w, h = 812, fracs, theme = 'light' } of jobs) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, isMobile: w < 800, hasTouch: w < 800 });
  await page.evaluateOnNewDocument((t) => { try { sessionStorage.setItem('tb-intro','1'); localStorage.setItem('lang','en'); localStorage.setItem('tb-theme', t); } catch {} }, theme);
  await page.goto('http://localhost:5173' + route, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2500));
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (const f of fracs) {
    const y = Math.round(f * (H - h));
    // scroll smoothly in steps so scroll-driven effects update
    const cur = await page.evaluate(() => scrollY);
    const steps = 12; for (let i = 1; i <= steps; i++) { await page.evaluate((y) => window.scrollTo(0, y), Math.round(cur + (y - cur) * i / steps)); await new Promise(r => setTimeout(r, 60)); }
    await new Promise(r => setTimeout(r, 1200));
    const name = `${w}-${theme}-${route.replace(/\//g,'_')||'home'}-${Math.round(f*100)}.png`;
    await page.screenshot({ path: `${OUT}/${name}` });
    console.log(name, 'y=', y, 'H=', H);
  }
  await page.close();
}
await browser.close();
