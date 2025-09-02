import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Eye, EyeOff, CheckSquare, Moon, Sun } from 'lucide-react'

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
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative'
    }}>
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          padding: '0.5rem',
          borderRadius: '0.5rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease'
        }}
        className="theme-toggle"
      >
        {isDarkMode ? (
          <Sun size={20} style={{ color: '#f59e0b' }} />
        ) : (
          <Moon size={20} style={{ color: 'var(--text-secondary)' }} />
        )}
      </button>

      <div style={{ width: '100%', maxWidth: '28rem' }}>
        {/* Main Card */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '1rem',
          padding: '2rem',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3rem',
              height: '3rem',
              backgroundColor: '#6366f1',
              borderRadius: '50%',
              marginBottom: '1rem'
            }}>
              <CheckSquare size={24} style={{ color: 'white' }} />
            </div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
              margin: '0 0 0.5rem 0'
            }}>
              Donezo
            </h1>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              margin: 0
            }}>
              {mode === 'signin' ? 'Welcome back! Sign in to your account' : 'Create your account to get started'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              marginBottom: '1.5rem',
              padding: '0.75rem',
              backgroundColor: isDarkMode ? 'rgba(220, 38, 38, 0.1)' : '#fef2f2',
              border: `1px solid ${isDarkMode ? '#dc2626' : '#fecaca'}`,
              borderRadius: '0.5rem'
            }}>
              <p style={{
                color: isDarkMode ? '#fca5a5' : '#dc2626',
                fontSize: '0.875rem',
                margin: 0
              }}>{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="fullName" style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  placeholder="Enter your full name"
                  required
                  onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#6366f1'}
                  onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--border-color)'}
                />
              </div>
            )}

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
              }}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                placeholder="you@example.com"
                required
                onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#6366f1'}
                onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--border-color)'}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '500',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 3rem 0.75rem 1rem',
                    backgroundColor: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  placeholder="Enter your password"
                  required
                  onFocus={(e) => (e.target as HTMLInputElement).style.borderColor = '#6366f1'}
                  onBlur={(e) => (e.target as HTMLInputElement).style.borderColor = 'var(--border-color)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {mode === 'signin' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{
                      width: '1rem',
                      height: '1rem',
                      marginRight: '0.5rem',
                      accentColor: '#6366f1'
                    }}
                  />
                  <label htmlFor="remember-me" style={{
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)'
                  }}>
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  style={{
                    fontSize: '0.875rem',
                    color: '#6366f1',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => (e.target as HTMLButtonElement).style.textDecoration = 'underline'}
                  onMouseOut={(e) => (e.target as HTMLButtonElement).style.textDecoration = 'none'}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                backgroundColor: loading ? '#a5b4fc' : '#6366f1',
                color: 'white',
                fontWeight: '500',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => {
                if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = '#4f46e5'
              }}
              onMouseOut={(e) => {
                if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = '#6366f1'
              }}
            >
              {loading ? (
                <div style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  border: '2px solid transparent',
                  borderTop: '2px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
              ) : (
                mode === 'signin' ? 'Sign In' : 'Sign Up'
              )}
            </button>


          </form>

          {/* Toggle Mode */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p style={{
              color: 'var(--text-secondary)',
              fontSize: '0.875rem',
              margin: 0
            }}>
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={onToggleMode}
                style={{
                  marginLeft: '0.25rem',
                  color: '#6366f1',
                  fontWeight: '500',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => (e.target as HTMLButtonElement).style.textDecoration = 'underline'}
                onMouseOut={(e) => (e.target as HTMLButtonElement).style.textDecoration = 'none'}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{
            color: 'var(--text-muted)',
            fontSize: '0.875rem',
            margin: 0
          }}>
            A minimal, focused task management experience designed for productivity.
          </p>
        </div>
      </div>


    </div>
  )
}
