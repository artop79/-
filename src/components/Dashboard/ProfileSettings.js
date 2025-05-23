import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Grid,
  TextField,
  Avatar,
  Switch,
  FormControlLabel,
  Tabs,
  Tab
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsIcon from '@mui/icons-material/Notifications';

const ProfileSettings = ({ minimal }) => {
  const [activeTab, setActiveTab] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Mini display for dashboard overview
  if (minimal) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1 }} /> Профиль
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 40, height: 40, mr: 2 }}>И</Avatar>
            <Typography variant="body1">
              Иван Петров
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            HR-менеджер
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
            >
              Редактировать
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Настройки профиля
      </Typography>
      
      <Card variant="outlined" sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab icon={<PersonIcon />} label="Личные данные" />
          <Tab icon={<SecurityIcon />} label="Безопасность" />
          <Tab icon={<NotificationsIcon />} label="Уведомления" />
        </Tabs>
      </Card>
      
      {activeTab === 0 && (
        <Card variant="outlined" sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3 }}>И</Avatar>
            <Box>
              <Typography variant="body1" gutterBottom>
                Загрузите фото профиля
              </Typography>
              <Button variant="outlined" size="small">
                Загрузить
              </Button>
            </Box>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Имя"
                fullWidth
                defaultValue="Иван"
                variant="outlined"
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Фамилия"
                fullWidth
                defaultValue="Петров"
                variant="outlined"
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                defaultValue="ivan@example.com"
                variant="outlined"
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Телефон"
                fullWidth
                defaultValue="+7 (900) 123-45-67"
                variant="outlined"
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Должность"
                fullWidth
                defaultValue="HR-менеджер"
                variant="outlined"
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Компания"
                fullWidth
                defaultValue="Raplle Technologies"
                variant="outlined"
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary">
                  Сохранить изменения
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      )}
      
      {activeTab === 1 && (
        <Card variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Сменить пароль
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Текущий пароль"
                fullWidth
                type="password"
                variant="outlined"
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ height: '56px' }} /> {/* Spacer */}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Новый пароль"
                fullWidth
                type="password"
                variant="outlined"
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Подтвердите новый пароль"
                fullWidth
                type="password"
                variant="outlined"
                sx={{ mb: 3 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="contained" color="primary">
                  Сменить пароль
                </Button>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Двухфакторная аутентификация
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <FormControlLabel
              control={
                <Switch color="primary" />
              }
              label="Включить двухфакторную аутентификацию"
              sx={{ mb: 3 }}
            />
            
            <Typography variant="body2" color="text.secondary" paragraph>
              Двухфакторная аутентификация добавляет дополнительный уровень безопасности для вашего аккаунта, требуя код подтверждения при входе.
            </Typography>
            
            <Button variant="outlined">
              Настроить 2FA
            </Button>
          </Box>
        </Card>
      )}
      
      {activeTab === 2 && (
        <Card variant="outlined" sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Настройки уведомлений
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom>
            Email уведомления
          </Typography>
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Новые кандидаты"
              sx={{ display: 'block', mb: 1 }}
            />
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Напоминания о собеседовании"
              sx={{ display: 'block', mb: 1 }}
            />
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Еженедельный отчет"
              sx={{ display: 'block', mb: 1 }}
            />
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Маркетинговые сообщения"
              sx={{ display: 'block', mb: 1 }}
            />
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            Push уведомления
          </Typography>
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Срочные уведомления"
              sx={{ display: 'block', mb: 1 }}
            />
            <FormControlLabel
              control={<Switch defaultChecked color="primary" />}
              label="Уведомления о упоминаниях"
              sx={{ display: 'block', mb: 1 }}
            />
          </Box>
          
          <Typography variant="subtitle1" gutterBottom>
            Интеграции уведомлений
          </Typography>
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Slack уведомления"
              sx={{ display: 'block', mb: 1 }}
            />
            <FormControlLabel
              control={<Switch color="primary" />}
              label="Интеграция с Telegram"
              sx={{ display: 'block', mb: 1 }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="contained" color="primary">
              Сохранить настройки
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default ProfileSettings;
