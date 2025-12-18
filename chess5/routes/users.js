//var express = require('express');
import express from 'express';
var router = express.Router();
import UserController from '../controllers/user.controller.js';

/* GET users listing. */
/*
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

*/
router.get('/', UserController.find);

//module.exports = router;

export default router
