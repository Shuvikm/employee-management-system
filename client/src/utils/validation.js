/**
 * Validate employee form data
 * @param {object} data - Form data to validate
 * @returns {{ isValid: boolean, errors: object }}
 */
export function validateEmployeeForm(data) {
  const errors = {};

  // Full Name
  if (!data.full_name || !data.full_name.trim()) {
    errors.full_name = 'Full name is required';
  } else if (data.full_name.trim().length < 2) {
    errors.full_name = 'Name must be at least 2 characters';
  } else if (data.full_name.trim().length > 100) {
    errors.full_name = 'Name must be less than 100 characters';
  }

  // Email
  if (!data.email || !data.email.trim()) {
    errors.email = 'Email address is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  // Mobile
  if (!data.mobile_number || !data.mobile_number.trim()) {
    errors.mobile_number = 'Mobile number is required';
  } else {
    const cleaned = data.mobile_number.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      errors.mobile_number = 'Mobile number must be 10 digits';
    } else if (!/^[6-9]/.test(cleaned)) {
      errors.mobile_number = 'Mobile number must start with 6-9';
    }
  }

  // Department
  if (!data.department) {
    errors.department = 'Department is required';
  }

  // Designation
  if (!data.designation) {
    errors.designation = 'Designation is required';
  }

  // Joining Date
  if (!data.joining_date) {
    errors.joining_date = 'Joining date is required';
  }

  // Status
  if (!data.status) {
    errors.status = 'Status is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
