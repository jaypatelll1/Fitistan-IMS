const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");

class UserModel extends BaseModel {
  async createUser(payload) {
    try {
      const queryBuilder = await this.getQueryBuilder();
      const [user] = await queryBuilder("users")
        .insert({
          email: payload.email,
          password_hash: payload.password_hash, 
          name: payload.name,
          phone: payload.phone,
          gender: payload.gender,
          profile_picture_url: payload.profile_picture_url,
        })
        .returning([
          "user_id",
          "email",
          "name",
          "phone",
          "gender",
          "profile_picture_url",
        ]);
      return user;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
async getUserRoleById({ email }) {
  try {
    const queryBuilder = await this.getQueryBuilder();
    const user = await queryBuilder("users")
      .leftJoin("role", "users.role_id", "role.role_id")
      .where("users.email", email)
      .andWhere("users.is_deleted", false)
      .first();

    return user;
  } catch (e) {
    throw new DatabaseError(e);
  }
}


}

module.exports = UserModel;
