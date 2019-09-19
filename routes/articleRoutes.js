const express = require('express');
const router = express.Router();

const articleController = require('./../controllers/articleController');
const authController = require('./../controllers/authController');
const commentController = require('./../controllers/commentController');
const commentRouter = require('./../routes/commentRoutes');

router.use('/:articleId/comments', commentRouter);

router
  .route('/')
  .get(authController.protect, articleController.getAllArticles)
  .post(
    authController.protect,
    articleController.uploadArticleImageCover,
    articleController.resizeArticleImageCover,
    articleController.createArticle
  );

router
  .route('/:id')
  .get(authController.protect, articleController.getArticle)
  .patch(
    authController.protect,
    articleController.uploadArticleImageCover,
    articleController.resizeArticleImageCover,
    articleController.updateArticle
  )
  .delete(authController.protect, articleController.deleteArticle);

module.exports = router;
