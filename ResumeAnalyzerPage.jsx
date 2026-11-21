import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Brain,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  Lightbulb,
  Target,
  TrendingUp,
  Award,
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Briefcase,
  Code2,
  Wrench,
  Trash2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { resumeAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

// ─── SCORE COLOR HELPER ──────────────────────────────────────────────────────
const getScoreColor = (score) => {
  if (score >= 80) return '#10b981'; // green
  if (score >= 60) return '#f59e0b'; // amber
  if (score >= 40) return '#f97316'; // orange
  return '#ef4444';                  // red
};

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Needs Work';
  return 'Poor';
};

// ─── REUSABLE SECTION CARD ───────────────────────────────────────────────────
const SectionCard = ({ title, icon: Icon, children, color = '#4f46e5', defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '14px', overflow: 'hidden', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', borderBottom: open ? '1px solid #f1f5f9' : 'none' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={17} />
          </div>
          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>{title}</span>
        </div>
        {open ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
      </button>
      {open && <div style={{ padding: '1rem 1.25rem' }}>{children}</div>}
    </div>
  );
};

// ─── TAG PILL ────────────────────────────────────────────────────────────────
const Tag = ({ text, color = '#4f46e5', bg = '#eef2ff' }) => (
  <span style={{ display: 'inline-block', padding: '0.3rem 0.75rem', borderRadius: '999px', background: bg, color, fontSize: '0.82rem', fontWeight: 600, margin: '0.2rem' }}>
    {text}
  </span>
);

// ─── BULLET LIST ─────────────────────────────────────────────────────────────
const BulletList = ({ items, icon: Icon, iconColor }) => (
  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    {items.map((item, i) => (
      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.5 }}>
        <Icon size={15} color={iconColor} style={{ marginTop: '3px', flexShrink: 0 }} />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
const ResumeAnalyzerPage = () => {
  const { showToast } = useToast();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // ─── FILE SELECTION ────────────────────────────────────────────────────────
  const handleFileSelect = (file) => {
    if (!file) return;

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const ext = '.' + file.name.split('.').pop().toLowerCase();

    if (!validTypes.includes(file.type) && !validExtensions.includes(ext)) {
      showToast('Please upload a PDF or DOCX file only.', 'error', 'Invalid File Type');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('File must be smaller than 5MB.', 'error', 'File Too Large');
      return;
    }

    setSelectedFile(file);
    setResult(null);
    setError(null);
  };

  const handleInputChange = (e) => handleFileSelect(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  // ─── ANALYZE ──────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!selectedFile) {
      showToast('Please select a resume file first.', 'warning', 'No File Selected');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setAnalysisProgress(0);

    // Fake progress bar while AI processes
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) { clearInterval(progressInterval); return 90; }
        return prev + Math.random() * 12;
      });
    }, 600);

    try {
      const response = await resumeAPI.analyzeResume(selectedFile);
      clearInterval(progressInterval);
      setAnalysisProgress(100);

      if (response.data.success) {
        setResult(response.data.data);
        showToast('Resume analyzed successfully! 🎉', 'success', 'Analysis Complete');
      } else {
        throw new Error(response.data.message || 'Analysis failed.');
      }
    } catch (err) {
      clearInterval(progressInterval);
      setAnalysisProgress(0);

      const msg = err.response?.data?.message || err.message || 'Analysis failed. Please try again.';
      const isConfigError = err.response?.data?.configError;

      setError({ message: msg, isConfigError });
      showToast(msg, 'error', 'Analysis Failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    setAnalysisProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div>
      {/* ── Page Header ── */}
      <section className="jobs-page-header">
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag" style={{ background: '#ede9fe', color: '#7c3aed' }}>
            <Brain size={15} /> Powered by Google Gemini AI
          </span>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: 'white' }}>
            AI Resume Analyzer
          </h1>
          <p style={{ color: '#cbd5e1', maxWidth: 620, margin: '0 auto' }}>
            Upload your resume and get an instant AI-powered analysis — score, skills, strengths, weaknesses, and ATS improvement tips.
          </p>
        </div>
      </section>

      <div className="container section-padding" style={{ maxWidth: 920, margin: '0 auto' }}>

        {/* ── Upload Card ── */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '2rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.25rem', color: '#0f172a' }}>
            📄 Upload Your Resume
          </h2>

          {/* Drag & Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? '#4f46e5' : selectedFile ? '#10b981' : '#cbd5e1'}`,
              borderRadius: 12,
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging ? '#eef2ff' : selectedFile ? '#f0fdf4' : '#f8fafc',
              transition: 'all 0.2s',
              marginBottom: '1.25rem'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleInputChange}
            />
            {selectedFile ? (
              <div>
                <FileText size={44} color="#10b981" style={{ marginBottom: '0.75rem' }} />
                <div style={{ fontWeight: 700, color: '#15803d', fontSize: '1rem', marginBottom: '0.25rem' }}>
                  {selectedFile.name}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {(selectedFile.size / 1024).toFixed(0)} KB • Click to replace
                </div>
              </div>
            ) : (
              <div>
                <Upload size={44} color="#94a3b8" style={{ marginBottom: '0.75rem' }} />
                <div style={{ fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
                  Drag & drop your resume here
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  or <span style={{ color: '#4f46e5', fontWeight: 700 }}>click to browse</span> • PDF, DOC, DOCX • Max 5MB
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {isAnalyzing && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#64748b', marginBottom: '0.4rem' }}>
                <span>🧠 AI is analyzing your resume...</span>
                <span>{Math.round(analysisProgress)}%</span>
              </div>
              <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${analysisProgress}%`, background: 'linear-gradient(90deg, #4f46e5, #7c3aed)', borderRadius: 999, transition: 'width 0.5s ease' }} />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || isAnalyzing}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: (!selectedFile || isAnalyzing) ? 0.6 : 1 }}
            >
              <Sparkles size={17} />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
            </button>

            {(selectedFile || result) && (
              <button onClick={handleReset} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={16} />
                Reset
              </button>
            )}
          </div>

          {/* Supported formats note */}
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '1rem', marginBottom: 0 }}>
            ✅ Supported: PDF, DOC, DOCX &nbsp;|&nbsp; 🔒 Your resume is never stored on our servers &nbsp;|&nbsp; ⚡ Results in ~15 seconds
          </p>
        </div>

        {/* ── Error State ── */}
        {error && (
          <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 12, padding: '1.25rem 1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <XCircle size={22} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 700, color: '#be123c', marginBottom: '0.25rem' }}>Analysis Failed</div>
              <div style={{ fontSize: '0.9rem', color: '#9f1239' }}>{error.message}</div>
              {error.isConfigError && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fef2f2', borderRadius: 8, fontSize: '0.85rem', color: '#7f1d1d' }}>
                  <strong>⚙️ Setup Required:</strong> Add your <code>GEMINI_API_KEY</code> to <code>backend/.env</code><br />
                  Get a free key at: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#4f46e5' }}>aistudio.google.com/app/apikey</a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {result && (
          <div>

            {/* Score Card */}
            <div style={{ background: `linear-gradient(135deg, ${getScoreColor(result.score)}18, ${getScoreColor(result.score)}05)`, border: `2px solid ${getScoreColor(result.score)}40`, borderRadius: 16, padding: '1.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              {/* Circular Score */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ width: 110, height: 110, borderRadius: '50%', border: `8px solid ${getScoreColor(result.score)}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: getScoreColor(result.score) }}>{result.score}</span>
                  <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>/100</span>
                </div>
                <div style={{ marginTop: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: getScoreColor(result.score) }}>
                  {getScoreLabel(result.score)}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: '#0f172a' }}>Resume Analysis Complete</h2>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.88rem', color: '#475569' }}>
                  {result.candidate?.name && <span><User size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{result.candidate.name}</span>}
                  {result.candidate?.email && <span><Mail size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{result.candidate.email}</span>}
                  {result.candidate?.phone && <span><Phone size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{result.candidate.phone}</span>}
                  {result.candidate?.location && <span><MapPin size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{result.candidate.location}</span>}
                </div>
                {result.summary && (
                  <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, fontStyle: 'italic' }}>
                    "{result.summary}"
                  </p>
                )}
              </div>
            </div>

            {/* Skills */}
            {((result.technicalSkills?.length > 0) || (result.programmingLanguages?.length > 0) || (result.toolsAndTechnologies?.length > 0)) && (
              <SectionCard title="Skills & Technologies" icon={Code2} color="#4f46e5">
                {result.technicalSkills?.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Technical Skills</div>
                    <div>{result.technicalSkills.map((s, i) => <Tag key={i} text={s} />)}</div>
                  </div>
                )}
                {result.programmingLanguages?.length > 0 && (
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Programming Languages</div>
                    <div>{result.programmingLanguages.map((s, i) => <Tag key={i} text={s} color="#7c3aed" bg="#f3e8ff" />)}</div>
                  </div>
                )}
                {result.toolsAndTechnologies?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Tools & Technologies</div>
                    <div>{result.toolsAndTechnologies.map((s, i) => <Tag key={i} text={s} color="#0284c7" bg="#e0f2fe" />)}</div>
                  </div>
                )}
                {result.softSkills?.length > 0 && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>Soft Skills</div>
                    <div>{result.softSkills.map((s, i) => <Tag key={i} text={s} color="#059669" bg="#ecfdf5" />)}</div>
                  </div>
                )}
              </SectionCard>
            )}

            {/* Strengths & Weaknesses — side by side */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              {result.strengths?.length > 0 && (
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <CheckCircle2 size={18} color="#16a34a" />
                    <span style={{ fontWeight: 700, color: '#15803d' }}>Strengths</span>
                  </div>
                  <BulletList items={result.strengths} icon={CheckCircle2} iconColor="#16a34a" />
                </div>
              )}
              {result.weaknesses?.length > 0 && (
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 14, padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                    <AlertTriangle size={18} color="#d97706" />
                    <span style={{ fontWeight: 700, color: '#b45309' }}>Weaknesses</span>
                  </div>
                  <BulletList items={result.weaknesses} icon={AlertTriangle} iconColor="#d97706" />
                </div>
              )}
            </div>

            {/* Missing Skills */}
            {result.missingSkills?.length > 0 && (
              <SectionCard title="Missing / Recommended Skills" icon={Target} color="#ef4444" defaultOpen={true}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>Add these skills to your resume to improve your ATS score:</p>
                <div>{result.missingSkills.map((s, i) => <Tag key={i} text={`+ ${s}`} color="#dc2626" bg="#fef2f2" />)}</div>
              </SectionCard>
            )}

            {/* ATS Suggestions */}
            {result.atsSuggestions?.length > 0 && (
              <SectionCard title="ATS Optimization Tips" icon={TrendingUp} color="#0284c7">
                <BulletList items={result.atsSuggestions} icon={Lightbulb} iconColor="#0284c7" />
              </SectionCard>
            )}

            {/* Education */}
            {result.education?.length > 0 && (
              <SectionCard title="Education" icon={BookOpen} color="#7c3aed" defaultOpen={false}>
                {result.education.map((edu, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: '#faf5ff', borderRadius: 10, marginBottom: '0.6rem' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{edu.degree}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem' }}>{edu.institution} {edu.year && `• ${edu.year}`}</div>
                  </div>
                ))}
              </SectionCard>
            )}

            {/* Experience */}
            {result.experience?.length > 0 && (
              <SectionCard title="Work Experience" icon={Briefcase} color="#059669" defaultOpen={false}>
                {result.experience.map((exp, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: 10, marginBottom: '0.6rem' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{exp.title}</div>
                    <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.25rem' }}>{exp.company} {exp.duration && `• ${exp.duration}`}</div>
                    {exp.description && <div style={{ fontSize: '0.85rem', color: '#475569' }}>{exp.description}</div>}
                  </div>
                ))}
              </SectionCard>
            )}

            {/* Projects */}
            {result.projects?.length > 0 && (
              <SectionCard title="Projects" icon={Wrench} color="#d97706" defaultOpen={false}>
                {result.projects.map((proj, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: '#fffbeb', borderRadius: 10, marginBottom: '0.6rem' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.95rem' }}>{proj.name}</div>
                    {proj.tech && <div style={{ marginTop: '0.2rem' }}>{proj.tech.split(',').map((t, j) => <Tag key={j} text={t.trim()} color="#b45309" bg="#fef3c7" />)}</div>}
                    {proj.description && <div style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.35rem' }}>{proj.description}</div>}
                  </div>
                ))}
              </SectionCard>
            )}

            {/* Certifications */}
            {result.certifications?.length > 0 && (
              <SectionCard title="Certifications" icon={Award} color="#4f46e5" defaultOpen={false}>
                <div>{result.certifications.map((c, i) => <Tag key={i} text={c} />)}</div>
              </SectionCard>
            )}

            {/* Section-Specific Suggestions */}
            {result.suggestions && (
              <SectionCard title="Section-Specific Suggestions" icon={Lightbulb} color="#7c3aed">
                {Object.entries(result.suggestions).map(([key, value]) => (
                  value && (
                    <div key={key} style={{ padding: '0.75rem 1rem', background: '#faf5ff', borderRadius: 10, marginBottom: '0.6rem', borderLeft: '3px solid #7c3aed' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)} Section
                      </div>
                      <div style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>{value}</div>
                    </div>
                  )
                ))}
              </SectionCard>
            )}

            {/* Improvement Report */}
            {result.improvementReport && (
              <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: 14, padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                  <Star size={20} color="#fbbf24" fill="#fbbf24" />
                  <span style={{ fontWeight: 700, color: 'white', fontSize: '1rem' }}>AI Improvement Report</span>
                </div>
                <p style={{ color: '#e0e7ff', fontSize: '0.9rem', lineHeight: 1.7, margin: 0 }}>
                  {result.improvementReport}
                </p>
              </div>
            )}

            {/* Analyze Another */}
            <div style={{ textAlign: 'center', paddingBottom: '2rem' }}>
              <button onClick={handleReset} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={16} />
                Analyze Another Resume
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;
