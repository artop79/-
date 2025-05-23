import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  CircularProgress,
  Avatar,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Collapse
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AssistantIcon from '@mui/icons-material/Assistant';
import hrAgentService from '../../services/hrAgentService';

/**
 * Компонент для тестирования общения с ИИ HR агентом
 */
const AIHRAgentChat = () => {
  // Состояния для управления чатом
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [personalities, setPersonalities] = useState([]);
  const [selectedPersonality, setSelectedPersonality] = useState('professional');
  const [candidateId] = useState(`test_user_${Date.now()}`); // Временный ID для тестового режима
  const messagesEndRef = useRef(null);

  // Загрузка личностей при монтировании компонента
  useEffect(() => {
    loadPersonalities();
  }, []);

  // Прокрутка чата к последнему сообщению
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Загрузка доступных личностей HR агента
  const loadPersonalities = async () => {
    try {
      const data = await hrAgentService.getAvailablePersonalities();
      setPersonalities(data);
    } catch (err) {
      console.error('Ошибка при загрузке личностей HR агента:', err);
      setError('Не удалось загрузить личности HR агента. Попробуйте еще раз позже.');
    }
  };

  // Начало новой беседы
  const startNewConversation = async () => {
    setIsLoading(true);
    setError(null);
    setMessages([]);

    try {
      console.log('Начинаем создание новой беседы с HR агентом...');
      console.log('Используем candidateId:', candidateId);
      console.log('Используем personalityId:', selectedPersonality);
      
      const result = await hrAgentService.createConversation(
        candidateId, 
        null, // Без привязки к вакансии для тестирования
        selectedPersonality
      );
      
      console.log('Ответ от сервера при создании беседы:', result);
      
      if (!result || !result.conversation_id) {
        throw new Error('Сервер вернул некорректный ответ при создании беседы');
      }
      
      setConversation(result.conversation_id);
      console.log('Беседа успешно создана с ID:', result.conversation_id);
      
      // Загружаем историю сообщений (если есть)
      console.log('Загружаем историю сообщений...');
      const history = await hrAgentService.getConversationHistory(result.conversation_id);
      console.log('Полученная история сообщений:', history);
      
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        // Если истории нет, добавляем приветственное сообщение
        const welcomeMessage = {
          role: 'assistant',
          content: 'Здравствуйте! Я HR-ассистент компании. Чем могу помочь вам?',
          timestamp: new Date().toISOString()
        };
        console.log('Добавляем приветственное сообщение:', welcomeMessage);
        setMessages([welcomeMessage]);
      }
    } catch (err) {
      console.error('Ошибка при создании беседы:', err);
      let errorMessage = 'Не удалось начать беседу с HR агентом. Пожалуйста, попробуйте позже.';
      
      if (err.response && err.response.data && err.response.data.detail) {
        errorMessage = `Ошибка: ${err.response.data.detail}`;
      } else if (err.message) {
        errorMessage = `Ошибка: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Отправка сообщения
  const sendMessage = async () => {
    if (!message.trim() || !conversation || isLoading) return;
    
    // Добавляем сообщение пользователя в чат
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };
    
    console.log('Отправляем сообщение:', message);
    console.log('В беседу с ID:', conversation);
    
    setMessages(prev => [...prev, userMessage]);
    const currentMessage = message; // Сохраняем сообщение перед очисткой
    setMessage('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Отправляем сообщение на сервер
      console.log('Отправляем запрос на сервер...');
      const response = await hrAgentService.sendMessage(conversation, currentMessage);
      console.log('Получен ответ от сервера:', response);
      
      if (!response || !response.message) {
        throw new Error('Сервер вернул некорректный ответ');
      }
      
      // Добавляем ответ ассистента в чат
      const assistantMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString()
      };
      
      console.log('Добавляем ответ ассистента в чат:', assistantMessage);
      setMessages(prev => [...prev, assistantMessage]);
      
      // Если есть информация о следующем действии
      if (response.next_action) {
        console.log('Следующее действие:', response.next_action);
      }
    } catch (err) {
      console.error('Ошибка при отправке сообщения:', err);
      let errorMessage = 'Не удалось отправить сообщение. Пожалуйста, попробуйте еще раз.';
      
      if (err.response && err.response.data && err.response.data.detail) {
        errorMessage = `Ошибка: ${err.response.data.detail}`;
      } else if (err.message) {
        errorMessage = `Ошибка: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик нажатия Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Отображение иконки для личности
  const getPersonalityIcon = (personalityId) => {
    switch (personalityId) {
      case 'professional':
        return <PsychologyIcon />;
      case 'friendly':
        return <AssistantIcon />;
      case 'formal':
        return <SmartToyIcon />;
      default:
        return <SmartToyIcon />;
    }
  };

  // Получение имени личности по ID
  const getPersonalityName = (personalityId) => {
    const personality = personalities.find(p => p.id === personalityId);
    return personality ? personality.name : 'Неизвестная личность';
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Панель управления чатом */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 2,
          borderRadius: '12px',
          border: '1px solid rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom={false} sx={{ display: 'flex', alignItems: 'center' }}>
            <SmartToyIcon sx={{ mr: 1, color: '#304FFE' }} />
            Тестирование ИИ HR агента
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Проверьте, как ИИ агент будет общаться с кандидатами, меняйте личность и отлаживайте поведение.
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="personality-select-label">Личность HR агента</InputLabel>
            <Select
              labelId="personality-select-label"
              id="personality-select"
              value={selectedPersonality}
              label="Личность HR агента"
              onChange={(e) => setSelectedPersonality(e.target.value)}
              disabled={isLoading}
            >
              {personalities.map((personality) => (
                <MenuItem key={personality.id} value={personality.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getPersonalityIcon(personality.id)}
                    <Typography sx={{ ml: 1 }}>{personality.name}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button 
            variant="contained" 
            onClick={startNewConversation}
            disabled={isLoading}
            startIcon={<RefreshIcon />}
          >
            {conversation ? 'Начать заново' : 'Начать беседу'}
          </Button>
        </Box>
      </Paper>
      
      {/* Сообщение об ошибке */}
      <Collapse in={!!error}>
        <Alert 
          severity="error" 
          sx={{ mb: 2 }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setError(null)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Collapse>
      
      {/* Чат с сообщениями */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 0,
          borderRadius: '12px',
          border: '1px solid rgba(0,0,0,0.12)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '400px'
        }}
      >
        {/* Заголовок чата */}
        <Box 
          sx={{ 
            p: 2, 
            borderBottom: '1px solid rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#304FFE', mr: 1 }}>
              {getPersonalityIcon(selectedPersonality)}
            </Avatar>
            <Typography variant="subtitle1">
              {getPersonalityName(selectedPersonality)}
            </Typography>
          </Box>
          
          <Chip 
            label={conversation ? 'Активная беседа' : 'Беседа не начата'} 
            color={conversation ? 'success' : 'default'} 
            size="small" 
          />
        </Box>
        
        {/* Область сообщений */}
        <Box 
          sx={{ 
            p: 2, 
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            bgcolor: 'rgba(0,0,0,0.02)'
          }}
        >
          {messages.length === 0 && !isLoading ? (
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                opacity: 0.7
              }}
            >
              <SmartToyIcon sx={{ fontSize: 48, mb: 2, color: 'text.secondary' }} />
              <Typography variant="body1" color="text.secondary">
                {conversation 
                  ? 'Начните диалог с ИИ HR агентом' 
                  : 'Нажмите "Начать беседу", чтобы протестировать ИИ HR агента'}
              </Typography>
            </Box>
          ) : (
            messages.map((msg, index) => (
              <Box 
                key={index}
                sx={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: 1,
                    maxWidth: '80%'
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: msg.role === 'user' ? 'primary.light' : '#304FFE',
                    }}
                  >
                    {msg.role === 'user' ? <PersonIcon /> : getPersonalityIcon(selectedPersonality)}
                  </Avatar>
                  
                  <Card 
                    elevation={0}
                    sx={{ 
                      bgcolor: msg.role === 'user' ? 'primary.light' : 'white',
                      color: msg.role === 'user' ? 'white' : 'inherit',
                      borderRadius: '12px',
                      p: 1
                    }}
                  >
                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                      <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-wrap' }}>
                        {msg.content}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
                
                <Typography 
                  variant="caption" 
                  color="text.secondary"
                  sx={{ 
                    mt: 0.5,
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                    mx: 2
                  }}
                >
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
                </Typography>
              </Box>
            ))
          )}
          
          {isLoading && (
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                alignSelf: 'flex-start',
                mb: 2
              }}
            >
              <CircularProgress size={24} sx={{ mr: 2 }} />
              <Typography variant="body2" color="text.secondary">
                HR агент печатает...
              </Typography>
            </Box>
          )}
          
          <div ref={messagesEndRef} />
        </Box>
        
        {/* Поле ввода сообщения */}
        <Box 
          sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(0,0,0,0.12)',
            display: 'flex',
            gap: 2
          }}
        >
          <TextField
            fullWidth
            placeholder="Введите сообщение..."
            variant="outlined"
            size="medium"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!conversation || isLoading}
            multiline
            maxRows={4}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            onClick={sendMessage}
            disabled={!conversation || !message.trim() || isLoading}
            sx={{ borderRadius: '12px', px: 3 }}
          >
            Отправить
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AIHRAgentChat;
