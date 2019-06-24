var mongoose = require('mongoose');

//Schema Setup
var orderschemaSchema = new mongoose.Schema({
    name: {type:String, lowercase: true},
    price: Number
});

module.exports = mongoose.model("OrderSchema", orderschemaSchema);