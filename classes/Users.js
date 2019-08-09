const dotenv = require('dotenv');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

dotenv.config();


const saltRounds = 10;
const con = mysql.createPool({ connectionLimit: 5,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

class Users {
    constructor() {
    }

    Register(username,password,email,firstname,lastname,designation,permissionlevel,commitby,callback) {
      bcrypt.hash(password, 10, async (err, hash) => {
        password =  hash;
        const query = `INSERT INTO users 
        (Username,Password,Email,Firstname,Lastname,Designation,PermissionLevel,CreatedBy,UpdatedBy,CreatedDate,UpdatedDate)
        values
        ("${username}","${password}","${email}","${firstname}","${lastname}","${designation}","${permissionlevel}","${commitby}","${commitby}","NOW()","NOW()")`;
        con.query(query, function (err, result, fields) {
          if (err) callback({error:true,err});
          callback(result);
        });
      });
    }

    Search(callback) {
      // let result;
      con.query(`SELECT ID,Username,Email,Firstname,Lastname,Designation,PermissionLevel,CreatedBy,UpdatedBy,CreatedDate,UpdatedDate FROM users where Deleted="0" `,(err, result, fields) => {
        if (err) callback(err);
        return callback(result);
      });
    }

    SearchOne(ID,callback) {
      // let result;
      con.query(`SELECT ID,Username,Email,Firstname,Lastname,Designation,PermissionLevel,CreatedBy,UpdatedBy,CreatedDate,UpdatedDate FROM users where Deleted="0" and ID="${ID}"`,(err, result, fields) => {
        if (err) callback(err);
        return callback(result);
      });
    }

    Update(ID,payload,callback) {
      const {username,email,firstname,lastname,designation,PermissionLevel,commitby} = payload;
      console.log(payload)
      let updates = '';
      if(email) {
        updates+=`Email="${email}",`
      }
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
      if(PermissionLevel>=0) {
        updates+=`PermissionLevel=${PermissionLevel},`
      }
      let query = `UPDATE users SET ${updates} UpdatedBy="${commitby}", UpdatedDate=NOW() WHERE ID=${ID} and Deleted!=1`
      console.log(query);
      con.query(query,(err, result, fields) => {
        if (err) callback(err);
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
        if (err) callback(err);
        return callback(result);
      });
    }

    VerifyKey(email,key,callback) {
      let query = `call VerifyKey("${email}","${key}")`
      con.query(query,(err,result,fields)=>{
        if(err) {
          console.log({err});
          callback(false)
        } else {
          if(result.length) {
            callback(result[0]);
          } else {
            callback(false)
          }
        }
      })
    }

    ForgotPassword(email,callback) {
      let query = `SELECT * from users where email="${email}" and Deleted=0`
      con.query(query,(err, result, fields) => {
        console.log('1wow',err,result);
        if (err) {
          console.log({err})
          callback({success:false})
        } else {
          if(result.length) {
            let randpass = '';
            const passLength = 6;
            const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const charactersLength = characters.length;
            for ( let i = 0; i < passLength; i++ ) {
              randpass += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            let query = `INSERT INTO PasswordReset (Email,ResetKey,Status,Deleted) VALUES ("${email}","${randpass}",0,0)`
            con.query(query,(err, result, fields) => {
              if (err) {
                console.log({err})
                callback({success:false})
              } else {
                const mailgun = require("mailgun-js");
                const DOMAIN = process.env.MAILGUN_DOMAIN;
                const mg = mailgun({apiKey:  process.env.MAILGUN_KEY, domain: DOMAIN});
                const data = {
                  from: 'personal-message-generator <me@samples.mailgun.org>',
                  to: email,
                  subject: 'Reset Password',
                  text: `The code for Resetting your password is: ${randpass}`
                };
                mg.messages().send(data, function (error, body) {
                  console.log(body);
                  if(error) {
                    console.log({err})
                    callback({success:false})
                  } else {
                    callback({success:true})
                  }
                });
              }
            })
          } else {
            callback({success:false})
          }
        }
      });
    }
    
    ResetPassword(email,key,password,callback){
      bcrypt.hash(password, 10, async (err, hash) => {
        password =  hash;
        const query = `CALL ResetPassword("${email}","${key}","${password}")`;
        con.query(query, function (err, result, fields) {
          if (err) callback({error:true,err});
          console.log(err,result,fields)
          callback(result);
        });
      });
    }

}

module.exports = Users;