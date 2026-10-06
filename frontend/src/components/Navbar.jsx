import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  GraduationCap,
  Building2,
  FileText,
  PlusCircle,
  LogOut,
  LogIn,
  UserCheck,
  Search,
} from 'lucide-react';

export default function Navbar() {
  const { user, role, logout, isStudent, isCompany } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <div className="logo-icon-wrapper">
            <GraduationCap className="logo-icon" size={24} />
          </div>
          <div className="logo-text">
            <span className="brand-title">NexusCareers</span>
            <span className="brand-subtitle">Campus Talent & Hiring Hub</span>
          </div>
        </Link>

        <nav className="nav-links">
          <Link to="/jobs" className="nav-item">
            <Search size={16} />
            <span>Find Jobs</span>
          </Link>

          {isStudent && (
            <>
              <Link to="/student/applications" className="nav-item">
                <FileText size={16} />
                <span>My Applications</span>
              </Link>
              <Link to="/student/profile" className="nav-item">
                <UserCheck size={16} />
                <span>Profile</span>
              </Link>
            </>
          )}

          {isCompany && (
            <>
              <Link to="/company/dashboard" className="nav-item">
                <Building2 size={16} />
                <span>Company Dashboard</span>
              </Link>
              <Link to="/company/post-job" className="nav-item nav-btn-primary">
                <PlusCircle size={16} />
                <span>Post Job</span>
              </Link>
            </>
          )}
        </nav>

        <div className="navbar-auth">
          {user ? (
            <div className="user-menu">
              <div className="user-badge">
                <span className="user-name">{user.name}</span>
                <span className={`role-pill role-${role}`}>
                  {role === 'student' ? 'Student' : 'Company'}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-logout"
                title="Log Out"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-secondary">
                <LogIn size={15} />
                <span>Login</span>
              </Link>
              <Link to="/register" className="btn-primary">
                <span>Register</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
