'use strict';

import express from 'express';
import { baseApi } from '../../config.js';
import userAccess from '../../middlewares/user-access.js';
import ContentController from './content.controller.js';
const router = express.Router();

const api = 'content';


// GET /api/content
router.get(`/${baseApi}/${api}`, userAccess('access content'), ContentController.find);

// POST /api/content
router.post(`/${baseApi}/${api}`, userAccess('create content'), ContentController.add);

// GET /api/content/id
router.get(`/${baseApi}/${api}/:id`, userAccess('access content'), ContentController.findById);

// PUT /api/content/id
router.put(`/${baseApi}/${api}/:id`, userAccess('edit content'), ContentController.update);

// DELETE /api/content/id
router.delete(`/${baseApi}/${api}/:id`, userAccess('delete content'), ContentController.delete);

router.post(`/${baseApi}/${api}/viewcount/:id`, ContentController.viewCount);

// this will only be invoked if the path starts with /bar from the mount point
//router.use('/content', ContentController.find)


/* GET home page. */
//router.get('/content/about', function(req, res, next) {
//  res.render('index', { title: 'about', main_content: 'main_content'});
//});

export default router
