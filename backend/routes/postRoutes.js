const express = require('express');
const router = express.Router();
const checkAuth = require('../middlewares/check-auth');
const extractFile = require('../middlewares/file');
const postController = require('../controllers/postController');



router.post('',
  checkAuth,
  extractFile,
  postController.createPost
  )

router.get('', postController.getPosts);

router.put('/:id',
  checkAuth,
  extractFile,
  postController.updatePost
  );

router.delete('/:id', checkAuth, postController.deletePost);

module.exports = router;
