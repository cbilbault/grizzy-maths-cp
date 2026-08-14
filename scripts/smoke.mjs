import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const out = '/tmp/grizzy-smoke'
mkdirSync(out, { recursive: true })

const browser = await chromium.launch({ headless: true })

async function shot(page, name) {
  await page.screenshot({ path: `${out}/${name}.png`, fullPage: true })
  console.log('shot', name)
}

async function run(label, size) {
  const page = await browser.newPage({ viewport: size })
  page.on('pageerror', (e) => console.error('PAGEERROR', label, e.message))
  page.on('console', (m) => {
    if (m.type() === 'error') console.error('CONSOLE', label, m.text())
  })

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await shot(page, `${label}-home`)

  const title = await page.title()
  const mission = page.getByRole('button', { name: 'Mission du jour' })
  if (!(await mission.isVisible())) throw new Error('Mission button missing')
  await mission.click()
  await page.waitForTimeout(400)
  await shot(page, `${label}-intro`)
  const start = page.getByRole('button', { name: 'C’est parti' })
  if (!(await start.isVisible())) throw new Error('Start missing')
  await start.click()
  await page.waitForTimeout(500)
  await shot(page, `${label}-exercise`)
  const lemmings = page.locator('img[alt="Lemming"]')
  const n = await lemmings.count()
  if (n > 0) {
    for (let i = 0; i < n; i++) await lemmings.nth(i).click()
    await page.getByRole('button', { name: 'C’est bon' }).click()
    await page.waitForTimeout(400)
    await shot(page, `${label}-feedback`)
    const next = page.getByRole('button', { name: 'La suite' })
    if (await next.isVisible()) await next.click()
    await page.waitForTimeout(400)
    await shot(page, `${label}-ex2`)
  }

  await page.goto('http://127.0.0.1:5173/rituel', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  await shot(page, `${label}-rituel`)

  await page.goto('http://127.0.0.1:5173/libre', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  await shot(page, `${label}-libre`)

  await page.goto('http://127.0.0.1:5173/parents', { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)
  await shot(page, `${label}-parents`)
  const disclaimer = await page.getByText('non officiel').isVisible()
  if (!disclaimer) throw new Error('Parent disclaimer missing')

  console.log('ok', label, title)
  await page.close()
}

await run('tablet', { width: 1024, height: 768 })
await run('phone', { width: 390, height: 844 })
await browser.close()
console.log('SMOKE_OK')
