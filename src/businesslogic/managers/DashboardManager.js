const db = require('../../models/libs/Db');

class DashboardManager {

  static async getTopSellingProducts(limit = 10) {
    const qb = db.getQueryBuilder();

    return await qb('orders as o')
      .join('products as p', 'p.product_id', 'o.product_id') //  NO p.id
      .where('o.status', 'sold')   
      .select(
        'p.product_id as product_id', //  correct PK
        'p.name',
        'p.product_image'
      )
      .sum('o.quantity as total_sold')
      .groupBy(
        'p.product_id',
        'p.name',
        'p.product_image'
      )
      .orderBy('total_sold', 'desc')
      .limit(limit);
  }

  static async getLeastSellingProducts(limit = 10) {
    const qb = db.getQueryBuilder();

    return await qb('orders as o')
      .join('products as p', 'p.product_id', 'o.product_id') // 
      .where('o.status', 'sold')   
      .select(
        'p.product_id as product_id',
        'p.name',
        'p.product_image'
      )
      .sum('o.quantity as total_sold')
      .groupBy(
        'p.product_id',
        'p.name',
        'p.product_image'
      )
      .orderBy('total_sold', 'asc')
      .limit(limit);
  }

}

module.exports = DashboardManager;
