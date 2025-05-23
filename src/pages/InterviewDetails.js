import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/InterviewDetails.css';

const InterviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  
  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        // В режиме разработки используем моковые данные
        if (localStorage.getItem('token') === 'dev-token') {
          const mockInterview = {
            id: parseInt(id),
            vacancy_id: 1,
            vacancy: {
              id: 1,
              title: 'React Frontend Developer'
            },
            candidate_name: 'Алексей Петров',
            candidate_email: 'alexey@example.com',
            status: 'ожидается',
            access_link: `http://localhost:3000/interview/${id}/candidate-access-xyz`,
            scheduled_at: '2025-05-10T14:00:00Z',
            created_at: '2025-05-07T10:00:00Z',
            questions: [
              {
                id: 1,
                question_text: 'Расскажите о вашем опыте работы с React',
                order: 1,
                category: 'technical',
                answer: null
              },
              {
                id: 2,
                question_text: 'Как вы решаете конфликты в команде?',
                order: 2,
                category: 'soft',
                answer: null
              }
            ],
            report: null
          };
          
          setTimeout(() => {
            setInterview(mockInterview);
            setLoading(false);
          }, 500);
          return;
        }
        
        // Реальный запрос к API
        const response = await axios.get(`/api/v1/interviews/${id}`);
        setInterview(response.data);
      } catch (err) {
        console.error('Ошибка при получении данных об интервью:', err);
        setError('Не удалось загрузить данные об интервью');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInterview();
  }, [id]);
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'ожидается':
        return 'pending';
      case 'запланировано':
        return 'scheduled';
      case 'в процессе':
        return 'progress';
      case 'завершено':
        return 'completed';
      case 'отменено':
        return 'cancelled';
      default:
        return 'pending';
    }
  };
  
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'Не задано';
    const date = new Date(dateTimeStr);
    return date.toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const copyAccessLink = () => {
    if (!interview) return;
    
    navigator.clipboard.writeText(interview.access_link);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const sendInvitationEmail = async () => {
    try {
      // В режиме разработки просто закрываем модальное окно
      if (localStorage.getItem('token') === 'dev-token') {
        setShowEmailModal(false);
        return;
      }
      
      // Реальный запрос к API
      await axios.post(`/api/v1/interviews/${id}/send-invitation`);
      setShowEmailModal(false);
    } catch (err) {
      console.error('Ошибка при отправке приглашения:', err);
      setError('Не удалось отправить приглашение');
    }
  };
  
  if (loading) {
    return (
      <div className="interview-details-page">
        <div className="interview-details-container loading">
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Загрузка данных об интервью...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !interview) {
    return (
      <div className="interview-details-page">
        <div className="interview-details-container error">
          <h2>Ошибка</h2>
          <p>{error || 'Интервью не найдено'}</p>
          <button 
            className="back-button"
            onClick={() => navigate('/interviews')}
          >
            Вернуться к списку интервью
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="interview-details-page">
      <div className="interview-details-container">
        <div className="interview-details-header">
          <div className="header-info">
            <h1>Интервью: {interview.candidate_name}</h1>
            <div className="vacancy-link">
              Вакансия: <Link to={`/vacancies/${interview.vacancy_id}`}>{interview.vacancy.title}</Link>
            </div>
          </div>
          
          <div className="interview-actions">
            {interview.status === 'завершено' && (
              <button 
                className="view-report-button"
                onClick={() => navigate(`/interviews/${interview.id}/report`)}
              >
                Просмотреть отчет
              </button>
            )}
            
            {(interview.status === 'ожидается' || interview.status === 'запланировано') && (
              <button 
                className="send-invitation-button"
                onClick={() => setShowEmailModal(true)}
              >
                Отправить приглашение
              </button>
            )}
          </div>
        </div>
        
        <div className="interview-status-bar">
          <div className="candidate-info">
            <div className="info-item">
              <span className="label">Кандидат:</span>
              <span className="value">{interview.candidate_name}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{interview.candidate_email}</span>
            </div>
          </div>
          
          <div className="status-container">
            <span className={`status-badge ${getStatusClass(interview.status)}`}>
              {interview.status}
            </span>
          </div>
        </div>
        
        <div className="interview-details-content">
          <section className="interview-dates">
            <div className="date-item">
              <span className="label">Дата создания:</span>
              <span className="value">{formatDateTime(interview.created_at)}</span>
            </div>
            
            <div className="date-item">
              <span className="label">Запланировано на:</span>
              <span className="value">{formatDateTime(interview.scheduled_at)}</span>
            </div>
          </section>
          
          <section className="access-link-section">
            <h2>Ссылка доступа для кандидата</h2>
            <div className="access-link-container">
              <input 
                type="text" 
                value={interview.access_link} 
                readOnly 
                className="access-link-input"
              />
              <button 
                className="copy-button"
                onClick={copyAccessLink}
              >
                {copied ? 'Скопировано!' : 'Копировать'}
              </button>
            </div>
            <p className="access-link-info">
              Отправьте эту ссылку кандидату, чтобы он мог пройти интервью. Ссылка уникальна и действительна до завершения интервью.
            </p>
          </section>
          
          <section className="interview-questions">
            <h2>Вопросы интервью</h2>
            
            {interview.questions && interview.questions.length > 0 ? (
              <div className="questions-list">
                {interview.questions.map((question, index) => (
                  <div key={question.id} className="question-item">
                    <div className="question-header">
                      <span className="question-number">Вопрос {index + 1}</span>
                      <span className={`question-category ${question.category}`}>
                        {question.category === 'technical' ? 'Технический' : 
                         question.category === 'soft' ? 'Софт-скилл' : 
                         question.category}
                      </span>
                    </div>
                    <div className="question-text">{question.question_text}</div>
                    <div className="question-status">
                      {question.answer ? (
                        <span className="answered">Отвечен</span>
                      ) : (
                        <span className="not-answered">Ожидает ответа</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-questions">Вопросы будут сгенерированы автоматически, когда кандидат начнет интервью.</p>
            )}
          </section>
        </div>
        
        <div className="interview-details-footer">
          <button 
            className="back-button"
            onClick={() => navigate('/interviews')}
          >
            Вернуться к списку интервью
          </button>
        </div>
      </div>
      
      {showEmailModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Отправить приглашение</h2>
              <button 
                className="modal-close-button"
                onClick={() => setShowEmailModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              <p>Отправить приглашение на прохождение интервью кандидату {interview.candidate_name} ({interview.candidate_email})?</p>
              <p>Письмо будет содержать ссылку доступа и информацию о вакансии.</p>
            </div>
            
            <div className="modal-footer">
              <button 
                className="cancel-button"
                onClick={() => setShowEmailModal(false)}
              >
                Отмена
              </button>
              <button 
                className="confirm-button"
                onClick={sendInvitationEmail}
              >
                Отправить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewDetails;
