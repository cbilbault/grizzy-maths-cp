import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const out = '/tmp/grizzy-fun'
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1024, height: 768 } })
page.on('pageerror', (e) => console.error('PAGEERROR', e.message))

await page.goto('http://127.0.0.1:5173/#/', { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.screenshot({ path: `${out}/home.png` })

const vid = await page.evaluate(async () => {
  const url = `${location.origin}${location.pathname}assets/rewards/sofa.mp4`.replace(/\/#.*$/, '/').replace(/\/$/, '') 
  // vite public files are at /assets/rewards
  const r = await fetch('/assets/rewards/sofa.mp4', { method: 'HEAD' })
  return { status: r.status, type: r.headers.get('content-type') }
})
console.log('video', vid)
if (vid.status !== 200) throw new Error('reward video missing')

await page.getByRole('button', { name: 'Mission du jour' }).click()
await page.waitForTimeout(400)
await page.getByRole('button', { name: 'C’est parti' }).click()
await page.waitForTimeout(500)
const lemmings = page.locator('img[alt="Lemming"]')
const n = await lemmings.count()
for (let i = 0; i < n; i++) await lemmings.nth(i).click()
await page.getByRole('button', { name: 'C’est bon' }).click()
await page.waitForTimeout(700)
await page.screenshot({ path: `${out}/bravo.png` })
const bravo = await page.getByText('Bravo !').isVisible()
if (!bravo) throw new Error('bravo missing')

await browser.close()
console.log('FUN_OK')
