const Article = require("../models/Article");
const Order = require("../models/Order");
const Table = require("../models/Table");
const OrderService = require("../services/Order");

module.exports = class Tables {
  static async getTables(req, res) {
    // strip empty query param
    if (req.query.query === "") return res.redirect("/tables");

    const tables = await (req.query.query
      ? Table.search(req.query.query)
      : Table.getAll());

    res.render("tables", {
      tables,
      title: "Pregled stolova",
      query: req.query.query || "",
    });
  }

  static async getTable(req, res) {
    const tableId = req.params.id;

    const table = await Table.get(tableId);
    const tableOrders = await Order.getOnTable(tableId);
    const articles = await Article.getAll();

    const draftOrder = tableOrders.find((o) => o.status === "draft");

    if (draftOrder)
      return res.render("tabledraftorder", {
        title: "Nova narudžba",
        table,
        order: draftOrder,
        articles,
        err: req.query.err,
      });

    const activeOrder = tableOrders.find(
      (o) =>
        o.status === "pending" ||
        o.status === "accepted" ||
        o.status === "delivered"
    );

    if (activeOrder)
      return res.render("tablependingorder", {
        title: "Nova narudžba",
        order: activeOrder,
        articles,
        err: req.query.err,
      });

    return res.render("tablenoorders", { title: table.name, table });
  }

  static async newOrderOnTable(req, res) {
    const tableId = req.params.id;

    await OrderService.create(tableId);

    res.redirect(`/tables/${tableId}`);
  }
};
