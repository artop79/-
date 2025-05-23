import React from 'react';
import { Button, styled } from '@mui/material';

// Стилизованная кнопка в минималистичном дизайне
const StyledButton = styled(Button)(({ theme, variant, color }) => {
  const baseStyles = {
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '0.875rem',
    fontWeight: 500,
    textTransform: 'none',
    boxShadow: 'none',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      boxShadow: 'none',
    },
    '&.MuiButton-sizeLarge': {
      padding: '12px 20px',
      fontSize: '0.95rem',
    },
    '&.MuiButton-sizeSmall': {
      padding: '6px 12px',
      fontSize: '0.75rem',
    },
  };

  // Стили для различных вариантов кнопки
  const variantStyles = {
    contained: {
      ...(color === 'primary' && {
        backgroundColor: '#36B37E',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#2E9763',
        },
      }),
      ...(color === 'secondary' && {
        backgroundColor: '#4682B4',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#3B6D94',
        },
      }),
      ...(color === 'error' && {
        backgroundColor: '#F44336',
        color: '#fff',
        '&:hover': {
          backgroundColor: '#D32F2F',
        },
      }),
      ...(color === 'info' && {
        backgroundColor: '#F6F8FA',
        color: '#5F6C7B',
        '&:hover': {
          backgroundColor: '#E9EDF1',
        },
      }),
    },
    outlined: {
      borderWidth: '1px',
      ...(color === 'primary' && {
        borderColor: '#36B37E',
        color: '#36B37E',
        '&:hover': {
          borderColor: '#2E9763',
          backgroundColor: 'rgba(54, 179, 126, 0.04)',
        },
      }),
      ...(color === 'secondary' && {
        borderColor: '#4682B4',
        color: '#4682B4',
        '&:hover': {
          borderColor: '#3B6D94',
          backgroundColor: 'rgba(70, 130, 180, 0.04)',
        },
      }),
      ...(color === 'error' && {
        borderColor: '#F44336',
        color: '#F44336',
        '&:hover': {
          borderColor: '#D32F2F',
          backgroundColor: 'rgba(244, 67, 54, 0.04)',
        },
      }),
      ...(color === 'info' && {
        borderColor: '#E0E4E8',
        color: '#5F6C7B',
        '&:hover': {
          borderColor: '#CED4DA',
          backgroundColor: 'rgba(95, 108, 123, 0.04)',
        },
      }),
    },
    text: {
      ...(color === 'primary' && {
        color: '#36B37E',
        '&:hover': {
          backgroundColor: 'rgba(54, 179, 126, 0.04)',
        },
      }),
      ...(color === 'secondary' && {
        color: '#4682B4',
        '&:hover': {
          backgroundColor: 'rgba(70, 130, 180, 0.04)',
        },
      }),
      ...(color === 'error' && {
        color: '#F44336',
        '&:hover': {
          backgroundColor: 'rgba(244, 67, 54, 0.04)',
        },
      }),
      ...(color === 'info' && {
        color: '#5F6C7B',
        '&:hover': {
          backgroundColor: 'rgba(95, 108, 123, 0.04)',
        },
      }),
    },
  };

  return {
    ...baseStyles,
    ...(variantStyles[variant] || {}),
  };
});

// Общий компонент кнопки
const MinimalButton = (props) => {
  const { children, ...otherProps } = props;
  
  return (
    <StyledButton {...otherProps}>
      {children}
    </StyledButton>
  );
};

export default MinimalButton;
