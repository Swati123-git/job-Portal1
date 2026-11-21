import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Send, Heart, Globe, MessageCircle, Share2 } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please provide a valid email address.', 'warning', 'Invalid Email');
      return;
    }
    showToast(`Thank you for subscribing with ${email}!`, 'success', 'Subscribed to Job Alerts');
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Col */}
          <div className="footer-brand">
            <h3>
              <div className="nav-logo-icon" style={{ width: '32px', height: '32px' }}>
                <Briefcase size={18} />
              </div>
              <span>Job<span className="gradient-text">Sphere</span></span>
            </h3>
            <p className="footer-desc">
              The modern career launchpad connecting talented professionals with forward-thinking employers around the globe.
            </p>
            <div className="footer-social-links">
              {/* GitHub */}
              <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Job Seekers */}
          <div className="footer-col">
            <h4>For Candidates</h4>
            <ul className="footer-links-list">
              <li><Link to="/jobs">Explore All Jobs</Link></li>
              <li><Link to="/companies">Featured Companies</Link></li>
              <li><Link to="/dashboard">Application Tracker</Link></li>
              <li><Link to="/profile">Candidate Profile</Link></li>
              <li><Link to="/jobs?category=tech-dev">Tech & Engineering</Link></li>
              <li><Link to="/jobs?category=design-creative">Design & UX</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links-list">
              <li><Link to="/about">About JobSphere</Link></li>
              <li><Link to="/contact">Contact & Support</Link></li>
              <li><Link to="/about">Our Mission</Link></li>
              <li><Link to="/contact">FAQ</Link></li>
              <li><Link to="/login">Recruiter Portal</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-col">
            <h4>Job Alerts & Insights</h4>
            <p style={{ fontSize: '0.875rem', marginBottom: '1rem', color: '#94a3b8' }}>
              Subscribe to get notified about newly posted high-paying remote roles weekly.
            </p>
            <form onSubmit={handleSubscribe} className="footer-newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-icon-only" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} JobSphere Inc. All rights reserved. Built with React & Vite.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/about" style={{ color: '#94a3b8' }}>Privacy Policy</Link>
            <Link to="/about" style={{ color: '#94a3b8' }}>Terms of Service</Link>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#94a3b8' }}>
              Crafted with <Heart size={14} color="#ef4444" fill="#ef4444" /> for job seekers
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
