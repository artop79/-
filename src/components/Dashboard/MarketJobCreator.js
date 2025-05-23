import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Switch,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
  alpha
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import SearchIcon from '@mui/icons-material/Search';
import CompareIcon from '@mui/icons-material/Compare';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const MarketJobCreator = ({ 
  open, 
  onClose, 
  onSave,
  theme
}) => {
  const [marketAIFormData, setMarketAIFormData] = useState({
    title: '',
    department: '',
    location: '',
    competitors: '',
    minSalary: '',
    maxSalary: ''
  });
  const [useMarketAnalysis, setUseMarketAnalysis] = useState(true);
  const [marketAnalysisStep, setMarketAnalysisStep] = useState(0);
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(false);
  const [marketDataResults, setMarketDataResults] = useState(null);
  const [marketAnalysisError, setMarketAnalysisError] = useState(null);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMarketAIFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Функция для анализа рыночных данных и генерации вакансии
  const analyzeMarketData = async () => {
    try {
      setIsLoadingMarketData(true);
      setMarketAnalysisError(null);
      
      // Имитация запроса к API для получения рыночных данных
      // В реальном приложении здесь был бы запрос к API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Мок-данные для демонстрации
      const mockMarketData = {
        salary: {
          average: Number(marketAIFormData.minSalary) + Math.floor(Math.random() * 30000),
          median: Number(marketAIFormData.minSalary) + Math.floor(Math.random() * 20000),
          range: {
            min: Number(marketAIFormData.minSalary),
            max: Number(marketAIFormData.maxSalary)
          }
        },
        skills: [
          "React", "JavaScript", "TypeScript", "REST API", "Git", "Redux", 
          "Material-UI", "HTML/CSS", "Node.js", "Agile", "Jest"
        ],
        competitorData: marketAIFormData.competitors.split(',').map(competitor => ({
          name: competitor.trim(),
          avgSalary: Number(marketAIFormData.minSalary) + Math.floor(Math.random() * 40000),
          requiredSkills: ["React", "JavaScript", "TypeScript"].sort(() => 0.5 - Math.random()).slice(0, 2)
        })),
        generatedJobDescription: `Компания ищет опытного специалиста на должность ${marketAIFormData.title} в отдел ${marketAIFormData.department || 'разработки'}. Мы предлагаем конкурентоспособную заработную плату ${marketAIFormData.minSalary} и возможности для профессионального роста в динамичной компании. Идеальный кандидат должен иметь опыт работы от от 3 лет в аналогичной должности, обладать отличными навыками коммуникации и работы в команде. Работа предполагает **Требования:** - Опыт работы в кадровом делопроизводстве от 1 года. - Знание трудового законодательства, основ документооборота. - Уверенное владение MS Office (Word, Excel), 1С:ЗУП или другими кадровыми системами. - Внимательность, ответственность, коммуникабельность. - Желательно высшее образование.`,
        generatedRequirements: [
          "Опыт работы в аналогичной должности от от 3 лет",
          "Глубокие знания в области закупки",
          "Отличные коммуникативные навыки и умение работать в команде",
          "Высокая обучаемость и стремление к развитию",
          "Внимание к деталям и аналитическое мышление"
        ]
      };
      
      setMarketDataResults(mockMarketData);
      setMarketAnalysisStep(1); // Переход к следующему шагу
    } catch (error) {
      console.error('Ошибка при анализе рыночных данных:', error);
      setMarketAnalysisError('Произошла ошибка при анализе рыночных данных. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoadingMarketData(false);
    }
  };
  
  const handleSaveJob = () => {
    // Создать объект новой вакансии на основе анализа рынка
    const newJob = {
      id: Math.random().toString(36).substr(2, 9),
      title: marketAIFormData.title,
      department: marketAIFormData.department,
      location: marketAIFormData.location,
      created: new Date().toISOString(),
      status: 'active',
      salary: `${marketDataResults.salary.range.min} - ${marketDataResults.salary.range.max}`,
      description: marketDataResults.generatedJobDescription.replace(/\*\*Требования:\*\* -/g, ''),
      requirements: marketDataResults.generatedRequirements.join('\n- '),
      requiredSkills: marketDataResults.skills.slice(0, 5),
      candidates: 0,
      isNew: true
    };
    
    onSave(newJob);
    handleClose();
  };
  
  const handleReset = () => {
    setMarketAIFormData({
      title: '',
      department: '',
      location: '',
      competitors: '',
      minSalary: '',
      maxSalary: ''
    });
    setMarketAnalysisStep(0);
    setMarketDataResults(null);
    setMarketAnalysisError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          bgcolor: '#1A1E2D',
          color: '#fff',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden'
        }
      }}
      componentsProps={{
        backdrop: {
          sx: {
            backgroundColor: alpha('#000', 0.8)
          }
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid rgba(255,255,255,0.08)', 
        background: 'linear-gradient(145deg, rgba(21, 41, 66, 0.7) 0%, rgba(30, 39, 51, 0.6) 100%)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(35, 45, 65, 0.5)',
              marginRight: 2,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
            }}>
              <AnalyticsIcon sx={{ fontSize: 24, color: '#096CEC' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 500, fontSize: '1.125rem' }}>
              Анализ рынка труда
            </Typography>
          </Box>
          <Chip 
            label="AI-powered" 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(55, 95, 145, 0.15)', 
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.7rem',
              height: 24 
            }} 
          />
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ my: 3, px: 2 }}>
          <Stepper 
            activeStep={marketAnalysisStep} 
            sx={{ 
              '& .MuiStepLabel-label': { color: 'rgba(255,255,255,0.7)' },
              '& .MuiStepLabel-label.Mui-active': { color: '#fff', fontWeight: 500 },
              '& .MuiStepLabel-label.Mui-completed': { color: '#00C49A' },
              '& .MuiStepIcon-root': { color: 'rgba(255,255,255,0.2)' },
              '& .MuiStepIcon-root.Mui-active': { color: '#096CEC' },
              '& .MuiStepIcon-root.Mui-completed': { color: '#00C49A' },
              '& .MuiStepConnector-line': { borderColor: 'rgba(255,255,255,0.08)' }
            }}
          >
            <Step>
              <StepLabel>Ввод данных</StepLabel>
            </Step>
            <Step>
              <StepLabel>Анализ рынка</StepLabel>
            </Step>
            <Step>
              <StepLabel>Готовая вакансия</StepLabel>
            </Step>
          </Stepper>
        </Box>
        
        {marketAnalysisStep === 0 && (
          <Box sx={{ px: 2 }}>
            <Typography variant="h6" sx={{ mb: 4, fontWeight: 500, color: '#fff', display: 'flex', alignItems: 'center' }}>
              <SearchIcon sx={{ mr: 1.5, color: '#096CEC' }} />
              Введите основные параметры для анализа рынка
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Должность"
                  name="title"
                  value={marketAIFormData.title}
                  onChange={handleInputChange}
                  variant="outlined"
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Отдел"
                  name="department"
                  value={marketAIFormData.department}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Локация"
                  name="location"
                  value={marketAIFormData.location}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Минимальная зарплата (руб.)"
                  name="minSalary"
                  type="number"
                  value={marketAIFormData.minSalary}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Максимальная зарплата (руб.)"
                  name="maxSalary"
                  type="number"
                  value={marketAIFormData.maxSalary}
                  onChange={handleInputChange}
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Конкуренты (через запятую)"
                  name="competitors"
                  value={marketAIFormData.competitors}
                  onChange={handleInputChange}
                  variant="outlined"
                  helperText="Например: Yandex, Sber, VK"
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={useMarketAnalysis} 
                      onChange={(e) => setUseMarketAnalysis(e.target.checked)} 
                    />
                  }
                  label="Использовать данные рынка труда для оптимизации"
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                onClick={handleClose}
                variant="outlined" 
                color="inherit"
                sx={{ color: 'text.secondary', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                Отмена
              </Button>
              <Button 
                onClick={analyzeMarketData}
                variant="contained" 
                color="primary"
                disabled={!marketAIFormData.title || isLoadingMarketData}
                startIcon={isLoadingMarketData ? <CircularProgress size={20} color="inherit" /> : <AnalyticsIcon sx={{ color: '#096CEC' }} />}
              >
                {isLoadingMarketData ? 'Анализируем данные...' : 'Анализировать рынок'}
              </Button>
            </Box>
            
            {marketAnalysisError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {marketAnalysisError}
              </Alert>
            )}
          </Box>
        )}
        
        {marketAnalysisStep === 1 && marketDataResults && (
          <Box>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Результаты анализа рынка
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Card sx={{ 
                    bgcolor: 'rgba(30, 40, 60, 0.4)', 
                    border: '1px solid rgba(55, 95, 145, 0.15)', 
                    borderRadius: 2, 
                    height: '100%',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 4px 20px rgba(9, 108, 236, 0.05)'
                  }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', color: '#fff' }}>
                      <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(35, 45, 65, 0.5)',
                        marginRight: 1.5,
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
                      }}>
                        <SearchIcon sx={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.5)' }} />
                      </Box>
                      Зарплатные предложения
                    </Typography>
                    <Box sx={{ pl: 4 }}>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <span>Средняя по рынку:</span> 
                        <span><b>{marketDataResults.salary.average.toLocaleString()}</b> руб.</span>
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <span>Медианная:</span> 
                        <span><b>{marketDataResults.salary.median.toLocaleString()}</b> руб.</span>
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <span>Диапазон:</span> 
                        <span><b>{marketDataResults.salary.range.min.toLocaleString()} - {marketDataResults.salary.range.max.toLocaleString()}</b> руб.</span>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ 
                    bgcolor: 'rgba(30, 40, 60, 0.4)', 
                    border: '1px solid rgba(55, 95, 145, 0.15)', 
                    borderRadius: 2, 
                    height: '100%',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 4px 20px rgba(9, 108, 236, 0.05)'
                  }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', color: '#fff' }}>
                      <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #096CEC 0%, #00B2FF 100%)',
                        marginRight: 1.5,
                        boxShadow: '0 4px 10px rgba(9, 108, 236, 0.25)'
                      }}>
                        <CompareIcon sx={{ fontSize: 16, color: '#fff' }} />
                      </Box>
                      Конкуренты
                    </Typography>
                    <Box sx={{ pl: 4 }}>
                      {marketDataResults.competitorData.map((competitor, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                          <b>{competitor.name}</b>: {competitor.avgSalary.toLocaleString()} руб.
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                            {competitor.requiredSkills.map((skill, i) => (
                              <Chip key={i} label={skill} size="small" sx={{ fontSize: '0.7rem' }} />
                            ))}
                          </Box>
                        </Typography>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Card sx={{ 
                    bgcolor: 'rgba(30, 40, 60, 0.4)', 
                    border: '1px solid rgba(55, 95, 145, 0.15)', 
                    borderRadius: 2, 
                    height: '100%',
                    backdropFilter: 'blur(5px)',
                    boxShadow: '0 4px 20px rgba(9, 108, 236, 0.05)'
                  }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, display: 'flex', alignItems: 'center', color: '#fff' }}>
                      <Box sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, #096CEC 0%, #00B2FF 100%)',
                        marginRight: 1.5,
                        boxShadow: '0 4px 10px rgba(9, 108, 236, 0.25)'
                      }}>
                        <AnalyticsIcon sx={{ fontSize: 16, color: '#096CEC' }} />
                      </Box>
                      Требуемые навыки
                    </Typography>
                    <Box sx={{ pl: 4, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {marketDataResults.skills.map((skill, index) => (
                        <Chip key={index} label={skill} size="small" sx={{ fontSize: '0.75rem' }} />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
              Результат генерации вакансии
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ 
                  p: 3, 
                  borderRadius: 2, 
                  border: '1px solid rgba(9, 108, 236, 0.15)', 
                  mb: 3,
                  background: 'linear-gradient(145deg, rgba(40, 50, 70, 0.8) 0%, rgba(25, 35, 50, 0.9) 100%)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 500, color: '#fff', display: 'flex', alignItems: 'center' }}>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(35, 45, 65, 0.5)',
                        marginRight: 2,
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
                      }}>
                        <TrendingUpIcon sx={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.5)' }} />
                      </Box>
                      Результат анализа
                    </Typography>
                    <Chip 
                      icon={<CheckCircleIcon sx={{ fontSize: '16px !important' }} />}
                      label="Market Optimized" 
                      size="small" 
                      sx={{ 
                        bgcolor: 'rgba(0, 196, 154, 0.1)',
                        color: '#00C49A',
                        fontSize: '0.7rem',
                        height: 24,
                        '& .MuiChip-icon': { color: '#00C49A !important' }
                      }} 
                    />
                  </Box>
                  <Box sx={{ mb: 3, px: 1 }}>
                    <Box
                      sx={{
                        position: 'relative',
                        maxHeight: descriptionExpanded ? 'none' : '100px',
                        overflow: descriptionExpanded ? 'visible' : 'hidden',
                        transition: 'max-height 0.3s ease',
                        mb: 1
                      }}
                    >
                      <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'left' }}>
                        {marketDataResults.generatedJobDescription.replace(/\*\*Требования:\*\* -/g, '')}
                      </Typography>
                      {!descriptionExpanded && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '50px',
                            background: 'linear-gradient(transparent, #141824)',
                          }}
                        />
                      )}
                    </Box>
                    <Button
                      onClick={() => setDescriptionExpanded(!descriptionExpanded)}
                      variant="text"
                      size="small"
                      endIcon={descriptionExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      sx={{ color: '#00C49A', mt: 1, minWidth: 150 }}
                    >
                      {descriptionExpanded ? 'Свернуть' : 'Показать полностью'}
                    </Button>
                  </Box>
                  
                  <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 500 }}>
                    Требования:
                  </Typography>
                  
                  <Box sx={{ pl: 2 }}>
                    {marketDataResults.generatedRequirements.map((requirement, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <CheckCircleIcon sx={{ mr: 2, color: '#00C49A', fontSize: 20, mt: 0.3 }} />
                        <Typography variant="body1" color="text.secondary">
                          {requirement}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      startIcon={<CheckCircleIcon />}
                      onClick={handleSaveJob}
                      sx={{
                        bgcolor: '#2563EB',
                        '&:hover': { bgcolor: '#1E40AF' },
                        minWidth: 220,
                        py: 1
                      }}
                    >
                      Сохранить вакансию
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                onClick={() => setMarketAnalysisStep(0)}
                variant="outlined" 
                color="inherit"
                sx={{ color: 'text.secondary', borderColor: 'rgba(255,255,255,0.2)' }}
              >
                Назад
              </Button>
              <Button 
                onClick={handleSaveJob}
                variant="contained" 
                color="primary"
                startIcon={<CheckCircleIcon />}
              >
                Сохранить и опубликовать
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MarketJobCreator;
