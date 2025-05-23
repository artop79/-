import React from 'react';
import { Card, styled } from '@mui/material';

// Стилизованная карточка в минималистичном дизайне
const StyledCard = styled(Card)(({ theme, elevation, variant }) => ({
  borderRadius: '12px',
  transition: 'all 0.2s ease-in-out',
  backgroundColor: '#fff',
  ...(variant === 'outlined' ? {
    border: '1px solid #E0E4E8',
    boxShadow: 'none',
  } : {
    border: 'none',
    boxShadow: elevation === 0 
      ? 'none' 
      : '0px 2px 8px rgba(0, 0, 0, 0.05)',
  }),
  '&:hover': {
    ...(variant !== 'outlined' && elevation !== 0 && {
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    })
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(2.5),
    '&:last-child': {
      paddingBottom: theme.spacing(2.5),
    },
  },
  '& .MuiCardHeader-root': {
    padding: theme.spacing(2, 2.5),
  },
  '& .MuiCardActions-root': {
    padding: theme.spacing(1.5, 2),
  },
}));

// Общий компонент карточки
const MinimalCard = (props) => {
  const { children, ...otherProps } = props;
  
  return (
    <StyledCard {...otherProps}>
      {children}
    </StyledCard>
  );
};

export default MinimalCard;
