const mongoose = require('mongoose');

async function getDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }
  
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/employee_db';
  
  try {
    await mongoose.connect(uri);
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

function closeDatabase() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.close();
  }
}

// Kept saveDatabase as a no-op so models/index that import it don't break
function saveDatabase() {
  // No-op for MongoDB
}

module.exports = { getDatabase, closeDatabase, saveDatabase };
