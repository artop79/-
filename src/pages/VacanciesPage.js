import React, { useState, useEffect } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/VacanciesPage.css';

const VacanciesPage = () => {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');

  const itemsPerPage = 10;

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/v1/vacancies`, {
        params: {
          skip: (currentPage - 1) * itemsPerPage,
          limit: itemsPerPage,
          search: searchTerm || undefined,
          is_active: filter === 'all' ? undefined : filter === 'active',
          sort_by: sortBy,
          sort_direction: sortDirection
        }
      });
      
      setVacancies(response.data.items);
      setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      setLoading(false);
    } catch (err) {
      console.error('Ошибка при загрузке вакансий:', err);
      setError('Не удалось загрузить вакансии. Пожалуйста, попробуйте позже.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, [currentPage, filter, sortBy, sortDirection]);

  // Функция для обработки поиска
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Сбрасываем на первую страницу при новом поиске
    fetchVacancies();
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

  // Функция для получения статуса вакансии
  const getVacancyStatus = (vacancy) => {
    if (!vacancy.is_active) {
      return { label: 'Неактивна', className: 'vacancy-status-inactive' };
    }
    
    if (vacancy.interview_count === 0) {
      return { label: 'Новая', className: 'vacancy-status-new' };
    }
    
    const ratio = vacancy.completed_interview_count / vacancy.interview_count;
    
    if (ratio >= 0.7) {
      return { label: 'Завершается', className: 'vacancy-status-completing' };
    } else if (ratio >= 0.3) {
      return { label: 'В работе', className: 'vacancy-status-in-progress' };
    } else {
      return { label: 'Началась', className: 'vacancy-status-started' };
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

  return (
    <div className="vacancies-page">
      <DashboardHeader />
      
      <div className="vacancies-container">
        <div className="vacancies-header">
          <h1>Управление вакансиями</h1>
          <Link to="/vacancies/create" className="create-vacancy-button">
            <i className="fas fa-plus"></i> Создать вакансию
          </Link>
        </div>
        
        <div className="vacancies-filters">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Поиск вакансий..."
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
              className={`filter-button ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Активные
            </button>
            <button
              className={`filter-button ${filter === 'inactive' ? 'active' : ''}`}
              onClick={() => setFilter('inactive')}
            >
              Неактивные
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Загрузка вакансий...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button onClick={fetchVacancies} className="retry-button">
              Повторить
            </button>
          </div>
        ) : vacancies.length === 0 ? (
          <div className="empty-vacancies">
            <i className="fas fa-search"></i>
            <p>Вакансии не найдены</p>
            {searchTerm && (
              <p className="empty-vacancies-hint">
                Попробуйте изменить параметры поиска или{' '}
                <button onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                  fetchVacancies();
                }} className="reset-search">
                  сбросить фильтры
                </button>
              </p>
            )}
            {!searchTerm && filter !== 'all' && (
              <p className="empty-vacancies-hint">
                Попробуйте изменить фильтр или{' '}
                <button onClick={() => setFilter('all')} className="reset-search">
                  показать все вакансии
                </button>
              </p>
            )}
            {!searchTerm && filter === 'all' && (
              <p className="empty-vacancies-hint">
                <Link to="/vacancies/create" className="create-first-vacancy">
                  Создайте первую вакансию
                </Link>
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="vacancies-table">
              <div className="vacancies-table-header">
                <div className="vacancy-header-cell" onClick={() => handleSort('title')}>
                  Название
                  {sortBy === 'title' && (
                    <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                  )}
                </div>
                <div className="vacancy-header-cell" onClick={() => handleSort('created_at')}>
                  Дата создания
                  {sortBy === 'created_at' && (
                    <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                  )}
                </div>
                <div className="vacancy-header-cell" onClick={() => handleSort('interview_count')}>
                  Интервью
                  {sortBy === 'interview_count' && (
                    <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                  )}
                </div>
                <div className="vacancy-header-cell">Статус</div>
                <div className="vacancy-header-cell">Действия</div>
              </div>
              
              <div className="vacancies-table-body">
                {vacancies.map((vacancy) => {
                  const status = getVacancyStatus(vacancy);
                  
                  return (
                    <div key={vacancy.id} className="vacancy-row">
                      <div className="vacancy-cell vacancy-title">
                        <Link to={`/vacancies/${vacancy.id}`} className="vacancy-link">
                          {vacancy.title}
                        </Link>
                      </div>
                      <div className="vacancy-cell vacancy-date">
                        {new Date(vacancy.created_at).toLocaleDateString('ru-RU')}
                      </div>
                      <div className="vacancy-cell vacancy-interviews">
                        <span className="interview-count">{vacancy.interview_count}</span>
                        {vacancy.interview_count > 0 && (
                          <span className="completed-ratio">
                            ({vacancy.completed_interview_count} завершено)
                          </span>
                        )}
                      </div>
                      <div className="vacancy-cell vacancy-status">
                        <span className={`status-badge ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="vacancy-cell vacancy-actions">
                        <Link to={`/vacancies/${vacancy.id}`} className="action-button view-button" title="Просмотр">
                          <i className="fas fa-eye"></i>
                        </Link>
                        <Link to={`/vacancies/${vacancy.id}/edit`} className="action-button edit-button" title="Редактировать">
                          <i className="fas fa-edit"></i>
                        </Link>
                        <Link to={`/vacancies/${vacancy.id}/interviews`} className="action-button interviews-button" title="Интервью">
                          <i className="fas fa-user-tie"></i>
                        </Link>
                        <Link to={`/vacancies/${vacancy.id}/stats`} className="action-button stats-button" title="Статистика">
                          <i className="fas fa-chart-bar"></i>
                        </Link>
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
    </div>
  );
};

export default VacanciesPage;
