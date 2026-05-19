import { prisma } from "../lib/prisma.ts";

export const getProjects = async (userId) => {
    return prisma.project.findMany({
        where: {
            ProjectMember: {
                some: {
                    userId: Number(userId)
                }
            }
        },
        include: {
            ProjectMember: {
                include: {
                    User: true
                }
            }
        }
    });
};

export const getProject = async (projectId) => {
    return prisma.project.findUnique({
        where: {
            id: Number(projectId)
        },
        include: {
            ProjectMember: {
                include: {
                    User: true
                }
            }
        }
    });
};

export const deleteProject = async (projectId) => {
    return prisma.project.delete({
        where: {
            id: Number(projectId)
        }
    });
};

export const updateProject = async (projectId, updatedProject) => {
    
    return prisma.project.update({
        where: {
            id: Number(projectId)
        },
        data: updatedProject
    });
};

export const createProject = async (newProject) => {
    return prisma.project.create({
        data: newProject
    });
};

export const addProjectMembers = async (projectId, userIds, role = 'EMPLOYEE') => {
    const members = userIds.map(userId => ({
        projectId: Number(projectId),
        userId: Number(userId),
        role
    }));
    const result = await prisma.projectMember.createMany({
        data: members,
    });
    return result;
};

export const removeProjectMembers = async (projectId, userIds) => {
    const members = userIds.map(userId => ({
        projectId: Number(projectId),
        userId: Number(userId)
    }));
    const result = await prisma.projectMember.deleteMany({
        where: {
            OR: members
        }
    });
    return result;
}

export const getprojectMember = async (projectIds) => {
    return prisma.projectMember.findMany({
        where: {
            projectId: Number(projectIds)
        },
       select:{
        userId:true
       }
    });
}