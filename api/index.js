const express = require("express");
const app = express();
app.use(express.json())
const jwt= require("jsonwebtoken")
const users=[
    {
        id:"1",
        name:"salma",
        password:"salma2033",
        isAdmin:true
    },
    {
        id:"2",
        name:"amir",
        password:"amir4147",
        isAdmin:false
    }
]

app.post("/api/login",(req,res)=>{
   const {name,password}=req.body;
   const user = users.find((u)=>{
       return u.name === name && u.password===password;
   });
   if(user){
       //res.json(user)
       //GENERATE AN ACCESS TOKEN
       const accessToken = jwt.sign({
           id:user.id,
           isAdmin:user.isAdmin
       },"mySecreteKey");
       res.json({
           username:user.username,
           isAdmin:user.isAdmin,
           accessToken
       })

   }else{
       res.status(400).json("username or password is incorrect")
   }

 // res.json("hey it works")

})
//verify the token
const verify =(req,res,next)=>{
    const authHeader= req.headers.Authorization;
    if(authHeader){
        const token = authHeader.split("")[1]

        jwt.verify(token,"mySecreteKey",(err,user)=>{
            if(err){
                res.status(403).json("token is not valid")
            }
            req.user=user;
            next();
        })

    }else{
        res.status(401).json("you are not authenticated")
    }
}

app.listen(5000,()=> console.log("backend server is running"))