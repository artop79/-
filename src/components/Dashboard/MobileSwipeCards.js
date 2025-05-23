import React, { useEffect, useRef } from 'react';
import {
  Card, CardContent, Box, Typography, Chip, Avatar, Button
} from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import './SwipeCards.css';

const MobileSwipeCards = ({ 
  candidates, 
  selectedCandidate, 
  handleSelectCandidate,
  page,
  rowsPerPage
}) => {
  const containerRef = useRef(null);
  
  // Отслеживаем скролл для обнаружения выбранной карточки
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      // Получаем видимые карточки
      const container = containerRef.current;
      const cards = Array.from(container.querySelectorAll('.swipe-card'));
      
      // Находим карточку в центре (наиболее видимую)
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      let closestCard = null;
      let minDistance = Infinity;
      
      cards.forEach(card => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        
        if (distance < minDistance) {
          minDistance = distance;
          closestCard = card;
        }
      });
      
      // Если нашли карточку в центре и это не текущая выбранная, выбираем ее
      if (closestCard && closestCard.dataset.candidateId) {
        const candidateId = parseInt(closestCard.dataset.candidateId, 10);
        const candidate = candidates.find(c => c.id === candidateId);
        
        if (candidate && (!selectedCandidate || selectedCandidate.id !== candidate.id)) {
          // Добавляем небольшую задержку, чтобы избежать слишком частых вызовов при скролле
          clearTimeout(container.scrollTimer);
          container.scrollTimer = setTimeout(() => {
            // Обновляем выбранного кандидата, но НЕ переходим к следующему шагу
            // Это позволит пользователю сначала выбрать кандидата и явно нажать кнопку
            if (!selectedCandidate || selectedCandidate.id !== candidate.id) {
              // Мы не вызываем handleSelectCandidate здесь, так как он автоматически
              // переходит к следующему шагу. Вместо этого мы только подсвечиваем выбор.
            }
          }, 150);
        }
      }
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [candidates, selectedCandidate]);
  
  // Делаем прокрутку к выбранному кандидату при изменении
  useEffect(() => {
    if (selectedCandidate && containerRef.current) {
      const container = containerRef.current;
      const selectedElement = container.querySelector(`[data-candidate-id="${selectedCandidate.id}"]`);
      
      if (selectedElement) {
        container.scrollTo({
          left: selectedElement.offsetLeft - (container.offsetWidth - selectedElement.offsetWidth) / 2,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedCandidate]);
  
  // Модифицированный обработчик выбора кандидата
  const handleCandidateSelect = (candidate) => {
    handleSelectCandidate(candidate);
  };
  return (
    <Box sx={{ mt: 2 }}>
      {/* Подсказка свайпа */}
      <div className="swipe-hint">
        <span className="arrow-left">←</span>
        Листайте для выбора кандидата
        <span className="arrow-right">→</span>
      </div>
      
      <div className="swipe-container" ref={containerRef}>
        <div className="scroll-track"></div>
        
        {candidates
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((candidate) => (
            <div 
              key={candidate.id} 
              data-candidate-id={candidate.id}
              className={`swipe-card ${selectedCandidate?.id === candidate.id ? 'swipe-card-selected' : ''}`}
            >
              <Card
                variant="outlined"
                sx={{
                  height: '100%',
                  width: '100%',
                  borderRadius: 2,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  }
                }}
              >
                <CardContent sx={{ p: { xs: 2 } }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar src={candidate.avatar} sx={{ mr: 1.5, width: 40, height: 40 }} />
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                          {candidate.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {candidate.position}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">Соответствие:</Typography>
                    <Chip 
                      label={`${candidate.matchPercentage}%`} 
                      color={candidate.matchPercentage >= 80 ? 'success' : candidate.matchPercentage >= 60 ? 'warning' : 'error'}
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">Оценка резюме:</Typography>
                    <Chip 
                      label={candidate.resumeScore} 
                      color={candidate.resumeScore >= 80 ? 'success' : candidate.resumeScore >= 60 ? 'warning' : 'error'}
                      size="small"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>Ключевые навыки:</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {candidate.keySkills.map((skill, index) => (
                      <Chip 
                        key={index}
                        label={skill}
                        size="small"
                        sx={{ height: 24, fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                  
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      startIcon={<VideocamIcon />}
                      onClick={() => handleCandidateSelect(candidate)}
                      sx={{ 
                        px: 1.5, 
                        py: 0.75,
                        fontSize: '0.8rem',
                        fontWeight: 'medium'
                      }}
                    >
                      Выбрать
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </div>
          ))}
      </div>
      
      {/* Индикаторы прокрутки */}
      <div className="swipe-indicators">
        {candidates
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((candidate, index) => (
            <div 
              key={index}
              className={`swipe-indicator ${selectedCandidate?.id === candidate.id ? 'swipe-indicator-active' : ''}`}
            />
          ))}
      </div>
    </Box>
  );
};

export default MobileSwipeCards;
