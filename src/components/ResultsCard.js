import React, { useState, useEffect } from 'react';
import '../AppFramer.css';
import './ResultsCard.css';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const ResultsCard = ({ results }) => {
  // --- Распаковка данных из results (гарантировано один раз) ---
  const analysisId = results && (results.id || results.analysis_id || results.analysisId);
  const score = results ? results.score : null;
  const skills = results ? results.skills : null;
  const experience = results ? results.experience : null;
  const education = results ? results.education : null;
  const recommendations = results ? results.recommendations : null;

  // --- Feedback state ---
  const [feedbacks, setFeedbacks] = useState([]);
  const [hrRating, setHrRating] = useState('');
  const [hrComment, setHrComment] = useState('');
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // --- ML Prediction ---
  const [mlProbability, setMlProbability] = useState(null);
  const [mlDetails, setMlDetails] = useState(null);
  const [showMlModal, setShowMlModal] = useState(false);

  // --- Загрузить существующие отзывы ---
  useEffect(() => {
    if (!analysisId) {
      setFeedbacks([]);
      return;
    }
    fetch(`/api/analysis/${analysisId}/feedback`)
      .then(res => res.ok ? res.json() : [])
      .then(data => setFeedbacks(Array.isArray(data) ? data : []))
      .catch(() => setFeedbacks([]));
  }, [analysisId]);

  // --- Получение вероятности (короткий запрос) ---
  useEffect(() => {
    if (!score) {
      setMlProbability(null);
      return;
    }
    let avgHrRating = null;
    if (feedbacks.length > 0) {
      const sum = feedbacks.reduce((acc, fb) => acc + (Number(fb.hr_rating) || 0), 0);
      avgHrRating = sum / feedbacks.length;
    }
    fetch('/api/ml/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score: score,
        hr_rating: avgHrRating || 3
      })
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => setMlProbability(data && typeof data.probability === 'number' ? data.probability : null))
      .catch(() => setMlProbability(null));
  }, [score, feedbacks.length]);

  // --- Получение подробностей ML ---
  const fetchMlDetails = async () => {
    let avgHrRating = null;
    if (feedbacks.length > 0) {
      const sum = feedbacks.reduce((acc, fb) => acc + (Number(fb.hr_rating) || 0), 0);
      avgHrRating = sum / feedbacks.length;
    }
    const res = await fetch('/api/ml/score?details=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score: score,
        hr_rating: avgHrRating || 3
      })
    });
    if (res.ok) {
      const data = await res.json();
      setMlDetails(data);
    } else {
      setMlDetails(null);
    }
    setShowMlModal(true);
  };

  if (!results) {
    return null;
  }

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setLoadingFeedback(true);
    setFeedbackMessage('');
    try {
      const res = await fetch(`/api/analysis/${analysisId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hr_rating: Number(hrRating),
          hr_comment: hrComment,
          is_successful: isSuccessful
        })
      });
      if (res.ok) {
        setFeedbackMessage('Спасибо за обратную связь!');
        setHrRating('');
        setHrComment('');
        setIsSuccessful(false);
        // обновить отзывы
        const updated = await fetch(`/api/analysis/${analysisId}/feedback`).then(r => r.json());
        setFeedbacks(Array.isArray(updated) ? updated : []);
      } else {
        setFeedbackMessage('Ошибка при отправке. Попробуйте еще раз.');
      }
    } catch {
      setFeedbackMessage('Ошибка сети.');
    }
    setLoadingFeedback(false);
  };

  // Определяем цвет для скоринга
  const getScoreColor = (score) => {
    if (score >= 80) return 'high-score';
    if (score >= 60) return 'medium-score';
    return 'low-score';
  };

  // Получаем общую оценку соответствия навыков
  const getAverageSkillMatch = () => {
    if (!skills || skills.length === 0) return 0;
    const sum = skills.reduce((acc, skill) => acc + skill.match, 0);
    return Math.round(sum / skills.length);
  };

  // Функция для форматирования текста с заглавной буквы
  const capitalizeFirstLetter = (text) => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <div className="results-card">
      <div className="results-header">
        <h2>Результаты анализа</h2>
        <div className="score-badges-wrapper">
          <div className={`score-badge ${getScoreColor(score)}`}>{score}%</div>
          {mlProbability !== null && (
            <>
              <div className="ml-probability-badge" title="Вероятность успеха по ML-модели">
                ML: {(mlProbability * 100).toFixed(1)}%
              </div>
              <button className="ml-details-btn" onClick={fetchMlDetails} type="button">Подробнее о ML-решении</button>
            </>
          )}
        </div>
      </div>

      {/* Предпросмотр текста резюме */}
      {results.resume_text && (
        <div className="resume-preview-block">
          <h3>Текст резюме</h3>
          <div className="resume-preview-text">{results.resume_text.slice(0, 1200)}{results.resume_text.length > 1200 ? '…' : ''}</div>
        </div>
      )}

      {/* Ключевые навыки */}
      {skills && Array.isArray(skills) && skills.length > 0 && (
        <div className="skills-preview-block">
          <h3>Ключевые навыки</h3>
          <div className="skills-list">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className={`skill-badge ${skill.match >= 80 ? 'skill-match-high' : skill.match >= 50 ? 'skill-match-mid' : 'skill-match-low'}`}
                title={`Совпадение: ${skill.match}%`}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="results-summary">
  <p>
    <strong>Общий вывод:</strong> {score < 50
      ? 'Низкое соответствие требованиям. Рекомендуется рассмотреть других кандидатов или провести дополнительную оценку.'
      : score < 75
        ? 'Среднее соответствие. Кандидат может быть рассмотрен, но требуется дополнительная проверка навыков.'
        : 'Высокое соответствие. Кандидат хорошо подходит для позиции.'}
  </p>
</div>

      <div className="results-section">
        <div className="section-header">
          <h3>Соответствие навыков</h3>
          <div className={`section-score ${getScoreColor(getAverageSkillMatch())}`}>
            {getAverageSkillMatch()}%
          </div>
        </div>
        {/* График навыков */}
        {skills && skills.length > 0 && (
          <div className="skills-barchart-container">
            <ResponsiveContainer width="100%" height={Math.max(220, skills.length * 38)}>
              <BarChart
                layout="vertical"
                data={[...skills].sort((a, b) => b.match - a.match)}
                margin={{ top: 10, right: 40, left: 0, bottom: 10 }}
                barCategoryGap={12}
              >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={140}
                  tick={{ fontSize: 15, fill: 'var(--text-primary)' }}
                />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  labelFormatter={(label) => `Навык: ${label}`}
                  contentStyle={{ background: 'var(--card-bg)', borderRadius: 10, border: '1px solid #eee', fontSize: 15 }}
                />
                <Bar dataKey="match" radius={[8, 8, 8, 8]}>
                  {[...skills].sort((a, b) => b.match - a.match).map((entry, idx) => {
                    // Highlight top 2 skills
                    let color = entry.match >= 80 ? 'var(--success)' : entry.match >= 50 ? 'var(--warning)' : 'var(--error)';
                    if (idx === 0) color = '#3b82f6'; // blue highlight for top
                    if (idx === 1) color = '#06d6a0'; // green highlight for second
                    return <Cell key={`cell-${entry.name}`} fill={color} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="skills-list">
          {skills.map((skill, index) => (
            <div key={index} className="skill-item">
              
              <div className="skill-bar-container">
                <div 
                  className={`skill-bar ${getScoreColor(skill.match)}`} 
                  style={{ width: `${skill.match}%` }}
                ></div>
                
              </div>
              {/* Контекст применения навыка */}
              {skill.context && (
                <div className="skill-context">
                  <span className="skill-context-label">Контекст:</span> <span className="skill-context-quote">{skill.context}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Сущности из глубокого анализа (должности, компании, годы, достижения) */}
      {results.entities && results.entities.length > 0 && (
        <div className="results-section entities-section">
          <div className="section-header">
            <h3>Ключевые сущности резюме</h3>
          </div>
          <table className="entities-table">
            <thead>
              <tr>
                <th>Тип</th>
                <th>Значение</th>
                <th>Цитата/Контекст</th>
              </tr>
            </thead>
            <tbody>
              {results.entities.map((entity, idx) => (
                <tr key={idx}>
                  <td>{
                    entity.type === 'position' ? 'Должность' :
                    entity.type === 'company' ? 'Компания' :
                    entity.type === 'year' ? 'Год' :
                    entity.type === 'achievement' ? 'Достижение' : entity.type
                  }</td>
                  <td>{entity.value}</td>
                  <td className="entity-context">{entity.context}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Soft Skills (гибкие навыки) */}
      {results.softSkills && results.softSkills.length > 0 && (
  <div className="results-section softskills-section">
    <div className="section-header">
      <h3>Soft Skills (Гибкие навыки)</h3>
    </div>
    <ul className="softskills-list">
      {results.softSkills.map((soft, idx) => (
        <li key={idx} className="softskill-item">
          <span className="softskill-name">{soft.name}</span>
          {soft.comment && <span className="softskill-comment"> — {soft.comment}</span>}
          {soft.quote && <span className="softskill-quote">“{soft.quote}”</span>}
        </li>
      ))}
    </ul>
  </div>
)}

      {/* Достижения */}
      {results.achievements && results.achievements.length > 0 && (
  <div className="results-section achievements-section">
    <div className="section-header">
      <h3>Достижения</h3>
    </div>
    <ul className="achievements-list">
      {results.achievements.map((ach, idx) => (
        <li key={idx} className="achievement-item">
          <span className="achievement-result">{ach.result}</span>
          {ach.quote && <span className="achievement-quote">“{ach.quote}”</span>}
        </li>
      ))}
    </ul>
  </div>
)}

      {/* Проверка достоверности */}
      {results.verification && (
        <div className="results-section verification-section">
          <div className="section-header">
            <h3>Проверка достоверности</h3>
          </div>
          {results.verification.checkedProfiles && results.verification.checkedProfiles.length > 0 && (
            <div className="verification-profiles">
              <div className="verification-profiles-title">Проверенные профили:</div>
              <ul className="verification-profiles-list">
                {results.verification.checkedProfiles.map((profile, idx) => (
                  <li key={idx} className="verification-profile-item">
                    <span className="verification-platform">{profile.platform}:</span>
                    <a href={profile.url} target="_blank" rel="noopener noreferrer" className="verification-url">{profile.url}</a>
                    <span className={`verification-status ${profile.verified ? 'verified' : 'not-verified'}`}>{profile.verified ? '✔ Совпадает' : '✖ Есть расхождения'}</span>
                    {profile.issues && profile.issues.length > 0 && (
                      <ul className="verification-issues-list">
                        {profile.issues.map((issue, i) => (
                          <li key={i} className="verification-issue">{issue}</li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {results.verification.issues && results.verification.issues.length > 0 && (
            <div className="verification-issues-global">
              <div className="verification-issues-title">Общие проблемы:</div>
              <ul>
                {results.verification.issues.map((issue, idx) => (
                  <li key={idx} className="verification-issue-global">{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Риски */}
      {results.risks && results.risks.length > 0 && (
  <div className="results-section risks-section">
    <div className="section-header">
      <h3>Риски</h3>
    </div>
    <ul className="risks-list">
      {results.risks.map((risk, idx) => (
        <li key={idx} className="risk-item">{risk}</li>
      ))}
    </ul>
  </div>
)}

      <div className="results-section">
        <div className="section-header">
          <h3>Опыт работы</h3>
          <div className={`section-score ${getScoreColor(experience.match)}`}>
            {experience.match}%
          </div>
        </div>
        <div className="section-content">
          <p>{capitalizeFirstLetter(experience.description)}</p>
          <div className="experience-details">
            {experience.details && experience.details.length > 0 && (
              <div className="details-list">
                <h4>Ключевые моменты:</h4>
                <ul>
                  {experience.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Годы опыта */}
            {experience.years && (
              <div className="exp-years">Суммарный опыт: {experience.years} лет</div>
            )}
            {/* Компании */}
            {experience.companies && experience.companies.length > 0 && (
              <div className="exp-companies">
                <h4>Компании:</h4>
                <ul>
                  {experience.companies.map((comp, idx) => (
                    <li key={idx}>
                      <b>{comp.name}</b> — {comp.position} ({comp.period})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="results-section">
        <div className="section-header">
          <h3>Образование</h3>
          <div className={`section-score ${getScoreColor(education.match)}`}>
            {education.match}%
          </div>
        </div>
        <div className="section-content">
          <p>{capitalizeFirstLetter(education.description)}</p>
          {/* Детализация образования */}
          <ul className="education-details">
            {education.university && <li><b>ВУЗ:</b> {education.university}</li>}
            {education.degree && <li><b>Степень:</b> {education.degree}</li>}
            {education.years && <li><b>Годы обучения:</b> {education.years}</li>}
          </ul>
        </div>
      </div>

      <div className="results-section recommendations">
        <h3>Рекомендации</h3>
        <ul className="recommendations-list">
          {recommendations.map((recommendation, index) => (
            <li key={index}>
              <span className="recommendation-icon">✓</span>
              {capitalizeFirstLetter(recommendation)}
            </li>
          ))}
        </ul>
      </div>

      {/* Языки */}
      {results.languages && results.languages.length > 0 && (
        <div className="results-section">
          <h3>Языки</h3>
          <ul>
            {results.languages.map((lang, idx) => (
              <li key={idx}>{lang.name} — {lang.level}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Проекты */}
      {results.projects && results.projects.length > 0 && (
        <div className="results-section">
          <h3>Ключевые проекты</h3>
          <ul>
            {results.projects.map((proj, idx) => (
              <li key={idx}><b>{proj.title}</b>: {proj.description}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Soft Skills */}
      

      {/* Риски */}
      

      {/* --- Форма обратной связи HR --- */}
      <div className="results-section feedback-section">
        <h3>Обратная связь HR</h3>
        <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
          <label>
            Оцените, насколько верно система оценила кандидата:
            <select value={hrRating} onChange={e => setHrRating(e.target.value)} required>
              <option value="" disabled>Выберите оценку</option>
              <option value="1">1 — Очень плохо</option>
              <option value="2">2</option>
              <option value="3">3 — Средне</option>
              <option value="4">4</option>
              <option value="5">5 — Полностью согласен(на)</option>
            </select>
          </label>
          <label>
            Комментарий (необязательно):
            <textarea value={hrComment} onChange={e => setHrComment(e.target.value)} maxLength={500} rows={2} />
          </label>
          <label className="feedback-checkbox">
            <input type="checkbox" checked={isSuccessful} onChange={e => setIsSuccessful(e.target.checked)} />
            Кандидат принят
          </label>
          <button type="submit" disabled={loadingFeedback || !hrRating}>Отправить</button>
        </form>
        {feedbackMessage && <div className="feedback-message">{feedbackMessage}</div>}
        {feedbacks.length > 0 && (
          <div className="feedback-list-block">
            <h4>История обратной связи:</h4>
            <ul className="feedback-list">
              {feedbacks.map(fb => (
                <li key={fb.id} className="feedback-item">
                  <span className="feedback-rating">Оценка: <b>{fb.hr_rating}</b></span>
                  {fb.is_successful !== null && (
                    <span className={`feedback-success ${fb.is_successful ? 'success-yes' : 'success-no'}`}>{fb.is_successful ? 'Принят' : 'Не принят'}</span>
                  )}
                  {fb.hr_comment && <span className="feedback-comment">— {fb.hr_comment}</span>}
                  <span className="feedback-date">{new Date(fb.created_at).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Модальное окно с деталями ML */}
      {showMlModal && (
        <div className="ml-modal-overlay" onClick={() => setShowMlModal(false)}>
          <div className="ml-modal" onClick={e => e.stopPropagation()}>
            <h3>Подробности ML-решения</h3>
            {mlDetails ? (
              <>
                <div className="ml-modal-row"><b>Вероятность успеха:</b> {(mlDetails.probability * 100).toFixed(1)}%</div>
                <div className="ml-modal-row"><b>Использованные признаки:</b></div>
                <ul>
                  {Object.entries(mlDetails.features).map(([k, v]) => (
                    <li key={k}><b>{k}:</b> {v}</li>
                  ))}
                </ul>
                <div className="ml-modal-row"><b>Важность признаков:</b></div>
                <ul>
                  {Object.entries(mlDetails.feature_importances).map(([k, v]) => (
                    <li key={k}><b>{k}:</b> {(v * 100).toFixed(1)}%</li>
                  ))}
                </ul>
              </>
            ) : (
              <div>Не удалось получить подробности ML.</div>
            )}
            <button className="ml-modal-close" onClick={() => setShowMlModal(false)}>Закрыть</button>
          </div>
        </div>
      )}
      <div className="results-footer">
        <p className="disclaimer">Этот анализ основан на автоматическом сравнении резюме с требованиями вакансии. 
        Рекомендуется всегда проводить личное собеседование для окончательной оценки кандидата.</p>
      </div>
    </div>
  );
};

export default ResultsCard;
