const Db = require("../models/libs/Db");
const { PUBLIC_SCHEMA } = require("./libs/dbConstants");

class CategoryModel {
 
    static qb() {
        return Db.getQueryBuilder(); // ✅ always use this
      }
 static async findByName(categoryName) {
    return this.qb()
      .select("category_id", "category_name")
      .from("category")               // ✅ THIS IS THE KEY FIX
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

  static async findAllActive() {
    return this.qb()
      .select("category_id", "category_name")
      .from("categories")               // ✅ SAME HERE
      .where("is_deleted", false)
      .orderBy("category_name", "asc");
  }
}

module.exports = CategoryModel;
