const Order = require("../models/Order");
const Table = require("../models/Table");
const Article = require("../models/Article");

module.exports = class Orders {
  static async redirectToOrders(_req, res) {
    res.redirect("/orders");
  }

  static async getOrders(_req, res) {
    const orders = await Order.getAll();

    res.render("orders", { title: "Pregled narudžbi", orders });
  }

  static async createOrder(_req, res) {
    const id = await Order.create();

    res.redirect(`/orders/${id}`);
  }

  static async getOrder(req, res) {
    const order = await Order.get(req.params.id);
    const tables = await Table.getAll();
    const articles = await Article.getAll();

    res.render("order", {
      title: "Nova narudžba",
      order,
      tables,
      articles,
      err: req.query.err,
    });
  }

  static async saveOrder(req, res) {
    const order_id = req.params.id;

    await Order.save(order_id, req.body.status, req.body.table);

    res.redirect(`/tables/${req.body.tableId}`);
  }

  static async deleteOrder(req, res) {
    await Order.delete(req.params.id);

    console.log("tableId", req.body);

    res.redirect(`/tables/${req.body.tableId}`);
  }

  static async updateQuantity(req, res) {
    const order_id = req.params.id;

    try {
      await Order.updateQuantity(
        order_id,
        req.body.article,
        Number(req.body.qyt)
      );

      res.redirect(`/tables/${req.body.tableId}`);
    } catch (e) {
      res.redirect(
        `/tables/${req.body.tableId}?err=${encodeURIComponent(e.message)}`
      );
    }
  }

  static async addArticlesToOrder(req, res) {
    const order_id = req.params.id;

    try {
      await Order.add(order_id, req.body.article, Number(req.body.qyt));
      res.redirect(`/tables/${req.body.tableId}`);
    } catch (e) {
      res.redirect(
        `/tables/${req.body.tableId}?err=${encodeURIComponent(e.message)}`
      );
    }
  }

  static async removeArticlesFromOrder(req, res) {
    const order_id = req.params.id;

    Order.remove(order_id, req.body.article);

    res.redirect(`/tables/${req.body.tableId}`);
  }

  static async takeOrder(req, res) {
    const order_id = req.params.id;

    await Order.take(order_id);

    res.redirect("/orders");
  }

  static async deliverOrder(req, res) {
    const order_id = req.params.id;

    await Order.deliver(order_id);

    res.redirect("/orders");
  }

  static async markOrderPaid(req, res) {
    const order_id = req.params.id;

    await Order.markPaid(order_id);

    res.redirect("/orders");
  }
};
