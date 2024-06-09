const TablesController = require("../controllers/Tables");

module.exports = (app) => {
  app.get("/tables", TablesController.getTables);
  app.get("/tables/:id", TablesController.getTable);
  app.get("/tables/:id/new", TablesController.newOrderOnTable);
};
