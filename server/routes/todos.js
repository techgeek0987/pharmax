const express = require('express');
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');
const router = express.Router();

// All routes are protected
router.use(auth);

// Todo CRUD routes
router.post('/', todoController.createTodo);
router.get('/', todoController.getTodos);
router.get('/stats', todoController.getTodoStats);
router.get('/:id', todoController.getTodoById);
router.put('/:id', todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);
router.patch('/:id/toggle', todoController.toggleTodoStatus);

module.exports = router;