import React from 'react';
import { Navigate } from 'react-router-dom';
import FixedAIInterviewer from './FixedAIInterviewer';

/**
 * Компонент AIInterviewerNew теперь просто перенаправляет на новый
 * компонент FixedAIInterviewer, который решает проблемы с
 * компонентами MuiPaper-root и Styled(div)
 */
const AIInterviewerNew = () => {
  // Мы можем либо перенаправить на новый URL, либо просто вернуть новый компонент
  // Вариант 1: Перенаправление
  // return <Navigate to="/ai-interviewer" replace />
  
  // Вариант 2: Рендер нового компонента напрямую
  return <FixedAIInterviewer />;
};

export default AIInterviewerNew;
