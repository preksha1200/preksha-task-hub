import { test, expect } from '@playwright/test'

const VIEWPORT_WIDTHS = [375, 412, 768, 1280] // Mobile, Large Mobile, Tablet, Desktop

test.describe('Responsive Design Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
    
    // Sign in with test user
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'testpassword123')
    await page.click('button[type="submit"]')
    
    // Wait for app to load
    await page.waitForSelector('.app', { timeout: 10000 })
  })

  VIEWPORT_WIDTHS.forEach(width => {
    test(`No horizontal scrolling at ${width}px width`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      
      // Check for horizontal scrollbar
      const bodyScrollWidth = await page.evaluate(() => document.body.scrollWidth)
      const bodyClientWidth = await page.evaluate(() => document.body.clientWidth)
      
      expect(bodyScrollWidth).toBeLessThanOrEqual(bodyClientWidth + 1) // Allow 1px tolerance
    })

    test(`Touch targets meet 44x44px requirement at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      
      // Check action buttons
      const actionButtons = page.locator('.action-btn')
      const count = await actionButtons.count()
      
      for (let i = 0; i < count; i++) {
        const button = actionButtons.nth(i)
        const box = await button.boundingBox()
        
        if (box && width <= 768) { // Mobile and tablet
          expect(box.width).toBeGreaterThanOrEqual(44)
          expect(box.height).toBeGreaterThanOrEqual(44)
        }
      }
    })

    test(`Text content doesn't overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      
      // Add a task with long text
      await page.fill('.task-input', 'This is a very long task title that should wrap properly and not cause horizontal scrolling or overflow issues in the responsive design')
      await page.click('.add-task-btn')
      
      // Check task text doesn't overflow
      const taskItems = page.locator('.task-item')
      const count = await taskItems.count()
      
      for (let i = 0; i < count; i++) {
        const task = taskItems.nth(i)
        const taskBox = await task.boundingBox()
        const containerBox = await page.locator('.main-content').boundingBox()
        
        if (taskBox && containerBox) {
          expect(taskBox.width).toBeLessThanOrEqual(containerBox.width)
        }
      }
    })
  })

  test('Mobile sidebar functionality', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    
    // Sidebar should be hidden on mobile initially
    const sidebar = page.locator('.sidebar')
    await expect(sidebar).not.toHaveClass(/open/)
    
    // Hamburger menu should be visible
    const hamburgerBtn = page.locator('.hamburger-btn')
    await expect(hamburgerBtn).toBeVisible()
    
    // Click hamburger to open sidebar
    await hamburgerBtn.click()
    await expect(sidebar).toHaveClass(/open/)
    
    // Scrim should be visible
    const scrim = page.locator('.sidebar-scrim')
    await expect(scrim).toHaveClass(/open/)
    
    // Click scrim to close sidebar
    await scrim.click()
    await expect(sidebar).not.toHaveClass(/open/)
    await expect(scrim).not.toHaveClass(/open/)
  })

  test('Sticky input bar on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    
    // Add multiple tasks to create scrollable content
    for (let i = 1; i <= 10; i++) {
      await page.fill('.task-input', `Task ${i}`)
      await page.click('.add-task-btn')
    }
    
    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500))
    
    // Input section should remain visible (sticky)
    const inputSection = page.locator('.input-section.sticky')
    await expect(inputSection).toBeVisible()
    
    // Input should still be functional
    await page.fill('.task-input', 'Sticky test task')
    await page.click('.add-task-btn')
    
    // New task should be added
    await expect(page.locator('.task-item').last()).toContainText('Sticky test task')
  })

  test('Theme toggle works on all screen sizes', async ({ page }) => {
    for (const width of VIEWPORT_WIDTHS) {
      await page.setViewportSize({ width, height: 800 })
      
      // Find theme toggle button
      const themeToggle = page.locator('.theme-toggle')
      await expect(themeToggle).toBeVisible()
      
      // Toggle theme
      await themeToggle.click()
      
      // Check if dark class is applied
      const html = page.locator('html')
      await expect(html).toHaveClass(/dark/)
      
      // Toggle back
      await themeToggle.click()
      await expect(html).not.toHaveClass(/dark/)
    }
  })

  test('Fluid typography scales appropriately', async ({ page }) => {
    // Test at smallest viewport
    await page.setViewportSize({ width: 375, height: 800 })
    const smallFontSize = await page.locator('h1').first().evaluate(el => 
      window.getComputedStyle(el).fontSize
    )
    
    // Test at largest viewport
    await page.setViewportSize({ width: 1280, height: 800 })
    const largeFontSize = await page.locator('h1').first().evaluate(el => 
      window.getComputedStyle(el).fontSize
    )
    
    // Font size should be larger on bigger screens
    const smallSize = parseFloat(smallFontSize)
    const largeSize = parseFloat(largeFontSize)
    expect(largeSize).toBeGreaterThan(smallSize)
  })

  test('Safe area insets work on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    
    // Check if safe area insets are applied
    const app = page.locator('.app')
    const paddingTop = await app.evaluate(el => 
      window.getComputedStyle(el).paddingTop
    )
    
    // Should have some padding for safe area
    expect(paddingTop).not.toBe('0px')
  })

  test('Reduced motion preference respected', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.setViewportSize({ width: 375, height: 800 })
    
    // Add a task to trigger animations
    await page.fill('.task-input', 'Animation test task')
    await page.click('.add-task-btn')
    
    // Check that animations are reduced/disabled
    const taskItem = page.locator('.task-item').last()
    const animationDuration = await taskItem.evaluate(el => 
      window.getComputedStyle(el).animationDuration
    )
    
    // Animation should be instant or very short with reduced motion
    expect(animationDuration === '0s' || animationDuration === '0.01s').toBeTruthy()
  })

  test('Task management works on all screen sizes', async ({ page }) => {
    for (const width of VIEWPORT_WIDTHS) {
      await page.setViewportSize({ width, height: 800 })
      
      // Add task
      await page.fill('.task-input', `Responsive task ${width}px`)
      await page.click('.add-task-btn')
      
      // Task should be visible
      await expect(page.locator('.task-item').last()).toContainText(`Responsive task ${width}px`)
      
      // Complete task
      await page.locator('.task-item').last().locator('.task-checkbox').click()
      
      // Task should be marked complete
      await expect(page.locator('.task-item').last()).toHaveClass(/completed/)
      
      // Delete task (hover to show delete button on desktop, direct click on mobile)
      if (width <= 768) {
        await page.locator('.task-item').last().locator('.delete-btn').click()
      } else {
        await page.locator('.task-item').last().hover()
        await page.locator('.task-item').last().locator('.delete-btn').click()
      }
      
      // Confirm deletion
      await page.click('button:has-text("Delete")')
      
      // Task should be removed
      await expect(page.locator('.task-item')).not.toContainText(`Responsive task ${width}px`)
    }
  })

  test('Priority and notes work responsively', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    
    // Add task with priority
    await page.fill('.task-input', 'Priority task')
    await page.selectOption('.priority-select', 'High')
    
    // Toggle notes
    await page.click('.notes-toggle')
    await page.fill('.notes-input', 'Important notes for this task')
    
    await page.click('.add-task-btn')
    
    // Task should show priority and notes
    const taskItem = page.locator('.task-item').last()
    await expect(taskItem).toContainText('Priority task')
    await expect(taskItem).toHaveClass(/priority-high/)
    
    // Notes should be expandable
    await taskItem.click()
    await expect(taskItem).toContainText('Important notes for this task')
  })

  test('Export functionality works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    
    // Open sidebar
    await page.click('.hamburger-btn')
    
    // Click export button
    const downloadPromise = page.waitForEvent('download')
    await page.click('button:has-text("Export tasks")')
    const download = await downloadPromise
    
    // Verify download
    expect(download.suggestedFilename()).toMatch(/tasks-\d{4}-\d{2}-\d{2}\.json/)
  })
})

test.describe('Authentication Responsive Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  VIEWPORT_WIDTHS.forEach(width => {
    test(`Authentication form responsive at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 })
      
      // Auth card should be properly sized
      const authCard = page.locator('.auth-card')
      await expect(authCard).toBeVisible()
      
      const cardBox = await authCard.boundingBox()
      expect(cardBox?.width).toBeLessThanOrEqual(width - 32) // Account for padding
      
      // Form inputs should be properly sized
      const emailInput = page.locator('input[type="email"]')
      const inputBox = await emailInput.boundingBox()
      expect(inputBox?.width).toBeGreaterThan(200) // Minimum usable width
      
      // Theme toggle should be visible
      const themeToggle = page.locator('.auth-theme-toggle')
      await expect(themeToggle).toBeVisible()
    })
  })

  test('Authentication theme toggle works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    
    // Toggle theme
    await page.click('.auth-theme-toggle')
    
    // Check dark mode applied
    const html = page.locator('html')
    await expect(html).toHaveClass(/dark/)
    
    // Auth card should have dark styling
    const authCard = page.locator('.auth-card')
    const bgColor = await authCard.evaluate(el => 
      window.getComputedStyle(el).backgroundColor
    )
    
    // Should be a dark color (not white/light)
    expect(bgColor).not.toBe('rgb(255, 255, 255)')
  })
})
