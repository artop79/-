import axios from 'axios';

// Базовая конфигурация axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик для добавления токена аутентификации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API для анализа резюме
export const resumeService = {
  analyzeResume: async (resumeFile, jobDescriptionFile) => {
    const formData = new FormData();
    formData.append('resume_file', resumeFile);
    formData.append('job_description_file', jobDescriptionFile);
    
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    
    return api.post('/v1/analysis/compare', formData, config);
  },
  
  getAnalysisHistory: async (limit = 10) => {
    return api.get(`/v1/analysis/history?limit=${limit}`);
  },
  
  getAnalysisById: async (analysisId) => {
    return api.get(`/v1/analysis/${analysisId}`);
  }
};

// API для AI-интервью
export const interviewService = {
  createInterview: async (position, description) => {
    return api.post('/v1/interview/create', { position, description });
  },
  
  sendMessage: async (interviewId, message, history) => {
    return api.post('/v1/interview/message', {
      interviewId,
      message,
      history
    });
  },
  
  getInterviewResults: async (interviewId) => {
    return api.get(`/v1/interview/${interviewId}/results`);
  },
  
  scheduleZoomInterview: async (interviewId, scheduledTime, candidateEmail) => {
    return api.post(`/v1/interview/${interviewId}/schedule`, {
      scheduledTime,
      candidateEmail
    });
  }
};

// API для аналитики
export const analyticsService = {
  getDashboardStats: async () => {
    return api.get('/v1/dashboard/stats');
  },
  
  getResumeStats: async (period = 'month') => {
    return api.get(`/v1/dashboard/resume-stats?period=${period}`);
  },
  
  getInterviewStats: async (period = 'month') => {
    return api.get(`/v1/dashboard/interview-stats?period=${period}`);
  }
};

// API для работы с аккаунтом
export const accountService = {
  updateCompanyProfile: async (profileData) => {
    return api.post('/v1/account/profile', profileData);
  },
  
  updateUserProfile: async (userData) => {
    return api.post('/v1/account/user', userData);
  }
};

export default api;
