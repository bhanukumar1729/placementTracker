import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import JobList from './pages/JobList';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import PostJob from './pages/PostJob';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Navigate to="/jobs" replace />} />
              <Route path="/jobs" element={<JobList />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student Protected Routes */}
              <Route
                path="/student/applications"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Company Protected Routes */}
              <Route
                path="/company/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <CompanyDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/company/post-job"
                element={
                  <ProtectedRoute allowedRoles={['company']}>
                    <PostJob />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/jobs" replace />} />
            </Routes>
          </main>
          <footer className="app-footer">
            <div className="footer-container">
              <div className="footer-top">
                <div className="footer-brand">
                  <div className="footer-logo">
                    <span className="footer-logo-title">NexusCareers</span>
                  </div>
                  <p className="footer-tagline">
                    Enterprise campus placement platform connecting qualified candidate engineers with forward-thinking technology companies.
                  </p>
                </div>
                <div className="footer-links-group">
                  <div className="footer-links-col">
                    <span className="footer-heading">Platform</span>
                    <Link to="/jobs">Explore Roles</Link>
                    <Link to="/login">Student Portal</Link>
                    <Link to="/login">Recruiter Suite</Link>
                  </div>
                  <div className="footer-links-col">
                    <span className="footer-heading">Ecosystem</span>
                    <a href="#placement-cell" onClick={(e) => e.preventDefault()}>Campus Placement Cell</a>
                    <a href="#partner-network" onClick={(e) => e.preventDefault()}>Employer Network</a>
                    <a href="#hiring-guidelines" onClick={(e) => e.preventDefault()}>Hiring Guidelines</a>
                  </div>
                  <div className="footer-links-col">
                    <span className="footer-heading">Security & Trust</span>
                    <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                    <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
                    <a href="#security" onClick={(e) => e.preventDefault()}>Placement Protection</a>
                  </div>
                </div>
              </div>
              <div className="footer-bottom">
                <span>&copy; {new Date().getFullYear()} NexusCareers Enterprise. Verified campus recruitment network.</span>
                <div className="system-health-pill">
                  <span className="pulse-dot" />
                  <span>All Systems Operational</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
