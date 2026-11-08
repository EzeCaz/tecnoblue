import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox','--use-gl=angle','--use-angle=metal'] });
const p = await b.newPage(); await p.setViewport({ width: 1440, height: 900 });
await p.evaluateOnNewDocument(() => { try { sessionStorage.setItem('tb-intro','1'); localStorage.setItem('tb-lang','en'); } catch {} });
await p.goto(process.argv[2] + '/', { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2000));
const H = await p.evaluate(() => document.documentElement.scrollHeight);
// scroll slowly through the pinned rail region
for (let y = 0; y < H * 0.45; y += 120) { await p.evaluate(y => scrollTo(0, y), y); await new Promise(r => setTimeout(r, 80)); }
await new Promise(r => setTimeout(r, 1500));
const info = await p.evaluate(() => [...document.querySelectorAll('img')].filter(i => /logos\//.test(i.getAttribute('src'))).map(i => { const r = i.getBoundingClientRect(); return { src: i.getAttribute('src'), loading: i.loading, complete: i.complete, nw: i.naturalWidth, inView: r.right > 0 && r.left < innerWidth && r.bottom > 0 && r.top < innerHeight, x: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height) }; }));
console.log(JSON.stringify(info.filter(x => /callvu|realo|directa|gazpacho|better/.test(x.src)).slice(0, 12), null, 0));
await p.screenshot({ path: process.argv[3] });
await b.close();
