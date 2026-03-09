import { getTasks, getTaskStatsFromDB } from '../models/taskModel.js';

export const getAllTasks = async (req, res) => {
	try {
		console.log("Fetching tasks for user:", req.params.id);
		const userId = req.params.id;
		const tasks = await getTasks(userId, req.query);
		res.json(tasks);
	} catch (error) {
		console.log("Error fetching tasks:", error);
		res.status(500).json({ error: 'Failed to fetch tasks' });
	}
};

export const getTaskStats = async (req, res) => {
	try {
		const stats = await getTaskStatsFromDB();
		res.json(stats);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch task stats' });
	}
};
