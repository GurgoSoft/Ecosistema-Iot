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
    // Step 1 - Institutional data
    firstName: '',
    lastName: '',
    areaOfWork: '',
    companyName: '',
    companyWebsite: '',
    // Step 2 - Personal data
    email: '',
    phone: '',
    // Step 3 - Account verification
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario comience a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.areaOfWork) {
      newErrors.areaOfWork = 'Area of work is required';
    }

    if (!formData.companyName) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.companyWebsite) {
      newErrors.companyWebsite = 'Company website is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.username) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'At least 8 characters and a special character';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Llamada REAL al backend para registrar
      const response = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        areaOfWork: formData.areaOfWork,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite,
        phone: formData.phone
      });
      
      // Guardar token en localStorage
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      // Avanzar al paso 3 (confirmación)
      setCurrentStep(3);
      
    } catch (error: any) {
      console.error('Error en registro:', error);
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
        <div className="step-number">
          {currentStep > 1 ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            '1'
          )}
        </div>
        <div className="step-label">
          <div className="step-title">Institutional</div>
          <div className="step-subtitle">data</div>
        </div>
      </div>
      
      <div className="step-connector"></div>
      
      <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
        <div className="step-number">
          {currentStep > 2 ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            '2'
          )}
        </div>
        <div className="step-label">
          <div className="step-title">Personal</div>
          <div className="step-subtitle">data</div>
        </div>
      </div>
      
      <div className="step-connector"></div>
      
      <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
        <div className="step-number">
          {currentStep > 3 ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            '3'
          )}
        </div>
        <div className="step-label">
          <div className="step-title">Verify</div>
          <div className="step-subtitle">account</div>
        </div>
      </div>
    </div>
  );

  const renderStep1 = () => (
    <form className="auth-form">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName" className="form-label">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            className="form-input"
            placeholder="Your first name"
            value={formData.firstName}
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName" className="form-label">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            className="form-input"
            placeholder="Your last name"
            value={formData.lastName}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="areaOfWork" className="form-label">
          Area of Work
        </label>
        <select
          id="areaOfWork"
          name="areaOfWork"
          className="form-input form-select"
          value={formData.areaOfWork}
          onChange={handleInputChange}
        >
          <option value="">Select an option</option>
          <option value="technology">Technology</option>
          <option value="manufacturing">Manufacturing</option>
          <option value="healthcare">Healthcare</option>
          <option value="education">Education</option>
          <option value="finance">Finance</option>
          <option value="agriculture">Agriculture</option>
          <option value="energy">Energy</option>
          <option value="transportation">Transportation</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="companyName" className="form-label">
          Company Name
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          className="form-input"
          placeholder="Your company or institution"
          value={formData.companyName}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="companyWebsite" className="form-label">
          Company Website
        </label>
        <input
          type="url"
          id="companyWebsite"
          name="companyWebsite"
          className="form-input"
          placeholder="www.website.com"
          value={formData.companyWebsite}
          onChange={handleInputChange}
        />
      </div>

      <button
        type="button"
        className="login-button"
        onClick={handleContinue}
        disabled={isLoading}
      >
        Continue
      </button>

      <div className="create-account">
        <button
          type="button"
          className="create-account-link"
          onClick={onSwitchToLogin}
        >
          Log in
        </button>
      </div>
    </form>
  );

  const renderStep2 = () => (
    <form className="auth-form">
      <div className="back-button-container">
        <button
          type="button"
          className="back-button"
          onClick={handleBack}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="form-input"
          placeholder="Username with no spaces"
          value={formData.username}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" className="form-label">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          className="form-input"
          placeholder="Your email"
          value={formData.email}
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="form-input"
          placeholder="At least 8 characters and a special character"
          value={formData.password}
          onChange={handleInputChange}
        />
      </div>

      <div className="terms-acceptance">
        <p className="terms-text">
          By signing up, you agree to our{' '}
          <a href="#" className="terms-link">Privacy Policy</a> and{' '}
          <a href="#" className="terms-link">Terms of Service</a>
        </p>
      </div>

      <div className="recaptcha-container">
        <div className="recaptcha-checkbox">
          <input type="checkbox" id="recaptcha" />
          <label htmlFor="recaptcha">No soy un robot</label>
          <div className="recaptcha-logo">reCAPTCHA</div>
        </div>
      </div>

      <button
        type="button"
        className="login-button"
        onClick={handleContinue}
        disabled={isLoading}
      >
        Continue
      </button>

      <div className="create-account">
        <button
          type="button"
          className="create-account-link"
          onClick={onSwitchToLogin}
        >
          Log in
        </button>
      </div>
    </form>
  );

  const renderStep3 = () => (
    <div className="success-container">
      <div className="success-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#e2e8f0"/>
          <path d="M9 12l2 2 4-4" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <h2 className="success-title">Successful registration</h2>
      <p className="success-subtitle">Check your email to verify your account.</p>
      
      <button
        type="button"
        className="login-button"
        onClick={onSwitchToLogin}
        disabled={isLoading}
      >
        Log in
      </button>
    </div>
  );

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

            {renderStepIndicator()}

            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
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
    </div>
  );
};

export default Register;