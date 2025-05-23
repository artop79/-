import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Typography,
  Divider,
  Avatar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
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
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

// Стилизованные компоненты
const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 240,
  height: '100vh',
  backgroundColor: '#1E2022',
  color: '#fff',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  left: 0,
  top: 0,
  bottom: 0,
  zIndex: 1200,
}));

const LogoBox = styled(Box)(({ theme }) => ({
  padding: '24px 20px',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  padding: '4px 8px',
  margin: '4px 0',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  ...(active && {
    backgroundColor: 'rgba(255,255,255,0.08)',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 4,
      backgroundColor: '#2E9763',
    }
  })
}));

const ListLabel = styled(Typography)(({ theme }) => ({
  padding: '8px 20px',
  color: 'rgba(255,255,255,0.5)',
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: 1,
}));

// Main navigation items
const mainNavItems = [
  { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'resume-analyzer', path: '/resume-analyzer', label: 'Resume Analyzer', icon: <DescriptionIcon /> },
  { id: 'ai-interviewer', path: '/ai-interviewer', label: 'AI Interviewer', icon: <VideocamIcon /> },
  { id: 'analytics', path: '/analytics', label: 'Analytics', icon: <BarChartIcon /> },
  { id: 'company-profile', path: '/company-profile', label: 'Company Profile', icon: <BusinessIcon /> },
];

// Management items
const managementNavItems = [
  { id: 'billing', path: '/billing', label: 'Billing', icon: <PaymentIcon /> },
  { id: 'integrations', path: '/integrations', label: 'Integrations', icon: <IntegrationInstructionsIcon /> },
  { id: 'resources', path: '/resources', label: 'Resources', icon: <MenuBookIcon /> },
  { id: 'profile', path: '/profile', label: 'Profile Settings', icon: <PersonIcon /> },
];

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <SidebarContainer>
      <LogoBox>
        <Typography variant="h6" fontWeight="bold">
          Raplle<span style={{ color: '#35bfed' }}>AI</span>
        </Typography>
      </LogoBox>
      
      <ListLabel sx={{ mt: 2 }}>Main</ListLabel>
      <List sx={{ p: '0 16px' }}>
        {mainNavItems.map((item) => (
          <StyledListItem 
            key={item.id} 
            disablePadding 
            active={activeTab === item.id ? 1 : 0}
            onClick={() => setActiveTab && setActiveTab(item.id)}
          >
            <ListItemButton
              sx={{
                borderRadius: 1,
                padding: '8px 16px',
              }}
            >
              <ListItemIcon sx={{ 
                color: '#fff',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: activeTab === item.id ? 'medium' : 'regular',
                }}
              />
            </ListItemButton>
          </StyledListItem>
        ))}
      </List>
      
      <ListLabel sx={{ mt: 2 }}>Management</ListLabel>
      <List sx={{ p: '0 16px' }}>
        {managementNavItems.map((item) => (
          <StyledListItem 
            key={item.id} 
            disablePadding 
            active={activeTab === item.id ? 1 : 0}
            onClick={() => setActiveTab && setActiveTab(item.id)}
          >
            <ListItemButton
              sx={{
                borderRadius: 1,
                padding: '8px 16px',
              }}
            >
              <ListItemIcon sx={{ 
                color: '#fff',
                minWidth: 40
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label} 
                primaryTypographyProps={{
                  fontSize: '0.95rem',
                  fontWeight: activeTab === item.id ? 'medium' : 'regular',
                }}
              />
            </ListItemButton>
          </StyledListItem>
        ))}
      </List>
      
      <Box sx={{ mt: 'auto', p: '8px 16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <StyledListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, padding: '8px 16px' }}>
            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Settings" 
              primaryTypographyProps={{
                fontSize: '0.95rem',
              }}
            />
          </ListItemButton>
        </StyledListItem>
        
        <StyledListItem disablePadding>
          <ListItemButton sx={{ borderRadius: 1, padding: '8px 16px' }}>
            <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{
                fontSize: '0.95rem',
              }}
            />
          </ListItemButton>
        </StyledListItem>
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;
