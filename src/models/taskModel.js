import { prisma } from "../lib/prisma.ts";

export const getTasks = async (userId, options = {}) => {
    const { status, priority, workType, assignedToId } = options;
    const where = {
        Project: {
            ProjectMember: {
                some: {
                    userId: userId
                }
            }
        }
    };

    if (status) where.status = status.toUpperCase();
    if (priority) where.priority = priority.toUpperCase();
    if (workType) where.workType = workType.toUpperCase();
    if (assignedToId) where.assignedToId = assignedToId;

    const tasks = await prisma.task.findMany({
        where,
        include: {
            User_Task_createdByIdToUser: {
                select: {
                    name: true,
                }
            },
            User_Task_assignedToIdToUser: {
                select: {
                    name: true,
                }
            },
            Project: {
                select: {
                    name: true,
                }
            }
        },
        orderBy: {
            createdAt: 'desc',
        }
    });

    return tasks.map((task) => {
        const {
            User_Task_createdByIdToUser,
            User_Task_assignedToIdToUser,
            createdById,
            assignedToId,
            Project,
            projectId,
            ...rest
        } = task;

        return {
            ...rest,
            created_By: User_Task_createdByIdToUser?.name || null,
            assigned_To: User_Task_assignedToIdToUser?.name || null,
            project_Name: Project?.name || null,
        };
    });
};

export const getTaskStatsFromDB = async () => {
    return {
        totalTasks: 100,
        completedTasks: 80,
        pendingTasks: 20
    };
};

export const createTask = async (taskData) => {
    const { title, description, projectId, createdById, priority, workType, status, dueDate, assignedToId } = taskData;

    return prisma.task.create({
        data: {
            title,
            description,
            projectId,
            createdById,
            priority: priority?.toUpperCase() || "MEDIUM",
            workType: workType?.toUpperCase() || "TASK",
            status: status?.toUpperCase() || "TODO",
            dueDate: dueDate ? new Date(dueDate) : null,
            assignedToId: assignedToId || null,
            updatedAt: new Date(),
        },
        include: {
            Project: true,
            User_Task_createdByIdToUser: true,
            User_Task_assignedToIdToUser: true,
        }
    });
};
