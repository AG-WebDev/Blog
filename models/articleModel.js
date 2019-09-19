const mongoose = require('mongoose');
const slugify = require('slugify');

const articleSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
      required: [true, 'An Article Must Have A Title'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'An Article Title Must Have Less Or Equal Then 40 Characters'
      ],
      minlength: [
        10,
        'An Article Title Must Have More Or Equal Then 10 Characters'
      ]
    },
    context: {
      type: String,
      required: [true, 'An Article Must Have A Context'],
      trim: true,
      maxlength: [
        10000,
        'An Article Context Must Have More Or Equal Then 10000 Characters'
      ],
      minlength: [
        1000,
        'An Article Context Must Have Less Or Equal Then 1000 Characters'
      ]
    },
    imageCover: {
      type: String,
      required: [true, 'An Article Must Have An Image Cover'],
      default: 'default.jpeg'
    },
    slug: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// virtual populate for connected article to comments, with this virtual populate we don't need to create child referencing in article model and by this way we prevent that arrays grow indefinitely
articleSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'article',
  localField: '_id'
});

// Query middleware that show information of createdAt users in any FIND query for articles
articleSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'createdBy',
    select: '-__v -passwordChangedAt'
  });
  next();
});

articleSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
