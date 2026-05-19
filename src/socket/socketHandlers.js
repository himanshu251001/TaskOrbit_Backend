
import {
    registerUser,
    removeUserBySocketId,
    getSocketId,
    getUserIdBySocketId,
    createGroup,
    joinGroup,
    leaveGroup,
    getGroupMembers,
    getConnectedUsers,
    savePrivateMessage,
    saveGroupMessage,
} from '../services/chatService.js';

import { prisma } from '../lib/prisma.ts';

function emitError(socket, type, event, message) {
    socket.emit('error', { type, event, message });
}

async function handleRegister(socket, io, { userId }) {
    if (!userId || typeof userId !== 'number') {
        emitError(socket, 'validation', 'user:register', 'userId (number) is required');
        return;
    }

    const result = registerUser(userId, socket.id);

    try {
        const userGroups = await prisma.chatGroupMember.findMany({
            where: { userId },
            include: { group: true }
        });
        
        userGroups.forEach(({ group }) => {
            socket.join(group.name);
        });
    } catch (err) {
        console.error('Error auto-joining groups:', err);
    }
    // socket.emit('user:registered', result);
    // socket.broadcast.emit('user:online', { userId });
}

async function handlePrivateMessage(socket, io, { receiverId, message }) {
    if (!receiverId || !message) {
        emitError(socket, 'validation', 'message:private', '"receiverId" and "message" fields are required');
        return;
    }

    const senderId = getUserIdBySocketId(socket.id);
    if (!senderId) {
        emitError(socket, 'auth', 'message:private', 'You must register before sending messages');
        return;
    }

    try {
        const saved = await savePrivateMessage(senderId, receiverId, message);

        const payload = {
            id: saved.id,
            from: senderId,
            receiverId,
            message: saved.content,
            sender: saved.sender,
            receiver: saved.receiver,
            timestamp: saved.createdAt.toISOString(),
        };

        const recipientSocketId = getSocketId(receiverId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit('message:private', payload);
        }
        socket.emit('message:sent', payload);
    } catch (err) {
        console.error('Error saving private message:', err);
        emitError(socket, 'server', 'message:private', 'Failed to send message');
    }
}

async function handleGroupCreate(socket, io, { groupName }) {
    if (!groupName) {
        emitError(socket, 'validation', 'group:create', 'groupName is required');
        return;
    }

    try {
        const group = await createGroup(groupName);
        socket.emit('group:created', group);
    } catch (err) {
        console.error('Error creating group:', err);
        emitError(socket, 'server', 'group:create', 'Failed to create group');
    }
}

async function handleGroupJoin(socket, io, { groupName }) {
    if (!groupName) {
        emitError(socket, 'validation', 'group:join', 'groupName is required');
        return;
    }

    const userId = getUserIdBySocketId(socket.id);
    if (!userId) {
        emitError(socket, 'auth', 'group:join', 'You must register before joining a group');
        return;
    }

    try {
        const group = await joinGroup(groupName, userId);

        socket.join(groupName);
        socket.emit('group:joined', group);

        socket.to(groupName).emit('group:user-joined', {
            groupName,
            userId,
            group,
        });
    } catch (err) {
        console.error('Error joining group:', err);
        emitError(socket, 'server', 'group:join', 'Failed to join group');
    }
}

async function handleGroupLeave(socket, io, { groupName }) {
    if (!groupName) {
        emitError(socket, 'validation', 'group:leave', 'groupName is required');
        return;
    }

    const userId = getUserIdBySocketId(socket.id);
    if (!userId) return;

    try {
        const group = await leaveGroup(groupName, userId);

        socket.leave(groupName);
        socket.emit('group:left', { groupName });

        if (group) {
            socket.to(groupName).emit('group:user-left', {
                groupName,
                userId,
                group,
            });
        }
    } catch (err) {
        console.error('Error leaving group:', err);
        emitError(socket, 'server', 'group:leave', 'Failed to leave group');
    }
}

async function handleGroupMessage(socket, io, { groupName, message }) {
    if (!groupName || !message) {
        emitError(socket, 'validation', 'message:group', '"groupName" and "message" fields are required');
        return;
    }

    const senderId = getUserIdBySocketId(socket.id);
    if (!senderId) {
        emitError(socket, 'auth', 'message:group', 'You must register before sending messages');
        return;
    }

    try {
        const group = await prisma.chatGroup.findUnique({
            where: { name: groupName },
            include: {
                members: { select: { userId: true } },
            },
        });

        if (!group) {
            emitError(socket, 'validation', 'message:group', `Group "${groupName}" does not exist`);
            return;
        }

        const isMember = group.members.some((m) => m.userId === senderId);
        if (!isMember) {
            emitError(socket, 'auth', 'message:group', `You are not a member of group "${groupName}"`);
            return;
        }

        const saved = await saveGroupMessage(senderId, group.id, message);
        
        const payload = {
            id: saved.id,
            from: senderId,
            groupName,
            groupId: group.id,
            message: saved.content,
            sender: saved.sender,
            timestamp: saved.createdAt.toISOString(),
        };
        
        socket.to(groupName).emit('message:group', payload);

        socket.emit('message:sent', payload);
    } catch (err) {
        console.error('Error sending group message:', err);
        emitError(socket, 'server', 'message:group', 'Failed to send group message');
    }
}

function handleDisconnect(socket, io) {
    const userId = removeUserBySocketId(socket.id);

    if (userId) {
        io.emit('user:offline', { userId });
    }
}

export function registerSocketEvents(socket, io) {

    socket.on('user:register',   (data) => handleRegister(socket, io, data));
    socket.on('message:private',  (data) => handlePrivateMessage(socket, io, data));
    socket.on('group:create',     (data) => handleGroupCreate(socket, io, data));
    socket.on('group:join',       (data) => handleGroupJoin(socket, io, data));
    socket.on('group:leave',      (data) => handleGroupLeave(socket, io, data));
    socket.on('message:group',    (data) => handleGroupMessage(socket, io, data));
    socket.on('disconnect',       ()     => handleDisconnect(socket, io));
}
