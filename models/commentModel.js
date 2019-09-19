const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  commentText: {
    type: String,
    require: [true, 'A comment must have text'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  article: {
    type: mongoose.Schema.ObjectId,
    ref: 'Article',
    required: [true, 'Comment must belong to a Article']
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Comment must belong to a User']
  }
});

commentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'author',
    select: 'username mobile photo'
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
