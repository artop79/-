import axios from 'axios';
import config from '../config';

/**
 * Сервис для работы с HR агентом через API
 */
class HRAgentService {
  /**
   * Базовый URL для API HR агента
   */
  apiUrl = `${config.api.baseUrl}/hr-agent`;

  /**
   * Получение списка доступных личностей для HR агента
   * @returns {Promise<Array>} - Список личностей
   */
  async getAvailablePersonalities() {
    try {
      const response = await axios.get(`${this.apiUrl}/personalities`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении списка личностей HR агента:', error);
      throw error;
    }
  }

  /**
   * Создание новой беседы с кандидатом
   * @param {string} candidateId - ID кандидата
   * @param {string} vacancyId - ID вакансии (опционально)
   * @param {string} personalityId - ID личности HR агента
   * @returns {Promise<Object>} - Информация о созданной беседе
   */
  async createConversation(candidateId, vacancyId = null, personalityId = 'professional') {
    try {
      const response = await axios.post(`${this.apiUrl}/conversations`, {
        candidate_id: candidateId,
        vacancy_id: vacancyId,
        personality_id: personalityId
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании беседы с кандидатом:', error);
      throw error;
    }
  }

  /**
   * Отправка сообщения в беседу и получение ответа от HR агента
   * @param {string} conversationId - ID беседы
   * @param {string} message - Текст сообщения
   * @returns {Promise<Object>} - Ответ от HR агента
   */
  async sendMessage(conversationId, message) {
    try {
      const response = await axios.post(`${this.apiUrl}/conversations/${conversationId}/messages`, {
        message
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при отправке сообщения HR агенту:', error);
      throw error;
    }
  }

  /**
   * Получение истории сообщений беседы
   * @param {string} conversationId - ID беседы
   * @returns {Promise<Array>} - История сообщений
   */
  async getConversationHistory(conversationId) {
    try {
      const response = await axios.get(`${this.apiUrl}/conversations/${conversationId}/history`);
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении истории сообщений:', error);
      throw error;
    }
  }
}

export default new HRAgentService();
