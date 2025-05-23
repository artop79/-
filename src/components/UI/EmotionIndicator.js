import React from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import PsychologyIcon from '@mui/icons-material/Psychology';

/**
 * Компонент индикатора эмоций для отображения текущего эмоционального состояния диалога
 * @param {Object} props - свойства компонента
 * @param {string} props.emotion - эмоциональное состояние ('positive', 'negative', 'neutral', 'contemplative')
 * @param {string} props.size - размер иконки ('small', 'medium', 'large')
 * @param {boolean} props.showLabel - отображать текстовую метку
 * @returns {JSX.Element} - индикатор эмоций
 */
const EmotionIndicator = ({ emotion = 'neutral', size = 'medium', showLabel = false }) => {
  // Определение параметров отображения для разных эмоциональных состояний
  const emotionConfig = {
    positive: {
      icon: <SentimentSatisfiedAltIcon fontSize={size} />,
      color: '#4caf50',
      label: 'Позитивно',
      tooltip: 'Позитивный тон общения'
    },
    negative: {
      icon: <SentimentVeryDissatisfiedIcon fontSize={size} />,
      color: '#f44336',
      label: 'Негативно',
      tooltip: 'Негативный тон общения'
    },
    contemplative: {
      icon: <PsychologyIcon fontSize={size} />,
      color: '#2196f3',
      label: 'Вдумчиво',
      tooltip: 'Вдумчивый, размышляющий тон общения'
    },
    neutral: {
      icon: <SentimentNeutralIcon fontSize={size} />,
      color: '#9e9e9e',
      label: 'Нейтрально',
      tooltip: 'Нейтральный тон общения'
    }
  };

  // Выбираем конфигурацию для текущей эмоции или используем нейтральную по умолчанию
  const config = emotionConfig[emotion] || emotionConfig.neutral;

  return (
    <Tooltip title={config.tooltip}>
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: config.color,
          '& svg': {
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.2)'
            }
          }
        }}
      >
        {config.icon}
        {showLabel && (
          <Typography 
            variant="caption" 
            sx={{ ml: 0.5, fontWeight: 'medium' }}
          >
            {config.label}
          </Typography>
        )}
      </Box>
    </Tooltip>
  );
};

export default EmotionIndicator;
