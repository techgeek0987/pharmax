const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET /api/tasks - Get all tasks
router.get('/', taskController.getAllTasks);

// GET /api/tasks/stats - Get task statistics
router.get('/stats', taskController.getTaskStats);

// GET /api/tasks/filter - Get tasks with filters
router.get('/filter', taskController.getTasksWithFilters);

// GET /api/tasks/overdue - Get overdue tasks
router.get('/overdue', taskController.getOverdueTasks);

// GET /api/tasks/status/:status - Get tasks by status
router.get('/status/:status', taskController.getTasksByStatus);

// GET /api/tasks/priority/:priority - Get tasks by priority
router.get('/priority/:priority', taskController.getTasksByPriority);

// GET /api/tasks/assignee/:assigneeId - Get tasks by assignee
router.get('/assignee/:assigneeId', taskController.getTasksByAssignee);

// GET /api/tasks/:id - Get single task
router.get('/:id', taskController.getTaskById);

// POST /api/tasks - Create new task
router.post('/', taskController.createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', taskController.deleteTask);

// POST /api/tasks/:id/assign - Assign task
router.post('/:id/assign', taskController.assignTask);

// PATCH /api/tasks/:id/status - Update task status
router.patch('/:id/status', taskController.updateTaskStatus);

// POST /api/tasks/:id/comments - Add comment to task
router.post('/:id/comments', taskController.addComment);

module.exports = router;