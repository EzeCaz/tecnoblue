import puppeteer from 'puppeteer-core';
const ROUTES = ['/','/solutions','/solutions/gazpacho','/about','/contact','/privacy','/nope'];
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'] });
let total = 0;
for (const theme of ['light','dark']) for (const w of [375, 1440]) for (const route of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900, isMobile: w < 800 });
  await page.evaluateOnNewDocument((t) => { try { localStorage.setItem('tb-theme', t); localStorage.setItem('tb-lang', 'en'); sessionStorage.setItem('tb-intro', '1'); } catch {} }, theme);
  await page.goto('http://localhost:5173' + route + '?motion=off', { waitUntil: 'networkidle0' });
  await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js' });
  await new Promise(r => setTimeout(r, 800));
  const res = await page.evaluate(async () => { const r = await window.axe.run(document, { runOnly: ['wcag2a','wcag2aa','wcag21aa','best-practice'] }); return r.violations.map(v => ({ id: v.id, impact: v.impact, n: v.nodes.length, sel: v.nodes.slice(0,2).map(n => n.target.join(' ')) })); });
  total += res.length;
  if (res.length) console.log(theme, w, route, JSON.stringify(res));
  await page.close();
}
console.log('axe violations total:', total);
await browser.close();
