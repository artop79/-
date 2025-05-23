import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Получаем путь, с которого пользователь был перенаправлен
  const from = location.state?.from || '/';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Отправляем запрос на бэкенд для аутентификации
      const response = await axios.post('/api/v1/auth/login', {
        email,
        password
      });
      
      if (response && response.token) {
        // Сохраняем токен и информацию о пользователе в localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('lastActive', Date.now().toString());
        
        // Устанавливаем заголовок авторизации для последующих запросов
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        
        // Редирект на страницу, с которой пользователь был перенаправлен
        navigate(from, { replace: true });
      } else {
        setError('Что-то пошло не так при входе. Пожалуйста, попробуйте снова.');
      }
    } catch (err) {
      console.error('Ошибка при входе:', err);
      const errorMessage = err.response?.data?.detail || 'Ошибка при входе. Проверьте ваш email и пароль.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Функция для тестового входа - немедленный вход без бэкенда
  const handleTestLogin = () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Создаем тестовые данные пользователя для демонстрации
      const userData = {
        id: 9999,
        username: 'test_user',
        email: 'test@example.com',
        name: 'Тестовый пользователь HR',
        is_superuser: true
      };
      
      // Сохраняем тестовый токен и информацию о пользователе
      localStorage.setItem('token', 'test-token-frontend-only');
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('lastActive', Date.now().toString());
      
      // Задержка для лучшего пользовательского опыта
      setTimeout(() => {
        // Перенаправляем на страницу вакансий
        navigate('/vacancies', { replace: true });
        setIsLoading(false);
      }, 800); // Короткая задержка для показа эффекта загрузки
      
    } catch (err) {
      console.error('Ошибка при входе:', err);
      setError('Ошибка при входе в систему. Пожалуйста, попробуйте снова.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <h1 className="login-title">Вход в систему</h1>
          <h2 className="login-subtitle">HR-платформа с AI-интервью</h2>
          
          {error && <div className="login-error">{error}</div>}
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Ваш пароль"
              />
            </div>
            
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Загрузка...' : 'Войти'}
            </button>
          </form>
          
          <div className="test-login-section">
            <div className="separator">
              <span>ИЛИ</span>
            </div>
            
            <button 
              className="test-login-button"
              onClick={handleTestLogin}
              disabled={isLoading}
            >
              {isLoading ? 'Загрузка...' : 'Войти для тестирования'}
            </button>
            
            <p className="test-login-info">
              Эта кнопка позволяет войти в систему с тестовым аккаунтом без регистрации.
              Только для тестирования и демонстрации.  
            </p>
          </div>
          
          <div className="login-footer">
            <p>
              Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
