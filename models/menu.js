var mongoose = require('mongoose');

//Schema Setup
var MenuSchema = new mongoose.Schema({
    name: String,
    emoji: String,
    stock: Number
});

module.exports = mongoose.model("Menu", MenuSchema);