// src/controllers/user.controller.js
const UserService = require('../services/user.service');
const ResponseHandler = require('../utils/responseHandler');
const logger = require('../utils/logger');

class UserController {
  /**
   * Get all users (Admin only)
   */
  static async getAll(req, res, next) {
    try {
      const filters = {
        role: req.query.role,
        status: req.query.status,
      };

      const users = await UserService.getAllUsers(filters);
      return ResponseHandler.success(res, users, 'Users retrieved successfully');
    } catch (error) {
      logger.error('Error fetching users:', error);
      next(error);
    }
  }

  /**
   * Get user by ID (Admin/Manager)
   */
  static async getById(req, res, next) {
    try {
      const user = await UserService.getUserById(req.params.id);
      return ResponseHandler.success(res, user, 'User retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req, res, next) {
    try {
      const profile = await UserService.getUserProfile(req.user.id);
      return ResponseHandler.success(res, profile, 'Profile retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user role (Admin only)
   */
  static async updateRole(req, res, next) {
    try {
      const { role } = req.body;
      const user = await UserService.updateUserRole(
        req.params.id,
        role,
        req.user.id
      );
      return ResponseHandler.success(res, user, 'User role updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user status (Admin only)
   */
  static async updateStatus(req, res, next) {
    try {
      const { status } = req.body;
      const user = await UserService.updateUserStatus(
        req.params.id,
        status,
        req.user.id
      );
      return ResponseHandler.success(res, user, 'User status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deactivate user (Admin only)
   */
  static async deactivate(req, res, next) {
    try {
      await UserService.deactivateUser(req.params.id, req.user.id);
      return ResponseHandler.success(res, null, 'User deactivated successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
