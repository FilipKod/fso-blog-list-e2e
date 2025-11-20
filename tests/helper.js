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

export { loginWith, createPost }