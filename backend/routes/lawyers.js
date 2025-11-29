const express = require('express');
const { getLawyersDirectory, getLawyerById, sendMessageToLawyer } = require('../controllers/lawyerController');

const router = express.Router();

// Public routes for lawyers directory
router.get('/', getLawyersDirectory);
router.get('/:id', getLawyerById);
router.post('/:id/message', sendMessageToLawyer);

module.exports = router;
