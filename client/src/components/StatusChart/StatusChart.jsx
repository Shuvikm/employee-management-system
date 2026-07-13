import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import './StatusChart.css';

export default function StatusChart({ active = 0, inactive = 0 }) {
  const { isDark } = useTheme();
  const total = active + inactive;

  if (total === 0) {
    return (
      <div className="status-chart">
        <div className="status-chart__header">
          <h3 className="status-chart__title">Employee Status</h3>
        </div>
        <div className="status-chart__empty">
          <p>No data available</p>
        </div>
      </div>
    );
  }

  const activePercent = (active / total) * 100;
  const inactivePercent = (inactive / total) * 100;

  // SVG pie chart
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const activeOffset = 0;
  const activeLength = (activePercent / 100) * circumference;
  const inactiveLength = (inactivePercent / 100) * circumference;

  return (
    <div className="status-chart">
      <div className="status-chart__header">
        <h3 className="status-chart__title">Employee Status</h3>
      </div>
      <div className="status-chart__body">
        <div className="status-chart__pie">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={isDark ? '#313244' : '#F3F4F6'}
              strokeWidth="20"
            />
            {active > 0 && (
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#10B981"
                strokeWidth="20"
                strokeDasharray={`${activeLength} ${circumference - activeLength}`}
                strokeDashoffset={-activeOffset}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                className="status-chart__arc"
              />
            )}
            {inactive > 0 && (
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="#EF4444"
                strokeWidth="20"
                strokeDasharray={`${inactiveLength} ${circumference - inactiveLength}`}
                strokeDashoffset={-(activeLength + inactiveOffset)}
                strokeLinecap="round"
                transform="rotate(-90 70 70)"
                className="status-chart__arc"
              />
            )}
            <text
              x="70"
              y="70"
              textAnchor="middle"
              dominantBaseline="central"
              fill={isDark ? '#CDD6F4' : '#111827'}
              fontSize="22"
              fontWeight="700"
            >
              {total}
            </text>
          </svg>
        </div>
        <div className="status-chart__legend">
          <div className="status-chart__legend-item">
            <span className="status-chart__dot status-chart__dot--active" />
            <span className="status-chart__legend-label">Active</span>
            <span className="status-chart__legend-value">{active} ({Math.round(activePercent)}%)</span>
          </div>
          <div className="status-chart__legend-item">
            <span className="status-chart__dot status-chart__dot--inactive" />
            <span className="status-chart__legend-label">Inactive</span>
            <span className="status-chart__legend-value">{inactive} ({Math.round(inactivePercent)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
