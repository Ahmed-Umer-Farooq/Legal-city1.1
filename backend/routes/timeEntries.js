const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { getAllTimeEntries, createTimeEntry, updateTimeEntry, deleteTimeEntry, startTimer, stopTimer } = require('../controllers/timeEntryController');

router.get('/', authenticateToken, getAllTimeEntries);
router.post('/', authenticateToken, createTimeEntry);
router.post('/start-timer', authenticateToken, startTimer);
router.put('/:id', authenticateToken, updateTimeEntry);
router.put('/:id/stop-timer', authenticateToken, stopTimer);
router.delete('/:id', authenticateToken, deleteTimeEntry);

module.exports = router;