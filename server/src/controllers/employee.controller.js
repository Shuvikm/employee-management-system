const EmployeeModel = require('../models/employee.model');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../constants');

const EmployeeController = {
  /**
   * GET /api/employees
   * Get all employees with optional search/filter/pagination
   */
  async getAll(req, res, next) {
    try {
      const { search, department, status, sort, page, pageSize } = req.query;
      const filters = {};

      if (search) filters.search = search.trim();
      if (department) filters.department = department.trim();
      if (status) filters.status = status.trim();
      if (sort) filters.sort = sort.trim();
      if (page) filters.page = page;
      if (pageSize) filters.pageSize = pageSize;

      const employees = await EmployeeModel.getAll(filters);
      const total = await EmployeeModel.getAllCount(filters);

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: employees,
        count: employees.length,
        total,
        page: parseInt(page, 10) || 1,
        pageSize: parseInt(pageSize, 10) || employees.length || total,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/employees/stats
   * Get dashboard statistics
   */
  async getStats(req, res, next) {
    try {
      const stats = await EmployeeModel.getStats();
      const departmentStats = await EmployeeModel.getDepartmentStats();
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: {
          ...stats,
          departmentStats,
        },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/employees/departments
   * Get distinct departments
   */
  async getDepartments(req, res, next) {
    try {
      const departments = await EmployeeModel.getDepartments();
      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: departments.map(d => d.department),
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /api/employees/:id
   * Get a single employee by ID
   */
  async getById(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Invalid employee ID',
        });
      }

      const employee = await EmployeeModel.getById(id);
      if (!employee) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.EMPLOYEE_NOT_FOUND,
        });
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        data: employee,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /api/employees
   * Create a new employee
   */
  async create(req, res, next) {
    try {
      const { validatedBody } = req;

      // Check if email already exists
      const existing = await EmployeeModel.getByEmail(validatedBody.email);
      if (existing) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.EMAIL_EXISTS,
          errors: [{ field: 'email', message: ERROR_MESSAGES.EMAIL_EXISTS }],
        });
      }

      const employee = await EmployeeModel.create(validatedBody);

      // Emit socket event
      if (req.io) {
        req.io.emit('employee:created', { 
          data: employee, 
          originClientId: req.headers['x-client-id'] 
        });
      }

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'Employee created successfully',
        data: employee,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PUT /api/employees/:id
   * Update an existing employee
   */
  async update(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Invalid employee ID',
        });
      }

      // Check if employee exists
      const existing = await EmployeeModel.getById(id);
      if (!existing) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.EMPLOYEE_NOT_FOUND,
        });
      }

      const { validatedBody } = req;

      // Check if email already exists (excluding current employee)
      const emailExists = await EmployeeModel.getByEmail(validatedBody.email);
      if (emailExists && emailExists.id !== id) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: ERROR_MESSAGES.EMAIL_EXISTS,
          errors: [{ field: 'email', message: ERROR_MESSAGES.EMAIL_EXISTS }],
        });
      }

      const updated = await EmployeeModel.update(id, validatedBody);

      // Emit socket event
      if (req.io) {
        req.io.emit('employee:updated', { 
          data: updated, 
          originClientId: req.headers['x-client-id'] 
        });
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Employee updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/employees/:id
   * Delete an employee
   */
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Invalid employee ID',
        });
      }

      const deleted = await EmployeeModel.delete(id);
      if (!deleted) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          success: false,
          message: ERROR_MESSAGES.EMPLOYEE_NOT_FOUND,
        });
      }

      // Emit socket event
      if (req.io) {
        req.io.emit('employee:deleted', { 
          id, 
          originClientId: req.headers['x-client-id'] 
        });
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: 'Employee deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /api/employees/batch
   * Delete multiple employees
   */
  async deleteBatch(req, res, next) {
    try {
      const { ids } = req.body;
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'No employee IDs provided',
        });
      }

      const validIds = ids.filter(id => id);
      if (validIds.length === 0) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: 'Invalid employee IDs',
        });
      }

      const deleted = await EmployeeModel.deleteMany(validIds);

      // Emit socket event
      if (req.io && deleted > 0) {
        validIds.forEach(id => req.io.emit('employee:deleted', { 
          id, 
          originClientId: req.headers['x-client-id'] 
        }));
      }

      return res.status(HTTP_STATUS.OK).json({
        success: true,
        message: `${deleted} employee(s) deleted successfully`,
        count: deleted,
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = EmployeeController;
