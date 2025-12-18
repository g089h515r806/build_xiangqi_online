import express from 'express';
var router = express.Router();
import EngineController from './engine.controller.js';

router.get('/api/engine/getBestMove', EngineController.getBestMove);
router.get('/api/engine/testEngine', EngineController.testEngine);

export default router