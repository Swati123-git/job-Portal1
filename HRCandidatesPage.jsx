import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users, Search, Filter, Star, MapPin, Briefcase,
  Phone, Mail, Calendar, ChevronDown, X, Eye, Award,
  Clock, CheckCircle2, AlertCircle, MessageSquare
} from 'lucide-react';
import { useHR } from '../../context/HRContext';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

const RATING_MAP = { 0: 'No Rating', 1: '⭐ 1', 2: '⭐⭐ 2', 3: '⭐⭐⭐ 3', 4: '⭐⭐⭐⭐ 4', 5: '⭐⭐⭐⭐⭐ 5' };

const HRCandidatesPage = () => {
  const { currentHR, shortlistedCandidates, updateCandidateStatus, rateCandidateInterview } = useHR();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 0, notes: '' });
  const [showFeedback, setShowFeedback] = useState(false);

  if (!currentHR) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h3>Access Restricted</h3>
        <p style={{ color: '#64748b' }}>Please log in to your HR account.</p>
        <Link to="/hr/login"><Button variant="primary">Sign In</Button></Link>
      </div>
    );
  }

  const filtered = shortlistedCandidates.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.interviewStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const openFeedback = (candidate) => {
    setSelectedCandidate(candidate);
    setFeedbackForm({ rating: candidate.rating || 0, notes: candidate.notes || '' });
    setShowFeedback(true);
  };

  const saveFeedback = () => {
    if (!selectedCandidate) return;
    rateCandidateInterview(selectedCandidate.id, feedbackForm.rating, feedbackForm.notes);
    setShowFeedback(false);
    setSelectedCandidate(null);
  };

  const updateStatus = (candidateId, status) => {
    updateCandidateStatus(candidateId, { interviewStatus: status });
  };

  const statusOptions = ['All', 'Pending', 'Scheduled', 'Completed'];

  const statusColorMap = {
    'Pending': { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
    'Scheduled': { bg: '#eef2ff', color: '#4f46e5', border: '#c7d2fe' },
    'Completed': { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' }
  };

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Users color="#10b981" size={30} /> Shortlisted Candidates
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              {filtered.length} candidate{filtered.length !== 1 ? 's' : ''} available for interview.
            </p>
          </div>
          <Link to="/hr/schedule">
            <Button variant="primary" icon={Calendar} style={{ background: 'linear-gradient(135deg, #10b981, #0284c7)', border: 'none' }}>
              Schedule Interview
            </Button>
          </Link>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search by name or job title..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {statusOptions.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: statusFilter === s ? '2px solid #10b981' : '2px solid #e2e8f0',
                  background: statusFilter === s ? '#ecfdf5' : 'white',
                  color: statusFilter === s ? '#059669' : '#64748b',
                  fontWeight: statusFilter === s ? 700 : 400,
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Candidate Cards Grid */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Users size={36} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h3>No candidates found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filtered.map(candidate => {
              const statusStyle = statusColorMap[candidate.interviewStatus] || statusColorMap['Pending'];
              return (
                <div
                  key={candidate.id}
                  className="card card-hover"
                  style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
                >
                  {/* Status tag */}
                  <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: statusStyle.bg, color: statusStyle.color,
                    border: `1.5px solid ${statusStyle.border}`,
                    borderRadius: '20px', padding: '0.25rem 0.75rem',
                    fontSize: '0.75rem', fontWeight: 700
                  }}>
                    {candidate.interviewStatus === 'Pending' && '⏳ '}
                    {candidate.interviewStatus === 'Scheduled' && '📅 '}
                    {candidate.interviewStatus === 'Completed' && '✅ '}
                    {candidate.interviewStatus}
                  </div>

                  {/* Avatar + Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', paddingRight: '90px' }}>
                    <img
                      src={candidate.avatar}
                      alt={candidate.name}
                      style={{ width: '54px', height: '54px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '1.05rem', margin: 0, marginBottom: '0.15rem' }}>{candidate.name}</h4>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
                        {candidate.rating ? [1,2,3,4,5].map(s => (
                          <Star key={s} size={13} fill={s <= candidate.rating ? '#f59e0b' : 'none'} color={s <= candidate.rating ? '#f59e0b' : '#d1d5db'} />
                        )) : <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No rating yet</span>}
                      </div>
                    </div>
                  </div>

                  {/* Info List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <Briefcase size={14} style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{candidate.jobTitle}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={14} />
                      <span>{candidate.experience} experience</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <MapPin size={14} />
                      <span>{candidate.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Mail size={14} />
                      <a href={`mailto:${candidate.email}`} style={{ color: '#4f46e5' }}>{candidate.email}</a>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Phone size={14} />
                      <span>{candidate.phone}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    {candidate.skills.slice(0, 4).map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                    {candidate.skills.length > 4 && <span className="skill-tag">+{candidate.skills.length - 4}</span>}
                  </div>

                  {/* Notes preview */}
                  {candidate.notes && (
                    <div style={{ padding: '0.6rem 0.8rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', color: '#475569', marginBottom: '1rem' }}>
                      📝 {candidate.notes}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Calendar}
                      onClick={() => navigate('/hr/schedule', { state: { candidateId: candidate.id } })}
                      style={{ flex: 1, background: 'linear-gradient(135deg, #10b981, #0284c7)', border: 'none' }}
                    >
                      Schedule
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={MessageSquare}
                      onClick={() => openFeedback(candidate)}
                      style={{ flex: 1 }}
                    >
                      Feedback
                    </Button>
                  </div>

                  {/* Status Update Row */}
                  <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {['Pending', 'Scheduled', 'Completed'].map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(candidate.id, s)}
                        style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '20px',
                          border: `1px solid ${candidate.interviewStatus === s ? '#10b981' : '#e2e8f0'}`,
                          background: candidate.interviewStatus === s ? '#ecfdf5' : 'transparent',
                          color: candidate.interviewStatus === s ? '#059669' : '#94a3b8',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          fontWeight: candidate.interviewStatus === s ? 700 : 400
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedback && selectedCandidate && (
          <div className="modal-overlay" onClick={() => setShowFeedback(false)}>
            <div className="modal-container" onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <div className="modal-header">
                <h3 className="modal-title">Interview Feedback — {selectedCandidate.name}</h3>
                <button className="modal-close" onClick={() => setShowFeedback(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Overall Rating</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '0.5rem' }}>
                    {[1,2,3,4,5].map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFeedbackForm(f => ({ ...f, rating: s }))}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        <Star
                          size={28}
                          fill={s <= feedbackForm.rating ? '#f59e0b' : 'none'}
                          color={s <= feedbackForm.rating ? '#f59e0b' : '#d1d5db'}
                        />
                      </button>
                    ))}
                    <span style={{ alignSelf: 'center', fontSize: '0.875rem', color: '#64748b', marginLeft: '8px' }}>
                      {feedbackForm.rating > 0 ? RATING_MAP[feedbackForm.rating] : 'Click to rate'}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Interview Notes & Feedback</label>
                  <textarea
                    className="form-input form-textarea"
                    rows={4}
                    placeholder="Summarize the candidate's performance, communication, technical ability, and recommendation..."
                    value={feedbackForm.notes}
                    onChange={e => setFeedbackForm(f => ({ ...f, notes: e.target.value }))}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Button variant="secondary" onClick={() => setShowFeedback(false)} style={{ flex: 1 }}>Cancel</Button>
                  <Button variant="primary" onClick={saveFeedback} icon={CheckCircle2} style={{ flex: 2, background: 'linear-gradient(135deg, #10b981, #0284c7)', border: 'none' }}>
                    Save Feedback
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRCandidatesPage;
