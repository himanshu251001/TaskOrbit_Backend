/**
 * ============================================================
 *  ChatService — Hybrid State Manager
 * ============================================================
 *
 * Two layers of state:
 *
 *   1. IN-MEMORY (volatile):
 *      • connectedUsers  (Map<userId, socketId>)
 *        → Tracks live socket connections for real-time routing.
 *          Lost on server restart — that's fine because sockets
 *          reconnect automatically.
 *
 *   2. DATABASE (persistent via Prisma):
 *      • ChatGroup         → Group rooms
 *      • ChatGroupMember   → Group membership (many-to-many)
 *      • ChatMessage       → All messages (DMs + group messages)
 *
 *   This separation means real-time routing stays fast (in-memory)
 *   while chat history & group data survive restarts.
 * ============================================================
 */

import { prisma } from '../lib/prisma.ts';

// =====================================================
//  IN-MEMORY: Socket Connection Tracking
// =====================================================


const connectedUsers = new Map();

export function registerUser(userId, socketId) {
    connectedUsers.set(userId, socketId);
    return { userId, socketId };
}

export function removeUserBySocketId(socketId) {
    for (const [userId, sid] of connectedUsers.entries()) {
        if (sid === socketId) {
            connectedUsers.delete(userId);
            return userId;
        }
    }
    return null;
}

export function getSocketId(userId) {
    return connectedUsers.get(userId);
}

export function getUserIdBySocketId(socketId) {
    for (const [userId, sid] of connectedUsers.entries()) {
        if (sid === socketId) return userId;
    }
    return undefined;
}

export function getConnectedUsers() {
    return Array.from(connectedUsers.entries()).map(([userId, socketId]) => ({
        userId,
        socketId,
    }));
}

export async function createGroup(groupName) {
    return prisma.chatGroup.upsert({
        where: { name: groupName },
        update: {},
        create: { name: groupName },
        include: {
            members: {
                include: { user: { select: { id: true, name: true, email: true } } },
            },
        },
    });
}

export async function joinGroup(groupName, userId) {
    const group = await prisma.chatGroup.upsert({
        where: { name: groupName },
        update: {},
        create: { name: groupName },
    });

    await prisma.chatGroupMember.upsert({
        where: { groupId_userId: { groupId: group.id, userId } },
        update: {},
        create: { groupId: group.id, userId },
    });

    return prisma.chatGroup.findUnique({
        where: { id: group.id },
        include: {
            members: {
                include: { user: { select: { id: true, name: true, email: true } } },
            },
        },
    });
}

export async function leaveGroup(groupName, userId) {
    const group = await prisma.chatGroup.findUnique({
        where: { name: groupName },
    });

    if (!group) return null;

    // Delete membership (silently ignore if not a member)
    await prisma.chatGroupMember.deleteMany({
        where: { groupId: group.id, userId },
    });

    // Return updated group
    return prisma.chatGroup.findUnique({
        where: { id: group.id },
        include: {
            members: {
                include: { user: { select: { id: true, name: true, email: true } } },
            },
        },
    });
}

export async function getGroupMembers(groupName) {
    const group = await prisma.chatGroup.findUnique({
        where: { name: groupName },
        include: {
            members: {
                include: { user: { select: { id: true, name: true, email: true } } },
            },
        },
    });

    if (!group) return [];
    return group.members.map((m) => m.user);
}
export async function getAllGroups(userId) {
    return prisma.chatGroup.findMany({
        where: {
            members: { some: { userId: userId } },
        },  
        include: {
            members: {
                include: { user: { select: { id: true, name: true, email: true } } },
            },
            _count: { select: { messages: true } },
        },
        orderBy: { createdAt: 'asc' },
    });
}

export async function savePrivateMessage(senderId, receiverId, content) {
    return prisma.chatMessage.create({
        data: {
            content,
            senderId,
            receiverId,
        },
        include: {
            sender:   { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
        },
    });
}

export async function saveGroupMessage(senderId, groupId, content) {
    return prisma.chatMessage.create({
        data: {
            content,
            senderId,
            groupId,
        },
        include: {
            sender: { select: { id: true, name: true, email: true } },
            group:  { select: { id: true, name: true } },
        },
    });
}

export async function getPrivateMessages(userA, userB, { limit = 50, before } = {}) {
    return prisma.chatMessage.findMany({
        where: {
            groupId: null,
            OR: [
                { senderId: userA, receiverId: userB },
                { senderId: userB, receiverId: userA },
            ],
            ...(before ? { createdAt: { lt: before } } : {}),
        },
        include: {
            sender:   { select: { id: true, name: true, email: true } },
            receiver: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'asc' },
        take: limit,
    });
}

export async function getGroupMessages(groupId, { limit = 50, before } = {}) {
    return prisma.chatMessage.findMany({
        where: {
            groupId,
            ...(before ? { createdAt: { lt: before } } : {}),
        },
        include: {
            sender: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'asc' },
        take: limit,
    });
}
