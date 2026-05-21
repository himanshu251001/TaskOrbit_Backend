
import express from 'express';
import { getTask, getTaskStats, getTasksByUser, createTaskHandler, getTaskPriority, getTaskStatus, getTaskWorkType, updateTask, workLoadStats, getProjectStats } from '../controllers/taskController.js';

const router = express.Router();

router.get('/', getTasksByUser);
router.post('/', createTaskHandler);
router.get('/work-types', getTaskWorkType);
router.get('/workload', workLoadStats);
router.get('/priorities', getTaskPriority);
router.get('/statuses', getTaskStatus);
router.patch('/:id', updateTask);
router.get('/stats', getTaskStats);
router.get('/projectStats/:id', getProjectStats);
router.get('/:id', getTask);

export default router;