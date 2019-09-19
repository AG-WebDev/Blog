const express = require('express');
const viewController = require('./../controllers/viewController');
const router = express.Router();
const authController = require('./../controllers/authController');

router.use(authController.isLoggedIn);

router.get('/', viewController.getOverview);
router.get('/article/:slug', authController.protect, viewController.getArticle);
router.get('/login', viewController.getLoginPage);
router.get('/signup', viewController.getSignUpPage);
router.get('/me', authController.protect, viewController.getAccount);
router.get(
  '/myArticles',
  authController.protect,
  viewController.getMyArticlesPage
);
router.get(
  '/addArticle',
  authController.protect,
  viewController.getCreateArticlePage
);
router.get(
  '/editArticle/:slug',
  authController.protect,
  viewController.getEditArticlePage
);

router.get(
  '/manageUsers',
  authController.protect,
  authController.restrictTo('admin'),
  viewController.getManageUserPage
);

module.exports = router;
