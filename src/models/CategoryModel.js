const Db = require("../models/libs/Db");
const { PUBLIC_SCHEMA } = require("./libs/dbConstants");

class CategoryModel {

  static qb() {
    return Db.getQueryBuilder(); // ✅ always use this
  }

  static async create(categoryData) {
    try {
      const [category] = await this.qb()
        .from("category")
        .insert(categoryData)
        .returning(["category_id", "category_name"]);

      return category;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  static async countProductsByCategory() {
    try {
      const qb = this.qb();

      return await qb("category as c")
        .select(
          "c.category_id",
          "c.category_name",
          qb.raw(`(
            COUNT(DISTINCT p.product_code_id) + 
            COUNT(CASE WHEN p.product_code_id IS NULL THEN p.product_id END)
          )::integer as total_products`)
        )
        .leftJoin("products as p", function () {
          this.on("p.category_id", "c.category_id")
            .andOn("p.is_deleted", qb.raw("false"));
        })
        .where("c.is_deleted", false)
        .groupBy("c.category_id", "c.category_name")
        .orderBy("c.category_id", "asc");

    } catch (e) {
      throw new DatabaseError(e);
    }
  }
  static async findById(category_id) {
    return this.qb()
      .select("category_id", "category_name", "is_deleted")
      .from("category")
      .where({ category_id })
      .first();
  }


  static async categoryDelete(category_id) {
    return this.qb()
      .from("category")
      .where({ category_id })
      .update({ is_deleted: true });
  }


  static async findByName(categoryName) {
    return this.qb()
      .select("category_id", "category_name")
      .from("category")
      .whereRaw("LOWER(category_name) = ?", [
        categoryName.trim().toLowerCase()
      ])
      .andWhere("is_deleted", false)
      .first();
  }


  async findByCategoryId(category_id) {
    try {
      const qb = await this.getQueryBuilder();

      return qb(this.tableName)
        .select(this.getPublicColumns())
        .where(
          this.whereStatement({
            category_id,
            [TABLE_DEFAULTS.COLUMNS.IS_DELETED.KEY]: false
          })
        )
        .orderBy("product_id", "asc");
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  static async findAll() {
    return this.qb()
      .select("category_id", "category_name")
      .from("category")               // ✅ SAME HERE
      .where("is_deleted", false)
      .orderBy("category_id", "asc");
  }
}

module.exports = CategoryModel;
