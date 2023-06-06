const path = require('path');
const express = require('express');
const articleRouter = require('./routes/articles')
const app = express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const Article = require('./models/article');
const methodOverride = require('method-override');
const port = 3000;

mongoose.connect('mongodb://localhost/blog');  //connect to blog database now use mongoose to create db so create folder model and inside it create article.js

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));
app.set("view engine",'ejs');
app.set('views',path.join(__dirname,'views'));


app.get('/',async(req,res)=>{
    const articles = await Article.find().sort({createdAt:'desc'});
    res.render('articles/index',{articles: articles});
});
app.use('/articles',articleRouter);                              //telling our app to use article router for articles
app.listen(port,(req,res)=>{
    console.log(`server is running on port ${port}`);
});