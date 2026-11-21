import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  FileText,
  Upload,
  Download,
  Trash2,
  Plus,
  Edit2,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Sparkles,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const ProfilePage = () => {
  const {
    user,
    completeness,
    updateProfile,
    updateSkills,
    addExperience,
    deleteExperience,
    addEducation,
    deleteEducation,
    uploadResume,
    removeResume
  } = useAuth();

  const { showToast } = useToast();

  // Modals state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAddExpOpen, setIsAddExpOpen] = useState(false);
  const [isAddEduOpen, setIsAddEduOpen] = useState(false);

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    location: user?.location || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    website: user?.website || '',
    github: user?.github || '',
    linkedin: user?.linkedin || ''
  });

  // Skills input state
  const [newSkillInput, setNewSkillInput] = useState('');

  // Experience Form State
  const [expForm, setExpForm] = useState({
    title: '',
    company: '',
    location: '',
    period: '',
    description: ''
  });

  // Education Form State
  const [eduForm, setEduForm] = useState({
    degree: '',
    school: '',
    period: '',
    gpa: '',
    details: ''
  });

  if (!user) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2>Please Log In to View Your Profile</h2>
        <p style={{ margin: '1rem 0 2rem 0' }}>Log in or sign up to create and customize your candidate resume profile.</p>
      </div>
    );
  }

  // Handle Edit Profile Save
  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
    setIsEditProfileOpen(false);
  };

  // Handle Skill Tag Addition
  const handleAddSkill = (e) => {
    e.preventDefault();
    const trimmed = newSkillInput.trim();
    if (!trimmed) return;
    if (user.skills.includes(trimmed)) {
      showToast(`"${trimmed}" is already in your skills list.`, 'warning');
      return;
    }
    updateSkills([...(user.skills || []), trimmed]);
    setNewSkillInput('');
  };

  // Handle Skill Tag Removal
  const handleRemoveSkill = (skillToRemove) => {
    const updated = (user.skills || []).filter((s) => s !== skillToRemove);
    updateSkills(updated);
  };

  // Handle Experience Addition
  const handleAddExpSubmit = (e) => {
    e.preventDefault();
    if (!expForm.title || !expForm.company) {
      showToast('Please enter job title and company.', 'warning');
      return;
    }
    addExperience(expForm);
    setExpForm({ title: '', company: '', location: '', period: '', description: '' });
    setIsAddExpOpen(false);
  };

  // Handle Education Addition
  const handleAddEduSubmit = (e) => {
    e.preventDefault();
    if (!eduForm.degree || !eduForm.school) {
      showToast('Please enter degree and university/school.', 'warning');
      return;
    }
    addEducation(eduForm);
    setEduForm({ degree: '', school: '', period: '', gpa: '', details: '' });
    setIsAddEduOpen(false);
  };

  // Resume Download Simulation
  const handleDownloadResume = () => {
    showToast(`Downloading ${user.resume?.fileName || 'Resume.pdf'}...`, 'success', 'Resume Download');
  };

  // Resume File Upload Simulation
  const handleResumeFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadResume(file);
    }
  };

  return (
    <div className="section-padding" style={{ paddingTop: '2.5rem' }}>
      <div className="container">
        {/* 1. Profile Header Card */}
        <div className="profile-header-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.75rem', flexWrap: 'wrap' }}>
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="profile-avatar-large"
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h1 style={{ fontSize: '2rem' }}>{user.name}</h1>
                <span className="badge badge-primary">{user.role === 'employer' ? 'Recruiter' : 'Candidate'}</span>
              </div>

              <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#4f46e5', marginBottom: '0.5rem' }}>
                {user.headline || 'Professional'}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#64748b' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={15} /> {user.location || 'Not specified'}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Mail size={15} /> {user.email}
                </span>
                {user.phone && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={15} /> {user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            icon={Edit2}
            onClick={() => {
              setProfileForm({
                name: user.name || '',
                headline: user.headline || '',
                location: user.location || '',
                phone: user.phone || '',
                bio: user.bio || '',
                website: user.website || '',
                github: user.github || '',
                linkedin: user.linkedin || ''
              });
              setIsEditProfileOpen(true);
            }}
          >
            Edit Profile
          </Button>
        </div>

        {/* 2. Completeness Meter */}
        <div className="completeness-meter-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="#4f46e5" /> Profile Completeness Score
            </span>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#4f46e5' }}>{completeness}%</span>
          </div>
          <div className="meter-progress-track">
            <div className="meter-progress-bar" style={{ width: `${completeness}%` }} />
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {completeness === 100 ? (
              <span style={{ color: '#10b981', fontWeight: 600 }}>
                🎉 Great job! Your profile is 100% complete and verified for top employers.
              </span>
            ) : (
              'Complete your work experience, education, and resume to maximize your visibility to recruiters.'
            )}
          </div>
        </div>

        {/* 3. About & Bio */}
        <div className="profile-section-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Professional Summary</h3>
          <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#334155', margin: 0 }}>
            {user.bio || 'No professional bio provided yet. Click "Edit Profile" to add a bio.'}
          </p>
        </div>

        {/* 4. Skills Section */}
        <div className="profile-section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Skills & Expertise</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Highlight technical proficiencies, frameworks, and methodologies.
              </p>
            </div>

            <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Add skill (e.g. Next.js, GraphQL)"
                style={{ padding: '0.45rem 0.85rem', fontSize: '0.875rem', width: '220px' }}
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
              />
              <Button type="submit" variant="primary" size="sm" icon={Plus}>
                Add
              </Button>
            </form>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            {(user.skills || []).map((skill, idx) => (
              <span
                key={idx}
                className="skill-tag"
                style={{ fontSize: '0.9rem', padding: '0.45rem 0.9rem', background: '#eef2ff', color: '#4f46e5', borderColor: '#c7d2fe', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', display: 'flex', padding: 0 }}
                  aria-label={`Remove ${skill}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* 5. Work Experience */}
        <div className="profile-section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Work Experience</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Your professional career milestones and achievements.
              </p>
            </div>
            <Button variant="outline" size="sm" icon={Plus} onClick={() => setIsAddExpOpen(true)}>
              Add Experience
            </Button>
          </div>

          {(user.experience || []).length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No work experience added yet.</p>
          ) : (
            <div>
              {user.experience.map((exp) => (
                <div key={exp.id} className="timeline-entry">
                  <div className="timeline-node" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{exp.title}</h4>
                      <div style={{ fontSize: '0.9rem', color: '#4f46e5', fontWeight: 600 }}>
                        {exp.company} &bull; <span style={{ color: '#64748b', fontWeight: 400 }}>{exp.location}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="badge badge-neutral">{exp.period}</span>
                      <button
                        onClick={() => deleteExperience(exp.id)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        title="Delete Experience"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', marginTop: '0.5rem' }}>
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 6. Education */}
        <div className="profile-section-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Education & Credentials</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                Academic background, degrees, and certificates.
              </p>
            </div>
            <Button variant="outline" size="sm" icon={Plus} onClick={() => setIsAddEduOpen(true)}>
              Add Education
            </Button>
          </div>

          {(user.education || []).length === 0 ? (
            <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No education details added yet.</p>
          ) : (
            <div>
              {user.education.map((edu) => (
                <div key={edu.id} className="timeline-entry">
                  <div className="timeline-node" style={{ background: '#0ea5e9' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{edu.degree}</h4>
                      <div style={{ fontSize: '0.9rem', color: '#0284c7', fontWeight: 600 }}>
                        {edu.school} {edu.gpa && <span style={{ color: '#64748b', fontWeight: 400 }}>&bull; GPA: {edu.gpa}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span className="badge badge-neutral">{edu.period}</span>
                      <button
                        onClick={() => deleteEducation(edu.id)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        title="Delete Education"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  {edu.details && (
                    <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.6', marginTop: '0.5rem' }}>
                      {edu.details}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. Resume Document Management */}
        <div className="profile-section-card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Resume / CV Document</h3>
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.5rem' }}>
            Your default resume attached to fast-track job applications.
          </p>

          {user.resume?.fileName ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem',
                border: '1px solid #c7d2fe',
                borderRadius: '12px',
                background: '#f8fafc',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '10px',
                    background: '#e0e7ff',
                    color: '#4f46e5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <FileText size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{user.resume.fileName}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Uploaded {user.resume.uploadedDate} &bull; {user.resume.fileSize}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Button variant="secondary" size="sm" icon={Download} onClick={handleDownloadResume}>
                  Download
                </Button>
                <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer' }}>
                  <Upload size={14} /> Replace
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={handleResumeFileChange}
                  />
                </label>
                <button
                  onClick={removeResume}
                  className="btn btn-danger btn-sm btn-icon-only"
                  title="Delete Resume"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="resume-preview-box">
              <Upload size={36} color="#4f46e5" style={{ marginBottom: '0.75rem' }} />
              <h4>Upload your Resume / CV</h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0.25rem 0 1rem 0' }}>
                Supports PDF, DOCX files up to 5MB.
              </p>
              <label className="btn btn-primary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
                Select Document
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: 'none' }}
                  onChange={handleResumeFileChange}
                />
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        title="Edit Personal Information"
        maxWidth="620px"
      >
        <form onSubmit={handleSaveProfile}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Professional Headline</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Senior Frontend Engineer"
                value={profileForm.headline}
                onChange={(e) => setProfileForm({ ...profileForm, headline: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                placeholder="City, State"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                className="form-input"
                placeholder="+1 (555) 000-0000"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">About / Bio</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Website / Portfolio URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://..."
                value={profileForm.website}
                onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn Profile URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://linkedin.com/in/..."
                value={profileForm.linkedin}
                onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={() => setIsEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Experience Modal */}
      <Modal
        isOpen={isAddExpOpen}
        onClose={() => setIsAddExpOpen(false)}
        title="Add Work Experience"
        maxWidth="560px"
      >
        <form onSubmit={handleAddExpSubmit}>
          <div className="form-group">
            <label className="form-label">Job Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Senior Frontend Developer"
              value={expForm.title}
              onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Acme Corp"
                value={expForm.company}
                onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Time Period *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2022 - Present"
                value={expForm.period}
                onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. San Francisco, CA (Remote)"
              value={expForm.location}
              onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Key Responsibilities & Achievements</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="Describe your core impact, technologies used, and metrics achieved..."
              value={expForm.description}
              onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={() => setIsAddExpOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Experience
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Education Modal */}
      <Modal
        isOpen={isAddEduOpen}
        onClose={() => setIsAddEduOpen(false)}
        title="Add Education / Degree"
        maxWidth="560px"
      >
        <form onSubmit={handleAddEduSubmit}>
          <div className="form-group">
            <label className="form-label">Degree or Certification *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. B.S. in Computer Science"
              value={eduForm.degree}
              onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Institution / University *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Stanford University"
                value={eduForm.school}
                onChange={(e) => setEduForm({ ...eduForm, school: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Years *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. 2016 - 2020"
                value={eduForm.period}
                onChange={(e) => setEduForm({ ...eduForm, period: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">GPA or Honors (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 3.9 / 4.0 (Magna Cum Laude)"
              value={eduForm.gpa}
              onChange={(e) => setEduForm({ ...eduForm, gpa: e.target.value })}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={() => setIsAddEduOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Education
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProfilePage;
