import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/app.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    repeatPassword: '',
    role: 'STUDENT',
    imgUrl: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/signup', form, { withCredentials: true });
      navigate('/auth/signin');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className="error-text">{error}</p>}
        <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} />
        <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="STUDENT">Student</option>
          <option value="COMPANY">Company</option>
        </select>
        <input name="imgUrl" placeholder="Profile image URL (optional)" value={form.imgUrl} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
        <input name="repeatPassword" type="password" placeholder="Repeat password" value={form.repeatPassword} onChange={handleChange} />
        <button type="submit" className="primary-btn">Create account</button>
        <p>Already have an account? <Link to="/auth/signin">Login</Link></p>
      </form>
    </div>
  );
};

export default RegisterPage;
