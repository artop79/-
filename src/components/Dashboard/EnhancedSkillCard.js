import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  alpha,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';

// Компонент для улучшенного отображения карточки навыка
const EnhancedSkillCard = ({ skill, theme }) => {
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
        <Tooltip title={`Уровень соответствия: ${skill.match}%`} arrow>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {skill.skill}
          </Typography>
        </Tooltip>
        <Chip 
          label={`${skill.match}%`} 
          size="small" 
          color={getMatchColor(skill.match)}
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
      
      <Box sx={{ my: 1.5 }}>
        <Tooltip title={`Уровень владения навыком: ${skill.match}%`} arrow>
          <LinearProgress 
            variant="determinate" 
            value={skill.match} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: alpha(theme.palette.grey[300], 0.5),
              '& .MuiLinearProgress-bar': {
                backgroundColor: 
                  skill.match >= 70 ? theme.palette.success.main :
                  skill.match >= 50 ? theme.palette.warning.main :
                  theme.palette.error.main
              }
            }}
          />
        </Tooltip>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.5 }}>
        <Tooltip title={skill.category === 'hard_skill' ? 'Технический навык' : 'Мягкий навык'} arrow>
          <Chip 
            label={skill.category === 'hard_skill' ? 'Технический' : 'Мягкий'} 
            size="small"
            variant="outlined"
            color={skill.category === 'hard_skill' ? 'primary' : 'secondary'}
            icon={skill.category === 'hard_skill' ? <CodeIcon fontSize="small" /> : <TipsAndUpdatesIcon fontSize="small" />}
          />
        </Tooltip>
        
        <Tooltip title={`Релевантность для вакансии: ${skill.relevance}`} arrow>
          <Chip 
            label={skill.relevance} 
            size="small"
            variant="outlined"
            sx={{
              borderColor: 
                skill.relevance === 'Высокая' ? theme.palette.success.main :
                skill.relevance === 'Средняя' ? theme.palette.warning.main :
                theme.palette.info.main,
              color: 
                skill.relevance === 'Высокая' ? theme.palette.success.main :
                skill.relevance === 'Средняя' ? theme.palette.warning.main :
                theme.palette.info.main
            }}
          />
        </Tooltip>
      </Box>
      
      <Tooltip title="Комментарий ИИ о навыке" arrow placement="bottom-start">
        <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
          {skill.comment || "Нет комментария"}
        </Typography>
      </Tooltip>
    </Paper>
  );
};

export default EnhancedSkillCard;
