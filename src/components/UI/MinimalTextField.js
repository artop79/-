import React from 'react';
import { TextField, styled } from '@mui/material';

// Стилизованное текстовое поле в минималистичном дизайне
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#fff',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#CED4DA',
    },
    '&.Mui-focused': {
      boxShadow: '0 0 0 4px rgba(54, 179, 126, 0.1)',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#36B37E',
        borderWidth: '1px',
      },
    },
    '&.Mui-error': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: '#F44336',
      },
      '&.Mui-focused': {
        boxShadow: '0 0 0 4px rgba(244, 67, 54, 0.1)',
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E0E4E8',
      transition: theme.transitions.create(['border-color']),
    },
    '& .MuiOutlinedInput-input': {
      padding: '12px 14px',
      fontSize: '0.875rem',
      '&::placeholder': {
        color: '#A0AEC0',
        opacity: 1,
      },
    },
  },
  '& .MuiInputLabel-outlined': {
    fontSize: '0.875rem',
    transform: 'translate(14px, 13px) scale(1)',
    color: '#5F6C7B',
    '&.Mui-focused': {
      color: '#36B37E',
    },
    '&.Mui-error': {
      color: '#F44336',
    },
  },
  '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
    transform: 'translate(14px, -6px) scale(0.75)',
  },
  '& .MuiFormHelperText-root': {
    fontSize: '0.75rem',
    marginLeft: '2px',
    marginTop: '4px',
  },
}));

// Общий компонент текстового поля
const MinimalTextField = (props) => {
  return <StyledTextField {...props} />;
};

export default MinimalTextField;
