import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { User } from '../interfaces/types';

interface Props {
  user: User | null;
  onRefreshNotifications: () => void;
}

const DashboardPage: React.FC<Props> = ({ user, onRefreshNotifications }) => {
  if (!user) return <Navigate to="/auth/signin" replace />;

  return (
    <div className="page-shell">
      <LoggedInNavbar user={user} onRefreshNotifications={onRefreshNotifications} />
      <div className="container">
        <div className="section-card">
          <h1>Welcome, {user.firstName || user.email}</h1>
          <p>
            {user.role === 'STUDENT'
              ? 'Browse jobs, apply with your resume, and follow company responses in notifications.'
              : 'Create job posts, review student applications, and accept or reject candidates.'}
          </p>
        </div>

        <div className="grid-two">
          <Link to="/jobs" className="section-card action-card">
            <h3>Jobs</h3>
            <p>{user.role === 'STUDENT' ? 'See all available jobs and apply.' : 'See all jobs currently in the system.'}</p>
          </Link>
          <Link to={user.role === 'STUDENT' ? '/applications' : '/company/jobs'} className="section-card action-card">
            <h3>{user.role === 'STUDENT' ? 'My Applications' : 'My Jobs'}</h3>
            <p>{user.role === 'STUDENT' ? 'Track your active and answered applications.' : 'Manage your job posts and applications.'}</p>
          </Link>
          <Link to="/notifications" className="section-card action-card">
            <h3>Notifications</h3>
            <p>Open the bell area and see updates from companies.</p>
          </Link>
          <Link to="/account" className="section-card action-card">
            <h3>Account</h3>
            <p>Edit your profile data and change password.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
