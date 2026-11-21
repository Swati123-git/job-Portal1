import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Bookmark,
  CheckCircle2,
  Clock,
  Calendar,
  AlertCircle,
  FileText,
  Building,
  MapPin,
  DollarSign,
  ArrowRight,
  Sparkles,
  Eye,
  Trash2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/jobs/JobCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';

const DashboardPage = () => {
  const { user, completeness } = useAuth();
  const { applications, savedJobs, jobs, withdrawApplication } = useJobs();

  const [activeTab, setActiveTab] = useState('applied'); // 'applied' | 'saved' | 'recommended'
  const [selectedAppForTimeline, setSelectedAppForTimeline] = useState(null);

  // Derive counts
  const totalApplied = applications.length;
  const underReviewCount = applications.filter((a) => a.status === 'Under Review').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview Scheduled').length;
  const totalSaved = savedJobs.length;

  // Recommended jobs based on candidate skills
  const userSkills = user?.skills || ['React', 'JavaScript'];
  const recommendedJobs = jobs
    .filter((j) => !applications.some((app) => app.jobId === j.id))
    .filter((j) => (j.skills || []).some((s) => userSkills.some((us) => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase()))))
    .slice(0, 4);

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'Offer Received':
        return 'success';
      case 'Interview Scheduled':
        return 'primary';
      case 'Under Review':
        return 'warning';
      case 'Applied':
      default:
        return 'info';
    }
  };

  const getStageStep = (status) => {
    switch (status) {
      case 'Applied': return 1;
      case 'Under Review': return 2;
      case 'Interview Scheduled': return 3;
      case 'Offer Received': return 4;
      default: return 1;
    }
  };

  return (
    <div className="section-padding" style={{ paddingTop: '2.5rem' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.35rem' }}>
              Welcome back, <span className="gradient-text">{user ? user.name.split(' ')[0] : 'Candidate'}</span>! 👋
            </h1>
            <p style={{ color: '#64748b' }}>
              Track your active job applications, interviews, and personalized role recommendations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/profile">
              <Button variant="secondary">
                View & Edit Profile
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="primary" icon={Briefcase}>
                Explore Jobs
              </Button>
            </Link>
          </div>
        </div>

        {/* Metric Cards Row */}
        <div className="dashboard-grid">
          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#eef2ff', color: '#4f46e5' }}>
              <Briefcase size={24} />
            </div>
            <div>
              <div className="metric-number">{totalApplied}</div>
              <div className="metric-label">Applications Sent</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <Clock size={24} />
            </div>
            <div>
              <div className="metric-number">{underReviewCount}</div>
              <div className="metric-label">Under Review</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <Calendar size={24} />
            </div>
            <div>
              <div className="metric-number">{interviewCount}</div>
              <div className="metric-label">Interviews Scheduled</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon-box" style={{ background: '#fce7f3', color: '#ec4899' }}>
              <Bookmark size={24} />
            </div>
            <div>
              <div className="metric-number">{totalSaved}</div>
              <div className="metric-label">Bookmarked Jobs</div>
            </div>
          </div>
        </div>

        {/* Profile Strength Widget */}
        {completeness < 100 && (
          <div className="completeness-meter-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Profile Completeness</span>
                <span style={{ fontWeight: 800, color: '#4f46e5' }}>{completeness}%</span>
              </div>
              <div className="meter-progress-track">
                <div className="meter-progress-bar" style={{ width: `${completeness}%` }} />
              </div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                💡 Complete your education, work history, and resume to get 3x more interview requests.
              </p>
            </div>
            <Link to="/profile">
              <Button variant="outline" size="sm">
                Complete Profile &rarr;
              </Button>
            </Link>
          </div>
        )}

        {/* Dashboard Tabs */}
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'applied' ? 'active' : ''}`}
            onClick={() => setActiveTab('applied')}
          >
            <span>Applied Jobs</span>
            <span className="tab-count">{totalApplied}</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <span>Saved Bookmarks</span>
            <span className="tab-count">{totalSaved}</span>
          </button>

          <button
            className={`tab-btn ${activeTab === 'recommended' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommended')}
          >
            <Sparkles size={16} color="#8b5cf6" />
            <span>Recommended For You</span>
            <span className="tab-count">{recommendedJobs.length}</span>
          </button>
        </div>

        {/* Tab 1: Applied Jobs */}
        {activeTab === 'applied' && (
          <div>
            {applications.length === 0 ? (
              <div className="empty-state">
                <Briefcase size={36} color="#4f46e5" style={{ marginBottom: '1rem' }} />
                <h3>No job applications yet</h3>
                <p>Start searching and applying for verified positions across tech, design, and management.</p>
                <Link to="/jobs">
                  <Button variant="primary">Search Available Jobs</Button>
                </Link>
              </div>
            ) : (
              <div>
                {applications.map((app) => {
                  const step = getStageStep(app.status);

                  return (
                    <div key={app.id} className="application-card">
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div
                            className="company-avatar-box"
                            style={{ background: app.companyLogoBg || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
                          >
                            {app.companyInitials || 'TC'}
                          </div>
                          <div>
                            <Link
                              to={`/jobs/${app.jobId}`}
                              style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', display: 'block' }}
                            >
                              {app.jobTitle}
                            </Link>
                            <div style={{ fontSize: '0.875rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '3px' }}>
                              <span>{app.company}</span> &bull; <span>{app.location}</span> &bull; <span>{app.salary}</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <Badge variant={getStatusBadgeVariant(app.status)}>
                            {app.status}
                          </Badge>
                          <button
                            onClick={() => setSelectedAppForTimeline(app)}
                            className="btn btn-secondary btn-sm"
                            title="View Timeline"
                          >
                            <Eye size={14} /> Tracking Details
                          </button>
                        </div>
                      </div>

                      {/* Interactive Visual Progress Bar */}
                      <div className="pipeline-steps">
                        <div className="pipeline-progress-line">
                          <div
                            className="pipeline-progress-fill"
                            style={{ width: step === 1 ? '15%' : step === 2 ? '50%' : step === 3 ? '80%' : '100%' }}
                          />
                        </div>

                        <div className="pipeline-step-node">
                          <div className={`step-circle ${step >= 1 ? 'completed' : ''}`}>1</div>
                          <span className="step-label">Applied</span>
                        </div>

                        <div className="pipeline-step-node">
                          <div className={`step-circle ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}>2</div>
                          <span className="step-label">Under Review</span>
                        </div>

                        <div className="pipeline-step-node">
                          <div className={`step-circle ${step >= 3 ? (step > 3 ? 'completed' : 'active') : ''}`}>3</div>
                          <span className="step-label">Interview</span>
                        </div>

                        <div className="pipeline-step-node">
                          <div className={`step-circle ${step >= 4 ? 'completed' : ''}`}>4</div>
                          <span className="step-label">Decision</span>
                        </div>
                      </div>

                      {/* Footer info & withdraw */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.85rem', color: '#64748b' }}>
                        <div>
                          <strong>Applied on:</strong> {app.appliedDate} &bull; <strong>Resume:</strong> {app.resumeUsed}
                        </div>
                        <button
                          onClick={() => withdrawApplication(app.id)}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                          title="Withdraw application"
                        >
                          <Trash2 size={13} /> Withdraw
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Bookmarks */}
        {activeTab === 'saved' && (
          <div>
            {savedJobs.length === 0 ? (
              <div className="empty-state">
                <Bookmark size={36} color="#ec4899" style={{ marginBottom: '1rem' }} />
                <h3>No saved jobs found</h3>
                <p>Click the bookmark icon on any job card to save it for quick access later.</p>
                <Link to="/jobs">
                  <Button variant="primary">Browse Jobs</Button>
                </Link>
              </div>
            ) : (
              <div className="jobs-layout-grid">
                {savedJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Recommended Jobs */}
        {activeTab === 'recommended' && (
          <div>
            <div style={{ marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem 1.25rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontWeight: 600, color: '#334155' }}>
                Matched based on your profile skills:
              </span>{' '}
              {userSkills.slice(0, 5).map((s, idx) => (
                <span key={idx} className="skill-tag" style={{ marginLeft: '6px' }}>{s}</span>
              ))}
            </div>

            <div className="jobs-layout-grid">
              {recommendedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Application Timeline Details Modal */}
      {selectedAppForTimeline && (
        <Modal
          isOpen={Boolean(selectedAppForTimeline)}
          onClose={() => setSelectedAppForTimeline(null)}
          title={`Application Details - ${selectedAppForTimeline.jobTitle}`}
          maxWidth="580px"
        >
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>
              {selectedAppForTimeline.company}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Applied on {selectedAppForTimeline.appliedDate} &bull; {selectedAppForTimeline.location}
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>Current Status:</div>
            <Badge variant={getStatusBadgeVariant(selectedAppForTimeline.status)}>
              {selectedAppForTimeline.status}
            </Badge>
            {selectedAppForTimeline.notes && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#475569' }}>
                <strong>Recruiter Note:</strong> {selectedAppForTimeline.notes}
              </p>
            )}
          </div>

          <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Application History Timeline</h4>
          <div>
            {(selectedAppForTimeline.timeline || []).map((entry, idx) => (
              <div key={idx} className="timeline-entry">
                <div className="timeline-node" />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                  <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{entry.status}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{entry.date}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>{entry.note}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
            <Button variant="secondary" onClick={() => setSelectedAppForTimeline(null)}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DashboardPage;
