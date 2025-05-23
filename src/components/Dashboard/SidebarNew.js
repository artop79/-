import React, { useState } from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Typography,
  Collapse
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import InterpreterModeIcon from '@mui/icons-material/InterpreterMode';
import BarChartIcon from '@mui/icons-material/BarChart';
import BusinessIcon from '@mui/icons-material/Business';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import FolderIcon from '@mui/icons-material/Folder';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AdsClickIcon from '@mui/icons-material/AdsClick';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

// Styled components
const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 220,
  height: '100vh',
  backgroundColor: '#111132', // Максимально темный синий, как на референсе
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  zIndex: 1200,
  boxShadow: '0 0 15px rgba(0,0,0,0.2)',
  borderRight: '1px solid rgba(255,255,255,0.03)',
}));

const LogoBox = styled(Box)(({ theme }) => ({
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  marginBottom: '10px',
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  padding: '2px 8px',
  margin: '2px 0',
  cursor: 'pointer',
  borderRadius: 8,
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  // Удаляем боковую полосу и фон элемента для соответствия референсу
  // Вместо этого фон будет у ListItemButton
}));

const ListLabel = styled(Typography)(({ theme }) => ({
  padding: '12px 16px 4px',
  color: 'rgba(255,255,255,0.3)',
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  fontWeight: 500,
}));

// Main navigation items
const mainNavItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
  },
  { 
    id: 'talent-acquisition',
    label: 'Talent Acquisition',
    icon: <SearchIcon />,
    hasSubmenu: true,
    submenu: [
      { id: 'job-positions', path: '/job-positions', label: 'Управление вакансиями', icon: <BusinessCenterIcon /> },
      { id: 'job-ads', path: '/job-ads', label: 'Объявления найма', icon: <AdsClickIcon /> },
      { id: 'best-candidates', path: '/best-candidates', label: 'Лучший кандидат', icon: <EmojiEventsIcon /> },
    ]
  },
  { 
    id: 'talent-evaluation',
    label: 'Talent Evaluation',
    icon: <PeopleIcon />,
    hasSubmenu: true,
    submenu: [
      { id: 'resume-analyzer', path: '/resume-analyzer', label: 'Resume Analyzer', icon: <DescriptionIcon /> },
      { id: 'ai-interviewer', path: '/ai-interviewer', label: 'AI Interviewer', icon: <InterpreterModeIcon /> },
      { id: 'ai-interviewer-test', path: '/ai-interviewer-test', label: 'AI Interviewer Test', icon: <InterpreterModeIcon /> },
    ]
  },
  { id: 'automation', path: '/automation', label: 'Automation', icon: <AutoFixHighIcon /> },
  { id: 'analytics', path: '/analytics', label: 'Analytics', icon: <BarChartIcon /> },
  { id: 'company-profile', path: '/company-profile', label: 'Company Profile', icon: <BusinessIcon /> },
];

// Management items
const managementNavItems = [
  {
    id: 'billing',
    label: 'Billing',
    path: '/billing',
    icon: <ReceiptLongIcon />,
  },
  { id: 'integrations', path: '/integrations', label: 'Integrations', icon: <IntegrationInstructionsIcon /> },
  {
    id: 'resources',
    label: 'Resources',
    path: '/resources',
    icon: <FolderIcon />,
  },
  { id: 'profile', path: '/profile', label: 'Profile Settings', icon: <PersonIcon /> },
];

const SidebarNew = ({ activeTab }) => {
  // Состояние для управления открытыми подменю
  const [openSubmenu, setOpenSubmenu] = useState({
    'talent-acquisition': false,
    'talent-evaluation': false
  });

  // Проверка активности подменю при первом рендере
  React.useEffect(() => {
    const newOpenState = {...openSubmenu};
    
    // Автоматически раскрываем подменю, если один из его элементов активен
    mainNavItems.forEach(item => {
      if (item.hasSubmenu && item.submenu.some(subItem => subItem.id === activeTab)) {
        newOpenState[item.id] = true;
      }
    });
    
    setOpenSubmenu(newOpenState);
  }, [activeTab]);

  // Обработчик для открытия/закрытия подменю
  const handleToggleSubmenu = (id) => {
    setOpenSubmenu(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Проверяем, находится ли текущая вкладка в подменю
  const isSubmenuActive = (parentId, submenu) => {
    return submenu.some(item => item.id === activeTab);
  };
  
  return (
    <SidebarContainer>
      <LogoBox>
        <Typography variant="h6" fontWeight="500" sx={{ letterSpacing: '-0.5px', fontSize: '1.15rem', display: 'flex', alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="/favicon/favicon.svg?v=20250516"
              alt="Logo"
              sx={{ width: 28, height: 28, mr: 1 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/favicon/favicon-32x32.png?v=20250516';
              }}
            />
          </Box>
          Raplle
        </Typography>
      </LogoBox>
      
      <ListLabel>Main</ListLabel>
      <List sx={{ px: 1 }}>
        {mainNavItems.map(item => (
          <React.Fragment key={item.id}>
            {item.hasSubmenu ? (
              <>
                <StyledListItem disablePadding>
                  <ListItemButton 
                    onClick={() => handleToggleSubmenu(item.id)}
                    sx={{ 
                      borderRadius: 1,
                      padding: '8px 12px',
                      minHeight: '42px',
                      backgroundColor: (openSubmenu[item.id] || isSubmenuActive(item.id, item.submenu)) ? 'rgba(255,255,255,0.05)' : 'transparent',
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      minWidth: 40,
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.2rem',
                        backgroundColor: (openSubmenu[item.id] || isSubmenuActive(item.id, item.submenu)) ? '#3699FF' : 'rgba(255,255,255,0.08)',
                        borderRadius: '50%',
                        padding: '6px',
                        boxSizing: 'content-box',
                      }
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{
                        fontSize: '0.85rem',
                        fontWeight: (openSubmenu[item.id] || isSubmenuActive(item.id, item.submenu)) ? 'medium' : 'regular',
                        color: (openSubmenu[item.id] || isSubmenuActive(item.id, item.submenu)) ? '#fff' : 'rgba(255,255,255,0.7)'
                      }}
                    />
                    {openSubmenu[item.id] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                </StyledListItem>
                <Collapse in={openSubmenu[item.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.submenu.map(subItem => (
                      <StyledListItem key={subItem.id} disablePadding>
                        <ListItemButton
                          component={Link}
                          to={subItem.path}
                          sx={{ 
                            borderRadius: 1,
                            padding: '6px 12px',
                            minHeight: '38px',
                            pl: 5,
                            backgroundColor: activeTab === subItem.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                          }}
                        >
                          <ListItemIcon sx={{ 
                            color: 'rgba(255,255,255,0.7)',
                            minWidth: 32,
                            '& .MuiSvgIcon-root': {
                              fontSize: '1rem',
                              backgroundColor: activeTab === subItem.id ? '#3699FF' : 'rgba(255,255,255,0.08)',
                              borderRadius: '50%',
                              padding: '5px',
                              boxSizing: 'content-box',
                            }
                          }}>
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={subItem.label} 
                            primaryTypographyProps={{
                              fontSize: '0.8rem',
                              fontWeight: activeTab === subItem.id ? 'medium' : 'regular',
                              color: activeTab === subItem.id ? '#fff' : 'rgba(255,255,255,0.7)'
                            }}
                          />
                        </ListItemButton>
                      </StyledListItem>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <StyledListItem disablePadding>
                <ListItemButton 
                  component={Link}
                  to={item.path}
                  sx={{ 
                    borderRadius: 1,
                    padding: '8px 12px',
                    minHeight: '42px',
                    backgroundColor: activeTab === item.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: 'rgba(255,255,255,0.7)',
                    minWidth: 40,
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.2rem',
                      backgroundColor: activeTab === item.id ? '#3699FF' : 'rgba(255,255,255,0.08)',
                      borderRadius: '50%',
                      padding: '6px',
                      boxSizing: 'content-box',
                    }
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: activeTab === item.id ? 'medium' : 'regular',
                      color: activeTab === item.id ? '#fff' : 'rgba(255,255,255,0.7)'
                    }}
                  />
                </ListItemButton>
              </StyledListItem>
            )}
          </React.Fragment>
        ))}
      </List>
      
      <ListLabel sx={{ mt: 2 }}>PAGES</ListLabel>
      <List sx={{ p: '0 16px' }}>
        {managementNavItems.map((item) => (
          <StyledListItem 
            key={item.id} 
            disablePadding 
            active={activeTab === item.id ? 1 : 0}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                borderRadius: 1,
                padding: '8px 12px',
                background: activeTab === item.id ? 'rgba(54, 153, 255, 0.15)' : 'transparent',
                minHeight: '42px'
              }}
            >
              <ListItemIcon sx={{ 
                color: activeTab === item.id ? '#fff' : 'rgba(255,255,255,0.7)',
                minWidth: 40,
                '& .MuiSvgIcon-root': {
                  fontSize: '1.2rem',
                  backgroundColor: activeTab === item.id ? '#3699FF' : 'rgba(255,255,255,0.08)',
                  borderRadius: '50%',
                  padding: '6px',
                  boxSizing: 'content-box',
                }
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{
                  fontSize: '0.85rem',
                  fontWeight: activeTab === item.id ? 'medium' : 'regular',
                  color: activeTab === item.id ? '#fff' : 'rgba(255,255,255,0.7)'
                }}
              />
            </ListItemButton>
          </StyledListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 'auto', p: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.15)' }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          p: '8px 8px 16px 8px'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: '50%',
                bgcolor: '#3E3E9A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
              }}
            >
              <PersonIcon sx={{ fontSize: '1rem' }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Need help?
              </Typography>
              <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                Please tap for support
              </Typography>
            </Box>
          </Box>
        </Box>
        
        <StyledListItem disablePadding>
          <ListItemButton 
            component={Link}
            to="/settings"
            sx={{ borderRadius: 1, padding: '8px 12px', minHeight: '42px' }}
          >
            <ListItemIcon sx={{ 
              color: 'rgba(255,255,255,0.7)',
              minWidth: 40,
              '& .MuiSvgIcon-root': {
                fontSize: '1.2rem',
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '50%',
                padding: '6px',
                boxSizing: 'content-box',
              }
            }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Settings" 
              primaryTypographyProps={{
                fontSize: '0.85rem',
                fontWeight: 'regular',
                color: 'rgba(255,255,255,0.8)',
              }}
            />
          </ListItemButton>
        </StyledListItem>
        
        <StyledListItem disablePadding>
          <ListItemButton 
            component={Link}
            to="/logout"
            sx={{ borderRadius: 1, padding: '8px 12px', minHeight: '42px' }}
          >
            <ListItemIcon sx={{ 
              color: 'rgba(255,255,255,0.7)',
              minWidth: 40,
              '& .MuiSvgIcon-root': {
                fontSize: '1.2rem',
                backgroundColor: 'rgba(255,255,255,0.08)',
                borderRadius: '50%',
                padding: '6px',
                boxSizing: 'content-box',
              }
            }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                fontSize: '0.85rem',
                fontWeight: 'regular',
                color: 'rgba(255,255,255,0.8)',
              }}
            />
          </ListItemButton>
        </StyledListItem>
      </Box>
    </SidebarContainer>
  );
};

export default SidebarNew;
