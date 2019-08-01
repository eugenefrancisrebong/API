const dotenv = require('dotenv');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

dotenv.config();


const saltRounds = 10;
const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

class Users {
    constructor() {
    }

    Register(username,password,firstname,lastname,designation,permissionlevel,commitby,callback) {
      bcrypt.hash(password, 10, async (err, hash) => {
        password =  hash;
        const query = `INSERT INTO users 
        (Username,Password,Firstname,Lastname,Designation,PermissionLevel,CreatedBy,UpdatedBy,CreatedDate,UpdatedDate)
        values
        ("${username}","${password}","${firstname}","${lastname}","${designation}","${permissionlevel}","${commitby}","${commitby}","NOW()","NOW()")`;
        con.query(query, function (err, result, fields) {
          if (err) callback({error:true,err});
          callback(result);
        });
      });
    }

    Search(callback) {
      // let result;
      con.query(`SELECT ID,Username,Firstname,Lastname,Designation,PermissionLevel,CreatedBy,UpdatedBy,CreatedDate,UpdatedDate FROM users where Deleted="0" `,(err, result, fields) => {
        if (err) throw err;
        return callback(result);
      });
    }

    SearchOne(ID,callback) {
      // let result;
      con.query(`SELECT ID,Username,Firstname,Lastname,Designation,PermissionLevel,CreatedBy,UpdatedBy,CreatedDate,UpdatedDate FROM users where Deleted="0" and ID="${ID}"`,(err, result, fields) => {
        if (err) throw err;
        return callback(result);
      });
    }

    Update(ID,payload,callback) {
      const {username,firstname,lastname,designation,permissionlevel,commitby} = payload;
      let updates = '';
      if(username) {
        updates+=`Username="${username}",`
      }
      if(firstname) {
        updates+=`FirstName="${firstname}",`
      }
      if(lastname) {
        updates+=`LastName="${lastname}",`
      }
      if(designation) {
        updates+=`Designation="${designation}",`
      }
      if(permissionlevel) {
        updates+=`PermissionLevel="${permissionlevel}",`
      }
      let query = `UPDATE users SET ${updates} UpdatedBy="${commitby}", UpdatedDate=NOW() WHERE ID=${ID} and Deleted!=1`
      console.log(query);
      con.query(query,(err, result, fields) => {
        if (err) throw err;
        return callback(result);
      });
    }

    ChangePassword(ID,password,commitby,callback) {
      bcrypt.hash(password, 10, async (err, hash) => {
        password =  hash;
        let query = `UPDATE users SET Password="${password}", UpdatedBy="${commitby}", UpdatedDate=NOW() WHERE ID=${ID} and Deleted!=1`
        con.query(query, function (err, result, fields) {
          if (err) callback({error:true,err:err});
          callback(result);
        });
      });
    }

    Delete(ID,callback) {
      let query = `UPDATE users SET Deleted = 1 WHERE ID=${ID} and Deleted!=1`
      con.query(query,(err, result, fields) => {
        if (err) throw err;
        return callback(result);
      });
    }

}

module.exports = Users;