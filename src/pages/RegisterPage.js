import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/LoginPage.css'; // Используем те же стили, что и для страницы входа

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Проверка совпадения паролей
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setIsLoading(false);
      return;
    }
    
    try {
      // Отправляем запрос на бэкенд для регистрации
      const response = await axios.post('/api/v1/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      if (response && response.data) {
        // Перенаправляем на страницу входа
        navigate('/login', { 
          state: { 
            message: 'Регистрация прошла успешно! Теперь вы можете войти в систему.' 
          } 
        });
      } else {
        setError('Что-то пошло не так при регистрации. Пожалуйста, попробуйте снова.');
      }
    } catch (err) {
      console.error('Ошибка при регистрации:', err);
      const errorMessage = err.response?.data?.detail || 'Ошибка при регистрации. Проверьте введенные данные.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          <h1 className="login-title">Регистрация</h1>
          <h2 className="login-subtitle">Создайте аккаунт HR-специалиста</h2>
          
          {error && <div className="login-error">{error}</div>}
          
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Имя</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Иван Иванов"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Минимум 8 символов"
                minLength={8}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Подтвердите пароль</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Введите пароль повторно"
              />
            </div>
            
            <button
              type="submit"
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
            </button>
          </form>
          
          <div className="login-footer">
            <p>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
