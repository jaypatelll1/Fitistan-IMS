const db = require("../config/database");
class RoleModel {
  static async findAll() {
    return await db("role").select("*").orderBy("created_at", "desc");
  };
  static async findById(id) {
    return await db("role").where("role_id", id).first();
  };
    static async create(roleData) {
      const [role] = await db("role").insert(roleData).returning("*");
      return role;
    };
};

module.exports = RoleModel;