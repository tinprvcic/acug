const OrdersController = require("../controllers/Order");

module.exports = (app) => {
  app.get("/orders", OrdersController.getOrders);
};
