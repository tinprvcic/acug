const Order = require("../models/Order");
const OrderService = require("../services/Order");

module.exports = class Orders {
  static async redirectToOrders(_req, res) {
    res.redirect("/orders");
  }

  static async getOrders(_req, res) {
    const orders = await Order.getAll();

    res.render("orders", { title: "Pregled narudžbi", orders });
  }

  static async saveOrder(req, res) {
    const order_id = req.params.id;

    await OrderService.save(order_id, req.body.status, req.body.table);

    res.redirect(`/tables/${req.body.tableId}`);
  }

  static async deleteOrder(req, res) {
    await OrderService.delete(req.params.id);

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

    await OrderService.take(order_id);

    res.redirect("/orders");
  }

  static async deliverOrder(req, res) {
    const order_id = req.params.id;

    await OrderService.deliver(order_id);

    res.redirect("/orders");
  }

  static async markOrderPaid(req, res) {
    const order_id = req.params.id;

    await OrderService.markPaid(order_id);

    res.redirect("/orders");
  }
};
