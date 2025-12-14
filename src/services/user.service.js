// src/services/user.service.js
const UserModel = require("../models/user.model");

class UserService {
  static async getAllUsers(filters = {}) {
    return await UserModel.findAll(filters);
  }

  static async getUserById(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw { statusCode: 404, message: "User not found" };
    }
    return user;
  }

  static async getUserProfile(userId) {
    const user = await this.getUserById(userId);
    const stats = await UserModel.getActivityStats(userId);

    return {
      ...user,
      activity_stats: stats,
    };
  }

  static async updateUserRole(userId, role, adminId) {
    const user = await this.getUserById(userId);

    // Prevent self role change
    if (userId === adminId) {
      throw { statusCode: 400, message: "Cannot change your own role" };
    }

    return await UserModel.updateRole(userId, role);
  }

  static async updateUserStatus(userId, status, adminId) {
    const user = await this.getUserById(userId);

    // Prevent self deactivation
    if (userId === adminId && status === "inactive") {
      throw { statusCode: 400, message: "Cannot deactivate your own account" };
    }

    return await UserModel.updateStatus(userId, status);
  }

  static async deactivateUser(userId, adminId) {
    return this.updateUserStatus(userId, "inactive", adminId);
  }
}

module.exports = UserService;
