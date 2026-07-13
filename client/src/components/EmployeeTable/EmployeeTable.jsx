import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../StatusBadge/StatusBadge';
import { formatDate, formatMobile, copyToClipboard } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';
import './EmployeeTable.css';

export default function EmployeeTable({
  employees,
  loading,
  selectedIds,
  onSelect,
  onSelectAll,
  onEdit,
  onDelete,
  onView,
  allSelected,
  hasSomeSelected,
}) {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyEmail = useCallback(async (e, email, id) => {
    e.stopPropagation();
    const success = await copyToClipboard(email);
    if (success) {
      setCopiedId(id);
      addToast('Email copied to clipboard', 'success');
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, [addToast]);

  if (loading) {
    return (
      <div className="employee-table__loading">
        <div className="employee-table__skeleton">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="employee-table__skeleton-row">
              <div className="skeleton skeleton--checkbox" />
              <div className="skeleton skeleton--avatar" />
              <div className="skeleton skeleton--text" style={{ width: '25%' }} />
              <div className="skeleton skeleton--text" style={{ width: '30%' }} />
              <div className="skeleton skeleton--text" style={{ width: '20%' }} />
              <div className="skeleton skeleton--badge" />
              <div className="skeleton skeleton--text" style={{ width: '80px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="employee-table__wrapper">
      <table className="employee-table">
        <thead>
          <tr>
            <th className="employee-table__checkbox-col">
              <label className="employee-table__checkbox-label">
                <input
                  type="checkbox"
                  className="employee-table__checkbox"
                  checked={allSelected}
                  ref={el => { if (el) el.indeterminate = hasSomeSelected && !allSelected; }}
                  onChange={onSelectAll}
                  aria-label={allSelected ? 'Deselect all' : 'Select all'}
                />
                <span className="employee-table__checkbox-custom" />
              </label>
            </th>
            <th>Employee</th>
            <th>Contact</th>
            <th>Department</th>
            <th>Designation</th>
            <th>Joining Date</th>
            <th>Status</th>
            <th className="employee-table__actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => {
            const isSelected = selectedIds.includes(employee.id);
            return (
              <tr
                key={employee.id}
                className={`employee-table__row${isSelected ? ' employee-table__row--selected' : ''}`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <td>
                  <label className="employee-table__checkbox-label">
                    <input
                      type="checkbox"
                      className="employee-table__checkbox"
                      checked={isSelected}
                      onChange={() => onSelect(employee.id)}
                      aria-label={`Select ${employee.full_name}`}
                    />
                    <span className="employee-table__checkbox-custom" />
                  </label>
                </td>
                <td>
                  <div className="employee-table__name-cell" onClick={() => onView?.(employee.id)}>
                    <div className="employee-table__avatar">
                      {employee.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="employee-table__name">{employee.full_name}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="employee-table__contact">
                    <span className="employee-table__email">
                      {employee.email}
                      <button
                        className="employee-table__copy-btn"
                        onClick={(e) => handleCopyEmail(e, employee.email, employee.id)}
                        title="Copy email"
                      >
                        {copiedId === employee.id ? (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2.5 6l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <rect x="3.5" y="3.5" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1"/>
                            <path d="M8.5 3.5V2.5a1 1 0 00-1-1h-5a1 1 0 00-1 1v5a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1"/>
                          </svg>
                        )}
                      </button>
                    </span>
                    <span className="employee-table__phone">{formatMobile(employee.mobile_number)}</span>
                  </div>
                </td>
                <td>
                  <span className="employee-table__department">{employee.department}</span>
                </td>
                <td>
                  <span className="employee-table__designation">{employee.designation}</span>
                </td>
                <td>
                  <span className="employee-table__date">{formatDate(employee.joining_date)}</span>
                </td>
                <td>
                  <StatusBadge status={employee.status} />
                </td>
                <td>
                  <div className="employee-table__actions">
                    <button
                      className="employee-table__action-btn employee-table__action-btn--view"
                      onClick={() => onView?.(employee.id)}
                      title="View details"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 3C4.5 3 1.5 5.5 0 8c1.5 2.5 4.5 5 8 5s6.5-2.5 8-5c-1.5-2.5-4.5-5-8-5z" stroke="currentColor" strokeWidth="1.2"/>
                        <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
                      </svg>
                    </button>
                    <button
                      className="employee-table__action-btn employee-table__action-btn--edit"
                      onClick={() => onEdit?.(employee.id)}
                      title="Edit employee"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M11.5 1.5l3 3L5 14H2v-3l9.5-9.5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      className="employee-table__action-btn employee-table__action-btn--delete"
                      onClick={() => onDelete?.(employee)}
                      title="Delete employee"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M2 4h12M5 4V2.5a.5.5 0 01.5-.5h5a.5.5 0 01.5.5V4M12.5 6v7.5a1 1 0 01-1 1h-7a1 1 0 01-1-1V6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
