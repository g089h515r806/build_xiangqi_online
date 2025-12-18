import express from 'express';
var router = express.Router();
import EngineController from './engine.controller.js';

router.get('/api/engine/getBestMove', EngineController.getBestMove);

export default router