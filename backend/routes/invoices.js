const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { getAllInvoices, createInvoice, updateInvoice, deleteInvoice, sendInvoice, markPaid, generatePDF, getInvoiceStats } = require('../controllers/invoiceController');

router.get('/', authenticateToken, getAllInvoices);
router.get('/stats', authenticateToken, getInvoiceStats);
router.get('/:id/pdf', authenticateToken, generatePDF);
router.post('/', authenticateToken, createInvoice);
router.put('/:id', authenticateToken, updateInvoice);
router.put('/:id/send', authenticateToken, sendInvoice);
router.put('/:id/mark-paid', authenticateToken, markPaid);
router.delete('/:id', authenticateToken, deleteInvoice);

module.exports = router;