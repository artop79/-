import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { MinimalCard } from './index';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const StatValue = styled(Typography)(({ theme }) => ({
  fontSize: '1.75rem',
  fontWeight: 600,
  marginBottom: theme.spacing(0.5),
  letterSpacing: '-0.025em',
}));

const TrendIndicator = styled(Box)(({ theme, positive }) => ({
  display: 'flex',
  alignItems: 'center',
  color: positive ? '#36B37E' : '#F44336',
  fontSize: '0.75rem',
  fontWeight: 500,
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '50%',
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

/**
 * StatisticCard - компонент для отображения статистических данных
 * 
 * @param {Object} props
 * @param {string} props.title - Заголовок карточки
 * @param {string|number} props.value - Значение статистики
 * @param {number} props.trend - Процент изменения (положительный или отрицательный)
 * @param {string} props.trendText - Текст для отображения под трендом (например, "от прошлого месяца")
 * @param {React.ReactNode} props.icon - Иконка для карточки
 * @param {string} props.iconBgColor - Цвет фона для иконки
 * @param {string} props.iconColor - Цвет иконки
 */
const StatisticCard = ({ 
  title, 
  value, 
  trend = 0, 
  trendText = "from last month", 
  icon,
  iconBgColor = '#EBF9F1',
  iconColor = '#36B37E'
}) => {
  const isPositive = trend >= 0;
  
  return (
    <MinimalCard elevation={0} variant="outlined" sx={{ height: '100%' }}>
      <Box sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            {title}
          </Typography>
          <IconWrapper sx={{ bgcolor: iconBgColor }}>
            {React.cloneElement(icon, { sx: { color: iconColor, fontSize: 20 } })}
          </IconWrapper>
        </Box>
        
        <StatValue>
          {value}
        </StatValue>
        
        <TrendIndicator positive={isPositive}>
          {isPositive ? (
            <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
          ) : (
            <TrendingDownIcon sx={{ fontSize: 14, mr: 0.5 }} />
          )}
          <Typography variant="body2" component="span" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
            {isPositive ? '+' : ''}{trend}% {trendText}
          </Typography>
        </TrendIndicator>
      </Box>
    </MinimalCard>
  );
};

export default StatisticCard;
