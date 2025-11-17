const { describe, test, expect, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({page}) => {
    await page.goto('/')
  })

  test('Login form is shown', async ({page}) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', {name: 'login'})).toBeVisible()
  })
})