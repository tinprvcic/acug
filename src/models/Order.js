const { db } = require("../db");

module.exports = class Order {
  static async getAll() {
    return (
      await db.query(`
        SELECT
          o.id AS order_id,
          o.order_time,
          o.status,
          t.name AS table_name,
          t.description AS table_description,
          t.capacity AS table_capacity,
          json_agg(json_build_object(
            'article_name', a.name,
            'article_description', a.description,
            'article_price', a.price,
            'quantity', oa.quantity
          )) AS articles
        FROM orders o JOIN tables t ON o.table_id = t.id 
          JOIN orders_articles oa ON o.id = oa.order_id
            JOIN articles a ON oa.article_id = a.id
        GROUP BY o.id, t.name, t.description, t.capacity
        ORDER BY o.order_time DESC;`)
    ).rows;
  }

  static async get(id) {
    return (await db.query("select * from orders where id = $1;", [id])).rows;
  }
};
