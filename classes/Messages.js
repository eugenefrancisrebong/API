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
}


module.exports = Messages;