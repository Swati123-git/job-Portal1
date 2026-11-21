import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users, ArrowUpRight, Building2 } from 'lucide-react';
import Badge from '../common/Badge';

const CompanyCard = ({ company }) => {
  return (
    <div className="company-card">
      <div>
        <div className="company-card-top">
          <div
            className="company-card-logo"
            style={{ background: company.logoBg || 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
          >
            {company.initials}
          </div>
          <div style={{ flex: 1 }}>
            <Link
              to={`/companies/${company.id}`}
              style={{ fontSize: '1.2rem', fontWeight: 700, color: 'inherit', display: 'block' }}
            >
              {company.name}
            </Link>
            <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>
              {company.industry}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1.25rem', lineHeight: '1.5' }}>
          {company.tagline}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem', fontSize: '0.85rem', color: '#64748b' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={15} />
            {company.location}
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <Users size={15} />
            {company.size.split(' ')[0]} emp.
          </span>
          <span className="company-rating-stars">
            <Star size={14} fill="#f59e0b" />
            {company.rating} ({company.reviewCount})
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
        <Badge variant="primary">
          {company.metrics?.activeJobs || 3} Open Roles
        </Badge>
        <Link
          to={`/companies/${company.id}`}
          className="btn btn-ghost btn-sm"
          style={{ color: '#4f46e5', fontWeight: 600 }}
        >
          View Company <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
