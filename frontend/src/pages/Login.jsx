import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Building2, LogIn, Sparkles, AlertCircle } from 'lucide-react';

export default function Login() {
  const [role, setRole] = useState('student'); // 'student' | 'company'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || (role === 'company' ? '/company/dashboard' : '/jobs');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password, role);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (demoEmail, demoRole) => {
    setRole(demoRole);
    setEmail(demoEmail);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Log in to your Placement & Internship account</p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="role-tabs">
          <button
            type="button"
            className={`role-tab ${role === 'student' ? 'active' : ''}`}
            onClick={() => {
              setRole('student');
              setError('');
            }}
          >
            <GraduationCap size={18} />
            <span>Student Portal</span>
          </button>
          <button
            type="button"
            className={`role-tab ${role === 'company' ? 'active' : ''}`}
            onClick={() => {
              setRole('company');
              setError('');
            }}
          >
            <Building2 size={18} />
            <span>Company Recruiter</span>
          </button>
        </div>

        {/* Demo Fast-Login Section */}
        <div className="demo-fill-box">
          <div className="demo-fill-header">
            <Sparkles size={14} className="demo-icon" />
            <span>Instant Test Profiles / 1-Click Demo Access</span>
          </div>
          <div className="demo-chips">
            {role === 'student' ? (
              <>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('aarav@student.edu', 'student')}
                  className="demo-chip"
                >
                  Aarav (CS, CGPA 8.85 - Full Stack)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('priya@student.edu', 'student')}
                  className="demo-chip"
                >
                  Priya (IT, CGPA 9.12 - Python, ML)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('rohan@student.edu', 'student')}
                  className="demo-chip"
                >
                  Rohan (ECE, CGPA 7.60 - Java, Cloud)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('ananya@student.edu', 'student')}
                  className="demo-chip"
                >
                  Ananya (AI/ML, CGPA 9.65 - Deep Learning)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('kabir@student.edu', 'student')}
                  className="demo-chip"
                >
                  Kabir (CyberSec, CGPA 8.40)
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('recruiter@nexuscloud.io', 'company')}
                  className="demo-chip"
                >
                  Nexus Cloud Innovations (Cloud / DevOps)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('careers@finvibe.tech', 'company')}
                  className="demo-chip"
                >
                  FinVibe Technologies (FinTech / Trading)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('talent@datapulse.ai', 'company')}
                  className="demo-chip"
                >
                  DataPulse AI (AI / Computer Vision)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('jobs@cybershield.net', 'company')}
                  className="demo-chip"
                >
                  CyberShield Defense (Cybersecurity)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCredentials('careers@apexrobotics.io', 'company')}
                  className="demo-chip"
                >
                  Apex Robotics (Robotics / Autonomous)
                </button>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              required
              placeholder={role === 'student' ? 'e.g. student@college.edu' : 'e.g. recruiter@company.com'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-submit"
          >
            <LogIn size={16} />
            <span>{loading ? 'Authenticating...' : `Log In as ${role === 'student' ? 'Student' : 'Company'}`}</span>
          </button>
        </form>

        <div className="auth-footer">
          <span>Don't have an account? </span>
          <Link to="/register" className="auth-link">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
