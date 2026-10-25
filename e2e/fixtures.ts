import { test as base, expect, type Page } from '@playwright/test'

type ScenarioId =
  | 'default'
  | 'empty'
  | 'slow'
  | 'out-of-order'
  | 'offline'
  | 'server-error'
  | 'session-expired'
  | 'favorite-fail'
  | 'price-change'
  | 'sold-out'
  | 'order-timeout'
  | 'payment-rejected'
  | 'wallet-rejected'

export const ALICE = { email: 'alice@kurio.dev', password: 'Kurio@123', name: 'Alice Martins' }
export const BOB = { email: 'bob@kurio.dev', password: 'Kurio@123', name: 'Bob Souza' }

/**
 * Cada teste parte de um estado isolado: storage limpo (db do mock volta ao seed)
 * e cenário definido antes de qualquer script da página rodar.
 */
export const test = base.extend<{ scenario: ScenarioId }>({
  scenario: ['default', { option: true }],
  page: async ({ page, scenario }, use) => {
    await page.addInitScript((id) => {
      if (!sessionStorage.getItem('kurio:e2e-init')) {
        localStorage.clear()
        sessionStorage.setItem('kurio:e2e-init', '1')
      }
      localStorage.setItem('kurio:scenario', id)
    }, scenario)
    await use(page)
  },
})

export { expect }

export async function waitForMocks(page: Page) {
  await page.waitForFunction(() => Boolean(window.__kurioMock))
}

/** Login pela UI real. */
export async function login(page: Page, user = ALICE) {
  await page.goto('/login')
  await page.getByLabel('E-mail').fill(user.email)
  await page.getByLabel('Senha', { exact: true }).fill(user.password)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
}
