
import express from 'express';
import { getAllTasks, getTaskStats, getTasksByUser, createTaskHandler } from '../controllers/taskController.js';

const router = express.Router();



router.get('/', getTasksByUser);
router.get('/:id', getAllTasks);

router.post('/create', createTaskHandler);

export default router;