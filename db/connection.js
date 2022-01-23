const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'Butter9494!',
      database: 'employeedb'
    },
    console.log('Connected to the employeedb database.')
  );


  module.exports = db;