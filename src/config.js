// Глобальные настройки приложения Raplle

const config = {
  // API настройки
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
    timeout: 30000, // 30 секунд
    retryAttempts: 3,
  },

  // Настройки для режима разработки
  development: {
    enableMocks: process.env.REACT_APP_ENABLE_MOCKS === 'true',
    mockDelay: 1500, // задержка для имитации сетевых запросов в мс
    debugMode: process.env.NODE_ENV === 'development',
  },

  // Настройки для анализа резюме
  resumeAnalyzer: {
    maxFileSize: 10 * 1024 * 1024, // 10 МБ
    allowedFileTypes: ['.pdf', '.docx', '.doc', '.txt'],
    scoreThresholds: {
      good: 75, // процент соответствия для "хорошего" совпадения
      average: 50, // процент соответствия для "среднего" совпадения
    }
  },

  // Настройки для AI-интервью
  aiInterviewer: {
    defaultQuestions: 5, // количество вопросов по умолчанию
    maxSessionDuration: 30 * 60 * 1000, // 30 минут в миллисекундах
    interviewTypes: [
      { id: 'technical', name: 'Техническое собеседование' },
      { id: 'hr', name: 'HR-собеседование' },
      { id: 'combined', name: 'Комбинированное собеседование' }
    ]
  },

  // Сервис уведомлений
  notifications: {
    position: 'top-right',
    autoClose: 5000,
    closeOnClick: true,
    pauseOnHover: true,
  },

  // Интеграции с внешними сервисами
  integrations: {
    zoom: {
      // Настройки интеграции с Zoom будут заполнены из .env
      redirectUri: process.env.REACT_APP_ZOOM_REDIRECT_URI,
    },
  },
};

export default config;
