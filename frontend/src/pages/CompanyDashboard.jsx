import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import {
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  TrendingUp,
  PlusCircle,
  Eye,
  CheckCircle,
  ExternalLink,
  Layers,
  Sparkles,
  X,
} from 'lucide-react';

export default function CompanyDashboard() {
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected job for applicants viewer modal
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, jobsRes] = await Promise.all([
        api.get('/company/analytics'),
        api.get('/jobs/company/my-jobs'),
      ]);
      setAnalytics(analyticsRes.data);
      setJobs(jobsRes.data.jobs || []);
    } catch (err) {
      console.error('Error loading company dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const openApplicantsModal = async (job) => {
    setSelectedJob(job);
    setStatusMessage('');
    setLoadingApplicants(true);
    try {
      const res = await api.get(`/applications/job/${job._id}`);
      setApplicants(res.data.applications || []);
    } catch (err) {
      console.error('Error loading job applicants:', err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const closeApplicantsModal = () => {
    setSelectedJob(null);
    setApplicants([]);
    setStatusMessage('');
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    setStatusUpdatingId(applicationId);
    setStatusMessage('');
    try {
      await api.put(`/applications/${applicationId}/status`, {
        status: newStatus,
      });

      // Update local applicants list
      setApplicants((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status: newStatus } : app
        )
      );

      setStatusMessage(`Candidate application status updated to "${newStatus}" successfully`);

      // Refresh analytics in background
      api.get('/company/analytics').then((res) => setAnalytics(res.data));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update applicant status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  return (
    <div className="page-container">
      {/* Company Header */}
      <div className="dashboard-header-card">
        <div className="company-header-info">
          <div className="company-avatar">
            <Building2 size={32} />
          </div>
          <div>
            <h1 className="company-title">{user?.name}</h1>
            <p className="company-sub">{user?.description || 'Campus Recruitment & Internship Partner'}</p>
          </div>
        </div>

        <Link to="/company/post-job" className="btn-primary">
          <PlusCircle size={16} />
          <span>Post New Opportunity</span>
        </Link>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <span>Loading hiring analytics & candidate pipeline...</span>
        </div>
      ) : (
        <>
          {/* Recruiter Overview Banner */}
          <div className="recruiter-overview-banner">
            <div className="banner-left">
              <Layers size={20} className="text-primary" />
              <div>
                <strong>Candidate Pipeline & Campus Recruitment Engine</strong>
                <p>
                  Real-time synchronization across student submissions, eligibility criteria, and hiring evaluations.
                </p>
              </div>
            </div>
            <div className="portal-status-chip">
              <Sparkles size={14} />
              <span>Live Recruitment Cycle</span>
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="stats-cards-grid">
            <div className="stat-card">
              <div className="stat-icon-wrap icon-blue">
                <Briefcase size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Jobs Posted</span>
                <strong className="stat-value">{analytics?.summary?.totalJobs || 0}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap icon-purple">
                <Users size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Applications</span>
                <strong className="stat-value">{analytics?.summary?.totalApplications || 0}</strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap icon-emerald">
                <TrendingUp size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Average Candidate CGPA</span>
                <strong className="stat-value">
                  {analytics?.summary?.overallAvgCgpa
                    ? analytics.summary.overallAvgCgpa.toFixed(2)
                    : 'N/A'}
                </strong>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrap icon-amber">
                <GraduationCap size={22} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Selected Students</span>
                <strong className="stat-value">
                  {analytics?.summary?.statusBreakdown?.Selected || 0}
                </strong>
              </div>
            </div>
          </div>

          {/* Per-Job Aggregation Pipeline Breakdown */}
          <div className="content-card mt-6">
            <div className="card-header-clean">
              <h2 className="card-section-title">Job Pipeline & Candidate Analytics</h2>
              <span className="card-sub-info">
                Aggregated live across active campus postings
              </span>
            </div>

            {analytics?.perJobStats?.length === 0 ? (
              <p className="text-muted p-4">No application records found to aggregate.</p>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Type</th>
                      <th>Applicants</th>
                      <th>Avg. CGPA</th>
                      <th>Pipeline Breakdown</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics?.perJobStats?.map((stat) => {
                      const breakdown = analytics.jobStatusBreakdown?.filter(
                        (b) => b.jobId === stat.jobId
                      );
                      return (
                        <tr key={stat.jobId}>
                          <td className="font-semibold">{stat.jobTitle}</td>
                          <td>
                            <span className={`job-type-pill type-${stat.jobType}`}>
                              {stat.jobType}
                            </span>
                          </td>
                          <td>
                            <strong className="badge-count">{stat.totalApplicants}</strong>
                          </td>
                          <td>
                            <span className="badge-cgpa">
                              {stat.avgCgpa ? `${stat.avgCgpa} / 10.0` : 'N/A'}
                            </span>
                          </td>
                          <td>
                            <div className="status-mini-chips">
                              {breakdown?.map((b, i) => (
                                <span key={i} className="mini-chip">
                                  {b.status}: <strong>{b.count}</strong>
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Posted Jobs Management */}
          <div className="content-card mt-6">
            <div className="card-header-clean">
              <h2 className="card-section-title">Manage Posted Opportunities</h2>
              <span className="card-sub-info">
                Manage active campus listings and review candidate submissions
              </span>
            </div>

            {jobs.length === 0 ? (
              <div className="empty-state p-6">
                <Briefcase size={36} className="empty-icon" />
                <p>You haven't posted any jobs or internships yet.</p>
                <Link to="/company/post-job" className="btn-primary mt-3">
                  Create First Job Posting
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Position Title</th>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Stipend / CTC</th>
                      <th>Applicants</th>
                      <th>Deadline</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map((job) => (
                      <tr key={job._id}>
                        <td className="font-semibold">{job.title}</td>
                        <td>
                          <span className={`job-type-pill type-${job.type}`}>
                            {job.type}
                          </span>
                        </td>
                        <td>{job.location}</td>
                        <td>{job.stipend_or_salary}</td>
                        <td>
                          <span className="badge-count">{job.applicants_count || 0}</span>
                        </td>
                        <td>{new Date(job.deadline).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => openApplicantsModal(job)}
                            className="btn-review-applicants"
                          >
                            <Eye size={14} />
                            <span>View Applicants</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Interactive Applicants Modal */}
      {selectedJob && (
        <div className="modal-overlay" onClick={closeApplicantsModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Applicants for: {selectedJob.title}</h3>
                <span className="modal-subtitle">
                  Evaluate candidate credentials, qualifications, and recruitment stages
                </span>
              </div>
              <button onClick={closeApplicantsModal} className="btn-close-modal">
                <X size={20} />
              </button>
            </div>

            {statusMessage && (
              <div className="alert-success m-4">
                <CheckCircle size={16} />
                <span>{statusMessage}</span>
              </div>
            )}

            <div className="modal-body">
              {loadingApplicants ? (
                <div className="loading-state p-6">
                  <div className="spinner" />
                  <span>Loading candidate applications...</span>
                </div>
              ) : applicants.length === 0 ? (
                <div className="empty-state p-6">
                  <Users size={36} className="empty-icon" />
                  <h4>No applications submitted yet for this position</h4>
                  <p>When candidates apply, their records will appear here.</p>
                </div>
              ) : (
                <div className="applicants-list-modal">
                  {applicants.map((app) => (
                    <div key={app._id} className="applicant-card">
                      <div className="applicant-info">
                        <div className="applicant-name-row">
                          <strong>{app.student_id?.name || 'Student Candidate'}</strong>
                          <span className="applicant-cgpa">
                            CGPA: <strong>{app.student_id?.cgpa}</strong>
                          </span>
                        </div>
                        <div className="applicant-meta-row">
                          <span>{app.student_id?.branch}</span>
                          <span className="dot-sep">•</span>
                          <span>{app.student_id?.email}</span>
                        </div>
                        <div className="applicant-skills-row">
                          {app.student_id?.skills?.map((sk, i) => (
                            <span key={i} className="skill-mini-tag">
                              {sk}
                            </span>
                          ))}
                        </div>
                        {app.student_id?.resume_url && (
                          <a
                            href={app.student_id.resume_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="resume-link"
                          >
                            View Resume <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      <div className="applicant-status-controls">
                        <div className="current-status-display">
                          <StatusBadge status={app.status} />
                        </div>
                        <div className="status-selector-group">
                          <label htmlFor={`status-select-${app._id}`}>Stage:</label>
                          <select
                            id={`status-select-${app._id}`}
                            value={app.status}
                            disabled={statusUpdatingId === app._id}
                            onChange={(e) => handleStatusChange(app._id, e.target.value)}
                            className="status-dropdown"
                          >
                            <option value="Applied">Applied</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Interview">Interview</option>
                            <option value="Selected">Selected</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={closeApplicantsModal} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
