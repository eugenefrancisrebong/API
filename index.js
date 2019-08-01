const dotenv = require('dotenv');
const express = require('express');
const Login = require('./classes/Login')
const Users = require('./classes/Users')
var bodyParser = require('body-parser');

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
        return 'incomplete parameters'
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

    }
})

app.get('/users/:ID',(req,res)=>{
    try{
        const users = new Users();
        users.SearchOne(req.params.ID,function(data){
            res.send(data)
        })
    } catch(e) {

    }
})

app.delete('/users/:ID',(req,res)=>{
    try{
        const users = new Users();
        users.Delete(req.params.ID,function(data){res.send(data)})
    } catch(e) {

    }
})

app.post('/users/register',(req,res)=>{
    try {
        const {username,password,firstname,lastname,designation,permissionlevel,commitby} = req.body;
        new Users().Register(username,password,firstname,lastname,designation,permissionlevel,commitby,function(data){res.send(data)})
    } catch(e) {

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

    }
})