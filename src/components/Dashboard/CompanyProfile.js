import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Divider,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

const CompanyProfile = ({ minimal }) => {

  // Mini display for dashboard overview
  if (minimal) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <BusinessIcon sx={{ mr: 1 }} /> Company Profile
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" color="text.secondary" paragraph>
            Информация о компании, политики найма и активные вакансии.
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
        Company Profile
      </Typography>
      
      <Card variant="outlined" sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Основная информация
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Название компании"
              fullWidth
              defaultValue="Raplle Technologies"
              variant="outlined"
              sx={{ mb: 3 }}
            />
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Сфера деятельности</InputLabel>
              <Select
                label="Сфера деятельности"
                defaultValue="tech"
              >
                <MenuItem value="tech">Информационные технологии</MenuItem>
                <MenuItem value="finance">Финансы</MenuItem>
                <MenuItem value="healthcare">Здравоохранение</MenuItem>
                <MenuItem value="retail">Розничная торговля</MenuItem>
                <MenuItem value="manufacturing">Производство</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Размер компании</InputLabel>
              <Select
                label="Размер компании"
                defaultValue="11-50"
              >
                <MenuItem value="1-10">1-10 сотрудников</MenuItem>
                <MenuItem value="11-50">11-50 сотрудников</MenuItem>
                <MenuItem value="51-200">51-200 сотрудников</MenuItem>
                <MenuItem value="201+">201+ сотрудников</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              label="Страна/город"
              fullWidth
              defaultValue="Россия, Москва"
              variant="outlined"
              sx={{ mb: 3 }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ border: '2px dashed #e0e0e0', borderRadius: 1, p: 3, textAlign: 'center', mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Логотип компании
              </Typography>
              <Button variant="outlined">
                Загрузить логотип
              </Button>
            </Box>
            
            <TextField
              label="Описание компании"
              multiline
              rows={6}
              fullWidth
              defaultValue="Современная HR-платформа с AI-интервью, анализом резюме и автоматизацией рекрутинга."
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button variant="contained" color="primary">
                Сохранить изменения
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>
      
      <Card variant="outlined" sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Активные вакансии
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          У вас нет активных вакансий. Добавьте вакансию, чтобы начать поиск кандидатов.
        </Typography>
        
        <Button variant="outlined">
          Добавить вакансию
        </Button>
      </Card>
    </Box>
  );
};

export default CompanyProfile;
