const Camunda = require("../Camunda");
const { db } = require("../db");
const Article = require("./Article");
const Table = require("./Table");

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
      COALESCE(
              json_agg(
                  json_build_object(
                      'article_name', a.name,
                      'article_description', a.description,
                      'article_price', a.price,
                      'quantity', oa.quantity
                  )
              ) FILTER (WHERE a.id IS NOT NULL), '[]'
          ) AS articles
      FROM orders o JOIN tables t ON o.table_id = t.id 
        LEFT JOIN orders_articles oa ON o.id = oa.order_id
        LEFT JOIN articles a ON oa.article_id = a.id
      where o.status != 'draft'
      GROUP BY o.id, t.name, t.description, t.capacity
      ORDER BY o.order_time desc;`)
    ).rows;
  }

  static async get(id) {
    return (
      await db.query(
        `
      SELECT
      o.id AS order_id,
      o.order_time,
      o.status,
      o.cam_id,
      o.cam_def_id,
      t.id AS table_id,
      t.name AS table_name,
      t.description AS table_description,
      t.capacity AS table_capacity,
      COALESCE(
              json_agg(
                  json_build_object(
                      'article_id', a.id,
                      'article_name', a.name,
                      'article_description', a.description,
                      'article_price', a.price,
                      'quantity', oa.quantity
                  )
              ) FILTER (WHERE a.id IS NOT NULL), '[]'
          ) AS articles
      FROM orders o JOIN tables t ON o.table_id = t.id 
        LEFT JOIN orders_articles oa ON o.id = oa.order_id
        LEFT JOIN articles a ON oa.article_id = a.id
      WHERE o.id = $1
      GROUP BY o.id, t.name, t.description, t.capacity, t.id
      ORDER BY o.order_time desc;`,
        [id]
      )
    ).rows[0];
  }

  static async getOnTable(tableId) {
    return (
      await db.query(
        `
      SELECT
      o.id AS order_id,
      o.order_time,
      o.status,
      o.cam_id,
      o.cam_def_id,
      t.id AS table_id,
      t.name AS table_name,
      t.description AS table_description,
      t.capacity AS table_capacity,
      COALESCE(
              json_agg(
                  json_build_object(
                      'article_id', a.id,
                      'article_name', a.name,
                      'article_description', a.description,
                      'article_price', a.price,
                      'quantity', oa.quantity
                  )
              ) FILTER (WHERE a.id IS NOT NULL), '[]'
          ) AS articles
      FROM orders o JOIN tables t ON o.table_id = t.id 
        LEFT JOIN orders_articles oa ON o.id = oa.order_id
        LEFT JOIN articles a ON oa.article_id = a.id
      WHERE t.id = $1
      GROUP BY o.id, t.name, t.description, t.capacity, t.id
      ORDER BY o.order_time desc;`,
        [tableId]
      )
    ).rows;
  }

  static async create(tableId) {
    const data = await Camunda.createNarudzba();
    console.log("camunda", data);

    const res = await db.query(
      "insert into orders (status, table_id, cam_id, cam_def_id) values ('draft', $1, $2, $3) returning id",
      [tableId, data.id, data.definitionId]
    );

    await Camunda.completeNextTask(data.id);

    return res.rows[0].id;
  }

  static async save(order_id, status, table_id) {
    const order = await Order.get(order_id);

    await db.query("update orders set status='pending' where id=$1;", [
      order_id,
    ]);

    console.log("order", order.cam_id);

    await Camunda.completeNextTask(order.cam_id, {
      variables: { giveUp: { value: "no" } },
    });

    return;
  }

  static async take(order_id) {
    const order = await Order.get(order_id);

    await db.query("update orders set status='accepted' where id=$1;", [
      order_id,
    ]);

    await Camunda.sendAcceptOrderMessage(order.cam_id);
  }

  static async deliver(order_id) {
    const order = await Order.get(order_id);

    await db.query("update orders set status='delivered' where id=$1;", [
      order_id,
    ]);

    await Camunda.completeNextTask(order.cam_id);
  }

  static async markPaid(order_id) {
    const order = await Order.get(order_id);

    await db.query("update orders set status='paid' where id=$1;", [order_id]);

    await Camunda.completeNextTask(order.cam_id);
  }

  static async delete(order_id) {
    const order = await Order.get(order_id);

    await Camunda.completeNextTask(order.cam_id, {
      variables: { giveUp: { value: "yes" } },
    });

    await db.query("delete from orders where id = $1", [order_id]);

    await Camunda.completeNextTask(order.cam_id);
  }

  static async updateQuantity(order_id, article_id, qyt) {
    if (typeof qyt !== "number" || isNaN(qyt))
      throw new Error("Neispravan unos. Količina mora biti broj.");

    if (qyt <= 0)
      throw new Error("Neispravan unos. Količina mora biti pozitivan broj");

    if (!(await Article.hasEnough(article_id, qyt))) {
      throw new Error("Nema dovoljno artikla na zalihi.");
    }

    await db.query(
      "update orders_articles set quantity = $1 where order_id = $2 and article_id = $3;",
      [qyt, order_id, article_id]
    );

    return;
  }

  static async add(order_id, article_id, qyt) {
    if (typeof qyt !== "number" || isNaN(qyt))
      throw new Error("Neispravan unos. Količina mora biti broj.");

    if (qyt <= 0)
      throw new Error("Neispravan unos. Količina mora biti pozitivan broj");

    if (!(await Article.hasEnough(article_id, qyt)))
      throw new Error("Nema dovoljno artikla na zalihi.");

    const res = (
      await db.query(
        "select * from orders_articles where order_id = $1 and article_id = $2;",
        [order_id, article_id]
      )
    ).rows[0];

    if (res) {
      await db.query(
        "update orders_articles set quantity = $1 where order_id = $2 and article_id = $3;",
        [res.quantity + Number(qyt), order_id, article_id]
      );
    } else {
      await db.query(
        "insert into orders_articles (order_id, article_id, quantity) values ($1, $2, $3);",
        [order_id, article_id, qyt]
      );
    }
  }

  static async remove(order_id, article_id) {
    await db.query(
      "delete from orders_articles where order_id = $1 and article_id = $2;",
      [order_id, article_id]
    );
  }
};
