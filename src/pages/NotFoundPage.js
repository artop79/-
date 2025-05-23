import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="not-found-title">404</h1>
          <h2 className="not-found-subtitle">Страница не найдена</h2>
          <p className="not-found-description">
            Страница, которую вы пытаетесь найти, не существует или была перемещена.
          </p>
          <div className="not-found-actions">
            <Link to="/" className="back-home-button">Вернуться на главную</Link>
            <Link to="/vacancies" className="vacancies-button">К списку вакансий</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
