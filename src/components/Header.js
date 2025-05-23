import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/Header.css';

const Header = ({ user, onLogout }) => {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('RU');
  // Всегда отображаем интерфейс авторизованного пользователя
  const [isAuthenticated] = useState(true);
  
  // Убрано условие проверки аутентификации - всегда считаем пользователя авторизованным
  
  // Обработчик смены языка
  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
    setLanguageMenuOpen(false);
    // Логика смены языка приложения
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
    <header className="app-header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <span className="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 8.69L16 5.19V2H18V4.81L22 8.31V12C21.91 12.68 21.41 13.23 20.72 13.42V16.5C20.72 17.33 20.26 18 19.43 18H4.57C3.74 18 3.28 17.33 3.28 16.5V13.42C2.59 13.23 2.09 12.68 2 12V8.31L6 4.81V2H8V5.19L4 8.69V11.4C4.25 11.65 4.59 11.8 5 11.8C5.95 11.8 6.62 11.13 6.62 10.19V7.95L12 3.5L17.38 7.95V10.19C17.38 11.13 18.05 11.8 19 11.8C19.41 11.8 19.75 11.65 20 11.4V8.69ZM11 14.8L6.91 19.1H17.09L13 14.8V12.05H11V14.8Z" fill="var(--primary)"/>
              </svg>
            </span>
            <span className="logo-text">Raplle<span className="logo-badge">AI</span></span>
          </Link>
          
          {/* Всегда отображаем навигацию авторизованного пользователя */}
          <nav className="nav-links user-authenticated">
            {/* Ссылка на документацию */}
            <Link to="/docs" className="nav-link">
              <span className="nav-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor"/>
                </svg>
              </span>
              Документация
            </Link>
            
            {/* Селектор языка */}
            <div className="language-selector">
              <button 
                className="language-toggle" 
                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
              >
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.87 15.07L10.33 12.56L10.36 12.53C12.1 10.59 13.34 8.36 14.07 6H17V4H10V2H8V4H1V6H12.17C11.5 7.92 10.44 9.75 9 11.35C8.07 10.32 7.3 9.19 6.69 8H4.69C5.42 9.63 6.42 11.17 7.67 12.56L2.58 17.58L4 19L9 14L12.11 17.11L12.87 15.07ZM18.5 10H16.5L12 22H14L15.12 19H19.87L21 22H23L18.5 10ZM15.88 17L17.5 12.67L19.12 17H15.88Z" fill="currentColor"/>
                  </svg>
                </span>
                {currentLanguage}
              </button>
              
              {languageMenuOpen && (
                <div className="dropdown-menu language-menu">
                  <div 
                    className={`dropdown-item ${currentLanguage === 'RU' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('RU')}
                  >
                    Русский
                  </div>
                  <div 
                    className={`dropdown-item ${currentLanguage === 'EN' ? 'active' : ''}`}
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
                className="settings-toggle" 
                onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
              >
                <span className="nav-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.14 12.94C19.18 12.64 19.2 12.33 19.2 12C19.2 11.68 19.18 11.36 19.13 11.06L21.16 9.48C21.34 9.34 21.39 9.07 21.28 8.87L19.36 5.55C19.24 5.33 18.99 5.26 18.77 5.33L16.38 6.29C15.88 5.91 15.35 5.59 14.76 5.35L14.4 2.81C14.36 2.57 14.16 2.4 13.92 2.4H10.08C9.84 2.4 9.65 2.57 9.61 2.81L9.25 5.35C8.66 5.59 8.12 5.92 7.63 6.29L5.24 5.33C5.02 5.25 4.77 5.33 4.65 5.55L2.74 8.87C2.62 9.08 2.66 9.34 2.86 9.48L4.89 11.06C4.84 11.36 4.8 11.69 4.8 12C4.8 12.31 4.82 12.64 4.87 12.94L2.84 14.52C2.66 14.66 2.61 14.93 2.72 15.13L4.64 18.45C4.76 18.67 5.01 18.74 5.23 18.67L7.62 17.71C8.12 18.09 8.65 18.41 9.24 18.65L9.6 21.19C9.65 21.43 9.84 21.6 10.08 21.6H13.92C14.16 21.6 14.36 21.43 14.39 21.19L14.75 18.65C15.34 18.41 15.88 18.09 16.37 17.71L18.76 18.67C18.98 18.75 19.23 18.67 19.35 18.45L21.27 15.13C21.39 14.91 21.34 14.66 21.15 14.52L19.14 12.94ZM12 15.6C10.02 15.6 8.4 13.98 8.4 12C8.4 10.02 10.02 8.4 12 8.4C13.98 8.4 15.6 10.02 15.6 12C15.6 13.98 13.98 15.6 12 15.6Z" fill="currentColor"/>
                  </svg>
                </span>
                Настройки
              </button>
              
              {settingsMenuOpen && (
                <div className="dropdown-menu settings-dropdown">
                  <Link to="/profile" className="dropdown-item">Профиль</Link>
                  <Link to="/settings" className="dropdown-item">Настройки аккаунта</Link>
                  <Link to="/api-settings" className="dropdown-item">API интеграция</Link>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-item" onClick={onLogout}>Выйти</div>
                </div>
              )}
            </div>
            
            {/* Метка пользователя */}
            <div className="user-profile">
              <div className="user-avatar">{getUserInitials()}</div>
              <div className="user-info">
                <div className="user-name">{user?.username || 'Личный кабинет'}</div>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
