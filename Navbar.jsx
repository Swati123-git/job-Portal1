import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Briefcase, Menu, X, User, LogOut, LayoutDashboard, Bookmark, Sparkles, Building2, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHR } from '../../context/HRContext';
import Button from '../common/Button';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { currentHR, logoutHR } = useHR();
  const navigate = useNavigate();

  const handleLogoutCandidate = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleLogoutHR = () => {
    logoutHR();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand" onClick={closeMobileMenu}>
          <div className="nav-logo-icon">
            <Briefcase size={22} />
          </div>
          <span>Job<span className="gradient-text">Sphere</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Jobs
              </NavLink>
            </li>
            <li>
              <NavLink to="/companies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Companies
              </NavLink>
            </li>
            <li>
              <NavLink to="/employee" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: '#6366f1', fontWeight: 600 }}>
                Employee Portal
              </NavLink>
            </li>
            <li>
              <NavLink to="/resume-analyzer" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: '#7c3aed', fontWeight: 600 }}>
                🧠 AI Resume
              </NavLink>
            </li>
            <li>
              <NavLink to="/job-recommendations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: '#4f46e5', fontWeight: 600 }}>
                ✨ Recommended Jobs
              </NavLink>
            </li>
            <li>
              <NavLink to="/hr/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} style={{ color: '#10b981', fontWeight: 600 }}>
                HR Portal
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                About
              </NavLink>
            </li>
            <li>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Auth / Action Buttons */}
        <div className="nav-actions">
          {currentHR ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/hr/dashboard" className="btn btn-secondary btn-sm" style={{ borderColor: '#10b981', color: '#059669', background: '#ecfdf5' }}>
                <Users size={16} />
                <span>HR Dashboard</span>
              </Link>
              <div className="nav-user-profile" style={{ cursor: 'default' }}>
                <img
                  src={currentHR.avatar}
                  alt={currentHR.name}
                  className="nav-avatar"
                  style={{ border: '2px solid #10b981' }}
                />
                <span className="nav-user-name">{currentHR.name.split(' ')[0]} (HR)</span>
              </div>
              <button
                onClick={handleLogoutHR}
                className="btn btn-ghost btn-icon-only"
                title="Log Out HR"
                aria-label="Log Out HR"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/dashboard" className="btn btn-secondary btn-sm" title="Applicant Dashboard">
                <LayoutDashboard size={16} />
                <span>Dashboard</span>
              </Link>
              <Link to="/profile" className="nav-user-profile" title="View Profile">
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                  alt={user.name}
                  className="nav-avatar"
                />
                <span className="nav-user-name">{user.name.split(' ')[0]}</span>
              </Link>
              <button
                onClick={handleLogoutCandidate}
                className="btn btn-ghost btn-icon-only"
                title="Log Out"
                aria-label="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-ghost">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
              <Link to="/hr/login" className="btn btn-outline btn-sm" style={{ borderColor: '#10b981', color: '#059669', fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}>
                HR Login
              </Link>
            </div>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-links">
          <li>
            <NavLink to="/" className="mobile-nav-link" onClick={closeMobileMenu}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/jobs" className="mobile-nav-link" onClick={closeMobileMenu}>
              Browse Jobs
            </NavLink>
          </li>
          <li>
            <NavLink to="/companies" className="mobile-nav-link" onClick={closeMobileMenu}>
              Top Companies
            </NavLink>
          </li>
          <li>
            <NavLink to="/resume-analyzer" className="mobile-nav-link" style={{ color: '#7c3aed', fontWeight: 700 }} onClick={closeMobileMenu}>
              🧠 AI Resume Analyzer
            </NavLink>
          </li>
          <li>
            <NavLink to="/hr/dashboard" className="mobile-nav-link" style={{ color: '#10b981', fontWeight: 700 }} onClick={closeMobileMenu}>
              HR Portal
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="mobile-nav-link" onClick={closeMobileMenu}>
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="mobile-nav-link" onClick={closeMobileMenu}>
              Contact Us
            </NavLink>
          </li>
          {currentHR && (
            <>
              <li>
                <NavLink to="/hr/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>
                  HR Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/hr/candidates" className="mobile-nav-link" onClick={closeMobileMenu}>
                  Shortlisted Candidates
                </NavLink>
              </li>
              <li>
                <NavLink to="/hr/schedule" className="mobile-nav-link" onClick={closeMobileMenu}>
                  Schedule Interview
                </NavLink>
              </li>
            </>
          )}
          {user && !currentHR && (
            <>
              <li>
                <NavLink to="/dashboard" className="mobile-nav-link" onClick={closeMobileMenu}>
                  My Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile" className="mobile-nav-link" onClick={closeMobileMenu}>
                  Candidate Profile
                </NavLink>
              </li>
            </>
          )}
        </ul>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {currentHR ? (
            <Button variant="danger" onClick={handleLogoutHR} icon={LogOut}>
              Log Out HR ({currentHR.name})
            </Button>
          ) : user ? (
            <Button variant="danger" onClick={handleLogoutCandidate} icon={LogOut}>
              Log Out ({user.name})
            </Button>
          ) : (
            <>
              <Link to="/login" onClick={closeMobileMenu} style={{ width: '100%' }}>
                <Button variant="outline" style={{ width: '100%' }}>
                  Candidate Log In
                </Button>
              </Link>
              <Link to="/hr/login" onClick={closeMobileMenu} style={{ width: '100%' }}>
                <Button variant="secondary" style={{ width: '100%', borderColor: '#10b981', color: '#059669' }}>
                  HR Portal Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
