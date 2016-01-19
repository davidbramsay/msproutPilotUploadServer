var moment = require('moment');
var express = require('express');
var multer = require('multer'),
    bodyParser = require('body-parser'),
    path = require('path');

var logger = require('morgan');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var done = false;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/*
var uploadFile = multer({ dest: './uploads/',
        rename: function (fieldname, filename) {
            return filename+"_"+Date.now();
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...')
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path)
            done=true;
        }
});
*/

var uploadFile = multer({dest: "./uploads/"}).any();

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
      },
    filename: function (req, file, cb) {
        cb(null, file.originalname + moment().format('MDYY[_]Hm') + '.wav')
      }
});

var uploads = multer({storage:storage}).any();

app.use('/', routes);
app.use('/users', users);

app.post('/upload', uploads, function(req,res){
        console.log(req.files);
        res.status(204).end("File uploaded.");
});   

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
