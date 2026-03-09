import { prisma } from "../lib/prisma.ts";

export const getTasks = async (userId, options = {}) => {
    return prisma.task.findMany({
        where: {
            Project: {
                ProjectMember: {
                    some: {
                        userId: userId
                    }
                }
            }
        }
    })
};

export const getTaskStatsFromDB = async () => {
    return {
        totalTasks: 100,
        completedTasks: 80,
        pendingTasks: 20
    };
};
