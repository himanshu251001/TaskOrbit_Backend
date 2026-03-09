
import express from 'express';
import { getAllTasks, getTaskStats } from '../controllers/taskController.js';

const router = express.Router();

router.get('/:id', getAllTasks);


export default router;