import { chromium } from '/tmp/claude-1000/-home-phuong-Documents-Game-Demo/7d796cd7-cd23-4aab-9048-a2de74e5ae83/scratchpad/e2e/node_modules/playwright-core/index.mjs';
import { writeFileSync } from 'node:fs';
const names = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const out = {};
for (const name of names) {
  const page = await browser.newPage({
    viewport: { width: 1600, height: 1600 },
    deviceScaleFactor: 1,
  });
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  page.on('console', (m) => m.type() === 'error' && console.log('CONSOLE', m.text()));
  await page.goto('http://localhost:8765/index.html');
  await page.waitForFunction(() => window.READY);
  const r = await page.evaluate((n) => window.SCENES[n](), name);
  writeFileSync(
    new URL(`./out/${name}.png`, import.meta.url),
    Buffer.from(r.png.split(',')[1], 'base64'),
  );
  if (r.info) out[name] = r.info;
  await page.close();
}
console.log(JSON.stringify(out, null, 1));
await browser.close();
