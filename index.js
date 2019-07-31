const dotenv = require('dotenv');
const express = require('express');
const Login = require('./classes/Login')
const Users = require('./classes/Users')

dotenv.config();
const app = express();


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
        username=req.headers.username;
        password=req.headers.password;
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
        const {username,password,firstname,lastname,designation,permissionlevel,commitby} = req.headers;
        new Users().Register(username,password,firstname,lastname,designation,permissionlevel,commitby)
    } catch(e) {

    }
})

app.post('/users/update/:ID',(req,res)=>{
    try {
        const {username,password,firstname,lastname,designation,permissionlevel,commitby} = req.headers;
        const ID = req.params.ID
        new Users().Update(ID,{username,password,firstname,lastname,designation,permissionlevel,commitby},function(data){
            res.send(data)
        })
    } catch(e) {

    }
})