require("dotenv").config();

const path = require("path");
const http = require("http");

const express = require("express");

const { connect_db } = require("./src/db");
const tables_route = require("./src/routes/tables");
const orders_route = require("./src/routes/orders");

async function main() {
  app = express();
  app.set("views", path.join(__dirname, "src/views"));
  app.set("view engine", "ejs");

  app.use(express.static(path.join(__dirname, "public")));

  await connect_db();
  orders_route(app);
  tables_route(app);

  if (!process.env.PORT)
    throw new Error(
      "Missing environment variables. Please check your .env file."
    );

  const server = http.createServer(app);
  const port = process.env.PORT;
  server.listen(port);
}

main();
