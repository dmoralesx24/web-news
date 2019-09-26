// for setting up the server and our mongo database 
const express = require('express');
const logger = require("morgan");
const mongoose = require('mongoose');
const exphbs = require("express-handlebars");

// the tools I need for scraping
const axios = require('axios');
const cheerio = require('cheerio');

// requiring all the database models created 
const db = require('./models');

const PORT = 3000;

// initializing express
const app = express();

// configure middleware

// Using morgan logger for logging requests
app.use(logger('dev'));
// parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// making a public static folder 
app.use(express.static('public'));

// initializing handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// connecting to the database
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

app.get("/", function(req, res) {
    res.render("index");
})

// this will be the get route for the scraping of the New York times website
app.get("/scrape", function(req, res) {
    // first I make an axios call to grab the html website
    axios.get("https://www.nytimes.com/topic/organization/the-new-york-times").then(function(response) {
        // load the response into the cheerio and save it
        const $ = cheerio.load(response.data);

        // now I'm grabbing every h2 element within the class of story-meta 
        $(".story-meta").each(function(i, element) {
            // save an empty results object
            const results = {};

            // add the title and story of every link and save them as properties to the result object
            results.link = $(this).parent("a").attr("href");
            results.title = $(this).children("h2").text();
            results.body = $(this).children("p").text();

            // create a new article using the results object that was built from scraping
            db.Article.create(results).then(function(dbArticle) {
                // viewing the added results into the console
                console.log(dbArticle);
            }).catch(function(err) {
                console.log(err);
            });
        });
    });
});

// this route is for getting all of the articles from the db
app.get("/articles", function(req, res) {
    // grabbing every document in the articles collection
    db.Article.find({}).then(function(dbArticle) {
        // if this was successful in finding the articles then send them back to client
        res.json(dbArticle);
    }).catch(function(err) {
        // if an error occurred then send that back to the client
        res.json(err);
    });
});

// A route for grabbing a specific article by the id and let them save that specific article
app.get("/articles/:id", function(req, res) {
    // using id passed in its parameter prepare a query that find the matching one
    db.Article.findOne({ _id: req.params.id }).then()
})

// starting the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
})

