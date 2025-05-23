import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  alpha,
  Tooltip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Компонент для улучшенного отображения опыта работы
const EnhancedExperienceCard = ({ experience, theme }) => {
  // Определяем цвет в зависимости от процента
  const getMatchColor = (match) => {
    if (match >= 70) return 'success';
    if (match >= 50) return 'warning';
    return 'error';
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        borderRadius: 2,
        backgroundColor: alpha(theme.palette.background.default, 0.5),
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        '&:hover': {
          boxShadow: `0 4px 10px ${alpha(theme.palette.primary.main, 0.1)}`,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {experience.position}
          </Typography>
          <Typography variant="body2" gutterBottom>
            {experience.company} | {experience.period}
          </Typography>
        </Box>
        <Chip 
          label={`${experience.relevance}%`} 
          size="small" 
          color={getMatchColor(experience.relevance)}
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
      
      <Box sx={{ my: 1.5 }}>
        <Tooltip title={`Релевантность для вакансии: ${experience.relevance}%`} arrow>
          <LinearProgress 
            variant="determinate" 
            value={experience.relevance} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.grey[300], 0.5),
              '& .MuiLinearProgress-bar': {
                backgroundColor: 
                  experience.relevance >= 70 ? theme.palette.success.main :
                  experience.relevance >= 50 ? theme.palette.warning.main :
                  theme.palette.error.main
              }
            }}
          />
        </Tooltip>
      </Box>
      
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {experience.comment || "Нет комментария"}
      </Typography>
      
      <Box sx={{ mt: 1.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 500, display: 'flex', alignItems: 'center' }}>
          <CheckCircleIcon fontSize="small" sx={{ mr: 0.5, color: 'success.main' }} />
          Ключевые достижения:
        </Typography>
        <List dense disablePadding sx={{ mt: 0.5 }}>
          {experience.achievements && experience.achievements.map((achievement, i) => (
            <ListItem key={i} sx={{ py: 0.5, px: 1 }}>
              <ListItemText 
                primary={achievement} 
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default EnhancedExperienceCard;
