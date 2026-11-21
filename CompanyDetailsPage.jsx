import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Users,
  Calendar,
  Star,
  ExternalLink,
  Briefcase,
  CheckCircle2,
  Heart,
  ArrowLeft,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { mockCompanies } from '../data/mockCompanies';
import { companiesAPI } from '../services/api';
import { useJobs } from '../context/JobContext';
import JobCard from '../components/jobs/JobCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const CompanyDetailsPage = () => {
  const { companyId } = useParams();
  const { jobs } = useJobs();
  const [activeTab, setActiveTab] = useState('about');
  const [company, setCompany] = useState(() => mockCompanies.find((c) => c.id === companyId) || null);

  // Try to load real company from backend
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await companiesAPI.getById(companyId);
        if (response.data.success && response.data.data) {
          const c = response.data.data;
          setCompany({
            id: String(c.id),
            name: c.company_name,
            tagline: c.description || 'A great place to work.',
            logoBg: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
            initials: (c.company_name || 'UK').substring(0, 2).toUpperCase(),
            industry: 'Software & Cloud Services',
            location: c.location || '',
            size: '100+ employees',
            founded: '2020',
            rating: 4.5,
            reviewCount: 0,
            website: c.website || '',
            about: c.description || '',
            perks: [],
            metrics: { retentionRate: '90%' }
          });
        }
      } catch {
        // Keep existing mockCompanies data
      }
    };
    fetchCompany();
  }, [companyId]);

  if (!company) {
    return (
      <div className="container section-padding" style={{ textAlign: 'center' }}>
        <h2>Company Not Found</h2>
        <p style={{ margin: '1rem 0 2rem 0' }}>The company profile you are searching for does not exist.</p>
        <Link to="/companies">
          <Button variant="primary" icon={ArrowLeft}>
            Back to Companies
          </Button>
        </Link>
      </div>
    );
  }

  // Jobs posted by this company
  const companyJobs = jobs.filter((j) => j.companyId === company.id);

  // Mock employee reviews
  const mockReviews = [
    {
      id: 'rev-1',
      author: 'Senior Frontend Engineer',
      role: 'Current Employee, 2+ yrs',
      rating: 5,
      date: 'July 2026',
      title: 'Incredible autonomy and engineering culture',
      pros: 'Super smart colleagues, high transparency from leadership, and modern tech stack. Great work-life balance.',
      cons: 'Fast-paced growth means occasional context switching.'
    },
    {
      id: 'rev-2',
      author: 'Product Design Lead',
      role: 'Current Employee, 1 yr',
      rating: 4.8,
      date: 'May 2026',
      title: 'Design-driven leadership and high quality bar',
      pros: 'Executives value design and user experience deeply. Excellent equipment and conference budget.',
      cons: 'Cross-timezone coordination requires intentional asynchronous documentation.'
    }
  ];

  return (
    <div>
      {/* 1. Hero Header Banner */}
      <section className="company-details-hero">
        <div className="container">
          <Link
            to="/companies"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '1.75rem', fontWeight: 600 }}
          >
            <ArrowLeft size={16} /> Back to Companies Directory
          </Link>

          <div className="company-hero-container">
            <div
              className="company-hero-logo"
              style={{ background: company.logoBg || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
            >
              {company.initials}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                <h1 style={{ color: 'white', fontSize: '2.25rem' }}>{company.name}</h1>
                <Badge variant="success" icon={CheckCircle2}>Verified Employer</Badge>
              </div>

              <p style={{ color: '#cbd5e1', fontSize: '1.1rem', marginBottom: '1rem', maxWidth: '680px' }}>
                {company.tagline}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', color: '#94a3b8' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building2 size={16} /> {company.industry}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={16} /> {company.location}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#fbbf24', fontWeight: 700 }}>
                  <Star size={16} fill="#fbbf24" /> {company.rating} ({company.reviewCount} reviews)
                </span>
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}
                  >
                    Visit Website <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Row */}
      <div className="container" style={{ marginTop: '-1.5rem', position: 'relative', zIndex: 10 }}>
        <div className="company-metrics-grid">
          <div className="company-metric-card">
            <div className="company-metric-value">{companyJobs.length}</div>
            <div className="company-metric-label">Open Positions</div>
          </div>
          <div className="company-metric-card">
            <div className="company-metric-value">{company.size.split(' ')[0]}</div>
            <div className="company-metric-label">Team Members</div>
          </div>
          <div className="company-metric-card">
            <div className="company-metric-value">{company.founded}</div>
            <div className="company-metric-label">Founded Year</div>
          </div>
          <div className="company-metric-card">
            <div className="company-metric-value">{company.metrics?.retentionRate || '94%'}</div>
            <div className="company-metric-label">Retention Rate</div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Tabs */}
      <div className="container" style={{ marginBottom: '5rem' }}>
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            About & Culture
          </button>
          <button
            className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            <span>Open Positions</span>
            <span className="tab-count">{companyJobs.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <span>Employee Reviews</span>
            <span className="tab-count">{mockReviews.length}</span>
          </button>
        </div>

        {/* Tab 1: About */}
        {activeTab === 'about' && (
          <div>
            <div className="job-content-card">
              <h3 className="job-section-heading">Company Overview</h3>
              <p style={{ fontSize: '1.05rem', lineHeight: '1.75', color: '#334155', marginBottom: '2rem' }}>
                {company.about}
              </p>

              <h3 className="job-section-heading">Why Work With Us</h3>
              <ul className="job-bullet-list">
                {(company.perks || []).map((perk, idx) => (
                  <li key={idx} className="job-bullet-item">
                    <CheckCircle2 className="bullet-check-icon" size={18} />
                    <span style={{ fontSize: '1rem', color: '#1e293b' }}>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Open Positions */}
        {activeTab === 'jobs' && (
          <div>
            {companyJobs.length === 0 ? (
              <div className="empty-state">
                <Briefcase size={36} color="#4f46e5" style={{ marginBottom: '1rem' }} />
                <h3>No active openings right now</h3>
                <p>Check back soon or explore other exciting roles on JobSphere.</p>
                <Link to="/jobs">
                  <Button variant="primary">Browse All Jobs</Button>
                </Link>
              </div>
            ) : (
              <div className="jobs-layout-grid">
                {companyJobs.map((job) => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Reviews */}
        {activeTab === 'reviews' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              {mockReviews.map((rev) => (
                <div key={rev.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '0.25rem' }}>{rev.title}</h4>
                      <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                        {rev.author} &bull; <span style={{ color: '#10b981' }}>{rev.role}</span> &bull; {rev.date}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontWeight: 700 }}>
                      <Star size={16} fill="#f59e0b" /> {rev.rating} / 5
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ background: '#f0fdf4', borderLeft: '3px solid #10b981', padding: '0.75rem 1rem', borderRadius: '4px' }}>
                      <strong style={{ color: '#15803d', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>PROS</strong>
                      <span style={{ fontSize: '0.9rem', color: '#166534' }}>{rev.pros}</span>
                    </div>
                    <div style={{ background: '#fff1f2', borderLeft: '3px solid #f43f5e', padding: '0.75rem 1rem', borderRadius: '4px' }}>
                      <strong style={{ color: '#be123c', fontSize: '0.85rem', display: 'block', marginBottom: '0.25rem' }}>CONS</strong>
                      <span style={{ fontSize: '0.9rem', color: '#9f1239' }}>{rev.cons}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
