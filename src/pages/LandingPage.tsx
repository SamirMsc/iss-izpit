import React from 'react';
import NavBar from '../components/NavBar';
import '../styles/app.css';

const LandingPage: React.FC = () => {
  return (
    <div className="page-shell">
      <NavBar />
      <section className="hero-section">
        <div className="hero-card">
          <h1>Find student jobs faster.</h1>
          <p>
            Student Servis connects students looking for work with companies that want to hire quickly.
            Register as a student to apply, or as a company to publish jobs and manage applicants.
          </p>
          <div className="row gap-sm">
            <a href="/auth/signup" className="primary-btn">Get started</a>
            <a href="/auth/signin" className="secondary-btn">Login</a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
