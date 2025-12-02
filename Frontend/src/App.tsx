import { useState } from 'react'
import AuthPage from './pages/auth/AuthPage'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleAuthSuccess = () => {
    setIsTransitioning(true)
    // Dar tiempo para la animación antes de cambiar el componente
    setTimeout(() => {
      setIsAuthenticated(true)
      setIsTransitioning(false)
    }, 600)
  }

  const handleLogout = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setIsAuthenticated(false)
      setIsTransitioning(false)
    }, 400)
  }

  if (!isAuthenticated) {
    return (
      <div className={`page-transition ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </div>
    )
  }

  return (
    <div className={`App page-transition ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      <Dashboard onLogout={handleLogout} />
    </div>
  )
}

export default App