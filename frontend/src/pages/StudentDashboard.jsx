import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import {
  FileText,
  UserCheck,
  Building2,
  Calendar,
  MapPin,
  Trash2,
  CheckCircle,
  AlertCircle,
  Save,
  GraduationCap,
} from 'lucide-react';

export default function StudentDashboard() {
  const { user, updateUserProfile } = useAuth();

  const [activeTab, setActiveTab] = useState('applications'); // 'applications' | 'profile'
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    branch: user?.branch || '',
    cgpa: user?.cgpa || '',
    skills: user?.skills?.join(', ') || '',
    resume_url: user?.resume_url || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const fetchApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await api.get('/applications/my-applications');
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error('Failed to fetch student applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (applicationId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    setWithdrawingId(applicationId);
    try {
      await api.delete(`/applications/${applicationId}`);
      // Remove from state
      setApplications((prev) => prev.filter((app) => app._id !== applicationId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to withdraw application');
    } finally {
      setWithdrawingId(null);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');
    setProfileError('');

    try {
      const payload = {
        name: profileForm.name,
        branch: profileForm.branch,
        cgpa: Number(profileForm.cgpa),
        skills: profileForm.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        resume_url: profileForm.resume_url,
      };

      const res = await api.put('/auth/student/profile', payload);
      setProfileSuccess('Profile information updated successfully!');
      updateUserProfile(res.data.student);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Student Overview Header */}
      <div className="dashboard-header-card">
        <div className="student-profile-summary">
          <div className="student-avatar">
            <GraduationCap size={32} />
          </div>
          <div>
            <h1 className="student-name">{user?.name}</h1>
            <div className="student-meta-row">
              <span>{user?.branch}</span>
              <span className="dot-sep">•</span>
              <span>
                CGPA: <strong>{user?.cgpa}</strong>
              </span>
              <span className="dot-sep">•</span>
              <span>{user?.email}</span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="dashboard-tabs">
          <button
            onClick={() => setActiveTab('applications')}
            className={`dash-tab ${activeTab === 'applications' ? 'active' : ''}`}
          >
            <FileText size={16} />
            <span>My Applications ({applications.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`dash-tab ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <UserCheck size={16} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {activeTab === 'applications' ? (
        <div className="applications-section">
          {loadingApps ? (
            <div className="loading-state">
              <div className="spinner" />
              <span>Loading your applications...</span>
            </div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <FileText size={48} className="empty-icon" />
              <h3>No job applications submitted yet</h3>
              <p>Explore campus listings and apply for internships and full-time roles.</p>
              <Link to="/jobs" className="btn-primary mt-4">
                Explore Available Jobs
              </Link>
            </div>
          ) : (
            <div className="applications-list">
              {applications.map((app) => (
                <div key={app._id} className="application-item-card">
                  <div className="app-main-info">
                    <div className="app-title-row">
                      <Link to={`/jobs/${app.job_id?._id}`} className="app-job-title">
                        {app.job_id?.title || 'Job Position'}
                      </Link>
                      <StatusBadge status={app.status} />
                    </div>

                    <div className="app-company-row">
                      <Building2 size={15} />
                      <span>{app.job_id?.company_id?.name || 'Company'}</span>
                      <span className="dot-sep">•</span>
                      <MapPin size={15} />
                      <span>{app.job_id?.location || 'Location'}</span>
                      <span className="dot-sep">•</span>
                      <span>{app.job_id?.stipend_or_salary}</span>
                    </div>

                    <div className="app-date-row">
                      <Calendar size={14} />
                      <span>
                        Applied on: {new Date(app.applied_on).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="app-actions">
                    <button
                      onClick={() => handleWithdraw(app._id)}
                      disabled={withdrawingId === app._id}
                      className="btn-withdraw"
                      title="Withdraw application"
                    >
                      <Trash2 size={15} />
                      <span>{withdrawingId === app._id ? 'Withdrawing...' : 'Withdraw'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Profile Edit Form */
        <div className="profile-edit-section">
          <div className="form-card">
            <div className="form-card-header">
              <h2 className="form-card-title">Update Candidate Profile</h2>
              <span className="badge-tag">Candidate Profile</span>
            </div>

            {profileSuccess && (
              <div className="alert-success">
                <CheckCircle size={16} />
                <span>{profileSuccess}</span>
              </div>
            )}

            {profileError && (
              <div className="alert-error">
                <AlertCircle size={16} />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="auth-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="p-name">Full Name</label>
                  <input
                    id="p-name"
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="p-cgpa">Cumulative CGPA (0 - 10)</label>
                  <input
                    id="p-cgpa"
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    required
                    value={profileForm.cgpa}
                    onChange={(e) => setProfileForm({ ...profileForm, cgpa: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="p-branch">Branch / Department</label>
                <input
                  id="p-branch"
                  type="text"
                  required
                  value={profileForm.branch}
                  onChange={(e) => setProfileForm({ ...profileForm, branch: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="p-skills">Technical Skills (Comma separated)</label>
                <input
                  id="p-skills"
                  type="text"
                  placeholder="e.g. React, Node.js, Python, MongoDB"
                  value={profileForm.skills}
                  onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="p-resume">Resume / Portfolio Link</label>
                <input
                  id="p-resume"
                  type="url"
                  placeholder="https://..."
                  value={profileForm.resume_url}
                  onChange={(e) => setProfileForm({ ...profileForm, resume_url: e.target.value })}
                  className="form-input"
                />
              </div>

              <button type="submit" disabled={profileLoading} className="btn-primary">
                <Save size={16} />
                <span>{profileLoading ? 'Saving changes...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
