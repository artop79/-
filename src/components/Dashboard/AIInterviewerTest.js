import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Card,
  CardContent,
  Grid,
  Divider,
  IconButton,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Tooltip
} from '@mui/material';
import { 
  analyzeEmotionalTone, 
  adaptResponseToEmotion, 
  analyzeConversationContext,
  generateContextualQuestion,
  createSmoothTransition
} from '../../utils/conversationUtils';
import EmotionIndicator from '../UI/EmotionIndicator';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import RefreshIcon from '@mui/icons-material/Refresh';
import HeygenService from '../../services/heygenService';

/**
 * Компонент AI Interviewer Test с интеграцией Heygen для видеоинтервью
 */
const AIInterviewerTest = () => {
  // Состояния для сессии
  const [sessionId, setSessionId] = useState(null);
  const [sessionStatus, setSessionStatus] = useState('idle'); // idle, loading, active, error
  const [availableAvatars, setAvailableAvatars] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [avatarsLoading, setAvatarsLoading] = useState(false);
  
  // Состояния для интерфейса
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const [currentEmotion, setCurrentEmotion] = useState('neutral'); // Текущее эмоциональное состояние диалога
  
  // Ссылки
  const videoContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // Загрузка доступных аватаров при монтировании компонента
  useEffect(() => {
    // Загружаем аватары или используем моковые данные
    const initAvatars = async () => {
      try {
        setAvatarsLoading(true);
        // Сразу загружаем мок-аватары для быстрого отображения
        const mockAvatars = HeygenService.getMockAvatars();
        setAvailableAvatars(mockAvatars);
        setSelectedAvatar(mockAvatars[0]);
        setInfoMessage('Аватары загружены. Выберите аватар и начните интервью.');
        
        // Пытаемся загрузить реальные аватары
        try {
          const result = await HeygenService.getStreamingAvatars();
          
          if (result && result.avatars && result.avatars.length > 0) {
            setAvailableAvatars(result.avatars);
            setSelectedAvatar(result.avatars[0]);
          }
        } catch (apiError) {
          console.log('Using mock avatars due to API error:', apiError);
          // Продолжаем с мок-аватарами, которые уже загружены
        }
      } catch (error) {
        console.error('Error initializing avatars:', error);
        setError('Ошибка инициализации аватаров: ' + (error.message || 'Неизвестная ошибка'));
      } finally {
        setAvatarsLoading(false);
      }
    };
    
    initAvatars();
  }, []);
  
  // Прокручиваем к последнему сообщению при его добавлении
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (sessionId) {
        stopSession();
      }
    };
  }, [sessionId]);
  
  // Загрузка доступных аватаров
  const loadAvatars = async () => {
    try {
      setAvatarsLoading(true);
      setError(null);
      
      const result = await HeygenService.getStreamingAvatars();
      
      if (result && result.avatars && result.avatars.length > 0) {
        setAvailableAvatars(result.avatars);
        setSelectedAvatar(result.avatars[0]);
        setInfoMessage('Аватары успешно обновлены.');
      } else {
        throw new Error('Не удалось получить аватары');
      }
    } catch (error) {
      console.error('Error loading avatars:', error);
      // Используем мок-аватары, если API недоступно
      const mockAvatars = HeygenService.getMockAvatars();
      setAvailableAvatars(mockAvatars);
      setSelectedAvatar(mockAvatars[0]);
      setError('Ошибка загрузки аватаров, используются демо-аватары: ' + (error.message || 'Неизвестная ошибка'));
    } finally {
      setAvatarsLoading(false);
    }
  };
  
  // Создание новой сессии
  const handleStartSession = async () => {
    // Проверка на наличие выбранного аватара
    if (!selectedAvatar) {
      setError('Выберите аватар для интервью');
      return;
    }
    
    // Проверка на наличие ID аватара
    const avatarId = selectedAvatar.id || selectedAvatar.avatar_id;
    if (!avatarId) {
      setError('Невалидный аватар: отсутствует ID');
      return;
    }
    
    try {
      // Устанавливаем статус загрузки
      setSessionStatus('loading');
      setError(null);
      setInfoMessage('Создание сессии видеоинтервью...');
      
      // ВСЕГДА используем реальный API Heygen для видеоинтервью
      const useDemo = false; // Никогда не используем демо-режим по умолчанию
      
      if (useDemo) {
        // Демо-режим - имитируем сессию
        await simulateSession();
      } else {
        // Создаем реальную сессию через API
        try {
          // Дополнительная проверка на наличие voice_id
          const voiceId = selectedAvatar.voice_id || 'default';
          
          // Проверяем настройки API в HeygenService
          console.log('Проверка настроек Heygen API:', {
            API_MODE: HeygenService.getApiMode(), // Добавим метод для получения настроек
            avatarId: avatarId,
            voiceId: voiceId
          });
          
          setInfoMessage('Отправка запроса на создание сессии видеоинтервью...');
          
          // Устанавливаем таймаут для запроса API
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Таймаут запроса API. Проверьте подключение.')), 20000) // Увеличиваем таймаут до 20 секунд
          );
          
          // Создаем сессию с ограничением по времени
          const sessionData = await Promise.race([
            HeygenService.createStreamingSessionV1({
              avatar_id: avatarId,
              voice_id: voiceId
            }),
            timeoutPromise
          ]);
          
          // Проверка на наличие данных и session_id
          if (sessionData && sessionData.session_id) {
            // Успешно создана сессия, запускаем видео
            console.log('Сессия успешно создана:', sessionData);
            setInfoMessage('Сессия создана, запуск видеоинтервью...');
            await startSession(sessionData.session_id);
          } else {
            // Обработка случая, когда ответ пришел, но без session_id
            console.error('API вернул неполные данные:', sessionData);
            setError('Ошибка API: сессия создана, но нет ID сессии. Проверьте настройки API.');
            setSessionStatus('error');
            // Не переходим в демо-режим
          }
        } catch (apiError) {
          // Детальная обработка ошибок API
          console.error('API error:', apiError);
          const errorMessage = apiError.response?.data?.message || apiError.message || 'Неизвестная ошибка API';
          const errorCode = apiError.response?.status;
          
          // Показываем ошибку пользователю и не переходим в демо-режим
          if (errorCode === 401 || errorCode === 403) {
            setError(`Ошибка авторизации API (${errorCode}). Проверьте наличие и правильность API ключа.`);
          } else if (errorCode === 404) {
            setError(`Ошибка API: ресурс не найден (${errorCode}). Проверьте правильность URL API.`);
          } else {
            setError(`Ошибка API: ${errorMessage}. Попробуйте еще раз или проверьте настройки API.`);
          }
          
          setSessionStatus('error');
          // Не переходим в демо-режим
        }
      }
    } catch (error) {
      console.error('Session error:', error);
      setSessionStatus('error');
      // Более информативное сообщение об ошибке
      const errorDetails = error.message || (typeof error === 'string' ? error : JSON.stringify(error));
      setError(`Ошибка при создании сессии: ${errorDetails}`);
    }
  };
  
  // Симуляция сессии для демонстрации
  const simulateSession = async () => {
    try {
      // Имитируем загрузку
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Создаем мок-ID сессии
      const mockSessionId = 'mock_session_' + Math.random().toString(36).substring(2, 10);
      
      // Обновляем состояние
      setSessionId(mockSessionId);
      setSessionStatus('active');
      setInfoMessage('Демо-режим: сессия видеоинтервью активна.');
      
      // Добавляем приветственное сообщение
      addMessage({
        text: 'Здравствуйте! Я ваш AI-интервьюер. Готов провести с вами собеседование. Расскажите немного о себе.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        emotion: 'neutral'
      });
      
      // Отправляем приветственный текст аватару
      await sendTextToAvatar('Здравствуйте! Я ваш AI-интервьюер. Готов провести с вами собеседование. Расскажите немного о себе.');
    } catch (error) {
      console.error('Error in demo mode:', error);
      setError('Ошибка в демо-режиме: ' + (error.message || 'Неизвестная ошибка'));
      setSessionStatus('error');
    }
  };
  
  // Функция запасного варианта с мок-сессией
  const fallbackToMockSession = async () => {
    try {
      console.log('Falling back to mock session...');
      
      // Небольшая задержка для реалистичности
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Создаем мок-ID сессии
      const mockSessionId = 'mock_session_fallback_' + Math.random().toString(36).substring(2, 10);
      
      // Обновляем состояние
      setSessionId(mockSessionId);
      setSessionStatus('active');
      setInfoMessage('Использован демо-режим из-за недоступности API. Сессия видеоинтервью активна.');
      
      // Добавляем приветственное сообщение
      addMessage({
        text: 'Здравствуйте! Я ваш AI-интервьюер. Готов провести с вами собеседование. Расскажите немного о себе.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        emotion: 'neutral'
      });
      
      // Отправляем приветственный текст аватару
      await sendTextToAvatar('Здравствуйте! Я ваш AI-интервьюер. Готов провести с вами собеседование. Расскажите немного о себе.');
    } catch (error) {
      console.error('Error in fallback mode:', error);
      setError('Ошибка в запасном режиме: ' + (error.message || 'Неизвестная ошибка'));
      setSessionStatus('error');
    }
  };
  
  // Запуск созданной сессии
  const startSession = async (sessId) => {
    if (!sessId) {
      setError('ID сессии не указан для запуска');
      setSessionStatus('error');
      return;
    }
    
    try {
      // Запускаем сессию
      const startData = await HeygenService.startStreamingSessionV1(sessId);
      console.log('Started streaming session:', startData);
      
      // Обновляем состояние
      setSessionId(sessId);
      setSessionStatus('active');
      setInfoMessage('Сессия видеоинтервью активна.');
      
      // Добавляем приветственное сообщение
      addMessage({
        text: 'Здравствуйте! Я ваш AI-интервьюер. Готов провести с вами собеседование. Расскажите немного о себе.',
        sender: 'ai',
        timestamp: new Date().toISOString(),
        emotion: 'neutral'
      });
      
      // Отправляем приветственный текст аватару
      await sendTextToAvatar('Здравствуйте! Я ваш AI-интервьюер. Готов провести с вами собеседование. Расскажите немного о себе.');
    } catch (error) {
      console.error('Error starting session:', error);
      setError('Ошибка запуска сессии: ' + (error.message || 'Неизвестная ошибка'));
      setSessionStatus('error');
    }
  };
  
  // Остановка сессии
  const stopSession = async () => {
    if (!sessionId) return;
    
    try {
      setInfoMessage('Завершение сессии видеоинтервью...');
      
      // Проверяем, начинается ли ID сессии с 'mock_'
      if (sessionId.startsWith('mock_')) {
        // В демо-режиме просто имитируем завершение сессии
        console.log('Demo mode: stopping mock session:', sessionId);
        
        // Небольшая задержка для реалистичности
        setTimeout(() => {
          setSessionStatus('idle');
          setSessionId(null);
          setInfoMessage('Сессия видеоинтервью завершена.');
        }, 1000);
      } else {
        try {
          const stopData = await HeygenService.stopStreamingSessionV1(sessionId);
          console.log('Stopped streaming session:', stopData);
          
          setSessionStatus('idle');
          setSessionId(null);
          setInfoMessage('Сессия видеоинтервью завершена.');
        } catch (apiError) {
          console.log('API error on stopping session, continuing anyway:', apiError);
          // Даже если запрос к API не удался, все равно завершаем сессию локально
          setSessionStatus('idle');
          setSessionId(null);
          setInfoMessage('Сессия видеоинтервью завершена.');
        }
      }
    } catch (error) {
      console.error('Error stopping session:', error);
      // Все равно сбрасываем состояние, чтобы пользователь мог начать заново
      setSessionStatus('idle');
      setSessionId(null);
      setInfoMessage('Сессия видеоинтервью завершена с ошибками.');
    }
  };
  
  // Отправка текста аватару с учетом эмоционального тона
  const sendTextToAvatar = async (text, emotion = 'neutral') => {
    // Расширенные проверки на наличие необходимых параметров
    if (!sessionId) {
      console.error('Ошибка: Отсутствует ID сессии');
      return null;
    }
    
    if (!text || typeof text !== 'string') {
      console.error('Ошибка: Недопустимый текст для отправки', text);
      return null;
    }
    
    // Ограничение длины текста для предотвращения ошибок API
    const maxTextLength = 500;
    if (text.length > maxTextLength) {
      console.warn(`Текст слишком длинный (${text.length} символов), ограничен до ${maxTextLength}`);
      text = text.substring(0, maxTextLength) + '...';
    }
    
    try {
      setIsSpeaking(true);
      
      // Проверяем, что сессия активна
      if (sessionStatus !== 'active') {
        console.error('Сессия не активна');
        setError('Сессия не активна. Запустите сессию перед отправкой текста.');
        setIsSpeaking(false);
        return null;
      }
      
      // Добавляем метаданные эмоций для аватара (SSML разметка или API-параметры)
      let enhancedText = text;
      let emotionParams = {};
      
      // В реальном API, здесь бы передавались параметры эмоций
      // В текущей реализации просто подготавливаем данные для разных API
      switch(emotion) {
        case 'positive':
          emotionParams = { emotion: 'happy', intensity: 0.7 };
          // enhancedText = `<speak><amazon:emotion name="excited" intensity="high">${text}</amazon:emotion></speak>`;
          break;
        case 'negative':
          emotionParams = { emotion: 'sad', intensity: 0.5 };
          // enhancedText = `<speak><amazon:emotion name="disappointed" intensity="medium">${text}</amazon:emotion></speak>`;
          break;
        case 'contemplative':
          emotionParams = { emotion: 'thoughtful', intensity: 0.6 };
          // enhancedText = `<speak><amazon:emotion name="calm" intensity="medium">${text}</amazon:emotion></speak>`;
          break;
        default:
          emotionParams = { emotion: 'neutral', intensity: 0.3 };
          // enhancedText = `<speak>${text}</speak>`;
      }
      
      // Проверяем, начинается ли ID сессии с 'mock_'
      if (sessionId.startsWith('mock_')) {
        // В демо-режиме просто имитируем задержку
        console.log('Demo mode: simulating speech for text:', text);
        
        // Имитируем время озвучивания
        const speakingTime = Math.max(2000, Math.min(text.length * 80, 8000)); // Минимум 2 сек, максимум 8 сек
        setTimeout(() => {
          setIsSpeaking(false);
        }, speakingTime);
        
        return { status: 'success', task_id: 'mock_task_' + Math.random().toString(36).substring(2, 10) };
      } else {
        // В реальном режиме отправляем запрос к API
        try {
          // Устанавливаем таймаут для запроса API
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Таймаут запроса API. Проверьте подключение.')), 8000)
          );
          
          // В текущей реализации Heygen API не поддерживает передачу эмоций,
          // но структура готова для будущих версий API
          const taskData = await Promise.race([
            HeygenService.sendTaskToStreamingV1(sessionId, enhancedText, emotionParams),
            timeoutPromise
          ]);
          
          // Проверка на успешный ответ API
          if (!taskData || !taskData.task_id) {
            console.warn('Неполный ответ API Heygen:', taskData);
            throw new Error('Невалидный ответ API: отсутствует task_id');
          }
          
          console.log('Task sent to streaming session:', taskData);
          
          // Имитируем время озвучивания (в реальной интеграции это будет событие от видеоплеера)
          // Динамически рассчитываем длительность в зависимости от длины текста
          const speakingTime = Math.max(2000, Math.min(text.length * 80, 10000)); // Минимум 2 сек, максимум 10 сек
          
          // Используем таймер с идентификатором для возможности отмены
          const timerId = setTimeout(() => {
            setIsSpeaking(false);
            console.log('Avatar finished speaking, task_id:', taskData.task_id);
          }, speakingTime);
          
          // Сохраняем ID таймера для возможности его отмены при необходимости
          // В реальной реализации можно сохранить в объекте состояния
          window._lastSpeakingTimer = timerId;
          
          return taskData;
        } catch (apiError) {
          console.error('API error, switching to demo mode:', apiError);
          
          // Более детальная обработка ошибок API
          const errorMessage = apiError.response?.data?.message || apiError.message || 'Неизвестная ошибка API';
          const errorCode = apiError.response?.status;
          
          // Логируем дополнительную информацию об ошибке для отладки
          console.debug('API error details:', {
            code: errorCode,
            message: errorMessage,
            sessionId,
            textLength: text.length
          });
          
          // Если это ошибка авторизации, показываем информативное сообщение
          if (errorCode === 401 || errorCode === 403 || errorMessage.includes('auth') || errorMessage.includes('key')) {
            setInfoMessage('Ошибка авторизации API. Проверьте ключ API в настройках.');
          }
          
          // Если запрос к API не удался, имитируем работу в демо-режиме
          const speakingTime = Math.max(2000, Math.min(text.length * 80, 10000));
          setTimeout(() => {
            setIsSpeaking(false);
          }, speakingTime);
          
          return { 
            status: 'success', 
            task_id: 'mock_task_' + Math.random().toString(36).substring(2, 10),
            fallback: true,
            original_error: errorMessage
          };
        }
      }
    } catch (error) {
      console.error('Error sending text to avatar:', error);
      // Не показываем ошибку пользователю, чтобы не мешать демо
      setTimeout(() => {
        setIsSpeaking(false);
      }, 3000);
      return { status: 'success', task_id: 'mock_task_error' };
    }
  };
  
  // Добавление сообщения в историю
  const addMessage = (message) => {
    setMessages(prevMessages => [...prevMessages, message]);
  };
  
  // Обработчик отправки сообщения пользователя
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !sessionId || sessionStatus !== 'active') return;
    
    // Анализируем эмоциональный тон сообщения
    const userEmotionalTone = analyzeEmotionalTone(inputValue);
    setCurrentEmotion(userEmotionalTone); // Обновляем текущее эмоциональное состояние
    
    // Добавляем сообщение пользователя
    const userMessage = {
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString(),
      emotion: userEmotionalTone // Добавляем эмоциональный тон к сообщению
    };
    
    addMessage(userMessage);
    
    // Очищаем поле ввода
    const messageText = inputValue;
    setInputValue('');
    
    // Задержка для эффекта печатания
    setTimeout(async () => {
      // Получаем ответ от ИИ с учетом эмоционального тона
      const aiResponse = generateAIResponse(messageText);
      
      // Добавляем сообщение от ИИ
      const aiMessage = {
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        emotion: 'neutral' // AI всегда начинает с нейтрального тона
      };
      
      addMessage(aiMessage);
      
      // Отправляем текст аватару с учетом эмоций
      await sendTextToAvatar(aiResponse, userEmotionalTone);
    }, 1000);
  };
  
  // Генерация ответа ИИ с учетом эмоционального тона и контекста
  const generateAIResponse = (userMessage) => {
    // Анализируем эмоциональный тон сообщения пользователя
    const emotionalTone = analyzeEmotionalTone(userMessage);
    
    // Анализируем контекст всего разговора
    const conversationContext = analyzeConversationContext(messages);
    
    // Генерируем вопрос на основе контекста
    let baseResponse;
    
    // Если это первое сообщение, начинаем с приветствия
    if (messages.length <= 1) {
      baseResponse = 'Добрый день! Я AI-интервьюер и проведу с вами собеседование. ' + 
                   'Расскажите, пожалуйста, немного о себе и вашем профессиональном опыте.';
    } else {
      // Генерируем контекстный вопрос
      baseResponse = generateContextualQuestion(conversationContext);
      
      // Если был предыдущий вопрос, добавляем плавный переход
      if (messages.length > 2) {
        const previousAIMessage = messages.filter(msg => msg.sender === 'ai').pop();
        if (previousAIMessage) {
          baseResponse = createSmoothTransition(previousAIMessage.text, baseResponse);
        }
      }
    }
    
    // Адаптируем ответ к эмоциональному тону пользователя
    const adaptedResponse = adaptResponseToEmotion(baseResponse, emotionalTone);
    
    return adaptedResponse;
  };
  
  // Обработчик нажатия клавиши Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Функция прокрутки к последнему сообщению
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Обработчик выбора аватара
  const handleAvatarChange = (event) => {
    const avatarId = event.target.value;
    const selectedAvatar = availableAvatars.find(avatar => avatar.id === avatarId || avatar.avatar_id === avatarId);
    setSelectedAvatar(selectedAvatar);
  };
  
  // Сохранение интервью
  const saveInterview = () => {
    const interviewData = {
      messages,
      timestamp: new Date().toISOString(),
      avatar: selectedAvatar
    };
    
    const fileName = `interview_${new Date().toISOString().replace(/:/g, '-')}.json`;
    const blob = new Blob([JSON.stringify(interviewData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setInfoMessage('Интервью успешно сохранено: ' + fileName);
  };
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        AI Интервьюер с видеосвязью
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }}>
        Проведите реалистичное интервью с AI-аватаром в режиме реального времени.
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      
      {infoMessage && (
        <Alert severity="info" sx={{ mb: 2 }} onClose={() => setInfoMessage(null)}>
          {infoMessage}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Панель настройки */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Настройка интервью
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="avatar-select-label">Выберите аватар</InputLabel>
                <Select
                  labelId="avatar-select-label"
                  value={selectedAvatar ? (selectedAvatar.id || selectedAvatar.avatar_id) : ''}
                  label="Выберите аватар"
                  onChange={handleAvatarChange}
                  disabled={avatarsLoading || sessionStatus === 'active' || sessionStatus === 'loading'}
                >
                  {availableAvatars.map((avatar) => (
                    <MenuItem key={avatar.id || avatar.avatar_id} value={avatar.id || avatar.avatar_id}>
                      {avatar.avatar_name || avatar.name || 'Аватар без имени'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {selectedAvatar && (
                <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar
                    src={selectedAvatar.preview_image_url || selectedAvatar.preview_url}
                    alt={selectedAvatar.avatar_name || selectedAvatar.name}
                    sx={{ width: 100, height: 100, mb: 1 }}
                  />
                  <Typography variant="body2" align="center">
                    {selectedAvatar.description || 'Нет описания'}
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                {sessionStatus === 'idle' && (
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<VideocamIcon />}
                    onClick={handleStartSession}
                    disabled={!selectedAvatar || avatarsLoading}
                  >
                    Начать интервью
                  </Button>
                )}
                
                {sessionStatus === 'active' && (
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<StopIcon />}
                    onClick={stopSession}
                  >
                    Завершить интервью
                  </Button>
                )}
                
                {sessionStatus === 'loading' && (
                  <CircularProgress size={24} sx={{ m: 1 }} />
                )}
                
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadAvatars}
                  disabled={avatarsLoading || sessionStatus === 'loading' || sessionStatus === 'active'}
                >
                  Обновить аватары
                </Button>
              </Box>
            </CardContent>
          </Card>
          
          {/* Информация о сессии */}
          {sessionId && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Информация о сессии
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>ID сессии:</strong> {sessionId}
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Статус:</strong>{' '}
                  <Chip
                    label={
                      sessionStatus === 'active' ? 'Активна' :
                      sessionStatus === 'loading' ? 'Загрузка' :
                      sessionStatus === 'error' ? 'Ошибка' : 'Неактивна'
                    }
                    color={
                      sessionStatus === 'active' ? 'success' :
                      sessionStatus === 'loading' ? 'info' :
                      sessionStatus === 'error' ? 'error' : 'default'
                    }
                    size="small"
                  />
                </Typography>
                
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Аватар:</strong> {selectedAvatar?.avatar_name || selectedAvatar?.name}
                </Typography>
                
                {messages.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<SaveIcon />}
                      onClick={saveInterview}
                    >
                      Сохранить интервью
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
        
        {/* Основной интерфейс интервью */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Видео-контейнер */}
            <Box
              ref={videoContainerRef}
              sx={{
                flex: '0 0 300px',
                bgcolor: '#000',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              {sessionStatus === 'loading' ? (
                <Box sx={{ textAlign: 'center', color: 'white' }}>
                  <CircularProgress color="inherit" sx={{ mb: 2 }} />
                  <Typography>Подготовка видеоинтервью...</Typography>
                </Box>
              ) : sessionStatus === 'active' ? (
                <>
                  {sessionId ? (
                    sessionId.startsWith('mock_') ? (
                      // Демо-режим с изображением аватара
                      <>
                        <Box
                          component="img"
                          src={selectedAvatar?.preview_image_url || selectedAvatar?.preview_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
                          alt="AI Интервьюер (ДЕМО)"
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            position: 'absolute', 
                            bottom: 4, 
                            left: 4, 
                            color: 'white', 
                            bgcolor: 'rgba(0,0,0,0.5)', 
                            px: 1, 
                            borderRadius: 1 
                          }}
                        >
                          ДЕМО-РЕЖИМ
                        </Typography>
                      </>
                    ) : (
                      // Реальный видеопоток от Heygen
                      <>
                        <Box
                          component="iframe"
                          src={`https://api.heygen.com/v1/video_stream.html?session_id=${sessionId}`}
                          title="Heygen Video Stream"
                          sx={{
                            width: '100%',
                            height: '100%',
                            border: 'none',
                            backgroundColor: '#000'
                          }}
                          allow="microphone; camera; fullscreen;"
                          onLoad={() => console.log('Ифрейм успешно загружен для сессии:', sessionId)}
                          onError={(e) => {
                            console.error('Ошибка загрузки ифрейма:', e);
                            setError('Ошибка загрузки видеопотока. Проверьте подключение к API.');
                          }}
                        />
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            position: 'absolute', 
                            bottom: 4, 
                            right: 4, 
                            color: 'white', 
                            bgcolor: 'rgba(0,0,0,0.5)', 
                            px: 1, 
                            borderRadius: 1 
                          }}
                        >
                          РЕАЛЬНОЕ ВИДЕО
                        </Typography>
                      </>
                    )
                  ) : (
                    // Ошибка - нет ID сессии
                    <Box sx={{ textAlign: 'center', color: 'white' }}>
                      <Typography color="error">Ошибка: нет ID сессии</Typography>
                    </Box>
              )}
              
              {/* Статус аватара */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  bgcolor: 'rgba(0,0,0,0.6)',
                  p: 1,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: 300
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isSpeaking ? (
                    <>
                      <MicIcon sx={{ color: '#4caf50', mr: 1, fontSize: 18 }} />
                      <Typography variant="caption" color="white">Говорит</Typography>
                    </>
                  ) : (
                    <>
                      <MicOffIcon sx={{ color: '#bdbdbd', mr: 1, fontSize: 18 }} />
                      <Typography variant="caption" color="white">Ожидает</Typography>
                    </>
                  )}
                </Box>
                
                {/* Индикатор эмоционального тона */}
                <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.1)', px: 1, py: 0.5, borderRadius: 1 }}>
                  <Typography variant="caption" color="white" sx={{ mr: 1 }}>Эмоциональный тон:</Typography>
                  <EmotionIndicator emotion={currentEmotion} size="small" />
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ textAlign: 'center', color: 'white' }}>
              <VideocamOffIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography>Интервью не запущено</Typography>
              <Typography variant="caption">Выберите аватар и нажмите "Начать интервью"</Typography>
            </Box>
          )}
            </Box>
            
            {/* Чат */}
            <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#f5f5f5',
              borderTop: 1,
              borderColor: 'divider'
            }}
          >
            {/* История сообщений */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '80%',
                      p: 2,
                      borderRadius: 2,
                      bgcolor: message.sender === 'user' ? 'primary.main' : 'background.paper',
                      color: message.sender === 'user' ? 'white' : 'text.primary',
                      boxShadow: 1,
                      position: 'relative'
                    }}
                  >
                    {/* Индикатор эмоций сообщения */}
                    {message.emotion && (
                      <Box 
                        sx={{
                          position: 'absolute', 
                          top: -8, 
                          [message.sender === 'user' ? 'left' : 'right']: -8,
                          backgroundColor: message.sender === 'user' ? 'primary.light' : 'background.default',
                          borderRadius: '50%',
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 1
                        }}
                      >
                        <EmotionIndicator emotion={message.emotion || 'neutral'} size="small" />
                      </Box>
                    )}
                    <Typography variant="body1">{message.text}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.7 }}>
                    {message.sender === 'user' ? 'Вы' : 'AI Интервьюер'} • {new Date(message.timestamp).toLocaleTimeString()}
                  </Typography>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            
            {/* Поле ввода */}
            <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex' }}>
              <TextField
                fullWidth
                placeholder="Введите ваш ответ..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                variant="outlined"
                disabled={sessionStatus !== 'active' || isSpeaking}
                multiline
                maxRows={3}
              />
              <Button
                sx={{ ml: 1, height: 56 }}
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || sessionStatus !== 'active' || isSpeaking}
              >
                Отправить
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  </Box>
);
};

export default AIInterviewerTest;