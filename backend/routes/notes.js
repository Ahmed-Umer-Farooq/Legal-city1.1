const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { getAllNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');

router.get('/', authenticateToken, getAllNotes);
router.post('/', authenticateToken, createNote);
router.put('/:id', authenticateToken, updateNote);
router.delete('/:id', authenticateToken, deleteNote);

module.exports = router;