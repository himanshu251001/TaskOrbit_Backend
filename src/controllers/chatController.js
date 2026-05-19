/**
 * ============================================================
 *  Chat REST Controller
 * ============================================================
 *
 * HTTP endpoints for querying chat state and message history.
 * While real-time communication uses Socket.IO, these endpoints
 * let clients fetch persisted data (chat history, groups, etc.).
 * ============================================================
 */

import {
    getConnectedUsers,
    getAllGroups,
    getGroupMembers,
    getPrivateMessages,
    getGroupMessages,
} from '../services/chatService.js';

import { prisma } from '../lib/prisma.ts';

export async function getDirectUsers(req, res) {
    const user_id = req?.user?.id;

    const usersData = await prisma.chatMessage.findMany({
        where: {
            OR: [
                { senderId: user_id },
                { receiverId: user_id }
            ],
            groupId: null
        },
        select: {
            senderId: true,
            receiverId: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const userIds = [
        ...new Set(
            usersData.flatMap(msg => [msg.senderId, msg.receiverId])
        )
    ].filter(id => id !== user_id);

    const unorderedUsers = await prisma.user.findMany({
        where: {
            id: {
                in: userIds
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
        }
    });

    // Ensure the users are ordered by their most recent message
    const users = userIds
        .map(id => unorderedUsers.find(u => u.id === id))
        .filter(Boolean);

    res.json({
        success: true,
        count: users.length,
        users
    });
}

export async function getGroups(req, res) {
    try {
        const userId = req.user?.id;
        const groups = await getAllGroups(userId);
        res.json({
            success: true,
            count: groups.length,
            groups,
        });
    } catch (err) {
        console.error('Error fetching groups:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch groups' });
    }
}

export async function getGroupMembersController(req, res) {
    const { groupName } = req.params;

    try {
        const members = await getGroupMembers(groupName);

        if (members.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Group "${groupName}" not found or has no members`,
            });
        }

        res.json({
            success: true,
            groupName,
            count: members.length,
            members,
        });
    } catch (err) {
        console.error('Error fetching group members:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch members' });
    }
}

export async function getPrivateMessageHistory(req, res) {
    const currentUserId = req.user?.id;
    const otherUserId = parseInt(req.params.userId, 10);

    if (!currentUserId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (isNaN(otherUserId)) {
        return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    try {
        const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
        const before = req.query.before ? new Date(req.query.before) : undefined;

        const messages = await getPrivateMessages(currentUserId, otherUserId, { limit, before });

        res.json({
            success: true,
            count: messages.length,
            messages,
        });
    } catch (err) {
        console.error('Error fetching private messages:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
}

export async function getGroupMessageHistory(req, res) {
    const { groupName } = req.params;
    try {
        const group = await prisma.chatGroup.findUnique({
            where: { name: groupName },
        });

        if (!group) {
            return res.status(404).json({
                success: false,
                message: `Group "${groupName}" not found`,
            });
        }

        const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
        const before = req.query.before ? new Date(req.query.before) : undefined;

        const messages = await getGroupMessages(group.id, { limit, before });

        res.json({
            success: true,
            groupName,
            count: messages.length,
            messages,
        });
    } catch (err) {
        console.error('Error fetching group messages:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
}
