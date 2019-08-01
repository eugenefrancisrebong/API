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
      const query = `SELECT ID,Password,Firstname,Lastname,Designation,PermissionLevel FROM users where Username="${this.username}" and Deleted=0`;
      con.query(query,async (err, result, fields)=>{
        if (err) throw err;
        if(result.length) {
          let returnCall;
          if(bcrypt.compareSync(this.password, result[0].Password)) {
            result[0].Password='';
            returnCall=result[0];
          } else {
            returnCall=false;
          }
          callback(returnCall)
        } else {
          callback(false)
        }
      });
      return 'connection failed';
    }

}


module.exports = Login;