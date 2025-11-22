const { describe, test, expect, beforeEach } = require('@playwright/test')
const { createPost, loginWith, likePost, clickView } = require('./helper')

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
    await request.post('/api/users', {
      data: {
        username: 'kacer',
        name: 'Robert Kacer',
        password: 'kacka'
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
      await loginWith(page, 'yelino', 'heslo123')

      await expect(page.getByText('Filip Madunicky logged in')).toBeVisible()
      await expect(page.getByRole('button', {name: 'logout'})).toBeVisible()
      await expect(page.locator('.notification.ok')).toContainText('user successfuly logged in')
    })

    test('fails with wrong credentials', async ({page}) => {
      await loginWith(page, 'yelino', 'wrong')

      await expect(page.locator('.notification.error')).toContainText('invalid username or password')
    })
  })

  describe('when logged in', () => {
    beforeEach(async ({page}) => {
      await loginWith(page, 'yelino', 'heslo123')
    })

    test('user can create blog', async ({page}) => {
      await createPost(page, 'Test Post', 'test-url')

      await expect(page.locator('.notification.ok')).toContainText('a new blog Test Post by Filip Madunicky added')
      await expect(page.locator('.post')).toContainText('Test Post')
    })

    describe('there are some blogs', () => {
      beforeEach(async ({page}) => {
        await createPost(page, 'First Post', 'first-url')
        await createPost(page, 'Second Post', 'second-url')
        await createPost(page, 'Third Post', 'third-url')
        await createPost(page, 'Fourth Post', 'fourth-url')
      })
      
      test('one of these can be liked', async ({page}) => {
        const likeDiv = await likePost(page, 'Second Post', 1)

        await clickView(page, 'Second Post')

        await expect(likeDiv.getByText('likes 1')).toBeVisible()
      })

      test('author of the blog can remove it and confirm dialog', async ({page}) => {
        page.on('dialog', async (dialog) => {
          expect(dialog.type()).toContain('confirm')
          expect(dialog.message()).toContain('Remove blog Second Post by Filip Madunicky')
          await dialog.accept()
        })

        const secondPost = page.getByText('Second Post')
        const postLocator = secondPost.locator('..')

        await postLocator.getByRole('button', {name: 'view'}).click()
        await postLocator.getByRole('button', {name: 'remove'}).click()

        await expect(postLocator.filter({hasText: 'Second Post'})).not.toBeVisible()
      })

      test('author of the blog can remove it and dismiss dialog', async ({page}) => {
        page.on('dialog', async (dialog) => {
          expect(dialog.type()).toContain('confirm')
          expect(dialog.message()).toContain('Remove blog Second Post by Filip Madunicky')
          await dialog.dismiss()
        })

        const secondPost = page.getByText('Second Post')
        const postLocator = secondPost.locator('..')

        await postLocator.getByRole('button', {name: 'view'}).click()
        await postLocator.getByRole('button', {name: 'remove'}).click()

        await expect(postLocator.filter({hasText: 'Second Post'})).toBeVisible()
      })

      test('unauthorized user can not see remove button', async ({page}) => {
        await page.getByRole('button', {name: 'logout'}).click()

        const secondPost = page.getByText('Second Post')
        const postLocator = secondPost.locator('..')

        await postLocator.getByRole('button', {name: 'view'}).click()

        await expect(postLocator.getByRole('button', {name: 'remove'})).not.toBeVisible()
      })

      test('blogs are sorted based likes', async ({page}) => {
        // await page.pause()
        await likePost(page, 'First Post', 1)
        await likePost(page, 'Second Post', 2)
        await likePost(page, 'Third Post', 3)
        await likePost(page, 'Fourth Post', 4)

        const posts = page.locator('.post > span')
        const expectedPostsOrder = ['Fourth Post', 'Third Post', 'Second Post', 'First Post']
        expect(posts).toHaveText(expectedPostsOrder)
      })
    })
  })
})