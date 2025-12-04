const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { 
  getUserAppointments, 
  createUserAppointment, 
  updateUserAppointment, 
  deleteUserAppointment, 
  getUpcomingUserAppointments 
} = require('../controllers/userAppointmentController');

router.get('/', authenticateToken, getUserAppointments);
router.get('/upcoming', authenticateToken, getUpcomingUserAppointments);
router.post('/', authenticateToken, createUserAppointment);
router.put('/:id', authenticateToken, updateUserAppointment);
router.delete('/:id', authenticateToken, deleteUserAppointment);

module.exports = router;