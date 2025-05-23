import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Card,
  CardContent,
  Grid,
  IconButton,
  Divider,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  Slider,
  Tooltip,
  Switch
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import SearchIcon from '@mui/icons-material/Search';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import VideocamIcon from '@mui/icons-material/Videocam';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LanguageIcon from '@mui/icons-material/Language';
import FaceIcon from '@mui/icons-material/Face';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import WomanIcon from '@mui/icons-material/Woman';
import ManIcon from '@mui/icons-material/Man';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';

// Шаги процесса создания интервью
const steps = [
  'Выбор вакансии',
  'Параметры интервью',
  'Вопросы',
  'Планирование Zoom',
  'Обзор'
];

// Моковые данные вакансий (позже будут заменены на API-запрос)
const mockVacancies = [
  {
    id: 1,
    title: 'Frontend-разработчик (React)',
    status: 'active',
    department: 'Разработка',
    location: 'Москва',
    candidates: 12,
    description: 'Разработка пользовательских интерфейсов на React, оптимизация производительности и интеграция с API.',
    requirements: [
      'Опыт коммерческой разработки на React от 2 лет',
      'Уверенное знание JavaScript, TypeScript',
      'Опыт работы с Redux, React Router',
      'Понимание принципов адаптивной верстки',
      'Опыт работы с REST API'
    ],
    dateCreated: '2025-04-15'
  },
  {
    id: 2,
    title: 'Backend-разработчик (Node.js)',
    status: 'active',
    department: 'Разработка',
    location: 'Санкт-Петербург',
    candidates: 8,
    description: 'Разработка и поддержка бэкенд-сервисов на Node.js, проектирование API и оптимизация производительности.',
    requirements: [
      'Опыт разработки на Node.js от 2 лет',
      'Знание Express.js, NestJS',
      'Опыт работы с PostgreSQL, MongoDB',
      'Понимание принципов RESTful API',
      'Опыт работы с Docker'
    ],
    dateCreated: '2025-04-20'
  },
  {
    id: 3,
    title: 'UI/UX дизайнер',
    status: 'active',
    department: 'Дизайн',
    location: 'Удаленно',
    candidates: 5,
    description: 'Создание пользовательских интерфейсов для веб-приложений и мобильных приложений, работа с командой разработки для реализации дизайн-решений.',
    requirements: [
      'Опыт работы UX/UI дизайнером от 3 лет',
      'Владение Figma, Adobe XD',
      'Создание прототипов и вайрфреймов',
      'Понимание принципов UX-исследований',
      'Портфолио с релевантными проектами',
      'Знание современных тенденций в дизайне'
    ],
    dateCreated: '2025-05-10'
  }
];

const InterviewCreator = () => {
  // Состояние для отслеживания текущего шага
  const [activeStep, setActiveStep] = useState(0);
  
  // Состояние для хранения вакансий
  const [vacancies, setVacancies] = useState([]);
  const [isLoadingVacancies, setIsLoadingVacancies] = useState(true);
  const [vacancySearchQuery, setVacancySearchQuery] = useState('');
  
  // Состояние для хранения данных интервью
  const [interviewData, setInterviewData] = useState({
    vacancyId: null,
    vacancyTitle: '',
    interviewType: 'technical', // technical, hr, mixed
    duration: 30, // в минутах
    language: 'ru',
    questions: [],
    zoomSchedule: {
      date: null,
      time: null,
      timezone: 'Europe/Moscow'
    },
    avatar: {
      gender: 'female',
      style: 'professional'
    },
    voice: {
      gender: 'female',
      accent: 'neutral'
    }
  });
  
  // Функции для перехода между шагами
  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };
  
  // Функция для обновления данных интервью
  const updateInterviewData = (field, value) => {
    setInterviewData(prevData => ({
      ...prevData,
      [field]: value
    }));
  };
  
  // Функция для сохранения/создания интервью
  const handleCreateInterview = () => {
    console.log('Создание интервью с данными:', interviewData);
    // Здесь будет API-запрос для сохранения данных интервью
  };
  
  // Эффект для загрузки вакансий при монтировании компонента
  useEffect(() => {
    // Имитация загрузки данных с API
    const fetchVacancies = async () => {
      setIsLoadingVacancies(true);
      try {
        // В реальном приложении здесь будет API-запрос
        // const response = await axios.get('/api/vacancies');
        // setVacancies(response.data);
        
        // Используем моковые данные для демонстрации
        setTimeout(() => {
          setVacancies(mockVacancies);
          setIsLoadingVacancies(false);
        }, 800);
      } catch (error) {
        console.error('Ошибка при загрузке вакансий:', error);
        setIsLoadingVacancies(false);
      }
    };
    
    fetchVacancies();
  }, []);
  
  // Фильтрация вакансий по поисковому запросу
  const filteredVacancies = vacancies.filter(vacancy => 
    vacancy.title.toLowerCase().includes(vacancySearchQuery.toLowerCase()) || 
    vacancy.department.toLowerCase().includes(vacancySearchQuery.toLowerCase()) ||
    vacancy.location.toLowerCase().includes(vacancySearchQuery.toLowerCase())
  );
  
  // Обработчик выбора вакансии
  const handleSelectVacancy = (vacancy) => {
    setInterviewData(prev => ({
      ...prev,
      vacancyId: vacancy.id,
      vacancyTitle: vacancy.title,
      vacancyData: vacancy
    }));
  };
  
  // Функция для отображения контента текущего шага
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Выберите вакансию для интервью
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Выберите существующую вакансию из списка. Данные вакансии будут использованы для 
              настройки интервью и генерации релевантных вопросов.
            </Typography>
            
            <TextField
              fullWidth
              placeholder="Поиск вакансий..."
              variant="outlined"
              value={vacancySearchQuery}
              onChange={(e) => setVacancySearchQuery(e.target.value)}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            
            {isLoadingVacancies ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : filteredVacancies.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                Вакансии не найдены. Проверьте критерии поиска или создайте новую вакансию.
              </Alert>
            ) : (
              <RadioGroup
                value={interviewData.vacancyId?.toString() || ''}
                onChange={(e) => {
                  const selectedVacancy = vacancies.find(v => v.id.toString() === e.target.value);
                  if (selectedVacancy) {
                    handleSelectVacancy(selectedVacancy);
                  }
                }}
              >
                <Grid container spacing={2}>
                  {filteredVacancies.map((vacancy) => (
                    <Grid item xs={12} key={vacancy.id}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          borderColor: interviewData.vacancyId === vacancy.id ? 'primary.main' : 'divider',
                          bgcolor: interviewData.vacancyId === vacancy.id ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                          transition: 'all 0.2s',
                          '&:hover': {
                            borderColor: 'primary.main',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <FormControlLabel 
                              value={vacancy.id.toString()} 
                              control={<Radio />} 
                              label=""
                              sx={{ mr: 0, alignSelf: 'flex-start' }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" component="div" gutterBottom>
                                {vacancy.title}
                              </Typography>
                              
                              <Grid container spacing={2} sx={{ mb: 1 }}>
                                <Grid item xs={12} sm={6} md={4}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <WorkIcon sx={{ color: 'text.secondary', fontSize: 18, mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {vacancy.department}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <LocationOnIcon sx={{ color: 'text.secondary', fontSize: 18, mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {vacancy.location}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <PeopleIcon sx={{ color: 'text.secondary', fontSize: 18, mr: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                      {vacancy.candidates} кандидатов
                                    </Typography>
                                  </Box>
                                </Grid>
                              </Grid>
                              
                              <Typography variant="body2" color="text.primary" paragraph>
                                {vacancy.description}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                {vacancy.requirements.slice(0, 3).map((req, index) => (
                                  <Chip 
                                    key={index} 
                                    label={req} 
                                    size="small" 
                                    sx={{ bgcolor: 'rgba(0,0,0,0.04)' }}
                                  />
                                ))}
                                {vacancy.requirements.length > 3 && (
                                  <Chip 
                                    label={`+${vacancy.requirements.length - 3}`} 
                                    size="small" 
                                    sx={{ bgcolor: 'rgba(0,0,0,0.04)' }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            )}
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Настройте параметры интервью
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Определите тип интервью, продолжительность и другие базовые параметры.
            </Typography>
            
            <Grid container spacing={4} sx={{ mt: 1 }}>
              {/* Левая колонка: Основные настройки */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 0.5, mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <SettingsSuggestIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Основные настройки
                    </Typography>
                    
                    <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                      <FormLabel component="legend" sx={{ mb: 1 }}>
                        Тип интервью
                      </FormLabel>
                      <RadioGroup
                        value={interviewData.interviewType || 'technical'}
                        onChange={(e) => updateInterviewData('interviewType', e.target.value)}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <FormControlLabel 
                              value="technical" 
                              control={<Radio />} 
                              label="Техническое" 
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <FormControlLabel 
                              value="hr" 
                              control={<Radio />} 
                              label="HR" 
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <FormControlLabel 
                              value="mixed" 
                              control={<Radio />} 
                              label="Смешанное" 
                            />
                          </Grid>
                        </Grid>
                      </RadioGroup>
                      <FormHelperText>
                        {interviewData.interviewType === 'technical' && 'Фокус на технических навыках и знаниях кандидата'}
                        {interviewData.interviewType === 'hr' && 'Фокус на soft skills, мотивации и культурном соответствии'}
                        {interviewData.interviewType === 'mixed' && 'Сочетание технических вопросов и оценки soft skills'}
                      </FormHelperText>
                    </FormControl>
                    
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTimeIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                        Продолжительность: {interviewData.duration} минут
                      </Typography>
                      <Slider
                        value={interviewData.duration}
                        min={15}
                        max={60}
                        step={5}
                        marks={[
                          { value: 15, label: '15 мин' },
                          { value: 30, label: '30 мин' },
                          { value: 45, label: '45 мин' },
                          { value: 60, label: '60 мин' },
                        ]}
                        onChange={(e, newValue) => updateInterviewData('duration', newValue)}
                        sx={{ mt: 2 }}
                      />
                    </Box>
                    
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <FormLabel component="legend" sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LanguageIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                          Язык интервью
                        </Box>
                      </FormLabel>
                      <Select
                        value={interviewData.language}
                        onChange={(e) => updateInterviewData('language', e.target.value)}
                      >
                        <MenuItem value="ru">Русский</MenuItem>
                        <MenuItem value="en">Английский</MenuItem>
                      </Select>
                      <FormHelperText>
                        Выберите язык, на котором будет проводиться интервью
                      </FormHelperText>
                    </FormControl>
                  </CardContent>
                </Card>
              </Grid>
              
              {/* Правая колонка: Настройки АИ-интервьюера */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ p: 0.5, mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <FaceIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Настройки Аи-интервьюера
                    </Typography>
                    
                    <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                      <FormLabel component="legend" sx={{ mb: 1 }}>
                        Пол аватара
                      </FormLabel>
                      <RadioGroup
                        row
                        value={interviewData.avatar.gender || 'female'}
                        onChange={(e) => updateInterviewData('avatar', {...interviewData.avatar, gender: e.target.value})}
                      >
                        <FormControlLabel 
                          value="female" 
                          control={<Radio />} 
                          label="Женский" 
                          sx={{ mr: 4 }}
                        />
                        <FormControlLabel 
                          value="male" 
                          control={<Radio />} 
                          label="Мужской" 
                          sx={{ mr: 4 }}
                        />
                      </RadioGroup>
                    </FormControl>
                    
                    <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                      <FormLabel component="legend" sx={{ mb: 1 }}>
                        Стиль аватара
                      </FormLabel>
                      <RadioGroup
                        row
                        value={interviewData.avatar.style || 'professional'}
                        onChange={(e) => updateInterviewData('avatar', {...interviewData.avatar, style: e.target.value})}
                      >
                        <FormControlLabel 
                          value="professional" 
                          control={<Radio />} 
                          label="Деловой" 
                          sx={{ mr: 4 }}
                        />
                        <FormControlLabel 
                          value="casual" 
                          control={<Radio />} 
                          label="Повседневный" 
                          sx={{ mr: 4 }}
                        />
                      </RadioGroup>
                    </FormControl>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                      <RecordVoiceOverIcon sx={{ mr: 1, color: 'primary.main' }} />
                      Настройки голоса
                    </Typography>
                    
                    <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
                      <FormLabel component="legend" sx={{ mb: 1 }}>
                        Пол голоса
                      </FormLabel>
                      <RadioGroup
                        row
                        value={interviewData.voice.gender || 'female'}
                        onChange={(e) => updateInterviewData('voice', {...interviewData.voice, gender: e.target.value})}
                      >
                        <FormControlLabel 
                          value="female" 
                          control={<Radio />} 
                          label="Женский" 
                          sx={{ mr: 4 }}
                        />
                        <FormControlLabel 
                          value="male" 
                          control={<Radio />} 
                          label="Мужской" 
                          sx={{ mr: 4 }}
                        />
                      </RadioGroup>
                    </FormControl>
                    
                    <FormControl fullWidth sx={{ mb: 3 }}>
                      <FormLabel component="legend" sx={{ mb: 1 }}>
                        Акцент голоса
                      </FormLabel>
                      <Select
                        value={interviewData.voice.accent || 'neutral'}
                        onChange={(e) => updateInterviewData('voice', {...interviewData.voice, accent: e.target.value})}
                      >
                        <MenuItem value="neutral">Нейтральный</MenuItem>
                        <MenuItem value="formal">Формальный</MenuItem>
                        <MenuItem value="friendly">Дружелюбный</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Typography variant="body2">Автоматически синхронизировать пол голоса и аватара</Typography>
                      <Switch 
                        checked={interviewData.avatar.gender === interviewData.voice.gender}
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Синхронизируем голос с аватаром
                            updateInterviewData('voice', {...interviewData.voice, gender: interviewData.avatar.gender});
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Card variant="outlined" sx={{ maxWidth: 300, py: 1, px: 2 }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          bgcolor: 'primary.main', 
                          margin: '0 auto 16px auto'
                        }}
                      >
                        {interviewData.avatar.gender === 'female' ? 
                          <WomanIcon fontSize="large" /> : 
                          <ManIcon fontSize="large" />}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Предпросмотр настроек AI-интервьюера
                      </Typography>
                      <Chip 
                        label={interviewData.language === 'ru' ? 'Русский' : 'English'} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={`${interviewData.duration} мин.`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </CardContent>
                  </Card>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Выберите или сгенерируйте вопросы
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Система может автоматически сгенерировать вопросы на основе описания вакансии или 
              вы можете добавить собственные вопросы.
            </Typography>
            
            {/* Здесь будет компонент для работы с вопросами */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Генерация и управление вопросами будут доступны здесь
              </Typography>
            </Box>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Запланируйте Zoom-встречу
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Выберите дату и время для проведения интервью с кандидатом.
            </Typography>
            
            {/* Здесь будет компонент планирования Zoom */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Планировщик Zoom-встречи будет размещен здесь
              </Typography>
            </Box>
          </Box>
        );
      case 4:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Проверьте детали интервью
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Убедитесь, что все настройки интервью корректны перед созданием.
            </Typography>
            
            {/* Здесь будет обзор всех настроек интервью */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" align="center">
                Сводка настроек интервью будет показана здесь
              </Typography>
            </Box>
          </Box>
        );
      default:
        return 'Неизвестный шаг';
    }
  };
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          sx={{ mr: 2 }}
          onClick={() => window.history.back()}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          Создание AI-интервью
        </Typography>
      </Box>
      
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 4, mb: 2 }}>
          {activeStep === steps.length ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Интервью успешно создано!
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Кандидат получит приглашение на собеседование с AI-интервьюером.
              </Typography>
              <Button 
                variant="contained" 
                sx={{ mt: 2 }}
                onClick={() => window.location.href = '/ai-interviewer'}
              >
                К списку интервью
              </Button>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 4 }}>
                {getStepContent(activeStep)}
              </Box>
              <Divider sx={{ my: 3 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="outlined"
                >
                  Назад
                </Button>
                <Box>
                  {activeStep === steps.length - 1 ? (
                    <Button 
                      variant="contained"
                      onClick={handleCreateInterview}
                      startIcon={<InterpreterModeIcon />}
                    >
                      Создать интервью
                    </Button>
                  ) : (
                    <Button 
                      variant="contained"
                      onClick={handleNext}
                      disabled={(activeStep === 0 && !interviewData.vacancyId) || 
                              (activeStep === 1 && !interviewData.interviewType)}
                    >
                      Далее
                    </Button>
                  )}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default InterviewCreator;
