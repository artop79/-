import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Paper,
  LinearProgress
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import './Analytics.css';

// Mock data for charts
const hiringFunnelData = [
  { name: 'Applications', value: 350, fill: '#8884d8' },
  { name: 'Screened', value: 240, fill: '#83a6ed' },
  { name: 'Interviewed', value: 120, fill: '#8dd1e1' },
  { name: 'Offered', value: 35, fill: '#82ca9d' },
  { name: 'Hired', value: 25, fill: '#a4de6c' },
];

const vacancyPerformanceData = [
  { name: 'Frontend', applicants: 145, interviews: 43, hires: 12 },
  { name: 'Backend', applicants: 120, interviews: 38, hires: 8 },
  { name: 'Designer', applicants: 85, interviews: 25, hires: 5 },
  { name: 'PM', applicants: 65, interviews: 18, hires: 3 },
  { name: 'DevOps', applicants: 40, interviews: 12, hires: 2 },
];

const aiAccuracyData = [
  { name: 'Jan', accuracy: 75 },
  { name: 'Feb', accuracy: 78 },
  { name: 'Mar', accuracy: 82 },
  { name: 'Apr', accuracy: 85 },
  { name: 'May', accuracy: 87 },
  { name: 'Jun', accuracy: 90 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Analytics = ({ minimal }) => {
  
  // Mini display for dashboard overview
  if (minimal) {
    return (
      <Card variant="outlined" sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <BarChartIcon sx={{ mr: 1 }} /> Analytics
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={vacancyPerformanceData}
                margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              >
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="applicants" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      
      {/* Hiring Funnel */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom>
          Hiring Funnel
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hiringFunnelData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Number of Candidates">
                    {hiringFunnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={hiringFunnelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {hiringFunnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, 'Candidates']} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                {hiringFunnelData.map((stage, index) => (
                  <Grid item xs={6} sm={4} md={2.4} key={index}>
                    <Card variant="outlined" sx={{ height: '100%' }}>
                      <CardContent sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {stage.name}
                        </Typography>
                        <Typography variant="h5" sx={{ my: 1 }}>
                          {stage.value}
                        </Typography>
                        {index > 0 && (
                          <Typography variant="caption" color="text.secondary">
                            {Math.round((stage.value / hiringFunnelData[index-1].value) * 100)}% from previous
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Vacancy Performance */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom>
          Vacancy Performance
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ height: 300, mb: 3 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={vacancyPerformanceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applicants" name="Applicants" fill="#8884d8" />
              <Bar dataKey="interviews" name="Interviews" fill="#82ca9d" />
              <Bar dataKey="hires" name="Hires" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
        
        <Grid container spacing={2}>
          {vacancyPerformanceData.map((vacancy, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card variant="outlined" sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    {vacancy.name}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  
                  <Box sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Applicants to Interviews</Typography>
                      <Typography variant="body2">
                        {Math.round((vacancy.interviews / vacancy.applicants) * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(vacancy.interviews / vacancy.applicants) * 100} 
                      sx={{ height: 6, borderRadius: 3 }} 
                    />
                  </Box>
                  
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">Interviews to Hires</Typography>
                      <Typography variant="body2">
                        {Math.round((vacancy.hires / vacancy.interviews) * 100)}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(vacancy.hires / vacancy.interviews) * 100} 
                      sx={{ height: 6, borderRadius: 3 }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* AI Performance */}
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        <Typography variant="h6" gutterBottom>
          AI Performance
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={aiAccuracyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[70, 100]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                name="AI Accuracy (%)" 
                stroke="#8884d8" 
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                AI KPI Metrics
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: '#8884d8' }}>
                      {aiAccuracyData[aiAccuracyData.length - 1].accuracy}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current AI Accuracy
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: '#8884d8' }}>
                      +{aiAccuracyData[aiAccuracyData.length - 1].accuracy - aiAccuracyData[0].accuracy}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Accuracy Improvement
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ color: '#8884d8' }}>
                      85%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      HR Satisfaction
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Paper>
    </Box>
  );
};

export default Analytics;
