import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Calendar, CheckCircle2, Clock, Star,
  Briefcase, TrendingUp, LayoutDashboard, LogOut,
  Plus, ArrowRight, Bell, Building2, Filter,
  Search, ChevronRight
} from 'lucide-react';
import { useHR } from '../../context/HRContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const HRDashboard = () => {
  const { currentHR, shortlistedCandidates, interviews, logoutHR, getMyInterviews } = useHR();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (!currentHR) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: '420px', margin: '0 auto' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: '#ecfdf5', color: '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.5rem auto'
          }}>
            <Users size={36} />
          </div>
          <h2>HR Portal Access Required</h2>
          <p style={{ color: '#64748b', margin: '1rem 0 2rem' }}>
            Please sign in to your HR account to access the dashboard.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/hr/login"><Button variant="primary">Sign In to HR Portal</Button></Link>
            <Link to="/hr/register"><Button variant="secondary">Create HR Account</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  const myInterviews = getMyInterviews();
  const pendingCandidates = shortlistedCandidates.filter(c => c.interviewStatus === 'Pending').length;
  const scheduledInterviews = myInterviews.filter(i => i.status === 'Upcoming').length;
  const completedInterviews = myInterviews.filter(i => i.status === 'Completed').length;
  const shortlistedCount = shortlistedCandidates.length;

  const handleLogout = () => {
    logoutHR();
    navigate('/hr/login');
  };

  const getInterviewStatusBadge = (status) => {
    if (status === 'Upcoming') return 'primary';
    if (status === 'Completed') return 'success';
    if (status === 'Cancelled') return 'danger';
    return 'neutral';
  };

  const getCandidateStatusBadge = (status) => {
    if (status === 'Scheduled') return 'primary';
    if (status === 'Completed') return 'success';
    return 'warning';
  };

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* HR Dashboard Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={currentHR.avatar}
              alt={currentHR.name}
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #10b981' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.15rem' }}>
                <h1 style={{ fontSize: '1.75rem' }}>
                  Welcome, <span style={{ color: '#10b981' }}>{currentHR.name.split(' ')[0]}</span>! 👋
                </h1>
                <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>HR</span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                {currentHR.designation} · {currentHR.company}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/hr/candidates">
              <Button variant="primary" icon={Users} style={{ background: 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)', border: 'none' }}>
                View Candidates
              </Button>
            </Link>
            <Link to="/hr/schedule">
              <Button variant="secondary" icon={Calendar}>Schedule Interview</Button>
            </Link>
            <Button variant="ghost" icon={LogOut} onClick={handleLogout}>Logout</Button>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <Users size={24} />
            </div>
            <div>
              <div className="metric-number">{shortlistedCount}</div>
              <div className="metric-label">Total Shortlisted</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="metric-number">{pendingCandidates}</div>
              <div className="metric-label">Pending Interviews</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#eef2ff', color: '#4f46e5' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div className="metric-number">{scheduledInterviews}</div>
              <div className="metric-label">Upcoming Interviews</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="metric-number">{completedInterviews}</div>
              <div className="metric-label">Completed</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs-header">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={16} /> Overview
          </button>
          <button className={`tab-btn ${activeTab === 'interviews' ? 'active' : ''}`} onClick={() => setActiveTab('interviews')}>
            Calendar
            <span className="tab-count">{myInterviews.length}</span>
          </button>
          <button className={`tab-btn ${activeTab === 'candidates' ? 'active' : ''}`} onClick={() => setActiveTab('candidates')}>
            Shortlisted
            <span className="tab-count">{shortlistedCount}</span>
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
            {/* Upcoming Interviews */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Upcoming Interviews</h3>
                <Link to="/hr/schedule" style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: 600 }}>View All →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myInterviews.filter(i => i.status === 'Upcoming').slice(0, 3).length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem' }}>
                    <Calendar size={28} color="#10b981" style={{ marginBottom: '0.75rem' }} />
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>No upcoming interviews scheduled</p>
                    <Link to="/hr/schedule" style={{ display: 'inline-block', marginTop: '0.75rem' }}>
                      <Button variant="primary" size="sm" icon={Plus} style={{ background: 'linear-gradient(135deg, #10b981, #0284c7)', border: 'none' }}>Schedule Now</Button>
                    </Link>
                  </div>
                ) : (
                  myInterviews.filter(i => i.status === 'Upcoming').slice(0, 3).map(interview => (
                    <div key={interview.id} className="card" style={{ padding: '1.15rem', borderLeft: '3px solid #4f46e5' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div>
                          <h4 style={{ fontSize: '1rem', marginBottom: '0.15rem' }}>{interview.candidateName}</h4>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>{interview.jobTitle}</p>
                        </div>
                        <Badge variant="primary">{interview.round}</Badge>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748b' }}>
                        <span>📅 {interview.date}</span>
                        <span>⏰ {interview.time}</span>
                        <span>📞 {interview.type}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pending Shortlisted */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Awaiting Interview</h3>
                <Link to="/hr/candidates" style={{ fontSize: '0.85rem', color: '#4f46e5', fontWeight: 600 }}>View All →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {shortlistedCandidates.filter(c => c.interviewStatus === 'Pending').slice(0, 4).map(candidate => (
                  <div key={candidate.id} className="card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img src={candidate.avatar} alt={candidate.name} style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{candidate.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{candidate.jobTitle.slice(0, 30)}{candidate.jobTitle.length > 30 ? '...' : ''}</div>
                      </div>
                    </div>
                    <Link to="/hr/schedule">
                      <Button variant="outline" size="sm" style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderColor: '#10b981', color: '#10b981' }}>
                        Schedule
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Interviews Tab */}
        {activeTab === 'interviews' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
              <Link to="/hr/schedule">
                <Button variant="primary" icon={Plus} style={{ background: 'linear-gradient(135deg, #10b981, #0284c7)', border: 'none' }}>
                  Schedule New Interview
                </Button>
              </Link>
            </div>

            {myInterviews.length === 0 ? (
              <div className="empty-state">
                <Calendar size={36} color="#10b981" style={{ marginBottom: '1rem' }} />
                <h3>No interviews scheduled yet</h3>
                <p>Schedule interviews with shortlisted candidates to get started.</p>
                <Link to="/hr/schedule"><Button variant="primary" style={{ background: 'linear-gradient(135deg, #10b981, #0284c7)', border: 'none' }}>Schedule First Interview</Button></Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myInterviews.map(interview => (
                  <div key={interview.id} className="application-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                          <h4 style={{ fontSize: '1.1rem' }}>{interview.candidateName}</h4>
                          <Badge variant={getInterviewStatusBadge(interview.status)}>{interview.status}</Badge>
                          <Badge variant="neutral">{interview.round}</Badge>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                          {interview.jobTitle} · {interview.company}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>📅 {interview.date} at {interview.time}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{interview.type} · {interview.duration} min</div>
                      </div>
                    </div>

                    {interview.meetingLink && (
                      <div style={{ marginTop: '0.75rem', padding: '0.6rem 0.9rem', background: '#eef2ff', borderRadius: '8px', fontSize: '0.85rem' }}>
                        🔗 <a href={interview.meetingLink} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', fontWeight: 600 }}>{interview.meetingLink}</a>
                      </div>
                    )}

                    {interview.notes && (
                      <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.75rem', marginBottom: 0 }}>
                        📝 {interview.notes}
                      </p>
                    )}

                    {interview.feedback && (
                      <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#ecfdf5', borderRadius: '8px', fontSize: '0.875rem', color: '#065f46' }}>
                        ✅ <strong>Feedback:</strong> {interview.feedback}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
              <Link to="/hr/candidates">
                <Button variant="primary" style={{ background: 'linear-gradient(135deg, #10b981, #0284c7)', border: 'none' }}>
                  Manage All Candidates →
                </Button>
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {shortlistedCandidates.map(candidate => (
                <div key={candidate.id} className="card card-hover">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                    <img src={candidate.avatar} alt={candidate.name} style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{candidate.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{candidate.experience} exp.</div>
                    </div>
                    <Badge variant={getCandidateStatusBadge(candidate.interviewStatus)} style={{ marginLeft: 'auto' }}>
                      {candidate.interviewStatus}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem' }}>
                    {candidate.jobTitle}
                  </p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {candidate.skills.slice(0, 3).map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                  </div>
                  {candidate.rating && (
                    <div style={{ display: 'flex', gap: '2px', marginBottom: '0.5rem' }}>
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14} fill={s <= candidate.rating ? '#f59e0b' : 'none'} color={s <= candidate.rating ? '#f59e0b' : '#d1d5db'} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRDashboard;
