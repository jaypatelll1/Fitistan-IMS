const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");

class AuthModel extends BaseModel {

  getPublicColumns() {
  return [
    "user_id",
    "name",
    "gender",
    "phone",
    "profile_picture_url",
    "email",
    "role_id"
  ];
  }

  // 🆕 Create user via Google OAuth
  async createGoogleUser(payload) {
    try {
      const qb = await this.getQueryBuilder();

      const insertData = await this.insertStatement({
        email: payload.email,
        name: payload.name,
        profile_picture_url: payload.profile_picture_url,
        role_id: payload.role_id,
        google_id: payload.google_id, // ⚠️ DB column must exist
        is_deleted: false
      });

      const [user] = await qb("users")
        .insert(insertData)
        .returning(this.getPublicColumns());

      return user || null;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  // 🔍 Used by Google OAuth
  async getUserByEmail(email) {
    try {
      const qb = await this.getQueryBuilder();

      const user = await qb("users as u")
        .leftJoin("role as r", "u.role_id", "r.role_id")
        .select(
          "u.user_id",
          "u.email",
          "u.name",
          "u.profile_picture_url",
          "u.role_id",
          "r.role_name"
        )
        .where({
          "u.email": email,
          "u.is_deleted": false
        })
        .first();

      return user || null;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async createUser(payload) {
  try {
    const qb = await this.getQueryBuilder();
    const insertData = await this.insertStatement(payload);

    const [user] = await qb("users")
      .insert(insertData)
      .returning(this.getPublicColumns());

    return user || null;
  } catch (e) {
    throw new DatabaseError(e);
  }
}


  // 🔐 USED ONLY FOR LOGIN
  async getUserForLogin(email) {
  try {
    const qb = await this.getQueryBuilder();

    const user = await qb("users as u")
      .leftJoin("role as r", "u.role_id", "r.role_id")
      .select(
        "u.user_id",
        "u.email",
        "u.password_hash",
        "u.name",
        "r.role_name"
      )
      .where({
        "u.email": email,
        "u.is_deleted": false
      })
      .first();

    console.log("User fetched for login:", user); // 🔥 DEBUG

    return user;
  } catch (e) {
    console.error("Error in getUserForLogin:", e);
    throw new DatabaseError(e);
  }
}


  // 🔓 USED FOR AUTH WRAPPER / PROFILE
 async getUserRoleById(email) {
  try {
    const qb = await this.getQueryBuilder();

    const user = await qb("users")
      .leftJoin("role", "users.role_id", "role.role_id")
      .select(
        "users.user_id",
        "users.email",
        "users.name",
        "users.role_id",
        "role.role_name"
      )
      .where("users.email", email)
      .andWhere("users.is_deleted", false)
      .first();

    if (!user) return null;

    return {
      user_id: user.user_id,
      email: user.email,
      name: user.name,
      roles: [
        {
          role_id: user.role_id,
          role_name: user.role_name
        }
      ]
    };
  } catch (e) {
    throw new DatabaseError(e);
  }
}

}

module.exports = AuthModel;
