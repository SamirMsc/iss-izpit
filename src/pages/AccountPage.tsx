import React, { useState } from 'react';
import axios from 'axios';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { Navigate } from 'react-router-dom';
import { User } from '../interfaces/types';

interface Props {
  user: User | null;
  setUser: (user: User) => void;
  onRefreshNotifications: () => void;
}

const AccountPage: React.FC<Props> = ({ user, setUser, onRefreshNotifications }) => {
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    imgUrl: user?.imgUrl || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    repeatNewPassword: '',
  });
  const [message, setMessage] = useState('');

  if (!user) return <Navigate to="/auth/signin" replace />;

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.patch('http://localhost:3000/users/me', profile, { withCredentials: true });
    const updatedUser = { ...user, ...response.data };
    localStorage.setItem('studentServisUser', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setMessage('Profile updated successfully.');
  };

  const updatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await axios.patch('http://localhost:3000/auth/update-password', passwordForm, { withCredentials: true });
    setMessage(response.data.message || 'Password updated.');
    setPasswordForm({ currentPassword: '', newPassword: '', repeatNewPassword: '' });
  };

  return (
    <div className="page-shell">
      <LoggedInNavbar user={user} onRefreshNotifications={onRefreshNotifications} />
      <div className="container grid-two">
        <form className="section-card form-stack" onSubmit={updateProfile}>
          <h2>Edit account</h2>
          <input value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} placeholder="First name" />
          <input value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} placeholder="Last name" />
          <input value={profile.imgUrl} onChange={(e) => setProfile({ ...profile, imgUrl: e.target.value })} placeholder="Image URL" />
          <button type="submit" className="primary-btn">Save profile</button>
        </form>

        <form className="section-card form-stack" onSubmit={updatePassword}>
          <h2>Change password</h2>
          <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="Current password" />
          <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="New password" />
          <input type="password" value={passwordForm.repeatNewPassword} onChange={(e) => setPasswordForm({ ...passwordForm, repeatNewPassword: e.target.value })} placeholder="Repeat new password" />
          <button type="submit" className="primary-btn">Change password</button>
        </form>
        {message && <div className="section-card"><p>{message}</p></div>}
      </div>
    </div>
  );
};

export default AccountPage;
