import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

// Стилизованная кнопка с минимальным дизайном
export const MinimalButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  textTransform: 'none',
  fontWeight: 500,
}));

export default {
  MinimalButton
};
