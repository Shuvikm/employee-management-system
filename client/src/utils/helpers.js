/**
 * Format a date string to a readable format
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format date for input field (YYYY-MM-DD)
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
export function formatDateForInput(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toISOString().split('T')[0];
}

/**
 * Format mobile number to display format
 * @param {string} mobile - Raw mobile number
 * @returns {string}
 */
export function formatMobile(mobile) {
  if (!mobile) return '—';
  const cleaned = mobile.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  return mobile;
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '...';
}

/**
 * Get greeting based on time of day
 * @returns {string}
 */
export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

/**
 * Debounce a function
 * @param {function} fn
 * @param {number} delay
 * @returns {function}
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Class names builder (like clsx)
 * @param {...(string|object|boolean)} args
 * @returns {string}
 */
export function cn(...args) {
  return args
    .filter(Boolean)
    .map(arg => {
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'object') {
        return Object.entries(arg)
          .filter(([, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
}

/**
 * Copy text to clipboard
 * @param {string} text
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

/**
 * Generate filename with timestamp
 * @param {string} prefix
 * @returns {string}
 */
export function generateFilename(prefix = 'export') {
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
  return `${prefix}-${date}_${time}`;
}

/**
 * Export data to CSV
 * @param {Array<Object>} data - Array of objects
 * @param {Array<{key: string, label: string}>} columns - Column definitions
 * @param {string} filename - Output filename (without extension)
 */
export function exportToCSV(data, columns, filename) {
  if (!data || !data.length || !columns || !columns.length) return;

  // Header row
  const headerRow = columns.map(col => {
    const label = col.label || col.key;
    return `"${label.replace(/"/g, '""')}"`;
  }).join(',');

  // Data rows
  const dataRows = data.map(row => {
    return columns.map(col => {
      const value = row[col.key];
      if (value === null || value === undefined) return '';
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',');
  }).join('\n');

  const csv = `${headerRow}\n${dataRows}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename || generateFilename()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Group array by key
 * @param {Array} array
 * @param {string|function} keyFn
 * @returns {Object}
 */
export function groupBy(array, keyFn) {
  const key = typeof keyFn === 'function' ? keyFn : (item) => item[keyFn];
  return array.reduce((acc, item) => {
    const groupKey = key(item);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
}
