import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const allTasks = await prisma.task.findMany({ select: { id: true, title: true, dueDate: true } });
  console.log("All tasks:", allTasks);

  const lteTasks = await prisma.task.findMany({
    where: { dueDate: { lte: new Date('2026-12-31T23:59:59.999Z') } },
    select: { id: true, title: true, dueDate: true }
  });
  console.log("Tasks with lte filter:", lteTasks);
}
main().catch(console.error).finally(() => prisma.$disconnect());
