var db = require("../models");

module.exports = function(app) {
  // Render handlebars index page for root
  app.get("/", function(req, res) {
    console.log("Get index");

    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        var articleObject = {
          articles: dbArticle
        };
        // console.log(hbsObject);
        res.render("index", articleObject);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Render handlebars saved page for root
  app.get("/saved", function(req, res) {
    console.log("Get saved");

    db.Article.find({ saved: true })
      .populate("notes")
      .then(articles => {
        res.render("saved", { articles });
      })
      .catch(err => console.log(err));
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
