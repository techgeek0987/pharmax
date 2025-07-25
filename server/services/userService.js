const User = require('../models/User');

const userService = {
  async getAllUsers() {
    return await User.find().select('-password');
  },

  async getUserById(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  async getUserByEmail(email) {
    return await User.findOne({ email });
  },

  async updateUser(userId, updateData) {
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  async createUser(userData) {
    const user = new User(userData);
    return await user.save();
  }
};

module.exports = userService;