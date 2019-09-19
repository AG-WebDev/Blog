const Comment = require('./../models/commentModel');
const factory = require('./../controllers/handlerFactory');

exports.setArticleAndUserIds = (req, res, next) => {
  if (!req.body.article) req.body.article = req.params.articleId;
  if (!req.body.author) req.body.author = req.user.id;
  next();
};

// API Controllers
exports.getAllComment = factory.getAll(Comment);
exports.getComment = factory.getOne(Comment);
exports.createComment = factory.createOne(Comment);
exports.updateComment = factory.updateOne(Comment);
exports.deleteComment = factory.deleteOne(Comment);
