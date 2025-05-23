import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import DarkTheme from './theme';
import Router from './Router';
import './App.css';
import axios from 'axios';
import './assets/css/AuthLoading.css';
import { Box, Typography } from '@mui/material';

function App() {
  // Настройка общих заголовков для axios
  useEffect(() => {
    // Добавляем токен авторизации, если он есть в localStorage
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Настраиваем интерцептор для обработки ошибок авторизации
    const responseInterceptor = axios.interceptors.response.use(
      response => response.data,
      error => {
        // Если ошибка 401 (Unauthorized) или 403 (Forbidden),
        // выполняем выход из системы
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          
          // Редирект на страницу логина, если не находимся на публичном маршруте
          const publicPaths = ['/login', '/register', '/interview/'];
          const currentPath = window.location.pathname;
          const isPublicPath = publicPaths.some(path => currentPath.startsWith(path));
          
          if (!isPublicPath) {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
    
    // Базовый URL для API-запросов
    axios.defaults.baseURL = 'http://localhost:8000';
    
    // Очистка интерцептора при размонтировании
    return () => {
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);
  
  return (
    <ThemeProvider theme={DarkTheme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Router />
        <Box 
          component="footer" 
          sx={{ 
            mt: 'auto', 
            py: 2, 
            textAlign: 'center',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            bgcolor: 'background.darker'
          }}
        >
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} Raplle — Система анализа резюме и проведения интервью
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
