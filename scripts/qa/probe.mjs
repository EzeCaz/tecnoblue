import puppeteer from 'puppeteer-core';
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
for (const [route, w] of [['/solutions/gazpacho',375],['/about',375],['/',375],['/solutions/gazpacho',1440]]) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 812, isMobile: w<800, hasTouch: w<800 });
  await page.evaluateOnNewDocument(() => { try { sessionStorage.setItem('tb-intro','1'); localStorage.setItem('lang','en'); } catch {} });
  await page.goto('http://localhost:5173' + route, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) { await page.evaluate((y) => window.scrollTo(0, y), y); await new Promise(r => setTimeout(r, 200)); }
  await page.evaluate(() => window.scrollTo(0, 0)); await new Promise(r => setTimeout(r, 1500));
  const r = await page.evaluate(() => [...document.querySelectorAll('h1 span span, h2 span span, p span span')].filter(s => s.textContent.trim()).map(s => { const cs = getComputedStyle(s); const p = s.parentElement; return { t: s.textContent.trim(), op: cs.opacity, tr: cs.transform, tag: s.closest('h1,h2,p').tagName, box: Math.round(p.getBoundingClientRect().height), inner: Math.round(s.getBoundingClientRect().height) }; }).filter(x => x.op !== '1'));
  console.log(route, w, JSON.stringify(r));
  await page.close();
}
await browser.close();
