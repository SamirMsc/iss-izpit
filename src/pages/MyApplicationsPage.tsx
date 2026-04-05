import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { Application, User } from '../interfaces/types';
import { Navigate } from 'react-router-dom';

interface Props {
  user: User | null;
  onRefreshNotifications: () => void;
}

const MyApplicationsPage: React.FC<Props> = ({ user, onRefreshNotifications }) => {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await axios.get('http://localhost:3000/applications/me', { withCredentials: true });
      setApplications(response.data || []);
    };
    if (user?.role === 'STUDENT') fetchApplications();
  }, [user]);

  if (!user) return <Navigate to="/auth/signin" replace />;
  if (user.role !== 'STUDENT') return <Navigate to="/dashboard" replace />;

  return (
    <div className="page-shell">
      <LoggedInNavbar user={user} onRefreshNotifications={onRefreshNotifications} />
      <div className="container">
        <div className="section-card">
          <h1>My Applications</h1>
          <p>You can have at most 3 active pending applications at the same time.</p>
        </div>
        <div className="job-grid">
          {applications.map((application) => (
            <div key={application.id} className="job-card">
              <h3>{application.job?.title || 'Job application'}</h3>
              <p><strong>Status:</strong> {application.status}</p>
              <p><strong>Resume:</strong> {application.resumeUrl}</p>
              <p><strong>Motivation:</strong> {application.motivation}</p>
              <p><strong>Company response:</strong> {application.companyResponse || 'No answer yet'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyApplicationsPage;
