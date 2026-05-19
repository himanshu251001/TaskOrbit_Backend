import { prisma } from "../lib/prisma.ts";

export const getTasks = async (userId, options = {}) => {
    let where;
    const { status, priority, workType, assignedToId, taskId, createdStartDate, createdEndDate, dueStartDate, dueEndDate } = options;
    if (taskId) {

        where = {
            id: taskId
        }
    }
    else {
        where = {
            Project: {
                ProjectMember: {
                    some: {
                        userId: userId
                    }
                }
            }
        }
    };

    if (status) where.status = status.toUpperCase();
    if (priority) where.priority = priority.toUpperCase();
    if (workType) where.workType = workType.toUpperCase();
    if (assignedToId) where.assignedToId = Number(assignedToId);

    if (createdStartDate || createdEndDate) {
        where.createdAt = {};
        if (createdStartDate) {
            const startDate = new Date(createdStartDate);
            startDate.setUTCHours(0, 0, 0, 0);
            where.createdAt.gte = startDate;
        }
        if (createdEndDate) {
            const endDate = new Date(createdEndDate);
            endDate.setUTCHours(23, 59, 59, 999);
            where.createdAt.lte = endDate;
        }
    }

    if (dueStartDate || dueEndDate) {
        where.dueDate = {};

        if (dueStartDate) {
            const startDate = new Date(dueStartDate);
            startDate.setHours(0, 0, 0, 0);
            where.dueDate.gte = startDate;
        }

        if (dueEndDate) {
            const endDate = new Date(dueEndDate);
            endDate.setHours(23, 59, 59, 999);
            where.dueDate.lte = endDate;
        }
    }

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
                    id: true,
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
    console.log(tasks.length);

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
            assigned_to_name: User_Task_assignedToIdToUser?.name || null,
            assigned_to_id: User_Task_assignedToIdToUser?.id || null,
            project_name: Project?.name || null,
            project_id: projectId || null,
        };
    });
};

export const getTaskStatsFromDB = async (userId) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const stats = await prisma.task.groupBy({
        by: ['status'],
        where: {
            createdAt: {
                gte: threeMonthsAgo
            },
            Project: {
                ProjectMember: {
                    some: {
                        userId: Number(userId)
                    }
                }
            }
        },
        _count: {
            _all: true
        }
    });

    let open = 0;
    let inProgress = 0;
    let closed = 0;

    console.log(stats);

    stats.forEach((stat) => {
        if (stat.status === 'COMPLETED') {
            closed += stat._count._all;
        } else if (stat.status === 'TODO') {
            open += stat._count._all;
        } else {
            inProgress += stat._count._all;
        }
    });

    return {
        open,
        inProgress,
        closed,
        total: open + inProgress + closed
    };
};

export const createTask = async (taskData) => {
    const { title, description, projectId, createdById, priority, workType, dueDate, assignedToId } = taskData;

    return prisma.task.create({
        data: {
            title,
            description,
            projectId,
            createdById,
            priority: priority?.toUpperCase() || "LOW",
            workType: workType?.toUpperCase() || "TASK",
            status: "TODO",
            dueDate: dueDate ? new Date(dueDate) : null,
            assignedToId: assignedToId || null,
            updatedAt: new Date(),
        }
    });
};

export const updateTaskModel = async (id, taskData) => {
    const updatedTask = await prisma.task.update({
        where: { id: Number(id) },
        data: taskData
    });

    return updatedTask;
};

export const getWorkLoadStatsFromDB = async (userId) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Get all users who are members of projects the current user is part of
    const projectMembers = await prisma.projectMember.findMany({
        where: {
            Project: {
                ProjectMember: {
                    some: {
                        userId: Number(userId)
                    }
                }
            }
        },
        select: {
            userId: true
        }
    });

    const userIds = [...new Set(projectMembers.map(pm => pm.userId))];

    if (userIds.length === 0) return [];

    const users = await prisma.user.findMany({
        where: {
            id: {
                in: userIds
            }
        },
        select: {
            id: true,
            name: true,
            designation: true
        }
    });

    const stats = await prisma.task.groupBy({
        by: ['assignedToId', 'status'],
        where: {
            createdAt: {
                gte: threeMonthsAgo
            },
            assignedToId: {
                in: userIds
            },
            Project: {
                ProjectMember: {
                    some: {
                        userId: Number(userId)
                    }
                }
            }
        },
        _count: {
            _all: true
        }
    });

    const userMap = users.reduce((acc, user) => {
        acc[user.id] = {
            id: user.id,
            name: user.name || "Unknown",
            designation: user.designation || "Unknown",
            completed: 0,
            totalTasks: 0
        };
        return acc;
    }, {});

    stats.forEach(stat => {
        const user = userMap[stat.assignedToId];
        if (user) {
            user.totalTasks += stat._count._all;
            if (stat.status === 'COMPLETED') {
                user.completed += stat._count._all;
            }
        }
    });

    return Object.values(userMap);
};

