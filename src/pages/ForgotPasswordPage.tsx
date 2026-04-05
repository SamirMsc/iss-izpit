import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/forgot-password', { email });
      setMessage(response.data.message || 'Reset request sent.');
    } catch {
      setMessage('Could not process the request.');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Forgot password</h2>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <button type="submit" className="primary-btn">Send reset request</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
