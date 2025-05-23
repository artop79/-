import React, { useState } from 'react';
import './DashboardHeader.css';

const DashboardHeader = ({ user, onLogout }) => {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('RU');
  
  // Обработчик смены языка
  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    setLanguageMenuOpen(false);
    // Здесь должна быть логика для действительной смены языка
    // например, через контекст или состояние приложения
  };
  
  // Получаем инициалы пользователя для аватара
  const getUserInitials = () => {
    if (!user || !user.username) return '?';
    
    const nameParts = user.username.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0].charAt(0)}${nameParts[1].charAt(0)}`.toUpperCase();
    }
    
    return user.username.charAt(0).toUpperCase();
  };
  
  return (
    <header className="dashboard-header">
      <div className="header-container">
        {/* Логотип */}
        <div className="logo-section">
          <span className="logo-icon">
            <img src="/favicon/favicon.svg?v=20250516" width="24" height="24" alt="Raplle Logo" />
          </span>
          <div className="logo-text">
            Raplle
          </div>
        </div>
        
        {/* Раздел для навигации и настроек */}
        <div className="header-actions">
          {/* Документация */}
          <a href="/docs" className="header-link">
            <span className="action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="#6c757d"/>
              </svg>
            </span>
            <span className="action-text">Документация</span>
          </a>
          
          {/* Селектор языка */}
          <div className="language-selector">
            <button 
              className="language-button" 
              onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
            >
              <span className="action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z" fill="#6c757d"/>
                </svg>
              </span>
              <span className="action-text">{currentLanguage}</span>
            </button>
            
            {languageMenuOpen && (
              <div className="language-dropdown">
                <div 
                  className={`language-option ${currentLanguage === 'RU' ? 'active' : ''}`} 
                  onClick={() => handleLanguageChange('RU')}
                >
                  Русский
                </div>
                <div 
                  className={`language-option ${currentLanguage === 'EN' ? 'active' : ''}`} 
                  onClick={() => handleLanguageChange('EN')}
                >
                  English
                </div>
              </div>
            )}
          </div>
          
          {/* Настройки */}
          <div className="settings-menu">
            <button 
              className="settings-button" 
              onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
            >
              <span className="action-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="#6c757d"/>
                </svg>
              </span>
              <span className="action-text">Настройки</span>
            </button>
            
            {settingsMenuOpen && (
              <div className="settings-dropdown">
                <a href="/settings/profile" className="setting-option">
                  Настройки профиля
                </a>
                <a href="/settings/appearance" className="setting-option">
                  Внешний вид
                </a>
                <a href="/settings/notifications" className="setting-option">
                  Уведомления
                </a>
                <a href="/settings/api" className="setting-option">
                  API интеграция
                </a>
                <div className="setting-separator"></div>
                <div className="setting-option" onClick={onLogout}>
                  Выйти
                </div>
              </div>
            )}
          </div>
          
          {/* Информация о пользователе */}
          {user && (
            <div className="user-profile">
              <div className="user-avatar">
                {getUserInitials()}
              </div>
              <div className="user-info">
                <div className="user-name">{user.username}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
