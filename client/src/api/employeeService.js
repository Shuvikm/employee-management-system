import { API_BASE_URL } from '../constants';
import { CLIENT_ID } from '../socket';

class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || 'An unexpected error occurred',
      response.status,
      data.errors || []
    );
  }

  return data;
}

const EmployeeService = {
  /**
   * Get all employees with optional filters and pagination
   * @param {{ search?: string, department?: string, status?: string, page?: number, pageSize?: number }} filters
   * @returns {Promise<{ success: boolean, data: Array, count: number, total: number, page: number, pageSize: number }>}
   */
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.department) params.append('department', filters.department);
    if (filters.status) params.append('status', filters.status);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', filters.page);
    if (filters.pageSize) params.append('pageSize', filters.pageSize);

    const queryString = params.toString();
    const url = `${API_BASE_URL}/employees${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Get employee by ID
   * @param {number} id
   * @returns {Promise<{ success: boolean, data: object }>}
   */
  async getById(id) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`);
    return handleResponse(response);
  },

  /**
   * Get dashboard statistics
   * @returns {Promise<{ success: boolean, data: { total: number, active: number, inactive: number, departmentStats: Array } }>}
   */
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/employees/stats`);
    return handleResponse(response);
  },

  /**
   * Get distinct departments
   * @returns {Promise<{ success: boolean, data: string[] }>}
   */
  async getDepartments() {
    const response = await fetch(`${API_BASE_URL}/employees/departments`);
    return handleResponse(response);
  },

  /**
   * Create a new employee
   * @param {object} employeeData
   * @returns {Promise<{ success: boolean, message: string, data: object }>}
   */
  async create(employeeData) {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Client-ID': CLIENT_ID 
      },
      body: JSON.stringify(employeeData),
    });
    return handleResponse(response);
  },

  /**
   * Update an existing employee
   * @param {number} id
   * @param {object} employeeData
   * @returns {Promise<{ success: boolean, message: string, data: object }>}
   */
  async update(id, employeeData) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'X-Client-ID': CLIENT_ID 
      },
      body: JSON.stringify(employeeData),
    });
    return handleResponse(response);
  },

  /**
   * Delete an employee
   * @param {number} id
   * @returns {Promise<{ success: boolean, message: string }>}
   */
  async delete(id) {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: 'DELETE',
      headers: { 'X-Client-ID': CLIENT_ID },
    });
    return handleResponse(response);
  },

  /**
   * Delete multiple employees
   * @param {number[]} ids
   * @returns {Promise<{ success: boolean, message: string, count: number }>}
   */
  async deleteBatch(ids) {
    const response = await fetch(`${API_BASE_URL}/employees/batch`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'X-Client-ID': CLIENT_ID 
      },
      body: JSON.stringify({ ids }),
    });
    return handleResponse(response);
  },
};

export { ApiError };
export default EmployeeService;
