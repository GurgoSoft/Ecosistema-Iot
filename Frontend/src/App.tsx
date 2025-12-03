import { useState } from 'react'
import AuthPage from './pages/auth/AuthPage'
import FieldSelectionPage from './pages/FieldSelectionPage'
import Dashboard from './pages/Dashboard'
import './App.css'

type AppView = 'auth' | 'field-selection' | 'dashboard'

function App() {
  const [currentView, setCurrentView] = useState<AppView>('auth')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [selectedField, setSelectedField] = useState<string | null>(null)

  const handleAuthSuccess = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentView('field-selection')
      setIsTransitioning(false)
    }, 600)
  }

  const handleFieldSelected = (fieldId: string) => {
    setSelectedField(fieldId)
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentView('dashboard')
      setIsTransitioning(false)
    }, 400)
  }

  const handleLogout = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentView('auth')
      setSelectedField(null)
      setIsTransitioning(false)
      // Limpiar localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }, 400)
  }

  const handleBackToFields = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentView('field-selection')
      setSelectedField(null)
      setIsTransitioning(false)
    }, 400)
  }

  if (currentView === 'auth') {
    return (
      <div className={`page-transition ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <AuthPage onAuthSuccess={handleAuthSuccess} />
      </div>
    )
  }

  if (currentView === 'field-selection') {
    return (
      <div className={`page-transition ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <FieldSelectionPage 
          onFieldSelect={handleFieldSelected}
          onLogout={handleLogout}
          showDashboardButton={true}
          onGoToDashboard={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setCurrentView('dashboard');
              setIsTransitioning(false);
            }, 400);
          }}
        />
      </div>
    )
  }

  return (
    <div className={`App page-transition ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
      <Dashboard 
        onLogout={handleLogout}
        selectedFieldId={selectedField}
        onBackToFields={handleBackToFields}
      />
    </div>
  )
}

export default App