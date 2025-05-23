import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardHero.css';
import FileUpload from './FileUpload';
import ResultsCard from './ResultsCard';
import CandidateComparisonTable from './CandidateComparisonTable';
import openaiService from '../services/openaiService';
import fileService from '../services/fileService';

const DashboardHero = () => {
  const navigate = useNavigate();
  
  // Состояния для файлов и анализа
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescFile, setJobDescFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('resume'); // resume | match
  
  // Состояния для сравнения кандидатов
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [bestCandidate, setBestCandidate] = useState(null);

  // Статистика пользователя
  const [stats, setStats] = useState({
    analyzed: 24,
    matches: 8,
    inProgress: 3,
    daysLeft: 18
  });
  
  // Обработчики событий
  const handleNewAnalysis = useCallback(() => {
    setShowUploadModal(true);
    setActiveTab('resume');
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowUploadModal(false);
  }, []);

  const handleResumeChange = useCallback((file) => {
    setResumeFile(file);
    setResults(null);
    setError(null);
  }, []);

  const handleJobDescChange = useCallback((file) => {
    setJobDescFile(file);
    setResults(null);
    setError(null);
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!resumeFile || !jobDescFile) {
      setError('Пожалуйста, загрузите резюме и описание вакансии');
      return;
    }

    // Проверяем размер файлов
    if (resumeFile.size > 5 * 1024 * 1024 || jobDescFile.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5 МБ');
      return;
    }

    // Проверяем расширения файлов
    const validExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    const resumeExt = '.' + resumeFile.name.split('.').pop().toLowerCase();
    const jobDescExt = '.' + jobDescFile.name.split('.').pop().toLowerCase();
    
    if (!validExtensions.includes(resumeExt) || !validExtensions.includes(jobDescExt)) {
      setError('Поддерживаются только файлы в форматах PDF, DOC, DOCX и TXT');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Извлекаем текст из файлов
      let resumeText, jobDescText;
      try {
        resumeText = await fileService.processFile(resumeFile);
        jobDescText = await fileService.processFile(jobDescFile);
      } catch (fileError) {
        throw new Error(`Ошибка при обработке файла: ${fileError.message}`);
      }

      // Проверяем, что текст был успешно извлечен
      if (!resumeText || resumeText.trim().length === 0) {
        throw new Error('Не удалось извлечь текст из файла резюме');
      }
      
      if (!jobDescText || jobDescText.trim().length === 0) {
        throw new Error('Не удалось извлечь текст из файла вакансии');
      }
      
      // Анализируем резюме с помощью OpenAI
      // В демо-режиме используем mock-данные (backend недоступен)
      let analysisResults;
      try {
        analysisResults = await openaiService.analyzeResume(resumeText, jobDescText);
      } catch (apiError) {
        throw new Error(`Ошибка API: ${apiError.message}`);
      }
      
      if (!analysisResults || analysisResults.error) {
        throw new Error(analysisResults?.message || 'Произошла неизвестная ошибка при анализе');
      }

      // Все проверки пройдены, анализ успешен
      setResults(analysisResults);
      
      // Закрываем модальное окно и показываем результаты
      setActiveTab('match'); // Переключаемся на результаты вместо закрытия модального окна
      
      // Обновляем статистику
      setStats(prevStats => ({
        ...prevStats,
        analyzed: prevStats.analyzed + 1,
        matches: analysisResults.score >= 70 ? prevStats.matches + 1 : prevStats.matches
      }));
      
      // Добавляем в последние активности
      const newActivity = {
        id: Date.now(),
        name: resumeFile.name.split('.')[0],
        position: jobDescFile.name.split('.')[0],
        score: Math.round(analysisResults.score || 0),
        date: 'Сейчас',
        status: analysisResults.score >= 80 ? 'high' : (analysisResults.score >= 60 ? 'medium' : 'low')
      };
      setRecentActivities([newActivity, ...recentActivities.slice(0, 4)]); // Сохраняем максимум 5 последних
      
    } catch (err) {
      console.error('Ошибка при анализе:', err);
      setError('Произошла ошибка при анализе резюме: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeFile, jobDescFile, recentActivities]);

  // Навигация по секциям и функциональность сравнения
  const handleNavigateToReports = useCallback(() => {
    // Показываем модальное окно вместо навигации к несуществующему маршруту
    alert('Раздел Отчёты в разработке');
    // В реальном приложении добавить маршрут в App.js
    // navigate('/reports');
  }, []);

  const handleNavigateToSettings = useCallback(() => {
    // Показываем модальное окно вместо навигации к несуществующему маршруту
    alert('Раздел Настройки в разработке');
    // В реальном приложении добавить маршрут в App.js
    // navigate('/settings');
  }, []);

  const handleViewAllActivities = useCallback(() => {
    // Показываем модальное окно вместо навигации к несуществующему маршруту
    alert('Раздел История анализов в разработке');
    // В реальном приложении добавить маршрут в App.js
    // navigate('/history');
  }, []);
  
  // Обработчики для сравнения кандидатов
  const handleOpenComparison = useCallback(() => {
    // Проверяем, есть ли у нас достаточно активностей для сравнения
    if (recentActivities.length < 2) {
      alert('Для сравнения необходимо минимум 2 проанализированных кандидата. Проведите больше анализов.');
      return;
    }
    
    // По умолчанию выбираем все последние активности для сравнения
    // Здесь мы добавляем в них также results для полного сравнения
    // В реальном приложении эти данные будут получены из API
    const candidatesWithResults = recentActivities.slice(0, Math.min(5, recentActivities.length)).map(activity => {
      // Создаём мок-данные для демонстрации
      const mockResults = {
        score: activity.score,
        skills: [
          { name: 'JavaScript', match: Math.floor(70 + Math.random() * 25), level: 'Продвинутый' },
          { name: 'React', match: Math.floor(65 + Math.random() * 30), level: 'Средний' },
          { name: 'Node.js', match: Math.floor(60 + Math.random() * 35), level: activity.score > 85 ? 'Продвинутый' : 'Базовый' },
          { name: 'SQL', match: Math.floor(50 + Math.random() * 40), level: 'Базовый' },
          { name: 'Коммуникабельность', match: Math.floor(75 + Math.random() * 20), level: 'Высокий' },
        ],
        experience: {
          match: Math.floor(65 + Math.random() * 25),
          years: 2 + Math.floor(Math.random() * 5),
          companies: [`Компания ${String.fromCharCode(65 + Math.floor(Math.random() * 10))}`]
        },
        education: {
          match: Math.floor(60 + Math.random() * 30),
          degree: 'Бакалавр',
          university: 'Университет'
        },
        risks: [
          activity.score < 80 ? 'Недостаточный опыт работы с технологиями' : 'Нет опыта работы в крупных проектах',
          'Нет сертификатов по технологиям'
        ]
      };
      
      return {
        ...activity,
        results: mockResults
      };
    });
    
    setSelectedCandidates(candidatesWithResults);
    setShowComparisonModal(true);
  }, [recentActivities]);
  
  const handleCloseComparison = useCallback(() => {
    setShowComparisonModal(false);
  }, []);
  
  const handleSelectBestCandidate = useCallback((candidate) => {
    setBestCandidate(candidate);
    
    // Обновляем список активностей, отмечая лучшего кандидата
    const updatedActivities = recentActivities.map(activity => {
      if (activity.id === candidate.id) {
        return { ...activity, isBest: true };
      }
      return { ...activity, isBest: false };
    });
    
    setRecentActivities(updatedActivities);
    setShowComparisonModal(false);
    
    // Показываем уведомление о выборе лучшего кандидата
    alert(`Кандидат "${candidate.name}" был выбран как лучший кандидат на позицию. Вы можете начать процесс найма.`);
  }, [recentActivities]);

  // Загрузка последних активностей при монтировании компонента
  useEffect(() => {
    // В реальном проекте здесь был бы API запрос
    // Имитация загрузки данных
    const mockActivities = [
      {
        id: 1,
        name: 'Андрей Петров',
        position: 'Frontend разработчик',
        score: 92,
        date: 'Сегодня, 14:25',
        status: 'high'
      },
      {
        id: 2,
        name: 'Елена Сидорова',
        position: 'UI/UX дизайнер',
        score: 78,
        date: 'Вчера, 18:40',
        status: 'medium'
      }
    ];
    
    setRecentActivities(mockActivities);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="dashboard-welcome">
            <h1 className="dashboard-title">Анализ резюме кандидатов</h1>
            <p className="dashboard-subtitle">Добрый день! Продолжите анализ резюме или загрузите новые файлы для оценки</p>
          </div>
          <div className="account-summary">
            <div className="subscription-info">
              <div className="badge-pro">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 0L10.2 5.5H16L11 9L12.5 16L8 12L3.5 16L5 9L0 5.5H5.8L8 0Z" fill="#3b82f6"/>
                </svg>
                <span>Бизнес-аккаунт</span>
              </div>
              <div className="subscription-details">
                <span className="days-left">Осталось {stats.daysLeft} дней</span>
                <a href="#" className="manage-link">Управление</a>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{stats.analyzed}</div>
            <div className="stat-label">Проанализировано резюме</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.matches}</div>
            <div className="stat-label">Подходящих кандидатов</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">В процессе</div>
          </div>
          <div className="stat-card actions-card">
            <button className="new-analysis-btn" onClick={handleNewAnalysis}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 4V12M4 8H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Новый анализ
            </button>
          </div>
        </div>

        <div className="quick-tools">
          <div className="tools-section">
            <h2 className="tools-heading">Инструменты анализа</h2>
            <div className="tools-grid">
              <button className="tool-card" onClick={handleNewAnalysis}>
                <div className="tool-icon resume-icon"></div>
                <div className="tool-name">Анализ резюме</div>
              </button>
              <button className="tool-card" onClick={handleOpenComparison}>
                <div className="tool-icon match-icon"></div>
                <div className="tool-name">Сопоставление</div>
              </button>
              <button className="tool-card" onClick={handleNavigateToReports}>
                <div className="tool-icon reports-icon"></div>
                <div className="tool-name">Отчёты</div>
              </button>
              <button className="tool-card" onClick={handleNavigateToSettings}>
                <div className="tool-icon settings-icon"></div>
                <div className="tool-name">Настройки</div>
              </button>
            </div>
          </div>
        </div>
        
        {/* Отображение результатов, если они есть */}
        {results && <ResultsCard results={results} />}
        
        <div className="recent-activity">
          <div className="activity-header">
            <h2 className="activity-heading">Последние анализы</h2>
            <button className="view-all-link" onClick={handleViewAllActivities}>Смотреть все</button>
          </div>
          
          <div className="activity-items">
            {recentActivities.map(activity => (
              <div className="activity-item" key={activity.id}>
                <div className={`activity-icon match-${activity.status}`}></div>
                <div className="activity-details">
                  <div className="activity-title">{activity.name} – {activity.position}</div>
                  <div className="activity-meta">
                    <span className="activity-score">Соответствие: {activity.score}%</span>
                    <span className="activity-time">{activity.date}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {recentActivities.length === 0 && (
              <div className="no-activities">Нет последних анализов</div>
            )}
          </div>
        </div>
        
        {/* Модальное окно для загрузки файлов */}
        {showUploadModal && (
          <div className="modal-overlay">
            <div className="upload-modal">
              <div className="modal-header">
                <h3>Новый анализ резюме</h3>
                <button className="close-button" onClick={handleCloseModal}>&times;</button>
              </div>
              
              <div className="modal-tabs">
                <button 
                  className={`modal-tab ${activeTab === 'resume' ? 'active' : ''}`}
                  onClick={() => setActiveTab('resume')}
                >
                  Загрузка файлов
                </button>
                <button 
                  className={`modal-tab ${activeTab === 'match' ? 'active' : ''}`}
                  onClick={() => setActiveTab('match')}
                  disabled={!resumeFile || !jobDescFile}
                >
                  Результаты анализа
                </button>
              </div>
              
              <div className="modal-content">
                {activeTab === 'resume' ? (
                  <div className="upload-section">
                    <div className="upload-row">
                      {/* Описание вакансии */}
                      <div className="upload-col">
                        <h2>Описание вакансии</h2>
                        <FileUpload type="jobdesc" onFileChange={handleJobDescChange} />
                        {jobDescFile && (
                          <div className="file-status success">
                            <span className="status-icon">✓</span> Файл загружен
                          </div>
                        )}
                      </div>
                      
                      {/* Резюме кандидата */}
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
                    
                    <div className="modal-actions">
                      <button 
                        className="analyze-btn" 
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !resumeFile || !jobDescFile}
                      >
                        {isAnalyzing ? 'Анализируем...' : (!resumeFile || !jobDescFile) ? 'Загрузите файлы' : 'Анализировать соответствие'}
                      </button>
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
                  </div>
                ) : (
                  <div className="results-section">
                    {results ? (
                      <ResultsCard results={results} />
                    ) : (
                      <div className="no-results">
                        <p>Сначала выполните анализ резюме</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Модальное окно для сравнения кандидатов */}
        {showComparisonModal && (
          <div className="modal-overlay">
            <div className="comparison-modal">
              <CandidateComparisonTable 
                candidates={selectedCandidates}
                onSelectBest={handleSelectBestCandidate}
                onClose={handleCloseComparison}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHero;
