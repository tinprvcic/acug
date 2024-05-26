require("dotenv").config();
const PgClient = require("pg").Client;

const main = async () => {
  const db = new PgClient({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await db.connect();

  const schema = `
        CREATE TABLE tables (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            capacity INTEGER NOT NULL
        );
        
        CREATE TABLE articles (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price INTEGER NOT NULL,
          amount_in_storage INTEGER NOT NULL
      );
      
        CREATE TABLE orders (
          id SERIAL PRIMARY KEY,
          order_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(10) NOT NULL CHECK (status IN ('delivered', 'pending', 'canceled')),
          table_id INTEGER NOT NULL,
          FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE
      );
      
      CREATE TABLE orders_articles (
        order_id INTEGER NOT NULL,
        article_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        PRIMARY KEY (order_id, article_id),
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
    );
      `;

  await db.query(schema);

  await db.end();
};

main();
