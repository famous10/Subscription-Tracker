var mongoose = require('mongoose');
var { DB_URI, NODE_ENV } = require('../config/env');

var connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Connected to MongoDB successfully in ${NODE_ENV} mode`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectToDatabase;
