const OrdersController = require("../controllers/Orders");

module.exports = (app) => {
  app.get("/", OrdersController.redirectToOrders);
  app.get("/orders", OrdersController.getOrders);
  app.post("/orders/:id", OrdersController.saveOrder);
  app.post("/orders/:id/quantity", OrdersController.updateQuantity);
  app.post("/orders/:id/delete", OrdersController.deleteOrder);
  app.post("/orders/:id/add", OrdersController.addArticlesToOrder);
  app.post("/orders/:id/remove", OrdersController.removeArticlesFromOrder);
  app.post("/orders/:id/take", OrdersController.takeOrder);
  app.post("/orders/:id/deliver", OrdersController.deliverOrder);
  app.post("/orders/:id/markPaid", OrdersController.markOrderPaid);
};
