import React, { useState } from 'react';
import Login from '../../components/auth/Login';
import Register from '../../components/auth/Register';

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = (username: string, password: string) => {
    console.log('Login attempt:', { username, password });
    // El modal se maneja en el componente Login
    onAuthSuccess?.();
  };

  const handleRegister = (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    console.log('Register attempt:', userData);
    // Aquí implementarías la lógica de registro
    // Por ejemplo, llamar a tu API para crear la cuenta
    setIsLogin(true); // Cambiar a login después del registro exitoso
  };

  return (
    <>
      {isLogin ? (
        <Login
          onLogin={handleLogin}
          onSwitchToRegister={() => setIsLogin(false)}
        />
      ) : (
        <Register
          onRegister={handleRegister}
          onSwitchToLogin={() => setIsLogin(true)}
        />
      )}
    </>
  );
};

export default AuthPage;