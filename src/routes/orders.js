const OrdersController = require("../controllers/Orders");

module.exports = (app) => {
  app.get("/", OrdersController.redirectToOrders);
  app.get("/orders", OrdersController.getOrders);
  app.get("/orders/new", OrdersController.createOrder);
  app.get("/orders/:id", OrdersController.getOrder);
  app.post("/orders/:id", OrdersController.updateOrder);
  app.post("/orders/:id/quantity", OrdersController.updateQuantity);
  app.post("/orders/:id/delete", OrdersController.deleteOrder);
  app.post("/orders/:id/add", OrdersController.addArticlesToOrder);
  app.post("/orders/:id/remove", OrdersController.removeArticlesFromOrder);
};
