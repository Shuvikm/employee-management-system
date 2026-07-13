import React from 'react';
import './LoadingSpinner.css';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeMap = { sm: 20, md: 32, lg: 48 };

  return (
    <div className="loading-spinner" role="status" aria-label={text}>
      <svg
        className="loading-spinner__svg"
        width={sizeMap[size] || sizeMap.md}
        height={sizeMap[size] || sizeMap.md}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="loading-spinner__track"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.2"
        />
        <path
          className="loading-spinner__arc"
          d="M12 2a10 10 0 019.95 9"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {text && <span className="loading-spinner__text">{text}</span>}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="page-loader">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}
