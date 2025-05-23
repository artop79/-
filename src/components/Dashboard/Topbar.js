import React, { useState } from 'react';
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import VideocamIcon from '@mui/icons-material/Videocam';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BarChartIcon from '@mui/icons-material/BarChart';
import BusinessIcon from '@mui/icons-material/Business';
import PaymentIcon from '@mui/icons-material/Payment';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import './Topbar.css';

// Импортируем компонент для отслеживания изменений в проекте
import ProjectChangeLog from './ProjectChangeLog';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'resume-analyzer', label: 'Resume Analyzer', icon: <DescriptionIcon /> },
  { id: 'ai-interviewer', label: 'AI Interviewer', icon: <VideocamIcon /> },
  { id: 'ai-hr-agent', label: 'AI HR Agent', icon: <AutoAwesomeIcon /> },
  { id: 'analytics', label: 'Analytics', icon: <BarChartIcon /> },
  { id: 'company-profile', label: 'Company Profile', icon: <BusinessIcon /> },
  { id: 'billing', label: 'Billing', icon: <PaymentIcon /> },
  { id: 'integrations', label: 'Integrations', icon: <IntegrationInstructionsIcon /> },
  { id: 'resources', label: 'Resources', icon: <MenuBookIcon /> },
  { id: 'profile', label: 'Profile Settings', icon: <PersonIcon /> }
];

const Topbar = ({ activeTab, setActiveTab }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleNavigation = (id) => {
    setActiveTab(id);
    setDrawerOpen(false);
  };

  const drawerList = () => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Recrutor
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              selected={activeTab === item.id}
              onClick={() => handleNavigation(item.id)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: activeTab === item.id ? 'primary.main' : 'text.secondary',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" color="default" elevation={1} className="topbar">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            Recrutor
          </Typography>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Добавляем компонент для отслеживания изменений */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <ProjectChangeLog />
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="subtitle2" noWrap component="div" sx={{ color: 'text.secondary' }}>
              {navigationItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerList()}
      </Drawer>
      
      {/* Toolbar placeholder to push content below app bar */}
      <Toolbar />
    </>
  );
};

export default Topbar;
