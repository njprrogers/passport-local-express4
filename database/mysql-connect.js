const mysql = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : ''
});

connection.query('USE satbase'); 
module.exports = connection;