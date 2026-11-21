import React, { useState, useEffect } from 'react';
import { FileText, Upload, Send, CheckCircle2, User, Mail, Phone, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useJobs } from '../../context/JobContext';
import Modal from '../common/Modal';
import Button from '../common/Button';

const JobApplyModal = ({ isOpen, onClose, job }) => {
  const { user } = useAuth();
  const { applyForJob } = useJobs();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [selectedResumeName, setSelectedResumeName] = useState('');
  const [customFile, setCustomFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user && isOpen) {
      setFullName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setPortfolioUrl(user.website || user.github || '');
      if (user.resume?.fileName) {
        setSelectedResumeName(user.resume.fileName);
      } else {
        setSelectedResumeName('Standard_Resume.pdf');
      }
    }
  }, [user, isOpen]);

  if (!job) return null;

  const validate = () => {
    const newErrors = {};
    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim() || !email.includes('@')) newErrors.email = 'Valid email is required';
    if (!selectedResumeName && !customFile) newErrors.resume = 'Please attach a resume file';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCustomFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomFile(file);
      setSelectedResumeName(file.name);
      if (errors.resume) {
        setErrors((prev) => ({ ...prev, resume: null }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      applyForJob(job.id, {
        fullName,
        email,
        phone,
        portfolioUrl,
        coverLetter,
        resumeName: selectedResumeName
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply for ${job.title}`}
      maxWidth="680px"
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
          Applying to <strong style={{ color: '#0f172a' }}>{job.company}</strong> &bull; {job.location} &bull; {job.salary}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Alex Morgan"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            {errors.fullName && <div className="form-error-msg">{errors.fullName}</div>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="form-input"
                placeholder="e.g. alex@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <div className="form-error-msg">{errors.email}</div>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <div className="input-with-icon">
              <Phone className="input-icon" size={18} />
              <input
                type="text"
                className="form-input"
                placeholder="e.g. +1 (555) 019-2834"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Portfolio or LinkedIn */}
          <div className="form-group">
            <label className="form-label">Portfolio / LinkedIn URL</label>
            <div className="input-with-icon">
              <Globe className="input-icon" size={18} />
              <input
                type="url"
                className="form-input"
                placeholder="https://myportfolio.com"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Resume Selection */}
        <div className="form-group">
          <label className="form-label">Attach Resume / CV *</label>
          <div
            style={{
              padding: '1rem',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: '#e0e7ff',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FileText size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  {selectedResumeName || "No resume selected"}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>PDF, DOCX up to 5MB</div>
              </div>
            </div>

            <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
              <Upload size={14} />
              <span>{selectedResumeName ? 'Replace File' : 'Upload File'}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={handleCustomFileUpload}
              />
            </label>
          </div>
          {errors.resume && <div className="form-error-msg">{errors.resume}</div>}
        </div>

        {/* Cover Letter */}
        <div className="form-group">
          <label className="form-label">Cover Note / Why are you a great fit?</label>
          <textarea
            className="form-textarea"
            rows="3"
            placeholder="Introduce yourself and briefly mention why your experience matches this role..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            icon={Send}
            iconPosition="right"
          >
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JobApplyModal;
