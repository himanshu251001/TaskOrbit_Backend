import { prisma } from "../lib/prisma.ts";
import { EventType } from "../../generated/prisma/client.ts";

export const createEvent = async (eventData) => {
    const { title, description, date, startTime, endTime, location, type, organizer_id } = eventData;

    return prisma.event.create({
        data: {
            title,
            description,
            event_date: new Date(date),
            start_time: new Date(`${date}T${startTime}:00`),
            end_time: new Date(`${date}T${endTime}:00`),
            location,
            event_type: type,
            organizer_id
        },
        include: {
            organizer: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
};

export const getEvents = async (userId, year, month) => {
    const startOfMonth = new Date(year, Number(month), 1);
    const startOfNextMonth = new Date(year, Number(month) + 1, 1);
    const events = await prisma.event.findMany({
        where: {
            OR: [
                { organizer_id: userId },
                { participants: { some: { id: userId } } }
            ],
            event_date: {
                gte: startOfMonth,
                lt: startOfNextMonth
            }
        },
        orderBy: {
            event_date: 'asc'
        }
    });
    return events;
};


export const getUpcomingEvents = async (userId) => {

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(23, 59, 59, 999);

    const events = await prisma.event.findMany({
        where: {
            OR: [
                { organizer_id: userId },
                { participants: { some: { id: userId } } }
            ],
            event_date: {
                gte: today,
                lte: nextWeek
            }
        },
        orderBy: {
            event_date: 'asc'
        }
    });
    return events;
};

export const getEventById = async (id) => {
    return prisma.event.findUnique({
        where: { id: parseInt(id) },
        include: {
            organizer: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            },
            participants: {
                select: {
                    id: true,
                    name: true
                }
            }
        }
    });
};

export const updateEvent = async (id, updateData) => {
    const { event_date, start_time, end_time, ...rest } = updateData;
    const data = { ...rest };

    if (event_date) data.event_date = new Date(event_date);
    if (start_time) data.start_time = new Date(start_time);
    if (end_time) data.end_time = new Date(end_time);

    return prisma.event.update({
        where: { id: parseInt(id) },
        data
    });
};
export const getAllEventTypes = async () => {
    return Object.values(EventType);
};  