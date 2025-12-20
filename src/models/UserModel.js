
const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");


class UserModel extends BaseModel {
    constructor(userId) {
        super(userId);

    }

    async getUserByEmail({ email },) {
        try {

            const queryBuilder = await this.getQueryBuilder();


            const user = await queryBuilder
                .select([
                    '*'
                ])
                .table("users")
                .where(this.whereStatement({ email }))
                .first();
            console.log("user", user)

            return user || undefined; // return undefined if not found
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async getUserRoleById(userId) {
  try {
    const queryBuilder = await this.getQueryBuilder();

    const user = await queryBuilder("users")
      .leftJoin("role ", "user.role_id", "role.role_id")
      .where(this.whereStatement({ "user.user_id": userId }))
      .first();
console.log("user ka data",user)
    return user;
  } catch (e) {
    throw new DatabaseError(e);
  }
}



}

module.exports = UserModel;