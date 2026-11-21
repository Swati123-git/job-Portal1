import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
import { HRProvider } from './context/HRContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import CompaniesPage from './pages/CompaniesPage';
import CompanyDetailsPage from './pages/CompanyDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

import EmployeePortalPage from './pages/EmployeePortalPage';
import ResumeAnalyzerPage from './pages/ResumeAnalyzerPage';
import JobRecommendationsPage from './pages/JobRecommendationsPage';

// HR Pages
import HRRegisterPage from './pages/hr/HRRegisterPage';
import HRLoginPage from './pages/hr/HRLoginPage';
import HRDashboard from './pages/hr/HRDashboard';
import HRCandidatesPage from './pages/hr/HRCandidatesPage';
import HRSchedulePage from './pages/hr/HRSchedulePage';

// Styles
import './styles/index.css';
import './styles/components.css';
import './styles/pages.css';

// Scroll to top upon route transition
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <JobProvider>
          <HRProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="app-container">
                <Navbar />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/jobs" element={<JobsPage />} />
                    <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
                    <Route path="/companies" element={<CompaniesPage />} />
                    <Route path="/companies/:companyId" element={<CompanyDetailsPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/employee" element={<EmployeePortalPage />} />
                    <Route path="/resume-analyzer" element={<ResumeAnalyzerPage />} />
                    <Route path="/job-recommendations" element={<JobRecommendationsPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />

                    {/* HR Portal Routes */}
                    <Route path="/hr/register" element={<HRRegisterPage />} />
                    <Route path="/hr/login" element={<HRLoginPage />} />
                    <Route path="/hr/dashboard" element={<HRDashboard />} />
                    <Route path="/hr/candidates" element={<HRCandidatesPage />} />
                    <Route path="/hr/schedule" element={<HRSchedulePage />} />

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </BrowserRouter>
          </HRProvider>
        </JobProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
