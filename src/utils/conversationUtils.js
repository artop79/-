/**
 * Утилиты для обработки диалогов и улучшения общения ИИ в реальном времени
 */

/**
 * Анализирует эмоциональный тон сообщения
 * @param {string} text - Текст для анализа
 * @returns {string} - Эмоциональный тон ('positive', 'negative', 'neutral')
 */
export const analyzeEmotionalTone = (text) => {
  if (!text) return 'neutral';
  
  const lowerText = text.toLowerCase();
  
  // Позитивные маркеры
  const positiveMarkers = [
    'рад', 'приятно', 'хорошо', 'отлично', 'здорово', 'круто', 'замечательно',
    'успешно', 'доволен', 'благодарю', 'спасибо', 'интересно', 'люблю', 'нравится',
    'прекрасно', 'супер', 'великолепно', 'счастлив', 'улыбка', ':)', '🙂', '👍'
  ];
  
  // Негативные маркеры
  const negativeMarkers = [
    'плохо', 'сложно', 'трудно', 'проблема', 'не нравится', 'разочарован',
    'жаль', 'грустно', 'увы', 'недоволен', 'раздражает', 'извините', 'ошибка',
    'не могу', 'не понимаю', 'не получается', 'к сожалению', ':(', '🙁', '👎'
  ];
  
  // Нейтральные маркеры для определения размышления
  const contemplativeMarkers = [
    'думаю', 'полагаю', 'считаю', 'возможно', 'наверное', 'пожалуй',
    'скорее всего', 'предположительно', 'на мой взгляд', 'по моему мнению'
  ];
  
  // Подсчет совпадений
  let positiveCount = 0;
  let negativeCount = 0;
  let contemplativeCount = 0;
  
  positiveMarkers.forEach(marker => {
    if (lowerText.includes(marker)) positiveCount++;
  });
  
  negativeMarkers.forEach(marker => {
    if (lowerText.includes(marker)) negativeCount++;
  });
  
  contemplativeMarkers.forEach(marker => {
    if (lowerText.includes(marker)) contemplativeCount++;
  });
  
  // Определение преобладающего тона
  if (positiveCount > negativeCount && positiveCount > contemplativeCount) {
    return 'positive';
  } else if (negativeCount > positiveCount && negativeCount > contemplativeCount) {
    return 'negative';
  } else if (contemplativeCount > 0) {
    return 'contemplative';
  }
  
  return 'neutral';
};

/**
 * Адаптирует ответ ИИ к эмоциональному тону пользователя
 * @param {string} baseResponse - Основной ответ ИИ
 * @param {string} emotion - Эмоциональный тон ('positive', 'negative', 'neutral', 'contemplative')
 * @returns {string} - Адаптированный ответ с учетом эмоционального тона
 */
export const adaptResponseToEmotion = (baseResponse, emotion) => {
  if (!baseResponse) return '';
  
  // Фразы для начала ответа в зависимости от эмоционального тона
  const emotionPhrases = {
    positive: [
      'Отлично! ',
      'Это здорово! ',
      'Прекрасно! ',
      'Замечательно! ',
      'Я рад слышать это! ',
      ''
    ],
    negative: [
      'Я понимаю ваши чувства. ',
      'Сочувствую вам. ',
      'Понимаю, что это может быть непросто. ',
      'Спасибо за вашу откровенность. ',
      ''
    ],
    contemplative: [
      'Интересная точка зрения. ',
      'Я ценю ваши размышления. ',
      'Это хороший подход к анализу. ',
      'Ваши рассуждения очень глубокие. ',
      ''
    ],
    neutral: [
      '',
      'Понятно. ',
      'Хорошо. ',
      'Интересно. ',
      ''
    ]
  };
  
  // Выбираем случайную фразу из соответствующей категории
  const phrases = emotionPhrases[emotion] || emotionPhrases.neutral;
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
  
  return randomPhrase + baseResponse;
};

/**
 * Анализирует контекст диалога для улучшения ответов
 * @param {Array} messageHistory - История сообщений
 * @returns {Object} - Контекстная информация о диалоге
 */
export const analyzeConversationContext = (messageHistory) => {
  if (!messageHistory || !Array.isArray(messageHistory)) {
    return { topicsCovered: [], factsMentioned: {}, currentTopic: null };
  }
  
  const context = {
    topicsCovered: [], // Темы, которые уже обсуждались
    factsMentioned: {}, // Факты, упомянутые в разговоре
    currentTopic: null, // Текущая тема разговора
    questionCount: 0, // Количество заданных вопросов
    userInfo: {} // Информация о пользователе
  };
  
  // Массив ключевых слов для определения тем
  const topicKeywords = {
    'опыт_работы': ['опыт', 'работал', 'компания', 'должность', 'позиция', 'карьера'],
    'образование': ['образование', 'университет', 'институт', 'диплом', 'степень', 'учился'],
    'навыки': ['навык', 'умение', 'владею', 'знаю', 'могу', 'технология', 'инструмент'],
    'проекты': ['проект', 'задача', 'реализовал', 'разработал', 'создал', 'внедрил'],
    'личные_качества': ['качество', 'сильная сторона', 'характер', 'личность', 'коммуникабельный']
  };
  
  // Анализируем сообщения в истории
  messageHistory.forEach(message => {
    if (!message.text) return;
    
    const text = message.text.toLowerCase();
    
    // Подсчет вопросов
    if (message.sender === 'ai' && (text.includes('?') || 
        /расскажите|скажите|объясните|поделитесь|опишите/.test(text))) {
      context.questionCount++;
    }
    
    // Определение темы сообщения
    Object.keys(topicKeywords).forEach(topic => {
      if (topicKeywords[topic].some(keyword => text.includes(keyword))) {
        if (!context.topicsCovered.includes(topic)) {
          context.topicsCovered.push(topic);
        }
        context.currentTopic = topic;
      }
    });
    
    // Извлечение фактов о пользователе (только из сообщений пользователя)
    if (message.sender === 'user') {
      // Опыт работы (лет)
      const experienceMatch = text.match(/опыт (?:работы )?(\d+)(?:\s+|\s*-)?\s*(?:лет|год)/i);
      if (experienceMatch) {
        context.userInfo.experienceYears = parseInt(experienceMatch[1]);
      }
      
      // Компании
      const companyMatch = text.match(/(?:работал|работаю) в ([^,.]+)/i);
      if (companyMatch) {
        const company = companyMatch[1].trim();
        context.factsMentioned.companies = context.factsMentioned.companies || [];
        if (!context.factsMentioned.companies.includes(company)) {
          context.factsMentioned.companies.push(company);
        }
      }
      
      // Технологии/навыки
      const techMatches = text.match(/(?:владею|знаю|использую|работаю с) ([^,.]+)/ig);
      if (techMatches) {
        context.factsMentioned.skills = context.factsMentioned.skills || [];
        techMatches.forEach(match => {
          const skill = match.replace(/(?:владею|знаю|использую|работаю с) /i, '').trim();
          if (!context.factsMentioned.skills.includes(skill)) {
            context.factsMentioned.skills.push(skill);
          }
        });
      }
    }
  });
  
  return context;
};

/**
 * Генерирует персонализированный вопрос на основе контекста диалога
 * @param {Object} context - Контекст диалога
 * @returns {string} - Персонализированный вопрос
 */
export const generateContextualQuestion = (context) => {
  if (!context) return 'Расскажите о себе и своем опыте работы.';
  
  // Вопросы на основе количества заданных вопросов (для прогресса интервью)
  const progressBasedQuestions = [
    'Расскажите, пожалуйста, о себе и своем опыте работы.',
    'Какими ключевыми навыками вы обладаете?',
    'Расскажите о самом интересном проекте, над которым вы работали.',
    'Как вы решаете сложные задачи, когда сталкиваетесь с ними?',
    'Каковы ваши карьерные цели на ближайшие годы?',
    'Что вас мотивирует в работе?',
    'Как вы справляетесь со стрессовыми ситуациями?',
    'Расскажите о своих сильных и слабых сторонах.',
    'Что для вас важно в рабочей среде и культуре компании?',
    'Есть ли у вас вопросы к нам?'
  ];
  
  if (context.questionCount < progressBasedQuestions.length) {
    return progressBasedQuestions[context.questionCount];
  }
  
  // Персонализированные вопросы на основе фактов
  if (context.userInfo.experienceYears) {
    if (context.userInfo.experienceYears > 5) {
      return `С вашим впечатляющим опытом ${context.userInfo.experienceYears} лет, какие самые сложные проблемы вам удалось решить?`;
    } else if (context.userInfo.experienceYears < 3) {
      return 'Как вы компенсируете относительно небольшой опыт работы? Какие у вас есть преимущества?';
    }
  }
  
  if (context.factsMentioned.companies && context.factsMentioned.companies.length > 0) {
    const lastCompany = context.factsMentioned.companies[context.factsMentioned.companies.length - 1];
    return `Расскажите подробнее о вашей работе в ${lastCompany}. Какие задачи вы там решали?`;
  }
  
  if (context.factsMentioned.skills && context.factsMentioned.skills.length > 0) {
    const randomSkill = context.factsMentioned.skills[Math.floor(Math.random() * context.factsMentioned.skills.length)];
    return `Вы упомянули ${randomSkill}. Расскажите о конкретных примерах, где вы применяли этот навык.`;
  }
  
  // Определение ключевых тем для интервью
  const topicKeywords = {
    'опыт_работы': ['опыт', 'работа', 'должность', 'компания', 'карьера'],
    'образование': ['образование', 'университет', 'институт', 'диплом', 'специальность', 'курсы'],
    'навыки': ['навыки', 'умения', 'технологии', 'инструменты', 'методологии'],
    'проекты': ['проект', 'задача', 'достижение', 'результат', 'внедрение'],
    'личные_качества': ['качества', 'сильные стороны', 'характер', 'коммуникация', 'работа в команде'],
    'ожидания': ['ожидания', 'цели', 'планы', 'зарплата', 'развитие', 'рост']
  };
  
  // Вопросы на основе текущей и непокрытых тем
  const uncoveredTopics = Object.keys(topicKeywords).filter(topic => !context.topicsCovered.includes(topic));
  
  if (uncoveredTopics.length > 0) {
    const nextTopic = uncoveredTopics[0];
    switch (nextTopic) {
      case 'опыт_работы':
        return 'Расскажите о вашем профессиональном опыте. Где вы работали и какие задачи решали?';
      case 'образование':
        return 'Какое у вас образование? Как оно помогает вам в работе?';
      case 'навыки':
        return 'Какими ключевыми навыками и технологиями вы владеете?';
      case 'проекты':
        return 'Расскажите о проектах, которыми вы особенно гордитесь.';
      case 'личные_качества':
        return 'Какие ваши личные качества помогают вам в профессиональной деятельности?';
      default:
        return 'Что еще вы хотели бы рассказать о себе?';
    }
  }
  
  // Если все темы покрыты, задаем обобщающие вопросы
  return 'Спасибо за подробные ответы! Есть ли что-то еще, что вы хотели бы добавить или спросить?';
};

/**
 * Обеспечивает естественный переход между вопросами
 * @param {string} previousQuestion - Предыдущий вопрос
 * @param {string} nextQuestion - Следующий вопрос
 * @returns {string} - Дополненный следующий вопрос с естественным переходом
 */
export const createSmoothTransition = (previousQuestion, nextQuestion) => {
  if (!previousQuestion || !nextQuestion) return nextQuestion;
  
  // Переходные фразы для связки вопросов
  const transitions = [
    'Спасибо за ваш ответ. ',
    'Это очень интересно. ',
    'Хорошо, понял вас. ',
    'Отлично. Двигаемся дальше. ',
    'Благодарю за подробный ответ. ',
    'Это ценная информация. ',
    'Понятно. '
  ];
  
  // Выбираем случайную переходную фразу
  const transition = transitions[Math.floor(Math.random() * transitions.length)];
  
  return transition + nextQuestion;
};
