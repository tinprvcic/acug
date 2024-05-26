const { db } = require("../db");

module.exports = class Article {
  static async getAll() {
    return (await db.query("select * from articles;")).rows;
  }

  static async get(id) {
    return (await db.query("select * from articles where id = $1;", [id])).rows;
  }
};
