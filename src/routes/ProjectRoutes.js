
import express from 'express';
const router = express.Router();
import { getAllProjects, getProjectById, deleteProjectById, updateProjects, createProjects, getProjectStatus,getProjectMembers } from '../controllers/projectController.js';

router.get('/', getAllProjects);
router.delete('/:id', deleteProjectById);
router.patch('/:id', updateProjects);
router.post('/', createProjects);
router.get('/statusTypes', getProjectStatus);
router.get('/:id/members', getProjectMembers);
router.get('/:id', getProjectById);


export default router;