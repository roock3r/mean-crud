const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const posts = require('./routes/api/posts');

const app = express();

mongoose.connect("mongodb+srv://dev02:hWKtC4XqedgdJehO@cluster0-ctv3y.mongodb.net/messages?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch(() => {
    console.log('Connection to the database failed !');
  });

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader("Access-Control-Allow-Methods", 'GET ,POST, PATCH, DELETE, OPTIONS');
  next();
});

//using routes
app.use('/api/posts', posts);



module.exports = app;
