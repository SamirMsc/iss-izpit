import React, { useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './styles/app.css';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import CompanyJobsPage from './pages/CompanyJobsPage';
import NotificationsPage from './pages/NotificationsPage';
import AccountPage from './pages/AccountPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { User } from './interfaces/types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('studentServisUser');
    return raw ? JSON.parse(raw) : null;
  });

  const refreshNotifications = useMemo(() => () => {}, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/signin" element={<LoginPage />} />
      <Route path="/auth/signup" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<DashboardPage user={user} onRefreshNotifications={refreshNotifications} />} />
      <Route path="/jobs" element={<JobsPage user={user} onRefreshNotifications={refreshNotifications} />} />
      <Route path="/applications" element={<MyApplicationsPage user={user} onRefreshNotifications={refreshNotifications} />} />
      <Route path="/company/jobs" element={<CompanyJobsPage user={user} onRefreshNotifications={refreshNotifications} />} />
      <Route path="/notifications" element={<NotificationsPage user={user} onRefreshNotifications={refreshNotifications} />} />
      <Route path="/account" element={<AccountPage user={user} setUser={setUser} onRefreshNotifications={refreshNotifications} />} />
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/'} replace />} />
    </Routes>
  );
};

export default App;
