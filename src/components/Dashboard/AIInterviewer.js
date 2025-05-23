import './AIInterviewer.css';
import React, { useState, useEffect } from 'react';
import MobileSwipeCards from './MobileSwipeCards';
import axios from 'axios';
import HeygenService from '../../services/heygenService';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Grid,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  Avatar,
  TextField,
  IconButton,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Rating,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import CloseIcon from '@mui/icons-material/Close';
import './AIInterviewer.css';

// Мок-данные кандидатов (позже будут заменены на данные из API)
const mockCandidates = [
  {
    id: 1,
    name: 'Алексей Смирнов',
    position: 'Frontend-разработчик',
    resumeScore: 85,
    matchPercentage: 92,
    status: 'Резюме проверено',
    resumeDate: '2025-05-15',
    keySkills: ['React', 'TypeScript', 'Redux'],
    avatar: '/mock-avatars/avatar1.jpg',
  },
  {
    id: 2,
    name: 'Мария Иванова',
    position: 'UX/UI дизайнер',
    resumeScore: 78,
    matchPercentage: 85,
    status: 'Резюме проверено',
    resumeDate: '2025-05-14',
    keySkills: ['Figma', 'Adobe XD', 'Прототипирование'],
    avatar: '/mock-avatars/avatar2.jpg',
  },
  {
    id: 3,
    name: 'Дмитрий Козлов',
    position: 'Backend-разработчик',
    resumeScore: 92,
    matchPercentage: 88,
    status: 'Резюме проверено',
    resumeDate: '2025-05-13',
    keySkills: ['Node.js', 'Python', 'MongoDB'],
    avatar: '/mock-avatars/avatar3.jpg',
  },
  {
    id: 4,
    name: 'Елена Петрова',
    position: 'Project Manager',
    resumeScore: 65,
    matchPercentage: 72,
    status: 'Резюме проверено',
    resumeDate: '2025-05-12',
    keySkills: ['Agile', 'Scrum', 'Jira'],
    avatar: '/mock-avatars/avatar4.jpg',
  },
  {
    id: 5,
    name: 'Иван Сидоров',
    position: 'DevOps инженер',
    resumeScore: 88,
    matchPercentage: 90,
    status: 'Резюме проверено',
    resumeDate: '2025-05-11',
    keySkills: ['Docker', 'Kubernetes', 'CI/CD'],
    avatar: '/mock-avatars/avatar5.jpg',
  },
];

// Мок-данные вакансий
const mockVacancies = [
  { id: 1, title: 'Frontend-разработчик (React)' },
  { id: 2, title: 'Backend-разработчик (Node.js)' },
  { id: 3, title: 'UX/UI дизайнер' },
  { id: 4, title: 'Project Manager' },
  { id: 5, title: 'DevOps инженер' },
];

// Голоса для TTS
const voiceOptions = [
  { id: 1, name: 'Анна', gender: 'женский', language: 'Русский' },
  { id: 2, name: 'Дмитрий', gender: 'мужской', language: 'Русский' },
  { id: 3, name: 'Мария', gender: 'женский', language: 'Русский' },
  { id: 4, name: 'Алекс', gender: 'мужской', language: 'Русский' },
  { id: 5, name: 'Emily', gender: 'женский', language: 'Английский' },
  { id: 6, name: 'Michael', gender: 'мужской', language: 'Английский' },
];

// Мок-данные аватаров Heygen
const mockAvatars = [
  {
    id: 1,
    name: 'София',
    gender: 'женский',
    preview: '/mock-avatars/heygen1.jpg',
    description: 'Профессиональная, дружелюбная, подходит для бизнес-интервью',
  },
  {
    id: 2,
    name: 'Алекс',
    gender: 'мужской',
    preview: '/mock-avatars/heygen2.jpg',
    description: 'Энергичный, современный, технический специалист',
  },
  {
    id: 3,
    name: 'Елена',
    gender: 'женский',
    preview: '/mock-avatars/heygen3.jpg',
    description: 'Спокойная, вдумчивая, аналитический подход',
  },
  {
    id: 4,
    name: 'Михаил',
    gender: 'мужской',
    preview: '/mock-avatars/heygen4.jpg',
    description: 'Опытный, серьезный, подходит для руководящих позиций',
  },
];

const AIInterviewer = ({ minimal }) => {
  // Оригинальные состояния
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [interviewPosition] = useState('Frontend разработчик');
  const [interviewId] = useState('demo-interview-123');
  
  // Новые состояния для расширенной функциональности
  const [tabValue, setTabValue] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [avatarConfig, setAvatarConfig] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [interviewConfig, setInterviewConfig] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [creationComplete, setCreationComplete] = useState(false);
  
  // Состояния для интеграции с Heygen
  const [heygenAvatars, setHeygenAvatars] = useState([]);
  const [loadingAvatars, setLoadingAvatars] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [streamingActive, setStreamingActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Загрузка кандидатов и аватаров при монтировании компонента
  useEffect(() => {
    // Имитация загрузки данных с сервера с небольшой задержкой
    const timer = setTimeout(() => {
      setCandidates(mockCandidates);
      
      // Попытка загрузить аватары при запуске
      fetchHeygenAvatars().catch(err => {
        console.error('Failed to load avatars on mount:', err);
        // Здесь мы не показываем ошибку пользователю при начальной загрузке
      });
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Загрузка аватаров из Heygen
  const fetchHeygenAvatars = async () => {
    try {
      setLoadingAvatars(true);
      setErrorMessage('');
      
      // Проверка соединения с API
      await HeygenService.testConnection();
      
      // Загрузка аватаров
      const response = await HeygenService.getAvatars();
      
      if (response && response.data) {
        setHeygenAvatars(response.data);
      } else {
        // Если нет данных, используем мок-данные
        setHeygenAvatars(mockAvatars);
      }
    } catch (error) {
      console.error('Error fetching Heygen avatars:', error);
      setErrorMessage('Ошибка при загрузке аватаров. Используются демо-аватары.');
      // Используем мок-данные в случае ошибки
      setHeygenAvatars(mockAvatars);
    } finally {
      setLoadingAvatars(false);
    }
  };
  
  // Создание сессии Heygen
  const createHeygenSession = async () => {
    try {
      setLoadingAvatars(true);
      setErrorMessage('');
      
      const response = await HeygenService.createStreamingSession();
      
      if (response && response.data && response.data.session_id) {
        setSessionId(response.data.session_id);
        return response.data.session_id;
      } else {
        throw new Error('Не удалось получить ID сессии');
      }
    } catch (error) {
      console.error('Error creating Heygen session:', error);
      setErrorMessage('Ошибка при создании сессии Heygen');
      return null;
    } finally {
      setLoadingAvatars(false);
    }
  };
  
  // Запуск сессии с выбранным аватаром
  const startHeygenSession = async (sessionId, avatarId) => {
    try {
      setLoadingAvatars(true);
      setErrorMessage('');
      
      const response = await HeygenService.startStreamingSession(sessionId, avatarId);
      
      if (response && response.data) {
        setStreamingActive(true);
        // Здесь мы бы получили URL для предпросмотра аватара
        setPreviewUrl(response.data.preview_url || 'https://via.placeholder.com/480x360?text=Avatar+Preview');
        return true;
      } else {
        throw new Error('Не удалось запустить сессию');
      }
    } catch (error) {
      console.error('Error starting Heygen session:', error);
      setErrorMessage('Ошибка при запуске сессии Heygen');
      return false;
    } finally {
      setLoadingAvatars(false);
    }
  };
  
  // Отправка текста аватару
  const sendTextToAvatar = async (text, voiceId = null) => {
    if (!sessionId || !streamingActive) {
      setErrorMessage('Сессия не активна');
      return false;
    }
    
    try {
      setLoading(true); // Используем существующее состояние загрузки
      
      const response = await HeygenService.sendTextToAvatar(sessionId, text, voiceId);
      
      if (response && response.data) {
        return true;
      } else {
        throw new Error('Не удалось отправить текст');
      }
    } catch (error) {
      console.error('Error sending text to avatar:', error);
      setErrorMessage('Ошибка при отправке текста аватару');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Обработчик выбора вакансии
  const handleVacancyChange = (vacancyId) => {
    const vacancy = mockVacancies.find(v => v.id.toString() === vacancyId);
    setSelectedVacancy(vacancy);
  };
  
  // Закрытие сессии
  const closeHeygenSession = async () => {
    if (!sessionId) {
      return true; // Нечего закрывать
    }
    
    try {
      setLoadingAvatars(true);
      
      const response = await HeygenService.closeStreamingSession(sessionId);
      
      if (response) {
        setSessionId(null);
        setStreamingActive(false);
        setPreviewUrl(null);
        return true;
      } else {
        throw new Error('Не удалось закрыть сессию');
      }
    } catch (error) {
      console.error('Error closing Heygen session:', error);
      setErrorMessage('Ошибка при закрытии сессии Heygen');
      return false;
    } finally {
      setLoadingAvatars(false);
    }
  };
  
  // Предпросмотр аватара
  const previewAvatar = async (avatar) => {
    try {
      if (!sessionId) {
        const newSessionId = await createHeygenSession();
        if (!newSessionId) {
          return;
        }
      }
      
      await startHeygenSession(sessionId, avatar.id);
      
      // Отправляем тестовый текст для приветствия
      sendTextToAvatar('Привет! Я ваш AI-интервьюер. Чем могу помочь?');
      
    } catch (error) {
      console.error('Error previewing avatar:', error);
      setErrorMessage('Ошибка при предпросмотре аватара');
    }
  };

  const handleStartInterview = async () => {
    try {
      setLoading(true);
      setErrorMessage('');
      
      // Проверяем, есть ли активная сессия с аватаром
      if (!sessionId || !streamingActive) {
        // Если есть конфигурация аватара, используем ее
        if (avatarConfig && avatarConfig.api) {
          // Создаем новую сессию, если нужно
          if (!sessionId) {
            const newSessionId = await createHeygenSession();
            if (!newSessionId) {
              throw new Error('Не удалось создать сессию Heygen');
            }
          }
          
          // Запускаем аватар
          const avatarId = avatarConfig.avatarId;
          await startHeygenSession(sessionId, avatarId);
        }
      }
      
      setInterviewStarted(true);
      
      const firstMessage = 'Здравствуйте! Я AI-интервьюер Raplle. Сегодня я буду проводить техническое собеседование на позицию Frontend-разработчика.';
      
      // Добавляем первое сообщение в чат
      setMessages([
        {
          sender: 'ai',
          text: firstMessage
        }
      ]);
      
      // Если есть активная сессия, отправляем текст аватару
      if (sessionId && streamingActive) {
        await sendTextToAvatar(firstMessage);
      }
      
    } catch (error) {
      console.error('Error starting interview:', error);
      setErrorMessage(`Ошибка при запуске интервью: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Добавляем сообщение пользователя
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputValue('');
    setLoading(true);
    
    try {
      // Отправка запроса на сервер
      const response = await axios.post('/api/interview/message', {
        message: inputValue,
        candidateId: selectedCandidate?.id,
        vacancyId: selectedVacancy?.id,
        position: interviewPosition,
        interviewId: interviewId,
        history: messages
      });
      
      // В реальном API здесь будет получение ответа от сервера
      // Имитация ответа от сервера
      const aiResponse = 'Спасибо за ваш ответ. Какие инструменты вы используете для отладки JavaScript кода?';
      
      // Добавляем ответ AI в чат
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prevMessages => [...prevMessages, botResponse]);
        
        // Если есть активная сессия с Heygen, отправляем текст аватару
        if (sessionId && streamingActive) {
          sendTextToAvatar(aiResponse).catch(err => {
            console.error('Error sending text to avatar:', err);
          });
        }
        
        setLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setLoading(false);
      
      // Добавляем сообщение об ошибке
      const errorMessage = {
        id: messages.length + 2,
        text: 'Произошла ошибка при обработке запроса. Пожалуйста, попробуйте еще раз.',
        sender: 'system',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    }
  };
  
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };
  
  // Очистка сессии при завершении интервью
  const handleEndInterview = async () => {
    try {
      // Закрываем сессию с Heygen
      if (sessionId) {
        await closeHeygenSession();
      }
      
      // Сбрасываем состояние интервью
      setInterviewStarted(false);
      setMessages([]);
      
    } catch (error) {
      console.error('Error ending interview:', error);
      setErrorMessage('Ошибка при завершении интервью');
    }
  };

  // Mini display for dashboard overview
  if (minimal) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <VideocamIcon sx={{ mr: 1 }} /> AI Interviewer
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Button
              variant="contained"
              startIcon={<VideocamIcon />}
            >
              Start Interview
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Обработчики событий

  // Обработчик изменения вкладки
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Обработчик перехода к следующему шагу
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  // Обработчик возврата к предыдущему шагу
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  // Обработчик выбора кандидата для интервью
  const handleSelectCandidate = (candidate) => {
    setSelectedCandidate(candidate);
    
    // Если позиция кандидата совпадает с одной из вакансий, автоматически выбираем ее
    const matchingVacancy = mockVacancies.find(v => v.title.includes(candidate.position));
    if (matchingVacancy) {
      setSelectedVacancy(matchingVacancy);
    }
    
    handleNext(); // Переход к следующему шагу
  };
  
  // Обработчик выбора вакансии
  const handleSelectVacancy = (vacancy) => {
    setSelectedVacancy(vacancy);
  };

  // Обработчик выбора аватара
  const handleSelectAvatar = (avatar) => {
    // Нормализуем формат аватара, чтобы он работал с обоими источниками данных
    const normalizedAvatar = {
      id: avatar.id || avatar.avatar_id,
      name: avatar.name,
      gender: avatar.gender || 'AI',
      description: avatar.description || '',
      preview: avatar.preview_url || avatar.preview || `https://via.placeholder.com/300x200?text=${avatar.name}`,
      // Сохраняем оригинальный объект для API идентификаторов
      original: avatar
    };
    
    setSelectedAvatar(normalizedAvatar);
    
    // Опционально: автоматический предпросмотр
    // previewAvatar(avatar);
  };

  // Обработчик сохранения конфигурации аватара
  const handleAvatarConfigComplete = async () => {
    if (!selectedAvatar || !selectedVoice) return;
    
    try {
      setLoadingAvatars(true);
      setErrorMessage('');
      
      // Если еще нет активной сессии, создаем ее
      if (!sessionId) {
        const newSessionId = await createHeygenSession();
        if (!newSessionId) {
          throw new Error('Не удалось создать сессию Heygen');
        }
      }
      
      // Получаем ID аватара из оригинального объекта
      const avatarId = selectedAvatar.original?.avatar_id || selectedAvatar.original?.id || selectedAvatar.id;
      
      // Сохраняем конфигурацию
      const voiceObj = voiceOptions.find(v => v.id === parseInt(selectedVoice));
      
      setAvatarConfig({
        avatar: selectedAvatar,
        voice: voiceObj,
        language: 'russian',
        sessionId: sessionId,
        avatarId: avatarId,
        api: {
          sessionId: sessionId,
          avatarId: avatarId,
          voiceId: selectedVoice,
        }
      });
      
      // Если еще нет активной сессии с аватаром, запускаем ее
      if (!streamingActive) {
        await startHeygenSession(sessionId, avatarId);
      }
      
      // Переходим к следующему шагу
      handleNext();
    } catch (error) {
      console.error('Error during avatar configuration:', error);
      setErrorMessage(`Ошибка при настройке аватара: ${error.message}`);
    } finally {
      setLoadingAvatars(false);
    }
  };

  // Обработчик создания интервью
  const handleCreateInterview = () => {
    setConfirmDialogOpen(true);
  };

  // Обработчик подтверждения создания интервью
  const handleConfirmCreate = () => {
    setConfirmDialogOpen(false);
    
    // Имитация отправки данных на сервер
    setTimeout(() => {
      setCreationComplete(true);
    }, 1500);
  };

  // Шаги создания интервью
  const steps = [
    'Выбор кандидата',
    'Настройка видеоаватара',
    'Планирование интервью',
    'Обзор и создание'
  ];

  // Фильтрация кандидатов по поисковому запросу
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesQuery = 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.keySkills.some(skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return matchesQuery;
  });

  // Получение контента для текущего шага
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Выбор кандидата
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Выберите кандидата для интервью
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Выберите кандидата из списка проанализированных резюме для проведения AI-интервью.
            </Typography>
            
            {/* Панель поиска */}
            <Box sx={{ mb: 3 }}>
              <TextField
                placeholder="Поиск по имени или навыкам"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Box>
            
            {/* Скрытая таблица для больших экранов */}
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table sx={{ minWidth: 650 }} aria-label="candidates table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Кандидат</TableCell>
                      <TableCell>Соответствие</TableCell>
                      <TableCell>Оценка резюме</TableCell>
                      <TableCell>Ключевые навыки</TableCell>
                      <TableCell>Действия</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCandidates
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar src={candidate.avatar} sx={{ mr: 2 }} />
                              <Box>
                                <Typography variant="subtitle2">
                                  {candidate.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {candidate.position}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={`${candidate.matchPercentage}%`} 
                              color={candidate.matchPercentage >= 80 ? 'success' : candidate.matchPercentage >= 60 ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={candidate.resumeScore} 
                              color={candidate.resumeScore >= 80 ? 'success' : candidate.resumeScore >= 60 ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {candidate.keySkills.map((skill, index) => (
                                <Chip 
                                  key={index}
                                  label={skill}
                                  size="small"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<VideocamIcon />}
                              onClick={() => handleSelectCandidate(candidate)}
                            >
                              Выбрать
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            
            {/* Мобильный свайп-интерфейс для карточек кандидатов */}
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
              <MobileSwipeCards 
                candidates={filteredCandidates}
                selectedCandidate={selectedCandidate}
                handleSelectCandidate={handleSelectCandidate}
                page={page}
                rowsPerPage={rowsPerPage}
              />
              
              {/* Фиксированная кнопка для мобильных устройств */}
              <Box 
                sx={{ 
                  position: 'fixed', 
                  bottom: 20, 
                  right: 20, 
                  zIndex: 100, 
                  display: { xs: 'block', md: 'none' } 
                }}
              >
                {selectedCandidate && (
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<VideocamIcon />}
                    onClick={handleStartInterview}
                    sx={{ 
                      borderRadius: 50, 
                      px: 3, 
                      py: 1.5,
                      boxShadow: 3,
                      fontWeight: 'bold',
                      fontSize: '0.9rem'
                    }}
                  >
                    Интервью
                  </Button>
                )}
              </Box>
            </Box>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredCandidates.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(event, newPage) => setPage(newPage)}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
            />
          </Box>
        );
      
      case 1: // Настройка видеоаватара
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Настройка видеоаватара (Heygen)
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Выберите аватар и голос для AI-интервьюера, который будет проводить собеседование по видеосвязи.
            </Typography>
            
            {/* Кнопка загрузки аватаров */}
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                onClick={fetchHeygenAvatars}
                startIcon={<RefreshIcon />}
                disabled={loadingAvatars}
                size="small"
              >
                {loadingAvatars ? 'Загрузка...' : 'Загрузить аватары из Heygen'}
              </Button>
            </Box>
            
            {/* Сообщение об ошибке */}
            {errorMessage && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}
            
            {/* Предпросмотр аватара */}
            {previewUrl && (
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                  Предпросмотр аватара
                </Typography>
                <Paper 
                  elevation={1} 
                  sx={{ 
                    p: 1, 
                    display: 'inline-block',
                    borderRadius: 2,
                    overflow: 'hidden',
                    maxWidth: '100%',
                    bgcolor: 'black'
                  }}
                >
                  <Box 
                    component="img"
                    src={previewUrl}
                    alt="Avatar Preview"
                    sx={{ 
                      maxWidth: '100%', 
                      height: 'auto',
                      maxHeight: 300,
                      borderRadius: 1
                    }}
                  />
                </Paper>
                
                {streamingActive && (
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={closeHeygenSession}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      Закрыть сессию
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => sendTextToAvatar('Привет! Я готов провести интервью.')}
                      size="small"
                    >
                      Тест голоса
                    </Button>
                  </Box>
                )}
              </Box>
            )}
            
            {/* Выбор аватара */}
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mt: 2 }}>
              Выберите аватар
            </Typography>
            
            <Paper 
              elevation={0} 
              sx={{ 
                borderRadius: 2, 
                border: '1px solid #eaeaea', 
                p: 3, 
                mb: 4, 
                mt: 1,
                backgroundColor: '#fcfcfc'
              }}
            >
              <Typography variant="body2" color="text.secondary" paragraph>
                Выберите аватар, который будет представлять AI-интервьюера. Вы можете изменить аватар в любой момент, нажав на кнопку "Выбрать другой аватар".
              </Typography>
              
              {/* Отображение основного выбранного аватара */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  width: { xs: '100%', md: '320px' },
                  mb: { xs: 2, md: 0 },
                  mr: { xs: 0, md: 4 }
                }}>
                  <Card
                    elevation={3}
                    sx={{ 
                      borderRadius: 2,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      border: '2px solid',
                      borderColor: 'primary.main',
                    }}
                  >
                    <Box sx={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                        image={selectedAvatar ? (selectedAvatar.preview_url || selectedAvatar.preview || `https://via.placeholder.com/300x300?text=${selectedAvatar.name}`) : 
                          ((heygenAvatars.length > 0 ? heygenAvatars[0] : mockAvatars[0])?.preview_url || 
                           (heygenAvatars.length > 0 ? heygenAvatars[0] : mockAvatars[0])?.preview || 
                           `https://via.placeholder.com/300x300?text=${(heygenAvatars.length > 0 ? heygenAvatars[0] : mockAvatars[0])?.name}`)}
                        alt={selectedAvatar ? selectedAvatar.name : (heygenAvatars.length > 0 ? heygenAvatars[0] : mockAvatars[0])?.name}
                      />
                    </Box>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                        {selectedAvatar ? selectedAvatar.name : (heygenAvatars.length > 0 ? heygenAvatars[0] : mockAvatars[0])?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        <span style={{ fontWeight: 500 }}>
                          {selectedAvatar ? (selectedAvatar.gender || 'AI') : ((heygenAvatars.length > 0 ? heygenAvatars[0] : mockAvatars[0])?.gender || 'AI')}
                        </span>
                        {selectedAvatar && selectedAvatar.description && (
                          <span>, {(selectedAvatar.description || '').substring(0, 100)}
                            {selectedAvatar.description && selectedAvatar.description.length > 100 ? '...' : ''}
                          </span>
                        )}
                        {!selectedAvatar && (heygenAvatars.length > 0 ? heygenAvatars[0] : mockAvatars[0])?.description && (
                          <span>, {((heygenAvatars.length > 0 ? heygenAvatars[0] : mockAvatars[0])?.description || '').substring(0, 100)}
                            {(heygenAvatars.length > 0 ? heygenAvatars[0] : mockAvatars[0])?.description && 
                             (heygenAvatars.length > 0 ? heygenAvatars[0] : mockAvatars[0])?.description.length > 100 ? '...' : ''}
                          </span>
                        )}
                      </Typography>
                      <Button
                        fullWidth
                        size="small"
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => previewAvatar(selectedAvatar || (heygenAvatars.length > 0 ? heygenAvatars[0] : mockAvatars[0]))}
                        sx={{ mb: 1 }}
                      >
                        Предпросмотр
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  width: { xs: '100%', md: 'auto' }
                }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    {selectedAvatar ? 'Текущий аватар ИИ-интервьюера' : 'Выберите аватар ИИ-интервьюера'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedAvatar ? 
                      'Этот аватар будет использоваться для проведения интервью. Вы можете изменить его в любой момент.' : 
                      'У вас еще не выбран аватар. Выберите его из галереи, чтобы использовать для интервью.'}
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PersonIcon />}
                    onClick={() => setAvatarDialogOpen(true)}
                    sx={{ mt: 1 }}
                  >
                    {selectedAvatar ? 'Выбрать другой аватар' : 'Выбрать аватар'}
                  </Button>
                </Box>
              </Box>
              
              {/* Диалог для выбора другого аватара */}
              <Dialog
                open={avatarDialogOpen}
                onClose={() => setAvatarDialogOpen(false)}
                maxWidth="lg"
                fullWidth
              >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="h6">Выбор аватара для ИИ-интервьюера</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Выберите один из предложенных аватаров или загрузите свой собственный
                    </Typography>
                  </Box>
                  <IconButton onClick={() => setAvatarDialogOpen(false)}>
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={3}>
                    {/* Используем heygenAvatars или mockAvatars если первые недоступны */}
                    {(heygenAvatars.length > 0 ? heygenAvatars : mockAvatars).map((avatar) => (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={avatar.id || avatar.avatar_id}>
                        <Card 
                          elevation={selectedAvatar?.id === (avatar.id || avatar.avatar_id) ? 3 : 1}
                          sx={{ 
                            cursor: 'pointer',
                            border: selectedAvatar?.id === (avatar.id || avatar.avatar_id) ? '2px solid' : '1px solid',
                            borderColor: selectedAvatar?.id === (avatar.id || avatar.avatar_id) ? 'primary.main' : 'divider',
                            borderRadius: 2,
                            overflow: 'hidden',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              transform: 'translateY(-4px)',
                              boxShadow: 3
                            }
                          }}
                          onClick={() => {
                            handleSelectAvatar(avatar);
                            setAvatarDialogOpen(false);
                          }}
                        >
                          <Box sx={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
                            <CardMedia
                              component="img"
                              sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                              image={avatar.preview_url || avatar.preview || `https://via.placeholder.com/300x300?text=${avatar.name}`}
                              alt={avatar.name}
                            />
                          </Box>
                          <CardContent sx={{ p: 2, flexGrow: 1 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>
                              {avatar.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              <span style={{ fontWeight: 500 }}>{avatar.gender || 'AI'}</span>
                              {avatar.description && <span>, {(avatar.description || '').substring(0, 50)}{avatar.description && avatar.description.length > 50 ? '...' : ''}</span>}
                            </Typography>
                            <Button
                              fullWidth
                              size="small"
                              variant="outlined"
                              startIcon={<VisibilityIcon />}
                              onClick={(e) => {
                                e.stopPropagation();
                                previewAvatar(avatar);
                              }}
                              sx={{ mt: 'auto' }}
                            >
                              Предпросмотр
                            </Button>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                  <Button onClick={() => setAvatarDialogOpen(false)}>Отмена</Button>
                  <Button 
                    variant="contained" 
                    onClick={() => setAvatarDialogOpen(false)}
                    disabled={!selectedAvatar}
                  >
                    Подтвердить выбор
                  </Button>
                </DialogActions>
              </Dialog>
            </Paper>

            
            {/* Настройки голоса */}
            <Paper elevation={0} sx={{ p: 3, mt: 4, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: 'rgba(250, 250, 250, 0.8)' }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <RecordVoiceOverIcon sx={{ mr: 1, color: 'primary.main' }} /> Настройки голоса
              </Typography>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                Выберите голос для аватара, который будет использоваться во время интервью.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel id="voice-select-label">Голос интервьюера</InputLabel>
                    <Select
                      labelId="voice-select-label"
                      value={selectedVoice}
                      onChange={(e) => setSelectedVoice(e.target.value)}
                      label="Голос интервьюера"
                    >
                      {voiceOptions.map((voice) => (
                        <MenuItem key={voice.id} value={voice.id.toString()}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <RecordVoiceOverIcon sx={{ mr: 1.5, color: voice.gender === 'женский' ? 'error.light' : 'primary.light' }} />
                            <span><strong>{voice.name}</strong> ({voice.gender}, {voice.language})</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
            
            {/* Кнопки навигации */}
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                size="large"
              >
                Назад к выбору кандидата
              </Button>
              
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleAvatarConfigComplete}
                disabled={!selectedAvatar || !selectedVoice || loadingAvatars}
                size="large"
              >
                Продолжить
              </Button>
            </Box>
          </Box>
        );
      
      case 2: // Планирование интервью
        return (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <DateRangeIcon sx={{ mr: 1.5, color: 'primary.main' }} /> Планирование интервью
            </Typography>
            
            <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 3 }}>
              Выберите дату и время интервью, а также вакансию для собеседования.
            </Typography>
            
            {/* Секция выбора времени */}
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: 'rgba(250, 250, 250, 0.8)' }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: 'medium' }}>
                <CalendarTodayIcon sx={{ mr: 1.5, color: 'primary.light' }} /> Дата и время интервью
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Дата"
                    type="date"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Время"
                    type="time"
                    defaultValue="10:00"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                Выберите удобное время для проведения AI-интервью. Система заранее подготовит все необходимые материалы.  
              </Typography>
            </Paper>

            {/* Секция выбора вакансии */}
            <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0', backgroundColor: 'rgba(250, 250, 250, 0.8)' }}>
              <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', mb: 2, fontWeight: 'medium' }}>
                <HowToRegIcon sx={{ mr: 1.5, color: 'primary.light' }} /> Выбор вакансии
              </Typography>
              
              {selectedCandidate && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Кандидат <strong>{selectedCandidate.name}</strong> будет проходить собеседование на позицию <strong>{selectedCandidate.position}</strong>
                </Alert>
              )}
              
              <FormControl fullWidth sx={{ mb: 1 }}>
                <InputLabel id="vacancy-select-label">Вакансия</InputLabel>
                <Select
                  labelId="vacancy-select-label"
                  value={selectedVacancy ? selectedVacancy.id.toString() : ''}
                  onChange={(e) => handleVacancyChange(e.target.value)}
                  label="Вакансия"
                >
                  {mockVacancies.map((vacancy) => (
                    <MenuItem key={vacancy.id} value={vacancy.id.toString()}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <HowToRegIcon sx={{ mr: 1.5, color: vacancy.id === selectedVacancy?.id ? 'primary.main' : 'text.secondary' }} />
                        <Typography variant="body1">{vacancy.title}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                Выбранная вакансия определит набор вопросов и задач, которые будут представлены кандидату во время интервью.
              </Typography>
            </Paper>
            
            {/* Кнопки навигации */}
            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={handleBack}
                size="large"
              >
                Назад к настройке аватара
              </Button>
              
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                onClick={handleNext}
                disabled={!selectedVacancy}
                size="large"
              >
                Продолжить к обзору
              </Button>
            </Box>
          </Box>
        );
      
      case 3: // Обзор и создание
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Обзор интервью
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                Информация о кандидате
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2">
                  <strong>Имя:</strong> {selectedCandidate?.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Позиция:</strong> {selectedCandidate?.position}
                </Typography>
                <Typography variant="body2">
                  <strong>Оценка резюме:</strong> {selectedCandidate?.resumeScore}/100
                </Typography>
                <Typography variant="body2">
                  <strong>Соответствие:</strong> {selectedCandidate?.matchPercentage}%
                </Typography>
              </Box>
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                Настройки видеоаватара
              </Typography>
              <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1, mb: 2 }}>
                <Typography variant="body2">
                  <strong>Аватар:</strong> {avatarConfig?.avatar?.name}
                </Typography>
                <Typography variant="body2">
                  <strong>Голос:</strong> {avatarConfig?.voice?.name} ({avatarConfig?.voice?.gender})
                </Typography>
                <Typography variant="body2">
                  <strong>Язык интервью:</strong> {avatarConfig?.language === 'russian' ? 'Русский' : 'Английский'}
                </Typography>
              </Box>
            </Box>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              После создания интервью, кандидат получит электронное письмо с приглашением и ссылкой на Zoom-встречу с AI-интервьюером.
            </Alert>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                onClick={handleBack}
              >
                Назад
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                startIcon={<CheckCircleIcon />}
                onClick={handleCreateInterview}
              >
                Создать интервью
              </Button>
            </Box>
          </Box>
        );
      
      default:
        return 'Неизвестный шаг';
    }
  };

  // Компонент завершения создания интервью
  const CompletionStep = () => (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <Box
        sx={{
          backgroundColor: 'rgba(67, 160, 71, 0.1)',
          borderRadius: '50%',
          width: 80,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}
      >
        <HowToRegIcon sx={{ fontSize: 40, color: 'success.main' }} />
      </Box>
      
      <Typography variant="h5" gutterBottom>
        Интервью успешно создано!
      </Typography>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        AI-интервьюер проведет собеседование с кандидатом в указанное время. 
        Вы получите уведомление о результатах после завершения.
      </Typography>
      
      <Button variant="contained" color="primary">
        Вернуться к списку интервью
      </Button>
    </Box>
  );
  
  // Mini display for dashboard overview
  if (minimal) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <VideocamIcon sx={{ mr: 1 }} /> AI Interviewer
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <Button
              variant="contained"
              startIcon={<VideocamIcon />}
            >
              Start Interview
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Interviewer
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Создать интервью" icon={<VideocamIcon />} iconPosition="start" />
          <Tab label="Мои интервью" icon={<DateRangeIcon />} iconPosition="start" />
          <Tab label="Результаты" icon={<AssessmentIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      
      {tabValue === 0 && (
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
          {!creationComplete ? (
            <>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              
              <Box>
                {getStepContent(activeStep)}
              </Box>
              
              <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
                maxWidth="sm"
                fullWidth
              >
                <DialogTitle>Подтверждение создания интервью</DialogTitle>
                <DialogContent>
                  <Typography>
                    Вы собираетесь создать AI-интервью для кандидата {selectedCandidate?.name} на позицию {selectedCandidate?.position}.
                  </Typography>
                  <Typography sx={{ mt: 2 }}>
                    Интервью будет создано с использованием видеоаватара {avatarConfig?.avatar?.name} и будет запланировано согласно указанным параметрам.
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setConfirmDialogOpen(false)}>Отмена</Button>
                  <Button 
                    onClick={handleConfirmCreate} 
                    variant="contained" 
                    color="primary"
                  >
                    Подтвердить
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          ) : (
            <CompletionStep />
          )}
        </Paper>
      )}
      
      {tabValue === 1 && (
        <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Typography variant="h6" gutterBottom>
            Запланированные интервью
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Здесь будет список запланированных интервью с AI-интервьюером.
          </Typography>
        </Paper>
      )}
      
      {tabValue === 2 && (
        <Paper elevation={0} sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3, 
          borderRadius: 2, 
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%'
        }}>
          <Typography variant="h6" gutterBottom>
            Результаты интервью
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Здесь будут отображаться результаты проведенных интервью с анализом ответов кандидатов.
          </Typography>
        </Paper>
      )}
      
      {/* Оригинальный режим интервью, если выбран */}
      {tabValue === 0 && !creationComplete && interviewStarted && (
        <Paper elevation={0} sx={{ 
          p: { xs: 2, sm: 3 }, 
          mb: 3, 
          borderRadius: 2, 
          border: '1px solid #e0e0e0', 
          position: 'relative',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%'
        }}>
          {/* Навигация для возврата в настройки */}
          <Box sx={{ position: 'absolute', top: { xs: 5, sm: 10 }, left: { xs: 5, sm: 10 }, zIndex: 10 }}>
            <Tooltip title="Завершить интервью">
              <IconButton onClick={handleEndInterview} color="primary">
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          {interviewStarted ? (
            <Grid container spacing={{ xs: 2, sm: 3 }}>
              <Grid item xs={12} md={8}>
                <Box sx={{ 
                  height: { xs: '400px', sm: '450px', md: '500px' }, 
                  display: 'flex', 
                  flexDirection: 'column' 
                }}>
                  <Box sx={{ 
                    flexGrow: 1, 
                    overflowY: 'auto', 
                    p: { xs: 1, sm: 2 }, 
                    bgcolor: '#f5f7fa', 
                    borderRadius: 2, 
                    mb: 2 
                  }}>
                    {messages.map((message, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                          mb: 2
                        }}
                      >
                        {message.sender === 'ai' && (
                          <Avatar sx={{ bgcolor: 'primary.main', mr: 1, width: { xs: 28, sm: 36, md: 40 }, height: { xs: 28, sm: 36, md: 40 } }}>
                            <SmartToyIcon sx={{ fontSize: { xs: 16, sm: 20, md: 24 } }} />
                          </Avatar>
                        )}
                        
                        <Paper
                          elevation={1}
                          sx={{
                            p: { xs: 1.5, sm: 2 },
                            maxWidth: { xs: '85%', sm: '75%', md: '70%' },
                            bgcolor: message.sender === 'user' ? 'primary.light' : 'background.paper',
                            borderRadius: 2,
                            wordBreak: 'break-word'
                          }}
                        >
                          <Typography variant="body1" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            {message.text}
                          </Typography>
                        </Paper>
                        
                        {message.sender === 'user' && (
                          <Avatar sx={{ bgcolor: 'secondary.main', ml: 1, width: { xs: 28, sm: 36, md: 40 }, height: { xs: 28, sm: 36, md: 40 } }}>
                            U
                          </Avatar>
                        )}
                      </Box>
                    ))}
                    
                    {loading && (
                      <Box sx={{ display: 'flex', alignItems: 'center', pl: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 1 }}>
                          <SmartToyIcon />
                        </Avatar>
                        <Typography variant="body2" color="text.secondary">
                          AI is typing...
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Type your response..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={loading}
                      size="small"
                      sx={{ 
                        mr: 1,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: { xs: 1, sm: 2 }
                        }
                      }}
                    />
                    <IconButton 
                      color="primary"
                      onClick={sendMessage} 
                      disabled={loading || !inputValue.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card variant="outlined" sx={{ mb: { xs: 1.5, sm: 2 }, borderRadius: { xs: 1, sm: 2 } }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      Interview Details
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <List dense>
                      <ListItem>
                        <ListItemText primary="Position" secondary="Frontend Developer" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Duration" secondary="15-30 minutes" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Resume" secondary="John_Doe_Resume.pdf" />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary="Status" secondary="In Progress" />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
                
                <Card variant="outlined" sx={{ borderRadius: { xs: 1, sm: 2 } }}>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      AI Evaluation
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      The AI will analyze responses in real-time and provide an assessment report after the interview.
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        startIcon={<SaveIcon />}
                        fullWidth
                        sx={{ mb: 1 }}
                      >
                        Save Transcript
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        fullWidth
                      >
                        Download Report
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ 
              textAlign: 'center', 
              py: { xs: 2, sm: 3, md: 4 },
              px: { xs: 1, sm: 2 },
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: '200px', sm: '250px', md: '300px' }
            }}>
              <VideocamIcon sx={{ 
                fontSize: { xs: 40, sm: 50, md: 60 }, 
                color: 'primary.main', 
                mb: { xs: 1, sm: 1.5, md: 2 } 
              }} />
              <Typography variant="h6" gutterBottom sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                Start Video Interview
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ 
                mx: { xs: 1, sm: 2, md: 3 },
                fontSize: { xs: '0.85rem', sm: '0.9rem', md: '1rem' }
              }}>
                AI will conduct an interview, ask relevant questions based on the job and candidate's resume, and provide an assessment report.
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<VideocamIcon />}
                onClick={handleStartInterview}
                sx={{ 
                  mt: { xs: 1, sm: 2 },
                  px: { xs: 2, sm: 3 },
                  py: { xs: 1, sm: 1.5 },
                  maxWidth: { xs: '100%', sm: '80%', md: '60%', lg: '40%' },
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 'bold'
                }}
              >
                Begin Interview
              </Button>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AIInterviewer;
