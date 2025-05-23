import React, { useState, useEffect } from 'react';
import telegramService from '../../services/telegramService';
import HRAgentSettings from './HRAgentSettings';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Divider,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Avatar,
  Switch,
  FormControlLabel,
  Badge,
  Stack,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import TelegramIcon from '@mui/icons-material/Telegram';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import EventIcon from '@mui/icons-material/Event';
import MessageIcon from '@mui/icons-material/Message';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AssistantIcon from '@mui/icons-material/Assistant';

// Компонент вкладки ИИ HR агент
const AIHRAgentTabContent = ({ aiAgentSettings, handleAiAgentSettingChange }) => {
  return (
    <Box sx={{ py: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: '12px',
          background: 'linear-gradient(45deg, rgba(63,81,181,0.05) 0%, rgba(63,81,181,0.1) 100%)'
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          <PsychologyIcon sx={{ mr: 1, color: '#304FFE' }} /> 
          ИИ HR агент
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Автоматизируйте рутинные задачи рекрутера с помощью искусственного интеллекта. 
          ИИ HR агент может анализировать резюме, отвечать на типовые вопросы кандидатов и планировать интервью.
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
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
                Активировать ИИ HR агента
              </Typography>
            }
          />
          <Chip 
            label="Новинка" 
            color="primary" 
            size="small" 
            sx={{ ml: 2, bgcolor: '#304FFE' }} 
          />
        </Box>
      </Paper>
      
      {/* Интеграция компонента HRAgentSettings */}
      <HRAgentSettings aiAgentSettings={aiAgentSettings} handleAiAgentSettingChange={handleAiAgentSettingChange} />
    </Box>
  );
};

// Основной компонент страницы Automation
const Automation = () => {
  // Состояние для управления активной вкладкой
  const [activeTab, setActiveTab] = useState(0);
  // Состояние для управления диалогами
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  // Состояние для интеграций
  const [integrations, setIntegrations] = useState({
    telegram: { connected: false, loading: false, token: '' },
    slack: { connected: false, loading: false },
    email: { connected: false, loading: false },
    linkedin: { connected: false, loading: false },
    zoom: { connected: false, loading: false },
    calendar: { connected: false, loading: false }
  });
  
  // Состояние для полей ввода в диалогах
  const [integrationFields, setIntegrationFields] = useState({});
  
  // Состояние для уведомлений
  const [notification, setNotification] = useState({ show: false, message: '', severity: 'info' });
  // Состояние для настроек ИИ HR агента
  const [aiAgentSettings, setAiAgentSettings] = useState({
    active: false,
    autoRespond: true,
    resumeAnalysis: true,
    interviewScheduling: true,
    candidateQualification: true,
    notifyRecruiter: true,
    language: 'russian',
    personality: 'professional'
  });

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    // Проверяем статус Telegram бота при загрузке
    checkTelegramBotStatus();
  }, []);

  // Проверка статуса Telegram бота
  const checkTelegramBotStatus = async () => {
    try {
      const response = await telegramService.getTelegramBotStatus();
      if (response.success && response.data.status === 'running') {
        setIntegrations(prev => ({
          ...prev,
          telegram: { ...prev.telegram, connected: true }
        }));
      }
    } catch (error) {
      console.error('Ошибка при проверке статуса Telegram бота:', error);
    }
  };

  // Обработчик изменения вкладки
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Открытие диалога настройки интеграции
  const handleOpenIntegrationDialog = (type) => {
    setDialogType(type);
    // Сбрасываем поля ввода при открытии диалога
    setIntegrationFields({});
    setOpenDialog(true);
  };

  // Закрытие диалога
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  // Обработка изменения полей ввода в диалоге
  const handleFieldChange = (fieldName, value) => {
    setIntegrationFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };
  
  // Подключение интеграции с вызовом соответствующего API
  const handleConnectIntegration = async (type) => {
    // Устанавливаем состояние загрузки
    setIntegrations(prev => ({
      ...prev,
      [type]: { ...prev[type], loading: true }
    }));

    try {
      // В зависимости от типа интеграции вызываем соответствующий метод
      if (type === 'telegram') {
        const token = integrationFields.bot_token;
        if (!token) {
          throw new Error('Токен бота не указан');
        }
        
        const response = await telegramService.configureTelegramBot(token);
        
        if (response.success) {
          // Сохраняем токен в состоянии для последующего использования
          setIntegrations(prev => ({
            ...prev,
            [type]: { connected: true, loading: false, token }
          }));
          
          // Показываем уведомление об успешном подключении
          setNotification({
            show: true,
            message: 'Telegram бот успешно настроен и запущен',
            severity: 'success'
          });
          
          // Автоматически скрываем уведомление через 5 секунд
          setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
          }, 5000);
          
          handleCloseDialog();
        }
      } else {
        // Для других типов интеграций (которые пока не реализованы)
        // имитируем успешное подключение после задержки
        setTimeout(() => {
          setIntegrations(prev => ({
            ...prev,
            [type]: { connected: true, loading: false }
          }));
          handleCloseDialog();
        }, 1500);
      }
    } catch (error) {
      console.error(`Ошибка при настройке интеграции ${type}:`, error);
      
      // Показываем уведомление об ошибке
      setNotification({
        show: true,
        message: `Ошибка при настройке интеграции: ${error.message || 'Неизвестная ошибка'}`,
        severity: 'error'
      });
      
      // Автоматически скрываем уведомление через 5 секунд
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
      
      // Сбрасываем состояние загрузки
      setIntegrations(prev => ({
        ...prev,
        [type]: { ...prev[type], loading: false }
      }));
    }
  };
  
  // Отключение интеграции
  const handleDisconnectIntegration = async (type) => {
    // Устанавливаем состояние загрузки
    setIntegrations(prev => ({
      ...prev,
      [type]: { ...prev[type], loading: true }
    }));

    try {
      if (type === 'telegram') {
        const response = await telegramService.stopTelegramBot();
        
        if (response.success) {
          setIntegrations(prev => ({
            ...prev,
            [type]: { connected: false, loading: false, token: '' }
          }));
          
          setNotification({
            show: true,
            message: 'Telegram бот успешно остановлен',
            severity: 'info'
          });
          
          setTimeout(() => {
            setNotification(prev => ({ ...prev, show: false }));
          }, 5000);
        }
      } else {
        // Для других типов интеграций
        setTimeout(() => {
          setIntegrations(prev => ({
            ...prev,
            [type]: { connected: false, loading: false }
          }));
        }, 1500);
      }
    } catch (error) {
      console.error(`Ошибка при отключении интеграции ${type}:`, error);
      
      setNotification({
        show: true,
        message: `Ошибка при отключении интеграции: ${error.message || 'Неизвестная ошибка'}`,
        severity: 'error'
      });
      
      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 5000);
      
      setIntegrations(prev => ({
        ...prev,
        [type]: { ...prev[type], loading: false }
      }));
    }
  };
  
  // Обработчик изменения настроек ИИ HR агента
  const handleAiAgentSettingChange = (setting, value) => {
    setAiAgentSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    // Показываем уведомление об успешном сохранении настроек
    let message = 'Настройки ИИ HR агента сохранены';
    
    // Дополнительные сообщения для конкретных настроек
    if (setting === 'active') {
      message = value 
        ? 'ИИ HR агент активирован' 
        : 'ИИ HR агент деактивирован';
    }
    
    setNotification({
      show: true,
      message,
      severity: 'success'
    });
    
    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Карточка интеграции (для переиспользования)
  const IntegrationCard = ({ title, icon, description, type, status }) => (
    <Card 
      elevation={3} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box 
            sx={{ 
              bgcolor: 'primary.main', 
              borderRadius: '50%', 
              p: 1.5,
              mr: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          {status.connected && (
            <Chip 
              label="Подключено" 
              size="small" 
              color="success" 
              sx={{ ml: 'auto' }} 
            />
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button 
          startIcon={status.connected ? <SettingsIcon /> : <AddIcon />}
          variant={status.connected ? "outlined" : "contained"}
          size="small"
          onClick={() => handleOpenIntegrationDialog(type)}
          disabled={status.loading}
          fullWidth
        >
          {status.loading ? (
            <CircularProgress size={24} sx={{ mr: 1 }} />
          ) : (
            status.connected ? 'Настройки' : 'Подключить'
          )}
        </Button>
      </CardActions>
    </Card>
  );

  // Контент для вкладки интеграций
  const IntegrationsTabContent = () => (
    <Box sx={{ py: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <IntegrationCard
            title="Telegram Bot"
            icon={<TelegramIcon sx={{ color: 'white' }} />}
            description="Автоматизируйте коммуникацию с кандидатами через Telegram. Отправляйте уведомления и получайте ответы через бота."
            type="telegram"
            status={integrations.telegram}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <IntegrationCard
            title="Slack"
            icon={<MessageIcon sx={{ color: 'white' }} />}
            description="Интегрируйте HR-процессы в рабочее пространство Slack. Получайте уведомления о новых кандидатах и ведите обсуждения."
            type="slack"
            status={integrations.slack}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <IntegrationCard
            title="Email"
            icon={<AlternateEmailIcon sx={{ color: 'white' }} />}
            description="Настройте автоматическую рассылку писем кандидатам через SendGrid. Персонализированные шаблоны и отслеживание открытий."
            type="email"
            status={integrations.email}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <IntegrationCard
            title="LinkedIn"
            icon={<LinkedInIcon sx={{ color: 'white' }} />}
            description="Автоматизируйте взаимодействие с кандидатами на LinkedIn. Отправляйте сообщения и отслеживайте ответы."
            type="linkedin"
            status={integrations.linkedin}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <IntegrationCard
            title="Zoom"
            icon={<VideoCallIcon sx={{ color: 'white' }} />}
            description="Планируйте собеседования в Zoom автоматически. Создавайте и отправляйте приглашения на встречи кандидатам."
            type="zoom"
            status={integrations.zoom}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <IntegrationCard
            title="Google Calendar"
            icon={<EventIcon sx={{ color: 'white' }} />}
            description="Синхронизируйте расписание собеседований с Google Calendar. Отслеживайте занятость HR-менеджеров."
            type="calendar"
            status={integrations.calendar}
          />
        </Grid>
      </Grid>
    </Box>
  );

  // Контент для вкладки шаблонов сообщений
  const TemplatesTabContent = () => (
    <Box sx={{ py: 3 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        Здесь вы можете создавать и редактировать шаблоны сообщений для автоматической коммуникации с кандидатами.
      </Alert>
      
      <Paper elevation={0} sx={{ p: 0, mb: 3, border: '1px solid rgba(0,0,0,0.1)' }}>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Шаблоны сообщений</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Новый шаблон
          </Button>
        </Box>
        <Divider />
        
        {['Приглашение на интервью', 'Отказ', 'Запрос дополнительной информации', 'Оффер'].map((template, index) => (
          <Box key={index}>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1">{template}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Используется в: Email, Telegram
                </Typography>
              </Box>
              <Box>
                <Tooltip title="Редактировать">
                  <IconButton size="small">
                    <SettingsIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            {index < 3 && <Divider />}
          </Box>
        ))}
      </Paper>
      
      <Typography variant="h6" sx={{ mb: 2 }}>Переменные для шаблонов</Typography>
      <Grid container spacing={1} sx={{ mb: 3 }}>
        {['candidate_name', 'position', 'company', 'interview_date', 'interview_time', 'zoom_link', 'recruiter_name'].map((variable) => (
          <Grid item key={variable}>
            <Chip 
              label={`{{${variable}}}`} 
              variant="outlined" 
              color="primary"
              sx={{ '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Контент для вкладки анализа резюме
  const ResumeAnalysisTabContent = () => (
    <Box sx={{ py: 3 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        Настройте автоматический анализ и скоринг резюме для ускорения предварительного отбора кандидатов.
      </Alert>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Настройки анализа резюме</Typography>
              <Typography variant="body2" paragraph>
                Настройте критерии, по которым система будет оценивать резюме кандидатов для каждой вакансии.
              </Typography>
              <Button variant="contained" startIcon={<SettingsIcon />}>
                Настроить критерии
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Пороговые значения скоринга</Typography>
              <Typography variant="body2" paragraph>
                Установите минимальные баллы для автоматического прохождения кандидатов на следующий этап.
              </Typography>
              <Button variant="contained" startIcon={<SettingsIcon />}>
                Настроить пороги
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Интеграция с AI-интервьюером</Typography>
              <Typography variant="body2" paragraph>
                Автоматически приглашайте кандидатов, прошедших порог скоринга, на видеоинтервью с AI-интервьюером.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" startIcon={<IntegrationInstructionsIcon />}>
                  Настроить интеграцию
                </Button>
                <Chip label="Не активировано" color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  // Диалог для настройки интеграций
  const renderIntegrationDialog = () => {
    const dialogConfigs = {
      telegram: {
        title: 'Настройка Telegram Bot',
        fields: [
          { name: 'bot_token', label: 'API Токен бота', placeholder: '12345:ABCDEF...', helperText: 'Токен, полученный от @BotFather в Telegram' }
        ]
      },
      slack: {
        title: 'Настройка Slack',
        fields: [
          { name: 'client_id', label: 'Client ID', placeholder: 'Введите Client ID' },
          { name: 'client_secret', label: 'Client Secret', placeholder: 'Введите Client Secret' }
        ]
      },
      email: {
        title: 'Настройка Email (SendGrid)',
        fields: [
          { name: 'api_key', label: 'API Key', placeholder: 'SG...' },
          { name: 'from_email', label: 'Email отправителя', placeholder: 'hr@yourcompany.com' }
        ]
      },
      linkedin: {
        title: 'Настройка LinkedIn',
        fields: [
          { name: 'access_token', label: 'Access Token', placeholder: 'Введите токен доступа' }
        ]
      },
      zoom: {
        title: 'Настройка Zoom',
        fields: [
          { name: 'api_key', label: 'API Key', placeholder: 'Введите API Key Zoom' },
          { name: 'api_secret', label: 'API Secret', placeholder: 'Введите API Secret Zoom' }
        ]
      },
      calendar: {
        title: 'Настройка Google Calendar',
        fields: [
          { name: 'client_id', label: 'Client ID', placeholder: 'Введите Client ID' },
          { name: 'client_secret', label: 'Client Secret', placeholder: 'Введите Client Secret' }
        ]
      }
    };

    const config = dialogConfigs[dialogType] || { title: '', fields: [] };

    return (
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
          {config.title}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {config.fields.map((field) => (
            <TextField
              key={field.name}
              margin="dense"
              id={field.name}
              label={field.label}
              type="text"
              fullWidth
              variant="outlined"
              placeholder={field.placeholder}
              helperText={field.helperText}
              value={integrationFields[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              sx={{ mb: 2 }}
            />
          ))}
          
          <Alert 
            severity={integrations[dialogType]?.connected ? "success" : "info"} 
            sx={{ 
              mt: 2,
              borderRadius: '8px',
              '& .MuiAlert-icon': {
                alignItems: 'center'
              }
            }}
          >
            {integrations[dialogType]?.connected
              ? 'Сервис успешно подключен и активен. Вы можете обновить настройки или отключить интеграцию.'
              : 'После подключения вы сможете настроить автоматизацию взаимодействия с кандидатами.'}
          </Alert>
          
          {dialogType === 'telegram' && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: '8px' }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Пошаговая инструкция:</strong>
                <ol style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>Откройте Telegram и найдите @BotFather</li>
                  <li>Отправьте команду /newbot и следуйте инструкциям</li>
                  <li>Получите токен доступа и вставьте его в поле выше</li>
                </ol>
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <Button onClick={handleCloseDialog} sx={{ mr: 1 }}>Отмена</Button>
          
          {integrations[dialogType]?.connected && (
            <Button 
              variant="outlined"
              color="error"
              onClick={() => handleDisconnectIntegration(dialogType)}
              disabled={integrations[dialogType]?.loading}
              sx={{ mr: 1 }}
            >
              {integrations[dialogType]?.loading ? <CircularProgress size={24} /> : 'Отключить'}
            </Button>
          )}
          
          <Button 
            variant="contained"
            onClick={() => handleConnectIntegration(dialogType)}
            disabled={integrations[dialogType]?.loading}
          >
            {integrations[dialogType]?.loading ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Обработка...
              </>
            ) : (
              integrations[dialogType]?.connected ? 'Обновить' : 'Подключить'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  // Компонент уведомления
  const renderNotification = () => {
    if (!notification.show) return null;
    
    return (
      <Snackbar 
        open={notification.show} 
        autoHideDuration={5000} 
        onClose={() => setNotification(prev => ({ ...prev, show: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={notification.severity} 
          onClose={() => setNotification(prev => ({ ...prev, show: false }))}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    );
  };

  return (
    <Box>
      {/* Компонент уведомления */}
      {renderNotification()}
      
      {/* Шапка страницы */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          background: 'linear-gradient(to right, #3699FF, #304FFE)',
          color: 'white'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <AutoFixHighIcon sx={{ fontSize: 36, mr: 2 }} />
          <Box>
            <Typography variant="h4" gutterBottom>
              Автоматизация HR
            </Typography>
            <Typography variant="body1">
              Настройте автоматическую коммуникацию с кандидатами через различные каналы и ускорьте рутинные HR-задачи.
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Табы для разделов */}
      <Paper sx={{ mb: 3, borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{
            '& .MuiTab-root': {
              minHeight: '64px',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            },
            '& .Mui-selected': {
              color: '#304FFE',
              fontWeight: 700
            }
          }}
        >
          <Tab icon={<IntegrationInstructionsIcon />} label="Интеграции" />
          <Tab icon={<FormatListBulletedIcon />} label="Шаблоны сообщений" />
          <Tab icon={<ContentPasteSearchIcon />} label="Анализ резюме" />
          <Tab icon={<PsychologyIcon />} label="ИИ HR агент" />
        </Tabs>
      </Paper>

      {/* Контент для выбранного таба */}
      {activeTab === 0 && <IntegrationsTabContent />}
      {activeTab === 1 && <TemplatesTabContent />}
      {activeTab === 2 && <ResumeAnalysisTabContent />}
      {activeTab === 3 && <AIHRAgentTabContent aiAgentSettings={aiAgentSettings} handleAiAgentSettingChange={handleAiAgentSettingChange} />}

      {/* Диалог настройки интеграции */}
      {renderIntegrationDialog()}
    </Box>
  );
};

export default Automation;
