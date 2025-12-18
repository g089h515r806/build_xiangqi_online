import express from 'express';
var router = express.Router();
import MywsController from './myws.controller.js';

router.ws('/echo', MywsController.echo);
//router.get('/todos', TodoController.find);

//module.exports = router;

export default router