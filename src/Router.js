import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import VacanciesPage from './pages/VacanciesPage';
import VacancyForm from './pages/VacancyForm';
import VacancyDetails from './pages/VacancyDetails';
import InterviewsPage from './pages/InterviewsPage';
import InterviewDetails from './pages/InterviewDetails';
import CandidateInterview from './pages/CandidateInterview';
import NotFoundPage from './pages/NotFoundPage';
import Dashboard from './components/Dashboard/Dashboard';
import ResumeAnalyzer from './components/Dashboard/ResumeAnalyzer';
import AIInterviewer from './components/Dashboard/AIInterviewer';
import AIInterviewerNew from './components/Dashboard/AIInterviewerNew';
import FixedAIInterviewer from './components/Dashboard/FixedAIInterviewer';
import AIInterviewerTest from './components/Dashboard/AIInterviewerTest';
import JobPositions from './components/Dashboard/JobPositions';
import Automation from './components/Dashboard/Automation';
import ProtectedRoute from './components/ProtectedRoute';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/interview/:accessLink" element={<CandidateInterview />} />
        
        {/* Публичный доступ к Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Защищенные маршруты */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Основные маршруты Dashboard */}
          <Route path="/job-positions" element={<JobPositions />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/ai-interviewer" element={<FixedAIInterviewer />} />
          <Route path="/ai-interviewer-old" element={<AIInterviewer />} />
          <Route path="/ai-interviewer-new" element={<AIInterviewerNew />} />
          <Route path="/ai-interviewer-test" element={<AIInterviewerTest />} />
          <Route path="/automation" element={<Automation />} />
          
          {/* Маршруты для работы с вакансиями */}
          <Route path="/vacancies" element={<VacanciesPage />} />
          <Route path="/vacancies/create" element={<VacancyForm />} />
          <Route path="/vacancies/:id" element={<VacancyDetails />} />
          <Route path="/vacancies/:id/edit" element={<VacancyForm />} />
          <Route path="/vacancies/:vacancyId/interviews" element={<InterviewsPage />} />
          <Route path="/vacancies/:id/stats" element={<VacancyDetails />} /> {/* Временно редирект на детали */}
          
          {/* Маршруты для работы с интервью */}
          <Route path="/interviews" element={<InterviewsPage />} />
          <Route path="/interviews/:id" element={<InterviewDetails />} />
        </Route>
        
        {/* Маршрут "Not Found" и редиректы */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
