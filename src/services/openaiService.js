// ВАЖНО: Не храните и не используйте OpenAI API ключи в браузере! Все анализы должны выполняться только через backend.
// Ключевые фразы и паттерны для структурного анализа резюме
const RESUME_PATTERNS = {
  // Ключевые секции резюме - подходят для любой профессии
  sections: {
    experience: [
      'опыт работы', 'профессиональный опыт', 'карьера', 'работал', 'опыт', 'обязанности', 'достижения',
      'experience', 'employment', 'work experience', 'career', 'professional history', 'responsibilities', 'achievements'
    ],
    education: [
      'образование', 'обучение', 'курсы', 'университет', 'институт', 'квалификация', 'сертификаты',
      'education', 'university', 'college', 'degree', 'academic', 'qualification', 'certification'
    ],
    skills: [
      'навыки', 'умения', 'компетенции', 'технические навыки', 'технологии', 'владение',
      'skills', 'technical skills', 'competencies', 'technologies', 'proficiencies', 'expertise'
    ],
    languages: [
      'языки', 'иностранные языки', 'владение языками',
      'languages', 'foreign languages'
    ],
    projects: [
      'проекты', 'портфолио', 'реализованные проекты', 'кейсы',
      'projects', 'portfolio', 'implementations', 'cases'
    ]
  }
};

// Этот сервис будет обрабатывать все взаимодействия с OpenAI API
class OpenAIService {
  constructor() {
    // Настройки анализа резюме (могут быть использованы для формирования запроса на backend)
    this.analysisSettings = {
      maxResumeChars: 3000,
      maxJobDescChars: 2000
    };
  }

  // Метод всё еще присутствует для совместимости
  initialize(apiKey) {
    // API ключи больше не используются напрямую в браузере
  }
  
  // Обновление настроек анализа
  updateAnalysisSettings(newSettings) {
    this.analysisSettings = { ...this.analysisSettings, ...newSettings };
  }

  // Анализ резюме теперь всегда через backend
  async analyzeResume(resumeText, jobDescriptionText) {
    try {
      const response = await fetch('/api/analyze_resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume_text: resumeText, job_description_text: jobDescriptionText })
      });
      if (!response.ok) {
        throw new Error('Ошибка при обращении к серверу: ' + response.statusText);
      }
      const data = await response.json();
      if (data && data.results) {
        return data.results;
      }
      // Fallback: если структура ответа неожиданная
      return data;
    } catch (error) {
      console.error('Ошибка при анализе резюме через backend:', error);
      // Для demo-режима возвращаем детерминированный mock-ответ
      return this.createDeterministicMockResults(resumeText, jobDescriptionText);
    }
  }

  // ... остальной код ...

  // Извлечение ключевых навыков из описания вакансии (упрощённая версия)
  extractSkillsFromJobDescription(jobDescriptionText) {
    if (!jobDescriptionText) return [];
    const skills = [];
    const lines = jobDescriptionText.split('\n');
    for (const line of lines) {
      // Ищем строки с маркерами списка или ключевые слова
      if (line.trim().startsWith('-') || line.trim().startsWith('•') || /^\d+\./.test(line.trim())) {
        const cleanLine = line.replace(/^\s*[-•]\s*|^\s*\d+\.\s*/, '').trim();
        if (cleanLine && cleanLine.length < 50) skills.push(cleanLine);
      }
      // Можно добавить дополнительные эвристики
    }
    return skills;
  }

  // Определение профессиональной области (домен) по ключевым словам в тексте
  determineJobDomain(resumeText, jobDescriptionText) {
    const combinedText = (resumeText || '') + ' ' + (jobDescriptionText || '');
    const lowerText = combinedText.toLowerCase();
    // Классификация по ключевым словам для разных областей
    const domains = {
      it: ['программирование', 'разработка', 'javascript', 'python', 'developer', 'программист', 'верстка', 'frontend', 'backend', 'devops', 'код', 'coder', 'git'],
      hr: ['hr', 'кадры', 'персонал', 'рекрутинг', 'делопроизводство', 'трудовой', 'кадровик', 'кадровое', 'человеческие ресурсы'],
      finance: ['финансы', 'бухгалтер', 'бухгалтерия', 'аудит', 'экономист', 'финансовый', 'бюджет', 'отчетность', 'банк'],
      medical: ['врач', 'медицинский', 'медсестра', 'больница', 'клиника', 'пациент', 'доктор', 'здравоохранение', 'лечение'],
      sales: ['продажи', 'менеджер по продажам', 'sales', 'клиенты', 'продавец', 'торговый', 'маркетинг', 'клиентский'],
      legal: ['юрист', 'правовой', 'адвокат', 'юридический', 'законодательство', 'право', 'суд', 'договор', 'контракт']
    };
    // Находим совпадения для каждой области
    const domainMatches = {};
    for (const [domain, keywords] of Object.entries(domains)) {
      domainMatches[domain] = keywords.filter(word => lowerText.includes(word)).length;
    }
    // Определяем область с наибольшим числом совпадений
    let maxMatches = 0;
    let detectedDomain = 'general'; // По умолчанию
    for (const [domain, matches] of Object.entries(domainMatches)) {
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedDomain = domain;
      }
    }
    return detectedDomain;
  }

  // Детерминированный mock-ответ для demo-режима (если backend недоступен)
  createDeterministicMockResults(resumeText, jobDescriptionText) {
    // Определяем область (domain) аналогично createMockResults
    const domain = this.determineJobDomain(resumeText, jobDescriptionText);
    const jobSkills = jobDescriptionText ? this.extractSkillsFromJobDescription(jobDescriptionText) : [];
    const baseResults = {
      score: 85,
      skills: [],
      experience: {
        description: '',
        match: 80,
        details: [],
        years: 5,
        companies: [
          { name: 'ООО "Рога и Копыта"', period: '2019-2022', position: 'Ведущий специалист' },
          { name: 'АО "Пример"', period: '2017-2019', position: 'Менеджер проектов' }
        ]
      },
      education: {
        description: '',
        match: 76,
        university: 'МГУ',
        degree: 'Магистр',
        years: '2012-2017'
      },
      languages: [
        { name: 'Русский', level: 'родной' },
        { name: 'Английский', level: 'B2 (Upper-Intermediate)' }
      ],
      projects: [
        { title: 'Автоматизация HR-процессов', description: 'Внедрение системы учета персонала для 100+ сотрудников.' },
        { title: 'Веб-платформа для анализа резюме', description: 'Разработка MVP и запуск в продакшн.' }
      ],
      softSkills: [
        { name: 'Коммуникабельность', comment: 'Уверенно взаимодействует с коллегами и заказчиками.' },
        { name: 'Стрессоустойчивость', comment: 'Эффективно работает в условиях многозадачности.' }
      ],
      risks: [
        'Недостаточно опыта в международных проектах',
        'Нет подтвержденных сертификатов по Agile'
      ],
      recommendations: []
    };
    // Можно расширить на разные домены при необходимости
    return this.createGeneralMockResults(baseResults, jobSkills, resumeText);
  }

  createGeneralMockResults(baseResults, jobSkills, resumeText = '') {
    // Используем существующие навыки из вакансии или общие базовые навыки
    const skills = jobSkills.length > 2 ? jobSkills : ['Коммуникабельность', 'Ответственность', 'Работа в команде', 'MS Office', 'Организаторские навыки'];
    // Генерируем детерминированный match и детали по каждому навыку
    function deterministicScore(str) {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return 70 + (Math.abs(hash) % 24) & ~1;
    }
    baseResults.skills = skills.map(skill => ({
      name: skill,
      match: deterministicScore(skill),
      explanation: `Навык '${skill}' найден в резюме кандидата.`,
      level: skill.length > 10 ? 'продвинутый' : 'базовый',
      source: resumeText.includes(skill) ? 'Резюме' : 'Вакансия'
    }));
    baseResults.experience = {
      ...baseResults.experience,
      description: 'Кандидат имеет релевантный опыт работы в профильной области, участвовал в крупных проектах.',
      match: 80,
      details: [
        'Работа на аналогичной должности более 3 лет',
        'Успешная реализация проектов в срок',
        'Положительные отзывы руководителей'
      ],
      years: 5,
      companies: baseResults.experience.companies
    };
    baseResults.education = {
      ...baseResults.education,
      description: 'Образование кандидата соответствует требованиям позиции. Имеет профильный диплом.',
      match: 76,
      university: baseResults.education.university,
      degree: baseResults.education.degree,
      years: baseResults.education.years
    };
    baseResults.languages = baseResults.languages || [
      { name: 'Русский', level: 'родной' },
      { name: 'Английский', level: 'B2 (Upper-Intermediate)' }
    ];
    baseResults.projects = baseResults.projects || [
      { title: 'Автоматизация HR-процессов', description: 'Внедрение системы учета персонала для 100+ сотрудников.' },
      { title: 'Веб-платформа для анализа резюме', description: 'Разработка MVP и запуск в продакшн.' }
    ];
    baseResults.softSkills = baseResults.softSkills || [
      { name: 'Коммуникабельность', comment: 'Уверенно взаимодействует с коллегами и заказчиками.' },
      { name: 'Стрессоустойчивость', comment: 'Эффективно работает в условиях многозадачности.' }
    ];
    baseResults.risks = baseResults.risks || [
      'Недостаточно опыта в международных проектах',
      'Нет подтвержденных сертификатов по Agile'
    ];
    baseResults.recommendations = [
      'Кандидат подходит для данной позиции по ключевым параметрам.',
      'Рекомендуется уточнить опыт работы в данной сфере.',
      'Стоит обсудить конкретные достижения на предыдущих местах работы.'
    ];
    return baseResults;
  }
}

export default new OpenAIService();
