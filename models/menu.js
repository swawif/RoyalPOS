var mongoose = require('mongoose');

//Schema Setup
var MenuSchema = new mongoose.Schema({
    name: {type:String, lowercase: true},
    emoji: String,
    color: String,
    stock: Number
});

module.exports = mongoose.model("Menu", MenuSchema);