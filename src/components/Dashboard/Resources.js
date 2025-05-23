import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ArticleIcon from '@mui/icons-material/Article';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import HelpIcon from '@mui/icons-material/Help';

const Resources = ({ minimal }) => {

  // Mini display for dashboard overview
  if (minimal) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <MenuBookIcon sx={{ mr: 1 }} /> Resources
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary" paragraph>
            Документация, API Reference, обучающие материалы и поддержка.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
            >
              Открыть
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Resources
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ArticleIcon sx={{ mr: 1 }} /> Документация
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <List>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Начало работы с Raplle" 
                    secondary="Руководство по быстрому старту"
                  />
                </ListItem>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Загрузка и анализ резюме" 
                    secondary="Подробная инструкция по работе с модулем анализа резюме"
                  />
                </ListItem>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Проведение AI-интервью" 
                    secondary="Как настроить и провести автоматизированное собеседование"
                  />
                </ListItem>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Интеграции с внешними системами" 
                    secondary="Подключение к HRM, Zoom и другим сервисам"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CodeIcon sx={{ mr: 1 }} /> API Reference
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" paragraph>
                Полная документация по API Raplle для интеграции с вашими системами.
              </Typography>
              
              <List>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Аутентификация" 
                    secondary="OAuth 2.0 и API ключи"
                  />
                </ListItem>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Resume API" 
                    secondary="Загрузка и анализ резюме через API"
                  />
                </ListItem>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Interview API" 
                    secondary="Управление интервью и получение результатов"
                  />
                </ListItem>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Webhooks" 
                    secondary="События и подписки на обновления"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SchoolIcon sx={{ mr: 1 }} /> Обучение
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" paragraph>
                Обучающие материалы, видео и интерактивные руководства по работе с платформой.
              </Typography>
              
              <List>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Обучающие видео" 
                    secondary="Серия видеоуроков по работе с платформой"
                  />
                </ListItem>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Вебинары" 
                    secondary="Записи прошедших вебинаров и расписание будущих"
                  />
                </ListItem>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Кейсы использования" 
                    secondary="Примеры успешного применения Raplle в разных компаниях"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <HelpIcon sx={{ mr: 1 }} /> Поддержка
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Typography variant="body2" paragraph>
                Получите помощь при возникновении вопросов или проблем с платформой.
              </Typography>
              
              <List>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Часто задаваемые вопросы" 
                    secondary="Ответы на популярные вопросы пользователей"
                  />
                </ListItem>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Связаться с поддержкой" 
                    secondary="Создать заявку в техническую поддержку"
                  />
                </ListItem>
                <ListItem button component="a" href="#" sx={{ borderRadius: 1 }}>
                  <ListItemText 
                    primary="Сообщество" 
                    secondary="Форум пользователей Raplle"
                  />
                </ListItem>
              </List>
              
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                >
                  Чат с поддержкой
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Resources;
