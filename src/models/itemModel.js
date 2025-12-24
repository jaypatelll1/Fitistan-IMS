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

    async softDelete(itemId){
        try {
            const queryBuilder = await this.getQueryBuilder();
            // const check = await queryBuilder.select("*").from("items").where(this.whereStatement({id: itemId}));
            // console.log("check",check);
            // if(!check){
            //     return null;
            // }
            const [item] = await queryBuilder("items").where(this.whereStatement({id: itemId})).update({ is_deleted: true }).returning("*");
            return item;
        }
        catch (e) {
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