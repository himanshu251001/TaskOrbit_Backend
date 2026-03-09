import "dotenv/config";
import { prisma } from "../src/lib/prisma.ts";

const ids = {
    org1: "1",
    org2: "2",

    user1: "1",
    user2: "2",
    user3: "3",
    user4: "4",
    user5: "5",
    user6: "6",

    project1: "1",
    project2: "2",
    project3: "3",
    project4: "4",

    task1: "1",
    task2: "2",
    task3: "3",
    task4: "4",
    task5: "5",
    task6: "6",
    task7: "7",
    task8: "8",
    task9: "9",
    task10: "10",
    task11: "11",
    task12: "12",
};

async function main() {
    // Clear in dependency order for clean reruns.
    await prisma.task.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.organizationMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();

    await prisma.organization.createMany({
        data: [
            { id: ids.org1, name: "TaskOrbit Labs" },
            { id: ids.org2, name: "OrbitX Services" },
        ],
    });

    await prisma.user.createMany({
        data: [
            {
                id: ids.user1,
                name: "Ravi Shankar",
                email: "ravi@taskorbit.com",
                passwordHash: "hash_ravi",
                updatedAt: new Date(),
            },
            {
                id: ids.user2,
                name: "Anita Menon",
                email: "anita@taskorbit.com",
                passwordHash: "hash_anita",
                updatedAt: new Date(),
            },
            {
                id: ids.user3,
                name: "Karthik Rao",
                email: "karthik@taskorbit.com",
                passwordHash: "hash_karthik",
                updatedAt: new Date(),
            },
            {
                id: ids.user4,
                name: "Priya Nair",
                email: "priya@taskorbit.com",
                passwordHash: "hash_priya",
                updatedAt: new Date(),
            },
            {
                id: ids.user5,
                name: "Dev Patel",
                email: "dev@taskorbit.com",
                passwordHash: "hash_dev",
                updatedAt: new Date(),
            },
            {
                id: ids.user6,
                name: "Meera Iyer",
                email: "meera@taskorbit.com",
                passwordHash: "hash_meera",
                updatedAt: new Date(),
            },
        ],
    });

    await prisma.organizationMember.createMany({
        data: [
            { id: "1", organizationId: ids.org1, userId: ids.user1, role: "DIRECTOR" },
            { id: "2", organizationId: ids.org1, userId: ids.user2, role: "MANAGER" },
            { id: "3", organizationId: ids.org1, userId: ids.user3, role: "EMPLOYEE" },
            { id: "4", organizationId: ids.org1, userId: ids.user4, role: "EMPLOYEE" },
            { id: "5", organizationId: ids.org2, userId: ids.user5, role: "DIRECTOR" },
            { id: "6", organizationId: ids.org2, userId: ids.user6, role: "MANAGER" },
            { id: "7", organizationId: ids.org2, userId: ids.user3, role: "EMPLOYEE" },
        ],
    });

    await prisma.project.createMany({
        data: [
            {
                id: ids.project1,
                name: "TaskOrbit Backend API",
                description: "Core API for tasks, projects, and memberships",
                organizationId: ids.org1,
                createdById: ids.user1,
                updatedAt: new Date(),
            },
            {
                id: ids.project2,
                name: "TaskOrbit Admin Dashboard",
                description: "Internal dashboard for tracking work and metrics",
                organizationId: ids.org1,
                createdById: ids.user2,
                updatedAt: new Date(),
            },
            {
                id: ids.project3,
                name: "OrbitX Client Portal",
                description: "B2B portal for service requests and delivery tracking",
                organizationId: ids.org2,
                createdById: ids.user5,
                updatedAt: new Date(),
            },
            {
                id: ids.project4,
                name: "OrbitX Notifications Engine",
                description: "Event-driven notification service",
                organizationId: ids.org2,
                createdById: ids.user6,
                updatedAt: new Date(),
            },
        ],
    });

    await prisma.projectMember.createMany({
        data: [
            { id: "1", projectId: ids.project1, userId: ids.user1, role: "MANAGER" },
            { id: "2", projectId: ids.project1, userId: ids.user2, role: "LEAD" },
            { id: "3", projectId: ids.project1, userId: ids.user3, role: "EMPLOYEE" },
            { id: "4", projectId: ids.project1, userId: ids.user4, role: "EMPLOYEE" },

            { id: "5", projectId: ids.project2, userId: ids.user2, role: "MANAGER" },
            { id: "6", projectId: ids.project2, userId: ids.user4, role: "LEAD" },
            { id: "7", projectId: ids.project2, userId: ids.user1, role: "EMPLOYEE" },

            { id: "8", projectId: ids.project3, userId: ids.user5, role: "MANAGER" },
            { id: "9", projectId: ids.project3, userId: ids.user6, role: "LEAD" },
            { id: "10", projectId: ids.project3, userId: ids.user3, role: "EMPLOYEE" },

            { id: "11", projectId: ids.project4, userId: ids.user6, role: "MANAGER" },
            { id: "12", projectId: ids.project4, userId: ids.user5, role: "LEAD" },
        ],
    });

    await prisma.task.createMany({
        data: [
            {
                id: ids.task1,
                title: "Setup Prisma migrations",
                description: "Define baseline schema and run first migration",
                status: "COMPLETED",
                priority: "HIGH",
                dueDate: new Date("2026-03-02T10:00:00.000Z"),
                projectId: ids.project1,
                createdById: ids.user1,
                assignedToId: ids.user2,
                updatedAt: new Date(),
            },
            {
                id: ids.task2,
                title: "Implement task stats endpoint",
                description: "Return counts grouped by status and priority",
                status: "IN_PROGRESS",
                priority: "HIGHEST",
                dueDate: new Date("2026-03-07T15:00:00.000Z"),
                projectId: ids.project1,
                createdById: ids.user2,
                assignedToId: ids.user3,
                updatedAt: new Date(),
            },
            {
                id: ids.task3,
                title: "Add dashboard routes",
                description: "Expose dashboard endpoints with redirects",
                status: "TESTING",
                priority: "MEDIUM",
                dueDate: new Date("2026-03-05T12:00:00.000Z"),
                projectId: ids.project1,
                createdById: ids.user2,
                assignedToId: ids.user4,
                updatedAt: new Date(),
            },
            {
                id: ids.task4,
                title: "Write API integration tests",
                description: "Cover task listing and role-based filtering",
                status: "TODO",
                priority: "HIGH",
                dueDate: new Date("2026-03-10T09:30:00.000Z"),
                projectId: ids.project1,
                createdById: ids.user1,
                assignedToId: null,
                updatedAt: new Date(),
            },
            {
                id: ids.task5,
                title: "Design dashboard widgets",
                description: "Define cards and charts for task health",
                status: "IN_PROGRESS",
                priority: "MEDIUM",
                dueDate: new Date("2026-03-12T11:00:00.000Z"),
                projectId: ids.project2,
                createdById: ids.user2,
                assignedToId: ids.user4,
                updatedAt: new Date(),
            },
            {
                id: ids.task6,
                title: "Implement auth guards",
                description: "Secure admin routes using JWT middleware",
                status: "TODO",
                priority: "HIGHEST",
                dueDate: new Date("2026-03-09T16:00:00.000Z"),
                projectId: ids.project2,
                createdById: ids.user2,
                assignedToId: ids.user1,
                updatedAt: new Date(),
            },
            {
                id: ids.task7,
                title: "Optimize dashboard queries",
                description: "Reduce N+1 patterns using joined fetches",
                status: "TODO",
                priority: "HIGH",
                dueDate: new Date("2026-03-16T08:30:00.000Z"),
                projectId: ids.project2,
                createdById: ids.user4,
                assignedToId: ids.user2,
                updatedAt: new Date(),
            },
            {
                id: ids.task8,
                title: "Bootstrap client portal database",
                description: "Create initial tables and indexes",
                status: "COMPLETED",
                priority: "HIGH",
                dueDate: new Date("2026-03-01T13:45:00.000Z"),
                projectId: ids.project3,
                createdById: ids.user5,
                assignedToId: ids.user6,
                updatedAt: new Date(),
            },
            {
                id: ids.task9,
                title: "Build project onboarding flow",
                description: "Wizard for new client project creation",
                status: "IN_PROGRESS",
                priority: "HIGHEST",
                dueDate: new Date("2026-03-14T14:00:00.000Z"),
                projectId: ids.project3,
                createdById: ids.user6,
                assignedToId: ids.user3,
                updatedAt: new Date(),
            },
            {
                id: ids.task10,
                title: "Create email notification templates",
                description: "Templates for alerts, reminders, and digests",
                status: "TESTING",
                priority: "MEDIUM",
                dueDate: new Date("2026-03-11T10:30:00.000Z"),
                projectId: ids.project4,
                createdById: ids.user6,
                assignedToId: ids.user5,
                updatedAt: new Date(),
            },
            {
                id: ids.task11,
                title: "Queue retry mechanism",
                description: "Add retry policy with exponential backoff",
                status: "TODO",
                priority: "HIGH",
                dueDate: new Date("2026-03-18T17:00:00.000Z"),
                projectId: ids.project4,
                createdById: ids.user5,
                assignedToId: ids.user6,
                updatedAt: new Date(),
            },
            {
                id: ids.task12,
                title: "Delivery webhook monitoring",
                description: "Track failures and add alert thresholds",
                status: "IN_PROGRESS",
                priority: "HIGH",
                dueDate: new Date("2026-03-20T19:00:00.000Z"),
                projectId: ids.project4,
                createdById: ids.user6,
                assignedToId: null,
                updatedAt: new Date(),
            },
        ],
    });

    console.log("Seed complete: 2 orgs, 6 users, 4 projects, 12 tasks inserted.");
}

main()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
