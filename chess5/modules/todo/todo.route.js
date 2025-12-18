import express from 'express';
var router = express.Router();
import TodoController from './todo.controller.js';


router.get('/todos', TodoController.find);

//module.exports = router;

export default router