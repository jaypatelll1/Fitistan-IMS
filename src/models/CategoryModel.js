const BaseModel = require("../models/libs/BaseModel");
const DatabaseError = require("../errorhandlers/DatabaseError");
const { PUBLIC_SCHEMA, TABLE_DEFAULTS } = require("./libs/dbConstants");

class CategoryModel extends BaseModel {

  async findGlobalByName(categoryName) {
    const qb = await this.getQueryBuilder();
    return qb
      .select("global_category_id", "category_name", "logo_url")
      .from(`${PUBLIC_SCHEMA}.global_category`)
      .whereRaw("LOWER(category_name) = ?", [
        categoryName.trim().toLowerCase()
      ])
      .andWhere(this.whereStatement())
      .first();
  }

  async findGlobalById(globalCategoryId) {
    const qb = await this.getQueryBuilder();
    return qb(`${PUBLIC_SCHEMA}.global_category`)
      .select("global_category_id", "category_name", "logo_url")
      .where(this.whereStatement({ global_category_id: globalCategoryId }))
      .first();
  }

  async findByNameAndGlobal(categoryName, globalCategoryId) {
    const qb = await this.getQueryBuilder();
    return qb("category")
      .select("category_id", "category_name", "global_category_id", "logo_url")
      .where(this.whereStatement({
        category_name: categoryName,
        global_category_id: globalCategoryId
      }))
      .first();
  }

  async findAllGlobal() {
    const qb = await this.getQueryBuilder();
    return qb
      .select("global_category_id", "category_name", "logo_url")
      .from(`${PUBLIC_SCHEMA}.global_category`)
      .where(this.whereStatement())
      .orderBy("global_category_id", "asc");
  }

  async createGlobal(categoryData) {
    try {
      const qb = await this.getQueryBuilder();
      const [category] = await qb
        .from(`${PUBLIC_SCHEMA}.global_category`)
        .insert(categoryData)
        .returning(["global_category_id", "category_name", "logo_url"]);

      return category;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async updateGlobal(global_category_id, categoryData) {
    try {
      const qb = await this.getQueryBuilder();
      const [category] = await qb
        .from(`${PUBLIC_SCHEMA}.global_category`)
        .where({ global_category_id })
        .update(categoryData)
        .returning(["global_category_id", "category_name", "logo_url"]);

      return category;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async globalCategoryDelete(global_category_id) {
    const qb = await this.getQueryBuilder();
    return qb
      .from(`${PUBLIC_SCHEMA}.global_category`)
      .where({ global_category_id })
      .update({ [TABLE_DEFAULTS.COLUMNS.IS_DELETED.KEY]: true });
  }

  async countByGlobalCategoryId(global_category_id) {
    const qb = await this.getQueryBuilder();
    const result = await qb
      .from("category")
      .where(this.whereStatement({ global_category_id }))
      .count("category_id as count")
      .first();
    return parseInt(result.count);
  }

  async countProductsByCategory() {
    try {
      const qb = await this.getQueryBuilder();

      return await qb("category as c")
        .select(
          "c.category_id",
          "c.category_name",
          "c.global_category_id",
          "c.logo_url",
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
        .groupBy("c.category_id", "c.category_name", "c.global_category_id", "c.logo_url")
        .orderBy("c.category_id", "asc");

    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async findById(category_id) {
    const qb = await this.getQueryBuilder();
    return qb
      .select("category_id", "category_name", "is_deleted", "logo_url")
      .from("category")
      .where({ category_id })
      .first();
  }

  async create(categoryData) {
    try {
      const qb = await this.getQueryBuilder();
      const [category] = await qb
        .from("category")
        .insert(categoryData)
        .returning(["category_id", "category_name", "logo_url"]);

      return category;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async update(category_id, categoryData) {
    try {
      const qb = await this.getQueryBuilder();
      const [category] = await qb
        .from("category")
        .where({ category_id })
        .update(categoryData)
        .returning(["category_id", "category_name", "logo_url"]);

      return category;
    } catch (e) {
      throw new DatabaseError(e);
    }
  }

  async categoryDelete(category_id) {
    const qb = await this.getQueryBuilder();
    return qb
      .from("category")
      .where({ category_id })
      .update({ [TABLE_DEFAULTS.COLUMNS.IS_DELETED.KEY]: true });
  }

  async findByName(categoryName) {
    const qb = await this.getQueryBuilder();
    return qb
      .select("category_id", "category_name")
      .from("category")
      .whereRaw("LOWER(category_name) = ?", [
        categoryName.trim().toLowerCase()
      ])
      .andWhere(TABLE_DEFAULTS.COLUMNS.IS_DELETED.KEY, false)
      .first();
  }

  async findAll() {
    const qb = await this.getQueryBuilder();
    return qb
      .select("category_id", "category_name", "global_category_id", "logo_url")
      .from("category")
      .where(this.whereStatement())
      .orderBy("category_id", "asc");
  }
}

module.exports = CategoryModel;
