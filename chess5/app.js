//var createError = require('http-errors');
import createError from 'http-errors';
//var express = require('express');
import express from 'express';
//var path = require('path');
import path from 'path';
//var cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';
//var logger = require('morgan');
import logger from 'morgan';

import mongoose from 'mongoose';

import {fileURLToPath} from 'url';

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
import indexRouter from './routes/index.js';
//import usersRouter from './routes/users.js';
//import todoRouter from './modules/todo/todo.route.js';
import routing from './routes.js';

const mongodbUri = 'mongodb://127.0.0.1:27017/chess';
mongoose.connect(mongodbUri);
mongoose.connection.on('error', console.error);

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

console.log("indexRouter", indexRouter);
//app.use('/users', usersRouter);
//app.use('/todos', todoRouter);

await routing(app);

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
  res.render('error');
});

//module.exports = app;

export default app

