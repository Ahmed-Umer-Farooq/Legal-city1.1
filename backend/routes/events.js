const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { getAllEvents, createEvent, updateEvent, deleteEvent, getUpcomingEvents, getCalendarEvents } = require('../controllers/eventController');

router.get('/', authenticateToken, getAllEvents);
router.get('/upcoming', authenticateToken, getUpcomingEvents);
router.get('/calendar', authenticateToken, getCalendarEvents);
router.post('/', authenticateToken, createEvent);
router.put('/:id', authenticateToken, updateEvent);
router.delete('/:id', authenticateToken, deleteEvent);

module.exports = router;