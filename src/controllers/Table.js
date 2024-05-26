const Table = require("../models/Table");

module.exports = {
  async getTables(req, res) {
    // strip empty query param
    if (req.query.query === "") return res.redirect("/tables");

    const tables = await (req.query.query
      ? Table.search(req.query.query)
      : Table.getAll());

    res.render("tables", {
      tables,
      title: "Pregled stolova",
      query: req.query.query || "",
    });
  },
};
