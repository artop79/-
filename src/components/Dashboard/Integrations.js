import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';

// Mock integrations data
const integrations = [
  { 
    id: 'zoom', 
    name: 'Zoom', 
    description: 'Интеграция для проведения видео-интервью', 
    connected: true,
    logo: 'https://www.logo.wine/a/logo/Zoom_Video_Communications/Zoom_Video_Communications-Logo.wine.svg'
  },
  { 
    id: 'google-calendar', 
    name: 'Google Calendar', 
    description: 'Автоматическое планирование собеседований', 
    connected: true,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg'
  },
  { 
    id: 'bamboohr', 
    name: 'BambooHR', 
    description: 'Синхронизация кандидатов с HRM системой', 
    connected: false,
    logo: 'https://blog.bamboohr.com/wp-content/uploads/bamboohr-icon.png'
  },
  { 
    id: 'slack', 
    name: 'Slack', 
    description: 'Уведомления о событиях в Slack-каналах', 
    connected: false,
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/2048px-Slack_icon_2019.svg.png'
  }
];

const Integrations = ({ minimal }) => {

  // Mini display for dashboard overview
  if (minimal) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <IntegrationInstructionsIcon sx={{ mr: 1 }} /> Integrations
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary" paragraph>
            Подключено: {integrations.filter(i => i.connected).length} из {integrations.length}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="outlined"
              size="small"
            >
              Настроить
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Integrations
      </Typography>
      
      <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Доступные интеграции
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          {integrations.map((integration) => (
            <Grid item xs={12} md={6} key={integration.id}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ width: 40, height: 40, mr: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <img 
                        src={integration.logo} 
                        alt={integration.name} 
                        style={{ maxWidth: '100%', maxHeight: '100%' }} 
                      />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>
                        {integration.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {integration.description}
                      </Typography>
                    </Box>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={integration.connected}
                          color="primary"
                        />
                      }
                      label={integration.connected ? "Подключено" : "Отключено"}
                      labelPlacement="start"
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    {integration.connected ? (
                      <Button variant="outlined" size="small">
                        Настроить
                      </Button>
                    ) : (
                      <Button variant="contained" size="small">
                        Подключить
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Card>
      
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          API и Webhooks
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            API Ключ
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body2" sx={{ flexGrow: 1, fontFamily: 'monospace', bgcolor: '#f5f5f5', p: 1, borderRadius: 1 }}>
              ••••••••••••••••••••••••••••••
            </Typography>
            <Button variant="outlined" size="small" sx={{ ml: 2 }}>
              Просмотреть
            </Button>
            <Button variant="outlined" size="small" sx={{ ml: 1 }}>
              Обновить
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Используйте этот ключ для доступа к API Raplle. Никогда не публикуйте его в публичном коде.
          </Typography>
        </Box>
        
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Webhook URL
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: 'monospace', bgcolor: '#f5f5f5', p: 1, borderRadius: 1, mb: 2 }}>
            https://api.raplle.com/webhooks/12345
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Настройте свои системы для отправки событий на этот URL.
          </Typography>
        </Box>
      </Card>
    </Box>
  );
};

export default Integrations;
