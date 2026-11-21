import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Briefcase, Bookmark, CheckCircle, Flame, Building } from 'lucide-react';
import { useJobs } from '../../context/JobContext';
import Badge from '../common/Badge';

const JobCard = ({ job, layout = 'grid' }) => {
  const { isJobSaved, toggleSaveJob, isJobApplied } = useJobs();
  const navigate = useNavigate();

  const saved = isJobSaved(job.id);
  const applied = isJobApplied(job.id);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveJob(job.id);
  };

  return (
    <div className={`job-card ${layout === 'list' ? 'job-card-list' : ''}`}>
      {/* Top Section */}
      <div>
        <div className="job-card-header">
          <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
            <div
              className="company-avatar-box"
              style={{ background: job.companyLogoBg || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
            >
              {job.companyInitials || 'JB'}
            </div>
            <div className="job-card-meta">
              <span className="job-company-name">
                <Building size={14} />
                {job.company}
              </span>
              <Link to={`/jobs/${job.id}`} className="job-title-link">
                {job.title}
              </Link>
            </div>
          </div>

          <button
            onClick={handleBookmarkClick}
            className={`bookmark-btn ${saved ? 'saved' : ''}`}
            title={saved ? 'Remove bookmark' : 'Save job'}
            aria-label="Bookmark Job"
          >
            <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Badges Row */}
        <div className="job-badge-row">
          <Badge variant="primary">{job.jobType}</Badge>
          <Badge variant="info">{job.workplaceType}</Badge>
          <Badge variant="neutral">{job.experience}</Badge>
          {job.urgent && (
            <Badge variant="danger" icon={Flame}>Urgent</Badge>
          )}
          {applied && (
            <Badge variant="success" icon={CheckCircle}>Applied</Badge>
          )}
        </div>

        {/* Location & Salary Info */}
        <div className="job-info-chips">
          <span className="info-chip-item">
            <MapPin size={15} className="text-muted" />
            {job.location}
          </span>
          <span className="info-chip-item">
            <DollarSign size={15} className="text-muted" />
            {job.salary}
          </span>
        </div>

        {/* Skills */}
        <div className="job-skills-row">
          {job.skills.slice(0, 3).map((skill, idx) => (
            <span key={idx} className="skill-tag">
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="skill-tag" style={{ background: 'transparent', borderStyle: 'dashed' }}>
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer / Action */}
      <div className="job-card-footer">
        <span className="job-posted-ago">
          <Clock size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          Posted {job.postedAgo}
        </span>

        <div className="job-card-actions">
          <Link to={`/jobs/${job.id}`} className="btn btn-secondary btn-sm">
            Details
          </Link>
          <button
            onClick={() => navigate(`/jobs/${job.id}`)}
            className="btn btn-primary btn-sm"
          >
            {applied ? 'View Application' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
