import React from 'react';
import './DepartmentChart.css';

const BAR_COLORS = [
  '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#3B82F6',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316', '#6366F1',
];

export default function DepartmentChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="dept-chart__empty">
        <p>No department data available</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="dept-chart">
      <div className="dept-chart__header">
        <h3 className="dept-chart__title">Department Distribution</h3>
      </div>
      <div className="dept-chart__bars">
        {data.map((item, index) => (
          <div key={item.name} className="dept-chart__row" style={{ animationDelay: `${index * 40}ms` }}>
            <span className="dept-chart__label" title={item.name}>{item.name}</span>
            <div className="dept-chart__bar-track">
              <div
                className="dept-chart__bar-fill"
                style={{
                  width: `${(item.count / maxValue) * 100}%`,
                  backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
                  animationDelay: `${index * 50}ms`,
                }}
              />
            </div>
            <span className="dept-chart__value">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
