const PgClient = require("pg").Client;

const db = new PgClient({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = {
  db,
  async connect_db() {
    await db.connect();
  },
};
