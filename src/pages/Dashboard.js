import React, { useState } from 'react';
import { Box, Container, Grid, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from '../components/Dashboard/Sidebar';
import Topbar from '../components/Dashboard/Topbar';
import ResumeAnalyzer from '../components/Dashboard/ResumeAnalyzer';
import AIInterviewer from '../components/Dashboard/AIInterviewer';
import AIHRAgent from '../components/Dashboard/AIHRAgent';
import Analytics from '../components/Dashboard/Analytics';
import CompanyProfile from '../components/Dashboard/CompanyProfile';
import Billing from '../components/Dashboard/Billing';
import Integrations from '../components/Dashboard/Integrations';
import Resources from '../components/Dashboard/Resources';
import ProfileSettings from '../components/Dashboard/ProfileSettings';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Function to render the active component based on the selected tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'resume-analyzer':
        return <ResumeAnalyzer />;
      case 'ai-interviewer':
        return <AIInterviewer />;
      case 'ai-hr-agent':
        return <AIHRAgent />;
      case 'analytics':
        return <Analytics />;
      case 'company-profile':
        return <CompanyProfile />;
      case 'billing':
        return <Billing />;
      case 'integrations':
        return <Integrations />;
      case 'resources':
        return <Resources />;
      case 'profile':
        return <ProfileSettings />;
      default:
        // Dashboard overview - shows a summary of all modules
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <ResumeAnalyzer minimal />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AIInterviewer minimal />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <AIHRAgent minimal />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <Analytics minimal />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <CompanyProfile minimal />
            </Grid>
          </Grid>
        );
    }
  };

  return (
    <Box className="dashboard-container">
      {isMobile ? (
        <Topbar activeTab={activeTab} setActiveTab={setActiveTab} />
      ) : (
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
      
      <Box 
        className="dashboard-content"
        sx={{ 
          marginLeft: isMobile ? 0 : '250px',
          width: isMobile ? '100%' : 'calc(100% - 250px)',
          padding: 3
        }}
      >
        <Container maxWidth="xl">
          {renderActiveComponent()}
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
