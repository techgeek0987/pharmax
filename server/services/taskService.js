const BaseService = require('./BaseService');
const Task = require('../models/Task');

class TaskService extends BaseService {
  constructor() {
    const populateOptions = [
      { path: 'assignee', select: 'name email' },
      { path: 'assigner', select: 'name email' },
      { path: 'comments.author', select: 'name email' }
    ];
    
    super(Task, 'Task', populateOptions);
  }

  // Custom search with task-specific fields
  async searchTasks(queryString) {
    const searchableFields = [
      'title',
      'description',
      'status',
      'priority',
      'assignee.name',
      'tags'
    ];
    
    return await this.search(queryString, searchableFields);
  }

  // Get tasks by status
  async getByStatus(status, queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, status };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Get tasks by assignee
  async getByAssignee(assigneeId, queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, assignee: assigneeId };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Get tasks by priority
  async getByPriority(priority, queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, priority };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Get overdue tasks
  async getOverdueTasks(queryString = {}) {
    try {
      const overdueFilter = {
        status: { $nin: ['completed', 'cancelled'] },
        dueDate: { $lt: new Date() }
      };

      const tasks = await this.model.find(overdueFilter)
        .populate(this.populateOptions)
        .sort('-dueDate');

      return {
        data: tasks,
        pagination: {
          page: 1,
          limit: tasks.length,
          total: tasks.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Assign task to user
  async assignTask(taskId, assigneeId, assignerId) {
    try {
      const task = await this.getById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      const updatedTask = await this.update(taskId, {
        assignee: assigneeId,
        assigner: assignerId,
        status: 'assigned'
      });

      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  // Update task status
  async updateStatus(taskId, status) {
    try {
      const task = await this.getById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      const updateData = { status };
      
      // Set completion date if task is completed
      if (status === 'completed') {
        updateData.completedAt = new Date();
      }

      const updatedTask = await this.update(taskId, updateData);
      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  // Add comment to task
  async addComment(taskId, commentData) {
    try {
      const task = await this.getById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      const comment = {
        text: commentData.text,
        author: commentData.authorId,
        createdAt: new Date()
      };

      const updatedTask = await this.update(taskId, {
        $push: { comments: comment }
      });

      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  // Add subtask
  async addSubtask(taskId, subtaskData) {
    try {
      const task = await this.getById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      const subtask = {
        title: subtaskData.title,
        description: subtaskData.description,
        completed: false,
        createdAt: new Date()
      };

      const updatedTask = await this.update(taskId, {
        $push: { subtasks: subtask }
      });

      return updatedTask;
    } catch (error) {
      throw error;
    }
  }

  // Update subtask
  async updateSubtask(taskId, subtaskId, updateData) {
    try {
      const task = await this.getById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }

      const subtaskIndex = task.subtasks.findIndex(
        subtask => subtask._id.toString() === subtaskId
      );

      if (subtaskIndex === -1) {
        throw new Error('Subtask not found');
      }

      // Update subtask fields
      if (updateData.title) task.subtasks[subtaskIndex].title = updateData.title;
      if (updateData.description) task.subtasks[subtaskIndex].description = updateData.description;
      if (updateData.completed !== undefined) {
        task.subtasks[subtaskIndex].completed = updateData.completed;
        task.subtasks[subtaskIndex].completedAt = updateData.completed ? new Date() : null;
      }

      await task.save();
      return await this.getById(taskId);
    } catch (error) {
      throw error;
    }
  }

  // Get tasks with custom filters
  async getWithFilters(filters) {
    try {
      const query = {};

      // Apply filters
      if (filters.status) query.status = filters.status;
      if (filters.priority) query.priority = filters.priority;
      if (filters.assignee) query.assignee = filters.assignee;
      if (filters.tags) query.tags = { $in: filters.tags.split(',') };
      
      // Date filters
      if (filters.dueBefore) query.dueDate = { $lt: new Date(filters.dueBefore) };
      if (filters.dueAfter) query.dueDate = { ...query.dueDate, $gt: new Date(filters.dueAfter) };
      
      if (filters.createdAfter) query.createdAt = { $gte: new Date(filters.createdAfter) };
      if (filters.createdBefore) query.createdAt = { ...query.createdAt, $lte: new Date(filters.createdBefore) };

      const tasks = await this.model.find(query)
        .populate(this.populateOptions)
        .sort('-createdAt');

      return {
        data: tasks,
        pagination: {
          page: 1,
          limit: tasks.length,
          total: tasks.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get task statistics
  async getTaskStats() {
    try {
      const total = await this.count();
      
      const statusStats = await this.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const priorityStats = await this.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      // Overdue tasks count
      const overdueCount = await this.count({
        status: { $nin: ['completed', 'cancelled'] },
        dueDate: { $lt: new Date() }
      });

      // Completion rate
      const completedCount = await this.count({ status: 'completed' });
      const completionRate = total > 0 ? ((completedCount / total) * 100).toFixed(2) : 0;

      // Tasks by assignee
      const assigneeStats = await this.aggregate([
        {
          $match: { assignee: { $exists: true } }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'assignee',
            foreignField: '_id',
            as: 'assigneeInfo'
          }
        },
        {
          $unwind: '$assigneeInfo'
        },
        {
          $group: {
            _id: '$assignee',
            name: { $first: '$assigneeInfo.name' },
            totalTasks: { $sum: 1 },
            completedTasks: {
              $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
            }
          }
        },
        {
          $addFields: {
            completionRate: {
              $multiply: [
                { $divide: ['$completedTasks', '$totalTasks'] },
                100
              ]
            }
          }
        },
        { $sort: { totalTasks: -1 } },
        { $limit: 10 }
      ]);

      return {
        totalTasks: total,
        statusStats,
        priorityStats,
        overdueCount,
        completionRate: parseFloat(completionRate),
        topAssignees: assigneeStats
      };
    } catch (error) {
      throw error;
    }
  }

  // Validate task data
  async validateTaskData(data, isUpdate = false, taskId = null) {
    try {
      const errors = [];

      // Required fields for creation
      if (!isUpdate) {
        if (!data.title) errors.push('Title is required');
        if (!data.description) errors.push('Description is required');
      }

      // Validate priority
      if (data.priority && !['low', 'medium', 'high', 'urgent'].includes(data.priority)) {
        errors.push('Priority must be one of: low, medium, high, urgent');
      }

      // Validate status
      if (data.status && !['pending', 'assigned', 'in-progress', 'completed', 'cancelled'].includes(data.status)) {
        errors.push('Status must be one of: pending, assigned, in-progress, completed, cancelled');
      }

      // Validate due date
      if (data.dueDate && new Date(data.dueDate) < new Date()) {
        errors.push('Due date cannot be in the past');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskService;