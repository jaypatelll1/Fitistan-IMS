const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");

class ShelfModel extends BaseModel {
    constructor(userId) {
        super(userId);
    }

 async findAll(){

        try {


            const queryBuilder = await this.getQueryBuilder();
            const findAllShelf = await queryBuilder.select("*").table("shelf").where(this.whereStatement({}))
            return findAllShelf;
        } catch (error) {
            throw new DatabaseError(e)
        }
    }
    async create(data){

        try {
            const queryBuilder = await this.getQueryBuilder();
            const insertData = this.insertStatement(data);
            const [shelf] = await queryBuilder("shelf").insert(insertData).returning("*");
            return shelf;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }


    async findById(id){

        try {
            const queryBuilder = await this.getQueryBuilder();
            const shelf = await queryBuilder.select("*").table("shelf").where(this.whereStatement({shelf_id:id})).first();
            return shelf;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async update(id, data){

        try {
            const queryBuilder = await this.getQueryBuilder();
            const updateData = this.insertStatement(data);
            const [shelf] = await queryBuilder("shelf").update(updateData).where(this.whereStatement({shelf_id:id})).returning("*");
            return shelf;
        } catch (e) {
            throw new DatabaseError(e);
        }
    }

    async softDelete(id){

        try {
            const queryBuilder = await this.getQueryBuilder();
            const [shelf] = await queryBuilder("shelf").update({ is_deleted: true }).where(this.whereStatement({shelf_id:id})).returning("*");
            return shelf;
        } catch (e) {
            throw new DatabaseError(e);
        }       
    }
}

module.exports = ShelfModel;
