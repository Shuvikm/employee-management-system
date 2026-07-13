const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employee.controller');
const { validateEmployee } = require('../middleware/validation');

// Stats & departments routes (must be before /:id to avoid route conflict)
router.get('/stats', EmployeeController.getStats);
router.get('/departments', EmployeeController.getDepartments);

// Batch operations
router.delete('/batch', EmployeeController.deleteBatch);

// CRUD routes
router.get('/', EmployeeController.getAll);
router.get('/:id', EmployeeController.getById);
router.post('/', validateEmployee, EmployeeController.create);
router.put('/:id', validateEmployee, EmployeeController.update);
router.delete('/:id', EmployeeController.delete);

module.exports = router;
