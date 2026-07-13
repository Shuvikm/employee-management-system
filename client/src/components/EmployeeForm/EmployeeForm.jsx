import React, { useState } from 'react';
import { DEPARTMENTS, DESIGNATIONS, EMPLOYEE_STATUS } from '../../constants';
import { validateEmployeeForm } from '../../utils/validation';
import { formatDateForInput } from '../../utils/helpers';
import { cn } from '../../utils/helpers';
import './EmployeeForm.css';

const INITIAL_STATE = {
  full_name: '',
  email: '',
  mobile_number: '',
  department: '',
  designation: '',
  joining_date: '',
  status: 'Active',
};

export default function EmployeeForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting,
  mode = 'add',
}) {
  const [formData, setFormData] = useState({
    ...INITIAL_STATE,
    ...(initialData ? {
      ...initialData,
      joining_date: formatDateForInput(initialData.joining_date),
    } : {}),
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);

    // Real-time validation for touched fields
    if (touched[field]) {
      const { errors: validationErrors } = validateEmployeeForm(newData);
      setErrors(prev => ({
        ...prev,
        [field]: validationErrors[field] || undefined,
      }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const { errors: validationErrors } = validateEmployeeForm(formData);
    setErrors(prev => ({
      ...prev,
      [field]: validationErrors[field] || undefined,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {});
    setTouched(allTouched);

    const { isValid, errors: validationErrors } = validateEmployeeForm(formData);
    setErrors(validationErrors);

    if (!isValid) return;

    await onSubmit(formData);
  };

  const renderField = (field, label, type = 'text', options = null) => {
    const hasError = touched[field] && errors[field];
    const inputId = `field-${field}`;

    return (
      <div className={cn('form-field', { 'form-field--error': !!hasError })}>
        <label className="form-field__label" htmlFor={inputId}>
          {label}
          <span className="form-field__required">*</span>
        </label>

        {type === 'select' && options ? (
          <select
            id={inputId}
            value={formData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            className={cn('form-field__select', { 'form-field__input--error': !!hasError })}
          >
            <option value="">Select {label}</option>
            {options.map((opt) => (
              <option key={typeof opt === 'object' ? opt.value : opt} value={typeof opt === 'object' ? opt.value : opt}>
                {typeof opt === 'object' ? opt.label : opt}
              </option>
            ))}
          </select>
        ) : type === 'date' ? (
          <input
            id={inputId}
            type="date"
            value={formData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            className={cn('form-field__input', { 'form-field__input--error': !!hasError })}
            max={new Date().toISOString().split('T')[0]}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            value={formData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            onBlur={() => handleBlur(field)}
            className={cn('form-field__input', { 'form-field__input--error': !!hasError })}
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        )}

        {hasError && (
          <span className="form-field__error">{errors[field]}</span>
        )}
      </div>
    );
  };

  return (
    <form className="employee-form" onSubmit={handleSubmit} noValidate>
      <div className="employee-form__grid">
        {renderField('full_name', 'Full Name', 'text')}
        {renderField('email', 'Email Address', 'email')}
        {renderField('mobile_number', 'Mobile Number', 'tel')}
        {renderField('department', 'Department', 'select', DEPARTMENTS)}
        {renderField('designation', 'Designation', 'select', DESIGNATIONS)}
        {renderField('joining_date', 'Joining Date', 'date')}
        {renderField('status', 'Status', 'select', [
          { value: EMPLOYEE_STATUS.ACTIVE, label: 'Active' },
          { value: EMPLOYEE_STATUS.INACTIVE, label: 'Inactive' },
        ])}
      </div>

      <div className="employee-form__actions">
        {onCancel && (
          <button type="button" className="btn btn--secondary" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="btn__spinner" />
              {mode === 'add' ? 'Creating...' : 'Updating...'}
            </>
          ) : (
            mode === 'add' ? 'Create Employee' : 'Update Employee'
          )}
        </button>
      </div>
    </form>
  );
}
