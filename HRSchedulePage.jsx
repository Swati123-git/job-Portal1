import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar, Users, Video, Phone, MapPin, Clock,
  Link2, FileText, ChevronDown, CheckCircle2, X, Star
} from 'lucide-react';
import { useHR } from '../../context/HRContext';
import Button from '../../components/common/Button';

const ROUND_OPTIONS = ['Technical Round 1', 'Technical Round 2', 'HR Round', 'Final Round', 'Cultural Fit', 'Managerial Round'];
const TYPE_OPTIONS = ['Video Call', 'In-Person', 'Phone Call', 'Panel Interview'];
const DURATION_OPTIONS = ['30', '45', '60', '90', '120'];

const HRSchedulePage = () => {
  const { currentHR, shortlistedCandidates, interviews, scheduleInterview, updateInterview, cancelInterview } = useHR();
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill candidateId if navigated from candidate card
  const preselectedId = location.state?.candidateId || '';

  const [activeTab, setActiveTab] = useState('schedule');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editFeedback, setEditFeedback] = useState('');

  const [form, setForm] = useState({
    candidateId: preselectedId,
    type: 'Video Call',
    date: '',
    time: '',
    duration: '60',
    round: 'Technical Round 1',
    meetingLink: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const validate = () => {
    const errs = {};
    if (!form.candidateId) errs.candidateId = 'Please select a candidate';
    if (!form.date) errs.date = 'Date is required';
    if (!form.time) errs.time = 'Time is required';
    if (form.type === 'Video Call' && !form.meetingLink) errs.meetingLink = 'Meeting link is required for video calls';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      scheduleInterview(form);
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ candidateId: '', type: 'Video Call', date: '', time: '', duration: '60', round: 'Technical Round 1', meetingLink: '', notes: '' });
        setActiveTab('list');
      }, 2000);
    }, 600);
  };

  const myInterviews = currentHR ? interviews.filter(i => i.hrId === currentHR.id) : interviews;

  const today = new Date().toISOString().split('T')[0];

  if (!currentHR) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h3>Access Restricted</h3>
        <p style={{ color: '#64748b' }}>Please log in to your HR account.</p>
        <Link to="/hr/login"><Button variant="primary">Sign In</Button></Link>
      </div>
    );
  }

  const selectedCandidate = shortlistedCandidates.find(c => c.id === form.candidateId);

  return (
    <div style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Calendar color="#10b981" size={30} /> Interview Scheduler
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Schedule, manage, and track interviews for shortlisted candidates.</p>
        </div>

        {/* Tabs */}
        <div className="tabs-header" style={{ marginBottom: '2rem' }}>
          <button className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
            <Calendar size={16} /> Schedule Interview
          </button>
          <button className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`} onClick={() => setActiveTab('list')}>
            My Interviews
            <span className="tab-count">{myInterviews.length}</span>
          </button>
        </div>

        {/* Schedule Form */}
        {activeTab === 'schedule' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
            {/* Form */}
            <div className="card" style={{ padding: '2rem' }}>
              {submitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: '#ecfdf5', color: '#10b981',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.25rem auto'
                  }}>
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ color: '#059669' }}>Interview Scheduled!</h3>
                  <p style={{ color: '#64748b' }}>Switching to your interview list...</p>
                </div>
              ) : (
                <form onSubmit={handleSchedule}>
                  <h3 style={{ marginBottom: '1.5rem' }}>New Interview</h3>

                  {/* Select Candidate */}
                  <div className="form-group">
                    <label className="form-label">Select Candidate *</label>
                    <select
                      className="form-select"
                      value={form.candidateId}
                      onChange={e => update('candidateId', e.target.value)}
                    >
                      <option value="">— Choose a shortlisted candidate —</option>
                      {shortlistedCandidates.map(c => (
                        <option key={c.id} value={c.id}>{c.name} — {c.jobTitle.slice(0, 35)}</option>
                      ))}
                    </select>
                    {errors.candidateId && <div className="form-error-msg">{errors.candidateId}</div>}
                  </div>

                  {/* Round + Type */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Interview Round *</label>
                      <select className="form-select" value={form.round} onChange={e => update('round', e.target.value)}>
                        {ROUND_OPTIONS.map(r => <option key={r}>{r}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Interview Type *</label>
                      <select className="form-select" value={form.type} onChange={e => update('type', e.target.value)}>
                        {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Date + Time */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Date *</label>
                      <input
                        type="date"
                        className="form-input"
                        min={today}
                        value={form.date}
                        onChange={e => update('date', e.target.value)}
                      />
                      {errors.date && <div className="form-error-msg">{errors.date}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Time *</label>
                      <input
                        type="time"
                        className="form-input"
                        value={form.time}
                        onChange={e => update('time', e.target.value)}
                      />
                      {errors.time && <div className="form-error-msg">{errors.time}</div>}
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="form-group">
                    <label className="form-label">Duration (minutes)</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {DURATION_OPTIONS.map(d => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => update('duration', d)}
                          style={{
                            padding: '0.4rem 0.9rem',
                            borderRadius: '20px',
                            border: `1.5px solid ${form.duration === d ? '#10b981' : '#e2e8f0'}`,
                            background: form.duration === d ? '#ecfdf5' : 'white',
                            color: form.duration === d ? '#059669' : '#64748b',
                            cursor: 'pointer',
                            fontWeight: form.duration === d ? 700 : 400,
                            fontSize: '0.875rem'
                          }}
                        >
                          {d} min
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Meeting Link */}
                  {form.type === 'Video Call' && (
                    <div className="form-group">
                      <label className="form-label">Meeting Link *</label>
                      <div className="input-with-icon">
                        <Link2 className="input-icon" size={18} />
                        <input
                          type="url"
                          className="form-input"
                          placeholder="https://meet.google.com/..."
                          value={form.meetingLink}
                          onChange={e => update('meetingLink', e.target.value)}
                        />
                      </div>
                      {errors.meetingLink && <div className="form-error-msg">{errors.meetingLink}</div>}
                    </div>
                  )}

                  {/* Notes */}
                  <div className="form-group">
                    <label className="form-label">Interview Notes / Instructions</label>
                    <textarea
                      className="form-input form-textarea"
                      rows={3}
                      placeholder="Add preparation notes or instructions for the candidate..."
                      value={form.notes}
                      onChange={e => update('notes', e.target.value)}
                      style={{ resize: 'vertical' }}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #0284c7)', border: 'none' }}
                    loading={isSubmitting}
                    icon={Calendar}
                  >
                    Confirm & Schedule Interview
                  </Button>
                </form>
              )}
            </div>

            {/* Right Sidebar: Selected Candidate Preview + Tips */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Candidate Preview */}
              {selectedCandidate ? (
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', fontSize: '0.95rem', color: '#64748b' }}>SELECTED CANDIDATE</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
                    <img src={selectedCandidate.avatar} alt={selectedCandidate.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>{selectedCandidate.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{selectedCandidate.experience} exp</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div>📋 {selectedCandidate.jobTitle}</div>
                    <div>📍 {selectedCandidate.location}</div>
                    <div>✉️ {selectedCandidate.email}</div>
                    <div>📱 {selectedCandidate.phone}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.85rem' }}>
                    {selectedCandidate.skills.slice(0, 4).map((s, i) => <span key={i} className="skill-tag">{s}</span>)}
                  </div>
                </div>
              ) : (
                <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                  <Users size={32} color="#e2e8f0" style={{ marginBottom: '0.75rem' }} />
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Select a candidate to see their profile here</p>
                </div>
              )}

              {/* Quick Tips */}
              <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f0fdf4, #eff6ff)', border: '1px solid #bbf7d0' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', color: '#059669' }}>📌 Interview Best Practices</h4>
                <ul style={{ paddingLeft: '1.15rem', fontSize: '0.8rem', color: '#374151', display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
                  <li>Send confirmation email 24h before</li>
                  <li>Prepare competency-based questions</li>
                  <li>Allow time for candidate questions</li>
                  <li>Take structured notes during the call</li>
                  <li>Rate within 1 hour of interview</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Interview List Tab */}
        {activeTab === 'list' && (
          <div>
            {myInterviews.length === 0 ? (
              <div className="empty-state">
                <Calendar size={36} color="#10b981" style={{ marginBottom: '1rem' }} />
                <h3>No interviews scheduled yet</h3>
                <p>Schedule your first interview to get started.</p>
                <Button variant="primary" onClick={() => setActiveTab('schedule')} style={{ background: 'linear-gradient(135deg, #10b981, #0284c7)', border: 'none' }}>
                  Schedule Interview
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {myInterviews.map(interview => (
                  <div key={interview.id} className="card" style={{ padding: '1.5rem', borderLeft: `4px solid ${interview.status === 'Completed' ? '#10b981' : interview.status === 'Cancelled' ? '#ef4444' : '#4f46e5'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                          <h4 style={{ fontSize: '1.1rem' }}>{interview.candidateName}</h4>
                          <span style={{
                            padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                            background: interview.status === 'Upcoming' ? '#eef2ff' : interview.status === 'Completed' ? '#ecfdf5' : '#fef2f2',
                            color: interview.status === 'Upcoming' ? '#4f46e5' : interview.status === 'Completed' ? '#059669' : '#dc2626'
                          }}>
                            {interview.status}
                          </span>
                          <span style={{ padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.72rem', background: '#f1f5f9', color: '#64748b', fontWeight: 600 }}>
                            {interview.round}
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
                          {interview.jobTitle} · {interview.company}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700 }}>📅 {interview.date}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>⏰ {interview.time} · {interview.duration} min</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                          {interview.type === 'Video Call' ? '🎥' : interview.type === 'Phone Call' ? '📞' : '🏢'} {interview.type}
                        </div>
                      </div>
                    </div>

                    {interview.meetingLink && (
                      <div style={{ padding: '0.6rem 0.9rem', background: '#eef2ff', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                        🔗 <a href={interview.meetingLink} target="_blank" rel="noreferrer" style={{ color: '#4f46e5', fontWeight: 600 }}>{interview.meetingLink}</a>
                      </div>
                    )}

                    {interview.notes && (
                      <p style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '0.75rem' }}>
                        📝 {interview.notes}
                      </p>
                    )}

                    {/* Feedback Section */}
                    {editingId === interview.id ? (
                      <div style={{ marginTop: '0.75rem', padding: '1rem', background: '#f8fafc', borderRadius: '10px' }}>
                        <label className="form-label" style={{ marginBottom: '0.5rem' }}>Interview Feedback / Outcome</label>
                        <textarea
                          className="form-input form-textarea"
                          rows={3}
                          placeholder="How did the interview go? Add outcome notes here..."
                          value={editFeedback}
                          onChange={e => setEditFeedback(e.target.value)}
                          style={{ resize: 'vertical' }}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                          <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>Cancel</Button>
                          <Button size="sm" variant="primary"
                            style={{ background: 'linear-gradient(135deg, #10b981, #0284c7)', border: 'none' }}
                            onClick={() => {
                              updateInterview(interview.id, { feedback: editFeedback, status: 'Completed' });
                              setEditingId(null);
                            }}
                          >
                            Save Feedback & Mark Complete
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {interview.feedback && (
                          <div style={{ padding: '0.75rem', background: '#ecfdf5', borderRadius: '8px', fontSize: '0.875rem', color: '#065f46', marginBottom: '0.75rem' }}>
                            ✅ <strong>Feedback:</strong> {interview.feedback}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                          {interview.status !== 'Completed' && (
                            <Button
                              size="sm"
                              variant="primary"
                              style={{ background: 'linear-gradient(135deg, #10b981, #0284c7)', border: 'none' }}
                              onClick={() => {
                                setEditingId(interview.id);
                                setEditFeedback(interview.feedback || '');
                              }}
                            >
                              + Add Feedback
                            </Button>
                          )}
                          {interview.status === 'Completed' && !interview.feedback && (
                            <Button size="sm" variant="secondary" onClick={() => { setEditingId(interview.id); setEditFeedback(''); }}>
                              Edit Feedback
                            </Button>
                          )}
                          {interview.status !== 'Completed' && (
                            <Button size="sm" variant="danger" onClick={() => cancelInterview(interview.id)}>
                              Cancel Interview
                            </Button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HRSchedulePage;
