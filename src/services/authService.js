const API_URL = 'http://localhost:8000/auth';

// Утилитарная функция для отправки запросов с токеном
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Не авторизован');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };
  
  const response = await fetch(url, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      detail: `Ошибка HTTP: ${response.status}`
    }));
    throw new Error(error.detail || 'Произошла ошибка при запросе');
  }
  
  return response.json();
};

// Сервис аутентификации
const authService = {
  // Вход в систему
  async login(username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: `Ошибка HTTP: ${response.status}`
      }));
      throw new Error(error.detail || 'Ошибка авторизации');
    }
    
    return response.json();
  },
  
  // Регистрация нового пользователя
  async register(username, email, password) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        detail: `Ошибка HTTP: ${response.status}`
      }));
      throw new Error(error.detail || 'Ошибка при регистрации');
    }
    
    return response.json();
  },
  
  // Получение данных пользователя
  async getCurrentUser() {
    return fetchWithAuth(`${API_URL}/me`);
  },
  
  // Получение статистики для дашборда
  async getDashboard() {
    return fetchWithAuth(`${API_URL}/dashboard`);
  },
  
  // Обновление профиля
  async updateProfile(username, email) {
    return fetchWithAuth(`${API_URL}/update-profile`, {
      method: 'PUT',
      body: JSON.stringify({ username, email })
    });
  },
  
  // Смена пароля
  async changePassword(current_password, new_password) {
    return fetchWithAuth(`${API_URL}/change-password`, {
      method: 'PUT',
      body: JSON.stringify({ current_password, new_password })
    });
  },
  
  // Проверка авторизации
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
  
  // Выход из системы
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
  }
};

export default authService;
