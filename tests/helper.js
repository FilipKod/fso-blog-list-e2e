const loginWith = async (page, username, password) => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', {name: 'login'}).click()
  
  await page.getByRole('button', { name: 'create new blog' }).waitFor()
}

const createPost = async (page, title, url) => {
  await page.getByRole('button', {name: 'create new blog'}).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', {name: 'create'}).click()
  await page.locator('.post', { hasText: title }).waitFor()
}

const likePost = async (page, postTitle, numberOfLikes) => {
  let likeDiv = null
  for (let i = 1; i <= numberOfLikes; i++) {
    const post = page.getByText(postTitle)
    const locator = post.locator('..')
    await locator.getByRole('button', {name: 'view'}).click()
    likeDiv = locator.getByText('likes').locator('..')
    await likeDiv.getByRole('button', {name: 'like'}).click()
    await likeDiv.filter({hasText: `likes ${i}`}).waitFor()
    await locator.getByRole('button', {name: 'hide'}).click()
  }
  return likeDiv
  
}

const clickView = async (page, postTitle) => {
  await page.getByText(postTitle).locator('..').getByRole('button', {name: 'view'}).click()
}

export { loginWith, createPost, likePost, clickView }