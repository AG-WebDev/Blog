const User = require('./../models/userModel');
const Article = require('./../models/articleModel');
const Comment = require('./../models/commentModel');
const factory = require('./../controllers/handlerFactory');
const multer = require('multer');
const sharp = require('sharp');

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

// function that filtering imported data from body that useful for updateMe controller
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Update Me Controller =====================================================
exports.updateMe = async (req, res, next) => {
  try {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      res.status(400).json({
        status: 'fail',
        message:
          'This route is not for password updates. Please use /updateMyPassword.'
      });
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(
      req.body,
      'firstName',
      'username',
      'lastName',
      'mobile'
    );
    // add photo if that existed
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err });
  }
};

// Delete Me Controller ======================================================
exports.deleteMe = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndDelete(req.user.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err });
  }
};

exports.deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.params.id)
    .then(user => {
      if (!user)
        res
          .status(404)
          .json({ status: 'fail', message: 'No user found with that ID' });
      Article.deleteMany({ createdBy: req.params.id })
        .then(article => {
          Comment.deleteMany({ article: article.id })
            .then(comment => {
              Comment.deleteMany({ author: req.params.id })
                .then(comment => {
                  res.status(204).json({ status: 'success', data: null });
                })
                .catch(err => {
                  res.status(404).json({ status: 'fail', message: err });
                });
            })
            .catch(err => {
              res.status(404).json({ status: 'fail', message: err });
            });
        })
        .catch(err => {
          res.status(404).json({ status: 'fail', message: err });
        });
    })
    .catch(err => {
      res.status(404).json({ status: 'fail', message: err });
    });
};

exports.createAdmin = (req, res, next) => {
  User.findOne({ role: 'admin' }, (err, existAdmin) => {
    if (err) return res.json({ status: 'fail', message: err });
    if (existAdmin) return res.status(404).send('Not Found!');

    new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
      gender: req.body.gender,
      passwordConfirm: req.body.passwordConfirm,
      role: 'admin',
      mobile: req.body.mobile
    }).save((err, user) => {
      if (err) return res.json({ status: 'fail', message: err });

      return res.json({ status: 'success', data: user });
    });
  });
};

// API Controllers
exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.createUser = factory.createOne(User);
exports.updateUser = factory.updateOne(User);
