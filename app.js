var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var askQuestionRouter = require('./routes/askQuestion');
var questionsRouter = require('./routes/questions');
var answersRouter = require('./routes/answers');
var ratingRouter = require('./routes/ratings');
var loginRouter = require('./routes/login');
var chatRouter = require('./routes/chat');
var adminRouter = require('./routes/admin');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/semantic-ui-rating')));

app.use('/', indexRouter);
app.use('/ask-question', askQuestionRouter);
app.use('/questions', questionsRouter);
app.use('/answers', answersRouter);
app.use('/rating', ratingRouter);
app.use('/login', loginRouter);
app.use('/chat', chatRouter);
app.use('/admin', adminRouter);

// Make this script publicly available
module.exports = app;
