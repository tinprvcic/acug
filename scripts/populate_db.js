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

  const data = `
  INSERT INTO tables (name, description, capacity) VALUES
  ('Prizmlje - Stol 1', 'Stol s pogledom.', 8),
  ('Prizemlje - Stol 2', 'Stol pored šanka.', 4),
  ('Potkrovlje - Stol 3', 'Jedini stol u potkrovlju.', 6),
  ('Terasa - Stol 4', 'Najveći stol koji imamo.', 10),
  ('Terasa - Stol 5', NULL, 2);
  
  INSERT INTO articles (name, description, price, amount_in_storage) VALUES
  ('Espresso', 'Čista kava, za najbolji užitak.', 250, 100),
  ('Latte', 'Kava. Punomasno mlijeko. Bez šlaga.', 350, 50),
  ('Cappuccino', 'Kava, mlijeko, šlag.', 300, 75),
  ('Krafna', 'Krafna s čokoladom', 200, 30),
  ('Bagel', 'Bagel. Bez dodataka.', 150, 40);
  
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

  await db.query(data);

  await db.end();
};

main();
