import React, { useState, useEffect } from 'react';
import './ProfileSection.css';
import authService from '../services/authService';

const ProfileSection = ({ user, onLogout }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Для формы редактирования профиля
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  
  // Для формы смены пароля
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Состояния для отображения сообщений об успехе
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
  const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);
  
  // Загрузка статистики пользователя при загрузке компонента
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const data = await authService.getDashboard();
        setDashboardData(data);
      } catch (err) {
        setError('Ошибка при загрузке данных: ' + (err.message || 'Неизвестная ошибка'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Обработчики для форм
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Обработчик обновления профиля
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      await authService.updateProfile(profileData.username, profileData.email);
      setProfileUpdateSuccess(true);
      setTimeout(() => setProfileUpdateSuccess(false), 3000);
    } catch (err) {
      setError('Ошибка при обновлении профиля: ' + (err.message || 'Неизвестная ошибка'));
    }
  };
  
  // Обработчик смены пароля
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setError('Новый пароль должен содержать минимум 8 символов');
      return;
    }
    
    try {
      await authService.changePassword(
        passwordData.currentPassword, 
        passwordData.newPassword
      );
      
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setPasswordUpdateSuccess(true);
      setTimeout(() => setPasswordUpdateSuccess(false), 3000);
    } catch (err) {
      setError('Ошибка при смене пароля: ' + (err.message || 'Неизвестная ошибка'));
    }
  };
  
  // Функция для правильного форматирования даты
  const formatDate = (dateString) => {
    if (!dateString) return 'Неизвестно';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="profile-section">
      <div className="profile-header">
        <div className="user-info">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="user-details">
            <h2>{user?.username || 'Пользователь'}</h2>
            <p className="user-email">{user?.email || 'email@example.com'}</p>
            <p className="user-joined">Регистрация: {user?.created_at ? formatDate(user.created_at) : 'Неизвестно'}</p>
          </div>
        </div>
        <button className="logout-button" onClick={onLogout}>
          Выйти
        </button>
      </div>
      
      <div className="profile-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Обзор
        </button>
        <button 
          className={activeTab === 'history' ? 'active' : ''}
          onClick={() => setActiveTab('history')}
        >
          История анализов
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Настройки
        </button>
      </div>
      
      <div className="profile-content">
        {isLoading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Загрузка данных...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            {error}
          </div>
        ) : (
          <>
            {activeTab === 'overview' && dashboardData && (
              <div className="dashboard-overview">
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-icon resume-icon">📄</div>
                    <div className="stat-info">
                      <h3>{dashboardData.statistics.resume_count}</h3>
                      <p>Резюме</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon job-icon">💼</div>
                    <div className="stat-info">
                      <h3>{dashboardData.statistics.job_description_count}</h3>
                      <p>Вакансии</p>
                    </div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-icon analysis-icon">📊</div>
                    <div className="stat-info">
                      <h3>{dashboardData.statistics.analysis_count}</h3>
                      <p>Анализы</p>
                    </div>
                  </div>
                </div>
                
                <div className="recent-activity">
                  <h3>Недавние файлы</h3>
                  
                  {dashboardData.recent_files.length > 0 ? (
                    <div className="recent-files-list">
                      {dashboardData.recent_files.map((file, index) => (
                        <div className="recent-file-item" key={index}>
                          <div className="file-icon">
                            {file.file_type === 'resume' ? '📄' : '💼'}
                          </div>
                          <div className="file-details">
                            <h4>{file.filename}</h4>
                            <p>{formatDate(file.created_at)}</p>
                          </div>
                          <div className="file-type-badge">
                            {file.file_type === 'resume' ? 'Резюме' : 'Вакансия'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-data">Нет загруженных файлов</p>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'history' && dashboardData && (
              <div className="analysis-history">
                <h3>История анализов</h3>
                
                {/* Здесь можно добавить запрос к API для получения истории анализов */}
                <p className="coming-soon">История анализов будет доступна в следующем обновлении</p>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="user-settings">
                <div className="settings-section">
                  <h3>Обновление профиля</h3>
                  
                  {profileUpdateSuccess && (
                    <div className="success-message">
                      Профиль успешно обновлен
                    </div>
                  )}
                  
                  <form onSubmit={handleUpdateProfile}>
                    <div className="form-group">
                      <label htmlFor="username">Имя пользователя</label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        value={profileData.username}
                        onChange={handleProfileChange}
                        placeholder="Введите имя пользователя"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        placeholder="Введите email"
                      />
                    </div>
                    
                    <button type="submit" className="update-button">
                      Обновить профиль
                    </button>
                  </form>
                </div>
                
                <div className="settings-section">
                  <h3>Изменение пароля</h3>
                  
                  {passwordUpdateSuccess && (
                    <div className="success-message">
                      Пароль успешно изменен
                    </div>
                  )}
                  
                  <form onSubmit={handleChangePassword}>
                    <div className="form-group">
                      <label htmlFor="currentPassword">Текущий пароль</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Введите текущий пароль"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="newPassword">Новый пароль</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="Введите новый пароль"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Подтвердите пароль</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder="Введите новый пароль ещё раз"
                        required
                      />
                    </div>
                    
                    <button type="submit" className="update-button">
                      Изменить пароль
                    </button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSection;
