import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { NotificationItem, User } from '../interfaces/types';
import { Navigate } from 'react-router-dom';

interface Props {
  user: User | null;
  onRefreshNotifications: () => void;
}

const NotificationsPage: React.FC<Props> = ({ user, onRefreshNotifications }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = async () => {
    const response = await axios.get('http://localhost:3000/notifications', { withCredentials: true });
    setNotifications(response.data || []);
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  if (!user) return <Navigate to="/auth/signin" replace />;

  const markAsRead = async (notificationId: string) => {
    await axios.patch(`http://localhost:3000/notifications/${notificationId}/read`, {}, { withCredentials: true });
    fetchNotifications();
  };

  return (
    <div className="page-shell">
      <LoggedInNavbar user={user} onRefreshNotifications={onRefreshNotifications} />
      <div className="container">
        <div className="section-card">
          <h1>Notifications</h1>
          <p>Open your latest application updates here.</p>
        </div>
        <div className="job-grid">
          {notifications.map((item) => (
            <div key={item.id} className={`job-card ${item.isRead ? '' : 'card-unread'}`}>
              <h3>{item.title}</h3>
              <p>{item.message}</p>
              <p><strong>Date:</strong> {new Date(item.createdAt).toLocaleString()}</p>
              {!item.isRead && <button className="secondary-btn" onClick={() => markAsRead(item.id)}>Mark as read</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
