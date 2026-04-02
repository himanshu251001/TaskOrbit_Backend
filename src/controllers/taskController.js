import { getTasks, getTaskStatsFromDB, createTask } from '../models/taskModel.js';

export const getAllTasks = async (req, res) => {
	try {
		const userId = req.params.id;
		const tasks = await getTasks(userId, req.query);
		res.json(tasks);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch tasks' });
	}
};

export const getTasksByUser = async (req, res) => {
	try {
		const userId = req.user.id;
		const { status, priority, workType, assignedToId } = req.query;


		const tasks = await getTasks(userId, { status, priority, workType, assignedToId });

		res.status(200).json({
			success: true,
			count: tasks.length,
			data: tasks
		});
	} catch (error) {
		console.error("Error fetching user tasks:", error);
		res.status(500).json({ success: false, error: 'Failed to fetch tasks' });
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

export const createTaskHandler = async (req, res) => {
	try {
		const { title, description, projectId, priority, workType, status, dueDate, assignedToId } = req.body;
		const createdById = req.user.id;

		if (!title || !projectId) {
			return res.status(400).json({
				success: false,
				error: 'Title and projectId are required'
			});
		}


		const task = await createTask({
			title,
			description,
			projectId,
			createdById,
			priority,
			workType,
			status,
			dueDate,
			assignedToId
		});

		res.status(201).json({
			success: true,
			message: 'Task created successfully',
			data: task
		});
	} catch (error) {
		console.error("Error creating task:", error);
		res.status(500).json({
			success: false,
			error: 'Failed to create task',
			details: error.message
		});
	}
};
