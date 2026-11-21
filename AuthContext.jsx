import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

// ─── DEMO USERS (used when backend is offline or for 1-click demo) ───────────
const DEFAULT_DEMO_USER = {
  id: "usr-demo-01",
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  role: "candidate",
  headline: "Senior Frontend Engineer & UI Architect",
  location: "San Francisco, CA",
  phone: "+1 (555) 382-9104",
  bio: "Passionate Senior Frontend Engineer with 6+ years building performant React applications, scalable component libraries, and engaging web experiences. Enthusiastic about TypeScript, accessible UX, and web performance.",
  website: "https://alexmorgan.dev",
  github: "https://github.com/alexmorgan",
  linkedin: "https://linkedin.com/in/alexmorgan-dev",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  skills: [
    "React.js", "TypeScript", "JavaScript (ES6+)", "Next.js",
    "Tailwind CSS", "GraphQL", "REST APIs", "Redux Toolkit",
    "Jest & Playwright", "Git & CI/CD", "Web Accessibility (a11y)", "Performance Optimization"
  ],
  experience: [
    {
      id: "exp-1",
      title: "Senior Frontend Engineer",
      company: "MetaScale Systems",
      location: "San Francisco, CA (Hybrid)",
      period: "2023 - Present",
      description: "Spearheaded design system unification across 8 enterprise web applications. Reduced overall bundle size by 35% and improved LCP scores by 40% using code splitting and lazy asset loading."
    },
    {
      id: "exp-2",
      title: "Frontend Developer",
      company: "PixelCraft Digital Studio",
      location: "Austin, TX (Remote)",
      period: "2020 - 2023",
      description: "Delivered 20+ responsive web applications for Series A-C tech startups. Built reusable accessible React UI component libraries with 95%+ unit test coverage."
    },
    {
      id: "exp-3",
      title: "Junior Web Developer",
      company: "VentureTech Labs",
      location: "Austin, TX",
      period: "2019 - 2020",
      description: "Collaborated with backend engineers to integrate RESTful endpoints, fixed cross-browser UI glitches, and converted Figma mockups into pixel-perfect web pages."
    }
  ],
  education: [
    {
      id: "edu-1",
      degree: "B.S. in Computer Science",
      school: "University of California, Berkeley",
      period: "2015 - 2019",
      gpa: "3.85 / 4.0",
      details: "Focus on Human-Computer Interaction, Algorithms, and Distributed Systems."
    }
  ],
  resume: {
    fileName: "Alex_Morgan_Senior_Frontend_Resume_2026.pdf",
    uploadedDate: "Aug 18, 2026",
    fileSize: "245 KB"
  }
};

// Helper: map backend user object → frontend user shape
const mapBackendUser = (backendUser, extraFields = {}) => ({
  id: String(backendUser.id),
  name: backendUser.name,
  email: backendUser.email,
  // backend uses 'job_seeker'/'employer', frontend uses 'candidate'/'employer'
  role: backendUser.role === 'job_seeker' ? 'candidate' : backendUser.role,
  phone: backendUser.phone || '',
  avatar: backendUser.profile_image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
  headline: backendUser.headline || (backendUser.role === 'employer' ? 'Employer / Recruiter' : 'Aspiring Professional'),
  location: backendUser.location || '',
  bio: backendUser.bio || '',
  website: backendUser.website || '',
  github: backendUser.github || '',
  linkedin: backendUser.linkedin || '',
  skills: backendUser.skills || [],
  experience: backendUser.experience || [],
  education: backendUser.education || [],
  resume: backendUser.resume || null,
  isRealUser: true,
  ...extraFields
});

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();

  // Load user from localStorage on startup
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('jobsphere_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.error("Failed to load user from localStorage", e);
    }
    return DEFAULT_DEMO_USER;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Persist user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('jobsphere_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('jobsphere_user');
    }
  }, [user]);

  // Calculate profile completeness score (0-100%)
  const calculateCompleteness = (u) => {
    if (!u) return 0;
    let score = 0;
    if (u.name && u.email) score += 20;
    if (u.headline && u.bio) score += 20;
    if (u.skills && u.skills.length >= 3) score += 20;
    if (u.experience && u.experience.length >= 1) score += 20;
    if (u.education && u.education.length >= 1) score += 10;
    if (u.resume?.fileName) score += 10;
    return score;
  };

  // ─── LOGIN (Real backend API) ──────────────────────────────────────────────
  const login = async (email, password, role = 'candidate') => {
    setIsLoading(true);
    try {
      const response = await authAPI.login(email, password);
      const { token, user: backendUser } = response.data;

      // Save JWT token
      localStorage.setItem('jobsphere_token', token);

      // Map backend user to frontend shape
      const frontendUser = mapBackendUser(backendUser);
      setUser(frontendUser);

      showToast(`Welcome back, ${frontendUser.name}!`, 'success', 'Logged In Successfully');
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      showToast(msg, 'error', 'Login Failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── DEMO LOGIN (no backend needed) ───────────────────────────────────────
  const loginWithDemo = (demoType = 'candidate') => {
    // Clear any real token
    localStorage.removeItem('jobsphere_token');

    if (demoType === 'employer') {
      const employerUser = {
        id: "usr-employer-01",
        name: "Sarah Jenkins",
        email: "sarah.jenkins@techcorp.example.com",
        role: "employer",
        headline: "VP of People & Talent Acquisition @ TechCorp",
        location: "San Francisco, CA",
        phone: "+1 (555) 892-1200",
        bio: "Leading talent acquisition and engineering recruitment at TechCorp Global. Looking for visionary engineers and product creators.",
        website: "https://techcorp-global.example.com",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
        companyName: "TechCorp Global",
        skills: ["Technical Recruitment", "Executive Hiring", "Talent Strategy"],
        experience: [],
        education: []
      };
      setUser(employerUser);
      showToast("Logged in as Demo Recruiter / Employer", 'success', 'Demo Session Started');
    } else {
      setUser(DEFAULT_DEMO_USER);
      showToast("Logged in as Demo Job Seeker (Alex Morgan)", 'success', 'Demo Session Started');
    }
  };

  // ─── REGISTER (Real backend API) ──────────────────────────────────────────
  const register = async (userData) => {
    setIsLoading(true);
    try {
      // Map frontend role 'candidate' → backend role 'job_seeker'
      const backendRole = userData.role === 'candidate' ? 'job_seeker' : (userData.role || 'job_seeker');

      const response = await authAPI.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: backendRole,
        phone: userData.phone || ''
      });

      const { token, user: backendUser } = response.data;

      // Save JWT token
      localStorage.setItem('jobsphere_token', token);

      // Map backend user to frontend shape
      const frontendUser = mapBackendUser(backendUser);
      setUser(frontendUser);

      showToast(`Account created for ${frontendUser.name}! Welcome to JobSphere 🎉`, 'success', 'Welcome!');
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      showToast(msg, 'error', 'Registration Failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ─── LOGOUT ───────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('jobsphere_token');
    setUser(null);
    showToast("You have been logged out safely.", 'info', 'Logged Out');
  };

  // ─── PROFILE UPDATE (local state — no dedicated backend endpoint yet) ──────
  const updateProfile = (updatedFields) => {
    if (!user) return;
    setUser((prev) => ({ ...prev, ...updatedFields }));
    showToast("Your profile details have been saved.", 'success', 'Profile Updated');
  };

  const updateSkills = (newSkills) => {
    if (!user) return;
    setUser((prev) => ({ ...prev, skills: newSkills }));
    showToast("Skills updated successfully.", 'success', 'Skills Saved');
  };

  const addExperience = (expData) => {
    if (!user) return;
    const newExp = { id: "exp-" + Date.now(), ...expData };
    setUser((prev) => ({ ...prev, experience: [newExp, ...(prev.experience || [])] }));
    showToast("Work experience entry added.", 'success', 'Experience Added');
  };

  const deleteExperience = (id) => {
    if (!user) return;
    setUser((prev) => ({ ...prev, experience: (prev.experience || []).filter((e) => e.id !== id) }));
    showToast("Work experience entry removed.", 'info', 'Experience Removed');
  };

  const addEducation = (eduData) => {
    if (!user) return;
    const newEdu = { id: "edu-" + Date.now(), ...eduData };
    setUser((prev) => ({ ...prev, education: [newEdu, ...(prev.education || [])] }));
    showToast("Education entry added.", 'success', 'Education Added');
  };

  const deleteEducation = (id) => {
    if (!user) return;
    setUser((prev) => ({ ...prev, education: (prev.education || []).filter((e) => e.id !== id) }));
    showToast("Education entry removed.", 'info', 'Education Removed');
  };

  const uploadResume = (fileData) => {
    if (!user) return;
    const resumeInfo = {
      fileName: fileData.name || "Resume_Uploaded.pdf",
      uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      fileSize: fileData.size ? `${(fileData.size / 1024).toFixed(0)} KB` : "312 KB"
    };
    setUser((prev) => ({ ...prev, resume: resumeInfo }));
    showToast(`Resume "${resumeInfo.fileName}" uploaded.`, 'success', 'Resume Attached');
  };

  const removeResume = () => {
    if (!user) return;
    setUser((prev) => ({ ...prev, resume: null }));
    showToast("Resume document removed.", 'info', 'Resume Deleted');
  };

  const completeness = calculateCompleteness(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        completeness,
        isLoading,
        login,
        loginWithDemo,
        register,
        logout,
        updateProfile,
        updateSkills,
        addExperience,
        deleteExperience,
        addEducation,
        deleteEducation,
        uploadResume,
        removeResume
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
