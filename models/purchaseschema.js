var mongoose = require('mongoose');

//Schema Setup
var purchaseschemaSchema = new mongoose.Schema({
    name: {type:String, lowercase: true},
    price: Number
});

module.exports = mongoose.model("PurchaseSchema", purchaseschemaSchema);