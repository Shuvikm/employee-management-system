import React from 'react';
import './EmptyState.css';

export default function EmptyState({
  icon,
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  action,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">
        {icon || (
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <rect x="8" y="16" width="48" height="36" rx="4" stroke="currentColor" strokeWidth="2" fill="none"/>
            <path d="M8 24h48" stroke="currentColor" strokeWidth="2"/>
            <circle cx="16" cy="20" r="2" fill="currentColor"/>
            <circle cx="22" cy="20" r="2" fill="currentColor"/>
            <circle cx="28" cy="20" r="2" fill="currentColor"/>
            <path d="M24 32l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__description">{description}</p>
      {action && <div className="empty-state__action">{action}</div>}
    </div>
  );
}
