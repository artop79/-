import React, { useState, useEffect } from 'react';
import HeygenService from '../../services/heygenService';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import VideocamIcon from '@mui/icons-material/Videocam';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

// Стилизованные компоненты
const PreviewCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const VideoPreview = styled(Box)(({ theme }) => ({
  backgroundColor: '#1a1a2e',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  position: 'relative',
  aspectRatio: '16/9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const VideoControls = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(1),
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const AvatarGrid = styled(Grid)(({ theme }) => ({
  '& .MuiGrid-item': {
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
  }
}));

// Стандартные URL-адреса для изображений в случае отсутствия изображений аватаров
const defaultAvatarImages = {
  female1: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
  female2: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?d=mp&f=y',
  male1: 'https://www.gravatar.com/avatar/2c7d99fe281ecd3bcd65ab915bac6dd5?d=mp&f=y',
  male2: 'https://www.gravatar.com/avatar/6d8ebb117e8d83d74ea95c790d3af266?d=mp&f=y',
  placeholder: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="%23bdbdbd" d="M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 10c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z"/></svg>'
};

// Предварительная загрузка изображений (nnull-)чтобы избежать ошибок при отображении
const preloadImages = () => {
  Object.values(defaultAvatarImages).forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

// Запуск предварительной загрузки
preloadImages();

// Голоса для TTS
const voiceOptions = [
  { id: 1, name: 'Анна', gender: 'женский', language: 'Русский' },
  { id: 2, name: 'Дмитрий', gender: 'мужской', language: 'Русский' },
  { id: 3, name: 'Мария', gender: 'женский', language: 'Русский' },
  { id: 4, name: 'Алекс', gender: 'мужской', language: 'Русский' },
  { id: 5, name: 'Emily', gender: 'женский', language: 'Английский' },
  { id: 6, name: 'Michael', gender: 'мужской', language: 'Английский' },
];

const HeygenIntegration = ({ onConfigComplete }) => {
  // Основные состояния
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [isApiConnected, setIsApiConnected] = useState(true);
  const [interviewLanguage, setInterviewLanguage] = useState('russian');
  const [previewText, setPreviewText] = useState('Здравствуйте! Я ваш AI-интервьюер. Сегодня мы обсудим ваш опыт и навыки.');
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  
  // Добавляем недостающие состояния
  const [sessionId, setSessionId] = useState(null);
  const [streamingActive, setStreamingActive] = useState(false);
  const [heygenAvatars, setHeygenAvatars] = useState([]);
  const [voiceOptions, setVoiceOptions] = useState(HeygenService.getMockVoices());

  // Проверка подключения к API Heygen и загрузка аватаров
  useEffect(() => {
    const checkApiAndLoadData = async () => {
      try {
        console.log('Загружаем данные Heygen...');
        
        // ВРЕМЕННО: принудительно используем демо-режим для показа функциональности
        // пока бэкенд не настроен
        const useDemoMode = true;
        
        if (useDemoMode) {
          console.log('Используем демо-режим с мок-данными');
          setIsApiConnected(true);
          
          // Загружаем мок-аватары
          const mockAvatars = HeygenService.getMockAvatars();
          console.log('Получены мок-аватары:', mockAvatars);
          setHeygenAvatars(mockAvatars);
          if (!selectedAvatar) {
            setSelectedAvatar(mockAvatars[0]);
          }
          
          // Загружаем мок-голоса
          const mockVoices = HeygenService.getMockVoices();
          setVoiceOptions(mockVoices);
          if (!selectedVoice || selectedVoice === '') {
            setSelectedVoice(mockVoices[0]?.id?.toString() || '1');
          }
          
          return;
        }
        
        // Если демо-режим выключен, пробуем проверить API
        const isConnected = await HeygenService.checkApiStatus();
        console.log('Статус подключения к Heygen API:', isConnected);
        setIsApiConnected(isConnected);
        
        // Загружаем аватары
        const avatars = await HeygenService.getAvatars();
        console.log('Получены аватары из API:', avatars);
        if (avatars && avatars.length > 0) {
          setHeygenAvatars(avatars);
          // Выбираем первый аватар по умолчанию, если ничего не выбрано
          if (!selectedAvatar) {
            setSelectedAvatar(avatars[0]);
          }
        } else {
          // Если нет аватаров с API, используем мок-данные
          const mockAvatars = HeygenService.getMockAvatars();
          console.log('Используем резервные мок-аватары:', mockAvatars);
          setHeygenAvatars(mockAvatars);
          if (!selectedAvatar) {
            setSelectedAvatar(mockAvatars[0]);
          }
        }

        // Загружаем голоса
        const voices = await HeygenService.getVoices();
        if (voices && voices.length > 0) {
          setVoiceOptions(voices);
          // Выбираем первый голос по умолчанию, если ничего не выбрано
          if (!selectedVoice || selectedVoice === '') {
            setSelectedVoice(voices[0]?.id?.toString() || '1');
          }
        }
      } catch (error) {
        console.error('Error initializing Heygen integration:', error);
        setIsApiConnected(false);
        
        // Используем мок-данные в случае ошибки
        const mockAvatars = HeygenService.getMockAvatars();
        setHeygenAvatars(mockAvatars);
        if (!selectedAvatar) {
          setSelectedAvatar(mockAvatars[0]);
        }
      }
    };
    
    checkApiAndLoadData();
    // Запускаем только при первой загрузке или если аватары отсутствуют
  }, []);

  // Обработчик выбора аватара
  const handleSelectAvatar = (avatar) => {
    setSelectedAvatar(avatar);
  };

  // Обработчик переключения воспроизведения/паузы превью
  const handleTogglePreview = () => {
    if (previewPlaying) {
      console.log('Приостановка превью');
      setPreviewPlaying(false);
      
      // При работе в режиме реального API отправляем команду паузы
      if (sessionId && streamingActive && isApiConnected) {
        // Вызываем паузу для реального API
        HeygenService.pauseStreamingSession(sessionId);
      }
    } else {
      console.log('Возобновление превью');
      setPreviewPlaying(true);
      
      // При работе в режиме реального API отправляем команду возобновления
      if (sessionId && streamingActive && isApiConnected) {
        // Возобновляем воспроизведение для реального API
        HeygenService.resumeStreamingSession(sessionId);
      }
    }
  };
  
  // Обработчик генерации превью
  const handleGeneratePreview = async () => {
    if (!selectedAvatar || !selectedVoice) {
      alert('Выберите аватар и голос для превью');
      return;
    }
    
    setPreviewLoading(true);
    console.log('Инициализация предпросмотра...');
    
    try {
      // Автоматически определяем режим работы
      // Используем демо-режим, если API недоступен или указан в настройках
      const useDemoMode = !isApiConnected || process.env.REACT_APP_HEYGEN_API_MODE === 'demo';
      
      if (useDemoMode) {
        console.log('Демо-режим: имитация генерации превью');
        
        // Симулируем задержку для реалистичности
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Устанавливаем демо-сессию
        const demoSessionId = 'demo-session-' + Date.now();
        setSessionId(demoSessionId);
        
        // Устанавливаем состояния для превью
        setStreamingActive(true);
        setPreviewPlaying(true);
        
        // Добавляем в консоль вывод текста для превью 
        console.log('Текст для превью:', previewText);
        
        return;
      }
      
      // Код для работы с реальным API
      // Закрываем предыдущую сессию если есть
      if (sessionId) {
        await HeygenService.closeStreamingSession(sessionId);
      }
      
      // Создаем новую сессию
      const sessionResponse = await HeygenService.createStreamingSession({
        avatarId: selectedAvatar.id,  // Добавляем ID аватара
        voiceId: selectedVoice,
        voiceSpeed: voiceSpeed,
        language: interviewLanguage
      });
      
      if (sessionResponse && sessionResponse.session_id) {
        setSessionId(sessionResponse.session_id);
        
        // Запускаем сессию с выбранным аватаром
        const startResponse = await HeygenService.startStreamingSession(
          sessionResponse.session_id, 
          selectedAvatar.id, 
          { voiceId: selectedVoice }
        );
        
        if (startResponse && startResponse.preview_url) {
          // Отправляем текст для тестового превью
          await HeygenService.sendTextToSession(
            sessionResponse.session_id, 
            previewText,
            { voiceId: selectedVoice, voiceSpeed: voiceSpeed }
          );
          
          setStreamingActive(true);
          setPreviewPlaying(true);
        }
      }
    } catch (error) {
      console.error('Preview generation error:', error);
      alert('Ошибка при генерации превью. Попробуйте еще раз.');
    } finally {
      setPreviewLoading(false);
    }
  };

  // Обработчик воспроизведения/паузы превью
  const togglePlayPreview = () => {
    setPreviewPlaying(!previewPlaying);
  };

  // Закрытие сессии при размонтировании компонента
  useEffect(() => {
    return () => {
      // Закрываем сессию при выходе из компонента
      if (sessionId) {
        HeygenService.closeStreamingSession(sessionId)
          .catch(error => console.error('Error closing session on unmount:', error));
      }
    };
  }, [sessionId]);

  // Обработчик сохранения настроек
  const handleSaveConfig = async () => {
    if (!selectedAvatar || !selectedVoice) {
      alert('Выберите аватар и голос для продолжения');
      return;
    }
    
    try {
      // Закрываем текущую сессию, если она есть, чтобы не оставлять ресурсы висящими
      if (sessionId) {
        await HeygenService.closeStreamingSession(sessionId);
        setSessionId(null);
      }
      
      // Ищем объект голоса по ID
      const selectedVoiceObj = voiceOptions.find(v => v.id.toString() === selectedVoice);
      
      // Логируем данные, которые будут отправлены
      console.log('Сохраняем конфигурацию аватара:', selectedAvatar);
      console.log('Сохраняем конфигурацию голоса:', selectedVoiceObj);
      
      // Собираем конфигурацию для передачи родительскому компоненту с учетом API v2
      const config = {
        avatar: selectedAvatar,
        voice: selectedVoiceObj,
        voiceSpeed,
        language: interviewLanguage,
        // Добавляем метаданные для более удобного использования API v2
        api: {
          avatarId: selectedAvatar.avatar_id || selectedAvatar.id, // Поддержка обоих вариантов API
          voiceId: selectedVoice,
          createSession: HeygenService.createStreamingSession, 
          closeSession: HeygenService.closeStreamingSession,
          sendText: HeygenService.sendTextToSession,
        }
      };
      
      // Передаем конфигурацию родительскому компоненту
      if (onConfigComplete) {
        onConfigComplete(config);
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Ошибка при сохранении конфигурации. Попробуйте еще раз.');
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <VideocamIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6">
          Настройка видеоинтервьюера (Heygen)
        </Typography>
      </Box>
      
      {!isApiConnected && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Отсутствует подключение к API Heygen. Проверьте настройки интеграции в разделе настроек.
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Левая колонка - выбор аватара */}
        <Grid item xs={12} md={7}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mb: 2 }}>
            Выберите аватар для интервьюера
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
            {/* Центрированный аватар */}
            <Box sx={{ 
              width: { xs: '80%', sm: '350px' },
              mb: 3,
              mx: 'auto',
              border: '2px solid #2196f3',
              borderRadius: '16px',
              overflow: 'hidden',
              background: 'linear-gradient(to bottom, rgba(25,118,210,0.05), rgba(25,118,210,0.1))',
            }}>
              <Card
                elevation={0}
                sx={{ 
                  borderRadius: 0,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    height: '240px',
                    objectFit: 'cover',
                  }}
                  image={selectedAvatar ? 
                    (selectedAvatar.preview_image_url || selectedAvatar.preview_url || defaultAvatarImages.placeholder) : 
                    defaultAvatarImages.placeholder}
                  alt={selectedAvatar ? 
                    (selectedAvatar.avatar_name || selectedAvatar.name) : 
                    (heygenAvatars[0]?.avatar_name || heygenAvatars[0]?.name || 'Аватар интервьюера')}
                  onError={(e) => {
                    e.target.src = defaultAvatarImages.placeholder;
                  }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium', textAlign: 'center', color: '#fff' }}>
                    {selectedAvatar ? 
                      (selectedAvatar.avatar_name || selectedAvatar.name) : 
                      (heygenAvatars[0]?.avatar_name || heygenAvatars[0]?.name || 'Аватар интервьюера')}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center' }}>
                    {selectedAvatar ? 
                      `${selectedAvatar.gender || 'Не указан'}, ${selectedAvatar.description || 'Без описания'}` : 
                      `${heygenAvatars[0]?.gender || 'Не указан'}, ${heygenAvatars[0]?.description || 'Без описания'}`}
                  </Typography>
                  <Button
                    fullWidth
                    size="medium"
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleGeneratePreview()}
                    sx={{ 
                      mb: 1, 
                      color: '#2196f3', 
                      borderColor: '#2196f3',
                      '&:hover': {
                        borderColor: '#1976d2',
                        backgroundColor: 'rgba(33, 150, 243, 0.08)',
                      }
                    }}
                  >
                    Предпросмотр
                  </Button>
                </CardContent>
              </Card>
            </Box>
            
            {/* Информация о выборе аватара */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              mb: 3,
              width: { xs: '90%', sm: '80%', md: '60%' },
              mx: 'auto'
            }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium', textAlign: 'center' }}>
                {selectedAvatar ? 'Текущий аватар ИИ-интервьюера' : 'Выберите аватар ИИ-интервьюера'}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph sx={{ textAlign: 'center' }}>
                {selectedAvatar ? 
                  'Этот аватар будет использоваться для проведения интервью. Вы можете изменить его в любой момент.' : 
                  'У вас еще не выбран аватар. Выберите его из галереи, чтобы использовать для интервью.'}
              </Typography>
            </Box>
          </Box>
          
          {/* Кнопка выбора аватара внизу */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 'auto', mb: 2 }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PersonIcon />}
              onClick={() => setAvatarDialogOpen(true)}
              sx={{ 
                minWidth: '240px',
                py: 1.2,
                borderRadius: '30px',
              }}
            >
              {selectedAvatar ? 'Выбрать другой аватар' : 'Выбрать аватар'}
            </Button>
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
                  Выберите один из предложенных аватаров
                </Typography>
              </Box>
              <IconButton onClick={() => setAvatarDialogOpen(false)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent>
              <AvatarGrid container spacing={2} sx={{ mb: 3 }}>
                {heygenAvatars.map((avatar) => (
                  <Grid item xs={6} sm={3} key={avatar.id}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedAvatar?.id === avatar.id ? '2px solid' : '1px solid',
                        borderColor: selectedAvatar?.id === avatar.id ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                      onClick={() => {
                        handleSelectAvatar(avatar);
                        setAvatarDialogOpen(false);
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={avatar.preview_image_url || avatar.preview_url || defaultAvatarImages.placeholder}
                        alt={avatar.avatar_name || avatar.name || 'Аватар'}
                        onError={(e) => {
                          // Если изображение не загрузилось, используем запасное
                          e.target.src = avatar.gender === 'женский' ? 
                            defaultAvatarImages.female1 : defaultAvatarImages.male1;
                        }}
                      />
                      <CardContent sx={{ p: 1.5 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {avatar.avatar_name || avatar.name || 'Без имени'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {avatar.gender}, {avatar.description ? avatar.description.substring(0, 30) + '...' : 'Нет описания'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </AvatarGrid>
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
          
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, mt: 2 }}>
            Настройки голоса и речи
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="voice-select-label">Голос интервьюера</InputLabel>
                <Select
                  labelId="voice-select-label"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  label="Голос интервьюера"
                >
                  {voiceOptions.map((voice) => (
                    <MenuItem key={voice.id} value={voice.id.toString()}>
                      {voice.name} ({voice.gender}, {voice.language})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="language-select-label">Язык интервью</InputLabel>
                <Select
                  labelId="language-select-label"
                  value={interviewLanguage}
                  onChange={(e) => setInterviewLanguage(e.target.value)}
                  label="Язык интервью"
                >
                  <MenuItem value="russian">Русский</MenuItem>
                  <MenuItem value="english">Английский</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <VolumeUpIcon sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ mr: 2 }}>
                  Скорость речи:
                </Typography>
                <Slider
                  value={voiceSpeed}
                  min={0.5}
                  max={1.5}
                  step={0.1}
                  onChange={(e, newValue) => setVoiceSpeed(newValue)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}x`}
                  sx={{ maxWidth: 200 }}
                />
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3 }}>
            <TextField
              label="Текст для предпросмотра"
              multiline
              rows={3}
              fullWidth
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              variant="outlined"
              size="small"
            />
          </Box>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained"
              onClick={handleGeneratePreview}
              disabled={!selectedAvatar || !selectedVoice || previewLoading}
              startIcon={previewLoading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
            >
              {previewLoading ? 'Генерация...' : 'Сгенерировать превью'}
            </Button>
          </Box>
        </Grid>
        
        {/* Правая колонка - предпросмотр */}
        <Grid item xs={12} md={5}>
          <PreviewCard>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                Предпросмотр интервьюера
              </Typography>
              
              <Box 
                sx={{ 
                  mb: 2, 
                  position: 'relative',
                  height: 240,
                  borderRadius: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  backgroundColor: 'rgba(0,0,0,0.1)'
                }}
              >
                {previewLoading ? (
                  <CircularProgress />
                ) : previewPlaying ? (
                  // Демо-режим предпросмотра после нажатия на кнопку
                  <>
                    <Box sx={{ 
                      width: '100%',
                      height: '100%',
                      position: 'relative',
                      backgroundImage: selectedAvatar ? 
                        `url(${selectedAvatar.preview_image_url || selectedAvatar.preview_url || defaultAvatarImages.placeholder})` : 
                        `url(${defaultAvatarImages.placeholder})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center top',
                      // Обработка ошибок загрузки фона не так проста, добавим запасной вариант через backgroundColor
                      backgroundColor: '#1a1a2e'
                    }}>
                      <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 1,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        bgcolor: 'rgba(0,0,0,0.5)',
                      }}>
                        <Button 
                          size="small"
                          variant="contained" 
                          startIcon={<PauseIcon />}
                          onClick={handleTogglePreview}
                        >
                          Пауза
                        </Button>

                        <Typography variant="caption" sx={{ color: 'white' }}>
                          00:10 / 00:30
                        </Typography>
                      </Box>
                    </Box>
                  </>
                ) : (
                  // Состояние пока не нажали на кнопку генерации
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <Box component="img"
                      src={selectedAvatar?.preview_image_url || selectedAvatar?.preview_url || defaultAvatarImages.placeholder}
                      alt={selectedAvatar ? (selectedAvatar.avatar_name || selectedAvatar.name || 'Превью аватара') : 'Превью аватара'}
                      onError={(e) => { e.target.src = defaultAvatarImages.placeholder; }}
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '120px',
                        opacity: 0.5,
                        mb: 2,
                        borderRadius: 1
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Нажмите "Сгенерировать превью" для предпросмотра
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Box sx={{ mt: 2 }}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    AI-интервьюер будет задавать вопросы и анализировать ответы кандидата в режиме реального времени.
                  </Typography>
                </Alert>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  Система Heygen создаст реалистичный видеоаватар для проведения интервью с кандидатом через Zoom. 
                  Вы получите полный отчет о результатах после завершения интервью.
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  onClick={handleSaveConfig}
                  disabled={!selectedAvatar || !selectedVoice}
                >
                  Применить настройки
                </Button>
              </Box>
            </CardContent>
          </PreviewCard>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HeygenIntegration;
