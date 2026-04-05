import React, { useEffect, useState } from 'react';
import { Job } from '../interfaces/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; description: string; location: string; salary: string }) => Promise<void>;
  job?: Job | null;
}

const JobFormModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, job }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');

  useEffect(() => {
    setTitle(job?.title || '');
    setDescription(job?.description || '');
    setLocation(job?.location || '');
    setSalary(job?.salary || '');
  }, [job, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>{job ? 'Edit Job' : 'Create Job'}</h3>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Job title" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Job description" rows={5} />
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Location" />
        <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="Salary" />
        <div className="row gap-sm">
          <button onClick={() => onSubmit({ title, description, location, salary })} className="primary-btn">Save</button>
          <button onClick={onClose} className="secondary-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default JobFormModal;
