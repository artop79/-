import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  FormHelperText,
  Alert,
  CircularProgress,
  Stack,
  Card,
  CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ReorderIcon from '@mui/icons-material/Reorder';

// Заготовки вопросов для разных типов интервью
const questionTemplates = {
  general: [
    'Расскажите о себе и своем профессиональном опыте.',
    'Какие ваши сильные и слабые стороны?',
    'Почему вы хотите работать в нашей компании?',
    'Где вы видите себя через 5 лет?'
  ],
  technical: [
    'Расскажите о своем опыте работы с [технология].',
    'Какие инструменты разработки вы используете в повседневной работе?',
    'Опишите наиболее сложный технический проект, над которым вы работали.',
    'Как вы решаете проблемы оптимизации производительности?'
  ],
  softSkills: [
    'Расскажите о ситуации, когда вам пришлось решать конфликт в команде.',
    'Как вы справляетесь с критикой?',
    'Опишите ситуацию, когда вам пришлось быстро адаптироваться к изменениям.',
    'Как вы расставляете приоритеты при работе над несколькими задачами?'
  ],
  leadership: [
    'Опишите ваш стиль руководства.',
    'Как вы мотивируете свою команду?',
    'Расскажите о ситуации, когда вы успешно делегировали сложную задачу.',
    'Как вы оцениваете эффективность работы членов команды?'
  ]
};

// Мок-данные вакансий
const vacancies = [
  { id: 1, title: 'Frontend-разработчик (React)' },
  { id: 2, title: 'Backend-разработчик (Node.js)' },
  { id: 3, title: 'UX/UI дизайнер' },
  { id: 4, title: 'Project Manager' },
  { id: 5, title: 'DevOps инженер' },
];

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
}));

const CandidateInfoCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  marginBottom: theme.spacing(3),
}));

const InterviewScheduler = ({ selectedCandidate, onComplete }) => {
  const [vacancy, setVacancy] = useState('');
  const [interviewDate, setInterviewDate] = useState(null);
  const [interviewTime, setInterviewTime] = useState(null);
  const [interviewDuration, setInterviewDuration] = useState(30);
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionTemplate, setQuestionTemplate] = useState('');
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [errors, setErrors] = useState({});

  // При изменении шаблона вопросов
  const handleTemplateChange = (event) => {
    const template = event.target.value;
    setQuestionTemplate(template);
    
    if (template) {
      // Имитация загрузки вопросов с задержкой
      setIsGeneratingQuestions(true);
      setTimeout(() => {
        setQuestions([...questions, ...questionTemplates[template]]);
        setIsGeneratingQuestions(false);
      }, 1000);
    }
  };

  // Добавление нового вопроса
  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion('');
    }
  };

  // Удаление вопроса
  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // Перемещение вопроса вверх
  const handleMoveUp = (index) => {
    if (index === 0) return; // Уже верхний элемент
    
    const items = Array.from(questions);
    const item = items[index];
    items[index] = items[index - 1];
    items[index - 1] = item;
    
    setQuestions(items);
  };
  
  // Перемещение вопроса вниз
  const handleMoveDown = (index) => {
    if (index === questions.length - 1) return; // Уже нижний элемент
    
    const items = Array.from(questions);
    const item = items[index];
    items[index] = items[index + 1];
    items[index + 1] = item;
    
    setQuestions(items);
  };

  // Завершение настройки интервью
  const handleComplete = () => {
    // Валидация
    const newErrors = {};
    if (!vacancy) newErrors.vacancy = 'Выберите вакансию';
    if (!interviewDate) newErrors.date = 'Выберите дату';
    if (!interviewTime) newErrors.time = 'Выберите время';
    if (questions.length < 3) newErrors.questions = 'Добавьте не менее 3 вопросов';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Форматирование даты и времени
    let dateTime;
    try {
      // Безопасный способ создания даты
      dateTime = new Date(`${interviewDate}T${interviewTime}:00`);
      
      // Проверка на некорректную дату (Invalid Date)
      if (isNaN(dateTime.getTime())) {
        // Альтернативный способ с разбором на компоненты
        const [year, month, day] = interviewDate.split('-').map(Number);
        const [hours, minutes] = interviewTime.split(':').map(Number);
        dateTime = new Date(year, month - 1, day, hours, minutes);
      }
    } catch (error) {
      console.error('Error creating date:', error);
      // При ошибке используем текущую дату + 1 день
      dateTime = new Date();
      dateTime.setDate(dateTime.getDate() + 1);
    }
    
    // Создание объекта настроек интервью
    const interviewConfig = {
      candidate: selectedCandidate,
      vacancy: vacancies.find(v => v.id === parseInt(vacancy)),
      dateTime: dateTime.toISOString(),
      duration: interviewDuration,
      questions
    };
    
    // Передача настроек в родительский компонент
    onComplete(interviewConfig);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>Планирование AI-интервью</Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Настройте параметры интервью для выбранного кандидата. Система Heygen создаст видеоаватар для проведения собеседования.
      </Typography>
      
      {/* Информация о кандидате */}
      {selectedCandidate && (
        <CandidateInfoCard>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6">{selectedCandidate.name}</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon fontSize="small" sx={{ mr: 1 }} />
              {selectedCandidate.position}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Chip 
                label={`Соответствие: ${selectedCandidate.matchPercentage}%`} 
                color={selectedCandidate.matchPercentage >= 85 ? 'success' : 
                      selectedCandidate.matchPercentage >= 70 ? 'warning' : 'error'} 
                size="small" 
                sx={{ mr: 1 }} 
              />
              <Chip 
                label={`Оценка резюме: ${selectedCandidate.resumeScore}`} 
                color={selectedCandidate.resumeScore >= 85 ? 'success' : 
                      selectedCandidate.resumeScore >= 70 ? 'warning' : 'error'} 
                size="small" 
              />
            </Box>
          </CardContent>
        </CandidateInfoCard>
      )}
      
      <StyledPaper>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>Основные параметры</Typography>
          </Grid>
          
          {/* Вакансия */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.vacancy}>
              <InputLabel>Вакансия</InputLabel>
              <Select
                value={vacancy}
                onChange={(e) => setVacancy(e.target.value)}
                label="Вакансия"
              >
                {vacancies.map((v) => (
                  <MenuItem key={v.id} value={v.id}>{v.title}</MenuItem>
                ))}
              </Select>
              {errors.vacancy && <FormHelperText>{errors.vacancy}</FormHelperText>}
            </FormControl>
          </Grid>
          
          {/* Длительность интервью */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Длительность (мин)</InputLabel>
              <Select
                value={interviewDuration}
                onChange={(e) => setInterviewDuration(e.target.value)}
                label="Длительность (мин)"
              >
                <MenuItem value={15}>15 минут</MenuItem>
                <MenuItem value={30}>30 минут</MenuItem>
                <MenuItem value={45}>45 минут</MenuItem>
                <MenuItem value={60}>60 минут</MenuItem>
                <MenuItem value={90}>90 минут</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Дата и время интервью */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Дата интервью"
              type="date"
              value={interviewDate ? interviewDate : ''}
              onChange={(e) => setInterviewDate(e.target.value)}
              fullWidth
              error={!!errors.date}
              helperText={errors.date || ''}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split('T')[0] // Сегодняшняя дата как минимум
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Время интервью"
              type="time"
              value={interviewTime ? interviewTime : ''}
              onChange={(e) => setInterviewTime(e.target.value)}
              fullWidth
              error={!!errors.time}
              helperText={errors.time || ''}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </StyledPaper>
      
      <StyledPaper>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>Вопросы для интервью</Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Выберите шаблон вопросов или добавьте свои собственные. Вы можете изменить порядок вопросов перетаскиванием.
        </Alert>
        
        {/* Шаблоны вопросов */}
        <Box sx={{ mb: 3 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Шаблон вопросов</InputLabel>
            <Select
              value={questionTemplate}
              onChange={handleTemplateChange}
              label="Шаблон вопросов"
            >
              <MenuItem value=""><em>Не выбрано</em></MenuItem>
              <MenuItem value="general">Общие вопросы</MenuItem>
              <MenuItem value="technical">Технические вопросы</MenuItem>
              <MenuItem value="softSkills">Soft skills</MenuItem>
              <MenuItem value="leadership">Лидерские качества</MenuItem>
            </Select>
          </FormControl>
          
          {isGeneratingQuestions && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CircularProgress size={20} sx={{ mr: 2 }} />
              <Typography variant="body2">Генерация вопросов...</Typography>
            </Box>
          )}
        </Box>
        
        {/* Добавление своего вопроса */}
        <Box sx={{ display: 'flex', mb: 2 }}>
          <TextField
            fullWidth
            label="Введите свой вопрос"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddQuestion()}
            sx={{ mr: 1 }}
          />
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddQuestion}
            disabled={!newQuestion.trim()}
          >
            Добавить
          </Button>
        </Box>
        
        {/* Список вопросов */}
        <Box sx={{ mb: 3 }}>
          {errors.questions && (
            <FormHelperText error sx={{ mb: 1 }}>{errors.questions}</FormHelperText>
          )}
          
          {questions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
              Добавьте вопросы для интервью
            </Typography>
          ) : (
            <List
              sx={{ 
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              {questions.map((question, index) => (
                <ListItem
                  key={index}
                  divider={index < questions.length - 1}
                >
                  <ReorderIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <ListItemText
                    primary={question}
                    secondary={`Вопрос ${index + 1}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleMoveUp(index)} 
                      disabled={index === 0}
                      sx={{ mr: 1 }}
                    >
                      <Box component="span" sx={{ transform: 'rotate(-90deg)', display: 'flex' }}>
                        <ReorderIcon fontSize="small" />
                      </Box>
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleMoveDown(index)} 
                      disabled={index === questions.length - 1}
                      sx={{ mr: 1 }}
                    >
                      <Box component="span" sx={{ transform: 'rotate(90deg)', display: 'flex' }}>
                        <ReorderIcon fontSize="small" />
                      </Box>
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDeleteQuestion(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          )}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleComplete}
            disabled={questions.length === 0}
          >
            Продолжить
          </Button>
        </Box>
      </StyledPaper>
    </Box>
  );
};

export default InterviewScheduler;
