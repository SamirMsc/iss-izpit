import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoggedInNavbar from '../components/LoggedInNavbar';
import { Job, User } from '../interfaces/types';
import ApplyModal from '../components/ApplyModal';

interface Props {
  user: User | null;
  onRefreshNotifications: () => void;
}

const JobsPage: React.FC<Props> = ({ user, onRefreshNotifications }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [message, setMessage] = useState('');

  const fetchJobs = async () => {
    const response = await axios.get('http://localhost:3000/jobs');
    setJobs(response.data || []);
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleApply = async (data: { resumeUrl: string; motivation: string }) => {
    if (!selectedJob) return;
    try {
      await axios.post(
        'http://localhost:3000/applications',
        { jobId: selectedJob.id, ...data },
        { withCredentials: true }
      );
      setMessage('Application submitted successfully.');
      setSelectedJob(null);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Could not apply for this job.');
    }
  };

  return (
    <div className="page-shell">
      {user && <LoggedInNavbar user={user} onRefreshNotifications={onRefreshNotifications} />}
      <div className="container">
        <div className="section-card">
          <h1>Available Jobs</h1>
          <p>Students can apply directly. Companies can browse all listings.</p>
          {message && <p className="info-text">{message}</p>}
        </div>
        <div className="job-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p><strong>Location:</strong> {job.location || 'Not specified'}</p>
              <p><strong>Salary:</strong> {job.salary || 'Not specified'}</p>
              {user?.role === 'STUDENT' && (
                <button className="primary-btn" onClick={() => setSelectedJob(job)}>Apply</button>
              )}
            </div>
          ))}
        </div>
      </div>

      <ApplyModal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onSubmit={handleApply}
      />
    </div>
  );
};

export default JobsPage;
