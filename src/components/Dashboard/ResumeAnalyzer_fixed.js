import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { 
  Box, Paper, Typography, Stepper, Step, StepLabel, StepConnector,
  Button, TextField, CircularProgress, 
  Card, CardContent, Alert, Divider,
  InputLabel, Input, FormControl, 
  Stack, Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, Checkbox, IconButton
} from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DescriptionIcon from '@mui/icons-material/Description';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import InfoIcon from '@mui/icons-material/Info';
import CodeIcon from '@mui/icons-material/Code';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SchoolIcon from '@mui/icons-material/School';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HomeIcon from '@mui/icons-material/Home';
import ResumeAnalysisResults from './ResumeAnalysisResults';
import * as resumeService from '../../services/resumeService';

// Компонент кнопки возврата на главное меню
const HomeButton = ({ compact = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const handleReturnToHome = () => {
    navigate('/dashboard');
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: compact ? 0 : 2 }}>
      <IconButton 
        onClick={handleReturnToHome}
        aria-label="Вернуться на главную"
        size={compact ? "small" : "medium"}
        sx={{ 
          color: theme.palette.primary.main,
          ...(compact ? {} : {
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            mr: 1,
          }),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          }
        }}
      >
        <HomeIcon fontSize={compact ? "small" : "medium"} />
      </IconButton>
      {!compact && (
        <Typography variant="body2" color="text.secondary">
          Вернуться на главную
        </Typography>
      )}
    </Box>
  );
};

// Стилизованные компоненты
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const ResumeUploadBox = styled(Box)(({ theme }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: alpha(theme.palette.background.default, 0.7),
  transition: 'all 0.2s',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.05),
    borderColor: theme.palette.primary.main,
  },
}));

const MinimalButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  textTransform: 'none',
  fontWeight: 500,
}));

// Стилизованный StepConnector для Stepper
const StyledStepConnector = styled(StepConnector)(({ theme }) => ({
  '& .MuiStepConnector-line': {
    height: 3,
    borderRadius: 1.5,
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
    border: 0,
  },
}));

// Кастомная иконка для шага
const CustomStepIcon = ({ active, completed, icon, ...other }) => {
  const theme = useTheme();
  const iconComponents = {
    1: <CloudUploadIcon />,
    2: <DescriptionIcon />,
    3: <PsychologyIcon />,
    4: <CheckCircleIcon />
  };

  return (
    <Box
      sx={{
        width: 50, 
        height: 50,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: active 
          ? theme.palette.primary.main 
          : completed 
            ? theme.palette.success.main 
            : alpha(theme.palette.primary.main, 0.1),
        color: active || completed ? theme.palette.common.white : theme.palette.text.secondary,
        boxShadow: active 
          ? `0 0 0 4px ${alpha(theme.palette.primary.main, 0.2)}` 
          : 'none',
        transition: 'all 0.3s ease',
        transform: active ? 'scale(1.2)' : 'scale(1)',
      }}
      {...other}
    >
      {iconComponents[icon]}
    </Box>
  );
};

// Основные шаги анализа резюме
const steps = [
  {
    label: 'Загрузка резюме',
    description: 'Загрузите файл или введите текст',
    icon: 1
  },
  {
    label: 'Описание вакансии',
    description: 'Введите требования к кандидату',
    icon: 2
  },
  {
    label: 'Анализ',
    description: 'Сравнение данных',
    icon: 3
  },
  {
    label: 'Результаты',
    description: 'Оценка соответствия',
    icon: 4
  }
];

// Компонент для анализа резюме
const ResumeAnalyzer = ({ minimal, maxWidth = 'md' }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobDescriptionFile, setJobDescriptionFile] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Состояния для работы с навыками
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [prioritySkills, setPrioritySkills] = useState([]);
  const [showSkillsSelector, setShowSkillsSelector] = useState(false);

  // Функция возврата на главное меню
  const handleReturnToHome = () => {
    navigate('/dashboard');
  };

  // Обработчики событий
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };
  
  const handleJobDescriptionChange = (event) => {
    const value = event.target.value;
    setJobDescriptionFile(value);
    
    // Запускаем извлечение навыков при изменении описания вакансии
    if (value.trim().length > 30) {
      extractSkillsFromDescription(value);
    } else {
      setExtractedSkills([]);
    }
  };
  
  // Функция для извлечения навыков из описания вакансии
  const extractSkillsFromDescription = (description) => {
    // Базовые списки навыков (в реальном приложении должны быть более обширными)
    const technicalSkills = [
      "JavaScript", "React", "Python", "Java", "C++", "Node.js", "Docker", 
      "Kubernetes", "AWS", "Azure", "SQL", "MongoDB", "Git", "CI/CD",
      "HTML", "CSS", "TypeScript", "Redux", "REST API", "GraphQL",
      "Agile", "Scrum", "Kanban", "Правовые знания", "ТК РФ", "Кадровое делопроизводство"
    ];
    
    const softSkills = [
      "Коммуникабельность", "Работа в команде", "Лидерство", "Аналитическое мышление",
      "Управление временем", "Решение проблем", "Креативность", "Адаптивность",
      "Критическое мышление", "Эмоциональный интеллект", "Управление стрессом",
      "Принятие решений", "Управление конфликтами", "Нетворкинг"
    ];
    
    const extractedSkillsList = [];
    let skillId = 1;
    
    // Функция для экранирования спец. символов в регулярных выражениях
    const escapeRegExp = (string) => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    // Проверяем технические навыки
    technicalSkills.forEach(skill => {
      const escapedSkill = escapeRegExp(skill);
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
      if (regex.test(description)) {
        extractedSkillsList.push({
          id: skillId++,
          name: skill,
          category: 'hard_skill',
          selected: false,
        });
      }
    });
    
    // Проверяем мягкие навыки
    softSkills.forEach(skill => {
      const escapedSkill = escapeRegExp(skill);
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
      if (regex.test(description)) {
        extractedSkillsList.push({
          id: skillId++,
          name: skill,
          category: 'soft_skill',
          selected: false,
        });
      }
    });
    
    setExtractedSkills(extractedSkillsList);
  };
  
  // Функция для переключения выбора навыка
  const handleSkillToggle = (skillId) => {
    const updatedSkills = extractedSkills.map(skill => {
      if (skill.id === skillId) {
        const newSelectedState = !skill.selected;
        return { ...skill, selected: newSelectedState };
      }
      return skill;
    });
    
    setExtractedSkills(updatedSkills);
    
    // Обновляем список приоритетных навыков
    const selectedSkills = updatedSkills
      .filter(skill => skill.selected)
      .map(skill => skill.name);
    
    setPrioritySkills(selectedSkills);
  };
  
  // Показать/скрыть окно выбора навыков
  const toggleSkillsSelector = () => {
    setShowSkillsSelector(!showSkillsSelector);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    setResumeFile(null);
    setResumeText('');
    setJobDescription('');
    setResults(null);
    setPrioritySkills([]);
    setExtractedSkills([]);
  };

  const handleAnalyze = async () => {
    if (!resumeFile && !resumeText) {
      setError('Пожалуйста, загрузите резюме или введите текст резюме.');
      return;
    }
    
    // Если описание вакансии не указано, используем стандартное
    if (!jobDescription) {
      const defaultJobDescription = 'Вакансия HR-специалиста. Требуется опыт подбора персонала, кадрового делопроизводства и знание ТК РФ.';
      console.log('Использование стандартного описания вакансии для анализа');
      setJobDescription(defaultJobDescription);
      setJobDescriptionFile(defaultJobDescription);
    }
    
    setIsAnalyzing(true);
    setError(null);
    
    try {
      // Реальный вызов backend через resumeService
      const results = await resumeService.analyzeResume({
        resumeFile,
        resumeText,
        jobDescription: jobDescriptionFile,
        prioritySkills,
      });
      setResults(results);
      setActiveStep(3); // Переходим к результатам
    } catch (err) {
      console.error('Ошибка при анализе резюме:', err);
      setError(err.message || 'Произошла ошибка при анализе резюме. Пожалуйста, попробуйте позже.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Компактный режим для дашборда
  if (minimal) {
    return (
      <StatsCard elevation={0} sx={{ height: '100%' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <DescriptionIcon sx={{ mr: 1, color: 'primary.main' }} /> Анализ резюме
            </Typography>
            <HomeButton compact={true} />
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {activeStep === 0 && (
            <>
              <ResumeUploadBox
                onClick={() => document.getElementById('resume-file-input-minimal').click()}
              >
                <input
                  accept=".pdf,.doc,.docx,.txt"
                  id="resume-file-input-minimal"
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
                <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="body1" gutterBottom>
                  Перетащите или {' '}
                  <Typography 
                    component="span" 
                    variant="body1" 
                    color="primary"
                  >
                    загрузите
                  </Typography>{' '}
                  резюме
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Поддерживаемые форматы: PDF, DOC, DOCX, TXT
                </Typography>
              </ResumeUploadBox>
              
              {resumeFile && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Файл загружен: {resumeFile.name}
                </Alert>
              )}
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Описание вакансии:
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder="Введите описание вакансии с требуемыми навыками..."
                  value={jobDescriptionFile}
                  onChange={handleJobDescriptionChange}
                  sx={{ mb: 2 }}
                />
                <MinimalButton
                  variant="contained"
                  color="primary"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !resumeFile || !jobDescriptionFile}
                  fullWidth
                >
                  {isAnalyzing ? (
                    <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                  ) : (
                    <AssessmentIcon sx={{ mr: 1 }} />
                  )}
                  Анализировать резюме
                </MinimalButton>
              </Box>
            </>
          )}
          
          {activeStep === 3 && results && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Общее соответствие: {results.overall_match.score}%
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 2 }}>
                {results.overall_match.summary}
              </Typography>
              <MinimalButton
                variant="outlined"
                color="primary"
                fullWidth
                onClick={() => setActiveStep(0)}
              >
                Новый анализ
              </MinimalButton>
            </Box>
          )}
        </CardContent>
      </StatsCard>
    );
  }

  // Полноразмерный режим
  return (
    <Box sx={{ width: '100%', maxWidth: maxWidth, mx: 'auto', my: 4 }}>
      <StyledPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Анализ резюме
          </Typography>
          <MinimalButton
            variant="outlined"
            color="primary"
            onClick={handleReturnToHome}
            startIcon={<HomeIcon />}
          >
            На главную
          </MinimalButton>
        </Box>

        <Stepper 
          activeStep={activeStep} 
          alternativeLabel 
          connector={<StyledStepConnector />}
          sx={{ mb: 4 }}
        >
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={(props) => (
                  <CustomStepIcon {...props} icon={step.icon} />
                )}
                sx={{
                  '& .MuiStepLabel-labelContainer': {
                    marginTop: 1.5
                  }
                }}
              >
                <Typography 
                  variant="subtitle2" 
                  fontWeight={activeStep === index ? 600 : 400} 
                  color={activeStep === index ? '#2672e3' : 'text.primary'}
                  sx={{ 
                    transition: 'all 0.3s ease',
                  }}
                >
                  {step.label}
                </Typography>
                {step.description && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ 
                      display: 'block', 
                      mt: 0.5,
                      opacity: 0.8
                    }}
                  >
                    {step.description}
                  </Typography>
                )}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {/* Кнопка возврата на главное меню */}
        <HomeButton />
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Шаг 1: Загрузка резюме */}
        {activeStep === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Загрузите резюме кандидата
            </Typography>
            
            <ResumeUploadBox
              onClick={() => document.getElementById('resume-file-input').click()}
            >
              <input
                accept=".pdf,.doc,.docx,.txt"
                id="resume-file-input"
                type="file"
                hidden
                onChange={handleFileChange}
              />
              <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="body1" gutterBottom>
                Перетащите или {' '}
                <Typography component="span" color="primary" sx={{ fontWeight: 'bold' }}>
                  выберите файл
                </Typography>
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Поддерживаемые форматы: PDF, DOC, DOCX, TXT
              </Typography>
            </ResumeUploadBox>
            
            {resumeFile && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Файл успешно загружен: {resumeFile.name}
              </Alert>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Или введите текст резюме
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={6}
              variant="outlined"
              placeholder="Вставьте содержимое резюме здесь..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <MinimalButton
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={!resumeFile && !resumeText}
              >
                Далее
              </MinimalButton>
            </Box>
          </Box>
        )}
        
        {/* Шаг 2: Описание вакансии */}
        {activeStep === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Введите описание вакансии
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={8}
              variant="outlined"
              placeholder="Введите описание вакансии с требованиями к кандидату и необходимыми навыками..."
              value={jobDescriptionFile}
              onChange={handleJobDescriptionChange}
              sx={{ mb: 3 }}
            />
            
            {extractedSkills.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Обнаруженные навыки:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {extractedSkills.map((skill) => (
                    <Chip
                      key={skill.id}
                      label={skill.name}
                      color={skill.category === 'hard_skill' ? 'primary' : 'secondary'}
                      variant={skill.selected ? 'filled' : 'outlined'}
                      onClick={() => handleSkillToggle(skill.id)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Box>
              </Box>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <MinimalButton
                variant="outlined"
                color="primary"
                onClick={handleBack}
              >
                Назад
              </MinimalButton>
              <MinimalButton
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={jobDescriptionFile.trim().length < 30}
              >
                Далее
              </MinimalButton>
            </Box>
          </Box>
        )}
        
        {/* Шаг 3: Анализ */}
        {activeStep === 2 && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <AssessmentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="body1" gutterBottom>
              Готовы к анализу резюме
            </Typography>
            
            <Box sx={{ backgroundColor: alpha(theme.palette.background.default, 0.7), p: 3, borderRadius: 2, mb: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Сводка:
              </Typography>
              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Резюме:</strong> {resumeFile ? resumeFile.name : 'Введен текст'}
                </Typography>
                <Typography variant="body2">
                  <strong>Описание вакансии:</strong> {jobDescriptionFile.substring(0, 50)}...
                </Typography>
                <Typography variant="body2">
                  <strong>Приоритетные навыки:</strong> {prioritySkills.length > 0 ? prioritySkills.join(', ') : 'Не выбраны'}
                </Typography>
              </Stack>
              
              <Button onClick={toggleSkillsSelector} sx={{ mt: 2 }} startIcon={<CompareArrowsIcon />}>
                <Typography variant="body2">
                  (необязательно) Выберите навыки, которые наиболее важны для вакансии
                </Typography>
              </Button>
            </Box>
            
            {isAnalyzing && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Анализируем резюме...
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <CircularProgress size={60} thickness={4} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Анализируем резюме и сравниваем с требованиями вакансии...
                </Typography>
              </Box>
            )}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <MinimalButton
                variant="outlined"
                color="primary"
                onClick={handleBack}
                disabled={isAnalyzing}
              >
                Назад
              </MinimalButton>
              <MinimalButton
                variant="contained"
                color="primary"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                Анализировать
              </MinimalButton>
            </Box>
          </Box>
        )}
        
        {/* Шаг 4: Результаты анализа */}
        {activeStep === 3 && results && (
          <ResumeAnalysisResults 
            results={results} 
            onReset={handleReset}
            prioritySkills={prioritySkills}
          />
        )}
      </StyledPaper>
      
      {/* Диалоговое окно для выбора приоритетных навыков */}
      <Dialog 
        open={showSkillsSelector} 
        onClose={toggleSkillsSelector}
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 24,
            p: 1,
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          Выберите приоритетные навыки для вакансии
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Отметьте навыки, которые являются ключевыми и наиболее важными для данной вакансии. Это поможет системе точнее оценить соответствие кандидата требованиям.  
          </Typography>
          
          {extractedSkills.length > 0 ? (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {extractedSkills.map((skill) => (
                <Grid item xs={12} sm={6} md={4} key={skill.id}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: skill.selected 
                        ? alpha(theme.palette.primary.main, 0.1) 
                        : alpha(theme.palette.background.default, 0.5),
                      border: skill.selected 
                        ? `1px solid ${theme.palette.primary.main}` 
                        : `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        cursor: 'pointer',
                      }
                    }}
                    onClick={() => handleSkillToggle(skill.id)}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Checkbox 
                        checked={skill.selected} 
                        onChange={() => handleSkillToggle(skill.id)}
                        color="primary"
                      />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                          {skill.name}
                        </Typography>
                        <Chip 
                          label={skill.category === 'hard_skill' ? 'Технический' : 'Мягкий'} 
                          size="small"
                          color={skill.category === 'hard_skill' ? 'primary' : 'secondary'}
                          variant="outlined"
                          sx={{ mt: 1, fontSize: '0.7rem' }}
                        />
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              Навыки не обнаружены. Попробуйте добавить более подробное описание вакансии с указанием конкретных требований и технологий.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Box>
            {prioritySkills.length > 0 && (
              <Typography variant="caption" color="primary">
                Выбрано навыков: {prioritySkills.length}
              </Typography>
            )}
          </Box>
          <Box>
            <MinimalButton onClick={toggleSkillsSelector} color="inherit" sx={{ mr: 1 }}>
              Отмена
            </MinimalButton>
            <MinimalButton onClick={toggleSkillsSelector} variant="contained" color="primary">
              Применить
            </MinimalButton>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ResumeAnalyzer;
