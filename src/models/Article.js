const { db } = require("../db");

module.exports = class Article {
  static async getAll() {
    return (await db.query("select * from articles;")).rows;
  }

  static async get(id) {
    return (await db.query("select * from articles where id = $1;", [id])).rows;
  }

  static async hasEnough(id, qyt) {
    if (typeof qyt !== "number" || isNaN(qyt))
      throw new Error("Neispravan unos. Količina mora biti broj.");

    if (qyt <= 0)
      throw new Error("Neispravan unos. Količina mora biti pozitivan broj");

    const article = (
      await db.query("select * from articles where id = $1;", [id])
    ).rows[0];

    const totalUsedQyt = (
      await db.query(
        "select sum(quantity) from orders_articles where article_id = $1;",
        [id]
      )
    ).rows[0].sum;

    if (article.amount_in_storage - Number(totalUsedQyt) - Number(qyt) >= 0)
      return true;
    else return false;
  }
};
