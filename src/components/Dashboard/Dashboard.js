import React, { useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent 
} from '@mui/material';
import SidebarNew from './SidebarNew';
import Header from './Header';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

// Styled Components
const MainContent = styled(Box)(({ theme }) => ({
  marginLeft: 220,
  marginRight: 0,
  padding: theme.spacing(3),
  width: 'calc(100% - 220px)',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: '#212E48',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
  borderRadius: 16,
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  height: '100%',
  position: 'relative',
}));

const MetricValue = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '24px',
  letterSpacing: '-0.5px',
  color: '#fff',
  marginBottom: theme.spacing(1),
}));

const TrendIndicator = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  fontSize: '0.75rem',
  fontWeight: 500,
}));

// Компонент для статистической карточки
const StatisticCard = ({ title, value, trend, trendText, icon, iconBgColor, iconColor }) => {
  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            backgroundColor: iconBgColor || 'rgba(54, 153, 255, 0.1)', 
            width: 40, 
            height: 40, 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          <TrendIndicator sx={{ 
            color: trend >= 0 ? '#36B37E' : '#F44336',
            bgcolor: trend >= 0 ? 'rgba(54, 179, 126, 0.1)' : 'rgba(244, 67, 54, 0.1)',
            px: 1,
            py: 0.5,
            borderRadius: 1
          }}>
            {trend}% {trendText}
          </TrendIndicator>
        </Box>
        <MetricValue>{value}</MetricValue>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  return (
    <Box sx={{ display: 'flex' }}>
      <SidebarNew activeTab={activeTab} />
      <Header />
      <MainContent>
        <Box sx={{ pt: 8, pb: 2 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>
            Добро пожаловать в дашборд
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <StatisticCard 
                title="Всего резюме"
                value="1,256"
                trend={7.2}
                trendText="с прошлого месяца"
                icon={<AssessmentIcon sx={{ color: '#3699FF' }} />}
                iconBgColor="rgba(54, 153, 255, 0.1)"
                iconColor="#3699FF"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <StatisticCard 
                title="Проведено интервью"
                value="124"
                trend={5.2}
                trendText="с прошлого месяца"
                icon={<PeopleAltIcon sx={{ color: '#36B37E' }} />}
                iconBgColor="rgba(54, 179, 126, 0.1)"
                iconColor="#36B37E"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <StatisticCard 
                title="Нанято кандидатов"
                value="32"
                trend={2.3}
                trendText="с прошлого месяца"
                icon={<PersonAddIcon sx={{ color: '#6261B6' }} />}
                iconBgColor="rgba(98, 97, 182, 0.1)"
                iconColor="#6261B6"
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <StatisticCard 
                title="Средний балл"
                value="72%"
                trend={-1.8}
                trendText="с прошлого месяца"
                icon={<AssessmentIcon sx={{ color: '#F44336' }} />}
                iconBgColor="rgba(244, 67, 54, 0.1)"
                iconColor="#F44336"
              />
            </Grid>
          </Grid>
        </Box>
      </MainContent>
    </Box>
  );
};

export default Dashboard;
