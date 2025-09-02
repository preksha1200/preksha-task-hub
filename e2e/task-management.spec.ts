import { test, expect } from '@playwright/test'

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock successful authentication
    await page.route('**/auth/v1/token*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-token',
          user: { id: 'test-user', email: 'test@example.com' }
        })
      })
    })

    // Mock task data
    await page.route('**/rest/v1/tasks*', route => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: '1',
              title: 'Test Task 1',
              notes: 'Test notes',
              is_completed: false,
              priority: 'High',
              created_at: '2024-01-01T00:00:00Z'
            },
            {
              id: '2',
              title: 'Completed Task',
              notes: null,
              is_completed: true,
              priority: 'Medium',
              created_at: '2024-01-01T00:00:00Z'
            }
          ])
        })
      } else {
        route.fulfill({ status: 200, body: '{}' })
      }
    })

    await page.goto('/')
    
    // Sign in to access task management
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Wait for task interface to load
    await expect(page.getByText('Donezo')).toBeVisible()
  })

  test('displays task management interface', async ({ page }) => {
    await expect(page.getByText('Donezo')).toBeVisible()
    await expect(page.getByText(/what would you like to accomplish today/i)).toBeVisible()
    await expect(page.getByPlaceholder(/add a new task/i)).toBeVisible()
    await expect(page.getByText('Test Task 1')).toBeVisible()
  })

  test('shows correct task statistics', async ({ page }) => {
    await expect(page.getByText('2 tasks')).toBeVisible()
    await expect(page.getByText('1 completed')).toBeVisible()
    await expect(page.getByText('50%')).toBeVisible() // 1 of 2 completed
  })

  test('can add new task', async ({ page }) => {
    const taskInput = page.getByPlaceholder(/add a new task/i)
    
    await taskInput.fill('New Test Task')
    await taskInput.press('Enter')
    
    // Should clear input after adding
    await expect(taskInput).toHaveValue('')
  })

  test('can toggle task completion', async ({ page }) => {
    const taskCheckbox = page.getByRole('checkbox').first()
    
    await taskCheckbox.click()
    
    // Should update task appearance
    await expect(page.getByText('Test Task 1')).toHaveClass(/line-through/)
  })

  test('can filter tasks', async ({ page }) => {
    // Initially shows all tasks
    await expect(page.getByText('Test Task 1')).toBeVisible()
    await expect(page.getByText('Completed Task')).toBeVisible()
    
    // Filter to active tasks only
    await page.getByText('Active').click()
    
    await expect(page.getByText('Test Task 1')).toBeVisible()
    await expect(page.getByText('Completed Task')).not.toBeVisible()
    
    // Filter to completed tasks only
    await page.getByText('Completed').click()
    
    await expect(page.getByText('Test Task 1')).not.toBeVisible()
    await expect(page.getByText('Completed Task')).toBeVisible()
  })

  test('can set task priority', async ({ page }) => {
    const taskInput = page.getByPlaceholder(/add a new task/i)
    const prioritySelect = page.getByRole('combobox', { name: /priority/i })
    
    await prioritySelect.selectOption('High')
    await taskInput.fill('High Priority Task')
    await taskInput.press('Enter')
    
    // Should show high priority styling
    await expect(page.getByText('High Priority Task')).toBeVisible()
  })

  test('can add additional notes to task', async ({ page }) => {
    const taskInput = page.getByPlaceholder(/add a new task/i)
    const notesToggle = page.getByRole('button', { name: /additional notes/i })
    
    await notesToggle.click()
    
    const notesTextarea = page.getByPlaceholder(/add additional notes/i)
    await expect(notesTextarea).toBeVisible()
    
    await taskInput.fill('Task with notes')
    await notesTextarea.fill('These are additional notes')
    await taskInput.press('Enter')
    
    await expect(page.getByText('Task with notes')).toBeVisible()
  })

  test('can edit existing task', async ({ page }) => {
    // Hover over task to reveal edit button
    await page.getByText('Test Task 1').hover()
    
    const editButton = page.getByRole('button', { name: /edit/i }).first()
    await editButton.click()
    
    const editInput = page.locator('input[value="Test Task 1"]')
    await editInput.fill('Updated Task Title')
    await editInput.press('Enter')
    
    await expect(page.getByText('Updated Task Title')).toBeVisible()
  })

  test('can delete task with confirmation', async ({ page }) => {
    // Hover over task to reveal delete button
    await page.getByText('Test Task 1').hover()
    
    const deleteButton = page.getByRole('button', { name: /delete/i }).first()
    await deleteButton.click()
    
    // Should show confirmation dialog
    await expect(page.getByText(/are you sure/i)).toBeVisible()
    
    await page.getByRole('button', { name: /confirm/i }).click()
    
    await expect(page.getByText('Test Task 1')).not.toBeVisible()
  })

  test('can use quick actions', async ({ page }) => {
    // View all tasks
    await page.getByText('View all tasks').click()
    
    // Toggle completed tasks visibility
    const toggleButton = page.getByText('Show completed')
    await toggleButton.click()
    
    await expect(page.getByText('Hide completed')).toBeVisible()
    
    // Export tasks
    const downloadPromise = page.waitForEvent('download')
    await page.getByText('Export tasks').click()
    const download = await downloadPromise
    
    expect(download.suggestedFilename()).toMatch(/tasks-\d{4}-\d{2}-\d{2}\.json/)
  })

  test('shows dynamic greeting based on time', async ({ page }) => {
    const greeting = page.getByText(/good (morning|afternoon|evening)/i)
    await expect(greeting).toBeVisible()
  })

  test('can toggle theme in task interface', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /toggle theme/i })
    
    await themeToggle.click()
    
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
    expect(theme).toBe('dark')
  })

  test('can sign out', async ({ page }) => {
    const signOutButton = page.getByRole('button', { name: /sign out/i })
    await signOutButton.click()
    
    // Should return to auth page
    await expect(page.getByText('Welcome to Donezo')).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
  })

  test('is responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }) // iPhone size
    
    // Should still show main interface elements
    await expect(page.getByText('Donezo')).toBeVisible()
    await expect(page.getByPlaceholder(/add a new task/i)).toBeVisible()
    await expect(page.getByText('Test Task 1')).toBeVisible()
    
    // Sidebar should be responsive
    const sidebar = page.locator('.sidebar')
    await expect(sidebar).toBeVisible()
  })
})
