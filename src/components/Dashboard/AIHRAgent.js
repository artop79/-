import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const AIHRAgent = ({ minimal }) => {

  // Mini display for dashboard overview
  if (minimal) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AutoAwesomeIcon sx={{ mr: 1 }} /> AI HR Agent
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary" paragraph>
            Автоматическая коммуникация с кандидатами и планирование собеседований.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              variant="contained"
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
        AI HR Agent
      </Typography>
      
      <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Функция в разработке
        </Typography>
        <Typography variant="body1" paragraph>
          Автоматическая коммуникация с кандидатами, приглашения, отказы, уведомления и умное планирование Zoom-собеседований.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Этот модуль будет доступен в ближайшее время.
        </Typography>
      </Card>
    </Box>
  );
};

export default AIHRAgent;
