// dotenv for reading .env file and using process.env values
require("dotenv").config();

// Express server
var express = require("express");

// Express handlebars
var exphbs = require("express-handlebars");

// Use morgan for loggin
var logger = require("morgan");

// Use mongoose to put a RDMS front-end on MongoDB
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");

// Cheerio allows for scrping
var cheerio = require("cheerio");

// MongoDB models
var db = require("./models");

// Set up server - Initialize Express
var app = express();
var PORT = process.env.PORT || 3000;

// Middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI);
} else {
  // Connect to the Mongo DB
  mongoose.connect("mongodb://localhost/mongoHeadlines", {
    useNewUrlParser: true
  });
}

// Routes

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

module.exports = app;
