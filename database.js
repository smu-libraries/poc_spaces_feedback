let sequelize = require('sequelize');

let db = new sequelize('poc_spaces_feedback', null, null, {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'poc_spaces_feedback.db'
});

let feedback = db.import(__dirname + '/feedback');

db.sync();
