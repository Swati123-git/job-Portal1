import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle2, Building, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const RegisterPage = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('candidate'); // 'candidate' | 'employer'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [errors, setErrors] = useState({});

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: '', color: '#e2e8f0' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 9) score += 1;
    if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 25, text: 'Weak', color: '#ef4444' };
    if (score <= 2) return { score: 50, text: 'Fair', color: '#f59e0b' };
    if (score <= 3) return { score: 75, text: 'Good', color: '#0ea5e9' };
    return { score: 100, text: 'Strong', color: '#10b981' };
  };

  const strength = getPasswordStrength(password);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Please enter a valid email address';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!termsAccepted) errs.terms = 'Please accept terms and conditions';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await register({
      name,
      email,
      password,
      role
    });

    if (success) navigate('/dashboard');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="gradient-text">Create an Account</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Join thousands of professionals exploring top career opportunities.
          </p>
        </div>

        {/* User Type Switcher */}
        <div className="auth-role-switch">
          <button
            type="button"
            className={`role-btn ${role === 'candidate' ? 'active' : ''}`}
            onClick={() => setRole('candidate')}
          >
            <Briefcase size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Job Seeker
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'employer' ? 'active' : ''}`}
            onClick={() => setRole('employer')}
          >
            <Building size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            Employer / Recruiter
          </button>
        </div>

        <form onSubmit={handleRegister}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">{role === 'employer' ? 'Full Name & Company' : 'Full Name'}</label>
            <div className="input-with-icon">
              <User className="input-icon" size={18} />
              <input
                type="text"
                className="form-input"
                placeholder={role === 'employer' ? 'Sarah Jenkins (TechCorp)' : 'Alex Morgan'}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            {errors.name && <div className="form-error-msg">{errors.name}</div>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <div className="form-error-msg">{errors.email}</div>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password && (
              <div style={{ marginTop: '0.4rem' }}>
                <div className="password-meter">
                  <div
                    className="password-meter-fill"
                    style={{ width: `${strength.score}%`, background: strength.color }}
                  />
                </div>
                <div style={{ fontSize: '0.75rem', color: strength.color, marginTop: '2px', fontWeight: 600 }}>
                  Password Strength: {strength.text}
                </div>
              </div>
            )}
            {errors.password && <div className="form-error-msg">{errors.password}</div>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {errors.confirmPassword && <div className="form-error-msg">{errors.confirmPassword}</div>}
          </div>

          {/* Terms Checkbox */}
          <div className="form-group">
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
              />
              <span style={{ fontSize: '0.85rem' }}>
                I agree to the <Link to="/about" style={{ color: '#4f46e5' }}>Terms of Service</Link> and <Link to="/about" style={{ color: '#4f46e5' }}>Privacy Policy</Link>
              </span>
            </label>
            {errors.terms && <div className="form-error-msg">{errors.terms}</div>}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            style={{ width: '100%', marginBottom: '1.5rem' }}
            icon={UserPlus}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : `Create ${role === 'employer' ? 'Employer' : 'Candidate'} Account`}
          </Button>

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
