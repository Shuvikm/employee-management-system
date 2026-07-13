const mongoose = require('mongoose');
const { buildFilterQuery } = require('../utils/helpers');

const employeeSchema = new mongoose.Schema({
  full_name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile_number: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  joining_date: { type: String, required: true },
  status: { type: String, required: true, enum: ['Active', 'Inactive'], default: 'Active' },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

const Employee = mongoose.model('Employee', employeeSchema);

const EmployeeModel = {
  async getAll(filters = {}) {
    const query = buildFilterQuery(filters);
    let mQuery = Employee.find(query).sort({ created_at: -1 });

    if (filters.page && filters.pageSize) {
      const page = Math.max(1, parseInt(filters.page, 10));
      const pageSize = Math.min(100, Math.max(1, parseInt(filters.pageSize, 10)));
      const offset = (page - 1) * pageSize;
      mQuery = mQuery.skip(offset).limit(pageSize);
    }

    const docs = await mQuery.exec();
    return docs.map(doc => doc.toObject());
  },

  async getAllCount(filters = {}) {
    const query = buildFilterQuery(filters);
    return await Employee.countDocuments(query);
  },

  async getById(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await Employee.findById(id);
    return doc ? doc.toObject() : null;
  },

  async getByEmail(email) {
    const doc = await Employee.findOne({ email });
    return doc ? doc.toObject() : null;
  },

  async create(data) {
    const doc = await Employee.create(data);
    return doc.toObject();
  },

  async update(id, data) {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await Employee.findByIdAndUpdate(id, data, { new: true });
    return doc ? doc.toObject() : null;
  },

  async delete(id) {
    if (!mongoose.isValidObjectId(id)) return false;
    const result = await Employee.findByIdAndDelete(id);
    return !!result;
  },

  async deleteMany(ids) {
    const validIds = ids.filter(id => mongoose.isValidObjectId(id));
    if (!validIds.length) return 0;
    const result = await Employee.deleteMany({ _id: { $in: validIds } });
    return result.deletedCount;
  },

  async getStats() {
    const total = await Employee.countDocuments();
    const active = await Employee.countDocuments({ status: 'Active' });
    const inactive = await Employee.countDocuments({ status: 'Inactive' });
    return { total, active, inactive };
  },

  async getDepartments() {
    const deps = await Employee.distinct('department');
    return deps.map(department => ({ department })).sort((a, b) => a.department.localeCompare(b.department));
  },

  async getDepartmentStats() {
    return await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $project: { name: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);
  },
};

module.exports = EmployeeModel;
