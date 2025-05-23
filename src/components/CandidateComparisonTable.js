import React from 'react';
import './CandidateComparisonTable.css';

const CandidateComparisonTable = ({ candidates, onSelectBest, onClose }) => {
  // Функция для форматирования даты анализа
  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    if (dateString === 'Сейчас') return dateString;
    return dateString;
  };

  // Получение всех уникальных навыков из всех кандидатов
  const getAllSkills = () => {
    const skillsSet = new Set();
    candidates.forEach(candidate => {
      if (candidate.results && candidate.results.skills) {
        candidate.results.skills.forEach(skill => {
          skillsSet.add(skill.name);
        });
      }
    });
    return Array.from(skillsSet);
  };

  // Поиск навыка у кандидата
  const findSkill = (candidate, skillName) => {
    if (!candidate.results || !candidate.results.skills) return null;
    return candidate.results.skills.find(skill => skill.name === skillName);
  };

  // Получение цвета для значения соответствия
  const getMatchColor = (match) => {
    if (match >= 80) return 'high-match';
    if (match >= 60) return 'medium-match';
    return 'low-match';
  };

  const allSkills = getAllSkills();

  return (
    <div className="comparison-container">
      <h2 className="comparison-title">Сравнение кандидатов</h2>
      <div className="comparison-subtitle">Сравнение {candidates.length} кандидатов на позицию</div>
      
      <div className="comparison-table-wrapper">
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="criteria-column">Критерий</th>
              {candidates.map((candidate, index) => (
                <th key={index} className="candidate-column">
                  <div className="candidate-header">
                    <div className="candidate-name">{candidate.name || `Кандидат ${index + 1}`}</div>
                    <div className="position-name">{candidate.position || 'Не указана'}</div>
                    <div className="analysis-date">{formatDate(candidate.date)}</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Общий счет соответствия */}
            <tr className="score-row">
              <td className="criteria-name">Общий показатель соответствия</td>
              {candidates.map((candidate, index) => (
                <td key={index} className={`candidate-score ${getMatchColor(candidate.score)}`}>
                  {candidate.score}%
                </td>
              ))}
            </tr>
            
            {/* Опыт работы */}
            <tr>
              <td className="criteria-name">Опыт работы</td>
              {candidates.map((candidate, index) => (
                <td key={index} className="candidate-data">
                  {candidate.results && candidate.results.experience ? (
                    <div>
                      <div className={`match-badge ${getMatchColor(candidate.results.experience.match)}`}>
                        {candidate.results.experience.match}%
                      </div>
                      <div>{candidate.results.experience.years || 0} лет</div>
                    </div>
                  ) : 'Нет данных'}
                </td>
              ))}
            </tr>
            
            {/* Образование */}
            <tr>
              <td className="criteria-name">Образование</td>
              {candidates.map((candidate, index) => (
                <td key={index} className="candidate-data">
                  {candidate.results && candidate.results.education ? (
                    <div>
                      <div className={`match-badge ${getMatchColor(candidate.results.education.match)}`}>
                        {candidate.results.education.match}%
                      </div>
                      <div>{candidate.results.education.degree || 'Не указано'}</div>
                    </div>
                  ) : 'Нет данных'}
                </td>
              ))}
            </tr>
            
            {/* Навыки */}
            {allSkills.map((skillName, skillIndex) => (
              <tr key={skillIndex} className="skill-row">
                <td className="criteria-name skill-name">{skillName}</td>
                {candidates.map((candidate, candidateIndex) => {
                  const skill = findSkill(candidate, skillName);
                  return (
                    <td key={candidateIndex} className="candidate-data">
                      {skill ? (
                        <div>
                          <div className={`match-badge ${getMatchColor(skill.match)}`}>
                            {skill.match}%
                          </div>
                          <div className="skill-level">{skill.level || 'Не указан'}</div>
                        </div>
                      ) : (
                        <div className="no-skill">Не обнаружен</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            
            {/* Риски */}
            <tr>
              <td className="criteria-name">Риски</td>
              {candidates.map((candidate, index) => (
                <td key={index} className="candidate-data risks-data">
                  {candidate.results && candidate.results.risks && candidate.results.risks.length > 0 ? (
                    <ul className="risks-list">
                      {candidate.results.risks.slice(0, 2).map((risk, riskIndex) => (
                        <li key={riskIndex}>{risk}</li>
                      ))}
                      {candidate.results.risks.length > 2 && <li>...</li>}
                    </ul>
                  ) : 'Риски не выявлены'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="comparison-actions">
        <div className="best-candidate-selection">
          <div className="selection-label">Выбрать лучшего кандидата:</div>
          <div className="candidate-options">
            {candidates.map((candidate, index) => (
              <button 
                key={index} 
                className="candidate-option-btn"
                onClick={() => onSelectBest(candidate)}
              >
                {candidate.name || `Кандидат ${index + 1}`} ({candidate.score}%)
              </button>
            ))}
          </div>
        </div>
        <button className="close-comparison-btn" onClick={onClose}>
          Закрыть сравнение
        </button>
      </div>
    </div>
  );
};

export default CandidateComparisonTable;
