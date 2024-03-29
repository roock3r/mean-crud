const express = require('express');
const multer = require('multer');

const Post = require('../../models/post');

const checkAuth = require('../../middleware/check-auth');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("/", checkAuth, multer({storage: storage}).single('image'), (req, res) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  //console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'post added successfully',
      // postId: createdPost._id,
      post: {
        ...createdPost,
        id: createdPost.id
      }
    });
  });
});

router.put("/:id", checkAuth, multer({storage: storage}).single('image') ,(req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id , creator: req.userData.userId}, post).then(result => {
    if (result.nModified > 0) {
      res.status(200).json({ message: 'Update Successful!' });
    } else {
      res.status(401).json({ message: 'Not Authorized!' });
    }
  })
});

router.get('/', checkAuth, (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if(pageSize && currentPage){
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery.then(documents => {
      fetchedPosts = documents;
      return Post.countDocuments();
    }).then(count => {
      res.status(200).json({
          message: 'post fetched successfully!',
          posts: fetchedPosts,
          maxPosts: count
        });
      });
});

router.get('/:id', checkAuth, (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'post not found' });
    }
  });
});

router.delete('/:id', checkAuth, (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({ message: 'Deletion Successful!' });
    } else {
      res.status(401).json({ message: 'Not Authorized!' });
    }
  });
});

module.exports = router;
