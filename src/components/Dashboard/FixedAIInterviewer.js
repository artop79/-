import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardMedia,
  TextField,
  CircularProgress,
  Paper,
  Alert,
  Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VideocamIcon from '@mui/icons-material/Videocam';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useNavigate } from 'react-router-dom';

// Импортируем сервисы
import HeygenService from '../../services/heygenService';

// Импортируем компоненты
import CandidatesList from './CandidatesList';
import HeygenIntegration from './HeygenIntegration';
import InterviewScheduler from './InterviewScheduler';
import ReviewStep from './ReviewStep';
import VideoInterview from './VideoInterview';

// Импортируем CSS
import './AIInterviewerNew.css';

// Создаем кастомные компоненты вместо проблемных MUI компонентов
const StyledContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  height: '100%',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.default
}));

const StyledPanel = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2, 3),
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column'
}));

// Стилизованный компонент для верхнего меню
const HeaderContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  marginBottom: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`
}));

// Стилизованный компонент для логотипа
const LogoContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  marginRight: 'auto'
}));

// Шаги интервью
const steps = [
  'Выбор кандидата',
  'Настройка видеоаватара',
  'Планирование интервью',
  'Обзор и создание'
];

const FixedAIInterviewer = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [creationComplete, setCreationComplete] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [avatarConfig, setAvatarConfig] = useState(null);
  const [interviewConfig, setInterviewConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  // Refs для контроля DOM-элементов
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  
  // Прокрутка сообщений вниз при добавлении новых
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Загрузка аватаров при монтировании компонента
  useEffect(() => {
    // Мы уже не получаем аватары напрямую - это делает HeygenIntegration
    // Просто устанавливаем готовность компонента
    setLoading(false);
  }, []);
  
  // Обработчики UI событий
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setInterviewStarted(false);
  };
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  // Улучшенная функция возврата на предыдущий шаг
  const handleBack = () => {
    // Если интервью уже запущено, останавливаем его и возвращаемся к состоянию подготовки
    if (interviewStarted) {
      // Показываем подтверждение перед выходом из режима интервью
      if (window.confirm('Вы уверены, что хотите завершить интервью? Вся история сообщений будет потеряна.')) {
        setInterviewStarted(false);
        setCreationComplete(true);
        // Возвращаемся на экран подготовки
        setMessages([]);
      }
      // Если пользователь отменил выход - ничего не делаем
      return;
    }
    
    // Если мы находимся в режиме создания интервью
    if (creationComplete) {
      // Возвращаемся на последний шаг мастера (обзор и создание)
      setActiveStep(3);
      setCreationComplete(false);
      return;
    }
    
    // Стандартная навигация на предыдущий шаг
    if (activeStep > 0) {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    } else {
      // Если мы находимся на первом шаге, спрашиваем подтверждение перед выходом
      if (window.confirm('Вы уверены, что хотите вернуться на главную страницу? Все внесенные изменения будут потеряны.')) {
        navigate('/dashboard');
      }
    }
  };
  
  // Обработка шагов интервью
  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    handleNext();
  };
  
  const handleAvatarConfigComplete = (config) => {
    setAvatarConfig(config);
    handleNext();
  };
  
  const handleInterviewConfigComplete = (config) => {
    setInterviewConfig(config);
    handleNext();
  };
  
  const handleEditSettings = (section) => {
    switch(section) {
      case 'avatar':
        setActiveStep(1);
        break;
      case 'questions':
        setActiveStep(2);
        break;
      case 'all':
        setActiveStep(0);
        break;
      default:
        break;
    }
  };
  
  const handleCreateInterview = () => {
    // Проверяем наличие необходимых данных
    if (!selectedCandidate) {
      setSnackbarMessage('Ошибка: Не выбран кандидат');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    if (!avatarConfig) {
      setSnackbarMessage('Ошибка: Не настроен аватар интервьюера');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    if (!interviewConfig) {
      setSnackbarMessage('Ошибка: Не настроены параметры интервью');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    // Если все данные есть, показываем диалог подтверждения
    setConfirmDialogOpen(true);
  };
  
  const handleConfirmCreate = () => {
    setConfirmDialogOpen(false);
    setLoading(true);
    
    // Данные для запроса
    const interviewData = { 
      candidate: selectedCandidate, 
      config: interviewConfig, 
      avatar: avatarConfig 
    };
    
    // Добавляем расширенное логирование для отладки
    console.log('Creating interview with:', interviewData);
    console.log('Аватар:', {
      id: avatarConfig?.avatar?.id,
      avatar_id: avatarConfig?.avatar?.avatar_id,
      name: avatarConfig?.avatar?.name,
      avatar_name: avatarConfig?.avatar?.avatar_name,
      preview_url: avatarConfig?.avatar?.preview_url,
      preview_image_url: avatarConfig?.avatar?.preview_image_url
    });
    
    // В реальном приложении здесь был бы API-запрос
    try {
      // Подготавливаем данные для запроса с учетом API v2
      // Для реального API:
      // const apiData = {
      //   candidate_id: selectedCandidate.id,
      //   avatar_id: avatarConfig?.avatar?.avatar_id || avatarConfig?.avatar?.id,
      //   voice_id: avatarConfig?.voice?.id,
      //   voice_speed: avatarConfig?.voiceSpeed || 1.0,
      //   questions: interviewConfig?.questions || []
      // };
      // const response = await heygenService.createInterview(apiData);
      
      setTimeout(() => {
        // Проверяем случайные сценарии ошибок для тестирования (10% вероятность)
        if (Math.random() > 0.9) {
          throw new Error('Ошибка при создании встречи Zoom');
        }
        
        setLoading(false);
        setCreationComplete(true);
        // Показываем уведомление об успехе
        setSnackbarMessage('Интервью успешно создано! Запрос на встречу и ссылка на Zoom отправлены кандидату.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      }, 2000);
    } catch (error) {
      setLoading(false);
      console.error('Error creating interview:', error);
      setSnackbarMessage(`Ошибка создания интервью: ${error.message}`);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };
  
  const handleStartInterview = () => {
    // Проверка наличия необходимых данных перед началом интервью
    if (!avatarConfig || !interviewConfig) {
      setSnackbarMessage('Ошибка: Невозможно начать интервью без настроек');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }
    
    // Проверяем наличие вопросов для интервью
    if (!interviewConfig.questions || interviewConfig.questions.length < 1) {
      setSnackbarMessage('Предупреждение: Интервью не содержит вопросов');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
    }
    
    setInterviewStarted(true);
    setCreationComplete(false);
    setMessages([]); // Очищаем историю сообщений при новом запуске
    
    // Показываем уведомление о начале интервью
    setSnackbarMessage('Интервью началось. Ожидайте первый вопрос интервьюера...');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
    
    // Логируем данные аватара для отладки
    console.log('Данные аватара при старте интервью:', avatarConfig);
    
    // Добавляем первое сообщение от AI и с небольшой задержкой для большей реалистичности
    setTimeout(() => {
      // Получаем имя аватара с учетом обоих вариантов API (старого и нового)
      const avatarName = avatarConfig?.avatar?.avatar_name || avatarConfig?.avatar?.name || 'София';
      const vacancyTitle = interviewConfig?.vacancy?.title || 'Frontend-разработчик';
      const candidateName = selectedCandidate?.name || 'уважаемый кандидат';
      
      setMessages([
        { 
          sender: 'ai', 
          text: `Здравствуйте, ${candidateName}! Меня зовут ${avatarName}. Я буду проводить собеседование по вакансии ${vacancyTitle}. Расскажите, пожалуйста, немного о себе и своем опыте.` 
        }
      ]);
    }, 1500);
  };
  
  // Обработчик нажатия клавиши Enter в чате
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    
    // Сохраняем введенный текст перед очисткой поля
    const userMessage = inputValue.trim();
    
    // Добавляем сообщение пользователя
    const newMessages = [...messages, { sender: 'user', text: userMessage }];
    setMessages(newMessages);
    setInputValue(''); // Очищаем поле ввода
    
    // Добавляем индикатор набора текста от AI
    const typingMessages = [...newMessages, { sender: 'ai', text: '...', isTyping: true }];
    setMessages(typingMessages);
    
    // Имитация ответа от AI с задержкой
    setTimeout(() => {
      // Имитация механизма ответов для демо
      let response = 'Спасибо за информацию! Мой следующий вопрос: какой у вас опыт работы с React и современными фреймворками?';
      
      // Более разнообразные ответы в зависимости от ввода пользователя
      const lowercaseMessage = userMessage.toLowerCase();
      
      if (lowercaseMessage.includes('react')) {
        response = 'Отлично! Расскажите о самом сложном проекте, в котором вы использовали React.';
      } else if (lowercaseMessage.includes('опыт')) {
        response = 'Интересно! А какие технологии вы использовали в своих последних проектах?';
      } else if (lowercaseMessage.includes('javascript') || lowercaseMessage.includes('js')) {
        response = 'Да, JavaScript — основа веб-разработки. А какие инструменты используете для управления состоянием в приложениях?';
      } else if (lowercaseMessage.includes('образовани') || lowercaseMessage.includes('учился') || lowercaseMessage.includes('учеб')) {
        response = 'Образование — важный фактор. Как вы оцениваете его вклад в ваше профессиональное развитие по сравнению с самообразованием?';
      } else if (lowercaseMessage.includes('команд') || lowercaseMessage.includes('коллектив')) {
        response = 'Работа в команде очень важна. Расскажите о самом успешном командном проекте, в котором вы участвовали.';
      }
      
      // Убираем индикатор набора и добавляем реальный ответ
      const finalMessages = newMessages.concat({ sender: 'ai', text: response });
      setMessages(finalMessages);
    }, 1500);
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };
  
  // Функция получения контента для текущего шага
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <CandidatesList onSelectCandidate={handleSelectCandidate} />;
      case 1:
        return <HeygenIntegration onConfigComplete={handleAvatarConfigComplete} />;
      case 2:
        return <InterviewScheduler 
          selectedCandidate={selectedCandidate} 
          onComplete={handleInterviewConfigComplete} 
        />;
      case 3:
        return <ReviewStep 
          interviewConfig={interviewConfig} 
          avatarConfig={avatarConfig} 
          onStartInterview={handleStartInterview} 
          onEditSettings={handleEditSettings} 
        />;
      default:
        return 'Неизвестный шаг';
    }
  };
  
  // Компонент для отображения успешного создания интервью
  const CompletionStep = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
      <Typography variant="h5" gutterBottom>
        Интервью успешно создано!
      </Typography>
      <Typography variant="body1" paragraph>
        Вы создали AI-интервью для кандидата {selectedCandidate?.name} на должность {selectedCandidate?.position}.
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Ссылка на Zoom-встречу была отправлена кандидату.
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleStartInterview}
          startIcon={<VideocamIcon />}
        >
          Начать интервью
        </Button>
      </Box>
    </Box>
  );
  
  // Компонент интерфейса чата с видеоаватаром
  const ChatInterface = () => {
    // Обработчик новых сообщений
    const handleNewMessage = (message) => {
      // Добавляем сообщение в список
      setMessages(prevMessages => [...prevMessages, message]);
      
      // Прокручиваем вниз
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    };
    
    // Начальный вопрос для интервью
    const initialQuestion = messages.length === 0 ? 
      `Здравствуйте, ${selectedCandidate?.name}! Меня зовут София. Я буду проводить собеседование по вакансии ${interviewConfig?.vacancy?.title}. Расскажите, пожалуйста, немного о себе и своем опыте.` : 
      null;
    
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '70vh',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          overflow: 'hidden'
        }}
        ref={containerRef}
      >
        {/* Заголовок чата */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6">
            Интервью с {selectedCandidate?.name}
          </Typography>
          <Typography variant="caption">
            Вакансия: {interviewConfig?.vacancy?.title}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: 'calc(100% - 120px)' }}>
          {/* Видеоинтервью с использованием Heygen API */}
          <Box sx={{ flex: { xs: '1', md: '0 0 50%' }, p: 1 }}>
            <VideoInterview
              avatarConfig={avatarConfig}
              candidate={selectedCandidate}
              vacancy={interviewConfig?.vacancy}
              onMessage={handleNewMessage}
              messages={messages}
              initialQuestion={initialQuestion}
            />
          </Box>
          
          {/* Область сообщений */}
          <Box sx={{ flex: { xs: '1', md: '0 0 50%' }, p: 2, overflowY: 'auto', bgcolor: '#f5f5f5' }}>
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={`chat-message ${message.sender === 'ai' ? 'ai' : 'user'}`}>
                  <div className={`message-bubble ${message.isTyping ? 'typing' : ''}`}>
                    {message.isTyping ? (
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    ) : (
                      message.text
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </Box>
        </Box>
      </Box>
    );
  };
  
  return (
    <StyledContainer className="ai-interviewer-container" ref={containerRef}>
      <HeaderContainer>
        {/* Кнопка назад */}
        <IconButton onClick={handleBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        
        {/* Логотип Raplle */}
        <LogoContainer onClick={() => navigate('/dashboard')}>
          <Box component="img" 
            src="/raplle-exact.svg" 
            alt="Raplle Logo" 
            sx={{ height: 36, mr: 1 }}
          />
          <Typography variant="subtitle1" fontWeight="bold" sx={{ letterSpacing: 1 }}>
            RAPLLE
          </Typography>
        </LogoContainer>
        
        <Typography variant="h5">
          AI-интервьюер
        </Typography>
      </HeaderContainer>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#fff' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="Вкладки интервью"
        >
          <Tab icon={<VideocamIcon />} label="Создать интервью" iconPosition="start" />
          <Tab icon={<CalendarTodayIcon />} label="Запланированные" iconPosition="start" />
          <Tab icon={<AssessmentIcon />} label="Отчеты" iconPosition="start" />
        </Tabs>
      </Box>
      
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {tabValue === 0 && !interviewStarted && (
          <>
            {!creationComplete ? (
              <Box>
                <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  
                  <Box sx={{ mt: 2 }}>
                    {getStepContent(activeStep)}
                  </Box>
                </Paper>
              </Box>
            ) : (
              <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <CompletionStep />
              </Paper>
            )}
          </>
        )}
        
        {(tabValue === 0 && interviewStarted) && (
          <Paper sx={{ p: 0, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <ChatInterface />
          </Paper>
        )}
        
        {tabValue === 1 && (
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" gutterBottom>Запланированные интервью</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Здесь будут отображаться все запланированные интервью с кандидатами
            </Alert>
            <Typography variant="body2" color="text.secondary">
              У вас пока нет запланированных интервью
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start' }}>
              <Button
                variant="contained" 
                startIcon={<VideocamIcon />}
                onClick={() => setTabValue(0)}
              >
                Создать новое интервью
              </Button>
            </Box>
          </Paper>
        )}
        
        {tabValue === 2 && (
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" gutterBottom>Отчеты по интервью</Typography>
            <Alert severity="info" sx={{ mb: 2 }}>
              Здесь будут отображаться результаты и аналитика проведенных интервью
            </Alert>
            <Typography variant="body2" color="text.secondary">
              У вас пока нет завершенных интервью с отчетами
            </Typography>
          </Paper>
        )}
      </Box>
      
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Подтверждение создания интервью</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Вы собираетесь создать AI-интервью для кандидата <strong>{selectedCandidate?.name}</strong> на позицию <strong>{interviewConfig?.vacancy?.title}</strong>.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Будет создана Zoom-встреча и отправлена ссылка кандидату. Встреча состоится {interviewConfig?.dateTime ? new Date(interviewConfig.dateTime).toLocaleString('ru-RU') : 'в установленное время'}.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>
            Отмена
          </Button>
          <Button 
            variant="contained" 
            onClick={handleConfirmCreate}
            color="primary"
          >
            Подтвердить
          </Button>
        </DialogActions>
      </Dialog>
      
      {loading && (
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 1000
        }}>
          <CircularProgress />
        </Box>
      )}
      
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default FixedAIInterviewer;
