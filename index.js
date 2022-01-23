
const db = require('./db/connection');
const allQuestions = require('./Questions/questions')


  // Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
     allQuestions();
  });


