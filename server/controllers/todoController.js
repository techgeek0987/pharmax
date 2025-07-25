const BaseController = require('./baseController');
const todoService = require('../services/todoService');

class TodoController extends BaseController {
  constructor() {
    super();
  }

  createTodo = this.handleAsync(async (req, res) => {
    const { title, description, priority, dueDate, category, tags } = req.body;
    
    if (!title) {
      return this.sendValidationError(res, { title: 'Title is required' });
    }

    const todo = await todoService.createTodo(req.userId, {
      title,
      description,
      priority,
      dueDate,
      category,
      tags
    });

    this.sendSuccess(res, todo, 'Todo created successfully', 201);
  });

  getTodos = this.handleAsync(async (req, res) => {
    const result = await todoService.getTodosByUser(req.userId, req.query);
    this.sendPaginatedResponse(res, result.todos, result.pagination, 'Todos retrieved successfully');
  });

  getTodoById = this.handleAsync(async (req, res) => {
    const todo = await todoService.getTodoById(req.params.id, req.userId);
    this.sendSuccess(res, todo, 'Todo retrieved successfully');
  });

  updateTodo = this.handleAsync(async (req, res) => {
    const { title, description, priority, dueDate, category, tags, completed } = req.body;
    
    const todo = await todoService.updateTodo(req.params.id, req.userId, {
      title,
      description,
      priority,
      dueDate,
      category,
      tags,
      completed
    });

    this.sendSuccess(res, todo, 'Todo updated successfully');
  });

  deleteTodo = this.handleAsync(async (req, res) => {
    await todoService.deleteTodo(req.params.id, req.userId);
    this.sendSuccess(res, null, 'Todo deleted successfully');
  });

  toggleTodoStatus = this.handleAsync(async (req, res) => {
    const todo = await todoService.toggleTodoStatus(req.params.id, req.userId);
    this.sendSuccess(res, todo, 'Todo status updated successfully');
  });

  getTodoStats = this.handleAsync(async (req, res) => {
    const stats = await todoService.getTodoStats(req.userId);
    this.sendSuccess(res, stats, 'Todo statistics retrieved successfully');
  });
}

module.exports = new TodoController();