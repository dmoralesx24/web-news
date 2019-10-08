const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SavedArticleSchema = new Schema({
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
    // note is an object that stores a Note id 
    // the ref property will link the objectID to the Note model
    // which will allow me to populate the article with an associated Note
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    },

});

// using mongoose model method will create our model and schema above
const SavedArticle = mongoose.model("SavedArticle", SavedArticleSchema);

// now export this model
module.exports = SavedArticle;