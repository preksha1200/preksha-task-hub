import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

export const AuthTest = () => {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult('Testing connection...')
    
    try {
      // Test 1: Basic client check
      console.log('Supabase client:', supabase)
      setResult(prev => prev + '\n✅ Supabase client exists')
      
      // Test 2: Simple query
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      if (error) {
        setResult(prev => prev + '\n❌ Database query failed: ' + error.message)
      } else {
        setResult(prev => prev + '\n✅ Database query successful')
      }
      
      // Test 3: Auth signup
      const testEmail = `test${Date.now()}@example.com`
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123'
      })
      
      if (authError) {
        setResult(prev => prev + '\n❌ Auth signup failed: ' + authError.message)
      } else {
        setResult(prev => prev + '\n✅ Auth signup successful')
      }
      
    } catch (err: any) {
      setResult(prev => prev + '\n❌ Network error: ' + err.message)
      console.error('Test error:', err)
    }
    
    setLoading(false)
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Supabase Connection Test</h2>
      <button 
        onClick={testConnection} 
        disabled={loading}
        style={{
          padding: '0.5rem 1rem',
          backgroundColor: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '0.25rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          marginBottom: '1rem'
        }}
      >
        {loading ? 'Testing...' : 'Test Supabase Connection'}
      </button>
      
      <pre style={{
        backgroundColor: '#f3f4f6',
        padding: '1rem',
        borderRadius: '0.25rem',
        whiteSpace: 'pre-wrap',
        fontSize: '0.875rem',
        minHeight: '200px'
      }}>
        {result || 'Click the button to test Supabase connection...'}
      </pre>
    </div>
  )
}
