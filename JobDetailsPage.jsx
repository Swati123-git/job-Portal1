import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  DollarSign,
  Briefcase,
  Clock,
  Building,
  CheckCircle2,
  Bookmark,
  Share2,
  ArrowLeft,
  Calendar,
  Users,
  Award,
  Globe,
  ExternalLink,
  Flame
} from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { mockCompanies } from '../data/mockCompanies';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import JobCard from '../components/jobs/JobCard';
import JobApplyModal from '../components/jobs/JobApplyModal';

const JobDetailsPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, isJobSaved, toggleSaveJob, isJobApplied, getApplicationByJobId } = useJobs();
  const { showToast } = useToast();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const job = jobs.find((j) => j.id === jobId);

  if (!job) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2>Job Listing Not Found</h2>
        <p style={{ margin: '1rem 0 2rem 0' }}>The job position you are looking for may have expired or been filled.</p>
        <Link to="/jobs">
          <Button variant="primary" icon={ArrowLeft}>
            Back to Jobs
          </Button>
        </Link>
      </div>
    );
  }

  const company = mockCompanies.find((c) => c.id === job.companyId) || {
    name: job.company,
    about: `${job.company} is a leading industry pioneer offering world-class culture and rapid career progression.`,
    size: '500+ employees',
    website: 'https://example.com'
  };

  const saved = isJobSaved(job.id);
  const applied = isJobApplied(job.id);
  const application = getApplicationByJobId(job.id);

  // Safe fallbacks for optional arrays (backend jobs may not have these)
  const responsibilities = job.responsibilities?.length ? job.responsibilities : ['Lead key technical initiatives and deliver high-quality work.', 'Collaborate with cross-functional teams to achieve project goals.', 'Contribute to a culture of continuous improvement and innovation.'];
  const qualifications = job.qualifications?.length ? job.qualifications : (job.requirements?.length ? job.requirements : ['Relevant experience in the field.', 'Strong problem-solving and communication skills.', 'Ability to work in a team environment.']);
  const benefits = job.benefits?.length ? job.benefits : ['Competitive salary package', 'Health & wellness benefits', 'Professional development opportunities', 'Flexible working arrangements'];

  // Similar jobs (same category, excluding current job)
  const similarJobs = jobs.filter((j) => j.category === job.category && j.id !== job.id).slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Job listing link copied to your clipboard!', 'success', 'Link Copied');
    } else {
      showToast('Share this URL: ' + window.location.href, 'info');
    }
  };

  return (
    <div>
      {/* 1. Details Hero Header */}
      <section className="job-details-hero">
        <div className="container">
          <Link
            to="/jobs"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: 600 }}
          >
            <ArrowLeft size={16} /> Back to Job Search
          </Link>

          <div className="job-details-header-card">
            <div className="job-details-title-group">
              <div
                className="job-details-logo"
                style={{ background: job.companyLogoBg || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
              >
                {job.companyInitials}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  <Link
                    to={`/companies/${job.companyId}`}
                    style={{ fontSize: '1.05rem', fontWeight: 700, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Building size={16} /> {job.company}
                  </Link>
                </div>

                <h1 style={{ fontSize: '2.1rem', marginBottom: '0.75rem', lineHeight: 1.25 }}>
                  {job.title}
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Badge variant="primary">{job.jobType}</Badge>
                  <Badge variant="info">{job.workplaceType}</Badge>
                  <Badge variant="neutral">{job.experience}</Badge>
                  {job.urgent && (
                    <Badge variant="danger" icon={Flame}>Urgent Hiring</Badge>
                  )}
                  {applied && (
                    <Badge variant="success" icon={CheckCircle2}>Application Submitted</Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons Top */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => toggleSaveJob(job.id)}
                className={`btn btn-secondary ${saved ? 'saved' : ''}`}
                style={{ color: saved ? '#ef4444' : undefined }}
                title={saved ? 'Remove Bookmark' : 'Save Job'}
              >
                <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Saved' : 'Save Job'}
              </button>

              <button
                onClick={handleShare}
                className="btn btn-secondary btn-icon-only"
                title="Share Job"
              >
                <Share2 size={18} />
              </button>

              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  if (applied) {
                    navigate('/dashboard');
                  } else {
                    setIsApplyModalOpen(true);
                  }
                }}
              >
                {applied ? 'View in Dashboard' : 'Apply Now'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Details Content Grid */}
      <div className="container">
        <div className="job-details-grid">
          {/* Main Column */}
          <div>
            {/* Overview / Description */}
            <div className="job-content-card">
              <h2 className="job-section-heading">About the Role</h2>
              <p style={{ fontSize: '1rem', lineHeight: '1.7', color: '#334155', marginBottom: '1.5rem' }}>
                {job.description}
              </p>

              {/* Responsibilities */}
              <h3 className="job-section-heading" style={{ marginTop: '2rem' }}>
                Key Responsibilities
              </h3>
              <ul className="job-bullet-list">
                {responsibilities.map((resp, idx) => (
                  <li key={idx} className="job-bullet-item">
                    <CheckCircle2 className="bullet-check-icon" size={18} />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>

              {/* Qualifications */}
              <h3 className="job-section-heading" style={{ marginTop: '2rem' }}>
                Qualifications & Experience
              </h3>
              <ul className="job-bullet-list">
                {qualifications.map((qual, idx) => (
                  <li key={idx} className="job-bullet-item">
                    <CheckCircle2 className="bullet-check-icon" size={18} />
                    <span>{qual}</span>
                  </li>
                ))}
              </ul>

              {/* Required Skills */}
              <h3 className="job-section-heading" style={{ marginTop: '2rem' }}>
                Required Skills & Tech Stack
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {(job.skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="skill-tag"
                    style={{ fontSize: '0.9rem', padding: '0.4rem 0.9rem', background: '#eef2ff', color: '#4f46e5', borderColor: '#c7d2fe' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Benefits & Perks */}
              <h3 className="job-section-heading" style={{ marginTop: '2rem' }}>
                Perks & Benefits
              </h3>
              <ul className="job-bullet-list">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="job-bullet-item">
                    <Award className="bullet-check-icon" size={18} style={{ color: '#0ea5e9' }} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* About the Company Box */}
            <div className="job-content-card">
              <h3 className="job-section-heading">About {company.name}</h3>
              <p style={{ color: '#475569', lineHeight: '1.65', marginBottom: '1.25rem' }}>
                {company.about}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to={`/companies/${job.companyId}`} className="btn btn-secondary btn-sm">
                  View Full Company Profile &rarr;
                </Link>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-ghost btn-sm"
                    style={{ color: '#64748b' }}
                  >
                    Company Website <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div>
            <div className="job-sidebar-card">
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Job Overview</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Quick snapshot of this position</p>

              <div className="sidebar-overview-list">
                <div className="sidebar-overview-item">
                  <div className="overview-icon-box">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <div className="overview-label">Offered Salary</div>
                    <div className="overview-value">{job.salary}</div>
                  </div>
                </div>

                <div className="sidebar-overview-item">
                  <div className="overview-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="overview-label">Location & Type</div>
                    <div className="overview-value">{job.location} ({job.workplaceType})</div>
                  </div>
                </div>

                <div className="sidebar-overview-item">
                  <div className="overview-icon-box" style={{ background: '#f3e8ff', color: '#8b5cf6' }}>
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <div className="overview-label">Job Category</div>
                    <div className="overview-value">{job.categoryName}</div>
                  </div>
                </div>

                <div className="sidebar-overview-item">
                  <div className="overview-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
                    <Award size={20} />
                  </div>
                  <div>
                    <div className="overview-label">Experience</div>
                    <div className="overview-value">{job.experience}</div>
                  </div>
                </div>

                <div className="sidebar-overview-item">
                  <div className="overview-icon-box" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="overview-label">Date Posted</div>
                    <div className="overview-value">{job.postedDate} ({job.postedAgo})</div>
                  </div>
                </div>

                <div className="sidebar-overview-item">
                  <div className="overview-icon-box" style={{ background: '#f1f5f9', color: '#475569' }}>
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="overview-label">Applicants</div>
                    <div className="overview-value">{job.applicantsCount} applied</div>
                  </div>
                </div>
              </div>

              {/* Sidebar Action Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Button
                  variant="primary"
                  size="lg"
                  style={{ width: '100%' }}
                  onClick={() => {
                    if (applied) {
                      navigate('/dashboard');
                    } else {
                      setIsApplyModalOpen(true);
                    }
                  }}
                >
                  {applied ? 'View Application Status' : 'Apply For This Position'}
                </Button>

                <Button
                  variant="secondary"
                  style={{ width: '100%' }}
                  onClick={() => toggleSaveJob(job.id)}
                >
                  <Bookmark size={16} fill={saved ? 'currentColor' : 'none'} color={saved ? '#ef4444' : 'currentColor'} />
                  {saved ? 'Saved in Bookmarks' : 'Save for Later'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Similar Recommended Jobs */}
        {similarJobs.length > 0 && (
          <div style={{ marginTop: '4rem', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '1.65rem', marginBottom: '1.5rem' }}>Similar Job Opportunities</h2>
            <div className="jobs-layout-grid">
              {similarJobs.map((simJob) => (
                <JobCard key={simJob.id} job={simJob} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Application Modal */}
      <JobApplyModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        job={job}
      />
    </div>
  );
};

export default JobDetailsPage;
