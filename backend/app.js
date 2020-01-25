const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const posts = require('./routes/api/posts');
const user = require('./routes/api/user');

const app = express();

mongoose.connect("mongodb+srv://dev02:hWKtC4XqedgdJehO@cluster0-ctv3y.mongodb.net/messages?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true  })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch(() => {
    console.log('Connection to the database failed !');
  });

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use("/images", express.static(path.join("backend/images")));

app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader("Access-Control-Allow-Methods", 'GET ,POST, PATCH, DELETE, PUT, OPTIONS');
  next();
});

//using routes
app.use('/api/posts', posts);
app.use('/api/user', user);

module.exports = app;
