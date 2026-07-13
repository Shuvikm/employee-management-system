/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Indian mobile number (10 digits)
 * @param {string} mobile
 * @returns {boolean}
 */
function isValidMobile(mobile) {
  const mobileRegex = /^[6-9]\d{9}$/;
  return mobileRegex.test(mobile);
}

/**
 * Sanitize string input - trim and remove extra spaces
 * @param {string} str
 * @returns {string}
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/\s+/g, ' ');
}

/**
 * Parse pagination parameters
 * @param {number} page
 * @param {number} limit
 * @returns {{ offset: number, limit: number }}
 */
function parsePagination(page = 1, limit = 10) {
  const p = Math.max(1, parseInt(page) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit) || 10));
  return { offset: (p - 1) * l, limit: l };
}

function buildFilterQuery(filters) {
  const query = {};

  if (filters.search) {
    query.full_name = { $regex: filters.search, $options: 'i' };
  }

  if (filters.department) {
    query.department = filters.department;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  return query;
}

module.exports = {
  isValidEmail,
  isValidMobile,
  sanitizeString,
  parsePagination,
  buildFilterQuery,
};
