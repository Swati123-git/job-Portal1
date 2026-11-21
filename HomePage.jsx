import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Code2,
  Palette,
  BrainCircuit,
  Boxes,
  TrendingUp,
  BadgeDollarSign,
  Headphones,
  ShieldCheck,
  Briefcase,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
  Users,
  Building,
  Star,
  Search
} from 'lucide-react';
import SearchBar from '../components/jobs/SearchBar';
import JobCard from '../components/jobs/JobCard';
import CompanyCard from '../components/companies/CompanyCard';
import Button from '../components/common/Button';
import { mockCategories } from '../data/mockCategories';
import { mockCompanies } from '../data/mockCompanies';
import { useJobs } from '../context/JobContext';

const categoryIcons = {
  Code2,
  Palette,
  BrainCircuit,
  Boxes,
  TrendingUp,
  BadgeDollarSign,
  Headphones,
  ShieldCheck
};

const HomePage = () => {
  const navigate = useNavigate();
  const { jobs, updateSearchFilters } = useJobs();

  // Featured jobs (e.g., jobs with featured: true)
  const featuredJobs = jobs.filter((j) => j.featured).slice(0, 6);

  const handleHeroSearch = ({ keyword, location, category }) => {
    updateSearchFilters({ keyword, location, category });
    navigate('/jobs');
  };

  const handleCategoryClick = (catId) => {
    updateSearchFilters({ category: catId });
    navigate('/jobs');
  };

  const handleTagClick = (tag) => {
    updateSearchFilters({ keyword: tag });
    navigate('/jobs');
  };

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Over 10,000+ Verified Jobs Added This Week</span>
            </div>

            <h1 className="hero-title">
              Find Your <span className="gradient-text">Dream Job</span> Today
            </h1>

            <p className="hero-subtitle">
              Discover high-paying tech, design, marketing, and executive careers at the world's most innovative companies. Your next career breakthrough starts here.
            </p>

            {/* Hero Multi-Input Search Bar */}
            <SearchBar onSearch={handleHeroSearch} />

            {/* Popular Search Tags */}
            <div className="popular-tags">
              <span style={{ fontWeight: 600 }}>Popular Searches:</span>
              {['React', 'Remote', 'Product Designer', 'Python', 'DevOps', 'Data Science'].map((tag) => (
                <button
                  key={tag}
                  className="tag-btn"
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Stats Banner */}
      <div className="container">
        <div className="stats-banner">
          <div className="stat-item">
            <h3>12,400+</h3>
            <p>Active Job Listings</p>
          </div>
          <div className="stat-item">
            <h3>850+</h3>
            <p>Verified Companies</p>
          </div>
          <div className="stat-item">
            <h3>98,500+</h3>
            <p>Candidates Placed</p>
          </div>
          <div className="stat-item">
            <h3>4.9 / 5</h3>
            <p>Candidate Satisfaction</p>
          </div>
        </div>
      </div>

      {/* 3. Popular Job Categories */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Browse by Domain</span>
            <h2 className="section-title">Popular Job Categories</h2>
            <p className="section-subtitle">
              Explore thousands of job opportunities across high-demand industries.
            </p>
          </div>

          <div className="categories-grid">
            {mockCategories.map((cat) => {
              const IconComponent = categoryIcons[cat.icon] || Briefcase;
              return (
                <div
                  key={cat.id}
                  className="category-card"
                  onClick={() => handleCategoryClick(cat.id)}
                >
                  <div
                    className="category-icon-box"
                    style={{ background: cat.bg, color: cat.color }}
                  >
                    <IconComponent size={26} />
                  </div>
                  <div>
                    <h3 className="category-title">{cat.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                      {cat.description}
                    </p>
                    <span className="category-jobs-count">
                      {cat.jobCount.toLocaleString()}+ open positions &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Featured Jobs Section */}
      <section className="section-padding" style={{ background: '#f1f5f9' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="section-tag">Handpicked Opportunities</span>
              <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Featured Positions</h2>
              <p className="section-subtitle" style={{ margin: 0 }}>
                Top recommended roles from verified industry leaders.
              </p>
            </div>
            <Link to="/jobs">
              <Button variant="outline" icon={ArrowRight} iconPosition="right">
                Explore All {jobs.length} Jobs
              </Button>
            </Link>
          </div>

          <div className="jobs-layout-grid">
            {featuredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Top Hiring Companies */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Top Employers</span>
            <h2 className="section-title">Work at World-Class Companies</h2>
            <p className="section-subtitle">
              Get hired by high-growth startups, unicorn leaders, and established enterprises.
            </p>
          </div>

          <div className="companies-grid">
            {mockCompanies.slice(0, 6).map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/companies">
              <Button variant="secondary" size="lg" icon={Building}>
                View All Companies ({mockCompanies.length})
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Why Choose JobSphere Section */}
      <section className="section-padding" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Platform Benefits</span>
            <h2 className="section-title">Why Choose JobSphere?</h2>
            <p className="section-subtitle">
              We streamline the entire hiring journey with transparent compensation, verified employers, and instant status tracking.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Zap size={28} />
              </div>
              <h3 className="feature-title">1-Click Fast Apply</h3>
              <p className="feature-desc">
                Save your candidate profile and apply to verified positions with a single click. Keep your documents organized in one place.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <Shield size={28} />
              </div>
              <h3 className="feature-title">100% Verified Employers</h3>
              <p className="feature-desc">
                Every company profile and salary range is vetted to ensure transparent, spam-free, and safe recruitment.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0284c7' }}>
                <CheckCircle2 size={28} />
              </div>
              <h3 className="feature-title">Real-Time Status Tracking</h3>
              <p className="feature-desc">
                No more ghosting. Get notified at every stage: application received, recruiter review, and live interview scheduling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section">
            <h2 className="cta-title">Ready to Elevate Your Career?</h2>
            <p className="cta-desc">
              Create your free profile today, upload your resume, and get matched with top hiring teams in under 2 minutes.
            </p>
            <div className="cta-actions">
              <Link to="/register">
                <Button variant="primary" size="lg" style={{ background: '#ffffff', color: '#4f46e5', fontWeight: 700 }}>
                  Create Free Account
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="outline" size="lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#ffffff' }}>
                  Browse All Jobs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
