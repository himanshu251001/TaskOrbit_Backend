import { prisma } from "../lib/prisma.ts";
import userViews from "./views.js";

export const search = async (value, requesterUserId) => {
    const requesterId = Number(requesterUserId);

    const membership = await prisma.organizationMember.findFirst({
        where: { userId: requesterId },
        select: { organizationId: true },
    });

    if (!membership) {
        return [];
    }

    const organizationId = membership.organizationId;

    const whereClause = {
        OrganizationMember: {
            some: {
                organizationId,
            },
        },
    };

    if (!value) {
        return await prisma.user.findMany({
            where: whereClause,
            select: userViews,
        });
    }

    const orConditions = [
        {
            name: {
                contains: value,
                mode: "insensitive",
            },
        },
        {
            email: {
                contains: value,
                mode: "insensitive",
            },
        },
    ];

    const numericValue = parseInt(value, 10);
    if (!isNaN(numericValue)) {
        orConditions.push({ id: numericValue });
    }

    whereClause.OR = orConditions;

    return await prisma.user.findMany({
        where: whereClause,
        select: userViews,
    });
};

export const getMembers = async (currentUserId) => {
    const userProjects = await prisma.projectMember.findMany({
        where: { userId: Number(currentUserId) },
        select: { projectId: true }
    });

    const projectIds = userProjects.map(p => p.projectId);

    if (projectIds.length === 0) {
        return [];
    }

    const members = await prisma.user.findMany({
        where: {
            ProjectMember: {
                some: {
                    projectId: { in: projectIds }
                }
            }
        },
        select: userViews,
        distinct: ['id']
    })

    return members;
};

export const getOrgMembers = async (currentUserId) => {
    const userOrgs = await prisma.organizationMember.findMany({
        where: { userId: Number(currentUserId) },
        select: { organizationId: true }
    });

    const orgIds = userOrgs.map(org => org.organizationId);

    if (orgIds.length === 0) {
        return [];
    }

    const users = await prisma.user.findMany({
        where: {
            OrganizationMember: {
                some: {
                    organizationId: { in: orgIds }
                }
            }
        },
        select: userViews
    });

    return users;
};

export const update = async (id, profileData) => {
    return await prisma.user.update({
        where: { id: Number(id) },
        data: profileData,
    });
};
