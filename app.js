//jshint esversion:6

require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static("public"));

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
.get(function(req,res){
  Article.find(function(err, foundArticles){
    if(!err)
      res.send(foundArticles);
    else
      res.send(err);
  });
})
.post(function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content,
  })

  newArticle.save(function(err){
    if(err)
      res.send(err);
    else
      res.send("Successfully added a new article");
  });
})
.delete(function(req,res){
  Article.deleteMany(function(err){
    if(err)
      res.send(err);
    else
      res.send("Successfully deleted all articles");
  });
});

app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title: req.params.articleTitle}, function(err, article){
    if(err)
      res.send(err);
    else
      res.send({
        _id: article._id,
        title: article.title,
        content: article.content,
      });
  });
})
.put(function(req,res){
  Article.replaceOne(
    {title: req.params.articleTitle},
    {
      title: req.body.title,
      content: req.body.content,
    },
    function(err){
      if(err)
        res.send(err);
      else
        res.send("Successfully replaced the article");
    }
  );
})
.patch(function(req,res){
  Article.updateOne(
    {title: req.params.articleTitle},
    {$set: req.body},
    function(err){
      if(err)
        res.send(err);
      else
        res.send("Successfully updated the article");
    }
  );
})
.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(err)
        res.send(err);
      else
        res.send("Successfully deleted the article");
    }
  );
});


app.listen(process.env.PORT||3000, function(){
    console.log("Server started on port 3000");
});

