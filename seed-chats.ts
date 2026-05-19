import "dotenv/config";
import { prisma } from "./src/lib/prisma.ts";

async function main() {
    console.log("Seeding demo chats...");

    // 1. Create Group Chats
    console.log("Creating groups...");
    const group1 = await prisma.chatGroup.upsert({
        where: { name: "TaskOrbit General" },
        update: {},
        create: {
            name: "TaskOrbit General",
            members: {
                create: [
                    { userId: 1 },
                    { userId: 2 },
                    { userId: 3 },
                    { userId: 4 },
                    
                ],
            },
        },
    });

    const group2 = await prisma.chatGroup.upsert({
        where: { name: "OrbitX General" },
        update: {},
        create: {
            name: "OrbitX General",
            members: {
                create: [
                    { userId: 3 },
                    { userId: 5 },
                    { userId: 6 },
                ],
            },
        },
    });

    // 2. Create Direct Messages
    console.log("Creating direct messages...");
    const directMessages = [
        // User 1 & 2
        { content: "Hey Anita, how is the TaskOrbit Admin Dashboard coming along?", senderId: 1, receiverId: 2 },
        { content: "Hi Ravi! It's going well. I'm working on the auth guards right now.", senderId: 2, receiverId: 1 },
        { content: "Great to hear. Let me know if you need any help with JWT.", senderId: 1, receiverId: 2 },

        // User 1 & 3
        { content: "Karthik, did you check the new stats endpoint?", senderId: 1, receiverId: 3 },
        { content: "Yes, just reviewed the PR. Looks good to me.", senderId: 3, receiverId: 1 },

        // User 5 & 6
        { content: "Meera, the OrbitX client portal needs the initial tables.", senderId: 5, receiverId: 6 },
        { content: "On it, Dev. I'll bootstrap the DB today.", senderId: 6, receiverId: 5 },
    ];

    await prisma.chatMessage.createMany({
        data: directMessages,
    });

    // 3. Create Group Messages
    console.log("Creating group messages...");
    const groupMessages = [
        // TaskOrbit General
        { content: "Welcome everyone to the TaskOrbit General chat!", senderId: 1, groupId: group1.id },
        { content: "Thanks! Excited to be here.", senderId: 2, groupId: group1.id },
        { content: "Hello team!", senderId: 3, groupId: group1.id },
        { content: "Hey all, ready to crush some tasks.", senderId: 4, groupId: group1.id },

        // OrbitX General
        { content: "OrbitX team, please make sure your tasks are updated for the sprint.", senderId: 5, groupId: group2.id },
        { content: "Will do.", senderId: 6, groupId: group2.id },
        { content: "Already updated mine.", senderId: 3, groupId: group2.id },
    ];

    await prisma.chatMessage.createMany({
        data: groupMessages,
    });

    console.log("Seed chats complete!");
}

main()
    .catch((error) => {
        console.error("Seed failed:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
