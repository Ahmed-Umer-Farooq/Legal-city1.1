const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { getAllClients, getClientById, createClient, updateClient, deleteClient, getClientCases, getClientInvoices } = require('../controllers/clientController');

router.get('/', authenticateToken, getAllClients);
router.get('/:id', authenticateToken, getClientById);
router.get('/:id/cases', authenticateToken, getClientCases);
router.get('/:id/invoices', authenticateToken, getClientInvoices);
router.post('/', authenticateToken, createClient);
router.put('/:id', authenticateToken, updateClient);
router.delete('/:id', authenticateToken, deleteClient);

module.exports = router;