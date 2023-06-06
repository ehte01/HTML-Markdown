const express = require('express');
const router = express.Router();
const Article = require('./../models/article');


router.get('/new',(req,res)=>{
    res.render('articles/new',{article: new Article()});
});

router.get('/:id',async(req,res)=>{      //load if it is not a new article but a article just created
    const article = await Article.findById(req.params.id);
    if(article == null)res.redirect('/');    //if no article is found by that id then home page
    res.render('articles/show',{article:article});
});
router.post('/',async (req,res)=>{

    let article = new Article({          //now in server.js we need to use urlencoded to tell that if you want to access the content written inside
                                           // new article and store it in schema using "req.body".whateveryouwant from form
        
        title: req.body.title,
        description: req.body.description,
        markdown: req.body.markdown
    });
    try{
       article = await article.save();     //to save it in db  but this save method is async thats why await used here and call back use async extension
       res.redirect(`articles/${article.id}`);  //after saving redirect to that new genrated id as we know that every entry in db has particular id
    }catch(e){
        console.log(e);
        res.render('articles/new',{article:article});  // let say due too some reason save is failed so to avoid the prefilled data to fill again we use this article key
    }
});

router.get('/edit/:articleid',async (req,res)=>{
    const {articleid} = req.params;
    const article = await Article.findById(articleid);
    res.render('articles/edit',{article});
});

router.patch('/:articleid',async (req,res)=>{
    const {articleid} = req.params;
    const {title,description,markdown,createdAt} = req.body;
    const article = await Article.findByIdAndUpdate(articleid,{title,description,markdown,createdAt});
    res.redirect('/');
});

router.delete('/:articleid',async(req,res)=>{

    const {articleid} = req.params;
    console.log(articleid);
    await Article.findByIdAndDelete(articleid);
    const articles = await Article.find().sort({createdAt:'desc'});
    res.render('articles/index',{articles: articles});
});

module.exports = router;