import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, Moon, Sun } from 'lucide-react'

interface AuthProps {
  mode: 'signin' | 'signup'
  onToggleMode: () => void
}

export const Auth = ({ mode, onToggleMode }: AuthProps) => {
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('preksha_theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('preksha_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('preksha_theme', 'light')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName)
        if (error) throw error
      } else {
        const { error } = await signIn(email, password)
        if (error) throw error
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="auth-theme-toggle"
      >
        {isDarkMode ? (
          <Sun size={20} />
        ) : (
          <Moon size={20} />
        )}
      </button>

      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">
            <svg className="auth-logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9,11 12,14 22,4"></polyline>
              <path d="m21,3-1.5,1.5L7,17l-4.5-4.5L4,11l3,3L21,3z"></path>
            </svg>
          </div>
          <h1 className="auth-title">
            Welcome to Donezo
          </h1>
          <p className="auth-subtitle">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="auth-error">
            <p className="auth-error-text">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <div className="auth-field">
              <label htmlFor="fullName" className="auth-label">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="auth-input"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="auth-input"
              placeholder="Enter your email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <div className="auth-password-field">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {mode === 'signin' && (
            <div className="auth-options">
              <label className="auth-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="auth-checkbox-text">Remember me</span>
              </label>
              <button type="button" className="auth-forgot-link">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-submit-btn"
          >
            {loading ? (
              <div className="auth-spinner"></div>
            ) : (
              mode === 'signin' ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="auth-toggle">
          <p className="auth-toggle-text">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
            <button
              type="button"
              onClick={onToggleMode}
              className="auth-toggle-btn"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="auth-footer">
          <p className="auth-footer-text">
            A minimal, focused task management experience designed for productivity.
          </p>
        </div>
      </div>
    </div>
  )
}
