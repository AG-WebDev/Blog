const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const articleRouter = require('./routes/articleRoutes');
const userRouter = require('./routes/userRoutes');
const commentRouter = require('./routes/commentRoutes');
const viewRouter = require('./routes/viewRoutes');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  res.locals.user = null;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/api/articles', articleRouter);
app.use('/api/users', userRouter);
app.use('/api/comments', commentRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
  res.status(404).render('error', {
    msg: 'This Page Not Found!'
  });
});

// Global Error Handling Middleware
app.use(globalErrorHandler);

module.exports = app;
