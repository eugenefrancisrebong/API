const dotenv = require('dotenv');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

dotenv.config();

const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

class Login {
    constructor(username,password) {
      this.username = username;
      this.password = password;
    }

    async Authenticate(callback) {
      const query = `SELECT * FROM users where Username="${this.username}" and Deleted=0`;
      con.query(query,async (err, result, fields)=>{
        if (err) throw err;
        callback(bcrypt.compareSync(this.password, result[0].Password))
      });
      return 'connection failed';
    }

}


module.exports = Login;