import React, { useState } from 'react';
import EnhancedSkillCard from './EnhancedSkillCard';
import EnhancedExperienceCard from './EnhancedExperienceCard';
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  alpha,
  useTheme
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import SchoolIcon from '@mui/icons-material/School';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CodeIcon from '@mui/icons-material/Code';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import DownloadIcon from '@mui/icons-material/Download';
import DescriptionIcon from '@mui/icons-material/Description';
import { styled } from '@mui/material/styles';

// Стилизованные компоненты
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(5px)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.1)}`,
  overflow: 'hidden',
  position: 'relative',
  marginBottom: theme.spacing(3),
}));

// Стилизованная кнопка с минимальным дизайном
const MinimalButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  textTransform: 'none',
  fontWeight: 500,
}));

const PercentageCircle = styled(Box)(({ theme, percentage }) => {
  // Определяем цвет в зависимости от процента
  let color = theme.palette.error.main; // < 50%
  if (percentage >= 70) {
    color = theme.palette.success.main;
  } else if (percentage >= 50) {
    color = theme.palette.warning.main;
  }
  
  return {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `conic-gradient(${color} ${percentage}%, transparent ${percentage}%)`,
    '&:after': {
      content: '""',
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: '50%',
      background: theme.palette.background.paper,
    },
    '& .content': {
      position: 'relative',
      zIndex: 1,
      fontSize: '1.75rem',
      fontWeight: 700,
      color: color,
    },
  };
});

const getMatchColor = (match) => {
  if (match >= 70) return 'success';
  if (match >= 50) return 'warning';
  return 'error';
};

const ResumeAnalysisResults = ({ results, onReset, onBack, navigateToDashboard }) => {
  const theme = useTheme();
  
  const [loading, setLoading] = useState({
    report: false
  });
  
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  if (!results) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Нет данных для отображения
        </Typography>
      </Box>
    );
  }
  
  // Функция для экспорта единого отчета
  const handleExportReport = async () => {
    try {
      setLoading(prev => ({ ...prev, report: true }));
      
      // Используем демо-режим
      setTimeout(() => {
        const { overall_match, skills_analysis, experience, education } = results;
        
        // Форматируем дату и время для отчета
        const formattedDate = new Date().toLocaleDateString('ru-RU');
        const formattedTime = new Date().toLocaleTimeString('ru-RU');
        
        // Создаем универсальное содержимое отчета
        let reportContent = "";
        
        // Заголовок отчета
        reportContent += "=============================================================\n";
        reportContent += "                ОТЧЕТ ПО АНАЛИЗУ РЕЗЮМЕ                      \n";
        reportContent += "=============================================================\n\n";
        reportContent += `Дата формирования: ${formattedDate} ${formattedTime}\n\n`;
        
        // Основная информация
        reportContent += "ОБЩЕЕ СООТВЕТСТВИЕ\n";
        reportContent += "-------------------------------------------------------------\n";
        reportContent += `Соответствие требованиям вакансии: ${overall_match.score}%\n`;
        reportContent += `Заключение: ${overall_match.summary}\n\n`;
        
        reportContent += "СИЛЬНЫЕ СТОРОНЫ:\n";
        overall_match.strengths.forEach((strength, index) => {
          reportContent += `${index + 1}. ${strength}\n`;
        });
        
        reportContent += "\nОБЛАСТИ ДЛЯ РАЗВИТИЯ:\n";
        overall_match.weaknesses.forEach((weakness, index) => {
          reportContent += `${index + 1}. ${weakness}\n`;
        });
        
        // Навыки
        reportContent += "\n\nНАВЫКИ\n";
        reportContent += "-------------------------------------------------------------\n";
        if (skills_analysis && skills_analysis.length > 0) {
          skills_analysis.forEach((skill, index) => {
            reportContent += `${index + 1}. ${skill.skill} - ${skill.match}%\n`;
            reportContent += `   Категория: ${skill.category === 'hard_skill' ? 'Технический' : 'Мягкий'}\n`;
            reportContent += `   Релевантность: ${skill.relevance}\n`;
            reportContent += `   Комментарий: ${skill.comment || 'Нет комментария'}\n\n`;
          });
        } else {
          reportContent += "Информация о навыках отсутствует\n\n";
        }
        
        // Опыт работы
        reportContent += "\nОПЫТ РАБОТЫ\n";
        reportContent += "-------------------------------------------------------------\n";
        if (experience) {
          if (experience.summary) {
            reportContent += `Общая оценка: ${experience.match}%\n`;
            reportContent += `${experience.summary}\n\n`;
          }
          
          if (experience.details && experience.details.length > 0) {
            experience.details.forEach((exp, index) => {
              reportContent += `${index + 1}. ${exp.position}, ${exp.company}\n`;
              reportContent += `   Период: ${exp.period}\n`;
              reportContent += `   Релевантность: ${exp.relevance}%\n`;
              reportContent += `   Комментарий: ${exp.comment || "Нет комментария"}\n`;
              
              if (exp.highlights && exp.highlights.length > 0) {
                reportContent += "   Ключевые достижения:\n";
                exp.highlights.forEach((highlight, idx) => {
                  reportContent += `     - ${highlight}\n`;
                });
              }
              reportContent += "\n";
            });
          }
        } else {
          reportContent += "Информация об опыте работы отсутствует\n\n";
        }
        
        // Образование
        reportContent += "\nОБРАЗОВАНИЕ\n";
        reportContent += "-------------------------------------------------------------\n";
        if (education) {
          if (education.summary) {
            reportContent += `Общая оценка: ${education.match}%\n`;
            reportContent += `${education.summary}\n\n`;
          }
          
          if (education.details && education.details.length > 0) {
            education.details.forEach((edu, index) => {
              reportContent += `${index + 1}. ${edu.degree}\n`;
              reportContent += `   Учебное заведение: ${edu.institution}\n`;
              reportContent += `   Год окончания: ${edu.year}, Релевантность: ${edu.relevance}%\n\n`;
            });
          }
        } else {
          reportContent += "Информация об образовании отсутствует\n\n";
        }
        
        // Вопросы для интервью
        if (results.interview_questions && results.interview_questions.length > 0) {
          reportContent += "\nРЕКОМЕНДУЕМЫЕ ВОПРОСЫ ДЛЯ ИНТЕРВЬЮ\n";
          reportContent += "-------------------------------------------------------------\n";
          
          results.interview_questions.forEach((q, index) => {
            const relatedTo = q.related_to === 'hard_skill' ? 'Проверка навыка' : 'Поведенческий вопрос';
            reportContent += `${index + 1}. ${q.question}\n`;
            reportContent += `   Цель: ${q.purpose}\n`;
            reportContent += `   Тип вопроса: ${relatedTo}\n\n`;
          });
        }
        
        // Создаем объект Blob и ссылку для скачивания
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Анализ_резюме_${formattedDate.replace(/\./g, '-')}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        setNotification({
          open: true,
          message: 'Отчет успешно сформирован и скачан',
          severity: 'success'
        });
        
        setLoading(prev => ({ ...prev, report: false }));
      }, 1000);
    } catch (error) {
      console.error('Ошибка при формировании отчета:', error);
      setNotification({
        open: true,
        message: 'Произошла ошибка при формировании отчета',
        severity: 'error'
      });
      setLoading(prev => ({ ...prev, report: false }));
    }
  };
  
  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };
  
  return (
    <Box>
      {/* Логотип в левой части для возврата на главное меню */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3, 
          cursor: 'pointer',
          width: 'fit-content'
        }}
        onClick={navigateToDashboard}
      >
        <Box
          component="img"
          src="/favicon/favicon.svg?v=20250516"
          alt="Raplle Logo"
          sx={{ width: 32, height: 32, mr: 1 }}
        />
        <Typography variant="h6" fontWeight="500" sx={{ letterSpacing: '-0.5px' }}>
          Raplle
        </Typography>
      </Box>
      {/* Шапка с общей оценкой */}
      <StyledPaper elevation={0} sx={{ mb: 4, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ 
          position: 'absolute', 
          right: -50, 
          top: -50, 
          width: 200, 
          height: 200, 
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: '50%'
        }} />
        
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          Результаты анализа резюме
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3, mt: 3 }}>
          <PercentageCircle percentage={results.overall_match.score}>
            <Typography className="content">{results.overall_match.score}%</Typography>
          </PercentageCircle>
          
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
              Общее соответствие
            </Typography>
            <Typography variant="body1">
              {results.overall_match.summary}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
              <CheckCircleIcon sx={{ mr: 1, color: 'success.main' }} /> Сильные стороны
            </Typography>
            <List dense>
              {results.overall_match.strengths.map((strength, index) => (
                <ListItem key={index} sx={{ pl: 2 }}>
                  <ListItemText primary={strength} />
                </ListItem>
              ))}
            </List>
          </Box>
          
          <Box sx={{ flex: 1, minWidth: 250 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
              <ErrorIcon sx={{ mr: 1, color: 'warning.main' }} /> Области для развития
            </Typography>
            <List dense>
              {results.overall_match.weaknesses.map((weakness, index) => (
                <ListItem key={index} sx={{ pl: 2 }}>
                  <ListItemText primary={weakness} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </StyledPaper>
      
      {/* Секция анализа навыков - улучшенная визуализация */}
      <StyledPaper elevation={0}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <CodeIcon sx={{ mr: 1, color: 'primary.main' }} />
          Навыки и компетенции
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Grid container spacing={2}>
          {results.skills_analysis && results.skills_analysis.map((skill, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <EnhancedSkillCard skill={skill} theme={theme} />
            </Grid>
          ))}
        </Grid>
      </StyledPaper>
      
      {/* Секция анализа опыта работы */}
      {results.experience && (
        <StyledPaper elevation={0}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <BusinessCenterIcon sx={{ mr: 1, color: 'primary.main' }} />
            Опыт работы
            {results.experience.match !== undefined && (
              <Chip 
                label={`${results.experience.match}%`} 
                size="small"
                color={getMatchColor(results.experience.match)}
                sx={{ ml: 2, fontWeight: 'bold' }}
              />
            )}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {results.experience.summary && (
            <Typography variant="body1" paragraph>
              {results.experience.summary}
            </Typography>
          )}
          
          <Grid container spacing={2}>
            {results.experience.details && results.experience.details.map((exp, index) => (
              <Grid item xs={12} key={index}>
                <EnhancedExperienceCard experience={exp} theme={theme} />
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      )}
      
      {/* Секция анализа образования */}
      {results.education && (
        <StyledPaper elevation={0}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <SchoolIcon sx={{ mr: 1, color: 'primary.main' }} />
            Образование
            {results.education.match !== undefined && (
              <Chip 
                label={`${results.education.match}%`} 
                size="small"
                color={getMatchColor(results.education.match)}
                sx={{ ml: 2, fontWeight: 'bold' }}
              />
            )}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          {results.education.summary && (
            <Typography variant="body1" paragraph>
              {results.education.summary}
            </Typography>
          )}
          
          <Grid container spacing={2}>
            {results.education.details && results.education.details.map((edu, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {edu.degree}
                    </Typography>
                    <Chip 
                      label={`${edu.relevance}%`} 
                      size="small" 
                      color={getMatchColor(edu.relevance)}
                    />
                  </Box>
                  
                  <Typography variant="body2" gutterBottom>
                    {edu.institution}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    Год окончания: {edu.year}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      )}
      
      {/* Секция рекомендуемых вопросов для интервью */}
      {results.interview_questions && results.interview_questions.length > 0 && (
        <StyledPaper elevation={0}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <EmojiEventsIcon sx={{ mr: 1, color: 'primary.main' }} />
            Рекомендуемые вопросы для интервью
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            {results.interview_questions.map((question, index) => (
              <ListItem key={index} sx={{ 
                backgroundColor: alpha(theme.palette.background.default, 0.5),
                borderRadius: theme.shape.borderRadius,
                mb: 1,
                display: 'block'
              }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                  {question.question}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Цель: {question.purpose}
                  </Typography>
                  <Chip 
                    label={question.related_to === 'hard_skill' ? 'Технический навык' : 'Опыт работы'} 
                    size="small"
                    variant="outlined"
                  />
                </Box>
              </ListItem>
            ))}
          </List>
        </StyledPaper>
      )}
      
      {/* Секция экспорта отчета */}
      <StyledPaper elevation={0} sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <DownloadIcon sx={{ mr: 1, color: 'primary.main' }} />
          Экспорт отчета
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="body2" paragraph>
          Сохраните результаты анализа резюме в виде подробного отчета:
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          p: 3, 
          backgroundColor: alpha(theme.palette.background.default, 0.5),
          borderRadius: 2 
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 2 
          }}>
            <DescriptionIcon sx={{ fontSize: 48, color: 'primary.main' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
              Текстовый отчет
            </Typography>
            <Typography variant="body2" sx={{ textAlign: 'center', mb: 1 }}>
              Опыт работы в аналогичной должности более 3 лет
Наличие релевантных технических навыков
Высшее образование в смежной области
Рекомендуемые вопросы для интервью.
            </Typography>
            <MinimalButton
              variant="contained"
              color="primary"
              onClick={handleExportReport}
              disabled={loading.report}
              startIcon={loading.report ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
            >
              {loading.report ? 'Генерация...' : 'Скачать отчет'}
            </MinimalButton>
          </Box>
        </Box>
      </StyledPaper>
      
      {/* Кнопки управления */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <MinimalButton
          variant="outlined"
          color="primary"
          onClick={onBack}
        >
          Назад
        </MinimalButton>
        <MinimalButton
          variant="contained"
          color="primary"
          onClick={onReset}
        >
          Начать заново
        </MinimalButton>
      </Box>
      
      {/* Уведомления */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResumeAnalysisResults;
