import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, Eye, EyeOff, Users, Sparkles, Building2,
  Phone, User, MapPin, Briefcase, Award, ChevronRight
} from 'lucide-react';
import { useHR } from '../../context/HRContext';
import Button from '../../components/common/Button';
import { mockCompanies } from '../../data/mockCompanies';

const HRRegisterPage = () => {
  const { registerHR, loginHRDemo } = useHR();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Account, 2: Professional Info
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    companyId: '',
    designation: '',
    department: '',
    phone: '',
    experience: '2-5 years',
    specialization: '',
    location: '',
    bio: ''
  });

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: '', color: '#e2e8f0' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 9) score++;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) return { score: 25, text: 'Weak', color: '#ef4444' };
    if (score <= 2) return { score: 50, text: 'Fair', color: '#f59e0b' };
    if (score <= 3) return { score: 75, text: 'Good', color: '#0ea5e9' };
    return { score: 100, text: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(formData.password);

  const validateStep1 = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email required';
    if (!formData.password || formData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.company.trim()) errs.company = 'Company/Organization name is required';
    if (!formData.designation.trim()) errs.designation = 'Job designation is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    const success = registerHR(formData);
    if (success) navigate('/hr/dashboard');
  };

  const handleDemoLogin = () => {
    loginHRDemo();
    navigate('/hr/dashboard');
  };

  return (
    <div className="auth-page-container" style={{ minHeight: 'calc(100vh - 72px)', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <div style={{ width: '100%', maxWidth: '580px' }}>
        {/* Header Card */}
        <div className="auth-card">
          {/* Brand + Title */}
          <div className="auth-header">
            <div style={{
              width: '56px', height: '56px', borderRadius: '14px',
              background: 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem auto', boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
            }}>
              <Users size={28} color="white" />
            </div>
            <h2 style={{ fontSize: '1.75rem' }}>HR Portal Registration</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Create your HR account to manage shortlisted candidates and schedule interviews.
            </p>
          </div>

          {/* Step Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '1.75rem' }}>
            {['Account Setup', 'Professional Details'].map((label, idx) => {
              const stepNum = idx + 1;
              const isActive = step === stepNum;
              const isDone = step > stepNum;
              return (
                <React.Fragment key={stepNum}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: isDone ? '#10b981' : isActive ? '#4f46e5' : '#e2e8f0',
                      color: isDone || isActive ? 'white' : '#94a3b8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.875rem',
                      transition: 'all 0.25s ease'
                    }}>
                      {isDone ? '✓' : stepNum}
                    </div>
                    <span style={{ fontSize: '0.75rem', marginTop: '0.35rem', color: isActive ? '#4f46e5' : '#94a3b8', fontWeight: isActive ? 700 : 400 }}>
                      {label}
                    </span>
                  </div>
                  {idx === 0 && (
                    <div style={{ flex: '0 0 40px', height: '2px', background: step > 1 ? '#10b981' : '#e2e8f0', marginBottom: '20px', transition: 'background 0.25s' }} />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Demo Login Shortcut */}
          <div className="demo-account-box" style={{ marginBottom: '1.5rem' }}>
            <div className="demo-account-title">
              <Sparkles size={13} style={{ display: 'inline', marginRight: '4px' }} />
              Quick Demo Access
            </div>
            <p style={{ fontSize: '0.8rem', color: '#4f46e5', marginBottom: '0.5rem' }}>
              Login instantly with the pre-seeded HR demo account (Sarah Jenkins)
            </p>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleDemoLogin}>
              <Users size={14} /> Login as Demo HR
            </button>
          </div>

          {/* Step 1: Account Setup */}
          {step === 1 && (
            <form onSubmit={handleNext}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <div className="input-with-icon">
                  <User className="input-icon" size={18} />
                  <input type="text" className="form-input" placeholder="e.g. Sarah Jenkins" value={formData.name} onChange={e => update('name', e.target.value)} />
                </div>
                {errors.name && <div className="form-error-msg">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Work Email Address *</label>
                <div className="input-with-icon">
                  <Mail className="input-icon" size={18} />
                  <input type="email" className="form-input" placeholder="hr@yourcompany.com" value={formData.email} onChange={e => update('email', e.target.value)} />
                </div>
                {errors.email && <div className="form-error-msg">{errors.email}</div>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <div className="input-with-icon">
                    <Lock className="input-icon" size={18} />
                    <input type={showPassword ? 'text' : 'password'} className="form-input" placeholder="Create password" value={formData.password} onChange={e => update('password', e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {formData.password && (
                    <div style={{ marginTop: '4px' }}>
                      <div className="password-meter">
                        <div className="password-meter-fill" style={{ width: `${strength.score}%`, background: strength.color }} />
                      </div>
                      <span style={{ fontSize: '0.7rem', color: strength.color, fontWeight: 600 }}>{strength.text}</span>
                    </div>
                  )}
                  {errors.password && <div className="form-error-msg">{errors.password}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <div className="input-with-icon">
                    <Lock className="input-icon" size={18} />
                    <input type={showPassword ? 'text' : 'password'} className="form-input" placeholder="Repeat password" value={formData.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
                  </div>
                  {errors.confirmPassword && <div className="form-error-msg">{errors.confirmPassword}</div>}
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" style={{ width: '100%', marginTop: '0.5rem' }} icon={ChevronRight} iconPosition="right">
                Continue to Professional Details
              </Button>

              <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '1.25rem' }}>
                Already have an HR account?{' '}
                <Link to="/hr/login" style={{ color: '#4f46e5', fontWeight: 700 }}>Sign In</Link>
              </p>
            </form>
          )}

          {/* Step 2: Professional Info */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Company / Organization *</label>
                  <div className="input-with-icon">
                    <Building2 className="input-icon" size={18} />
                    <input type="text" className="form-input" placeholder="e.g. TechCorp Global" value={formData.company} onChange={e => update('company', e.target.value)} />
                  </div>
                  {errors.company && <div className="form-error-msg">{errors.company}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Designation / Title *</label>
                  <div className="input-with-icon">
                    <Award className="input-icon" size={18} />
                    <input type="text" className="form-input" placeholder="e.g. HR Manager" value={formData.designation} onChange={e => update('designation', e.target.value)} />
                  </div>
                  {errors.designation && <div className="form-error-msg">{errors.designation}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <div className="input-with-icon">
                    <Briefcase className="input-icon" size={18} />
                    <select className="form-select" value={formData.department} onChange={e => update('department', e.target.value)}>
                      <option>Human Resources</option>
                      <option>Talent Acquisition</option>
                      <option>People Operations</option>
                      <option>Recruitment</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="input-with-icon">
                    <Phone className="input-icon" size={18} />
                    <input type="text" className="form-input" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => update('phone', e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">HR Experience</label>
                  <select className="form-select" value={formData.experience} onChange={e => update('experience', e.target.value)}>
                    <option>0-1 years</option>
                    <option>2-5 years</option>
                    <option>5-10 years</option>
                    <option>10+ years</option>
                  </select>
                </div>

                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Specialization / Domain</label>
                  <input type="text" className="form-input" placeholder="e.g. Technical Hiring, Campus Recruitment, Executive Search" value={formData.specialization} onChange={e => update('specialization', e.target.value)} />
                </div>

                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Location</label>
                  <div className="input-with-icon">
                    <MapPin className="input-icon" size={18} />
                    <input type="text" className="form-input" placeholder="City, Country" value={formData.location} onChange={e => update('location', e.target.value)} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button type="button" variant="secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button type="submit" variant="primary" style={{ flex: 2 }} icon={Users}>
                  Create HR Account
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRRegisterPage;
