const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");

class ShelfModel extends BaseModel {
  constructor(userId) {
    super(userId);
  }

  // ✅ PUBLIC COLUMNS
  getPublicColumns() {
    return [
      "shelf_id",
      "shelf_name",
      "warehouse_id",
      "room_id",
      "capacity"
    ];
  }

 async getAllShelfPaginated(page = 1, limit = 10) {
  try {
    const qb = await this.getQueryBuilder();
    const offset = (page - 1) * limit;

    const data = await qb("shelf")
      .select(this.getPublicColumns())
      .where(this.whereStatement({}))
      .orderBy("shelf_id", "asc")
      .limit(limit)
      .offset(offset);

    const [{ count }] = await qb("shelf")
      .where(this.whereStatement({}))
      .count("* as count");

    return {
      data,
      total: Number(count)
    };
  } catch (error) {
    throw new DatabaseError(error);
  }
}


  async createShelf(data) {
    try {
      const qb = await this.getQueryBuilder();
      const insertData = this.insertStatement(data);

      const [shelf] = await qb("shelf")
        .insert(insertData)
        .returning(this.getPublicColumns()); // ✅ HERE

      return shelf;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async getShelfById(id) {
    try {
      const qb = await this.getQueryBuilder();
      const shelf = await qb("shelf")
        .select(this.getPublicColumns()) // ✅ HERE
        .where(this.whereStatement({ shelf_id: id }))
        .first();

      return shelf || null;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async updateShelf(id, data) {
    try {
      const qb = await this.getQueryBuilder();
      const updateData = this.insertStatement(data);

      const exists = await qb("shelf")
        .select("shelf_id")
        .where(this.whereStatement({ shelf_id: id }))
        .first();

      if (!exists) return null;

      const [shelf] = await qb("shelf")
        .update(updateData)
        .where(this.whereStatement({ shelf_id: id }))
        .returning(this.getPublicColumns()); // ✅ HERE

      return shelf;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }

  async deleteShelf(id) {
    try {
      const qb = await this.getQueryBuilder();

      const exists = await qb("shelf")
        .select("shelf_id")
        .where(this.whereStatement({ shelf_id: id }))
        .first();

      if (!exists) return null;

      const [shelf] = await qb("shelf")
        .update({ is_deleted: true })
        .where(this.whereStatement({ shelf_id: id }))
        .returning(this.getPublicColumns()); // ✅ HERE

      return shelf;
    } catch (error) {
      throw new DatabaseError(error);
    }
  }
}

module.exports = ShelfModel;
