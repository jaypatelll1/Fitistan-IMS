const db = require("../config/database");

class UserModel {
  static async findAll(filters = {}) {
    let query = db("users").select("*");
    if (filters.role) query = query.where({ role: filters.role });
    if (filters.status) query = query.where({ status: filters.status });
    return query.orderBy("created_at", "desc");
  }

  static async findById(userId) {
    return db("users").where({ user_id: userId }).first();
  }

  static async findByEmail(email) {
    return db("users").where({ email }).first();
  }

  static async create(userData) {
    const [user] = await db("users").insert(userData).returning("*");
    return user;
  }

  static async update(userId, userData) {
    const [user] = await db("users")
      .where({ user_id: userId })
      .update({ ...userData, updated_at: db.fn.now() })
      .returning("*");
    return user;
  }

  static async updateRole(userId, role) {
    return this.update(userId, { role });
  }

  // static async updateStatus(userId, status) {
  //   return this.update(userId, { status });
  // }

  static async updateStatus(userId, status) {
  // 1️⃣ Find status_id
  const statusRow = await db("status")
    .where({ status_name: status })
    .first();

  if (!statusRow) {
    throw { statusCode: 400, message: "Invalid status" };
  }

  // 2️⃣ Update user
  return this.update(userId, {
    status_id: statusRow.status_id
  });
}


  static async deactivate(userId) {
    return this.updateStatus(userId, "inactive");
  }

  // 
  
  static async getActivityStats(userId) {
  try {
    if (!userId) {
      return {
        total_movements: 0,
        last_activity: null,
      };
    }

    const movements = await db("stock_movements")
      .where({ performed_by: userId })
      .count("* as total_movements")
      .first();

    const lastActivity = await db("stock_movements")
      .where({ performed_by: userId })
      .orderBy("created_at", "desc")
      .first();

    return {
      total_movements: Number(movements?.total_movements || 0),
      last_activity: lastActivity?.created_at || null,
    };
  } catch (err) {
    // 👇 graceful fallback
    return {
      total_movements: 0,
      last_activity: null,
    };
  }
}

}

module.exports = UserModel;
