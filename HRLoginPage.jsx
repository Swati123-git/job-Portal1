import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Users, LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import { useHR } from '../../context/HRContext';
import Button from '../../components/common/Button';

const HRLoginPage = () => {
  const { loginHR, loginHRDemo } = useHR();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!email.trim() || !email.includes('@')) errs.email = 'Please enter a valid email';
    if (!password || password.length < 4) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      const success = loginHR(email, password);
      setIsLoading(false);
      if (success) navigate('/hr/dashboard');
    }, 400);
  };

  const handleDemo = () => {
    loginHRDemo();
    navigate('/hr/dashboard');
  };

  return (
    <div className="auth-page-container" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="auth-card" style={{ maxWidth: '460px' }}>
        {/* Icon & Title */}
        <div className="auth-header">
          <div style={{
            width: '56px', height: '56px', borderRadius: '14px',
            background: 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem auto', boxShadow: '0 4px 14px rgba(16,185,129,0.3)'
          }}>
            <Users size={28} color="white" />
          </div>
          <h2 style={{ fontSize: '1.75rem' }}>HR Portal Sign In</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Access your HR dashboard to manage candidates and schedule interviews.
          </p>
        </div>

        {/* Demo Quick Login */}
        <div className="demo-account-box">
          <div className="demo-account-title">
            <Sparkles size={13} style={{ display: 'inline', marginRight: '4px' }} />
            Quick Demo Access
          </div>
          <div style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '0.6rem' }}>
            Pre-seeded account: <strong>sarah.jenkins@techcorp.example.com</strong> / <strong>demo1234</strong>
          </div>
          <button type="button" className="btn btn-primary btn-sm" onClick={handleDemo}>
            <ShieldCheck size={14} /> Login as Demo HR (Sarah Jenkins)
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">HR Email Address</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} />
              <input
                type="email"
                className="form-input"
                placeholder="hr@yourcompany.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <div className="form-error-msg">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Your HR account password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <div className="form-error-msg">{errors.password}</div>}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            style={{ width: '100%', marginBottom: '1.25rem', background: 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)', border: 'none' }}
            loading={isLoading}
            icon={LogIn}
          >
            Sign In to HR Portal
          </Button>
        </form>

        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', color: '#64748b' }}>
            New HR? {' '}
            <Link to="/hr/register" style={{ color: '#10b981', fontWeight: 700 }}>Create HR Account</Link>
          </span>
          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Not an HR?{' '}
            <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700 }}>Go to Candidate Login</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default HRLoginPage;
