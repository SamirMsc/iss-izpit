import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User } from '../interfaces/types';
import NotificationBell from './NotificationBell';
import '../styles/app.css';

interface Props {
  user: User;
  onRefreshNotifications: () => void;
}

const LoggedInNavbar: React.FC<Props> = ({ user, onRefreshNotifications }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/auth/signout', {}, { withCredentials: true });
    } catch (e) {
      console.error(e);
    } finally {
      localStorage.removeItem('studentServisUser');
      navigate('/auth/signin');
    }
  };

  return (
    <nav className="topbar">
      <Link to="/dashboard" className="brand">Student Servis</Link>
      <div className="topbar-links">
        <Link to="/jobs">Jobs</Link>
        {user.role === 'STUDENT' ? (
          <Link to="/applications">My Applications</Link>
        ) : (
          <Link to="/company/jobs">My Jobs</Link>
        )}
        <Link to="/account">Account</Link>
        <NotificationBell onRefresh={onRefreshNotifications} />
        <button className="link-button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default LoggedInNavbar;
