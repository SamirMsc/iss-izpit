import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { resumeUrl: string; motivation: string }) => Promise<void>;
}

const ApplyModal: React.FC<Props> = ({ isOpen, onClose, onSubmit }) => {
  const [resumeUrl, setResumeUrl] = useState('');
  const [motivation, setMotivation] = useState('');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Apply for job</h3>
        <input
          value={resumeUrl}
          onChange={(e) => setResumeUrl(e.target.value)}
          placeholder="Resume URL or file path"
        />
        <textarea
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          rows={6}
          placeholder="Why are you applying for this job?"
        />
        <div className="row gap-sm">
          <button onClick={() => onSubmit({ resumeUrl, motivation })} className="primary-btn">Submit</button>
          <button onClick={onClose} className="secondary-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;
