const dotenv = require('dotenv');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

dotenv.config();

const con = mysql.createPool({ connectionLimit: 5,
  host: process.env.HOST,
  user: process.env.DB_USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

class Messages {
    constructor(username,password) {
      this.username = username;
      this.password = password;
    }

    Create(title,content,csv,groupID,commitby,callback) {
        const query = `call InsertMessages("${escape(title)}","${escape(content)}","${escape(csv)}","${escape('[]')}",${groupID},"${commitby}")`;
        con.query(query,(err, result, fields)=>{
          console.log(result)
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
      const query = `select ID,GroupID,Title,Content,Data,SentData from Messages where ${ID ? ` ID=${ID} AND` : ''} DELETED = 0`
      con.query(query,(err,result,fields)=>{
        if(err){
          callback(err)
        } else {
          callback(result)
        }
      })
    }

    UpdateSent(ID,SentData,commitby,callback) {
      const query = `UPDATE Messages set SentData="${SentData}",UpdatedBy=${commitby},UpdatedDate=NOW() where ID=${ID} AND DELETED = 0`
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

    CreateGroup(Title,commitby,callback) {
      const query = `call InsertMessageGroup("${Title}",${commitby})`;
      con.query(query,(err, result, fields)=>{
        if (err) {
          callback(err);
        } else {
          callback(result);
        }
      });
    }

    GetGroup(ID=null,callback) {
      const query = `SELECT * FROM MessageGroups WHERE ${ID?`ID=${ID} AND`:``} Deleted=0`
      console.log(query)
      con.query(query,(err, result, fields)=>{
        if (err) {
          callback(err);
        } else {
          callback(result);
        }
      });
    }

    UpdateGroup(ID,Title,commitby,callback) {
      const query = `UPDATE MessageGroups SET Title="${Title}", UpdatedBy="${commitby}", UpdatedDate=NOW() WHERE ID=${ID} AND Deleted=0`
      con.query(query,(err, result, fields)=>{
        if (err) {
          callback(err);
        } else {
          callback(result);
        }
      });
    }

    DeleteGroup(ID,commitby,callback) {
      const query = `UPDATE MessageGroups SET Deleted="1", UpdatedBy="${commitby}", UpdatedDate=NOW() WHERE ID=${ID} AND Deleted=0`
      con.query(query,(err, result, fields)=>{
        if (err) {
          callback(err);
        } else {
          callback(result);
        }
      });
    }
}


module.exports = Messages;