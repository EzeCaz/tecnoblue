import puppeteer from 'puppeteer-core'; import fs from 'node:fs'; import path from 'node:path';
const dir = process.argv[2]; const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpeg')).sort();
const cells = files.map((f, i) => `<div style="position:relative"><img src="data:image/jpeg;base64,${fs.readFileSync(path.join(dir, f)).toString('base64')}" style="width:280px;display:block"><span style="position:absolute;left:4px;top:4px;background:#000c;color:#fff;font:bold 14px sans-serif;padding:2px 6px;border-radius:4px">${i}s · f${i*30}</span></div>`).join('');
const html = `<body style="margin:0;background:#fff"><div style="display:grid;grid-template-columns:repeat(4,280px);gap:6px;padding:6px">${cells}</div></body>`;
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage(); await p.setViewport({ width: 1160, height: 900 }); await p.setContent(html); await p.screenshot({ path: process.argv[3], fullPage: true }); await b.close();
