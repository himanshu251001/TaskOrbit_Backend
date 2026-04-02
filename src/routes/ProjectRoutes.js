
import express from 'express';
const router = express.Router();
import { getProjects } from '../models/projectModel.js';



router.get('/', async (req, res) => {
    const userId = req.user.id;
    try {
        const projects = await getProjects(userId);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
});


export default router;