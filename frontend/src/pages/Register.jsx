import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Building2, UserPlus, AlertCircle } from 'lucide-react';

export default function Register() {
  const [role, setRole] = useState('student'); // 'student' | 'company'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Student form fields
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    password: '',
    branch: 'Computer Science and Engineering',
    cgpa: '',
    skills: '',
    resume_url: '',
  });

  // Company form fields
  const [companyForm, setCompanyForm] = useState({
    name: '',
    email: '',
    password: '',
    description: '',
    website: '',
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...studentForm,
        cgpa: Number(studentForm.cgpa),
        skills: studentForm.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      await register(payload, 'student');
      navigate('/jobs', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(companyForm, 'company');
      navigate('/company/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <h2 className="auth-title">Create an Account</h2>
          <p className="auth-subtitle">Join the Campus Placement & Internship Network</p>
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
            <span>Student Registration</span>
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

        {error && (
          <div className="alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {role === 'student' ? (
          <form onSubmit={handleStudentSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="stu-name">Full Name *</label>
                <input
                  id="stu-name"
                  type="text"
                  required
                  placeholder="e.g. Tanvi Deshmukh"
                  value={studentForm.name}
                  onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="stu-email">College Email *</label>
                <input
                  id="stu-email"
                  type="email"
                  required
                  placeholder="e.g. tanvi@student.edu"
                  value={studentForm.email}
                  onChange={(e) => setStudentForm({ ...studentForm, email: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="stu-password">Password *</label>
                <input
                  id="stu-password"
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={studentForm.password}
                  onChange={(e) => setStudentForm({ ...studentForm, password: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="stu-cgpa">Current CGPA (0 - 10) *</label>
                <input
                  id="stu-cgpa"
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  placeholder="e.g. 8.45"
                  value={studentForm.cgpa}
                  onChange={(e) => setStudentForm({ ...studentForm, cgpa: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="stu-branch">Academic Branch / Department *</label>
              <select
                id="stu-branch"
                value={studentForm.branch}
                onChange={(e) => setStudentForm({ ...studentForm, branch: e.target.value })}
                className="form-input"
              >
                <option value="Computer Science and Engineering">Computer Science and Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Data Science & Artificial Intelligence">Data Science & Artificial Intelligence</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="stu-skills">Skills (Comma-separated)</label>
              <input
                id="stu-skills"
                type="text"
                placeholder="e.g. React, Node.js, Python, MongoDB, Docker"
                value={studentForm.skills}
                onChange={(e) => setStudentForm({ ...studentForm, skills: e.target.value })}
                className="form-input"
              />
              <span className="form-hint">Highlight your core competencies to match opportunities posted by employers</span>
            </div>

            <div className="form-group">
              <label htmlFor="stu-resume">Portfolio / Resume URL</label>
              <input
                id="stu-resume"
                type="url"
                placeholder="https://drive.google.com/... or https://portfolio.dev"
                value={studentForm.resume_url}
                onChange={(e) => setStudentForm({ ...studentForm, resume_url: e.target.value })}
                className="form-input"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-submit">
              <UserPlus size={16} />
              <span>{loading ? 'Registering...' : 'Complete Student Registration'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleCompanySubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="comp-name">Company / Organization Name *</label>
                <input
                  id="comp-name"
                  type="text"
                  required
                  placeholder="e.g. Stripe Technologies"
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="comp-email">Recruiter Corporate Email *</label>
                <input
                  id="comp-email"
                  type="email"
                  required
                  placeholder="e.g. talent@stripe.com"
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="comp-password">Password *</label>
                <input
                  id="comp-password"
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={companyForm.password}
                  onChange={(e) => setCompanyForm({ ...companyForm, password: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label htmlFor="comp-website">Company Website</label>
                <input
                  id="comp-website"
                  type="url"
                  placeholder="https://company.com"
                  value={companyForm.website}
                  onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="comp-desc">Company Description & Mission</label>
              <textarea
                id="comp-desc"
                rows="3"
                placeholder="Brief overview of your company, tech stack, and workplace culture..."
                value={companyForm.description}
                onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                className="form-input form-textarea"
              />
            </div>

            <button type="submit" disabled={loading} className="btn-submit">
              <Building2 size={16} />
              <span>{loading ? 'Registering...' : 'Register Company Account'}</span>
            </button>
          </form>
        )}

        <div className="auth-footer">
          <span>Already registered? </span>
          <Link to="/login" className="auth-link">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}
