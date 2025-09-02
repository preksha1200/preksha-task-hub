import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { TaskApp } from './components/TaskApp';

// Main App component that handles authentication flow
function AppContent() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '2px solid #e5e7eb',
          borderTop: '2px solid #6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Auth 
        mode={authMode} 
        onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')} 
      />
    );
  }

  // User is authenticated, show the main task app
  return <TaskApp />;
}

// Root App component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App;
