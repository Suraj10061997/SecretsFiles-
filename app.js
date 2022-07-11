//jshint esversion:6
require("dotenv").config();
const express=require("express");
const ejs=require("ejs");
const bodyParser=require("body-parser");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();

app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine","ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    email:String,
    password:String
})

console.log(process.env.API_KEY);
const secret = process.env.SECRET_KEY ;
userSchema.plugin(encrypt,{
    secret:secret,
    encryptedFields:["password"]
})

const User = mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.post("/register",(req,res)=>{
    const newUser = new User({
        email:req.body.username,
        password:req.body.password
    })
    newUser.save((err)=>{
        if(err){
            console.log("the error is "+err);
        }else{
            res.render("secrets");
        }
    })
})

app.post("/login",(req,res)=>{
    const username=req.body.username;
    const userpassword=req.body.password;
    User.findOne({email:username},(err,foundUser)=>{
        if(!err){
            if(foundUser){
                if(foundUser.password === userpassword){
                    console.log(foundUser.password);
                    res.render("secrets");
                }
                else{
                    console.log("wrong password");
                }
            }
            else{
                console.log("user not found");
            }
        }
        else{
            console.log("the error is "+err);
        }
    })
})

app.get("/submit",(req,res)=>{
    res.render("submit");
})


app.listen(3000,()=>{
    console.log("server is running");
})