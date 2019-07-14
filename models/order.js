var mongoose = require('mongoose');

//Schema Setup
var OrderSchema = new mongoose.Schema({
    name: String, // Name Customer, formerly custName
    type: String,// Skema Harga (20gros, dll), formerly orderType, linked to orderSchema
    phoneNum: Number, // No Telp, formerly phoneNum
    // isBuying: Boolean,// Pembelian atau Penjualan
    date: Date,  // Estimasi tanggal kedatangan, formerly orderDate
    orderCode: String,// Random String, formerly orderCode
    status: Number, // Status pesanan,0 - Menunggu Konfirmasi, 1 - Order di Proses, 2 - Sudah di kirim, 3 - Selesai di edit di /order/:id/edit, formerly orderStatus
    detail: Object  //Detail pesanan, formerly orderDetail
});

module.exports = mongoose.model("Order", OrderSchema);