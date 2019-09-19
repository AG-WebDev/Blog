const Article = require('./../models/articleModel');
const User = require('./../models/userModel');

exports.getOverview = (req, res) => {
  Article.find()
    .sort({ createdAt: -1 })
    .then(articles => {
      res.status(200).render('overview', {
        title: 'All Articles',
        articles
      });
    })
    .catch(err => {
      res.status(404).json({ status: 'fail', message: err });
    });
};

exports.getArticle = (req, res) => {
  const slug = req.params.slug;
  Article.find({ slug })
    .populate({
      path: 'comments',
      fields: 'commentText author'
    })
    .then(article => {
      if (article.length < 1) {
        res.status(404).render('error', {
          msg: 'There is no Article with that name!'
        });
      }
      res.status(200).render('article', {
        title: 'Article Details',
        article
      });
    })
    .catch(err => {
      res.status(200).render('article', {
        title: 'Article details'
      });
    });
};

exports.getLoginPage = (req, res) => {
  res.render('login', {
    title: 'Login'
  });
};

exports.getSignUpPage = (req, res) => {
  res.render('signup', {
    title: 'signUp'
  });
};

exports.getAccount = (req, res) => {
  res.render('account', {
    title: 'Your Account'
  });
};
exports.getMyArticlesPage = (req, res) => {
  Article.find({ createdBy: req.user.id })
    .sort({ createdAt: -1 })
    .then(articles => {
      if (articles.length < 1) {
        articles = [];
      }
      res.status(200).render('myArticles', {
        title: 'My Articles',
        articles
      });
    })
    .catch(err => {
      res.status(404).json({ status: 'fail', message: err });
    });
};

exports.getCreateArticlePage = (req, res) => {
  res.render('addArticle', {
    title: 'Create New Article'
  });
};

exports.getEditArticlePage = (req, res) => {
  const slug = req.params.slug;
  Article.find({ slug })
    .populate({
      path: 'comments',
      fields: 'commentText author'
    })
    .then(article => {
      if (article.length < 1) {
        res.status(404).render('error', {
          msg: 'There is no Article with that name!'
        });
      }
      res.status(200).render('editArticle', {
        title: 'Edit Article',
        article
      });
    })
    .catch(err => {
      res.status(200).render('article', {
        title: 'Edit Article'
      });
    });
};

exports.getManageUserPage = (req, res) => {
  User.find({ role: 'blogger' })
    .then(users => {
      res.status(200).render('manageUsers', {
        title: 'Manage Users',
        users
      });
    })
    .catch(err => {
      res.status(404).json({ status: 'fail', message: err });
    });
};
