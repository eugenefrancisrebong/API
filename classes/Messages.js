const dotenv = require('dotenv');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

dotenv.config();

const con = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

class Messages {
    constructor(username,password) {
      this.username = username;
      this.password = password;
    }

    Create(title,content,csv,commitby,callback) {
        const query = `INSERT INTO Messages (Title,Content,Data,SentData,CreatedBy,UpdatedBy,CreatedDate,UpdatedDate) VALUES ("${escape(title)}","${escape(content)}","${escape(csv)}","${escape('[]')}","${commitby}","${commitby}",NOW(),NOW())`;
        con.query(query,(err, result, fields)=>{
            if (err) {
                callback(err)
            } else {
                callback(result);
            }
          });
    }

    GetItems(callback) {
      const query = `select ID, Title from Messages where DELETED = 0`
      con.query(query,(err,result,fields)=>{
        if(err){
          callback(err)
        } else {
          callback(result)
        }
      })
    }

    Select(ID,callback) {
      const query = `select Content,Data,SentData from Messages where ID=${ID} AND DELETED = 0`
      con.query(query,(err,result,fields)=>{
        if(err){
          callback(err)
        } else {
          callback(result)
        }
      })
    }

    Delete(ID,callback) {
      const query = `UPDATE Messages set Deleted=1 where ID=${ID} AND DELETED = 0`
      con.query(query,(err,result,fields)=>{
        if(err){
          callback(err)
        } else {
          callback(result)
        }
      })
    }
}


module.exports = Messages;