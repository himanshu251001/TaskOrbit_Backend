import express from 'express';
import * as eventController from '../controllers/eventController.js';

const router = express.Router();

router.get('/', eventController.getAllEventsHandler);
router.get('/upcoming', eventController.getUpcomingEventsHandler);
router.get('/types', eventController.getAllEventTypesHandler);
router.post('/', eventController.createEventHandler);
router.get('/:id', eventController.getEventByIdHandler);
router.put('/:id', eventController.updateEventHandler);

export default router;
