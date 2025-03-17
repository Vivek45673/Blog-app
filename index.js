const path=require("path");
const express=require("express");
const app=express();
const mongoose=require("mongoose");
const cookieParser=require('cookie-parser');
const Blog=require('./models/blog');



const userRoute=require('./routes/user');
const blogRoute=require('./routes/blog');

const { checkForAuthenticationCookie } = require("./middleware/authentications");
app.use(express.static(path.resolve('./public')));

const port=8000;

mongoose.connect("mongodb://127.0.0.1:27017/blogify").then((e)=> console.log("MongoDB Connected"));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/",async(req,res)=>{
    const allBlogs=await Blog.find({});
    res.render("home",{
        user:req.user,
        blogs:allBlogs,
    });
});

app.use('/user',userRoute);
app.use('/blog',blogRoute);

app.listen(port,()=> console.log(`server started at port: ${port}`));