const express = require('express');
const router = express.Router({ mergeParams: true });

const commentController = require('./../controllers/commentController');
const authController = require('./../controllers/authController');

router.use(authController.protect);
router
  .route('/')
  .post(commentController.setArticleAndUserIds, commentController.createComment)
  .get(authController.restrictTo('admin'), commentController.getAllComment);

router
  .route('/:id')
  .get(commentController.getComment)
  .delete(authController.restrictTo('admin'), commentController.deleteComment)
  .patch(commentController.updateComment);

module.exports = router;
