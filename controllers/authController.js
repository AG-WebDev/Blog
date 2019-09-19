const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const bcrypt = require('bcryptjs');

// function for create token
const signToken = id => {
  return jwt.sign({ id }, 'my-ult-first-program-tok-that-mus-should-be-32', {
    expiresIn: '4h'
  });
};

const signRefreshToken = id => {
  return jwt.sign(
    { id },
    'this-secret-mustee-be-secure-that-mus-should-be-32',
    {
      expiresIn: '10h'
    }
  );
};

// function for filtered input data
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// function that create new random token and send to client with specific status code and specific user data
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  const cookieOption = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  res.cookie('jwt', token, refreshToken, cookieOption);
  user.password = undefined; // To prevent showing the password at the response
  res
    .status(statusCode)
    .json({ status: 'success', token, refreshToken, data: { user } });
};

exports.signup = (req, res, next) => {
  const filteredBody = filterObj(
    req.body,
    'firstName',
    'username',
    'lastName',
    'mobile',
    'gender',
    'password',
    'passwordConfirm'
  );
  User.create(req.body)
    .then(newUser => {
      res.status(200).json({ status: 'success', data: newUser });
    })
    .catch(err => {
      res.status(400).json({ status: 'fail', message: err });
    });
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const err = new Error('Please provide username and password');
    err.statusCode = 400;
    err.status = 'fail';
    return next(err);
  }
  try {
    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      const err = new Error('Incorrect email or password');
      err.statusCode = 401;
      err.status = 'fail';
      return next(err);
    }
    createSendToken(user, 200, res);
  } catch (err) {
    res.json({ status: 'error', message: err });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    if (!token) {
      return res.status(401).render('error', {
        msg: 'You are not logged in! please log in to get access.'
      });
    }

    // verification token
    const decoded = await promisify(jwt.verify)(
      token,
      'my-ult-first-program-tok-that-mus-should-be-32'
    );
    // check if user don't exit
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return res.status(401).render('error', {
        msg: 'The user belonging this token does not longer exist.'
      });
    }

    // check if user changed password after the token was issued
    if (freshUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).render('error', {
        msg: 'User recently changed password! Please log in again.'
      });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = freshUser;
    next();
  } catch (err) {
    return res.render('error', {
      msg: 'You have not been active for a long time, Please Login Again!'
    });
  }
};

// Only for rendered pages, no errors
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        'my-ult-first-program-tok-that-mus-should-be-32'
      );

      // check if user don't exit
      const freshUser = await User.findById(decoded.id);
      if (!freshUser) {
        res.locals.user = {};
        return next();
      }

      // check if user changed password after the token was issued
      if (freshUser.changedPasswordAfter(decoded.iat)) {
        res.locals.user = {};
        next();
      }

      res.locals.user = freshUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(401).render('error', {
        msg: 'You do not have permission to perform this action.'
      });
    }
    next();
  };
};

exports.updatePassword = async (req, res, next) => {
  try {
    // Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // check if posted current password is correct
    if (!(await bcrypt.compare(req.body.passwordCurrent, user.password))) {
      const err = new Error('Your current password is wrong');
      err.statusCode = 401;
      err.status = 'unauthorized';
      return next(err);
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    res.cookie('jwt', 'loggedOut', {
      expires: new Date(Date.now() + 1000),
      httpOnly: true
    });
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.updatePasswordByAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.id).select('+password');
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
