// resumeService.js
// Сервис для анализа резюме через backend API
import api, { resumeService as apiResumeService } from './apiService';

/**
 * Анализирует резюме и возвращает результат скоринга и анализа.
 * @param {Object} params - { resumeFile, resumeText, jobDescription, prioritySkills }
 * @returns {Promise<Object>} - результат анализа
 */
/**
 * Получает список проанализированных ранее резюме кандидатов
 * @returns {Promise<Array>} - массив проанализированных резюме кандидатов
 */
export async function getAnalyzedResumes() {
  try {
    // Используем демо-данные для отладки, если нет доступа к реальному API
    const USE_DEMO_DATA = true; // В продакшене установить в false
    
    if (!USE_DEMO_DATA) {
      // Здесь будет реальный запрос к API
      const response = await api.get('/resumes/analyzed');
      return response.data;
    } else {
      // Имитация задержки загрузки
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Мок-данные для тестирования UI
      return [
        {
          id: 1,
          name: 'Алексей Смирнов',
          position: 'Frontend-разработчик',
          resumeScore: 85,
          matchPercentage: 92,
          status: 'Резюме проверено',
          resumeDate: '2025-05-15',
          keySkills: ['React', 'TypeScript', 'Redux'],
          avatar: '/mock-avatars/avatar1.jpg',
        },
        {
          id: 2,
          name: 'Мария Иванова',
          position: 'UX/UI дизайнер',
          resumeScore: 78,
          matchPercentage: 85,
          status: 'Резюме проверено',
          resumeDate: '2025-05-14',
          keySkills: ['Figma', 'Adobe XD', 'Прототипирование'],
          avatar: '/mock-avatars/avatar2.jpg',
        },
        {
          id: 3,
          name: 'Дмитрий Козлов',
          position: 'Backend-разработчик',
          resumeScore: 92,
          matchPercentage: 88,
          status: 'Резюме проверено',
          resumeDate: '2025-05-13',
          keySkills: ['Node.js', 'Python', 'MongoDB'],
          avatar: '/mock-avatars/avatar3.jpg',
        },
        {
          id: 4,
          name: 'Елена Петрова',
          position: 'Project Manager',
          resumeScore: 65,
          matchPercentage: 72,
          status: 'Резюме проверено',
          resumeDate: '2025-05-12',
          keySkills: ['Agile', 'Scrum', 'Jira'],
          avatar: '/mock-avatars/avatar4.jpg',
        },
        {
          id: 5,
          name: 'Иван Сидоров',
          position: 'DevOps инженер',
          resumeScore: 88,
          matchPercentage: 90,
          status: 'Резюме проверено',
          resumeDate: '2025-05-11',
          keySkills: ['Docker', 'Kubernetes', 'CI/CD'],
          avatar: '/mock-avatars/avatar5.jpg',
        },
      ];
    }
  } catch (error) {
    console.error('Ошибка при получении списка резюме:', error);
    throw new Error(error?.response?.data?.detail || error.message || 'Ошибка получения списка резюме');
  }
}

export async function analyzeResume({ resumeFile, resumeText, jobDescription, prioritySkills }) {
  try {
    // Используем демо-данные для отладки, если нет доступа к реальному API
    const USE_DEMO_DATA = true; // В продакшене установить в false
    
    if (!USE_DEMO_DATA) {
      // Используем существующий метод из apiService
      const response = await apiResumeService.analyzeResume(resumeFile, jobDescription);
      return response.data.results;
    } else {
      // Возвращаем демо-данные для тестирования
      console.log('Используются демо-данные для анализа резюме');
      
      // Имитация задержки загрузки
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Базовый процент соответствия
      let baseScore = 78;
      let adjustedScore = baseScore;
      let summaryText = "";
      
      // Учитываем приоритетные навыки, если они выбраны
      if (prioritySkills && prioritySkills.length > 0) {
        // Демонстрационная логика учета приоритетных навыков
        const priorityAnalysis = prioritySkills.map(skillName => {
          // Генерируем случайное соответствие для каждого навыка в демо-режиме
          return {
            skill: skillName,
            weight: Math.floor(Math.random() * 10) + 1, // 1-10
            match: Math.floor(Math.random() * 100) + 1   // 1-100
          };
        });
        
        // Рассчитываем взвешенную оценку приоритетных навыков
        let totalWeight = 0;
        let weightedScore = 0;
        
        priorityAnalysis.forEach(item => {
          totalWeight += item.weight;
          weightedScore += item.match * item.weight;
        });
        
        if (totalWeight > 0) {
          // Итоговая оценка: 70% от базовой + 30% от оценки приоритетных навыков
          const priorityScore = weightedScore / totalWeight;
          adjustedScore = Math.round(baseScore * 0.7 + priorityScore * 0.3);
          
          // Ограничиваем значение в пределах 0-100
          adjustedScore = Math.min(100, Math.max(0, adjustedScore));
        }
        
        // Адаптируем текст под скорректированную оценку
        if (adjustedScore >= 80) {
          summaryText = `Кандидат демонстрирует отличное соответствие требованиям вакансии с учетом выбранных приоритетных навыков. Рекомендуется пригласить на собеседование.`;
        } else if (adjustedScore >= 70) {
          summaryText = `Кандидат демонстрирует хорошее соответствие требованиям вакансии с учетом выбранных приоритетных навыков. Рекомендуется пригласить на собеседование.`;
        } else {
          summaryText = `Кандидат демонстрирует удовлетворительное соответствие требованиям вакансии с учетом выбранных приоритетных навыков. Рекомендуется дополнительное рассмотрение кандидатуры.`;
        }
      } else {
        // Стандартный текст без учета приоритетных навыков
        summaryText = "Кандидат демонстрирует хорошее соответствие требованиям вакансии. Имеет необходимый опыт работы и обладает большинством требуемых навыков. Рекомендуется пригласить на собеседование.";
      }
      
      // Формируем результаты с учетом скорректированной оценки
      const mockResults = {
        overall_match: {
          score: adjustedScore,
          summary: summaryText,
          strengths: [
            "Опыт работы в аналогичной должности более 3 лет",
            "Наличие релевантных технических навыков",
            "Высшее образование в смежной области"
          ],
          weaknesses: [
            "Недостаточный опыт с некоторыми требуемыми технологиями",
            "Короткий срок пребывания на последнем месте работы"
          ]
        },
        skills_analysis: [
          { skill: "Правовые знания", category: "hard_skill", match: 80, context: "Знание ТК РФ, поиск в правовых системах", relevance: "Высокая" }
        ],
        experience: {
          match: 85,
          summary: "Большая часть опыта кандидата соответствует требованиям вакансии",
          details: [
            {
              position: "Специалист отдела кадров",
              company: "ЗАО 'Телетрейд'",
              period: "2014-настоящее время",
              relevance: 90,
              highlights: ["Ведение КДП для 500 человек", "Подготовка отчетности", "Разработка нормативной документации"]
            }
          ]
        },
        education: {
          match: 75,
          summary: "Образование кандидата соответствует требованиям должности",
          details: [
            {
              degree: "Высшее образование, Магистр экономики",
              institution: "Российский университет экономики",
              year: "2012",
              relevance: 75
            }
          ]
        },
        interview_questions: [
          {
            question: "Расскажите о вашем опыте работы с кадровым делопроизводством",
            purpose: "Оценить навыки работы с людьми",
            related_to: "soft_skill"
          },
          {
            question: "Какие методы вы использовали для снижения текучести кадров?",
            purpose: "Оценить стратегическое мышление",
            related_to: "experience"
          }
        ]
      };
      
      return mockResults;
    }
  } catch (error) {
    // Пробрасываем ошибку для отображения пользователю
    console.error('Ошибка при анализе резюме:', error);
    throw new Error(error?.response?.data?.detail || error.message || 'Ошибка анализа резюме');
  }
}
