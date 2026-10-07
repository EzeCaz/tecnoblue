import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
const OUT = process.argv[2] || '/private/tmp/claude-501/-Users-amitsingler-tecnoblue-site/e79fbd1a-bcb7-4a1d-98dc-0901cc30f77a/scratchpad/qa/shots';
const BASE = process.env.BASE || 'http://localhost:5173';
const ROUTES = (process.env.ROUTES || '/,/solutions,/solutions/gazpacho,/solutions/directa,/solutions/callvu,/solutions/realo,/solutions/betterscreentv,/about,/contact,/privacy,/terms,/nope').split(',');
const VIEWS = (process.env.VIEWS || 'm,d').split(',');
const THEMES = (process.env.THEMES || 'light,dark').split(',');
const SIZES = { m: { width: 375, height: 812, mobile: true }, t: { width: 768, height: 1024, mobile: true }, d: { width: 1440, height: 900, mobile: false } };
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const findings = [];
for (const v of VIEWS) for (const theme of THEMES) for (const route of ROUTES) {
  const page = await browser.newPage();
  const s = SIZES[v];
  await page.setViewport({ width: s.width, height: s.height, deviceScaleFactor: 1, isMobile: s.mobile, hasTouch: s.mobile });
  if (s.mobile) await page.setUserAgent('Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36');
  await page.evaluateOnNewDocument((t, l) => { try { localStorage.setItem('tb-theme', t); localStorage.setItem('tb-lang', l); sessionStorage.setItem('tb-intro', '1'); } catch {} }, theme, process.env.LANG_ || 'en');
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push('PAGEERROR ' + e.message));
  await page.goto(BASE + route, { waitUntil: 'networkidle0', timeout: 60000 }).catch((e) => errors.push('NAV ' + e.message));
  await new Promise((r) => setTimeout(r, 2500));
  const name = `${v}-${theme}-${route === '/' ? 'home' : route.replace(/\//g, '_').replace(/^_/, '')}`;
  // hero screenshot (viewport only, animations have run)
  await page.screenshot({ path: `${OUT}/${name}-top.png` });
  // scroll through to trigger reveals, then full page
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += s.height * 0.6) { await page.evaluate((y) => window.scrollTo(0, y), y); await new Promise((r) => setTimeout(r, 250)); }
  await new Promise((r) => setTimeout(r, 1200));
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise((r) => setTimeout(r, 400));
  if (process.env.FULL) await page.screenshot({ path: `${OUT}/${name}-full.png`, fullPage: true });
  const report = await page.evaluate(() => {
    const out = {};
    out.scrollWidth = document.documentElement.scrollWidth; out.innerWidth = innerWidth;
    out.theme = document.documentElement.dataset.theme;
    // overflow offenders
    out.overflow = [...document.querySelectorAll('body *')].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1) && getComputedStyle(el).position !== 'fixed'; }).slice(0, 8).map((el) => el.tagName.toLowerCase() + '.' + [...el.classList].slice(0, 3).join('.') + ' ' + Math.round(el.getBoundingClientRect().left) + '..' + Math.round(el.getBoundingClientRect().right));
    // headings invisible
    out.hiddenHeadings = [...document.querySelectorAll('h1,h2,h3')].filter((h) => { const cs = getComputedStyle(h); const r = h.getBoundingClientRect(); const txt = (h.textContent || '').trim(); return txt && (cs.opacity === '0' || cs.visibility === 'hidden' || r.height === 0 || (r.width === 0)); }).map((h) => h.tagName + ': ' + (h.textContent || '').trim().slice(0, 40));
    // invisible word spans in SplitReveal
    out.invisibleWords = [...document.querySelectorAll('h1 span, h2 span')].filter((sp) => { const cs = getComputedStyle(sp); return (sp.textContent || '').trim() && (cs.opacity === '0' || (cs.transform && cs.transform !== 'none' && /matrix\(1, 0, 0, 1, 0, (\d+)/.test(cs.transform) && +cs.transform.match(/matrix\(1, 0, 0, 1, 0, ([\d.-]+)/)[1] > 20)); }).length;
    // small tap targets
    out.smallTargets = [...document.querySelectorAll('a,button')].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && (r.width < 24 || r.height < 24); }).slice(0, 8).map((el) => el.tagName.toLowerCase() + '.' + [...el.classList].slice(0, 2).join('.') + ' ' + Math.round(el.getBoundingClientRect().width) + 'x' + Math.round(el.getBoundingClientRect().height) + ' "' + (el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 20) + '"');
    // overlapping siblings among hero direct children
    out.title = document.title; out.h1 = [...document.querySelectorAll('h1')].map((h) => (h.textContent || '').trim().slice(0, 60));
    out.imgsBroken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map((i) => i.getAttribute('src')).slice(0, 6);
    return out;
  });
  report.errors = errors.slice(0, 5);
  findings.push({ name, ...report });
  await page.close();
  console.log(name, JSON.stringify({ sw: report.scrollWidth, ov: report.overflow, hh: report.hiddenHeadings, iw: report.invisibleWords, st: report.smallTargets, img: report.imgsBroken, err: report.errors }));
}
fs.writeFileSync(`${OUT}/report.json`, JSON.stringify(findings, null, 2));
await browser.close();
