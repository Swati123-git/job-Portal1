import React from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Target,
  Users,
  Award,
  Globe2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import Button from '../components/common/Button';

const teamMembers = [
  {
    name: 'Elena Rostova',
    role: 'Co-Founder & CEO',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    bio: 'Former VP of Talent at top tech unicorns. Passionate about empowering candidates with transparent salary data.'
  },
  {
    name: 'Marcus Vance',
    role: 'Co-Founder & CTO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    bio: 'Distributed systems architect & open source contributor. Architecting intelligent candidate-role matchmaking engines.'
  },
  {
    name: 'Sophia Chen',
    role: 'Head of Product & Design',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: 'Award-winning design director obsessed with frictionless career exploration and tactile user interfaces.'
  },
  {
    name: 'David Okafor',
    role: 'VP of Global Employer Partnerships',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    bio: 'Over 12 years helping Fortune 500 enterprises and fast-growing startups build high-performance distributed teams.'
  }
];

const AboutPage = () => {
  return (
    <div>
      {/* Hero */}
      <section className="hero-section" style={{ padding: '4rem 0 5rem 0' }}>
        <div className="container">
          <div className="hero-content">
            <span className="section-tag">About JobSphere</span>
            <h1 className="hero-title" style={{ fontSize: '3rem' }}>
              We're Transforming How The World <span className="gradient-text">Finds Meaningful Work</span>
            </h1>
            <p className="hero-subtitle">
              JobSphere was founded with a clear mission: eliminate the black box of hiring. We connect world-class candidates with forward-thinking companies through transparent salaries, verified roles, and real-time status updates.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding" style={{ background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <span className="section-tag" style={{ background: '#e0f2fe', color: '#0284c7' }}>Our Purpose</span>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '1.25rem' }}>Democratizing Access to Global Opportunity</h2>
              <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '1rem', fontSize: '1.05rem' }}>
                Traditional job boards are littered with outdated listings, vague salary disclosures, and endless unanswered applications.
              </p>
              <p style={{ color: '#475569', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
                JobSphere redefines recruitment by putting transparency first: 100% upfront salary bounds, verified employer identities, and automated tracking so candidates always know where their application stands.
              </p>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <h3 style={{ fontSize: '2rem', color: '#4f46e5', fontWeight: 800 }}>850+</h3>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>Hiring Partners</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '2rem', color: '#0ea5e9', fontWeight: 800 }}>40+</h3>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>Countries</p>
                </div>
                <div>
                  <h3 style={{ fontSize: '2rem', color: '#10b981', fontWeight: 800 }}>98%</h3>
                  <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>Positive Response Rate</p>
                </div>
              </div>
            </div>

            <div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80"
                alt="Our Collaborative Team"
                style={{ borderRadius: '20px', boxShadow: 'var(--shadow-xl)', width: '100%', objectFit: 'cover', maxHeight: '420px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">What Guides Us</span>
            <h2 className="section-title">Our Guiding Values</h2>
            <p className="section-subtitle">
              The principles that guide every feature we build and every connection we facilitate.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                <Sparkles size={26} />
              </div>
              <h3 className="feature-title">Candidate Empowerment</h3>
              <p className="feature-desc">
                We believe job seekers deserve complete transparency, clear salary data, and respectful communication at every turn.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}>
                <ShieldCheck size={26} />
              </div>
              <h3 className="feature-title">Uncompromising Quality</h3>
              <p className="feature-desc">
                We rigorously vet companies and job listings to protect users from spam, ghost postings, and deceptive recruitment.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                <Zap size={26} />
              </div>
              <h3 className="feature-title">Speed & Precision</h3>
              <p className="feature-desc">
                Modern tools shouldn't get in your way. Our fast search, 1-click apply, and instant status updates respect your valuable time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="section-padding" style={{ background: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">The People Behind JobSphere</span>
            <h2 className="section-title">Leadership & Founders</h2>
            <p className="section-subtitle">
              Meet the passionate team dedicated to building the future of work.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
            {teamMembers.map((member, idx) => (
              <div key={idx} className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
                <img
                  src={member.image}
                  alt={member.name}
                  style={{ width: '110px', height: '110px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1.25rem auto', boxShadow: 'var(--shadow-md)' }}
                />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{member.name}</h3>
                <div style={{ color: '#4f46e5', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                  {member.role}
                </div>
                <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6', margin: 0 }}>
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container">
          <div className="cta-section">
            <h2 className="cta-title">Join Our Thriving Community</h2>
            <p className="cta-desc">
              Discover opportunities that align with your passions, values, and compensation goals today.
            </p>
            <Link to="/jobs">
              <Button variant="primary" size="lg" style={{ background: '#ffffff', color: '#4f46e5', fontWeight: 700 }}>
                Explore Available Roles &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
