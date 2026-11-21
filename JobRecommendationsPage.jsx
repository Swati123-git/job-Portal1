import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Briefcase,
  MapPin,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Bookmark,
  Eye,
  Send,
  Building,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useJobs } from '../context/JobContext';
import { useToast } from '../context/ToastContext';
import { recommendationsAPI } from '../services/api';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const JobRecommendationsPage = () => {
  const { user } = useAuth();
  const { jobs, isJobSaved, toggleSaveJob, isJobApplied, applyForJob } = useJobs();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await recommendationsAPI.getRecommendations();
      if (response.data && response.data.success) {
        setRecommendations(response.data.recommendations || []);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch recommendations.');
      }
    } catch (err) {
      console.warn('API Recommendations fetch fallback:', err.message);
      // Fallback matching using client state if backend API error or offline mode
      fallbackClientRecommendations();
    } finally {
      setLoading(false);
    }
  };

  const fallbackClientRecommendations = () => {
    if (!jobs || jobs.length === 0) {
      setRecommendations([]);
      return;
    }

    const userSkills = (user?.skills || ['React', 'JavaScript', 'Node.js']).map(s => s.toLowerCase());

    const clientRecs = jobs.map(job => {
      const jobSkillsArr = (job.skills || []).map(s => s.trim());
      const matching = [];
      const missing = [];

      jobSkillsArr.forEach(js => {
        if (userSkills.some(us => us.includes(js.toLowerCase()) || js.toLowerCase().includes(us))) {
          matching.push(js);
        } else {
          missing.push(js);
        }
      });

      const score = jobSkillsArr.length > 0 
        ? Math.min(98, Math.max(30, Math.round((matching.length / jobSkillsArr.length) * 85) + 10))
        : 65;

      return {
        jobId: job.id,
        title: job.title,
        company: job.company || job.company_name,
        location: job.location,
        salary: job.salary,
        jobType: job.jobType || job.job_type,
        matchScore: score,
        matchingSkills: matching.length > 0 ? matching : ['General Engineering'],
        missingSkills: missing,
        reason: matching.length > 0
          ? `Strong skill overlap in ${matching.slice(0, 2).join(' & ')}.`
          : `Matches your professional background in ${job.location || 'technology'}.`
      };
    });

    clientRecs.sort((a, b) => b.matchScore - a.matchScore);
    setRecommendations(clientRecs.slice(0, 10));
  };

  useEffect(() => {
    fetchRecommendations();
  }, [user]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#3b82f6';
  };

  return (
    <div>
      {/* Hero Header */}
      <section className="jobs-page-header">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <Sparkles size={15} /> AI Match Engine
          </span>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: 'white' }}>
            AI Recommended Jobs
          </h1>
          <p style={{ color: '#cbd5e1', maxWidth: 640, margin: '0 auto' }}>
            Personalized job recommendations scored and matched against your skills, profile, and resume.
          </p>
        </div>
      </section>

      <div className="container section-padding" style={{ maxWidth: 960, margin: '0 auto' }}>
        
        {/* Top Control Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingUp size={20} color="#4f46e5" /> Top Matches For You
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Showing highest matching roles based on your verified skill profile
            </p>
          </div>

          <button
            onClick={fetchRecommendations}
            disabled={loading}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            {loading ? 'Analyzing Matches...' : 'Refresh Recommendations'}
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <RefreshCw size={36} color="#4f46e5" className="spin" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', color: '#1e293b' }}>Calculating AI Job Matches...</h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Comparing your skills, location, and experience with active job postings</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && recommendations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0' }}>
            <Briefcase size={44} color="#94a3b8" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>No Matches Found</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', maxWidth: 460, margin: '0.5rem auto 1.5rem auto' }}>
              Add more skills to your candidate profile or analyze your resume to get instant personalized job recommendations.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <Link to="/profile">
                <Button variant="primary">Update Profile Skills</Button>
              </Link>
              <Link to="/resume-analyzer">
                <Button variant="secondary">Run AI Resume Analyzer</Button>
              </Link>
            </div>
          </div>
        )}

        {/* Recommendations List */}
        {!loading && recommendations.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {recommendations.map((rec) => {
              const saved = isJobSaved(rec.jobId);
              const applied = isJobApplied(rec.jobId);
              const scoreColor = getScoreColor(rec.matchScore);

              return (
                <div
                  key={rec.jobId}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 16,
                    padding: '1.5rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
                        <h3 style={{ fontSize: '1.2rem', color: '#0f172a', margin: 0 }}>
                          <Link to={`/jobs/${rec.jobId}`} style={{ color: '#0f172a', textDecoration: 'none' }}>
                            {rec.title}
                          </Link>
                        </h3>
                        {applied && <Badge variant="success">Applied</Badge>}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#4f46e5', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Building size={15} /> {rec.company}
                      </div>
                    </div>

                    {/* Match Score Gauge */}
                    <div
                      style={{
                        background: `${scoreColor}12`,
                        border: `1.5px solid ${scoreColor}40`,
                        borderRadius: 12,
                        padding: '0.5rem 1rem',
                        textAlign: 'center',
                        minWidth: 110
                      }}
                    >
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                        {rec.matchScore}%
                      </div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: scoreColor, textTransform: 'uppercase', marginTop: 2 }}>
                        Match Score
                      </div>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                    {rec.location && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={14} color="#6366f1" /> {rec.location}
                      </span>
                    )}
                    {rec.salary && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <DollarSign size={14} color="#10b981" /> {rec.salary}
                      </span>
                    )}
                    {rec.jobType && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Briefcase size={14} color="#f59e0b" /> {rec.jobType}
                      </span>
                    )}
                  </div>

                  {/* AI Recommendation Reason */}
                  {rec.reason && (
                    <div style={{ background: '#f8fafc', borderLeft: '3.5px solid #4f46e5', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.88rem', color: '#334155', marginBottom: '1rem' }}>
                      <strong style={{ color: '#4f46e5' }}>Why Recommended:</strong> {rec.reason}
                    </div>
                  )}

                  {/* Skills Breakdown */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
                    {rec.matchingSkills && rec.matchingSkills.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle2 size={13} /> Matching Skills
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {rec.matchingSkills.map((sk, idx) => (
                            <span key={idx} style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.78rem', padding: '0.2rem 0.55rem', borderRadius: 6, fontWeight: 600 }}>
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {rec.missingSkills && rec.missingSkills.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <AlertCircle size={13} /> Missing Skills
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {rec.missingSkills.map((sk, idx) => (
                            <span key={idx} style={{ background: '#fee2e2', color: '#b91c1c', fontSize: '0.78rem', padding: '0.2rem 0.55rem', borderRadius: 6, fontWeight: 600 }}>
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    <button
                      onClick={() => toggleSaveJob(rec.jobId)}
                      className={`btn btn-secondary btn-sm ${saved ? 'saved' : ''}`}
                      style={{ color: saved ? '#ef4444' : undefined }}
                    >
                      <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
                      {saved ? 'Saved' : 'Save'}
                    </button>

                    <Link to={`/jobs/${rec.jobId}`}>
                      <Button variant="secondary" size="sm" icon={Eye}>
                        View Job
                      </Button>
                    </Link>

                    <Button
                      variant="primary"
                      size="sm"
                      disabled={applied}
                      onClick={() => navigate(`/jobs/${rec.jobId}`)}
                      icon={Send}
                    >
                      {applied ? 'Applied' : 'Apply Now'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendationsPage;
