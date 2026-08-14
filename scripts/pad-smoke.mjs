import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const out = '/tmp/grizzy-pad'
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ headless: true })

async function run(label, size) {
  const page = await browser.newPage({ viewport: size })
  page.on('pageerror', (e) => console.error('PAGEERROR', e.message))
  await page.goto('http://127.0.0.1:5173/#/rituel', { waitUntil: 'networkidle' })
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: 'C’est parti' }).click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${out}/${label}-pad.png`, fullPage: true })
  const keys = page.locator('.numpad-key')
  const n = await keys.count()
  const box = await keys.first().boundingBox()
  console.log(label, 'keys', n, 'first', box)
  if (n !== 12) throw new Error('expected 12 keys')
  const minH = size.height < 500 ? 44 : 64
  if (!box || box.height < minH || box.width < 64) {
    throw new Error(`${label} key too small: ${JSON.stringify(box)}`)
  }
  const last = await keys.last().boundingBox()
  const vh = size.height
  if (!last || last.y + last.height > vh - 4) {
    throw new Error(`${label} last key clipped: ${JSON.stringify(last)} vh=${vh}`)
  }
  await page.getByRole('button', { name: '4' }).click()
  await page.getByRole('button', { name: '2' }).click()
  await page.screenshot({ path: `${out}/${label}-typed.png`, fullPage: true })
  await page.close()
}

await run('tablet', { width: 1024, height: 768 })
await run('phone', { width: 390, height: 844 })
await run('phone-land', { width: 844, height: 390 })
await browser.close()
console.log('PAD_OK')
