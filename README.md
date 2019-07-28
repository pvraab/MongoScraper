# MongoScraper

# All the News That's Fit to Scrape

### Overview

This is a web app that lets users view and leave comments on the latest news. This app is currently set to scrape the http://www.echojs.com/ website, a JavaScript news accumulator. Axios and Cheerio are used to scrape the news site and then store the results in a MongoDB/Mongoose NoSQL database.

### GitHub Access

- [Source code repository](<https://github.com/pvraab/MongoScraper>)
- [Application URL](<https://pvraab-mongoscraper.herokuapp.com/>) - Hosted on Heroku so we can run the Express server and use the mLab MongoDB addon.

### Helpful Links

- [MongoDB Documentation](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](http://mongoosejs.com/docs/api.html)
- [Cheerio Documentation](https://github.com/cheeriojs/cheerio)

### Detailed Functionality

- MongoScraper is an app that lets users scrape articles from the www.echojs.com website.
- The user can scrape new articles, mark articles to save, delete articles from the database, add notes to articles, and clear the database.
- Each scraped article is saved to the application database. The app scrapes and displays the following information for each article:
  - Headline - the title of the article
  - Summary - a short summary of the article
  - URL - the url to the original article
- Users are able to leave comments on the articles displayed and revisit them later. The comments are saved to the database as well and associated with their articles. Users are able to delete comments left on articles. All stored comments should be visible to every user.
- Each article has a `Save It!` button. When the user clicks it, the article will be flagged to save in the database.
- There is also a `Delete!` button for deleting an article from the database and screen.
- Connect the MongoDB database to mongoose, in the following way:

```js
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
```

- This code connects mongoose to your remote mLab MongoDB database when deployed on Heroku, but otherwise will connect to the local mongoHeadlines database on the local computer instance.
- Whenever you scrape a site for stories, make sure an article isn't already represented in your database before saving it; Do not save any duplicate entries.
- Don't just clear out your database and populate it with scraped articles whenever a user accesses your site.
- If your app deletes stories every time someone visits, your users won't be able to see any comments except the ones that they post.


#### MongoDB Database Setup

- Database called `mongoHeadlines`.
- Use a Articles collection with documents with these fields:
  - **_id**: an auto created field serves as the primary key.
  - **title**: a string.
  - **link**: a string.
- Use a Notes collection with documents with these fields:
  - **_id**: an auto created field serves as the primary key.
  - **body**: a string.

------

### Technologies Used

- JavaScript
- jQuery
- Express
- AJAX
- Cheerio
- Axios
- npm package path
- BootStrap
- HandleBars
- MongoDB/Mongoose
- Heroku
- Node.js
- MVC Design Pattern

### Portfolio

Click on my Portfolio at my portfolio page at: <https://pvraab.github.io/RaabPortfolio/> to see the link to this app.

