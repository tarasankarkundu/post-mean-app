const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then((createdPost) => {
    console.log("createdPost==",createdPost);
    res.status(201).json({
      message: 'post added successfully',
      post: {
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
        id: createdPost._id
      }
    })
  })
  .catch(error => {
    res.status(500).json({
      message: "Post creation failed!"
    });
  });
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts fetched successfully!",
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Could not fetch posts!"
      });
    });;
}

exports.updatePost = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    console.log(result);
    if(result.n > 0){
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Auth failed!" });
    }

  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't udpate post!"
    });
  });;
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    console.log(result);
    if(result.n > 0){
      res.status(200).json({ message: "Successfully deleted!" });
    } else {
      res.status(401).json({ message: "Auth failed!" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Couldn't delete post!"
    });
  });;
}
