import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/app.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3000/auth/signin',
        { email, password },
        { withCredentials: true }
      );
      console.log(email, password)
      localStorage.setItem('studentServisUser', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error-text">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="primary-btn">Login</button>
        <Link to="/auth/forgot-password">Forgot password?</Link>
        <p>Don't have an account? <Link to="/auth/signup">Register</Link></p>
      </form>
    </div>
  );
};

export default LoginPage;
