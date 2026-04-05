import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoggedInNavbar from '../components/LoggedInNavbar';
import JobFormModal from '../components/JobFormModal';
import { Application, Job, User } from '../interfaces/types';
import { Navigate } from 'react-router-dom';

interface Props {
  user: User | null;
  onRefreshNotifications: () => void;
}

const CompanyJobsPage: React.FC<Props> = ({ user, onRefreshNotifications }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [responseTexts, setResponseTexts] = useState<Record<string, string>>({});

  const fetchData = async () => {
    const [jobsResponse, applicationsResponse] = await Promise.all([
      axios.get('http://localhost:3000/jobs/company/me', { withCredentials: true }),
      axios.get('http://localhost:3000/applications/company', { withCredentials: true }),
    ]);
    setJobs(jobsResponse.data || []);
    setApplications(applicationsResponse.data || []);
  };

  useEffect(() => {
    if (user?.role === 'COMPANY') fetchData();
  }, [user]);

  if (!user) return <Navigate to="/auth/signin" replace />;
  if (user.role !== 'COMPANY') return <Navigate to="/dashboard" replace />;

  const handleCreateOrUpdate = async (data: { title: string; description: string; location: string; salary: string }) => {
    if (editingJob) {
      await axios.patch(`http://localhost:3000/jobs/${editingJob.id}`, data, { withCredentials: true });
    } else {
      await axios.post('http://localhost:3000/jobs', data, { withCredentials: true });
    }
    setIsModalOpen(false);
    setEditingJob(null);
    fetchData();
  };

  const handleDelete = async (jobId: string) => {
    await axios.delete(`http://localhost:3000/jobs/${jobId}`, { withCredentials: true });
    fetchData();
  };

  const handleDecision = async (applicationId: string, status: 'ACCEPTED' | 'REJECTED') => {
    const companyResponse = responseTexts[applicationId] || '';
    await axios.patch(
      `http://localhost:3000/applications/${applicationId}/status`,
      { status, companyResponse },
      { withCredentials: true }
    );
    fetchData();
  };

  return (
    <div className="page-shell">
      <LoggedInNavbar user={user} onRefreshNotifications={onRefreshNotifications} />
      <div className="container">
        <div className="section-card row spread align-center">
          <div>
            <h1>My Jobs</h1>
            <p>Create, edit and delete your job posts. Review student applications below.</p>
          </div>
          <button className="primary-btn" onClick={() => { setEditingJob(null); setIsModalOpen(true); }}>Create Job</button>
        </div>

        <div className="job-grid">
          {jobs.map((job) => (
            <div key={job.id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p><strong>Location:</strong> {job.location || 'Not specified'}</p>
              <p><strong>Salary:</strong> {job.salary || 'Not specified'}</p>
              <div className="row gap-sm">
                <button className="secondary-btn" onClick={() => { setEditingJob(job); setIsModalOpen(true); }}>Edit</button>
                <button className="danger-btn" onClick={() => handleDelete(job.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        <div className="section-card">
          <h2>Applications for my jobs</h2>
          <div className="job-grid">
            {applications.map((application) => (
              <div key={application.id} className="job-card">
                <h3>{application.job?.title || 'Application'}</h3>
                <p><strong>Student:</strong> {application.student?.firstName} {application.student?.lastName}</p>
                <p><strong>Email:</strong> {application.student?.email}</p>
                <p><strong>Status:</strong> {application.status}</p>
                <p><strong>Resume:</strong> {application.resumeUrl}</p>
                <p><strong>Motivation:</strong> {application.motivation}</p>
                <textarea
                  rows={4}
                  placeholder="Write acceptance message or decline reason"
                  value={responseTexts[application.id] || application.companyResponse || ''}
                  onChange={(e) => setResponseTexts({ ...responseTexts, [application.id]: e.target.value })}
                />
                <div className="row gap-sm">
                  <button className="primary-btn" onClick={() => handleDecision(application.id, 'ACCEPTED')}>Accept</button>
                  <button className="danger-btn" onClick={() => handleDecision(application.id, 'REJECTED')}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <JobFormModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingJob(null); }}
        onSubmit={handleCreateOrUpdate}
        job={editingJob}
      />
    </div>
  );
};

export default CompanyJobsPage;
