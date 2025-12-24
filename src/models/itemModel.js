const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");
class ItemModel extends BaseModel {
    constructor(userId) {
        super(userId);
       
    }
    async create(data,product_id) { 
        try {
            const queryBuilder = await this.getQueryBuilder();
            const insertData = this.insertStatement(data,product_id);
            const [item] = await queryBuilder("items").insert(insertData).returning("*");
            return item;
        }
        catch (e) {
            throw new DatabaseError(e);
        }
    }

    async findByProductId(product_id){
        try {
            console.log("product_id",product_id);
            const queryBuilder = await this.getQueryBuilder();
           const item = await queryBuilder.select("*").from("items").where(this.whereStatement({product_id}))
       
           console.log("item",item);
           if(!item){
            return null;
           }
              return item;
        }   
        catch (e) {
            throw new DatabaseError(e);
        }
    }

    async softDelete(product_id, quantity) {
    try {
        const queryBuilder = await this.getQueryBuilder();

        return queryBuilder("items")
            .whereIn("id", function () {
                this.select("id")
                    .from("items")
                    .where(
                       { product_id, is_deleted: false }
                    )
                    .limit(quantity);
            })
            .update({ is_deleted: true });

    } catch (e) {
        throw new DatabaseError(e);
    }
}



    async countByProductId(product_id) {
    const queryBuilder = await this.getQueryBuilder();

    const result = await queryBuilder("items")
        .where(this.whereStatement({ product_id }))
        .count("* as count")
        .first();

    return Number(result.count);
}

}

module.exports = ItemModel;