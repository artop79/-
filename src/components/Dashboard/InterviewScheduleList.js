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
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import VideocamIcon from '@mui/icons-material/Videocam';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import { format } from 'date-fns/format';
import { ru } from 'date-fns/locale/ru';

// Стилизованные компоненты
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
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

const StatusChip = styled(Chip)(({ theme, status }) => {
  let color, bgcolor;
  
  switch (status) {
    case 'scheduled':
      color = theme.palette.info.main;
      bgcolor = alpha(theme.palette.info.main, 0.1);
      break;
    case 'completed':
      color = theme.palette.success.main;
      bgcolor = alpha(theme.palette.success.main, 0.1);
      break;
    case 'canceled':
      color = theme.palette.error.main;
      bgcolor = alpha(theme.palette.error.main, 0.1);
      break;
    case 'in_progress':
      color = theme.palette.warning.main;
      bgcolor = alpha(theme.palette.warning.main, 0.1);
      break;
    default:
      color = theme.palette.text.secondary;
      bgcolor = alpha(theme.palette.text.secondary, 0.1);
  }
  
  return {
    backgroundColor: bgcolor,
    color: color,
    fontWeight: 500,
    '& .MuiChip-label': {
      padding: '0 8px',
    }
  };
});

// Мок-данные интервью
const mockInterviews = [
  {
    id: 1,
    candidateName: 'Алексей Смирнов',
    position: 'Frontend-разработчик',
    status: 'scheduled',
    scheduledAt: '2025-05-20T14:30:00',
    duration: 30,
    avatar: '/mock-avatars/avatar1.jpg',
    zoomLink: 'https://zoom.us/j/123456789',
    resumeScore: 85,
  },
  {
    id: 2,
    candidateName: 'Мария Иванова',
    position: 'UX/UI дизайнер',
    status: 'completed',
    scheduledAt: '2025-05-17T11:00:00',
    duration: 45,
    avatar: '/mock-avatars/avatar2.jpg',
    zoomLink: 'https://zoom.us/j/987654321',
    resumeScore: 78,
  },
  {
    id: 3,
    candidateName: 'Дмитрий Козлов',
    position: 'Backend-разработчик',
    status: 'in_progress',
    scheduledAt: '2025-05-18T16:15:00',
    duration: 60,
    avatar: '/mock-avatars/avatar3.jpg',
    zoomLink: 'https://zoom.us/j/456789123',
    resumeScore: 92,
  },
  {
    id: 4,
    candidateName: 'Елена Петрова',
    position: 'Project Manager',
    status: 'canceled',
    scheduledAt: '2025-05-21T10:00:00',
    duration: 45,
    avatar: '/mock-avatars/avatar4.jpg',
    zoomLink: 'https://zoom.us/j/321654987',
    resumeScore: 65,
  },
  {
    id: 5,
    candidateName: 'Иван Сидоров',
    position: 'DevOps инженер',
    status: 'scheduled',
    scheduledAt: '2025-05-22T13:45:00',
    duration: 60,
    avatar: '/mock-avatars/avatar5.jpg',
    zoomLink: 'https://zoom.us/j/789123456',
    resumeScore: 88,
  },
];

// Компонент для списка запланированных интервью
const InterviewScheduleList = ({ onViewInterview, onEditInterview, onJoinInterview }) => {
  const theme = useTheme();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [tabValue, setTabValue] = useState(0);

  // Имитация загрузки данных с сервера
  useEffect(() => {
    setLoading(true);
    
    // Имитация API-запроса с задержкой
    const timer = setTimeout(() => {
      setInterviews(mockInterviews);
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Фильтрация интервью по поисковому запросу и статусу
  const filteredInterviews = interviews.filter((interview) => {
    // Фильтр по поисковому запросу
    const matchesQuery = 
      interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Фильтр по статусу
    const matchesStatus = statusFilter === 'all' || interview.status === statusFilter;
    
    // Фильтр по вкладке
    let matchesTab = true;
    if (tabValue === 1) { // Предстоящие
      matchesTab = interview.status === 'scheduled';
    } else if (tabValue === 2) { // Завершенные
      matchesTab = interview.status === 'completed';
    }
    
    return matchesQuery && matchesStatus && matchesTab;
  });

  // Обработчики пагинации
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Обработчик изменения вкладки
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Форматирование даты и времени
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMMM yyyy, HH:mm', { locale: ru });
    } catch (error) {
      return dateString;
    }
  };

  // Получение иконки для статуса
  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <HourglassEmptyIcon fontSize="small" />;
      case 'completed':
        return <CheckCircleOutlineIcon fontSize="small" />;
      case 'canceled':
        return <CancelIcon fontSize="small" />;
      case 'in_progress':
        return <VideoCallIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Получение текста для статуса
  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Запланировано';
      case 'completed':
        return 'Завершено';
      case 'canceled':
        return 'Отменено';
      case 'in_progress':
        return 'В процессе';
      default:
        return status;
    }
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Интервью с AI-интервьюером
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Все интервью" />
          <Tab label="Предстоящие" />
          <Tab label="Завершенные" />
        </Tabs>
      </Box>
      
      {/* Панель фильтров и поиска */}
      <Box sx={{ display: 'flex', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <TextField
          placeholder="Поиск по имени кандидата"
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
          <InputLabel id="status-filter-label">Статус</InputLabel>
          <Select
            labelId="status-filter-label"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Статус"
          >
            <MenuItem value="all">Все статусы</MenuItem>
            <MenuItem value="scheduled">Запланировано</MenuItem>
            <MenuItem value="in_progress">В процессе</MenuItem>
            <MenuItem value="completed">Завершено</MenuItem>
            <MenuItem value="canceled">Отменено</MenuItem>
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
                  <StyledTableHeadCell>Дата и время</StyledTableHeadCell>
                  <StyledTableHeadCell>Статус</StyledTableHeadCell>
                  <StyledTableHeadCell>Детали</StyledTableHeadCell>
                  <StyledTableHeadCell>Действия</StyledTableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInterviews
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((interview) => (
                    <TableRow key={interview.id}>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar src={interview.avatar} sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="subtitle2">
                              {interview.candidateName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {interview.position}
                            </Typography>
                          </Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarTodayIcon sx={{ fontSize: '1rem', mr: 1, color: theme.palette.text.secondary }} />
                          <Typography variant="body2">
                            {formatDateTime(interview.scheduledAt)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: '1rem', mr: 1, color: theme.palette.text.secondary }} />
                          <Typography variant="body2" color="text.secondary">
                            {interview.duration} минут
                          </Typography>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <StatusChip 
                          label={getStatusText(interview.status)} 
                          status={interview.status}
                          size="small"
                          icon={getStatusIcon(interview.status)}
                        />
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column', alignItems: 'flex-start' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ mr: 1 }}>
                              Оценка резюме:
                            </Typography>
                            <Chip 
                              label={interview.resumeScore} 
                              size="small"
                              color={interview.resumeScore >= 80 ? 'success' : interview.resumeScore >= 60 ? 'warning' : 'error'}
                              variant="outlined"
                            />
                          </Box>
                          {interview.status !== 'canceled' && (
                            <Tooltip title="Ссылка на Zoom-встречу">
                              <Button
                                startIcon={<LinkIcon />}
                                size="small"
                                sx={{ mt: 1, textTransform: 'none' }}
                                onClick={() => window.open(interview.zoomLink, '_blank')}
                              >
                                Zoom-ссылка
                              </Button>
                            </Tooltip>
                          )}
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {interview.status === 'scheduled' && (
                            <Tooltip title="Присоединиться к интервью">
                              <Button
                                variant="contained"
                                size="small"
                                color="primary"
                                startIcon={<VideocamIcon />}
                                onClick={() => onJoinInterview && onJoinInterview(interview)}
                              >
                                Присоединиться
                              </Button>
                            </Tooltip>
                          )}
                          
                          {interview.status === 'completed' && (
                            <Tooltip title="Просмотреть результаты">
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<VisibilityIcon />}
                                onClick={() => onViewInterview && onViewInterview(interview)}
                              >
                                Результаты
                              </Button>
                            </Tooltip>
                          )}
                          
                          {interview.status === 'scheduled' && (
                            <Tooltip title="Редактировать">
                              <IconButton
                                size="small"
                                onClick={() => onEditInterview && onEditInterview(interview)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          
                          {interview.status === 'scheduled' && (
                            <Tooltip title="Отменить интервью">
                              <IconButton
                                size="small"
                                color="error"
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
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
            count={filteredInterviews.length}
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

export default InterviewScheduleList;
