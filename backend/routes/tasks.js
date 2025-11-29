const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/middleware');
const { getAllTasks, createTask, updateTask, deleteTask, updateTaskStatus, getMyTasks } = require('../controllers/taskController');

router.get('/', authenticateToken, getAllTasks);
router.get('/my-tasks', authenticateToken, getMyTasks);
router.post('/', authenticateToken, createTask);
router.put('/:id', authenticateToken, updateTask);
router.put('/:id/status', authenticateToken, updateTaskStatus);
router.delete('/:id', authenticateToken, deleteTask);

module.exports = router;