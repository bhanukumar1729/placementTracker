import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  MapPin,
  Briefcase,
  GraduationCap,
  DollarSign,
  Calendar,
  Users,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Tag,
} from 'lucide-react';

const COMMON_SKILLS = [
  'React',
  'Python',
  'Java',
  'C++',
  'Node.js',
  'Machine Learning',
  'AWS',
  'Docker',
  'Kubernetes',
  'SQL',
  'Linux',
  'Flutter',
  'ROS',
];

const JOB_CATEGORIES = [
  'All Categories',
  'Software Engineering',
  'Artificial Intelligence & ML',
  'Cloud Computing & DevOps',
  'Cybersecurity',
  'Data Science & Analytics',
  'Embedded Systems & IoT',
  'Mobile App Development',
  'Robotics & Automation',
  'Quantitative Finance',
  'Game Development',
  'UI/UX & Frontend Engineering',
  'Backend & API Development',
];

export default function JobList() {
  const { user, isStudent } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search filter states
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [cgpaFilter, setCgpaFilter] = useState('');
  const [location, setLocation] = useState('');
  const [includeRemote, setIncludeRemote] = useState(false);
  const [jobType, setJobType] = useState('');

  // Auto-populate student's CGPA and skills if logged in
  useEffect(() => {
    if (isStudent && user) {
      if (user.cgpa && !cgpaFilter) {
        setCgpaFilter(user.cgpa.toString());
      }
    }
  }, [isStudent, user]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (keyword.trim()) params.append('keyword', keyword.trim());
      if (selectedCategory && selectedCategory !== 'All Categories') {
        params.append('category', selectedCategory);
      }
      if (selectedSkills.length > 0) params.append('skills', selectedSkills.join(','));
      if (cgpaFilter) params.append('cgpa', cgpaFilter);
      if (location.trim()) {
        params.append('location', location.trim());
      } else if (includeRemote) {
        params.append('location', 'remote');
      }
      if (jobType) params.append('type', jobType);

      const response = await api.get(`/jobs?${params.toString()}`);
      setJobs(response.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [jobType, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleReset = () => {
    setKeyword('');
    setSelectedCategory('All Categories');
    setSelectedSkills([]);
    setCgpaFilter('');
    setLocation('');
    setIncludeRemote(false);
    setJobType('');
    setTimeout(() => {
      api.get('/jobs').then((res) => {
        setJobs(res.data.jobs || []);
      });
    }, 50);
  };

  return (
    <div className="page-container">
      {/* Hero / Header */}
      <div className="hero-banner">
        <div className="hero-content">
          <span className="badge-tag">
            <Sparkles size={13} /> Active Campus Hiring 2026
          </span>
          <h1 className="hero-title">Find Your Next Career Milestone</h1>
          <p className="hero-description">
            Discover verified internships, associate engineering roles, and campus placement drives from top technology enterprises and hyper-growth startups.
          </p>
        </div>

        {/* Platform Trust & Activity Metrics */}
        <div className="hero-stats-banner">
          <div className="hero-stat-item">
            <span className="hero-stat-number">{jobs.length}+</span>
            <span className="hero-stat-label">Active Openings</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat-item">
            <span className="hero-stat-number">100%</span>
            <span className="hero-stat-label">Verified Recruiters</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat-item">
            <span className="hero-stat-number">Direct</span>
            <span className="hero-stat-label">Campus Fast-Track</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="category-scroll-bar">
        <div className="category-scroll-inner">
          {JOB_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
            >
              <Tag size={13} />
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="filter-card">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <div className="search-main-row">
            <div className="search-input-group flex-2">
              <Search size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Search job title, role, or keywords..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="search-input-group flex-1">
              <MapPin size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Location (city or Remote)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="search-input-group flex-1">
              <GraduationCap size={18} className="input-icon" />
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                placeholder="Filter by CGPA (e.g. 8.0)..."
                value={cgpaFilter}
                onChange={(e) => setCgpaFilter(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="search-actions">
              <button type="submit" className="btn-search">
                <Search size={16} />
                <span>Search</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="btn-reset"
                title="Reset Filters"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Quick Skill Filters & Type Toggle */}
          <div className="search-sub-row">
            <div className="skills-filter-group">
              <span className="filter-label">Filter by Skills:</span>
              <div className="skill-pills">
                {COMMON_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`skill-pill ${isSelected ? 'active' : ''}`}
                    >
                      {isSelected && <CheckCircle2 size={12} />}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="type-toggle-group">
              <button
                type="button"
                className={`type-btn ${jobType === '' ? 'active' : ''}`}
                onClick={() => setJobType('')}
              >
                All
              </button>
              <button
                type="button"
                className={`type-btn ${jobType === 'job' ? 'active' : ''}`}
                onClick={() => setJobType('job')}
              >
                Jobs
              </button>
              <button
                type="button"
                className={`type-btn ${jobType === 'internship' ? 'active' : ''}`}
                onClick={() => setJobType('internship')}
              >
                Internships
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Results Section */}
      <div className="results-header">
        <div className="results-count">
          Showing <strong>{jobs.length}</strong> available position{jobs.length === 1 ? '' : 's'}
          {selectedCategory !== 'All Categories' && (
            <span> in <em>{selectedCategory}</em></span>
          )}
        </div>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <span>Discovering relevant opportunities...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <Briefcase size={48} className="empty-icon" />
          <h3>No jobs match your filter criteria</h3>
          <p>Try clearing some skill tags, changing category, or resetting filters.</p>
          <button onClick={handleReset} className="btn-primary mt-4">
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-card-header">
                <div>
                  <div className="badge-row">
                    <span className={`job-type-pill type-${job.type}`}>
                      {job.type === 'internship' ? 'Internship' : 'Full-Time Job'}
                    </span>
                    {job.category && (
                      <span className="job-category-pill">
                        {job.category}
                      </span>
                    )}
                  </div>
                  <h3 className="job-card-title">{job.title}</h3>
                  <div className="company-name">
                    {job.company_id?.name || 'Partner Company'}
                  </div>
                </div>
              </div>

              <div className="job-card-details">
                <div className="detail-item">
                  <MapPin size={15} />
                  <span>{job.location}</span>
                </div>
                <div className="detail-item">
                  <DollarSign size={15} />
                  <span>{job.stipend_or_salary}</span>
                </div>
                <div className="detail-item">
                  <GraduationCap size={15} />
                  <span>Min CGPA: <strong>{job.min_cgpa}</strong></span>
                </div>
                <div className="detail-item">
                  <Calendar size={15} />
                  <span>
                    Deadline: {new Date(job.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Skills required */}
              <div className="job-card-skills">
                {job.required_skills?.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="job-card-footer">
                <div className="applicants-badge" title="Current verified candidate applications">
                  <Users size={14} />
                  <span><strong>{job.applicants_count || 0}</strong> applicants</span>
                </div>
                <Link to={`/jobs/${job._id}`} className="btn-view-job">
                  View & Apply &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
