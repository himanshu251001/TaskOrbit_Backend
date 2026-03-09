import { prisma } from "../lib/prisma.ts";

export const getProjects = async (userId) => {
    return prisma.project.findMany({
        where: {
            ProjectMember: {
                some: {
                    userId: userId
                }
            }
        },
    });
};
