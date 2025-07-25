const BaseController = require('./BaseController');
const TaskService = require('../services/TaskService');

const taskService = new TaskService();
const baseController = new BaseController(taskService);

// Get all tasks with filtering, searching, sorting, and pagination
exports.getAllTasks = baseController.getAll.bind(baseController);

// Get single task by ID
exports.getTaskById = baseController.getById.bind(baseController);

// Create new task
exports.createTask = baseController.create.bind(baseController);

// Update task
exports.updateTask = baseController.update.bind(baseController);

// Delete task
exports.deleteTask = baseController.delete.bind(baseController);

// Get task statistics
exports.getTaskStats = baseController.getStats.bind(baseController);

// Custom task-specific endpoints
exports.getTasksByStatus = async (req, res) => {
  try {
    const result = await taskService.getByStatus(req.params.status, req.query);

    res.status(200).json({
      success: true,
      message: `Tasks with status '${req.params.status}' retrieved successfully`,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting tasks by status:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving tasks by status',
      error: error.message
    });
  }
};

exports.getTasksByAssignee = async (req, res) => {
  try {
    const result = await taskService.getByAssignee(req.params.userId, req.query);

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting tasks by assignee:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving tasks by assignee',
      error: error.message
    });
  }
};

exports.getTasksByPriority = async (req, res) => {
  try {
    const result = await taskService.getByPriority(req.params.priority, req.query);

    res.status(200).json({
      success: true,
      message: `Tasks with priority '${req.params.priority}' retrieved successfully`,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting tasks by priority:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving tasks by priority',
      error: error.message
    });
  }
};

exports.getOverdueTasks = async (req, res) => {
  try {
    const result = await taskService.getOverdueTasks(req.query);

    res.status(200).json({
      success: true,
      message: 'Overdue tasks retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting overdue tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving overdue tasks',
      error: error.message
    });
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { assigneeId, assignerId } = req.body;
    const task = await taskService.assignTask(req.params.id, assigneeId, assignerId);

    res.status(200).json({
      success: true,
      message: 'Task assigned successfully',
      data: task
    });
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({
      success: false,
      message: 'Error assigning task',
      error: error.message
    });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await taskService.updateStatus(req.params.id, status);

    res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating task status',
      error: error.message
    });
  }
};

exports.addComment = async (req, res) => {
  try {
    const task = await taskService.addComment(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: task
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

exports.addSubtask = async (req, res) => {
  try {
    const task = await taskService.addSubtask(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: 'Subtask added successfully',
      data: task
    });
  } catch (error) {
    console.error('Error adding subtask:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding subtask',
      error: error.message
    });
  }
};

exports.updateSubtask = async (req, res) => {
  try {
    const task = await taskService.updateSubtask(req.params.id, req.params.subtaskId, req.body);

    res.status(200).json({
      success: true,
      message: 'Subtask updated successfully',
      data: task
    });
  } catch (error) {
    console.error('Error updating subtask:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subtask',
      error: error.message
    });
  }
};

exports.getTasksWithFilters = async (req, res) => {
  try {
    const result = await taskService.getWithFilters(req.query);

    res.status(200).json({
      success: true,
      message: 'Filtered tasks retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting filtered tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving filtered tasks',
      error: error.message
    });
  }
};