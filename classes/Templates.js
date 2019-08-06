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

class Templates {
    constructor(username,password) {
      this.username = username;
      this.password = password;
    }

    Save (title,content,groupid,commitby,callback) {
      const query = `INSERT INTO Templates (Title,Content,GroupID,CreatedBy,UpdatedBy,CreatedDate,UpdatedDate)
      VALUES ("${escape(title)}","${escape(content)}",${groupid},"${commitby}","${commitby}",NOW(),NOW())`;
      con.query(query,(err, result, fields)=>{
        if (err) {
          callback(err);
        } else {
          callback(result);
        }
      });
    }

    Search (ID='',callback) {
      console.log(ID);
      const where = ID!=='' ? `ID=${ID} and `:''
      console.log('ID')
      const query = `Select * from Templates where ${where} Deleted=0`;
      console.log(query);
      con.query(query,(err, result, fields)=>{
        if (err) {
          callback(err);
        } else {
          callback(result);
        }
      });
    }

    Update (ID,content,commitby,callback) {
      const query = `UPDATE Templates SET Content="${escape(content)}", UpdatedBy="${commitby}",UpdatedDate=NOW() where ID="${ID}" and Deleted=0`;
      console.log(query);
      con.query(query,(err, result, fields)=>{
        console.log(err,result)
        if (err) {
          callback(err);
        } else {
          callback(result);
        }
      });
    }

    Delete (ID,commitby,callback) {
      
      const query = `UPDATE Templates SET Deleted=1,UpdatedBy="${commitby}" where ID="${ID}" and Deleted=0`;
      con.query(query,(err, result, fields)=>{
        if (err) {
          callback(err);
        } else {
          callback(result);
        }
      });
    }

    CreateGroup(Title,commitby,callback) {
      console.log(Title,commitby)
      const query = `INSERT INTO TemplateGroups (Title,CreatedBy,UpdatedBy,CreatedDate,UpdatedDate,Deleted) VALUES ("${Title}",${commitby},${commitby},NOW(),NOW(),0)`;
      con.query(query,(err, result, fields)=>{
        if (err) {
          callback(err);
        } else {
          callback(result);
        }
      });
    }

    GetGroup(ID=null,callback) {
      const query = `SELECT * FROM TemplateGroups WHERE ${ID?`ID=${ID} AND`:``} Deleted=0`
      con.query(query,(err, result, fields)=>{
        if (err) {
          callback(err);
        } else {
          callback(result);
        }
      });
    }

    UpdateGroup(ID,Title,commitby,callback) {
      const query = `UPDATE TemplateGroups SET Title="${Title}", UpdatedBy="${commitby}", UpdatedDate=NOW() WHERE ID=${ID} AND Deleted=0`
      con.query(query,(err, result, fields)=>{
        if (err) {
          callback(err);
        } else {
          callback(result);
        }
      });
    }

    DeleteGroup(ID,commitby,callback) {
      const query = `UPDATE TemplateGroups SET Deleted="1", UpdatedBy="${commitby}", UpdatedDate=NOW() WHERE ID=${ID} AND Deleted=0`
      con.query(query,(err, result, fields)=>{
        if (err) {
          callback(err);
        } else {
          callback(result);
        }
      });
    }
}


module.exports = Templates;