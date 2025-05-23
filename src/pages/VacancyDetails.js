import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/VacancyDetails.css';

const VacancyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewData, setInterviewData] = useState({
    candidateName: '',
    candidateEmail: '',
    scheduledAt: ''
  });
  
  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        setLoading(true);
        // В режиме разработки используем моковые данные
        if (localStorage.getItem('token') === 'dev-token') {
          const mockVacancy = {
            id: parseInt(id),
            title: 'React Frontend Developer',
            description: 'Мы ищем опытного React разработчика для создания современных интерфейсов и работы с нашей командой над инновационными проектами.',
            requirements: {
              skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'REST API'],
              experience: ['Опыт коммерческой разработки от 2 лет', 'Опыт работы с современными фреймворками']
            },
            interview_type: 'smart',
            evaluation_criteria: {
              technical_skills: 60,
              soft_skills: 20,
              experience: 15,
              culture_fit: 5
            },
            is_active: true,
            created_at: '2025-04-25T12:00:00Z',
            user_id: 1,
            interviews_count: 5,
            completed_interviews_count: 3
          };
          
          setTimeout(() => {
            setVacancy(mockVacancy);
            setLoading(false);
          }, 500);
          return;
        }
        
        // Реальный запрос к API
        const response = await axios.get(`/api/v1/vacancies/${id}`);
        setVacancy(response.data);
      } catch (err) {
        console.error('Ошибка при получении данных о вакансии:', err);
        setError('Не удалось загрузить данные о вакансии');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVacancy();
  }, [id]);
  
  const handleInterviewModalOpen = () => {
    setShowInterviewModal(true);
  };
  
  const handleInterviewModalClose = () => {
    setShowInterviewModal(false);
    setInterviewData({
      candidateName: '',
      candidateEmail: '',
      scheduledAt: ''
    });
  };
  
  const handleInterviewDataChange = (e) => {
    setInterviewData({
      ...interviewData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleCreateInterview = async (e) => {
    e.preventDefault();
    
    try {
      // В режиме разработки просто перенаправляем на страницу интервью
      if (localStorage.getItem('token') === 'dev-token') {
        handleInterviewModalClose();
        navigate('/interviews');
        return;
      }
      
      // Реальный запрос к API
      const response = await axios.post('/api/v1/interviews', {
        vacancy_id: parseInt(id),
        candidate_name: interviewData.candidateName,
        candidate_email: interviewData.candidateEmail,
        scheduled_at: interviewData.scheduledAt || null
      });
      
      // Закрываем модальное окно и перенаправляем на страницу интервью
      handleInterviewModalClose();
      navigate(`/interviews/${response.data.id}`);
    } catch (err) {
      console.error('Ошибка при создании интервью:', err);
      setError('Не удалось создать интервью');
    }
  };
  
  if (loading) {
    return (
      <div className="vacancy-details-page">
        <div className="vacancy-details-container loading">
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Загрузка данных о вакансии...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !vacancy) {
    return (
      <div className="vacancy-details-page">
        <div className="vacancy-details-container error">
          <h2>Ошибка</h2>
          <p>{error || 'Вакансия не найдена'}</p>
          <button 
            className="back-button"
            onClick={() => navigate('/vacancies')}
          >
            Вернуться к списку вакансий
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="vacancy-details-page">
      <div className="vacancy-details-container">
        <div className="vacancy-details-header">
          <h1>{vacancy.title}</h1>
          <div className="vacancy-actions">
            <button 
              className="edit-button"
              onClick={() => navigate(`/vacancies/edit/${vacancy.id}`)}
            >
              Редактировать
            </button>
            <button 
              className="interviews-button"
              onClick={() => navigate(`/vacancies/${vacancy.id}/interviews`)}
            >
              Все интервью ({vacancy.interviews_count || 0})
            </button>
            <button 
              className="create-interview-button"
              onClick={handleInterviewModalOpen}
            >
              Создать интервью
            </button>
          </div>
        </div>
        
        <div className="vacancy-status">
          <span className={`status-badge ${vacancy.is_active ? 'active' : 'inactive'}`}>
            {vacancy.is_active ? 'Активна' : 'Неактивна'}
          </span>
          <span className="date-created">
            Создана: {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
          </span>
        </div>
        
        <div className="vacancy-details-content">
          <section className="vacancy-description">
            <h2>Описание вакансии</h2>
            <div className="description-text">
              {vacancy.description}
            </div>
          </section>
          
          <section className="vacancy-requirements">
            <h2>Требования</h2>
            
            <div className="requirements-section">
              <h3>Навыки и технологии</h3>
              <div className="tags-container">
                {vacancy.requirements.skills.map((skill, index) => (
                  <span key={index} className="requirement-tag">{skill}</span>
                ))}
              </div>
            </div>
            
            <div className="requirements-section">
              <h3>Опыт работы</h3>
              <ul className="experience-list">
                {vacancy.requirements.experience.map((exp, index) => (
                  <li key={index}>{exp}</li>
                ))}
              </ul>
            </div>
          </section>
          
          <section className="vacancy-interview-settings">
            <h2>Параметры интервью</h2>
            
            <div className="interview-type">
              <h3>Тип интервью</h3>
              <span className={`interview-type-badge ${vacancy.interview_type === 'smart' ? 'smart' : 'manual'}`}>
                {vacancy.interview_type === 'smart' ? 'AI-интервью' : 'Ручное интервью'}
              </span>
            </div>
            
            <div className="evaluation-criteria">
              <h3>Критерии оценки</h3>
              <div className="criteria-bars">
                <div className="criteria-item">
                  <div className="criteria-label">
                    <span>Технические навыки</span>
                    <span>{vacancy.evaluation_criteria.technical_skills}%</span>
                  </div>
                  <div className="criteria-bar">
                    <div 
                      className="criteria-progress technical" 
                      style={{width: `${vacancy.evaluation_criteria.technical_skills}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="criteria-item">
                  <div className="criteria-label">
                    <span>Софт-скиллы</span>
                    <span>{vacancy.evaluation_criteria.soft_skills}%</span>
                  </div>
                  <div className="criteria-bar">
                    <div 
                      className="criteria-progress soft" 
                      style={{width: `${vacancy.evaluation_criteria.soft_skills}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="criteria-item">
                  <div className="criteria-label">
                    <span>Опыт работы</span>
                    <span>{vacancy.evaluation_criteria.experience}%</span>
                  </div>
                  <div className="criteria-bar">
                    <div 
                      className="criteria-progress experience" 
                      style={{width: `${vacancy.evaluation_criteria.experience}%`}}
                    ></div>
                  </div>
                </div>
                
                <div className="criteria-item">
                  <div className="criteria-label">
                    <span>Культурное соответствие</span>
                    <span>{vacancy.evaluation_criteria.culture_fit}%</span>
                  </div>
                  <div className="criteria-bar">
                    <div 
                      className="criteria-progress culture" 
                      style={{width: `${vacancy.evaluation_criteria.culture_fit}%`}}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        
        <div className="vacancy-details-footer">
          <button 
            className="back-button"
            onClick={() => navigate('/vacancies')}
          >
            Вернуться к списку вакансий
          </button>
        </div>
      </div>
      
      {showInterviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Создание нового интервью</h2>
              <button 
                className="modal-close-button"
                onClick={handleInterviewModalClose}
              >
                &times;
              </button>
            </div>
            
            <form onSubmit={handleCreateInterview}>
              <div className="form-group">
                <label htmlFor="candidateName">Имя кандидата</label>
                <input
                  type="text"
                  id="candidateName"
                  name="candidateName"
                  value={interviewData.candidateName}
                  onChange={handleInterviewDataChange}
                  required
                  placeholder="Иван Иванов"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="candidateEmail">Email кандидата</label>
                <input
                  type="email"
                  id="candidateEmail"
                  name="candidateEmail"
                  value={interviewData.candidateEmail}
                  onChange={handleInterviewDataChange}
                  required
                  placeholder="candidate@example.com"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="scheduledAt">Дата и время интервью (опционально)</label>
                <input
                  type="datetime-local"
                  id="scheduledAt"
                  name="scheduledAt"
                  value={interviewData.scheduledAt}
                  onChange={handleInterviewDataChange}
                />
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={handleInterviewModalClose}
                >
                  Отмена
                </button>
                <button 
                  type="submit" 
                  className="confirm-button"
                >
                  Создать интервью
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VacancyDetails;
