import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

/**
 * Компонент кнопки возврата на главное меню
 * @param {boolean} compact - Компактный режим отображения (только иконка)
 */
const HomeButton = ({ compact = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const handleReturnToHome = () => {
    navigate('/dashboard');
  };
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0, mt: 1 }}>
      <IconButton 
        onClick={handleReturnToHome}
        aria-label="Вернуться на главную"
        size={compact ? "small" : "medium"}
        sx={{ 
          color: theme.palette.primary.main,
          padding: 0,
          ...(compact ? {} : {
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          }),
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          }
        }}
      >
        <img 
          src="/logo.svg" 
          alt="Raplle Logo" 
          style={{ 
            width: compact ? 28 : 42, 
            height: compact ? 28 : 42,
            objectFit: 'contain',
            display: 'block'
          }} 
        />
      </IconButton>
    </Box>
  );
};

export default HomeButton;
