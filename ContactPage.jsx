import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ChevronDown, ChevronUp, CheckCircle2, Clock } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import Button from '../components/common/Button';

const FAQ_ITEMS = [
  {
    q: 'How does JobSphere ensure job postings are legitimate?',
    a: 'Every company that posts on JobSphere goes through our corporate verification check. We verify domain authenticity, tax registration, and salary disclosure requirements to eliminate ghost or spam listings.'
  },
  {
    q: 'Is JobSphere completely free for job seekers?',
    a: 'Yes! JobSphere is 100% free for candidates. You can search, bookmark, track applications, and receive direct recruiter interview requests without paying any fees or subscription costs.'
  },
  {
    q: 'How do I know the status of my job application?',
    a: 'You can check your live application status anytime on your Applicant Dashboard. When an employer reviews your resume or invites you to an interview, your status pipeline updates immediately.'
  },
  {
    q: 'Can employers contact me directly through my profile?',
    a: 'Yes. Once you complete your profile with skills and resume, verified employers can discover your credentials and send direct interview invitations to your registered email.'
  }
];

const ContactPage = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'Job Seeker Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Thank you! Your message has been sent to our support team.', 'success', 'Message Received');
      setFormData({ name: '', email: '', subject: '', category: 'Job Seeker Inquiry', message: '' });
    }, 600);
  };

  return (
    <div>
      {/* Header */}
      <section className="jobs-page-header">
        <div className="container">
          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
            <span className="section-tag" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <MessageSquare size={14} /> Get in Touch
            </span>
            <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>We're Here to Help</h1>
            <p style={{ color: '#64748b' }}>
              Have questions, feedback, or need recruitment assistance? Our dedicated support team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Grid */}
      <div className="container section-padding" style={{ paddingTop: '3rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
          {/* Contact Form */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Send Us a Message</h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alex Morgan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="e.g. alex@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Topic / Department</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option>Job Seeker Inquiry</option>
                  <option>Employer & Hiring Support</option>
                  <option>Bug Report / Technical Issue</option>
                  <option>Partnership & Press</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Brief summary of your inquiry"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea
                  className="form-textarea"
                  rows="4"
                  placeholder="Tell us how we can help you..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                icon={Send}
                iconPosition="right"
                style={{ width: '100%', marginTop: '1rem' }}
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Details & Info */}
          <div>
            <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Direct Contact</h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="overview-icon-box" style={{ background: '#eef2ff', color: '#4f46e5' }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Email Support</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>support@jobsphere.example.com</p>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>careers@jobsphere.example.com</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="overview-icon-box" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Phone & Hotline</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>+1 (800) 555-SPHERE</p>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Mon-Fri, 9am - 6pm PST</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="overview-icon-box" style={{ background: '#ecfdf5', color: '#10b981' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Global Headquarters</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                      500 Howard Street, Suite 400<br />
                      San Francisco, CA 94105, USA
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div className="overview-icon-box" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>Response Times</h4>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                      Typically responds in under 2 hours during business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="section-header" style={{ marginBottom: '2.5rem' }}>
            <span className="section-tag">Frequently Asked Questions</span>
            <h2 className="section-title">Common Questions</h2>
            <p className="section-subtitle">
              Quick answers about accounts, job applications, and verification on JobSphere.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;

              return (
                <div
                  key={idx}
                  className="card"
                  style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', borderColor: isOpen ? '#4f46e5' : '#e2e8f0' }}
                  onClick={() => toggleFaq(idx)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: isOpen ? '#4f46e5' : '#0f172a' }}>
                      {item.q}
                    </h4>
                    <button style={{ background: 'none', border: 'none', color: isOpen ? '#4f46e5' : '#94a3b8', cursor: 'pointer' }}>
                      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>

                  {isOpen && (
                    <p style={{ marginTop: '1rem', marginBottom: 0, fontSize: '0.95rem', color: '#475569', lineHeight: '1.65' }}>
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
