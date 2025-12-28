const BaseModel = require("./libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");

class ItemModel extends BaseModel {
  constructor(userId) {
    super(userId);
  }

  // ✅ PUBLIC COLUMNS
  getPublicColumns() {
    return ["id", "name", "shelf_id", "product_id"];
  }

  async findAllPaginated(product_id, page = 1, limit = 10) {
    try {
      const qb = await this.getQueryBuilder();
      const offset = (page - 1) * limit;

      const data = await qb("items")
        .select(this.getPublicColumns()) // ✅ HERE
        .where(this.whereStatement({ product_id }))
        .limit(limit)
        .offset(offset);

      const [{ count }] = await qb("items")
        .where(this.whereStatement({ product_id }))
        .count("* as count");

      return {
        data,
        total: Number(count)
      };

    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async create(data, product_id) {
    try {
      const qb = await this.getQueryBuilder();
      const insertData = this.insertStatement({ ...data, product_id });

      const [item] = await qb("items")
        .insert(insertData)
        .returning(this.getPublicColumns()); // ✅ HERE

      return item;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async findByProductId(product_id) {
    try {
      const qb = await this.getQueryBuilder();
      const items = await qb("items")
        .select(this.getPublicColumns()) // ✅ HERE
        .where(this.whereStatement({ product_id }));

      return items.length ? items : null;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }
}

module.exports = ItemModel;
