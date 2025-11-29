const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { getAllContacts, createContact, updateContact, deleteContact } = require('../controllers/contactController');

router.get('/', authenticateToken, getAllContacts);
router.post('/', authenticateToken, createContact);
router.put('/:id', authenticateToken, updateContact);
router.delete('/:id', authenticateToken, deleteContact);

module.exports = router;