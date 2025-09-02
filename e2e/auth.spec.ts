import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('displays login form by default', async ({ page }) => {
    await expect(page.getByText('Welcome to Donezo')).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('can toggle between sign in and sign up modes', async ({ page }) => {
    // Initially shows sign in
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    
    // Click to switch to sign up
    await page.getByText('Sign up').click()
    
    await expect(page.getByLabel(/full name/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
    
    // Switch back to sign in
    await page.getByText('Sign in').click()
    
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    await expect(page.getByLabel(/full name/i)).not.toBeVisible()
  })

  test('validates required fields on sign in', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test('validates required fields on sign up', async ({ page }) => {
    await page.getByText('Sign up').click()
    await page.getByRole('button', { name: /sign up/i }).click()
    
    await expect(page.getByText(/full name is required/i)).toBeVisible()
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test('shows loading state during authentication', async ({ page }) => {
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should show loading state briefly
    await expect(page.getByText(/signing in/i)).toBeVisible()
  })

  test('toggles password visibility', async ({ page }) => {
    const passwordInput = page.getByLabel(/password/i)
    const toggleButton = page.getByRole('button', { name: /toggle password visibility/i })
    
    // Initially password is hidden
    await expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Click to show password
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Click to hide password again
    await toggleButton.click()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('toggles theme correctly', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /toggle theme/i })
    
    // Check initial theme
    const initialTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    
    // Toggle theme
    await themeToggle.click()
    
    const newTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    expect(newTheme).not.toBe(initialTheme)
  })

  test('handles authentication errors gracefully', async ({ page }) => {
    // Mock network error or invalid credentials
    await page.route('**/auth/v1/token*', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: { message: 'Invalid credentials' } })
      })
    })

    await page.getByLabel(/email/i).fill('invalid@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    
    await page.getByRole('button', { name: /sign in/i }).click()
    
    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
  })
})
