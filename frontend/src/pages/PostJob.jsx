import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import {
  PlusCircle,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';

export default function PostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    type: 'job',
    category: 'Software Engineering',
    required_skills: '',
    min_cgpa: '7.0',
    location: '',
    stipend_or_salary: '',
    deadline: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const skillsArray = formData.required_skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        min_cgpa: Number(formData.min_cgpa),
        required_skills: skillsArray,
      };

      await api.post('/jobs', payload);
      setSuccess('Job opportunity posted successfully!');
      setTimeout(() => {
        navigate('/company/dashboard');
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Link to="/company/dashboard" className="back-link">
        <ArrowLeft size={16} />
        <span>Back to Company Dashboard</span>
      </Link>

      <div className="form-card form-card-wide">
        <div className="form-card-header">
          <div>
            <h1 className="form-card-title">Post a Campus Opportunity</h1>
            <p className="form-card-subtitle">
              Publish an internship or full-time position for student applications
            </p>
          </div>
          <span className="badge-tag">Recruiter Portal</span>
        </div>

        {error && (
          <div className="alert-error">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert-success">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="j-title">Job / Internship Title *</label>
              <input
                id="j-title"
                type="text"
                required
                placeholder="e.g. Associate Cloud Architect"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="j-type">Opportunity Type *</label>
              <select
                id="j-type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="form-input"
              >
                <option value="job">Full-Time Job</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="j-category">Job Category *</label>
              <select
                id="j-category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="form-input"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Data Science & Analytics">Data Science & Analytics</option>
                <option value="Embedded Systems & IoT">Embedded Systems & IoT</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="Robotics & Automation">Robotics & Automation</option>
                <option value="Quantitative Finance">Quantitative Finance</option>
                <option value="Game Development">Game Development</option>
                <option value="UI/UX & Frontend Engineering">UI/UX & Frontend Engineering</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="j-location">Work Location *</label>
              <input
                id="j-location"
                type="text"
                required
                placeholder="e.g. Bangalore, Hyderabad, or Remote"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="form-input"
              />
              <span className="form-hint">Tip: Specify "Remote" for distributed roles, or enter city (e.g. Bangalore, Hyderabad).</span>
            </div>

            <div className="form-group">
              <label htmlFor="j-stipend">Stipend or Salary Compensation *</label>
              <input
                id="j-stipend"
                type="text"
                required
                placeholder="e.g. ₹12,00,000 / annum or ₹40,000 / month"
                value={formData.stipend_or_salary}
                onChange={(e) => setFormData({ ...formData, stipend_or_salary: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="j-cgpa">Minimum CGPA Eligibility (0 - 10) *</label>
              <input
                id="j-cgpa"
                type="number"
                step="0.1"
                min="0"
                max="10"
                required
                placeholder="e.g. 7.5"
                value={formData.min_cgpa}
                onChange={(e) => setFormData({ ...formData, min_cgpa: e.target.value })}
                className="form-input"
              />
              <span className="form-hint">Minimum academic benchmark required for applicant consideration</span>
            </div>

            <div className="form-group">
              <label htmlFor="j-deadline">Application Deadline Date *</label>
              <input
                id="j-deadline"
                type="date"
                required
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="j-skills">Required Technical Skills (Comma separated) *</label>
            <input
              id="j-skills"
              type="text"
              required
              placeholder="e.g. React, Node.js, TypeScript, AWS, Python"
              value={formData.required_skills}
              onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
              className="form-input"
            />
            <span className="form-hint">Relevant skillsets used to recommend qualified student applicants</span>
          </div>

          <div className="form-actions mt-4">
            <button type="submit" disabled={loading} className="btn-primary">
              <PlusCircle size={16} />
              <span>{loading ? 'Posting...' : 'Publish Campus Opportunity'}</span>
            </button>
            <Link to="/company/dashboard" className="btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
