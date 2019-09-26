// this index file is to export both mongoose db models
// into a object so that it can be called from any file.

module.exports = {
    Article: require("./Article"),
    Note: require("./Note")
};