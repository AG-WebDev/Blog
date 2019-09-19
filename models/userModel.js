const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: [true, 'Please tell us your first name'],
    trim: true
  },
  lastName: {
    type: String,
    require: [true, 'Please tell us your last name'],
    trim: true
  },
  username: {
    type: String,
    require: [true, 'Please provide your username'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    require: [true, 'Please provide your Password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender is either: male, female, other'
    }
  },
  photo: {
    type: String,
    default: 'default.jpeg'
  },
  role: {
    type: String,
    enum: ['blogger', 'admin'],
    default: 'blogger'
  },
  mobile: {
    type: String,
    required: [true, 'Please provide your mobile number'],
    unique: true,
    validate: {
      validator: function(el) {
        return validator.isMobilePhone(el, ['fa-IR']);
      },
      message: 'please provide a valid mobile number'
    }
  },
  passwordChangedAt: Date
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.post('update', function(doc) {
  console.log('Update finished.');
});

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }
  // False means NOT changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
