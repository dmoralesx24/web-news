const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    // title for article
    title: {
        type: String,
        required: true,
    },
    // link that the article comes from in a string
    link: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
});

// using mongoose model method will create our model from the schema above
const Article = mongoose.model("Article", ArticleSchema);

// now exporting this model
module.exports = Article;