import axios from 'axios';
import config from '../config';

/**
 * Сервис для работы с Telegram ботом через API
 */
class TelegramService {
  /**
   * Базовый URL для API Telegram бота
   */
  apiUrl = `${config.api.baseUrl}/integrations/telegram`;

  /**
   * Настройка и активация Telegram бота
   * @param {string} token - API токен Telegram бота
   * @param {string} webhookUrl - Опциональный URL для webhook (для продакшена)
   * @returns {Promise<Object>} - Ответ от API
   */
  async configureTelegramBot(token, webhookUrl = null) {
    // Проверка токена
    if (!token || token.trim().length < 10) {
      console.error('Ошибка: неверный формат токена Telegram');
      throw new Error('Неверный формат токена Telegram. Токен должен быть не менее 10 символов.');
    }
    
    try {
      // Подробное логирование конфигурации
      console.log('Конфигурация:', { 
        baseUrl: config.api.baseUrl,
        fullApiUrl: this.apiUrl,
        configDump: JSON.stringify(config)
      });
      
      const fullUrl = `${this.apiUrl}/configure`;
      console.log('Отправка запроса на настройку Telegram бота:', {
        url: fullUrl,
        token: `${token.substring(0, 5)}...${token.substring(token.length - 5)}`, // скрываем часть токена для безопасности
        webhook_url: webhookUrl
      });
      
      const response = await axios.post(fullUrl, {
        token,
        webhook_url: webhookUrl
      });
      
      console.log('Ответ на настройку Telegram бота:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при настройке Telegram бота:', error);
      
      // Детальная информация об ошибке
      if (error.response) {
        // Сервер вернул ошибку
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        // Если сервер вернул структурированную ошибку, возвращаем её
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      } else if (error.request) {
        // Запрос был сделан, но ответ не получен
        console.error('No response received:', error.request);
        throw new Error('Нет ответа от сервера. Проверьте подключение к интернету.');
      }
      
      throw error;
    }
  }

  /**
   * Получение статуса Telegram бота
   * @returns {Promise<Object>} - Информация о статусе бота
   */
  async getTelegramBotStatus() {
    try {
      console.log('Запрос статуса Telegram бота...');
      const response = await axios.get(`${this.apiUrl}/status`);
      console.log('Получен статус Telegram бота:', response.data);
      
      // Дополнительная проверка данных
      if (response.data && response.data.data) {
        const botData = response.data.data;
        console.log('Детали статуса:', botData);
        
        // Добавляем дополнительную информацию о статусе
        if (botData.status === 'running') {
          console.log('Бот активен и работает!');
        } else if (botData.status === 'stopped') {
          console.log('Бот остановлен или не запущен');
        } else if (botData.status === 'not_configured') {
          console.log('Бот еще не настроен');
        } else if (botData.status === 'error') {
          console.error('Ошибка в статусе бота:', botData.error);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении статуса Telegram бота:', error);
      
      // Проверяем, доступен ли сервер
      if (error.code === 'ECONNREFUSED') {
        console.error('Нет соединения с сервером. Сервер не запущен или недоступен.');
        throw new Error('Нет соединения с сервером. Проверьте, что сервер запущен.');
      }
      
      // Возвращаем базовый статус в случае ошибки
      return {
        success: false,
        message: 'Ошибка при получении статуса бота',
        data: {
          status: 'error',
          error: error.message || 'Неизвестная ошибка'
        }
      };
    }
  }

  /**
   * Остановка Telegram бота
   * @returns {Promise<Object>} - Ответ от API
   */
  async stopTelegramBot() {
    try {
      const response = await axios.post(`${this.apiUrl}/stop`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при остановке Telegram бота:', error);
      throw error;
    }
  }

  /**
   * Отправка сообщения кандидату через Telegram
   * @param {number} chatId - Telegram chat ID кандидата
   * @param {string} message - Текст сообщения
   * @param {Object} replyMarkup - Опциональная клавиатура (кнопки)
   * @returns {Promise<Object>} - Ответ от API
   */
  async sendMessageToCandidate(chatId, message, replyMarkup = null) {
    try {
      const response = await axios.post(`${this.apiUrl}/send-message`, {
        chat_id: chatId,
        message,
        reply_markup: replyMarkup
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при отправке сообщения кандидату:', error);
      throw error;
    }
  }

  /**
   * Отправка приглашения на собеседование кандидату через Telegram
   * @param {number} chatId - Telegram chat ID кандидата
   * @param {string} position - Название позиции
   * @param {string} company - Название компании
   * @param {string} dateTime - Дата и время собеседования
   * @returns {Promise<Object>} - Ответ от API
   */
  async sendInterviewInvitation(chatId, position, company, dateTime) {
    try {
      const response = await axios.post(`${this.apiUrl}/send-interview-invitation`, {
        chat_id: chatId,
        position,
        company,
        date_time: dateTime
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при отправке приглашения на собеседование:', error);
      throw error;
    }
  }

  /**
   * Создание inline кнопок для Telegram сообщений
   * @param {Array<Array<{text: string, callback_data: string}>>} buttons - Массив кнопок
   * @returns {Object} - Объект reply_markup для отправки с сообщением
   */
  createInlineKeyboard(buttons) {
    return {
      inline_keyboard: buttons
    };
  }

  /**
   * Создание callback данных для кнопок (удобный JSON враппер)
   * @param {Object} data - Данные для кнопки
   * @returns {string} - JSON строка для callback_data
   */
  createCallbackData(data) {
    return JSON.stringify(data);
  }

  /**
   * Пример создания кнопок для приглашения на собеседование
   * @param {string} position - Название позиции
   * @param {string} dateTime - Дата и время собеседования
   * @returns {Object} - Объект reply_markup
   */
  createInterviewInvitationButtons(position, dateTime) {
    return this.createInlineKeyboard([
      [
        {
          text: "Подтвердить",
          callback_data: this.createCallbackData({
            action: "confirm_interview",
            position,
            time: dateTime
          })
        },
        {
          text: "Предложить другое время",
          callback_data: this.createCallbackData({
            action: "reschedule_interview",
            position
          })
        }
      ]
    ]);
  }
}

export default new TelegramService();
