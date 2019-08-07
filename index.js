const dotenv = require('dotenv');
const express = require('express');
const Login = require('./classes/Login')
const Users = require('./classes/Users')
const Templates = require('./classes/Templates')
const Messages = require('./classes/Messages')
const bodyParser = require('body-parser');
const formidable = require('formidable');
const fs = require('fs')

dotenv.config();
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
next();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

app.get('/', (req, res) => {
    return res.send('Received a GET HTTP method');
});

app.post('/', (req, res) => {
    return res.send('Received a POST HTTP method');
});

app.put('/', (req, res) => {
    return res.send('Received a PUT HTTP method');
});

app.delete('/', (req, res) => {
    return res.send('Received a DELETE HTTP method');
});

app.listen(process.env.PORT, () =>
    console.log(`Example app listening on port ${process.env.PORT}!`),
);


//LOGIN

app.post('/login',(req,res) => {
    let username,password;
    try {
        username=req.body.username;
        password=req.body.password;
        new Login(username,password).Authenticate(function(data){res.send(data)})
    } catch (e) {
        res.send(e)
    }
})


//USERS

app.get('/users/',async (req,res)=>{
    try {
        const users = new Users()
        users.Search(function(data){
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})

app.get('/users/:ID',(req,res)=>{
    try{
        const users = new Users();
        users.SearchOne(req.params.ID,function(data){
            res.send(data)
        })
    } catch(e) {
        res.send(e)
    }
})

app.delete('/users/:ID',(req,res)=>{
    try{
        const users = new Users();
        users.Delete(req.params.ID,function(data){res.send(data)})
    } catch(e) {
        res.send(e)
    }
})

app.post('/users/register',(req,res)=>{
    try {
        const {username,password,firstname,lastname,designation,permissionlevel,commitby} = req.body;
        new Users().Register(username,password,firstname,lastname,designation,permissionlevel,commitby,function(data){res.send(data)})
    } catch(e) {
        res.send(e)
    }
})

app.post('/users/update/:ID',(req,res)=>{
    try {
        const {username,firstname,lastname,designation,permissionlevel,commitby} = req.body;
        const ID = req.params.ID
        new Users().Update(ID,{username,firstname,lastname,designation,permissionlevel,commitby},function(data){
            res.send(data)
        })
    } catch(e) {
        res.send(e)
    }
})

app.post('/users/update/password/:ID',(req,res)=>{
    try{
        const {password,commitby} = req.body;
        const ID = req.params.ID;
        new Users().ChangePassword(ID,password,commitby,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})

//templates

app.post('/templates/create/',(req,res)=>{
    try{
        const {title,content,groupid,commitby} = req.body;
        new Templates().Save(title,content,groupid,commitby,(data)=>{
            res.send( data.length>1 ? data[0] : data);
        })
    } catch(e) {
        res.send(e)
    }
})

app.get('/templates/search/:ID?',(req,res)=>{
    try{
        const ID = req.params.ID;
        if (!ID) {
        }
        new Templates().Search(ID,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})

app.post('/templates/update/:ID?',(req,res)=>{
    try{
        const ID = req.params.ID;
        const {content,commitby} = req.body;
        if (!ID) {
        }
        new Templates().Update(ID,content,commitby,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})

app.post('/templates/delete/:ID?',(req,res)=>{
    try{
        const ID = req.params.ID;
        const {commitby} = req.body;
        if (!ID) {
        }
        new Templates().Delete(ID,commitby,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})

app.post('/templates/groups/create',(req,res)=>{
    try{
        const {title,commitby} = req.body;
        new Templates().CreateGroup(title,commitby,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})

app.get('/templates/groups/:ID?',(req,res)=>{
    try{
        const ID = req.params.ID;
        new Templates().GetGroup(ID,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})

app.post('/templates/groups/:ID?',(req,res)=>{
    try{
        const ID = req.params.ID;
        const {title,commitby} = req.body;
        new Templates().UpdateGroup(ID,title,commitby,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})

app.delete('/templates/groups/:ID?',(req,res)=>{
    try{
        const ID = req.params.ID;
        const {commitby} = req.body;
        new Templates().DeleteGroup(ID,commitby,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})



//messages

app.post('/messages/save/',(req,res)=>{
    try{
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            fileContent = fs.readFileSync(files.csvfile.path, {encoding: 'utf8'});
            new Messages().Create(fields.title,fields.content,fileContent,fields.commitby,(data)=>{
                res.send(data)
            });
        });
    } catch(e) {
        res.send(e)
    }
})

app.get('/messages/get/:ID?',(req,res)=>{
    try{
        const ID = req.params.ID;
        console.log(ID);
        new Messages().Select(ID,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})

app.get('/messages/delete/:ID?',(req,res)=>{
    try{
        const ID = req.params.ID;
        console.log(ID);
        new Messages().Delete(ID,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})

app.post('/messages/groups/create',(req,res)=>{
    try{
        const {title,commitby} = req.body;
        new Messages().CreateGroup(title,commitby,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})



app.get('/messages/groups/:ID?',(req,res)=>{
    console.log('eut')
    try{
        const ID = req.params.ID;
        new Messages().GetGroup(ID,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})

app.post('/messages/groups/:ID?',(req,res)=>{
    try{
        const ID = req.params.ID;
        const {title,commitby} = req.body;
        new Messages().UpdateGroup(ID,title,commitby,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})

app.delete('/messages/groups/:ID?',(req,res)=>{
    try{
        const ID = req.params.ID;
        const {commitby} = req.body;
        new Messages().DeleteGroup(ID,commitby,(data)=>{
            res.send(data);
        })
    } catch(e) {
        res.send(e)
    }
})