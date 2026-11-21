import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

const LoginPage = () => {
  const { login, loginWithDemo, isLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const validate = () => {
    const errs = {};
    if (!email.trim() || !email.includes('@')) errs.email = 'Please enter a valid email address';
    if (!password || password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await login(email, password, 'candidate');
    if (success) navigate('/dashboard');
  };

  const handleDemoCandidate = () => {
    loginWithDemo('candidate');
    navigate('/dashboard');
  };

  const handleDemoEmployer = () => {
    loginWithDemo('employer');
    navigate('/jobs');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }
    showToast(`Password reset link sent to ${forgotEmail}`, 'success', 'Check Your Inbox');
    setIsForgotModalOpen(false);
    setForgotEmail('');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="gradient-text">Welcome Back</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Log in to manage your applications and discover new roles.
          </p>
        </div>

        {/* 1-Click Demo Login Box */}
        <div className="demo-account-box">
          <div className="demo-account-title">
            <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Instant 1-Click Demo Access
          </div>
          <div className="demo-btn-group">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleDemoCandidate}
              title="Log in as demo Job Seeker"
            >
              <UserCheck size={14} /> Candidate Demo
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleDemoEmployer}
              title="Log in as demo Employer"
            >
              <ShieldCheck size={14} /> Recruiter Demo
            </button>
          </div>
        </div>

        <form onSubmit={handleLogin}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label">Password</label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                style={{ background: 'none', border: 'none', color: '#4f46e5', fontSize: '0.825rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Forgot Password?
              </button>
            </div>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
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
            {errors.password && <div className="form-error-msg">{errors.password}</div>}
          </div>

          {/* Remember me */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me on this device</span>
            </label>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            style={{ width: '100%', marginBottom: '1.5rem' }}
            icon={LogIn}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In to JobSphere'}
          </Button>

          <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
            Don't have an account yet?{' '}
            <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700 }}>
              Create Account
            </Link>
          </div>
        </form>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title="Reset Your Password"
        maxWidth="460px"
      >
        <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          Enter your registered email address and we'll send you instructions to reset your password.
        </p>
        <form onSubmit={handleForgotSubmit}>
          <div className="form-group">
            <label className="form-label">Account Email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="form-input"
                placeholder="name@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="secondary" onClick={() => setIsForgotModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Reset Link
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LoginPage;
