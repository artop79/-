import React, { useState } from 'react';
import './LoginForm.css';
import authService from '../services/authService';

const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Пожалуйста, введите имя пользователя и пароль');
      return;
    }
    
    setIsLoggingIn(true);
    setError('');
    
    try {
      const response = await authService.login(username, password);
      
      if (response.access_token) {
        // Сохраняем токен в localStorage
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user_info', JSON.stringify({
          id: response.user_id,
          username: response.username,
          is_superuser: response.is_superuser,
          email: response.email
        }));
        
        // Сообщаем родительскому компоненту об успешном входе
        if (onLoginSuccess) {
          onLoginSuccess(response);
        }
      } else {
        setError('Произошла ошибка при входе');
      }
    } catch (err) {
      setError(err.message || 'Ошибка авторизации');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Проверка на корректность данных
    if (!registerData.username || !registerData.email || !registerData.password) {
      setError('Все поля обязательны для заполнения');
      return;
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    
    if (registerData.password.length < 8) {
      setError('Пароль должен содержать минимум 8 символов');
      return;
    }
    
    setIsLoggingIn(true);
    setError('');
    
    try {
      const response = await authService.register(
        registerData.username, 
        registerData.email, 
        registerData.password
      );
      
      if (response.id) {
        // Регистрация успешна, автоматически выполняем вход
        const loginResponse = await authService.login(registerData.username, registerData.password);
        
        if (loginResponse.access_token) {
          localStorage.setItem('token', loginResponse.access_token);
          localStorage.setItem('user_info', JSON.stringify({
            id: loginResponse.user_id,
            username: loginResponse.username,
            is_superuser: loginResponse.is_superuser,
            email: loginResponse.email
          }));
          
          if (onLoginSuccess) {
            onLoginSuccess(loginResponse);
          }
        }
      } else {
        setError('Произошла ошибка при регистрации');
      }
    } catch (err) {
      setError(err.message || 'Ошибка при регистрации');
    } finally {
      setIsLoggingIn(false);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="form-tabs">
          <button 
            className={!showRegisterForm ? "active" : ""} 
            onClick={() => setShowRegisterForm(false)}
          >
            Вход
          </button>
          <button 
            className={showRegisterForm ? "active" : ""} 
            onClick={() => setShowRegisterForm(true)}
          >
            Регистрация
          </button>
        </div>
        
        {!showRegisterForm ? (
          <form className="login-form" onSubmit={handleLogin}>
            <h2>Вход в личный кабинет</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Введите имя пользователя"
                disabled={isLoggingIn}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Введите пароль"
                disabled={isLoggingIn}
              />
            </div>
            
            <button type="submit" className="login-button" disabled={isLoggingIn}>
              {isLoggingIn ? 'Выполняется вход...' : 'Войти'}
            </button>
          </form>
        ) : (
          <form className="register-form" onSubmit={handleRegister}>
            <h2>Регистрация нового пользователя</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="reg-username">Имя пользователя</label>
              <input
                type="text"
                id="reg-username"
                name="username"
                value={registerData.username}
                onChange={handleInputChange}
                placeholder="Придумайте имя пользователя"
                disabled={isLoggingIn}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={registerData.email}
                onChange={handleInputChange}
                placeholder="Введите email"
                disabled={isLoggingIn}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="reg-password">Пароль</label>
              <input
                type="password"
                id="reg-password"
                name="password"
                value={registerData.password}
                onChange={handleInputChange}
                placeholder="Создайте пароль (минимум 8 символов)"
                disabled={isLoggingIn}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirm-password">Подтвердите пароль</label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                value={registerData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Введите пароль ещё раз"
                disabled={isLoggingIn}
              />
            </div>
            
            <button type="submit" className="register-button" disabled={isLoggingIn}>
              {isLoggingIn ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
