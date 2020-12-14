var express = require('express');
const app = express();
var mysql = require('mysql');
var bodyparser = require('body-parser');
var connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database: 'onlineshoestore'
});
var jsonParser = bodyparser.json()
var urlencodedParser = bodyparser.urlencoded({ extended: false })

app.post('/register', urlencodedParser, function (req, res) {
    var fullname=req.body.fullname;
    var email=req.body.email;
    var pass=req.body.password;
    var address=req.body.address;
    var contact=req.body.contact;

    console.log(email+" "+pass);
    connection.query("SELECT * FROM users WHERE email = ?",[email],function(err,result,fields){
        connection.on('error',(err)=>{
            console.log("[MySQL ERROR",err);
        });
        if(result && result.length){
            res.json("User already exists");
        }
        else{
            var insert_cmd = "INSERT INTO users(fullname,email,password,address,contact) values (?,?,?,?,?)";
            values = [fullname,email,pass,address,contact];
            console.log("executing "+insert_cmd);
            connection.query(insert_cmd,values,(err,results,fields)=>{
                connection.on('err',(err)=>{
                    console.log("[MySQL ERROR]", err);
                });
                res.json("User has Registered");
                console.log("Registration successfull");
            });
        }
    });
});


app.post('/login', urlencodedParser, function (req, res) {

    var email=req.body.email;
    var password=req.body.password;

    connection.query("SELECT * FROM users WHERE email = ?", [email],(err,result,fields)=>{
        connection.on('error',(err)=>{
            console.log("[Mysql error]",err);
        });
        if(result && result.length){
            console.log(result);
            if(password==result[0].password){
                res.json("User logged in");
                res.end;
            }
            else{
                res.json("Wrong password");
                res.end;
            }
        }
        else{
            res.json("User not found");
            res.end;
        }
    });

});

var server = app.listen(3000,()=>{
    console.log("Server running at http://localhost:3000");
});