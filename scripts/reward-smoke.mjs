import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const out = '/tmp/grizzy-fun'
mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1024, height: 768 } })
page.on('pageerror', (e) => console.error('PAGEERROR', e.message))

await page.goto('http://127.0.0.1:5173/#/', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Mission du jour' }).click()
await page.getByRole('button', { name: 'C’est parti' }).click()

async function solveCount() {
  await page.waitForTimeout(300)
  const lemmings = page.locator('img[alt="Lemming"]')
  const n = await lemmings.count()
  if (n === 0) return false
  for (let i = 0; i < n; i++) await lemmings.nth(i).click()
  await page.getByRole('button', { name: 'C’est bon' }).click()
  await page.waitForTimeout(400)
  await page.getByRole('button', { name: 'La suite' }).click()
  return true
}

if (!(await solveCount())) throw new Error('ex1 not count')
if (!(await solveCount())) throw new Error('ex2 not count')
if (!(await solveCount())) throw new Error('ex3 not count')

await page.waitForTimeout(1200)
await page.screenshot({ path: `${out}/reward.png` })
const reward = await page.getByText('Récompense !').isVisible()
const video = await page.locator('video').count()
console.log({ reward, video })
if (!reward || video < 1) throw new Error('reward video overlay missing')
await page.getByRole('button', { name: 'Continuer' }).click({ timeout: 3000 }).catch(() => {})
await page.waitForTimeout(400)
await page.screenshot({ path: `${out}/after-reward.png` })
await browser.close()
console.log('REWARD_OK')
