import * as eventModel from '../models/eventModel.js';

export const createEventHandler = async (req, res) => {
    try {
        const eventData = {
            ...req.body,
            organizer_id: req.user.id
        };
        const event = await eventModel.createEvent(eventData);
        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ success: false, error: 'Failed to create event', details: error.message });
    }
};

export const getAllEventsHandler = async (req, res) => {
    try {
        const userId = req.user.id;
        const { year, month } = req.query;
        if (!userId || !year || !month) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const events = await eventModel.getEvents(userId, year, month);
        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error("Error fetching events:", error);
        res.status(500).json({ success: false, error: 'Failed to fetch events' });
    }
};

export const getUpcomingEventsHandler = async (req, res) => {

    try {
        const userId = req?.user?.id;
        if (!userId) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }
        const events = await eventModel.getUpcomingEvents(userId);
        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error("Error fetching upcoming events:", error);
        res.status(500).json({ success: false, error: 'Failed to fetch upcoming events' });
    }
};

export const getEventByIdHandler = async (req, res) => {
    try {
        const event = await eventModel.getEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }
        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        console.error("Error fetching event:", error);
        res.status(500).json({ success: false, error: 'Failed to fetch event' });
    }
};

export const updateEventHandler = async (req, res) => {
    try {
        const event = await eventModel.getEventById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Event not found' });
        }

        // Only organizer can update
        if (event.organizer_id !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ success: false, error: 'Not authorized to update this event' });
        }

        const updatedEvent = await eventModel.updateEvent(req.params.id, req.body);
        res.status(200).json({
            success: true,
            data: updatedEvent
        });
    } catch (error) {
        console.error("Error updating event:", error);
        res.status(500).json({ success: false, error: 'Failed to update event' });
    }

};
export const getAllEventTypesHandler = async (req, res) => {
    try {
        const eventTypes = await eventModel.getAllEventTypes();
        res.status(200).json({
            success: true,
            data: eventTypes
        });
    } catch (error) {
        console.error("Error fetching event types:", error);
        res.status(500).json({ success: false, error: 'Failed to fetch event types' });
    }
};  