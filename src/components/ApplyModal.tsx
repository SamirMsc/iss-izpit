import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    resume: File;
    motivation: string;
  }) => Promise<void>;
}

const ApplyModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [resume, setResume] = useState<File | null>(null);
  const [motivation, setMotivation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!resume) {
      alert('Please upload your resume.');
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        resume,
        motivation,
      });

      setResume(null);
      setMotivation('');
    } catch (error) {
      console.error('Application submit failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3>Apply for job</h3>

        <div className="file-upload-group">
          <label htmlFor="resume-upload">
            Upload resume
          </label>

          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setResume(file);
            }}
          />

          {resume && (
            <p className="selected-file">
              Selected: {resume.name}
            </p>
          )}
        </div>

        <textarea
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          rows={6}
          placeholder="Why are you applying for this job?"
        />

        <div className="row gap-sm">
          <button
            onClick={handleSubmit}
            className="primary-btn"
            disabled={isSubmitting || !resume}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>

          <button
            onClick={onClose}
            className="secondary-btn"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyModal;