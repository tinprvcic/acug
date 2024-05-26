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
  INSERT INTO tables (name, description, capacity) VALUES
  ('Dining Table A', 'A large wooden dining table that seats up to 8 people.', 8),
  ('Dining Table B', 'A small round dining table perfect for small spaces.', 4),
  ('Dining Table C', 'A glass-top dining table with a modern design.', 6),
  ('Dining Table D', 'An expandable dining table with a classic style.', 10),
  ('Dining Table E', NULL, 2);
  
  INSERT INTO articles (name, description, price, amount_in_storage) VALUES
  ('Espresso', 'A rich and strong coffee made by forcing hot water through finely ground coffee beans.', 250, 100),
  ('Latte', 'A coffee drink made with espresso and steamed milk.', 350, 50),
  ('Cappuccino', 'A coffee drink made with equal parts espresso, steamed milk, and foamed milk.', 300, 75),
  ('Muffin', 'A freshly baked blueberry muffin.', 200, 30),
  ('Bagel', 'A toasted bagel with cream cheese.', 150, 40);
  
  INSERT INTO orders (status, table_id) VALUES
  ('pending', 1),
  ('delivered', 2),
  ('canceled', 3);

  INSERT INTO orders_articles (order_id, article_id, quantity) VALUES
  (1, 1, 2),
  (1, 2, 1),
  (2, 3, 3),
  (3, 4, 4);
`;

  await db.query(schema);

  await db.end();
};

main();
