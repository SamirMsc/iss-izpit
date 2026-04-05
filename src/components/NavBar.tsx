import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/app.css';

const NavBar: React.FC = () => {
  return (
    <nav className="topbar">
      <Link to="/" className="brand">Student Servis</Link>
      <div className="topbar-links">
        <Link to="/auth/signin">Login</Link>
        <Link to="/auth/signup" className="primary-link">Register</Link>
      </div>
    </nav>
  );
};

export default NavBar;
