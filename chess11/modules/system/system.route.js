'use strict';

import express from 'express';
import { baseApi } from '../../config.js';
//import userAccess from '../../middlewares/user-access';
import SystemController from './system.controller.js';

const router = express.Router();

const api = 'system';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '亚艾元象棋', main_content: 'Main content', });
});

// GET /api/installed
router.get(`/${baseApi}/${api}/installed`, SystemController.isInstalled);

// POST /api/install
router.post(`/${baseApi}/${api}/install`, SystemController.install);

export default router

