
const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");


class UserModel extends BaseModel {
    constructor(userId) {
        super(userId);

    }

    async getUserByEmail({ email }, ) {
        try {
            
            const queryBuilder = await this.getQueryBuilder();

           
            const user = await queryBuilder
                .select([
                   '*'
                ])
                .table("users")
                .where(this.whereStatement({email}))
                .first();
                console.log("user",user)

            return user || undefined; // return undefined if not found
        } catch (e) {
            throw new DatabaseError(e);
        }
    }



}

module.exports = UserModel;