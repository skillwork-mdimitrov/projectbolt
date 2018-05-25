var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var questionsRouter = require('./routes/questions');
var answersRouter = require('./routes/answers');
var ratingRouter = require('./routes/rating');
var loginRouter = require('./routes/login');
var chatRouter = require('./routes/chat');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/semantic-ui-rating')));

app.use('/', indexRouter);
app.use('/questions', questionsRouter);
app.use('/answers', answersRouter);
app.use('/rating', ratingRouter);
app.use('/login', loginRouter);
app.use('/chat', chatRouter);

// Make this script publicly available
module.exports = app;
