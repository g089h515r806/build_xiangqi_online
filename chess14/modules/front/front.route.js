'use strict';

import express from 'express';
import { baseApi } from '../../config.js';
import FrontController from './front.controller.js';

const router = express.Router();

//const api = 'system';

/* GET home page. */
/*
router.get('/matches', function(req, res, next) {
  res.render('page', { title: '正在进行的比赛', main_content: 'matches page', stylesheets: '', scripts: '',});
});

router.get('/match', function(req, res, next) {
  res.render('page', { title: '在线下棋', main_content: '在线下棋', stylesheets: '', scripts: '',});
});



router.get('/robots', function(req, res, next) {
  res.render('page', { title: '人机对战', main_content: '与电脑下象棋', stylesheets: '', scripts: '',});
});
*/

/*
router.get('/user/login', function(req, res, next) {
  res.render('page', { title: '用户登录', main_content: '用户登录页面', stylesheets: '', scripts: '',});
});
*/
router.get('/matches', FrontController.matches); 
router.get('/match', FrontController.match); 

router.get('/robots', FrontController.robots); 

router.get('/user/login', FrontController.userLoginGet); 

router.post('/user/login', FrontController.userLoginPost); 


router.get('/user/register', FrontController.userRegisterGet); 
router.post('/user/register', FrontController.userRegisterPost);

router.get('/ranking', FrontController.ranking);  

router.get('/qipus', FrontController.qipus); 

router.get('/qipu/:id', FrontController.qipuDetail); 

/*
router.get('/user/register', function(req, res, next) {
  res.render('page', { title: '用户注册', main_content: '用户注册页面', stylesheets: '', scripts: '',});
});
*/

export default router

