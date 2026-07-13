import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeForm from '../../components/EmployeeForm/EmployeeForm';
import { useToast } from '../../components/Toast/Toast';
import EmployeeService, { ApiError } from '../../api/employeeService';
import './AddEmployee.css';

export default function AddEmployee() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      const res = await EmployeeService.create(formData);
      addToast(res.message || 'Employee created successfully', 'success');
      navigate('/employees');
    } catch (err) {
      if (err instanceof ApiError && err.errors) {
        err.errors.forEach((e) => {
          addToast(`${e.field}: ${e.message}`, 'error');
        });
      } else {
        addToast(err.message || 'Failed to create employee', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-employee">
      <div className="add-employee__header">
        <button className="add-employee__back" onClick={() => navigate('/employees')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Employees
        </button>
        <h1 className="add-employee__title">Add New Employee</h1>
        <p className="add-employee__subtitle">Fill in the details below to add a new employee to the system.</p>
      </div>

      <div className="add-employee__form-wrapper">
        <EmployeeForm
          mode="add"
          onSubmit={handleSubmit}
          onCancel={() => navigate('/employees')}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
