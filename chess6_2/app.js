//var createError = require('http-errors');
import createError from 'http-errors';
import session from 'express-session';

//var express = require('express');
import express from 'express';

import expressWs from 'express-ws';
//var path = require('path');
import path from 'path';
//var cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';
//var logger = require('morgan');
import logger from 'morgan';
import cors from 'cors';
import { expressjwt } from "express-jwt";

import mongoose from 'mongoose';

import {fileURLToPath} from 'url';

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');
//import indexRouter from './routes/index.js';
//import usersRouter from './routes/users.js';
//import todoRouter from './modules/todo/todo.route.js';
import routing from './routes.js';

import { port, mongodbUri, rootDir, jwtSecret } from './config.js';


mongoose.connect(mongodbUri);
//mongoose.set('strictQuery', true);
mongoose.connection.on('error', console.error);

const sessionParser = session({
  saveUninitialized: false,
  secret: '$eCuRiTy',
  resave: false
});

var app = express();

expressWs(app);

//app.use(cors());

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
//app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(sessionParser);
app.use(express.json()); 

app.use(
  expressjwt({
    secret: jwtSecret,
	credentialsRequired:false,
	algorithms: ["HS256"],
    getToken: function fromHeaderOrCookieOrQuerystring(req) {
      if (
        req.headers.authorization &&
        req.headers.authorization.split(" ")[0] === "Bearer"
      ) {
        return req.headers.authorization.split(" ")[1];
      } else if (req.query && req.query.token) {
        return req.query.token;
      }else if (req.cookies && req.cookies.token) {
		 return req.cookies.token; 
	  }
      return null;
    },	
  }).unless({ 
    path: ["/user/login", "/user/register"]
  })
);


//app.use('/', indexRouter);

//console.log("indexRouter", indexRouter);
//app.use('/users', usersRouter);
//app.use('/todos', todoRouter);

await routing(app);

/*
app.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
	ws.send("nihao!!");
  });
  console.log('socket', req.testing);
});
*/

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

