const db = require("./libs/Db");

class UserModel {
  static qb() {
    return db.getQueryBuilder(); // ✅ always use this
  }

  static async findAll(filters = {}) {
    let query = this.qb()("users").select("*");

    if (filters.role) query.where({ role: filters.role });
    if (filters.status) query.where({ status: filters.status });

    return query.orderBy("created_at", "desc");
  }

  static async findById(userId) {
    return this.qb()("users").where({ user_id: userId }).first();
  }

  static async findByEmail(email) {
    return this.qb()("users").where({ email }).first();
  }

  static async create(userData) {
    const [user] = await this.qb()("users")
      .insert(userData)
      .returning("*");

    return user;
  }

  static async update(userId, userData) {
    const [user] = await this.qb()("users")
      .where({ user_id: userId })
      .update({
        ...userData,
        updated_at: this.qb().fn.now()
      })
      .returning("*");

    return user;
  }

  static async updateRole(userId, role) {
    return this.update(userId, { role });
  }

  static async updateStatus(userId, status) {
    return this.update(userId, { status });
  }

  static async deactivate(userId) {
    return this.updateStatus(userId, "inactive");
  }

  static async getActivityStats(userId) {
    const movements = await this.qb()("stock_movements")
      .where({ performed_by: userId })
      .count("* as total_movements")
      .first();

    const lastActivity = await this.qb()("stock_movements")
      .where({ performed_by: userId })
      .orderBy("created_at", "desc")
      .first();

    return {
      total_movements: parseInt(movements.total_movements, 10),
      last_activity: lastActivity?.created_at || null,
    };
  }
}

module.exports = UserModel;
