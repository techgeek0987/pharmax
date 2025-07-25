const Todo = require('../models/Todo');
const ApiQueryBuilder = require('../utils/apiQueryBuilder');

const todoService = {
  async createTodo(userId, todoData) {
    const todo = new Todo({
      ...todoData,
      user: userId
    });
    return await todo.save();
  },

  async getTodosByUser(userId, queryString) {
    const filter = { user: userId };
    
    // Build query with ApiQueryBuilder
    const features = new ApiQueryBuilder(Todo.find(filter), queryString)
      .filter()
      .search(['title', 'description', 'category'])
      .sort()
      .limitFields()
      .paginate();

    const todos = await features.execute();
    const paginationInfo = await features.getPaginationInfo(Todo, filter);

    return {
      todos,
      pagination: paginationInfo
    };
  },

  async getTodoById(todoId, userId) {
    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  },

  async updateTodo(todoId, userId, updateData) {
    const todo = await Todo.findOneAndUpdate(
      { _id: todoId, user: userId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  },

  async deleteTodo(todoId, userId) {
    const todo = await Todo.findOneAndDelete({ _id: todoId, user: userId });
    if (!todo) {
      throw new Error('Todo not found');
    }
    return todo;
  },

  async toggleTodoStatus(todoId, userId) {
    const todo = await Todo.findOne({ _id: todoId, user: userId });
    if (!todo) {
      throw new Error('Todo not found');
    }
    
    todo.completed = !todo.completed;
    return await todo.save();
  },

  async getTodoStats(userId) {
    const stats = await Todo.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ['$completed', 1, 0] } },
          pending: { $sum: { $cond: ['$completed', 0, 1] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          medium: { $sum: { $cond: [{ $eq: ['$priority', 'medium'] }, 1, 0] } },
          low: { $sum: { $cond: [{ $eq: ['$priority', 'low'] }, 1, 0] } }
        }
      }
    ]);

    return stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      high: 0,
      medium: 0,
      low: 0
    };
  }
};

module.exports = todoService;