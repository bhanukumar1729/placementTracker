import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
        Loading session...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <h2 style={{ color: '#e11d48' }}>Access Restricted</h2>
        <p style={{ color: '#64748b', marginTop: '8px' }}>
          This page requires a <strong>{allowedRoles.join(' or ')}</strong> role.
        </p>
      </div>
    );
  }

  return children;
}
