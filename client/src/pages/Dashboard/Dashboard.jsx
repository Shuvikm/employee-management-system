import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../../components/StatsCard/StatsCard';
import StatusChart from '../../components/StatusChart/StatusChart';
import DepartmentChart from '../../components/DepartmentChart/DepartmentChart';
import EmployeeService from '../../api/employeeService';
import { PageLoader } from '../../components/LoadingSpinner/LoadingSpinner';
import { getGreeting } from '../../utils/helpers';
import './Dashboard.css';

const ICONS = {
  total: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  active: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  inactive: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
      <path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [departmentStats, setDepartmentStats] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, employeesRes] = await Promise.all([
        EmployeeService.getStats(),
        EmployeeService.getAll({ pageSize: 5 }),
      ]);
      setStats(statsRes.data);
      setDepartmentStats(statsRes.data.departmentStats || []);
      setRecentEmployees(employeesRes.data.slice(0, 5));
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="dashboard__error">
        <div className="dashboard__error-content">
          <div className="dashboard__error-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2"/>
              <path d="M24 16v10M24 30v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h2>Unable to load dashboard</h2>
          <p>{error}</p>
          <button className="btn btn--primary" onClick={loadDashboardData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">{getGreeting()}!</h1>
          <p className="dashboard__subtitle">Here's what's happening with your workforce today.</p>
        </div>
        <div className="dashboard__header-actions">
          <button className="btn btn--secondary" onClick={loadDashboardData} title="Refresh data">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8a6 6 0 0111.5-3M14 8a6 6 0 01-11.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M14 2v4h-4M2 14v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Refresh
          </button>
          <button className="btn btn--primary" onClick={() => navigate('/employees/add')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Employee
          </button>
        </div>
      </div>

      {stats && (
        <>
          <div className="dashboard__stats">
            <StatsCard
              title="Total Employees"
              value={stats.total}
              color="primary"
              icon={ICONS.total}
              onClick={() => navigate('/employees')}
            />
            <StatsCard
              title="Active"
              value={stats.active}
              color="success"
              icon={ICONS.active}
              onClick={() => navigate('/employees?status=Active')}
            />
            <StatsCard
              title="Inactive"
              value={stats.inactive}
              color="danger"
              icon={ICONS.inactive}
              onClick={() => navigate('/employees?status=Inactive')}
            />
          </div>

          <div className="dashboard__charts">
            <StatusChart active={stats.active} inactive={stats.inactive} />
            <DepartmentChart data={departmentStats} />
          </div>
        </>
      )}

      <div className="dashboard__section">
        <div className="dashboard__section-header">
          <h2 className="dashboard__section-title">Recent Employees</h2>
          <button className="dashboard__view-all" onClick={() => navigate('/employees')}>
            View All
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {recentEmployees.length === 0 ? (
          <div className="dashboard__empty">
            <div className="dashboard__empty-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
                <path d="M24 16v8M24 28v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <p>No employees yet. Start by adding your first employee!</p>
            <button className="btn btn--primary" onClick={() => navigate('/employees/add')} style={{ marginTop: 12 }}>
              Add Employee
            </button>
          </div>
        ) : (
          <div className="dashboard__recent-list">
            {recentEmployees.map((employee, index) => (
              <div
                key={employee.id}
                className="dashboard__recent-item"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => navigate(`/employees/edit/${employee.id}`)}
              >
                <div className="dashboard__recent-avatar">
                  {employee.full_name.charAt(0).toUpperCase()}
                </div>
                <div className="dashboard__recent-info">
                  <span className="dashboard__recent-name">{employee.full_name}</span>
                  <span className="dashboard__recent-meta">{employee.department} • {employee.designation}</span>
                </div>
                <span className={`dashboard__recent-status dashboard__recent-status--${employee.status.toLowerCase()}`}>
                  {employee.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
