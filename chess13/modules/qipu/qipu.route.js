import express from 'express';
import { baseApi } from '../../config.js';
import userAccess from '../../middlewares/user-access.js';
import QipuController from './qipu.controller.js';

var router = express.Router();

const api = 'qipu';


// GET /api/qipu
router.get(`/${baseApi}/${api}`, userAccess('access qipu'), QipuController.find);

// POST /api/qipu
router.post(`/${baseApi}/${api}`, userAccess('create qipu'), QipuController.add);

// GET /api/qipu/id
router.get(`/${baseApi}/${api}/:id`, userAccess('access qipu'), QipuController.findById);

// PUT /api/qipu/id
router.put(`/${baseApi}/${api}/:id`, userAccess('edit qipu'), QipuController.update);

// DELETE /api/qipu/id
router.delete(`/${baseApi}/${api}/:id`, userAccess('delete qipu'), QipuController.delete);



//module.exports = router;

export default router