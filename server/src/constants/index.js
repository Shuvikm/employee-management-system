const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'Sales',
  'Human Resources',
  'Finance',
  'Operations',
  'Design',
  'Customer Support',
  'Legal',
  'Product',
];

const DESIGNATIONS = [
  'Junior Developer',
  'Senior Developer',
  'Team Lead',
  'Manager',
  'Director',
  'VP',
  'CTO',
  'CEO',
  'Designer',
  'Analyst',
  'Coordinator',
  'Specialist',
  'Associate',
  'Intern',
];

const EMPLOYEE_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  EMPLOYEE_NOT_FOUND: 'Employee not found',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_MOBILE: 'Invalid mobile number. Must be 10 digits',
  NAME_REQUIRED: 'Full name is required',
  EMAIL_REQUIRED: 'Email address is required',
  MOBILE_REQUIRED: 'Mobile number is required',
  DEPARTMENT_REQUIRED: 'Department is required',
  DESIGNATION_REQUIRED: 'Designation is required',
  JOINING_DATE_REQUIRED: 'Joining date is required',
  STATUS_REQUIRED: 'Status is required',
  INVALID_STATUS: 'Status must be Active or Inactive',
  INVALID_DEPARTMENT: 'Invalid department',
  INVALID_DESIGNATION: 'Invalid designation',
  EMAIL_EXISTS: 'An employee with this email already exists',
  INTERNAL_ERROR: 'An internal server error occurred',
};

module.exports = {
  DEPARTMENTS,
  DESIGNATIONS,
  EMPLOYEE_STATUS,
  HTTP_STATUS,
  ERROR_MESSAGES,
};
