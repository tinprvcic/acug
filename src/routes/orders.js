const OrderController = require("../controllers/Order");

module.exports = (app) => {
  app.get("/orders", OrderController.getOrders);
  app.get("/orders/new", OrderController.createOrder);
  app.get("/orders/:id", OrderController.getOrder);
  app.post("/orders/:id", OrderController.updateOrder);
  app.post("/orders/:id/quantity", OrderController.updateQuantity);
  app.post("/orders/:id/delete", OrderController.deleteOrder);
  app.post("/orders/:id/add", OrderController.addArticlesToOrder);
  app.post("/orders/:id/remove", OrderController.removeArticlesFromOrder);
};
