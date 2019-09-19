const Article = require('./../models/articleModel');
const factory = require('./../controllers/handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

// filtered input data
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// config multer
const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    const err = new Error('Oh No! Please upload only images.');
    err.status = 'error';
    err.statusCode = 400;
    cb(err, false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// multer route controllers
exports.uploadArticleImageCover = upload.single('imageCover');
exports.resizeArticleImageCover = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/article-cover/${req.file.filename}`);

  next();
};

// Create New Article Controller ===================================================
exports.createArticle = (req, res, next) => {
  const filteredBody = filterObj(req.body, 'title', 'context', 'imageCover');
  // add photo if that existed
  if (req.file) filteredBody.imageCover = req.file.filename;
  filteredBody.createdBy = req.user.id;

  Article.create(filteredBody)
    .then(article => {
      res.status(201).json({ status: 'success', data: { data: article } });
    })
    .catch(err => {
      res.status(400).json({ status: 'fail', message: err });
    });
};

// Update Article Controller ===================================================
exports.updateArticle = (req, res, next) => {
  const filteredBody = filterObj(req.body, 'title', 'context', 'imageCover');
  // add photo if that existed
  if (req.file) filteredBody.imageCover = req.file.filename;
  filteredBody.createdBy = req.user.id;

  Article.findByIdAndUpdate(req.params.id, filteredBody, {
    new: true,
    runValidators: true
  })
    .then(article => {
      if (!article)
        res
          .status(404)
          .json({ status: 'fail', message: 'No article found with that ID' });
      res.status(200).json({ status: 'success!!', data: { data: article } });
    })
    .catch(err => {
      res.status(404).json({ status: 'fail', message: err });
    });
};

// API Controllers ===================================================
exports.deleteArticle = factory.deleteOne(Article);
exports.getAllArticles = factory.getAll(Article);
exports.getArticle = factory.getOne(Article, { path: 'comments' });
