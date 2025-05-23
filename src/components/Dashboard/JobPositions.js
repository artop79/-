import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography,
  Button, 
  Grid, 
  TextField, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle,
  IconButton,
  Chip,
  Divider,
  Card,
  CardContent,
  CardActions,
  Menu,
  MenuItem,
  Avatar,
  alpha,
  useTheme,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  Autocomplete
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ListIcon from '@mui/icons-material/List';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import InfoIcon from '@mui/icons-material/Info';
import SearchIcon from '@mui/icons-material/Search';
import CompareIcon from '@mui/icons-material/Compare';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EditNoteIcon from '@mui/icons-material/EditNote';
import StarIcon from '@mui/icons-material/Star';
import DateRangeIcon from '@mui/icons-material/DateRange';
import MarketJobCreator from './MarketJobCreator';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import HomeButton from './HomeButton';

// Стилизованные компоненты
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.background.paper, 0.7),
  backdropFilter: 'blur(5px)',
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.1)}`,
  position: 'relative',
  overflow: 'hidden',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: `0 12px 28px ${alpha(theme.palette.common.black, 0.15)}`,
  }
}));

const MinimalButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  textTransform: 'none',
  fontWeight: 500,
}));

const StatusChip = styled(Chip)(({ theme, status }) => {
  const getColor = () => {
    switch(status) {
      case 'active': return theme.palette.success.main;
      case 'draft': return theme.palette.info.main;
      case 'closed': return theme.palette.text.secondary;
      default: return theme.palette.primary.main;
    }
  };
  
  return {
    backgroundColor: alpha(getColor(), 0.1),
    color: getColor(),
    fontWeight: 500,
    '& .MuiChip-label': {
      padding: '0 8px',
    }
  };
});

// Моковые данные для вакансий
const initialJobs = [
  {
    id: 1,
    title: 'Frontend-разработчик (React)',
    status: 'active',
    department: 'Разработка',
    location: 'Москва',
    candidates: 12,
    description: 'Разработка пользовательских интерфейсов на React, оптимизация производительности и интеграция с API.',
    requirements: [
      'Опыт коммерческой разработки на React от 2 лет',
      'Уверенное знание JavaScript, TypeScript',
      'Опыт работы с Redux, React Router',
      'Понимание принципов адаптивной верстки',
      'Опыт работы с REST API'
    ],
    dateCreated: '2025-04-15'
  },
  {
    id: 2,
    title: 'Backend-разработчик (Node.js)',
    status: 'active',
    department: 'Разработка',
    location: 'Санкт-Петербург',
    candidates: 8,
    description: 'Разработка серверной части приложений на Node.js, работа с базами данных, API и микросервисной архитектурой.',
    requirements: [
      'Опыт коммерческой разработки на Node.js от 3 лет',
      'Знание Express.js, NestJS',
      'Опыт работы с PostgreSQL, MongoDB',
      'Понимание принципов RESTful API',
      'Опыт работы с Docker'
    ],
    dateCreated: '2025-04-20'
  },
  {
    id: 3,
    title: 'UI/UX дизайнер',
    status: 'draft',
    department: 'Дизайн',
    location: 'Удаленно',
    candidates: 0,
    description: 'Разработка дизайн-систем, пользовательских интерфейсов и прототипов для веб и мобильных приложений.',
    requirements: [
      'Опыт работы в UI/UX дизайне от 2 лет',
      'Опыт работы с Figma, Sketch',
      'Понимание принципов UX дизайна',
      'Портфолио с релевантными проектами',
      'Знание современных тенденций в дизайне'
    ],
    dateCreated: '2025-05-10'
  },
  {
    id: 4,
    title: 'DevOps инженер',
    status: 'closed',
    department: 'Инфраструктура',
    location: 'Москва',
    candidates: 5,
    description: 'Настройка и поддержка инфраструктуры, CI/CD, мониторинг и оптимизация производительности.',
    requirements: [
      'Опыт работы DevOps инженером от 3 лет',
      'Знание Linux, Docker, Kubernetes',
      'Опыт работы с CI/CD pipelines',
      'Знание облачных провайдеров (AWS, GCP)',
      'Мониторинг и логирование (Prometheus, Grafana)'
    ],
    dateCreated: '2025-03-05'
  }
];

// Перевод статусов для отображения
const statusTranslations = {
  'active': 'Активная',
  'draft': 'Черновик',
  'closed': 'Закрыта'
};

const JobPositions = () => {
  const theme = useTheme();
  const [jobs, setJobs] = useState(initialJobs);
  
  // UI состояния для меню
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [openCreateMethodDialog, setOpenCreateMethodDialog] = useState(false);
  
  // Состояния для диалогов
  const [openDialog, setOpenDialog] = useState(false);
  const [openAIDialog, setOpenAIDialog] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [favoriteCompanies, setFavoriteCompanies] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [fullDescriptionOpen, setFullDescriptionOpen] = useState(false);
  
  // Данные формы для обычного создания вакансии
  const [jobFormData, setJobFormData] = useState({
    title: '',
    department: '',
    location: '',
    description: '',
    requirements: '',
    salary: ''
  });
  const [editJobId, setEditJobId] = useState(null);
  
  // Состояния для генерации вакансии с помощью ИИ
  const [aiFormData, setAiFormData] = useState({
    title: '',
    department: '',
    salary: '',
    experience: '',
    keyResponsibilities: ''
  });
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [generatedRequirements, setGeneratedRequirements] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  
  // Состояния для создания вакансии с использованием рыночных данных
  const [openMarketAIDialog, setOpenMarketAIDialog] = useState(false);
  const [marketAIFormData, setMarketAIFormData] = useState({
    title: '',
    department: '',
    location: '',
    competitors: '',
    minSalary: '',
    maxSalary: ''
  });
  const [useMarketAnalysis, setUseMarketAnalysis] = useState(true);
  const [marketAnalysisStep, setMarketAnalysisStep] = useState(0);
  const [isLoadingMarketData, setIsLoadingMarketData] = useState(false);
  const [marketDataResults, setMarketDataResults] = useState(null);
  const [marketAnalysisError, setMarketAnalysisError] = useState(null);
  
  // Уведомления
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Функция для обработки открытия диалога для создания/редактирования вакансии
  const handleOpenDialog = (jobId = null) => {
    setOpenCreateMethodDialog(false); // Закрываем выпадающее меню
    
    if (jobId) { // Редактирование существующей вакансии
      const jobToEdit = jobs.find(job => job.id === jobId);
      if (jobToEdit) {
        setJobFormData({
          title: jobToEdit.title,
          department: jobToEdit.department,
          location: jobToEdit.location,
          description: jobToEdit.description,
          requirements: jobToEdit.requirements.join('\n'),
          salary: jobToEdit.salary || ''
        });
        setEditJobId(jobId);
        setEditMode(true);
      }
    } else {
      // Создание новой вакансии
      setJobFormData({
        title: '',
        department: '',
        location: '',
        description: '',
        requirements: '',
        salary: ''
      });
      setEditJobId(null);
      setEditMode(false);
    }
    
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setJobFormData({
      title: '',
      department: '',
      location: '',
      description: '',
      requirements: '',
      salary: ''
    });
    setEditJobId(null);
    setEditMode(false);
  };
  
  // Обработчик изменения полей формы
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobFormData({
      ...jobFormData,
      [name]: value
    });
  };

  const handleOpenAIDialog = () => {
    setOpenCreateMethodDialog(false); // Закрываем выпадающее меню
    setOpenAIDialog(true);
    setAiFormData({
      title: '',
      department: '',
      salary: '',
      experience: '',
      keyResponsibilities: ''
    });
    setGeneratedDescription('');
    setGeneratedRequirements('');
    setIsGenerating(false);
    setGenerationError(null);
  };
  
  const handleCloseAIDialog = () => {
    setOpenAIDialog(false);
    setOpenCreateMethodDialog(false); // Закрываем диалог выбора метода
    setGeneratedDescription('');
    setGeneratedRequirements('');
  };
  
  // Функции для работы с вакансиями на основе рыночных данных
  const handleOpenMarketAIDialog = () => {
    setOpenMarketAIDialog(true);
    setOpenCreateMethodDialog(false);
    setMarketAIFormData({
      title: '',
      department: '',
      location: '',
      competitors: '',
      minSalary: '',
      maxSalary: ''
    });
    setMarketAnalysisStep(0);
    setMarketDataResults(null);
    setMarketAnalysisError(null);
  };
  
  const handleCloseMarketAIDialog = () => {
    setOpenMarketAIDialog(false);
    setMarketAIFormData({
      title: '',
      department: '',
      location: '',
      competitors: '',
      minSalary: '',
      maxSalary: ''
    });
    setMarketAnalysisStep(0);
    setMarketDataResults(null);
  };
  
  const handleMarketAIInputChange = (e) => {
    const { name, value } = e.target;
    setMarketAIFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Функция для анализа рыночных данных и генерации вакансии
  const analyzeMarketData = async () => {
    try {
      setIsLoadingMarketData(true);
      setMarketAnalysisError(null);
      
      // Имитация запроса к API для получения рыночных данных
      // В реальном приложении здесь был бы запрос к API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Мок-данные для демонстрации
      const mockMarketData = {
        salary: {
          average: Number(marketAIFormData.minSalary) + Math.floor(Math.random() * 30000),
          median: Number(marketAIFormData.minSalary) + Math.floor(Math.random() * 20000),
          range: {
            min: Number(marketAIFormData.minSalary),
            max: Number(marketAIFormData.maxSalary)
          }
        },
        skills: [
          "React", "JavaScript", "TypeScript", "REST API", "Git", "Redux", 
          "Material-UI", "HTML/CSS", "Node.js", "Agile", "Jest"
        ],
        competitorData: marketAIFormData.competitors.split(',').map(competitor => ({
          name: competitor.trim(),
          avgSalary: Number(marketAIFormData.minSalary) + Math.floor(Math.random() * 40000),
          requiredSkills: ["React", "JavaScript", "TypeScript"].sort(() => 0.5 - Math.random()).slice(0, 2)
        })),
        generatedJobDescription: `# Описание должности

Мы ищем опытного ${marketAIFormData.title} для работы над сложными веб-приложениями. Вы будете работать в команде профессионалов, разрабатывая инновационные решения для наших клиентов.

Основные обязанности включают разработку пользовательских интерфейсов, работу с API, оптимизацию производительности и поддержку существующих продуктов.`,
        generatedRequirements: `# Требования

- Опыт разработки на React от 2 лет
- Знание JavaScript, TypeScript, HTML, CSS
- Опыт работы с REST API
- Навыки оптимизации производительности
- Понимание принципов UI/UX
- Опыт работы с Material-UI или аналогичными библиотеками`
      };
      
      setMarketDataResults(mockMarketData);
      setMarketAnalysisStep(1); // Переход к следующему шагу
    } catch (error) {
      console.error('Ошибка при анализе рыночных данных:', error);
      setMarketAnalysisError('Произошла ошибка при анализе рыночных данных. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsLoadingMarketData(false);
    }
  };
  
  // Функция для сохранения вакансии, созданной с помощью рыночных данных
  const saveMarketGeneratedJob = () => {
    if (!marketDataResults) return;
    
    const newJob = {
      id: Date.now().toString(),
      title: marketAIFormData.title,
      department: marketAIFormData.department,
      location: marketAIFormData.location,
      description: marketDataResults.generatedJobDescription,
      requirements: marketDataResults.generatedRequirements,
      salary: `${marketDataResults.salary.range.min} - ${marketDataResults.salary.range.max} руб.`,
      status: 'active',
      datePosted: new Date().toISOString().split('T')[0],
      applicants: 0
    };
    
    setJobs([newJob, ...jobs]);
    setOpenMarketAIDialog(false);
    setMarketDataResults(null);
    setMarketAnalysisStep(0);
    
    setNotification({
      open: true, 
      message: 'Вакансия успешно создана и опубликована!',
      severity: 'success'
    });
  };
  
  // Обработчики для диалога добавления/редактирования вакансии
  const handleSaveJob = () => {
    // Проверка обязательных полей
    if (!jobFormData.title || !jobFormData.department || !jobFormData.description) {
      setNotification({
        open: true,
        message: 'Пожалуйста, заполните все обязательные поля',
        severity: 'error'
      });
      return;
    }
    
    // Разбиваем текст с требованиями на массив
    const requirementsArray = jobFormData.requirements
      .split('\n')
      .map(req => req.trim())
      .filter(req => req.length > 0);
    
    const now = new Date();
    const formattedDate = now.toISOString().split('T')[0];
    
    if (editJobId) {
      // Обновление существующей вакансии
      setJobs(jobs.map(job => 
        job.id === editJobId 
          ? {
              ...job,
              title: jobFormData.title,
              department: jobFormData.department,
              location: jobFormData.location,
              description: jobFormData.description,
              requirements: requirementsArray,
            }
          : job
      ));
      
      setNotification({
        open: true,
        message: 'Вакансия успешно обновлена',
        severity: 'success'
      });
    } else {
      // Создание новой вакансии
      const newJob = {
        id: Math.max(...jobs.map(job => job.id), 0) + 1,
        title: jobFormData.title,
        status: 'draft',
        department: jobFormData.department,
        location: jobFormData.location,
        candidates: 0,
        description: jobFormData.description,
        requirements: requirementsArray,
        dateCreated: formattedDate
      };
      
      setJobs([...jobs, newJob]);
      
      setNotification({
        open: true,
        message: 'Новая вакансия успешно создана',
        severity: 'success'
      });
    }
    
    handleCloseDialog();
  };
  
  // Обработчики для диалога AI-генерации
  const handleAIInputChange = (e) => {
    const { name, value } = e.target;
    setAiFormData({
      ...aiFormData,
      [name]: value
    });
  };
  
  const generateJobDescription = () => {
    // Проверка обязательных полей
    if (!aiFormData.title || !aiFormData.keyResponsibilities) {
      setNotification({
        open: true,
        message: 'Пожалуйста, заполните название должности и ключевые обязанности',
        severity: 'error'
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Здесь будет вызов API для генерации описания
    // В MVP версии используем демо-данные
    setTimeout(() => {
      // Генерируем описание на основе введенных данных
      const description = `Компания ищет опытного специалиста на должность ${aiFormData.title} в отдел ${aiFormData.department || 'разработки'}. 

Мы предлагаем конкурентоспособную заработную плату ${aiFormData.salary || 'по результатам собеседования'} и возможности для профессионального роста в динамичной компании.

Идеальный кандидат должен иметь опыт работы от ${aiFormData.experience || '2-3 лет'} в аналогичной должности, обладать отличными навыками коммуникации и работы в команде.

Работа предполагает ${aiFormData.keyResponsibilities}. Мы ценим инициативность, креативный подход к решению задач и стремление к постоянному совершенствованию профессиональных навыков.`;
      
      // Генерируем требования
      const requirements = [
        `Опыт работы в аналогичной должности от ${aiFormData.experience || '2 лет'}`,
        `Глубокие знания в области ${aiFormData.department || 'разработки ПО'}`,
        'Отличные коммуникативные навыки и умение работать в команде',
        'Высокая обучаемость и стремление к развитию',
        'Внимание к деталям и аналитическое мышление'
      ];
      
      setGeneratedDescription(description);
      setGeneratedRequirements(requirements);
      setIsGenerating(false);
    }, 1500);
  };
  
  const regenerateJobDescription = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      // Генерируем альтернативное описание
      const alternativeDescriptions = [
        `Мы ищем талантливого ${aiFormData.title} в нашу команду ${aiFormData.department || 'разработки'}! Вы будете заниматься ${aiFormData.keyResponsibilities.toLowerCase()}. 

Мы предлагаем зарплату ${aiFormData.salary || 'в соответствии с рыночными условиями'} и дружную команду единомышленников. Требуемый опыт: ${aiFormData.experience || '2+ лет'}. 

Если вы стремитесь к профессиональному росту и новым вызовам, присоединяйтесь к нам!`,
        
        `Открыта вакансия ${aiFormData.title} в отделе ${aiFormData.department || 'разработки'}. 

Основные задачи: ${aiFormData.keyResponsibilities.toLowerCase()}. 

Мы предлагаем: гибкий график работы, конкурентную зарплату ${aiFormData.salary || 'по результатам собеседования'}, профессиональное развитие и карьерный рост.

Нам нужен специалист с опытом от ${aiFormData.experience || '2 лет'}, нацеленный на результат и постоянное совершенствование своих навыков.`,
        
        `Вы - опытный ${aiFormData.title} с опытом работы ${aiFormData.experience || 'от 2 лет'}? Присоединяйтесь к нашей команде ${aiFormData.department || 'профессионалов'}! 

Ключевые обязанности: ${aiFormData.keyResponsibilities.toLowerCase()}. 

Мы предлагаем конкурентную заработную плату ${aiFormData.salary || 'по итогам собеседования'}, возможность удаленной работы и участие в интересных проектах, которые меняют индустрию.`
      ];
      
      // Выбираем случайное описание из альтернативных
      const randomIndex = Math.floor(Math.random() * alternativeDescriptions.length);
      
      // Генерируем альтернативные требования
      const alternativeRequirements = [
        [`Опыт работы ${aiFormData.title.toLowerCase()} от ${aiFormData.experience || '2 лет'}`,
        `Профессиональные знания в ${aiFormData.department || 'своей области'}`,
        'Умение эффективно управлять своим временем',
        'Способность работать как самостоятельно, так и в команде',
        'Готовность к обучению новым технологиям и методикам'],
        
        [`Минимум ${aiFormData.experience || '2 года'} опыта в аналогичной должности`,
        'Высшее образование в соответствующей области',
        'Развитые аналитические способности',
        'Стрессоустойчивость и умение работать в условиях многозадачности',
        'Готовность брать на себя ответственность за результат'],
        
        [`Релевантный опыт работы от ${aiFormData.experience || '2-3 лет'}`,
        'Системное мышление и внимание к деталям',
        'Высокая мотивация и нацеленность на результат',
        'Отличные коммуникативные навыки',
        'Навыки планирования и организации рабочего процесса']
      ];
      
      const randomReqIndex = Math.floor(Math.random() * alternativeRequirements.length);
      
      setGeneratedDescription(alternativeDescriptions[randomIndex]);
      setGeneratedRequirements(alternativeRequirements[randomReqIndex]);
      setIsGenerating(false);
    }, 1500);
  };
  
  const saveGeneratedJob = () => {
    if (!generatedDescription || !generatedRequirements) {
      setNotification({
        open: true,
        message: 'Пожалуйста, сначала сгенерируйте описание вакансии',
        severity: 'warning'
      });
      return;
    }
    
    const requirementsArray = typeof generatedRequirements === 'string' 
      ? generatedRequirements.split('\n').filter(req => req.trim().length > 0)
      : Array.isArray(generatedRequirements) 
        ? generatedRequirements 
        : ['Опыт работы в аналогичной должности'];
    
    const newJob = {
      id: Math.max(...jobs.map(job => job.id), 0) + 1,
      title: aiFormData.title,
      department: aiFormData.department || 'Не указан',
      location: 'Удаленно',
      description: generatedDescription,
      requirements: requirementsArray,
      status: 'active',
      date: new Date().toLocaleDateString(),
      applicants: 0,
      salary: aiFormData.salary || 'По договоренности'
    };
    
    setJobs([...jobs, newJob]);
    
    setNotification({
      open: true,
      message: 'Вакансия успешно создана!',
      severity: 'success'
    });
    
    handleCloseAIDialog();
  };
  

  
  // Обработчик закрытия уведомления
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };
  
  // Меню действий с вакансиями
  const handleOpenMenu = (event, jobId) => {
    setAnchorEl(event.currentTarget);
    setCurrentJob(jobId);
  };
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
    setCurrentJob(null);
  };
  
  const handleDeleteJob = () => {
    if (currentJob) {
      setJobs(jobs.filter(job => job.id !== currentJob));
      setNotification({
        open: true,
        message: 'Вакансия удалена',
        severity: 'info'
      });
    }
    handleCloseMenu();
  };
  
  const handleChangeStatus = (status) => {
    if (currentJob) {
      setJobs(jobs.map(job => 
        job.id === currentJob 
          ? { ...job, status }
          : job
      ));
      
      const statusMessage = {
        'active': 'Вакансия активирована',
        'draft': 'Вакансия сохранена как черновик',
        'closed': 'Вакансия закрыта'
      };
      
      setNotification({
        open: true,
        message: statusMessage[status] || 'Статус вакансии изменен',
        severity: 'info'
      });
    }
    handleCloseMenu();
  };
  
  return (
    <Box 
      sx={{
        flexGrow: 1,
        backgroundColor: '#1a1c27',
        minHeight: '100vh',
        color: '#fff'
      }}
    >
      {/* Шапка */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        py: 1,
        px: 2,
        height: '60px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative'
      }}>
        <Box sx={{ position: 'absolute', left: 16, display: 'flex', alignItems: 'center', height: '100%' }}>
          <HomeButton />
        </Box>
        <Typography variant="h6" sx={{ color: '#fff', textAlign: 'center' }}>
          Управление вакансиями
        </Typography>
      </Box>
      
      {/* Контент */}
      <Box sx={{ p: 3 }}>
        {/* Заголовок и кнопка добавления */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4 
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <BusinessCenterIcon sx={{ fontSize: 28, mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
                Создание и управление шаблонами вакансий
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '700px', pl: 4 }}>
              Создавайте вакансии вручную или с помощью ИИ, сортируйте их по дате или статусу, редактируйте и публикуйте объявления о вакансиях для привлечения лучших кандидатов.
            </Typography>
          </Box>
          <Box sx={{ position: 'relative' }}>
            <MinimalButton
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setOpenCreateMethodDialog(true)}
            >
              Добавить вакансию
            </MinimalButton>
            
            {/* Модальное окно выбора метода создания вакансии */}
            <Dialog
              open={openCreateMethodDialog}
              onClose={() => setOpenCreateMethodDialog(false)}
              maxWidth="md"
              fullWidth
              PaperProps={{
                elevation: 0,
                sx: {
                  backgroundColor: '#1A1E2D',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.05)',
                  overflow: 'hidden',
                  p: 2
                }
              }}
            >
              <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
                <Typography variant="h6" fontWeight="600">
                  Выберите способ создания вакансии
                </Typography>
              </DialogTitle>
              
              <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
                {/* Карточка для ручного создания */}
                <Card 
                  onClick={() => {
                    handleOpenDialog();
                    setOpenCreateMethodDialog(false);
                  }}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: '#212436',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: theme.palette.primary.main,
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'rgba(93, 135, 255, 0.1)', 
                      width: 60, 
                      height: 60, 
                      mb: 2,
                      color: theme.palette.primary.main
                    }}
                  >
                    <EditNoteIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                    Создать вручную
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    Все поля заполняются самостоятельно
                  </Typography>
                </Card>
                
                {/* Карточка для создания с помощью ИИ */}
                <Card 
                  onClick={() => {
                    handleOpenAIDialog();
                    setOpenCreateMethodDialog(false);  
                  }}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: '#212436',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#00C49A',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <Avatar 
                    sx={{ 
                      bgcolor: 'rgba(0, 196, 154, 0.1)', 
                      width: 60, 
                      height: 60, 
                      mb: 2,
                      color: '#00C49A'
                    }}
                  >
                    <SmartToyIcon sx={{ fontSize: 30 }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'center' }}>
                    Создать с помощью ИИ
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    ИИ сам составит описание по вашим параметрам
                  </Typography>
                </Card>
                
                {/* Карточка для создания на основе рыночных данных */}
                <Card 
                  onClick={() => {
                    handleOpenMarketAIDialog();
                    setOpenCreateMethodDialog(false);  
                  }}
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: '#212436',
                    border: '1px solid rgba(0, 120, 255, 0.1)',
                    background: 'linear-gradient(145deg, #212436 0%, rgba(38, 43, 64, 0.8) 100%)',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 16px rgba(9, 108, 236, 0.2)'
                    }
                  }}
                >
                  <Box sx={{ 
                    position: 'relative',
                    width: 70,
                    height: 70,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mb: 2 
                  }}>
                    {/* Упрощенная подложка, удалена */}
                    <Avatar 
                      sx={{ 
                        bgcolor: 'rgba(93, 135, 255, 0.1)',  
                        width: 60, 
                        height: 60,
                        color: theme.palette.primary.main
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AnalyticsIcon sx={{ fontSize: 28, color: '#096CEC' }} />
                      </Box>
                    </Avatar>
                  </Box>
                  <Typography variant="h6" sx={{ mb: 1, textAlign: 'center', color: '#fff', fontWeight: 600 }}>
                    Анализ рынка труда
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
                    Создание вакансии на основе анализа рыночных данных
                  </Typography>
                  <Chip
                    size="small"
                    label="Рекомендуемый метод"
                    sx={{ 
                      mt: 2, 
                      bgcolor: 'rgba(9, 108, 236, 0.1)', 
                      color: '#096CEC',
                      fontSize: '0.7rem',
                      height: 24,
                      '& .MuiChip-label': { px: 1 }
                    }}
                  />
                </Card>
              </Box>
              
              <DialogActions sx={{ justifyContent: 'center', pt: 1 }}>
                <Button 
                  onClick={() => setOpenCreateMethodDialog(false)} 
                  sx={{ color: 'text.secondary' }}
                >
                  Отмена
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
        
        {/* Информационная статистика */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 1,
                backgroundColor: '#182032',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Активные вакансии
              </Typography>
              <Typography variant="h4" component="div" color="primary.main" sx={{ fontWeight: 600 }}>
                {jobs.filter(job => job.status === 'active').length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 1,
                backgroundColor: '#182032',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Всего кандидатов
              </Typography>
              <Typography variant="h4" component="div" color="primary.main" sx={{ fontWeight: 600 }}>
                {jobs.reduce((acc, job) => acc + job.candidates, 0)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 1,
                backgroundColor: '#182032',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Черновики
              </Typography>
              <Typography variant="h4" component="div" color="primary.main" sx={{ fontWeight: 600 }}>
                {jobs.filter(job => job.status === 'draft').length}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 1,
                backgroundColor: '#182032',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Закрытые вакансии
              </Typography>
              <Typography variant="h4" component="div" color="primary.main" sx={{ fontWeight: 600 }}>
                {jobs.filter(job => job.status === 'closed').length}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Список вакансий */}
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <DescriptionIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          Список вакансий
        </Typography>
        
        <Grid container spacing={3}>
          {jobs.map(job => (
            <Grid item xs={12} md={6} lg={4} key={job.id}>
              <StyledCard>
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'flex-start', 
                    mb: 1 
                  }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600, mr: 2 }}>
                      {job.title}
                    </Typography>
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleOpenMenu(e, job.id)}
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', mb: 2 }}>
                    <StatusChip
                      label={statusTranslations[job.status]}
                      status={job.status}
                      size="small"
                    />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {job.description}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Отдел
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {job.department}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Локация
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {job.location}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Дата создания
                      </Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {job.dateCreated}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Кандидатов
                      </Typography>
                      <Typography variant="body2" fontWeight={500} sx={{ 
                        display: 'flex', 
                        alignItems: 'center' 
                      }}>
                        <PeopleAltIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        {job.candidates}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                    <Tooltip title="Редактировать вакансию">
                      <MinimalButton 
                        size="small" 
                        variant="outlined"
                        color="primary"
                        onClick={() => handleOpenDialog(job.id)}
                        startIcon={<EditIcon />}
                      >
                        Изменить
                      </MinimalButton>
                    </Tooltip>
                    
                    <Tooltip title="Просмотр кандидатов">
                      <MinimalButton 
                        size="small" 
                        variant="outlined"
                        onClick={() => {
                          setNotification({
                            open: true,
                            message: 'Функция просмотра кандидатов будет доступна в следующем обновлении',
                            severity: 'info'
                          });
                        }}
                        startIcon={<PersonIcon />}
                        sx={{ ml: 'auto' }}
                      >
                        Кандидаты
                      </MinimalButton>
                    </Tooltip>
                    
                    <Tooltip title="Статистика по вакансии">
                      <MinimalButton 
                        size="small" 
                        variant="outlined"
                        onClick={() => {
                          setNotification({
                            open: true,
                            message: 'Функция аналитики будет доступна в следующем обновлении',
                            severity: 'info'
                          });
                        }}
                        startIcon={<BarChartIcon />}
                      >
                        Аналитика
                      </MinimalButton>
                    </Tooltip>
                  </Box>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
        
        {/* Если нет вакансий */}
        {jobs.length === 0 && (
          <Box 
            sx={{ 
              textAlign: 'center', 
              p: 4, 
              backgroundColor: alpha(theme.palette.background.paper, 0.3),
              borderRadius: theme.shape.borderRadius * 2,
              mt: 2
            }}
          >
            <BusinessCenterIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              У вас пока нет вакансий
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Создайте новую вакансию, чтобы начать поиск кандидатов
            </Typography>
            <MinimalButton
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Добавить вакансию
            </MinimalButton>
          </Box>
        )}
      </Box>
      
      {/* Диалог добавления/редактирования вакансии */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 0,
            backgroundColor: '#1e2130',
            color: '#fff',
            minHeight: '70vh',
            width: '100%',
            maxWidth: '100%',
            m: 0
          }
        }}
        componentsProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(16, 16, 41, 0.95)'
            }
          }
        }}
        sx={{
          '& .MuiDialog-paper': {
            margin: 0,
            maxHeight: '100%',
            height: '100%',
            borderRadius: 0
          },
          '& .MuiDialog-container': {
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Заголовок с иконкой */}
          <DialogTitle sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            pb: 2
          }}>
            <Box sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {editJobId ? 
                <EditIcon sx={{ color: theme.palette.primary.main }} /> : 
                <BusinessCenterIcon sx={{ color: theme.palette.primary.main }} />}
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {editJobId ? 'Редактирование вакансии' : 'Создание новой вакансии'}
            </Typography>
            
            {/* Кнопка закрытия */}
            <IconButton 
              onClick={handleCloseDialog}
              sx={{
                position: 'absolute',
                right: 16,
                top: 16,
                backgroundColor: alpha('#1e2130', 0.5),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
            >
              <CloseIcon sx={{ fontSize: 18, color: 'white' }} />
            </IconButton>
          </DialogTitle>
            
          <DialogContent sx={{ 
            pt: 3, 
            px: { xs: 2, sm: 3 },
            pb: 0
          }}>
            <Grid container spacing={3}>
              {/* Блок данных о вакансии */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: alpha('#fff', 0.9) }}>
                  Основная информация
                </Typography>
              </Grid>

              {/* Основные данные */}
              <Grid item xs={12}>
                <TextField
                  name="title"
                  label="Название вакансии"
                  value={jobFormData.title}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  InputLabelProps={{ 
                    shrink: true,
                    sx: { color: alpha('#fff', 0.7) }
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.background.paper, 0.05),
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(theme.palette.primary.main, 0.5),
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: theme.palette.primary.main,
                      }
                    },
                    '& .MuiInputBase-input': {
                      padding: '12px 14px',
                      fontSize: '0.95rem'
                    }
                  }}
                />
              </Grid>
              
              {/* Две колонки */}
              <Grid item xs={12} md={6}>
                <TextField
                  name="department"
                  label="Отдел"
                  value={jobFormData.department}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  InputLabelProps={{ 
                    shrink: true,
                    sx: { color: alpha('#fff', 0.7) }
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.background.paper, 0.05),
                    },
                    '& .MuiInputBase-input': {
                      padding: '12px 14px'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="location"
                  label="Локация"
                  value={jobFormData.location}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ 
                    shrink: true,
                    sx: { color: alpha('#fff', 0.7) }
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.background.paper, 0.05),
                    },
                    '& .MuiInputBase-input': {
                      padding: '12px 14px'
                    }
                  }}
                />
              </Grid>
              
              {/* Зарплата и опыт */}
              <Grid item xs={12} md={6}>
                <TextField
                  name="salary"
                  label="Зарплата"
                  value={jobFormData.salary || ''}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="например: 150 000 - 200 000 руб."
                  InputLabelProps={{ 
                    shrink: true,
                    sx: { color: alpha('#fff', 0.7) }
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.background.paper, 0.05),
                    },
                    '& .MuiInputBase-input': {
                      padding: '12px 14px'
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="experience"
                  label="Требуемый опыт"
                  value={jobFormData.experience || ''}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  placeholder="например: от 3 лет"
                  InputLabelProps={{ 
                    shrink: true,
                    sx: { color: alpha('#fff', 0.7) }
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.background.paper, 0.05),
                    },
                    '& .MuiInputBase-input': {
                      padding: '12px 14px'
                    }
                  }}
                />
              </Grid>

              {/* Разделитель */}
              <Grid item xs={12}>
                <Divider sx={{ borderColor: alpha('#fff', 0.1), my: 1 }} />
              </Grid>

              {/* Блок описания */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500, color: alpha('#fff', 0.9) }}>
                  Детальная информация
                </Typography>

                {/* Описание */}
                <Typography variant="body2" sx={{ mb: 1, color: alpha('#fff', 0.7) }}>
                  Описание вакансии*
                </Typography>
                <TextField
                  name="description"
                  value={jobFormData.description}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  variant="outlined"
                  multiline
                  rows={4}
                  placeholder="Введите подробное описание вакансии"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.background.paper, 0.05),
                    }
                  }}
                />
              </Grid>
              
              {/* Требования */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 1, color: alpha('#fff', 0.7), display: 'flex', alignItems: 'center' }}>
                  Требования
                  <Tooltip title="Укажите каждое требование с новой строки">
                    <Box component="span" sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
                      <InfoIcon sx={{ fontSize: 16, color: alpha('#fff', 0.5) }} />
                    </Box>
                  </Tooltip>
                </Typography>
                <TextField
                  name="requirements"
                  value={jobFormData.requirements}
                  onChange={handleInputChange}
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  placeholder="Введите каждое требование с новой строки, например:
Опыт работы от 3 лет
Навыки программирования на JavaScript"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                      backgroundColor: alpha(theme.palette.background.paper, 0.05),
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ 
            px: { xs: 2, sm: 3 }, 
            py: 3,
            borderTop: '1px solid rgba(255,255,255,0.05)',
            justifyContent: 'flex-end',
            gap: 2
          }}>
            <Button 
              onClick={handleCloseDialog} 
              sx={{ 
                color: alpha('#fff', 0.7),
                borderRadius: theme.shape.borderRadius * 1.5,
                '&:hover': {
                  backgroundColor: alpha('#fff', 0.05),
                }
              }}
            >
              Отмена
            </Button>
            <MinimalButton 
              variant="contained" 
              color="primary" 
              onClick={handleSaveJob}
              startIcon={editJobId ? <EditIcon /> : <AddIcon />}
              sx={{ 
                borderRadius: theme.shape.borderRadius * 1.5,
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                px: 3
              }}
            >
              {editJobId ? 'Сохранить изменения' : 'Создать вакансию'}
            </MinimalButton>
          </DialogActions>
        </Box>
      </Dialog>
      
      {/* Меню действий для вакансий */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: {
            borderRadius: theme.shape.borderRadius,
            backgroundColor: '#1e2130',
            color: '#fff'
          }
        }}
      >
        <MenuItem onClick={() => {
          handleOpenDialog(currentJob);
          handleCloseMenu();
        }}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Редактировать
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus('active')}>
          <CheckCircleIcon fontSize="small" sx={{ mr: 1, color: theme.palette.success.main }} />
          Активировать
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus('draft')}>
          <DescriptionIcon fontSize="small" sx={{ mr: 1, color: theme.palette.info.main }} />
          В черновики
        </MenuItem>
        <MenuItem onClick={() => handleChangeStatus('closed')}>
          <BusinessCenterIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
          Закрыть вакансию
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem onClick={handleDeleteJob} sx={{ color: theme.palette.error.main }}>
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Удалить
        </MenuItem>
      </Menu>
      
      {/* Компонент для создания вакансии на основе рыночных данных */}
      <MarketJobCreator 
        open={openMarketAIDialog}
        onClose={handleCloseMarketAIDialog}
        onSave={(newJob) => {
          setJobs([newJob, ...jobs]);
          setNotification({
            open: true, 
            message: 'Вакансия успешно создана и опубликована!',
            severity: 'success'
          });
        }}
        theme={theme}
      />
      
      {/* Диалог создания вакансии с помощью ИИ */}
      <Dialog
        open={openAIDialog}
        onClose={handleCloseAIDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: '#1A1E2D',
            color: '#fff',
            borderRadius: 2,
          },
          '& .MuiDialog-container': {
            alignItems: 'center',
            justifyContent: 'center'
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid rgba(255,255,255,0.1)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5 
        }}>
          <SmartToyIcon sx={{ color: '#00ffd6', mr: 1 }} />
          Создание вакансии с помощью ИИ
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Создание вакансии с помощью ИИ
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Ключевая информация
                </Typography>
              </Box>
              
              <TextField
                name="title"
                label="Название вакансии"
                value={aiFormData.title}
                onChange={handleAIInputChange}
                fullWidth
                required
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              <TextField
                name="department"
                label="Отдел"
                value={aiFormData.department}
                onChange={handleAIInputChange}
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              <TextField
                name="salary"
                label="Зарплата (пример: 150 000 - 200 000 руб.)"
                value={aiFormData.salary}
                onChange={handleAIInputChange}
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              <TextField
                name="experience"
                label="Требуемый опыт (пример: от 3 лет)"
                value={aiFormData.experience}
                onChange={handleAIInputChange}
                fullWidth
                variant="outlined"
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              <TextField
                name="keyResponsibilities"
                label="Ключевые обязанности"
                value={aiFormData.keyResponsibilities}
                onChange={handleAIInputChange}
                fullWidth
                required
                variant="outlined"
                margin="normal"
                multiline
                rows={4}
                helperText="Укажите основные задачи и обязанности сотрудника"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              
              <Box sx={{ display: 'flex', mt: 'auto', pt: 2 }}>
                <MinimalButton
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={generateJobDescription}
                  disabled={isGenerating}
                  startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <SmartToyIcon />}
                >
                  {isGenerating ? 'Генерация...' : 'Сгенерировать описание'}
                </MinimalButton>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2 
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ mr: 1 }}>
                    Результат генерации
                  </Typography>
                  {generatedDescription && (
                    <Chip 
                      size="small" 
                      label="AI" 
                      sx={{ 
                        bgcolor: 'rgba(0, 196, 154, 0.15)', 
                        color: '#00C49A',
                        fontWeight: 600, 
                        fontSize: '0.7rem',
                        height: 22,
                        border: '1px solid rgba(0, 196, 154, 0.3)'
                      }} 
                    />
                  )}
                </Box>
                {generatedDescription && (
                  <IconButton 
                    size="small" 
                    onClick={regenerateJobDescription} 
                    disabled={isGenerating}
                    sx={{ color: '#00C49A' }}
                  >
                    <Tooltip title="Сгенерировать заново">
                      <AutorenewIcon />
                    </Tooltip>
                  </IconButton>
                )}
              </Box>
              
              {!generatedDescription ? (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  backgroundColor: alpha(theme.palette.background.default, 0.3),
                  borderRadius: 1,
                  p: 4,
                  minHeight: 300,
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                  background: 'linear-gradient(145deg, rgba(24,32,50,0.4) 0%, rgba(33,36,54,0.3) 100%)'
                }}>
                  <Box sx={{ 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%', 
                    backgroundColor: 'rgba(0, 196, 154, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mb: 2
                  }}>
                    <StarIcon sx={{ fontSize: 30, color: '#00C49A' }} />
                  </Box>
                  <Typography variant="body1" align="center" color="text.secondary" paragraph>
                    Заполните необходимые поля и нажмите "Сгенерировать описание"
                  </Typography>
                  <Typography variant="body2" align="center" color="text.secondary">
                    ИИ составит профессиональное описание вакансии
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box sx={{ 
                    p: 3, 
                    borderRadius: 1, 
                    border: '1px solid rgba(255, 255, 255, 0.08)', 
                    mb: 3, 
                    background: 'linear-gradient(145deg, rgba(24,32,50,0.5) 0%, rgba(33,36,54,0.4) 100%)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 2 
                    }}>
                      <Chip 
                        label="AI-generated" 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(0, 196, 154, 0.1)', 
                          color: '#00C49A',
                          fontSize: '0.7rem',
                          height: 24,
                          border: '1px solid rgba(0, 196, 154, 0.2)'
                        }} 
                        icon={<SmartToyIcon sx={{ fontSize: '0.9rem !important', color: '#00C49A !important' }} />}
                      />
                      <Button
                        onClick={() => setFullDescriptionOpen(true)}
                        variant="text"
                        size="small"
                        endIcon={<ExpandMoreIcon />}
                        sx={{ color: '#00C49A', textTransform: 'none', fontWeight: 500 }}
                      >
                        Подробнее
                      </Button>
                    </Box>
                    
                    {/* Всегда видимое описание */}
                    <Typography variant="body1" color="#fff" sx={{ mb: 1, fontSize: '1rem', lineHeight: 1.5 }}>
                      {generatedDescription.replace(/\*\*(.*?)\*\*/g, '$1').replace(/Работа предполагает .+/g, '').split('\n')[0]}
                    </Typography>
                    
                    <Box sx={{ 
                      mt: 4, 
                      mb: 2, 
                      display: 'flex',
                      alignItems: 'center',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                      pb: 1
                    }}>
                      <ListIcon sx={{ color: '#00C49A', mr: 1, fontSize: 20 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#fff' }}>
                        Требования:
                      </Typography>
                    </Box>
                
                    <Box sx={{ pl: 1 }}>
                      {Array.isArray(generatedRequirements) && generatedRequirements.slice(0, 3).map((req, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                          <CheckCircleIcon sx={{ mr: 2, color: '#00C49A', fontSize: 18, mt: 0.4 }} />
                          <Typography variant="body1" color="#fff" sx={{ opacity: 0.9 }}>
                            {req.replace(/\*\*(.*?)\*\*/g, '$1')}
                          </Typography>
                        </Box>
                      ))}
                      {Array.isArray(generatedRequirements) && generatedRequirements.length > 3 && (
                        <Typography variant="body2" color="#00C49A" sx={{ mt: 1, pl: 1 }}>
                          + еще {generatedRequirements.length - 3} требования
                        </Typography>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', mt: 2 }}>
                    <MinimalButton
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={saveGeneratedJob}
                      disabled={isGenerating}
                      startIcon={<BusinessCenterIcon />}
                      sx={{ backgroundColor: '#2563EB', '&:hover': { backgroundColor: '#1E40AF' } }}
                    >
                      Сохранить вакансию
                    </MinimalButton>
                  </Box>
                </>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, borderTop: '1px solid rgba(255,255,255,0.1)', pt: 2 }}>
          <Button onClick={handleCloseAIDialog} color="primary">
            Отмена
          </Button>
          <Button onClick={saveGeneratedJob} variant="contained" sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1E40AF' } }} startIcon={<BusinessCenterIcon />}>
            Сохранить вакансию
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={notification.open} 
        autoHideDuration={5000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity || 'info'} 
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      <Dialog
        open={fullDescriptionOpen}
        onClose={() => setFullDescriptionOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { 
            bgcolor: '#1A1E2D', 
            color: '#fff',
            p: 3,
            borderRadius: 1,
            boxShadow: '0 8px 20px rgba(0,0,0,0.4)'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid rgba(255,255,255,0.08)', pb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Полное описание вакансии
            </Typography>
            <IconButton onClick={() => setFullDescriptionOpen(false)} sx={{ color: '#fff' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            {generatedDescription?.replace(/\*\*(.*?)\*\*/g, '$1').replace(/Работа предполагает .+/g, '')}
          </Typography>
          
          <Typography variant="h6" sx={{ mt: 4, mb: 3, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <ListIcon sx={{ color: '#00C49A', mr: 1, fontSize: 24 }} />
            Требования:
          </Typography>
          
          <Grid container spacing={2} sx={{ pl: 2 }}>
            {Array.isArray(generatedRequirements) && generatedRequirements.map((req, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                  <CheckCircleIcon sx={{ mr: 2, color: '#00C49A', fontSize: 20, mt: 0.4 }} />
                  <Typography variant="body1">
                    {req.replace(/\*\*(.*?)\*\*/g, '$1')}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
          
          <Box sx={{ mt: 4, p: 3, bgcolor: 'rgba(0, 196, 154, 0.05)', borderRadius: 1, border: '1px solid rgba(0, 196, 154, 0.2)' }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1, color: '#00C49A', fontSize: 20 }} />
              Дополнительная информация
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Вакансия была сгенерирована с помощью искусственного интеллекта. Перед публикацией рекомендуется проверить и при необходимости отредактировать результат.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setFullDescriptionOpen(false)} variant="outlined" sx={{ color: 'text.secondary', borderColor: 'rgba(255,255,255,0.2)' }}>
            Закрыть
          </Button>
          <Button onClick={saveGeneratedJob} variant="contained" sx={{ bgcolor: '#2563EB', '&:hover': { bgcolor: '#1E40AF' } }} startIcon={<BusinessCenterIcon />}>
            Сохранить вакансию
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobPositions;
