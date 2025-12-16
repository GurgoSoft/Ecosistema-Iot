import React, { useState } from 'react';
import './Register.css';
import { authService } from '../../services/api';

interface RegisterProps {
  onRegister?: (userData: any) => void;
  onSwitchToLogin?: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  });
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus siguiente campo
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerificationKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es requerido';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'El nombre de la empresa es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres';
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos un carácter especial';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      alert('Debes aceptar los términos y condiciones para continuar');
      return;
    }

    if (!validateStep1()) {
      return;
    }

    setIsLoading(true);
    try {
      // Llamada al backend para registrar
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        companyName: formData.companyName
      });
      
      // Guardar token y usuario
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Notificar éxito y redirigir al login o dashboard
      alert('¡Cuenta creada exitosamente! Ahora puedes iniciar sesión.');
      onSwitchToLogin?.();
      
    } catch (error: any) {
      console.error('Error en registro:', error);
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      alert('Por favor ingresa el código completo');
      return;
    }

    setIsLoading(true);
    try {
      // Aquí iría la llamada al backend para verificar el código
      // await authService.verifyCode(formData.email, code);
      
      // Por ahora simulamos éxito
      setTimeout(() => {
        alert('Cuenta verificada exitosamente');
        onSwitchToLogin?.();
      }, 1000);
      
    } catch (error: any) {
      console.error('Error en verificación:', error);
      alert('Código inválido');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            Nombre
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className={`form-input ${errors.firstName ? 'error' : ''}`}
            placeholder="Tu nombre"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Apellido
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className={`form-input ${errors.lastName ? 'error' : ''}`}
            placeholder="Tu apellido"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Correo electrónico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className={`form-input ${errors.email ? 'error' : ''}`}
          placeholder="tu@correo.com"
          value={formData.email}
          onChange={handleInputChange}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="companyName" className="form-label">
          Nombre de empresa
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          className={`form-input ${errors.companyName ? 'error' : ''}`}
          placeholder="Nombre de tu empresa"
          value={formData.companyName}
          onChange={handleInputChange}
        />
        {errors.companyName && <span className="error-message">{errors.companyName}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Contraseña
        </label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={handleInputChange}
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

      <div className="form-group">
        <label htmlFor="confirmPassword" className="form-label">
          Confirmar contraseña
        </label>
        <div className="password-input-container">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            placeholder="Confirma tu contraseña"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            aria-label="Toggle password visibility"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {showConfirmPassword ? (
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
        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
      </div>

      {/* Checkbox de términos y condiciones */}
      <div className="terms-checkbox-container">
        <input
          type="checkbox"
          id="acceptTerms"
          className="terms-checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
        />
        <label className="terms-label">
          Acepto los{' '}
          <span 
            className="terms-modal-link" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTermsModal(true);
            }}
          >
            Términos de Servicio y Política de Privacidad
          </span>
        </label>
      </div>

      <button
        type="submit"
        className="login-button"
        disabled={isLoading}
      >
        {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <div className="additional-links">
        <button
          type="button"
          className="create-account-link"
          onClick={onSwitchToLogin}
        >
          ¿Ya tienes cuenta? Inicia sesión
        </button>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <div className="verification-container">
      <h2 className="verification-title">Verificar cuenta</h2>
      <p className="verification-subtitle">
        Ingresa el código de 6 dígitos enviado a<br />
        <strong>{formData.email}</strong>
      </p>

      <div className="verification-code-inputs">
        {verificationCode.map((digit, index) => (
          <input
            key={index}
            id={`code-${index}`}
            type="text"
            maxLength={1}
            className="code-input"
            value={digit}
            onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleVerificationKeyDown(index, e)}
            autoFocus={index === 0}
          />
        ))}
      </div>

      <button
        type="button"
        className="login-button"
        onClick={handleVerifyCode}
        disabled={isLoading || verificationCode.join('').length !== 6}
      >
        {isLoading ? 'Verificando...' : 'Verificar código'}
      </button>

      <div className="resend-code">
        <button
          type="button"
          className="resend-link"
          onClick={() => alert('Código reenviado')}
        >
          Reenviar código
        </button>
      </div>

      <div className="additional-links" style={{ marginTop: '20px' }}>
        <button
          type="button"
          className="create-account-link"
          onClick={() => setCurrentStep(1)}
        >
          Volver al registro
        </button>
      </div>
    </div>
  );

  const renderTermsModal = () => (
    showTermsModal && (
      <div className="terms-modal-overlay" onClick={() => setShowTermsModal(false)}>
        <div className="terms-modal" onClick={(e) => e.stopPropagation()}>
          <div className="terms-modal-header">
            <h2 className="terms-modal-title">Términos de Servicio y Política de Privacidad</h2>
            <button 
              className="terms-modal-close" 
              onClick={() => setShowTermsModal(false)}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
          
          <div className="terms-modal-content">
            <h3>1. Términos de Servicio</h3>
            <p>
              Al utilizar los servicios de ORUS Agriculture, usted acepta estar sujeto a estos términos y condiciones. 
              Nos reservamos el derecho de actualizar estos términos en cualquier momento.
            </p>

            <h3>2. Uso del Servicio</h3>
            <p>
              Usted se compromete a utilizar nuestros servicios de manera responsable y de acuerdo con todas las 
              leyes aplicables. No está permitido usar el servicio para actividades ilegales o no autorizadas.
            </p>

            <h3>3. Política de Privacidad</h3>
            <p>
              Nos tomamos muy en serio la privacidad de sus datos. Recopilamos información personal necesaria 
              para proporcionar nuestros servicios y nunca compartiremos su información con terceros sin su consentimiento.
            </p>

            <h3>4. Protección de Datos</h3>
            <p>
              Sus datos están protegidos mediante encriptación y almacenados en servidores seguros. 
              Implementamos medidas de seguridad para prevenir accesos no autorizados.
            </p>

            <h3>5. Cookies</h3>
            <p>
              Utilizamos cookies para mejorar su experiencia de usuario y analizar el uso de nuestro servicio. 
              Puede desactivar las cookies en su navegador si lo desea.
            </p>

            <h3>6. Modificaciones</h3>
            <p>
              Nos reservamos el derecho de modificar estos términos y políticas en cualquier momento. 
              Le notificaremos sobre cambios significativos por correo electrónico.
            </p>

            <h3>7. Contacto</h3>
            <p>
              Si tiene preguntas sobre estos términos o nuestra política de privacidad, puede contactarnos 
              en info@orusagriculture.com
            </p>
          </div>

          <div className="terms-modal-footer">
            <button 
              className="terms-modal-accept"
              onClick={() => {
                setAcceptedTerms(true);
                setShowTermsModal(false);
              }}
            >
              Aceptar y cerrar
            </button>
          </div>
        </div>
      </div>
    )
  );

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
            <h2 className="login-title">
              {currentStep === 1 ? 'Crear Cuenta' : 'Verificación'}
            </h2>

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
          </div>
        </div>
      </div>

      {/* Modal de términos */}
      {renderTermsModal()}
    </div>
  );
};

export default Register;