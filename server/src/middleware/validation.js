const { DEPARTMENTS, DESIGNATIONS, EMPLOYEE_STATUS, ERROR_MESSAGES } = require('../constants');
const { isValidEmail, isValidMobile, sanitizeString } = require('../utils/helpers');

/**
 * Validate employee creation/update request body
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next middleware function
 */
function validateEmployee(req, res, next) {
  const errors = [];
  const { full_name, email, mobile_number, department, designation, joining_date, status } = req.body;

  // Validate full_name
  if (!full_name || !sanitizeString(full_name)) {
    errors.push({ field: 'full_name', message: ERROR_MESSAGES.NAME_REQUIRED });
  }

  // Validate email
  if (!email || !sanitizeString(email)) {
    errors.push({ field: 'email', message: ERROR_MESSAGES.EMAIL_REQUIRED });
  } else if (!isValidEmail(email)) {
    errors.push({ field: 'email', message: ERROR_MESSAGES.INVALID_EMAIL });
  }

  // Validate mobile_number
  if (!mobile_number || !sanitizeString(mobile_number)) {
    errors.push({ field: 'mobile_number', message: ERROR_MESSAGES.MOBILE_REQUIRED });
  } else if (!isValidMobile(mobile_number.replace(/\D/g, ''))) {
    errors.push({ field: 'mobile_number', message: ERROR_MESSAGES.INVALID_MOBILE });
  }

  // Validate department
  if (!department || !sanitizeString(department)) {
    errors.push({ field: 'department', message: ERROR_MESSAGES.DEPARTMENT_REQUIRED });
  } else if (!DEPARTMENTS.includes(department)) {
    errors.push({ field: 'department', message: ERROR_MESSAGES.INVALID_DEPARTMENT });
  }

  // Validate designation
  if (!designation || !sanitizeString(designation)) {
    errors.push({ field: 'designation', message: ERROR_MESSAGES.DESIGNATION_REQUIRED });
  } else if (!DESIGNATIONS.includes(designation)) {
    errors.push({ field: 'designation', message: ERROR_MESSAGES.INVALID_DESIGNATION });
  }

  // Validate joining_date
  if (!joining_date) {
    errors.push({ field: 'joining_date', message: ERROR_MESSAGES.JOINING_DATE_REQUIRED });
  } else {
    const date = new Date(joining_date);
    if (isNaN(date.getTime())) {
      errors.push({ field: 'joining_date', message: 'Invalid date format' });
    }
  }

  // Validate status
  if (!status) {
    errors.push({ field: 'status', message: ERROR_MESSAGES.STATUS_REQUIRED });
  } else if (!Object.values(EMPLOYEE_STATUS).includes(status)) {
    errors.push({ field: 'status', message: ERROR_MESSAGES.INVALID_STATUS });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // Sanitize and attach validated data
  req.validatedBody = {
    full_name: sanitizeString(full_name),
    email: sanitizeString(email).toLowerCase(),
    mobile_number: mobile_number.replace(/\D/g, ''),
    department: sanitizeString(department),
    designation: sanitizeString(designation),
    joining_date: new Date(joining_date).toISOString().split('T')[0],
    status: sanitizeString(status),
  };

  next();
}

module.exports = { validateEmployee };
