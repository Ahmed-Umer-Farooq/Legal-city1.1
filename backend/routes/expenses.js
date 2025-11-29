const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { upload } = require('../utils/upload');
const { getAllExpenses, createExpense, updateExpense, deleteExpense, uploadReceipt } = require('../controllers/expenseController');

router.get('/', authenticateToken, getAllExpenses);
router.post('/', authenticateToken, createExpense);
router.put('/:id', authenticateToken, updateExpense);
router.put('/:id/receipt', authenticateToken, (req, res, next) => {
  req.uploadType = 'receipt';
  next();
}, upload.single('receipt'), uploadReceipt);
router.delete('/:id', authenticateToken, deleteExpense);

module.exports = router;