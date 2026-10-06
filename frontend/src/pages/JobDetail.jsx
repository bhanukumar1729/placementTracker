import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import {
  Building2,
  MapPin,
  DollarSign,
  GraduationCap,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  Send,
} from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isStudent, isCompany } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [existingApplication, setExistingApplication] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchJobAndApplication = async () => {
    setLoading(true);
    setError('');
    try {
      const jobRes = await api.get(`/jobs/${id}`);
      setJob(jobRes.data.job);

      // If logged in as student, check if already applied
      if (isStudent) {
        const appsRes = await api.get('/applications/my-applications');
        const match = appsRes.data.applications.find(
          (app) => app.job_id?._id === id || app.job_id === id
        );
        if (match) {
          setExistingApplication(match);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobAndApplication();
  }, [id, isStudent]);

  const handleApply = async () => {
    if (!isStudent) {
      navigate('/login');
      return;
    }

    setApplying(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/applications', { job_id: id });
      setMessage(response.data.message || 'Application submitted successfully!');
      setExistingApplication(response.data.application);
      // Increment local job applicants counter
      setJob((prev) => ({
        ...prev,
        applicants_count: (prev.applicants_count || 0) + 1,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="spinner" />
          <span>Loading job specification...</span>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="page-container">
        <div className="alert-error">{error}</div>
        <Link to="/jobs" className="btn-secondary mt-4">
          &larr; Back to Job Directory
        </Link>
      </div>
    );
  }

  const isEligible = isStudent && user?.cgpa >= job.min_cgpa;

  return (
    <div className="page-container">
      <Link to="/jobs" className="back-link">
        <ArrowLeft size={16} />
        <span>Back to All Jobs</span>
      </Link>

      <div className="job-detail-layout">
        {/* Main Job Info */}
        <div className="job-detail-main">
          <div className="job-header-card">
            <div className="job-header-top">
              <div className="badge-row">
                <span className={`job-type-pill type-${job.type}`}>
                  {job.type === 'internship' ? 'Internship' : 'Full-Time Employment'}
                </span>
                {job.category && (
                  <span className="job-category-pill">
                    {job.category}
                  </span>
                )}
              </div>
              <span className="status-indicator-open">
                Status: <strong>{job.status.toUpperCase()}</strong>
              </span>
            </div>

            <h1 className="job-detail-title">{job.title}</h1>

            <div className="job-company-row">
              <Building2 size={18} className="icon-muted" />
              <span className="job-company-name">{job.company_id?.name}</span>
              {job.company_id?.website && (
                <a
                  href={job.company_id.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="company-link"
                >
                  Visit Website <ExternalLink size={12} />
                </a>
              )}
            </div>

            <div className="job-meta-grid">
              <div className="meta-card">
                <MapPin size={20} className="meta-icon" />
                <div>
                  <span className="meta-label">Location</span>
                  <strong className="meta-value">{job.location}</strong>
                </div>
              </div>

              <div className="meta-card">
                <DollarSign size={20} className="meta-icon" />
                <div>
                  <span className="meta-label">Stipend / CTC</span>
                  <strong className="meta-value">{job.stipend_or_salary}</strong>
                </div>
              </div>

              <div className="meta-card">
                <GraduationCap size={20} className="meta-icon" />
                <div>
                  <span className="meta-label">Minimum CGPA</span>
                  <strong className="meta-value">{job.min_cgpa} / 10.0</strong>
                </div>
              </div>

              <div className="meta-card">
                <Calendar size={20} className="meta-icon" />
                <div>
                  <span className="meta-label">Application Deadline</span>
                  <strong className="meta-value">
                    {new Date(job.deadline).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div className="content-card">
            <h2 className="section-title">Required Technical Skills</h2>
            <p className="section-desc">
              Candidates should be proficient with or have working academic knowledge of:
            </p>
            <div className="skills-badge-list">
              {job.required_skills?.map((skill, index) => (
                <span key={index} className="skill-pill-large">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Company Background */}
          {job.company_id?.description && (
            <div className="content-card">
              <h2 className="section-title">About {job.company_id.name}</h2>
              <p className="company-desc-text">{job.company_id.description}</p>
            </div>
          )}
        </div>

        {/* Sidebar Apply Card */}
        <div className="job-detail-sidebar">
          <div className="apply-card">
            <h3 className="apply-card-title">Apply for this Position</h3>

            {/* Applicants atomic count indicator */}
            <div className="applicants-summary-box">
              <Users size={16} />
              <span>
                <strong>{job.applicants_count || 0}</strong> Students have applied so far
              </span>
            </div>

            {/* Application Feedback / Actions */}
            {message && (
              <div className="alert-success">
                <CheckCircle size={16} />
                <span>{message}</span>
              </div>
            )}

            {error && (
              <div className="alert-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {existingApplication ? (
              <div className="already-applied-box">
                <div className="applied-heading">
                  <CheckCircle size={18} className="text-success" />
                  <span>Application Submitted</span>
                </div>
                <p className="applied-subtext">
                  You applied on{' '}
                  <strong>
                    {new Date(existingApplication.applied_on).toLocaleDateString()}
                  </strong>
                </p>
                <div className="applied-status-row">
                  <span>Current Review Status:</span>
                  <StatusBadge status={existingApplication.status} />
                </div>
                <Link to="/student/applications" className="btn-secondary btn-full mt-4">
                  View in My Applications
                </Link>
              </div>
            ) : isStudent ? (
              <div className="apply-action-box">
                {/* CGPA eligibility pill */}
                <div className={`eligibility-notice ${isEligible ? 'eligible' : 'warning'}`}>
                  {isEligible ? (
                    <>
                      <CheckCircle size={16} />
                      <span>
                        Your CGPA (<strong>{user?.cgpa}</strong>) meets the minimum requirement ({job.min_cgpa}).
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      <span>
                        Your CGPA (<strong>{user?.cgpa}</strong>) is below the recommended minimum ({job.min_cgpa}). You can still apply.
                      </span>
                    </>
                  )}
                </div>

                <button
                  onClick={handleApply}
                  disabled={applying || job.status === 'closed'}
                  className="btn-apply-primary"
                >
                  <Send size={16} />
                  <span>{applying ? 'Submitting Application...' : 'Submit Application Now'}</span>
                </button>
                <span className="apply-guarantee-hint">
                  Verified Student Application • Direct profile & resume delivery to recruiter
                </span>
              </div>
            ) : isCompany ? (
              <div className="company-view-notice">
                <p>
                  You are viewing this job as a <strong>Company Recruiter</strong>.
                </p>
                <Link to="/company/dashboard" className="btn-secondary btn-full mt-2">
                  Open Company Dashboard
                </Link>
              </div>
            ) : (
              <div className="guest-apply-box">
                <p>Please log in with your student account to apply for this position.</p>
                <Link to="/login" className="btn-primary btn-full mt-3">
                  Log in to Apply
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
