const TablesController = require("../controllers/Tables");

module.exports = (app) => {
  app.get("/tables", TablesController.getTables);
};
