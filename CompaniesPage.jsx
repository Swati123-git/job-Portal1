import React, { useState, useMemo, useEffect } from 'react';
import { Search, Building2 } from 'lucide-react';
import { mockCompanies } from '../data/mockCompanies';
import { companiesAPI } from '../services/api';
import CompanyCard from '../components/companies/CompanyCard';
import EmptyState from '../components/common/EmptyState';

const INDUSTRIES = [
  'All',
  'Software & Cloud Services',
  'Artificial Intelligence & ML',
  'Fintech & Payments',
  'Design & Creative Agency',
  'Healthcare & MedTech',
  'CleanTech & Renewable Energy',
  'Cybersecurity & Cloud'
];

// Map backend company → frontend shape
const mapBackendCompany = (c) => ({
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

const CompaniesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [companies, setCompanies] = useState(mockCompanies);

  // Try to fetch real companies from backend
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await companiesAPI.getAll();
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          setCompanies(response.data.data.map(mapBackendCompany));
        }
        // else keep using mockCompanies
      } catch {
        // Backend offline — use mockCompanies silently
      }
    };
    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = company.name.toLowerCase().includes(q);
        const inTag = (company.tagline || '').toLowerCase().includes(q);
        const inLoc = (company.location || '').toLowerCase().includes(q);
        const inInd = (company.industry || '').toLowerCase().includes(q);
        if (!inName && !inTag && !inLoc && !inInd) return false;
      }

      if (selectedIndustry !== 'All') {
        if (company.industry !== selectedIndustry) return false;
      }

      return true;
    });
  }, [companies, searchQuery, selectedIndustry]);

  return (
    <div>
      {/* Header Banner */}
      <section className="jobs-page-header">
        <div className="container">
          <div style={{ maxWidth: '720px', margin: '0 auto 1.75rem auto', textAlign: 'center' }}>
            <span className="section-tag" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Building2 size={15} /> Top Global Employers
            </span>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>
              Discover Great Companies
            </h1>
            <p style={{ color: '#64748b' }}>
              Browse company profiles, workplace culture, benefits, ratings, and active job openings.
            </p>
          </div>

          {/* Search Bar */}
          <div
            style={{
              maxWidth: '650px',
              margin: '0 auto 1.5rem auto',
              display: 'flex',
              alignItems: 'center',
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '0.5rem 1rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}
          >
            <Search size={20} color="#4f46e5" style={{ marginRight: '0.75rem' }} />
            <input
              type="text"
              placeholder="Search companies by name, technology, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1rem' }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Industry Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => setSelectedIndustry(ind)}
                className={`tag-btn ${selectedIndustry === ind ? 'active' : ''}`}
                style={{
                  background: selectedIndustry === ind ? '#4f46e5' : '#ffffff',
                  color: selectedIndustry === ind ? '#ffffff' : '#475569',
                  borderColor: selectedIndustry === ind ? '#4f46e5' : '#e2e8f0'
                }}
              >
                {ind}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Companies Grid */}
      <div className="container section-padding" style={{ paddingTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 600, color: '#475569' }}>
            Showing <strong style={{ color: '#0f172a' }}>{filteredCompanies.length}</strong> companies
          </div>
        </div>

        {filteredCompanies.length === 0 ? (
          <EmptyState
            title="No companies found"
            description="Try changing your search keywords or resetting the industry filter."
            actionText="Show All Companies"
            onAction={() => {
              setSearchQuery('');
              setSelectedIndustry('All');
            }}
          />
        ) : (
          <div className="companies-grid">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesPage;
