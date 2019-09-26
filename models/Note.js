const mongoose = require("mongoose");

// the reference to the Schema contructor
const Schema = mongoose.Schema;

// using this Schema constructor to create a new model object
// similar to a Sequelized model you've created before 
const NoteSchema = new Schema({
    // title of the note which will be a string
    title: String,
    // body of the note will also be a string
    body: String
});

const Note = mongoose.model("Note", NoteSchema);

module.exports = Note;