import React, { useState } from 'react';
import './Login.css';
import Modal from './Modal';
import { authService } from '../../services/api';

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
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [modalConfig, setModalConfig] = useState({
    type: 'success' as 'success' | 'error' | 'warning' | 'info',
    title: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Limpiar errores previos
    setErrors({});
    const newErrors: {[key: string]: string} = {};
    
    // Validar que los campos no estén vacíos
    if (!username || username.trim() === '') {
      newErrors.username = 'El nombre de usuario es requerido';
    }
    
    if (!password || password.trim() === '') {
      newErrors.password = 'La contraseña es requerida';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setModalConfig({
        type: 'error',
        title: 'Error',
        message: 'Por favor completa todos los campos obligatorios'
      });
      setShowModal(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Llamada REAL al backend
      console.log('Enviando login:', { username, password });
      const response = await authService.login(username, password);
      console.log('Respuesta del backend:', response);
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
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
      
    } catch (error: any) {
      setModalConfig({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Credenciales incorrectas. Por favor intenta de nuevo.'
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
      <div className="login-wrapper">
        {/* Lado izquierdo - Imagen */}
        <div className="login-image-section">
          <img 
            src="/Login.png" 
            alt="Agriculture Field" 
            className="field-image"
          />
        </div>

        {/* Lado derecho - Formulario */}
        <div className="login-form-section">
          <div className="login-form-content">
            {/* Logo */}
            <div className="logo-section">
              <img 
                src="/logoOrus.jpeg" 
                alt="ORUS Agriculture" 
                className="logo-image"
              />
            </div>

            {/* Título */}
            <h2 className="login-title">Iniciar Sesión</h2>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  type="text"
                  id="username"
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  placeholder="Ingresa tu correo electrónico"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) {
                      setErrors(prev => ({ ...prev, username: '' }));
                    }
                  }}
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Contraseña
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors(prev => ({ ...prev, password: '' }));
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {showPassword ? (
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      ) : (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="forgot-password">
                <a href="#" className="forgot-link">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </button>
            </form>

            {/* Enlaces adicionales */}
            <div className="additional-links">
              <button
                type="button"
                className="create-account-link"
                onClick={onSwitchToRegister}
              >
                Crear una cuenta
              </button>
            </div>
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