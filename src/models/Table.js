const { db } = require("../db");

module.exports = class Table {
  static async getAll() {
    return (await db.query("select * from tables;")).rows;
  }

  static async search(query) {
    return (
      await db.query("select * from tables where lower(name) like $1;", [
        "%" + query.toLowerCase() + "%",
      ])
    ).rows;
  }

  static async get(id) {
    return (await db.query("select * from tables where id = $1;", [id]))
      .rows[0];
  }

  static async create(tableName, description, capacity) {
    await db.query(
      "INSERT INTO tables (name, description, capacity) VALUES ($1, $2, $3)",
      [tableName, description, capacity]
    );
  }
};
