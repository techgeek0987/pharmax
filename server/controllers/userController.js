const BaseController = require('./baseController');
const userService = require('../services/userService');

class UserController extends BaseController {
  constructor() {
    super();
  }

  getAllUsers = this.handleAsync(async (req, res) => {
    const users = await userService.getAllUsers();
    this.sendSuccess(res, users, 'Users retrieved successfully');
  });

  getUserProfile = this.handleAsync(async (req, res) => {
    const user = await userService.getUserById(req.userId);
    this.sendSuccess(res, user, 'Profile retrieved successfully');
  });

  updateUserProfile = this.handleAsync(async (req, res) => {
    const { name, email } = req.body;
    const user = await userService.updateUser(req.userId, { name, email });
    this.sendSuccess(res, user, 'Profile updated successfully');
  });

  deleteUser = this.handleAsync(async (req, res) => {
    await userService.deleteUser(req.params.id);
    this.sendSuccess(res, null, 'User deleted successfully');
  });
}

module.exports = new UserController();