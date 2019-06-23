var mongoose = require('mongoose');

//Schema Setup
var OrderSchema = new mongoose.Schema({
    custName: String,
    orderType: String,
    phoneNum: Number,
    isBuying: Boolean,
    orderDate: Date,
    orderCode: String,
    orderStatus: String,
    orderDetail: Array
});

module.exports = mongoose.model("Order", OrderSchema);