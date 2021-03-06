// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");
var mongojs = require("mongojs");

// Require all models
var db = require("../models");

module.exports = function(app) {
  var articleArr = [];

  // A GET route for scraping the echoJS website
  app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.echojs.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
      console.log(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("article h2").each(function(i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .children("a")
          .text();
        result.summary = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
        result.saved = false;

        articleArr.push(result);

        // Only add the article if it is not already there
        // Use the count function on title to look for dups
        db.Article.count({ title: result.title }, function(err, test) {
          //if the test is 0, the entry is unique and good to save
          if (test == 0) {
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
              .then(function(dbArticle) {})
              .catch(function(err) {
                // If an error occurred, log it
                console.log(err);
              });
          }
        });
      });

      // Send a message to the client
      // res.send("Scrape Complete");

      // If we were able to successfully scrape and save an Article, redirect to index
      res.redirect("/");
    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("notes")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  app.post("/articles/:id", function(req, res) {
    console.log("Post note");
    console.log(req.params.id);
    console.log(req.body);

    // Create a new Note in the db
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article (there's only one) and push the new Note's _id to the Article's `notes` array
        // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { $push: { notes: dbNote._id } },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        // If the Article was updated successfully, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

  // Route for saving/updating an Article's associated Note
  // This one only does one note per article
  app.post("/articles_org/:id", function(req, res) {
    console.log("Post note");
    console.log(req.params.id);
    console.log(req.body);
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated Article -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { notes: dbNote._id },
          { new: true }
        );
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Route for updating a saved Article to the db
  // Right now to mark it as saved
  app.put("/articles/:id", function(req, res) {
    // Create a new Article using the `result` object built from scraping
    db.Article.updateOne(
      { _id: mongojs.ObjectID(req.params.id) },
      { $set: { saved: true } }
    )
      .then(function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, log it
        console.log(err);
      });
  });

  // Delete One from the DB
  app.delete("/articles/:id", function(req, res) {
    // Remove a note using the objectID
    console.log("In delete API");
    console.log(req.params.id);

    // Remove a note using the objectID
    db.Article.remove(
      {
        _id: mongojs.ObjectID(req.params.id)
      },
      function(error, removed) {
        // Log any errors from mongojs
        if (error) {
          console.log(error);
          res.send(error);
        } else {
          // Otherwise, send the mongojs response to the browser
          // This will fire off the success function of the ajax request
          console.log(removed);
          res.send(removed);
        }
      }
    );
  });

  // Route to get a Article by id and populate it with their notes
  app.get("/populatedarticle/:id", function(req, res) {
    // Find an article
    db.Article.find({ _id: mongojs.ObjectID(req.params.id) })
      // Specify that we want to populate the retrieved articles with any associated notes
      .populate("notes")
      .then(function(dbArticle) {
        // If able to successfully find and associate all Articles and Notes, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

  // Route for saving a Note
  app.post("/api/notes", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        res.json(dbNote);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Delete One from the DB
  // app.get("/delete/:id", function(req, res) {
  // Remove a note using the objectID
  //   db.notes.remove(
  //     {
  //       _id: mongojs.ObjectID(req.params.id)
  //     },
  //     function(error, removed) {
  //       // Log any errors from mongojs
  //       if (error) {
  //         console.log(error);
  //         res.send(error);
  //       }
  //       else {
  //         // Otherwise, send the mongojs response to the browser
  //         // This will fire off the success function of the ajax request
  //         console.log(removed);
  //         res.send(removed);
  //       }
  //     }
  //   );
  // });

  // Delete a note
  app.delete("/note/:id", function(req, res) {
    db.Note.findByIdAndRemove({ _id: req.params.id })
      .then(function(dbNote) {
        console.log("deleted");

        // Clean up article removing note
        return db.Article.findOneAndUpdate(
          { notes: req.params.id },
          { $pull: { notes: req.params.id } }
        );
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        console.log("deleted in article");
        console.log(dbArticle);
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        console.log("error");
        res.json(err);
      });
  });

  // Clear DB
  app.get("/clear", function(req, res) {
    console.log("In clear API");
    // Remove a note using the objectID
    db.Article.deleteMany(function(error, removed) {
      // Log any errors from mongojs
      if (error) {
        console.log(error);
        res.send(error);
      } else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(removed);
        // res.send(removed);
        res.redirect("/");
      }
    });
  });
};
