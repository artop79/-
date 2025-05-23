import React from 'react';
import '../assets/css/AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-header">
          <h1>О сервисе Raplle</h1>
          <p className="about-subtitle">
            Интеллектуальная система анализа и оценки резюме кандидатов для HR-специалистов
          </p>
        </div>

        <div className="about-content">
          <div className="about-section">
            <h2>Что такое Raplle?</h2>
            <p>
              Raplle — это инновационный инструмент, который помогает HR-специалистам 
              автоматизировать процесс первичного анализа резюме кандидатов. Система 
              использует передовые алгоритмы обработки текста для сравнения навыков, 
              опыта и образования кандидата с требованиями вакансии.
            </p>
          </div>

          <div className="about-section">
            <h2>Как это работает?</h2>
            <div className="how-it-works">
              <div className="step-card">
                <div className="step-number">1</div>
                <div className="step-content">
                  <h3>Загрузка документов</h3>
                  <p>Загрузите резюме кандидата (PDF, DOCX) и описание вакансии.</p>
                </div>
              </div>
              
              <div className="step-card">
                <div className="step-number">2</div>
                <div className="step-content">
                  <h3>Интеллектуальный анализ</h3>
                  <p>Система извлекает ключевую информацию из документов и проводит сравнительный анализ.</p>
                </div>
              </div>
              
              <div className="step-card">
                <div className="step-number">3</div>
                <div className="step-content">
                  <h3>Получение результатов</h3>
                  <p>Получите подробный отчет о соответствии кандидата требованиям вакансии.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-section">
            <h2>Преимущества использования</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">⏱️</div>
                <h3>Экономия времени</h3>
                <p>Сократите время на предварительный анализ резюме до нескольких секунд</p>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">📊</div>
                <h3>Объективная оценка</h3>
                <p>Получите стандартизированный анализ всех кандидатов по единым критериям</p>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">🔍</div>
                <h3>Глубокий анализ</h3>
                <p>Выявляйте соответствие навыков, которые могли быть упущены при ручном анализе</p>
              </div>
              
              <div className="benefit-item">
                <div className="benefit-icon">🚀</div>
                <h3>Ускорение найма</h3>
                <p>Быстрее переходите к интервью с наиболее подходящими кандидатами</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
