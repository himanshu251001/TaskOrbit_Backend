/**
 * ============================================================
 *  Socket.IO Initialization
 * ============================================================
 *
 * Creates and configures the Socket.IO server instance.
 *
 * Usage in app.js:
 *   import { initializeSocket } from './socket/index.js';
 *   const io = initializeSocket(httpServer);
 *
 * The `io` instance is also exported so other modules
 * (e.g. REST controllers) can emit events if needed.
 * ============================================================
 */

import { Server } from 'socket.io';
import { registerSocketEvents } from './socketHandlers.js';

let io = null;

export function initializeSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on('connection', (socket) => {
        registerSocketEvents(socket, io);
    });

    console.log(' Socket.IO initialized and listening for connections');

    return io;
}


export function getIO() {
    if (!io) {
        throw new Error('Socket.IO has not been initialized. Call initializeSocket() first.');
    }
    return io;
}
