const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect("mongodb+srv://dev02:hWKtC4XqedgdJehO@cluster0-ctv3y.mongodb.net/messages?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch(() => {
    console.log('Connection to the database failed !');
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader("Access-Control-Allow-Methods", 'GET ,POST, PATCH, DELETE, OPTIONS');
  next();
});

app.use((req, res, next) => {
  console.log('First Middleware');
  next();
});

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  console.log(post);
  post.save();
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.use('/api/posts',(req, res, next) => {
  const posts = [
    {id: '1232232', title:'hello world', content: 'hello world content'}
  ];

  res.status(200).json({
    message: "post fetched successfully",
    posts: posts
  });
});

module.exports = app;
