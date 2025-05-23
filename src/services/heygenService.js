import axios from 'axios';

// Настройки Heygen API
const HEYGEN_API_URL = 'https://api.heygen.com';
const HEYGEN_API_V1_URL = 'https://api.heygen.com/v1';
const HEYGEN_API_V2_URL = 'https://api.heygen.com/v2';

// API Ключ Heygen - в реальном приложении должен храниться на бэкенде
// или в переменных окружения
const HEYGEN_API_KEY = process.env.REACT_APP_HEYGEN_API_KEY || 'MDRjZWE4NzRiMTQ2NDE4MDhiMTRjNTM0NWQ3MGY5Y2EtMTczNjc3MzI0MA==';

// Локальный URL API для прокси через бэкенд
const LOCAL_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
const LOCAL_HEYGEN_API = `${LOCAL_API_URL}/heygen`;

// Режимы работы API: 
// 'direct' - прямые запросы к Heygen API 
// 'proxy' - запросы через бэкенд-прокси
// 'mock' - эмуляция работы API с мок-данными для разработки
// Используем режим из переменных окружения, по умолчанию 'proxy' для обхода CORS
const API_MODE = process.env.REACT_APP_HEYGEN_API_MODE || 'proxy';

// Версия API Heygen
const HEYGEN_API_VERSION = 'v2';

// Настройки Axios для прямых запросов к Heygen API V2
const heygenDirectAxios = axios.create({
  baseURL: HEYGEN_API_V2_URL,
  timeout: 30000, // увеличенный таймаут для операций с видео
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': HEYGEN_API_KEY
  }
});

// Настройки Axios для прямых запросов к Heygen API V1
const heygenDirectAxiosV1 = axios.create({
  baseURL: HEYGEN_API_V1_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'X-Api-Key': HEYGEN_API_KEY
  }
});

// Настройки Axios для запросов через наш бэкенд
const heygenProxyAxios = axios.create({
  baseURL: LOCAL_HEYGEN_API,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Добавляем перехватчик для обработки ошибок для прямых запросов v2
heygenDirectAxios.interceptors.response.use(
  response => response,
  error => {
    // Создаем более информативное сообщение об ошибке
    const enhancedError = {
      message: error.response?.data?.message || error.message || 'Ошибка при запросе к Heygen API',
      status: error.response?.status,
      endpoint: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      originalError: error
    };
    
    console.error('Heygen Direct API Error:', enhancedError);
    return Promise.reject(enhancedError);
  }
);

// Добавляем перехватчик для обработки ошибок для прямых запросов v1
heygenDirectAxiosV1.interceptors.response.use(
  response => response,
  error => {
    // Создаем более информативное сообщение об ошибке
    const enhancedError = {
      message: error.response?.data?.message || error.message || 'Ошибка при запросе к Heygen API v1',
      status: error.response?.status,
      endpoint: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      originalError: error
    };
    
    console.error('Heygen Direct API v1 Error:', enhancedError);
    return Promise.reject(enhancedError);
  }
);

// Добавляем перехватчик для обработки ошибок для прокси запросов
heygenProxyAxios.interceptors.response.use(
  response => response,
  error => {
    // Создаем более информативное сообщение об ошибке
    const enhancedError = {
      message: error.response?.data?.message || error.message || 'Ошибка при запросе к Heygen API через прокси',
      status: error.response?.status,
      endpoint: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      originalError: error
    };
    
    console.error('Heygen Proxy API Error:', enhancedError);
    return Promise.reject(enhancedError);
  }
);

/**
 * Сервис для работы с API Heygen
 */
const HeygenService = {
  // Кэширование данных для оптимизации
  _cachedAvatars: null,
  _cachedVoices: {},
  
  /**
   * Проверяет доступность API Heygen
   * @returns {Promise<boolean>} - Promise с результатом проверки
   */
  checkApiStatus: async () => {
    try {
      console.log('Checking Heygen API status, mode:', API_MODE);
      
      // Если режим mock, возвращаем успех без реальных запросов
      if (API_MODE === 'mock') {
        console.log('Using mock mode, API is simulated');
        // Эмулируем задержку сети
        await new Promise(resolve => setTimeout(resolve, 200));
        return true;
      }
      
      // Журналируем данные о API
      console.log('API URL:', API_MODE === 'direct' ? HEYGEN_API_URL : LOCAL_HEYGEN_API);
      console.log('API Key (partially masked):', HEYGEN_API_KEY.substring(0, 5) + '...' + HEYGEN_API_KEY.substring(HEYGEN_API_KEY.length - 5));
      
      // Если режим прокси, проверяем через наш бэкенд
      if (API_MODE === 'proxy') {
        console.log('Using proxy mode, sending request to:', LOCAL_HEYGEN_API + '/status');
        const response = await heygenProxyAxios.get('/status');
        console.log('Proxy response:', response.data);
        
        return response.data?.status === 'ok';
      } else if (API_MODE === 'direct') {
        // Прямой запрос к Heygen API
        console.log('Using direct mode, sending request to:', HEYGEN_API_URL + '/user-info');
        const response = await heygenDirectAxios.get('/user-info');
        console.log('Direct API response status:', response.status);
        
        return response.status === 200;
      }
      
      // По умолчанию возвращаем false
      return false;
    } catch (error) {
      console.warn('Error checking API status:', error.message, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      return false;
    }
  },

  /**
   * Создает новую сессию стриминга
   * @param {Object} options - Настройки сессии
   * @returns {Promise} - Promise с ответом
   */
  createStreamingSession: async (options = {}) => {
    console.log('Creating streaming session with options:', options);
    
    if (API_MODE === 'mock') {
      // В режиме мока возвращаем демо данные
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        session_id: 'mock-session-' + Math.random().toString(36).substring(2, 9),
        preview_url: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y', // Демо изображение
        status: 'created'
      };
    } else if (API_MODE === 'direct') {
      // В прямом режиме отправляем запрос на создание сессии в Heygen API v2
      try {
        // Дефолтные опции для создания сессии
        const defaultOptions = {
          mode: 'streaming',
          stt_provider: 'deepgram',
          stt_confidence: 0.55,
          voice_id: options.voiceId || null,
          voice_speed: options.voiceSpeed || 1.0,
          language: options.language || 'russian'
        };
        
        // В API v2 обязательно нужно передавать ID аватара
        if (options.avatarId) {
          // Для API v2 поле называется просто 'avatar_id'
          defaultOptions.avatar_id = options.avatarId;
          console.log(`Используем аватар с ID: ${options.avatarId}`);
        } else {
          console.warn('Не указан ID аватара, что может привести к ошибке в API!');
        }
        
        console.log('Creating session with params:', defaultOptions);
        
        // Для API v2 эндпоинт изменился на /streaming/video
        const response = await heygenDirectAxios.post('/streaming/video', defaultOptions);
        
        console.log('Session created response:', response.data);
        
        // Структура ответа в API v2: data.data.video_id
        return {
          session_id: response.data?.data?.video_id,
          preview_url: response.data?.data?.preview_url,
          status: response.data?.status
        };
      } catch (error) {
        console.error('Error creating streaming session:', error.response?.data || error.message);
        throw error;
      }
    } else {
      // Режим прокси - запрос через наш бэкенд
      const defaultOptions = {
        mode: 'streaming',
        stt_provider: 'deepgram',
        stt_confidence: 0.55,
        voice_id: options.voiceId || null,
        voice_speed: options.voiceSpeed || 1.0,
        language: options.language || 'russian',
        avatar_id: options.avatarId || null
      };

      try {
        // Бэкенд должен быть настроен для работы с API v2
        console.log('Отправка запроса через прокси на бэкенд:', defaultOptions);
        const response = await heygenProxyAxios.post('/streaming/new', {
          ...defaultOptions,
          ...options
        });
        console.log('Ответ от прокси:', response.data);
        return response.data;
      } catch (error) {
        console.error('Ошибка при отправке запроса через прокси:', error.response?.data || error.message);
        throw error;
      }
    }
  },

  /**
   * Получает список доступных аватаров с кэшированием
   * @param {boolean} forceRefresh - Принудительно обновить данные из API
   * @returns {Promise} - Promise с ответом
   */
  getAvatars: async (forceRefresh = false) => {
    // Используем кэширование для оптимизации
    if (!forceRefresh && HeygenService._cachedAvatars) {
      return HeygenService._cachedAvatars;
    }

    try {
      let avatars = [];
      
      if (API_MODE === 'direct') {
        // Прямой запрос к Heygen API v2
        console.log('Fetching avatars from Heygen API v2');
        const response = await heygenDirectAxios.get('/avatars');
        console.log('Avatars response status:', response.status);
        
        if (response.data && response.data.data) {
          avatars = response.data.data.map(avatar => ({
            id: avatar.avatar_id,
            name: avatar.name || 'Heygen Avatar',
            gender: avatar.gender || 'не указан',
            language: avatar.language || 'английский',
            preview_url: avatar.preview_url || avatar.image_url || `/mock-avatars/heygen${avatar.avatar_id || 1}.jpg`,
            type: avatar.model_type || 'realistic',
            voice_id: avatar.voice_id || null
          }));
          console.log(`Processed ${avatars.length} avatars from API`);
        }
      } else {
        // Запрос через наш бэкенд
        const response = await heygenProxyAxios.get('/streaming/avatars');
        avatars = response.data?.avatars || [];
      }
      
      // Добавляем URL превью, если отсутствуют
      const processedAvatars = avatars.map(avatar => ({
        ...avatar,
        preview_url: avatar.preview_url || `/mock-avatars/heygen${avatar.id || 1}.jpg`
      }));
      
      // Сохраняем в кэше
      HeygenService._cachedAvatars = processedAvatars;
      
      return processedAvatars;
    } catch (error) {
      // Возвращаем мок-данные в случае ошибки
      console.warn('Using mock avatars due to API error:', error.message);
      return HeygenService.getMockAvatars();
    }
  },

  /**
   * Запускает сессию стриминга с выбранным аватаром (в API v2 аватар уже указывается при создании сессии)
   * @param {string} sessionId - ID сессии
   * @param {Object} options - Дополнительные настройки
   * @returns {Promise} - Promise с ответом
   */
  startStreamingSession: async (sessionId, options = {}) => {
    if (API_MODE === 'direct') {
      // Прямой запрос к API Heygen v2
      try {
        // В API v2 сессия автоматически стартует после создания
        // Проверяем статус сессии
        const sessionResponse = await heygenDirectAxios.get(`/streaming/video/${sessionId}`);
        
        console.log('Session status:', sessionResponse.data);
        
        return {
          preview_url: sessionResponse.data?.data?.preview_url,
          session_url: sessionResponse.data?.data?.url,
          status: sessionResponse.data?.status,
          session_id: sessionId
        };
      } catch (error) {
        console.error('Error getting streaming session info:', error);
        throw error;
      }
    } else {
      // Запрос через наш бэкенд
      try {
        const response = await heygenProxyAxios.post('/streaming/start', {
          session_id: sessionId,
          ...options
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  },
  
  /**
   * Закрывает сессию стриминга
   * @param {string} sessionId - ID сессии
   * @returns {Promise} - Promise с результатом
   */
  closeStreamingSession: async (sessionId) => {
    if (!sessionId) return { success: false, message: 'Сессия не указана' };
    
    if (API_MODE === 'direct') {
      // Прямой запрос к API Heygen v2
      try {
        console.log(`Closing streaming session ${sessionId}`);
        // В API v2 используется новый эндпоинт
        const response = await heygenDirectAxios.delete(`/streaming/video/${sessionId}`);
        console.log('Close session response:', response.data);
        return { 
          success: response.data?.status === 'success', 
          message: response.data?.message || 'Session closed successfully' 
        };
      } catch (error) {
        console.error('Error closing streaming session:', error);
        return { success: false, message: error.message || 'Error closing session' };
      }
    } else {
      // Запрос через наш бэкенд
      try {
        const response = await heygenProxyAxios.post('/streaming/close', { session_id: sessionId });
        return { success: true, message: 'Session closed successfully' };
      } catch (error) {
        console.error('Error closing streaming session:', error);
        return { success: false, message: error.message || 'Error closing session' };
      }
    }
  },

  /**
   * Отправляет текст для озвучивания аватаром
   * @param {string} sessionId - ID сессии
   * @param {string} text - Текст для озвучивания
   * @param {string} voiceId - ID голоса (опционально)
   * @returns {Promise} - Promise с ответом
   */
  sendTextToAvatar: async (sessionId, text, voiceId = null) => {
    return HeygenService.sendTextToSession(sessionId, text, { voiceId });
  },

  /**
   * Отправляет текст для синтеза в сессии
   * @param {string} sessionId - ID сессии
   * @param {string} text - Текст для синтеза
   * @param {Object} options - Дополнительные настройки
   * @returns {Promise} - Promise с ответом
   */
  sendTextToSession: async (sessionId, text, options = {}) => {
    if (!sessionId || !text) {
      throw new Error('Необходимо указать ID сессии и текст');
    }
    
    if (API_MODE === 'direct') {
      // Прямой запрос к API Heygen v2
      try {
        console.log(`Sending text to Heygen session ${sessionId}:`, text.substring(0, 30) + '...');
        
        // В API v2 текст отправляется на новый эндпоинт
        const response = await heygenDirectAxios.post(`/streaming/talk`, {
          "session_id": sessionId,
          "text": text,
          "voice_setting": {
            "stability": options.voiceStability || 0.5,
            "speed": options.voiceSpeed || 1.0,
            "style": options.voiceStyle || 0,
          },
          "language": options.language || "ru"
        });
        
        console.log('Heygen talk response:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error sending text to session:', error);
        throw error;
      }
    } else {
      // Запрос через наш бэкенд
      try {
        const response = await heygenProxyAxios.post('/streaming/text', {
          session_id: sessionId,
          text: text,
          voice_id: options.voiceId,
          voice_speed: options.voiceSpeed || 1.0,
          voice_stability: options.voiceStability || 0.5,
          voice_style: options.voiceStyle || 0,
          language: options.language || 'ru'
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  },
  
  /**
   * Получает список доступных голосов
   * @param {string} language - Язык голосов (по умолчанию "ru" - русский)
   * @returns {Promise} - Promise с ответом
   */
  getVoices: async (language = 'ru') => {
    // Используем кэширование для оптимизации
    if (HeygenService._cachedVoices[language]) {
      return HeygenService._cachedVoices[language];
    }
    
    try {
      let voices = [];
      
      if (API_MODE === 'direct') {
        // Прямой запрос к Heygen API v2
        console.log(`Fetching voices for language: ${language}`);
        const response = await heygenDirectAxios.get('/voice');
        console.log('Voice API response status:', response.status);
        
        if (response.data && response.data.data) {
          const allVoices = response.data.data;
          // Фильтруем голоса по языку
          const filteredVoices = language === 'all' ? allVoices : allVoices.filter(v => 
            v.language_code === language || 
            // Для обратной совместимости
            (language === 'ru' && v.language_code === 'russian') ||
            (language === 'russian' && v.language_code === 'ru')
          );
          
          console.log(`Found ${filteredVoices.length} voices for language ${language}`);
          
          voices = filteredVoices.map(voice => ({
            id: voice.voice_id,
            name: voice.name || 'Voice',
            gender: voice.gender || 'neutral',
            language: voice.language || 'english',
            language_code: voice.language_code || 'en'
          }));
        }
      } else {
        // Запрос через наш бэкенд
        const response = await heygenProxyAxios.get(`/tts/voices?language=${language}`);
        voices = response.data?.voices || [];
      }
      
      // Кэшируем результаты
      if (voices.length > 0) {
        HeygenService._cachedVoices[language] = voices;
      }
      
      return voices;
    } catch (error) {
      console.warn('Error fetching voices, using mock data:', error.message);
      return HeygenService.getMockVoices(language);
    }
  },
  
  /**
   * Возвращает мок-данные аватаров для использования в случае недоступности API
   * @returns {Array} - Массив аватаров
   */
  getMockAvatars: () => {
    // URL-адреса к надежным изображениям из библиотеки Material-UI
    // или других общедоступных CDN для обеспечения доступности
    const defaultAvatarImages = {
      female1: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
      female2: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y',
      male1: 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?d=mp&f=y',
      male2: 'https://www.gravatar.com/avatar/6d8ebb117e8d83d74ea95c790d3af266?d=mp&f=y'
    };
    
    // Возвращаем данные в соответствии с обновлённой структурой API Heygen v2
    return [
      {
        id: 'sofia_123',
        avatar_id: 'sofia_123',
        avatar_name: 'София',
        gender: 'женский',
        preview_image_url: defaultAvatarImages.female1,
        preview_url: defaultAvatarImages.female1,
        description: 'Профессиональная, дружелюбная, подходит для бизнес-интервью',
      },
      {
        id: 'alex_456',
        avatar_id: 'alex_456',
        avatar_name: 'Алекс',
        gender: 'мужской',
        preview_image_url: defaultAvatarImages.male1,
        preview_url: defaultAvatarImages.male1,
        description: 'Энергичный, современный, технический специалист',
      },
      {
        id: 'elena_789',
        avatar_id: 'elena_789',
        avatar_name: 'Елена',
        gender: 'женский',
        preview_image_url: defaultAvatarImages.female2,
        preview_url: defaultAvatarImages.female2,
        description: 'Спокойная, вдумчивая, аналитический подход',
      },
      {
        id: 'mikhail_012',
        avatar_id: 'mikhail_012',
        avatar_name: 'Михаил',
        gender: 'мужской',
        preview_image_url: defaultAvatarImages.male2,
        preview_url: defaultAvatarImages.male2,
        description: 'Опытный, серьезный, подходит для руководящих позиций',
      },
    ];
  },
  
  /**
   * Возвращает мок-данные голосов для использования в случае недоступности API
   * @param {string} language - Язык голосов
   * @returns {Array} - Массив голосов
   */
  getMockVoices: (language = 'russian') => {
    const voices = {
      'russian': [
        { id: 1, name: 'Анна', gender: 'женский', language: 'Русский' },
        { id: 2, name: 'Дмитрий', gender: 'мужской', language: 'Русский' },
        { id: 3, name: 'Мария', gender: 'женский', language: 'Русский' },
        { id: 4, name: 'Алекс', gender: 'мужской', language: 'Русский' },
      ],
      'english': [
        { id: 5, name: 'Emily', gender: 'женский', language: 'Английский' },
        { id: 6, name: 'Michael', gender: 'мужской', language: 'Английский' },
      ]
    };
    
    return voices[language] || voices.russian;
  },
  
  /**
   * Создает новую сессию стриминга с использованием API v1
   * @param {Object} options - Настройки для новой сессии
   * @returns {Promise} - Promise с данными сессии
   */
  createStreamingSessionV1: async (options = {}) => {
    console.log('Creating v1 streaming session with options:', options);
    
    try {
      const payload = {
        quality: options.quality || 'medium',
        voice: { rate: options.voiceSpeed || 1 },
        video_encoding: options.videoEncoding || 'VP8',
        disable_idle_timeout: options.disableIdleTimeout || false,
        version: 'v2',
        stt_settings: {
          provider: 'deepgram',
          confidence: 0.55
        },
        avatar_id: options.avatarId
      };
      
      if (API_MODE === 'direct') {
        // Прямой запрос к Heygen API v1
        const response = await heygenDirectAxiosV1.post('/streaming.new', payload);
        console.log('v1 streaming session created:', response.data);
        
        return response.data;
      } else if (API_MODE === 'proxy') {
        // Через прокси
        const response = await heygenProxyAxios.post('/v1/streaming.new', payload);
        return response.data;
      } else {
        // Для тестирования возвращаем мок-данные
        console.log('Using mock data for streaming session');
        return {
          status: 'success',
          session_id: 'mock_session_' + Math.random().toString(36).substring(2, 10),
          message: 'Mock streaming session created'
        };
      }
    } catch (error) {
      console.error('Error creating v1 streaming session:', error);
      throw error;
    }
  },
  
  /**
   * Запускает сессию стриминга v1
   * @param {string} sessionId - ID сессии
   * @returns {Promise} - Promise с результатом
   */
  startStreamingSessionV1: async (sessionId) => {
    if (!sessionId) {
      throw new Error('Не указан ID сессии');
    }
    
    try {
      if (API_MODE === 'direct') {
        const response = await heygenDirectAxiosV1.post(`/streaming.start`, { session_id: sessionId });
        return response.data;
      } else if (API_MODE === 'proxy') {
        const response = await heygenProxyAxios.post(`/v1/streaming.start`, { session_id: sessionId });
        return response.data;
      } else {
        // Для тестирования возвращаем мок-данные
        console.log('Using mock data for starting streaming session:', sessionId);
        return {
          status: 'success',
          message: 'Mock streaming session started',
          data: {
            session_id: sessionId,
            status: 'running'
          }
        };
      }
    } catch (error) {
      console.error('Error starting streaming session:', error);
      throw error;
    }
  },
  
  /**
   * Отправляет текст для озвучивания в сессии v1
   * @param {string} sessionId - ID сессии
   * @param {string} text - Текст для озвучивания
   * @returns {Promise} - Promise с результатом
   */
  sendTaskToStreamingV1: async (sessionId, text) => {
    if (!sessionId || !text) throw new Error('Session ID and text are required');
    
    try {
      const payload = {
        session_id: sessionId,
        text: text
      };
      
      if (API_MODE === 'direct') {
        // Прямой запрос к Heygen API v1
        const response = await heygenDirectAxiosV1.post('/streaming.task', payload);
        console.log('Task sent to v1 streaming session:', response.data);
        
        return {
          status: response.data.status,
          task_id: response.data.data.task_id
        };
      } else if (API_MODE === 'proxy') {
        // Через прокси
        const response = await heygenProxyAxios.post('/v1/streaming.task', payload);
        return response.data;
      } else {
        // Для тестирования возвращаем мок-данные
        console.log('Using mock data for sending task to streaming session:', sessionId, text);
        return {
          status: 'success',
          message: 'Mock task sent to streaming session',
          data: {
            task_id: 'mock_task_' + Math.random().toString(36).substring(2, 10),
            session_id: sessionId
          }
        };
      }
    } catch (error) {
      console.error('Error sending task to v1 streaming session:', error);
      throw error;
    }
  },
  
  /**
   * Останавливает сессию стриминга v1
   * @param {string} sessionId - ID сессии
   * @returns {Promise} - Promise с результатом
   */
  stopStreamingSessionV1: async (sessionId) => {
    if (!sessionId) throw new Error('Session ID is required');
    
    try {
      const payload = { session_id: sessionId };
      
      if (API_MODE === 'direct') {
        // Прямой запрос к Heygen API v1
        const response = await heygenDirectAxiosV1.post('/streaming.stop', payload);
        console.log('v1 streaming session stopped:', response.data);
        
        return {
          status: response.data.status,
          session_id: sessionId
        };
      } else if (API_MODE === 'proxy') {
        // Через прокси
        const response = await heygenProxyAxios.post('/v1/streaming.stop', payload);
        return response.data;
      } else {
        // Для тестирования возвращаем мок-данные
        console.log('Using mock data for stopping streaming session:', sessionId);
        return {
          status: 'success',
          message: 'Mock streaming session stopped',
          data: {
            session_id: sessionId,
            status: 'stopped'
          }
        };
      }
    } catch (error) {
      console.error('Error stopping v1 streaming session:', error);
      // Не выбрасываем ошибку при закрытии сессии
      return { status: 'error', message: error.message };
    }
  },
  
  /**
   * Прерывает текущую задачу в сессии стриминга v1
   * @returns {Promise} - Promise с результатом
   */
  interruptStreamingTaskV1: async () => {
    try {
      if (API_MODE === 'direct') {
        // Прямой запрос к Heygen API v1
        const response = await heygenDirectAxiosV1.post('/streaming.interrupt');
        console.log('Streaming task interrupted:', response.data);
        
        return {
          status: response.data.status
        };
      } else {
        // Через прокси
        const response = await heygenProxyAxios.post('/v1/streaming.interrupt');
        return response.data;
      }
    } catch (error) {
      console.error('Error interrupting streaming task:', error);
      throw error;
    }
  },
  
  /**
   * Получает список активных сессий стриминга v1
   * @returns {Promise} - Promise со списком сессий
   */
  listActiveStreamingSessions: async () => {
    try {
      if (API_MODE === 'direct') {
        // Прямой запрос к Heygen API v1
        const response = await heygenDirectAxiosV1.get('/streaming.list');
        console.log('Active streaming sessions:', response.data);
        
        return {
          sessions: response.data.data.sessions || [],
          status: response.data.status
        };
      } else {
        // Через прокси
        const response = await heygenProxyAxios.get('/v1/streaming.list');
        return response.data;
      }
    } catch (error) {
      console.error('Error listing active streaming sessions:', error);
      throw error;
    }
  },
  
  /**
   * Получает историю сессий стриминга v1
   * @param {number} page - Номер страницы
   * @param {number} pageSize - Размер страницы
   * @returns {Promise} - Promise с историей сессий
   */
  listStreamingHistory: async (page = 1, pageSize = 10) => {
    try {
      if (API_MODE === 'direct') {
        // Прямой запрос к Heygen API v1
        const response = await heygenDirectAxiosV1.get(`/streaming.list?page=${page}&page_size=${pageSize}`);
        console.log('Streaming history:', response.data);
        
        return {
          sessions: response.data.data.sessions || [],
          status: response.data.status,
          pagination: response.data.data.pagination || {}
        };
      } else {
        // Через прокси
        const response = await heygenProxyAxios.get(`/v1/streaming.list?page=${page}&page_size=${pageSize}`);
        return response.data;
      }
    } catch (error) {
      console.error('Error listing streaming history:', error);
      throw error;
    }
  },
  
  /**
   * Возвращает текущий режим API и настройки
   * @returns {Object} - Информация о текущем режиме API и настройках
   */
  getApiMode() {
    return {
      mode: API_MODE,
      apiKey: HEYGEN_API_KEY ? 'Установлен' : 'Не установлен',
      version: HEYGEN_API_VERSION,
      urls: {
        direct: HEYGEN_API_V1_URL,
        proxy: LOCAL_HEYGEN_API
      }
    };
  },
  
  /**
   * Получает список доступных аватаров для стриминга v1
   * @returns {Promise} - Promise со списком аватаров
   */
  getStreamingAvatars: async () => {
    try {
      if (API_MODE === 'direct') {
        return heygenDirectAxiosV1.get('/avatar.list')
          .then(response => {
            if (response.data && response.data.data) {
              return { avatars: response.data.data, status: 'success' };
            }
            return { avatars: [], status: 'error', message: 'Неверный формат ответа API' };
          })
          .catch(error => {
            console.error('Error fetching avatars from direct API:', error);
            return { avatars: HeygenService.getMockAvatars(), status: 'error', message: error.message };
          });
      } else if (API_MODE === 'proxy') {
        return heygenProxyAxios.get('/avatars')
          .then(response => {
            if (response.data && response.data.avatars) {
              return { avatars: response.data.avatars, status: 'success' };
            }
            return { avatars: [], status: 'error', message: 'Неверный формат ответа API' };
          })
          .catch(error => {
            console.error('Error fetching avatars from proxy:', error);
            return { avatars: HeygenService.getMockAvatars(), status: 'error', message: error.message };
          });
      } else {
        // Режим mock - возвращаем мок-данные
        return Promise.resolve({ avatars: HeygenService.getMockAvatars(), status: 'success' });
      }
    } catch (error) {
      console.error('Error in getStreamingAvatars:', error);
      return Promise.resolve({ avatars: HeygenService.getMockAvatars(), status: 'success' });
    }
  }
};

export default HeygenService;
