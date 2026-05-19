import "dotenv/config";
import { prisma } from "../src/lib/prisma.ts";

const ids = {
<<<<<<< HEAD
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
=======
    org1: 1,
    org2: 2,

    user1: 1,
    user2: 2,
    user3: 3,
    user4: 4,
    user5: 5,
    user6: 6,

    project1: 1,
    project2: 2,
    project3: 3,
    project4: 4,

    task1: 1,
    task2: 2,
    task3: 3,
    task4: 4,
    task5: 5,
    task6: 6,
    task7: 7,
    task8: 8,
    task9: 9,
    task10: 10,
    task11: 11,
    task12: 12,
};

const technologyCatalog = [
    "Node.js", "React", "Vue.js", "Angular", "Svelte", "Next.js", "Nuxt.js", "HTML5", "CSS3", "Tailwind CSS",
    "Bootstrap", "TypeScript", "JavaScript", "Redux", "GraphQL", "Webpack", "Vite", "Jest", "Cypress", "Storybook",
    "Express", "NestJS", "Django", "Flask", "Laravel", "Spring", "Ruby on Rails", "ASP.NET", "FastAPI", "Socket.io",
    "MongoDB", "MySQL", "PostgreSQL", "Redis", "SQLite", "Firebase", "Supabase", "Docker", "Kubernetes", "AWS",
    "Azure", "Google Cloud", "Nginx", "Python", "Java", "Go", "Rust", "Flutter", "Git", "GitHub", "Prisma", "Kafka",
    "Elasticsearch", "Grafana", "Vercel", "Netlify", "Cloudflare", "Strapi", "Figma", "Slack", "Palantir", "Datadog"
];

async function main() {
    // Upsert organizations
    const organizationData = [
        { id: ids.org1, name: "TaskOrbit Labs" },
        { id: ids.org2, name: "OrbitX Services" },
    ];
    for (const org of organizationData) {
        await prisma.organization.upsert({
            where: { id: org.id },
            update: org,
            create: org,
        });
    }

    // Upsert users
    const userData = [
        { id: ids.user1, name: "Ravi Shankar", email: "ravi@taskorbit.com", passwordHash: "hash_ravi", updatedAt: new Date() },
        { id: ids.user2, name: "Anita Menon", email: "anita@taskorbit.com", passwordHash: "hash_anita", updatedAt: new Date() },
        { id: ids.user3, name: "Karthik Rao", email: "karthik@taskorbit.com", passwordHash: "hash_karthik", updatedAt: new Date() },
        { id: ids.user4, name: "Priya Nair", email: "priya@taskorbit.com", passwordHash: "hash_priya", updatedAt: new Date() },
        { id: ids.user5, name: "Dev Patel", email: "dev@taskorbit.com", passwordHash: "hash_dev", updatedAt: new Date() },
        { id: ids.user6, name: "Meera Iyer", email: "meera@taskorbit.com", passwordHash: "hash_meera", updatedAt: new Date() },
    ];
    for (const user of userData) {
        await prisma.user.upsert({
            where: { id: user.id },
            update: user,
            create: user,
        });
    }

    // Upsert organization members
    const organizationMemberData = [
        { id: 1, organizationId: ids.org1, userId: ids.user1, role: "DIRECTOR" },
        { id: 2, organizationId: ids.org1, userId: ids.user2, role: "MANAGER" },
        { id: 3, organizationId: ids.org1, userId: ids.user3, role: "EMPLOYEE" },
        { id: 4, organizationId: ids.org1, userId: ids.user4, role: "EMPLOYEE" },
        { id: 5, organizationId: ids.org2, userId: ids.user5, role: "DIRECTOR" },
        { id: 6, organizationId: ids.org2, userId: ids.user6, role: "MANAGER" },
        { id: 7, organizationId: ids.org2, userId: ids.user3, role: "EMPLOYEE" },
    ];
    for (const member of organizationMemberData) {
        await prisma.organizationMember.upsert({
            where: { id: member.id },
            update: member,
            create: member,
        });
    }

    // Upsert projects
    const projectData = [
        {
            id: ids.project1,
            name: "TaskOrbit Backend API",
            description: "Core API for tasks, projects, and memberships",
            technologies: technologyCatalog.slice(0, 16),
            organizationId: ids.org1,
            createdById: ids.user1,
            status: "ACTIVE",
            client: "TaskOrbit Internal",
            Budget: 150000,
            EstimatedHours: 950,
            StartDate: new Date("2026-01-10T09:00:00.000Z"),
            EndDate: new Date("2026-06-30T18:00:00.000Z"),
            updatedAt: new Date(),
        },
        {
            id: ids.project2,
            name: "TaskOrbit Admin Dashboard",
            description: "Internal dashboard for tracking work and metrics",
            technologies: technologyCatalog.slice(8, 28),
            organizationId: ids.org1,
            createdById: ids.user2,
            status: "ON_HOLD",
            client: "TaskOrbit Leadership Team",
            Budget: 90000,
            EstimatedHours: 620,
            StartDate: new Date("2026-02-01T09:00:00.000Z"),
            EndDate: new Date("2026-07-15T18:00:00.000Z"),
            updatedAt: new Date(),
        },
        {
            id: ids.project3,
            name: "OrbitX Client Portal",
            description: "B2B portal for service requests and delivery tracking",
            technologies: technologyCatalog.slice(20, 42),
            organizationId: ids.org2,
            createdById: ids.user5,
            status: "ACTIVE",
            client: "OrbitX Enterprise Clients",
            Budget: 210000,
            EstimatedHours: 1280,
            StartDate: new Date("2026-01-05T09:00:00.000Z"),
            EndDate: new Date("2026-09-30T18:00:00.000Z"),
            updatedAt: new Date(),
        },
        {
            id: ids.project4,
            name: "OrbitX Notifications Engine",
            description: "Event-driven notification service",
            technologies: technologyCatalog.slice(30, 56),
            organizationId: ids.org2,
            createdById: ids.user6,
            status: "PENDING",
            client: "OrbitX Platform Team",
            Budget: 120000,
            EstimatedHours: 780,
            StartDate: new Date("2026-03-20T09:00:00.000Z"),
            EndDate: new Date("2026-10-10T18:00:00.000Z"),
            updatedAt: new Date(),
        },
    ];
    for (const project of projectData) {
        await prisma.project.upsert({
            where: { id: project.id },
            update: project,
            create: project,
        });
    }

    // Upsert project members
    const projectMemberData = [
        { id: 1, projectId: ids.project1, userId: ids.user1, role: "MANAGER" },
        { id: 2, projectId: ids.project1, userId: ids.user2, role: "LEAD" },
        { id: 3, projectId: ids.project1, userId: ids.user3, role: "EMPLOYEE" },
        { id: 4, projectId: ids.project1, userId: ids.user4, role: "EMPLOYEE" },
        { id: 5, projectId: ids.project2, userId: ids.user2, role: "MANAGER" },
        { id: 6, projectId: ids.project2, userId: ids.user4, role: "LEAD" },
        { id: 7, projectId: ids.project2, userId: ids.user1, role: "EMPLOYEE" },
        { id: 8, projectId: ids.project3, userId: ids.user5, role: "MANAGER" },
        { id: 9, projectId: ids.project3, userId: ids.user6, role: "LEAD" },
        { id: 10, projectId: ids.project3, userId: ids.user3, role: "EMPLOYEE" },
        { id: 11, projectId: ids.project4, userId: ids.user6, role: "MANAGER" },
        { id: 12, projectId: ids.project4, userId: ids.user5, role: "LEAD" },
    ];
    for (const member of projectMemberData) {
        await prisma.projectMember.upsert({
            where: { id: member.id },
            update: member,
            create: member,
        });
    }

    // Upsert tasks
    const taskData = [
        { id: ids.task1, title: "Setup Prisma migrations", description: "Define baseline schema", workType: "TASK", status: "COMPLETED", priority: "HIGH", dueDate: new Date("2026-03-02"), projectId: ids.project1, createdById: ids.user1, assignedToId: ids.user2, updatedAt: new Date() },
        { id: ids.task2, title: "Implement task stats endpoint", description: "Return counts", workType: "STORY", status: "IN_PROGRESS", priority: "HIGHEST", dueDate: new Date("2026-03-07"), projectId: ids.project1, createdById: ids.user2, assignedToId: ids.user3, updatedAt: new Date() },
        { id: ids.task3, title: "Add dashboard routes", description: "Expose endpoints", workType: "STORY", status: "TESTING", priority: "MEDIUM", dueDate: new Date("2026-03-05"), projectId: ids.project1, createdById: ids.user2, assignedToId: ids.user4, updatedAt: new Date() },
        { id: ids.task4, title: "Write API integration tests", description: "Cover listing", workType: "TASK", status: "TODO", priority: "HIGH", dueDate: new Date("2026-03-10"), projectId: ids.project1, createdById: ids.user1, assignedToId: null, updatedAt: new Date() },
        { id: ids.task5, title: "Design dashboard widgets", description: "Define cards", workType: "EPIC", status: "IN_PROGRESS", priority: "MEDIUM", dueDate: new Date("2026-03-12"), projectId: ids.project2, createdById: ids.user2, assignedToId: ids.user4, updatedAt: new Date() },
        { id: ids.task6, title: "Implement auth guards", description: "Secure routes", workType: "TASK", status: "TODO", priority: "HIGHEST", dueDate: new Date("2026-03-09"), projectId: ids.project2, createdById: ids.user2, assignedToId: ids.user1, updatedAt: new Date() },
        { id: ids.task7, title: "Optimize dashboard queries", description: "Reduce N+1", workType: "TASK", status: "TODO", priority: "HIGH", dueDate: new Date("2026-03-16"), projectId: ids.project2, createdById: ids.user4, assignedToId: ids.user2, updatedAt: new Date() },
        { id: ids.task8, title: "Bootstrap client portal", description: "Create tables", workType: "TASK", status: "COMPLETED", priority: "HIGH", dueDate: new Date("2026-03-01"), projectId: ids.project3, createdById: ids.user5, assignedToId: ids.user6, updatedAt: new Date() },
        { id: ids.task9, title: "Build project onboarding", description: "Wizard flow", workType: "EPIC", status: "IN_PROGRESS", priority: "HIGHEST", dueDate: new Date("2026-03-14"), projectId: ids.project3, createdById: ids.user6, assignedToId: ids.user3, updatedAt: new Date() },
        { id: ids.task10, title: "Create email templates", description: "Templates for alerts", workType: "STORY", status: "TESTING", priority: "MEDIUM", dueDate: new Date("2026-03-11"), projectId: ids.project4, createdById: ids.user6, assignedToId: ids.user5, updatedAt: new Date() },
        { id: ids.task11, title: "Queue retry mechanism", description: "Exponential backoff", workType: "BUG", status: "TODO", priority: "HIGH", dueDate: new Date("2026-03-18"), projectId: ids.project4, createdById: ids.user5, assignedToId: ids.user6, updatedAt: new Date() },
        { id: ids.task12, title: "Delivery webhook monitoring", description: "Track failures", workType: "BUG", status: "IN_PROGRESS", priority: "HIGH", dueDate: new Date("2026-03-20"), projectId: ids.project4, createdById: ids.user6, assignedToId: null, updatedAt: new Date() },
    ];
    for (const task of taskData) {
        await prisma.task.upsert({
            where: { id: task.id },
            update: task,
            create: task,
        });
    }

    // ============================================================
    //  Event Seeding
    // ============================================================
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventSeeds = [
        {
            id: 1,
            title: "Prisma & PostgreSQL Workshop",
            description: "A deep dive into Prisma and PostgreSQL relations.",
            event_date: today,
            start_time: new Date(new Date().setHours(10, 0, 0, 0)),
            end_time: new Date(new Date().setHours(12, 0, 0, 0)),
            location: "Room 101",
            event_type: "Workshop",
            organizer_id: ids.user1,
            status: "scheduled",
            participants: [ids.user2, ids.user3]
        },
        {
            id: 2,
            title: "Weekly Sync Meeting",
            description: "Internal team sync for TaskOrbit project.",
            event_date: new Date(new Date(today).setDate(today.getDate() + 1)),
            start_time: new Date(new Date().setHours(14, 0, 0, 0)),
            end_time: new Date(new Date().setHours(15, 0, 0, 0)),
            location: "Online (Teams)",
            event_type: "Meeting",
            organizer_id: ids.user2,
            status: "scheduled",
            participants: [ids.user1, ids.user4]
        },
        {
            id: 3,
            title: "Future of Agentic AI Webinar",
            description: "Discussing the roadmap for TaskOrbit's AI features.",
            event_date: new Date(new Date(today).setDate(today.getDate() + 3)),
            start_time: new Date(new Date().setHours(16, 0, 0, 0)),
            end_time: new Date(new Date().setHours(18, 0, 0, 0)),
            location: "Webinar Platform",
            event_type: "Webinar",
            organizer_id: ids.user5,
            status: "scheduled",
            participants: [ids.user1, ids.user6]
        },
        {
            id: 4,
            title: "Annual Tech Conference",
            description: "Industry-wide conference on modern web tech.",
            event_date: new Date(new Date(today).setDate(today.getDate() + 10)),
            start_time: new Date(new Date().setHours(9, 0, 0, 0)),
            end_time: new Date(new Date().setHours(17, 0, 0, 0)),
            location: "Convention Center",
            event_type: "Conference",
            organizer_id: ids.user1,
            status: "scheduled",
            participants: [ids.user2, ids.user5]
        },
        {
            id: 5,
            title: "Design System Review",
            description: "Review of the new TaskOrbit design system components.",
            event_date: new Date(new Date(today).setDate(today.getDate() - 2)),
            start_time: new Date(new Date().setHours(11, 0, 0, 0)),
            end_time: new Date(new Date().setHours(12, 30, 0, 0)),
            location: "Design Lab",
            event_type: "Meeting",
            organizer_id: ids.user4,
            status: "completed",
            participants: [ids.user1, ids.user2]
        },
        {
            id: 6,
            title: "Security & Auth Training",
            description: "Mandatory session on securing API endpoints.",
            event_date: new Date(new Date(today).setDate(today.getDate() + 1)),
            start_time: new Date(new Date().setHours(9, 30, 0, 0)),
            end_time: new Date(new Date().setHours(11, 0, 0, 0)),
            location: "Online",
            event_type: "Training",
            organizer_id: ids.user2,
            status: "scheduled",
            participants: [ids.user1, ids.user3, ids.user4, ids.user5, ids.user6]
        },
        {
            id: 7,
            title: "Product Roadmap Q3",
            description: "Strategic planning for the next quarter.",
            event_date: new Date(new Date(today).setDate(today.getDate() + 5)),
            start_time: new Date(new Date().setHours(13, 0, 0, 0)),
            end_time: new Date(new Date().setHours(15, 0, 0, 0)),
            location: "Executive Boardroom",
            event_type: "Seminar",
            organizer_id: ids.user1,
            status: "scheduled",
            participants: [ids.user2, ids.user5]
        },
        {
            id: 8,
            title: "Client Appreciation Brunch",
            description: "Social event for our top-tier clients.",
            event_date: new Date(new Date(today).setDate(today.getDate() + 15)),
            start_time: new Date(new Date().setHours(10, 30, 0, 0)),
            end_time: new Date(new Date().setHours(13, 0, 0, 0)),
            location: "Rooftop Garden",
            event_type: "Meeting",
            organizer_id: ids.user6,
            status: "scheduled",
            participants: [ids.user1, ids.user5]
        }
    ];

    for (const seed of eventSeeds) {
        const { participants, ...eventData } = seed;
        await prisma.event.upsert({
            where: { id: seed.id },
            update: {
                ...eventData,
                participants: {
                    set: participants.map(id => ({ id }))
                }
            },
            create: {
                ...eventData,
                participants: {
                    connect: participants.map(id => ({ id }))
                }
            }
        });
    }

    console.log("Seed complete: More events seeded successfully.");
>>>>>>> ac29622 (Initial commit)
}

main()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
