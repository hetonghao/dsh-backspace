import assert from 'node:assert/strict'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { chromiumArgs, findChromeForTesting, serveDirectory, waitForOcean, watchPageErrors } from './browser-support.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const server = await serveDirectory(root)
const browser = await chromium.launch({
  executablePath: await findChromeForTesting(chromium.executablePath()),
  headless: process.env.BACKSPACE_HEADLESS === '1', args: chromiumArgs(),
})

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const failures = watchPageErrors(page, 'official desktop')
  await page.route('**/dsh-backspace/**', async route => {
    const url = new URL(route.request().url())
    const response = await route.fetch({ url: `${server.url}/extension/${url.pathname.split('/dsh-backspace/')[1]}${url.search}` })
    await route.fulfill({ response })
  })
  await page.goto(`${server.url}/tests/fixtures/official-desktop/index.html`)
  await page.evaluate(() => {
    localStorage.setItem('bsAutoCycle', 'false')
    localStorage.setItem('bsGlass', '40')
    window.__ModuleLoader__ = { load({ factory }) {
      const plugin = factory(() => {})
      plugin.apply({ effect(fn) { window.stopBackspace = fn() } })
    } }
  })
  await page.addScriptTag({ path: resolve(root, 'plugin/client.js') })
  await waitForOcean(page)

  for (const platform of ['darwin', 'windows']) {
    for (const dark of [true, false]) {
      await page.evaluate(({ platform, dark }) => {
        document.documentElement.toggleAttribute('data-windows-titlebar', platform === 'windows')
        if (platform === 'darwin') document.documentElement.dataset.platform = 'darwin'
        else delete document.documentElement.dataset.platform
        document.body.toggleAttribute('data-ds-dark-theme', dark)
        document.querySelector('.settings').classList.add('open')
      }, { platform, dark })
      const paints = await page.evaluate(() => {
        const alpha = selector => {
          const values = getComputedStyle(document.querySelector(selector)).backgroundColor.match(/[\d.]+/g).map(Number)
          return values.length === 4 ? values[3] : 1
        }
        const effective = selector => {
          let result = 0
          for (let node = document.querySelector(selector); node && node !== document.body; node = node.parentElement) {
            const values = getComputedStyle(node).backgroundColor.match(/[\d.]+/g).map(Number)
            const value = values.length === 4 ? values[3] : 1
            result = 1 - (1 - result) * (1 - value)
          }
          return result
        }
        return {
          columns: ['.sidebar', '.conversation', '[data-dockkit-content]'].map(effective),
          composer: alpha('.composer'),
          settings: alpha('[data-shortcut-modal="settings"]'),
        }
      })
      const expected = .4
      for (const value of paints.columns) assert.ok(Math.abs(value - expected) < .005,
        `${platform}/${dark ? 'dark' : 'light'}: columns ${JSON.stringify(paints.columns)} expected ${expected}`)
      assert.ok(paints.composer >= .4, 'composer retains its own surface')
      assert.ok(paints.settings >= .96, 'settings stays legible over the ocean')
    }
  }
  await page.evaluate(() => window.stopBackspace())
  assert.equal(await page.locator('#__dsh-backspace-glass__').count(), 0)
  assert.deepEqual(failures, [])
  console.log('✓ Official Desktop 0.2.x shell: unified columns and readable settings in macOS/Windows light/dark modes')

  // Native conversation: the center column must fall back to Harness's own
  // palette while the sidebar keeps the ocean-backed glass.
  const box = page.locator('#__dsh-backspace-panel__-native')
  await page.addScriptTag({ path: resolve(root, 'plugin/client.js') })
  await waitForOcean(page)
  await page.locator('#__dsh-backspace-btn__').click()
  await box.check()
  for (const dark of [true, false]) {
    await page.evaluate((dark) => { document.body.toggleAttribute('data-ds-dark-theme', dark) }, dark)
    const paints = await page.evaluate(() => {
      const column = document.querySelector('div:has(> [data-shell-overlay]) > :nth-child(2)')
      const style = getComputedStyle(column)
      const sidebar = (() => {
        let total = 0
        for (let node = document.querySelector('.sidebar'); node && node !== document.body; node = node.parentElement) {
          const values = getComputedStyle(node).backgroundColor.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0, 1]
          const value = values.length === 4 ? values[3] : 1
          total = 1 - (1 - total) * (1 - value)
        }
        return total
      })()
      return { background: style.backgroundColor, token: style.getPropertyValue('--dsw-alias-bg-base').trim(), sidebar }
    })
    assert.ok(!paints.background.startsWith('rgba(0, 0, 0, 0)'), `native column stays opaque: ${JSON.stringify(paints)}`)
    assert.ok(paints.token === '#151517' || paints.token === '#fff', `native column uses the static palette: ${JSON.stringify(paints)}`)
    assert.ok(Math.abs(paints.sidebar - .4) < .02, `sidebar keeps glass: ${JSON.stringify(paints)}`)
  }
  console.log('✓ Native conversation keeps Harness colors in the center while sidebar/details stay glass')
} finally {
  await browser.close()
  await server.close()
}
