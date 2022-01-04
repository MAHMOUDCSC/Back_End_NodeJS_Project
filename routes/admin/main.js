var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors=require('cors');
var indexRouter = require('./index');
var signcomRouter = require('./signUp_Company');
var signRetRouter = require('./signUp_Retailer');
var signSalRouter = require('./signUp_Salesperson');

var app = express();

app.use(cors());

app.use(logger('dev'));


app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/main', indexRouter);
app.use('/signuUp_Company', signcomRouter);
app.use('/signUp_Retailer', signRetRouter);
app.use('/signUp_Salesperson', signSalRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });

  
  
// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.json({
      message:err.message
    })
  });
  
  module.exports = app;