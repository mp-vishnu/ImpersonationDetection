const express=require('express');
const app=express(); // creating an instance
app.use(express.json()); //req response format

//route imports
const user=require("./router/userRouter");

app.use("/",user);
module.exports=app;