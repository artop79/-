import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
  Chip,
  Button,
  Rating,
  Tooltip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab,
  IconButton
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import StarIcon from '@mui/icons-material/Star';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VideocamIcon from '@mui/icons-material/Videocam';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

// Стилизованные компоненты
const ScoreCard = styled(Card)(({ theme }) => ({
  height: '100%',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
}));

const ScoreProgress = styled(LinearProgress)(({ theme, value }) => {
  let color = theme.palette.success.main;
  if (value < 70) color = theme.palette.warning.main;
  if (value < 50) color = theme.palette.error.main;
  
  return {
    height: 10,
    borderRadius: 5,
    backgroundColor: alpha(color, 0.2),
    '& .MuiLinearProgress-bar': {
      backgroundColor: color,
    }
  };
});

const VideoPanel = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  position: 'relative',
  aspectRatio: '16/9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

// Мок-данные результатов интервью
const mockInterviewResult = {
  id: 1,
  candidateName: 'Алексей Смирнов',
  position: 'Frontend-разработчик',
  avatar: '/mock-avatars/avatar1.jpg',
  date: '2025-05-17T14:00:00',
  duration: 45,
  videoUrl: 'https://example.com/video123',
  scores: {
    overall: 82,
    technicalSkills: 87,
    communication: 78,
    problemSolving: 85,
    teamwork: 75,
  },
  questionAnswers: [
    {
      id: 1,
      question: 'Расскажите о своем опыте работы с React',
      answer: 'Я работаю с React более 4 лет. Участвовал в проектах разной сложности от небольших лендингов до крупных корпоративных приложений. Имею опыт использования Redux, MobX, React Query и других технологий экосистемы React.',
      score: 90,
      analysis: 'Кандидат демонстрирует глубокое знание React и его экосистемы. Опыт работы соответствует требованиям позиции.',
    },
    {
      id: 2,
      question: 'Как бы вы оптимизировали производительность React-приложения?',
      answer: 'Для оптимизации производительности я бы использовал React.memo для предотвращения лишних рендеров компонентов, useMemo для кэширования вычислений, useCallback для мемоизации функций. Также важно правильно использовать виртуализацию для списков, оптимизировать бандл с помощью code-splitting и lazy loading, а также следить за перерендерами с помощью инструментов профилирования.',
      score: 95,
      analysis: 'Отличный ответ с демонстрацией глубокого понимания внутренних механизмов React и современных практик оптимизации.',
    },
    {
      id: 3,
      question: 'Как вы подходите к тестированию компонентов?',
      answer: 'Я считаю тестирование важной частью разработки. Для React-компонентов обычно использую Jest и React Testing Library. Пишу юнит-тесты для отдельных функций и компонентов, а также интеграционные тесты для проверки взаимодействия между компонентами. Также важно иметь end-to-end тесты с помощью Cypress или Playwright.',
      score: 85,
      analysis: 'Кандидат хорошо представляет основные подходы к тестированию, знает популярные инструменты и методологии.',
    },
    {
      id: 4,
      question: 'Расскажите о ваших сильных и слабых сторонах как разработчика',
      answer: 'Среди сильных сторон я бы отметил глубокое знание JavaScript и современных фреймворков, внимание к деталям и стремление писать чистый, поддерживаемый код. К слабым сторонам могу отнести иногда чрезмерное стремление к перфекционизму, что может влиять на сроки, и периодически возникающие сложности с оценкой времени на задачи.',
      score: 70,
      analysis: 'Кандидат демонстрирует самоанализ и осознанность своих качеств как разработчика. Отмеченные слабые стороны не критичны для позиции.',
    },
    {
      id: 5,
      question: 'Как вы работаете в команде? Опишите ситуацию, когда вам приходилось разрешать конфликты',
      answer: 'Я считаю себя командным игроком. В прошлом проекте возникла ситуация, когда мы с коллегой имели разные мнения о структуре данных для нового функционала. Мы организовали встречу, где каждый представил свои аргументы, совместно проанализировали плюсы и минусы каждого подхода и пришли к оптимальному решению, объединив лучшие идеи из обоих предложений.',
      score: 75,
      analysis: 'Кандидат описывает конструктивный подход к разрешению конфликтов и демонстрирует навыки коммуникации.',
    }
  ],
  strengthsAndWeaknesses: {
    strengths: [
      'Обширные технические знания и опыт работы с React',
      'Глубокое понимание оптимизации производительности',
      'Хорошие навыки решения проблем',
      'Четкая и понятная коммуникация'
    ],
    weaknesses: [
      'Периодически слишком углубляется в технические детали',
      'Может улучшить навыки презентации идей нетехническим специалистам'
    ]
  },
  recommendation: 'Рекомендуется к найму',
  feedback: 'Кандидат демонстрирует высокий уровень технических знаний и опыта. Его навыки и опыт хорошо соответствуют требованиям позиции Frontend-разработчика. Рекомендуется провести дополнительное техническое интервью для проверки практических навыков.',
};

const InterviewResults = ({ interviewId, onBack }) => {
  const theme = useTheme();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  // Имитация загрузки данных с сервера
  useEffect(() => {
    setLoading(true);
    
    // Имитация API-запроса с задержкой
    const timer = setTimeout(() => {
      setResult(mockInterviewResult);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [interviewId]);

  // Обработчик изменения вкладки
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading || !result) {
    return (
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={onBack} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">
            Загрузка результатов интервью...
          </Typography>
        </Box>
        <LinearProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      {/* Хедер */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={onBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">
          Результаты AI-интервью
        </Typography>
      </Box>
      
      {/* Информация о кандидате */}
      <Card sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar 
              src={result.avatar} 
              sx={{ width: 60, height: 60, mr: 2 }}
            />
            <Box>
              <Typography variant="h6">
                {result.candidateName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {result.position}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                <Chip 
                  size="small" 
                  color={result.scores.overall >= 80 ? 'success' : result.scores.overall >= 60 ? 'warning' : 'error'} 
                  label={`Общий балл: ${result.scores.overall}%`}
                />
                <Chip 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                  label={result.recommendation}
                />
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
      
      {/* Вкладки */}
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          <Tab icon={<AssessmentIcon />} label="Оценка" iconPosition="start" />
          <Tab icon={<ListAltIcon />} label="Вопросы и ответы" iconPosition="start" />
          <Tab icon={<VideocamIcon />} label="Видеозапись" iconPosition="start" />
          <Tab icon={<PsychologyIcon />} label="Анализ" iconPosition="start" />
        </Tabs>
      </Box>
      
      {/* Содержимое вкладок */}
      <Box sx={{ mt: 3 }}>
        {/* Вкладка с оценкой */}
        {tabValue === 0 && (
          <>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Ключевые показатели
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Общая оценка */}
              <Grid item xs={12} md={6}>
                <ScoreCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AssessmentIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Общая оценка
                      </Typography>
                    </Box>
                    
                    <Box sx={{ position: 'relative', mb: 2 }}>
                      <ScoreProgress 
                        variant="determinate" 
                        value={result.scores.overall}
                      />
                      <Typography 
                        variant="h3" 
                        sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 'bold' }}
                      >
                        {result.scores.overall}%
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Общая оценка основана на анализе ответов кандидата, его технических навыков, коммуникационных способностей и соответствия требованиям позиции.
                      </Typography>
                      <Chip 
                        label={result.recommendation} 
                        color={
                          result.recommendation === 'Рекомендуется к найму' ? 'success' : 
                          result.recommendation === 'Рассмотреть' ? 'warning' : 'error'
                        }
                      />
                    </Box>
                  </CardContent>
                </ScoreCard>
              </Grid>
              
              {/* Детальные оценки */}
              <Grid item xs={12} md={6}>
                <ScoreCard>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
                      Детальные оценки
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <span>Технические навыки</span>
                        <span>{result.scores.technicalSkills}%</span>
                      </Typography>
                      <ScoreProgress 
                        variant="determinate" 
                        value={result.scores.technicalSkills}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <span>Коммуникация</span>
                        <span>{result.scores.communication}%</span>
                      </Typography>
                      <ScoreProgress 
                        variant="determinate" 
                        value={result.scores.communication}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <span>Решение проблем</span>
                        <span>{result.scores.problemSolving}%</span>
                      </Typography>
                      <ScoreProgress 
                        variant="determinate" 
                        value={result.scores.problemSolving}
                      />
                    </Box>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <span>Работа в команде</span>
                        <span>{result.scores.teamwork}%</span>
                      </Typography>
                      <ScoreProgress 
                        variant="determinate" 
                        value={result.scores.teamwork}
                      />
                    </Box>
                  </CardContent>
                </ScoreCard>
              </Grid>
            </Grid>
            
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Сильные и слабые стороны
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CheckCircleIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Сильные стороны
                      </Typography>
                    </Box>
                    
                    <List dense disablePadding>
                      {result.strengthsAndWeaknesses.strengths.map((strength, index) => (
                        <ListItem key={index} disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText primary={strength} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ borderRadius: 2, height: '100%' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CancelIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Области для улучшения
                      </Typography>
                    </Box>
                    
                    <List dense disablePadding>
                      {result.strengthsAndWeaknesses.weaknesses.map((weakness, index) => (
                        <ListItem key={index} disableGutters>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CancelIcon fontSize="small" color="error" />
                          </ListItemIcon>
                          <ListItemText primary={weakness} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        )}
        
        {/* Вкладка с вопросами и ответами */}
        {tabValue === 1 && (
          <>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Вопросы и ответы кандидата
            </Typography>
            
            {result.questionAnswers.map((qa) => (
              <Card key={qa.id} sx={{ mb: 3, borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: theme.palette.primary.main }}>
                      Вопрос {qa.id}: {qa.question}
                    </Typography>
                    
                    <Typography variant="body2" paragraph sx={{ color: theme.palette.text.secondary, pl: 2, borderLeft: `3px solid ${theme.palette.primary.main}` }}>
                      {qa.answer}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Оценка ответа:
                      </Typography>
                      <Chip 
                        size="small" 
                        label={`${qa.score}%`} 
                        color={qa.score >= 80 ? 'success' : qa.score >= 60 ? 'warning' : 'error'}
                      />
                    </Box>
                    
                    <Button 
                      size="small"
                      startIcon={<VisibilityIcon />}
                      onClick={() => {}}
                    >
                      Подробный анализ
                    </Button>
                  </Box>
                  
                  <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      <strong>Анализ AI:</strong> {qa.analysis}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </>
        )}
        
        {/* Вкладка с видеозаписью */}
        {tabValue === 2 && (
          <>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Видеозапись интервью
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <VideoPanel>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <VideocamIcon sx={{ fontSize: 48, color: theme.palette.text.secondary, mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Нажмите для воспроизведения видеозаписи интервью
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => window.open(result.videoUrl, '_blank')}
                  >
                    Воспроизвести видео
                  </Button>
                </Box>
              </VideoPanel>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Полная запись интервью доступна для просмотра и скачивания. Продолжительность: {result.duration} минут.
            </Typography>
            
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => {}}
            >
              Скачать видео
            </Button>
          </>
        )}
        
        {/* Вкладка с анализом */}
        {tabValue === 3 && (
          <>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Заключение и рекомендации
            </Typography>
            
            <Box sx={{ p: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2, mb: 3 }}>
              <Typography variant="body1" paragraph>
                {result.feedback}
              </Typography>
            </Box>
            
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
              Дальнейшие шаги
            </Typography>
            
            <Card sx={{ borderRadius: 2, mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AutoAwesomeIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    Рекомендуемые действия
                  </Typography>
                </Box>
                
                <List>
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PersonOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Техническое интервью с командой разработки" 
                      secondary="Рекомендуется провести дополнительное собеседование для проверки практических навыков"
                    />
                  </ListItem>
                  
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <AssessmentIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Тестовое задание" 
                      secondary="Можно дать небольшой проект для оценки практических навыков и подхода к работе"
                    />
                  </ListItem>
                </List>
                
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => {}}
                  >
                    Пригласить на следующий этап
                  </Button>
                  
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {}}
                  >
                    Отклонить кандидата
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </>
        )}
      </Box>
      
      {/* Нижняя панель действий */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={onBack}
          startIcon={<ArrowBackIcon />}
        >
          Назад
        </Button>
        
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={() => {}}
        >
          Скачать PDF-отчет
        </Button>
      </Box>
    </Paper>
  );
};

export default InterviewResults;
