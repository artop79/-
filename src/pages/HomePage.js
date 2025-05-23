import React, { useState, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import ResultsCard from '../components/ResultsCard';
import ProfileSection from '../components/ProfileSection';
import DashboardHeader from '../components/DashboardHeader';
import TestComponent from '../components/TestComponent';
import authService from '../services/authService';
import fileService from '../services/fileService';
import openaiService from '../services/openaiService';
import '../assets/css/HomePage.css';
import '../assets/css/Dashboard.css';

const HomePage = () => {
  // Состояния для файлов и анализа
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescFile, setJobDescFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  // Состояния для пользовательского интерфейса
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' или 'profile'
  const [dashboardData, setDashboardData] = useState(null);
  
  // Загрузка данных пользователя при монтировании компонента
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Получаем данные пользователя
        const userData = await authService.getCurrentUser();
        setUser(userData);
        
        // Получаем данные дашборда
        const dashboard = await authService.getDashboard();
        setDashboardData(dashboard);
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);
  
  // Обработчики для загрузки файлов
  const handleResumeChange = (file) => {
    setResumeFile(file);
    setResults(null);
    setError(null);
  };

  const handleJobDescChange = (file) => {
    setJobDescFile(file);
    setResults(null);
    setError(null);
  };
  
  // Обработчик для анализа резюме
  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescFile) {
      setError('Пожалуйста, загрузите резюме и описание вакансии');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Формируем FormData для отправки файлов на сервер
      const formData = new FormData();
      formData.append('resume_file', resumeFile);
      formData.append('job_description_file', jobDescFile);
      
      // Отправляем запрос на сервер через fetch API
      const response = await fetch('http://localhost:8000/api/v1/analysis/compare', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      const analysisResults = await response.json();
      setResults(analysisResults);
      
      // Обновляем данные дашборда после успешного анализа
      const dashboard = await authService.getDashboard();
      setDashboardData(dashboard);
    } catch (err) {
      setError('Произошла ошибка при анализе резюме: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Обработчик выхода из системы
  const handleLogout = async () => {
    authService.logout();
    window.location.href = '/login'; // Перенаправляем на страницу логина
  };
  
  // Переключение между вкладками
  const switchToAnalysisTab = () => setActiveTab('analysis');
  const switchToProfileTab = () => setActiveTab('profile');
  
  // Если данные загружаются, показываем индикатор загрузки
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка данных пользователя...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Шапка приложения с настройками */}
      <DashboardHeader user={user} onLogout={handleLogout} />
      
      {/* Тестовый компонент для проверки обновления */}
      <TestComponent />
      
      {/* Основной контент */}
      <main className="dashboard-content">
        {/* Панель навигации */}
        <div className="tabs-container">
          <div 
            className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={switchToAnalysisTab}
          >
            Анализ резюме
          </div>
          <div 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={switchToProfileTab}
          >
            Личный кабинет
          </div>
        </div>
        
        {/* Контент вкладки анализа резюме */}
        {activeTab === 'analysis' && (
          <div className="analysis-content">
            <div className="section-title">
              <h2>Интеллектуальный анализ резюме</h2>
              <p>Загрузите документы для автоматической оценки соответствия кандидата требованиям вакансии</p>
            </div>
            
            <div className="upload-section">
              <div className="upload-row">
                {/* Левый элемент - Описание вакансии */}
                <div className="upload-col">
                  <h2>Описание вакансии</h2>
                  <FileUpload type="jobdesc" onFileChange={handleJobDescChange} />
                  {jobDescFile && (
                    <div className="file-status success">
                      <span className="status-icon">✓</span> Файл загружен
                    </div>
                  )}
                </div>
                
                {/* Правый элемент - Резюме кандидата */}
                <div className="upload-col">
                  <h2>Резюме кандидата</h2>
                  <FileUpload type="resume" onFileChange={handleResumeChange} />
                  {resumeFile && (
                    <div className="file-status success">
                      <span className="status-icon">✓</span> Файл загружен
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span> {error}
                </div>
              )}
              
              <div className="analyze-btn-container">
                <button 
                  className="analyze-btn" 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !resumeFile || !jobDescFile}
                >
                  {isAnalyzing ? 'Анализируем...' : 'Анализировать соответствие'}
                </button>
              </div>
            </div>

            {isAnalyzing && (
              <div className="analyzing-indicator">
                <div className="spinner"></div>
                <p>Анализируем резюме, пожалуйста подождите...</p>
                <div className="analysis-steps">
                  <div className="step active">Извлечение данных</div>
                  <div className="step">Анализ навыков</div>
                  <div className="step">Сравнение с вакансией</div>
                  <div className="step">Формирование результатов</div>
                </div>
              </div>
            )}

            {results && <ResultsCard results={results} />}
          </div>
        )}
        
        {/* Контент вкладки личного кабинета */}
        {activeTab === 'profile' && user && (
          <ProfileSection 
            user={user} 
            dashboardData={dashboardData} 
            onLogout={handleLogout} 
          />
        )}
      </main>
    </div>
  );
};

export default HomePage;
