import React from 'react';
import { cn } from '../../utils/helpers';
import './StatusBadge.css';

export default function StatusBadge({ status, size = 'md' }) {
  const isActive = status === 'Active';

  return (
    <span
      className={cn('status-badge', `status-badge--${size}`, {
        'status-badge--active': isActive,
        'status-badge--inactive': !isActive,
      })}
    >
      <span className="status-badge__dot" />
      {status}
    </span>
  );
}
