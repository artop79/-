import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  TextField,
  Button,
  Slider,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Chip,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  InputAdornment,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import TelegramIcon from '@mui/icons-material/Telegram';
import EmailIcon from '@mui/icons-material/Email';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SettingsIcon from '@mui/icons-material/Settings';
import CodeIcon from '@mui/icons-material/Code';
import TranslateIcon from '@mui/icons-material/Translate';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SaveAltIcon from '@mui/icons-material/SaveAlt';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

import hrAgentService from '../../services/hrAgentService';

const HRAgentSettings = ({ aiAgentSettings, handleAiAgentSettingChange }) => {
  // Состояние для промптов
  const [prompts, setPrompts] = useState([
    { 
      id: 'professional', 
      name: 'Профессиональный', 
      description: 'Деловой и эффективный стиль общения', 
      systemPrompt: 'Вы - профессиональный HR менеджер компании, общающийся с кандидатами. Ваша задача - предоставить точную информацию о вакансии, процессе найма и ответить на вопросы кандидата. Ваш стиль общения - деловой, четкий и конкретный.' 
    },
    { 
      id: 'friendly', 
      name: 'Дружелюбный', 
      description: 'Тёплый и дружелюбный стиль общения', 
      systemPrompt: 'Вы - дружелюбный HR менеджер компании, общающийся с кандидатами. Ваша задача - создать комфортную атмосферу, предоставить информацию о вакансии и процессе найма. Ваш стиль общения - тёплый, дружелюбный, с позитивным настроем.' 
    },
  ]);

  // Состояние для текущих настроек модели
  const [modelSettings, setModelSettings] = useState({
    model: 'gpt-4o', // Выбранная модель
    temperature: 0.7, // Температура (креативность)
    maxTokens: 1000, // Максимальное количество токенов
    language: 'russian', // Язык общения
  });

  // Состояние для интеграций
  const [integrations, setIntegrations] = useState({
    telegram: true,
    email: false,
    whatsapp: false
  });

  // Состояние для нового промпта
  const [newPrompt, setNewPrompt] = useState({
    id: '',
    name: '',
    description: '',
    systemPrompt: ''
  });

  // Состояние для режима редактирования промпта
  const [editingPromptId, setEditingPromptId] = useState(null);

  // Состояние для уведомлений
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    severity: 'success'
  });

  // Загрузка данных
  useEffect(() => {
    loadPersonalities();
  }, []);

  // Загрузка личностей HR агента с сервера
  const loadPersonalities = async () => {
    try {
      const personalities = await hrAgentService.getAvailablePersonalities();
      if (personalities && personalities.length > 0) {
        // Преобразуем данные с сервера в формат для нашего состояния
        const loadedPrompts = personalities.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          systemPrompt: p.system_prompt || ''
        }));
        setPrompts(loadedPrompts);
      }
    } catch (error) {
      console.error('Ошибка при загрузке личностей HR агента:', error);
      showNotification('Ошибка при загрузке данных с сервера', 'error');
    }
  };

  // Функция показа уведомлений
  const showNotification = (message, severity = 'success') => {
    setNotification({
      show: true,
      message,
      severity
    });

    // Автоматически скрываем уведомление через 3 секунды
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Обработчики изменения настроек
  const handleModelSettingChange = (setting, value) => {
    setModelSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    showNotification('Настройки модели обновлены');
  };

  const handleIntegrationChange = (integration, value) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: value
    }));
    showNotification(`Интеграция ${integration} ${value ? 'включена' : 'отключена'}`);
  };

  // Обработчик добавления нового промпта
  const handleAddPrompt = () => {
    if (!newPrompt.id || !newPrompt.name || !newPrompt.systemPrompt) {
      showNotification('Заполните все обязательные поля', 'error');
      return;
    }

    // Проверяем, что ID уникален
    if (prompts.some(p => p.id === newPrompt.id) && !editingPromptId) {
      showNotification('Промпт с таким ID уже существует', 'error');
      return;
    }

    if (editingPromptId) {
      // Режим редактирования
      setPrompts(prev => prev.map(p => 
        p.id === editingPromptId ? { ...newPrompt } : p
      ));
      setEditingPromptId(null);
      showNotification('Промпт успешно обновлен');
    } else {
      // Режим добавления
      setPrompts(prev => [...prev, { ...newPrompt }]);
      showNotification('Новый промпт успешно добавлен');
    }

    // Сбрасываем форму
    setNewPrompt({
      id: '',
      name: '',
      description: '',
      systemPrompt: ''
    });
  };

  // Обработчик удаления промпта
  const handleDeletePrompt = (id) => {
    setPrompts(prev => prev.filter(p => p.id !== id));
    showNotification('Промпт удален');
  };

  // Обработчик перехода в режим редактирования
  const handleEditPrompt = (prompt) => {
    setNewPrompt({ ...prompt });
    setEditingPromptId(prompt.id);
  };

  // Обработчик сохранения всех настроек на сервер
  const handleSaveAllSettings = async () => {
    try {
      // Здесь будет вызов API для сохранения всех настроек
      // await hrAgentService.saveSettings({ prompts, modelSettings, integrations });
      console.log('Сохраняем настройки:', { prompts, modelSettings, integrations });
      showNotification('Все настройки успешно сохранены');
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      showNotification('Ошибка при сохранении настроек', 'error');
    }
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Заголовок и общее описание */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: '12px',
          background: 'linear-gradient(45deg, rgba(63,81,181,0.05) 0%, rgba(63,81,181,0.1) 100%)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <PsychologyIcon sx={{ mr: 1, color: '#304FFE' }} /> 
            Настройки ИИ HR агента
          </Typography>
          
          <Box>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<SaveAltIcon />}
              onClick={handleSaveAllSettings}
              sx={{ mr: 1 }}
            >
              Сохранить все настройки
            </Button>
            
            <FormControlLabel
              control={
                <Switch 
                  checked={aiAgentSettings.active} 
                  onChange={(e) => handleAiAgentSettingChange('active', e.target.checked)} 
                  color="primary"
                  sx={{ 
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#304FFE',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#304FFE',
                    },
                  }}
                />
              }
              label={
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Активировать
                </Typography>
              }
            />
            
            <Chip 
              label="Новинка" 
              color="primary" 
              size="small" 
              sx={{ ml: 1, bgcolor: '#304FFE' }} 
            />
          </Box>
        </Box>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          Настройте параметры работы ИИ HR агента, включая шаблоны сообщений, интеграции и модель искусственного интеллекта.
          Агент может обрабатывать обращения кандидатов, проводить первичный скрининг и отвечать на типовые вопросы.
        </Typography>
      </Paper>

      {/* Уведомление */}
      {notification.show && (
        <Alert severity={notification.severity} sx={{ mb: 2 }}>
          {notification.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Раздел настройки модели */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '12px', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SettingsApplicationsIcon sx={{ mr: 1, color: '#304FFE' }} />
              <Typography variant="h6">Настройки модели</Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Модель OpenAI</InputLabel>
                  <Select
                    value={modelSettings.model}
                    onChange={(e) => handleModelSettingChange('model', e.target.value)}
                    label="Модель OpenAI"
                  >
                    <MenuItem value="gpt-4o">GPT-4o (Рекомендуется)</MenuItem>
                    <MenuItem value="gpt-4o-mini">GPT-4o Mini (Быстрее, экономичнее)</MenuItem>
                    <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Экономичный вариант)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <ThermostatIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">Температура (креативность): {modelSettings.temperature}</Typography>
                  <Tooltip title="Чем выше значение, тем более творческие и разнообразные ответы. Чем ниже, тем более предсказуемые и консервативные.">
                    <InfoIcon sx={{ ml: 1, fontSize: '1rem', color: 'text.secondary' }} />
                  </Tooltip>
                </Box>
                <Slider
                  value={modelSettings.temperature}
                  onChange={(e, value) => handleModelSettingChange('temperature', value)}
                  step={0.1}
                  min={0}
                  max={1}
                  valueLabelDisplay="auto"
                  sx={{ 
                    color: '#304FFE',
                    '& .MuiSlider-thumb': {
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0px 0px 0px 8px rgba(48, 79, 254, 0.16)',
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Максимальное кол-во токенов"
                  type="number"
                  value={modelSettings.maxTokens}
                  onChange={(e) => handleModelSettingChange('maxTokens', parseInt(e.target.value))}
                  variant="outlined"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="Максимальная длина ответа. Один токен примерно соответствует 4 символам для русского языка.">
                        <InputAdornment position="end">
                          <InfoIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                        </InputAdornment>
                      </Tooltip>
                    ),
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined" size="small">
                  <InputLabel>Язык общения</InputLabel>
                  <Select
                    value={modelSettings.language}
                    onChange={(e) => handleModelSettingChange('language', e.target.value)}
                    label="Язык общения"
                    startAdornment={<TranslateIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                  >
                    <MenuItem value="russian">Русский</MenuItem>
                    <MenuItem value="english">Английский</MenuItem>
                    <MenuItem value="auto">Автоопределение</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Раздел интеграций */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '12px', height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SmartToyIcon sx={{ mr: 1, color: '#304FFE' }} />
              <Typography variant="h6">Интеграции HR агента</Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card 
                  variant="outlined" 
                  sx={{ 
                    mb: 2,
                    borderColor: integrations.telegram ? '#304FFE' : 'rgba(0, 0, 0, 0.12)',
                    bgcolor: integrations.telegram ? 'rgba(48, 79, 254, 0.05)' : 'transparent',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TelegramIcon sx={{ mr: 1, color: '#0088cc' }} />
                        <Typography variant="subtitle1">Telegram</Typography>
                      </Box>
                      <Switch 
                        checked={integrations.telegram} 
                        onChange={(e) => handleIntegrationChange('telegram', e.target.checked)} 
                        color="primary"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Автоматические ответы на сообщения кандидатов в Telegram
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card 
                  variant="outlined" 
                  sx={{ 
                    mb: 2,
                    borderColor: integrations.email ? '#304FFE' : 'rgba(0, 0, 0, 0.12)',
                    bgcolor: integrations.email ? 'rgba(48, 79, 254, 0.05)' : 'transparent',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <EmailIcon sx={{ mr: 1, color: '#D14836' }} />
                        <Typography variant="subtitle1">Email</Typography>
                      </Box>
                      <Switch 
                        checked={integrations.email} 
                        onChange={(e) => handleIntegrationChange('email', e.target.checked)} 
                        color="primary"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Автоматическая обработка писем от кандидатов
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card 
                  variant="outlined" 
                  sx={{ 
                    mb: 2,
                    borderColor: integrations.whatsapp ? '#304FFE' : 'rgba(0, 0, 0, 0.12)',
                    bgcolor: integrations.whatsapp ? 'rgba(48, 79, 254, 0.05)' : 'transparent',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <WhatsAppIcon sx={{ mr: 1, color: '#25D366' }} />
                        <Typography variant="subtitle1">WhatsApp</Typography>
                      </Box>
                      <Switch 
                        checked={integrations.whatsapp} 
                        onChange={(e) => handleIntegrationChange('whatsapp', e.target.checked)} 
                        color="primary"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Интеграция с WhatsApp Business API
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Раздел управления промптами */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CodeIcon sx={{ mr: 1, color: '#304FFE' }} />
              <Typography variant="h6">Управление промптами</Typography>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Форма добавления/редактирования промпта */}
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                mb: 3, 
                borderColor: editingPromptId ? '#304FFE' : 'rgba(0, 0, 0, 0.12)',
                bgcolor: editingPromptId ? 'rgba(48, 79, 254, 0.05)' : 'rgba(0, 0, 0, 0.02)',
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                {editingPromptId ? 'Редактирование промпта' : 'Добавление нового промпта'}
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="ID промпта (уникальный)"
                    value={newPrompt.id}
                    onChange={(e) => setNewPrompt({ ...newPrompt, id: e.target.value })}
                    variant="outlined"
                    size="small"
                    required
                    disabled={!!editingPromptId}
                  />
                </Grid>
                
                <Grid item xs={12} md={8}>
                  <TextField
                    fullWidth
                    label="Название промпта"
                    value={newPrompt.name}
                    onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
                    variant="outlined"
                    size="small"
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Описание"
                    value={newPrompt.description}
                    onChange={(e) => setNewPrompt({ ...newPrompt, description: e.target.value })}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Системный промпт"
                    value={newPrompt.systemPrompt}
                    onChange={(e) => setNewPrompt({ ...newPrompt, systemPrompt: e.target.value })}
                    variant="outlined"
                    multiline
                    rows={4}
                    required
                    helperText="Инструкции для модели, определяющие поведение и тон HR агента"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={editingPromptId ? <SaveIcon /> : <AddIcon />}
                    onClick={handleAddPrompt}
                  >
                    {editingPromptId ? 'Сохранить изменения' : 'Добавить промпт'}
                  </Button>
                  
                  {editingPromptId && (
                    <Button
                      variant="outlined"
                      sx={{ ml: 2 }}
                      onClick={() => {
                        setEditingPromptId(null);
                        setNewPrompt({
                          id: '',
                          name: '',
                          description: '',
                          systemPrompt: ''
                        });
                      }}
                    >
                      Отменить
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Paper>
            
            {/* Список существующих промптов */}
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              Существующие промпты
            </Typography>
            
            {prompts.map((prompt) => (
              <Accordion key={prompt.id} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PsychologyIcon sx={{ mr: 1, color: '#304FFE' }} />
                      <Typography variant="subtitle1">{prompt.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                        {prompt.description}
                      </Typography>
                    </Box>
                    <Box>
                      <Chip 
                        label={prompt.id} 
                        size="small" 
                        sx={{ mr: 1 }} 
                        variant="outlined" 
                      />
                      <IconButton 
                        size="small" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditPrompt(prompt);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePrompt(prompt.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {prompt.systemPrompt}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default HRAgentSettings;
