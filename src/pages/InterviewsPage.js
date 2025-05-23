import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import DashboardHeader from '../components/DashboardHeader';
import axios from 'axios';
import '../assets/css/InterviewsPage.css';

const InterviewsPage = () => {
  const { vacancyId } = useParams();
  const location = useLocation();
  const [vacancy, setVacancy] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'scheduled', 'completed', 'pending'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    vacancy_id: vacancyId || '',
    candidate_name: '',
    candidate_email: '',
    scheduled_at: '',
    scheduled_time: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [vacanciesList, setVacanciesList] = useState([]);

  const itemsPerPage = 10;

  // Загрузка списка вакансий, если мы находимся в общем режиме просмотра интервью
  useEffect(() => {
    if (!vacancyId) {
      fetchVacancies();
    }
  }, [vacancyId]);

  const fetchVacancies = async () => {
    try {
      const response = await axios.get('/api/v1/vacancies', {
        params: {
          is_active: true,
          limit: 100
        }
      });
      setVacanciesList(response.data.items);
      
      // Если список не пуст, установим первую вакансию по умолчанию в форме создания
      if (response.data.items.length > 0 && !createFormData.vacancy_id) {
        setCreateFormData(prev => ({
          ...prev,
          vacancy_id: response.data.items[0].id.toString()
        }));
      }
    } catch (err) {
      console.error('Ошибка при загрузке вакансий:', err);
    }
  };

  // Загрузка данных вакансии, если мы находимся в режиме просмотра для конкретной вакансии
  useEffect(() => {
    if (vacancyId) {
      fetchVacancy();
    }
  }, [vacancyId]);

  const fetchVacancy = async () => {
    try {
      const response = await axios.get(`/api/v1/vacancies/${vacancyId}`);
      setVacancy(response.data);
      
      // Установим vacancy_id в форме создания
      setCreateFormData(prev => ({
        ...prev,
        vacancy_id: vacancyId
      }));
    } catch (err) {
      console.error('Ошибка при загрузке данных вакансии:', err);
      setError('Не удалось загрузить данные вакансии. Проверьте, существует ли она.');
    }
  };

  // Загрузка интервью
  useEffect(() => {
    fetchInterviews();
  }, [vacancyId, currentPage, filter, sortBy, sortDirection]);

  const fetchInterviews = async () => {
    setLoading(true);
    try {
      const url = vacancyId 
        ? `/api/v1/vacancies/${vacancyId}/interviews` 
        : '/api/v1/interviews';
      
      const response = await axios.get(url, {
        params: {
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
          search: searchTerm || undefined,
          status: filter === 'all' ? undefined : filter,
          sort_by: sortBy,
          sort_direction: sortDirection
        }
      });
      
      setInterviews(response.data.items);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке интервью:', err);
      setError('Не удалось загрузить интервью. Пожалуйста, попробуйте позже.');
      setLoading(false);
    }
  };

  // Функция для обработки поиска
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Сбрасываем на первую страницу при новом поиске
    fetchInterviews();
  };

  // Функция для обработки сортировки
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  // Форматирование даты и времени
  const formatDateTime = (dateString) => {
    if (!dateString) return 'Не указано';
    
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Определение статуса интервью для отображения
  const getInterviewStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Ожидает',
          className: 'interview-status-pending',
          icon: 'fas fa-clock'
        };
      case 'scheduled':
        return {
          label: 'Запланировано',
          className: 'interview-status-scheduled',
          icon: 'fas fa-calendar-alt'
        };
      case 'in_progress':
        return {
          label: 'В процессе',
          className: 'interview-status-in-progress',
          icon: 'fas fa-spinner fa-spin'
        };
      case 'completed':
        return {
          label: 'Завершено',
          className: 'interview-status-completed',
          icon: 'fas fa-check-circle'
        };
      case 'canceled':
        return {
          label: 'Отменено',
          className: 'interview-status-canceled',
          icon: 'fas fa-times-circle'
        };
      default:
        return {
          label: 'Неизвестно',
          className: 'interview-status-unknown',
          icon: 'fas fa-question-circle'
        };
    }
  };

  // Пагинация
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Определяем диапазон отображаемых страниц
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Корректируем начальную страницу, если диапазон неполный
    if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Кнопка "Предыдущая"
    pages.push(
      <button 
        key="prev" 
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-button"
      >
        &laquo;
      </button>
    );
    
    // Первая страница, если не видна
    if (startPage > 1) {
      pages.push(
        <button 
          key={1} 
          onClick={() => handlePageChange(1)}
          className={`pagination-button ${currentPage === 1 ? 'active' : ''}`}
        >
          1
        </button>
      );
      
      // Троеточие, если есть пропуск
      if (startPage > 2) {
        pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
      }
    }
    
    // Основные страницы
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button 
          key={i} 
          onClick={() => handlePageChange(i)}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
        >
          {i}
        </button>
      );
    }
    
    // Последняя страница, если не видна
    if (endPage < totalPages) {
      // Троеточие, если есть пропуск
      if (endPage < totalPages - 1) {
        pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      }
      
      pages.push(
        <button 
          key={totalPages} 
          onClick={() => handlePageChange(totalPages)}
          className={`pagination-button ${currentPage === totalPages ? 'active' : ''}`}
        >
          {totalPages}
        </button>
      );
    }
    
    // Кнопка "Следующая"
    pages.push(
      <button 
        key="next" 
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-button"
      >
        &raquo;
      </button>
    );
    
    return <div className="pagination">{pages}</div>;
  };

  // Обработка изменений в форме создания интервью
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Сбрасываем ошибку при изменении поля
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Комбинируем дату и время для отправки на сервер
  const combineDateTime = () => {
    if (!createFormData.scheduled_at || !createFormData.scheduled_time) {
      return null;
    }
    
    const dateStr = createFormData.scheduled_at;
    const timeStr = createFormData.scheduled_time;
    
    return `${dateStr}T${timeStr}:00`;
  };

  // Валидация формы создания интервью
  const validateCreateForm = () => {
    const errors = {};
    
    if (!createFormData.vacancy_id) {
      errors.vacancy_id = 'Выберите вакансию';
    }
    
    if (!createFormData.candidate_name) {
      errors.candidate_name = 'Введите имя кандидата';
    }
    
    if (!createFormData.candidate_email) {
      errors.candidate_email = 'Введите email кандидата';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(createFormData.candidate_email)) {
      errors.candidate_email = 'Некорректный email адрес';
    }
    
    if (createFormData.scheduled_at && !createFormData.scheduled_time) {
      errors.scheduled_time = 'Укажите время интервью';
    }
    
    if (createFormData.scheduled_time && !createFormData.scheduled_at) {
      errors.scheduled_at = 'Укажите дату интервью';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Отправка формы создания интервью
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateCreateForm()) {
      return;
    }
    
    setFormSubmitting(true);
    
    // Подготовка данных для отправки
    const submitData = {
      vacancy_id: parseInt(createFormData.vacancy_id, 10),
      candidate_name: createFormData.candidate_name,
      candidate_email: createFormData.candidate_email
    };
    
    // Добавляем дату, если она указана
    const scheduledDateTime = combineDateTime();
    if (scheduledDateTime) {
      submitData.scheduled_at = scheduledDateTime;
    }
    
    try {
      await axios.post('/api/v1/interviews', submitData);
      
      // Сбрасываем форму и закрываем модальное окно
      setCreateFormData({
        vacancy_id: vacancyId || (vacanciesList.length > 0 ? vacanciesList[0].id.toString() : ''),
        candidate_name: '',
        candidate_email: '',
        scheduled_at: '',
        scheduled_time: ''
      });
      
      setShowCreateModal(false);
      
      // Обновляем список интервью
      fetchInterviews();
    } catch (err) {
      console.error('Ошибка при создании интервью:', err);
      
      // Обработка ошибок валидации с сервера
      if (err.response && err.response.data && err.response.data.detail) {
        const serverErrors = {};
        
        if (Array.isArray(err.response.data.detail)) {
          err.response.data.detail.forEach(item => {
            const fieldName = item.loc[item.loc.length - 1];
            serverErrors[fieldName] = item.msg;
          });
        } else {
          serverErrors.general = err.response.data.detail;
        }
        
        setFormErrors(prev => ({
          ...prev,
          ...serverErrors
        }));
      } else {
        setFormErrors(prev => ({
          ...prev,
          general: 'Произошла ошибка при создании интервью. Пожалуйста, попробуйте позже.'
        }));
      }
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="interviews-page">
      <DashboardHeader />
      
      <div className="interviews-container">
        <div className="interviews-header">
          {vacancy ? (
            <div className="vacancy-info">
              <h1>Интервью для вакансии</h1>
              <div className="vacancy-title">
                <Link to={`/vacancies/${vacancy.id}`}>{vacancy.title}</Link>
              </div>
            </div>
          ) : (
            <h1>Управление интервью</h1>
          )}
          
          <button
            className="create-interview-button"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fas fa-plus"></i> Создать интервью
          </button>
        </div>
        
        <div className="interviews-filters">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Поиск интервью..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              <i className="fas fa-search"></i>
            </button>
          </form>
          
          <div className="filter-buttons">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Все
            </button>
            <button
              className={`filter-button ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Ожидают
            </button>
            <button
              className={`filter-button ${filter === 'scheduled' ? 'active' : ''}`}
              onClick={() => setFilter('scheduled')}
            >
              Запланированы
            </button>
            <button
              className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              Завершены
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка интервью...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={fetchInterviews} className="retry-button">
              Повторить
            </button>
          </div>
        ) : interviews.length === 0 ? (
          <div className="empty-interviews">
            <i className="fas fa-user-tie"></i>
            <p>Интервью не найдены</p>
            {searchTerm && (
              <p className="empty-interviews-hint">
                Попробуйте изменить параметры поиска или{' '}
                <button onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                  fetchInterviews();
                }} className="reset-search">
                  сбросить фильтры
                </button>
              </p>
            )}
            {!searchTerm && filter !== 'all' && (
              <p className="empty-interviews-hint">
                Попробуйте изменить фильтр или{' '}
                <button onClick={() => setFilter('all')} className="reset-search">
                  показать все интервью
                </button>
              </p>
            )}
            {!searchTerm && filter === 'all' && (
              <p className="empty-interviews-hint">
                <button 
                  onClick={() => setShowCreateModal(true)} 
                  className="create-first-interview"
                >
                  Создайте первое интервью
                </button>
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="interviews-table">
              <div className="interviews-table-header">
                {!vacancyId && (
                  <div className="interview-header-cell" onClick={() => handleSort('vacancy_title')}>
                    Вакансия
                    {sortBy === 'vacancy_title' && (
                      <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                    )}
                  </div>
                )}
                <div className="interview-header-cell" onClick={() => handleSort('candidate_name')}>
                  Кандидат
                  {sortBy === 'candidate_name' && (
                    <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                  )}
                </div>
                <div className="interview-header-cell" onClick={() => handleSort('status')}>
                  Статус
                  {sortBy === 'status' && (
                    <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                  )}
                </div>
                <div className="interview-header-cell" onClick={() => handleSort('scheduled_at')}>
                  Дата интервью
                  {sortBy === 'scheduled_at' && (
                    <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                  )}
                </div>
                <div className="interview-header-cell" onClick={() => handleSort('created_at')}>
                  Дата создания
                  {sortBy === 'created_at' && (
                    <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                  )}
                </div>
                <div className="interview-header-cell">Действия</div>
              </div>
              
              <div className="interviews-table-body">
                {interviews.map((interview) => {
                  const statusInfo = getInterviewStatusInfo(interview.status);
                  
                  return (
                    <div key={interview.id} className="interview-row">
                      {!vacancyId && (
                        <div className="interview-cell interview-vacancy">
                          <Link to={`/vacancies/${interview.vacancy_id}`} className="vacancy-link">
                            {interview.vacancy_title}
                          </Link>
                        </div>
                      )}
                      <div className="interview-cell interview-candidate">
                        <span className="candidate-name">
                          {interview.candidate_name || 'Без имени'}
                        </span>
                        {interview.candidate_email && (
                          <span className="candidate-email">
                            {interview.candidate_email}
                          </span>
                        )}
                      </div>
                      <div className="interview-cell interview-status">
                        <span className={`status-badge ${statusInfo.className}`}>
                          <i className={statusInfo.icon}></i>
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="interview-cell interview-date">
                        {interview.scheduled_at ? (
                          formatDateTime(interview.scheduled_at)
                        ) : (
                          <span className="not-scheduled">Не запланировано</span>
                        )}
                      </div>
                      <div className="interview-cell interview-created">
                        {formatDateTime(interview.created_at)}
                      </div>
                      <div className="interview-cell interview-actions">
                        <Link to={`/interviews/${interview.id}`} className="action-button view-button" title="Просмотр">
                          <i className="fas fa-eye"></i>
                        </Link>
                        
                        {interview.has_report && (
                          <Link to={`/interviews/${interview.id}/report`} className="action-button report-button" title="Отчет">
                            <i className="fas fa-file-alt"></i>
                          </Link>
                        )}
                        
                        {interview.status === 'pending' && (
                          <button className="action-button schedule-button" title="Запланировать">
                            <i className="fas fa-calendar-plus"></i>
                          </button>
                        )}
                        
                        {interview.status === 'pending' || interview.status === 'scheduled' ? (
                          <button className="action-button link-button" title="Ссылка для кандидата">
                            <i className="fas fa-link"></i>
                          </button>
                        ) : null}
                        
                        {interview.status !== 'completed' && interview.status !== 'canceled' && (
                          <button className="action-button cancel-button" title="Отменить">
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {totalPages > 1 && renderPagination()}
          </>
        )}
      </div>
      
      {/* Модальное окно создания интервью */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="create-interview-modal">
            <div className="modal-header">
              <h2>Создание нового интервью</h2>
              <button 
                className="modal-close-button"
                onClick={() => setShowCreateModal(false)}
                disabled={formSubmitting}
              >
                &times;
              </button>
            </div>
            
            <div className="modal-body">
              {formErrors.general && (
                <div className="form-error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  <p>{formErrors.general}</p>
                </div>
              )}
              
              <form onSubmit={handleCreateSubmit} className="create-interview-form">
                {!vacancyId && (
                  <div className="form-group">
                    <label htmlFor="vacancy_id">Вакансия *</label>
                    <select
                      id="vacancy_id"
                      name="vacancy_id"
                      value={createFormData.vacancy_id}
                      onChange={handleCreateFormChange}
                      className={formErrors.vacancy_id ? 'form-select error' : 'form-select'}
                      disabled={formSubmitting}
                    >
                      <option value="">Выберите вакансию</option>
                      {vacanciesList.map(vac => (
                        <option key={vac.id} value={vac.id}>
                          {vac.title}
                        </option>
                      ))}
                    </select>
                    {formErrors.vacancy_id && (
                      <p className="error-text">{formErrors.vacancy_id}</p>
                    )}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="candidate_name">Имя кандидата *</label>
                  <input
                    type="text"
                    id="candidate_name"
                    name="candidate_name"
                    value={createFormData.candidate_name}
                    onChange={handleCreateFormChange}
                    className={formErrors.candidate_name ? 'form-input error' : 'form-input'}
                    placeholder="Введите полное имя кандидата"
                    disabled={formSubmitting}
                  />
                  {formErrors.candidate_name && (
                    <p className="error-text">{formErrors.candidate_name}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="candidate_email">Email кандидата *</label>
                  <input
                    type="email"
                    id="candidate_email"
                    name="candidate_email"
                    value={createFormData.candidate_email}
                    onChange={handleCreateFormChange}
                    className={formErrors.candidate_email ? 'form-input error' : 'form-input'}
                    placeholder="email@example.com"
                    disabled={formSubmitting}
                  />
                  {formErrors.candidate_email && (
                    <p className="error-text">{formErrors.candidate_email}</p>
                  )}
                </div>
                
                <div className="form-group-row">
                  <div className="form-group">
                    <label htmlFor="scheduled_at">Дата интервью</label>
                    <input
                      type="date"
                      id="scheduled_at"
                      name="scheduled_at"
                      value={createFormData.scheduled_at}
                      onChange={handleCreateFormChange}
                      className={formErrors.scheduled_at ? 'form-input error' : 'form-input'}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={formSubmitting}
                    />
                    {formErrors.scheduled_at && (
                      <p className="error-text">{formErrors.scheduled_at}</p>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="scheduled_time">Время интервью</label>
                    <input
                      type="time"
                      id="scheduled_time"
                      name="scheduled_time"
                      value={createFormData.scheduled_time}
                      onChange={handleCreateFormChange}
                      className={formErrors.scheduled_time ? 'form-input error' : 'form-input'}
                      disabled={formSubmitting}
                    />
                    {formErrors.scheduled_time && (
                      <p className="error-text">{formErrors.scheduled_time}</p>
                    )}
                  </div>
                </div>
                
                <div className="form-hint text-center">
                  Если дата и время не указаны, будет создано интервью без предварительного расписания.
                  Вы сможете назначить дату позже.
                </div>
                
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={formSubmitting}
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="save-button"
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? (
                      <>
                        <span className="button-spinner"></span>
                        Создание...
                      </>
                    ) : 'Создать интервью'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewsPage;
