import { getTasks, getTaskStatsFromDB, createTask, updateTaskModel, getWorkLoadStatsFromDB } from '../models/taskModel.js';
import redis from '../utils/redis.js';
import { TaskWorkType, TaskStatus, TaskPriority } from '../../generated/prisma/enums.ts';


export const getTask = async (req, res) => {
	try {
		const userId = req.params.id;
		const taskId = req.params.taskId;
		const tasks = await getTasks(userId, taskId);
		res.json(tasks);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch tasks' });
	}
};

export const getTasksByUser = async (req, res) => {
	try {
		const userId = req.user.id;
		const { status, priority, workType, assignedToId, createdStartDate, createdEndDate, dueStartDate, dueEndDate } = req.query;

		// const cache = await redis.get(`user:${userId}`);
		// if (cache) {
		// 	console.log("Cache hit for user tasks");
		// 	console.log("Cached data:", JSON.parse(cache));
		// 	return res.json(JSON.parse(cache));
		// }
		const tasks = await getTasks(userId, { status, priority, workType, assignedToId, createdStartDate, createdEndDate, dueStartDate, dueEndDate });
		// await redis.setex(`user:${userId}`, 600, JSON.stringify(tasks));
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
		const userId = req.user.id;
		const stats = await getTaskStatsFromDB(userId);
		res.json(stats);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch task stats' });
	}
};

export const createTaskHandler = async (req, res) => {
	try {
		const { title, description, projectId, priority, workType, dueDate, assignedToId } = req.body;
		const createdById = req.user.id;

		if (!title || !projectId || !priority || !workType || !assignedToId || !description) {
			return res.status(400).json({
				success: false,
				error: 'Title and projectId are required'
			});
		}

		const task = await createTask({
			title,
			description,
			projectId: Number(projectId),
			createdById: Number(createdById),
			priority,
			workType,
			dueDate,
			assignedToId: assignedToId ? Number(assignedToId) : null
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
export const getTaskWorkType = (req, res) => {
	try {
		const workType = Object.values(TaskWorkType);
		res.json(workType);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch task work types' });
	}

}
export const getTaskPriority = (req, res) => {
	try {
		const priority = Object.values(TaskPriority);
		res.json(priority);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch task priorities' });
	}
}
export const getTaskStatus = (req, res) => {
	try {
		const status = Object.values(TaskStatus);
		res.json(status);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch task statuses' });
	}
}

export const updateTask = async (req, res) => {
	try {
		const { id } = req.params;
		console.log("Body:", req.body);
		const { title, description, priority, workType, dueDate, assignedToId } = req.body;
		const task = await updateTaskModel(id, {
			title: title || undefined,
			description: description || undefined,
			priority: priority || undefined,
			workType: workType || undefined,
			dueDate: dueDate ? new Date(dueDate) : undefined,
			assignedToId: assignedToId ? Number(assignedToId) : undefined
		});
		console.log("Task:", task);
		res.status(200).json({
			success: true,
			message: 'Task updated successfully',
			data: task
		});
	} catch (error) {
		console.error("Error updating task:", error);
		res.status(500).json({
			success: false,
			error: 'Failed to update task',
			details: error.message
		});
	}
}

export const workLoadStats = async (req, res) => {
	try {
		const userId = req.user.id;
		const stats = await getWorkLoadStatsFromDB(userId);
		res.json(stats);
	} catch (error) {
		res.status(500).json({ error: 'Failed to fetch task work type stats' });
	}
}