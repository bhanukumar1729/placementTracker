import React from 'react';

const statusConfig = {
  Applied: {
    bg: '#eff6ff',
    color: '#2563eb',
    border: '#bfdbfe',
    dot: '#3b82f6',
  },
  Shortlisted: {
    bg: '#fefce8',
    color: '#ca8a04',
    border: '#fef08a',
    dot: '#eab308',
  },
  Interview: {
    bg: '#faf5ff',
    color: '#9333ea',
    border: '#e9d5ff',
    dot: '#a855f7',
  },
  Selected: {
    bg: '#f0fdf4',
    color: '#16a34a',
    border: '#bbf7d0',
    dot: '#22c55e',
  },
  Rejected: {
    bg: '#fff1f2',
    color: '#e11d48',
    border: '#fecdd3',
    dot: '#f43f5e',
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Applied;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '0.8rem',
        fontWeight: '600',
        backgroundColor: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: config.dot,
        }}
      />
      {status}
    </span>
  );
}
