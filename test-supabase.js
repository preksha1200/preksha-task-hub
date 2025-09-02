// Simple test to verify Supabase connection
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jkojyeourqfbihjfgjxi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imprb2p5ZW91cnFmYmloamZnanhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzkxNzksImV4cCI6MjA3MjMxNTE3OX0.HWgq8qzhw1-N12kGE891mMi20whinZUmFGLDdVxMM3A'

console.log('Testing Supabase connection...')
console.log('URL:', supabaseUrl)
console.log('Key length:', supabaseKey.length)

const supabase = createClient(supabaseUrl, supabaseKey)

// Test basic connection
async function testConnection() {
  try {
    console.log('Testing basic connection...')
    
    // Try to fetch from a simple endpoint
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Connection test failed:', error)
    } else {
      console.log('Connection test successful:', data)
    }
  } catch (err) {
    console.error('Network error:', err)
  }
}

// Test auth signup
async function testSignup() {
  try {
    console.log('Testing signup...')
    
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123'
    })
    
    if (error) {
      console.error('Signup test failed:', error)
    } else {
      console.log('Signup test result:', data)
    }
  } catch (err) {
    console.error('Signup network error:', err)
  }
}

testConnection()
testSignup()
