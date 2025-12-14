// src/models/user.model.js
const db = require("../config/database");

class UserModel {
  /**
   * Find all users with optional filters
   */
  static async findAll(filters = {}) {
    let query = db("users").select("*");

    if (filters.role) {
      query = query.where({ role: filters.role });
    }

    if (filters.status) {
      query = query.where({ status: filters.status });
    }

    return query.orderBy("created_at", "desc");
  }

  /**
   * Find user by internal user_id
   */
  static async findById(userId) {
    return db("users").where({ user_id: userId }).first();
  }

  /**
   * Find user by Clerk user ID
   */
  static async findByClerkId(clerkUserId) {
    return db("users").where({ clerk_user_id: clerkUserId }).first();
  }

  /**
   * Find user by email
   */
  static async findByEmail(email) {
    return db("users").where({ email }).first();
  }

  /**
   * Create new user
   */
  static async create(userData) {
    const [user] = await db("users").insert(userData).returning("*");
    return user;
  }

  /**
   * Update user
   */
  static async update(userId, userData) {
    const [user] = await db("users")
      .where({ user_id: userId })
      .update({ ...userData, updated_at: db.fn.now() })
      .returning("*");
    return user;
  }

  /**
   * Update user role (admin only)
   */
  static async updateRole(userId, role) {
    return this.update(userId, { role });
  }

  /**
   * Update user status
   */
  static async updateStatus(userId, status) {
    return this.update(userId, { status });
  }

  /**
   * Soft delete (deactivate) user
   */
  static async deactivate(userId) {
    return this.updateStatus(userId, "inactive");
  }

  /**
   * Get user activity stats
   */
  static async getActivityStats(userId) {
    const movements = await db("stock_movements")
      .where({ performed_by: userId })
      .count("* as total_movements")
      .first();

    const lastActivity = await db("stock_movements")
      .where({ performed_by: userId })
      .orderBy("created_at", "desc")
      .first();

    return {
      total_movements: parseInt(movements.total_movements),
      last_activity: lastActivity?.created_at || null,
    };
  }
}

module.exports = UserModel;
