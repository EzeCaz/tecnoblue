import puppeteer from 'puppeteer-core';
// Rough frame-time comparison: scroll the page slowly for 8 s while sampling requestAnimationFrame deltas.
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: process.env.GL === 'metal' ? ['--no-sandbox','--use-gl=angle','--use-angle=metal'] : ['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
for (const base of process.argv.slice(2)) for (const w of [1440, 375]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: w < 800 ? 812 : 900, isMobile: w < 800 });
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('tb-intro','1'); localStorage.setItem('tb-lang','en'); localStorage.setItem('tb-theme','light'); } catch {} });
  await page.goto(base + '/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 2000));
  const res = await page.evaluate(() => new Promise((resolve) => {
    const deltas = []; let last = performance.now(); const H = document.documentElement.scrollHeight - innerHeight; const t0 = last;
    const tick = (now) => { deltas.push(now - last); last = now; const p = Math.min(1, (now - t0) / 8000); window.scrollTo(0, p * H * 0.9); if (p < 1) requestAnimationFrame(tick); else { deltas.sort((a,b)=>a-b); const n = deltas.length; resolve({ frames: n, avgMs: +(deltas.reduce((a,b)=>a+b,0)/n).toFixed(1), p95Ms: +deltas[Math.floor(n*0.95)].toFixed(1), long: deltas.filter(d => d > 50).length }); } };
    requestAnimationFrame(tick);
  }));
  console.log(base, w, JSON.stringify(res));
  await page.close();
}
await browser.close();
