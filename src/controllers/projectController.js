import { getProjects, getProject, deleteProject, updateProject, createProject, addProjectMembers, getprojectMember, removeProjectMembers } from "../models/projectModel.js";
import { prisma } from "../lib/prisma.ts";
import { ProjectStatus } from "../../generated/prisma/enums.ts";
import { Console } from "console";

export const getAllProjects = async (req, res) => {
    const userId = req.user.id;
    try {
        const projects = await getProjects(userId);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};

export const getProjectById = async (req, res) => {
    const projectId = req.params.id;
    try {
        const project = await getProject(projectId);
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project' });
    }
};

export const deleteProjectById = async (req, res) => {
    const projectId = req.params.id;
    try {
        await deleteProject(projectId);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
};

export const updateProjects = async (req, res) => {
    const projectId = req.params.id;
    const updatedProject = req.body;
    const { projectName, description, client, estimatedHours, budget, startDate, endDate, users, status, technologies } = updatedProject;

    try {
        await prisma.$transaction(async () => {
            const project = await updateProject(projectId, {
                name: projectName,
                description,
                client,
                EstimatedHours: Number(estimatedHours),
                Budget: budget ? Number(budget) : null,
                StartDate: startDate ? new Date(startDate) : null,
                EndDate: endDate ? new Date(endDate) : null,
                technologies: technologies || [],
                createdById: Number(req.user.id),
                status
            });
            const userIds = [...new Set([
                ...(Array.isArray(users) ? users.map(Number) : [])
            ])];
            const existingUsers = await getprojectMember(project.id);
            const existingUserIds = existingUsers.map(user => user.userId);
            const usersToAdd = userIds.filter(
                userId => !existingUserIds.includes(userId)
            );
            const usersToRemove = existingUserIds.filter(
                userId => !userIds.includes(userId)
            );

            if (usersToAdd.length > 0) {
                await addProjectMembers(project.id, usersToAdd, 'EMPLOYEE');
            }
            if (usersToRemove.length > 0) {
                await removeProjectMembers(project.id, usersToRemove);
            }
            res.json(project);
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({ error: 'Failed to update project' });
    }
};

export const createProjects = async (req, res) => {
    const newProject = req.body;
    const { projectName, description, client, estimatedHours, budget, startDate, endDate, users, technologies } = newProject;

    if (!projectName || !description || !client || !estimatedHours) {
        return res.status(400).json({ error: 'Missing required fields: projectName, description, client, estimatedHours, startDate' });
    }

    try {
        const memberRecord = await prisma.organizationMember.findFirst({
            where: {
                userId: req.user.id
            },
            select: {
                organizationId: true
            }
        });

        if (!memberRecord) {
            return res.status(400).json({ error: 'User is not associated with any organization' });
        }

        const organizationId = memberRecord.organizationId;
        const project = await createProject({
            name: projectName,
            description,
            client,
            EstimatedHours: Number(estimatedHours),
            Budget: budget ? Number(budget) : null,
            StartDate: startDate ? new Date(startDate) : null,
            EndDate: endDate ? new Date(endDate) : null,
            technologies: technologies || [],
            createdById: Number(req.user.id),
            organizationId: organizationId
        });

        const userIds = [...new Set([
            req.user.id,
            ...(Array.isArray(users) ? users : [])
        ])];

        if (userIds.length > 0) {
            await addProjectMembers(project.id, userIds, 'EMPLOYEE');
        }
        res.json(project);
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ error: 'Failed to create project', details: error.message });
    }
};

export const getProjectStatus = (req, res) => {
    try {
        const status = Object.values(ProjectStatus);
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project statuses' });
    }
}

export const getProjectMembers = async (req, res) => {
    try {
        const { projectIds } = req.query;
        const users = await getprojectMembers(projectIds);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch project members' });
    }
}

