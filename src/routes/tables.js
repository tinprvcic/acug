const TablesController = require("../controllers/Table");

module.exports = (app) => {
  app.get("/tables", TablesController.getTables);
};
