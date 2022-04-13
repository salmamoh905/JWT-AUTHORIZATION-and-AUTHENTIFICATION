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
];
//refresh
let refreshTokens =[]
app.post("/api/refresh",(req,res)=>{
    //take the refresh token from the user
    const refreshToken = req.body.token


    //send error if there is no token or invalid token
    if(!refreshToken){
        res.status(401).json("you are not authenticated!")
    }
    if(!refreshTokens.includes(refreshToken)){
        return res.status(401).json("Refresh token is not valid")
    }
    jwt.verify(refreshToken, "myRefreshSecreteKey", (err,user)=>{
        err && console.log(err);
        refreshTokens = refreshTokens.filter((token)=>token !==refreshToken)
    })


    //if everything is ok then create acccess token, refresh token and send to user
})
const generateRefreshToken=(user)=>{
   return jwt.sign({
        id:user.id,
        isAdmin:user.isAdmin
    },"myRefreshSecreteKey");
      

}
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
       },"mySecreteKey",{
           expiresIn:("15m")
       });
       const refreshToken=generateRefreshToken(user);
       refreshTokens.push(refreshToken)


       res.json({
        username:user.username,
        isAdmin:user.isAdmin,
        accessToken,
        refreshToken

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
};

app.delete("/api/users/:userId",verify,(req,res)=>{
    if(req.user.id===req.params.id ||req.user.isAdmin){
        res.status(200).json("user is deleted")
    }else{
        req.status(403).json("you are not allowed to delete a user!");
    }
})

app.listen(5000,()=> console.log("backend server is running"))