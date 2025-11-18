const { describe, test, expect, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({page, request}) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'yelino',
        name: 'Filip Madunicky',
        password: 'heslo123'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({page}) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', {name: 'login'})).toBeVisible()
  })

  
  describe('Login', () => {
    test('user can login successfuly', async ({page}) => {
      await page.getByLabel('username').fill('yelino')
      await page.getByLabel('password').fill('heslo123')
      await page.getByRole('button', {name: 'login'}).click()

      await expect(page.getByText('Filip Madunicky logged in')).toBeVisible()
      await expect(page.getByRole('button', {name: 'logout'})).toBeVisible()
      await expect(page.locator('.notification.ok')).toContainText('user successfuly logged in')
    })

    test('fails with wrong credentials', async ({page}) => {
      await page.getByLabel('username').fill('yelino')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', {name: 'login'}).click()

      await expect(page.locator('.notification.error')).toContainText('invalid username or password')
    })
  })
})