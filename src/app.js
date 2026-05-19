
import express from 'express';
import { createServer } from 'http';     
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { dashboardRoutes, taskRoutes, organizationRoutes, userRoutes, projectRoutes, authRoutes, chatRoutes, eventRoutes } from './routes/index.js';
import authMiddleware from './middlewares/authMiddleware.js';
import { initializeSocket } from './socket/index.js';
import cors from "cors";

const app = express();

// -----------------------------------------------
//  Create an HTTP server wrapping Express.
//  Socket.IO attaches to this server (not to the
//  Express app directly).
// -----------------------------------------------
const httpServer = createServer(app);

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

const Logger = (req, res, next) => {

    console.log(`${req.method} ${req.url}  ${JSON.stringify(req.body)}`);
    next();
}

app.use(Logger);

app.use('/auth', authRoutes);


app.use(authMiddleware);
app.use('/chat', chatRoutes);

app.use('/dashboard', dashboardRoutes);
app.use('/tasks', taskRoutes);
app.use('/organizations', organizationRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/events', eventRoutes);

const io = initializeSocket(httpServer);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
