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