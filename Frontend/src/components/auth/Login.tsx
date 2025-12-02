import React, { useState } from 'react';
import './Login.css';
import Modal from './Modal';

interface LoginProps {
  onLogin?: (username: string, password: string) => void;
  onSwitchToRegister?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mostrar modal de éxito
      setModalConfig({
        type: 'success',
        title: '¡Bienvenido!',
        message: 'Inicio de sesión exitoso. Redirigiendo al dashboard...'
      });
      setShowModal(true);
      
      // Esperar 1.5 segundos antes de redirigir
      setTimeout(() => {
        onLogin?.(username, password);
      }, 1500);
      
    } catch (error) {
      setModalConfig({
        type: 'error',
        title: 'Error',
        message: 'Credenciales incorrectas. Por favor intenta de nuevo.'
      });
      setShowModal(true);
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-section">
          <div className="login-form">
            <div className="logo-section">
              <div className="logo">
                <img 
                  src="/logo-orus.png" 
                  alt="ORUS Logo" 
                  className="logo-image"
                />
                <div className="logo-divider"></div>
                <span className="logo-text">ORUS</span>
              </div>
            </div>

            <h2 className="login-title">Login</h2>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="form-input"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {showPassword ? (
                        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M9.88 9.88L6.61 6.61M9.88 9.88l4.24 4.24M12 5.5c-7 0-11 6.5-11 6.5s4 6.5 11 6.5 11-6.5 11-6.5-4-6.5-11-6.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : (
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              <div className="forgot-password">
                <a href="#" className="forgot-link">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </button>

              <div className="create-account">
                <button
                  type="button"
                  className="create-account-link"
                  onClick={onSwitchToRegister}
                >
                  Create an account
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="login-image-section">
          <div className="dashboard-image-container">
            <img 
              src="/dashboard-preview.jpg" 
              alt="Dashboard Preview" 
              className="dashboard-image"
            />
          </div>
        </div>
      </div>

      {/* Modal de Notificación */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
      />
    </div>
  );
};

export default Login;