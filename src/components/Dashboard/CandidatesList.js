import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  Chip,
  Avatar,
  Rating,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Grid,
  Badge,
  Stack,
  Divider
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import VideocamIcon from '@mui/icons-material/Videocam';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import axios from 'axios';

// Имитация сервиса для получения проанализированных резюме
import { getAnalyzedResumes } from '../../services/resumeService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

// Стилизованные компоненты
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
  overflow: 'hidden',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  padding: '16px',
}));

const StyledTableHeadCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  fontWeight: 600,
  color: theme.palette.text.primary,
  whiteSpace: 'nowrap',
}));

const ScoreChip = styled(Chip)(({ theme, score }) => {
  let color = '#4caf50'; // Зеленый для высоких оценок
  if (score < 70) color = '#ff9800'; // Оранжевый для средних оценок
  if (score < 50) color = '#f44336'; // Красный для низких оценок
  
  return {
    backgroundColor: alpha(color, 0.1),
    color: color,
    fontWeight: 600,
    '& .MuiChip-label': {
      padding: '0 8px',
    }
  };
});

// Мок-данные кандидатов (позже будут заменены на данные из API)
const mockCandidates = [
  {
    id: 1,
    name: 'Алексей Смирнов',
    position: 'Frontend-разработчик',
    resumeScore: 85,
    matchPercentage: 92,
    status: 'Резюме проверено',
    resumeDate: '2025-05-15',
    keySkills: ['React', 'TypeScript', 'Redux'],
    avatar: '/mock-avatars/avatar1.jpg',
  },
  {
    id: 2,
    name: 'Мария Иванова',
    position: 'UX/UI дизайнер',
    resumeScore: 78,
    matchPercentage: 85,
    status: 'Резюме проверено',
    resumeDate: '2025-05-14',
    keySkills: ['Figma', 'Adobe XD', 'Прототипирование'],
    avatar: '/mock-avatars/avatar2.jpg',
  },
  {
    id: 3,
    name: 'Дмитрий Козлов',
    position: 'Backend-разработчик',
    resumeScore: 92,
    matchPercentage: 88,
    status: 'Резюме проверено',
    resumeDate: '2025-05-13',
    keySkills: ['Node.js', 'Python', 'MongoDB'],
    avatar: '/mock-avatars/avatar3.jpg',
  },
  {
    id: 4,
    name: 'Елена Петрова',
    position: 'Project Manager',
    resumeScore: 65,
    matchPercentage: 72,
    status: 'Резюме проверено',
    resumeDate: '2025-05-12',
    keySkills: ['Agile', 'Scrum', 'Jira'],
    avatar: '/mock-avatars/avatar4.jpg',
  },
  {
    id: 5,
    name: 'Иван Сидоров',
    position: 'DevOps инженер',
    resumeScore: 88,
    matchPercentage: 90,
    status: 'Резюме проверено',
    resumeDate: '2025-05-11',
    keySkills: ['Docker', 'Kubernetes', 'CI/CD'],
    avatar: '/mock-avatars/avatar5.jpg',
  },
];

// Мок-данные вакансий
const mockVacancies = [
  { id: 1, title: 'Frontend-разработчик (React)' },
  { id: 2, title: 'Backend-разработчик (Node.js)' },
  { id: 3, title: 'UX/UI дизайнер' },
  { id: 4, title: 'Project Manager' },
  { id: 5, title: 'DevOps инженер' },
];

const CandidatesList = ({ onSelectCandidate }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVacancy, setSelectedVacancy] = useState('all');
  const [sortBy, setSortBy] = useState('matchPercentage');
  const [sortDirection, setSortDirection] = useState('desc');

  // Имитация загрузки данных с сервера
  useEffect(() => {
    setLoading(true);
    
    // Имитация API-запроса с задержкой
    const timer = setTimeout(() => {
      setCandidates(mockCandidates);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Фильтрация кандидатов по поисковому запросу и вакансии
  const filteredCandidates = candidates.filter((candidate) => {
    // Фильтр по поисковому запросу
    const matchesQuery = 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.keySkills.some(skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    // Фильтр по выбранной вакансии
    const matchesVacancy = 
      selectedVacancy === 'all' || 
      candidate.position.includes(mockVacancies.find(v => v.id === parseInt(selectedVacancy))?.title || '');
    
    return matchesQuery && matchesVacancy;
  });

  // Сортировка кандидатов
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    const factor = sortDirection === 'asc' ? 1 : -1;
    
    if (sortBy === 'name') {
      return factor * a.name.localeCompare(b.name);
    } else if (sortBy === 'resumeDate') {
      return factor * (new Date(a.resumeDate) - new Date(b.resumeDate));
    } else {
      return factor * (a[sortBy] - b[sortBy]);
    }
  });

  // Обработчики пагинации
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Обработчик изменения сортировки
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  // Обработчик выбора кандидата для интервью
  const handleSelectForInterview = (candidate) => {
    if (onSelectCandidate) {
      onSelectCandidate(candidate);
    }
  };

  // Обработчик просмотра результатов анализа резюме
  const handleViewResumeAnalysis = (candidateId) => {
    // Здесь будет навигация к странице результатов анализа
    console.log('View resume analysis for candidate ID:', candidateId);
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Кандидаты с проанализированными резюме
      </Typography>
      
      {/* Панель фильтров и поиска */}
      <Box sx={{ display: 'flex', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <TextField
          placeholder="Поиск по имени или навыкам"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '250px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          size="small"
        />
        
        <FormControl sx={{ minWidth: '200px' }} size="small">
          <InputLabel id="vacancy-filter-label">Вакансия</InputLabel>
          <Select
            labelId="vacancy-filter-label"
            value={selectedVacancy}
            onChange={(e) => setSelectedVacancy(e.target.value)}
            label="Вакансия"
          >
            <MenuItem value="all">Все вакансии</MenuItem>
            {mockVacancies.map((vacancy) => (
              <MenuItem key={vacancy.id} value={vacancy.id.toString()}>
                {vacancy.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <StyledTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableHeadCell>Кандидат</StyledTableHeadCell>
                  <StyledTableHeadCell 
                    onClick={() => handleSortChange('matchPercentage')}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Соответствие
                      {sortBy === 'matchPercentage' && (
                        <SortIcon sx={{ ml: 0.5, fontSize: '1rem', transform: sortDirection === 'asc' ? 'rotate(180deg)' : 'none' }} />
                      )}
                    </Box>
                  </StyledTableHeadCell>
                  <StyledTableHeadCell 
                    onClick={() => handleSortChange('resumeScore')}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      Оценка резюме
                      {sortBy === 'resumeScore' && (
                        <SortIcon sx={{ ml: 0.5, fontSize: '1rem', transform: sortDirection === 'asc' ? 'rotate(180deg)' : 'none' }} />
                      )}
                    </Box>
                  </StyledTableHeadCell>
                  <StyledTableHeadCell>Ключевые навыки</StyledTableHeadCell>
                  <StyledTableHeadCell>Действия</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedCandidates
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((candidate) => (
                    <TableRow key={candidate.id}>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={candidate.avatar} sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="subtitle2">
                              {candidate.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {candidate.position}
                            </Typography>
                          </Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <ScoreChip 
                          label={`${candidate.matchPercentage}%`} 
                          score={candidate.matchPercentage}
                          size="small"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <ScoreChip 
                          label={candidate.resumeScore} 
                          score={candidate.resumeScore}
                          size="small"
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {candidate.keySkills.map((skill, index) => (
                            <Chip 
                              key={index}
                              label={skill}
                              size="small"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          ))}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Назначить AI-интервью">
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<VideocamIcon />}
                              onClick={() => handleSelectForInterview(candidate)}
                            >
                              Интервью
                            </Button>
                          </Tooltip>
                          <Tooltip title="Просмотреть анализ резюме">
                            <IconButton
                              size="small"
                              onClick={() => handleViewResumeAnalysis(candidate.id)}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </StyledTableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </StyledTableContainer>
          
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCandidates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </Paper>
  );
};

export default CandidatesList;
