import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import { TaskApp } from '../TaskApp'
import { mockSupabase, mockTasks } from '../../test/test-utils'

describe('TaskApp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    // Mock successful task loading
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: mockTasks,
        error: null
      })
    })
  })

  it('renders the main task interface', async () => {
    render(<TaskApp />)
    
    await waitFor(() => {
      expect(screen.getByText('Donezo')).toBeInTheDocument()
      expect(screen.getByText(/what would you like to accomplish today/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/add a new task/i)).toBeInTheDocument()
    })
  })

  it('displays tasks from the database', async () => {
    render(<TaskApp />)
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    })
  })

  it('shows correct task counts', async () => {
    render(<TaskApp />)
    
    await waitFor(() => {
      expect(screen.getByText('2 tasks')).toBeInTheDocument()
      expect(screen.getByText('1 completed')).toBeInTheDocument()
    })
  })

  it('calculates progress percentage correctly', async () => {
    render(<TaskApp />)
    
    await waitFor(() => {
      // 1 completed out of 2 tasks = 50%
      expect(screen.getByText('50%')).toBeInTheDocument()
    })
  })

  it('filters tasks correctly', async () => {
    render(<TaskApp />)
    
    await waitFor(() => {
      // Initially shows all tasks
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    })
    
    // Click Active filter
    fireEvent.click(screen.getByText('Active'))
    
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument()
      expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument()
    })
    
    // Click Completed filter
    fireEvent.click(screen.getByText('Completed'))
    
    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument()
      expect(screen.getByText('Test Task 2')).toBeInTheDocument()
    })
  })

  it('adds new task when form is submitted', async () => {
    const mockInsert = vi.fn().mockResolvedValue({
      data: [{ id: 'new-task', title: 'New Task' }],
      error: null
    })
    
    mockSupabase.from.mockReturnValue({
      insert: mockInsert,
      select: vi.fn().mockReturnThis(),
    })

    render(<TaskApp />)
    
    const input = screen.getByPlaceholderText(/add a new task/i)
    fireEvent.change(input, { target: { value: 'New Task' } })
    fireEvent.keyDown(input, { key: 'Enter' })
    
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'New Task',
          is_completed: false,
          priority: 'Medium'
        })
      )
    })
  })

  it('toggles theme correctly', async () => {
    render(<TaskApp />)
    
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i })
    fireEvent.click(themeToggle)
    
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('shows loading state initially', () => {
    // Mock loading state
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      )
    })

    render(<TaskApp />)
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('handles database errors gracefully', async () => {
    mockSupabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' }
      })
    })

    render(<TaskApp />)
    
    await waitFor(() => {
      expect(screen.getByText(/error loading tasks/i)).toBeInTheDocument()
    })
  })
})
