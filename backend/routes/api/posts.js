const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = require('../../models/post');

router.post("/", (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  //console.log(post);
  post.save();
  res.status(201).json({
    message: 'post added successfully'
  });
});

router.get('/',(req, res, next) => {
  Post.find()
    .then(documents => {
      //console.log(documents);
      res.status(200).json({
        message: 'post fetched successfully!',
        posts: documents
      });
    });
});

router.delete('/:id', (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({_id:  req.params.id})
    .then(result => {
      console.log(result);
      res.status(200).json({ message: 'post deleted!' })
    })
});

module.exports = router;
