import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Props {
  onRefresh: () => void;
}

const NotificationBell: React.FC<Props> = ({ onRefresh }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = async () => {
    try {
      const response = await axios.get('http://localhost:3000/notifications', { withCredentials: true });
      const unread = Array.isArray(response.data)
        ? response.data.filter((item: any) => !item.isRead).length
        : 0;
      setUnreadCount(unread);
      onRefresh();
    } catch {
      setUnreadCount(0);
    }
  };

  useEffect(() => {
    fetchUnread();
  }, []);

  return (
    <Link to="/notifications" className="bell-link" onClick={fetchUnread}>
      🔔
      {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
    </Link>
  );
};

export default NotificationBell;
