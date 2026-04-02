
import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { dashboardRoutes, taskRoutes, organizationRoutes, userRoutes, projectRoutes, authRoutes } from './routes/index.js';
import authMiddleware from './middlewares/authMiddleware.js';
import cors from "cors";

const app = express();
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

// app.use(Logger);

app.use('/auth', authRoutes);

app.use(authMiddleware);

app.use('/dashboard', dashboardRoutes);
app.use('/tasks', taskRoutes);
app.use('/organizations', organizationRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
