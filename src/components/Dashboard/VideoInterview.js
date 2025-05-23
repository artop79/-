import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import VideocamIcon from '@mui/icons-material/Videocam';
import PauseIcon from '@mui/icons-material/Pause';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeygenService from '../../services/heygenService';

/**
 * Компонент для проведения видеоинтервью с использованием Heygen API
 */
const VideoInterview = ({ 
  avatarConfig, 
  candidate, 
  vacancy,
  onMessage,
  messages = [],
  initialQuestion = null
}) => {
  // Состояния для видеоинтервью
  const [sessionId, setSessionId] = useState(null);
  const [videoActive, setVideoActive] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Ссылки на DOM-элементы
  const videoRef = useRef(null);
  
  // Запускаем видеоинтервью
  const startVideoInterview = async () => {
    try {
      setVideoLoading(true);
      setError(null);
      
      // Получаем ID аватара из конфигурации
      const avatarId = avatarConfig?.selectedAvatar?.id || 
                      avatarConfig?.selectedAvatar?.avatar_id ||
                      'avatar_0jG9tvJrI3Z3y7O6BLw8';
      
      // Создаем новую сессию стриминга
      const sessionData = await HeygenService.createStreamingSessionV1({
        avatarId: avatarId,
        quality: 'medium',
        voiceSpeed: 1,
        videoEncoding: 'VP8',
        disableIdleTimeout: false
      });
      
      console.log('Streaming session created:', sessionData);
      
      // Сохраняем ID сессии
      if (sessionData && sessionData.session_id) {
        setSessionId(sessionData.session_id);
        
        // Запускаем сессию
        const startData = await HeygenService.startStreamingSessionV1(sessionData.session_id);
        console.log('Streaming session started:', startData);
        
        // Если сессия успешно запущена
        if (startData && startData.status === 'success') {
          setVideoActive(true);
          setVideoLoading(false);
          
          // Если есть начальный вопрос, отправляем его
          if (initialQuestion) {
            setTimeout(() => {
              sendTextToAvatar(initialQuestion);
            }, 1000);
          }
        } else {
          throw new Error('Ошибка запуска сессии видеоинтервью');
        }
      } else {
        throw new Error('Не удалось создать сессию видеоинтервью');
      }
    } catch (error) {
      console.error('Error starting video interview:', error);
      setError('Ошибка запуска видеоинтервью: ' + (error.message || 'Неизвестная ошибка'));
      setVideoLoading(false);
    }
  };
  
  // Отправляем текст для озвучивания аватаром
  const sendTextToAvatar = async (text) => {
    if (!sessionId || !text || isSpeaking) return null;
    
    try {
      setIsSpeaking(true);
      
      // Добавляем сообщение от ИИ в список сообщений
      if (onMessage) {
        onMessage({
          text: text,
          sender: 'ai',
          timestamp: new Date().toISOString()
        });
      }
      
      // Отправляем текст в сессию
      let result = null;
      try {
        const taskData = await HeygenService.sendTaskToStreamingV1(sessionId, text);
        console.log('Task sent to streaming session:', taskData);
        result = taskData;
      } catch (innerError) {
        console.error('Error sending task to session:', innerError);
        // Продолжаем выполнение, чтобы показать текст в чате
      }
      
      // Имитируем время озвучивания (в реальной интеграции это будет событие от видеоплеера)
      setTimeout(() => {
        setIsSpeaking(false);
      }, text.length * 80); // Примерная скорость речи
      
      return result;
    } catch (error) {
      console.error('Error sending text to avatar:', error);
      setIsSpeaking(false);
      return null;
    }
  };
  
  // Обработчик отправки сообщения от пользователя
  const handleSendMessage = async () => {
    if (!inputValue.trim() || videoLoading || !sessionId) return;
    
    // Добавляем сообщение пользователя в список сообщений
    if (onMessage) {
      onMessage({
        text: inputValue,
        sender: 'user',
        timestamp: new Date().toISOString()
      });
    }
    
    // Очищаем поле ввода
    const messageText = inputValue;
    setInputValue('');
    
    // Здесь должна быть логика обработки ответа пользователя и генерации
    // следующего вопроса от ИИ-интервьюера
    
    // Имитация ответа ИИ (в реальном сценарии ответ генерируется на бэкенде)
    setTimeout(async () => {
      // Генерируем ответ ИИ
      const aiResponse = generateAIResponse(messageText, messages);
      
      // Отправляем текст для озвучивания аватаром
      await sendTextToAvatar(aiResponse);
    }, 1500);
  };
  
  // Простая функция для генерации ответа ИИ (имитация)
  const generateAIResponse = (userMessage, messageHistory) => {
    const lowerMsg = userMessage.toLowerCase();
    
    // Простая логика ответов для демонстрации
    if (lowerMsg.includes('привет') || lowerMsg.includes('здравствуй')) {
      return `Здравствуйте, ${candidate?.name || 'кандидат'}! Рад познакомиться. Расскажите, пожалуйста, о вашем опыте работы в сфере ${vacancy?.title || 'IT'}.`;
    } else if (lowerMsg.includes('опыт') || lowerMsg.includes('работал')) {
      return 'Очень интересный опыт! Расскажите, пожалуйста, о самом сложном проекте, над которым вы работали.';
    } else if (lowerMsg.includes('проект') || lowerMsg.includes('сложн')) {
      return 'Впечатляюще! Какие технологии и инструменты вы использовали в этом проекте?';
    } else if (lowerMsg.includes('технолог') || lowerMsg.includes('инструмент')) {
      return 'Отлично! А как вы подходите к решению нестандартных задач, когда готового решения нет?';
    } else {
      return 'Спасибо за ваш ответ! Следующий вопрос: каковы ваши ожидания от новой работы?';
    }
  };
  
  // Обработчик нажатия клавиши Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Останавливаем сессию при размонтировании компонента
  useEffect(() => {
    // Если есть начальный вопрос и сессия активна, отправляем его
    if (initialQuestion && sessionId && videoActive && !isSpeaking) {
      setTimeout(() => {
        sendTextToAvatar(initialQuestion);
      }, 1000);
    }
    
    return () => {
      if (sessionId) {
        console.log('Stopping streaming session:', sessionId);
        HeygenService.stopStreamingSessionV1(sessionId)
          .then(data => console.log('Session stopped:', data))
          .catch(error => console.error('Error stopping session:', error));
      }
    };
  }, [sessionId, videoActive, initialQuestion]);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      {/* Область видео */}
      <Box 
        sx={{ 
          flex: '1', 
          bgcolor: '#000', 
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 1,
          overflow: 'hidden'
        }}
      >
        {videoLoading ? (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ color: 'white', mb: 2 }} />
            <Typography variant="body2" color="white">
              Подготовка видеоинтервью...
            </Typography>
          </Box>
        ) : videoActive && sessionId ? (
          <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* В реальной интеграции здесь был бы iframe или video плеер с потоком от Heygen */}
            {/* Сейчас используем изображение аватара для демонстрации */}
            <Box
              component="img"
              src={avatarConfig?.selectedAvatar?.preview_image_url || avatarConfig?.selectedAvatar?.preview_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
              alt="AI Интервьюер"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            
            {/* Статус аватара */}
            <Box sx={{ 
              position: 'absolute', 
              bottom: 16, 
              right: 16, 
              bgcolor: 'rgba(0,0,0,0.6)', 
              p: 1, 
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center'
            }}>
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
          </Box>
        ) : (
          <Button
            variant="contained"
            color="primary"
            startIcon={<VideocamIcon />}
            onClick={startVideoInterview}
          >
            Начать видеоинтервью
          </Button>
        )}
        
        {/* Отображаем ошибку, если она есть */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              position: 'absolute', 
              bottom: 16, 
              left: 16, 
              right: 16,
              opacity: 0.9
            }}
          >
            {error}
          </Alert>
        )}
      </Box>
      
      {/* Область ввода сообщения */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', mt: 2 }}>
        <TextField
          fullWidth
          placeholder="Введите ваш ответ..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          variant="outlined"
          size="small"
          disabled={!videoActive || videoLoading || !sessionId}
        />
        <Button
          sx={{ ml: 1 }}
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || !videoActive || videoLoading || !sessionId}
        >
          Отправить
        </Button>
      </Box>
    </Box>
  );
};

export default VideoInterview;
