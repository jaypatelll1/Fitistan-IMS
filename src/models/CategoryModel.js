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
