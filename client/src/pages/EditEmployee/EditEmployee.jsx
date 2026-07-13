import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import EmployeeForm from '../../components/EmployeeForm/EmployeeForm';
import { useToast } from '../../components/Toast/Toast';
import { PageLoader } from '../../components/LoadingSpinner/LoadingSpinner';
import EmployeeService, { ApiError } from '../../api/employeeService';
import './EditEmployee.css';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadEmployee();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadEmployee = async () => {
    try {
      setLoading(true);
      const res = await EmployeeService.getById(id);
      setEmployee(res.data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load employee');
      addToast(err.message || 'Failed to load employee details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const res = await EmployeeService.update(id, formData);
      addToast(res.message || 'Employee updated successfully', 'success');
      navigate('/employees');
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        err.errors.forEach((e) => {
          addToast(`${e.field}: ${e.message}`, 'error');
        });
      } else {
        addToast(err.message || 'Failed to update employee', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  if (error) {
    return (
      <div className="edit-employee__error">
        <h2>Employee not found</h2>
        <p>{error}</p>
        <button className="btn btn--primary" onClick={() => navigate('/employees')}>
          Back to Employees
        </button>
      </div>
    );
  }

  return (
    <div className="edit-employee">
      <div className="edit-employee__header">
        <button className="edit-employee__back" onClick={() => navigate('/employees')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Employees
        </button>
        <h1 className="edit-employee__title">Edit Employee</h1>
        <p className="edit-employee__subtitle">Update the details for <strong>{employee?.full_name}</strong>.</p>
      </div>

      <div className="edit-employee__form-wrapper">
        <EmployeeForm
          mode="edit"
          initialData={employee}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/employees')}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
