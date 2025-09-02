import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '../../test/test-utils'
import { Auth } from '../Auth'
import { mockSupabase } from '../../test/test-utils'

// Mock props for Auth component (removed unused mockProps)

describe('Auth Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form by default', () => {
    const mockToggleMode = vi.fn()
    render(<Auth mode="signin" onToggleMode={mockToggleMode} />)
    
    expect(screen.getByText('Welcome to Donezo')).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('toggles between sign in and sign up modes', async () => {
    const mockToggleMode = vi.fn()
    render(<Auth mode="signin" onToggleMode={mockToggleMode} />)
    
    // Initially shows sign in
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    
    // Click to switch to sign up
    fireEvent.click(screen.getByText(/sign up/i))
    
    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
    })
  })

  it('validates required fields', async () => {
    const mockToggleMode = vi.fn()
    render(<Auth mode="signin" onToggleMode={mockToggleMode} />)
    
    const signInButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(signInButton)
    
    // Should show validation errors for empty fields
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('calls signInWithPassword on form submission', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'test-id' } },
      error: null
    })

    const mockToggleMode = vi.fn()
    render(<Auth mode="signin" onToggleMode={mockToggleMode} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      })
    })
  })

  it('displays error messages on authentication failure', async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: { message: 'Invalid credentials' }
    })

    const mockToggleMode = vi.fn()
    render(<Auth mode="signin" onToggleMode={mockToggleMode} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('shows loading state during authentication', async () => {
    mockSupabase.auth.signInWithPassword.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    )

    const mockToggleMode = vi.fn()
    render(<Auth mode="signin" onToggleMode={mockToggleMode} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    expect(screen.getByText(/signing in/i)).toBeInTheDocument()
  })
})
