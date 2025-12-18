const db = require("../config/database");

class PasswordResetModel {
   static async create(resetData) {
    const [resetRecord] = await db("password_reset").insert(resetData).returning("*");
    return resetRecord;
  };
  static async findByToken(hashedtoken) {
    return await db("password_reset")
      .where("reset_password_token", hashedtoken)
    //   .where("reset_password_expires", ">", new Date())
      .first();
  };
    static async delete(user_id) {
    return await db("password_reset").where("user_id", user_id).del();
  };
}

module.exports = PasswordResetModel;
