import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
  Chip,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VideocamIcon from '@mui/icons-material/Videocam';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  marginBottom: theme.spacing(3),
}));

const ReviewCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'visible',
  position: 'relative',
}));

const StatusBadge = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: -12,
  right: 12,
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  borderRadius: 12,
  padding: '4px 12px',
  fontSize: '0.75rem',
  fontWeight: 'bold',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
}));

const ReviewStep = ({ interviewConfig, avatarConfig, onStartInterview, onEditSettings }) => {
  const { candidate, vacancy, dateTime, duration, questions } = interviewConfig || {};
  
  // Форматирование даты и времени
  const formattedDate = dateTime ? format(new Date(dateTime), 'dd MMMM yyyy', { locale: ru }) : '';
  const formattedTime = dateTime ? format(new Date(dateTime), 'HH:mm', { locale: ru }) : '';
  
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>Обзор настроек AI-интервью</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Проверьте настройки интервью и нажмите "Запустить", чтобы создать Zoom-встречу с AI-интервьюером.
      </Typography>
      
      <Grid container spacing={3}>
        {/* Кандидат */}
        <Grid item xs={12} md={6}>
          <ReviewCard>
            <StatusBadge>
              <CheckCircleIcon fontSize="small" />
              Готово
            </StatusBadge>
            <CardMedia
              component="img"
              height="140"
              image={candidate?.avatar || "/mock-avatars/avatar-placeholder.jpg"}
              alt={candidate?.name}
              sx={{ objectPosition: 'top' }}
            />
            <CardContent>
              <Typography variant="h6" gutterBottom>Кандидат</Typography>
              
              <List dense disablePadding>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PersonIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={candidate?.name} 
                    secondary="ФИО кандидата"
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <WorkIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={candidate?.position} 
                    secondary="Текущая позиция"
                  />
                </ListItem>
              </List>
              
              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Chip 
                  size="small" 
                  label={`Соответствие: ${candidate?.matchPercentage}%`}
                  color={
                    candidate?.matchPercentage >= 85 ? 'success' : 
                    candidate?.matchPercentage >= 70 ? 'warning' : 'error'
                  }
                />
                <Chip 
                  size="small" 
                  label={`Оценка: ${candidate?.resumeScore}`}
                  color={
                    candidate?.resumeScore >= 85 ? 'success' : 
                    candidate?.resumeScore >= 70 ? 'warning' : 'error'
                  }
                />
              </Stack>
            </CardContent>
          </ReviewCard>
        </Grid>
        
        {/* Вакансия и график */}
        <Grid item xs={12} md={6}>
          <ReviewCard>
            <StatusBadge>
              <CheckCircleIcon fontSize="small" />
              Готово
            </StatusBadge>
            <CardContent>
              <Typography variant="h6" gutterBottom>Параметры интервью</Typography>
              
              <List dense>
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <WorkIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={vacancy?.title} 
                    secondary="Вакансия"
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <EventIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={formattedDate} 
                    secondary="Дата интервью"
                  />
                </ListItem>
                
                <ListItem disablePadding sx={{ mb: 2 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AccessTimeIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={formattedTime} 
                    secondary="Время начала"
                  />
                </ListItem>
                
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AccessTimeIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={`${duration} минут`} 
                    secondary="Продолжительность"
                  />
                </ListItem>
              </List>
            </CardContent>
          </ReviewCard>
        </Grid>
        
        {/* AI-аватар */}
        <Grid item xs={12} md={6}>
          <ReviewCard>
            <StatusBadge>
              <CheckCircleIcon fontSize="small" />
              Готово
            </StatusBadge>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  component="img"
                  src={avatarConfig?.avatar?.preview_url || "/mock-avatars/heygen-placeholder.jpg"}
                  alt="AI Avatar"
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    borderRadius: '50%',
                    objectFit: 'cover',
                    mr: 2,
                    border: '3px solid',
                    borderColor: 'primary.main'
                  }}
                />
                <Box>
                  <Typography variant="h6">AI-интервьюер</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Сгенерирован с помощью Heygen
                  </Typography>
                </Box>
              </Box>
              
              <List dense>
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <PersonIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={avatarConfig?.avatar?.name || 'Стандартный аватар'} 
                    secondary="Имя аватара"
                  />
                </ListItem>
                
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <VideocamIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={avatarConfig?.voice?.name || 'Стандартный голос'} 
                    secondary="Голос"
                  />
                </ListItem>
              </List>
              
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                size="small"
                onClick={() => onEditSettings('avatar')}
                sx={{ mt: 2 }}
              >
                Изменить аватар
              </Button>
            </CardContent>
          </ReviewCard>
        </Grid>
        
        {/* Вопросы */}
        <Grid item xs={12} md={6}>
          <ReviewCard>
            <StatusBadge>
              <CheckCircleIcon fontSize="small" />
              Готово
            </StatusBadge>
            <CardContent>
              <Typography variant="h6" gutterBottom>Вопросы ({questions?.length || 0})</Typography>
              
              <List dense sx={{ maxHeight: 240, overflow: 'auto', mb: 2 }}>
                {questions?.map((question, index) => (
                  <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <QuestionAnswerIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={question} 
                      secondary={`Вопрос ${index + 1}`}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Button
                variant="outlined"
                startIcon={<SettingsIcon />}
                size="small"
                onClick={() => onEditSettings('questions')}
              >
                Изменить вопросы
              </Button>
            </CardContent>
          </ReviewCard>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          После запуска будет автоматически создана Zoom-встреча и отправлена ссылка кандидату. 
          AI-интервьюер подключится к встрече в назначенное время и проведет интервью.
          Результаты интервью будут доступны в разделе "Отчеты" после завершения.
        </Typography>
      </Alert>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={() => onEditSettings('all')}
        >
          Вернуться к настройкам
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<VideocamIcon />}
          onClick={onStartInterview}
        >
          Запустить интервью
        </Button>
      </Box>
    </Box>
  );
};

export default ReviewStep;
