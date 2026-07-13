import React from 'react';
import { DEPARTMENTS, EMPLOYEE_STATUS } from '../../constants';
import './SearchFilter.css';

export default function SearchFilter({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  onClear,
}) {
  const hasFilters = search || department || status;

  return (
    <div className="search-filter">
      <div className="search-filter__search">
        <svg className="search-filter__search-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M12.5 12.5L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          className="search-filter__input"
          placeholder="Search employees by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search employees"
        />
        {search && (
          <button
            className="search-filter__clear-btn"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      <div className="search-filter__filters">
        <div className="search-filter__select-wrapper">
          <svg className="search-filter__select-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M2 6h12" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          <select
            value={department}
            onChange={(e) => onDepartmentChange(e.target.value)}
            className="search-filter__select"
            aria-label="Filter by department"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="search-filter__select-wrapper">
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="search-filter__select"
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value={EMPLOYEE_STATUS.ACTIVE}>Active</option>
            <option value={EMPLOYEE_STATUS.INACTIVE}>Inactive</option>
          </select>
        </div>

        {hasFilters && (
          <button className="search-filter__reset" onClick={onClear} title="Clear all filters">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
