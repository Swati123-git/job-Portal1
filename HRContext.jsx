// HR Context - manages HR state: registered HRs, shortlisted candidates, interview scheduling
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const HRContext = createContext(null);

// Mock shortlisted candidates from existing applications
const DEFAULT_SHORTLISTED = [
  {
    id: "cand-1",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 382-9104",
    jobTitle: "Senior Full Stack React & Node Engineer",
    jobId: "job-1",
    company: "TechCorp Global",
    companyId: "techcorp",
    appliedDate: "2026-08-21",
    resumeFile: "Alex_Morgan_Senior_Frontend_Resume_2026.pdf",
    skills: ["React", "TypeScript", "Node.js", "GraphQL", "PostgreSQL"],
    experience: "6 years",
    location: "San Francisco, CA",
    currentStatus: "Shortlisted",
    interviewStatus: "Pending",
    rating: null,
    notes: "",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    coverLetter: "Excited to contribute to TechCorp's high-scale cloud dashboard using modern React 19 architecture..."
  },
  {
    id: "cand-2",
    name: "David Okafor",
    email: "david.okafor@example.com",
    phone: "+1 (555) 291-4400",
    jobTitle: "AI Research & Machine Learning Engineer",
    jobId: "job-3",
    company: "QuantumAI Labs",
    companyId: "quantum-ai",
    appliedDate: "2026-08-19",
    resumeFile: "David_Okafor_ML_Engineer_Resume_2026.pdf",
    skills: ["PyTorch", "Python", "LLMs", "DeepSpeed", "Machine Learning"],
    experience: "5 years",
    location: "New York, NY",
    currentStatus: "Shortlisted",
    interviewStatus: "Pending",
    rating: null,
    notes: "",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    coverLetter: "Longtime admirer of QuantumAI's research into multimodal reasoning architectures..."
  },
  {
    id: "cand-3",
    name: "Sophia Chen",
    email: "sophia.chen@example.com",
    phone: "+1 (555) 871-2200",
    jobTitle: "Lead UI/UX Product Designer",
    jobId: "job-2",
    company: "Apex Interactive Studio",
    companyId: "apex-design",
    appliedDate: "2026-08-22",
    resumeFile: "Sophia_Chen_Designer_Portfolio_2026.pdf",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping", "WCAG"],
    experience: "7 years",
    location: "Berlin, Germany",
    currentStatus: "Shortlisted",
    interviewStatus: "Scheduled",
    rating: 4,
    notes: "Strong portfolio, great communication during pre-screening.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    coverLetter: "I have been leading design teams at high-growth startups for 7 years..."
  },
  {
    id: "cand-4",
    name: "Marcus Vance",
    email: "marcus.vance@example.com",
    phone: "+1 (555) 100-3344",
    jobTitle: "Cloud Infrastructure & DevOps Engineer",
    jobId: "job-5",
    company: "NovaCloud Security",
    companyId: "novacloud",
    appliedDate: "2026-08-22",
    resumeFile: "Marcus_Vance_DevOps_Resume_2026.pdf",
    skills: ["Kubernetes", "Terraform", "AWS", "Docker", "CI/CD", "Prometheus"],
    experience: "4 years",
    location: "Seattle, WA",
    currentStatus: "Shortlisted",
    interviewStatus: "Completed",
    rating: 5,
    notes: "Excellent technical depth, highly recommended for next round.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    coverLetter: "I specialize in multi-region Kubernetes cluster management..."
  },
  {
    id: "cand-5",
    name: "Elena Rostova",
    email: "elena.rostova@example.com",
    phone: "+1 (555) 992-7780",
    jobTitle: "Senior Product Manager - Payments",
    jobId: "job-4",
    company: "StripeFlow Fintech",
    companyId: "stripeflow",
    appliedDate: "2026-08-18",
    resumeFile: "Elena_Rostova_PM_Resume_2026.pdf",
    skills: ["Product Strategy", "Fintech", "SQL", "Agile/Scrum", "Data Analytics"],
    experience: "8 years",
    location: "London, UK",
    currentStatus: "Shortlisted",
    interviewStatus: "Pending",
    rating: null,
    notes: "",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
    coverLetter: "I have been leading payments product lines for 8 years at major fintechs..."
  },
  {
    id: "cand-6",
    name: "James Thornton",
    email: "james.thornton@example.com",
    phone: "+1 (555) 334-8872",
    jobTitle: "Mobile App Developer (React Native / iOS)",
    jobId: "job-11",
    company: "StripeFlow Fintech",
    companyId: "stripeflow",
    appliedDate: "2026-08-21",
    resumeFile: "James_Thornton_Mobile_Dev_Resume_2026.pdf",
    skills: ["React Native", "TypeScript", "iOS", "Android", "Expo", "Redux"],
    experience: "3 years",
    location: "San Francisco, CA",
    currentStatus: "Shortlisted",
    interviewStatus: "Pending",
    rating: null,
    notes: "",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
    coverLetter: "I have shipped 5 mobile apps with 100k+ downloads using React Native..."
  }
];

const DEFAULT_INTERVIEWS = [
  {
    id: "int-1",
    candidateId: "cand-3",
    candidateName: "Sophia Chen",
    jobTitle: "Lead UI/UX Product Designer",
    company: "Apex Interactive Studio",
    hrId: "hr-demo-01",
    hrName: "Sarah Jenkins",
    type: "Video Call",
    date: "2026-10-10",
    time: "14:00",
    duration: "60",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    round: "Technical Round",
    status: "Upcoming",
    notes: "Focus on Figma design system architecture and WCAG accessibility experience.",
    feedback: ""
  },
  {
    id: "int-2",
    candidateId: "cand-4",
    candidateName: "Marcus Vance",
    jobTitle: "Cloud Infrastructure & DevOps Engineer",
    company: "NovaCloud Security",
    hrId: "hr-demo-01",
    hrName: "Sarah Jenkins",
    type: "In-Person",
    date: "2026-09-28",
    time: "10:30",
    duration: "45",
    meetingLink: "",
    round: "Final Round",
    status: "Completed",
    notes: "Evaluate system design and Kubernetes scaling expertise.",
    feedback: "Outstanding technical knowledge. Highly recommend proceeding with offer."
  }
];

export const HRProvider = ({ children }) => {
  const { showToast } = useToast();

  // HR registered users
  const [hrUsers, setHrUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('jobsphere_hr_users');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: "hr-demo-01",
        name: "Sarah Jenkins",
        email: "sarah.jenkins@techcorp.example.com",
        password: "demo1234",
        company: "TechCorp Global",
        companyId: "techcorp",
        designation: "VP of Talent Acquisition",
        department: "Human Resources",
        phone: "+1 (555) 892-1200",
        experience: "12 years",
        specialization: "Technical Recruitment",
        location: "San Francisco, CA",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
        registeredDate: "2026-08-01",
        bio: "Experienced HR professional specializing in technical recruitment for engineering and product teams."
      }
    ];
  });

  // Currently logged-in HR
  const [currentHR, setCurrentHR] = useState(() => {
    try {
      const saved = localStorage.getItem('jobsphere_hr_current');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Shortlisted candidates
  const [shortlistedCandidates, setShortlistedCandidates] = useState(() => {
    try {
      const saved = localStorage.getItem('jobsphere_shortlisted');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_SHORTLISTED;
  });

  // Scheduled interviews
  const [interviews, setInterviews] = useState(() => {
    try {
      const saved = localStorage.getItem('jobsphere_interviews');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_INTERVIEWS;
  });

  // Persist state
  useEffect(() => { localStorage.setItem('jobsphere_hr_users', JSON.stringify(hrUsers)); }, [hrUsers]);
  useEffect(() => {
    if (currentHR) localStorage.setItem('jobsphere_hr_current', JSON.stringify(currentHR));
    else localStorage.removeItem('jobsphere_hr_current');
  }, [currentHR]);
  useEffect(() => { localStorage.setItem('jobsphere_shortlisted', JSON.stringify(shortlistedCandidates)); }, [shortlistedCandidates]);
  useEffect(() => { localStorage.setItem('jobsphere_interviews', JSON.stringify(interviews)); }, [interviews]);

  // Register HR
  const registerHR = (data) => {
    const exists = hrUsers.find(h => h.email.toLowerCase() === data.email.toLowerCase());
    if (exists) {
      showToast('An HR account with this email already exists.', 'warning', 'Already Registered');
      return false;
    }
    const newHR = {
      id: 'hr-' + Date.now(),
      name: data.name,
      email: data.email,
      password: data.password,
      company: data.company || 'Independent Recruiter',
      companyId: data.companyId || null,
      designation: data.designation || 'HR Manager',
      department: data.department || 'Human Resources',
      phone: data.phone || '',
      experience: data.experience || '0-2 years',
      specialization: data.specialization || 'General HR',
      location: data.location || 'Remote',
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      registeredDate: new Date().toISOString().split('T')[0],
      bio: data.bio || ''
    };
    setHrUsers(prev => [...prev, newHR]);
    setCurrentHR(newHR);
    showToast(`Welcome to JobSphere HR, ${newHR.name}!`, 'success', 'Registration Successful');
    return true;
  };

  // Login HR
  const loginHR = (email, password) => {
    const hr = hrUsers.find(h => h.email.toLowerCase() === email.toLowerCase() && h.password === password);
    if (!hr) {
      showToast('Invalid email or password. Please try again.', 'error', 'Login Failed');
      return false;
    }
    setCurrentHR(hr);
    showToast(`Welcome back, ${hr.name}!`, 'success', 'Logged In');
    return true;
  };

  // Demo Login HR
  const loginHRDemo = () => {
    const demo = hrUsers.find(h => h.id === 'hr-demo-01') || hrUsers[0];
    if (demo) {
      setCurrentHR(demo);
      showToast(`Logged in as Demo HR: ${demo.name}`, 'success', 'Demo Session Started');
    }
  };

  // Logout HR
  const logoutHR = () => {
    setCurrentHR(null);
    showToast('You have been logged out from HR portal.', 'info', 'Logged Out');
  };

  // Update candidate status
  const updateCandidateStatus = (candidateId, updates) => {
    setShortlistedCandidates(prev => prev.map(c =>
      c.id === candidateId ? { ...c, ...updates } : c
    ));
    showToast('Candidate status updated successfully.', 'success', 'Status Updated');
  };

  // Add candidate rating & feedback
  const rateCandidateInterview = (candidateId, rating, notes) => {
    setShortlistedCandidates(prev => prev.map(c =>
      c.id === candidateId ? { ...c, rating, notes } : c
    ));
    showToast('Interview feedback saved.', 'success', 'Feedback Saved');
  };

  // Schedule Interview
  const scheduleInterview = (data) => {
    const candidate = shortlistedCandidates.find(c => c.id === data.candidateId);
    const newInterview = {
      id: 'int-' + Date.now(),
      ...data,
      candidateName: candidate?.name || '',
      jobTitle: candidate?.jobTitle || '',
      company: candidate?.company || '',
      hrId: currentHR?.id || '',
      hrName: currentHR?.name || '',
      status: 'Upcoming',
      feedback: ''
    };
    setInterviews(prev => [newInterview, ...prev]);
    // Update candidate interview status
    setShortlistedCandidates(prev => prev.map(c =>
      c.id === data.candidateId ? { ...c, interviewStatus: 'Scheduled' } : c
    ));
    showToast(`Interview scheduled with ${candidate?.name || 'candidate'}.`, 'success', 'Interview Scheduled 🗓️');
  };

  // Update interview status / add feedback
  const updateInterview = (interviewId, updates) => {
    setInterviews(prev => prev.map(i => i.id === interviewId ? { ...i, ...updates } : i));
    showToast('Interview details updated.', 'success', 'Updated');
  };

  // Cancel interview
  const cancelInterview = (interviewId) => {
    const interview = interviews.find(i => i.id === interviewId);
    setInterviews(prev => prev.filter(i => i.id !== interviewId));
    if (interview) {
      setShortlistedCandidates(prev => prev.map(c =>
        c.id === interview.candidateId ? { ...c, interviewStatus: 'Pending' } : c
      ));
    }
    showToast('Interview cancelled successfully.', 'info', 'Interview Cancelled');
  };

  // Get interviews for current HR
  const getMyInterviews = () => {
    if (!currentHR) return [];
    return interviews.filter(i => i.hrId === currentHR.id);
  };

  return (
    <HRContext.Provider value={{
      hrUsers,
      currentHR,
      shortlistedCandidates,
      interviews,
      registerHR,
      loginHR,
      loginHRDemo,
      logoutHR,
      updateCandidateStatus,
      rateCandidateInterview,
      scheduleInterview,
      updateInterview,
      cancelInterview,
      getMyInterviews
    }}>
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => {
  const context = useContext(HRContext);
  if (!context) throw new Error('useHR must be used within an HRProvider');
  return context;
};
