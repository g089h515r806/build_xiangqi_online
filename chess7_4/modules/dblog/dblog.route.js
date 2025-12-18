'use strict';

import express from 'express';
import { baseApi } from '../../config.js';
import userAccess from '../../middlewares/user-access.js';
import DblogController from './dblog.controller.js';


const api = 'dblog';

const router = express.Router();

//router.prefix(`/${baseApi}/${api}`);

// GET /api/branch
router.get(`/${baseApi}/${api}`, userAccess('access log'), DblogController.find);


// GET /api/branch/id
// This route is protected, 
router.get(`/${baseApi}/${api}/:id`, userAccess('access log'), DblogController.findById);


export default router;
