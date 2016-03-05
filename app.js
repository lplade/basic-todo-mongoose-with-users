var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
//Set up session store, so that users stay logged in even if app is restarted
var MongoDBStore = require('connect-mongodb-session')(session)

var index = require('./routes/index')
var tasks = require('./routes/tasks');
var about = require('./routes/about');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//DB connection string.
var userdb_url ="mongodb://localhost:27017/todo"
var user_sessions_url ="mongodb://localhost:27017/todo_sessions"


//Set up sessions and passport
app.use(session({
  secret : "replace with long random number",
  resave : false,
  saveUninitialized : false,
  store: new MongoDBStore({url : user_sessions_url})
}));

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


var db = mongoose.connect(userdb_url);

mongoose.connection.on('error', function(err) {
  console.log('Error connecting to MongoDB via Mongoose ' + err)
});

mongoose.connection.once('open', function() {

  console.log("Connected to MongoDB");
  //Set up routes, middleware and error handlers

  app.use('/', index);
  app.use('/about', about);
  app.use('/tasks', tasks);

  app.use(flash);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler. will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler, no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });

});

module.exports = app;
