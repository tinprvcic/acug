const Order = require("../models/Order");

module.exports = class Orders {
  static async getOrders(_req, res) {
    const orders = await Order.getAll();

    res.render("orders", { title: "Pregled narudžbi", orders });
  }
};
